import { Timestamp } from 'firebase/firestore'

export type Language = 'pt' | 'en'
export type ProjectCategory = 'web' | 'system' | 'dashboard' | 'mobile'

export interface Project {
  id: string
  title: {
    pt: string
    en: string
  }
  slug: string
  description: {
    pt: string
    en: string
  }
  content: {
    challenge: {
      pt: string
      en: string
    }
    solution: {
      pt: string
      en: string
    }
    result: {
      pt: string
      en: string
    }
  }
  images: string[]
  coverImage: string
  techs: string[]
  category: ProjectCategory
  liveUrl?: string
  repoUrl?: string
  featured: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ProjectFormData {
  title_pt: string
  title_en: string
  slug: string
  description_pt: string
  description_en: string
  challenge_pt: string
  challenge_en: string
  solution_pt: string
  solution_en: string
  result_pt: string
  result_en: string
  category: ProjectCategory
  techs: string[]
  images: string[]
  coverImage: string
  liveUrl: string
  repoUrl: string
  featured: boolean
}

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
}
