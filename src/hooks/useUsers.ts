import { useLocalStorage } from './useStorage';
import { ADMIN_USER } from '../data/seed';
import type { User } from '../types';

const USERS_KEY = 'gymlog_users';

export function useUsers() {
  const [users, setUsers] = useLocalStorage<User[]>(USERS_KEY, [ADMIN_USER]);

  // Ensure admin is always present with correct isAdmin flag
  const allUsers = users.map((u) => (u.id === 'admin' ? { ...u, isAdmin: true } : u));
  if (!allUsers.some((u) => u.id === 'admin')) {
    allUsers.unshift(ADMIN_USER);
  }

  const addUser = (name: string): User => {
    const newUser: User = { id: crypto.randomUUID(), name };
    setUsers((prev) => {
      const withAdmin = prev.some((u) => u.id === 'admin') ? prev : [ADMIN_USER, ...prev];
      return [...withAdmin, newUser];
    });
    return newUser;
  };

  return { users: allUsers, addUser };
}
