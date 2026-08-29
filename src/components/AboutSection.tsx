import React from 'react';
import { 
  Sparkles, 
  Target, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Cpu,
  Layers
} from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

interface AboutSectionProps {
  onOpenQuoteModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenQuoteModal }) => {
  return (
    <section 
      id="about" 
      className="py-24 bg-gradient-to-b from-white via-rose-50/30 to-white border-b border-rose-100 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-rose-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-orange-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-950 text-xs font-bold tracking-wider uppercase font-display">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>ABOUT BOLT COMPUTER SERVICES</span>
          </div>

          <h2 
            id="about-headline"
            className="text-3xl sm:text-5xl font-black font-display tracking-tight text-slate-900"
          >
            TECH MADE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-600 to-amber-600">
              SIMPLE.
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            We bridge the gap between complex hardware engineering and straightforward, dependable computer services for individuals and growing businesses across Nigeria.
          </p>
        </div>

        {/* Editorial Layout: Visuals + Modular Content Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Editorial Image Composition */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              
              {/* Image 1: Main Workshop Precision */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-rose-200 col-span-2 sm:col-span-1 h-56 sm:h-64 bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80" 
                  alt="Motherboard diagnostic and hardware testing"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white pointer-events-none">
                  <p className="text-xs font-bold">ESD-Safe Lab</p>
                  <p className="text-[10px] text-slate-200">Micro-soldering Workstation</p>
                </div>
              </div>

              {/* Image 2: Professional Setup */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-rose-200 col-span-2 sm:col-span-1 h-56 sm:h-64 bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                  alt="Bolt Computer Services customer advisory and testing team"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white pointer-events-none">
                  <p className="text-xs font-bold">Customer Care</p>
                  <p className="text-[10px] text-slate-200">Direct Engineer Consultation</p>
                </div>
              </div>

            </div>

            {/* Location Pill Banner */}
            <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Headquarters &amp; Service Hub</h4>
                  <p className="text-[11px] text-slate-500">{COMPANY_INFO.address}</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 hidden sm:inline-block">
                Open Mon - Sat
              </span>
            </div>

          </div>

          {/* Right: Short Powerful Editorial Pillars */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Pillar 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-rose-300 transition-colors">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Honest Diagnostics First
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                We believe trust is built on transparency. Before turning a single screw or replacing a chip, we provide an honest breakdown of the problem, realistic repair prospects, and the most cost-effective path forward.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-rose-300 transition-colors">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Precision Engineering Over Guesswork
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                Rather than casually condemning expensive logic boards, our lab performs component-level microscopic rework — replacing faulty ICs, MOSFETs, and diodes to save clients significant capital.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-rose-300 transition-colors">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Guaranteed Authentic Hardware
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                Nigeria's tech market is flooded with substandard clone components. Bolt works exclusively with verified supply channels for OEM batteries, genuine NVMe SSDs, and certified power adapters.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={onOpenQuoteModal}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Speak with an Engineer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
