import type { Handler } from '@netlify/functions'
import { Client } from 'basic-ftp'
import { Readable } from 'stream'
import Busboy from 'busboy'

interface ParsedUpload {
  buffer: Buffer
  fileName: string
}

const parseMultipartUpload = (
  body: string,
  headers: Record<string, string | undefined>,
  isBase64Encoded?: boolean
): Promise<ParsedUpload> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let fileName = `file-${Date.now()}`
    let hasFile = false

    const contentType = headers['content-type'] || headers['Content-Type']
    if (!contentType) {
      reject(new Error('Missing content type'))
      return
    }

    const busboy = Busboy({
      headers: {
        'content-type': contentType,
      },
    })

    busboy.on('file', (_name, file, info) => {
      hasFile = true
      fileName = info.filename || fileName

      file.on('data', (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      })

      file.on('error', reject)
    })

    busboy.on('error', reject)
    busboy.on('finish', () => {
      if (!hasFile || chunks.length === 0) {
        reject(new Error('No file data found'))
        return
      }

      resolve({
        buffer: Buffer.concat(chunks),
        fileName,
      })
    })

    busboy.end(Buffer.from(body, isBase64Encoded ? 'base64' : 'binary'))
  })
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const ftpHost = process.env.FTP_HOST || process.env.VITE_FTP_HOST
  const ftpUser = process.env.FTP_USER || process.env.VITE_FTP_USER
  const ftpPass = process.env.FTP_PASS || process.env.VITE_FTP_PASS
  const basePath = process.env.VITE_FTP_BASE_PATH || '/public_html/portfolio/images'
  const baseUrl = process.env.VITE_FTP_BASE_URL || 'https://example.com/portfolio/images'
  const secure = (process.env.FTP_SECURE || process.env.VITE_FTP_SECURE) === 'true'

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

    const { buffer, fileName } = await parseMultipartUpload(
      event.body,
      event.headers,
      event.isBase64Encoded
    )

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
      secure,
    })

    // Create stream from file data
    const stream = Readable.from(buffer)

    // Upload to FTP
    await client.ensureDir(basePath)
    await client.uploadFrom(stream, uniqueFileName)
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
