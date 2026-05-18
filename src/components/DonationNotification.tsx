import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function DonationNotification() {
  const [notification, setNotification] = useState<{ amount: number } | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel('public:donations')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'donations' },
        (payload) => {
          setNotification({ amount: payload.new.amount });
          setTimeout(() => setNotification(null), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-24 right-8 z-[100] bg-white rounded-2xl p-4 shadow-2xl border border-gold/20 flex items-center space-x-4 max-w-sm"
        >
          <div className="bg-gold p-3 rounded-xl">
            <Heart className="h-6 w-6 text-navy fill-current" />
          </div>
          <div className="flex-1">
            <p className="text-navy font-bold text-sm">New Support!</p>
            <p className="text-gray-600 text-xs">Someone just donated <span className="text-gold font-bold">${notification.amount}</span></p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-navy transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
