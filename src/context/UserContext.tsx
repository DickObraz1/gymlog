import { createContext, useContext, useState } from 'react';
import type { User } from '../types';

const SESSION_KEY = 'gymlog_current_user';

function loadUser(): User | null {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const user: User = JSON.parse(stored);
    if (user.id === 'admin') return { ...user, isAdmin: true };
    return user;
  } catch {
    return null;
  }
}

interface UserContextValue {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(loadUser);

  const setCurrentUser = (user: User | null) => {
    const resolved = user?.id === 'admin' ? { ...user, isAdmin: true } : user;
    setCurrentUserState(resolved);
    if (resolved) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(resolved));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useCurrentUser must be used within UserProvider');
  return ctx;
}
