import { NavLink, Program, Testimonial, TeamMember, Partner, Stat } from './types';

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Programs', href: '#programs' },
  { name: 'Impact', href: '#impact' },
  { name: 'Team', href: '#team' },
  { name: 'Contact', href: '#contact' },
];

export const STATS: Stat[] = [
  { label: 'Students Assisted', value: '1,200', suffix: '+' },
  { label: 'Scholarships Awarded', value: '450', suffix: '+' },
  { label: 'Communities Reached', value: '25', suffix: '' },
  { label: 'Active Volunteers', value: '150', suffix: '+' },
];

export const PROGRAMS: Program[] = [
  {
    title: 'Educational Assistance',
    description: 'Providing essential learning materials and resources to students in need.',
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'School Fees Support',
    description: 'Direct financial aid to cover tuition fees for talented underprivileged students.',
    icon: 'GraduationCap',
    image: 'https://images.unsplash.com/photo-1523050353055-f1123537a8a2?auto=format&fit=crop&q=80&w=800',
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
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Community Outreach',
    description: 'Engaging with local communities to identify and support hidden talent.',
    icon: 'MapPin',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Scholarship Programs',
    description: 'Fully-funded scholarships for exceptional students to attend top institutions.',
    icon: 'Award',
    image: 'https://images.unsplash.com/photo-1525921429624-479b6a29d84c?auto=format&fit=crop&q=80&w=800',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Faith A.',
    role: 'Medical Student',
    content: 'The WILL-NAKS Foundation didn\'t just pay my fees; they gave me a mentor who believed in me when I didn\'t believe in myself.',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Samuel K.',
    role: 'Engineering Graduate',
    content: 'Thanks to the full scholarship, I was able to focus entirely on my studies and graduate with honors. I am now working to give back.',
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Grace M.',
    role: 'Law Student',
    content: 'The community outreach program found me in my village. Today, I am studying to become a human rights lawyer.',
    image: 'https://images.unsplash.com/photo-1523444279540-3023e160a28f?auto=format&fit=crop&q=80&w=400',
  },
];

export const TEAM: TeamMember[] = [
  {
    name: 'Willie Nakunyada',
    role: 'Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Simbarashe O Manongwa',
    role: 'CEO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Dr. Sarah Phiri',
    role: 'Head of Programs',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'John Banda',
    role: 'Student Relations',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  },
];

export const PARTNERS: Partner[] = [
  { 
    name: 'TechGlobal Solutions', 
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200',
    specialization: 'Leading provider of digital infrastructure and educational technology across Africa.'
  },
  { 
    name: 'AfriGrowth Capital', 
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200',
    specialization: 'Investment firm specializing in sustainable development and community-led startups.'
  },
  { 
    name: 'Harvest Heritage', 
    logo: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=200',
    specialization: 'Agricultural experts focused on food security and rural community empowerment.'
  },
  { 
    name: 'Unity Health Group', 
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=200',
    specialization: 'Regional healthcare network providing medical outreach and student health programs.'
  },
];

export const GALLERY = [
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1524178232363-1fb28f74b671?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1510531704581-5b2870972060?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1522661067900-ab829854a57f?auto=format&fit=crop&q=80&w=800',
];
