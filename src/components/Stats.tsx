import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

export default function DynamicStats() {
  const [stats, setStats] = useState([
    { label: 'Students Assisted', value: 0, suffix: '+' },
    { label: 'Scholarships Awarded', value: 0, suffix: '+' },
    { label: 'Total Support', value: 0, prefix: '$' },
    { label: 'Active Volunteers', value: 0, suffix: '+' },
  ]);

  useEffect(() => {
    fetchStats();
    
    // Subscribe to changes for live updates
    const updates = supabase.channel('stats-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scholarships' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'volunteers' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, fetchStats)
      .subscribe();

    return () => { supabase.removeChannel(updates); };
  }, []);

  const fetchStats = async () => {
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
      { label: 'Foundation Members', value: memberCount + 45, suffix: '+' }, // Baseline + dynamic
      { label: 'Scholarships Awarded', value: scholarshipCount, suffix: '' },
      { label: 'Total Support', value: totalDonations, prefix: '$' },
      { label: 'Active Volunteers', value: volunteerCount, suffix: '' },
    ]);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center group"
        >
          <div className="relative inline-block">
            <span className="text-4xl md:text-6xl font-serif font-bold text-navy group-hover:text-gold transition-colors duration-300 italic">
              {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
            </span>
            <div className="h-1 w-0 bg-gold group-hover:w-full transition-all duration-500 mt-1"></div>
          </div>
          <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mt-4 font-sans">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
