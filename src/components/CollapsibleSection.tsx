import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Lock } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  id?: string;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ 
  title, 
  subtitle, 
  children, 
  id, 
  defaultOpen = false 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div id={id} className="border-b border-gold/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-16 flex flex-col items-center justify-center hover:bg-cream transition-colors group cursor-pointer relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.02] transition-colors duration-500"></div>
        <span className="text-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-4 font-sans relative z-10">{subtitle}</span>
        <div className="flex items-center gap-6 relative z-10">
           {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-300 group-hover:text-gold transition-colors duration-300" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-300 group-hover:text-gold transition-colors duration-300" />
          )}
          <h2 className="text-3xl md:text-5xl font-bold text-navy group-hover:text-gold transition-colors duration-300 font-serif lowercase italic">
            {title}
          </h2>
          {!isOpen && (
            <div className="bg-navy/[0.03] px-3 py-1 rounded-full flex items-center gap-2 border border-navy/5 shadow-inner">
               <Lock className="h-3 w-3 text-gold" />
               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Explore Section</span>
            </div>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-24">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
