// src/hooks/experience/useExperience.ts
import { useState, useEffect, useCallback } from 'react';
import { Experience, ImageUploadOptions, ExperienceLink, Skill } from '@/types/experience';
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

  const getOngoingExperiences = async () => {
    try {
      return await experienceService.getOngoingExperiences();
    } catch (err) {
      console.error('Error loading ongoing experiences:', err);
      throw err;
    }
  };

  const searchExperiences = async (query: string) => {
    try {
      return await experienceService.searchExperiences(query);
    } catch (err) {
      console.error('Error searching experiences:', err);
      throw err;
    }
  };

  const getExperiencesByTech = async (tech: string) => {
    try {
      return await experienceService.getExperiencesByTech(tech);
    } catch (err) {
      console.error('Error getting experiences by tech:', err);
      throw err;
    }
  };

  const createExperience = async (experienceData: Partial<Experience>) => {
    try {
      const newExperience = await experienceService.createExperience(experienceData);
      await loadExperiences(); // Refresh the list
      return newExperience;
    } catch (err) {
      console.error('Error creating experience:', err);
      throw err;
    }
  };

  const updateExperience = async (id: string, experienceData: Partial<Experience>) => {
    try {
      const updatedExperience = await experienceService.updateExperience(id, experienceData);
      await loadExperiences(); // Refresh the list
      return updatedExperience;
    } catch (err) {
      console.error('Error updating experience:', err);
      throw err;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      await experienceService.deleteExperience(id);
      await loadExperiences(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error deleting experience:', err);
      throw err;
    }
  };

  const uploadExperienceImage = async (
    experienceId: string,
    file: File,
    options: ImageUploadOptions = {}
  ) => {
    try {
      const result = await experienceService.uploadExperienceImage(experienceId, file, options);
      await loadExperiences(); // Refresh experiences after upload
      return result;
    } catch (err) {
      console.error('Error uploading experience image:', err);
      throw err;
    }
  };

  const deleteExperienceImage = async (experienceId: string, imageId: string) => {
    try {
      const result = await experienceService.deleteExperienceImage(experienceId, imageId);
      await loadExperiences(); // Refresh experiences after deletion
      return result;
    } catch (err) {
      console.error('Error deleting experience image:', err);
      throw err;
    }
  };

  const addExperienceLinks = async (experienceId: string, links: ExperienceLink[]) => {
    try {
      const result = await experienceService.addExperienceLinks(experienceId, links);
      await loadExperiences(); // Refresh experiences after adding links
      return result;
    } catch (err) {
      console.error('Error adding experience links:', err);
      throw err;
    }
  };

  const addExperienceSkills = async (experienceId: string, skills: Skill[]) => {
    try {
      const result = await experienceService.addExperienceSkills(experienceId, skills);
      await loadExperiences(); // Refresh experiences after adding skills
      return result;
    } catch (err) {
      console.error('Error adding experience skills:', err);
      throw err;
    }
  };

  const updateExperienceOrder = async (experienceIds: string[]) => {
    try {
      const result = await experienceService.updateExperienceOrder(experienceIds);
      await loadExperiences(); // Refresh experiences after reordering
      return result;
    } catch (err) {
      console.error('Error updating experience order:', err);
      throw err;
    }
  };

  return {
    experiences,
    loading,
    error,
    refetch: loadExperiences,
    getOngoingExperiences,
    searchExperiences,
    getExperiencesByTech,
    createExperience,
    updateExperience,
    deleteExperience,
    uploadExperienceImage,
    deleteExperienceImage,
    addExperienceLinks,
    addExperienceSkills,
    updateExperienceOrder
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