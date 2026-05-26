import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Handshake, Users, GraduationCap, CheckCircle2, Upload, Trash2, ShoppingBag, Download, Printer, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

type SupportType = 'donate' | 'partner' | 'volunteer' | 'scholarship' | 'shop';

export default function Support() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<SupportType>(() => {
    if (tabParam && ['donate', 'partner', 'volunteer', 'scholarship', 'shop'].includes(tabParam)) {
      return tabParam as SupportType;
    }
    return 'donate';
  });

  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from('gallery')
        .select('*')
        .eq('category', 'Merchandise');
      
      const defaultProducts = [
        {
          id: 'def-1',
          url: '/assets/products.png',
          title: 'WILL-NAKS Branded Classic Tee',
          price: 15,
          description: 'Elegant navy soft tee with metallic gold foundation crest.',
          variants: 'S, M, L, XL, XXL',
          in_stock: true,
          crop: { scale: 220, x: 10, y: 10 }
        },
        {
          id: 'def-2',
          url: '/assets/products.png',
          title: 'WILL-NAKS Premium Heavyweight Hoodie',
          price: 35,
          description: 'Premium fleece core hoodie with adjustable custom gold tipped toggle.',
          variants: 'S, M, L, XL',
          in_stock: true,
          crop: { scale: 220, x: 90, y: 10 }
        },
        {
          id: 'def-3',
          url: '/assets/products.png',
          title: 'WILL-NAKS Structured Embroidered Cap',
          price: 12,
          description: 'Solid curved brim snapback with stitched metallic crest.',
          variants: 'Adjustable Snapback',
          in_stock: true,
          crop: { scale: 220, x: 10, y: 90 }
        },
        {
          id: 'def-4',
          url: '/assets/products.png',
          title: 'Harare Handcrafted Canvas Tote',
          price: 10,
          description: 'Heavy duty premium woven cotton tote handpainted by young local artisans in Sunningdale, Harare.',
          variants: 'One Size',
          in_stock: true,
          crop: { scale: 220, x: 90, y: 90 }
        },
        {
          id: 'def-5',
          url: '/assets/products.png',
          title: 'Fundraising Supporter Bundle',
          price: 50,
          description: 'Our full commemorative kit representing elite-level support (Classic Tee + Premium Hoodie + Embroidered Cap).',
          variants: 'Custom sizes selection',
          in_stock: true,
          crop: { scale: 120, x: 50, y: 50 }
        }
      ];

      if (data && data.length > 0) {
        const parsed = data.map((item: any) => {
          try {
            const details = JSON.parse(item.caption || '{}');
            return {
              id: item.id,
              url: item.url,
              title: details.title || 'Official Merchandise',
              price: typeof details.price === 'number' ? details.price : parseFloat(details.price) || 15,
              description: details.description || '',
              variants: details.variants || 'S, M, L, XL',
              in_stock: details.in_stock !== false,
              crop: details.crop || null
            };
          } catch {
            return {
              id: item.id,
              url: item.url,
              title: item.caption || 'Special Merch Item',
              price: 15,
              description: 'Official WILL-NAKS Fundraiser Merch',
              variants: 'One Size',
              in_stock: true,
              crop: null
            };
          }
        });
        setProducts(parsed);
      } else {
        // Automatically seed default products into Supabase so that they are visible in the Admin Panel
        try {
          const itemsToSeed = defaultProducts.map((p) => ({
            url: p.url,
            category: 'Merchandise',
            caption: JSON.stringify({
              title: p.title,
              price: p.price,
              description: p.description,
              variants: p.variants,
              in_stock: p.in_stock,
              crop: p.crop
            })
          }));

          const { error: seedError } = await supabase.from('gallery').insert(itemsToSeed);
          if (!seedError) {
            const { data: refreshedData } = await supabase
              .from('gallery')
              .select('*')
              .eq('category', 'Merchandise');
            
            if (refreshedData && refreshedData.length > 0) {
              const parsed = refreshedData.map((item: any) => {
                try {
                  const details = JSON.parse(item.caption || '{}');
                  return {
                    id: item.id,
                    url: item.url,
                    title: details.title || 'Official Merchandise',
                    price: typeof details.price === 'number' ? details.price : parseFloat(details.price) || 15,
                    description: details.description || '',
                    variants: details.variants || 'S, M, L, XL',
                    in_stock: details.in_stock !== false,
                    crop: details.crop || null
                  };
                } catch {
                  return {
                    id: item.id,
                    url: item.url,
                    title: item.caption || 'Special Merch Item',
                    price: 15,
                    description: 'Official WILL-NAKS Fundraiser Merch',
                    variants: 'One Size',
                    in_stock: true,
                    crop: null
                  };
                }
              });
              setProducts(parsed);
              return;
            }
          }
        } catch (seedErr) {
          console.error('Failed to automatically seed default products:', seedErr);
        }

        setProducts(defaultProducts);
      }
    } catch (err) {
      console.warn('Failed to fetch merchandise from DB:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (tabParam && ['donate', 'partner', 'volunteer', 'scholarship', 'shop'].includes(tabParam)) {
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
  const [donateType, setDonateType] = useState<'Online' | 'Cash' | 'Goods' | 'In-Kind'>('Online');
  const [donateAmount, setDonateAmount] = useState<string>('50');
  const [createdDonation, setCreatedDonation] = useState<any>(null);
  
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadingPNG, setDownloadingPNG] = useState(false);

  const downloadReceiptPDF = async (receiptNo: string) => {
    const element = document.getElementById('official-donation-receipt-paper');
    if (!element) return;
    setDownloadingPDF(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const yPos = imgHeight < pageHeight ? (pageHeight - imgHeight) / 2 : 0;
      
      pdf.addImage(imgData, 'PNG', 0, yPos, imgWidth, imgHeight);
      pdf.save(`${receiptNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const downloadReceiptPNG = async (receiptNo: string) => {
    const element = document.getElementById('official-donation-receipt-paper');
    if (!element) return;
    setDownloadingPNG(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${receiptNo}.png`;
      link.href = imgData;
      link.click();
    } catch (error) {
      console.error('Error generating PNG:', error);
    } finally {
      setDownloadingPNG(false);
    }
  };
  
  // Scholarship Attachments States
  const [isBiological, setIsBiological] = useState<string>('yes');
  const [birthCertUrl, setBirthCertUrl] = useState<string | null>(null);
  const [uploadingBirthCert, setUploadingBirthCert] = useState(false);
  const [academicReportUrl, setAcademicReportUrl] = useState<string | null>(null);
  const [uploadingAcademicReport, setUploadingAcademicReport] = useState(false);
  const [applicantPhotoUrl, setApplicantPhotoUrl] = useState<string | null>(null);
  const [uploadingApplicantPhoto, setUploadingApplicantPhoto] = useState(false);
  const [hardshipLetterUrl, setHardshipLetterUrl] = useState<string | null>(null);
  const [uploadingHardshipLetter, setUploadingHardshipLetter] = useState(false);
  const [uploadErrorMsg, setUploadErrorMsg] = useState<string | null>(null);

  const uploadScholarshipFile = async (file: File, typeLabel: string, setUrl: (url: string | null) => void, setUploading: (u: boolean) => void) => {
    setUploading(true);
    setUploadErrorMsg(null);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `scholarship-${typeLabel}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `scholarships/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setUrl(data.publicUrl);
    } catch (err: any) {
      console.warn(`Supabase storage upload failed for ${typeLabel}, falling back to local file representation:`, err.message);
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUrl(reader.result as string);
          setUploadErrorMsg(`Notice: Processed document locally in dev preview mode.`);
        };
        reader.readAsDataURL(file);
      } catch (fallbackErr: any) {
        console.error("Local fallback failed:", fallbackErr);
        setUploadErrorMsg(`Upload failed: ${err.message || 'File processing error'}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingLogo(true);
      setUploadErrorMsg(null);
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
        console.warn('Supabase logo upload failed, falling back to local file representation:', err.message);
        try {
          const reader = new FileReader();
          reader.onloadend = () => {
            setLogoUrl(reader.result as string);
            setUploadErrorMsg(`Notice: Brand logo processed locally.`);
          };
          reader.readAsDataURL(file);
        } catch (fallbackErr: any) {
          console.error("Local fallback failing:", fallbackErr);
          setUploadErrorMsg(`Upload failed: ${err.message || 'File processing error'}`);
        }
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
        const carerText = data.carer_details ? (data.carer_details as string) : '';
        const caretakerContextStr = data.caretaker_context ? ` [Is Biological: ${data.is_biological || 'N/A'}] [Caretaker Arrangement Details: ${data.caretaker_context}]` : '';
        const compositeCarerDetails = `${carerText}${caretakerContextStr} [BirthCert: ${birthCertUrl || ''}] [Transcript: ${academicReportUrl || ''}] [Photo: ${applicantPhotoUrl || ''}] [HardshipLetter: ${hardshipLetterUrl || ''}]`.trim();

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
          carer_details: compositeCarerDetails,
          subjects_strength: compositeSubjectsStrength,
          career_aspirations: data.career_aspirations || null,
          chosen_programs: chosen_programs.length > 0 ? chosen_programs : null,
          is_biological: data.is_biological || 'yes',
          caretaker_context: data.caretaker_context || null
        }]);
        if (error) throw error;
      } else if (activeTab === 'donate') {
        const payload = {
          email: String(data.email || ''),
          phone: String(data.phone || 'N/A'),
          address: String(data.address || 'N/A'),
          donation_type: donateType,
          amount_usd: String(data.amount_usd || data.amount || '0'),
          amount_zwl: String(data.amount_zwl || '0'),
          goods_description: String(data.goods_description || 'N/A'),
          estimated_value: String(data.estimated_value || 'N/A'),
          purpose: String(data.purpose || 'General Humanitarian and Educational Programmes'),
          received_by: String(data.received_by || 'Yvonne Kodzaimambo (Administrative & Logistics Officer)')
        };

        const jsonEmail = JSON.stringify(payload);
        const donationAmount = parseFloat(payload.amount_usd) || 0;

        const { data: insertedData, error } = await supabase.from('donations').insert([{
          amount: donationAmount,
          donor_name: data.full_name,
          email: jsonEmail,
          payment_status: 'pending'
        }]).select();

        if (error) throw error;
        if (insertedData && insertedData.length > 0) {
          setCreatedDonation(insertedData[0]);
        } else {
          setCreatedDonation({
            id: 'WNF-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
            created_at: new Date().toISOString(),
            amount: donationAmount,
            donor_name: data.full_name,
            email: jsonEmail,
            payment_status: 'pending'
          });
        }
      } else if (activeTab === 'shop') {
        const nameVal = (data.full_name as string || '').trim();
        const names = nameVal.split(/\s+/);
        const firstName = names[0] || 'Fundraising';
        const lastName = names.slice(1).join(' ') || 'Supporter';
        const { error } = await supabase.from('contacts').insert([{
          first_name: firstName,
          last_name: lastName,
          email: data.email,
          subject: `Fundraising Store Order: ${data.product_name}`,
          message: `Request for fundraising items:\n- Product: ${data.product_name}\n- Qty: ${data.quantity}\n- Size/Color: ${data.size_variant || 'N/A'}\n- Phone: ${data.phone}\n- Special Requests / Notes:\n${data.notes || 'N/A'}`
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
    { id: 'shop', label: 'Fundraising Store', icon: ShoppingBag },
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
                      <h2 className="text-3xl font-serif font-bold text-navy mb-4 italic font-medium">Support Our Mission</h2>
                      <p className="text-gray-600 text-sm">Every contribution is automatically assigned a system-generated official receipt and stored for auditing and report transparency.</p>
                    </div>

                    {/* Donation Type Selection Buttons */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center mb-1">Select Donation Type</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-cream/10 p-2 rounded-2xl border border-navy/5">
                        {(['Online', 'Cash', 'Goods', 'In-Kind'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setDonateType(t)}
                            className={`py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                              donateType === t
                                ? 'bg-navy text-white shadow-md scale-105'
                                : 'bg-white hover:bg-gold/10 text-gray-500 hover:text-navy'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {(donateType === 'Online' || donateType === 'Cash') && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Configure Amount</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {['10', '50', '100', 'Custom'].map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                if (item !== 'Custom') {
                                  setDonateAmount(item);
                                }
                              }}
                              className={`py-4 rounded-xl border font-bold text-sm transition-all italic text-center ${
                                (item === 'Custom' && !['10', '50', '100'].includes(donateAmount)) || (item !== 'Custom' && donateAmount === item)
                                  ? 'border-gold bg-gold/10 text-navy font-black shadow-inner shadow-gold/10'
                                  : 'border-navy/5 bg-white text-gray-500 hover:border-gold hover:text-navy'
                              }`}
                            >
                              {item === 'Custom' ? 'Custom' : `$${item}`}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1">Donor Full Name</label>
                          <input required name="full_name" type="text" className="w-full px-5 py-3.5 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 text-sm font-sans" placeholder="e.g. Tendai Moyo" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1">Email Address</label>
                          <input required name="email" type="email" className="w-full px-5 py-3.5 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 text-sm font-sans" placeholder="yourname@gmail.com" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1">Phone Number</label>
                           <input required name="phone" type="tel" className="w-full px-5 py-3.5 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 text-sm font-sans" placeholder="e.g. +263 775 386 704" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1">Donor Home Address</label>
                          <input required name="address" type="text" className="w-full px-5 py-3.5 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 text-sm font-sans" placeholder="e.g. 45 Samora Machel Ave, Harare" />
                        </div>
                      </div>

                      {/* Amount Configurations */}
                      {(donateType === 'Online' || donateType === 'Cash') && (
                        <div className="grid md:grid-cols-2 gap-6 bg-cream/20 p-4 rounded-2xl border border-navy/5">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-navy uppercase tracking-wider block ml-1">Donation Amount (USD)</label>
                            <input
                              required
                              name="amount_usd"
                              type="number"
                              min="1"
                              value={donateAmount}
                              onChange={(e) => setDonateAmount(e.target.value)}
                              className="w-full px-5 py-3.5 bg-white rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 text-sm font-bold font-mono text-green-700"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1">Donation Amount (ZWL / Secondary Currency - Optional)</label>
                            <input
                              name="amount_zwl"
                              type="text"
                              placeholder="e.g. 2500 ZWL"
                              className="w-full px-5 py-3.5 bg-white rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 text-sm font-mono text-gray-700"
                            />
                          </div>
                        </div>
                      )}

                      {/* Goods Description (for Goods or In-kind) */}
                      {(donateType === 'Goods' || donateType === 'In-Kind') && (
                        <div className="grid md:grid-cols-2 gap-6 bg-gold/5 p-4 rounded-2xl border border-gold/10">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-navy uppercase tracking-wider block ml-1">Description of Goods / Items Provided</label>
                            <textarea
                              required
                              name="goods_description"
                              placeholder="e.g. 10 Packages of mathematical instruments, 5 boxes of grade-school textbooks, winter sweaters."
                              className="w-full px-5 py-3 h-24 bg-white rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 text-sm leading-relaxed"
                            />
                          </div>
                          <div className="space-y-2 flex flex-col justify-between">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1">Estimated Value (USD / Equivalent)</label>
                              <input
                                required
                                name="estimated_value"
                                type="text"
                                placeholder="e.g. $150 USD"
                                className="w-full px-5 py-3.5 bg-white rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1">Programme / Donation Purpose</label>
                          <select name="purpose" className="w-full px-5 py-3.5 bg-cream/50 rounded-xl focus:ring-2 focus:ring-gold outline-none border border-navy/5 text-sm">
                            <option>Disadvantaged Orphans Scholarship Fund</option>
                            <option>Primary & Secondary School Fees Assistance</option>
                            <option>Underprivileged Student Mentorship Programme</option>
                            <option>Elderly and Widows Caring Packages</option>
                            <option>General registered humanitarian funds</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1">Received & Signed By (Staff Representative)</label>
                          <input
                            required
                            name="received_by"
                            type="text"
                            readOnly
                            defaultValue="Yvonne Kodzaimambo (Administrative & Logistics Officer)"
                            className="w-full px-5 py-3.5 bg-gray-100 rounded-xl outline-none border border-navy/5 text-sm text-gray-500 cursor-not-allowed font-medium"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-navy text-white rounded-2xl font-bold text-lg hover:bg-navy/95 hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Record & Generate Official Receipt'} <Heart className="ml-3 h-5 w-5 text-gold animate-pulse" />
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
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Orphan status - caretakers / hardship details</label>
                          <input name="carer_details" type="text" className="w-full px-5 py-3.5 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="Provide context of current care status" />
                        </div>
                      </div>

                      {/* Guardian Caring for Non-Biological Child Section */}
                      <div className="bg-gold/5 border border-gold/20 p-6 rounded-2xl space-y-4">
                        <div>
                          <label className="text-xs font-bold text-navy uppercase tracking-wider block">Caretaker / Guardian Information for Non-Biological Children</label>
                          <p className="text-xs text-gray-500 mt-1">If you are a caretaker or community member taking care of a child who is NOT your biological child (e.g., an orphaned relative, a foster child, or a neighbor's child), please tell us below.</p>
                        </div>
                        
                        <div className="space-y-4">
                          <label className="text-xs font-bold text-gray-700 block mb-1">Is this applicant student your biological child?</label>
                          <div className="flex flex-wrap gap-6 text-sm text-gray-700 font-semibold">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="is_biological" 
                                value="yes" 
                                checked={isBiological === 'yes'} 
                                onChange={() => setIsBiological('yes')}
                                className="accent-gold h-4 w-4" 
                              />
                              <span>Yes, they are my biological child</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="is_biological" 
                                value="no" 
                                checked={isBiological === 'no'} 
                                onChange={() => setIsBiological('no')}
                                className="accent-gold h-4 w-4" 
                              />
                              <span>No, I am taking care of this child (Caretaker / Guardian / Sponsor)</span>
                            </label>
                          </div>
                        </div>

                        {isBiological === 'no' && (
                          <div className="space-y-2 mt-4">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Caretaker arrangement context & child's background <span className="text-red-500">*</span></label>
                            <textarea 
                              required={isBiological === 'no'}
                              name="caretaker_context" 
                              className="w-full px-5 py-4 bg-cream/35 rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold h-28 text-sm font-sans" 
                              placeholder="Please explain the child's circumstances (e.g., late parents, abandonment), your relationship to them (e.g., grandmother, aunt, caring community neighbor), and details of their custody arrangement."
                            ></textarea>
                          </div>
                        )}
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

                    {/* SECTION E: DOCUMENT UPLOADS */}
                    <div className="space-y-6">
                      <div className="border-b border-gold/20 pb-2">
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Section E</span>
                        <h3 className="text-lg font-serif font-bold text-navy">Supporting Documents Upload</h3>
                        <p className="text-xs text-gray-400 mt-1">Please provide clear copies of official documents to authenticate your hardship status and academic claims.</p>
                        {uploadErrorMsg && (
                          <div className={`mt-3 px-4 py-2.5 rounded-xl text-xs font-semibold font-sans flex items-center space-x-2 border shadow-sm ${uploadErrorMsg.includes('Notice') ? 'bg-gold/10 text-navy border-gold/30' : 'bg-red-50 text-red-800 border-red-200'}`}>
                            <span>💡</span>
                            <span>{uploadErrorMsg}</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Birth Certificate upload box */}
                        <div className="bg-cream/15 border border-gold/10 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                          <div>
                            <span className="text-xs font-bold text-navy block">Copy of Birth Certificate / Gov ID <span className="text-red-500">*</span></span>
                            <p className="text-[10px] text-gray-500 mt-0.5 font-sans">Official identification of the student for legal verification.</p>
                          </div>
                          
                          {birthCertUrl ? (
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                              <div className="flex items-center space-x-2.5 truncate">
                                <span className="text-green-600 text-xs font-semibold">✓ Attached successfully</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setBirthCertUrl(null)} 
                                className="text-red-500 hover:text-red-650 text-xs font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <div className="border border-dashed border-gray-200 hover:border-gold rounded-xl p-4 text-center relative bg-white transition-all">
                              <input 
                                type="file" 
                                accept="image/*,application/pdf" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    uploadScholarshipFile(e.target.files[0], 'birth-cert', setBirthCertUrl, setUploadingBirthCert);
                                  }
                                }} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                disabled={uploadingBirthCert}
                              />
                              <div className="space-y-1">
                                <div className="flex justify-center">
                                  {uploadingBirthCert ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gold"></div>
                                  ) : (
                                    <Upload className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <p className="text-xs font-semibold text-gray-500">
                                  {uploadingBirthCert ? 'Uploading...' : 'Choose Birth Cert Copy'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Academic Report Card upload box */}
                        <div className="bg-cream/15 border border-gold/10 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                          <div>
                            <span className="text-xs font-bold text-navy block">Last Term's Academic Report Card <span className="text-red-500">*</span></span>
                            <p className="text-[10px] text-gray-500 mt-0.5 font-sans">Official term report card stating marks & term overview.</p>
                          </div>
                          
                          {academicReportUrl ? (
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                              <div className="flex items-center space-x-2.5 truncate">
                                <span className="text-green-600 text-xs font-semibold">✓ Attached successfully</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setAcademicReportUrl(null)} 
                                className="text-red-500 hover:text-red-650 text-xs font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <div className="border border-dashed border-gray-200 hover:border-gold rounded-xl p-4 text-center relative bg-white transition-all">
                              <input 
                                type="file" 
                                accept="image/*,application/pdf" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    uploadScholarshipFile(e.target.files[0], 'academic-report', setAcademicReportUrl, setUploadingAcademicReport);
                                  }
                                }} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                disabled={uploadingAcademicReport}
                              />
                              <div className="space-y-1">
                                <div className="flex justify-center">
                                  {uploadingAcademicReport ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gold"></div>
                                  ) : (
                                    <Upload className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <p className="text-xs font-semibold text-gray-500">
                                  {uploadingAcademicReport ? 'Uploading...' : 'Choose Academic Report Copy'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Applicant Portrait Photo upload box */}
                        <div className="bg-cream/15 border border-gold/10 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                          <div>
                            <span className="text-xs font-bold text-navy block">Applicant Portrait Photo (Optional)</span>
                            <p className="text-[10px] text-gray-500 mt-0.5 font-sans">Clear front-facing portrait of student applicant.</p>
                          </div>
                          
                          {applicantPhotoUrl ? (
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                              <div className="flex items-center space-x-2.5 truncate">
                                <span className="text-green-600 text-xs font-semibold">✓ Attached successfully</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setApplicantPhotoUrl(null)} 
                                className="text-red-500 hover:text-red-650 text-xs font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <div className="border border-dashed border-gray-200 hover:border-gold rounded-xl p-4 text-center relative bg-white transition-all">
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    uploadScholarshipFile(e.target.files[0], 'applicant-photo', setApplicantPhotoUrl, setUploadingApplicantPhoto);
                                  }
                                }} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                disabled={uploadingApplicantPhoto}
                              />
                              <div className="space-y-1">
                                <div className="flex justify-center">
                                  {uploadingApplicantPhoto ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gold"></div>
                                  ) : (
                                    <Upload className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <p className="text-xs font-semibold text-gray-500">
                                  {uploadingApplicantPhoto ? 'Uploading...' : 'Choose Student Photograph'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Guardian Hardship Letter upload box */}
                        <div className="bg-cream/15 border border-gold/10 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                          <div>
                            <span className="text-xs font-bold text-navy block">Hardship Substantiation Letter (Optional)</span>
                            <p className="text-[10px] text-gray-500 mt-0.5 font-sans">A signed guardian statement, death cert (orphan) or welfare slips.</p>
                          </div>
                          
                          {hardshipLetterUrl ? (
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                              <div className="flex items-center space-x-2.5 truncate">
                                <span className="text-green-600 text-xs font-semibold">✓ Attached successfully</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setHardshipLetterUrl(null)} 
                                className="text-red-500 hover:text-red-650 text-xs font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <div className="border border-dashed border-gray-200 hover:border-gold rounded-xl p-4 text-center relative bg-white transition-all">
                              <input 
                                type="file" 
                                accept="image/*,application/pdf" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    uploadScholarshipFile(e.target.files[0], 'hardship-letter', setHardshipLetterUrl, setUploadingHardshipLetter);
                                  }
                                }} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                disabled={uploadingHardshipLetter}
                              />
                              <div className="space-y-1">
                                <div className="flex justify-center">
                                  {uploadingHardshipLetter ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gold"></div>
                                  ) : (
                                    <Upload className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <p className="text-xs font-semibold text-gray-500">
                                  {uploadingHardshipLetter ? 'Uploading...' : 'Choose Letter or Hardship Proof'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* SECTION F DECLARATION */}
                    <div className="space-y-4">
                      <div className="border-b border-gold/20 pb-2">
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Section F</span>
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
                      disabled={loading || uploadingBirthCert || uploadingAcademicReport || uploadingApplicantPhoto || uploadingHardshipLetter}
                      className="w-full py-5 bg-gold text-navy rounded-2xl font-bold text-xl hover:bg-gold-light transition-all disabled:opacity-50"
                    >
                      {loading ? 'Processing Assessment Intake...' : 
                       (uploadingBirthCert || uploadingAcademicReport || uploadingApplicantPhoto || uploadingHardshipLetter) ? 'Uploading Supporting Files...' :
                       (!birthCertUrl || !academicReportUrl) ? 'Please Upload Required Documents (Birth Cert & Report Card)' :
                       'Submit Beneficiary Application'}
                    </button>
                  </form>
                )}

                {activeTab === 'shop' && (
                  <div className="space-y-16 text-left">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                      <h2 className="text-3xl font-serif font-bold text-navy mb-4 italic font-medium">Fundraising Store</h2>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Wear the mission, support our children! 100% of the proceeds from our official merchandising sales directly fund school fees, materials, and support systems for exceptional underprivileged students in Zimbabwe.
                      </p>
                    </div>

                    {/* Products Grid Section */}
                    <div className="space-y-8">
                      <div className="flex flex-col sm:flex-row justify-between items-center bg-cream/20 border border-gold/15 p-6 rounded-3xl gap-4">
                        <div className="text-left font-sans">
                          <p className="font-bold text-navy text-sm uppercase tracking-wider">Full Catalog Available</p>
                          <p className="text-xs text-gray-500">We suggest downloading our composite catalog sheet for physical printing or offline reference.</p>
                        </div>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = '/assets/products.png';
                            link.download = 'will_naks_merchandise_catalog.png';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="flex items-center space-x-2 bg-navy hover:bg-navy/95 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl shadow transition-all hover:scale-[1.02] active:scale-95"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download Full Catalog Image</span>
                        </button>
                      </div>

                      {loadingProducts ? (
                        <div className="flex justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {products.map((p) => (
                            <div key={p.id} className="group bg-white rounded-3xl overflow-hidden border border-navy/5 shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                              <div className="relative aspect-square overflow-hidden bg-cream/10">
                                {p.crop ? (
                                  <div 
                                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    style={{
                                      backgroundImage: `url(${p.url})`,
                                      backgroundSize: `${p.crop.scale}%`,
                                      backgroundPosition: `${p.crop.x}% ${p.crop.y}%`,
                                      backgroundRepeat: 'no-repeat'
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={p.url}
                                    alt={p.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800';
                                    }}
                                  />
                                )}
                                <div className="absolute top-3 right-3 bg-gold/90 backdrop-blur-sm text-navy text-xs font-black py-1 px-3.5 rounded-full shadow">
                                  ${p.price}
                                </div>
                                {!p.in_stock && (
                                  <div className="absolute inset-0 bg-navy/60 backdrop-blur-[2px] flex items-center justify-center">
                                    <span className="bg-red-500 text-white font-bold text-xs uppercase px-4 py-1.5 rounded-full tracking-wider shadow">
                                      Pre-Order Only
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                  <h3 className="font-serif font-bold text-lg text-navy line-clamp-1">{p.title}</h3>
                                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 min-h-[2rem] leading-relaxed">{p.description}</p>
                                  <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-gray-400 font-sans">
                                    <span>Sizes/Variants: <strong className="text-navy">{p.variants}</strong></span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                  <button
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = p.url;
                                      link.target = '_blank';
                                      link.download = `${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_product.png`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }}
                                    className="flex items-center justify-center space-x-1 border border-navy/10 hover:border-gold hover:bg-cream/10 text-gray-600 hover:text-navy text-xs font-bold py-2.5 rounded-xl transition-all"
                                    title="Download image of this product"
                                  >
                                    <Download className="h-4.5 w-4.5" />
                                    <span>Download Image</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedProduct(`${p.title} ($${p.price})`);
                                      const formElement = document.getElementById('shop-inquiry-form');
                                      if (formElement) {
                                        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                      }
                                    }}
                                    className="flex items-center justify-center space-x-1.5 bg-navy hover:bg-navy/95 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
                                  >
                                    <ShoppingBag className="h-4.5 w-4.5" />
                                    <span>Order/Inquire</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="shop-inquiry-form">
                      {/* Left: instruction info */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="bg-navy/[0.02] border border-navy/5 p-8 rounded-3xl text-xs space-y-4 text-gray-500 font-sans shadow-sm">
                          <p className="font-black text-navy uppercase text-[11px] tracking-wider mb-2">How our fundraising store purchase works:</p>
                          <ol className="list-decimal pl-4 space-y-2.5 text-gray-600 leading-relaxed text-xs">
                            <li>Review the dynamic products catalog shown above.</li>
                            <li>Click <strong>Order/Inquire</strong> on your chosen merchandise item to prefill it into the form, or select manually.</li>
                            <li>Fill out your contact details, required size variants, and desired quantities.</li>
                            <li>Our team will contact you directly via Email, WhatsApp, or Phone to finalize local payment and Harare delivery/pickup options.</li>
                          </ol>
                          <div className="bg-gold/10 p-3.5 rounded-xl border border-gold/15 text-navy font-bold text-[10px] uppercase tracking-wider mt-4">
                            100% of fundraising merchandise sales directly fund student education fees in Zimbabwe.
                          </div>
                        </div>
                      </div>

                      {/* Order Inquiry Form column on the right */}
                      <div className="lg:col-span-7 bg-cream/15 p-8 rounded-3xl border border-navy/5 shadow-inner">
                        <h3 className="text-xl font-serif font-bold text-navy mb-6">Merchandise Order Inquiry</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Full Name</label>
                              <input required name="full_name" type="text" className="w-full px-5 py-3.5 bg-white rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="Your Name" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Email Address</label>
                              <input required name="email" type="email" className="w-full px-5 py-3.5 bg-white rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="yourname@example.com" />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Select Product</label>
                              <select 
                                required 
                                name="product_name"
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="w-full px-5 py-3.5 bg-white rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans"
                              >
                                <option value="">Choose an item...</option>
                                {products.map((p) => (
                                  <option key={p.id} value={`${p.title} ($${p.price})`}>
                                    {p.title} (${p.price})
                                  </option>
                                ))}
                                <option value="Other / Multi-select item in notes">Other / Mentioned in Notes</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Size / Color</label>
                                <input name="size_variant" type="text" className="w-full px-5 py-3.5 bg-white rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. L / Navy" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Quantity</label>
                                <input required name="quantity" type="number" min="1" defaultValue="1" className="w-full px-5 py-3.5 bg-white rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Phone / WhatsApp Number</label>
                            <input required name="phone" type="tel" className="w-full px-5 py-3.5 bg-white rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold text-sm font-sans" placeholder="e.g. +263 775 386 704" />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Delivery Address or Special Notes (Optional)</label>
                            <textarea name="notes" className="w-full px-5 py-3.5 bg-white rounded-xl outline-none border border-navy/5 focus:ring-2 focus:ring-gold h-28 text-sm font-sans" placeholder="Mention size selections, alternative colors, or delivery instructions in Harare or elsewhere..."></textarea>
                          </div>

                          <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-navy text-white rounded-2xl font-bold hover:shadow-xl hover:bg-navy/95 transition-all text-base flex items-center justify-center disabled:opacity-50"
                          >
                            {loading ? 'Sending Inquiry...' : 'Submit Order Inquiry'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {activeTab === 'donate' && createdDonation ? (
                  <div className="bg-white rounded-[40px] p-6 md:p-12 shadow-2xl border border-navy/5 text-left max-w-3xl mx-auto space-y-8">
                    <div className="text-center pb-6 border-b border-navy/5">
                      <div className="bg-amber-100 p-4 rounded-full w-fit mx-auto mb-4 animate-pulse">
                        <CheckCircle2 className="h-12 w-12 text-amber-600" />
                      </div>
                      <h2 className="text-3xl font-serif font-bold text-navy italic">Donation Logged & Pending Verification</h2>
                      <p className="text-sm text-gray-500 mt-2 px-4 max-w-xl mx-auto">
                        Your contribution has been logged in our secure ledger. Once our admin verifies the deposit, the official receipt will be approved and sent to your email address automatically.
                      </p>
                    </div>

                    {/* Official Receipt Paper Segment - Designed strictly to be a single page */}
                    <div 
                      id="official-donation-receipt-paper" 
                      className="bg-white p-8 rounded-3xl relative overflow-hidden font-sans border border-navy/10 shadow-lg text-navy max-w-2xl mx-auto"
                      style={{ minHeight: '640px' }}
                    >
                      {/* Decorative Gold Header Ribbon */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gold via-navy to-gold"></div>
                      
                      {/* Pending Verification Watermark/Banner */}
                      {createdDonation?.payment_status === 'pending' && (
                        <div className="bg-amber-100 border-b border-amber-300 text-amber-800 text-[9px] font-bold text-center py-1 absolute top-2 left-0 right-0 tracking-widest uppercase">
                          ⚠️ PENDING PAYMENT VERIFICATION — OFFICIALLY SIGNED & EMAILED ONCE APPROVED
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-navy/10 pb-6 mb-6 gap-4 mt-4">
                        <div>
                          <h3 className="font-serif font-black text-xl tracking-tight text-navy uppercase">WILL-NAKS FOUNDATION</h3>
                          <span className="text-[10px] font-bold text-gold tracking-widest uppercase block mt-1">OFFICIAL DONATION RECEIPT</span>
                          <span className="text-[9px] text-gray-400 block mt-0.5">PVO Reg: 18/2023 | Harare, Zimbabwe</span>
                        </div>
                        <div className="bg-navy/5 border border-navy/10 py-2 px-4 rounded-xl text-left sm:text-right font-mono">
                          <span className="text-[8px] uppercase tracking-wider block text-gray-400 font-bold">RECEIPT NO</span>
                          <span className="text-xs font-bold text-navy tracking-wider">
                            {`WNF-REC-${(createdDonation.id || '').replace(/-/g, '').substring(0, 8).toUpperCase()}`}
                          </span>
                        </div>
                      </div>

                      {/* Receipt Fields Grid */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs mb-6">
                        <div className="border-b border-gray-100 pb-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Date Issued</span>
                          <span className="text-navy font-bold">{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                        </div>
                        <div className="border-b border-gray-100 pb-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Donation Type</span>
                          <span className="text-navy font-bold px-2 py-0.5 bg-gold/10 text-gold rounded-full inline-block mt-0.5 uppercase tracking-wide text-[8px]">{donateType}</span>
                        </div>
                        
                        <div className="col-span-2 border-b border-gray-100 pb-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Receipt Status</span>
                          <span className={`font-bold px-2 py-0.5 rounded-md inline-block mt-0.5 text-[9px] tracking-wide uppercase ${
                            createdDonation?.payment_status === 'approved' 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                          }`}>
                            {createdDonation?.payment_status === 'approved' ? '✓ Verified (Official Receipt Emailed)' : '⚠️ Pending Payment Audit (Awaiting Approval)'}
                          </span>
                        </div>
                        
                        <div className="col-span-2 border-b border-gray-100 pb-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Donor Full Name</span>
                          <span className="text-navy font-bold text-sm block mt-0.5">{createdDonation.donor_name}</span>
                        </div>

                        <div className="border-b border-gray-100 pb-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Donor Contact</span>
                          <span className="text-navy font-medium text-xs font-mono block mt-0.5">
                            {(() => {
                              try {
                                if (createdDonation.email && createdDonation.email.startsWith('{')) {
                                  const p = JSON.parse(createdDonation.email);
                                  return `${p.phone || 'N/A'} / ${p.email || 'N/A'}`;
                                }
                              } catch(e){}
                              return createdDonation.email;
                            })()}
                          </span>
                        </div>
                        
                        <div className="border-b border-gray-100 pb-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Donor Home Address</span>
                          <span className="text-navy font-medium text-xs block mt-0.5">
                            {(() => {
                              try {
                                if (createdDonation.email && createdDonation.email.startsWith('{')) {
                                  const p = JSON.parse(createdDonation.email);
                                  return p.address || 'Harare, Zimbabwe';
                                }
                              } catch(e){}
                              return 'Harare, Zimbabwe';
                            })()}
                          </span>
                        </div>

                        {(donateType === 'Online' || donateType === 'Cash') ? (
                          <>
                            <div className="border-b border-gray-100 pb-2">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Amount (USD)</span>
                              <span className="text-green-700 font-extrabold text-sm font-mono block mt-0.5">${createdDonation.amount} USD</span>
                            </div>
                            <div className="border-b border-gray-100 pb-2">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">ZWL / Alternative Currency</span>
                              <span className="text-navy font-medium font-mono text-xs block mt-0.5">
                                {(() => {
                                  try {
                                    if (createdDonation.email && createdDonation.email.startsWith('{')) {
                                      const p = JSON.parse(createdDonation.email);
                                      return p.amount_zwl || 'N/A';
                                    }
                                  } catch(e){}
                                  return 'N/A';
                                })()}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="border-b border-gray-100 pb-2 col-span-2">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Description of Contributed Goods</span>
                              <span className="text-navy font-medium leading-relaxed block mt-0.5 text-xs">
                                {(() => {
                                  try {
                                    if (createdDonation.email && createdDonation.email.startsWith('{')) {
                                      const p = JSON.parse(createdDonation.email);
                                      return p.goods_description || 'N/A';
                                    }
                                  } catch(e){}
                                  return 'N/A';
                                })()}
                              </span>
                            </div>
                            <div className="border-b border-gray-100 pb-2 col-span-2">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Estimated Contribution Value</span>
                              <span className="text-navy font-extrabold font-mono text-xs block mt-0.5">
                                {(() => {
                                  try {
                                    if (createdDonation.email && createdDonation.email.startsWith('{')) {
                                      const p = JSON.parse(createdDonation.email);
                                      return p.estimated_value || 'N/A';
                                    }
                                  } catch(e){}
                                  return 'N/A';
                                })()}
                              </span>
                            </div>
                          </>
                        )}

                        <div className="col-span-2 border-b border-gray-100 pb-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Allocated Programme / Purpose</span>
                          <span className="text-navy font-medium text-xs mt-0.5 block italic">
                            {(() => {
                              try {
                                if (createdDonation.email && createdDonation.email.startsWith('{')) {
                                  const p = JSON.parse(createdDonation.email);
                                  return p.purpose || 'General Humanitarian & Educational Support';
                                }
                              } catch(e){}
                              return 'General Humanitarian & Educational Support';
                            })()}
                          </span>
                        </div>
                      </div>

                      {/* Brief Legal Acknowledgement */}
                      <div className="my-5 p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] text-gray-500 leading-relaxed italic text-justify">
                        Will-Naks Foundation gratefully acknowledges this contribution. These funds or goods will be utilized transparently, maintaining bulletproof audit records, exclusively for registered PVO humanitarian and educational relief programs. No goods/services were provided in exchange.
                      </div>

                      {/* Interactive Signature Block */}
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-navy/10 text-[9px] mb-4">
                        <div className="space-y-1">
                          <span className="font-bold text-navy uppercase block">Issued By (Representative)</span>
                          <div className="h-6 flex items-end justify-start border-b border-gray-200 border-dashed">
                            <span className="font-serif italic text-blue-600 font-bold transform -rotate-2">Y. Kodzaimambo</span>
                          </div>
                          <span className="text-[8px] text-gray-400 block">Authorized Signature</span>
                        </div>

                        <div className="space-y-1">
                          <span className="font-bold text-navy uppercase block">Acknowledgement Connection</span>
                          <div className="h-6 flex items-end justify-start border-b border-gray-200 border-dashed">
                            <span className="font-mono text-gray-400 text-[8px]">[SupaBase Secured Link]</span>
                          </div>
                          <span className="text-[8px] text-gray-400 block">Verified Status Ledger</span>
                        </div>
                      </div>

                      {/* Simple Footer sentence */}
                      <div className="text-center mt-6 text-[9px] text-gold font-bold tracking-wider uppercase font-serif">
                        Thank you for your generosity. Together, we are changing lives.
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-navy/5">
                      <button 
                        onClick={() => downloadReceiptPDF(`WNF-REC-${(createdDonation.id || '').replace(/-/g, '').substring(0, 8).toUpperCase()}`)}
                        disabled={downloadingPDF || downloadingPNG}
                        className="flex-1 py-4 bg-navy text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:bg-navy/95 transition-all hover:scale-[1.02] disabled:opacity-50"
                      >
                        <FileText className="h-5 w-5 text-gold" />
                        <span>{downloadingPDF ? 'Generating PDF...' : 'Download as PDF'}</span>
                      </button>
                      <button 
                        onClick={() => downloadReceiptPNG(`WNF-REC-${(createdDonation.id || '').replace(/-/g, '').substring(0, 8).toUpperCase()}`)}
                        disabled={downloadingPDF || downloadingPNG}
                        className="flex-1 py-4 bg-gold text-navy rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-gold/10 hover:bg-gold/90 transition-all hover:scale-[1.02] disabled:opacity-50"
                      >
                        <Download className="h-5 w-5" />
                        <span>{downloadingPNG ? 'Generating PNG...' : 'Download as PNG'}</span>
                      </button>
                      <button 
                        onClick={() => {
                          setCreatedDonation(null);
                          setSubmitted(false);
                        }}
                        className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all hover:scale-[1.02]"
                      >
                        <Heart className="h-5 w-5 text-rose-500" />
                        <span>Support Again</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-[40px] p-16 text-center shadow-2xl border border-navy/5 max-w-xl mx-auto">
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
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
