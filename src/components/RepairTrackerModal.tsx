import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  ShieldAlert, 
  CheckCheck, 
  Laptop, 
  Copy, 
  Check, 
  MessageSquare, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { getTicketByTrackingCode } from '../lib/firebase';
import { TicketDocument, TicketStatus } from '../types';
import { COMPANY_INFO } from '../data/mockData';

interface RepairTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrackingCode?: string;
  onOpenQuoteModal?: () => void;
}

const STATUS_STEPS: { key: TicketStatus; label: string; description: string; icon: any }[] = [
  { key: 'submitted', label: 'Ticket Received', description: 'Intake logged in Ikeja lab system', icon: Clock },
  { key: 'diagnosing', label: 'Hardware Diagnostic', description: 'Engineers inspecting board & components', icon: Search },
  { key: 'in-progress', label: 'Repair & Sourcing', description: 'Soldering, part replacement, or OS setup', icon: Wrench },
  { key: 'testing', label: 'QA & Thermal Testing', description: 'Benchmarking stability and performance', icon: Sparkles },
  { key: 'ready', label: 'Ready for Pickup', description: 'Completed and ready at Otigba St. Ikeja', icon: CheckCheck }
];

export const RepairTrackerModal: React.FC<RepairTrackerModalProps> = ({
  isOpen,
  onClose,
  initialTrackingCode = '',
  onOpenQuoteModal
}) => {
  const [searchCode, setSearchCode] = useState(initialTrackingCode);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<TicketDocument | null>(null);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialTrackingCode) {
      setSearchCode(initialTrackingCode);
      handleSearch(initialTrackingCode);
    }
  }, [initialTrackingCode]);

  if (!isOpen) return null;

  const handleSearch = async (codeToSearch?: string) => {
    const targetCode = (codeToSearch || searchCode).trim();
    if (!targetCode) return;

    setLoading(true);
    setErrorMsg(null);
    setSearched(true);

    try {
      const result = await getTicketByTrackingCode(targetCode);
      setTicket(result);
      if (!result) {
        setErrorMsg(`No active repair ticket found matching tracking code "${targetCode}". Please verify your ticket code or contact our Ikeja service desk.`);
      }
    } catch (err) {
      console.error('Error searching ticket:', err);
      setErrorMsg('An error occurred while connecting to the database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStepIndex = (status: TicketStatus): number => {
    switch (status) {
      case 'submitted': return 0;
      case 'diagnosing': return 1;
      case 'in-progress': return 2;
      case 'testing': return 3;
      case 'ready':
      case 'completed': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = ticket ? getStepIndex(ticket.status) : 0;

  const handleChatEngineer = () => {
    if (!ticket) return;
    const text = encodeURIComponent(
      `Hello Bolt Computer Services! I am inquiring about my Repair Ticket *${ticket.trackingCode}* (${ticket.deviceType || 'Device'} - ${ticket.serviceCategory}). Status is currently: ${ticket.status.toUpperCase()}.`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-200 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white relative rounded-t-3xl border-b border-emerald-500/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Cloud Firestore Diagnostics Tracker
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
            Track Your Computer Repair
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time status updates directly from our hardware engineering lab in Computer Village, Ikeja.
          </p>

          {/* Search Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="mt-5 flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                placeholder="Enter Ticket ID (e.g. BCS-892401)"
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchCode.trim()}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
            >
              {loading ? 'Searching...' : 'Track Ticket'}
            </button>
          </form>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Error / Not Found */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold">Ticket Not Found</p>
                <p className="text-xs text-amber-800 mt-0.5">{errorMsg}</p>
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={() => {
                      setSearchCode('BCS-SAMPLE');
                      setTicket({
                        id: 'bcs-sample',
                        trackingCode: 'BCS-782194',
                        customerName: 'Adebayo Adeleke',
                        customerPhone: '0803 555 1290',
                        customerEmail: 'adebayo@example.com',
                        deviceType: 'Apple MacBook Pro M1 14"',
                        deviceModel: 'MacBook Pro A2442',
                        serviceCategory: 'Logic Board Micro-Soldering & Display Cable',
                        issueDescription: 'Laptop screen flickering and random kernel panics after liquid splash.',
                        urgency: 'express',
                        status: 'in-progress',
                        technicianNotes: 'Ultrasound board cleaning completed. Replaced power management IC U8100. Benchmarking display ribbon voltage.',
                        estimatedCost: '₦45,000 - ₦60,000',
                        createdAt: new Date().toISOString()
                      });
                      setErrorMsg(null);
                    }}
                    className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg"
                  >
                    View Sample Live Ticket Demo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State before search */}
          {!ticket && !errorMsg && !loading && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
                <Laptop className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 font-display text-lg">Looking for your Repair Status?</h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                  Enter the tracking code provided when you submitted your quote request or dropped your machine at our Computer Village service centre.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setTicket({
                      id: 'bcs-sample',
                      trackingCode: 'BCS-782194',
                      customerName: 'Adebayo Adeleke',
                      customerPhone: '0803 555 1290',
                      customerEmail: 'adebayo@example.com',
                      deviceType: 'Apple MacBook Pro M1 14"',
                      deviceModel: 'MacBook Pro A2442',
                      serviceCategory: 'Logic Board Micro-Soldering & Display Cable',
                      issueDescription: 'Laptop screen flickering and random kernel panics after liquid splash.',
                      urgency: 'express',
                      status: 'in-progress',
                      technicianNotes: 'Ultrasound board cleaning completed. Replaced power management IC U8100. Benchmarking display ribbon voltage.',
                      estimatedCost: '₦45,000 - ₦60,000',
                      createdAt: new Date().toISOString()
                    });
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-200 transition-colors"
                >
                  Load Sample Live Ticket
                </button>
              </div>
            </div>
          )}

          {/* Live Ticket Details */}
          {ticket && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Ticket Top Info Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking Code</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">
                      {ticket.urgency} Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black font-mono text-slate-900 tracking-wider">
                      {ticket.trackingCode}
                    </span>
                    <button
                      onClick={() => handleCopyCode(ticket.trackingCode)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                      title="Copy Tracking Code"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Customer: <strong>{ticket.customerName}</strong> &bull; {ticket.deviceType || 'Computer System'}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-slate-500 uppercase block">Current Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm uppercase tracking-wide mt-1 ${
                    ticket.status === 'ready' || ticket.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : ticket.status === 'in-progress' || ticket.status === 'diagnosing'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    <span className="h-2 w-2 rounded-full bg-current animate-ping" />
                    {ticket.status}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Diagnostic &amp; Repair Workflow
                </h4>
                <div className="space-y-4">
                  {STATUS_STEPS.map((step, idx) => {
                    const isPassed = currentStepIdx >= idx;
                    const isCurrent = currentStepIdx === idx;
                    const StepIcon = step.icon;

                    return (
                      <div 
                        key={step.key} 
                        className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all ${
                          isCurrent 
                            ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                            : isPassed 
                            ? 'bg-slate-50 border-slate-200' 
                            : 'bg-white border-dashed border-slate-200 opacity-50'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                            : isPassed
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {isPassed && !isCurrent ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <StepIcon className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-bold ${isCurrent ? 'text-emerald-950 font-display' : 'text-slate-800'}`}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-600 text-white rounded-full">
                                Active Step
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technician Diagnostic Notes */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
                    <Wrench className="w-3.5 h-3.5" />
                    Bolt Lab Diagnostic Notes
                  </span>
                  <span className="text-slate-400 font-mono">Otigba St. Ikeja Lab</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {ticket.technicianNotes || 'Device in intake queue. Bench diagnostic report will appear here shortly.'}
                </p>
                {ticket.estimatedCost && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Estimated Cost Range:</span>
                    <span className="text-sm font-bold font-mono text-yellow-400">{ticket.estimatedCost}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold"
                >
                  Close Tracker
                </button>

                <button
                  onClick={handleChatEngineer}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>WhatsApp Lead Engineer</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
