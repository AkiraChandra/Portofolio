// src/hooks/certifications/useCertifications.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  Certification, 
  CertificationSearchOptions,
} from '@/types/certification';
import { certificationService } from '@/services/certification';

export const useCertifications = (options: CertificationSearchOptions = {}) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCertifications = useCallback(async () => {
    try {
      setLoading(true);
      const loadedCertifications = await certificationService.getCertifications(options);
      setCertifications(loadedCertifications);
      setError(null);
    } catch (err) {
      console.error('Error loading certifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load certifications');
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(options)]);

  useEffect(() => {
    loadCertifications();
  }, [loadCertifications]);

  const getFeaturedCertifications = async (limit: number = 6) => {
    try {
      return await certificationService.getFeaturedCertifications(limit);
    } catch (err) {
      console.error('Error loading featured certifications:', err);
      throw err;
    }
  };


  return {
    certifications,
    loading,
    error,
    refetch: loadCertifications,
    getFeaturedCertifications
  };
};
