import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Eye, Heart, Award, ShieldCheck, Users, HelpCircle, ChevronDown, ChevronUp, FileText, CheckCircle } from 'lucide-react';

export default function About() {
  const [showConstitution, setShowConstitution] = useState(false);
  const [showFoundingMinutes, setShowFoundingMinutes] = useState(false);

  const coreValues = [
    { title: 'Compassion', desc: 'We lead with empathy and a commitment to those in need.' },
    { title: 'Integrity', desc: 'We operate with transparency, accountability, and honesty in all dealings.' },
    { title: 'Excellence', desc: 'We hold high standards in all programs, partnerships, and processes.' },
    { title: 'Inclusion', desc: 'We believe every student deserves access to quality education, regardless of background.' },
    { title: 'Empowerment', desc: 'We equip individuals to become self-sufficient, confident leaders.' },
    { title: 'Community', desc: 'We build strong networks of support, mentorship, and shared purpose.' }
  ];

  const leadershipTeam = [
    { name: 'Willie Nakunyada', role: 'Founder', status: 'Active' },
    { name: 'Simbarashe O Manongwa', role: 'Chief Executive Officer', status: 'Active' },
    { name: 'Tapiwanashe Mandiveyi', role: 'Chief Executive Officer', status: 'Active' },
    { name: 'Yvone Kodzaimambo', role: 'Admin & Logistics Officer', status: 'Active' },
    { name: 'To Be Appointed', role: 'Secretary', status: 'Vacant' },
    { name: 'To Be Appointed', role: 'Treasurer', status: 'Vacant' },
    { name: 'To Be Appointed', role: 'Program Coordinators', status: 'Vacant' }
  ];

  const programCycle = [
    { phase: 'Phase 1', title: 'Identification', desc: 'Community outreach teams identify students in need through schools, churches, and local leaders.' },
    { phase: 'Phase 2', title: 'Assessment', desc: 'Each candidate is assessed for academic potential, financial need, and commitment.' },
    { phase: 'Phase 3', title: 'Support', desc: 'Selected beneficiaries receive targeted support (fees, materials, mentorship) based on individual needs.' },
    { phase: 'Phase 4', title: 'Follow-up', desc: 'Ongoing monitoring of beneficiary progress, with quarterly reviews and reports.' }
  ];

  const beneficiaryGroup = [
    'Primary and secondary school students from low-income households in Zimbabwe',
    'Orphaned and vulnerable children (OVCs) without consistent parental support',
    'Students from single-parent or child-headed households',
    'Young people aged 12-25 in peri-urban and rural communities around Harare',
    'Students with demonstrated academic potential who lack financial resources'
  ];

  return (
    <div className="pt-32 pb-24 bg-cream/10">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-gold font-bold uppercase tracking-[0.3em] text-xs block mb-3">WILL-NAKS FOUNDATION</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-navy mt-4 mb-6 italic">
            Empowering Potential <br />
            <span className="text-gold">Beyond Circumstances</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            A humanitarian and educational support organisation focused on assisting less privileged students with exceptional potential across Zimbabwe.
          </p>
        </motion.div>
      </section>

      {/* Overview Block with image of community/black kids */}
      <section className="bg-cream py-20 mb-20 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative"
            >
              <img 
                src="/assets/african_children_classroom_1779718922527.png" 
                alt="Children in classroom"
                className="rounded-3xl shadow-xl border border-gold/15 w-full object-cover aspect-4/3"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 bg-navy text-white p-6 rounded-2xl shadow-lg border border-gold/20 hidden md:block max-w-[240px]">
                <p className="text-xs font-bold text-gold uppercase tracking-wider mb-1">Established</p>
                <p className="text-xl font-serif font-bold text-white">Harare, Zimbabwe</p>
                <p className="text-[10px] text-gray-400 mt-2 leading-tight">Version 1.0 official documentation platform.</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-6"
            >
              <h2 className="text-3xl font-serif font-bold text-navy">Foundation Overview</h2>
              <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
                <p>
                  <strong>WILL-NAKS FOUNDATION</strong> bridges the gap between talent and opportunity by providing educational support, mentorship, and empowerment initiatives to youth across Zimbabwe.
                </p>
                <p>
                  Founded in Harare, the foundation operates on the principle that no student should be denied their potential due to financial hardship or social disadvantage. We believe in identifying, nurturing, and elevating the next generation of leaders.
                </p>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gold/5 shadow-sm text-center">
                  <span className="block text-2xl font-bold text-navy italic font-serif">100%</span>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Non-Profit</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gold/5 shadow-sm text-center">
                  <span className="block text-2xl font-bold text-gold italic font-serif">Harare</span>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Headquarters</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-navy p-10 md:p-14 rounded-[2.5rem] text-white relative overflow-hidden group shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/15 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="bg-gold/10 p-3.5 rounded-2xl w-fit mb-6 border border-gold/20">
                <Target className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 italic text-gold">Vision Statement</h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans">
                "To create a future where no talented and determined student is denied opportunity because of financial hardship or social disadvantage."
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white p-10 md:p-14 rounded-[2.5rem] text-navy border border-gold/10 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-navy/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="bg-navy/5 p-3.5 rounded-2xl w-fit mb-6 border border-navy/10">
                <Eye className="h-6 w-6 text-navy" />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 italic text-navy">Mission Statement</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed font-sans">
                "To support underprivileged students through educational assistance, mentorship, community support, and empowerment programs — creating pathways from poverty to potential."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Program Cycle Steps */}
      <section className="bg-white py-20 mb-20 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-gold font-bold text-xs uppercase tracking-[0.25em] block mb-2">How We Deliver</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy italic">Our Program Cycle</h2>
            <p className="text-gray-500 text-xs mt-2 font-sans">A structured 4-phase program cycle designed for accountability and maximal local impact.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {programCycle.map((p, idx) => (
              <div key={p.title} className="relative p-6 bg-cream/20 rounded-2xl border border-gold/10 text-center hover:shadow-md transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-navy text-gold font-bold text-[10px] uppercase rounded-full border border-gold/10 tracking-widest font-mono">
                  {p.phase}
                </div>
                <h4 className="text-lg font-serif font-bold text-navy mt-4 mb-2">{p.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 translate-y-[-50%] text-gold font-bold text-xl z-20">
                    ➔
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve & Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-8 bg-navy p-8 md:p-10 text-white rounded-[2.5rem] shadow-lg border border-gold/10">
          <div>
            <span className="text-gold text-[10px] font-bold uppercase tracking-widest block mb-2">Our Demographics</span>
            <h3 className="text-2xl font-serif font-bold italic text-gold">Who We Serve</h3>
            <p className="text-gray-400 text-xs mt-1">Our primary beneficiaries across Harare and broader Zimbabwean rural spaces.</p>
          </div>
          <ul className="space-y-4 text-xs md:text-sm text-gray-300">
            {beneficiaryGroup.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-gold text-[10px] font-bold uppercase tracking-widest block mb-2">Our Standards</span>
            <h3 className="text-3xl font-serif font-bold italic text-navy">Our Core Values</h3>
            <p className="text-gray-400 text-xs mt-1">These principles form the baseline of every decision we make.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {coreValues.map((val) => (
              <div key={val.title} className="p-5 bg-white rounded-2xl border border-gold/5 shadow-sm">
                <h4 className="font-bold text-navy text-sm font-sans flex items-center gap-1.5 mb-1.5">
                  <span className="text-gold">⌁</span> {val.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Table */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-24">
        <div className="text-center mb-10">
          <span className="text-gold text-[10px] font-bold uppercase tracking-widest block mb-2">Organizational Chart</span>
          <h3 className="text-3xl font-serif font-bold text-navy italic">Foundation Leadership Structure</h3>
          <p className="text-gray-500 text-xs mt-1">Our dedicated team and current executive committee vacancies.</p>
        </div>

        <div className="bg-white border border-gold/10 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-navy border-b border-gold/10 text-[10px] uppercase font-bold text-gold tracking-wider">
                  <th className="p-4 pl-6">Role / Position</th>
                  <th className="p-4">Officer Name</th>
                  <th className="p-4 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-sans text-navy">
                {leadershipTeam.map((leader, i) => (
                  <tr key={leader.role} className="hover:bg-cream/10 transition-colors">
                    <td className="p-4 pl-6 font-bold">{leader.role}</td>
                    <td className="p-4 text-gray-700 font-semibold">{leader.name}</td>
                    <td className="p-4 pr-6 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        leader.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {leader.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Collapsible Documents Details (Constitution / Minutes) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gold/10 border border-gold/20 p-6 rounded-[2rem] text-center mb-6">
          <p className="text-xs font-bold text-navy uppercase tracking-widest">Official Governance Archives</p>
          <p className="text-xs text-gray-500 mt-1">Access the founding declarations, meeting resolutions, and governing framework of WILL-NAKS.</p>
        </div>

        <div className="space-y-4">
          {/* Section: Constitution */}
          <div className="bg-white border border-gold/10 rounded-2xl overflow-hidden shadow-sm">
            <button 
              onClick={() => setShowConstitution(!showConstitution)}
              className="w-full p-5 flex items-center justify-between text-left text-navy font-bold text-sm bg-navy/[0.01]"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" />
                <span>Governance Constitutional Articles (Summary)</span>
              </span>
              {showConstitution ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            <AnimatePresence>
              {showConstitution && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 pt-3 border-t border-gray-100 space-y-3 text-xs md:text-sm text-gray-600 leading-relaxed"
                >
                  <p>• The organisation shall be known as <strong className="text-navy">WILL-NAKS FOUNDATION</strong>.</p>
                  <p>• The foundation shall operate as a nonprofit humanitarian organisation with no profit distribution to individuals.</p>
                  <p>• The foundation shall support disadvantaged students and vulnerable youth across Zimbabwe.</p>
                  <p>• Leadership positions shall include Founder, CEO, Secretary, Treasurer, and Program Coordinators.</p>
                  <p>• All finances shall be managed transparently, with dual signatories on all accounts.</p>
                  <p>• Meetings shall be held quarterly unless otherwise agreed by the executive committee.</p>
                  <p>• Amendments to the constitution require a two-thirds majority vote of the executive committee.</p>
                  <p>• The foundation shall maintain proper accounting records available to all members on request.</p>
                  <p>• Dissolution of the foundation shall require unanimous consent of the founding executive committee.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section: Founding Minutes */}
          <div className="bg-white border border-gold/10 rounded-2xl overflow-hidden shadow-sm">
            <button 
              onClick={() => setShowFoundingMinutes(!showFoundingMinutes)}
              className="w-full p-5 flex items-center justify-between text-left text-navy font-bold text-sm bg-navy/[0.01]"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gold" />
                <span>Official Founding Meeting Minutes (Adopted 2025)</span>
              </span>
              {showFoundingMinutes ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            <AnimatePresence>
              {showFoundingMinutes && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-600 leading-relaxed space-y-4"
                >
                  <div className="p-3 bg-cream/10 border border-gold/10 rounded-xl mb-4 text-gray-500 font-mono text-[10px]">
                    <p><strong>Date:</strong> Year 2025 | <strong>Venue:</strong> Harare, Zimbabwe</p>
                    <p><strong>Attendees:</strong> Willie Nakunyada (Founder), Simbarashe O Manongwa (CEO), Tapiwanashe Mandiveyi (CEO), Yvone Kodzaimambo (Admin & Logistics)</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-navy mb-1.5 uppercase tracking-wider text-[10px] text-gold">Agenda Items Discussed:</h5>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Formal declaration of establishment as a non-profit humanitarian and educational organisation.</li>
                      <li>Presentation and adoption of Vision, Mission, Constitution, and Values.</li>
                      <li>Appointment and confirmation of Executive committee.</li>
                      <li>Planned Foundation Programs (School Fees Assistance, Scholarships, Mentorship, community support etc).</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-navy mb-1.5 uppercase tracking-wider text-[10px] text-green-700">Resolutions Passed:</h5>
                    <ul className="list-decimal pl-5 space-y-1">
                      <li><strong>RESOLVED:</strong> That WILL-NAKS FOUNDATION be established headquarted in Harare, Zimbabwe.</li>
                      <li><strong>RESOLVED:</strong> That the founding executive committee listed above are duly confirmed.</li>
                      <li><strong>RESOLVED:</strong> Proceed with formal registration with relevant regulatory authorities.</li>
                      <li><strong>RESOLVED:</strong> info@will-naks.org & 0775 386 704 are officially confirmed contact details.</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
