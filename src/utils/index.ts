import clsx, { type ClassValue } from 'clsx'

export const cn = (...inputs: ClassValue[]) => {
  return clsx(inputs)
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const formatDate = (date: Date | { toDate(): Date }): string => {
  const d = date instanceof Date ? date : date.toDate()
  return d.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    web: '#6EE7B7',
    system: '#60A5FA',
    dashboard: '#F59E0B',
    mobile: '#8B5CF6',
  }
  return colors[category] || '#6EE7B7'
}

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    web: 'Web',
    system: 'System',
    dashboard: 'Dashboard',
    mobile: 'Mobile',
  }
  return labels[category] || category
}
