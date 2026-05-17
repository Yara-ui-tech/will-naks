import { motion } from 'motion/react';
import { CreditCard, Calendar, Users, Heart } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Donation() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const donationOptions = [
    { id: '25', label: '$25 / Mo', amount: 25, desc: 'Provides learning materials for two students.', icon: CreditCard },
    { id: '50', label: '$50 / Mo', amount: 50, desc: 'Covers essential school supplies and mentorship.', icon: Calendar },
    { id: '100', label: '$100 / Mo', amount: 100, desc: 'Sponsors full tuition for one deserving student.', icon: Users },
  ];

  const handleDonate = async (amount?: number) => {
    setLoading(true);
    setSuccess(false);

    const donationAmount = amount || parseFloat(customAmount);

    if (!donationAmount || isNaN(donationAmount)) {
      alert('Please enter a valid amount');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('donations')
        .insert([{ amount: donationAmount, payment_status: 'pending' }]);

      if (error) throw error;
      
      setSuccess(true);
      setCustomAmount('');
      setSelectedOption(null);
    } catch (err) {
      console.error('Donation error:', err);
      alert('Failed to record donation. Please check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-navy text-white py-20 rounded-[3.5rem] mx-4 sm:mx-8 border border-gold/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4 font-sans">Make a Difference</h2>
            <h3 className="text-4xl md:text-6xl font-bold mb-8 italic">Your Support <br /> <span className="text-gold">Can Change a Life</span></h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
              Every contribution directly fuels our educational programs and helps underprivileged students reach their academic goals. Start your impact today.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="bg-gold p-3 rounded-full">
                  <Heart className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Sponsor a Student</h4>
                  <p className="text-gray-400 text-sm">Create a lasting impact with a personalized educational sponsorship.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-12 text-navy shadow-2xl relative overflow-hidden border border-gold/10"
          >
            <div className="relative z-10">
              <h4 className="text-3xl font-bold mb-8 text-center">Select Amount</h4>
              
              <div className="space-y-4 mb-8">
                {donationOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedOption(option.id);
                      setCustomAmount('');
                    }}
                    className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-left group ${
                      selectedOption === option.id ? 'border-gold bg-gold/5' : 'border-gray-100 hover:border-gold hover:bg-gold/5'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl transition-colors ${
                        selectedOption === option.id ? 'bg-gold' : 'bg-gray-100 group-hover:bg-gold'
                      }`}>
                        <option.icon className="h-6 w-6 text-navy" />
                      </div>
                      <div>
                        <p className={`font-bold text-lg transition-colors ${
                          selectedOption === option.id ? 'text-gold' : 'group-hover:text-gold'
                        }`}>{option.label}</p>
                        <p className="text-gray-500 text-xs">{option.desc}</p>
                      </div>
                    </div>
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedOption === option.id ? 'border-gold' : 'border-gray-300 group-hover:border-gold'
                    }`}>
                      <div className={`h-3 w-3 rounded-full bg-gold transition-opacity ${
                        selectedOption === option.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}></div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 mb-8">
                <input 
                  type="number" 
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedOption(null);
                  }}
                  placeholder="Custom Amount ($)" 
                  className="flex-1 bg-gray-50 border border-gray-200 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                />
              </div>

              {success && (
                <p className="text-green-600 font-bold text-sm text-center mb-4">Support intention recorded! Thank you.</p>
              )}

              <button 
                disabled={loading}
                onClick={() => {
                  const selected = donationOptions.find(o => o.id === selectedOption);
                  handleDonate(selected?.amount);
                }}
                className="w-full py-5 bg-navy text-white rounded-xl font-bold text-lg hover:bg-navy/90 transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-navy/20 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Donate Now'}
              </button>
              
              <p className="text-center text-gray-400 text-xs mt-6">
                All donations are secure and encrypted.
              </p>
            </div>
            
            {/* Decorative background shape */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
