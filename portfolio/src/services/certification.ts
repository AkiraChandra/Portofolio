// src/services/certifications.ts
import { supabase } from '@/lib/supabase';
import { 
  Certification, 
  CertificationDB, 
  CertificationLink, 
  CertificationSkill,
  CertificationFilters,
  CertificationSearchOptions,
  CertificationStats,
  ImageUploadOptions,
  ImageUploadResponse
} from '@/types/certification';

const transformDatabaseCertification = async (dbCertification: CertificationDB): Promise<Certification> => {
  try {
    // Fetch related data in parallel
    const [linksResult, skillsResult] = await Promise.all([
      // Fetch certification links
      supabase
        .from('certification_links')
        .select('*')
        .eq('certification_id', dbCertification.id)
        .order('order_index', { ascending: true }),
      
      // Fetch certification skills
      supabase
        .from('certification_skills')
        .select('*')
        .eq('certification_id', dbCertification.id)
        .order('order_index', { ascending: true })
    ]);

    // Handle potential errors
    if (linksResult.error) {
      console.error('Error fetching certification links:', linksResult.error);
    }
    if (skillsResult.error) {
      console.error('Error fetching certification skills:', skillsResult.error);
    }

    // Parse dates
    const issueDate = new Date(dbCertification.issue_date);
    const expirationDate = dbCertification.expiration_date ? new Date(dbCertification.expiration_date) : undefined;
    
    // Calculate computed properties
    const now = new Date();
    const isExpired = expirationDate ? expirationDate < now : false;
    const daysUntilExpiration = expirationDate ? Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : undefined;
    const isExpiringSoon = daysUntilExpiration ? daysUntilExpiration <= 90 && daysUntilExpiration > 0 : false;

    return {
      id: dbCertification.id,
      name: dbCertification.name,
      issuingOrganization: dbCertification.issuing_organization,
      issueDate,
      expirationDate,
      credentialId: dbCertification.credential_id || undefined,
      credentialUrl: dbCertification.credential_url || undefined,
      description: dbCertification.description || undefined,
      skills: dbCertification.skills || undefined,
      status: dbCertification.status,
      certificateImage: dbCertification.certificate_image || undefined,
      organizationLogo: dbCertification.organization_logo || undefined,
      isVerified: dbCertification.is_verified,
      verificationUrl: dbCertification.verification_url || undefined,
      featured: dbCertification.featured,
      orderIndex: dbCertification.order_index,
      metadata: dbCertification.metadata || undefined,
      
      // Related data
      links: linksResult.data?.map(link => ({
        id: link.id,
        label: link.label,
        url: link.url,
        link_type: link.link_type,
        order_index: link.order_index
      })) || undefined,
      
      skillDetails: skillsResult.data?.map(skill => ({
        id: skill.id,
        skill_name: skill.skill_name,
        skill_level: skill.skill_level,
        order_index: skill.order_index
      })) || undefined,
      
      // Computed properties
      isExpired,
      daysUntilExpiration,
      isExpiringSoon
    };
  } catch (error) {
    console.error('Error transforming certification:', error);
    throw error;
  }
};


export const certificationService = {
  // Get all certifications with their related data
  async getCertifications(options: CertificationSearchOptions = {}) {
    try {
      let query = supabase
        .from('certifications')
        .select('*');

      // Apply filters
      if (options.filters) {
        const { status, featured, organization, issueDateRange, expirationDateRange } = options.filters;
        
        if (status && status !== 'all') {
          query = query.eq('status', status);
        }
        
        if (featured !== undefined) {
          query = query.eq('featured', featured);
        }
        
        if (organization) {
          query = query.ilike('issuing_organization', `%${organization}%`);
        }
        
        if (issueDateRange?.start) {
          query = query.gte('issue_date', issueDateRange.start.toISOString().split('T')[0]);
        }
        
        if (issueDateRange?.end) {
          query = query.lte('issue_date', issueDateRange.end.toISOString().split('T')[0]);
        }
        
        if (expirationDateRange?.start) {
          query = query.gte('expiration_date', expirationDateRange.start.toISOString().split('T')[0]);
        }
        
        if (expirationDateRange?.end) {
          query = query.lte('expiration_date', expirationDateRange.end.toISOString().split('T')[0]);
        }
      }

      // Apply search
      if (options.query) {
        query = query.or(`name.ilike.%${options.query}%,issuing_organization.ilike.%${options.query}%,description.ilike.%${options.query}%`);
      }

      // Apply sorting
      const sortBy = options.sortBy || 'order_index';
      const sortOrder = options.sortOrder || 'asc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data: certifications, error } = await query;

      if (error) throw error;
      if (!certifications) return [];

      return await Promise.all(
        certifications.map(certification => transformDatabaseCertification(certification))
      );
    } catch (error) {
      console.error('Error in getCertifications:', error);
      throw error;
    }
  },

  // Get featured certifications
  async getFeaturedCertifications(limit: number = 6) {
    try {
      const { data: certifications, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('featured', true)
        .order('order_index', { ascending: true })
        .limit(limit);

      if (error) throw error;
      if (!certifications) return [];

      return await Promise.all(
        certifications.map(certification => transformDatabaseCertification(certification))
      );
    } catch (error) {
      console.error('Error in getFeaturedCertifications:', error);
      throw error;
    }
  },
};