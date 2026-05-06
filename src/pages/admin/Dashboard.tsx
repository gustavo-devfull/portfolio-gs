import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import type { Project } from '@/types'

export const Dashboard: React.FC = () => {
  const { t, lang } = useTranslation()
  const { projects, loading, fetchProjects, deleteProject } = useProjects()
  const { logout } = useAuth()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    setDeleting(true)
    const success = await deleteProject(id)
    if (success) {
      await fetchProjects()
    }
    setDeleting(false)
    setDeleteConfirm(null)
  }

  const categories = {
    web: projects.filter((p: Project) => p.category === 'web').length,
    system: projects.filter((p: Project) => p.category === 'system').length,
    dashboard: projects.filter((p: Project) => p.category === 'dashboard').length,
    mobile: projects.filter((p: Project) => p.category === 'mobile').length,
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem 1rem',
      background: 'var(--color-bg)'
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--color-blue)'
        }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
            fontWeight: 400,
            color: 'var(--color-text)',
            fontFamily: 'Syncopate, sans-serif',
            letterSpacing: '0.1em',
            margin: 0
          }}>
            painel de controle
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/admin/new" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'var(--color-blue)',
                color: 'var(--color-black)',
                fontWeight: 400,
                border: '1px solid var(--color-blue)',
                borderRadius: '0',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontFamily: 'Syncopate, sans-serif',
                transition: 'all 0.3s'
              }}>
                <Plus size={18} />
                novo projeto
              </button>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: 'var(--color-blue)',
                fontWeight: 400,
                border: '1px solid var(--color-blue)',
                borderRadius: '0',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontFamily: 'Syncopate, sans-serif',
                transition: 'all 0.3s'
              }}
            >
              sair
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'total', value: projects.length },
            { label: 'web', value: categories.web },
            { label: 'sistema', value: categories.system },
            { label: 'painel', value: categories.dashboard },
            { label: 'destaque', value: projects.filter((p) => p.featured).length },
          ].map((stat) => (
            <div key={stat.label} style={{
              border: '1px solid var(--color-blue)',
              padding: '1.5rem',
              borderRadius: '0'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-light)',
                marginBottom: '0.5rem',
                fontWeight: 400,
                fontFamily: 'Syncopate, sans-serif'
              }}>
                {stat.label}
              </p>
              <p style={{
                fontSize: '2rem',
                fontWeight: 400,
                color: 'var(--color-blue)',
                margin: 0,
                fontFamily: 'Syncopate, sans-serif'
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Projects Table */}
        <div style={{
          border: '1px solid var(--color-blue)',
          borderRadius: '0',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}>
              carregando...
            </div>
          ) : projects.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--color-text-light)'
            }}>
              nenhum projeto encontrado
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid var(--color-blue)',
                    background: 'rgba(255, 215, 0, 0.05)'
                  }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      fontFamily: 'Syncopate, sans-serif',
                      color: 'var(--color-text)'
                    }}>título</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      fontFamily: 'Syncopate, sans-serif',
                      color: 'var(--color-text)'
                    }}>categoria</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      fontFamily: 'Syncopate, sans-serif',
                      color: 'var(--color-text)'
                    }}>destaque</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'right',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      fontFamily: 'Syncopate, sans-serif',
                      color: 'var(--color-text)'
                    }}>ações</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project: Project) => (
                    <tr
                      key={project.id}
                      style={{
                        borderBottom: '1px solid var(--color-blue)',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 215, 0, 0.03)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                      }}
                    >
                      <td style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-text)'
                      }}>
                        {project.title[lang as 'pt' | 'en'] || project.title.pt}
                      </td>
                      <td style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-light)'
                      }}>
                        {project.category}
                      </td>
                      <td style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-blue)'
                      }}>
                        {project.featured ? '★' : '-'}
                      </td>
                      <td style={{
                        padding: '1rem',
                        textAlign: 'right',
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'flex-end'
                      }}>
                        <Link to={`/admin/edit/${project.id}`} style={{ textDecoration: 'none' }}>
                          <button style={{
                            padding: '0.5rem 0.75rem',
                            background: 'transparent',
                            color: 'var(--color-blue)',
                            border: '1px solid var(--color-blue)',
                            borderRadius: '0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            fontFamily: 'Syncopate, sans-serif',
                            transition: 'all 0.2s'
                          }}>
                            <Edit2 size={14} />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(project.id)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: 'transparent',
                            color: 'var(--color-blue)',
                            border: '1px solid var(--color-blue)',
                            borderRadius: '0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            fontFamily: 'Syncopate, sans-serif',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}>
            <div style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-blue)',
              padding: '2rem',
              maxWidth: '28rem',
              borderRadius: '0'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 400,
                marginBottom: '1rem',
                color: 'var(--color-text)',
                fontFamily: 'Syncopate, sans-serif'
              }}>
                confirmar exclusão
              </h2>
              <p style={{
                color: 'var(--color-text-light)',
                marginBottom: '2rem',
                lineHeight: 1.6
              }}>
                você tem certeza que deseja deletar este projeto? esta ação não pode ser desfeita.
              </p>
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    color: 'var(--color-blue)',
                    border: '1px solid var(--color-blue)',
                    borderRadius: '0',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontFamily: 'Syncopate, sans-serif',
                    fontWeight: 400
                  }}
                >
                  cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--color-blue)',
                    color: 'var(--color-black)',
                    border: '1px solid var(--color-blue)',
                    borderRadius: '0',
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontFamily: 'Syncopate, sans-serif',
                    fontWeight: 400,
                    opacity: deleting ? 0.6 : 1
                  }}
                >
                  {deleting ? 'deletando...' : 'deletar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
