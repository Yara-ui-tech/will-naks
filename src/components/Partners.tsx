import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Partners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data } = await supabase.from('partners').select('*');
      setPartners(data || []);
    } catch (err) {
      console.warn('Failed to fetch partners from database:', err);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

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

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id || partner.org_name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-gold/30 hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="w-24 h-24 flex-shrink-0 bg-navy rounded-2xl overflow-hidden flex items-center justify-center text-gold border-4 border-cream shadow-md group-hover:scale-110 transition-transform duration-500 p-2">
                    {partner.logo_url ? (
                      <img 
                        src={partner.logo_url} 
                        alt={`${partner.org_name} Logo`} 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="font-serif text-3xl font-bold uppercase">{partner.org_name ? partner.org_name.charAt(0) : 'P'}</span>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                      <h4 className="text-2xl font-bold text-navy">{partner.org_name}</h4>
                      <span className="bg-gold/10 text-navy text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border border-gold/20">{partner.industry}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600 mb-4 justify-center md:justify-start">
                      <Briefcase className="h-4 w-4 mt-1 text-gold flex-shrink-0" />
                      <p className="text-base leading-relaxed italic text-gray-500">"{partner.message}"</p>
                    </div>
                    {partner.website_url ? (
                      <a 
                        href={partner.website_url.startsWith('http') ? partner.website_url : `https://${partner.website_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        referrerPolicy="no-referrer"
                        className="inline-flex items-center text-sm font-bold text-navy hover:text-gold transition-colors underline decoration-gold/40 decoration-2 underline-offset-4"
                      >
                        Visit Partner Link & Adverts <ExternalLink className="ml-1 h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center text-sm font-bold text-navy/60 group-hover:text-gold transition-colors">
                        Market Collaboration Project <ExternalLink className="ml-1 h-3 w-3" />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
