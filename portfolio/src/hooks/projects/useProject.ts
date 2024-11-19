// src/hooks/projects/useProject.ts
import { useState, useEffect } from 'react';
import { Project } from '@/types/projects';
import { supabase } from '@/lib/supabase';

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setProject({
            id: data.id,
            name: data.name,
            description: data.description || '',
            planetImage: data.planet_image || `/planets/planet${Math.floor(Math.random() * 15) + 1}.png`,
            demoLink: data.demo_link || undefined,
            githubLink: data.github_link || undefined,
            techStack: data.tech_stack || [],
            previewContent: {
              title: data.preview_content?.title || data.name,
              description: data.preview_content?.description || data.description || '',
              features: data.preview_content?.features || []
            },
            size: data.size || {
              desktop: 200,
              tablet: 160,
              mobile: 120
            }
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch project'));
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, loading, error };
};