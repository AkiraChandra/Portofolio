// src/data/experience.ts
import { Experience } from '@/types/experience';

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'Bina Nusantara Computer Club',
    role: 'Senior Software Engineer',
    period: '2023 - Present',
    description: 'Leading the development of mission-critical software systems for spacecraft navigation and control. Working on cutting-edge technology for space exploration and satellite communications. Implementing real-time monitoring systems and improving mission success rates through innovative solutions.',
    icon: '/Binus.jpg',
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
        url: '/Binus.jpg',
        caption: 'Mission Control Dashboard',
        type: 'image'
      },
      {
        url: '/Binus.jpg',
        caption: 'Telemetry System',
        type: 'image'
      },
      {
        url: '/Binus.jpg',
        caption: 'Launch Control Interface',
        type: 'image'
      },
      {
        url: '/Binus.jpg',
        caption: 'Launch Control Interface',
        type: 'image'
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
    icon: '/Binus.jpg',
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
        url: '/Binus.jpg',
        caption: 'Mission Analysis Tool',
        type: 'image'
      },
      {
        url: '/Binus.jpg',
        caption: 'Data Visualization System',
        type: 'image'
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
    icon: '/Binus.jpg',
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
        url: '/Binus.jpg',
        caption: 'Flight Control System',
        type: 'image'
      },
      {
        url: '/Binus.jpg',
        caption: 'Landing System UI',
        type: 'image'
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
    icon: '/Binus.jpg',
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
    icon: '/Binus.jpg',
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
        url: '/Binus.jpg',
        caption: 'Mission Planning Dashboard',
        type: 'image'
      },
      {
        url: '/Binus.jpg',
        caption: 'Launch Schedule Interface',
        type: 'image'
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
    icon: '/Binus.jpg',
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
        url: '/Binus.jpg',
        caption: 'Navigation Simulation',
        type: 'image'
      },
      {
        url: '/Binus.jpg',
        caption: 'Conference Presentation',
        type: 'image'
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
  },

