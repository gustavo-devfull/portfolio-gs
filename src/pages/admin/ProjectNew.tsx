import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'
import { ProjectForm } from '@/components/admin/ProjectForm'

export const ProjectNew: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem 1rem',
      background: 'var(--color-bg)'
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
          fontWeight: 400,
          marginBottom: '2rem',
          color: 'var(--color-text)',
          fontFamily: 'Syncopate, sans-serif',
          letterSpacing: '0.1em',
          margin: 0,
          marginBottom: '2rem'
        }}>{t('admin.newProject')}</h1>
        <ProjectForm onSuccess={() => navigate('/admin')} />
      </div>
    </div>
  )
}
