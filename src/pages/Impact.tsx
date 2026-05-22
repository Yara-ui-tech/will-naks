import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Quote } from 'lucide-react';

export default function Impact() {
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data } = await supabase.from('impact_stories').select('*').order('created_at', { ascending: false });
        setStories(data || []);
      } catch (err) {
        console.warn('Failed to fetch impact stories from database:', err);
        setStories([]);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center"
        >
          <span className="text-gold font-bold uppercase tracking-[0.3em] text-sm italic">Voices of Success</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-navy mt-6 mb-8 italic">
            Impact <span className="text-gold">Stories</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            These are not just statistics; they are lives transformed through education and community.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-32">
          {stories.map((story, i) => (
            <motion.div
              key={story.id || story.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
            >
              <div className="flex-1 relative w-full lg:w-1/2">
                <div className="absolute -top-12 -left-12 text-gold/20">
                  <Quote size={200} />
                </div>
                <div className="relative rounded-[60px] overflow-hidden shadow-2xl h-[600px]">
                  <img 
                    src={story.image_url} 
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-navy/20"></div>
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <span className="text-gold font-bold uppercase tracking-widest text-sm">{story.year}</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mt-4 mb-6 italic">{story.name}</h2>
                <p className="text-navy font-bold mb-8 text-lg">{story.role}</p>
                <p className="text-xl text-gray-600 leading-relaxed italic mb-12">
                  "{story.content}"
                </p>
                <div className="h-1 w-20 bg-gold"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
