import React, { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const lightboxBackdropRef = useRef<HTMLDivElement>(null)
  const lightboxModalRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<(HTMLButtonElement | null)[]>([])

  if (images.length === 0) {
    return null
  }

  const goToPrevious = () => {
    setSelectedIndex((prev) => {
      if (prev === null) return null
      return prev === 0 ? images.length - 1 : prev - 1
    })
  }

  const goToNext = () => {
    setSelectedIndex((prev) => {
      if (prev === null) return null
      return prev === images.length - 1 ? 0 : prev + 1
    })
  }

  // Gallery images stagger animation
  useEffect(() => {
    if (!galleryRef.current) return

    gsap.fromTo(
      galleryRef.current.querySelectorAll('button'),
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out', stagger: 0.05 }
    )
  }, [])

  // Image hover effect
  useEffect(() => {
    imagesRef.current.forEach((img) => {
      if (!img) return

      const handleImageHover = () => {
        gsap.to(img, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
      }

      const handleImageHoverOut = () => {
        gsap.to(img, { scale: 1, duration: 0.3, ease: 'power2.out' })
      }

      img.addEventListener('mouseenter', handleImageHover)
      img.addEventListener('mouseleave', handleImageHoverOut)

      return () => {
        img.removeEventListener('mouseenter', handleImageHover)
        img.removeEventListener('mouseleave', handleImageHoverOut)
      }
    })
  }, [])

  // Lightbox animations
  useEffect(() => {
    if (selectedIndex === null) {
      // Hide lightbox
      if (lightboxBackdropRef.current) {
        gsap.to(lightboxBackdropRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
      if (lightboxModalRef.current) {
        gsap.to(lightboxModalRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    } else {
      // Show lightbox
      if (lightboxBackdropRef.current) {
        gsap.fromTo(
          lightboxBackdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
      }
      if (lightboxModalRef.current) {
        gsap.fromTo(
          lightboxModalRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out' }
        )
      }
    }
  }, [selectedIndex])

  return (
    <>
      <div
        ref={galleryRef}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {images.map((image, index) => (
          <button
            key={index}
            ref={(el) => {
              if (el) imagesRef.current[index] = el
            }}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-video overflow-hidden rounded-lg bg-dark-surface cursor-pointer"
          >
            <img
              src={image}
              alt={`Gallery ${index + 1}`}
              className="h-full w-full object-cover transition-transform"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all">
              <div className="text-white text-sm font-medium opacity-0 group-hover:opacity-100">
                View
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <>
          <div
            ref={lightboxBackdropRef}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          <div
            ref={lightboxModalRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute right-4 top-4 text-white hover:text-gray-300 cursor-pointer"
            >
              <X size={24} />
            </button>

            <button
              onClick={goToPrevious}
              className="absolute left-4 text-white hover:text-gray-300 cursor-pointer"
            >
              <ChevronLeft size={32} />
            </button>

            <img
              src={images[selectedIndex]}
              alt={`Full view ${selectedIndex + 1}`}
              className="max-h-screen max-w-4xl rounded-lg object-contain"
            />

            <button
              onClick={goToNext}
              className="absolute right-4 text-white hover:text-gray-300 cursor-pointer"
            >
              <ChevronRight size={32} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </>
      )}
    </>
  )
}