{
  id: '7',
  company: 'Space',
  role: 'DevOps Engineer',
  period: '2017 - 2018',
  description: 'Managed CI/CD pipelines and automated deployment processes for Falcon 9 missions. Ensured system reliability and scalability.',
  icon: '/Binus.jpg',
  achievements: [
    'Automated deployment process reducing downtime by 50%',
    'Improved CI/CD pipeline efficiency by 30%',
    'Ensured 99.9% system uptime during launches'
  ],
  status: 'completed',
  location: 'Hawthorne, CA',
  technologies: [
    'Jenkins',
    'Docker',
    'Kubernetes',
    'AWS',
    'Terraform',
    'Ansible'
  ],
  projectImages: [
    {
      url: '/Binus.jpg',
      caption: 'CI/CD Pipeline',
      type: 'image'
    },
    {
      url: '/Binus.jpg',
      caption: 'Deployment Dashboard',
      type: 'image'
    }
  ],
  certificateUrl: 'https://spacex.com/certificates/devops-2018',
  links: [
    {
      label: 'Deployment Guide',
      url: 'https://spacex.com/deployment-guide'
    }
  ]
},
{
  id: '8',
  company: 'Lockheed Martin',
  role: 'Backend Developer',
  period: '2016 - 2017',
  description: 'Developed backend services for satellite communication systems. Focused on API development and data processing.',
  icon: '/Binus.jpg',
  achievements: [
    'Developed RESTful APIs for satellite data',
    'Optimized data processing pipelines',
    'Improved system performance by 20%'
  ],
  status: 'completed',
  location: 'Denver, CO',
  technologies: [
    'Java',
    'Spring Boot',
    'MySQL',
    'Kafka',
    'Docker'
  ],
  projectImages: [
    {
      url: '/Binus.jpg',
      caption: 'API Development',
      type: 'image'
    },
    {
      url: '/Binus.jpg',
      caption: 'Data Processing Pipeline',
      type: 'image'
    }
  ],
  certificateUrl: 'https://lockheedmartin.com/certificates/backend-2017',
  links: [
    {
      label: 'API Documentation',
      url: 'https://lockheedmartin.com/api-docs'
    }
  ]
},
{
  id: '9',
  company: 'Boeing',
  role: 'Data Scientist',
  period: '2015 - 2016',
  description: 'Analyzed flight data to improve aircraft performance and safety. Developed machine learning models for predictive maintenance.',
  icon: '/Binus.jpg',
  achievements: [
    'Developed predictive maintenance models',
    'Improved aircraft performance by 15%',
    'Reduced maintenance costs by 20%'
  ],
  status: 'completed',
  location: 'Seattle, WA',
  technologies: [
    'Python',
    'Pandas',
    'Scikit-Learn',
    'TensorFlow',
    'SQL'
  ],
  projectImages: [
    {
      url: '/Binus.jpg',
      caption: 'Data Analysis',
      type: 'image'
    },
    {
      url: '/Binus.jpg',
      caption: 'Machine Learning Model',
      type: 'image'
    }
  ],
  certificateUrl: 'https://boeing.com/certificates/data-scientist-2016',
  links: [
    {
      label: 'Research Paper',
      url: 'https://boeing.com/research/papers/2016'
    }
  ]
},
{
  id: '10',
  company: 'Northrop Grumman',
  role: 'Cybersecurity Analyst',
  period: '2014 - 2015',
  description: 'Monitored and secured aerospace systems against cyber threats. Implemented security protocols and conducted vulnerability assessments.',
  icon: '/Binus.jpg',
  achievements: [
    'Implemented new security protocols',
    'Conducted vulnerability assessments',
    'Reduced security incidents by 30%'
  ],
  status: 'completed',
  location: 'Falls Church, VA',
  technologies: [
    'Splunk',
    'Wireshark',
    'Nessus',
    'Python',
    'Linux'
  ],
  projectImages: [
    {
      url: '/Binus.jpg',
      caption: 'Security Monitoring',
      type: 'image'
    },
    {
      url: '/Binus.jpg',
      caption: 'Vulnerability Assessment',
      type: 'image'
    }
  ],
  certificateUrl: 'https://northropgrumman.com/certificates/cybersecurity-2015',
  links: [
    {
      label: 'Security Report',
      url: 'https://northropgrumman.com/security-report'
    }
  ]
},
{
  id: '11',
  company: 'Raytheon',
  role: 'Embedded Systems Engineer',
  period: '2013 - 2014',
  description: 'Developed embedded systems for defense applications. Focused on real-time processing and system optimization.',
  icon: '/Binus.jpg',
  achievements: [
    'Developed real-time processing systems',
    'Optimized system performance',
    'Reduced power consumption by 15%'
  ],
  status: 'completed',
  location: 'Waltham, MA',
  technologies: [
    'C',
    'C++',
    'VHDL',
    'FPGA',
    'Embedded Linux'
  ],
  projectImages: [
    {
      url: '/Binus.jpg',
      caption: 'Embedded System Development',
      type: 'image'
    },
    {
      url: '/Binus.jpg',
      caption: 'Real-Time Processing',
      type: 'image'
    }
  ],
  certificateUrl: 'https://raytheon.com/certificates/embedded-2014',
  links: [
    {
      label: 'Project Overview',
      url: 'https://raytheon.com/project-overview'
    }
  ]
},
{
  id: '12',
  company: 'General Dynamics',
  role: 'Network Engineer',
  period: '2012 - 2013',
  description: 'Designed and maintained network infrastructure for military communication systems. Ensured secure and reliable connectivity.',
  icon: '/Binus.jpg',
  achievements: [
    'Designed secure network infrastructure',
    'Improved network reliability by 25%',
    'Reduced latency by 20%'
  ],
  status: 'completed',
  location: 'Reston, VA',
  technologies: [
    'Cisco',
    'Juniper',
    'Python',
    'Bash',
    'Linux'
  ],
  projectImages: [
    {
      url: '/Binus.jpg',
      caption: 'Network Design',
      type: 'image'
    },
    {
      url: '/Binus.jpg',
      caption: 'Network Monitoring',
      type: 'image'
    }
  ],
  certificateUrl: 'https://gd.com/certificates/network-2013',
  links: [
    {
      label: 'Network Architecture',
      url: 'https://gd.com/network-architecture'
    }
  ]
},
{
  id: '13',
  company: 'Sierra Nevada Corporation',
  role: 'Systems Engineer',
  period: '2011 - 2012',
  description: 'Worked on the Dream Chaser spacecraft project. Focused on systems integration and testing.',
  icon: '/Binus.jpg',
  achievements: [
    'Integrated multiple subsystems',
    'Conducted extensive testing',
    'Improved system reliability by 20%'
  ],
  status: 'completed',
  location: 'Sparks, NV',
  technologies: [
    'MATLAB',
    'Simulink',
    'Python',
    'C++',
    'Git'
  ],
  projectImages: [
    {
      url: '/Binus.jpg',
      caption: 'Subsystem Integration',
      type: 'image'
    },
    {
      url: '/Binus.jpg',
      caption: 'System Testing',
      type: 'image'
    }
  ],
  certificateUrl: 'https://sncorp.com/certificates/systems-2012',
  links: [
    {
      label: 'Project Details',
      url: 'https://sncorp.com/project-details'
    }
  ]
},
{
  id: '14',
  company: 'Orbital ATK',
  role: 'Mechanical Engineer',
  period: '2010 - 2011',
  description: 'Designed mechanical components for satellite systems. Conducted stress analysis and thermal testing.',
  icon: '/Binus.jpg',
  achievements: [
    'Designed satellite components',
    'Conducted stress analysis',
    'Improved thermal performance by 15%'
  ],
  status: 'completed',
  location: 'Dulles, VA',
  technologies: [
    'SolidWorks',
    'ANSYS',
    'MATLAB',
    'Python',
    'Git'
  ],
  projectImages: [
    {
      url: '/Binus.jpg',
      caption: 'Component Design',
      type: 'image'
    },
    {
      url: '/Binus.jpg',
      caption: 'Thermal Testing',
      type: 'image'
    }
  ],
  certificateUrl: 'https://orbitalatk.com/certificates/mechanical-2011',
  links: [
    {
      label: 'Design Documentation',
      url: 'https://orbitalatk.com/design-docs'
    }
  ]
},
{
  id: '15',
  company: 'SpaceX',
  role: 'Intern',
  period: '2009 - 2010',
  description: 'Assisted in the development of the Dragon spacecraft. Focused on software testing and validation.',
  icon: '/Binus.jpg',
  achievements: [
    'Assisted in software testing',
    'Validated critical systems',
    'Contributed to successful Dragon missions'
  ],
  status: 'completed',
  location: 'Hawthorne, CA',
  technologies: [
    'Python',
    'C++',
    'MATLAB',
    'Git',
    'Linux'
  ],
  projectImages: [
    {
      url: '/Binus.jpg',
      caption: 'Software Testing',
      type: 'image'
    },
    {
      url: '/Binus.jpg',
      caption: 'System Validation',
      type: 'image'
    }
  ],
  certificateUrl: 'https://spacex.com/certificates/intern-2010',
  links: [
    {
      label: 'Internship Report',
      url: 'https://spacex.com/internship-report'
    }
  ]
}
];