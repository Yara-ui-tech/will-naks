import { motion } from 'motion/react';
import { STATS } from '../constants';

export default function Impact() {
  return (
    <div className="bg-navy text-white py-20 rounded-[3.5rem] mx-4 sm:mx-8 border border-gold/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4 font-sans">Our Impact</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6 italic">Real Results, <span className="text-gold">Real Lives</span></h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We measure our success by the lives transformed and the potential unlocked across our communities.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all group"
            >
              <div className="text-4xl md:text-6xl font-bold text-gold mb-3 group-hover:scale-110 transition-transform">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-gray-400 font-bold uppercase tracking-wider text-xs md:text-sm font-sans">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
