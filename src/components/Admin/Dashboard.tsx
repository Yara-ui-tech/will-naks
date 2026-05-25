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
  DollarSign
} from 'lucide-react';

type View = 'overview' | 'donations' | 'deductions' | 'scholarships' | 'partners' | 'volunteers' | 'news' | 'gallery' | 'testimonials' | 'admins' | 'team' | 'events' | 'impact' | 'social' | 'members' | 'messages';

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
    messages: []
  });
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [fetchErrors, setFetchErrors] = useState<string[]>([]);

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
        messages: messages.data || []
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
          <NavItem active={activeView === 'scholarships'} onClick={() => { setActiveView('scholarships'); setIsSidebarOpen(false); }} icon={GraduationCap} label="Scholarships" />
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

            <Table headers={['Date', 'Donor Name', 'Email', 'Amount', 'Status', 'Actions']}>
              {data.donations.map((d: any) => (
                <tr key={d.id} className="border-b text-sm">
                  <td className="p-4">{new Date(d.created_at).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-navy">{d.donor_name || 'Anonymous'}</td>
                  <td className="p-4 text-xs text-gray-500 font-mono">{d.email || 'N/A'}</td>
                  <td className="p-4 font-bold text-green-600">${d.amount}</td>
                  <td className="p-4 uppercase text-xs font-bold text-gold">{d.payment_status}</td>
                  <td className="p-4">
                    <button onClick={() => deleteItem('donations', d.id)} className="text-red-400 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
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

        {activeView === 'scholarships' && (
          <div className="space-y-4">
            {data.scholarships.map((s: any) => (
              <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-navy">{s.full_name}</h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(s.created_at).toLocaleDateString()}</span>
                    <button onClick={() => deleteItem('scholarships', s.id)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                  <div><span className="text-gray-400 font-medium">Level:</span> {s.education_level}</div>
                  <div><span className="text-gray-400 font-medium">Institution:</span> {s.institution}</div>
                  <div><span className="text-gray-400 font-medium">Email:</span> {s.email}</div>
                  <div><span className="text-gray-400 font-medium">Status:</span> <span className="text-gold font-bold uppercase text-[10px]">{s.status}</span></div>
                </div>
                <p className="text-gray-600 text-sm italic">"{s.reason}"</p>
                <div className="mt-4 flex flex-wrap gap-2">
                   <button onClick={() => updateStatus('scholarships', s.id, 'approved')} className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[10px] font-bold uppercase hover:bg-green-200 transition-colors">Approve</button>
                   <button onClick={() => updateStatus('scholarships', s.id, 'denied')} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-[10px] font-bold uppercase hover:bg-red-200 transition-colors">Deny</button>
                </div>
              </div>
            ))}
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
            {data.gallery.map((img: any) => (
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
      </div>
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
