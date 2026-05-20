import { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || location.pathname !== '/' ? 'bg-white shadow-md py-4 text-navy' : 'bg-transparent py-6 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative h-12 w-12 flex items-center justify-center">
                <img 
                  src="/assets/logo.png" 
                  alt="WILL-NAKS Logo" 
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
                  }}
                />
                <div className="fallback-logo hidden bg-navy p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-gold" />
                </div>
              </div>
              <span className={`font-serif font-bold text-2xl tracking-tight transition-colors ${
                scrolled || location.pathname !== '/' ? 'text-navy' : 'text-white'
              }`}>
                WILL-NAKS <span className="text-gold">FOUNDATION</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8 mr-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:text-gold ${
                  scrolled || location.pathname !== '/' ? 'text-navy' : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/join"
              className="hidden md:block bg-navy text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg border border-white/10 hover:bg-navy/90"
            >
              Join Us
            </Link>
            <Link
              to="/support"
              className="hidden sm:block bg-gold hover:bg-gold-light text-navy px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-gold/20"
            >
              Donate Now
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-all border lg:hidden ${
                scrolled || location.pathname !== '/'
                  ? 'text-navy border-navy/10 bg-cream' 
                  : 'text-white border-white/20 bg-white/10 backdrop-blur-md'
              } hover:bg-gold hover:text-navy hover:border-gold`}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Global Overlay Nav */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/95 backdrop-blur-xl z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-cream shadow-2xl z-50 p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center space-x-3">
                   <div className="bg-navy p-2 rounded-lg">
                    <Heart className="h-6 w-6 text-gold" />
                  </div>
                  <span className="font-serif font-bold text-xl text-navy">WILL-NAKS</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-navy/5 rounded-full text-navy hover:bg-gold transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-8">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="group"
                  >
                    <Link 
                      to={link.href} 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between"
                    >
                      <span className="text-4xl md:text-5xl font-serif italic text-navy group-hover:text-gold transition-colors duration-300">
                        {link.name}
                      </span>
                      <motion.div
                        className="h-[1px] w-0 bg-gold group-hover:w-12 transition-all duration-300"
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 border-t border-navy/10 mt-auto space-y-4">
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gold transition-colors"
                >
                  <Heart className="h-3 w-3" /> <span>Admin Portal</span>
                </Link>
                <p className="text-gray-400 text-sm font-sans uppercase tracking-[0.2em]">Ready to make an impact?</p>
                <Link
                  to="/support"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-navy text-white px-8 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-navy/20 transition-all flex items-center justify-center group"
                >
                  Donate Now
                  <Heart className="ml-2 h-5 w-5 text-gold group-hover:fill-gold transition-all" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
