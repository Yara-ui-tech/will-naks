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
    title: 'School Fees Assistance',
    description: 'Direct financial support to cover tuition and school fees for deserving students who cannot afford them. Applications reviewed quarterly.',
    icon: 'GraduationCap',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Scholarship Support',
    description: 'Merit and need-based scholarships targeting students with exceptional academic potential from disadvantaged backgrounds.',
    icon: 'Award',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Student Mentorship',
    description: 'One-on-one and group mentorship initiatives pairing students with professionals and role models for career and personal guidance.',
    icon: 'Users',
    image: 'https://images.unsplash.com/photo-1516534775068-ba3e84589d90?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Community Outreach',
    description: 'Engagement with local communities, schools, and churches to identify, assess, and support students in greatest need of intervention.',
    icon: 'MapPin',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Educational Resource Support',
    description: 'Provision of textbooks, stationery, uniforms, and essential learning materials to registered beneficiaries.',
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Leadership Development',
    description: 'Training workshops building confidence, decision-making, and leadership skills among youth aged 12-25.',
    icon: 'TrendingUp',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Orphans, elderly and widows support',
    description: 'Collect donations from different individuals and organizations to support orphans, elderly, widows and less privileged.',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
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
