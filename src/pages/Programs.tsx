import React from 'react';
import { motion } from 'motion/react';
import { PROGRAMS } from '../constants';
import * as LucideIcons from 'lucide-react';

export default function Programs() {
  return (
    <div className="pt-32 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-gold font-bold uppercase tracking-[0.3em] text-sm">Empowerment</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-navy mt-6 mb-8 italic">
            Impact <span className="text-gold">Programs</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            From direct financial aid to holistic mentorship, our programs are designed 
            to address the multi-faceted challenges faced by students.
          </p>
        </motion.div>
      </section>

      {/* Program Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((program, i) => {
            const Icon = (LucideIcons as any)[program.icon] || LucideIcons.Book;
            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden border border-navy/5 shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent flex items-end p-8">
                    <div className="bg-gold p-3 rounded-xl">
                      <Icon className="h-6 w-6 text-navy" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-navy mb-4 italic group-hover:text-gold transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {program.description}
                  </p>
                  <button className="text-navy font-bold text-sm uppercase tracking-widest border-b-2 border-gold pb-1 group-hover:border-navy transition-all">
                    Learn More
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-navy rounded-[40px] p-12 lg:p-20 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold italic mb-8">
              Want to <span className="text-gold">Learn More?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Download our full brochure to see detailed impact metrics and student success stories.
            </p>
            <button className="bg-gold text-navy px-12 py-5 rounded-full font-bold text-lg hover:bg-gold-light transition-all transform hover:scale-105 shadow-xl">
              Download Program Guide
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
