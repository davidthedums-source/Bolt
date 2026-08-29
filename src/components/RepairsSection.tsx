import React, { useState } from 'react';
import { 
  Search, 
  Wrench, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Laptop, 
  ShieldCheck, 
  Flame, 
  Droplet, 
  HardDrive, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { REPAIR_PROCESS } from '../data/mockData';

interface RepairsSectionProps {
  onOpenQuoteModal: (issue?: string) => void;
  onOpenTrackerModal?: () => void;
}

export const RepairsSection: React.FC<RepairsSectionProps> = ({ onOpenQuoteModal, onOpenTrackerModal }) => {
  const [selectedIssue, setSelectedIssue] = useState<string>('no-power');

  const commonIssues = [
    {
      id: 'no-power',
      label: 'No Power / Dead Board',
      icon: <Flame className="w-4 h-4 text-emerald-400" />,
      tag: 'Chip-Level Rework',
      diagnosis: 'Charging IC, shorted capacitor on 19V/12V main power rail, or blown MOSFET.',
      solution: 'Precision micro-soldering, IC replacement, voltage rail stabilization.',
      timeEstimate: '24 - 48 Hours',
      warranty: '90-Day Warranty'
    },
    {
      id: 'cracked-screen',
      label: 'Cracked / Flickering Display',
      icon: <Laptop className="w-4 h-4 text-emerald-400" />,
      tag: 'Display Replacement',
      diagnosis: 'Damaged LCD/OLED matrix, cracked glass, or damaged eDP display ribbon cable.',
      solution: 'Installation of brand-new OEM IPS/OLED panel with calibrated color gamut.',
      timeEstimate: 'Same-Day (2 - 4 Hours)',
      warranty: '90-Day Replacement Warranty'
    },
    {
      id: 'liquid-damage',
      label: 'Liquid Spill Recovery',
      icon: <Droplet className="w-4 h-4 text-emerald-400" />,
      tag: 'Ultrasonic Lab Wash',
      diagnosis: 'Corrosion under BGA chips, galvanic oxidation on copper traces.',
      solution: 'Immediate ultrasonic chemical board bath, trace rebuilding, corroded pad repair.',
      timeEstimate: '24 - 72 Hours',
      warranty: '60-Day Warranty'
    },
    {
      id: 'overheating',
      label: 'Overheating & Loud Fan',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      tag: 'Thermal Overhaul',
      diagnosis: 'Dried factory thermal paste, clogged copper heatsink fins, failed bearing.',
      solution: 'Deep ultrasonic fan clean, premium high-conductivity thermal paste repasting.',
      timeEstimate: '1 - 2 Hours (While you wait)',
      warranty: 'Thermal Performance Guarantee'
    },
    {
      id: 'slow-system',
      label: 'Slow Boot / Freezing',
      icon: <HardDrive className="w-4 h-4 text-emerald-400" />,
      tag: 'Storage & RAM Upgrade',
      diagnosis: 'Aging mechanical HDD bad sectors, insufficient memory, fragmented OS.',
      solution: 'Cloning system to high-speed PCIe NVMe SSD + RAM expansion with 0% data loss.',
      timeEstimate: '1 - 2 Hours',
      warranty: '3-Year SSD Hardware Warranty'
    }
  ];

  const activeIssueData = commonIssues.find(i => i.id === selectedIssue) || commonIssues[0];

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return <Search className="w-6 h-6 text-emerald-400" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-emerald-400" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6 text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-emerald-400" />;
      default:
        return <Wrench className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <section 
      id="repairs" 
      className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-emerald-950"
    >
      {/* Background Tech Grids & Emerald Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(#10b981 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase font-display">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>BOLT REPAIR LAB &bull; CHIP-LEVEL PRECISION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
            WE BRING YOUR TECH{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">
              BACK TO LIFE.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed">
            No guessing, no shortcuts. Our Ikeja repair laboratory uses microscope-guided micro-soldering, genuine replacement parts, and thorough stress-testing.
          </p>
        </div>

        {/* 4-Step Process Cards with Photo Headers */}
        <div className="relative mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {REPAIR_PROCESS.map((step) => (
              <div
                key={step.stepNumber}
                id={`repair-step-${step.stepNumber}`}
                className="bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-emerald-500/50 shadow-lg hover:shadow-emerald-900/20 transition-all duration-300 group flex flex-col justify-between transform hover:-translate-y-1 overflow-hidden"
              >
                <div>
                  {/* Step Photo Header */}
                  {step.image && (
                    <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                      <img 
                        src={step.image} 
                        alt={`${step.title} at Bolt Computer Services`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                      
                      {/* Floating Step Number & Icon */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-slate-900/80 backdrop-blur-md border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                          {getStepIcon(step.icon)}
                        </div>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="text-xl font-black font-display text-emerald-400 bg-slate-950/70 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                          {step.stepNumber}
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-3 right-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 inline-block">
                          {step.tag}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-5 sm:p-6 space-y-2.5">
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-emerald-300 transition-colors">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Details Callout */}
                <div className="p-5 sm:p-6 pt-0">
                  <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                    {step.details}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dedicated Dual Lab Showcase: Motherboard Diagnostic & Hardware Testing */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Motherboard Diagnostic Lab */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 rounded-3xl border border-emerald-500/30 overflow-hidden shadow-xl flex flex-col md:flex-row">
            <div className="md:w-1/2 relative h-56 md:h-auto min-h-[220px]">
              <img 
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" 
                alt="Motherboard Diagnostic Lab at Bolt Computer Services"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-slate-900/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                Laboratory Diagnostic
              </div>
            </div>
            <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Cpu className="w-4 h-4" />
                  <span>Micro-Level Probing</span>
                </div>
                <h4 className="text-lg font-bold font-display text-white">
                  Motherboard Diagnostic
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  High-magnification microscope inspection, oscilloscope power wave analysis, 19V rail short-detection, and BIOS logic reprogramming.
                </p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Thermal camera hot-spot detection</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Charging IC &amp; MOSFET replacement</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onOpenQuoteModal('Motherboard Diagnostic & Repair')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Book Motherboard Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Hardware Testing & Stress Benchmark */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 rounded-3xl border border-teal-500/30 overflow-hidden shadow-xl flex flex-col md:flex-row">
            <div className="md:w-1/2 relative h-56 md:h-auto min-h-[220px]">
              <img 
                src="https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80" 
                alt="Hardware Testing & Stress Benchmark at Bolt Computer Services"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-slate-900/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-teal-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                Stress Audit Rig
              </div>
            </div>
            <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Activity className="w-4 h-4" />
                  <span>360° Hardware Validation</span>
                </div>
                <h4 className="text-lg font-bold font-display text-white">
                  Hardware Testing
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  Complete component stability verification using MemTest86 RAM validation, FurMark GPU rendering, and thermal load profiling.
                </p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>100% CPU/GPU peak stress test</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Battery cycle &amp; power draw stability</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onOpenQuoteModal('Hardware Testing & Diagnostic Audit')}
                className="w-full py-2.5 px-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Request Hardware Testing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Interactive Diagnostics Symptom Checker Box */}
        <div className="bg-slate-900/90 border border-emerald-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Issue Buttons */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  Interactive Diagnosis Helper
                </span>
                <h4 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                  What is happening with your computer?
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Select a common hardware symptom below to see the verified Bolt diagnosis protocol:
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {commonIssues.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl text-left text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      selectedIssue === issue.id
                        ? 'bg-emerald-950 border border-emerald-500/70 text-white shadow-md shadow-emerald-950'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedIssue === issue.id ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                        {issue.icon}
                      </div>
                      <span>{issue.label}</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-emerald-300 font-mono text-[11px]">
                      {issue.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Active Issue Insight Card */}
            <div className="lg:col-span-6 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-emerald-500/30 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Recommended Bolt Action
                </span>
                <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  {activeIssueData.timeEstimate}
                </span>
              </div>

              <h4 className="text-xl font-bold font-display text-white">
                {activeIssueData.label}
              </h4>

              <div className="space-y-3 text-sm">
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Root Cause Diagnosis</p>
                  <p className="text-slate-200 font-medium">{activeIssueData.diagnosis}</p>
                </div>

                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Bolt Lab Solution</p>
                  <p className="text-slate-200 font-medium">{activeIssueData.solution}</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => onOpenQuoteModal(`Repair: ${activeIssueData.label}`)}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-colors cursor-pointer"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Book Inspection for This Fault</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{activeIssueData.warranty}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Live Tracking Banner Callout */}
        {onOpenTrackerModal && (
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold font-display text-white">
                  Already have a device in our Ikeja repair laboratory?
                </h4>
                <p className="text-xs text-slate-300">
                  Enter your tracking code (e.g. BCS-892401) to check real-time workbench status, component testing, and invoice.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenTrackerModal}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shrink-0 transition-colors shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Launch Live Diagnostic Tracker</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

