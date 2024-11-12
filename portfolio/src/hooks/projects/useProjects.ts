// src/hooks/projects/useProjects.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types/projects';
import { ProjectDB } from '@/types/database.types';

const DEFAULT_SIZE = {
  desktop: 200,
  tablet: 160,
  mobile: 120
};

const transformDatabaseProject = (dbProject: ProjectDB): Project => {
  return {
    id: dbProject.id,
    name: dbProject.name,
    description: dbProject.description || '',
    planetImage: dbProject.planet_image || `/planets/planet${Math.floor(Math.random() * 15) + 1}.png`,
    demoLink: dbProject.demo_link || undefined,
    githubLink: dbProject.github_link || undefined,
    techStack: dbProject.tech_stack || [],
    previewContent: {
      title: dbProject.preview_content?.title || dbProject.name,
      description: dbProject.preview_content?.description || dbProject.description || '',
      features: dbProject.preview_content?.features || []
    },
    size: dbProject.size || DEFAULT_SIZE
  };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      
      const { data, error: dbError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      if (!data) {
        setProjects([]);
        return;
      }

      const transformedProjects = data.map(transformDatabaseProject);
      setProjects(transformedProjects);
      setError(null);
      
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const getFeaturedProjects = async (limit: number = 3) => {
    try {
      const { data, error: dbError } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (dbError) throw dbError;

      return data ? data.map(transformDatabaseProject) : [];
    } catch (err) {
      console.error('Error loading featured projects:', err);
      throw err;
    }
  };

  const searchProjects = async (query: string) => {
    try {
      const { data, error: dbError } = await supabase
        .from('projects')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      return data ? data.map(transformDatabaseProject) : [];
    } catch (err) {
      console.error('Error searching projects:', err);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    refetch: loadProjects,
    getFeaturedProjects,
    searchProjects
  };
};