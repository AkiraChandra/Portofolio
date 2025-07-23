// src/components/sections/Projects/ProjectDetail.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types/projects';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.button
        onClick={() => router.back()}
        className="mb-8 flex items-center text-text-primary dark:text-text-primary-dark"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="mr-2" />
        Back to Projects
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src={project.planetImage}
            alt={project.name}
            className="w-full h-auto rounded-lg"
            animate={{ 
              rotate: 360 
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold text-text-primary dark:text-text-primary-dark">
            {project.name}
          </h1>
          
          <p className="text-text-secondary dark:text-text-secondary-dark text-lg">
            {project.previewContent.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-primary/10 dark:bg-primary-dark/10 
                          text-primary dark:text-primary-dark rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.previewContent.features && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">
                Key Features
              </h2>
              <ul className="list-disc list-inside space-y-2 text-text-secondary dark:text-text-secondary-dark">
                {project.previewContent.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {project.demoLink && (
              <motion.a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-primary dark:bg-primary-dark 
                        text-background-primary rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink size={20} />
                Live Demo
              </motion.a>
            )}
            
            {project.githubLink && (
              <motion.a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-text-primary/20 
                        dark:border-text-primary-dark/20 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={20} />
                View Code
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;