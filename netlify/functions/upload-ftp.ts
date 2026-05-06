import { Handler } from '@netlify/functions'
import { Client } from 'basic-ftp'
import { Readable } from 'stream'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const ftpHost = process.env.VITE_FTP_HOST
  const ftpUser = process.env.VITE_FTP_USER
  const ftpPass = process.env.VITE_FTP_PASS
  const basePath = process.env.VITE_FTP_BASE_PATH || '/public_html/portfolio/images'
  const baseUrl = process.env.VITE_FTP_BASE_URL || 'https://example.com/portfolio/images'

  if (!ftpHost || !ftpUser || !ftpPass) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'FTP configuration missing' }),
    }
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file provided' }),
      }
    }

    // Parse multipart form data
    const boundary = event.headers['content-type']?.split('boundary=')[1]
    if (!boundary) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid multipart data' }),
      }
    }

    // Extract file from multipart data
    const parts = event.body.split(`--${boundary}`)
    let fileData: string | null = null
    let fileName: string | null = null

    for (const part of parts) {
      if (part.includes('filename=')) {
        const fileMatch = part.match(/filename="([^"]+)"/)
        fileName = fileMatch?.[1] || `file-${Date.now()}`

        // Extract binary data (simplified - in production use a proper multipart parser)
        const contentMatch = part.match(/\r\n\r\n([\s\S]+)\r\n--/)
        fileData = contentMatch?.[1] || null
      }
    }

    if (!fileName || !fileData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file data found' }),
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const ext = fileName.split('.').pop() || 'jpg'
    const uniqueFileName = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${ext}`

    // Connect to FTP
    const client = new Client()
    await client.access({
      host: ftpHost,
      user: ftpUser,
      password: ftpPass,
      secure: true,
    })

    // Create stream from file data
    const stream = Readable.from([Buffer.from(fileData, 'binary')])

    // Upload to FTP
    await client.ensureDir(basePath)
    await client.uploadFrom(stream, `${basePath}/${uniqueFileName}`)
    await client.close()

    const url = `${baseUrl}/${uniqueFileName}`

    return {
      statusCode: 200,
      body: JSON.stringify({ url }),
    }
  } catch (error) {
    console.error('FTP upload error:', error)
    const message = error instanceof Error ? error.message : 'Upload failed'
    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    }
  }
}
