import React, { useRef, useEffect } from 'react'
import { Code2, Mail, ExternalLink } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const footerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const socialLinksRef = useRef<HTMLDivElement>(null)
  const copyrightRef = useRef<HTMLDivElement>(null)
  const socialIconsRef = useRef<(HTMLAnchorElement | null)[]>([])

  const socialLinks = [
    {
      icon: Code2,
      href: 'https://github.com/gustavosantos',
      label: 'GitHub',
    },
    {
      icon: ExternalLink,
      href: 'https://linkedin.com/in/gustavosantos',
      label: 'LinkedIn',
    },
    {
      icon: Mail,
      href: 'mailto:gutopc@gmail.com',
      label: 'Email',
    },
  ]

  useEffect(() => {
    if (!footerRef.current) return

    // Footer fade-in on scroll into view
    gsap.fromTo(
      footerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  useEffect(() => {
    if (!titleRef.current) return

    // Title fade-in with slide
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  useEffect(() => {
    if (!subtitleRef.current) return

    // Subtitle fade-in
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  useEffect(() => {
    if (!socialLinksRef.current) return

    // Social links stagger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })

    socialIconsRef.current.forEach((icon, index) => {
      if (!icon) return

      tl.fromTo(
        icon,
        { opacity: 0, y: 20, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out' },
        0.1 * index
      )

      // Icon hover effect with bounce
      const handleIconHover = () => {
        gsap.to(icon, {
          scale: 1.3,
          color: 'var(--color-blue)',
          duration: 0.3,
          ease: 'back.out'
        })
      }

      const handleIconHoverOut = () => {
        gsap.to(icon, {
          scale: 1,
          color: 'var(--color-text-light)',
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      icon.addEventListener('mouseenter', handleIconHover)
      icon.addEventListener('mouseleave', handleIconHoverOut)

      return () => {
        icon.removeEventListener('mouseenter', handleIconHover)
        icon.removeEventListener('mouseleave', handleIconHoverOut)
      }
    })
  }, [])

  useEffect(() => {
    if (!copyrightRef.current) return

    // Copyright text fade-in
    gsap.fromTo(
      copyrightRef.current,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  return (
    <footer
      ref={footerRef}
      style={{
        width: '100%',
        marginTop: 'auto',
        background: 'var(--color-bg)',
        borderTop: '1px solid var(--color-blue)'
      }}
    >
      <div className="w-full" style={{ padding: '6rem 0' }}>
        <div className="max-w-3xl mx-auto px-4" style={{ textAlign: 'center' }}>
          {/* Title */}
          <h2
            ref={titleRef}
            style={{
              fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
              fontWeight: 400,
              marginBottom: '0.75rem',
              color: 'var(--color-text)',
              fontFamily: 'Syncopate, sans-serif',
              letterSpacing: '0.05em'
            }}
          >
            Let's Connect
          </h2>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-light)',
              marginBottom: '3rem',
              lineHeight: 1.6,
              fontWeight: 400
            }}
          >
            Conecte-se comigo em redes sociais ou envie um email. Sempre disponível para novas oportunidades e projetos interessantes.
          </p>

          {/* Social Links */}
          <div
            ref={socialLinksRef}
            className="flex gap-8 justify-center"
            style={{ marginBottom: '4rem' }}
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  ref={(el) => {
                    if (el) socialIconsRef.current[index] = el
                  }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    color: 'var(--color-text-light)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0',
                    background: 'transparent',
                    border: '1px solid var(--color-blue)',
                    transition: 'all 0.3s'
                  }}
                >
                  <Icon size={28} />
                </a>
              )
            })}
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: 'var(--color-blue)',
              marginBottom: '2rem'
            }}
          />

          {/* Copyright */}
          <div
            ref={copyrightRef}
            className="text-sm"
            style={{ color: 'var(--color-text-light)' }}
          >
            <p style={{ margin: '0 0 0.5rem 0' }}>
              &copy; {currentYear} Gustavo Santos. Desenvolvido com React e GSAP.
            </p>
            <p
              className="text-xs"
              style={{ color: 'var(--color-text-light)', opacity: 0.7, margin: 0 }}
            >
              Front-End Developer & Creative Developer
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
