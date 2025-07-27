// src/hooks/experience/useExperience.ts
import { useState, useEffect, useCallback } from 'react';
import { Experience } from '@/types/experience';
import { experienceService } from '@/services/experience';

export const useExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const loadedExperiences = await experienceService.getExperiences();
      setExperiences(loadedExperiences);
      setError(null);
    } catch (err) {
      console.error('Error loading experiences:', err);
      setError(err instanceof Error ? err.message : 'Failed to load experiences');
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  // const getOngoingExperiences = async () => {
  //   try {
  //     return await experienceService.getOngoingExperiences();
  //   } catch (err) {
  //     console.error('Error loading ongoing experiences:', err);
  //     throw err;
  //   }
  // };

  // const searchExperiences = async (query: string) => {
  //   try {
  //     return await experienceService.searchExperiences(query);
  //   } catch (err) {
  //     console.error('Error searching experiences:', err);
  //     throw err;
  //   }
  // };

  // const getExperiencesByTech = async (tech: string) => {
  //   try {
  //     return await experienceService.getExperiencesByTech(tech);
  //   } catch (err) {
  //     console.error('Error getting experiences by tech:', err);
  //     throw err;
  //   }
  // };

  return {
    experiences,
    loading,
    error,
    refetch: loadExperiences
  };
};

// Hook for single experience
export const useSingleExperience = (id: string) => {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const data = await experienceService.getExperienceById(id);
        setExperience(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch experience'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExperience();
    }
  }, [id]);

  return { experience, loading, error };
};