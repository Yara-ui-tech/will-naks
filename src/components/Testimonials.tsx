import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

export default function Testimonials() {
  return (
    <div className="bg-cream py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4 font-sans">Student Stories</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-navy mb-6 italic">Faces of <span className="text-gold">Transformation</span></h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed italic">
            "Behind every statistic is a human story of resilience, hard work, and the power of a single opportunity."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-10 rounded-[3rem] relative h-full flex flex-col items-center text-center group hover:bg-navy transition-all duration-700 shadow-sm hover:shadow-2xl border border-gold/10"
            >
              <Quote className="absolute top-10 left-10 h-16 w-16 text-gold/10 group-hover:text-gold/20 transition-colors duration-700" />
              
              <div className="mb-8 relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cream shadow-xl relative z-10 group-hover:border-gold transition-colors duration-700">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gold w-10 h-10 rounded-full z-20 flex items-center justify-center shadow-lg">
                    <Quote className="h-4 w-4 text-navy fill-current" />
                </div>
              </div>

              <p className="text-gray-700 group-hover:text-gray-200 transition-colors duration-700 text-lg italic leading-relaxed mb-8">
                "{testimonial.content}"
              </p>

              <div className="mt-auto">
                <h4 className="text-2xl font-bold text-navy group-hover:text-gold transition-colors duration-700">{testimonial.name}</h4>
                <p className="text-gold group-hover:text-white/60 font-bold uppercase tracking-widest text-xs mt-1 transition-colors duration-700">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
