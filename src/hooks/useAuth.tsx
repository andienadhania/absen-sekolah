import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { UserProfile, UserRole } from '../types';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FORCE MOCK MODE: App is now completely demo-based
    const mockRole = localStorage.getItem('mock_role') as UserRole || null;
    const mockName = localStorage.getItem('mock_name') || null;
    
    if (mockRole) {
      setProfile({
        id: 'mock-user',
        email: `guest-${mockRole}@smkprima.sch.id`,
        name: mockName || (mockRole === 'guru' ? 'Guru SMK Prima' : 'Siswa SMK Prima'),
        role: mockRole,
        created_at: new Date().toISOString()
      });
      setUser({ id: 'mock-user' } as User);
    } else {
      setProfile(null);
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  async function fetchProfile(_uid: string) {
    // Not needed in purely demo mode
    setLoading(false);
  }

  const signOut = async () => {
    localStorage.removeItem('mock_role');
    localStorage.removeItem('mock_name');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
