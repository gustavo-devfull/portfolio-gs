import React, { useRef, useEffect } from 'react'
import { Tag } from 'primereact/tag'
import gsap from 'gsap'
import type { Project } from '@/types'

interface FeaturedProjectCardProps {
  project: Project
  index?: number
}

export const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({ project }) => {
  const lang = localStorage.getItem('language') || 'pt'
  const title = project.title[lang as 'pt' | 'en'] || project.title.pt
  const description = project.description[lang as 'pt' | 'en'] || project.description.pt

  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const techTagsRef = useRef<(HTMLDivElement | null)[]>([])

  const categoryColors: Record<string, { bg: string; color: string }> = {
    web: { bg: 'var(--color-bg)', color: 'var(--color-blue)' },
    system: { bg: 'var(--color-bg)', color: 'var(--color-blue)' },
    dashboard: { bg: 'var(--color-bg)', color: 'var(--color-blue)' },
    mobile: { bg: 'var(--color-bg)', color: 'var(--color-blue)' },
  }

  const categoryStyle = categoryColors[project.category] || categoryColors.web

  useEffect(() => {
    if (!cardRef.current) return

    const handleCardHover = () => {
      gsap.to(cardRef.current, {
        y: -8,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleCardHoverOut = () => {
      gsap.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    cardRef.current.addEventListener('mouseenter', handleCardHover)
    cardRef.current.addEventListener('mouseleave', handleCardHoverOut)

    return () => {
      cardRef.current?.removeEventListener('mouseenter', handleCardHover)
      cardRef.current?.removeEventListener('mouseleave', handleCardHoverOut)
    }
  }, [])

  useEffect(() => {
    if (!imageRef.current) return

    const handleImageHover = () => {
      gsap.to(imageRef.current, {
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out'
      })
    }

    const handleImageHoverOut = () => {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      })
    }

    imageRef.current.addEventListener('mouseenter', handleImageHover)
    imageRef.current.addEventListener('mouseleave', handleImageHoverOut)

    return () => {
      imageRef.current?.removeEventListener('mouseenter', handleImageHover)
      imageRef.current?.removeEventListener('mouseleave', handleImageHoverOut)
    }
  }, [])

  useEffect(() => {
    if (!titleRef.current) return

    const handleTitleHover = () => {
      gsap.to(titleRef.current, {
        color: 'var(--color-blue)',
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleTitleHoverOut = () => {
      gsap.to(titleRef.current, {
        color: 'var(--color-text)',
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    titleRef.current.addEventListener('mouseenter', handleTitleHover)
    titleRef.current.addEventListener('mouseleave', handleTitleHoverOut)

    return () => {
      titleRef.current?.removeEventListener('mouseenter', handleTitleHover)
      titleRef.current?.removeEventListener('mouseleave', handleTitleHoverOut)
    }
  }, [])

  useEffect(() => {
    techTagsRef.current.forEach((tag, index) => {
      if (!tag) return

      gsap.fromTo(
        tag,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, delay: 0.2 + index * 0.05, ease: 'back.out' }
      )

      const handleTagHover = () => {
        gsap.to(tag, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
      }

      const handleTagHoverOut = () => {
        gsap.to(tag, { scale: 1, duration: 0.3, ease: 'power2.out' })
      }

      tag.addEventListener('mouseenter', handleTagHover)
      tag.addEventListener('mouseleave', handleTagHoverOut)

      return () => {
        tag.removeEventListener('mouseenter', handleTagHover)
        tag.removeEventListener('mouseleave', handleTagHoverOut)
      }
    })
  }, [])

  return (
    <div ref={cardRef}>
      <a href={`/project/${project.slug}`} style={{ textDecoration: 'none' }}>
        <div
          style={{
            background: 'var(--color-bg)',
            border: `1px solid var(--color-blue)`,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2.5rem',
            alignItems: 'center',
            padding: '2.5rem',
            height: '100%',
            overflow: 'hidden',
            cursor: 'pointer',
            borderRadius: '0'
          }}
        >
          {/* Left Content */}
          <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Category Badge */}
            <div>
              <Tag
                value={project.category.toUpperCase()}
                style={{
                  background: categoryStyle.bg,
                  color: categoryStyle.color,
                  fontSize: '0.65rem',
                  fontWeight: 400,
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--color-blue)',
                  fontFamily: 'Syncopate, sans-serif',
                  letterSpacing: '0.05em'
                }}
              />
            </div>

            {/* Title */}
            <h3
              ref={titleRef}
              style={{
                fontSize: '1.75rem',
                fontWeight: 400,
                color: 'var(--color-text)',
                margin: 0,
                cursor: 'pointer',
                fontFamily: 'Syncopate, sans-serif',
                letterSpacing: '0.05em',
                lineHeight: 1.2
              }}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-light)',
                lineHeight: 1.6,
                margin: 0
              }}
            >
              {description}
            </p>

            {/* Tech Stack */}
            <div
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
            >
              {project.techs.slice(0, 4).map((tech, techIndex) => (
                <div
                  key={tech}
                  ref={(el) => {
                    if (el) techTagsRef.current[techIndex] = el
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <Tag
                    value={tech}
                    style={{
                      background: 'transparent',
                      color: 'var(--color-blue)',
                      fontSize: '0.75rem',
                      fontWeight: 400,
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0',
                      border: '1px solid var(--color-blue)',
                      fontFamily: 'Syncopate, sans-serif',
                          letterSpacing: '0.03em'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '1rem',
                flexWrap: 'wrap'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {project.liveUrl && (
                <button
                  onClick={() => window.open(project.liveUrl, '_blank')}
                  style={{
                    flex: 1,
                    minWidth: '120px',
                    padding: '0.75rem 1.5rem',
                    background: 'var(--color-blue)',
                    color: 'var(--color-black)',
                    fontWeight: 400,
                    borderRadius: '0',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid var(--color-blue)',
                    transition: 'all 0.3s',
                    fontFamily: 'Syncopate, sans-serif',
                      letterSpacing: '0.03em'
                  }}
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
                  }}
                >
                  Explorar
                </button>
              )}
              {project.repoUrl && (
                <button
                  onClick={() => window.open(project.repoUrl, '_blank')}
                  style={{
                    flex: 1,
                    minWidth: '120px',
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    color: 'var(--color-blue)',
                    fontWeight: 400,
                    borderRadius: '0',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid var(--color-blue)',
                    transition: 'all 0.3s',
                    fontFamily: 'Syncopate, sans-serif',
                      letterSpacing: '0.03em'
                  }}
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
                  }}
                >
                  Código
                </button>
              )}
            </div>
          </div>

          {/* Right Image */}
          <div style={{ position: 'relative', height: '100%', minHeight: '400px' }}>
            <img
              ref={imageRef}
              alt={title}
              src={project.coverImage || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23333" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-family="system-ui" font-size="16"%3EImage Not Available%3C/text%3E%3C/svg%3E'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '0'
              }}
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23333" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-family="system-ui" font-size="16"%3EImage Not Available%3C/text%3E%3C/svg%3E'
              }}
            />
          </div>
        </div>
      </a>
    </div>
  )
}
