// src/components/sections/Skills/Skills.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  TrendingUp, 
  Award,
  Users,
  Loader,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import MovingStars from '@/components/ui/animations/Movingstars';
import FeaturedSkillsCarousel from './components/FeaturedSkillsCarousel';
import SkillPreviewCard from './components/SkillPreviewCard';
import SkillCard from './components/SkillCard';
import { useSkills, useFeaturedSkills, useSkillsStats } from '@/hooks/skills/useSkills';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';
import type { SkillWithCategory, SkillFilters } from '@/types/skills';

type ViewMode = 'list' | 'grid';

const Skills: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<SkillWithCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Media queries
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  // Hooks
  const { skills: featuredSkills, loading: featuredLoading } = useFeaturedSkills();
  const { 
    skills, 
    categories, 
    loading, 
    error, 
    searchQuery: currentSearchQuery,
    setSearchQuery: updateSearchQuery,
    filters,
    setFilters,
    clearFilters
  } = useSkills({
    initialFilters: activeCategory !== 'all' ? { category_id: activeCategory } : {},
    initialSearchQuery: searchQuery
  });
  const { stats, loading: statsLoading } = useSkillsStats();

  // Filter skills by category
  const filteredSkills = useMemo(() => {
    if (activeCategory === 'all') return skills;
    return skills.filter(skill => skill.category_id === activeCategory);
  }, [skills, activeCategory]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, updateSearchQuery]);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      setFilters({});
    } else {
      setFilters({ ...filters, category_id: categoryId });
    }
  };

  // Auto-select first featured skill
  useEffect(() => {
    if (featuredSkills.length > 0 && !selectedSkill) {
      setSelectedSkill(featuredSkills[0]);
    }
  }, [featuredSkills, selectedSkill]);

  return (
    <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <MovingStars />
      </div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent dark:via-black/70 dark:to-black z-1" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary dark:text-text-primary-dark mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My Professional{' '}
            <span className="text-primary dark:text-primary-dark">Skills</span>
          </motion.h1>
          
          <motion.p
            className="text-base sm:text-lg md:text-xl text-text-secondary dark:text-text-secondary-dark max-w-3xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Showcasing my technical expertise, professional competencies, and continuous learning journey
          </motion.p>

          {/* Quick Stats */}
          {stats && !statsLoading && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-dark">
                  {stats.totalSkills}
                </div>
                <div className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary-dark">
                  Total Skills
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-500">
                  {stats.featuredSkills}
                </div>
                <div className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary-dark">
                  Featured
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-500">
                  {stats.avgProficiency}
                </div>
                <div className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary-dark">
                  Avg Level
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-500">
                  {stats.withCertifications}
                </div>
                <div className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary-dark">
                  Certified
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Featured Skills Section */}
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {featuredLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-primary dark:text-primary-dark" />
            </div>
          ) : featuredSkills.length > 0 ? (
            <>
              <FeaturedSkillsCarousel
                skills={featuredSkills}
                onSkillSelect={setSelectedSkill}
                autoPlay={true}
                autoPlayInterval={5000}
              />
              
              {/* Skill Preview */}
              <div className="mt-8">
                <SkillPreviewCard
                  skill={selectedSkill}
                  isVisible={!!selectedSkill}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-text-tertiary dark:text-text-tertiary-dark mx-auto mb-4" />
              <p className="text-text-secondary dark:text-text-secondary-dark">
                No featured skills found
              </p>
            </div>
          )}
        </motion.div>

        {/* All Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary-dark">
              All <span className="text-primary dark:text-primary-dark">Skills</span>
            </h2>
            
            {/* Desktop Controls */}
            {!isMobile && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary dark:bg-primary-dark text-white'
                      : 'bg-background-secondary dark:bg-background-secondary-dark text-text-secondary dark:text-text-secondary-dark'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary dark:bg-primary-dark text-white'
                      : 'bg-background-secondary dark:bg-background-secondary-dark text-text-secondary dark:text-text-secondary-dark'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary dark:text-text-tertiary-dark" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                         border border-border-primary/20 dark:border-border-primary-dark/20 rounded-xl
                         text-text-primary dark:text-text-primary-dark placeholder-text-tertiary dark:placeholder-text-tertiary-dark
                         focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50
                         backdrop-blur-sm transition-all duration-200"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-primary dark:bg-primary-dark text-white'
                    : 'bg-background-secondary/50 dark:bg-background-secondary-dark/50 text-text-secondary dark:text-text-secondary-dark hover:bg-background-secondary dark:hover:bg-background-secondary-dark'
                }`}
              >
                All ({skills.length})
              </button>
              
              {categories.map((category) => {
                const categorySkillCount = skills.filter(skill => skill.category_id === category.id).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'text-white'
                        : 'bg-background-secondary/50 dark:bg-background-secondary-dark/50 text-text-secondary dark:text-text-secondary-dark hover:bg-background-secondary dark:hover:bg-background-secondary-dark'
                    }`}
                    style={{
                      backgroundColor: activeCategory === category.id ? category.color : undefined,
                      borderColor: activeCategory === category.id ? category.color : undefined
                    }}
                  >
                    {category.name} ({categorySkillCount})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills Grid/List */}
          <div className="relative">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader className="w-8 h-8 animate-spin text-primary dark:text-primary-dark" />
                  <p className="text-text-secondary dark:text-text-secondary-dark">
                    Loading skills...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4 text-center">
                  <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400" />
                  <div>
                    <p className="text-red-500 dark:text-red-400 font-medium mb-2">
                      Failed to load skills
                    </p>
                    <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            ) : filteredSkills.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-background-tertiary/30 dark:bg-background-tertiary-dark/30 
                                rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-text-tertiary dark:text-text-tertiary-dark" />
                  </div>
                  <p className="text-text-primary dark:text-text-primary-dark font-medium mb-2">
                    No skills found
                  </p>
                  <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
                    Try adjusting your search or filters
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                    : 'space-y-4'
                  }
                `}
                layout
              >
                <AnimatePresence>
                  {filteredSkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05,
                        layout: { duration: 0.3 }
                      }}
                      className={viewMode === 'grid' ? 'h-64' : ''}
                    >
                      <SkillCard
                        skill={skill}
                        compact={viewMode === 'grid'}
                        className="w-full h-full"
                        onClick={() => setSelectedSkill(skill)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;