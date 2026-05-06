import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'
import { useProjects } from '@/hooks/useProjects'
import { ProjectForm } from '@/components/admin/ProjectForm'
import type { Project } from '@/types'

export const ProjectEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, lang } = useTranslation()
  const { fetchProjectById, loading } = useProjects()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const loadProject = async () => {
      if (id) {
        const data = await fetchProjectById(id)
        if (data) {
          setProject(data)
        } else {
          navigate('/admin')
        }
      }
    }
    loadProject()
  }, [id])

  const projectTitle = project?.title[lang as 'pt' | 'en'] || project?.title.pt || t('admin.editProject')

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
        }}>editar: {projectTitle}</h1>

        {loading && (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--color-text-light)'
          }}>
            carregando...
          </div>
        )}

        {project && (
          <ProjectForm
            projectId={id}
            project={project}
            onSuccess={() => navigate('/admin')}
          />
        )}
      </div>
    </div>
  )
}
