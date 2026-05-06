export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

interface UploadResponse {
  url: string
  error?: string
}

// Mock upload for development
const mockUpload = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // First, simulate progress
    let currentProgress = 0
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 25
      if (currentProgress >= 90) currentProgress = 90

      if (onProgress) {
        onProgress({
          loaded: currentProgress,
          total: 100,
          percentage: Math.round(currentProgress),
        })
      }
    }, 150)

    // Then read the file as data URL
    const reader = new FileReader()

    reader.onload = () => {
      clearInterval(progressInterval)
      if (onProgress) {
        onProgress({
          loaded: 100,
          total: 100,
          percentage: 100,
        })
      }
      const dataUrl = reader.result as string
      // Small delay to ensure React state updates properly
      setTimeout(() => {
        resolve(dataUrl)
      }, 300)
    }

    reader.onerror = () => {
      clearInterval(progressInterval)
      reject(new Error('Failed to read file'))
    }

    try {
      reader.readAsDataURL(file)
    } catch (err) {
      clearInterval(progressInterval)
      reject(err)
    }
  })
}

export const uploadImageToFtp = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    // Use mock in development, real endpoint in production
    if (import.meta.env.DEV) {
      return await mockUpload(file, onProgress)
    }

    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round(percentComplete),
          })
        }
      })
    }

    return new Promise((resolve, reject) => {
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response: UploadResponse = JSON.parse(xhr.responseText)
            if (response.error) {
              reject(new Error(response.error))
            } else {
              resolve(response.url)
            }
          } catch (e) {
            reject(new Error('Invalid response from server'))
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'))
      })

      // Use Netlify or Vercel functions endpoint
      const endpoint = import.meta.env.VITE_UPLOAD_ENDPOINT || '/.netlify/functions/upload-ftp'
      xhr.open('POST', endpoint, true)
      xhr.send(formData)
    })
  } catch (error) {
    console.error('FTP upload error:', error)
    throw error
  }
}

export const deleteImageFromFtp = async (url: string): Promise<void> => {
  try {
    const response = await fetch('/.netlify/functions/delete-ftp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error('Failed to delete image')
    }
  } catch (error) {
    console.error('FTP delete error:', error)
    throw error
  }
}
