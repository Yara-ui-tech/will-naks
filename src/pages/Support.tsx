import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Handshake, Users, GraduationCap, CheckCircle2, Upload, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type SupportType = 'donate' | 'partner' | 'volunteer' | 'scholarship';

export default function Support() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<SupportType>(() => {
    if (tabParam && ['donate', 'partner', 'volunteer', 'scholarship'].includes(tabParam)) {
      return tabParam as SupportType;
    }
    return 'donate';
  });

  useEffect(() => {
    if (tabParam && ['donate', 'partner', 'volunteer', 'scholarship'].includes(tabParam)) {
      setActiveTab(tabParam as SupportType);
    } else if (!tabParam) {
      setActiveTab('donate');
    }
    setSubmitted(false);
  }, [tabParam]);

  const handleTabChange = (tabId: SupportType) => {
    setActiveTab(tabId);
    setSubmitted(false);
    setSearchParams({ tab: tabId });
  };

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
        const chosen_programs = formData.getAll('chosen_programs') as string[];
        const is_orphan = data.is_orphan === 'yes';
        const age = parseInt(data.age as string, 10) || null;
        const dependants_count = parseInt(data.dependants_count as string, 10) || null;

        // Custom composite mapping to capture the missing fields in the standard schema
        const compositeNationality = `${data.nationality || 'Zimbabwean'} [Address: ${data.home_address || 'N/A'}]`;
        const compositeSubjectsStrength = `${data.subjects_strength || ''} [PrevResult: ${data.previous_result || 'N/A'}]`;

        const { error } = await supabase.from('scholarships').insert([{
          full_name: data.full_name,
          email: data.email,
          education_level: data.grade_form, // Store Grade/Form under education_level (Standard Schema)
          institution: data.school_name,   // Store School Name under institution (Standard Schema)
          reason: data.reason,
          date_of_birth: data.date_of_birth || null,
          age: age,
          gender: data.gender || null,
          nationality: compositeNationality,
          birth_cert_no: data.birth_cert_no || null,
          phone: data.phone || null,
          parent_name: data.parent_name || null,
          parent_relationship: data.parent_relationship || null,
          parent_occupation: data.parent_occupation || null,
          monthly_income: data.monthly_income || null,
          dependants_count: dependants_count,
          is_orphan: is_orphan,
          carer_details: data.carer_details || null,
          subjects_strength: compositeSubjectsStrength,
          career_aspirations: data.career_aspirations || null,
          chosen_programs: chosen_programs.length > 0 ? chosen_programs : null
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
                onClick={() => handleTabChange(tab.id as SupportType)}
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
                  <form onSubmit={handleSubmit} className="space-y-10 text-left">
                    <div className="text-center mb-10">
                      <h2 className="text-3xl font-serif font-bold text-navy mb-4 italic">Student Beneficiary Application Form</h2>
                      <p className="text-gray-600 text-sm">Official Intake Portal — WILL-NAKS FOUNDATION, Harare, Zimbabwe</p>
                    </div>

                    {/* SECTION A */}
                    <div className="space-y-6">
                      <div className="border-b border-gold/20 pb-2">
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Section A</span>
                        <h3 className="text-lg font-serif font-bold text-navy">Personal Information</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Full Name</label>
                          <input required name="full_name" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="Applicant Full Name" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Email Address (Optional)</label>
                          <input name="email" type="email" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="yourname@gmail.com" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Date of Birth</label>
                          <input required name="date_of_birth" type="date" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Age</label>
                          <input required name="age" type="number" min="1" max="100" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. 15" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Gender</label>
                          <select required name="gender" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Nationality</label>
                          <input required name="nationality" type="text" defaultValue="Zimbabwean" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">National ID / Birth Certificate No</label>
                          <input required name="birth_cert_no" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. 58-294711-X-43" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Home Address</label>
                          <input required name="home_address" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="Residential Town & Street" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Primary Phone / WhatsApp</label>
                          <input required name="phone" type="tel" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. 0775 386 704" />
                        </div>
                      </div>
                    </div>

                    {/* SECTION B */}
                    <div className="space-y-6">
                      <div className="border-b border-gold/20 pb-2">
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Section B</span>
                        <h3 className="text-lg font-serif font-bold text-navy">Academic Information</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Current School / Institution</label>
                          <input required name="school_name" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="School Name" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Grade / Form / Academic Year</label>
                          <input required name="grade_form" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. Form 3" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Previous Academic Result</label>
                          <input required name="previous_result" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. 8 As or 74% average" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Subjects of Strength</label>
                          <input required name="subjects_strength" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. Mathematics, Science" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Future Career Aspirations</label>
                          <input required name="career_aspirations" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. Doctor, Engineer" />
                        </div>
                      </div>
                    </div>

                    {/* SECTION C */}
                    <div className="space-y-6">
                      <div className="border-b border-gold/20 pb-2">
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Section C</span>
                        <h3 className="text-lg font-serif font-bold text-navy">Family & Financial Background</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Parent/Guardian Name</label>
                          <input required name="parent_name" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="Primary Guardian Full Name" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Relationship to Student</label>
                          <input required name="parent_relationship" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. Mother, Uncle, Grandmother" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Occupation of Parent</label>
                          <input required name="parent_occupation" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. Subsistence farmer" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Estimated Household Monthly Income</label>
                          <input required name="monthly_income" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. USD $150" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Number of Household Dependants</label>
                          <input required name="dependants_count" type="number" min="0" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. 5" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 pt-2">
                        <div className="bg-cream/20 p-5 rounded-2xl border border-gold/10 space-y-3">
                          <label className="text-xs font-bold text-navy uppercase tracking-wider block">Are you an orphan?</label>
                          <div className="flex gap-6 mt-1 text-sm text-gray-700 font-semibold">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="is_orphan" value="yes" className="accent-gold h-4 w-4" />
                              <span>Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="is_orphan" value="no" defaultChecked className="accent-gold h-4 w-4" />
                              <span>No</span>
                            </label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">If yes, details of caretakers / hardship</label>
                          <input name="carer_details" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="Provide context of current care" />
                        </div>
                      </div>
                    </div>

                    {/* SECTION D */}
                    <div className="space-y-6">
                      <div className="border-b border-gold/20 pb-2">
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Section D</span>
                        <h3 className="text-lg font-serif font-bold text-navy">Support Required & Declarations</h3>
                      </div>

                      <div className="bg-cream/20 p-6 rounded-2xl border border-gold/10 space-y-4">
                        <p className="text-xs font-bold text-navy uppercase tracking-wider">Select matching program areas:</p>
                        <div className="grid sm:grid-cols-2 gap-4 text-xs font-bold text-navy">
                          {[
                            'School Fees Assistance',
                            'Scholarship Application',
                            'Educational Resources (textbooks/uniforms)',
                            'Mentorship Programme',
                            'Leadership Development Programme',
                            'Orphans, elderly and widows support'
                          ].map((program) => (
                            <label key={program} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-navy/5 shadow-sm hover:border-gold/30 cursor-pointer">
                              <input type="checkbox" name="chosen_programs" value={program} className="accent-gold h-4 w-4 mt-0.5" />
                              <span className="leading-tight">{program}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Reason for Application & Context of hardship</label>
                        <textarea required name="reason" className="w-full px-5 py-4 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold h-32 text-sm font-sans" placeholder="Explain your circumstances and how WILL-NAKS can partner with you..."></textarea>
                      </div>
                    </div>

                    {/* SECTION E DECLARATION */}
                    <div className="space-y-4">
                      <div className="border-b border-gold/20 pb-2">
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Section E</span>
                        <h3 className="text-lg font-serif font-bold text-navy">Declaration Agreements</h3>
                      </div>
                      <div className="p-4 bg-navy/[0.02] border border-gold/15 rounded-2xl space-y-3 text-xs text-gray-500 leading-relaxed font-sans">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input required type="checkbox" className="accent-gold h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span>I declare that all information provided in this application is entirely true and accurate. I understand that any false information will result in immediate disqualification from the program.</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input required type="checkbox" className="accent-gold h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span>We (Student & Parent/Guardian) authorize WILL-NAKS FOUNDATION or its representatives to verify any details supplied in connection with this hardship assessment form.</span>
                        </label>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-gold text-navy rounded-2xl font-bold text-xl hover:bg-gold-light transition-all disabled:opacity-50"
                    >
                      {loading ? 'Processing Assessment Intake...' : 'Submit Beneficiary Application'}
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
