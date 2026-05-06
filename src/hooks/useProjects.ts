import { useState } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Project, ProjectFormData, ProjectCategory } from '@/types'

const COLLECTION_NAME = 'projects'

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async (
    constraints: QueryConstraint[] = [],
    orderBy?: { field: keyof Project; direction: 'asc' | 'desc' }
  ) => {
    setLoading(true)
    setError(null)
    try {
      const q = query(collection(db, COLLECTION_NAME), ...constraints)
      const snapshot = await getDocs(q)
      let data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[]

      // Client-side sort if needed
      if (orderBy) {
        data.sort((a, b) => {
          const aVal = a[orderBy.field]
          const bVal = b[orderBy.field]
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return orderBy.direction === 'asc'
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal)
          }
          if (aVal instanceof Timestamp && bVal instanceof Timestamp) {
            return orderBy.direction === 'asc'
              ? aVal.toMillis() - bVal.toMillis()
              : bVal.toMillis() - aVal.toMillis()
          }
          return 0
        })
      }

      setProjects(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching projects'
      setError(message)
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjectById = async (id: string): Promise<Project | null> => {
    setLoading(true)
    setError(null)
    try {
      // Fetch all projects and find the one with matching ID
      const snapshot = await getDocs(collection(db, COLLECTION_NAME))
      const found = snapshot.docs.find(d => d.id === id)
      if (!found) return null
      return { id: found.id, ...found.data() } as Project
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching project'
      setError(message)
    } finally {
      setLoading(false)
    }
    return null
  }

  const fetchProjectBySlug = async (slug: string): Promise<Project | null> => {
    setLoading(true)
    setError(null)
    try {
      const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug))
      const snapshot = await getDocs(q)
      if (snapshot.empty) return null
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Project
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching project'
      setError(message)
    } finally {
      setLoading(false)
    }
    return null
  }

  const fetchFeaturedProjects = async () => {
    return fetchProjects(
      [where('featured', '==', true)],
      { field: 'createdAt', direction: 'desc' }
    )
  }

  const fetchProjectsByCategory = async (category: ProjectCategory) => {
    return fetchProjects(
      [where('category', '==', category)],
      { field: 'createdAt', direction: 'desc' }
    )
  }

  const createProject = async (data: ProjectFormData): Promise<string | null> => {
    setLoading(true)
    setError(null)
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        title: { pt: data.title_pt, en: data.title_en },
        slug: data.slug,
        description: { pt: data.description_pt, en: data.description_en },
        content: {
          challenge: { pt: data.challenge_pt, en: data.challenge_en },
          solution: { pt: data.solution_pt, en: data.solution_en },
          result: { pt: data.result_pt, en: data.result_en },
        },
        images: data.images,
        coverImage: data.coverImage,
        techs: data.techs,
        category: data.category,
        liveUrl: data.liveUrl || null,
        repoUrl: data.repoUrl || null,
        featured: data.featured,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating project'
      setError(message)
      console.error('Error creating project:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateProject = async (id: string, data: ProjectFormData): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        title: { pt: data.title_pt, en: data.title_en },
        slug: data.slug,
        description: { pt: data.description_pt, en: data.description_en },
        content: {
          challenge: { pt: data.challenge_pt, en: data.challenge_en },
          solution: { pt: data.solution_pt, en: data.solution_en },
          result: { pt: data.result_pt, en: data.result_en },
        },
        images: data.images,
        coverImage: data.coverImage,
        techs: data.techs,
        category: data.category,
        liveUrl: data.liveUrl || null,
        repoUrl: data.repoUrl || null,
        featured: data.featured,
        updatedAt: Timestamp.now(),
      })
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating project'
      setError(message)
      console.error('Error updating project:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id))
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting project'
      setError(message)
      console.error('Error deleting project:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    fetchProjectById,
    fetchProjectBySlug,
    fetchFeaturedProjects,
    fetchProjectsByCategory,
    createProject,
    updateProject,
    deleteProject,
  }
}
