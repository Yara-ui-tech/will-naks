import React from 'react';
import { motion } from 'motion/react';
import { TEAM } from '../constants';
import { Linkedin, Mail } from 'lucide-react';

export default function Team() {
  return (
    <div className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-gold font-bold uppercase tracking-[0.3em] text-sm">Our People</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-navy mt-6 mb-8 italic">
            Meet the <span className="text-gold">Visionaries</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The dedicated team behind the WILL-NAKS Foundation, working tirelessly 
            to create a better future for Africa's youth.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div className="relative h-[450px] rounded-[40px] overflow-hidden shadow-2xl">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-white mb-2 italic">
                        {member.name}
                      </h3>
                      <p className="text-gold font-bold uppercase tracking-widest text-xs">
                        {member.role}
                      </p>
                    </div>
                    <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noreferrer" className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-gold hover:text-navy transition-all">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      <button className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-gold hover:text-navy transition-all">
                        <Mail className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
