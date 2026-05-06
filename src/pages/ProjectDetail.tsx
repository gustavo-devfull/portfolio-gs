import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Button } from 'primereact/button'
import { ExternalLink, Code } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '@/hooks/useTranslation'
import { useProjects } from '@/hooks/useProjects'
import type { Project } from '@/types'

gsap.registerPlugin(ScrollTrigger)

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t, lang } = useTranslation()
  const { fetchProjectBySlug, loading } = useProjects()
  const [project, setProject] = useState<Project | null>(null)
  const breadcrumbRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (slug) {
      fetchProjectBySlug(slug).then(setProject)
      window.scrollTo(0, 0)
    }
  }, [slug])

  // Breadcrumb animation
  useEffect(() => {
    if (breadcrumbRef.current) {
      gsap.fromTo(
        breadcrumbRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
    }
  }, [project])

  // Hero section animation
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
    }
  }, [project])

  // Sections scroll trigger animation
  useEffect(() => {
    sectionRefs.current.forEach((section, index) => {
      if (!section) return

      gsap.fromTo(
        section,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [project])

  // Gallery images stagger animation
  useEffect(() => {
    if (!galleryRef.current) return

    const images = galleryRef.current.querySelectorAll('img')
    if (images.length === 0) return

    gsap.fromTo(
      images,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [project])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <ProgressSpinner />
      </div>
    )
  }

  if (!project) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 400,
          marginBottom: '1.5rem',
          color: 'var(--color-text)'
        }}>
          {t('common.notFound')}
        </h1>
        <a href="/" style={{ textDecoration: 'none' }}>
          <Button
            label={t('projects.backToProjects')}
            style={{
              background: 'var(--color-blue)',
              color: 'var(--color-white)',
              border: 'none',
              padding: '0.75rem 2rem',
              fontWeight: 400,
              cursor: 'pointer'
            }}
          />
        </a>
      </div>
    )
  }

  const title = project.title[lang as 'pt' | 'en'] || project.title.pt
  const description = project.description[lang as 'pt' | 'en'] || project.description.pt
  const content = {
    challenge: project.content.challenge[lang as 'pt' | 'en'] || project.content.challenge.pt,
    solution: project.content.solution[lang as 'pt' | 'en'] || project.content.solution.pt,
    result: project.content.result[lang as 'pt' | 'en'] || project.content.result.pt,
  }

  return (
    <main>
      {/* Breadcrumb */}
      <div
        ref={breadcrumbRef}
        style={{
          width: '100%',
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--color-blue)',
          background: 'var(--color-bg)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <a href="/#projects" style={{ textDecoration: 'none' }}>
            <Button
              icon="pi pi-chevron-left"
              label={t('projects.backToProjects')}
              className="p-button-text"
              style={{
                color: 'var(--color-text)',
                fontWeight: 400,
                cursor: 'pointer'
              }}
            />
          </a>
        </div>
      </div>

      {/* Hero Image */}
      {project.coverImage && (
        <div
          ref={heroRef}
          style={{
            width: '100%',
            paddingTop: '4rem',
            paddingBottom: '4rem',
            background: 'var(--color-bg)',
            borderBottom: '1px solid var(--color-blue)'
          }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div
              style={{
                borderRadius: '0.5rem',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
              }}
            >
              <img
                alt={title}
                src={project.coverImage}
                style={{
                  width: '100%',
                  height: '24rem',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--color-border-light)'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{
        width: '100%',
        paddingTop: '4rem',
        paddingBottom: '4rem',
        background: 'var(--color-bg)'
      }}>
        <div className="max-w-6xl mx-auto px-4">
          <div
          >
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 400,
              marginBottom: '1.5rem',
              color: 'var(--color-text)'
            }}>
              {title}
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: 'var(--color-text-light)',
              marginBottom: '3rem',
              maxWidth: '48rem',
              lineHeight: 1.6
            }}>
              {description}
            </p>
          </div>

          {/* Links */}
          {(project.liveUrl || project.repoUrl) && (
            <div
              style={{
                marginBottom: '4rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              {project.liveUrl && (
                <div
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 2rem',
                      background: 'var(--color-blue)',
                      color: 'var(--color-black)',
                      fontWeight: 400,
                      borderRadius: '0',
                      textDecoration: 'none',
                      border: '1px solid var(--color-blue)',
                      cursor: 'pointer'
                    }}
                  >
                    <ExternalLink size={20} />
                    {t('projects.viewLive')}
                  </a>
                </div>
              )}
              {project.repoUrl && (
                <div>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 2rem',
                      background: 'transparent',
                      color: 'var(--color-blue)',
                      fontWeight: 400,
                      borderRadius: '0',
                      textDecoration: 'none',
                      border: '1px solid var(--color-blue)',
                      cursor: 'pointer'
                    }}
                  >
                    <Code size={20} />
                    {t('projects.viewRepo')}
                  </a>
                </div>
              )}
            </div>
          )}

          <div style={{
            marginTop: '3rem',
            marginBottom: '3rem',
            borderTop: '1px solid var(--color-border-light)'
          }} />

          {/* Sections */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4rem'
            }}
          >
            {/* Challenge */}
            <div>
              <h2
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 400,
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-text)'
                }}

              >
                <span style={{
                  width: '0.25rem',
                  height: '2rem',
                  background: 'var(--color-blue)',
                  borderRadius: '9999px',
                  marginRight: '1rem'
                }} />
                {t('projects.challenge')}
              </h2>
              <p
                style={{
                  fontSize: '1.125rem',
                  whiteSpace: 'pre-line',
                  color: 'var(--color-text)',
                  lineHeight: 1.8
                }}

              >
                {content.challenge}
              </p>
            </div>

            {/* Solution */}
            <div>
              <h2
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 400,
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-text)'
                }}

              >
                <span style={{
                  width: '0.25rem',
                  height: '2rem',
                  background: 'var(--color-blue)',
                  borderRadius: '9999px',
                  marginRight: '1rem'
                }} />
                {t('projects.solution')}
              </h2>
              <p
                style={{
                  fontSize: '1.125rem',
                  whiteSpace: 'pre-line',
                  color: 'var(--color-text)',
                  lineHeight: 1.8
                }}

              >
                {content.solution}
              </p>
            </div>

            {/* Result */}
            <div>
              <h2
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 400,
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-text)'
                }}

              >
                <span style={{
                  width: '0.25rem',
                  height: '2rem',
                  background: 'var(--color-blue)',
                  borderRadius: '9999px',
                  marginRight: '1rem'
                }} />
                {t('projects.result')}
              </h2>
              <p
                style={{
                  fontSize: '1.125rem',
                  whiteSpace: 'pre-line',
                  color: 'var(--color-text)',
                  lineHeight: 1.8
                }}

              >
                {content.result}
              </p>
            </div>

            {/* Technologies */}
            <div>
              <h2
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 400,
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-text)'
                }}

              >
                <span style={{
                  width: '0.25rem',
                  height: '2rem',
                  background: 'var(--color-blue)',
                  borderRadius: '9999px',
                  marginRight: '1rem'
                }} />
                {t('projects.technologies')}
              </h2>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}

              >
                {project.techs.map((tech: string) => (
                  <div
                    key={tech}

                  >
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      border: `1px solid var(--color-blue)`,
                      color: 'var(--color-blue)',
                      borderRadius: '0',
                      display: 'inline-block'
                    }}>
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            {project.images.length > 0 && (
              <div ref={galleryRef}>
                <h2
                  style={{
                    fontSize: '1.875rem',
                    fontWeight: 400,
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-text)'
                  }}

                >
                  <span style={{
                    width: '0.25rem',
                    height: '2rem',
                    background: 'var(--color-blue)',
                    borderRadius: '9999px',
                    marginRight: '1rem'
                  }} />
                  {t('projects.gallery')}
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1.5rem'
                  }}
                >
                  {project.images.map((image, idx) => (
                    <div key={idx}>
                      <img
                        alt={`${title} - ${idx}`}
                        src={image}
                        style={{
                          width: '100%',
                          height: '16rem',
                          objectFit: 'cover',
                          borderRadius: '0.75rem',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          border: '1px solid var(--color-border-light)'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Project Navigation */}
      <div
        style={{
          width: '100%',
          paddingTop: '3rem',
          paddingBottom: '3rem',
          borderTop: '1px solid var(--color-blue)',
          background: 'var(--color-bg)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '2rem'
            }}
          >
            <a href="/#projects" style={{ textDecoration: 'none' }}>
              <Button
                label={t('projects.backToProjects')}
                icon="pi pi-chevron-left"
                className="p-button-outlined"
                style={{
                  color: 'var(--color-blue)',
                  borderColor: 'var(--color-blue)',
                  border: '1px solid',
                  padding: '0.75rem 2rem',
                  fontWeight: 400,
                  cursor: 'pointer',
                  borderRadius: '0.5rem'
                }}
              />
            </a>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
                Projeto {project.featured ? 'em destaque' : 'do portfolio'}
              </p>
            </div>
            <a href="/#projects" style={{ textDecoration: 'none' }}>
              <Button
                label="Ver todos"
                icon="pi pi-chevron-right"
                iconPos="right"
                className="p-button-outlined"
                style={{
                  color: 'var(--color-blue)',
                  borderColor: 'var(--color-blue)',
                  border: '1px solid',
                  padding: '0.75rem 2rem',
                  fontWeight: 400,
                  cursor: 'pointer',
                  borderRadius: '0.5rem'
                }}
              />
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
