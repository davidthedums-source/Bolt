import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Zap, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  ArrowRight,
  Sparkles,
  Cpu,
  Laptop,
  Copy,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { ServiceItem, ProductItem, TicketDocument } from '../types';
import { COMPANY_INFO } from '../data/mockData';
import { createServiceTicket } from '../lib/firebase';

// --- Service Detail Modal ---
interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookService: (serviceTitle: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookService
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-200 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 p-6 text-white relative rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Verified Bolt Service</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black font-display">{service.title}</h3>
          <p className="text-sm text-purple-100 mt-1">{service.description}</p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Estimated Turnaround</p>
                <p className="text-sm font-bold text-slate-900">{service.turnaroundTime}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Protection</p>
                <p className="text-sm font-bold text-slate-900">{service.warranty}</p>
              </div>
            </div>
          </div>

          {/* Full Details */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Service Scope &amp; Lab Methodology
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {service.fullDetails}
            </p>
          </div>

          {/* What is Included Checklist */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              What Is Included
            </h4>
            <div className="space-y-2.5">
              {service.keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookService(service.title);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>Book / Inquire for this Service</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Product Detail Modal ---
interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onEnquire: (product: ProductItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEnquire
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-orange-200 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Close */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-6 sm:p-7 text-white relative rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-white/20 text-white backdrop-blur-xs">
              {product.condition}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-black/20 text-orange-100">
              {product.brand}
            </span>
            {product.badge && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-950 text-white">
                {product.badge}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">{product.name}</h3>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Ideal For Callout */}
          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
            <span><strong>Recommended for:</strong> {product.idealFor}</span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Overview</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Full Specifications */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Detailed Specifications
            </h4>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
              {product.specs.map((spec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-medium text-slate-800">
                  <Check className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Availability notice */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              100% Tested at Ikeja Computer Village Lab
            </span>
            <span>Warranty Included</span>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEnquire(product);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Enquire Availability &amp; Price</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Quick Quote Modal ---
interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillService?: string;
  onTrackTicket?: (code: string) => void;
}

export const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({
  isOpen,
  onClose,
  prefillService,
  onTrackTicket
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    device: 'Laptop',
    service: prefillService || 'General Repair & Diagnostics',
    description: '',
    urgency: 'standard' as 'standard' | 'express' | 'urgent'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<TicketDocument | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const ticket = await createServiceTicket({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || undefined,
        deviceType: formData.device,
        serviceCategory: formData.service,
        issueDescription: formData.description,
        urgency: formData.urgency
      });
      setCreatedTicket(ticket);
    } catch (err) {
      console.error('Failed to create ticket:', err);
      setError('Unable to save ticket to database. Please try again or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (createdTicket) {
      navigator.clipboard.writeText(createdTicket.trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppTicket = () => {
    if (!createdTicket) return;
    const text = encodeURIComponent(
      `Hello Bolt Computer Services! I just submitted quote/repair ticket *${createdTicket.trackingCode}* for my ${createdTicket.deviceType} (${createdTicket.serviceCategory}).`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${text}`, '_blank');
  };

  const handleResetAndClose = () => {
    setCreatedTicket(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      device: 'Laptop',
      service: 'General Repair & Diagnostics',
      description: '',
      urgency: 'standard'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full border border-blue-200 shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              BOLT COMPUTER SERVICES &bull; CLOUD INTAKE DESK
            </span>
          </div>
          <h3 className="text-2xl font-black font-display">Request Fast Tech Quote</h3>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Fill in your device details for a fast turnaround evaluation from our technicians.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {createdTicket ? (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-2xl font-black font-display text-slate-900">
                  Service Ticket Created!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Your ticket has been logged into our Ikeja hardware laboratory queue in Firestore.
                </p>
              </div>

              {/* Tracking Code Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Your Live Tracking Code
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-black font-mono tracking-widest text-emerald-400">
                    {createdTicket.trackingCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy Code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Use this code anytime to monitor real-time diagnostic progress.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {onTrackTicket && (
                  <button
                    onClick={() => {
                      const code = createdTicket.trackingCode;
                      handleResetAndClose();
                      onTrackTicket(code);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    <span>Track Live Status Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleWhatsAppTicket}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>WhatsApp Lead Engineer</span>
                </button>
              </div>

              <button
                onClick={handleResetAndClose}
                className="text-xs text-slate-500 hover:text-slate-700 pt-2 block mx-auto underline"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0813 925 9220"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Device Type</label>
                  <select
                    value={formData.device}
                    onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Laptop (Dell/HP/Lenovo/Asus)">Laptop (Dell/HP/Lenovo/Asus)</option>
                    <option value="Apple MacBook Pro / Air">Apple MacBook Pro / Air</option>
                    <option value="Desktop Tower / Workstation">Desktop Tower / Workstation</option>
                    <option value="All-in-One PC (iMac/HP/Dell)">All-in-One PC (iMac/HP/Dell)</option>
                    <option value="Hardware Parts / RAM / SSD Upgrade">Hardware Parts / RAM / SSD Upgrade</option>
                    <option value="Enterprise / Office IT Network">Enterprise / Office IT Network</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Category</label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    placeholder="e.g. Screen Replacement, Motherboard Repair"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standard">Standard (24 - 48h Turnaround)</option>
                    <option value="express">Express Same-Day Diagnostic</option>
                    <option value="urgent">Urgent Walk-in Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Describe Fault / Symptoms *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Screen is black, laptop won't power on after power surge, battery draining fast, or need 1TB NVMe SSD installed..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>{isSubmitting ? 'Logging Ticket...' : 'Submit & Generate Ticket'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

