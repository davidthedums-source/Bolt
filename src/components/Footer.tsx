import React from 'react';
import { 
  Zap, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  ArrowUp,
  Clock
} from 'lucide-react';
import { COMPANY_INFO, SERVICES_DATA } from '../data/mockData';

interface FooterProps {
  onOpenQuoteModal: (service?: string) => void;
  onOpenTrackerModal?: () => void;
  onOpenPortalModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenQuoteModal,
  onOpenTrackerModal,
  onOpenPortalModal
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 relative z-10">
      
      {/* Top Banner Ticker */}
      <div className="border-b border-slate-850 bg-slate-900/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Workshop Open Today &bull; Walk-ins Welcome in Ikeja</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              {COMPANY_INFO.workingHours}
            </span>
            <a 
              href={`tel:${COMPANY_INFO.phone}`}
              className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              {COMPANY_INFO.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-yellow-300 shadow-md">
                <Zap className="w-5 h-5 fill-yellow-300 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-xl font-display text-white tracking-tight">
                  BOLT
                </span>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Computer Services
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Professional computer services, component-level repairs, performance upgrades and corporate technology infrastructure built around your needs in Nigeria.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Certified ESD-Protected Repair Station &bull; 90-Day Warranty</span>
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {SERVICES_DATA.map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => onOpenQuoteModal(service.title)}
                    className="hover:text-cyan-400 transition-colors text-left cursor-pointer"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Services</a></li>
              <li><a href="#repairs" className="hover:text-emerald-400 transition-colors">Repair Process</a></li>
              <li><a href="#products" className="hover:text-orange-400 transition-colors">Hardware Store</a></li>
              <li><a href="#why-bolt" className="hover:text-blue-400 transition-colors">Why Choose Bolt</a></li>
              <li><a href="#about" className="hover:text-rose-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contact &amp; Location</a></li>
              {onOpenTrackerModal && (
                <li>
                  <button 
                    onClick={onOpenTrackerModal} 
                    className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer text-left"
                  >
                    &bull; Track Live Repair
                  </button>
                </li>
              )}
              {onOpenPortalModal && (
                <li>
                  <button 
                    onClick={onOpenPortalModal} 
                    className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer text-left"
                  >
                    &bull; Client &amp; Staff Portal
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Location & Direct Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              Ikeja Location
            </h4>
            
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-cyan-400">{COMPANY_INFO.phone}</a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-cyan-400">{COMPANY_INFO.email}</a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${COMPANY_INFO.whatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-bold"
                >
                  WhatsApp: {COMPANY_INFO.whatsappDisplay}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} BOLT COMPUTER SERVICES. All Rights Reserved.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Lagos, Nigeria</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              aria-label="Scroll to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
