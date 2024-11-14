// File: /src/data/experience.ts

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
      'Developed real-time telemetry system for Falcon 9 launches',
      'Optimized launch sequence algorithms improving efficiency by 30%',
      'Led team of 5 engineers in mission control software development',
      'Implemented new safety protocols reducing system failures by 45%'
    ],
    status: 'ongoing',
    location: 'Cape Canaveral, FL'
  },
  {
    id: '2',
    company: 'NASA',
    role: 'Systems Analyst',
    period: '2020 - 2022',
    description: 'Analyzed and optimized mission control systems for deep space exploration missions.',
    icon: '/company-icons/nasa.svg',
    achievements: [
      'Improved system efficiency by 40% through optimization',
      'Developed new mission analysis tools used across departments',
      'Reduced mission critical errors by 60% through new protocols',
      'Collaborated with international space agencies on joint missions'
    ],
    status: 'completed',
    location: 'Houston, TX'
  },
  {
    id: '3',
    company: 'Blue Origin',
    role: 'Software Developer',
    period: '2018 - 2020',
    description: 'Developed and maintained flight control systems for New Shepard spacecraft.',
    icon: '/company-icons/blue-origin.svg',
    achievements: [
      'Implemented autonomous landing system improvements',
      'Reduced system latency by 25% through code optimization',
      'Developed new testing frameworks for flight systems',
      'Successfully completed 12 mission-critical launches'
    ],
    status: 'completed',
    location: 'Kent, WA'
  }
];