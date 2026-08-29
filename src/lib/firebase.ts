import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  getDocFromServer,
  updateDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { TicketDocument, ContactMessageDocument, UserProfile, TicketStatus } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with Database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://mail.google.com/');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.compose');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.modify');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.labels');

// In-memory access token cache for Gmail & Google Workspace APIs
let cachedAccessToken: string | null = null;

export function getAccessToken(): string | null {
  return cachedAccessToken;
}

export function setAccessToken(token: string | null): void {
  cachedAccessToken = token;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Strips all undefined properties from objects to prevent Firestore setDoc/updateDoc errors
 */
export function cleanFirestoreData<T extends Record<string, any>>(obj: T): T {
  const cleanObj: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        cleanObj[key] = cleanFirestoreData(val);
      } else {
        cleanObj[key] = val;
      }
    }
  }
  return cleanObj as T;
}

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Please check network connectivity.');
    }
    // Test doc might not exist yet, which is fine
    return false;
  }
}

// Run initial connection test
testConnection();

/* ================= AUTHENTICATION & USER HELPERS ================= */

export async function loginWithGoogle(): Promise<{ user: User; accessToken: string | null } | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    const user = result.user;
    
    // Sync user profile to Firestore
    await syncUserProfile(user);
    return { user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
    cachedAccessToken = null;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function syncUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const adminEmails = ['davidthedums@gmail.com', 'boltcybercafe@gmail.com'];
  const isAdminEmail = user.email ? adminEmails.includes(user.email.toLowerCase()) : false;
  
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const existingData = docSnap.data() as UserProfile;
      return existingData;
    } else {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Customer',
        role: isAdminEmail ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };
      if (user.photoURL) newProfile.photoURL = user.photoURL;
      if (user.phoneNumber) newProfile.phone = user.phoneNumber;

      const sanitized = cleanFirestoreData(newProfile);
      await setDoc(userRef, sanitized);
      return sanitized as UserProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  }
}

/* ================= SERVICE TICKETS & REPAIR TRACKER ================= */

export function generateTrackingCode(): string {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  return `BCS-${randNum}`;
}

export async function createServiceTicket(
  ticketData: Omit<TicketDocument, 'id' | 'trackingCode' | 'createdAt' | 'status'>
): Promise<TicketDocument> {
  const trackingCode = generateTrackingCode();
  const ticketId = trackingCode.toLowerCase();
  const now = new Date().toISOString();

  const newTicket: Partial<TicketDocument> = {
    ...ticketData,
    id: ticketId,
    trackingCode,
    status: 'submitted',
    createdAt: now,
    updatedAt: now,
    technicianNotes: 'Ticket received by Bolt Computer Services diagnostics intake team.'
  };

  if (auth.currentUser?.uid) {
    newTicket.userId = auth.currentUser.uid;
  }

  const sanitizedTicket = cleanFirestoreData(newTicket) as TicketDocument;

  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await setDoc(ticketRef, sanitizedTicket);
    return sanitizedTicket;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `tickets/${ticketId}`);
  }
}

export async function getTicketByTrackingCode(trackingCode: string): Promise<TicketDocument | null> {
  const cleanCode = trackingCode.trim().toUpperCase();
  const ticketId = cleanCode.toLowerCase();
  
  try {
    // First try direct doc get
    const ticketRef = doc(db, 'tickets', ticketId);
    const docSnap = await getDoc(ticketRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as TicketDocument;
    }

    // Otherwise query by trackingCode
    const q = query(collection(db, 'tickets'), where('trackingCode', '==', cleanCode));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return querySnap.docs[0].data() as TicketDocument;
    }

    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `tickets/${ticketId}`);
  }
}

export function subscribeUserTickets(
  userId: string,
  onData: (tickets: TicketDocument[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const q = query(
    collection(db, 'tickets'),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tickets: TicketDocument[] = [];
      snapshot.forEach((docSnap) => {
        tickets.push(docSnap.data() as TicketDocument);
      });
      // Sort client-side by createdAt descending
      tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(tickets);
    },
    (error) => {
      console.error('Error fetching user tickets:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, 'tickets');
    }
  );
}

export function subscribeAllTicketsForAdmin(
  onData: (tickets: TicketDocument[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const ticketsRef = collection(db, 'tickets');

  return onSnapshot(
    ticketsRef,
    (snapshot) => {
      const tickets: TicketDocument[] = [];
      snapshot.forEach((docSnap) => {
        tickets.push(docSnap.data() as TicketDocument);
      });
      tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(tickets);
    },
    (error) => {
      console.error('Error fetching admin tickets:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, 'tickets');
    }
  );
}

export async function updateTicketStatusByAdmin(
  ticketId: string,
  newStatus: TicketStatus,
  technicianNotes?: string,
  estimatedCost?: string
): Promise<void> {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    const updateData: Partial<TicketDocument> = {
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    if (technicianNotes !== undefined && technicianNotes !== '') {
      updateData.technicianNotes = technicianNotes;
    }
    if (estimatedCost !== undefined && estimatedCost !== '') {
      updateData.estimatedCost = estimatedCost;
    }

    await updateDoc(ticketRef, cleanFirestoreData(updateData));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `tickets/${ticketId}`);
  }
}

/* ================= CONTACT MESSAGES ================= */

export async function submitContactMessage(
  data: Omit<ContactMessageDocument, 'id' | 'status' | 'createdAt'>
): Promise<ContactMessageDocument> {
  const messageId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  const newMsg: Partial<ContactMessageDocument> = {
    ...data,
    id: messageId,
    status: 'unread',
    createdAt: now
  };

  const sanitizedMsg = cleanFirestoreData(newMsg) as ContactMessageDocument;

  try {
    const msgRef = doc(db, 'contact_messages', messageId);
    await setDoc(msgRef, sanitizedMsg);
    return sanitizedMsg;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `contact_messages/${messageId}`);
  }
}

export function subscribeContactMessagesForAdmin(
  onData: (messages: ContactMessageDocument[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const messagesRef = collection(db, 'contact_messages');

  return onSnapshot(
    messagesRef,
    (snapshot) => {
      const messages: ContactMessageDocument[] = [];
      snapshot.forEach((docSnap) => {
        messages.push(docSnap.data() as ContactMessageDocument);
      });
      messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(messages);
    },
    (error) => {
      console.error('Error fetching contact messages:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, 'contact_messages');
    }
  );
}

export async function markContactMessageStatus(
  messageId: string,
  status: 'unread' | 'replied' | 'archived'
): Promise<void> {
  try {
    const msgRef = doc(db, 'contact_messages', messageId);
    await updateDoc(msgRef, cleanFirestoreData({ status }));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `contact_messages/${messageId}`);
  }
}
