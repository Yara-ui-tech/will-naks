import { useState } from 'react';
import { MessageCircle, Users, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '263775386704'; // Zimbabwe number from user
  const message = 'Hello WILL-NAKS Foundation, I would like to learn more about your programs.';
  const directChatUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const channelUrl = 'https://whatsapp.com/channel/0029VbCsKgO4NVicfQ7ZCB3W';

  const platforms = [
    {
      name: 'WhatsApp Channel',
      icon: <Users className="h-5 w-5" />,
      url: channelUrl,
      description: 'Official updates & news',
      color: 'bg-[#25D366]'
    },
    {
      name: 'Direct Assistance',
      icon: <MessageSquare className="h-5 w-5" />,
      url: directChatUrl,
      description: 'Chat with our team',
      color: 'bg-navy'
    }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-72 bg-white rounded-3xl shadow-2xl border border-gold/10 overflow-hidden mb-4"
          >
            <div className="bg-navy p-6 text-white">
              <h3 className="font-serif font-bold text-xl italic mb-1">WhatsApp <span className="text-gold">Connect</span></h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Choose a platform</p>
            </div>
            <div className="p-4 space-y-3">
              {platforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-cream transition-colors group"
                >
                  <div className={`${platform.color} p-3 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-sm">{platform.name}</h4>
                    <p className="text-xs text-gray-500">{platform.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`${isOpen ? 'bg-gold text-navy' : 'bg-[#25D366] text-white'} p-5 rounded-full shadow-2xl flex items-center justify-center transition-colors relative`}
        title="Contact us on WhatsApp"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-7 w-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="h-7 w-7" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-white text-navy px-4 py-2 rounded-xl text-sm font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gold/10">
            Connect with us
          </span>
        )}
      </motion.button>
    </div>
  );
}
