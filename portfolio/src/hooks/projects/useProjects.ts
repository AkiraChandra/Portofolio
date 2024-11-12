import { useState, useEffect } from 'react'
import { projectService } from '@/services/projects'
import { Project } from '@/types/database.types'

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await projectService.getProjects()
      // Transform data jika perlu untuk memastikan struktur sesuai
      const transformedData: Project[] = data.map(project => ({
        ...project,
        techStack: project.tech_stack || [], // Transform dari database naming ke camelCase
        planetImage: project.planet_image || '', // Transform dari database naming ke camelCase
        demoLink: project.demo_link,
        githubLink: project.github_link,
        previewContent: {
          title: project.name,
          description: project.description,
          features: project.preview_content?.features || []
        },
        size: {
          desktop: 200,
          tablet: 160,
          mobile: 120
        }
      }))
      setProjects(transformedData)
      setError(null)
    } catch (err) {
      console.error('Error loading projects:', err)
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    refetch: loadProjects
  }
}