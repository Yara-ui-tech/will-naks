import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

export default function DynamicStats() {
  const [stats, setStats] = useState([
    { label: 'Foundation Members', value: 0, suffix: '' },
    { label: 'Scholarships Awarded', value: 0, suffix: '' },
    { label: 'Total Support', value: 0, prefix: '$' },
    { label: 'Active Volunteers', value: 0, suffix: '' },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [donations, scholarships, volunteers, members] = await Promise.all([
        supabase.from('donations').select('amount'),
        supabase.from('scholarships').select('id').eq('status', 'approved'),
        supabase.from('volunteers').select('id'),
        supabase.from('members').select('id')
      ]);

      const totalDonations = donations.data?.reduce((acc, d) => acc + d.amount, 0) || 0;
      const scholarshipCount = scholarships.data?.length || 0;
      const volunteerCount = volunteers.data?.length || 0;
      const memberCount = members.data?.length || 0;

      setStats([
        { label: 'Foundation Members', value: memberCount, suffix: '' },
        { label: 'Scholarships Awarded', value: scholarshipCount, suffix: '' },
        { label: 'Total Support', value: totalDonations, prefix: '$' },
        { label: 'Active Volunteers', value: volunteerCount, suffix: '' },
      ]);
    } catch (err) {
      console.warn('Failed to fetch statistics, showing true state:', err);
      setStats([
        { label: 'Foundation Members', value: 0, suffix: '' },
        { label: 'Scholarships Awarded', value: 0, suffix: '' },
        { label: 'Total Support', value: 0, prefix: '$' },
        { label: 'Active Volunteers', value: 0, suffix: '' },
      ]);
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white p-8 rounded-3xl border border-gold/10 shadow-lg text-center group hover:border-gold/30 transition-all duration-300"
        >
          <div className="relative inline-block">
            <span className="text-3xl md:text-5xl font-serif font-bold text-navy group-hover:text-gold transition-colors duration-300 italic">
              {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
            </span>
          </div>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-4 font-sans line-clamp-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
