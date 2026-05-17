import { motion } from 'motion/react';
import { ExternalLink, Briefcase } from 'lucide-react';
import { PARTNERS } from '../constants';

export default function Partners() {
  return (
    <div className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4 font-sans">Our Partners</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-navy mb-6 italic">Strategic <span className="text-gold">Collaborations</span></h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            We are proud to work with organizations that share our commitment to Africa's future. 
            Below are our key partners and their unique business specialties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PARTNERS.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-gold/30 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-40 h-24 flex-shrink-0 bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <h4 className="text-2xl font-bold text-navy">{partner.name}</h4>
                    <span className="bg-gold/10 text-navy text-[10px] uppercase font-bold px-2 py-1 rounded-full border border-gold/20">Partner</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 mb-4">
                    <Briefcase className="h-4 w-4 mt-1 text-gold flex-shrink-0" />
                    <p className="text-base leading-relaxed italic">"{partner.specialization}"</p>
                  </div>
                  <button className="inline-flex items-center text-sm font-bold text-navy/60 hover:text-gold transition-colors">
                    Market Success Stories <ExternalLink className="ml-1 h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
