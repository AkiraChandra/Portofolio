// src/utils/navigation/sectionUtils.ts

export const SECTIONS = [
  { 
    id: 'home', 
    name: 'Home', 
    path: '/',
    href: '#home',
    icon: 'Home'
  },
  { 
    id: 'projects', 
    name: 'Projects', 
    path: '/projects',
    href: '#projects', 
    icon: 'FolderOpen'
  },
  { 
    id: 'experience', 
    name: 'Experience', 
    path: '/experience',
    href: '#experience',
    icon: 'Briefcase'
  },
  { 
    id: 'certifications', 
    name: 'Certifications', 
    path: '/certifications',
    href: '#certifications',
    icon: 'Award'
  },
  { 
    id: 'skills', 
    name: 'Skills', 
    path: '/skills',
    href: '#skills',
    icon: 'Code2'
  }
] as const;

export type SectionId = typeof SECTIONS[number]['id'];

export const getSectionById = (id: SectionId) => {
  return SECTIONS.find(section => section.id === id);
};

export const getSectionIndex = (id: SectionId) => {
  return SECTIONS.findIndex(section => section.id === id);
};

export const getNextSection = (currentId: SectionId) => {
  const currentIndex = getSectionIndex(currentId);
  const nextIndex = (currentIndex + 1) % SECTIONS.length;
  return SECTIONS[nextIndex];
};

export const getPreviousSection = (currentId: SectionId) => {
  const currentIndex = getSectionIndex(currentId);
  const prevIndex = currentIndex === 0 ? SECTIONS.length - 1 : currentIndex - 1;
  return SECTIONS[prevIndex];
};