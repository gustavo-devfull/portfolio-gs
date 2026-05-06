import React from 'react'
import { Badge } from '@/components/ui/Badge'

interface TechBadgeProps {
  tech: string
}

export const TechBadge: React.FC<TechBadgeProps> = ({ tech }) => {
  return <Badge variant="secondary">{tech}</Badge>
}
