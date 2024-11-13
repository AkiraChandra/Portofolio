// src/data/experience.ts

import { Experience } from '@/types/experience';

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'SpaceX',
    role: 'Senior Software Engineer',
    period: '2022 - Present',
    description: 'Leading the development of mission-critical software systems for spacecraft navigation and control.',
    icon: '/company-icons/spacex.svg',
    achievements: [
      'Developed real-time telemetry system',
      'Optimized launch sequence algorithms',
      'Led team of 5 engineers'
    ]
  },
  {
    id: '2',
    company: 'NASA',
    role: 'Systems Analyst',
    period: '2020 - 2022',
    description: 'Analyzed and optimized mission control systems for deep space exploration missions.',
    icon: '/company-icons/nasa.svg',
    achievements: [
      'Improved system efficiency by 40%',
      'Implemented new safety protocols',
      'Reduced mission critical errors by 60%'
    ]
  }
];