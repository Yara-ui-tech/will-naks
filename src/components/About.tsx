import { motion } from 'motion/react';
import { Target, Eye, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200" 
                alt="Foundation Impact" 
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Founders Card */}
            <div className="absolute -bottom-10 -right-10 z-20 bg-navy p-8 rounded-2xl shadow-xl max-w-xs text-white hidden md:block border border-gold/20">
              <p className="text-gold font-bold text-lg mb-2 serif">Founded by Willie Nakunyada</p>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-4">Led by CEOs Simbarashe O Manongwa & Tapiwanashe Mandiveyi</p>
              <p className="text-gray-400 text-sm italic">"Education is the most powerful weapon which you can use to change the world."</p>
            </div>
            {/* Decorative Grid */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold/10 -z-10 rounded-full blur-3xl"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4 font-sans">Our Story</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-navy mb-8 leading-tight">
              Transforming Communities <br /> Through Education
            </h3>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed mb-10">
              <p>
                Founded by <strong className="text-navy font-semibold">Willie Nakunyada</strong> and led by CEOs <strong className="text-navy font-semibold">Simbarashe O Manongwa</strong> and <strong className="text-navy font-semibold">Tapiwanashe Mandiveyi</strong>, WILL-NAKS FOUNDATION is dedicated to bridging the gap between talent and opportunity.
              </p>
              <p>
                We believe that every child, regardless of their background, deserves the chance to reach their full potential. Our foundation was born from a deep commitment to humanitarian service and a belief in the power of youth empowerment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gold/10">
                  <Target className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1">Our Mission</h4>
                  <p className="text-sm text-gray-500">To identify, mentor, and financially support high-potential students from underprivileged backgrounds.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gold/10">
                  <Eye className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1">Our Vision</h4>
                  <p className="text-sm text-gray-500">A world where financial status is no longer a barrier to quality education and leadership development.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
