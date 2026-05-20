import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { CheckCircle2, MessageCircle, ArrowRight, Mail, User, Phone } from 'lucide-react';

export default function Join() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    interests: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const interestsList = [
    'Mentorship',
    'Event Volunteering',
    'Donations',
    'Community Outreach',
    'Skill Sharing'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('members').insert([formData]);
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-16"
        >
          <span className="text-gold font-bold uppercase tracking-[0.3em] text-sm">Join the Movement</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-navy mt-6 mb-6 italic">
            Become a <span className="text-gold">Member</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Be part of a community dedicated to empowering Africa's next generation of leaders.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] shadow-2xl border border-gold/10 overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                        <User className="w-3 h-3 mr-2" /> Full Name
                      </label>
                      <input 
                        required 
                        type="text" 
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="w-full px-6 py-4 bg-cream/30 rounded-2xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 transition-all" 
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                        <Mail className="w-3 h-3 mr-2" /> Email Address
                      </label>
                      <input 
                        required 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-6 py-4 bg-cream/30 rounded-2xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 transition-all" 
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                      <Phone className="w-3 h-3 mr-2" /> Phone Number (WhatsApp)
                    </label>
                    <input 
                      required 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-6 py-4 bg-cream/30 rounded-2xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 transition-all" 
                      placeholder="+233 00 000 0000"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Areas of Interest</label>
                    <div className="flex flex-wrap gap-3">
                      {interestsList.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                            formData.interests.includes(interest)
                              ? 'bg-gold border-gold text-navy'
                              : 'bg-white border-navy/5 text-gray-500 hover:border-gold/30'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-navy text-white rounded-2xl py-6 font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-navy transition-all flex items-center justify-center group"
                  >
                    {loading ? 'Processing...' : (
                      <>
                        Join Now <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-navy rounded-[40px] p-12 text-center text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
              <CheckCircle2 className="w-20 h-20 text-gold mx-auto mb-8" />
              <h2 className="text-4xl font-serif font-bold italic mb-6">Welcome to the <span className="text-gold">Family</span>!</h2>
              <p className="text-xl text-gray-300 mb-12 max-w-lg mx-auto">
                Thank you for joining our movement. As a member, you'll receive exclusive updates and first access to our programs.
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md mx-auto">
                <p className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Official Channel</p>
                <h3 className="text-2xl font-bold mb-6">Connect with us on WhatsApp</h3>
                <a 
                  href="https://whatsapp.com/channel/0029VbCsKgO4NVicfQ7ZCB3W" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Join Our WhatsApp Channel</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
