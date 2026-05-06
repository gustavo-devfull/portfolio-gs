import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client } from 'basic-ftp'
import { Readable } from 'stream'
import Busboy from 'busboy'

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
    console.error('FTP config missing')
    return res.status(500).json({ error: 'FTP configuration missing' })
  }

  try {
    return await new Promise((resolve) => {
      const bb = Busboy({ headers: req.headers as any })
      let fileData: Buffer | null = null
      let fileName: string | null = null

      bb.on('file', (fieldname: string, file: any, info: any) => {
        fileName = info.filename
        const chunks: Buffer[] = []

        file.on('data', (data: Buffer) => {
          chunks.push(data)
        })

        file.on('end', () => {
          fileData = Buffer.concat(chunks)
        })

        file.on('error', (error: Error) => {
          console.error('File upload error:', error)
          resolve(res.status(400).json({ error: 'File upload failed' }))
        })
      })

      bb.on('error', (error: Error) => {
        console.error('Busboy error:', error)
        resolve(res.status(400).json({ error: 'Multipart parsing failed' }))
      })

      bb.on('close', async () => {
        if (!fileData || !fileName) {
          console.error('No file data received')
          return resolve(res.status(400).json({ error: 'No file provided' }))
        }

        try {
          console.log('File received:', fileName, 'size:', fileData.length)

          // Generate unique filename
          const timestamp = Date.now()
          const ext = fileName.split('.').pop() || 'jpg'
          const uniqueFileName = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${ext}`
          console.log('Generated filename:', uniqueFileName)

          // Connect to FTP
          console.log('Connecting to FTP:', { host: ftpHost, user: ftpUser })
          const client = new Client()
          await client.access({
            host: ftpHost,
            user: ftpUser,
            password: ftpPass,
            secure: true,
          })
          console.log('FTP connection successful')

          // Create stream from file data
          const stream = Readable.from([fileData])

          // Upload to FTP
          console.log('Ensuring directory:', basePath)
          await client.ensureDir(basePath)
          console.log('Uploading file to:', `${basePath}/${uniqueFileName}`)
          await client.uploadFrom(stream, `${basePath}/${uniqueFileName}`)
          console.log('Upload completed, closing connection')
          await client.close()

          const url = `${baseUrl}/${uniqueFileName}`
          console.log('Upload successful:', url)
          resolve(res.status(200).json({ url }))
        } catch (error) {
          console.error('FTP upload error:', error)
          const message = error instanceof Error ? error.message : 'Upload failed'
          resolve(res.status(500).json({ error: message }))
        }
      })

      bb.write(req.body as Buffer)
      bb.end()
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
