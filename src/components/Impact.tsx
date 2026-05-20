import { motion } from 'motion/react';
import DynamicStats from './Stats';

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

        <DynamicStats />
      </div>
    </div>
  );
}
