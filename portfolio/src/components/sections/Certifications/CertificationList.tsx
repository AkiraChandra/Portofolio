// src/components/sections/Certifications/CertificationsList.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Award, 
  Clock, 
  Star,
  AlertTriangle,
  CheckCircle,
  X,
  Loader
} from 'lucide-react';
import CertificationCard from './CertificationCard';
import { Certification, CertificationFilters } from '@/types/certification';

interface CertificationsListProps {
  certifications: Certification[];
  loading?: boolean;
  error?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  showStats?: boolean;
  onCertificationSelect?: (certification: Certification) => void;
}

const CertificationsList: React.FC<CertificationsListProps> = ({
  certifications,
  loading = false,
  error,
  showSearch = true,
  showFilters = true,
  showStats = true,
  onCertificationSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CertificationFilters>({});
  const [sortBy, setSortBy] = useState<'issue_date' | 'name' | 'organization' | 'expiration_date'>('issue_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Filter and sort certifications
  const filteredCertifications = useMemo(() => {
    let filtered = [...certifications];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cert => 
        cert.name.toLowerCase().includes(query) ||
        cert.issuingOrganization.toLowerCase().includes(query) ||
        cert.description?.toLowerCase().includes(query) ||
        cert.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(cert => {
        if (filters.status === 'expired') return cert.isExpired;
        if (filters.status === 'active') return !cert.isExpired;
        return cert.status === filters.status;
      });
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter(cert => cert.featured === filters.featured);
    }

    if (filters.organization) {
      filtered = filtered.filter(cert => 
        cert.issuingOrganization.toLowerCase().includes(filters.organization!.toLowerCase())
      );
    }

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter(cert => 
        cert.skills?.some(skill => 
          filters.skills!.some(filterSkill => 
            skill.toLowerCase().includes(filterSkill.toLowerCase())
          )
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'organization':
          comparison = a.issuingOrganization.localeCompare(b.issuingOrganization);
          break;
        case 'issue_date':
          comparison = a.issueDate.getTime() - b.issueDate.getTime();
          break;
        case 'expiration_date':
          if (!a.expirationDate && !b.expirationDate) comparison = 0;
          else if (!a.expirationDate) comparison = 1;
          else if (!b.expirationDate) comparison = -1;
          else comparison = a.expirationDate.getTime() - b.expirationDate.getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [certifications, searchQuery, filters, sortBy, sortOrder]);

  // Calculate stats
  const stats = useMemo(() => {
    const active = certifications.filter(cert => !cert.isExpired).length;
    const expired = certifications.filter(cert => cert.isExpired).length;
    const expiringSoon = certifications.filter(cert => cert.isExpiringSoon).length;
    const featured = certifications.filter(cert => cert.featured).length;
    
    return { total: certifications.length, active, expired, expiringSoon, featured };
  }, [certifications]);

  // Get unique organizations for filter
  const organizations = useMemo(() => {
    const orgs = [...new Set(certifications.map(cert => cert.issuingOrganization))];
    return orgs.sort();
  }, [certifications]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({});
    setSortBy('issue_date');
    setSortOrder('desc');
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-primary dark:text-primary-dark" />
          <p className="text-text-secondary dark:text-text-secondary-dark">
            Loading certifications...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400" />
          <div>
            <p className="text-red-500 dark:text-red-400 font-medium">
              Failed to load certifications
            </p>
            <p className="text-text-secondary dark:text-text-secondary-dark text-sm mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {showStats && stats.total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-background-secondary/50 dark:bg-background-secondary-dark/50 rounded-lg p-4 text-center">
            <Award className="w-6 h-6 text-primary dark:text-primary-dark mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{stats.total}</p>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Total</p>
          </div>
          
          <div className="bg-background-secondary/50 dark:bg-background-secondary-dark/50 rounded-lg p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{stats.active}</p>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Active</p>
          </div>
          
          <div className="bg-background-secondary/50 dark:bg-background-secondary-dark/50 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{stats.expiringSoon}</p>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Expiring Soon</p>
          </div>
          
          <div className="bg-background-secondary/50 dark:bg-background-secondary-dark/50 rounded-lg p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{stats.expired}</p>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Expired</p>
          </div>
          
          <div className="bg-background-secondary/50 dark:bg-background-secondary-dark/50 rounded-lg p-4 text-center">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{stats.featured}</p>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Featured</p>
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      {(showSearch || showFilters) && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            {showSearch && (
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary dark:text-text-tertiary-dark" />
                <input
                  type="text"
                  placeholder="Search certifications, organizations, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                           border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg 
                           text-text-primary dark:text-text-primary-dark placeholder-text-tertiary dark:placeholder-text-tertiary-dark
                           focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50"
                />
              </div>
            )}

            {/* Filter and Sort Controls */}
            <div className="flex gap-2">
              {showFilters && (
                <button
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors
                           ${showFiltersPanel 
                             ? 'bg-primary/10 border-primary/30 text-primary dark:text-primary-dark' 
                             : 'bg-background-secondary/50 dark:bg-background-secondary-dark/50 border-border-primary/20 dark:border-border-primary-dark/20 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
                           }`}
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>
              )}

              <button
                onClick={toggleSort}
                className="flex items-center gap-2 px-4 py-3 bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                         border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg 
                         text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
                <span>{sortBy.replace('_', ' ')}</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFiltersPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-background-secondary/50 dark:bg-background-secondary-dark/50 rounded-lg p-4 border border-border-primary/20 dark:border-border-primary-dark/20"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status || 'all'}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as 'all' | 'active' | 'expired' | 'pending' }))}
                      className="w-full px-3 py-2 bg-background-primary dark:bg-background-primary-dark 
                               border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg 
                               text-text-primary dark:text-text-primary-dark text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {/* Organization Filter */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                      Organization
                    </label>
                    <select
                      value={filters.organization || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, organization: e.target.value || undefined }))}
                      className="w-full px-3 py-2 bg-background-primary dark:bg-background-primary-dark 
                               border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg 
                               text-text-primary dark:text-text-primary-dark text-sm"
                    >
                      <option value="">All Organizations</option>
                      {organizations.map(org => (
                        <option key={org} value={org}>{org}</option>
                      ))}
                    </select>
                  </div>

                  {/* Featured Filter */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                      Featured
                    </label>
                    <select
                      value={filters.featured === undefined ? 'all' : filters.featured.toString()}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        featured: e.target.value === 'all' ? undefined : e.target.value === 'true'
                      }))}
                      className="w-full px-3 py-2 bg-background-primary dark:bg-background-primary-dark 
                               border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg 
                               text-text-primary dark:text-text-primary-dark text-sm"
                    >
                      <option value="all">All Certifications</option>
                      <option value="true">Featured Only</option>
                      <option value="false">Non-Featured</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border-primary/20 dark:border-border-primary-dark/20">
                  <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
                    Showing {filteredCertifications.length} of {certifications.length} certifications
                  </span>
                  
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-text-secondary dark:text-text-secondary-dark 
                             hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Certifications Grid */}
      {filteredCertifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Award className="w-16 h-16 text-text-tertiary dark:text-text-tertiary-dark mb-4" />
          <h3 className="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-2">
            {searchQuery || Object.keys(filters).length > 0 ? 'No certifications found' : 'No certifications yet'}
          </h3>
          <p className="text-text-secondary dark:text-text-secondary-dark">
            {searchQuery || Object.keys(filters).length > 0 
              ? 'Try adjusting your search or filters' 
              : 'Add your first certification to get started'
            }
          </p>
          {(searchQuery || Object.keys(filters).length > 0) && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 text-sm text-primary dark:text-primary-dark 
                       hover:text-primary-dark dark:hover:text-primary transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {filteredCertifications.map((certification, index) => (
              <motion.div
                key={certification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CertificationCard
                  certification={certification}
                  onViewDetails={onCertificationSelect}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CertificationsList;