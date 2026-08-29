import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser, getUserProfile, syncUserProfile, getAccessToken } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  accessToken: string | null;
  hasGmailAccess: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  accessToken: null,
  hasGmailAccess: false,
  login: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessTokenState] = useState<string | null>(getAccessToken());

  const fetchProfile = async (currentUser: User) => {
    try {
      let prof = await getUserProfile(currentUser.uid);
      if (!prof) {
        prof = await syncUserProfile(currentUser);
      }
      setProfile(prof);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      const currentToken = getAccessToken();
      setAccessTokenState(currentToken);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const result = await loginWithGoogle();
      if (result?.user) {
        setAccessTokenState(result.accessToken);
        await fetchProfile(result.user);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setProfile(null);
      setAccessTokenState(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const adminEmails = ['davidthedums@gmail.com', 'boltcybercafe@gmail.com'];
  const isAdmin = profile?.role === 'admin' || (user?.email ? adminEmails.includes(user.email.toLowerCase()) : false);
  const hasGmailAccess = !!accessToken || (!!user && !!getAccessToken());

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        accessToken,
        hasGmailAccess,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
