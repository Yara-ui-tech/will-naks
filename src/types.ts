export interface NavLink {
  name: string;
  href: string;
}

export interface Program {
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface Partner {
  name: string;
  logo: string;
  specialization: string;
}

export interface Stat {
  label: string;
  value: string;
  suffix: string;
}
