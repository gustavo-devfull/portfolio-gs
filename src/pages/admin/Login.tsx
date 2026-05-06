import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <main style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--color-bg)'
    }}>
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        <div style={{
          border: '1px solid var(--color-blue)',
          padding: '3rem 2rem',
          borderRadius: '0'
        }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
              fontWeight: 400,
              marginBottom: '0.75rem',
              color: 'var(--color-text)',
              fontFamily: 'Syncopate, sans-serif',
              letterSpacing: '0.1em'
            }}>
              {t('admin.loginTitle')}
            </h1>
            <p style={{
              fontSize: '1rem',
              color: 'var(--color-text-light)',
              marginBottom: '1rem',
              lineHeight: 1.6,
              fontWeight: 400
            }}>
              {t('admin.loginSubtitle')}
            </p>
          </div>

          {error && (
            <div style={{
              marginBottom: '1rem',
              padding: '1rem',
              background: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              color: '#ff6b6b'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 400,
                marginBottom: '0.5rem',
                color: 'var(--color-text)',
                fontFamily: 'Syncopate, sans-serif'
              }}>
                {t('admin.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-blue)',
                  borderRadius: '0',
                  fontSize: '1rem',
                  fontFamily: 'Syncopate, sans-serif',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 400,
                marginBottom: '0.5rem',
                color: 'var(--color-text)',
                fontFamily: 'Syncopate, sans-serif'
              }}>
                {t('admin.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-blue)',
                  borderRadius: '0',
                  fontSize: '1rem',
                  fontFamily: 'Syncopate, sans-serif',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.875rem 2rem',
                background: 'var(--color-blue)',
                color: 'var(--color-black)',
                fontWeight: 400,
                borderRadius: '0',
                fontSize: '0.875rem',
                border: '1px solid var(--color-blue)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Syncopate, sans-serif',
                letterSpacing: '0.05em',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Entrando...' : t('admin.signIn')}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
