import React from 'react';
import { 
  Clock, 
  ShieldCheck, 
  Award, 
  HeartHandshake, 
  Check, 
  Zap, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { WHY_BOLT_FEATURES } from '../data/mockData';

export const WhyBoltSection: React.FC = () => {
  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'ClockCheck':
      case 'Clock':
        return <Clock className="w-7 h-7 text-blue-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-7 h-7 text-purple-600" />;
      case 'Award':
        return <Award className="w-7 h-7 text-emerald-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-7 h-7 text-orange-600" />;
      default:
        return <Zap className="w-7 h-7 text-blue-600" />;
    }
  };

  return (
    <section 
      id="why-bolt" 
      className="py-24 bg-white border-b border-slate-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold tracking-wider uppercase font-display">
            <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            <span>THE BOLT ADVANTAGE</span>
          </div>

          <h2 
            id="why-bolt-headline"
            className="text-3xl sm:text-5xl font-black font-display tracking-tight text-slate-900"
          >
            WHY CHOOSE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              BOLT?
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            In a fast-paced environment where downtime costs real money, we deliver honest diagnoses, certified engineering, and guaranteed turnaround times.
          </p>
        </div>

        {/* 4 Colorful Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {WHY_BOLT_FEATURES.map((feat) => (
            <div
              key={feat.id}
              id={`why-card-${feat.id}`}
              className="rounded-2xl border border-slate-200/90 hover:border-slate-300 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1 relative bg-white overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${feat.colorScheme.badge}`} />

              <div>
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-2xl ${feat.colorScheme.bg} border ${feat.colorScheme.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  {getFeatureIcon(feat.icon)}
                </div>

                {/* Subtitle tag */}
                <span className={`text-[11px] font-extrabold uppercase tracking-wider ${feat.colorScheme.text}`}>
                  {feat.tagline}
                </span>

                {/* Title */}
                <h3 className="text-2xl font-bold font-display text-slate-900 mt-1 mb-3">
                  {feat.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {feat.description}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                {feat.bulletPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Core Ethics Promise Bar */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">100% Upfront Diagnostic Transparency</p>
              <p className="text-xs text-slate-500">No hidden fees, no unauthorized part swaps, and no unexpected charges.</p>
            </div>
          </div>
          <div className="text-xs font-extrabold text-blue-700 bg-blue-100/80 px-4 py-2 rounded-xl">
            Certified ESD-Protected Repair Lab
          </div>
        </div>

      </div>
    </section>
  );
};
