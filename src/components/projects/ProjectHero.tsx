import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Badge } from '@/components/ui/Badge'
import { TechBadge } from './TechBadge'
import type { Project } from '@/types'

interface ProjectHeroProps {
  project: Project
  title: string
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({ project, title }) => {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const categoryLabels: Record<string, string> = {
    web: 'Web',
    system: 'System',
    dashboard: 'Dashboard',
    mobile: 'Mobile',
  }

  useEffect(() => {
    if (!contentRef.current) return

    // Hero content fade-in from bottom
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  return (
    <div
      ref={heroRef}
      className="relative h-96 overflow-hidden rounded-2xl bg-dark-bg"
    >
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt={title}
          className="h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div
        ref={contentRef}
        className="absolute inset-x-0 bottom-0 p-8"
      >
        <div className="mb-4 flex items-center gap-2">
          <Badge>{categoryLabels[project.category]}</Badge>
          {project.featured && <Badge variant="default">Featured</Badge>}
        </div>
        <h1 className="font-display text-4xl font-bold mb-4">{title}</h1>
        <div className="flex flex-wrap gap-2">
          {project.techs.map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>
      </div>
    </div>
  )
}
