import { motion } from 'motion/react';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { TEAM } from '../constants';

export default function Team() {
  return (
    <div className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4 font-sans">Our team</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-navy mb-6 italic">Driven by <span className="text-gold">Passion</span></h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Meet the dedicated individuals working tirelessly to create opportunities for the next generation of African leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {TEAM.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gold/5 p-8 text-center group"
            >
              <div className="relative mb-8 inline-block">
                <div className="w-48 h-48 rounded-full overflow-hidden border-[10px] border-cream shadow-inner group-hover:border-gold/20 transition-all duration-500">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                </div>
                {member.linkedin && (
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 p-4 bg-gold rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 shadow-lg hover:bg-navy hover:text-gold"
                  >
                      <Linkedin className="h-5 w-5" />
                  </a>
                )}
              </div>
              <h4 className="text-2xl font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-300">{member.name}</h4>
              <p className="text-gold font-bold text-xs uppercase tracking-widest mb-8 font-sans">{member.role}</p>
              
              <div className="flex justify-center space-x-6 invisible group-hover:visible transition-all duration-500">
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-cream rounded-full text-navy/40 hover:text-navy hover:bg-gold transition-all duration-300">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                <a href="mailto:info@will-naks.org" className="p-3 bg-cream rounded-full text-navy/40 hover:text-navy hover:bg-gold transition-all duration-300">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
