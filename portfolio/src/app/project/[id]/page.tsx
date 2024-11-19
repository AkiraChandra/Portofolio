// src/app/project/[id]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProject } from '@/hooks/projects/useProject';
import ProjectDetail from '@/components/sections/Projects/ProjectDetail';
import MovingStars from '@/components/ui/animations/Movingstars';

const ProjectPage = () => {
  const { id } = useParams();
  const { project, loading, error } = useProject(id as string);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark">
      <div className="absolute inset-0">
        <MovingStars />
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10"
      >
        <ProjectDetail project={project} />
      </motion.div>
    </div>
  );
};

export default ProjectPage;