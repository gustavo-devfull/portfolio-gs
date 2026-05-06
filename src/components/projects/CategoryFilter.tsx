import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Button } from '@/components/ui/Button'
import type { ProjectCategory } from '@/types'

interface CategoryFilterProps {
  categories: ProjectCategory[]
  activeCategory: ProjectCategory | null
  onCategoryChange: (category: ProjectCategory | null) => void
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])

  const categoryLabels: Record<ProjectCategory, string> = {
    web: 'Web',
    system: 'Systems',
    dashboard: 'Dashboard',
    mobile: 'Mobile',
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Filter buttons fade-in stagger
    gsap.fromTo(
      containerRef.current.querySelectorAll('button'),
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.05 }
    )
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap gap-2 mb-8"
    >
      <Button
        variant={activeCategory === null ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onCategoryChange(null)}
      >
        All
      </Button>
      {categories.map((category, index) => (
        <Button
          key={category}
          ref={(el) => {
            if (el) buttonsRef.current[index] = el
          }}
          variant={activeCategory === category ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category)}
        >
          {categoryLabels[category]}
        </Button>
      ))}
    </div>
  )
}
