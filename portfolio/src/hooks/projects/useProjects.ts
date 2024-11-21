import { useState, useEffect, useCallback } from 'react';
import { Project, ImageUploadOptions } from '@/types/projects';
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

  const getFeaturedProjects = async (limit: number = 3) => {
    try {
      return await projectService.getFeaturedProjects(limit);
    } catch (err) {
      console.error('Error loading featured projects:', err);
      throw err;
    }
  };

  const searchProjects = async (query: string) => {
    try {
      return await projectService.searchProjects(query);
    } catch (err) {
      console.error('Error searching projects:', err);
      throw err;
    }
  };

  const getProjectsByTech = async (tech: string) => {
    try {
      return await projectService.getProjectsByTech(tech);
    } catch (err) {
      console.error('Error getting projects by tech:', err);
      throw err;
    }
  };

  const uploadProjectImage = async (
    projectId: string,
    file: File,
    options: ImageUploadOptions = {}
  ) => {
    try {
      const result = await projectService.uploadProjectImage(projectId, file, options);
      await loadProjects(); // Refresh projects after upload
      return result;
    } catch (err) {
      console.error('Error uploading project image:', err);
      throw err;
    }
  };

  const deleteProjectImage = async (projectId: string, imageId: string) => {
    try {
      const result = await projectService.deleteProjectImage(projectId, imageId);
      await loadProjects(); // Refresh projects after deletion
      return result;
    } catch (err) {
      console.error('Error deleting project image:', err);
      throw err;
    }
  };

  const updateImageOrder = async (projectId: string, imageIds: string[]) => {
    try {
      const result = await projectService.updateImageOrder(projectId, imageIds);
      await loadProjects(); // Refresh projects after reordering
      return result;
    } catch (err) {
      console.error('Error updating image order:', err);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    refetch: loadProjects,
    getFeaturedProjects,
    searchProjects,
    getProjectsByTech,
    uploadProjectImage,
    deleteProjectImage,
    updateImageOrder
  };
};