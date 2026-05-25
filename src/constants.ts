import { NavLink, Program, Testimonial, TeamMember, Partner, Stat } from './types';

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Programs', href: '/programs' },
  { name: 'Join Us', href: '/join' },
  { name: 'Team', href: '/team' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Impact', href: '/impact' },
  { name: 'Support', href: '/support' },
  { name: 'News', href: '/news' },
];

export const STATS: Stat[] = [
  { label: 'Students Assisted', value: '0', suffix: '+' },
  { label: 'Scholarships Awarded', value: '0', suffix: '+' },
  { label: 'Communities Reached', value: '0', suffix: '' },
  { label: 'Active Volunteers', value: '0', suffix: '+' },
];

export const PROGRAMS: Program[] = [
  {
    title: 'Educational Assistance',
    description: 'Providing essential learning materials and resources to students in need.',
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'School Fees Support',
    description: 'Direct financial aid to cover tuition fees for talented underprivileged students.',
    icon: 'GraduationCap',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Student Welfare',
    description: 'Ensuring holistic wellbeing through health support and living assistance.',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Mentorship & Leadership',
    description: 'Guiding the next generation of African leaders through structured programs.',
    icon: 'Users',
    image: 'https://images.unsplash.com/photo-1516534775068-ba3e84589d90?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Community Outreach',
    description: 'Engaging with local communities to identify and support hidden talent.',
    icon: 'MapPin',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Scholarship Programs',
    description: 'Fully-funded scholarships for exceptional students to attend top institutions.',
    icon: 'Award',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800',
  },
];

export const TESTIMONIALS: Testimonial[] = [];

export const TEAM: TeamMember[] = [
  {
    name: 'Willie Nakunyada',
    role: 'Founder',
    image: '/assets/team/founder.avif',
  },
  {
    name: 'Simbarashe O Manongwa',
    role: 'CEO',
    image: '/assets/team/simbarashe.jpg',
    linkedin: 'https://linkedin.com/in/simbarashe-manongwa-815b28342',
  },
  {
    name: 'Tapiwanashe Mandiveyi',
    role: 'CEO',
    image: '/assets/team/tapiwanashe.jpg',
    linkedin: 'https://linkedin.com/in/tapiwanashe-mandiveyi',
  },
  {
    name: 'Yvonne Kodzaimambo',
    role: 'Administrative and Logistics Officer',
    image: '/assets/team/coo.jpeg',
  },
];

export const PARTNERS: Partner[] = [];

export const GALLERY = [];
