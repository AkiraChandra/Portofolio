// src/data/experience.ts
import { Experience } from '@/types/experience';

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'Bina Nusantara Computer Club',
    role: 'Senior Software Engineer',
    period: '2023 - Present',
    description: 'Leading the development of mission-critical software systems for spacecraft navigation and control. Working on cutting-edge technology for space exploration and satellite communications. Implementing real-time monitoring systems and improving mission success rates through innovative solutions.',
    icon: '/company-icons/spacex.svg',
    achievements: [
      'Developed real-time telemetry system for Falcon 9 launches, improving data accuracy by 40%',
      'Optimized launch sequence algorithms, reducing pre-launch preparation time by 30%',
      'Led team of 5 engineers in mission control software development',
      'Implemented new safety protocols reducing system failures by 45%',
      'Designed and deployed containerized microservices architecture for mission control systems'
    ],
    status: 'ongoing',
    location: 'Cape Canaveral, FL',
    technologies: [
      'React',
      'TypeScript',
      'Node.js',
      'Python',
      'Docker',
      'Kubernetes',
      'AWS',
      'GraphQL'
    ],
    projectImages: [
      {
        url: '/projects/spacex/mission-control.jpg',
        caption: 'Mission Control Dashboard'
      },
      {
        url: '/projects/spacex/telemetry.jpg',
        caption: 'Telemetry System'
      },
      {
        url: '/projects/spacex/launch-system.jpg',
        caption: 'Launch Control Interface'
      }
    ],
    certificateUrl: 'https://credentials.spacex.com/senior-engineer-2023',
    links: [
      {
        label: 'Project Documentation',
        url: 'https://docs.spacex.com/mission-control'
      },
      {
        label: 'Team Portfolio',
        url: 'https://spacex.com/engineering-team'
      }
    ]
  },
  {
    id: '2',
    company: 'NASA',
    role: 'Systems Analyst',
    period: '2022 - 2023',
    description: 'Analyzed and optimized mission control systems for deep space exploration missions. Collaborated with international space agencies and implemented advanced data analysis algorithms for spacecraft trajectory optimization.',
    icon: '/company-icons/nasa.svg',
    achievements: [
      'Improved system efficiency by 40% through optimization',
      'Developed new mission analysis tools used across departments',
      'Reduced mission critical errors by 60%',
      'Collaborated with international space agencies'
    ],
    status: 'completed',
    location: 'Houston, TX',
    technologies: [
      'Python',
      'TensorFlow',
      'SQL',
      'MATLAB',
      'R',
      'Hadoop'
    ],
    projectImages: [
      {
        url: '/projects/nasa/analysis-tool.jpg',
        caption: 'Mission Analysis Tool'
      },
      {
        url: '/projects/nasa/data-viz.jpg',
        caption: 'Data Visualization System'
      }
    ],
    // No certificate for this position
    links: [
      {
        label: 'Research Paper',
        url: 'https://nasa.gov/research/papers/2023'
      }
    ]
  },
  {
    id: '3',
    company: 'Blue Origin',
    role: 'Software Developer',
    period: '2021 - 2022',
    description: 'Developed flight control systems for New Shepard spacecraft. Major focus on autonomous landing systems and safety mechanisms.',
    icon: '/company-icons/blue-origin.svg',
    achievements: [
      'Implemented autonomous landing system improvements',
      'Reduced system latency by 25%',
      'Developed new testing frameworks',
      'Completed 12 successful launches'
    ],
    status: 'completed',
    location: 'Kent, WA',
    technologies: [
      'C++',
      'Python',
      'ROS',
      'CUDA',
      'Linux',
      'Git'
    ],
    projectImages: [
      {
        url: '/projects/blue-origin/control-system.jpg',
        caption: 'Flight Control System'
      },
      {
        url: '/projects/blue-origin/landing-system.jpg',
        caption: 'Landing System UI'
      }
    ],
    certificateUrl: 'https://certs.blueorigin.com/dev-2022',
    links: [
      {
        label: 'System Overview',
        url: 'https://blueorigin.com/flight-systems'
      }
    ]
  },
  {
    id: '4',
    company: 'Virgin Galactic',
    role: 'Frontend Engineer',
    period: '2020 - 2021',
    description: 'Developed customer-facing applications for space tourism program. Built interactive dashboards and booking systems.',
    icon: '/company-icons/virgin-galactic.svg',
    achievements: [
      'Built booking platform for space flights',
      'Improved user engagement by 50%',
      'Implemented real-time flight tracking',
      'Developed virtual training modules'
    ],
    status: 'completed',
    location: 'Las Cruces, NM',
    technologies: [
      'React',
      'Next.js',
      'Three.js',
      'WebGL',
      'Tailwind CSS',
      'TypeScript'
    ],
    // No project images for this role
    certificateUrl: 'https://learn.virgingalactic.com/cert/fe-2021',
    // No additional links
  },
  {
    id: '5',
    company: 'Rocket Lab',
    role: 'Full Stack Developer',
    period: '2019 - 2020',
    description: 'Built mission planning and analysis tools for small satellite launches. Developed and maintained launch scheduling system.',
    icon: '/company-icons/rocket-lab.svg',
    achievements: [
      'Created mission planning dashboard',
      'Improved launch success rate by 25%',
      'Developed payload integration system',
      'Streamlined launch procedures'
    ],
    status: 'completed',
    location: 'Long Beach, CA',
    technologies: [
      'Vue.js',
      'Django',
      'PostgreSQL',
      'Redis',
      'Docker',
      'AWS'
    ],
    projectImages: [
      {
        url: '/projects/rocket-lab/mission-planner.jpg',
        caption: 'Mission Planning Dashboard'
      },
      {
        url: '/projects/rocket-lab/schedule.jpg',
        caption: 'Launch Schedule Interface'
      }
    ],
    certificateUrl: 'https://rocketlab.com/certifications/fullstack-2020',
    links: [
      {
        label: 'Project Demo',
        url: 'https://demo.rocketlab.com/mission-planner'
      },
      {
        label: 'Case Study',
        url: 'https://rocketlab.com/case-studies/2020'
      }
    ]
  },
  {
    id: '6',
    company: 'Space Dynamics Lab',
    role: 'Research Assistant',
    period: '2018 - 2019',
    description: 'Conducted research on autonomous spacecraft navigation systems. Published papers in peer-reviewed journals.',
    icon: '/company-icons/sdl.svg',
    achievements: [
      'Published 2 research papers',
      'Developed navigation algorithms',
      'Created simulation environment',
      'Presented at conferences'
    ],
    status: 'completed',
    location: 'Logan, UT',
    technologies: [
      'Python',
      'MATLAB',
      'LaTeX',
      'Git',
      'TensorFlow'
    ],
    projectImages: [
      {
        url: '/projects/sdl/simulation.jpg',
        caption: 'Navigation Simulation'
      },
      {
        url: '/projects/sdl/presentation.jpg',
        caption: 'Conference Presentation'
      }
    ],
    certificateUrl: 'https://sdl.usu.edu/certificates/research-2019',
    links: [
      {
        label: 'Research Publication',
        url: 'https://doi.org/10.1234/space.2019'
      },
      {
        label: 'Conference Paper',
        url: 'https://conference.space/2019/paper'
      }
    ]
  }
];