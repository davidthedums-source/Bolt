import React from 'react';
import { 
  Zap, 
  ArrowRight, 
  PhoneCall, 
  ShieldCheck, 
  Cpu, 
  Wrench, 
  CheckCircle, 
  Sparkles,
  Laptop,
  HardDrive
} from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

interface HeroSectionProps {
  onOpenQuoteModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenQuoteModal }) => {
  return (
    <section 
      id="home" 
      className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-blue-100/60"
    >
      {/* Subtle background tech grid patterns & glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-cyan-400/15 blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#2563eb 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-100/80 border border-blue-200/90 text-blue-900 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold tracking-wide uppercase font-display">
                BOLT COMPUTER SERVICES &bull; NIGERIA
              </span>
            </div>

            {/* Main Headline */}
            <h1 
              id="hero-headline"
              className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-900 leading-[1.08]"
            >
              SMART TECH.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600">
                REAL SOLUTIONS.
              </span>
            </h1>

            {/* Supporting Text */}
            <p 
              id="hero-supporting-text"
              className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Computer services, repairs, upgrades and technology solutions built around your needs.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-get-started-button"
                onClick={onOpenQuoteModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <a
                id="hero-contact-us-button"
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-300 rounded-xl shadow-sm transition-all duration-200"
              >
                <PhoneCall className="w-4 h-4 text-blue-600" />
                <span>Contact Us</span>
              </a>
            </div>

            {/* Trust highlights checklist */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700">Same-Day Turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700">90-Day Warranty</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700">100% Genuine Parts</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual with Subtle Floating Animations */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Outer decorative glow frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 rounded-3xl opacity-20 blur-xl animate-pulse-glow" />
              
              {/* Main Visual Image Card */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-blue-200 shadow-2xl shadow-blue-900/20">
                <img 
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80" 
                  alt="Precision Computer Hardware Engineering and Repair at Bolt Computer Services"
                  className="w-full h-[380px] sm:h-[440px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Image Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Bottom caption overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Advanced Diagnostic Lab</p>
                      <p className="text-[11px] text-slate-300">Ikeja Computer Village Hub</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active
                  </span>
                </div>
              </div>

              {/* Floating Badge 1: Top Right */}
              <div className="absolute -top-5 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-blue-100 shadow-lg shadow-blue-900/10 flex items-center gap-3 animate-float">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Fast Turnaround</p>
                  <p className="text-[11px] font-medium text-slate-500">Same-Day Diagnostic</p>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left */}
              <div className="absolute -bottom-6 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-blue-100 shadow-lg shadow-blue-900/10 flex items-center gap-3 animate-float-delayed">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Certified Warranty</p>
                  <p className="text-[11px] font-medium text-slate-500">90-Day Parts & Labor</p>
                </div>
              </div>

              {/* Floating Badge 3: Middle Right floating badge */}
              <div className="hidden sm:flex absolute top-1/2 -right-8 bg-slate-900/90 text-white backdrop-blur-md py-2 px-3 rounded-lg border border-slate-700 shadow-md items-center gap-2 animate-float-slow">
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-bold tracking-wide">Component-Level Rework</span>
              </div>

            </div>
          </div>

        </div>

        {/* Quick Services Bar below hero */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-6">
            Core Technology Specializations
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3 hover:border-blue-300 transition-colors">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Laptop & PC Repair</h4>
                <p className="text-xs text-slate-500">Board & Screen Rework</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3 hover:border-blue-300 transition-colors">
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">NVMe & RAM Upgrades</h4>
                <p className="text-xs text-slate-500">Immediate Speed Boosts</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3 hover:border-blue-300 transition-colors">
              <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Custom Workstations</h4>
                <p className="text-xs text-slate-500">Design & Rendering PCs</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3 hover:border-blue-300 transition-colors">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Corporate IT Support</h4>
                <p className="text-xs text-slate-500">Office Networks & SLAs</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
