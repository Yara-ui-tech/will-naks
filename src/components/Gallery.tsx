import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { GALLERY } from '../constants';
import { supabase } from '../lib/supabase';

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data } = await supabase.from('gallery').select('url, category');
      setImages(data ? data.filter((item: any) => item.category !== 'Merchandise').map(item => item.url) : []);
    } catch (err) {
      console.warn('Failed to fetch gallery from database:', err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

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

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((img, index) => (
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
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-navy bg-gold font-bold px-8 py-3 rounded-full translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                    Full View
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
