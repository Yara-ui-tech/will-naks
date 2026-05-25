import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Instagram, Twitter, Linkedin, ArrowUp, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const [socials, setSocials] = useState<any[]>([]);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const { data } = await supabase.from('social_links').select('*').eq('is_active', true);
        if (data) setSocials(data);
      } catch (err) {
        console.warn('Failed to fetch social links, using standard defaults:', err);
      }
    };
    fetchSocials();
  }, []);

  const getIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook')) return <Facebook className="h-5 w-5" />;
    if (p.includes('instagram')) return <Instagram className="h-5 w-5" />;
    if (p.includes('twitter') || p.includes(' x')) return <Twitter className="h-5 w-5" />;
    if (p.includes('linkedin')) return <Linkedin className="h-5 w-5" />;
    return <Globe className="h-5 w-5" />;
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Programs', path: '/programs' },
    { name: 'Impact Stories', path: '/impact' },
    { name: 'Meet Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
  ];

  const supportLinks = [
    { name: 'Donate Now', path: '/support?tab=donate' },
    { name: 'Become a member', path: '/join' },
    { name: 'Become a Partner', path: '/support?tab=partner' },
    { name: 'Scholarship App', path: '/support?tab=scholarship' },
    { name: 'Volunteer Signup', path: '/support?tab=volunteer' },
    { name: 'News & Blog', path: '/news' },
    { name: 'Admin Portal', path: '/admin' },
  ];

  return (
    <footer className="bg-navy text-white pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="relative h-12 w-12 flex items-center justify-center">
                <img 
                  src="/assets/logo.png" 
                  alt="WILL-NAKS Logo" 
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.footer-fallback-logo')?.classList.remove('hidden');
                  }}
                />
                <div className="footer-fallback-logo hidden bg-gold p-2.5 rounded-xl">
                  <Heart className="h-6 w-6 text-navy" />
                </div>
              </div>
              <span className="font-serif font-bold text-2xl tracking-tighter uppercase">
                WILL-NAKS
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg italic">
              “Empowering Potential Beyond Circumstances”
            </p>
            <div className="flex flex-wrap gap-4">
              {socials.length > 0 ? (
                socials.map((s) => (
                  <a 
                    key={s.id} 
                    href={s.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all"
                    title={s.platform}
                  >
                    {getIcon(s.platform)}
                  </a>
                ))
              ) : (
                <>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="https://whatsapp.com/channel/0029VbCsKgO4NVicfQ7ZCB3W" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="http://linkedin.com/company/will-naks-foundation/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-8 relative inline-block">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-1 bg-gold rounded-full"></div>
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-gold transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mr-3 scale-0 group-hover:scale-100 transition-transform"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-8 relative inline-block">
              Support
              <div className="absolute -bottom-2 left-0 w-8 h-1 bg-gold rounded-full"></div>
            </h4>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-gold transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mr-3 scale-0 group-hover:scale-100 transition-transform"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-8 relative inline-block">
              Newsletter
              <div className="absolute -bottom-2 left-0 w-8 h-1 bg-gold rounded-full"></div>
            </h4>
            <p className="text-gray-400 mb-6 text-sm">Subscribe to get the latest updates on our impact.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-1 focus:ring-gold text-white"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-gold text-navy px-4 rounded-lg font-bold text-sm hover:bg-gold-light transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} WILL-NAKS FOUNDATION. All rights reserved.
          </p>
          <div className="flex space-x-8 text-sm text-gray-500">
            <Link to="/admin" className="hover:text-gold transition-colors font-bold uppercase tracking-widest text-[10px]">Admin Portal</Link>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <button 
            onClick={scrollToTop}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-navy transition-all group shadow-lg"
          >
            <ArrowUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Background Decorative Circles */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] border border-white/5 rounded-full -z-0"></div>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] border border-white/5 rounded-full -z-0"></div>
    </footer>
  );
}
