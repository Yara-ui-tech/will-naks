import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LogIn, Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gold/10"
      >
        <div className="text-center mb-8">
          <img src="/assets/logo.png" alt="Logo" className="h-16 w-auto mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-navy">Admin Portal</h2>
          <p className="text-gray-500 mt-2">Sign in to manage the foundation</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-100 pl-12 pr-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                placeholder="admin@will-naks.org"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-100 pl-12 pr-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full py-5 bg-navy text-white rounded-xl font-bold text-lg flex items-center justify-center hover:bg-navy/90 transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-navy/20 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <LogIn className="ml-3 h-5 w-5 text-gold" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
