import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types/projects';
import { projectService } from '@/services/projects';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const loadedProjects = await projectService.getProjects();
      setProjects(loadedProjects);
      setError(null);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

 

  return {
    projects,
    loading,
    error,
    refetch: loadProjects
  };
};