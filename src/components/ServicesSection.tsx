import React, { useState } from 'react';
import { 
  Wrench, 
  Laptop, 
  Cpu, 
  Terminal, 
  Zap, 
  Network, 
  Headphones, 
  ArrowRight, 
  Check, 
  Sparkles,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { SERVICES_DATA } from '../data/mockData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
  onOpenQuoteModal: (category?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  onSelectService, 
  onOpenQuoteModal 
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'repair' | 'hardware' | 'support' | 'sales'>('all');

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-purple-600" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-purple-600" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-purple-600" />;
      case 'Terminal':
        return <Terminal className="w-6 h-6 text-purple-600" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-purple-600" />;
      case 'Network':
        return <Network className="w-6 h-6 text-purple-600" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-purple-600" />;
      default:
        return <Wrench className="w-6 h-6 text-purple-600" />;
    }
  };

  const filteredServices = activeFilter === 'all' 
    ? SERVICES_DATA 
    : SERVICES_DATA.filter(s => s.category === activeFilter);

  return (
    <section 
      id="services" 
      className="py-24 bg-gradient-to-b from-white via-purple-50/40 to-white relative border-b border-purple-100"
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-purple-300/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold tracking-wider uppercase font-display">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>BOLT SERVICES &bull; EXPERT HARDWARE &amp; IT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 tracking-tight">
            ENGINEERED FOR{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600">
              RELIABILITY &amp; SPEED
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            From precision logic board repairs and high-speed SSD upgrades to full enterprise IT maintenance, we provide dedicated support for every tech requirement.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { label: 'All Services', value: 'all' },
              { label: 'Repairs & Screens', value: 'repair' },
              { label: 'Hardware & Upgrades', value: 'hardware' },
              { label: 'Software & IT Support', value: 'support' },
              { label: 'Accessories', value: 'sales' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
                  activeFilter === tab.value
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-700 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Subtle top color highlight */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Icon Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-xl bg-purple-50 group-hover:bg-purple-600 border border-purple-100 group-hover:border-purple-600 flex items-center justify-center transition-all duration-300 text-purple-600 group-hover:text-white shadow-xs">
                    {getServiceIcon(service.icon)}
                  </div>
                  
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100/80">
                    {service.turnaroundTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-display text-slate-900 group-hover:text-purple-700 transition-colors mb-2.5">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-slate-600 text-sm leading-relaxed mb-5 font-normal">
                  {service.description}
                </p>

                {/* Bullet Points */}
                <div className="space-y-2 mb-6 pt-2 border-t border-slate-100">
                  {service.keyFeatures.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectService(service)}
                  id={`btn-learn-more-${service.id}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-700 hover:text-purple-900 group/btn transition-colors cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onOpenQuoteModal(service.title)}
                  className="px-3 py-1.5 text-xs font-bold bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Get Quote
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Banner Callout */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-800">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-black font-display">Need a Specialized Enterprise IT SLA or Multi-Device Maintenance?</h4>
            <p className="text-sm text-purple-200">We manage office computing setups, networks, and periodic servicing for companies in Lagos.</p>
          </div>
          <button
            onClick={() => onOpenQuoteModal('Enterprise IT Support')}
            className="shrink-0 px-6 py-3 rounded-xl bg-white hover:bg-purple-50 text-purple-950 font-bold text-sm shadow-md transition-all duration-150 cursor-pointer"
          >
            Inquire for Enterprise SLA
          </button>
        </div>

      </div>
    </section>
  );
};
