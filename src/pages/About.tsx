import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Heart, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-gold font-bold uppercase tracking-[0.3em] text-sm">Our Legacy</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-navy mt-6 mb-8 italic">
            Empowering Through <span className="text-gold">Education</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            The WILL-NAKS Foundation is dedicated to breaking the cycle of poverty by providing 
            access to high-quality education and mentorship for Africa's most promising talents.
          </p>
        </motion.div>
      </section>

      {/* History */}
      <section className="bg-cream py-24 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200" 
                alt="Our History"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif font-bold text-navy mb-8">Our Journey</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Founded with a vision to create a world where talent is never limited by financial
                  circumstances, the WILL-NAKS Foundation began its work in 2020. Since then, we have
                  transformed from a small community initiative into a pan-African support system.
                </p>
                <p>
                  We believe that education is the most powerful weapon which you can use to change 
                  the world. Our programs are designed not just to pay fees, but to build leaders, 
                  innovators, and change-makers.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-navy p-12 rounded-3xl text-white overflow-hidden relative group"
          >
            <div className="relative z-10">
              <div className="bg-gold/20 p-4 rounded-2xl w-fit mb-8">
                <Target className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-3xl font-serif font-bold mb-6 italic text-gold">Our Mission</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                To bridge the educational gap by providing comprehensive financial support, 
                mentorship, and personal development resources to deserving students across Africa.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-12 rounded-3xl border border-navy/5 shadow-xl relative group"
          >
            <div className="relative z-10">
              <div className="bg-navy/5 p-4 rounded-2xl w-fit mb-8">
                <Eye className="h-8 w-8 text-navy" />
              </div>
              <h3 className="text-3xl font-serif font-bold mb-6 italic text-navy">Our Vision</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                A continent where every young person has the tools and opportunity to fulfill 
                their potential and lead their communities into a prosperous future.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-navy italic">Our Core Values</h2>
          <div className="h-1 w-20 bg-gold mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Heart, label: 'Compassion', desc: 'Empathy in every action' },
            { icon: Award, label: 'Excellence', desc: 'High standards always' },
            { icon: Target, label: 'Integrity', desc: 'Honest stewardship' },
            { icon: Award, label: 'Impact', desc: 'Results that matter' }
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-2xl hover:bg-cream transition-colors duration-300"
            >
              <item.icon className="h-10 w-10 text-gold mx-auto mb-4" />
              <h4 className="text-navy font-bold text-lg mb-2">{item.label}</h4>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
