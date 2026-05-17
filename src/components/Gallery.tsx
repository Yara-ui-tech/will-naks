import { motion } from 'motion/react';
import { GALLERY } from '../constants';

export default function Gallery() {
  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4 font-sans">Our Gallery</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-navy mb-6 italic">Moments of <span className="text-gold">Change</span></h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed italic">
            "A glimpse into our programs, community outreach, and the daily lives of the students we serve."
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {GALLERY.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-square rounded-[2rem] overflow-hidden group cursor-pointer border border-gold/10 shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={img} 
                alt={`Foundation work ${index + 1}`} 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-navy bg-gold font-bold px-8 py-3 rounded-full translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                  Expand Story
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
