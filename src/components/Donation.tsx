import { motion } from 'motion/react';
import { CreditCard, Calendar, Users, Heart } from 'lucide-react';

export default function Donation() {
  const donationOptions = [
    { label: '$25 / Mo', desc: 'Provides learning materials for two students.', icon: CreditCard },
    { label: '$50 / Mo', desc: 'Covers essential school supplies and mentorship.', icon: Calendar },
    { label: '$100 / Mo', desc: 'Sponsors full tuition for one deserving student.', icon: Users },
  ];

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
                    key={option.label}
                    className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-gray-100 hover:border-gold hover:bg-gold/5 transition-all text-left group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-100 group-hover:bg-gold rounded-xl transition-colors">
                        <option.icon className="h-6 w-6 text-navy" />
                      </div>
                      <div>
                        <p className="font-bold text-lg group-hover:text-gold transition-colors">{option.label}</p>
                        <p className="text-gray-500 text-xs">{option.desc}</p>
                      </div>
                    </div>
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300 group-hover:border-gold flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 mb-8">
                <input 
                  type="text" 
                  placeholder="Custom Amount ($)" 
                  className="flex-1 bg-gray-50 border border-gray-200 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                />
              </div>

              <button className="w-full py-5 bg-navy text-white rounded-xl font-bold text-lg hover:bg-navy/90 transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-navy/20">
                One-Time Donation
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
