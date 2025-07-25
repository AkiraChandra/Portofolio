// src/hooks/projects/useProject.ts
import { useState, useEffect } from 'react';
import { Project } from '@/types/projects';
import { projectService } from '@/services/projects';

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Gunakan projectService.getProjectById() yang sudah include images
        const projectData = await projectService.getProjectById(id);
        
        if (projectData) {
          setProject(projectData);
        } else {
          setError(new Error('Project not found'));
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch project'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  return { project, loading, error };
};