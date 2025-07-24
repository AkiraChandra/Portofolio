// src/hooks/certifications/useCertifications.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  Certification, 
  CertificationLink, 
  CertificationSkill,
  CertificationFilters,
  CertificationSearchOptions,
  CertificationStats 
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

  const getActiveCertifications = async () => {
    try {
      return await certificationService.getActiveCertifications();
    } catch (err) {
      console.error('Error loading active certifications:', err);
      throw err;
    }
  };

  const getExpiringSoonCertifications = async (days: number = 90) => {
    try {
      return await certificationService.getExpiringSoonCertifications(days);
    } catch (err) {
      console.error('Error loading expiring certifications:', err);
      throw err;
    }
  };

  const createCertification = async (certificationData: Partial<Certification>) => {
    try {
      const newCertification = await certificationService.createCertification(certificationData);
      await loadCertifications(); // Refresh the list
      return newCertification;
    } catch (err) {
      console.error('Error creating certification:', err);
      throw err;
    }
  };

  const updateCertification = async (id: string, certificationData: Partial<Certification>) => {
    try {
      const updatedCertification = await certificationService.updateCertification(id, certificationData);
      await loadCertifications(); // Refresh the list
      return updatedCertification;
    } catch (err) {
      console.error('Error updating certification:', err);
      throw err;
    }
  };

  const deleteCertification = async (id: string) => {
    try {
      await certificationService.deleteCertification(id);
      await loadCertifications(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error deleting certification:', err);
      throw err;
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await certificationService.updateCertification(id, { featured });
      await loadCertifications(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error toggling featured status:', err);
      throw err;
    }
  };

  const uploadOrganizationLogo = async (file: File, organizationName: string) => {
    try {
      return await certificationService.uploadOrganizationLogo(file, organizationName);
    } catch (err) {
      console.error('Error uploading organization logo:', err);
      throw err;
    }
  };

  const uploadCertificateImage = async (file: File, certificationId: string) => {
    try {
      return await certificationService.uploadCertificateImage(file, certificationId);
    } catch (err) {
      console.error('Error uploading certificate image:', err);
      throw err;
    }
  };

  const updateOrder = async (certificationIds: string[]) => {
    try {
      await certificationService.updateCertificationOrder(certificationIds);
      await loadCertifications(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error updating certification order:', err);
      throw err;
    }
  };

  return {
    certifications,
    loading,
    error,
    refetch: loadCertifications,
    getFeaturedCertifications,
    getActiveCertifications,
    getExpiringSoonCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
    toggleFeatured,
    uploadOrganizationLogo,
    uploadCertificateImage,
    updateOrder
  };
};

// Hook for single certification
export const useSingleCertification = (id: string) => {
  const [certification, setCertification] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        setLoading(true);
        const data = await certificationService.getCertificationById(id);
        setCertification(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch certification'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertification();
    }
  }, [id]);

  return { certification, loading, error };
};

// Hook for certification statistics
export const useCertificationStats = () => {
  const [stats, setStats] = useState<CertificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await certificationService.getCertificationStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch certification stats'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, loading, error, refetch: loadStats };
};

// Hook for certification filters and search
export const useCertificationFilters = () => {
  const [filters, setFilters] = useState<CertificationFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'issue_date' | 'expiration_date' | 'name' | 'organization' | 'order_index'>('order_index');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const updateFilter = useCallback((key: keyof CertificationFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setSortBy('order_index');
    setSortOrder('asc');
  }, []);

  const getSearchOptions = useCallback((): CertificationSearchOptions => {
    return {
      query: searchQuery || undefined,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      sortBy,
      sortOrder
    };
  }, [filters, searchQuery, sortBy, sortOrder]);

  return {
    filters,
    searchQuery,
    sortBy,
    sortOrder,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    updateFilter,
    clearFilters,
    getSearchOptions
  };
};

// Hook for expiring certifications check
export const useExpiringCertifications = (days: number = 90) => {
  const [expiringCertifications, setExpiringCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExpiringCertifications = async () => {
      try {
        setLoading(true);
        const data = await certificationService.getExpiringSoonCertifications(days);
        setExpiringCertifications(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch expiring certifications'));
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringCertifications();

    // Set up interval to check for expiring certifications daily
    const interval = setInterval(fetchExpiringCertifications, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [days]);

  return { 
    expiringCertifications, 
    loading, 
    error,
    hasExpiringCertifications: expiringCertifications.length > 0
  };
};