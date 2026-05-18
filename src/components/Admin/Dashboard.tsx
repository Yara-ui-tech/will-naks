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
  Newspaper
} from 'lucide-react';

type View = 'overview' | 'donations' | 'scholarships' | 'partners' | 'volunteers' | 'news' | 'gallery' | 'testimonials' | 'admins';

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
    profiles: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [donations, scholarships, partners, volunteers, news, gallery, testimonials, profiles] = await Promise.all([
      supabase.from('donations').select('*').order('created_at', { ascending: false }),
      supabase.from('scholarships').select('*').order('created_at', { ascending: false }),
      supabase.from('partners').select('*').order('created_at', { ascending: false }),
      supabase.from('volunteers').select('*').order('created_at', { ascending: false }),
      supabase.from('news').select('*').order('created_at', { ascending: false }),
      supabase.from('gallery').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*')
    ]);

    setData({
      donations: donations.data || [],
      scholarships: scholarships.data || [],
      partners: partners.data || [],
      volunteers: volunteers.data || [],
      news: news.data || [],
      gallery: gallery.data || [],
      testimonials: testimonials.data || [],
      profiles: profiles.data || []
    });
    setLoading(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  const toggleApproval = async (id: string, current: boolean) => {
    await supabase.from('testimonials').update({ is_approved: !current }).eq('id', id);
    fetchData();
  };

  const deleteItem = async (table: string, id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await supabase.from(table).delete().eq('id', id);
      fetchData();
    }
  };

  const promoteAdmin = async (id: string) => {
    if (confirm('Promote this user to Admin?')) {
      await supabase.from('profiles').update({ role: 'admin' }).eq('id', id);
      fetchData();
    }
  };

  const addToGallery = async () => {
    const url = prompt('Enter Image URL:');
    const caption = prompt('Enter Caption:');
    if (url) {
      await supabase.from('gallery').insert([{ url, caption, category: 'Foundation' }]);
      fetchData();
    }
  };

  const addNews = async () => {
    const title = prompt('News Title:');
    const content = prompt('News Content:');
    const image_url = prompt('Image URL:');
    if (title && content) {
      await supabase.from('news').insert([{ title, content, image_url, category: 'General' }]);
      fetchData();
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-navy text-white flex flex-col p-6 space-y-8">
        <div className="flex items-center space-x-3 mb-4">
          <img src="/assets/logo.png" alt="Logo" className="h-8 w-auto invert brightness-0" />
          <span className="font-bold tracking-tight">ADMIN PANEL</span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 pb-8 scrollbar-hide">
          <NavItem active={activeView === 'overview'} onClick={() => setActiveView('overview')} icon={LayoutDashboard} label="Overview" />
          <NavItem active={activeView === 'donations'} onClick={() => setActiveView('donations')} icon={Heart} label="Donations" />
          <NavItem active={activeView === 'scholarships'} onClick={() => setActiveView('scholarships')} icon={GraduationCap} label="Scholarships" />
          <NavItem active={activeView === 'partners'} onClick={() => setActiveView('partners')} icon={Handshake} label="Partners" />
          <NavItem active={activeView === 'volunteers'} onClick={() => setActiveView('volunteers')} icon={UserPlus} label="Volunteers" />
          <NavItem active={activeView === 'news'} onClick={() => setActiveView('news')} icon={Newspaper} label="News & Blog" />
          <NavItem active={activeView === 'gallery'} onClick={() => setActiveView('gallery')} icon={ImageIcon} label="Gallery" />
          <NavItem active={activeView === 'testimonials'} onClick={() => setActiveView('testimonials')} icon={MessageSquare} label="Testimonials" />
          <NavItem active={activeView === 'admins'} onClick={() => setActiveView('admins')} icon={Users} label="Admin Users" />
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/10"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-navy capitalize">{activeView.replace('-', ' ')}</h1>
          {activeView === 'gallery' && (
            <button onClick={addToGallery} className="bg-gold text-navy px-4 py-2 rounded-lg font-bold flex items-center space-x-2">
              <Plus className="h-4 w-4" /> <span>Add Photo</span>
            </button>
          )}
          {activeView === 'news' && (
            <button onClick={addNews} className="bg-gold text-navy px-4 py-2 rounded-lg font-bold flex items-center space-x-2">
              <Plus className="h-4 w-4" /> <span>Add Post</span>
            </button>
          )}
        </header>

        {activeView === 'overview' && <OverviewStats data={data} />}
        
        {activeView === 'donations' && (
          <Table headers={['Date', 'Amount', 'Status']}>
            {data.donations.map((d: any) => (
              <tr key={d.id} className="border-b">
                <td className="p-4">{new Date(d.created_at).toLocaleDateString()}</td>
                <td className="p-4 font-bold text-navy">${d.amount}</td>
                <td className="p-4 uppercase text-xs font-bold text-gold">{d.payment_status}</td>
              </tr>
            ))}
          </Table>
        )}

        {activeView === 'scholarships' && (
          <div className="space-y-4">
            {data.scholarships.map((s: any) => (
              <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-navy">{s.full_name}</h3>
                  <span className="text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div><span className="text-gray-400">Level:</span> {s.education_level}</div>
                  <div><span className="text-gray-400">Institution:</span> {s.institution}</div>
                  <div><span className="text-gray-400">Email:</span> {s.email}</div>
                  <div><span className="text-gray-400">Status:</span> <span className="text-gold font-bold uppercase text-[10px]">{s.status}</span></div>
                </div>
                <p className="text-gray-600 text-sm italic">"{s.reason}"</p>
                <div className="mt-4 flex justify-end space-x-2">
                   <button onClick={() => deleteItem('scholarships', s.id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'partners' && (
          <div className="space-y-4">
            {data.partners.map((p: any) => (
              <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-navy">{p.org_name}</h3>
                  <span className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div><span className="text-gray-400">Industry:</span> {p.industry}</div>
                  <div><span className="text-gray-400">Email:</span> {p.email}</div>
                </div>
                <p className="text-gray-600 text-sm">{p.message}</p>
                <div className="mt-4 flex justify-end space-x-2">
                   <button onClick={() => deleteItem('partners', p.id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'volunteers' && (
          <Table headers={['Date', 'Name', 'Email', 'Expertise', 'Availability', 'Actions']}>
            {data.volunteers.map((v: any) => (
              <tr key={v.id} className="border-b">
                <td className="p-4 text-sm">{new Date(v.created_at).toLocaleDateString()}</td>
                <td className="p-4 font-bold">{v.full_name}</td>
                <td className="p-4 text-sm">{v.email}</td>
                <td className="p-4 text-sm">{v.expertise}</td>
                <td className="p-4 text-sm">{v.availability}</td>
                <td className="p-4">
                   <button onClick={() => deleteItem('volunteers', v.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </Table>
        )}

        {activeView === 'news' && (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.news.map((post: any) => (
              <div key={post.id} className="group relative bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                {post.image_url && <img src={post.image_url} alt="" className="w-full h-40 object-cover rounded-2xl mb-4" />}
                <h3 className="font-bold text-navy mb-2">{post.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-3 mb-4">{post.content}</p>
                <div className="flex justify-between items-center">
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
              <div key={img.id} className="group relative bg-white p-2 rounded-xl shadow-sm">
                <img src={img.url} alt="" className="w-full h-40 object-cover rounded-lg" />
                <button 
                  onClick={() => deleteItem('gallery', img.id)}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
                <td className="p-4">{p.email}</td>
                <td className="p-4 uppercase text-xs font-bold tracking-widest text-gold">{p.role}</td>
                <td className="p-4">
                  {p.role !== 'admin' && (
                    <button onClick={() => promoteAdmin(p.id)} className="bg-navy text-white px-3 py-1 rounded-lg text-xs font-bold">
                      Promote to Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </Table>
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
    { label: 'Volunteers', value: data.volunteers.length, icon: UserPlus, color: 'bg-green-50 text-green-600' },
    { label: 'Partner Requests', value: data.partners.length, icon: Handshake, color: 'bg-orange-50 text-orange-600' },
    { label: 'Recent News', value: data.news.length, icon: Newspaper, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Gallery Photos', value: data.gallery.length, icon: ImageIcon, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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
