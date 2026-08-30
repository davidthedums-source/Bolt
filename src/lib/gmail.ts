import { getAccessToken, auth } from './firebase';
import { GmailMessageSummary, GmailMessageDetail, GmailSendPayload } from '../types';

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

/**
 * Encodes string to URL-safe Base64 as required by Gmail API RFC 2822 formatting
 */
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Builds standard RFC 2822 email format
 */
function buildRawEmail(payload: GmailSendPayload, senderEmail: string): string {
  const fromHeader = `Bolt Computer Services <${senderEmail}>`;
  const subjectHeader = payload.subject;
  const toHeader = payload.to;
  const ccHeader = payload.cc ? `Cc: ${payload.cc}\r\n` : '';

  let emailContent = `From: ${fromHeader}\r\n` +
    `To: ${toHeader}\r\n` +
    ccHeader +
    `Subject: ${subjectHeader}\r\n` +
    `MIME-Version: 1.0\r\n`;

  if (payload.htmlContent) {
    emailContent += `Content-Type: text/html; charset="UTF-8"\r\n\r\n` + payload.htmlContent;
  } else {
    emailContent += `Content-Type: text/plain; charset="UTF-8"\r\n\r\n` + payload.bodyText;
  }

  return base64UrlEncode(emailContent);
}

/**
 * Fetch recent Gmail messages (with optional search query like 'Bolt' or customer email)
 */
export async function listGmailMessages(
  query: string = '',
  maxResults: number = 15
): Promise<GmailMessageSummary[]> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Gmail authentication required. Please sign in with Google.');
  }

  const url = new URL(`${GMAIL_API_BASE}/messages`);
  url.searchParams.append('maxResults', maxResults.toString());
  if (query) {
    url.searchParams.append('q', query);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gmail API Error (${response.status})`);
  }

  const data = await response.json();
  if (!data.messages || !Array.isArray(data.messages)) {
    return [];
  }

  // Fetch individual message details in parallel
  const messagePromises = data.messages.slice(0, maxResults).map(async (msgRef: { id: string; threadId: string }) => {
    try {
      const msgRes = await fetch(`${GMAIL_API_BASE}/messages/${msgRef.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date&metadataHeaders=To`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!msgRes.ok) return null;
      const msgData = await msgRes.json();

      const headers = msgData.payload?.headers || [];
      const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

      const fromRaw = getHeader('From');
      let fromName = fromRaw;
      let fromEmail = fromRaw;
      const emailMatch = fromRaw.match(/<([^>]+)>/);
      if (emailMatch) {
        fromEmail = emailMatch[1];
        fromName = fromRaw.replace(/<[^>]+>/, '').trim().replace(/^["']|["']$/g, '');
      }

      return {
        id: msgData.id,
        threadId: msgData.threadId,
        snippet: msgData.snippet || '',
        sender: fromRaw,
        fromName: fromName || fromEmail,
        fromEmail,
        subject: getHeader('Subject') || '(No Subject)',
        date: getHeader('Date') || new Date().toISOString(),
        isUnread: msgData.labelIds?.includes('UNREAD') || false,
        labelIds: msgData.labelIds || [],
      } as GmailMessageSummary;
    } catch {
      return null;
    }
  });

  const resolved = await Promise.all(messagePromises);
  return resolved.filter((m): m is GmailMessageSummary => m !== null);
}

/**
 * Fetch full message details including body content
 */
export async function getGmailMessageDetails(messageId: string): Promise<GmailMessageDetail> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Gmail authentication required. Please sign in with Google.');
  }

  const response = await fetch(`${GMAIL_API_BASE}/messages/${messageId}?format=full`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to fetch message ${messageId}`);
  }

  const msgData = await response.json();
  const headers = msgData.payload?.headers || [];
  const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  const fromRaw = getHeader('From');
  let fromName = fromRaw;
  let fromEmail = fromRaw;
  const emailMatch = fromRaw.match(/<([^>]+)>/);
  if (emailMatch) {
    fromEmail = emailMatch[1];
    fromName = fromRaw.replace(/<[^>]+>/, '').trim().replace(/^["']|["']$/g, '');
  }

  let body = '';
  let htmlBody = '';

  const extractBody = (part: any) => {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      body += decodeBase64Url(part.body.data);
    } else if (part.mimeType === 'text/html' && part.body?.data) {
      htmlBody += decodeBase64Url(part.body.data);
    }
    if (part.parts && Array.isArray(part.parts)) {
      part.parts.forEach(extractBody);
    }
  };

  if (msgData.payload) {
    extractBody(msgData.payload);
  }

  if (!body && msgData.snippet) {
    body = msgData.snippet;
  }

  return {
    id: msgData.id,
    threadId: msgData.threadId,
    snippet: msgData.snippet || '',
    sender: fromRaw,
    fromName: fromName || fromEmail,
    fromEmail,
    to: getHeader('To'),
    subject: getHeader('Subject') || '(No Subject)',
    date: getHeader('Date') || new Date().toISOString(),
    isUnread: msgData.labelIds?.includes('UNREAD') || false,
    labelIds: msgData.labelIds || [],
    body: body || 'No text content available',
    htmlBody: htmlBody || undefined,
  };
}

