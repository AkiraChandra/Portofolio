'use client';

import ProjectDetail from '@/components/sections/Projects/ProjectDetail';
import { useProject } from '@/hooks/projects/useProject';

export default function ProjectDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { project, loading, error } = useProject(params.id);

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-primary dark:text-text-primary-dark">
          Project not found
        </p>
      </div>
    );
  }

  return <ProjectDetail project={project} />;
}