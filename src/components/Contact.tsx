import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <div className="py-24 bg-cream relative overflow-hidden rounded-[4rem] mx-4 sm:mx-8 shadow-2xl border border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4 font-sans">Get in Touch</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-navy mb-8 leading-tight">We’d Love to Hear <br /> <span className="text-gold italic font-medium">Your Vision</span></h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md italic">
              "Whether you want to partner with us, volunteer, or simply learn more about our mission, our team is here to connect."
            </p>

            <div className="space-y-8">
              <div className="flex items-center space-x-6 group">
                <div className="bg-navy p-5 rounded-2xl shadow-xl group-hover:bg-gold transition-colors duration-500">
                  <Mail className="h-6 w-6 text-gold group-hover:text-navy transition-colors duration-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                  <p className="text-xl font-bold text-navy">info@will-naks.org</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 group">
                <div className="bg-navy p-5 rounded-2xl shadow-xl group-hover:bg-gold transition-colors duration-500">
                  <Phone className="h-6 w-6 text-gold group-hover:text-navy transition-colors duration-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                  <p className="text-xl font-bold text-navy">+263 77 123 4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 group">
                <div className="bg-navy p-5 rounded-2xl shadow-xl group-hover:bg-gold transition-colors duration-500">
                  <MapPin className="h-6 w-6 text-gold group-hover:text-navy transition-colors duration-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Visit Us</p>
                  <p className="text-xl font-bold text-navy text-balance">42 Innovation Hub, Harare, Zimbabwe</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gold/10 shadow-xl"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                <select className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all appearance-none cursor-pointer">
                  <option>Partnership Inquiry</option>
                  <option>Scholarship Application</option>
                  <option>Volunteer Opportunity</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                <textarea rows={4} className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all"></textarea>
              </div>
              <button className="w-full py-5 bg-navy text-white rounded-xl font-bold text-lg flex items-center justify-center hover:bg-navy/90 transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-navy/20">
                Send Message <Send className="ml-3 h-5 w-5 text-gold" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] -z-0"></div>
    </div>
  );
}
