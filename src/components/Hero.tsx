import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1920")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2 text-gold mb-6"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-widest font-sans">Empowering Future Leaders</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-8xl font-bold text-white leading-[0.9] mb-6 font-serif"
          >
            Empowering <span className="text-gold italic font-medium">Potential</span> <br />
            Beyond Circumstances
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl"
          >
            Supporting talented and underprivileged students through education, mentorship, and opportunity. We believe financial barriers should never stop greatness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <a
              href="#donation"
              className="bg-gold hover:bg-gold-light text-navy px-10 py-5 rounded-full font-bold flex items-center justify-center transition-all shadow-xl hover:shadow-gold/20 transform hover:-translate-y-1"
            >
              Donate Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#contact"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-10 py-5 rounded-full font-bold flex items-center justify-center transition-all hover:-translate-y-1"
            >
              Become a Partner
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center text-white/50">
        <span className="text-xs uppercase tracking-widest mb-2 font-medium">Scroll to explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
      </div>
    </section>
  );
}
