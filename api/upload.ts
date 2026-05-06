import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client } from 'basic-ftp'
import { Readable } from 'stream'

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ftpHost = process.env.VITE_FTP_HOST
  const ftpUser = process.env.VITE_FTP_USER
  const ftpPass = process.env.VITE_FTP_PASS
  const basePath = process.env.VITE_FTP_BASE_PATH || '/public_html/portfolio/images'
  const baseUrl = process.env.VITE_FTP_BASE_URL || 'https://example.com/portfolio/images'

  if (!ftpHost || !ftpUser || !ftpPass) {
    return res.status(500).json({ error: 'FTP configuration missing' })
  }

  try {
    if (!req.body) {
      return res.status(400).json({ error: 'No file provided' })
    }

    // req.body should be a Buffer when handling file uploads
    let fileData: Buffer
    let fileName: string

    if (typeof req.body === 'string') {
      // Multipart form data as string
      const contentType = req.headers['content-type'] || ''
      const boundary = contentType.split('boundary=')[1]

      if (!boundary) {
        return res.status(400).json({ error: 'Invalid multipart data' })
      }

      const parts = req.body.split(`--${boundary}`)
      let found = false

      for (const part of parts) {
        if (part.includes('filename=')) {
          const fileMatch = part.match(/filename="([^"]+)"/)
          fileName = fileMatch?.[1] || `file-${Date.now()}`

          const contentMatch = part.match(/\r\n\r\n([\s\S]+)\r\n--/)
          const data = contentMatch?.[1]
          if (data) {
            fileData = Buffer.from(data, 'binary')
            found = true
            break
          }
        }
      }

      if (!found) {
        return res.status(400).json({ error: 'No file data found' })
      }
    } else if (Buffer.isBuffer(req.body)) {
      // Binary buffer
      fileData = req.body
      fileName = `file-${Date.now()}.jpg`
    } else {
      return res.status(400).json({ error: 'Invalid request body' })
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
    const stream = Readable.from([fileData])

    // Upload to FTP
    await client.ensureDir(basePath)
    await client.uploadFrom(stream, `${basePath}/${uniqueFileName}`)
    await client.close()

    const url = `${baseUrl}/${uniqueFileName}`
    return res.status(200).json({ url })
  } catch (error) {
    console.error('FTP upload error:', error)
    const message = error instanceof Error ? error.message : 'Upload failed'
    return res.status(500).json({ error: message })
  }
}
