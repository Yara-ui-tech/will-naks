import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
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
  Users2
} from 'lucide-react';

type View = 'overview' | 'donations' | 'scholarships' | 'partners' | 'volunteers' | 'news' | 'gallery' | 'testimonials' | 'admins' | 'team' | 'events' | 'impact' | 'social' | 'members' | 'messages';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<View>('overview');
  const [data, setData] = useState<any>({
    donations: [],
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    fetchData();

    // Subscribe to all relevant tables for live updates
    const channel = supabase.channel('dashboard-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scholarships' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'partners' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'volunteers' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'impact_stories' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_links' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donations, scholarships, partners, volunteers, news, gallery, testimonials, profiles, team, events, impact, social, members, messages] = await Promise.all([
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
        supabase.from('contacts').select('*').order('created_at', { ascending: false })
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

      setData({
        donations: donations.data || [],
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
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  const toggleApproval = async (id: string, current: boolean) => {
    const { error } = await supabase.from('testimonials').update({ is_approved: !current }).eq('id', id);
    if (error) alert(`Error updating: ${error.message}`);
    fetchData();
  };

  const deleteItem = async (table: string, id: string) => {
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) {
        alert(`Error deleting: ${error.message}`);
      } else {
        fetchData();
      }
    }
  };

  const promoteAdmin = async (id: string) => {
    if (confirm('Promote this user to Admin?')) {
      const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', id);
      if (error) alert(`Error promoting: ${error.message}`);
      fetchData();
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
      fetchData();
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
        fetchData();
      });
      input.click();
    } else {
      const { error } = await supabase.from('news').insert([{ title, content, category: 'General' }]);
      if (error) alert(`Error adding news: ${error.message}`);
      fetchData();
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
      fetchData();
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
        fetchData();
      });
      input.click();
    } else {
      const { error } = await supabase.from('events').insert([{ title, event_date: date, location, description }]);
      if (error) alert(`Error adding event: ${error.message}`);
      fetchData();
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
      fetchData();
    });
    input.click();
  };

  const addSocialLink = async () => {
    const platform = prompt('Platform Name:');
    const url = prompt('URL:');
    if (platform && url) {
      const { error } = await supabase.from('social_links').insert([{ platform, url }]);
      if (error) alert(`Error adding link: ${error.message}`);
      fetchData();
    }
  };

  const toggleSocialActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from('social_links').update({ is_active: !current }).eq('id', id);
    if (error) alert(`Error updating link: ${error.message}`);
    fetchData();
  };

  const updateStatus = async (table: string, id: string, status: string) => {
    const { error } = await supabase.from(table).update({ status }).eq('id', id);
    if (error) alert(`Error updating status: ${error.message}`);
    fetchData();
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
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2">
          {isSidebarOpen ? <X /> : <LayoutDashboard />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:relative inset-0 md:inset-auto z-[65] w-full md:w-64 bg-navy text-white flex flex-col p-6 space-y-8 transition-transform duration-300 ease-in-out
      `}>
        <div className="hidden md:flex items-center space-x-3 mb-4">
          <img src="/assets/logo.png" alt="Logo" className="h-8 w-auto invert brightness-0" />
          <span className="font-bold tracking-tight">ADMIN PANEL</span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 pb-8 scrollbar-hide">
          <NavItem active={activeView === 'overview'} onClick={() => { setActiveView('overview'); setIsSidebarOpen(false); }} icon={LayoutDashboard} label="Overview" />
          <NavItem active={activeView === 'donations'} onClick={() => { setActiveView('donations'); setIsSidebarOpen(false); }} icon={Heart} label="Donations" />
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

        {activeView === 'overview' && <OverviewStats data={data} />}
        
        {activeView === 'donations' && (
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
            {data.messages.map((m: any) => (
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
            ))}
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
  const stats = [
    { label: 'Total Donations', value: `$${data.donations.reduce((acc: number, d: any) => acc + d.amount, 0)}`, icon: Heart, color: 'bg-red-50 text-red-600' },
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
