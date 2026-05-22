/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Team from './pages/Team';
import Gallery from './pages/Gallery';
import Impact from './pages/Impact';
import Support from './pages/Support';
import News from './pages/News';
import Join from './pages/Join';
import Testimonials from './pages/Testimonials';
import AdminDashboard from './components/Admin/Dashboard';
import AdminLogin from './components/Admin/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import DonationNotification from './components/DonationNotification';
import { supabase } from './lib/supabase';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <Navbar />}
      {children}
      {!isAdminPath && <Footer />}
      {!isAdminPath && <WhatsAppButton />}
      {!isAdminPath && <DonationNotification />}
    </>
  );
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncProfile = async (user: any) => {
      if (!user) return;
      try {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);
        const profile = profiles?.[0];

        if (['goyaracorp@gmail.com', 'tapiwanashe.mandiveyi@gmail.com'].includes(user.email)) {
          if (!profile) {
            // Auto-create lead admin
            await supabase.from('profiles').insert([
              { id: user.id, email: user.email, role: 'admin' }
            ]);
          } else if (profile.role !== 'admin') {
            // Auto-promote
            await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
          }
        }
      } catch (err) {
        console.error('Error syncing profile:', err);
      }
    };

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await syncProfile(session.user);
      }
    }).catch((err) => {
      console.warn('Supabase auth session fetch failed:', err);
    }).finally(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await syncProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/team" element={<Team />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/news" element={<News />} />
          <Route path="/join" element={<Join />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route 
            path="/admin" 
            element={session ? <AdminDashboard /> : <AdminLogin />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

