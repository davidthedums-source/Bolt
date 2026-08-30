import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  RefreshCw, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Clock, 
  ArrowRight, 
  FileEdit, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Inbox,
  SendHorizontal,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  listGmailMessages, 
  getGmailMessageDetails, 
  sendGmailEmail, 
  createGmailDraft, 
  GMAIL_TEMPLATES 
} from '../lib/gmail';
import { GmailMessageSummary, GmailMessageDetail, TicketDocument } from '../types';

interface GmailHubProps {
  initialRecipient?: string;
  initialSubject?: string;
  initialBody?: string;
  preselectedTicket?: TicketDocument | null;
  onClose?: () => void;
}

export const GmailHub: React.FC<GmailHubProps> = ({
  initialRecipient = '',
  initialSubject = '',
  initialBody = '',
  preselectedTicket = null,
  onClose
}) => {
  const { user, login, hasGmailAccess } = useAuth();

  const [activeView, setActiveView] = useState<'inbox' | 'compose'>('inbox');
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Compose State
  const [toEmail, setToEmail] = useState(initialRecipient);
  const [subject, setSubject] = useState(initialSubject);
  const [bodyText, setBodyText] = useState(initialBody);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Confirmation Modal state for Workspace API safety
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);

  // If initial props are passed, switch to compose mode
  useEffect(() => {
    if (initialRecipient || initialSubject || initialBody || preselectedTicket) {
      setActiveView('compose');
      if (initialRecipient) setToEmail(initialRecipient);
      if (initialSubject) setSubject(initialSubject);
      if (initialBody) setBodyText(initialBody);

      if (preselectedTicket) {
        if (preselectedTicket.customerEmail) {
          setToEmail(preselectedTicket.customerEmail);
        }
        setSubject(`Bolt Computer Services - Repair Update for ${preselectedTicket.deviceType || 'Device'} [${preselectedTicket.trackingCode}]`);
        setBodyText(`Dear ${preselectedTicket.customerName},\n\nThis is an update from Bolt Computer Services regarding your ${preselectedTicket.deviceType || 'device'} (Tracking: ${preselectedTicket.trackingCode}).\n\nCurrent Status: ${preselectedTicket.status.toUpperCase()}\nTechnician Notes: ${preselectedTicket.technicianNotes || 'Diagnostic in progress.'}\n\nEstimated Cost: ${preselectedTicket.estimatedCost || 'N/A'}\n\nPlease let us know if you have any questions.\n\nBest regards,\nBolt Computer Services Desk\nPhone: +234 813 925 9220`);
      }
    }
  }, [initialRecipient, initialSubject, initialBody, preselectedTicket]);

  const loadMessages = async (query = searchQuery) => {
    if (!hasGmailAccess) return;
    setLoadingMessages(true);
    setStatusMessage(null);
    try {
      const list = await listGmailMessages(query, 12);
      setMessages(list);
    } catch (err: any) {
      console.error('Failed to load Gmail messages:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Unable to fetch Gmail messages. Please sign in with Google.' });
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (hasGmailAccess && activeView === 'inbox') {
      loadMessages();
    }
  }, [hasGmailAccess, activeView]);

  const handleSelectMessage = async (msgSummary: GmailMessageSummary) => {
    setLoadingDetail(true);
    try {
      const detail = await getGmailMessageDetails(msgSummary.id);
      setSelectedMessage(detail);
    } catch (err: any) {
      console.error('Failed to get message details:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const applyTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = GMAIL_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const params = {
      customerName: preselectedTicket?.customerName || '',
      device: preselectedTicket?.deviceType || 'Device',
      code: preselectedTicket?.trackingCode || 'BCS-XXXXXX',
      estimate: preselectedTicket?.estimatedCost || '₦0.00',
      notes: preselectedTicket?.technicianNotes || 'Completed multi-point hardware diagnostic test.'
    };

    setSubject(template.subject.replace('{CODE}', params.code).replace('{DEVICE}', params.device));
    setBodyText(template.generateBody(params));
  };

  const handleSendPrompt = () => {
    if (!toEmail.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid recipient email address.' });
      return;
    }
    if (!subject.trim()) {
      setStatusMessage({ type: 'error', text: 'Please specify an email subject.' });
      return;
    }
    if (!bodyText.trim()) {
      setStatusMessage({ type: 'error', text: 'Email body cannot be empty.' });
      return;
    }
    setStatusMessage(null);
    setConfirmSendOpen(true);
  };

  const executeSendEmail = async () => {
    setConfirmSendOpen(false);
    setIsSending(true);
    setStatusMessage(null);
    try {
      await sendGmailEmail({
        to: toEmail.trim(),
        subject: subject.trim(),
        bodyText: bodyText.trim(),
      });

      setStatusMessage({ 
        type: 'success', 
        text: `Email successfully sent to ${toEmail} via your connected Gmail account.` 
      });

      // Clear form
      setToEmail('');
      setSubject('');
      setBodyText('');
      setSelectedTemplate('');
      setTimeout(() => {
        setActiveView('inbox');
        loadMessages();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to send email:', err);
      setStatusMessage({ 
        type: 'error', 
        text: err.message || 'Failed to dispatch email via Gmail API.' 
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!toEmail.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide a recipient email to create a draft.' });
      return;
    }
    setIsSending(true);
    try {
      await createGmailDraft({
        to: toEmail.trim(),
        subject: subject.trim() || '(Draft Subject)',
        bodyText: bodyText.trim(),
      });
      setStatusMessage({ type: 'success', text: 'Draft saved directly into your Gmail account.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save draft in Gmail.' });
    } finally {
      setIsSending(false);
    }
  };

  if (!hasGmailAccess) {
    return (
      <div className="p-8 text-center bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold font-display text-white mb-2">
          Connect Gmail with Bolt Computer Services
        </h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
          Sign in with your Google Account to read customer repair inquiries, dispatch itemized diagnostic estimates, and send status notifications directly from Gmail.
        </p>

        <button
          onClick={login}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg transition-all cursor-pointer transform hover:scale-102"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span>Connect Google Account &amp; Gmail</span>
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Requires user authorization. Authenticated with official Google Workspace scopes.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold font-display text-white text-base">
                Gmail Communication Hub
              </h3>
              <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Sending from: <span className="text-slate-200 font-mono">{user?.email}</span>
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveView('inbox')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'inbox'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inbox / Threads</span>
          </button>
          <button
            onClick={() => setActiveView('compose')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'compose'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>Compose Email</span>
          </button>
        </div>
      </div>

      {/* Status Notice */}
      {statusMessage && (
        <div className={`p-3 text-xs flex items-center gap-2 border-b ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' 
            : 'bg-rose-950/80 text-rose-300 border-rose-800'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span className="flex-1">{statusMessage.text}</span>
          <button 
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Body */}
      {activeView === 'inbox' ? (
        <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-4">
          {/* Search bar & Refresh */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Gmail messages (e.g. customer name, 'repair', tracking code)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadMessages(searchQuery)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              onClick={() => loadMessages(searchQuery)}
              disabled={loadingMessages}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="Refresh messages"
            >
              <RefreshCw className={`w-4 h-4 ${loadingMessages ? 'animate-spin text-red-400' : ''}`} />
            </button>
          </div>

          {/* Messages List & Detail Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[300px]">
            {/* Messages List Column */}
            <div className={`${selectedMessage ? 'hidden md:block md:col-span-5' : 'col-span-12'} space-y-2 max-h-[420px] overflow-y-auto pr-1`}>
              {loadingMessages ? (
                <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
                  <span>Loading recent Gmail messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="font-semibold text-slate-300">No matching emails found</p>
                  <p className="mt-1">Try clearing your search query or send a new update.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      selectedMessage?.id === msg.id
                        ? 'bg-red-950/40 border-red-500/80 shadow-md'
                        : msg.isUnread
                        ? 'bg-slate-800/90 border-slate-700 hover:border-slate-600'
                        : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-xs truncate font-medium ${msg.isUnread ? 'font-bold text-white' : 'text-slate-300'}`}>
                        {msg.fromName || msg.fromEmail}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(msg.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 truncate mb-1">
                      {msg.subject}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {msg.snippet}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Selected Message Detail Column */}
            {selectedMessage && (
              <div className="col-span-12 md:col-span-7 bg-slate-950 rounded-xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between max-h-[420px] overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">{selectedMessage.subject}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        From: <span className="text-slate-300 font-medium">{selectedMessage.sender}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white md:hidden"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto font-sans pr-1">
                    {selectedMessage.body}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      setToEmail(selectedMessage.fromEmail);
                      setSubject(`Re: ${selectedMessage.subject.replace(/^Re:\s*/i, '')}`);
                      setBodyText(`\n\n--- On ${new Date(selectedMessage.date).toLocaleString()}, ${selectedMessage.sender} wrote:\n> ${selectedMessage.snippet}`);
                      setActiveView('compose');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply to Email</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Compose View */
        <div className="p-4 sm:p-6 space-y-4">
          {/* Quick Template Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Pre-Filled Bolt Computer Service Templates</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GMAIL_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => applyTemplate(tmpl.id)}
                  type="button"
                  className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? 'bg-red-950/60 border-red-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <p className="font-bold truncate text-[11px]">{tmpl.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">Auto-fills format</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Recipient Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="customer@example.com"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Service diagnostic quotation / repair update"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Email Content <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={7}
              required
              placeholder="Type your official customer email update or pick a template above..."
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-sans leading-relaxed"
            />
          </div>

          {/* Actions & Destructive Confirmation Trigger */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSending}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Save as Gmail Draft</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setToEmail('');
                  setSubject('');
                  setBodyText('');
                  setSelectedTemplate('');
                }}
                className="px-3 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleSendPrompt}
                disabled={isSending}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-red-900/30 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Send via Gmail</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for Destructive / Mutating Email Send */}
      {confirmSendOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 rounded-2xl border border-red-500/40 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base font-display">
                  Confirm Gmail Dispatch
                </h4>
                <p className="text-xs text-slate-400">Google Workspace Email Action</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 text-slate-300">
              <p><strong className="text-white">Sender:</strong> {user?.email}</p>
              <p><strong className="text-white">Recipient:</strong> {toEmail}</p>
              <p><strong className="text-white">Subject:</strong> {subject}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to send this email on behalf of your connected Google account? This operation directly delivers the message to the recipient's inbox.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmSendOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeSendEmail}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm &amp; Send Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
