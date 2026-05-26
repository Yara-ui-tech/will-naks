import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Heart, 
  GraduationCap, 
  Image as ImageIcon, 
  MessageSquare, 
  Users, 
  LogOut,
  Plus,
  Trash2,
  Check,
  X,
  Handshake,
  UserPlus,
  Newspaper,
  Calendar,
  Star,
  Share2,
  Users2,
  ArrowLeft,
  DollarSign,
  BarChart3,
  ShoppingBag,
  Edit,
  FileText,
  Printer,
  ClipboardList
} from 'lucide-react';
import FinancialReportsView from './FinancialReportsView';

type View = 'overview' | 'donations' | 'deductions' | 'financial-reports' | 'scholarships' | 'partners' | 'volunteers' | 'news' | 'gallery' | 'testimonials' | 'admins' | 'team' | 'events' | 'impact' | 'social' | 'members' | 'messages' | 'merchandise' | 'welfare';

const extractDetail = (str: string | null, key: string, fallback = 'N/A') => {
  if (!str) return fallback;
  const regex = new RegExp(`\\[${key}:\\s*(.*?)\\]`);
  const match = str.match(regex);
  if (match) return match[1];
  return fallback;
};

const cleanString = (str: string | null) => {
  if (!str) return '';
  return str.replace(/\[.*?:.*?\]/g, '').trim();
};

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<View>('overview');
  const [data, setData] = useState<any>({
    donations: [],
    deductions: [],
    scholarships: [],
    partners: [],
    volunteers: [],
    news: [],
    gallery: [],
    testimonials: [],
    profiles: [],
    team: [],
    events: [],
    impact: [],
    social: [],
    members: [],
    messages: [],
    welfare: []
  });
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [fetchErrors, setFetchErrors] = useState<string[]>([]);

  // Merchandise Store Admin states & handlers
  const [isMerchModalOpen, setIsMerchModalOpen] = useState(false);
  const [editingMerchId, setEditingMerchId] = useState<string | null>(null);
  const [merchForm, setMerchForm] = useState({
    title: '',
    price: 15,
    description: '',
    variants: 'S, M, L, XL',
    in_stock: true,
    url: ''
  });
  const [uploadingMerchImage, setUploadingMerchImage] = useState(false);

  // Donation Receipts States
  const [selectedDonationForReceipt, setSelectedDonationForReceipt] = useState<any>(null);
  const [isRecordDonationOpen, setIsRecordDonationOpen] = useState(false);
  const [newDonationForm, setNewDonationForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    donation_type: 'Cash' as 'Cash' | 'Goods' | 'In-Kind' | 'Online',
    amount_usd: '50',
    amount_zwl: '',
    goods_description: '',
    estimated_value: '',
    purpose: 'Disadvantaged Orphans Scholarship Fund',
    received_by: 'Yvonne Kodzaimambo (Administrative & Logistics Officer)'
  });

  // Welfare Beneficiary Intake States
  const [selectedWelfareForForm, setSelectedWelfareForForm] = useState<any>(null);
  const [isRecordWelfareOpen, setIsRecordWelfareOpen] = useState(false);
  const [editingWelfareId, setEditingWelfareId] = useState<string | null>(null);

  const initialWelfareForm = {
    reference_number: '',
    date_of_intake: new Date().toISOString().split('T')[0],
    recorded_by: 'Yvonne Kodzaimambo (Administrative & Logistics Officer)',
    category: 'Orphaned Child',
    category_other: '',
    full_name: '',
    date_of_birth: '',
    age: '',
    gender: 'Male',
    national_id: '',
    physical_address: '',
    area_suburb: '',
    phone: '',
    living_situation: 'With family',
    carer_name: '',
    carer_relationship: '',
    household_size: '1',
    monthly_income_usd: '0',
    monthly_income_zwl: '0',
    income_source: '',
    circumstance_context: '',
    support_requested: [] as string[],
    support_requested_other: '',
    verifier_name: 'Yvonne Kodzaimambo',
    verifier_role: 'Administrative & Logistics Officer',
    verifier_org: 'WILL-NAKS FOUNDATION',
    verifier_phone: '+263772836263',
    verifier_signature: 'Confirmed digitally',
    verification_date: new Date().toISOString().split('T')[0],
    approved_by: 'Simbarashe O Manongwa (CEO)',
    approval_date: new Date().toISOString().split('T')[0],
    allocated_package: '',
    distribution_date: '',
    follow_up_date: '',
    notes: ''
  };

  const [welfareForm, setWelfareForm] = useState(initialWelfareForm);

  const generateWelfareRef = () => {
    return `WNF-WEL-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const openAddMerchProduct = () => {
    setEditingMerchId(null);
    setMerchForm({
      title: '',
      price: 15,
      description: '',
      variants: 'S, M, L, XL',
      in_stock: true,
      url: ''
    });
    setIsMerchModalOpen(true);
  };

  const openEditMerchProduct = (product: any) => {
    let details: any = {};
    try {
      details = JSON.parse(product.caption || '{}');
    } catch {
      details = { title: product.caption, price: 15, description: '', variants: 'S, M, L, XL', in_stock: true };
    }
    setEditingMerchId(product.id);
    setMerchForm({
      title: details.title || product.caption || 'Official Merchandise',
      price: typeof details.price === 'number' ? details.price : parseFloat(details.price) || 15,
      description: details.description || '',
      variants: details.variants || 'S, M, L, XL',
      in_stock: details.in_stock !== false,
      url: product.url
    });
    setIsMerchModalOpen(true);
  };

  const handleMerchImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingMerchImage(true);
      try {
        const url = await uploadImage(e.target.files[0]);
        setMerchForm(prev => ({ ...prev, url }));
      } catch (err: any) {
        alert('Image upload failed: ' + err.message);
      } finally {
        setUploadingMerchImage(false);
      }
    }
  };

  const handleSaveMerchProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchForm.title.trim()) {
      alert('Product title is required.');
      return;
    }
    if (!merchForm.url) {
      alert('Product image is required.');
      return;
    }

    const captionJSON = JSON.stringify({
      title: merchForm.title.trim(),
      price: Number(merchForm.price) || 0,
      description: merchForm.description.trim(),
      variants: merchForm.variants.trim(),
      in_stock: merchForm.in_stock
    });

    try {
      if (editingMerchId) {
        const { error } = await supabase
          .from('gallery')
          .update({
            url: merchForm.url,
            caption: captionJSON,
            category: 'Merchandise'
          })
          .eq('id', editingMerchId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert([{
            url: merchForm.url,
            caption: captionJSON,
            category: 'Merchandise'
          }]);
        if (error) throw error;
      }
      setIsMerchModalOpen(false);
      fetchData(true);
    } catch (err: any) {
      alert('Failed to save product: ' + err.message);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    fetchData();
  }, []);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [donations, scholarships, partners, volunteers, news, gallery, testimonials, profiles, team, events, impact, social, members, messages, deductions] = await Promise.all([
        supabase.from('donations').select('*').order('created_at', { ascending: false }),
        supabase.from('scholarships').select('*').order('created_at', { ascending: false }),
        supabase.from('partners').select('*').order('created_at', { ascending: false }),
        supabase.from('volunteers').select('*').order('created_at', { ascending: false }),
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('email', { ascending: true }),
        supabase.from('team').select('*').order('display_order', { ascending: true }),
        supabase.from('events').select('*').order('event_date', { ascending: false }),
        supabase.from('impact_stories').select('*').order('created_at', { ascending: false }),
        supabase.from('social_links').select('*').order('platform', { ascending: true }),
        supabase.from('members').select('*').order('created_at', { ascending: false }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
        supabase.from('deductions').select('*').order('created_at', { ascending: false })
      ]);

      let teamList = team.data || [];
      const hasVimbai = teamList.some((t: any) => t.name === 'Vimbai Nakunyada');
      if (hasVimbai) {
        try {
          await supabase.from('team').update({ name: 'Yvonne Kodzaimambo' }).eq('name', 'Vimbai Nakunyada');
          teamList = teamList.map((t: any) => t.name === 'Vimbai Nakunyada' ? { ...t, name: 'Yvonne Kodzaimambo' } : t);
        } catch (err) {
          console.error("Failed to auto-rename Vimbai to Yvonne in DB:", err);
        }
      }

      if (teamList.length === 0) {
        try {
          const { data: seededTeam } = await supabase.from('team').insert([
            { name: 'Willie Nakunyada', role: 'Founder', image_url: '/assets/team/founder.avif', display_order: 0 },
            { name: 'Simbarashe O Manongwa', role: 'CEO', image_url: '/assets/team/simbarashe.jpg', linkedin_url: 'https://linkedin.com/in/simbarashe-manongwa-815b28342', display_order: 1 },
            { name: 'Tapiwanashe Mandiveyi', role: 'CEO', image_url: '/assets/team/tapiwanashe.jpg', linkedin_url: 'https://linkedin.com/in/tapiwanashe-mandiveyi', display_order: 2 },
            { name: 'Yvonne Kodzaimambo', role: 'Administrative and Logistics Officer', image_url: '/assets/team/coo.jpeg', display_order: 3 }
          ]).select();
          if (seededTeam && seededTeam.length > 0) {
            teamList = seededTeam;
          }
        } catch (seedErr) {
          console.error('Failed to seed default team members:', seedErr);
        }
      }

      const errors: string[] = [];
      if (donations.error) errors.push(`Donations: ${donations.error.message}`);
      if (scholarships.error) errors.push(`Scholarships: ${scholarships.error.message}`);
      if (partners.error) errors.push(`Partners: ${partners.error.message}`);
      if (volunteers.error) errors.push(`Volunteers: ${volunteers.error.message}`);
      if (news.error) errors.push(`News: ${news.error.message}`);
      if (gallery.error) errors.push(`Gallery: ${gallery.error.message}`);
      if (testimonials.error) errors.push(`Testimonials: ${testimonials.error.message}`);
      if (profiles.error) errors.push(`Profiles: ${profiles.error.message}`);
      if (events.error) errors.push(`Events: ${events.error.message}`);
      if (impact.error) errors.push(`Impact Stories: ${impact.error.message}`);
      if (social.error) errors.push(`Social Links: ${social.error.message}`);
      if (members.error) errors.push(`Members: ${members.error.message}`);
      if (messages.error) errors.push(`Inbox Messages (contacts): ${messages.error.message}`);
      
      if (deductions.error) {
        console.warn('Deductions table fetch error (expected if table not created yet):', deductions.error.message);
      }

      let welfareList: any[] = [];
      try {
        const { data: welfareData, error: welfareErr } = await supabase
          .from('welfare_beneficiaries')
          .select('*')
          .order('date_of_intake', { ascending: false });
        if (welfareErr) {
          console.warn("Welfare table fetch error (expected if table not created yet):", welfareErr.message);
        } else {
          welfareList = welfareData || [];
        }
      } catch (e: any) {
        console.error("Failed to fetch welfare_beneficiaries:", e);
      }

      setData({
        donations: donations.data || [],
        deductions: deductions.data || [],
        scholarships: scholarships.data || [],
        partners: partners.data || [],
        volunteers: volunteers.data || [],
        news: news.data || [],
        gallery: gallery.data || [],
        testimonials: testimonials.data || [],
        profiles: profiles.data || [],
        team: teamList,
        events: events.data || [],
        impact: impact.data || [],
        social: social.data || [],
        members: members.data || [],
        messages: messages.data || [],
        welfare: welfareList
      });
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setFetchErrors([err?.message || String(err)]);
    }
    setLoading(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  const toggleApproval = async (id: string, current: boolean) => {
    const { error } = await supabase.from('testimonials').update({ is_approved: !current }).eq('id', id);
    if (error) alert(`Error updating: ${error.message}`);
    fetchData(true);
  };

  const deleteItem = async (table: string, id: string) => {
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) {
        alert(`Error deleting: ${error.message}`);
      } else {
        fetchData(true);
      }
    }
  };

  const promoteAdmin = async (id: string) => {
    if (confirm('Promote this user to Admin?')) {
      const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', id);
      if (error) alert(`Error promoting: ${error.message}`);
      fetchData(true);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const url = await uploadImage(e.target.files[0]);
        callback(url);
      } catch (err: any) {
        alert('Upload failed: ' + err.message);
      }
    }
  };

  const addToGallery = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleFileUpload(e as any, async (url) => {
      const caption = prompt('Enter Caption:');
      const { error } = await supabase.from('gallery').insert([{ url, caption, category: 'Foundation' }]);
      if (error) alert(`Error adding to gallery: ${error.message}`);
      fetchData(true);
    });
    input.click();
  };

  const addNews = async () => {
    const title = prompt('News Title:');
    const content = prompt('News Content:');
    if (!title || !content) return;

    if (confirm('Select an image for this post?')) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => handleFileUpload(e as any, async (image_url) => {
        const { error } = await supabase.from('news').insert([{ title, content, image_url, category: 'General' }]);
        if (error) alert(`Error adding news: ${error.message}`);
        fetchData(true);
      });
      input.click();
    } else {
      const { error } = await supabase.from('news').insert([{ title, content, category: 'General' }]);
      if (error) alert(`Error adding news: ${error.message}`);
      fetchData(true);
    }
  };

  const addTeamMember = async () => {
    const name = prompt('Name:');
    const role = prompt('Role:');
    if (!name || !role) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleFileUpload(e as any, async (image_url) => {
      const linkedin_url = prompt('LinkedIn URL (optional):');
      const { error } = await supabase.from('team').insert([{ name, role, image_url, linkedin_url }]);
      if (error) alert(`Error adding team member: ${error.message}`);
      fetchData(true);
    });
    input.click();
  };

  const addEvent = async () => {
    const title = prompt('Event Title:');
    const date = prompt('Date (YYYY-MM-DD):');
    const location = prompt('Location:');
    const description = prompt('Event Description / Details:');
    if (!title || !date) return;

    if (confirm('Upload an event cover image?')) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => handleFileUpload(e as any, async (image_url) => {
        const { error } = await supabase.from('events').insert([{ title, event_date: date, location, description, image_url }]);
        if (error) alert(`Error adding event: ${error.message}`);
        fetchData(true);
      });
      input.click();
    } else {
      const { error } = await supabase.from('events').insert([{ title, event_date: date, location, description }]);
      if (error) alert(`Error adding event: ${error.message}`);
      fetchData(true);
    }
  };

  const addImpactStory = async () => {
    const name = prompt('Student Name:');
    const role = prompt('Current Role:');
    const content = prompt('The Story:');
    const year = prompt('Year:');
    if (!name || !content) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleFileUpload(e as any, async (image_url) => {
      const { error } = await supabase.from('impact_stories').insert([{ name, role, content, year, image_url }]);
      if (error) alert(`Error adding story: ${error.message}`);
      fetchData(true);
    });
    input.click();
  };

  const addSocialLink = async () => {
    const platform = prompt('Platform Name:');
    const url = prompt('URL:');
    if (platform && url) {
      const { error } = await supabase.from('social_links').insert([{ platform, url }]);
      if (error) alert(`Error adding link: ${error.message}`);
      fetchData(true);
    }
  };

  const addDeduction = async () => {
    const amountStr = prompt('Deduction Amount ($):');
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive number for amount');
      return;
    }
    const purpose = prompt('Purpose / Use of funds (e.g. Purchased school textbooks, paid term tuition fees):');
    if (!purpose) return;
    const recipient = prompt('Recipient of money (optional, e.g. Harare High School, Bookstore):') || 'N/A';
    const project_lead = prompt('Project Lead / Approved By (optional):') || 'N/A';

    const { error } = await supabase.from('deductions').insert([{ amount, purpose, recipient, project_lead }]);
    if (error) {
      alert(`Error inserting deduction record: ${error.message}\n\nMake sure you have run the Deductions table setup SQL block first.`);
    }
    fetchData(true);
  };

  const saveManualDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        email: newDonationForm.email || `${newDonationForm.full_name?.toLowerCase().replace(/\s+/g, "")}@wnf-donor.org`,
        phone: newDonationForm.phone || 'N/A',
        address: newDonationForm.address || 'N/A',
        donation_type: newDonationForm.donation_type,
        amount_usd: newDonationForm.amount_usd || '0',
        amount_zwl: newDonationForm.amount_zwl || 'N/A',
        goods_description: newDonationForm.goods_description || 'N/A',
        estimated_value: newDonationForm.estimated_value || 'N/A',
        purpose: newDonationForm.purpose,
        received_by: newDonationForm.received_by
      };

      const jsonEmail = JSON.stringify(payload);
      const donationAmount = parseFloat(payload.amount_usd) || 0;

      const { error } = await supabase.from('donations').insert([{
        amount: donationAmount,
        donor_name: newDonationForm.full_name,
        email: jsonEmail,
        payment_status: 'approved'
      }]);

      if (error) throw error;
      alert('Official donation recorded and receipt generated successfully!');
      setIsRecordDonationOpen(false);
      
      // Reset form
      setNewDonationForm({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        donation_type: 'Cash',
        amount_usd: '50',
        amount_zwl: '',
        goods_description: '',
        estimated_value: '',
        purpose: 'Disadvantaged Orphans Scholarship Fund',
        received_by: 'Yvonne Kodzaimambo (Administrative & Logistics Officer)'
      });

      fetchData(true);
    } catch (err: any) {
      alert('Error recording donation: ' + err.message);
    }
  };

  const saveWelfareBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        reference_number: welfareForm.reference_number || generateWelfareRef(),
        date_of_intake: welfareForm.date_of_intake,
        recorded_by: welfareForm.recorded_by,
        category: welfareForm.category,
        category_other: welfareForm.category_other,
        full_name: welfareForm.full_name,
        date_of_birth: welfareForm.date_of_birth,
        age: parseInt(welfareForm.age as string) || null,
        gender: welfareForm.gender,
        national_id: welfareForm.national_id,
        physical_address: welfareForm.physical_address,
        area_suburb: welfareForm.area_suburb,
        phone: welfareForm.phone,
        living_situation: welfareForm.living_situation,
        carer_name: welfareForm.carer_name,
        carer_relationship: welfareForm.carer_relationship,
        household_size: parseInt(welfareForm.household_size as string) || 1,
        monthly_income_usd: parseFloat(welfareForm.monthly_income_usd as string) || 0,
        monthly_income_zwl: parseFloat(welfareForm.monthly_income_zwl as string) || 0,
        income_source: welfareForm.income_source,
        circumstance_context: welfareForm.circumstance_context,
        support_requested: welfareForm.support_requested,
        support_requested_other: welfareForm.support_requested_other,
        verifier_name: welfareForm.verifier_name,
        verifier_role: welfareForm.verifier_role,
        verifier_org: welfareForm.verifier_org,
        verifier_phone: welfareForm.verifier_phone,
        verifier_signature: welfareForm.verifier_signature,
        verification_date: welfareForm.verification_date,
        approved_by: welfareForm.approved_by,
        approval_date: welfareForm.approval_date,
        allocated_package: welfareForm.allocated_package,
        distribution_date: welfareForm.distribution_date || null,
        follow_up_date: welfareForm.follow_up_date || null,
        notes: welfareForm.notes
      };

      if (editingWelfareId) {
        const { error } = await supabase
          .from('welfare_beneficiaries')
          .update(payload)
          .eq('id', editingWelfareId);
        if (error) throw error;
        alert('Beneficiary intake record updated successfully!');
      } else {
        const { error } = await supabase
          .from('welfare_beneficiaries')
          .insert([payload]);
        if (error) {
          if (error.code === '23505') {
            payload.reference_number = `WNF-WEL-${Math.floor(1000 + Math.random() * 9000)}`;
            const { error: retryError } = await supabase
              .from('welfare_beneficiaries')
              .insert([payload]);
            if (retryError) throw retryError;
          } else {
            throw error;
          }
        }
        alert('New beneficiary intake record registered successfully!');
      }

      setIsRecordWelfareOpen(false);
      fetchData(true);
    } catch (err: any) {
      alert('Error saving record: ' + err.message + '\n\nMake sure to run the Welfare table SQL script in your database.');
    }
  };

  const toggleSocialActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from('social_links').update({ is_active: !current }).eq('id', id);
    if (error) alert(`Error updating link: ${error.message}`);
    fetchData(true);
  };

  const updateStatus = async (table: string, id: string, status: string) => {
    const { error } = await supabase.from(table).update({ status }).eq('id', id);
    if (error) alert(`Error updating status: ${error.message}`);
    fetchData(true);
  };

  const handlePartnerLogoUpload = async (partnerId: string, file: File) => {
    try {
      const url = await uploadImage(file);
      const { error } = await supabase.from('partners').update({ logo_url: url }).eq('id', partnerId);
      if (error) throw error;
      fetchData(true);
    } catch (err: any) {
      alert('Failed uploading logo: ' + err.message);
    }
  };

  const removePartnerLogo = async (partnerId: string) => {
    if (confirm('Are you sure you want to remove this partner logo?')) {
      const { error } = await supabase.from('partners').update({ logo_url: null }).eq('id', partnerId);
      if (error) {
        alert('Failed removing logo: ' + error.message);
      } else {
        fetchData(true);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-navy font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Loading Dashboard...</p>
    </div>
  </div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-navy p-4 flex justify-between items-center sticky top-0 z-[70]">
        <div className="flex items-center space-x-2">
          <img src="/assets/logo.png" alt="Logo" className="h-6 w-auto invert brightness-0" />
          <span className="text-white font-bold text-sm tracking-tight">ADMIN</span>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-gold hover:text-white font-bold text-xs flex items-center space-x-1.5 py-1 px-2.5 rounded-lg border border-gold/20 bg-white/5 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Site</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2">
            {isSidebarOpen ? <X /> : <LayoutDashboard />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:relative inset-0 md:inset-auto z-[65] w-full md:w-64 bg-navy text-white flex flex-col p-6 space-y-6 transition-transform duration-300 ease-in-out
      `}>
        <div className="hidden md:flex items-center space-x-3 mb-2">
          <img src="/assets/logo.png" alt="Logo" className="h-8 w-auto invert brightness-0" />
          <span className="font-bold tracking-tight">ADMIN PANEL</span>
        </div>

        <Link 
          to="/" 
          className="flex items-center space-x-3 text-gold hover:text-white transition-colors p-3 rounded-xl bg-white/5 border border-gold/20 hover:bg-gold hover:text-navy text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Site</span>
        </Link>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 pb-8 scrollbar-hide">
          <NavItem active={activeView === 'overview'} onClick={() => { setActiveView('overview'); setIsSidebarOpen(false); }} icon={LayoutDashboard} label="Overview" />
          <NavItem active={activeView === 'donations'} onClick={() => { setActiveView('donations'); setIsSidebarOpen(false); }} icon={Heart} label="Donations" />
          <NavItem active={activeView === 'deductions'} onClick={() => { setActiveView('deductions'); setIsSidebarOpen(false); }} icon={DollarSign} label="Fund Deductions" />
          <NavItem active={activeView === 'financial-reports'} onClick={() => { setActiveView('financial-reports'); setIsSidebarOpen(false); }} icon={BarChart3} label="Financial Reports" />
          <NavItem active={activeView === 'scholarships'} onClick={() => { setActiveView('scholarships'); setIsSidebarOpen(false); }} icon={GraduationCap} label="Scholarships" />
          <NavItem active={activeView === 'welfare'} onClick={() => { setActiveView('welfare'); setIsSidebarOpen(false); }} icon={ClipboardList} label="Welfare Intakes" />
          <NavItem active={activeView === 'partners'} onClick={() => { setActiveView('partners'); setIsSidebarOpen(false); }} icon={Handshake} label="Partners" />
          <NavItem active={activeView === 'volunteers'} onClick={() => { setActiveView('volunteers'); setIsSidebarOpen(false); }} icon={UserPlus} label="Volunteers" />
          <NavItem active={activeView === 'members'} onClick={() => { setActiveView('members'); setIsSidebarOpen(false); }} icon={Users2} label="Members" />
          <NavItem active={activeView === 'news'} onClick={() => { setActiveView('news'); setIsSidebarOpen(false); }} icon={Newspaper} label="News & Blog" />
          <NavItem active={activeView === 'team'} onClick={() => { setActiveView('team'); setIsSidebarOpen(false); }} icon={Users} label="Team" />
          <NavItem active={activeView === 'events'} onClick={() => { setActiveView('events'); setIsSidebarOpen(false); }} icon={Calendar} label="Events" />
          <NavItem active={activeView === 'impact'} onClick={() => { setActiveView('impact'); setIsSidebarOpen(false); }} icon={Star} label="Impact Stories" />
          <NavItem active={activeView === 'gallery'} onClick={() => { setActiveView('gallery'); setIsSidebarOpen(false); }} icon={ImageIcon} label="Gallery" />
          <NavItem active={activeView === 'social'} onClick={() => { setActiveView('social'); setIsSidebarOpen(false); }} icon={Share2} label="Social Links" />
          <NavItem active={activeView === 'testimonials'} onClick={() => { setActiveView('testimonials'); setIsSidebarOpen(false); }} icon={MessageSquare} label="Testimonials" />
          <NavItem active={activeView === 'messages'} onClick={() => { setActiveView('messages'); setIsSidebarOpen(false); }} icon={MessageSquare} label="Inbox" />
          <NavItem active={activeView === 'merchandise'} onClick={() => { setActiveView('merchandise'); setIsSidebarOpen(false); }} icon={ShoppingBag} label="Fundraising Store" />
          <NavItem active={activeView === 'admins'} onClick={() => { setActiveView('admins'); setIsSidebarOpen(false); }} icon={Users} label="Users & Admins" />
        </nav>

        {currentUser && (
          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Session</p>
            <p className="text-xs truncate font-medium">{currentUser.email}</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-[10px] text-gray-400 capitalize">Logged In</span>
            </div>
          </div>
        )}

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/10"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy capitalize">{activeView.replace('-', ' ')}</h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Real-time Dashboard</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <Link 
              to="/" 
              className="px-4 py-2 rounded-xl text-navy hover:text-white hover:bg-navy/90 border border-navy/10 transition-all flex items-center space-x-2 text-sm font-bold bg-white shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Website</span>
            </Link>
            <button 
              onClick={fetchData} 
              className="px-4 py-2 rounded-xl text-gray-500 hover:text-navy hover:bg-gray-200 transition-colors flex items-center space-x-2 text-sm font-bold bg-gray-100"
            >
              <span>Refresh</span>
            </button>
            {activeView === 'gallery' && (
              <button onClick={addToGallery} className="bg-gold text-navy px-4 py-2 rounded-lg font-bold flex items-center space-x-2 flex-grow sm:flex-grow-0">
                <Plus className="h-4 w-4" /> <span>Add Photo</span>
              </button>
            )}
            {activeView === 'deductions' && (
              <button onClick={addDeduction} className="bg-gold text-navy px-4 py-2 rounded-lg font-bold flex items-center space-x-2 flex-grow sm:flex-grow-0">
                <Plus className="h-4 w-4" /> <span>Add Deduction</span>
              </button>
            )}
            {activeView === 'news' && (
              <button onClick={addNews} className="bg-gold text-navy px-4 py-2 rounded-lg font-bold flex items-center space-x-2 flex-grow sm:flex-grow-0">
                <Plus className="h-4 w-4" /> <span>Add Post</span>
              </button>
            )}
            {activeView === 'team' && (
              <button onClick={addTeamMember} className="bg-gold text-navy px-4 py-2 rounded-lg font-bold flex items-center space-x-2 flex-grow sm:flex-grow-0">
                <Plus className="h-4 w-4" /> <span>Add Member</span>
              </button>
            )}
            {activeView === 'events' && (
              <button onClick={addEvent} className="bg-gold text-navy px-4 py-2 rounded-lg font-bold flex items-center space-x-2 flex-grow sm:flex-grow-0">
                <Plus className="h-4 w-4" /> <span>Add Event</span>
              </button>
            )}
            {activeView === 'impact' && (
              <button onClick={addImpactStory} className="bg-gold text-navy px-4 py-2 rounded-lg font-bold flex items-center space-x-2 flex-grow sm:flex-grow-0">
                <Plus className="h-4 w-4" /> <span>Add Story</span>
              </button>
            )}
            {activeView === 'social' && (
              <button onClick={addSocialLink} className="bg-gold text-navy px-4 py-2 rounded-lg font-bold flex items-center space-x-2 flex-grow sm:flex-grow-0">
                <Plus className="h-4 w-4" /> <span>Add Link</span>
              </button>
            )}
            {activeView === 'merchandise' && (
              <button onClick={openAddMerchProduct} className="bg-gold text-navy px-4 py-2 rounded-lg font-bold flex items-center space-x-2 flex-grow sm:flex-grow-0">
                <Plus className="h-4 w-4" /> <span>Add Product</span>
              </button>
            )}
          </div>
        </header>

        {fetchErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
            <h4 className="font-bold mb-1 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>Certain database tables couldn't be loaded:</span>
            </h4>
            <ul className="list-disc pl-5 text-xs text-red-600 font-mono space-y-0.5">
              {fetchErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
            <p className="text-[10px] text-gray-500 mt-2">
              This can happen if tables have Row Level Security (RLS) policies requiring Admin status, or if tables are not fully initialized yet in Supabase.
            </p>

            {fetchErrors.some(err => err.toLowerCase().includes('recursion')) && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs text-left">
                <p className="font-bold mb-2 flex items-center gap-1.5">
                  <span className="text-sm">💡</span>
                  <span>How to fix the "infinite recursion" error in Supabase:</span>
                </p>
                <p className="mb-3 leading-relaxed text-gray-700">
                  This occurs because lingering or historical row-level security (RLS) policies on your Supabase <strong>profiles</strong> table are causing a circular request loop. Copy and run this SQL script in your Supabase <strong>SQL Editor</strong> dashboard to fix it instantly:
                </p>
                <pre className="p-3 bg-white border border-amber-200 rounded-lg text-[10px] font-mono text-gray-800 overflow-x-auto select-all max-h-48 scrollbar-thin whitespace-pre leading-normal">
{`-- 1. Redefine is_admin with a fast-track email check to prevent circular paths
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  IF (auth.jwt() ->> 'email') IN ('goyaracorp@gmail.com', 'tapiwanashe.mandiveyi@gmail.com') THEN
    RETURN true;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Purge old recursive policies and set up clean ones
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL USING (
  (auth.jwt() ->> 'email') IN ('goyaracorp@gmail.com', 'tapiwanashe.mandiveyi@gmail.com')
);`}
                </pre>
                <p className="mt-2 text-[10px] text-gray-500 font-medium leading-relaxed">
                  Click inside the grey box to highlight all, then copy, paste into the Supabase SQL Editor console, and click "Run".
                </p>
              </div>
            )}
          </div>
        )}

        {activeView === 'overview' && <OverviewStats data={data} />}
        
        {activeView === 'donations' && (
          <div className="space-y-6">
            <div className="bg-emerald-50/50 border border-emerald-200/60 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-navy text-lg flex items-center gap-2">
                  <span>💖</span> <span>Donation Ledger & Official Receipts</span>
                </h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Generate official donation receipts automatically. Record and manage Cash, Goods, In-Kind, or Online contributions while maintaining bulletproof audit trails.
                </p>
              </div>
              <button 
                onClick={() => setIsRecordDonationOpen(true)}
                className="px-5 py-2.5 bg-navy hover:bg-navy/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center space-x-2"
              >
                <span>+ Record Donation / Receipt</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Fund Deposited / Received</span>
                <span className="text-3xl font-bold text-green-600">${data.donations.reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0).toLocaleString()}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Fund Deducted / Spent</span>
                <span className="text-3xl font-bold text-red-500">${data.deductions.reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0).toLocaleString()}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Amount Remaining (Left)</span>
                <span className="text-3xl font-bold text-navy">${(data.donations.reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0) - data.deductions.reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0)).toLocaleString()}</span>
              </div>
            </div>

            <Table headers={['Receipt No', 'Date', 'Donor Name', 'Type', 'Amount (USD)', 'Programme / Purpose', 'Actions']}>
              {data.donations.map((d: any) => {
                const parsed = (() => {
                  try {
                    if (d.email && d.email.startsWith('{')) {
                      return JSON.parse(d.email);
                    }
                  } catch (e) {}
                  return {
                    email: d.email || 'N/A',
                    phone: 'N/A',
                    address: 'N/A',
                    donation_type: 'Online',
                    amount_usd: d.amount || '0',
                    amount_zwl: 'N/A',
                    goods_description: 'N/A',
                    estimated_value: 'N/A',
                    purpose: 'General Scholarship & Humanitarian Support',
                    received_by: 'Yvonne Kodzaimambo'
                  };
                })();

                const receiptNo = `WNF-REC-${(d.id || '').replace(/-/g, '').substring(0, 8).toUpperCase()}`;

                return (
                  <tr key={d.id} className="border-b text-sm hover:bg-gray-50/50">
                    <td className="p-4 font-mono font-bold text-navy text-[11px]">{receiptNo}</td>
                    <td className="p-4 text-xs text-gray-500">{new Date(d.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-navy">{d.donor_name || 'Anonymous'}</td>
                    <td className="p-4">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-gold/10 text-gold rounded-full">
                        {parsed.donation_type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-green-600 font-mono">
                      {parsed.donation_type === 'Goods' || parsed.donation_type === 'In-Kind' ? (
                        <span className="text-gray-400 font-normal italic text-xs shadow-inner" title={parsed.goods_description}>
                          Goods (Valued {parsed.estimated_value})
                        </span>
                      ) : (
                        `$${d.amount}`
                      )}
                    </td>
                    <td className="p-4 text-xs text-gray-600 truncate max-w-[200px]" title={parsed.purpose}>
                      {parsed.purpose}
                    </td>
                    <td className="p-4 flex items-center space-x-3">
                      <button 
                        onClick={() => setSelectedDonationForReceipt(d)} 
                        className="text-navy hover:text-gold transition-colors flex items-center space-x-1"
                        title="View Official Donation Receipt"
                      >
                        <FileText className="h-4 w-4 text-gold" />
                        <span className="text-[11px] font-bold">Receipt</span>
                      </button>
                      <button onClick={() => deleteItem('donations', d.id)} className="text-red-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </Table>
          </div>
        )}

        {activeView === 'deductions' && (
          <div className="space-y-6">
            <div className="bg-amber-50/50 border border-amber-200/60 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-navy text-lg flex items-center gap-2">
                  <span>💡</span> <span>Fund Disbursement Tracker</span>
                </h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Record and oversee scholarship payments, project costs, administrative supplies, and other program expenses directly subtracted from donations.
                </p>
              </div>
              <button 
                onClick={addDeduction}
                className="px-4 py-2 bg-gold hover:bg-gold/90 text-navy font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
              >
                + Record Deduction
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Total Budget Received</span>
                <span className="text-3xl font-bold text-green-600">${data.donations.reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0).toLocaleString()}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Total Amount Deducted</span>
                <span className="text-3xl font-bold text-red-500">${data.deductions.reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0).toLocaleString()}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Net Remaining Funds</span>
                <span className="text-3xl font-bold text-navy">${(data.donations.reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0) - data.deductions.reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0)).toLocaleString()}</span>
              </div>
            </div>

            <Table headers={['Date', 'Use of Money (Purpose)', 'Target Recipient', 'Approved By / Lead', 'Amount Deducted', 'Actions']}>
              {data.deductions.map((dec: any) => (
                <tr key={dec.id} className="border-b text-sm">
                  <td className="p-4 text-xs font-mono text-gray-500">{new Date(dec.created_at).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-navy max-w-sm">{dec.purpose}</td>
                  <td className="p-4 font-medium text-gray-600">{dec.recipient || 'N/A'}</td>
                  <td className="p-4 text-xs font-mono text-gray-500">{dec.project_lead || 'N/A'}</td>
                  <td className="p-4 font-bold text-red-600">-${Number(dec.amount).toLocaleString()}</td>
                  <td className="p-4 font-bold">
                    <button onClick={() => deleteItem('deductions', dec.id)} className="text-red-400 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        )}

        {activeView === 'financial-reports' && (
          <FinancialReportsView data={data} />
        )}

        {activeView === 'welfare' && (
          <div className="space-y-6 animate-fadeIn text-left">
            {/* Header banner */}
            <div className="bg-teal-50/50 border border-teal-200/60 p-6 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-navy text-xl flex items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-teal-600" />
                  <span>Welfare Beneficiaries Intake Ledger</span>
                </h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed font-sans">
                  Humanitarian & Donation Support Programme — WILL-NAKS FOUNDATION. Record, approve, schedule distributions, and generate printable intake forms.
                </p>
              </div>
              <button 
                onClick={() => {
                  setEditingWelfareId(null);
                  setWelfareForm({
                    ...initialWelfareForm,
                    reference_number: generateWelfareRef()
                  });
                  setIsRecordWelfareOpen(true);
                }}
                className="px-5 py-2.5 bg-navy hover:bg-navy/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>+ Record Beneficiary Intake</span>
              </button>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <Table headers={['Reference No', 'Date of Intake', 'Full Name', 'Category', 'Age/Gender', 'Status', 'Actions']}>
                {(!data.welfare || data.welfare.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-400 font-sans text-xs">
                      No welfare beneficiary intake records found. Click "+ Record Beneficiary Intake" to insert one.
                    </td>
                  </tr>
                ) : (
                  data.welfare.map((w: any) => {
                    const isApproved = w.approved_by && w.approval_date;
                    return (
                      <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                        <td className="p-4 font-mono text-[11px] font-bold text-gray-500">{w.reference_number || 'N/A'}</td>
                        <td className="p-4 text-xs text-gray-400 font-sans">{w.date_of_intake ? new Date(w.date_of_intake).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-4">
                          <span className="font-bold text-navy text-sm block">{w.full_name}</span>
                          <span className="text-[10px] text-gray-400 font-mono block">{w.national_id || 'No National ID/Birth Cert'}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold px-2.5 py-1 bg-navy/5 text-navy rounded-full uppercase tracking-wide">
                            {w.category === 'Other' ? (w.category_other || 'Other') : w.category}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-gray-500">
                          {w.age ? `${w.age} yrs` : 'N/A'} ({w.gender || 'N/A'})
                        </td>
                        <td className="p-4">
                          {isApproved ? (
                            <span className="text-[9px] font-black tracking-widest uppercase bg-green-50 text-green-600 px-2.5 py-1 rounded-full border border-green-200">
                              Approved
                            </span>
                          ) : (
                            <span className="text-[9px] font-black tracking-widest uppercase bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full border border-amber-200">
                              Pending Review
                            </span>
                          )}
                        </td>
                        <td className="p-4 flex items-center space-x-3">
                          <button 
                            onClick={() => setSelectedWelfareForForm(w)}
                            className="text-navy hover:text-gold transition-colors flex items-center space-x-1"
                            title="Print Welfare Intake Form"
                          >
                            <FileText className="h-4 w-4 text-gold" />
                            <span className="text-[11px] font-bold">Print Form</span>
                          </button>
                          <button 
                            onClick={() => {
                              setEditingWelfareId(w.id);
                              setWelfareForm({
                                ...w,
                                date_of_intake: w.date_of_intake ? new Date(w.date_of_intake).toISOString().split('T')[0] : '',
                                verification_date: w.verification_date ? new Date(w.verification_date).toISOString().split('T')[0] : '',
                                approval_date: w.approval_date ? new Date(w.approval_date).toISOString().split('T')[0] : '',
                                distribution_date: w.distribution_date ? new Date(w.distribution_date).toISOString().split('T')[0] : '',
                                follow_up_date: w.follow_up_date ? new Date(w.follow_up_date).toISOString().split('T')[0] : '',
                                support_requested: Array.isArray(w.support_requested) ? w.support_requested : []
                              });
                              setIsRecordWelfareOpen(true);
                            }}
                            className="text-navy hover:text-blue-600 transition-colors flex items-center space-x-1"
                            title="Edit Record"
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                            <span className="text-[11px] font-bold font-sans">Edit</span>
                          </button>
                          <button 
                            onClick={() => deleteItem('welfare_beneficiaries', w.id)} 
                            className="text-red-400 hover:text-red-500 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </Table>
            </div>
          </div>
        )}

        {activeView === 'scholarships' && (
          <div className="space-y-4">
            {data.scholarships.map((s: any) => {
              const isNewForm = s.nationality && s.nationality.includes('[Address:');
              const nationalityVal = isNewForm ? cleanString(s.nationality) : (s.nationality || 'Zimbabwean');
              const homeAddressVal = isNewForm ? extractDetail(s.nationality, 'Address') : (s.institution || 'N/A');
              const schoolVal = isNewForm ? (s.institution || 'N/A') : (s.education_level || 'N/A');
              const gradeFormVal = isNewForm ? (s.education_level || 'N/A') : 'N/A';
              const subjectsVal = isNewForm ? cleanString(s.subjects_strength) : (s.subjects_strength || 'N/A');
              const prevResultVal = isNewForm ? extractDetail(s.subjects_strength, 'PrevResult') : 'N/A';

              const carerTextOnly = cleanString(s.carer_details);
              const birthCertUrlVal = extractDetail(s.carer_details, 'BirthCert', '');
              const transcriptUrlVal = extractDetail(s.carer_details, 'Transcript', '');
              const photoUrlVal = extractDetail(s.carer_details, 'Photo', '');
              const hardshipLetterUrlVal = extractDetail(s.carer_details, 'HardshipLetter', '');

              return (
                <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-navy text-lg">{s.full_name}</h3>
                      {s.phone && <p className="text-xs text-gold font-mono">{s.phone}</p>}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(s.created_at).toLocaleDateString()}</span>
                      <button onClick={() => deleteItem('scholarships', s.id)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 text-xs font-sans text-navy bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">A: Personal Details</p>
                      <div><span className="text-gray-400 font-medium">DOB:</span> {s.date_of_birth || 'N/A'} (Age {s.age || 'N/A'})</div>
                      <div><span className="text-gray-400 font-medium">Gender:</span> {s.gender || 'N/A'}</div>
                      <div><span className="text-gray-400 font-medium">Nationality:</span> {nationalityVal}</div>
                      <div><span className="text-gray-400 font-semibold text-gold">Home Address:</span> {homeAddressVal}</div>
                      <div><span className="text-gray-400 font-medium">ID / Birth Cert:</span> {s.birth_cert_no || 'N/A'}</div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">B: Academic & Aspiration</p>
                      <div><span className="text-gray-400 font-medium">School / Inst:</span> {schoolVal}</div>
                      <div><span className="text-gray-400 font-medium">Grade / Form:</span> {gradeFormVal}</div>
                      <div><span className="text-gray-400 font-semibold text-gold font-sans">Previous Result:</span> {prevResultVal}</div>
                      <div><span className="text-gray-450 font-bold text-navy">Subjects of Strength:</span> {subjectsVal}</div>
                      <div><span className="text-gray-455 font-bold text-navy">Aspirations:</span> {s.career_aspirations || 'N/A'}</div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">C: Family & Finance</p>
                      <div><span className="text-gray-400 font-medium">Guardian:</span> {s.parent_name || 'N/A'} ({s.parent_relationship || 'N/A'})</div>
                      <div><span className="text-gray-400 font-medium">Occupation:</span> {s.parent_occupation || 'N/A'}</div>
                      <div><span className="text-gray-400 font-medium">Monthly Income:</span> {s.monthly_income || 'N/A'}</div>
                      <div><span className="text-gray-400 font-medium">Dependants:</span> {s.dependants_count ?? 'N/A'}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400 font-medium">Orphan:</span>{' '}
                        <span className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded ${s.is_orphan ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                          {s.is_orphan ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {carerTextOnly && <div><span className="text-gray-400 font-medium">Care/Hardship:</span> {carerTextOnly}</div>}
                    </div>
                  </div>

                <div className="mb-4 text-xs font-sans">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">D: Targeted Program Request</span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.chosen_programs && s.chosen_programs.length > 0 ? (
                      s.chosen_programs.map((prog: string) => (
                        <span key={prog} className="bg-gold/10 text-navy font-bold text-[9px] uppercase tracking-wider px-2 py-1 rounded-lg border border-gold/10">
                          {prog}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">No specific program checked</span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-cream/10 border border-gold/10 rounded-xl mb-4 text-xs font-sans">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">E: Reason for Hardship / Message</span>
                  <p className="text-gray-700 leading-relaxed italic">"{s.reason}"</p>
                </div>

                {(birthCertUrlVal || transcriptUrlVal || photoUrlVal || hardshipLetterUrlVal) && (
                  <div className="mb-4 text-xs font-sans p-3 bg-navy/[0.02] border border-gray-100 rounded-xl">
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-2">F: Supporting Documents Attachments</span>
                    <div className="flex flex-wrap gap-2">
                      {birthCertUrlVal && (
                        <a 
                          href={birthCertUrlVal} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-navy text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gold hover:text-navy transition-all"
                        >
                          <span>📄</span> Birth Cert / ID
                        </a>
                      )}
                      {transcriptUrlVal && (
                        <a 
                          href={transcriptUrlVal} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-navy text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gold hover:text-navy transition-all"
                        >
                          <span>🎓</span> Academic Report
                        </a>
                      )}
                      {photoUrlVal && (
                        <a 
                          href={photoUrlVal} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-navy text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gold hover:text-navy transition-all"
                        >
                          <span>👤</span> Portrait Photo
                        </a>
                      )}
                      {hardshipLetterUrlVal && (
                        <a 
                          href={hardshipLetterUrlVal} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-navy text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gold hover:text-navy transition-all"
                        >
                          <span>✉️</span> Hardship Letter
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-gray-400 text-xs font-medium">Application Status:</span> 
                    <span className={`font-bold uppercase text-[10px] px-2 py-1 rounded-md ${
                      s.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-100' :
                      s.status === 'denied' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {s.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                     <button onClick={() => updateStatus('scholarships', s.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors">Approve</button>
                     <button onClick={() => updateStatus('scholarships', s.id, 'denied')} className="bg-red-600 hover:bg-red-750 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors">Deny</button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {activeView === 'partners' && (
          <div className="space-y-4">
            {data.partners.map((p: any) => (
              <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-navy">{p.org_name}</h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(p.created_at).toLocaleDateString()}</span>
                    <button onClick={() => deleteItem('partners', p.id)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                  <div><span className="text-gray-400 font-medium">Industry:</span> {p.industry}</div>
                  <div><span className="text-gray-400 font-medium">Email:</span> {p.email}</div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400 font-medium">Ad/Collaboration Link:</span> 
                    {p.website_url ? (
                      <a 
                        href={p.website_url.startsWith('http') ? p.website_url : `https://${p.website_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gold font-bold hover:underline ml-1 break-all"
                      >
                        {p.website_url}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic ml-1">None provided</span>
                    )}
                  </div>
                  <div className="sm:col-span-2 flex items-center space-x-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-14 h-14 bg-navy rounded-lg flex items-center justify-center overflow-hidden p-1 text-gold flex-shrink-0">
                      {p.logo_url ? (
                        <img src={p.logo_url} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="font-serif font-bold text-sm uppercase">{p.org_name ? p.org_name.charAt(0) : 'P'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-navy">Corporate Brand Logo</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <label className="cursor-pointer bg-navy hover:bg-navy/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                          <span>Upload Logo</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handlePartnerLogoUpload(p.id, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                        {p.logo_url && (
                          <button 
                            onClick={() => removePartnerLogo(p.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Status:</span> 
                    <select 
                      value={p.status || 'pending'} 
                      onChange={(e) => updateStatus('partners', p.id, e.target.value)}
                      className="ml-2 bg-cream/50 rounded-lg px-2 py-1 outline-none text-xs font-bold uppercase text-navy"
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="partnered">Partnered</option>
                    </select>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{p.message}</p>
              </div>
            ))}
          </div>
        )}

        {activeView === 'volunteers' && (
          <Table headers={['Date', 'Name', 'Email', 'Expertise', 'Availability', 'Status', 'Actions']}>
            {data.volunteers.map((v: any) => (
              <tr key={v.id} className="border-b">
                <td className="p-4 text-sm">{new Date(v.created_at).toLocaleDateString()}</td>
                <td className="p-4 font-bold">{v.full_name}</td>
                <td className="p-4 text-sm">{v.email}</td>
                <td className="p-4 text-sm">{v.expertise}</td>
                <td className="p-4 text-sm font-medium text-gray-500">{v.availability}</td>
                <td className="p-4 text-sm">
                   <select 
                     value={v.status || 'pending'} 
                     onChange={(e) => updateStatus('volunteers', v.id, e.target.value)}
                     className="bg-cream/50 rounded-lg px-2 py-1 outline-none text-xs font-bold uppercase text-navy border"
                   >
                     <option value="pending">Pending</option>
                     <option value="interviewed">Interviewed</option>
                     <option value="active">Active</option>
                     <option value="inactive">Inactive</option>
                   </select>
                </td>
                <td className="p-4">
                   <button onClick={() => deleteItem('volunteers', v.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </Table>
        )}

        {activeView === 'members' && (
          <Table headers={['Date', 'Name', 'Email', 'Phone', 'Areas of Interest', 'WhatsApp', 'Actions']}>
            {data.members.map((m: any) => (
              <tr key={m.id} className="border-b text-sm">
                <td className="p-4">{new Date(m.created_at).toLocaleDateString()}</td>
                <td className="p-4 font-bold">{m.full_name}</td>
                <td className="p-4 font-mono text-xs">{m.email}</td>
                <td className="p-4">{m.phone}</td>
                <td className="p-4 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {m.interests && Array.isArray(m.interests) && m.interests.length > 0 ? (
                      m.interests.map((interest: string, idx: number) => (
                        <span key={idx} className="bg-gold/10 text-gold text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-xs">None</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                   {m.whatsapp_joined ? <Check className="text-green-500 h-5 w-5" /> : <X className="text-red-500 h-5 w-5" />}
                </td>
                <td className="p-4">
                   <button onClick={() => deleteItem('members', m.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </Table>
        )}

        {activeView === 'team' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.team.map((member: any) => (
              <div key={member.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
                {member.image_url && <img src={member.image_url} alt="" className="w-16 h-16 object-cover rounded-2xl" />}
                <div className="flex-1">
                  <h3 className="font-bold text-navy">{member.name}</h3>
                  <p className="text-xs text-gold font-bold uppercase">{member.role}</p>
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs flex items-center gap-1 mt-1 font-semibold">
                      LinkedIn Link
                    </a>
                  )}
                </div>
                <button onClick={() => deleteItem('team', member.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        )}

        {activeView === 'events' && (
          <div className="space-y-4">
            {data.events.map((e: any) => (
              <div key={e.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-start md:items-center gap-4 flex-1">
                  {e.image_url && <img src={e.image_url} alt="" className="w-16 h-16 object-cover rounded-2xl flex-shrink-0" />}
                  <div>
                    <h3 className="font-bold text-navy">{e.title}</h3>
                    {e.description && <p className="text-gray-500 text-xs mt-1 max-w-xl italic">"{e.description}"</p>}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase font-bold text-gray-400 mt-2">
                      <span>Date: {new Date(e.event_date).toLocaleDateString()}</span>
                      <span>Location: {e.location || 'Online'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end flex-shrink-0">
                  <select 
                    value={e.status || 'upcoming'} 
                    onChange={(ev) => updateStatus('events', e.id, ev.target.value)}
                    className="bg-cream/50 rounded-lg px-2 py-1 outline-none text-xs font-bold uppercase text-navy border"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                  <button onClick={() => deleteItem('events', e.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'impact' && (
          <div className="space-y-4">
            {data.impact.map((s: any) => (
              <div key={s.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-start">
                <div className="flex space-x-4">
                  {s.image_url && <img src={s.image_url} alt="" className="w-20 h-20 object-cover rounded-2xl" />}
                  <div>
                    <h3 className="font-bold text-navy">{s.name}</h3>
                    <p className="text-xs text-gold font-bold uppercase mb-2">{s.role} - {s.year}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{s.content}</p>
                  </div>
                </div>
                <button onClick={() => deleteItem('impact_stories', s.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        )}

        {activeView === 'social' && (
          <Table headers={['Platform', 'URL', 'Status', 'Actions']}>
            {data.social.map((s: any) => (
              <tr key={s.id} className="border-b">
                <td className="p-4 font-bold">{s.platform}</td>
                <td className="p-4 text-xs font-mono truncate max-w-xs">{s.url}</td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleSocialActive(s.id, s.is_active)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {s.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-4">
                  <button onClick={() => deleteItem('social_links', s.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </Table>
        )}

        {activeView === 'news' && (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.news.map((post: any) => (
              <div key={post.id} className="group relative bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  {post.image_url && <img src={post.image_url} alt="" className="w-full h-40 object-cover rounded-2xl mb-4" />}
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-navy leading-snug">{post.title}</h3>
                    {post.category && (
                      <span className="text-[9px] bg-gold/10 text-gold font-bold px-2 py-0.5 rounded tracking-wider uppercase whitespace-nowrap">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-3 mb-4">{post.content}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(post.created_at).toLocaleDateString()}</span>
                  <button onClick={() => deleteItem('news', post.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.gallery.filter((img: any) => img.category !== 'Merchandise').map((img: any) => (
              <div key={img.id} className="group relative bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="relative overflow-hidden rounded-xl mb-3">
                    <img src={img.url} alt="" className="w-full h-40 object-cover rounded-xl" />
                    <button 
                      onClick={() => deleteItem('gallery', img.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {img.caption && <p className="text-navy text-xs font-semibold px-1">{img.caption}</p>}
                </div>
                {img.category && (
                  <span className="text-[9px] text-gold font-bold uppercase tracking-wider bg-gold/5 px-2 py-0.5 rounded-md mt-2 w-max ml-1">
                    {img.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeView === 'testimonials' && (
          <Table headers={['Name', 'Message', 'Status', 'Actions']}>
            {data.testimonials.map((t: any) => (
              <tr key={t.id} className="border-b">
                <td className="p-4 font-bold">{t.full_name}</td>
                <td className="p-4 max-w-md truncate">{t.content}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${t.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {t.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <button onClick={() => toggleApproval(t.id, t.is_approved)} className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    {t.is_approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </button>
                  <button onClick={() => deleteItem('testimonials', t.id)} className="p-2 bg-red-100 text-red-700 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        )}

        {activeView === 'admins' && (
          <Table headers={['Email', 'Role', 'Actions']}>
            {data.profiles.map((p: any) => (
              <tr key={p.id} className="border-b">
                <td className="p-4 text-sm">{p.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${p.role === 'admin' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {p.role}
                  </span>
                </td>
                <td className="p-4 flex items-center space-x-2">
                  {p.role !== 'admin' && (
                    <button onClick={() => promoteAdmin(p.id)} className="bg-gold text-navy px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight hover:scale-105 transition-transform">
                      Promote
                    </button>
                  )}
                  <button onClick={() => deleteItem('profiles', p.id)} className="text-red-400 hover:text-red-600 p-2 border border-red-100 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        )}
        {activeView === 'messages' && (
          <div className="space-y-4">
            {data.messages.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 max-w-xl mx-auto shadow-sm">
                <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-4 text-navy">
                  <MessageSquare className="h-8 w-8 text-navy/40" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">Inbox is Empty</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  No messages have been submitted through the contact form yet. Message submissions will appear here instantly.
                </p>
                <div className="text-[11px] bg-gold/5 border border-gold/10 text-gold/80 px-4 py-2 rounded-xl inline-block font-bold uppercase tracking-wider">
                  Ready for inbound messages
                </div>
              </div>
            ) : (
              data.messages.map((m: any) => (
                <div key={m.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-navy">{m.first_name} {m.last_name}</h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(m.created_at).toLocaleDateString()}</span>
                      <button onClick={() => deleteItem('contacts', m.id)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                    <div><span className="text-gray-400 font-medium">Email:</span> {m.email}</div>
                    <div><span className="text-gray-400 font-medium">Subject:</span> {m.subject}</div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{m.message}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeView === 'merchandise' && (
          <div className="space-y-6">
            <div className="bg-cream/20 p-6 rounded-3xl border border-gold/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-serif font-black text-navy">Fundraising Store Product Inventory</h3>
                <p className="text-xs text-gray-500 font-sans">Toggle stock levels, update photos, descriptions, sizes, or prices instantly.</p>
              </div>
              <button onClick={openAddMerchProduct} className="bg-gold hover:bg-gold-light text-navy px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 text-sm shadow-sm transition-all hover:scale-[1.02]">
                <Plus className="h-4 w-4" /> <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.gallery.filter((item: any) => item.category === 'Merchandise').map((img: any) => {
                let details: any = {};
                try {
                  details = JSON.parse(img.caption || '{}');
                } catch {
                  details = { title: img.caption || 'Official Merch', price: 15, description: '', variants: 'S, M, L, XL', in_stock: true };
                }
                const title = details.title || img.caption || 'Official Merchandise';
                const price = typeof details.price === 'number' ? details.price : parseFloat(details.price) || 15;
                const variants = details.variants || 'S, M, L, XL';
                const in_stock = details.in_stock !== false;

                return (
                  <div key={img.id} className="bg-white rounded-3xl overflow-hidden border border-navy/5 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
                    <div className="relative aspect-square overflow-hidden bg-cream/10">
                      <img src={img.url} alt={title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button 
                          onClick={() => openEditMerchProduct(img)}
                          className="bg-navy text-white p-2.5 rounded-full shadow hover:scale-110 transition-transform cursor-pointer"
                          title="Edit product info/price"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteItem('gallery', img.id)}
                          className="bg-red-500 text-white p-2.5 rounded-full shadow hover:scale-110 transition-transform cursor-pointer"
                          title="Remove product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-md ${in_stock ? 'bg-green-600' : 'bg-red-600'}`}>
                        {in_stock ? '● In Stock' : '○ Out of stock / Pre-Order'}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-navy text-lg line-clamp-1">{title}</h4>
                          <span className="font-extrabold text-gold text-lg font-sans bg-gold/5 px-2.5 py-0.5 rounded-md">${price}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2 min-h-[2rem] leading-relaxed">{details.description || 'Fundraising product supporting kids.'}</p>
                        <div className="mt-4 pt-3 border-t border-gray-50 flex flex-col gap-1 text-[11px] font-semibold text-gray-500 font-sans">
                          <div>Variants: <strong className="text-navy">{variants}</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {data.gallery.filter((item: any) => item.category === 'Merchandise').length === 0 && (
                <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3 max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold text-lg">👕</div>
                  <h4 className="text-base font-bold text-navy">No products uploaded yet</h4>
                  <p className="text-xs text-gray-500 font-sans">Our default items are displaying user-side. Create your first marketplace product here to manage live prices and stock state!</p>
                  <button onClick={openAddMerchProduct} className="bg-gold hover:bg-gold-light text-navy text-xs font-bold px-5 py-2.5 rounded-xl mt-2 transition-all shadow-sm">
                    Create Product
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Merchandise Product Management Modal Overlay */}
      {isMerchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg border border-navy/5 shadow-2xl relative text-left">
            <button 
              onClick={() => setIsMerchModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-navy hover:scale-105 transition-all text-sm font-bold bg-gray-100 p-2 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-navy mb-1 italic">
              {editingMerchId ? 'Edit Merchandise Product' : 'Add Merchandise Product'}
            </h3>
            <p className="text-xs text-gray-500 mb-6">Enter fundraising items details. Information will be saved securely to Supabase.</p>

            <form onSubmit={handleSaveMerchProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Product Title</label>
                <input 
                  required 
                  type="text" 
                  value={merchForm.title}
                  onChange={(e) => setMerchForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-gold focus:bg-white text-sm" 
                  placeholder="e.g. WILL-NAKS Heavy Hoodie" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Price (USD)</label>
                  <input 
                    required 
                    type="number" 
                    min="1"
                    value={merchForm.price}
                    onChange={(e) => setMerchForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-gold focus:bg-white text-sm" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Stock Level</label>
                  <select 
                    value={merchForm.in_stock ? 'true' : 'false'}
                    onChange={(e) => setMerchForm(prev => ({ ...prev, in_stock: e.target.value === 'true' }))}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-gold focus:bg-white text-sm"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Size / Color Variants</label>
                <input 
                  required 
                  type="text" 
                  value={merchForm.variants}
                  onChange={(e) => setMerchForm(prev => ({ ...prev, variants: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-gold focus:bg-white text-sm" 
                  placeholder="e.g. S, M, L, XL" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Short Description</label>
                <textarea 
                  required 
                  value={merchForm.description}
                  onChange={(e) => setMerchForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-gold focus:bg-white text-sm h-20 resize-none" 
                  placeholder="Describe the apparel or item detail..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Product Photo</label>
                {merchForm.url ? (
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden border">
                    <img src={merchForm.url} alt="Uploaded" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setMerchForm(prev => ({ ...prev, url: '' }))}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow hover:scale-105"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gold transition-colors bg-gray-50 hover:bg-white">
                      <div className="flex flex-col items-center justify-center pt-3 pb-3">
                        <Plus className="h-6 w-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-400 font-medium">Click to upload product image</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleMerchImageSelect} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                )}
                {uploadingMerchImage && (
                  <div className="text-[10px] text-gold font-bold uppercase animate-pulse">Uploading product image to Supabase Bucket...</div>
                )}
              </div>

              <button 
                type="submit"
                disabled={uploadingMerchImage}
                className="w-full py-4 bg-navy text-white rounded-2xl font-bold hover:bg-navy/95 transition-all text-sm mt-4 disabled:opacity-50"
              >
                {editingMerchId ? 'Save Product Customizations' : 'Create Live Fundraising Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Donation Receipt View/Print Modal */}
      {selectedDonationForReceipt && (() => {
        const d = selectedDonationForReceipt;
        const parsed = (() => {
          try {
            if (d.email && d.email.startsWith('{')) {
              return JSON.parse(d.email);
            }
          } catch (e) {}
          return {
            email: d.email || 'N/A',
            phone: 'N/A',
            address: 'N/A',
            donation_type: 'Online',
            amount_usd: d.amount || '0',
            amount_zwl: 'N/A',
            goods_description: 'N/A',
            estimated_value: 'N/A',
            purpose: 'General Scholarship & Humanitarian Support',
            received_by: 'Yvonne Kodzaimambo'
          };
        })();

        const receiptNo = `WNF-REC-${(d.id || '').replace(/-/g, '').substring(0, 8).toUpperCase()}`;

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4 font-sans">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 w-full max-w-4xl border border-navy/5 shadow-2xl relative text-left my-8">
              <button 
                onClick={() => setSelectedDonationForReceipt(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-navy hover:scale-105 transition-all text-sm font-bold bg-gray-100 p-2.5 rounded-full cursor-pointer print:hidden"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="border-4 border-dashed border-gray-200 bg-cream/10 p-6 md:p-8 rounded-3xl relative print-area overflow-hidden font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center border-b-2 border-navy/10 pb-6 mb-6 gap-4">
                  <div className="text-center md:text-left">
                    <h3 className="font-serif font-extrabold text-2xl tracking-tight text-navy uppercase">Official Donation Receipt</h3>
                    <span className="text-xs font-semibold text-gold tracking-widest uppercase block mt-1 italic">Acknowledgement of Contribution — WILL-NAKS FOUNDATION</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">PVO Registration No: 18/2023 | Harare, Zimbabwe</span>
                  </div>
                  <div className="text-center md:text-right bg-navy text-white py-2.5 px-4 rounded-xl shadow-md border-b-4 border-gold">
                    <span className="text-[9px] uppercase tracking-widest block text-gold font-bold">Receipt Number</span>
                    <span className="font-mono text-xs font-black tracking-wider">{receiptNo}</span>
                  </div>
                </div>

                {/* Receipt Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="border-b border-navy/5 pb-2.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Date of Donation</span>
                    <span className="text-navy font-bold">{new Date(d.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                  </div>
                  <div className="border-b border-navy/5 pb-2.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Donation Type</span>
                    <span className="text-navy font-bold px-2 py-0.5 bg-gold/10 text-gold rounded-full inline-block mt-0.5 uppercase tracking-wide text-[9px]">{parsed.donation_type}</span>
                  </div>
                  <div className="border-b border-navy/5 pb-2.5 md:col-span-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Donor Full Name</span>
                    <span className="text-navy font-bold text-sm">{d.donor_name}</span>
                  </div>
                  <div className="border-b border-navy/5 pb-2.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Donor Phone / Email</span>
                    <span className="text-navy font-medium text-xs font-mono">{parsed.phone || 'N/A'} / {parsed.email || 'N/A'}</span>
                  </div>
                  <div className="border-b border-navy/5 pb-2.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Donor Home Address</span>
                    <span className="text-navy font-medium text-xs leading-tight block">{parsed.address || 'N/A'}</span>
                  </div>

                  {(parsed.donation_type === 'Online' || parsed.donation_type === 'Cash') ? (
                    <>
                      <div className="border-b border-navy/5 pb-2.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Amount (USD)</span>
                        <span className="text-green-700 font-extrabold text-sm font-mono">${parsed.amount_usd || d.amount} USD</span>
                      </div>
                      <div className="border-b border-navy/5 pb-2.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Amount (ZWL / Alternative)</span>
                        <span className="text-navy font-medium font-mono text-xs">{parsed.amount_zwl || 'N/A'}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="border-b border-navy/5 pb-2.5 md:col-span-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Description of Goods</span>
                        <span className="text-navy font-medium leading-relaxed block bg-white p-2 border border-navy/5 rounded-lg mt-1 text-[11px]">{parsed.goods_description || 'N/A'}</span>
                      </div>
                      <div className="border-b border-navy/5 pb-2.5 md:col-span-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Estimated Value</span>
                        <span className="text-navy font-extrabold font-mono text-xs">{parsed.estimated_value || 'N/A'}</span>
                      </div>
                    </>
                  )}

                  <div className="border-b border-navy/5 pb-2.5 md:col-span-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Foundation Programme / Purpose</span>
                    <span className="text-navy font-medium text-[11px] font-serif italic mt-0.5 block">{parsed.purpose || 'General registered humanitarian and educational programmes'}</span>
                  </div>
                  <div className="pb-2.5 md:col-span-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Received By (Staff Representative)</span>
                    <span className="text-navy font-bold">{parsed.received_by || 'Yvonne Kodzaimambo'}</span>
                  </div>
                </div>

                <div className="my-5 p-4 bg-navy/[0.02] border border-navy/5 rounded-2xl text-[10px] text-gray-500 leading-relaxed italic text-justify">
                  <strong>Acknowledgement Statement:</strong> WILL-NAKS FOUNDATION gratefully acknowledges receipt of the above-described donation from the donor named above. This contribution will be used exclusively for the Foundation's registered humanitarian and educational programmes, including support for orphans, the elderly, widows, and underprivileged students across Zimbabwe. No goods or services were provided in exchange for this donation. All donations are managed transparently and records are maintained for audit processes.
                </div>

                {/* Sign-Off block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-navy/10 text-[9px]">
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-navy/5">
                    <span className="font-bold text-navy uppercase block mb-1">Receipt Issued By:</span>
                    <div className="h-6 flex items-end justify-center border-b border-gray-300 border-dashed">
                      <span className="font-serif italic text-blue-600 font-bold transform -rotate-1">Y. Kodzaimambo</span>
                    </div>
                    <span className="text-gray-400 font-sans block text-center">Authorized Signature</span>
                    <div className="text-gray-600 flex justify-between pt-1">
                      <span>Position: Administrative Officer</span>
                      <span>Date: {new Date(d.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded-xl border border-navy/5">
                    <span className="font-bold text-navy uppercase block mb-1">Donor Acknowledgement Confirmation:</span>
                    <div className="h-6 flex items-end justify-center border-b border-gray-300 border-dashed">
                      <span className="font-mono text-gray-400 text-[8px]">[Electronically Confirmed]</span>
                    </div>
                    <span className="text-gray-400 font-sans block text-center">Donor Signature</span>
                    <div className="text-gray-600 flex justify-between pt-1">
                      <span>Name: {d.donor_name}</span>
                      <span>Date: {new Date(d.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6 text-[10px] text-navy font-bold tracking-wide uppercase font-serif">
                  Thank you for your generosity. Together, we are changing lives.
                </div>
              </div>

              <div className="mt-6 flex space-x-3 print:hidden justify-end">
                <button 
                  onClick={() => setSelectedDonationForReceipt(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Close View
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-navy hover:bg-navy/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow flex items-center space-x-1.5"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Welfare Intake Record Modal */}
      {isRecordWelfareOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4 font-sans text-left">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-4xl border border-navy/5 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsRecordWelfareOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-navy hover:scale-105 transition-all text-sm font-bold bg-gray-100 p-2 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-navy mb-1 italic">
              {editingWelfareId ? 'Edit Welfare Intake Form' : 'Record Welfare Beneficiary Intake'}
            </h3>
            <p className="text-xs text-gray-500 mb-6">Humanitarian & Donation Support Programme — WILL-NAKS FOUNDATION. Ensure all beneficiary facts are documented accurately.</p>

            <form onSubmit={saveWelfareBeneficiary} className="space-y-6">
              {/* Reference and metadata header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Reference Number</label>
                  <input 
                    required 
                    type="text" 
                    value={welfareForm.reference_number}
                    onChange={(e) => setWelfareForm(prev => ({ ...prev, reference_number: e.target.value }))}
                    className="w-full px-4 py-2 bg-white rounded-xl outline-none border focus:border-gold text-xs font-mono font-bold text-navy" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Date of Intake</label>
                  <input 
                    required 
                    type="date" 
                    value={welfareForm.date_of_intake}
                    onChange={(e) => setWelfareForm(prev => ({ ...prev, date_of_intake: e.target.value }))}
                    className="w-full px-4 py-2 bg-white rounded-xl outline-none border focus:border-gold text-xs font-sans text-navy" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Recorded By (Officer)</label>
                  <input 
                    required 
                    type="text" 
                    value={welfareForm.recorded_by}
                    onChange={(e) => setWelfareForm(prev => ({ ...prev, recorded_by: e.target.value }))}
                    className="w-full px-4 py-2 bg-white rounded-xl outline-none border focus:border-gold text-xs font-sans text-navy" 
                  />
                </div>
              </div>

              {/* Section A */}
              <div className="space-y-3 p-5 rounded-2xl border border-navy/5 bg-navy/[0.01]">
                <h4 className="text-sm font-bold text-navy border-b border-navy/10 pb-1 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="bg-navy text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">SEC A</span>
                  <span>Beneficiary Category</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {[
                    'Orphaned Child (under 18, no living parent)',
                    'Elderly Person (aged 60+, lacking adequate support)',
                    'Widow / Widower',
                    'Student from Disadvantaged Background',
                    'Vulnerable Family / Child-Headed Household',
                    'Other'
                  ].map((catOpt) => {
                    const isOtherOption = catOpt === 'Other';
                    const activeMatch = isOtherOption ? welfareForm.category === 'Other' : welfareForm.category === catOpt;
                    return (
                      <div key={catOpt} className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name="beneficiary_category"
                          id={`cat_${catOpt}`}
                          checked={activeMatch}
                          onChange={() => setWelfareForm(prev => ({ ...prev, category: catOpt }))}
                          className="text-gold focus:ring-gold"
                        />
                        <label htmlFor={`cat_${catOpt}`} className="text-gray-700 cursor-pointer select-none">
                          {catOpt}
                        </label>
                      </div>
                    );
                  })}
                </div>
                {welfareForm.category === 'Other' && (
                  <div className="pt-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Please specify custom category:</label>
                    <input 
                      required 
                      type="text" 
                      value={welfareForm.category_other}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, category_other: e.target.value }))}
                      className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                      placeholder="Specify background details..."
                    />
                  </div>
                )}
              </div>

              {/* Section B */}
              <div className="space-y-3 p-5 rounded-2xl border border-navy/5 bg-navy/[0.01]">
                <h4 className="text-sm font-bold text-navy border-b border-navy/10 pb-1 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="bg-navy text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">SEC B</span>
                  <span>Personal Information</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      value={welfareForm.full_name}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                      placeholder="Beneficiary's full name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Date of Birth</label>
                      <input 
                        type="text" 
                        value={welfareForm.date_of_birth}
                        onChange={(e) => setWelfareForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                        className="w-full px-3 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                        placeholder="e.g. 1964-08-22"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Age</label>
                      <input 
                        type="number" 
                        value={welfareForm.age}
                        onChange={(e) => setWelfareForm(prev => ({ ...prev, age: e.target.value }))}
                        className="w-full px-3 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                        placeholder="Age"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Gender</label>
                    <select 
                      value={welfareForm.gender} 
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">National ID / Birth Certificate No.</label>
                    <input 
                      type="text" 
                      value={welfareForm.national_id}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, national_id: e.target.value }))}
                      className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                      placeholder="e.g. 59-192734K-59"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Phone (Self or Carer)</label>
                    <input 
                      type="text" 
                      value={welfareForm.phone}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                      placeholder="e.g. +263 772 836 195"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Physical Address</label>
                    <input 
                      type="text" 
                      value={welfareForm.physical_address}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, physical_address: e.target.value }))}
                      className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                      placeholder="House number, street name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Area / Suburb</label>
                    <input 
                      type="text" 
                      value={welfareForm.area_suburb}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, area_suburb: e.target.value }))}
                      className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                      placeholder="e.g. Epworth, Harare"
                    />
                  </div>
                </div>
              </div>

              {/* Section C */}
              <div className="space-y-3 p-5 rounded-2xl border border-navy/5 bg-navy/[0.01]">
                <h4 className="text-sm font-bold text-navy border-b border-navy/10 pb-1 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="bg-navy text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">SEC C</span>
                  <span>Household & Background</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Living Situation</label>
                    <select 
                      value={welfareForm.living_situation} 
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, living_situation: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                    >
                      <option value="Alone">Alone</option>
                      <option value="With carer">With carer</option>
                      <option value="With family">With family</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Carer / Guardian Name</label>
                    <input 
                      type="text" 
                      value={welfareForm.carer_name}
                      disabled={welfareForm.living_situation === 'Alone'}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, carer_name: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs disabled:bg-gray-100 disabled:text-gray-400 cursor-not-allowed"
                      placeholder="If applicable"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Relationship to Beneficiary</label>
                    <input 
                      type="text" 
                      value={welfareForm.carer_relationship}
                      disabled={welfareForm.living_situation === 'Alone'}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, carer_relationship: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs disabled:bg-gray-100 disabled:text-gray-400 cursor-not-allowed"
                      placeholder="e.g. Aunt, Grandmother"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Household Size</label>
                    <input 
                      type="number" 
                      value={welfareForm.household_size}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, household_size: e.target.value }))}
                      className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                      placeholder="Total size"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Monthly Household Income (USD)</label>
                    <input 
                      type="number" 
                      value={welfareForm.monthly_income_usd}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, monthly_income_usd: e.target.value }))}
                      className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                      placeholder="Income in USD"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Monthly Household Income (ZWL)</label>
                    <input 
                      type="number" 
                      value={welfareForm.monthly_income_zwl}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, monthly_income_zwl: e.target.value }))}
                      className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                      placeholder="Income in ZWL"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Primary Income Source / Support</label>
                    <input 
                      type="text" 
                      value={welfareForm.income_source}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, income_source: e.target.value }))}
                      className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                      placeholder="e.g. Selling veggies / None"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Additional Context about Circumstances</label>
                  <textarea 
                    rows={2}
                    value={welfareForm.circumstance_context}
                    onChange={(e) => setWelfareForm(prev => ({ ...prev, circumstance_context: e.target.value }))}
                    className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs font-sans"
                    placeholder="Provide description of living, social and educational hardships..."
                  />
                </div>
              </div>

              {/* Section D */}
              <div className="space-y-3 p-5 rounded-2xl border border-navy/5 bg-navy/[0.01]">
                <h4 className="text-sm font-bold text-navy border-b border-navy/10 pb-1 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="bg-navy text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">SEC D</span>
                  <span>Support Requested</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {[
                    "Food Parcel / Groceries",
                    "Clothing / Blankets",
                    "Hygiene & Toiletry Items",
                    "School Fees or Educational Support",
                    "School Supplies (stationery, uniforms, textbooks)",
                    "Financial Assistance (cash)",
                    "Medical Referral or Support",
                    "Psychosocial / Counselling Support"
                  ].map((supportOpt) => {
                    const isCheckedOption = welfareForm.support_requested?.includes(supportOpt);
                    return (
                      <div key={supportOpt} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={`support_${supportOpt}`}
                          checked={isCheckedOption}
                          onChange={() => {
                            if (isCheckedOption) {
                              setWelfareForm(prev => ({
                                ...prev,
                                support_requested: (prev.support_requested || []).filter(i => i !== supportOpt)
                              }));
                            } else {
                              setWelfareForm(prev => ({
                                ...prev,
                                support_requested: [...(prev.support_requested || []), supportOpt]
                              }));
                            }
                          }}
                          className="rounded text-gold focus:ring-gold"
                        />
                        <label htmlFor={`support_${supportOpt}`} className="text-gray-700 cursor-pointer select-none">
                          {supportOpt}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Other requested support:</label>
                  <input 
                    type="text" 
                    value={welfareForm.support_requested_other}
                    onChange={(e) => setWelfareForm(prev => ({ ...prev, support_requested_other: e.target.value }))}
                    className="w-full px-4 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                    placeholder="Specify other specific items..."
                  />
                </div>
              </div>

              {/* Section E */}
              <div className="space-y-3 p-5 rounded-2xl border border-navy/5 bg-navy/[0.01]">
                <h4 className="text-sm font-bold text-navy border-b border-navy/10 pb-1 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="bg-navy text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">SEC E</span>
                  <span>Verification and Outreach Officer</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Name of Verifier</label>
                    <input 
                      type="text" 
                      value={welfareForm.verifier_name}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, verifier_name: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Role / Position</label>
                    <input 
                      type="text" 
                      value={welfareForm.verifier_role}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, verifier_role: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Organisation</label>
                    <input 
                      type="text" 
                      value={welfareForm.verifier_org}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, verifier_org: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Verifier Phone</label>
                    <input 
                      type="text" 
                      value={welfareForm.verifier_phone}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, verifier_phone: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Signature (Authorized Text Stamp)</label>
                    <input 
                      type="text" 
                      value={welfareForm.verifier_signature}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, verifier_signature: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs font-serif italic text-navy font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Verification Date</label>
                    <input 
                      type="date" 
                      value={welfareForm.verification_date}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, verification_date: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border outline-none focus:border-gold text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section F */}
              <div className="space-y-3 p-5 rounded-2xl border border-amber-200 bg-amber-50/15">
                <h4 className="text-sm font-bold text-amber-800 border-b border-amber-200 pb-1 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="bg-amber-700 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">SEC F</span>
                  <span>Foundation Use Only (Admin Controls)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Approved / Evaluated By</label>
                    <input 
                      type="text" 
                      value={welfareForm.approved_by}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, approved_by: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-amber-200 outline-none focus:border-gold text-xs"
                      placeholder="Name of approving trustee"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Date of Approval</label>
                    <input 
                      type="date" 
                      value={welfareForm.approval_date}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, approval_date: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-amber-200 outline-none focus:border-gold text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Support Package Allocated</label>
                    <input 
                      type="text" 
                      value={welfareForm.allocated_package}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, allocated_package: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-amber-200 outline-none focus:border-gold text-xs"
                      placeholder="e.g. Food Hamper A, FeesPaid"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Date of Distribution</label>
                    <input 
                      type="date" 
                      value={welfareForm.distribution_date}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, distribution_date: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-amber-200 outline-none focus:border-gold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Follow-up Date</label>
                    <input 
                      type="date" 
                      value={welfareForm.follow_up_date}
                      onChange={(e) => setWelfareForm(prev => ({ ...prev, follow_up_date: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-amber-200 outline-none focus:border-gold text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1 pt-2">
                  <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wide block">Reviewer Notes</label>
                  <textarea 
                    rows={2}
                    value={welfareForm.notes}
                    onChange={(e) => setWelfareForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-amber-200 outline-none focus:border-gold text-xs font-sans"
                    placeholder="Internal evaluation remarks..."
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsRecordWelfareOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-navy hover:bg-navy/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>{editingWelfareId ? 'Save Edits' : 'Register Beneficiary'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Welfare Intake Form Print/View Modal */}
      {selectedWelfareForForm && (() => {
        const w = selectedWelfareForForm;
        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4 font-sans text-left">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 w-full max-w-4xl border border-navy/5 shadow-2xl relative my-8">
              <button 
                onClick={() => setSelectedWelfareForForm(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-navy hover:scale-105 transition-all text-sm font-bold bg-gray-100 p-2.5 rounded-full cursor-pointer print:hidden"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="border-4 border-dashed border-teal-200 bg-cream/10 p-6 md:p-8 rounded-3xl relative print-area overflow-hidden font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center border-b-2 border-teal-600/20 pb-4 mb-4 gap-4">
                  <div className="text-center md:text-left flex items-center space-x-4">
                    <img src="/assets/logo.png" alt="Logo" className="h-12 w-auto object-contain hidden md:block" />
                    <div>
                      <h3 className="font-serif font-extrabold text-xl tracking-tight text-navy uppercase">Welfare Beneficiary Intake Form</h3>
                      <span className="text-[10px] font-semibold text-teal-600 tracking-wider uppercase block mt-0.5">Humanitarian & Donation Support Programme — WILL-NAKS FOUNDATION</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5">PVO Registration No: 18/2023 | Harare, Zimbabwe</span>
                    </div>
                  </div>
                  <div className="text-center md:text-right bg-navy text-white py-1.5 px-3 rounded-lg border-b-4 border-gold">
                    <span className="text-[8px] uppercase tracking-widest block text-gold font-black">Reference No:</span>
                    <span className="font-mono text-[11px] font-black tracking-wider">{w.reference_number || 'N/A'}</span>
                  </div>
                </div>

                {/* Core Basic info */}
                <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold text-[9px] uppercase block">Date of Intake</span>
                    <span className="font-medium text-navy text-[11px]">{w.date_of_intake ? new Date(w.date_of_intake).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold text-[9px] uppercase block">Recorded By</span>
                    <span className="font-medium text-navy text-[11px]">{w.recorded_by || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold text-[9px] uppercase block">Assigned Welfare Specialist</span>
                    <span className="font-medium text-teal-600 text-[11px]">Yvonne Kodzaimambo</span>
                  </div>
                </div>

                {/* Sections detail layout */}
                <div className="mt-4 space-y-4">
                  
                  {/* Section A */}
                  <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/40 text-xs">
                    <h4 className="font-serif text-[11px] font-extrabold text-navy uppercase mb-1 flex items-center gap-1 leading-none">
                      <span className="bg-navy text-white text-[8px] px-1 rounded">SECTION A</span>
                      <span>BENEFICIARY CATEGORY</span>
                    </h4>
                    <p className="text-navy font-bold">{w.category === 'Other' ? (w.category_other || 'Other') : w.category}</p>
                  </div>

                  {/* Section B Box */}
                  <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/40 text-xs">
                    <h4 className="font-serif text-[11px] font-extrabold text-navy uppercase mb-2 flex items-center gap-1 leading-none border-b border-gray-200 pb-1">
                      <span className="bg-navy text-white text-[8px] px-1 rounded">SECTION B</span>
                      <span>PERSONAL INFORMATION</span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                      <div>
                        <span className="text-gray-400 block text-[9px]">Full Name:</span>
                        <strong className="text-navy">{w.full_name || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px]">Date of Birth:</span>
                        <strong className="text-navy">{w.date_of_birth || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px]">Age / Gender:</span>
                        <strong className="text-navy">{w.age ? `${w.age} years` : 'N/A'} / {w.gender || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px]">National ID / Birth Cert No:</span>
                        <strong className="text-navy">{w.national_id || 'N/A'}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 block text-[9px]">Physical Address:</span>
                        <strong className="text-navy">{w.physical_address || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px]">Area / Suburb:</span>
                        <strong className="text-navy">{w.area_suburb || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px]">Phone contact:</span>
                        <strong className="text-navy">{w.phone || 'N/A'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Section C Box */}
                  <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/40 text-xs">
                    <h4 className="font-serif text-[11px] font-extrabold text-navy uppercase mb-2 flex items-center gap-1 leading-none border-b border-gray-200 pb-1">
                      <span className="bg-navy text-white text-[8px] px-1 rounded">SECTION C</span>
                      <span>HOUSEHOLD & BACKGROUND</span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] mb-2">
                      <div>
                        <span className="text-gray-400 block text-[9px]">Living Situation:</span>
                        <strong className="text-navy">{w.living_situation || 'With family'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px]">Carer / Guardian Name:</span>
                        <strong className="text-navy">{w.carer_name || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px]">Relationship of Carer:</span>
                        <strong className="text-navy">{w.carer_relationship || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px]">Household Size:</span>
                        <strong className="text-navy">{w.household_size || '1'} people</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px]">Est. monthly income:</span>
                        <strong className="text-teal-700">USD {w.monthly_income_usd || '0'} / ZWL {w.monthly_income_zwl || '0'}</strong>
                      </div>
                      <div className="col-span-3">
                        <span className="text-gray-400 block text-[9px]">Primary source of support:</span>
                        <strong className="text-navy">{w.income_source || 'None'}</strong>
                      </div>
                    </div>
                    {w.circumstance_context && (
                      <div className="pt-1.5 border-t border-gray-100">
                        <span className="text-gray-400 block text-[9px]">Additional context remarks:</span>
                        <p className="text-navy text-[10px] italic leading-relaxed">{w.circumstance_context}</p>
                      </div>
                    )}
                  </div>

                  {/* Section D Box */}
                  <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/40 text-xs">
                    <h4 className="font-serif text-[11px] font-extrabold text-navy uppercase mb-1 flex items-center gap-1 leading-none">
                      <span className="bg-navy text-white text-[8px] px-1 rounded">SECTION D</span>
                      <span>SUPPORT REQUESTED (TICKED ASSISTANCE CHANNELS)</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5 mt-1.5 text-[9px]">
                      {Array.isArray(w.support_requested) && w.support_requested.map((item: string) => (
                        <span key={item} className="bg-navy text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block">
                          ✓ {item}
                        </span>
                      ))}
                      {w.support_requested_other && (
                        <span className="bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block">
                          ✓ Custom: {w.support_requested_other}
                        </span>
                      )}
                      {(!w.support_requested || w.support_requested.length === 0) && !w.support_requested_other && (
                        <span className="text-gray-400 font-sans italic">No categories explicitly ticked.</span>
                      )}
                    </div>
                  </div>

                  {/* Section E Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/40 text-xs">
                      <h4 className="font-serif text-[11px] font-extrabold text-navy uppercase mb-2 flex items-center gap-1 leading-none border-b border-gray-200 pb-1">
                        <span className="bg-navy text-white text-[8px] px-1 rounded">SECTION E</span>
                        <span>VERIFICATION & DISPATCH</span>
                      </h4>
                      <div className="space-y-1 text-[10px] text-gray-700">
                        <div>Verifier Name: <strong className="text-navy">{w.verifier_name || 'Yvonne Kodzaimambo'}</strong> ({w.verifier_role || 'Administrative Officer'})</div>
                        <div>Organisation: <strong className="text-navy">{w.verifier_org || 'WILL-NAKS FOUNDATION'}</strong></div>
                        <div>Phone contact: <strong className="text-navy">{w.verifier_phone || '+263772836263'}</strong></div>
                        <div className="pt-1.5 border-t border-dashed mt-1">
                          Signature confirmation stamp:<br/>
                          <strong className="font-serif italic text-blue-600 tracking-wider text-xs block mt-0.5">✓ {w.verifier_signature || 'Confirmed digitally'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Section F Box */}
                    <div className="border border-amber-200 rounded-xl p-3 bg-amber-50/20 text-xs">
                      <h4 className="font-serif text-[11px] font-extrabold text-amber-900 uppercase mb-2 flex items-center gap-1 leading-none border-b border-amber-200 pb-1">
                        <span className="bg-amber-700 text-white text-[8px] px-1 rounded">SECTION F</span>
                        <span>FOUNDATION USE ONLY</span>
                      </h4>
                      <div className="space-y-1 text-[10px] text-gray-700">
                        <div className="grid grid-cols-2 gap-2">
                          <div>Approved By: <strong className="text-navy">{w.approved_by || 'Pending Review'}</strong></div>
                          <div>Approval Date: <strong className="text-navy">{w.approval_date ? new Date(w.approval_date).toLocaleDateString() : 'N/A'}</strong></div>
                        </div>
                        <div>Support Package Allocated: <strong className="text-navy">{w.allocated_package || 'N/A'}</strong></div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>Distribution Date: <strong className="text-navy">{w.distribution_date ? new Date(w.distribution_date).toLocaleDateString() : 'N/A'}</strong></div>
                          <div>Follow-up Date: <strong className="text-navy">{w.follow_up_date ? new Date(w.follow_up_date).toLocaleDateString() : 'N/A'}</strong></div>
                        </div>
                        {w.notes && <div className="mt-1 pt-1 border-t border-amber-200/50">Admin Notes: <span className="text-gray-600 italic">{w.notes}</span></div>}
                      </div>
                    </div>
                  </div>

                </div>

                <div className="my-3 p-2 bg-navy/[0.01] border border-gray-100 rounded-lg text-[8px] text-gray-400 text-center leading-relaxed font-sans mt-4">
                  <strong>Confidentiality Policy:</strong> All beneficiary information gathered on this intake is treated with strict confidentiality in adherence to the WILL-NAKS FOUNDATION Data Protection Policy and PVO regulatory obligations. Access is restricted to authorized personnel.
                </div>
              </div>

              <div className="mt-6 flex space-x-3 print:hidden justify-end">
                <button 
                  onClick={() => setSelectedWelfareForForm(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Close View
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-navy hover:bg-navy/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Intake Form</span>
                </button>
              </div>
            </div>
          </div>
        )
      })()}
      {isRecordDonationOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4 font-sans text-left">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl border border-navy/5 shadow-2xl relative">
            <button 
              onClick={() => setIsRecordDonationOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-navy hover:scale-105 transition-all text-sm font-bold bg-gray-100 p-2 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-navy mb-1 italic">
              Record Donation & Generate Receipt
            </h3>
            <p className="text-xs text-gray-500 mb-6">Enter cash, goods or online donations. This creates a secure persistent database ledger record and a downloadable receipt.</p>

            <form onSubmit={saveManualDonation} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Donor Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={newDonationForm.full_name}
                    onChange={(e) => setNewDonationForm(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:bg-white border focus:border-gold text-sm" 
                    placeholder="e.g. Tendai Moyo" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Donor Email</label>
                  <input 
                    type="email" 
                    value={newDonationForm.email}
                    onChange={(e) => setNewDonationForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:bg-white border focus:border-gold text-sm" 
                    placeholder="e.g. tendai@gmail.com" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Donor Phone</label>
                  <input 
                    required
                    type="text" 
                    value={newDonationForm.phone}
                    onChange={(e) => setNewDonationForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:bg-white border focus:border-gold text-sm" 
                    placeholder="+263 775 386 704" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Donor Home Address</label>
                  <input 
                    required
                    type="text" 
                    value={newDonationForm.address}
                    onChange={(e) => setNewDonationForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:bg-white border focus:border-gold text-sm" 
                    placeholder="e.g. Samora Machel Ave, Harare" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Donation Type</label>
                  <select 
                    value={newDonationForm.donation_type}
                    onChange={(e) => setNewDonationForm(prev => ({ ...prev, donation_type: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border focus:border-gold focus:bg-white text-sm font-sans"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Goods">Goods</option>
                    <option value="In-Kind">In-Kind</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Received & Logs By Staff</label>
                  <input 
                    type="text" 
                    readOnly
                    value={newDonationForm.received_by}
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none border focus:border-gold text-sm text-gray-400 cursor-not-allowed font-medium" 
                  />
                </div>
              </div>

              {(newDonationForm.donation_type === 'Online' || newDonationForm.donation_type === 'Cash') ? (
                <div className="grid grid-cols-2 gap-4 bg-emerald-50/20 p-4 rounded-xl border border-emerald-100">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy uppercase tracking-wider block">Amount (USD)</label>
                    <input 
                      required
                      type="number" 
                      min="1"
                      value={newDonationForm.amount_usd}
                      onChange={(e) => setNewDonationForm(prev => ({ ...prev, amount_usd: e.target.value }))}
                      className="w-full px-4 py-3 bg-white rounded-xl outline-none border focus:border-gold text-sm font-bold font-mono text-green-700" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Amount (ZWL / Alternative)</label>
                    <input 
                      type="text" 
                      value={newDonationForm.amount_zwl}
                      onChange={(e) => setNewDonationForm(prev => ({ ...prev, amount_zwl: e.target.value }))}
                      className="w-full px-4 py-3 bg-white rounded-xl outline-none border focus:border-gold text-sm font-mono" 
                      placeholder="e.g. 5000 ZWL" 
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 bg-gold/5 p-4 rounded-xl border border-gold/10">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy uppercase tracking-wider block">Description of Goods</label>
                    <textarea 
                      required
                      value={newDonationForm.goods_description}
                      onChange={(e) => setNewDonationForm(prev => ({ ...prev, goods_description: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white rounded-xl outline-none border focus:border-gold text-sm h-16 resize-none leading-tight" 
                      placeholder="e.g. 15 math books, 2 cartons of writing pads" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Estimated Value (USD)</label>
                    <input 
                      required
                      type="text" 
                      value={newDonationForm.estimated_value}
                      onChange={(e) => setNewDonationForm(prev => ({ ...prev, estimated_value: e.target.value }))}
                      className="w-full px-4 py-3 bg-white rounded-xl outline-none border focus:border-gold text-sm" 
                      placeholder="e.g. $100 USD" 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Donation Programme / Custom Purpose</label>
                <select 
                  value={newDonationForm.purpose}
                  onChange={(e) => setNewDonationForm(prev => ({ ...prev, purpose: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:bg-white border focus:border-gold text-sm"
                >
                  <option value="Disadvantaged Orphans Scholarship Fund">Disadvantaged Orphans Scholarship Fund</option>
                  <option value="Primary & Secondary School Fees Assistance">Primary & Secondary School Fees Assistance</option>
                  <option value="Underprivileged Student Mentorship Programme">Underprivileged Student Mentorship Programme</option>
                  <option value="Elderly and Widows Caring Packages">Elderly and Widows Caring Packages</option>
                  <option value="General registered humanitarian funds">General registered humanitarian funds</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-navy text-white rounded-2xl font-bold hover:bg-navy/95 transition-all text-sm mt-4 flex items-center justify-center space-x-2"
              >
                <span>Record Ledger Donation & Print Receipt</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
        active ? 'bg-gold text-navy font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}

function OverviewStats({ data }: any) {
  const [showPolicies, setShowPolicies] = useState(false);

  const stats = [
    { label: 'Total Donations', value: `$${data.donations.reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0).toLocaleString()}`, icon: Heart, color: 'bg-red-50 text-red-600' },
    { label: 'Total Deducted', value: `$${(data.deductions || []).reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'bg-amber-5 border border-amber-200 text-amber-600' },
    { label: 'Funds Left', value: `$${(data.donations.reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0) - (data.deductions || []).reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0)).toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Scholarship Apps', value: data.scholarships.length, icon: GraduationCap, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Members', value: data.members.length, icon: Users2, color: 'bg-gold/10 text-gold' },
    { label: 'Upcoming Events', value: data.events.length, icon: Calendar, color: 'bg-navy/10 text-navy' },
    { label: 'Volunteers', value: data.volunteers.length, icon: UserPlus, color: 'bg-green-50 text-green-600' },
    { label: 'Social Links', value: data.social.length, icon: Share2, color: 'bg-pink-50 text-pink-600' },
    { label: 'Recent News', value: data.news.length, icon: Newspaper, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Impact Stories', value: data.impact.length, icon: Star, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Gallery Photos', value: data.gallery.length, icon: ImageIcon, color: 'bg-purple-50 text-purple-600' },
    { label: 'Unread Messages', value: data.messages.length, icon: MessageSquare, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 ring-1 ring-gold/5">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-navy mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm ring-1 ring-gold/5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-navy flex items-center gap-2">
              <span className="text-xl">🛠️</span>
              <span>Supabase Database Schema & Storage Manager</span>
            </h3>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
              Ensure you can upload assets, update partner statuses, and record disbursements seamlessly. Click below to copy the setup script for SQL Editor.
            </p>
          </div>
          <button 
            onClick={() => setShowPolicies(!showPolicies)} 
            className="px-5 py-2.5 bg-navy text-white hover:bg-navy/90 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0"
          >
            {showPolicies ? 'Hide SQL Code' : 'Show DB Setup Code'}
          </button>
        </div>

        {showPolicies && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs text-left mb-4">
              <p className="font-bold flex items-center gap-1.5 mb-1.5 text-amber-900">
                <span>⚡</span> SQL Run Instructions:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-gray-700 leading-normal">
                <li>Go to your <strong className="text-navy">Supabase Dashboard</strong>.</li>
                <li>Click on <strong className="text-navy">SQL Editor</strong> on the left-side panel.</li>
                <li>Paste the script below into the query window.</li>
                <li>Click the <strong className="text-navy">Run</strong> button to execute. This instantly updates the schema cache!</li>
              </ol>
            </div>

            <pre className="p-4 bg-gray-900 text-gray-100 border border-gray-800 rounded-2xl text-[11px] font-mono overflow-x-auto select-all max-h-96 scrollbar-thin whitespace-pre leading-normal">
{`-- A. FIX MISSING COLUMN error on updates
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- B. CREATE 'deductions' table for budget disbursement metrics
CREATE TABLE IF NOT EXISTS public.deductions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  amount NUMERIC NOT NULL,
  purpose TEXT NOT NULL,
  recipient TEXT DEFAULT 'N/A',
  project_lead TEXT DEFAULT 'N/A'
);

-- Enable RLS for deductions
ALTER TABLE public.deductions ENABLE ROW LEVEL SECURITY;

-- Allow public viewing of disbursements (transparency)
DROP POLICY IF EXISTS "Public view deductions" ON public.deductions;
CREATE POLICY "Public view deductions" ON public.deductions FOR SELECT USING (true);

-- Allow administrators full control
DROP POLICY IF EXISTS "Admins manage deductions" ON public.deductions;
CREATE POLICY "Admins manage deductions" ON public.deductions FOR ALL USING (public.is_admin());

-- C. SETUP Storage Bucket and Policies if not present already
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public View Images" ON storage.objects;
DROP POLICY IF EXISTS "Admins Manage Images" ON storage.objects;
DROP POLICY IF EXISTS "Admins Insert Images" ON storage.objects;
DROP POLICY IF EXISTS "Admins Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Admins Delete Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Images" ON storage.objects;

CREATE POLICY "Public View Images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Public Insert Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Public Update Images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Public Delete Images" ON storage.objects FOR DELETE USING (bucket_id = 'images');`}
            </pre>

            <div className="mt-3 flex items-center gap-2 text-[10px] text-green-600 font-semibold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span>Fully compatible with standard media uploads + Partner Status updates</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Table({ headers, children }: any) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden ring-1 ring-gold/5">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            {headers.map((h: string) => (
              <th key={h} className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {(!children || children.length === 0) && (
        <div className="p-8 text-center text-gray-400 italic">No records found.</div>
      )}
    </div>
  );
}
