import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Handshake, Users, GraduationCap, CheckCircle2, Upload, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type SupportType = 'donate' | 'partner' | 'volunteer' | 'scholarship';

export default function Support() {
  const [activeTab, setActiveTab] = useState<SupportType>('donate');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingLogo(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `partner-${Math.random()}.${fileExt}`;
        const filePath = `partners/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        setLogoUrl(data.publicUrl);
      } catch (err: any) {
        alert('Upload failed: ' + err.message);
      } finally {
        setUploadingLogo(false);
      }
    }
  };

  const removeLogo = () => {
    setLogoUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      if (activeTab === 'partner') {
        const { error } = await supabase.from('partners').insert([{
          org_name: data.org_name,
          industry: data.industry,
          message: data.message,
          email: data.email,
          website_url: data.website_url || null,
          logo_url: logoUrl
        }]);
        if (error) throw error;
      } else if (activeTab === 'volunteer') {
        const { error } = await supabase.from('volunteers').insert([{
          full_name: data.full_name,
          email: data.email,
          expertise: data.expertise,
          availability: data.availability
        }]);
        if (error) throw error;
      } else if (activeTab === 'scholarship') {
        const { error } = await supabase.from('scholarships').insert([{
          full_name: data.full_name,
          email: data.email,
          education_level: data.education_level,
          institution: data.institution,
          reason: data.reason
        }]);
        if (error) throw error;
      } else if (activeTab === 'donate') {
        const { error } = await supabase.from('donations').insert([{
          amount: parseFloat(data.amount as string) || 50,
          donor_name: data.full_name,
          email: data.email,
          payment_status: 'pending'
        }]);
        if (error) throw error;
      }
      
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'donate', label: 'Donate', icon: Heart },
    { id: 'partner', label: 'Partner', icon: Handshake },
    { id: 'volunteer', label: 'Volunteer', icon: Users },
    { id: 'scholarship', label: 'Scholarship', icon: GraduationCap },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-cream/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-gold font-bold uppercase tracking-[0.3em] text-sm italic">Get Involved</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-navy mt-4 mb-8">
              Support Our <span className="text-gold">Mission</span>
            </h1>
          </motion.div>

          {/* Tab Selection */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as SupportType);
                  setSubmitted(false);
                }}
                className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-navy text-white shadow-2xl shadow-navy/20 scale-105' 
                    : 'bg-white text-gray-500 hover:bg-gold/10 hover:text-navy border border-navy/5 shadow-lg'
                }`}
              >
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-gold' : ''}`} />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-1 bg-gold rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-navy/5"
              >
                {activeTab === 'donate' && (
                   <div className="space-y-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                      <h2 className="text-3xl font-serif font-bold text-navy mb-4 italic">Direct Impact</h2>
                      <p className="text-gray-600">Choose an amount to support a student's journey. 100% of your donation goes directly to educational needs.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['$10', '$50', '$100', 'Custom'].map((amount) => (
                        <button key={amount} className="py-6 rounded-2xl border-2 border-navy/5 font-bold text-xl hover:border-gold hover:text-gold transition-all text-navy italic">
                          {amount}
                        </button>
                      ))}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input required name="full_name" type="text" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                          <input required name="email" type="email" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" placeholder="john@example.com" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Donation Amount ($)</label>
                        <input required name="amount" type="number" defaultValue="50" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" />
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-5 bg-navy text-white rounded-2xl font-bold text-xl hover:bg-navy/90 transition-all flex items-center justify-center disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Complete Donation'} <Heart className="ml-3 h-6 w-6 text-gold" />
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'partner' && (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-serif font-bold text-navy mb-4 italic">Corporate Partnership</h2>
                      <p className="text-gray-600">Join our network of organizations dedicated to sustainable development.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Organization Name</label>
                        <input required name="org_name" type="text" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Industry</label>
                        <select name="industry" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5">
                          <option>Technology</option>
                          <option>Education</option>
                          <option>Finance</option>
                          <option>Healthcare</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Email</label>
                         <input required name="email" type="email" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Website or Collaboration Link (For Ads/Promo)</label>
                         <input name="website_url" type="url" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" placeholder="https://example.com" />
                      </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Company logo (Optional)</label>
                       {logoUrl ? (
                         <div className="flex items-center justify-between p-4 bg-gold/5 border border-gold/20 rounded-2xl">
                           <div className="flex items-center space-x-4">
                             <img src={logoUrl} alt="Uploaded logo" className="h-16 w-16 object-contain bg-navy rounded-xl p-2 border border-navy/10" />
                             <div>
                               <p className="text-sm font-bold text-navy">Logo successfully attached!</p>
                               <p className="text-xs text-gray-400">This will be featured in the partners registry upon approval.</p>
                             </div>
                           </div>
                           <button 
                             type="button" 
                             onClick={removeLogo} 
                             className="text-red-500 hover:text-red-600 text-xs font-bold flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                           >
                             <Trash2 className="h-4 w-4" /> <span>Remove</span>
                           </button>
                         </div>
                       ) : (
                         <div className="border-2 border-dashed border-gray-200 hover:border-gold rounded-2xl p-6 transition-all bg-cream/15 text-center relative hover:bg-cream/20">
                           <input 
                             type="file" 
                             accept="image/*" 
                             onChange={handleLogoUpload} 
                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                             disabled={uploadingLogo}
                           />
                           <div className="space-y-2">
                             <div className="flex justify-center">
                               {uploadingLogo ? (
                                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
                               ) : (
                                 <Upload className="h-8 w-8 text-gray-400" />
                               )}
                             </div>
                             <p className="text-xs font-semibold text-gray-500">
                               {uploadingLogo ? 'Uploading brand identity...' : 'Drag and drop or click to upload brand logo'}
                             </p>
                             <p className="text-[10px] text-gray-400">PNG, JPG or SVG up to 5MB</p>
                           </div>
                         </div>
                       )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 font-sans">Proposed Partnership Area</label>
                      <textarea name="message" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 h-32" placeholder="Tell us how you would like to collaborate..."></textarea>
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-gold text-navy rounded-2xl font-bold text-xl hover:bg-gold-light transition-all disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Request Partnership'}
                    </button>
                  </form>
                )}

                {activeTab === 'volunteer' && (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-serif font-bold text-navy mb-4 italic">Join the Movement</h2>
                      <p className="text-gray-600">Your skills and time can change lives. Tell us how you can help.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input required name="full_name" type="text" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input required name="email" type="email" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Area of Expertise</label>
                        <input required name="expertise" type="text" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" placeholder="e.g. Design, Teaching, Tech" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Availability</label>
                        <select name="availability" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5">
                          <option>Weekly (5-10 hours)</option>
                          <option>Bi-weekly</option>
                          <option>Monthly</option>
                          <option>Event-based</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-navy text-white rounded-2xl font-bold text-xl hover:bg-navy/90 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Sign Up to Volunteer'}
                    </button>
                  </form>
                )}

                {activeTab === 'scholarship' && (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-serif font-bold text-navy mb-4 italic">Scholarship Application</h2>
                      <p className="text-gray-600">Tell us your story and how we can support your educational goals.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input required name="full_name" type="text" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input required name="email" type="email" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Current Level of Education</label>
                        <input required name="education_level" type="text" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Institution Name</label>
                        <input required name="institution" type="text" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Reason for Application</label>
                      <textarea name="reason" className="w-full px-6 py-4 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 h-48" placeholder="Please describe your current financial situation and how this scholarship will impact your future..."></textarea>
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-gold text-navy rounded-2xl font-bold text-xl hover:bg-gold-light transition-all disabled:opacity-50"
                    >
                      {loading ? 'Processing Application...' : 'Submit Application'}
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] p-16 text-center shadow-2xl border border-navy/5"
              >
                <div className="bg-gold/20 p-8 rounded-full w-fit mx-auto mb-8">
                  <CheckCircle2 className="h-20 w-20 text-gold" />
                </div>
                <h2 className="text-4xl font-serif font-bold text-navy mb-4 italic">Request Received!</h2>
                <p className="text-xl text-gray-600 mb-12">Thank you for reaching out. Our team will review your submission and contact you via email shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-12 py-5 bg-navy text-white rounded-full font-bold hover:shadow-xl transition-all"
                >
                  Back to Support
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
