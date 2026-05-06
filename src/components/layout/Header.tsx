import React, { useRef, useEffect } from 'react'
import { Button } from 'primereact/button'
import gsap from 'gsap'
import { useTranslation } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/languageStore'

export const Header: React.FC = () => {
  const { t } = useTranslation()
  const { lang, setLang } = useLanguageStore()
  const headerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const langButtonRef = useRef<HTMLDivElement>(null)
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    if (!headerRef.current) return

    // Initial header fade-in from top
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }, [])

  useEffect(() => {
    if (!logoRef.current) return

    // Logo scale and opacity animation on mount
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out' }
    )

    // Logo hover effect
    const handleLogoHover = () => {
      gsap.to(logoRef.current, { scale: 1.08, duration: 0.3, ease: 'power2.out' })
    }

    const handleLogoHoverOut = () => {
      gsap.to(logoRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' })
    }

    logoRef.current.addEventListener('mouseenter', handleLogoHover)
    logoRef.current.addEventListener('mouseleave', handleLogoHoverOut)

    return () => {
      logoRef.current?.removeEventListener('mouseenter', handleLogoHover)
      logoRef.current?.removeEventListener('mouseleave', handleLogoHoverOut)
    }
  }, [])

  // Nav links stagger animation
  useEffect(() => {
    navLinksRef.current.forEach((link, index) => {
      if (!link) return

      gsap.fromTo(
        link,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1 + index * 0.05, ease: 'power2.out' }
      )

      // Link underline animation on hover
      const handleLinkHover = () => {
        gsap.to(link, {
          color: 'var(--color-blue)',
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      const handleLinkHoverOut = () => {
        gsap.to(link, {
          color: 'var(--color-text)',
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      link.addEventListener('mouseenter', handleLinkHover)
      link.addEventListener('mouseleave', handleLinkHoverOut)

      return () => {
        link.removeEventListener('mouseenter', handleLinkHover)
        link.removeEventListener('mouseleave', handleLinkHoverOut)
      }
    })
  }, [])

  const toggleLanguage = () => {
    if (!langButtonRef.current) return

    // Language button rotation animation
    gsap.to(langButtonRef.current, {
      rotation: 360,
      duration: 0.6,
      ease: 'back.out'
    })

    setLang(lang === 'pt' ? 'en' : 'pt')
  }

  useEffect(() => {
    if (!langButtonRef.current) return

    // Language button hover effect
    const handleLangHover = () => {
      gsap.to(langButtonRef.current, { scale: 1.08, duration: 0.3, ease: 'power2.out' })
    }

    const handleLangHoverOut = () => {
      gsap.to(langButtonRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' })
    }

    langButtonRef.current.addEventListener('mouseenter', handleLangHover)
    langButtonRef.current.addEventListener('mouseleave', handleLangHoverOut)

    return () => {
      langButtonRef.current?.removeEventListener('mouseenter', handleLangHover)
      langButtonRef.current?.removeEventListener('mouseleave', handleLangHoverOut)
    }
  }, [])

  return (
    <header
      ref={headerRef}
      style={{
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-blue)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div
        className="max-w-6xl mx-auto px-4"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '5rem'
        }}
      >
        {/* Logo */}
        <div
          ref={logoRef}
          className="font-bold cursor-pointer"
          style={{
            color: 'var(--color-blue)',
            fontSize: '1.5rem',
            fontWeight: 400,
            fontFamily: 'Syncopate, sans-serif',
            letterSpacing: '0.05em'
          }}
        >
          <a
            href="/"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>GS</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 400, color: 'var(--color-text-light)' }}>
              Front-End Dev
            </span>
          </a>
        </div>

        {/* Navigation Links */}
        <nav
          ref={navRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flex: 1,
            justifyContent: 'center'
          }}
        >
          <a
            href="/"
            ref={(el) => { if (el) navLinksRef.current[0] = el }}
            style={{
              textDecoration: 'none',
              color: 'var(--color-text)',
              fontWeight: 400,
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontFamily: 'Syncopate, sans-serif',
              letterSpacing: '0.03em'
            }}
          >
            {t('nav.home')}
          </a>
          <a
            href="/#projects"
            ref={(el) => { if (el) navLinksRef.current[1] = el }}
            style={{
              textDecoration: 'none',
              color: 'var(--color-text)',
              fontWeight: 400,
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontFamily: 'Syncopate, sans-serif',
              letterSpacing: '0.03em'
            }}
          >
            {t('nav.projects')}
          </a>
          <a
            href="https://github.com/gustavosantos"
            target="_blank"
            rel="noopener noreferrer"
            ref={(el) => { if (el) navLinksRef.current[2] = el }}
            style={{
              textDecoration: 'none',
              color: 'var(--color-text)',
              fontWeight: 400,
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontFamily: 'Syncopate, sans-serif',
              letterSpacing: '0.03em'
            }}
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/gustavosantos"
            target="_blank"
            rel="noopener noreferrer"
            ref={(el) => { if (el) navLinksRef.current[3] = el }}
            style={{
              textDecoration: 'none',
              color: 'var(--color-text)',
              fontWeight: 400,
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontFamily: 'Syncopate, sans-serif',
              letterSpacing: '0.03em'
            }}
          >
            LinkedIn
          </a>
        </nav>

        {/* Language Toggle and Admin Button */}
        <div ref={langButtonRef} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button
            onClick={toggleLanguage}
            className="p-button-text"
            label={lang.toUpperCase()}
            style={{
              color: 'var(--color-blue)',
              fontWeight: 400,
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              fontFamily: 'Syncopate, sans-serif',
              border: '1px solid var(--color-blue)',
              background: 'transparent',
              letterSpacing: '0.05em'
            }}
          />
          <a
            href="/admin"
            style={{
              color: 'var(--color-blue)',
              fontWeight: 400,
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              fontFamily: 'Syncopate, sans-serif',
              border: '1px solid var(--color-blue)',
              background: 'transparent',
              textDecoration: 'none',
              display: 'inline-block',
              letterSpacing: '0.05em'
            }}
          >
            Admin
          </a>
        </div>
      </div>
    </header>
  )
}
