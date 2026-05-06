import React, { useEffect, useRef } from 'react'
import { ProgressSpinner } from 'primereact/progressspinner'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '@/hooks/useTranslation'
import { useProjects } from '@/hooks/useProjects'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { FeaturedProjectCard } from '@/components/projects/FeaturedProjectCard'

gsap.registerPlugin(ScrollTrigger)

export const Home: React.FC = () => {
  const { t } = useTranslation()
  const { fetchProjects, projects, loading } = useProjects()

  // Featured section
  const featuredRef = useRef<HTMLDivElement>(null)
  const featuredTitleRef = useRef<HTMLHeadingElement>(null)
  const featuredUnderlineRef = useRef<HTMLDivElement>(null)

  // Connect section
  const connectRef = useRef<HTMLDivElement>(null)
  const connectTitleRef = useRef<HTMLHeadingElement>(null)
  const connectSubtitleRef = useRef<HTMLParagraphElement>(null)
  const connectButtonRef = useRef<HTMLDivElement>(null)

  // All Projects section
  const showcaseRef = useRef<HTMLDivElement>(null)
  const showcaseTitleRef = useRef<HTMLHeadingElement>(null)
  const showcaseUnderlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  // Featured section title animation
  useEffect(() => {
    if (!featuredTitleRef.current) return

    gsap.fromTo(
      featuredTitleRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  // Featured underline animation
  useEffect(() => {
    if (!featuredUnderlineRef.current) return

    gsap.fromTo(
      featuredUnderlineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
        transformOrigin: 'left',
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  // Featured project cards stagger animation
  useEffect(() => {
    if (!featuredRef.current) return

    const cards = featuredRef.current.querySelectorAll('[data-featured-card]')
    if (cards.length === 0) return

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [projects])

  // Connect section animation
  useEffect(() => {
    if (!connectTitleRef.current) return

    gsap.fromTo(
      connectTitleRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: connectRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  useEffect(() => {
    if (!connectSubtitleRef.current) return

    gsap.fromTo(
      connectSubtitleRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: connectRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  useEffect(() => {
    if (!connectButtonRef.current) return

    gsap.fromTo(
      connectButtonRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.4,
        ease: 'back.out',
        scrollTrigger: {
          trigger: connectRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )

    const buttons = connectButtonRef.current.querySelectorAll('a')
    buttons.forEach((button) => {
      const handleHover = () => {
        gsap.to(button, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
      }

      const handleHoverOut = () => {
        gsap.to(button, { scale: 1, duration: 0.3, ease: 'power2.out' })
      }

      button.addEventListener('mouseenter', handleHover)
      button.addEventListener('mouseleave', handleHoverOut)

      return () => {
        button.removeEventListener('mouseenter', handleHover)
        button.removeEventListener('mouseleave', handleHoverOut)
      }
    })
  }, [])

  // All Projects section title animation
  useEffect(() => {
    if (!showcaseTitleRef.current) return

    gsap.fromTo(
      showcaseTitleRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  // All Projects underline animation
  useEffect(() => {
    if (!showcaseUnderlineRef.current) return

    gsap.fromTo(
      showcaseUnderlineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
        transformOrigin: 'left',
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  // All projects cards stagger animation
  useEffect(() => {
    if (!showcaseRef.current) return

    const cards = showcaseRef.current.querySelectorAll('[data-project-card]')
    if (cards.length === 0) return

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [projects])

  // Get featured projects (max 2)
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2)

  return (
    <main>
      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section
          id="featured"
          ref={featuredRef}
          style={{
            width: '100%',
            paddingTop: '5rem',
            paddingBottom: '5rem',
            background: 'var(--color-bg)',
            borderBottom: '1px solid var(--color-blue)'
          }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2
              ref={featuredTitleRef}
              style={{
                fontSize: 'clamp(2rem, 3vw, 3rem)',
                fontWeight: 400,
                marginBottom: '0.5rem',
                color: 'var(--color-text)',
                fontFamily: 'Syncopate, sans-serif',
                letterSpacing: '0.1em',
                fontFeatureSettings: '"pnum" on, "lnum" on'
              }}
            >
              {t('home.featured_projects')}
            </h2>
            <div
              ref={featuredUnderlineRef}
              style={{
                height: '0.25rem',
                width: '6rem',
                background: 'var(--color-blue)',
                borderRadius: '0',
                marginBottom: '4rem',
                transformOrigin: 'left'
              }}
            />

            {/* Featured Projects Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '2.5rem',
                marginBottom: '3rem'
              }}
            >
              {featuredProjects.map((project, index) => (
                <div key={project.id} data-featured-card>
                  <FeaturedProjectCard project={project} index={index} />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div style={{ textAlign: 'center' }}>
              <a
                href="#projects"
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
                  fontSize: '0.75rem',
                  border: '1px solid var(--color-blue)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Syncopate, sans-serif',
                    letterSpacing: '0.15em'
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' })
                }}
              >
                Ver todos os projetos
                <span>↓</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Connect Section - Let's Connect */}
      <section
        ref={connectRef}
        style={{
          width: '100%',
          paddingTop: '5rem',
          paddingBottom: '5rem',
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-blue)'
        }}
      >
        <div className="max-w-3xl mx-auto px-4" style={{ textAlign: 'center' }}>
          <h2
            ref={connectTitleRef}
            style={{
              fontSize: 'clamp(2rem, 3vw, 3rem)',
              fontWeight: 400,
              marginBottom: '1rem',
              color: 'var(--color-text)',
              fontFamily: 'Syncopate, sans-serif',
              letterSpacing: '0.1em'
            }}
          >
            {t('home.connect')}
          </h2>
          <p
            ref={connectSubtitleRef}
            style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-light)',
              marginBottom: '3rem',
              lineHeight: 1.7,
              fontWeight: 400
            }}
          >
            {t('home.connectSubtitle')}
          </p>

          <div ref={connectButtonRef} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:gutopc@gmail.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 2rem',
                background: 'var(--color-blue)',
                color: 'var(--color-black)',
                fontWeight: 400,
                borderRadius: '0',
                textDecoration: 'none',
                fontSize: '0.75rem',
                boxShadow: 'none',
                border: '1px solid var(--color-blue)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Syncopate, sans-serif',
                letterSpacing: '0.15em'
              }}
            >
              Enviar Email
              <span>→</span>
            </a>
            <a
              href="https://linkedin.com/in/gustavosantos"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 2rem',
                background: 'transparent',
                color: 'var(--color-blue)',
                fontWeight: 400,
                borderRadius: '0',
                textDecoration: 'none',
                fontSize: '0.75rem',
                border: '1px solid var(--color-blue)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Syncopate, sans-serif',
                letterSpacing: '0.15em'
              }}
            >
              LinkedIn
              <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* All Projects Section */}
      <section
        id="projects"
        ref={showcaseRef}
        style={{
          width: '100%',
          paddingTop: '5rem',
          paddingBottom: '5rem',
          background: 'var(--color-bg)',
          borderTop: '1px solid var(--color-blue)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2
            ref={showcaseTitleRef}
            style={{
              fontSize: 'clamp(2rem, 3vw, 3rem)',
              fontWeight: 400,
              marginBottom: '0.5rem',
              color: 'var(--color-text)',
              fontFamily: 'Syncopate, sans-serif',
              letterSpacing: '0.1em'
            }}
          >
            Todos os Projetos
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-light)',
              marginBottom: '2rem',
              fontWeight: 400
            }}
          >
            Seleção completa de todos os projetos desenvolvidos
          </p>
          <div
            ref={showcaseUnderlineRef}
            style={{
              height: '0.5rem',
              width: '6rem',
              background: 'var(--color-blue)',
              borderRadius: '0',
              marginBottom: '4rem',
              transformOrigin: 'left'
            }}
          />

          {/* Projects Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
              <ProgressSpinner />
            </div>
          ) : projects.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                paddingTop: '5rem',
                paddingBottom: '5rem'
              }}
            >
              <p style={{ fontSize: '1.25rem', color: 'var(--color-text-light)' }}>
                {t('common.notFound')}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2.5rem'
              }}
            >
              {projects.map((project, index) => (
                <div key={project.id} data-project-card>
                  <ProjectCard project={project} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
