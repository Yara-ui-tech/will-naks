import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { PROGRAMS } from '../constants';

export default function Programs() {
  return (
    <div className="bg-cream py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
          <div>
            <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4 font-sans">Our Programs</h2>
            <h3 className="text-4xl font-bold text-navy leading-tight">
              Actionable Support <br /> for Young Talent
            </h3>
          </div>
          <p className="text-gray-600 max-w-md text-lg leading-relaxed italic">
            "We provide a comprehensive support system that nurtures both academic excellence and personal character."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((program, index) => {
            const IconComponent = (Icons as any)[program.icon];
            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 p-3 bg-gold rounded-xl shadow-lg text-white">
                    {IconComponent && <IconComponent className="h-6 w-6 text-navy" />}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h4 className="text-2xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    {program.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                    {program.description}
                  </p>
                  <button className="text-navy font-bold text-sm flex items-center hover:text-gold transition-colors group/btn">
                    Learn more <Icons.ChevronRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
            <a 
              href="/support?tab=scholarship" 
              className="inline-flex items-center px-10 py-5 bg-gold text-navy rounded-full font-bold hover:bg-gold-light transition-all transform hover:scale-105 shadow-xl hover:shadow-gold/25"
            >
              Apply for Scholarship <Icons.ExternalLink className="ml-2 h-5 w-5" />
            </a>
        </div>
      </div>
    </div>
  );
}
