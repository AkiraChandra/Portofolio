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

// Transform frontend certification for database insert/update
const transformCertificationForInsert = (certification: Partial<Certification>): Omit<CertificationDB, 'id' | 'created_at' | 'updated_at'> => {
  return {
    name: certification.name!,
    issuing_organization: certification.issuingOrganization!,
    issue_date: certification.issueDate!.toISOString().split('T')[0], // Convert to YYYY-MM-DD
    expiration_date: certification.expirationDate ? certification.expirationDate.toISOString().split('T')[0] : null,
    credential_id: certification.credentialId || null,
    credential_url: certification.credentialUrl || null,
    description: certification.description || null,
    skills: certification.skills || null,
    status: certification.status || 'active',
    certificate_image: certification.certificateImage || null,
    organization_logo: certification.organizationLogo || null,
    is_verified: certification.isVerified || false,
    verification_url: certification.verificationUrl || null,
    featured: certification.featured || false,
    order_index: certification.orderIndex || 0,
    metadata: certification.metadata || null
  };
};

// Upload organization logo
export const uploadOrganizationLogo = async (file: File, organizationName: string): Promise<string> => {
  try {
    // Create filename from organization name
    const fileName = `${organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${file.name.split('.').pop()}`;
    const filePath = `organization-logos/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file, {
        upsert: true // Allow overwriting existing files
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading organization logo:', error);
    throw error;
  }
};

// Upload certificate image
export const uploadCertificateImage = async (file: File, certificationId: string): Promise<string> => {
  try {
    const filePath = `certificates/${certificationId}/${Date.now()}-${file.name}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading certificate image:', error);
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

  // Get active certifications
  async getActiveCertifications() {
    try {
      const { data: certifications, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('status', 'active')
        .order('issue_date', { ascending: false });

      if (error) throw error;
      if (!certifications) return [];

      return await Promise.all(
        certifications.map(certification => transformDatabaseCertification(certification))
      );
    } catch (error) {
      console.error('Error in getActiveCertifications:', error);
      throw error;
    }
  },

  // Get certifications expiring soon
  async getExpiringSoonCertifications(days: number = 90) {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      
      const { data: certifications, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('status', 'active')
        .not('expiration_date', 'is', null)
        .lte('expiration_date', futureDate.toISOString().split('T')[0])
        .gte('expiration_date', new Date().toISOString().split('T')[0])
        .order('expiration_date', { ascending: true });

      if (error) throw error;
      if (!certifications) return [];

      return await Promise.all(
        certifications.map(certification => transformDatabaseCertification(certification))
      );
    } catch (error) {
      console.error('Error in getExpiringSoonCertifications:', error);
      throw error;
    }
  },

  // Get single certification by ID
  async getCertificationById(id: string) {
    try {
      const { data: certification, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!certification) return null;

      return await transformDatabaseCertification(certification);
    } catch (error) {
      console.error('Error in getCertificationById:', error);
      throw error;
    }
  },

  // Create new certification
  async createCertification(certificationData: Partial<Certification>) {
    try {
      const transformedData = transformCertificationForInsert(certificationData);
      
      const { data, error } = await supabase
        .from('certifications')
        .insert([transformedData])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      // Add related data if provided
      if (certificationData.links?.length) {
        await this.addCertificationLinks(data.id, certificationData.links);
      }

      if (certificationData.skillDetails?.length) {
        await this.addCertificationSkills(data.id, certificationData.skillDetails);
      }

      return await transformDatabaseCertification(data);
    } catch (error) {
      console.error('Error in createCertification:', error);
      throw error;
    }
  },

  // Update certification
  async updateCertification(id: string, certificationData: Partial<Certification>) {
    try {
      const transformedData = transformCertificationForInsert(certificationData);

      const { data, error } = await supabase
        .from('certifications')
        .update(transformedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from update');

      return await transformDatabaseCertification(data);
    } catch (error) {
      console.error('Error in updateCertification:', error);
      throw error;
    }
  },

  // Delete certification and its related data
  async deleteCertification(id: string) {
    try {
      // Delete related data first (due to foreign key constraints)
      await Promise.all([
        supabase.from('certification_links').delete().eq('certification_id', id),
        supabase.from('certification_skills').delete().eq('certification_id', id)
      ]);

      // Then delete the certification
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error in deleteCertification:', error);
      throw error;
    }
  },

  // Add certification links
  async addCertificationLinks(certificationId: string, links: Omit<CertificationLink, 'id' | 'certification_id'>[]) {
    try {
      const linksWithCertificationId = links.map((link, index) => ({
        certification_id: certificationId,
        label: link.label,
        url: link.url,
        link_type: link.link_type,
        order_index: link.order_index || index
      }));

      const { error } = await supabase
        .from('certification_links')
        .insert(linksWithCertificationId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error adding certification links:', error);
      throw error;
    }
  },

  // Add certification skills
  async addCertificationSkills(certificationId: string, skills: Omit<CertificationSkill, 'id' | 'certification_id'>[]) {
    try {
      const skillsWithCertificationId = skills.map((skill, index) => ({
        certification_id: certificationId,
        skill_name: skill.skill_name,
        skill_level: skill.skill_level,
        order_index: skill.order_index || index
      }));

      const { error } = await supabase
        .from('certification_skills')
        .insert(skillsWithCertificationId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error adding certification skills:', error);
      throw error;
    }
  },

  // Get certification statistics
  async getCertificationStats(): Promise<CertificationStats> {
    try {
      const { data: certifications, error } = await supabase
        .from('certifications')
        .select('*');

      if (error) throw error;
      if (!certifications) return {
        total: 0,
        active: 0,
        expired: 0,
        expiringSoon: 0,
        featured: 0,
        topSkills: [],
        topOrganizations: []
      };

      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 90);

      const stats = certifications.reduce((acc, cert) => {
        acc.total++;
        
        if (cert.status === 'active') acc.active++;
        if (cert.status === 'expired') acc.expired++;
        if (cert.featured) acc.featured++;
        
        // Check if expiring soon
        if (cert.expiration_date) {
          const expDate = new Date(cert.expiration_date);
          if (expDate > now && expDate <= futureDate) {
            acc.expiringSoon++;
          }
        }

        return acc;
      }, {
        total: 0,
        active: 0,
        expired: 0,
        expiringSoon: 0,
        featured: 0
      });

      // Calculate top skills and organizations
      const skillCount: Record<string, number> = {};
      const orgCount: Record<string, number> = {};

      certifications.forEach(cert => {
        // Count skills
        if (cert.skills) {
          cert.skills.forEach((skill: string) => {
            skillCount[skill] = (skillCount[skill] || 0) + 1;
          });
        }

        // Count organizations
        orgCount[cert.issuing_organization] = (orgCount[cert.issuing_organization] || 0) + 1;
      });

      const topSkills = Object.entries(skillCount)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const topOrganizations = Object.entries(orgCount)
        .map(([organization, count]) => ({ organization, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        ...stats,
        topSkills,
        topOrganizations
      };
    } catch (error) {
      console.error('Error in getCertificationStats:', error);
      throw error;
    }
  },

  // Update certification order
  async updateCertificationOrder(certificationIds: string[]) {
    try {
      const { error } = await supabase
        .rpc('update_certification_order', {
          certification_ids: certificationIds
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating certification order:', error);
      throw error;
    }
  },

  // Upload organization logo
  async uploadOrganizationLogo(file: File, organizationName: string) {
    return uploadOrganizationLogo(file, organizationName);
  },

  // Upload certificate image
  async uploadCertificateImage(file: File, certificationId: string) {
    return uploadCertificateImage(file, certificationId);
  }
};