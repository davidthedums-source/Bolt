import React, { useState, useEffect } from 'react';
import { 
  X, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  PlusCircle, 
  Mail, 
  Phone,
  Edit3,
  Check,
  RefreshCw,
  SlidersHorizontal,
  Search,
  SendHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeUserTickets, 
  subscribeAllTicketsForAdmin, 
  updateTicketStatusByAdmin, 
  subscribeContactMessagesForAdmin, 
  markContactMessageStatus 
} from '../lib/firebase';
import { TicketDocument, TicketStatus, ContactMessageDocument } from '../types';
import { GmailHub } from './GmailHub';

interface UserPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackTicket: (trackingCode: string) => void;
  onOpenQuoteModal: () => void;
}

export const UserPortalModal: React.FC<UserPortalModalProps> = ({
  isOpen,
  onClose,
  onTrackTicket,
  onOpenQuoteModal
}) => {
  const { user, profile, loading: authLoading, isAdmin, login, logout, hasGmailAccess } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'tickets' | 'admin-tickets' | 'admin-messages' | 'gmail'>('tickets');
  const [userTickets, setUserTickets] = useState<TicketDocument[]>([]);
  const [adminTickets, setAdminTickets] = useState<TicketDocument[]>([]);
  const [adminMessages, setAdminMessages] = useState<ContactMessageDocument[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<TicketStatus>('in-progress');
  const [editNotes, setEditNotes] = useState('');
  const [editCost, setEditCost] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Gmail Hub prefill state
  const [gmailTicket, setGmailTicket] = useState<TicketDocument | null>(null);
  const [gmailRecipient, setGmailRecipient] = useState<string>('');
  const [gmailSubject, setGmailSubject] = useState<string>('');

  // Set default tab based on admin role
  useEffect(() => {
    if (isAdmin) {
      setActiveTab('admin-tickets');
    } else {
      setActiveTab('tickets');
    }
  }, [isAdmin]);

  // Subscribe to user tickets when logged in
  useEffect(() => {
    if (!user) {
      setUserTickets([]);
      return;
    }

    setLoadingData(true);
    const unsubscribe = subscribeUserTickets(
      user.uid,
      (data) => {
        setUserTickets(data);
        setLoadingData(false);
      },
      () => setLoadingData(false)
    );

    return () => unsubscribe();
  }, [user]);

  // Subscribe to admin data if admin
  useEffect(() => {
    if (!isAdmin) return;

    const unsubTickets = subscribeAllTicketsForAdmin((tickets) => {
      setAdminTickets(tickets);
    });

    const unsubMessages = subscribeContactMessagesForAdmin((msgs) => {
      setAdminMessages(msgs);
    });

    return () => {
      unsubTickets();
      unsubMessages();
    };
  }, [isAdmin]);

  if (!isOpen) return null;

  const handleStartEditTicket = (ticket: TicketDocument) => {
    setEditingTicketId(ticket.id);
    setEditStatus(ticket.status);
    setEditNotes(ticket.technicianNotes || '');
    setEditCost(ticket.estimatedCost || '');
  };

  const handleSaveTicketUpdate = async (ticketId: string) => {
    try {
      await updateTicketStatusByAdmin(ticketId, editStatus, editNotes, editCost);
      setEditingTicketId(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update ticket:', err);
    }
  };

  const handleUpdateMessage = async (msgId: string, status: 'unread' | 'replied' | 'archived') => {
    try {
      await markContactMessageStatus(msgId, status);
    } catch (err) {
      console.error('Failed to update message:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-blue-200 shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white relative rounded-t-3xl border-b border-blue-500/20 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-12 h-12 rounded-2xl border-2 border-blue-400 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
                  <UserIcon className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-display text-white">
                    {user ? (user.displayName || 'Valued Customer') : 'Bolt Client & Staff Portal'}
                  </h3>
                  {isAdmin && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                      Bolt Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-blue-200 mt-0.5">
                  {user ? user.email : 'Sign in to access your repair tickets, quotes, and lab status'}
                </p>
              </div>
            </div>

            {user ? (
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : null}
          </div>

              {/* Tab Navigation if Logged in */}
              {user && (
                <div className="flex items-center gap-2 mt-5 border-t border-slate-800 pt-3 overflow-x-auto pb-1">
                  <button
                    onClick={() => setActiveTab('tickets')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      activeTab === 'tickets' 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    My Service Tickets ({userTickets.length})
                  </button>

                  <button
                    onClick={() => {
                      setGmailTicket(null);
                      setGmailRecipient('');
                      setGmailSubject('');
                      setActiveTab('gmail');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'gmail'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-red-300 hover:text-white hover:bg-red-950/40 border border-red-500/20'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Gmail Communications</span>
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setActiveTab('admin-tickets')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          activeTab === 'admin-tickets' 
                            ? 'bg-amber-500 text-slate-950 font-black shadow' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        Lab Ticket Manager ({adminTickets.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('admin-messages')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          activeTab === 'admin-messages' 
                            ? 'bg-cyan-500 text-slate-950 font-black shadow' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        Contact Inquiries ({adminMessages.length})
                      </button>
                    </>
                  )}
                </div>
              )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">

          {/* Not logged in State */}
          {!user ? (
            <div className="text-center py-10 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-xl font-bold font-display text-slate-900">
                  Welcome to Bolt Computer Services
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                  Sign in with Google to automatically track all your repair jobs, receive diagnostic estimates, and view historical service invoices securely in Cloud Firestore.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={login}
                  disabled={authLoading}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all cursor-pointer"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign in with Google Account</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-400">
                <span>&bull; Real-time status sync</span>
                <span>&bull; Direct WhatsApp dispatch</span>
                <span>&bull; Zero password friction</span>
              </div>
            </div>
          ) : (
            <>
              {/* Tab 1: Customer Tickets */}
              {activeTab === 'tickets' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold font-display text-slate-900">
                        Your Repair &amp; Service Bookings
                      </h4>
                      <p className="text-xs text-slate-500">Live records connected to your Google profile</p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenQuoteModal();
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Book New Service</span>
                    </button>
                  </div>

                  {userTickets.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-700">No active repair tickets found</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Submit a quick quote or service request to have our engineers start diagnostics on your device.
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenQuoteModal();
                        }}
                        className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                      >
                        Request Quote / Repair
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userTickets.map((t) => (
                        <div
                          key={t.id}
                          className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-blue-700">
                                {t.trackingCode}
                              </span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                {t.serviceCategory}
                              </span>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                t.status === 'ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {t.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-1">
                              {t.deviceType || 'Device'}: {t.issueDescription?.slice(0, 75)}...
                            </p>
                            {t.technicianNotes && (
                              <p className="text-[11px] text-slate-500 mt-1 bg-white p-2 rounded-lg border border-slate-200/80">
                                <strong>Lab Update:</strong> {t.technicianNotes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setGmailTicket(t);
                                setGmailRecipient('boltcybercafe@gmail.com');
                                setGmailSubject(`Inquiry on Ticket [${t.trackingCode}] - ${t.deviceType || 'Device'}`);
                                setActiveTab('gmail');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Send inquiry via Gmail"
                            >
                              <Mail className="w-3.5 h-3.5 text-red-600" />
                              <span className="hidden sm:inline">Email Shop</span>
                            </button>
                            <button
                              onClick={() => {
                                onClose();
                                onTrackTicket(t.trackingCode);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>Track Live</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Admin Tickets Desk */}
              {activeTab === 'admin-tickets' && isAdmin && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold font-display text-slate-900">
                        Ikeja Engineering Diagnostic Queue
                      </h4>
                      <p className="text-xs text-slate-500">Live administrative control over all customer repairs</p>
                    </div>
                    {saveSuccess && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
                        Ticket Updated Successfully!
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {adminTickets.map((ticket) => {
                      const isEditing = editingTicketId === ticket.id;

                      return (
                        <div 
                          key={ticket.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-sm text-slate-900">
                                  {ticket.trackingCode}
                                </span>
                                <span className="text-xs font-bold text-slate-700">
                                  {ticket.customerName} ({ticket.customerPhone})
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {ticket.deviceType} &bull; {ticket.serviceCategory} &bull; Priority: {ticket.urgency}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg ${
                                ticket.status === 'ready' || ticket.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {ticket.status}
                              </span>

                              <button
                                onClick={() => isEditing ? setEditingTicketId(null) : handleStartEditTicket(ticket)}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>{isEditing ? 'Cancel' : 'Update Status'}</span>
                              </button>

                              <button
                                onClick={() => {
                                  setGmailTicket(ticket);
                                  setGmailRecipient(ticket.customerEmail || '');
                                  setGmailSubject(`Bolt Computer Services - Diagnostics & Repair Status [${ticket.trackingCode}]`);
                                  setActiveTab('gmail');
                                }}
                                className="p-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                title="Send official update via Gmail"
                              >
                                <Mail className="w-3.5 h-3.5 text-red-600" />
                                <span>Email Customer</span>
                              </button>
                            </div>
                          </div>

                          {/* Issue summary */}
                          <div className="text-xs bg-white p-2.5 rounded-xl border border-slate-200/80 text-slate-700">
                            <strong>Reported Issue:</strong> {ticket.issueDescription || 'No description'}
                          </div>

                          {/* Technician Notes display if not editing */}
                          {!isEditing && ticket.technicianNotes && (
                            <div className="text-xs text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                              <strong>Engineer Notes:</strong> {ticket.technicianNotes}
                              {ticket.estimatedCost && (
                                <span className="block mt-0.5 font-bold">Estimated Cost: {ticket.estimatedCost}</span>
                              )}
                            </div>
                          )}

                          {/* Editing Form */}
                          {isEditing && (
                            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2.5 animate-in fade-in">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Update Status</label>
                                  <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value as TicketStatus)}
                                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                                  >
                                    <option value="submitted">Submitted / Intake</option>
                                    <option value="diagnosing">Diagnosing</option>
                                    <option value="in-progress">In-Progress Repair</option>
                                    <option value="testing">Testing &amp; QA</option>
                                    <option value="ready">Ready for Pickup</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Estimated Cost (NGN)</label>
                                  <input
                                    type="text"
                                    value={editCost}
                                    onChange={(e) => setEditCost(e.target.value)}
                                    placeholder="e.g. ₦35,000"
                                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Technician Diagnostic Notes</label>
                                <textarea
                                  rows={2}
                                  value={editNotes}
                                  onChange={(e) => setEditNotes(e.target.value)}
                                  placeholder="Enter engineer benchmark or part replacement details..."
                                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                                />
                              </div>

                              <div className="flex justify-end gap-2 pt-1">
                                <button
                                  onClick={() => handleSaveTicketUpdate(ticket.id)}
                                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Save Changes</span>
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Admin Messages */}
              {activeTab === 'admin-messages' && isAdmin && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold font-display text-slate-900">
                      Contact Inquiries &amp; Messages
                    </h4>
                    <p className="text-xs text-slate-500">Submissions received via website contact section</p>
                  </div>

                  <div className="space-y-3">
                    {adminMessages.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No contact inquiries yet.</p>
                    ) : (
                      adminMessages.map((msg) => (
                        <div key={msg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-sm text-slate-900">{msg.name}</span>
                              <span className="text-xs text-slate-500 ml-2">({msg.email} &bull; {msg.phone || 'No phone'})</span>
                            </div>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              msg.status === 'replied' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'
                            }`}>
                              {msg.status}
                            </span>
                          </div>
                          {msg.subject && <p className="text-xs font-bold text-slate-700">Subject: {msg.subject}</p>}
                          <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80">
                            {msg.message}
                          </p>
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => {
                                setGmailTicket(null);
                                setGmailRecipient(msg.email);
                                setGmailSubject(`Re: ${msg.subject || 'Bolt Computer Services - Response to your inquiry'}`);
                                setActiveTab('gmail');
                              }}
                              className="text-xs font-bold text-red-600 hover:text-red-700 px-2.5 py-1 bg-red-50 hover:bg-red-100 rounded border border-red-200 flex items-center gap-1 cursor-pointer"
                            >
                              <Mail className="w-3 h-3 text-red-500" />
                              <span>Reply via Gmail</span>
                            </button>
                            <button
                              onClick={() => handleUpdateMessage(msg.id, 'replied')}
                              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 px-2 py-1 bg-emerald-50 rounded cursor-pointer"
                            >
                              Mark as Replied
                            </button>
                            <button
                              onClick={() => handleUpdateMessage(msg.id, 'archived')}
                              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1 bg-slate-200/50 rounded cursor-pointer"
                            >
                              Archive
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Gmail Communications */}
              {activeTab === 'gmail' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-red-600" />
                        <span>Google Workspace Gmail Hub</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Read workshop emails, send diagnostic estimates &amp; customer status updates directly via your Google Account
                      </p>
                    </div>
                  </div>

                  <GmailHub
                    initialRecipient={gmailRecipient}
                    initialSubject={gmailSubject}
                    preselectedTicket={gmailTicket}
                    onClose={() => setActiveTab(isAdmin ? 'admin-tickets' : 'tickets')}
                  />
                </div>
              )}

            </>
          )}

        </div>

      </div>
    </div>
  );
};
