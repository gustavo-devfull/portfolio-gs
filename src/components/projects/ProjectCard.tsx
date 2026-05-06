import React, { useRef, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import gsap from 'gsap'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index?: number
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const lang = localStorage.getItem('language') || 'pt'
  const title = project.title[lang as 'pt' | 'en'] || project.title.pt
  const description = project.description[lang as 'pt' | 'en'] || project.description.pt

  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const categoryBadgeRef = useRef<HTMLDivElement>(null)
  const featuredBadgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)
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

    // Card hover lift effect
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

    // Image zoom on hover
    const handleImageHover = () => {
      gsap.to(imageRef.current, {
        scale: 1.08,
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
    if (!categoryBadgeRef.current) return

    // Category badge fade-in scale
    gsap.fromTo(
      categoryBadgeRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: 'back.out' }
    )
  }, [])

  useEffect(() => {
    if (!featuredBadgeRef.current) return

    // Featured badge rotation animation
    gsap.fromTo(
      featuredBadgeRef.current,
      { rotate: -45, opacity: 0 },
      { rotate: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'back.out' }
    )
  }, [])

  useEffect(() => {
    if (!titleRef.current) return

    // Title hover color change
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
    // Tech tags stagger animation
    techTagsRef.current.forEach((tag, index) => {
      if (!tag) return

      gsap.fromTo(
        tag,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, delay: 0.2 + index * 0.05, ease: 'back.out' }
      )

      // Tech tag hover effect
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

  useEffect(() => {
    if (!arrowRef.current) return

    // Arrow infinite bounce animation
    const tl = gsap.timeline({ repeat: -1 })
    tl.to(arrowRef.current, {
      x: 4,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    tl.to(arrowRef.current, {
      x: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    })
  }, [])

  return (
    <div ref={cardRef}>
      <a href={`/project/${project.slug}`} style={{ textDecoration: 'none' }}>
        <Card
          style={{
            background: 'var(--color-bg)',
            border: `1px solid var(--color-blue)`,
            height: '100%',
            overflow: 'hidden',
            cursor: 'pointer',
            borderRadius: '0'
          }}
          className="hover:shadow-lg transition-all duration-300"
        >
          {/* Image Container */}
          <div style={{ position: 'relative', height: '14rem', overflow: 'hidden' }}>
            {/* Image */}
            <img
              ref={imageRef}
              alt={title}
              src={project.coverImage || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-family="system-ui" font-size="16"%3EImage Not Available%3C/text%3E%3C/svg%3E'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-family="system-ui" font-size="16"%3EImage Not Available%3C/text%3E%3C/svg%3E'
              }}
            />

            {/* Category Badge */}
            <div
              ref={categoryBadgeRef}
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                zIndex: 10
              }}
            >
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

            {/* Featured Badge */}
            {project.featured && (
              <div
                ref={featuredBadgeRef}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  zIndex: 10
                }}
              >
                <Tag
                  value="⭐ Featured"
                  style={{
                    background: 'var(--color-blue)',
                    color: 'var(--color-black)',
                    fontSize: '0.65rem',
                    fontWeight: 400,
                    padding: '0.5rem 0.75rem',
                    fontFamily: 'Syncopate, sans-serif',
                    border: '1px solid var(--color-blue)',
                      letterSpacing: '0.03em'
                  }}
                />
              </div>
            )}
          </div>

          {/* Content Container */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Title */}
            <h3
              ref={titleRef}
              style={{
                fontSize: '1.125rem',
                fontWeight: 400,
                color: 'var(--color-text)',
                margin: 0,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                cursor: 'pointer',
                fontFamily: 'Syncopate, sans-serif',
                letterSpacing: '0.05em'
              }}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-light)',
                lineHeight: 1.5,
                margin: 0,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2
              }}
            >
              {description}
            </p>

            {/* Tech Stack */}
            <div
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem' }}
            >
              {project.techs.slice(0, 3).map((tech, techIndex) => (
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
              {project.techs.length > 3 && (
                <div
                  ref={(el) => {
                    if (el) techTagsRef.current[3] = el
                  }}
                >
                  <Tag
                    value={`+${project.techs.length - 3} more`}
                    style={{
                      background: 'transparent',
                      color: 'var(--color-text-light)',
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
              )}
            </div>

            {/* Footer Actions */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-blue)'
              }}
            >
              {/* View Details Button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    color: 'var(--color-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontFamily: 'Syncopate, sans-serif',
                      letterSpacing: '0.05em'
                  }}
                >
                  Ver Detalhes
                  <span ref={arrowRef}>
                    →
                  </span>
                </span>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {project.liveUrl && (
                  <button
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
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
                      padding: '0.5rem 0.75rem',
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
          </div>
        </Card>
      </a>
    </div>
  )
}
