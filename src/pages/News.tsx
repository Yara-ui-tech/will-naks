import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowRight } from 'lucide-react';

export default function News() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchNews();

    const channel = supabase.channel('news-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, fetchNews)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setPosts(data);
        return;
      }
    } catch (err) {
      console.warn('Failed to fetch news posts, using static fallback:', err);
    }
    // Fallback
    setPosts([
      {
        title: "Annual Student Leadership Summit 2024",
        content: "Next month we are hosting our largest gathering of scholars and world-class industry mentors.",
        category: "Events",
        created_at: "2024-10-12T00:00:00",
        image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"
      }
    ]);
  };

  return (
    <div className="pt-32 pb-24">
       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center"
        >
          <span className="text-gold font-bold uppercase tracking-[0.3em] text-sm italic">Stay Updated</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-navy mt-6 mb-8 italic">
            News & <span className="text-gold">Journals</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Following the progress of our foundation and the achievements of our exceptional students.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {posts.map((post, i) => (
            <motion.article
              key={post.id || post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-96 overflow-hidden rounded-[40px] mb-8 shadow-2xl">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-8 left-8 bg-gold text-navy px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {post.category}
                </div>
              </div>
              <div className="px-4">
                <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-navy group-hover:text-gold transition-colors italic mb-4 leading-tight">
                  {post.title}
                </h2>
                <p className="text-gray-500 mb-8 leading-relaxed max-w-lg line-clamp-3">
                  {post.content}
                </p>
                <button className="flex items-center text-navy font-bold text-sm uppercase tracking-widest group-hover:text-gold transition-colors">
                  Read More <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
