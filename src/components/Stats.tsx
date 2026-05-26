import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

export default function DynamicStats() {
  const [stats, setStats] = useState([
    { label: 'Foundation Members', value: 0, suffix: '' },
    { label: 'Scholarships Awarded', value: 0, suffix: '' },
    { label: 'Total Support Received', value: 0, prefix: '$' },
    { label: 'Active Volunteers', value: 0, suffix: '' },
  ]);

  const [transparency, setTransparency] = useState({
    donated: 0,
    deducted: 0,
    deductionsList: [] as any[]
  });

  const [showTransparency, setShowTransparency] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [donations, scholarships, volunteers, members, deductions] = await Promise.all([
        supabase.from('donations').select('amount'),
        supabase.from('scholarships').select('id').eq('status', 'approved'),
        supabase.from('volunteers').select('id'),
        supabase.from('members').select('id'),
        supabase.from('deductions').select('*').order('created_at', { ascending: false })
      ]);

      const totalDonations = donations.data?.reduce((acc, d) => acc + d.amount, 0) || 0;
      const scholarshipCount = scholarships.data?.length || 0;
      const volunteerCount = volunteers.data?.length || 0;
      const memberCount = members.data?.length || 0;
      const deductionsList = deductions.data || [];
      const totalDeductions = deductionsList.reduce((acc, d) => acc + Number(d.amount || 0), 0);

      setStats([
        { label: 'Foundation Members', value: memberCount, suffix: '' },
        { label: 'Scholarships Awarded', value: scholarshipCount, suffix: '' },
        { label: 'Total Support Received', value: totalDonations, prefix: '$' },
        { label: 'Active Volunteers', value: volunteerCount, suffix: '' },
      ]);

      setTransparency({
        donated: totalDonations,
        deducted: totalDeductions,
        deductionsList
      });
    } catch (err) {
      console.warn('Failed to fetch statistics, showing true state:', err);
      setStats([
        { label: 'Foundation Members', value: 0, suffix: '' },
        { label: 'Scholarships Awarded', value: 0, suffix: '' },
        { label: 'Total Support Received', value: 0, prefix: '$' },
        { label: 'Active Volunteers', value: 0, suffix: '' },
      ]);
    }
  };

  const remainingFunds = transparency.donated - transparency.deducted;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const isTotalSupport = stat.label === 'Total Support Received';
          const shouldMask = isTotalSupport && stat.value > 100;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gold/10 shadow-lg text-center group hover:border-gold/30 transition-all duration-300"
            >
              <div className="relative inline-block">
                <span className="text-3xl md:text-5xl font-serif font-bold text-navy group-hover:text-gold transition-colors duration-300 italic">
                  {shouldMask ? '$100+' : `${stat.prefix || ''}${stat.value.toLocaleString()}${stat.suffix || ''}`}
                </span>
              </div>
              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-4 font-sans line-clamp-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Financial Transparency & Disbursement Disclosures Section */}
      {transparency.donated > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0b132b]/5 border border-gold/10 rounded-[2rem] p-6 md:p-8 max-w-4xl mx-auto shadow-sm ring-1 ring-gold/5"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.25em] block mb-1">Financial Accountability</span>
              <h4 className="text-navy font-bold text-lg md:text-xl font-serif">Fund Allocation & Use Transparency</h4>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed max-w-xl">
                We believe in complete openness. Track every single dollar we receive, when and why deductions were made, and current net remaining operational cash.
              </p>
            </div>
            <button 
              onClick={() => setShowTransparency(!showTransparency)}
              className="px-5 py-2.5 bg-navy hover:bg-navy/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 border border-gold/15"
            >
              {showTransparency ? 'Hide Accounts' : 'View Use of Funds'}
            </button>
          </div>

          {showTransparency && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 border-t border-navy/10 pt-8 space-y-6"
            >
              {/* Financial Balance Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-navy/5 text-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Total Support Received</span>
                  <span className="text-2xl font-bold text-green-600">
                    {transparency.donated > 100 ? '$100+' : `$${transparency.donated.toLocaleString()}`}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-navy/5 text-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Total Amount Invested/Deducted</span>
                  <span className="text-2xl font-bold text-red-500">-${transparency.deducted.toLocaleString()}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gold/20 text-center ring-1 ring-gold/10">
                  <span className="text-[10px] text-gold font-bold uppercase tracking-wider block mb-1">Net Remaining Balance</span>
                  <span className="text-2xl font-bold text-navy">
                    {transparency.donated > 100 ? '$100+' : `$${remainingFunds.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Deductions & Allocation Table */}
              <div className="bg-white border border-navy/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-navy/[0.02] border-b border-navy/5">
                  <p className="text-[10px] text-navy font-bold uppercase tracking-wider">Itemized Budget Deductions & Direct Deliveries</p>
                </div>
                {transparency.deductionsList.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs italic">
                    No fund deductions have been recorded yet. 100% of support is currently held in our operational account.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-navy/5 text-[10px] uppercase font-bold text-gray-400">
                          <th className="p-4">Date</th>
                          <th className="p-4">Purpose / Use of money</th>
                          <th className="p-4">Recipient</th>
                          <th className="p-4">Project Lead</th>
                          <th className="p-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-sans">
                        {transparency.deductionsList.map((d) => (
                          <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 text-gray-500 whitespace-nowrap">{new Date(d.created_at).toLocaleDateString()}</td>
                            <td className="p-4 font-semibold text-navy max-w-[240px] break-words">{d.purpose}</td>
                            <td className="p-4 text-gray-600">{d.recipient || 'N/A'}</td>
                            <td className="p-4 text-gray-500">{d.project_lead || 'N/A'}</td>
                            <td className="p-4 text-right font-bold text-red-600 whitespace-nowrap">-${Number(d.amount).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
