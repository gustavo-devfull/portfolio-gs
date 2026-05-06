import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { X } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/Button'
import { ImageUploader } from './ImageUploader'
import { slugify } from '@/utils'
import type { ProjectFormData, Project, ProjectCategory } from '@/types'

interface ProjectFormProps {
  projectId?: string
  project?: Project
  onSuccess: () => void
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ projectId, project, onSuccess }) => {
  const { t } = useTranslation()
  const { createProject, updateProject, loading, fetchProjects } = useProjects()
  const [formData, setFormData] = useState<ProjectFormData>({
    title_pt: '',
    title_en: '',
    slug: '',
    description_pt: '',
    description_en: '',
    challenge_pt: '',
    challenge_en: '',
    solution_pt: '',
    solution_en: '',
    result_pt: '',
    result_en: '',
    category: 'web',
    techs: [],
    images: [],
    coverImage: '',
    liveUrl: '',
    repoUrl: '',
    featured: false,
  })

  const [techInput, setTechInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (project) {
      setFormData({
        title_pt: project.title.pt,
        title_en: project.title.en,
        slug: project.slug,
        description_pt: project.description.pt,
        description_en: project.description.en,
        challenge_pt: project.content.challenge.pt,
        challenge_en: project.content.challenge.en,
        solution_pt: project.content.solution.pt,
        solution_en: project.content.solution.en,
        result_pt: project.content.result.pt,
        result_en: project.content.result.en,
        category: project.category,
        techs: project.techs,
        images: project.images,
        coverImage: project.coverImage,
        liveUrl: project.liveUrl || '',
        repoUrl: project.repoUrl || '',
        featured: project.featured,
      })
    }
  }, [project])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleImagesChange = (images: string[]) => {
    console.log('ProjectForm: handleImagesChange chamado com:', images)
    setFormData(prev => ({ ...prev, images }))
  }

  const handleCoverImageChange = (url: string) => {
    console.log('ProjectForm: handleCoverImageChange chamado com:', url)
    setFormData(prev => ({ ...prev, coverImage: url }))
  }

  const handleAddTech = () => {
    if (techInput.trim() && !formData.techs.includes(techInput)) {
      setFormData({
        ...formData,
        techs: [...formData.techs, techInput],
      })
      setTechInput('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      techs: formData.techs.filter((t) => t !== tech),
    })
  }

  const handleAutoSlug = () => {
    const slug = slugify(formData.title_en || formData.title_pt)
    setFormData({ ...formData, slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title_pt || !formData.title_en || !formData.slug) {
      setError('Please fill in all required fields')
      return
    }

    try {
      let success_id
      if (projectId) {
        const result = await updateProject(projectId, formData)
        if (result) {
          setSuccess(true)
          await fetchProjects()
          setTimeout(() => onSuccess(), 1000)
        }
      } else {
        success_id = await createProject(formData)
        if (success_id) {
          setSuccess(true)
          setFormData({
            title_pt: '',
            title_en: '',
            slug: '',
            description_pt: '',
            description_en: '',
            challenge_pt: '',
            challenge_en: '',
            solution_pt: '',
            solution_en: '',
            result_pt: '',
            result_en: '',
            category: 'web',
            techs: [],
            images: [],
            coverImage: '',
            liveUrl: '',
            repoUrl: '',
            featured: false,
          })
          await fetchProjects()
          setTimeout(() => onSuccess(), 1000)
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error saving project'
      setError(message)
    }
  }

  const categories: ProjectCategory[] = ['web', 'system', 'dashboard', 'mobile']
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
    }
  }, [])

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      {error && (
        <div style={{
          background: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid rgba(255, 0, 0, 0.3)',
          padding: '1rem',
          borderRadius: '0',
          color: '#ff6b6b'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: 'rgba(110, 231, 183, 0.1)',
          border: '1px solid rgba(110, 231, 183, 0.3)',
          padding: '1rem',
          borderRadius: '0',
          color: '#6EE7B7'
        }}>
          Project saved successfully!
        </div>
      )}

      {/* Bilingual Titles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 400,
            marginBottom: '0.5rem',
            color: 'var(--color-text)',
            fontFamily: 'Syncopate, sans-serif'
          }}>{t('admin.titlePt')} *</label>
          <input
            type="text"
            name="title_pt"
            value={formData.title_pt}
            onChange={handleInputChange}
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
          }}>{t('admin.titleEn')} *</label>
          <input
            type="text"
            name="title_en"
            value={formData.title_en}
            onChange={handleInputChange}
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
            required
          />
        </div>
      </div>

      {/* Slug */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 400,
          marginBottom: '0.5rem',
          color: 'var(--color-text)',
          fontFamily: 'Syncopate, sans-serif'
        }}>{t('admin.slug')} *</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            style={{
              flex: 1,
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
            placeholder="url-friendly-title"
            required
          />
          <button
            type="button"
            onClick={handleAutoSlug}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: 'var(--color-blue)',
              border: '1px solid var(--color-blue)',
              borderRadius: '0',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'Syncopate, sans-serif',
              fontWeight: 400,
              transition: 'all 0.3s'
            }}
          >
            auto
          </button>
        </div>
      </div>

      {/* Bilingual Descriptions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 400,
            marginBottom: '0.5rem',
            color: 'var(--color-text)',
            fontFamily: 'Syncopate, sans-serif'
          }}>{t('admin.descriptionPt')}</label>
          <textarea
            name="description_pt"
            value={formData.description_pt}
            onChange={handleInputChange}
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
            rows={3}
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
          }}>{t('admin.descriptionEn')}</label>
          <textarea
            name="description_en"
            value={formData.description_en}
            onChange={handleInputChange}
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
            rows={3}
          />
        </div>
      </div>

      {/* Challenge */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 400,
            marginBottom: '0.5rem',
            color: 'var(--color-text)',
            fontFamily: 'Syncopate, sans-serif'
          }}>{t('admin.challengePt')}</label>
          <textarea
            name="challenge_pt"
            value={formData.challenge_pt}
            onChange={handleInputChange}
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
            rows={4}
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
          }}>{t('admin.challengeEn')}</label>
          <textarea
            name="challenge_en"
            value={formData.challenge_en}
            onChange={handleInputChange}
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
            rows={4}
          />
        </div>
      </div>

      {/* Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 400,
            marginBottom: '0.5rem',
            color: 'var(--color-text)',
            fontFamily: 'Syncopate, sans-serif'
          }}>{t('admin.solutionPt')}</label>
          <textarea
            name="solution_pt"
            value={formData.solution_pt}
            onChange={handleInputChange}
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
            rows={4}
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
          }}>{t('admin.solutionEn')}</label>
          <textarea
            name="solution_en"
            value={formData.solution_en}
            onChange={handleInputChange}
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
            rows={4}
          />
        </div>
      </div>

      {/* Result */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 400,
            marginBottom: '0.5rem',
            color: 'var(--color-text)',
            fontFamily: 'Syncopate, sans-serif'
          }}>{t('admin.resultPt')}</label>
          <textarea
            name="result_pt"
            value={formData.result_pt}
            onChange={handleInputChange}
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
            rows={4}
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
          }}>{t('admin.resultEn')}</label>
          <textarea
            name="result_en"
            value={formData.result_en}
            onChange={handleInputChange}
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
            rows={4}
          />
        </div>
      </div>

      {/* Category & Featured */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 400,
            marginBottom: '0.5rem',
            color: 'var(--color-text)',
            fontFamily: 'Syncopate, sans-serif'
          }}>{t('admin.category')}</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
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
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              style={{ height: '1rem', width: '1rem' }}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: 400, fontFamily: 'Syncopate, sans-serif', color: 'var(--color-text)' }}>{t('admin.isFeatured')}</span>
          </label>
        </div>
      </div>

      {/* Technologies */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 400,
          marginBottom: '0.5rem',
          color: 'var(--color-text)',
          fontFamily: 'Syncopate, sans-serif'
        }}>{t('admin.technologies')}</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
            style={{
              flex: 1,
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
            placeholder="e.g., React"
          />
          <button
            type="button"
            onClick={handleAddTech}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: 'var(--color-blue)',
              border: '1px solid var(--color-blue)',
              borderRadius: '0',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'Syncopate, sans-serif',
              fontWeight: 400,
              transition: 'all 0.3s'
            }}
          >
            adicionar
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {formData.techs.map((tech) => (
            <div key={tech} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid var(--color-blue)',
              padding: '0.5rem 0.75rem',
              borderRadius: '0'
            }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>{tech}</span>
              <button
                type="button"
                onClick={() => handleRemoveTech(tech)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-blue)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 400,
          marginBottom: '0.5rem',
          color: 'var(--color-text)',
          fontFamily: 'Syncopate, sans-serif'
        }}>{t('admin.images')}</label>
        <ImageUploader
          images={formData.images}
          onImagesChange={handleImagesChange}
          coverImage={formData.coverImage}
          onCoverImageChange={handleCoverImageChange}
        />
      </div>

      {/* Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 400,
            marginBottom: '0.5rem',
            color: 'var(--color-text)',
            fontFamily: 'Syncopate, sans-serif'
          }}>{t('admin.liveUrl')}</label>
          <input
            type="url"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleInputChange}
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
            placeholder="https://..."
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
          }}>{t('admin.repoUrl')}</label>
          <input
            type="url"
            name="repoUrl"
            value={formData.repoUrl}
            onChange={handleInputChange}
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
            placeholder="https://github.com/..."
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem' }}>
        <button
          type="button"
          onClick={() => onSuccess()}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: 'var(--color-blue)',
            border: '1px solid var(--color-blue)',
            borderRadius: '0',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'Syncopate, sans-serif',
            fontWeight: 400,
            transition: 'all 0.3s'
          }}
        >
          {t('admin.cancel')}
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--color-blue)',
            color: 'var(--color-black)',
            border: '1px solid var(--color-blue)',
            borderRadius: '0',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'Syncopate, sans-serif',
            fontWeight: 400,
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.3s'
          }}
        >
          {loading ? 'salvando...' : t('admin.save')}
        </button>
      </div>
    </form>
  )
}
