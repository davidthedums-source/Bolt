export interface ServiceItem {
  id: string;
  title: string;
  category: 'repair' | 'support' | 'hardware' | 'sales';
  icon: string;
  description: string;
  fullDetails: string;
  turnaroundTime: string;
  warranty: string;
  keyFeatures: string[];
  color: string;
}

export interface RepairStep {
  stepNumber: string;
  title: string;
  tag: string;
  description: string;
  details: string;
  icon: string;
  accentColor: string;
  image?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'laptops' | 'desktops' | 'storage-ram' | 'accessories' | 'monitors';
  brand: string;
  condition: 'Brand New' | 'Certified Refurbished';
  priceDisplay: string;
  specs: string[];
  image: string;
  badge?: string;
  description: string;
  inStock: boolean;
  idealFor: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
  bulletPoints: string[];
}

export interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  deviceType: string;
  serviceCategory: string;
  issueDescription: string;
  urgency: 'Standard (1-2 Days)' | 'Express Same-Day' | 'Urgent Diagnostics';
}

export type TicketStatus = 'submitted' | 'diagnosing' | 'in-progress' | 'testing' | 'ready' | 'completed' | 'cancelled';

export interface TicketDocument {
  id: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deviceType?: string;
  deviceModel?: string;
  serviceCategory: string;
  issueDescription?: string;
  urgency: 'standard' | 'express' | 'urgent';
  status: TicketStatus;
  technicianNotes?: string;
  estimatedCost?: string;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessageDocument {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'replied' | 'archived';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt?: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet: string;
  sender: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  date: string;
  isUnread: boolean;
  labelIds?: string[];
}

export interface GmailMessageDetail extends GmailMessageSummary {
  to: string;
  body: string;
  htmlBody?: string;
}

export interface GmailSendPayload {
  to: string;
  subject: string;
  bodyText: string;
  htmlContent?: string;
  cc?: string;
}
