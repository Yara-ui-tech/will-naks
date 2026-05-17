import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhatsAppButton() {
  const phoneNumber = '263775386704'; // Zimbabwe number from user
  const message = 'Hello WILL-NAKS Foundation, I would like to learn more about your programs.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
      title="Chat on WhatsApp"
    >
      <div className="absolute right-full mr-4 bg-white text-[#001F3F] px-4 py-2 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat with us
      </div>
      <MessageCircle className="h-7 w-7" />
    </motion.a>
  );
}
