import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  Zap, 
  AlertCircle,
  Laptop,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';
import { createServiceTicket, submitContactMessage } from '../lib/firebase';
import { TicketDocument } from '../types';

interface ContactSectionProps {
  initialService?: string;
  onTrackTicket?: (code: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService, onTrackTicket }) => {
  const [formType, setFormType] = useState<'quote' | 'message'>('quote');
  
  // Message Form State
  const [messageForm, setMessageForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [messageSubmitted, setMessageSubmitted] = useState(false);

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    deviceType: 'Laptop (Windows / Mac)',
    serviceType: initialService || 'Computer Repairs & Screen',
    issueDetails: '',
    urgency: 'standard' as 'standard' | 'express' | 'urgent'
  });
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<TicketDocument | null>(null);
  const [copied, setCopied] = useState(false);

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.name || !messageForm.message) {
      return;
    }
    setIsSubmittingMessage(true);
    try {
      await submitContactMessage({
        name: messageForm.name,
        email: messageForm.email || 'customer@direct.inquiry',
        phone: messageForm.phone || undefined,
        subject: messageForm.subject || 'Direct Contact Inquiry',
        message: messageForm.message
      });
      setMessageSubmitted(true);
    } catch (err) {
      console.error('Failed to submit message to Firebase:', err);
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.phone || !quoteForm.issueDetails) {
      return;
    }
    setIsSubmittingQuote(true);
    try {
      const ticket = await createServiceTicket({
        customerName: quoteForm.name,
        customerPhone: quoteForm.phone,
        customerEmail: quoteForm.email || undefined,
        deviceType: quoteForm.deviceType,
        serviceCategory: quoteForm.serviceType,
        issueDescription: quoteForm.issueDetails,
        urgency: quoteForm.urgency
      });
      setCreatedTicket(ticket);
    } catch (err) {
      console.error('Failed to submit quote ticket to Firebase:', err);
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const handleCopyCode = () => {
    if (createdTicket) {
      navigator.clipboard.writeText(createdTicket.trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Bolt Computer Services! I would like to get a quote and speak with an engineer about my computer.`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${text}`, '_blank');
  };

  const handleWhatsAppWithTicket = () => {
    if (!createdTicket) return;
    const text = encodeURIComponent(
      `Hello Bolt Computer Services! I just submitted quote/repair ticket *${createdTicket.trackingCode}* for my ${createdTicket.deviceType}.`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <section 
      id="contact" 
      className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-cyan-950"
    >
      {/* Background Grids & Electric Cyan Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(#06b6d4 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider uppercase font-display">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>CLOUD CONNECTED SERVICE &amp; SUPPORT</span>
          </div>

          <h2 
            id="contact-headline"
            className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white"
          >
            LET&apos;S TALK{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400">
              TECH.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed">
            Have a dead machine, looking for a speed upgrade, or need dependable corporate IT support? We are ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards & Location */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick WhatsApp Hero Button */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  Instant Response
                </span>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <h3 className="text-xl font-bold font-display text-white">Chat on WhatsApp</h3>
              <p className="text-xs text-slate-300">
                Send photos or videos of your device error screen for an immediate pre-assessment.
              </p>
              <button
                onClick={handleOpenDirectWhatsApp}
                id="btn-whatsapp-chat"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Open WhatsApp Direct Chat ({COMPANY_INFO.whatsappDisplay})</span>
              </button>
            </div>

            {/* Contact Details List */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
              
              {/* Phone */}
              <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Lines</p>
                  <a href={`tel:${COMPANY_INFO.phone}`} className="text-sm font-bold text-white hover:text-cyan-400 transition-colors block">
                    {COMPANY_INFO.phone}
                  </a>
                  <a href={`tel:${COMPANY_INFO.phoneAlt}`} className="text-xs text-slate-400 hover:text-cyan-400 transition-colors block">
                    {COMPANY_INFO.phoneAlt} (Alternative Line)
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Inquiries</p>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-sm font-bold text-white hover:text-cyan-400 transition-colors block">
                    {COMPANY_INFO.email}
                  </a>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Official Inquiries &amp; Technical Support Desk
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Physical Workshop &amp; Store</p>
                  <p className="text-sm font-medium text-white">
                    {COMPANY_INFO.address}
                  </p>
                  <p className="text-xs text-cyan-400 font-semibold mt-0.5">
                    Landmark: Directly opposite Slot Plaza, Otigba Computer Village
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Operating Hours</p>
                  <p className="text-sm font-medium text-white">{COMPANY_INFO.workingHours}</p>
                  <p className="text-xs text-slate-400">{COMPANY_INFO.weekendHours}</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Form (Quote vs Message) */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-cyan-500/30 p-6 sm:p-8 shadow-2xl relative">
            
            {/* Form Toggle Tabs */}
            <div className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setFormType('quote')}
                className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  formType === 'quote'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Request a Service Quote
              </button>
              <button
                onClick={() => setFormType('message')}
                className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  formType === 'message'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Send General Message
              </button>
            </div>

            {/* Quote Form */}
            {formType === 'quote' ? (
              <div>
                {createdTicket ? (
                  <div className="p-8 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 text-center space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="w-14 h-14 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold font-display text-white">Quote Request Logged!</h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto">
                      Your service request has been recorded in our Firestore database.
                    </p>

                    <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 max-w-sm mx-auto space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Your Reference Code</span>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-black font-mono text-cyan-400 tracking-wider">
                          {createdTicket.trackingCode}
                        </span>
                        <button
                          onClick={handleCopyCode}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        onClick={handleWhatsAppWithTicket}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4 fill-white" />
                        <span>WhatsApp Engineer</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setCreatedTicket(null);
                        setQuoteForm({
                          name: '',
                          phone: '',
                          email: '',
                          deviceType: 'Laptop (Windows / Mac)',
                          serviceType: 'Computer Repairs & Screen',
                          issueDetails: '',
                          urgency: 'standard'
                        });
                      }}
                      className="text-xs text-slate-400 hover:text-white underline pt-2 block mx-auto"
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Your Full Name <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={quoteForm.name}
                          onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                          placeholder="e.g. Chukwudi Okafor"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Phone / WhatsApp Number <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          placeholder="e.g. 0813 925 9220"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Device Type
                        </label>
                        <select
                          value={quoteForm.deviceType}
                          onChange={(e) => setQuoteForm({ ...quoteForm, deviceType: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                        >
                          <option value="Laptop (Windows / Dell / HP / Lenovo)">Laptop (Windows / Dell / HP / Lenovo)</option>
                          <option value="Apple MacBook (Air / Pro / M-Series)">Apple MacBook (Air / Pro / M-Series)</option>
                          <option value="Desktop PC / Custom Workstation">Desktop PC / Custom Workstation</option>
                          <option value="Office Network / Server Setup">Office Network / Server Setup</option>
                          <option value="Accessories / RAM / SSD Upgrade">Accessories / RAM / SSD Upgrade</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Primary Service
                        </label>
                        <select
                          value={quoteForm.serviceType}
                          onChange={(e) => setQuoteForm({ ...quoteForm, serviceType: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                        >
                          <option value="Computer Repairs">Computer Repairs &amp; Logic Board</option>
                          <option value="Laptop Screen Replacement">Laptop Screen Replacement</option>
                          <option value="Hardware SSD/RAM Upgrade">Hardware SSD / RAM Upgrade</option>
                          <option value="Thermal Servicing & Overheating">Thermal Servicing &amp; Overheating</option>
                          <option value="Liquid Spill Ultrasonic Rework">Liquid Spill Ultrasonic Rework</option>
                          <option value="Enterprise IT Support">Enterprise IT Support</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Describe the Fault / Device Model <span className="text-cyan-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={quoteForm.issueDetails}
                        onChange={(e) => setQuoteForm({ ...quoteForm, issueDetails: e.target.value })}
                        placeholder="e.g. HP EliteBook 840 G5 won't power on after power surge, charging light flashes orange..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Logged instantly into Firestore</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingQuote}
                        id="btn-submit-quote"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                      >
                        <span>{isSubmittingQuote ? 'Submitting...' : 'Submit Quote Request'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div>
                {messageSubmitted ? (
                  <div className="p-8 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 text-center space-y-4 animate-in fade-in duration-300">
                    <div className="w-14 h-14 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold font-display text-white">Message Sent Successfully!</h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto">
                      Our customer service desk has received your message and will reply shortly.
                    </p>
                    <button
                      onClick={() => {
                        setMessageSubmitted(false);
                        setMessageForm({ name: '', phone: '', email: '', subject: '', message: '' });
                      }}
                      className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleMessageSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Your Name <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={messageForm.name}
                          onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={messageForm.phone}
                          onChange={(e) => setMessageForm({ ...messageForm, phone: e.target.value })}
                          placeholder="0803 000 0000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={messageForm.email}
                        onChange={(e) => setMessageForm({ ...messageForm, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Your Message <span className="text-cyan-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={messageForm.message}
                        onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                        placeholder="How can Bolt Computer Services assist you?"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingMessage}
                      className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmittingMessage ? 'Sending...' : 'Send Direct Message'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
