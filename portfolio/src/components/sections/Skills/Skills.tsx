// src/components/sections/Skills/Skills.tsx - HIGH PERFORMANCE VERSION WITH MOBILE-FIRST VIEW
'use client';

import React, { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Code2, 
  Sparkles, 
  Target,
  BarChart3,
  ChevronDown,
  X,
  RefreshCw
} from 'lucide-react';
import { useSkills } from '@/hooks/skills/useSkills';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';
import SkillCard from './components/SkillCard';
import SkillPreviewCard from './components/SkillPreviewCard';
import MovingStars from '@/components/ui/animations/Movingstars';
import { 
  getCategoryIconName, 
  renderCategoryIcon 
} from '@/utils/skills/iconUtils';
import type { SkillWithCategory } from '@/types/skills';
import { useSkillsActivity } from '@/hooks/common/useSectionActivity';

// Types
type ViewMode = 'grid' | 'list';
type SortBy = 'proficiency' | 'experience' | 'name' | 'category';

// ==========================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================

// Memoized Featured Skill Item Component
const FeaturedSkillItem = memo<{
  skill: SkillWithCategory;
  index: number;
  onSelect: (skill: SkillWithCategory) => void;
  isActive?: boolean;
}>(({ skill, index, onSelect, isActive = true }) => {
  const handleClick = useCallback(() => {
    onSelect(skill);
  }, [skill, onSelect]);


  return (
    <div className="flex-none w-56">
      <div 
        className="bg-gradient-to-br from-background-secondary/40 to-background-tertiary/20 
                  dark:from-background-secondary-dark/40 dark:to-background-tertiary-dark/20 
                  backdrop-blur-sm border border-border-primary/20 dark:border-border-primary-dark/20 
                  rounded-lg p-4 h-32 cursor-pointer hover:border-primary/50 dark:hover:border-primary-dark/50 
                  hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary-dark/10
                  transition-all duration-300 group hover:scale-105"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between mb-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
            style={{ backgroundColor: `${skill.category_color}20` }}
          >
            {renderCategoryIcon(skill.category_name, "w-4 h-4")}
          </div>
          <div className="flex items-center gap-1">
            <motion.div 
              className="w-1 h-1 rounded-full bg-primary dark:bg-primary-dark"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-primary dark:text-primary-dark font-medium">
              {skill.proficiency_level}/5
            </span>
          </div>
        </div>
        
        <h3 className="text-text-primary dark:text-text-primary-dark font-medium text-sm mb-1 line-clamp-1 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
          {skill.name}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
            {skill.years_of_experience}y exp
          </span>
          <span 
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ 
              backgroundColor: `${skill.category_color}15`,
              color: skill.category_color 
            }}
          >
            {skill.category_name.split(' ')[0]}
          </span>
        </div>
        
        {/* Animated progress bar */}
        <div className="h-1 bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full relative"
            style={{ backgroundColor: skill.category_color }}
            initial={{ width: 0 }}
            animate={{ width: `${(skill.proficiency_level / 5) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
          >
            {/* Shimmer effect - only when active */}
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
});

// Memoized Category Button Component
const CategoryButton = memo<{
  category: { id: string; name: string; color: string; icon: string };
  skillCount: number;
  isSelected: boolean;
  onClick: (id: string) => void;
}>(({ category, skillCount, isSelected, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(category.id);
  }, [category.id, onClick]);

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
        isSelected
          ? 'text-white shadow-md'
          : 'bg-background-secondary/50 dark:bg-background-secondary-dark/50 text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark border border-border-primary/20 dark:border-border-primary-dark/20'
      }`}
      style={isSelected ? { backgroundColor: category.color } : {}}
    >
      {renderCategoryIcon(category.name, "w-3 h-3")}
      {category.name} ({skillCount})
    </button>
  );
});

// ==========================================
// MAIN COMPONENT
// ==========================================

