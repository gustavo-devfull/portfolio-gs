import type { Handler } from '@netlify/functions'
import { Client } from 'basic-ftp'
import { Readable } from 'stream'

interface UploadPayload {
  contentType?: string
  data?: string
  fileName: string
}

const getBodyText = (body: string, isBase64Encoded?: boolean) => {
  return isBase64Encoded ? Buffer.from(body, 'base64').toString('utf8') : body
}

const sanitizeFileName = (fileName: string) => {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '-')
}

const resolveFtpBasePath = (basePath: string, baseUrl: string) => {
  if (basePath !== '/public_html') {
    return basePath
  }

  try {
    const publicPath = new URL(baseUrl).pathname.replace(/\/$/, '')
    return publicPath ? `${basePath}${publicPath}` : basePath
  } catch {
    return basePath
  }
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
  const basePath =
    process.env.FTP_BASE_PATH ||
    process.env.VITE_FTP_BASE_PATH ||
    '/public_html/portfolio/images'
  const baseUrl =
    process.env.FTP_BASE_URL ||
    process.env.VITE_FTP_BASE_URL ||
    'https://example.com/portfolio/images'
  const uploadPath = resolveFtpBasePath(basePath, baseUrl)
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

    const payload = JSON.parse(getBodyText(event.body, event.isBase64Encoded)) as UploadPayload
    const data = payload.data?.replace(/^data:[^;]+;base64,/, '')

    if (!payload.fileName || !data) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid upload payload' }),
      }
    }

    const buffer = Buffer.from(data, 'base64')
    const safeFileName = sanitizeFileName(payload.fileName)

    // Generate unique filename
    const timestamp = Date.now()
    const ext = safeFileName.split('.').pop() || 'jpg'
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
    await client.ensureDir(uploadPath)
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
