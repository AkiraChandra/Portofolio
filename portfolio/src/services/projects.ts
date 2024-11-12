// src/services/projects.ts
import { supabase } from '@/lib/supabase'
import { Project } from '@/types/database.types'

export const projectService = {
  // Get all projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(project => ({
      ...project,
      techStack: project.tech_stack || [],
      planetImage: project.planet_image || '',
      demoLink: project.demo_link,
      githubLink: project.github_link,
      previewContent: {
        title: project.name,
        description: project.description,
        features: project.preview_content?.features || []
      },
      size: project.size || {
        desktop: 200,
        tablet: 160,
        mobile: 120
      }
    })) as Project[]
  },

  // Get single project by ID
  async getProjectById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return {
      ...data,
      techStack: data.tech_stack || [],
      planetImage: data.planet_image || '',
      demoLink: data.demo_link,
      githubLink: data.github_link,
      previewContent: {
        title: data.name,
        description: data.description,
        features: data.preview_content?.features || []
      },
      size: data.size || {
        desktop: 200,
        tablet: 160,
        mobile: 120
      }
    } as Project
  },

  // Create new project
  async createProject(project: Omit<Project, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        name: project.name,
        description: project.description,
        planet_image: project.planetImage,
        tech_stack: project.techStack,
        demo_link: project.demoLink,
        github_link: project.githubLink,
        preview_content: {
          features: project.previewContent.features
        },
        size: project.size
      }])
      .select()

    if (error) throw error

    const createdProject = data[0]
    return {
      ...createdProject,
      techStack: createdProject.tech_stack || [],
      planetImage: createdProject.planet_image || '',
      demoLink: createdProject.demo_link,
      githubLink: createdProject.github_link,
      previewContent: {
        title: createdProject.name,
        description: createdProject.description,
        features: createdProject.preview_content?.features || []
      },
      size: createdProject.size || {
        desktop: 200,
        tablet: 160,
        mobile: 120
      }
    } as Project
  },

  // Update existing project
  async updateProject(id: string, project: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        name: project.name,
        description: project.description,
        planet_image: project.planetImage,
        tech_stack: project.techStack,
        demo_link: project.demoLink,
        github_link: project.githubLink,
        preview_content: project.previewContent ? {
          features: project.previewContent.features
        } : undefined,
        size: project.size
      })
      .eq('id', id)
      .select()

    if (error) throw error

    const updatedProject = data[0]
    return {
      ...updatedProject,
      techStack: updatedProject.tech_stack || [],
      planetImage: updatedProject.planet_image || '',
      demoLink: updatedProject.demo_link,
      githubLink: updatedProject.github_link,
      previewContent: {
        title: updatedProject.name,
        description: updatedProject.description,
        features: updatedProject.preview_content?.features || []
      },
      size: updatedProject.size || {
        desktop: 200,
        tablet: 160,
        mobile: 120
      }
    } as Project
  },

  // Delete project
  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Update project order
  async updateProjectOrder(projectIds: string[]) {
    const { error } = await supabase.rpc('update_project_order', {
      project_ids: projectIds
    })

    if (error) throw error
    return true
  },

  // Get featured projects
  async getFeaturedProjects(limit: number = 3) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data.map(project => ({
      ...project,
      techStack: project.tech_stack || [],
      planetImage: project.planet_image || '',
      demoLink: project.demo_link,
      githubLink: project.github_link,
      previewContent: {
        title: project.name,
        description: project.description,
        features: project.preview_content?.features || []
      },
      size: project.size || {
        desktop: 200,
        tablet: 160,
        mobile: 120
      }
    })) as Project[]
  },

  // Search projects
  async searchProjects(query: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(project => ({
      ...project,
      techStack: project.tech_stack || [],
      planetImage: project.planet_image || '',
      demoLink: project.demo_link,
      githubLink: project.github_link,
      previewContent: {
        title: project.name,
        description: project.description,
        features: project.preview_content?.features || []
      },
      size: project.size || {
        desktop: 200,
        tablet: 160,
        mobile: 120
      }
    })) as Project[]
  },

  // Get projects by technology
  async getProjectsByTech(tech: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .contains('tech_stack', [tech])
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(project => ({
      ...project,
      techStack: project.tech_stack || [],
      planetImage: project.planet_image || '',
      demoLink: project.demo_link,
      githubLink: project.github_link,
      previewContent: {
        title: project.name,
        description: project.description,
        features: project.preview_content?.features || []
      },
      size: project.size || {
        desktop: 200,
        tablet: 160,
        mobile: 120
      }
    })) as Project[]
  }
}