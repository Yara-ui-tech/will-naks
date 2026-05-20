import { motion } from 'motion/react';
import { Quote, Send, MessageCircle, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({ name: '', role: '', content: '', rating: 5 });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchTestimonials();

    // Real-time subscription - listen for all changes to handle updates and approvals
    const channel = supabase
      .channel('testimonials-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'testimonials' },
        () => fetchTestimonials()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    
    setTestimonials(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('testimonials').insert([{
      full_name: formState.name,
      role: formState.role,
      content: formState.content,
      rating: formState.rating,
      is_approved: false
    }]);

    if (!error) {
      setSubmitted(true);
      setFormState({ name: '', role: '', content: '', rating: 5 });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="bg-cream py-24" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4 font-sans">Voices of Impact</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-navy mb-6 italic">Student <span className="text-gold">Testimonials</span></h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed italic">
            "We believe in the power of stories. Every shared experience fuels our mission to empower more lives."
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-10 rounded-[3rem] relative h-full flex flex-col items-center text-center group hover:bg-navy transition-all duration-700 shadow-sm hover:shadow-2xl border border-gold/10"
              >
                <Quote className="absolute top-10 left-10 h-16 w-16 text-gold/10 group-hover:text-gold/20 transition-colors duration-700" />
                
                <div className="mb-8 relative">
                  <div className="w-24 h-24 rounded-full bg-cream overflow-hidden flex items-center justify-center text-navy font-bold text-3xl group-hover:bg-gold transition-colors duration-700 uppercase">
                    {testimonial.full_name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gold w-10 h-10 rounded-full z-20 flex items-center justify-center shadow-lg">
                      <Star className="h-4 w-4 text-navy fill-current" />
                  </div>
                </div>

                <p className="text-gray-700 group-hover:text-gray-200 transition-colors duration-700 text-lg italic leading-relaxed mb-8">
                  "{testimonial.content}"
                </p>

                <div className="mt-auto">
                  <h4 className="text-2xl font-bold text-navy group-hover:text-gold transition-colors duration-700">{testimonial.full_name}</h4>
                  <p className="text-gold group-hover:text-white/60 font-bold uppercase tracking-widest text-xs mt-1 transition-colors duration-700">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}

        <div className="max-w-3xl mx-auto">
          {!showForm ? (
            <div className="text-center">
              <button 
                onClick={() => setShowForm(true)}
                className="bg-navy text-white px-10 py-5 rounded-full font-bold inline-flex items-center space-x-3 hover:bg-gold hover:text-navy transition-all shadow-xl"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Share Your Testimony</span>
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gold/10"
            >
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-2xl font-bold text-navy">Submit Local Testimony</h4>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-navy transition-colors font-bold">Close</button>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckIcon />
                   </div>
                   <h5 className="text-xl font-bold text-navy mb-2">Thank You!</h5>
                   <p className="text-gray-600">Your testimony has been submitted and is awaiting administrator approval.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Role / Relation</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Scholar, Parent, Volunteer"
                        value={formState.role}
                        onChange={(e) => setFormState({...formState, role: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Story</label>
                    <textarea 
                      required
                      rows={4} 
                      value={formState.content}
                      onChange={(e) => setFormState({...formState, content: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                    ></textarea>
                  </div>
                  <button className="w-full py-5 bg-navy text-white rounded-xl font-bold text-lg flex items-center justify-center hover:bg-navy/90 transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-navy/20">
                    Submit Testimony <Send className="ml-3 h-5 w-5 text-gold" />
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  );
}
