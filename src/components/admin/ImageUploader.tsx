import React, { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { uploadImageToFtp } from '@/lib/ftp'

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  coverImage: string
  onCoverImageChange: (url: string) => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  coverImage,
  onCoverImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = async (files: FileList) => {
    setUploading(true)
    setError(null)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed')
        continue
      }

      try {
        const url = await uploadImageToFtp(file, (progress) => {
          setUploadProgress(progress.percentage)
        })

        console.log('Upload concluído, URL:', url)
        const newImages = [...images, url]
        console.log('Imagens antes:', images)
        console.log('Imagens depois:', newImages)
        onImagesChange(newImages)
        if (!coverImage) {
          onCoverImageChange(url)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed'
        console.error('Erro no upload:', message)
        setError(message)
      }
    }

    setUploading(false)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const removeImage = (url: string) => {
    const newImages = images.filter((img) => img !== url)
    onImagesChange(newImages)
    if (coverImage === url) {
      onCoverImageChange(newImages[0] || '')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px solid var(--color-blue)' : '2px dashed var(--color-blue)',
          padding: '2rem',
          textAlign: 'center',
          background: dragActive ? 'rgba(255, 215, 0, 0.05)' : 'rgba(255, 215, 0, 0.02)',
          borderRadius: '0',
          transition: 'all 0.3s',
          cursor: 'pointer'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          style={{ display: 'none' }}
        />

        <Upload style={{
          margin: '0 auto 0.75rem',
          width: '2rem',
          height: '2rem',
          color: 'var(--color-blue)'
        }} />
        <p style={{
          marginBottom: '0.5rem',
          fontWeight: 400,
          color: 'var(--color-text)',
          fontFamily: 'Syncopate, sans-serif'
        }}>arraste imagens aqui</p>
        <p style={{
          marginBottom: '1rem',
          fontSize: '0.875rem',
          color: 'var(--color-text-light)',
          fontFamily: 'Syncopate, sans-serif'
        }}>ou clique para procurar</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: 'var(--color-blue)',
            border: '1px solid var(--color-blue)',
            borderRadius: '0',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'Syncopate, sans-serif',
            fontWeight: 400,
            transition: 'all 0.3s',
            opacity: uploading ? 0.6 : 1
          }}
        >
          selecionar imagens
        </button>
      </div>

      {/* Progress */}
      {uploading && (
        <div style={{
          background: 'rgba(255, 215, 0, 0.05)',
          border: '1px solid var(--color-blue)',
          padding: '1rem',
          borderRadius: '0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--color-text)',
            fontFamily: 'Syncopate, sans-serif'
          }}>
            <span>enviando...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div style={{
            height: '0.5rem',
            background: 'var(--color-bg)',
            overflow: 'hidden',
            borderRadius: '0'
          }}>
            <div
              style={{
                height: '100%',
                background: 'var(--color-blue)',
                transition: 'width 0.3s',
                width: `${uploadProgress}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid rgba(255, 0, 0, 0.3)',
          padding: '1rem',
          borderRadius: '0',
          color: '#ff6b6b',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {/* Images Gallery */}
      {images.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{
            fontWeight: 400,
            fontSize: '0.875rem',
            color: 'var(--color-text)',
            fontFamily: 'Syncopate, sans-serif',
            margin: 0
          }}>imagens enviadas ({images.length})</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {images.map((url, index) => (
              <div
                key={url}
                style={{
                  position: 'relative',
                  border: coverImage === url ? '2px solid var(--color-blue)' : '1px solid var(--color-blue)',
                  borderRadius: '0',
                  overflow: 'hidden',
                  background: 'var(--color-bg)',
                  transition: 'all 0.3s'
                }}
              >
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    console.error('Erro ao carregar imagem:', url)
                    e.currentTarget.style.background = '#333'
                    e.currentTarget.src = ''
                  }}
                />
                {coverImage === url && (
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'var(--color-blue)',
                    color: 'var(--color-black)',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.65rem',
                    fontWeight: 400,
                    fontFamily: 'Syncopate, sans-serif',
                    borderRadius: '0'
                  }}>
                    capa
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  padding: '0.5rem',
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}>
                  <button
                    type="button"
                    onClick={() => onCoverImageChange(url)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: coverImage === url ? 'var(--color-blue)' : 'transparent',
                      color: coverImage === url ? 'var(--color-black)' : 'var(--color-blue)',
                      border: '1px solid var(--color-blue)',
                      fontSize: '0.65rem',
                      cursor: 'pointer',
                      fontWeight: 400,
                      fontFamily: 'Syncopate, sans-serif',
                      borderRadius: '0',
                      transition: 'all 0.3s'
                    }}
                  >
                    {coverImage === url ? 'capa' : 'definir capa'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: 'transparent',
                      color: '#ff6b6b',
                      border: '1px solid #ff6b6b',
                      fontSize: '0.65rem',
                      cursor: 'pointer',
                      fontFamily: 'Syncopate, sans-serif',
                      borderRadius: '0',
                      transition: 'all 0.3s'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
