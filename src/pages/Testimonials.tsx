import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Quote, MessageSquare } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setTestimonials(data);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-gold font-bold uppercase tracking-[0.3em] text-sm">Voices</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-navy mt-6 mb-8 italic">
            What People <span className="text-gold">Say</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Testimonials from our students, partners, and the communities we serve.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[40px] shadow-xl border border-gold/10 relative"
              >
                <Quote className="absolute top-8 right-8 text-gold/20 h-12 w-12" />
                <p className="text-gray-600 italic mb-8 leading-relaxed text-lg">
                  "{t.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-gold font-bold text-xl uppercase">
                    {t.full_name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy">{t.full_name}</h4>
                    <p className="text-xs text-gold font-bold uppercase tracking-widest">{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gold/30">
            <MessageSquare className="h-16 w-16 text-gold/30 mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-bold text-navy italic">No testimonials yet</h3>
            <p className="text-gray-500 mt-4">Be the first to share your story!</p>
          </div>
        )}
      </section>
    </div>
  );
}
