// src/data/projects.ts
import { Project } from '@/types/projects';

export const projects: Project[] = [
  {
    id: '1',
    name: 'Cosmic Chat',
    description: 'Real-time chat application with space theme',
    planetImage: '/planets/planet1.png',
    demoLink: 'https://cosmic-chat.demo',
    githubLink: 'https://github.com/username/cosmic-chat',
    techStack: ['React', 'Node.js', 'Socket.io', 'TypeScript'],
    previewContent: {
      title: 'Cosmic Chat - Real-time Communication',
      description: 'A modern chat application with a unique space theme, featuring real-time messaging, user presence, and multimedia sharing capabilities.',
      image: '/previews/cosmic-chat.png',
      features: [
        'Real-time messaging with Socket.io',
        'File and media sharing',
        'User presence indicators',
        'Theme customization'
      ]
    }
  },
  {
    id: '2',
    name: 'Orbit Analytics',
    description: 'Data visualization dashboard',
    planetImage: '/planets/planet2.png',
    demoLink: 'https://orbit-analytics.demo',
    githubLink: 'https://github.com/username/orbit-analytics',
    techStack: ['Vue.js', 'D3.js', 'Python', 'Flask'],
    previewContent: {
      title: 'Orbit Analytics - Data Visualization',
      description: 'Interactive dashboard for visualizing complex datasets with beautiful charts and real-time updates.',
      image: '/previews/orbit-analytics.png',
      features: [
        'Interactive data visualization',
        'Real-time data updates',
        'Custom chart components',
        'Data export functionality'
      ]
    }
  },
  {
    id: '3',
    name: 'Nebula Store',
    description: 'E-commerce platform',
    planetImage: '/planets/planet3.png',
    demoLink: 'https://nebula-store.demo',
    githubLink: 'https://github.com/username/nebula-store',
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
    previewContent: {
      title: 'Nebula Store - E-commerce Platform',
      description: 'A full-featured e-commerce platform with modern design and seamless payment integration.',
      image: '/previews/nebula-store.png',
      features: [
        'Product management',
        'Shopping cart functionality',
        'Secure payment processing',
        'Order tracking system'
      ]
    }
  },
  // Add more projects as needed
];