import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client } from 'basic-ftp'
import { Readable } from 'stream'

interface UploadPayload {
  contentType?: string
  data?: string
  fileName: string
}

const getBodyText = (body: unknown) => {
  if (Buffer.isBuffer(body)) {
    return body.toString('utf8')
  }

  if (typeof body === 'string') {
    return body
  }

  return JSON.stringify(body)
}

const sanitizeFileName = (fileName: string) => {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '-')
}

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
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
  const secure = (process.env.FTP_SECURE || process.env.VITE_FTP_SECURE) === 'true'

  if (!ftpHost || !ftpUser || !ftpPass) {
    return res.status(500).json({ error: 'FTP configuration missing' })
  }

  try {
    const payload = JSON.parse(getBodyText(req.body)) as UploadPayload
    const data = payload.data?.replace(/^data:[^;]+;base64,/, '')

    if (!payload.fileName || !data) {
      return res.status(400).json({ error: 'Invalid upload payload' })
    }

    const buffer = Buffer.from(data, 'base64')
    const safeFileName = sanitizeFileName(payload.fileName)
    const timestamp = Date.now()
    const ext = safeFileName.split('.').pop() || 'jpg'
    const uniqueFileName = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${ext}`

    const client = new Client()
    await client.access({
      host: ftpHost,
      user: ftpUser,
      password: ftpPass,
      secure,
    })

    const stream = Readable.from(buffer)

    await client.ensureDir(basePath)
    await client.uploadFrom(stream, uniqueFileName)
    await client.close()

    return res.status(200).json({ url: `${baseUrl}/${uniqueFileName}` })
  } catch (error) {
    console.error('FTP upload error:', error)
    const message = error instanceof Error ? error.message : 'Upload failed'
    return res.status(500).json({ error: message })
  }
}
