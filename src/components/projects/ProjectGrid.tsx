import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProjectCard } from './ProjectCard'
import type { Project } from '@/types'

gsap.registerPlugin(ScrollTrigger)

interface ProjectGridProps {
  projects: Project[]
  isLoading?: boolean
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, isLoading }) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!gridRef.current || isLoading || projects.length === 0) return

    // Stagger animation for project cards
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })

    itemsRef.current.forEach((item, index) => {
      if (!item) return

      tl.fromTo(
        item,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        index * 0.1
      )
    })
  }, [projects, isLoading])

  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-card rounded-xl bg-dark-surface animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-muted">No projects found</p>
      </div>
    )
  }

  return (
    <div
      ref={gridRef}
      className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project, index) => (
        <div
          key={project.id}
          ref={(el) => {
            if (el) itemsRef.current[index] = el
          }}
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  )
}