function decodeBase64Url(data: string): string {
  try {
    const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(escape(atob(base64)));
  } catch {
    try {
      const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
      return atob(base64);
    } catch {
      return '';
    }
  }
}

/**
 * Send an email directly via Gmail API
 */
export async function sendGmailEmail(payload: GmailSendPayload): Promise<{ id: string; threadId: string }> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Gmail authentication required. Please sign in with Google.');
  }

  const senderEmail = auth.currentUser?.email || 'me';
  const rawEmail = buildRawEmail(payload, senderEmail);

  const response = await fetch(`${GMAIL_API_BASE}/messages/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawEmail }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to send email via Gmail (${response.status})`);
  }

  return response.json();
}

/**
 * Create a draft in Gmail
 */
export async function createGmailDraft(payload: GmailSendPayload): Promise<{ id: string }> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Gmail authentication required. Please sign in with Google.');
  }

  const senderEmail = auth.currentUser?.email || 'me';
  const rawEmail = buildRawEmail(payload, senderEmail);

  const response = await fetch(`${GMAIL_API_BASE}/drafts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: { raw: rawEmail } }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to create draft in Gmail (${response.status})`);
  }

  return response.json();
}

/**
 * Pre-formatted email templates for Bolt Computer Services
 */
export const GMAIL_TEMPLATES = [
  {
    id: 'diag-quote',
    name: 'Diagnostic & Quote Estimate',
    subject: 'Bolt Computer Services - Diagnostic Report & Quotation [Tracking: {CODE}]',
    generateBody: (params: { customerName?: string; device?: string; code?: string; estimate?: string; notes?: string }) => `Dear ${params.customerName || 'Valued Customer'},

Thank you for choosing Bolt Computer Services. Our engineering lab has concluded the comprehensive hardware diagnostic for your ${params.device || 'device'}.

SERVICE SUMMARY:
• Tracking Code: ${params.code || 'N/A'}
• Diagnostic Findings: ${params.notes || 'Hardware diagnosis completed.'}
• Estimated Total Cost: ${params.estimate || 'To be confirmed'}
• Warranty Period: 90-Day Comprehensive Warranty

Please reply to this email or contact our support team at +234 813 925 9220 to approve this estimate so our technicians can proceed immediately with component repair.

Best regards,
Bolt Computer Services Engineering Team
Shop 52, Ogba Multi-Purpose Shopping Complex, Lagos, Nigeria
Phone: +234 813 925 9220 | Email: boltcybercafe@gmail.com`
  },
  {
    id: 'repair-ready',
    name: 'Repair Complete & Ready for Pickup',
    subject: 'Ready for Pickup: Your {DEVICE} is Repaired & Tested [Tracking: {CODE}]',
    generateBody: (params: { customerName?: string; device?: string; code?: string }) => `Dear ${params.customerName || 'Valued Customer'},

Great news! Your ${params.device || 'device'} (Tracking Code: ${params.code || 'N/A'}) has completed all repair stages and passed our 360° hardware stress tests.

YOUR DEVICE IS READY FOR PICKUP:
• Location: Shop 52, Ogba Multi-Purpose Shopping Complex, Lagos
• Workshop Hours: Monday - Saturday: 8:00 AM - 6:30 PM
• What to bring: Your tracking code or invoice copy

If you opted for delivery, our dispatcher will contact you shortly to coordinate the drop-off.

Thank you for trusting Bolt Computer Services!

Best regards,
Bolt Computer Services Technical Desk
Phone: +234 813 925 9220`
  },
  {
    id: 'hardware-test-pass',
    name: 'Hardware Testing & Stress Audit Passed',
    subject: 'Bolt Computer Services - 360° Hardware Test Stability Certificate',
    generateBody: (params: { customerName?: string; device?: string; code?: string }) => `Dear ${params.customerName || 'Valued Customer'},

This is to confirm that your ${params.device || 'system'} has successfully passed all benchmark and stress audits at Bolt Computer Services.

AUDIT SPECIFICATIONS:
• MemTest86 RAM Stability: 100% Passed (0 Errors)
• CPU / GPU Thermal Profiling: Optimal Temperature Range Verified
• Power & Battery Rail Check: Regulated & Surge Protected
• 90-Day Component Warranty: Active

Feel free to reach out if you have any questions.

Warm regards,
Bolt Computer Services Laboratory
Email: boltcybercafe@gmail.com | WhatsApp: +234 813 925 9220`
  },
  {
    id: 'general-followup',
    name: 'General Customer Support Follow-up',
    subject: 'Bolt Computer Services - Response to Your Technical Inquiry',
    generateBody: (params: { customerName?: string }) => `Dear ${params.customerName || 'Customer'},

Thank you for reaching out to Bolt Computer Services. We have received your inquiry and our senior computer technicians are available to assist you.

How can we best support your hardware repair, software configuration, or workstation procurement needs today?

You can reply directly to this email or chat with us on WhatsApp at +234 813 925 9220.

Sincerely,
Customer Support Team
Bolt Computer Services, Lagos, Nigeria`
  }
];