const Skills: React.FC = memo(() => {
  // ✅ Activity detection
  const { isActive } = useSkillsActivity();
  
  // Mobile detection
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // State - viewMode will be set based on screen size
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid'); // Will be updated based on screen size
  const [sortBy, setSortBy] = useState<SortBy>('proficiency');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<SkillWithCategory | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Hooks with lean interface
  const {
    skills,
    categories,
    loading,
    error,
    clearFilters,
    setSearchQuery,
    refetch
  } = useSkills();

  // Set default view mode based on screen size
  useEffect(() => {
    setViewMode(isMobile ? 'list' : 'grid');
  }, [isMobile]);

  // Memoized dynamic categories - expensive computation
  const dynamicCategories = useMemo(() => {
    if (skills.length === 0) return [];

    const categoryMap = new Map();
    
    skills.forEach(skill => {
      const categoryKey = skill.category_id || skill.category_name;
      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, {
          id: skill.category_id || skill.category_name.toLowerCase().replace(/\s+/g, '-'),
          name: skill.category_name,
          color: skill.category_color || '#6b7280',
          icon: getCategoryIconName(skill.category_name),
          count: 0
        });
      }
      categoryMap.get(categoryKey).count++;
    });

    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [skills]);

  const displayCategories = useMemo(() => 
    dynamicCategories.length > 0 ? dynamicCategories : categories,
    [dynamicCategories, categories]
  );

  const featuredSkills = useMemo(() => {
    if (skills.length === 0) return [];
    
    let featured = skills.filter(skill => skill.is_featured === true);
    
    if (featured.length === 0) {
      featured = skills
        .filter(skill => skill.proficiency_level >= 4)
        .sort((a, b) => b.proficiency_level - a.proficiency_level)
        .slice(0, 8);
    }
    
    if (featured.length === 0) {
      featured = skills
        .sort((a, b) => {
          if (b.proficiency_level !== a.proficiency_level) {
            return b.proficiency_level - a.proficiency_level;
          }
          return b.years_of_experience - a.years_of_experience;
        })
        .slice(0, 8);
    }
    
    return featured;
  }, [skills]);

  // Memoized filtered and sorted skills - most expensive computation
  const filteredAndSortedSkills = useMemo(() => {
    let filtered = skills;

    // Apply search filter
    if (localSearchQuery) {
      const query = localSearchQuery.toLowerCase();
      filtered = filtered.filter(skill => 
        skill.name.toLowerCase().includes(query) ||
        (skill.description && skill.description.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(skill => 
        skill.category_id === selectedCategory ||
        skill.category_name.toLowerCase().replace(/\s+/g, '-') === selectedCategory ||
        skill.category_name === selectedCategory
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'proficiency':
          return b.proficiency_level - a.proficiency_level;
        case 'experience':
          return b.years_of_experience - a.years_of_experience;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category_name.localeCompare(b.category_name);
        default:
          return 0;
      }
    });
  }, [skills, localSearchQuery, selectedCategory, sortBy]);

  // ==========================================
  // OPTIMIZED EVENT HANDLERS
  // ==========================================

  const handleSkillSelect = useCallback((skill: SkillWithCategory) => {
    setSelectedSkill(skill);
  }, []);

  const handleClearFilters = useCallback(() => {
    setLocalSearchQuery('');
    setSelectedCategory('');
    setSortBy('proficiency');
    clearFilters();
  }, [clearFilters]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    
    // Debounced search to backend
    const timeoutId = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [setSearchQuery]);

  // Enhanced view mode handler with mobile consideration
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // ==========================================
  // EFFECTS
  // ==========================================

  useEffect(() => {
    if (!loading) {
      setIsInitialized(true);
    }
  }, [loading]);

  // ✅ Activity logging
  useEffect(() => {
    console.log(`🎨 Skills Section: ${isActive ? 'ACTIVE' : 'SUSPENDED'}`);
  }, [isActive]);

  // ==========================================
  // RENDER OPTIMIZATIONS
  // ==========================================

  // Early returns for loading/error states
  if (!isInitialized) {
    return (
      <section className="relative min-h-screen bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MovingStars />
        </div>
        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-xl mb-2">Loading Skills...</div>
            <div className="text-gray-400 text-sm">Fetching skills from database</div>
          </div>
        </div>
      </section>
    );
  }

  if (error && skills.length === 0) {
    return (
      <section className="relative min-h-screen bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MovingStars />
        </div>
        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-red-400 text-xl mb-2">Failed to Load Skills</div>
            <div className="text-gray-400 text-sm mb-4">{error}</div>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="relative bg-black overflow-hidden py-24">
      {/* Moving Stars Background - Activity aware */}
      <div className="absolute inset-0 z-0">
        {isActive && <MovingStars isActive={isActive} starCount={50} />}
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        
        {/* Compact Header */}
        <div className="text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My <span className="text-primary">Skills</span>
          </motion.h1>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Technical expertise across {displayCategories.length} categories
          </motion.p>

          {/* Optimized Stats */}
          <motion.div 
            className="flex items-center justify-center gap-6 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-primary font-semibold">{skills.length}</span>
              <span className="text-gray-400">Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-primary font-semibold">{displayCategories.length}</span>
              <span className="text-gray-400">Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-semibold">{featuredSkills.length}</span>
              <span className="text-gray-400">Featured</span>
            </div>
          </motion.div>
        </div>

        {/* Optimized Featured Skills Marquee */}
        {featuredSkills.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Featured Skills
              </h2>
            </div>
            
            {/* Auto-Scrolling Marquee Container */}
            <div 
              className="relative overflow-hidden rounded-lg group"
              onMouseEnter={(e) => {
                if (isActive) {
                  const animations = e.currentTarget.querySelectorAll('[data-marquee]');
                  animations.forEach(el => {
                    (el as HTMLElement).style.animationPlayState = 'paused';
                  });
                }
              }}
              onMouseLeave={(e) => {
                if (isActive) {
                  const animations = e.currentTarget.querySelectorAll('[data-marquee]');
                  animations.forEach(el => {
                    (el as HTMLElement).style.animationPlayState = 'running';
                  });
                }
              }}
            >
              {/* Gradient overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />
              
              {/* Scrolling container */}
              <div className="flex">
                {/* First set of skills */}
                <motion.div
                  data-marquee
                  className="flex gap-4 flex-shrink-0"
                  animate={isActive ? { x: [`0%`, `-100%`] } : {}}
                  transition={{
                    duration: featuredSkills.length * 3,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  {featuredSkills.map((skill, index) => (
                    <FeaturedSkillItem
                      key={skill.id}
                      skill={skill}
                      index={index}
                      onSelect={handleSkillSelect}
                      isActive={isActive}
                    />
                  ))}
                </motion.div>
                
                {/* Duplicate set for seamless loop */}
                <motion.div
                  data-marquee
                  className="flex gap-4 flex-shrink-0"
                  animate={isActive ? { x: [`0%`, `-100%`] } : {}}
                  transition={{
                    duration: featuredSkills.length * 3,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  {featuredSkills.map((skill, index) => (
                    <FeaturedSkillItem
                      key={`duplicate-${skill.id}`}
                      skill={skill}
                      index={index}
                      onSelect={handleSkillSelect}
                      isActive={isActive}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Optimized Controls */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Single Row Controls */}
          <div className="flex flex-wrap gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                         border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg
                         text-text-primary dark:text-text-primary-dark placeholder-text-tertiary dark:placeholder-text-tertiary-dark text-sm
                         focus:outline-none focus:ring-1 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary/50 dark:focus:border-primary-dark/50
                         transition-all duration-200"
              />
            </div>

            {/* View Mode - Enhanced for mobile preference */}
            <div className="flex bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                          border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg p-0.5">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${
                  viewMode === 'grid'
                    ? 'bg-primary dark:bg-primary-dark text-white'
                    : 'text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
                }`}
                title={isMobile ? "Grid view (better on desktop)" : "Grid view"}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${
                  viewMode === 'list'
                    ? 'bg-primary dark:bg-primary-dark text-white'
                    : 'text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
                }`}
                title={isMobile ? "List view (optimized for mobile)" : "List view"}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                       border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg
                       text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200 text-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Mobile View Mode Indicator */}
          {isMobile && (
            <div className="mb-4 text-xs text-center">
              <span className="text-text-tertiary dark:text-text-tertiary-dark">
                💡 List view is optimized for mobile • Switch to grid view if preferred
              </span>
            </div>
          )}

          {/* Optimized Category Pills */}
          {displayCategories.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => handleCategorySelect('')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedCategory === ''
                    ? 'bg-primary dark:bg-primary-dark text-white'
                    : 'bg-background-secondary/50 dark:bg-background-secondary-dark/50 text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark border border-border-primary/20 dark:border-border-primary-dark/20'
                }`}
              >
                All ({skills.length})
              </button>
              
              {displayCategories.map((category) => {
                const isSelected = selectedCategory === category.id || selectedCategory === category.name;
                const categorySkillCount = skills.filter(skill => 
                  skill.category_id === category.id || 
                  skill.category_name === category.name ||
                  skill.category_name.toLowerCase().replace(/\s+/g, '-') === category.id
                ).length;
                
                return (
                  <CategoryButton
                    key={category.id}
                    category={category}
                    skillCount={categorySkillCount}
                    isSelected={isSelected}
                    onClick={handleCategorySelect}
                  />
                );
              })}
            </div>
          )}

          {/* Advanced Filters - Enhanced for Mobile */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-background-secondary/30 dark:bg-background-secondary-dark/30 
                         border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg p-4 mt-4"
              >
                <div className="space-y-4">
                  {/* Mobile Category Filter */}
                  <div className="md:hidden">
                    <label className="block text-xs text-text-secondary dark:text-text-secondary-dark mb-2">
                      <Target className="w-3 h-3 inline mr-1" />
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      className="w-full px-3 py-2 bg-background-primary dark:bg-background-primary-dark 
                               border border-border-primary/20 dark:border-border-primary-dark/20 rounded-md
                               text-text-primary dark:text-text-primary-dark text-sm
                               focus:outline-none focus:ring-1 focus:ring-primary/50 dark:focus:ring-primary-dark/50"
                    >
                      <option value="">All Categories ({skills.length})</option>
                      {displayCategories.map(category => {
                        const categorySkillCount = skills.filter(skill => 
                          skill.category_id === category.id || 
                          skill.category_name === category.name ||
                          skill.category_name.toLowerCase().replace(/\s+/g, '-') === category.id
                        ).length;
                        
                        return (
                          <option key={category.id} value={category.id}>
                            {category.name} ({categorySkillCount})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  
                  {/* Sort By */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-text-secondary dark:text-text-secondary-dark mb-2">
                        <BarChart3 className="w-3 h-3 inline mr-1" />
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortBy)}
                        className="w-full px-3 py-2 bg-background-primary dark:bg-background-primary-dark 
                                 border border-border-primary/20 dark:border-border-primary-dark/20 rounded-md
                                 text-text-primary dark:text-text-primary-dark text-sm
                                 focus:outline-none focus:ring-1 focus:ring-primary/50 dark:focus:ring-primary-dark/50"
                      >
                        <option value="proficiency">Proficiency Level</option>
                        <option value="experience">Years of Experience</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="category">Category</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={handleClearFilters}
                        className="flex items-center gap-1 px-3 py-2 text-text-secondary dark:text-text-secondary-dark 
                                 hover:text-text-primary dark:hover:text-text-primary-dark transition-colors duration-200 text-sm"
                      >
                        <X className="w-3 h-3" />
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Summary - Compact */}
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="text-text-secondary dark:text-text-secondary-dark">
              {filteredAndSortedSkills.length} of {skills.length} skills
              {isMobile && viewMode === 'list' && (
                <span className="ml-2 text-primary">• List view</span>
              )}
            </div>
            {selectedCategory && (
              <div className="flex items-center gap-2">
                <span className="text-text-secondary dark:text-text-secondary-dark">Filter:</span>
                <span 
                  className="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"
                  style={{ 
                    backgroundColor: `${displayCategories.find(cat => cat.id === selectedCategory)?.color}20`,
                    color: displayCategories.find(cat => cat.id === selectedCategory)?.color
                  }}
                >
                  {displayCategories.find(cat => cat.id === selectedCategory)?.name}
                </span>
                <button
                  onClick={() => handleCategorySelect('')}
                  className="text-text-tertiary dark:text-text-tertiary-dark hover:text-text-primary dark:hover:text-text-primary-dark"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Optimized Skills Grid */}
        {skills.length > 0 && (
          <motion.div
            className="mb-40 mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedSkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.03,
                        layout: { duration: 0.3 }
                      }}
                      className="h-40"
                    >
                      <SkillCard
                        skill={skill}
                        compact={true}
                        className="w-full h-full"
                        onClick={() => handleSkillSelect(skill)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* List View - Mobile Optimized */
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedSkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.02,
                        layout: { duration: 0.3 }
                      }}
                      className="h-20"
                    >
                      <SkillCard
                        skill={skill}
                        compact={false}
                        className="w-full h-full"
                        onClick={() => handleSkillSelect(skill)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {/* No Skills Message */}
        {skills.length === 0 && !loading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Code2 className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Skills Data</h3>
            <p className="text-gray-400 text-sm mb-4">Skills data is not available</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Data
            </button>
          </motion.div>
        )}

        {/* No Results Message */}
        {skills.length > 0 && filteredAndSortedSkills.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No skills found</h3>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 text-sm"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Enhanced Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              className="bg-background-primary/95 dark:bg-background-primary-dark/95 backdrop-blur-lg rounded-xl 
                       border border-border-primary/30 dark:border-border-primary-dark/30
                       max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${selectedSkill.category_color}20` }}
                    >
                      {renderCategoryIcon(selectedSkill.category_name, "w-5 h-5")}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
                        {selectedSkill.name}
                      </h3>
                      <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
                        {selectedSkill.category_name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="p-2 rounded-lg hover:bg-background-secondary dark:hover:bg-background-secondary-dark
                             text-text-tertiary dark:text-text-tertiary-dark hover:text-text-primary dark:hover:text-text-primary-dark
                             transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <SkillPreviewCard
                  skill={selectedSkill}
                  isVisible={true}
                  className="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ✅ Debug indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-32 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50 border border-purple-500">
          <div>Skills: {isActive ? '🟢 ACTIVE' : '🔴 SUSPENDED'}</div>
          <div>Stars: {isActive ? '🌟 ON' : '⭐ OFF'}</div>
          <div>Marquee: {isActive ? '🎠 ON' : '🚫 OFF'}</div>
        </div>
      )}
    </section>
  );
});

// Set display names for better debugging
FeaturedSkillItem.displayName = 'FeaturedSkillItem';
CategoryButton.displayName = 'CategoryButton';
Skills.displayName = 'Skills';
export default memo(Skills);