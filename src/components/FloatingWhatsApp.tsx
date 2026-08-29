import React, { useState } from 'react';
import { MessageSquare, X, Zap } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Bolt Computer Services! I need fast computer assistance / repair inquiry.`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      
      {/* Pop-up Mini Notification Badge */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2.5 bg-slate-900 text-white text-xs font-bold py-2 px-3.5 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Chat with an Engineer on WhatsApp</span>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5"
            aria-label="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleOpenWhatsApp}
        id="floating-whatsapp-button"
        className="group flex items-center gap-2.5 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-xl shadow-emerald-600/35 hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-white/20"
        aria-label="Chat with Bolt Computer Services on WhatsApp"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6 fill-white text-white" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
          </span>
        </div>
        <span className="hidden sm:inline font-bold text-sm font-display tracking-wide">
          WhatsApp Us
        </span>
      </button>

    </div>
  );
};
