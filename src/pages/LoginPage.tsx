import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import { useCurrentUser } from '../hooks/useCurrentUser';
import type { User } from '../types';

export default function LoginPage() {
  const { users, addUser } = useUsers();
  const { setCurrentUser } = useCurrentUser();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBicepTap = () => {
    tapCountRef.current += 1;
    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    if (tapCountRef.current >= 5) {
      setShowAdmin(true);
      tapCountRef.current = 0;
      return;
    }
    tapTimeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 1500);
  };

  const visibleUsers = users.filter((u) => showAdmin || u.id !== 'admin');

  const selectUser = (user: User) => {
    setCurrentUser(user);
    navigate('/');
  };

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    const user = addUser(name);
    setCurrentUser(user);
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        paddingTop: 'max(32px, calc(env(safe-area-inset-top) + 24px))',
        gap: 8,
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 12, cursor: 'default', userSelect: 'none' }} onClick={handleBicepTap}>💪</div>
        <h1 style={{ fontSize: 36, letterSpacing: -1 }}>GymLog</h1>
        <p className="text-muted" style={{ marginTop: 6 }}>Sleduj svůj pokrok</p>
      </div>

      <div style={{ width: '100%', maxWidth: 380 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20, color: 'var(--text2)', fontWeight: 500, fontSize: 16 }}>
          Kdo jsi?
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visibleUsers.map((user) => (
            <button
              key={user.id}
              className="btn-secondary"
              onClick={() => selectUser(user)}
              style={{ textAlign: 'left', paddingLeft: 20, fontSize: 18, fontWeight: 600 }}
            >
              👤 {user.name}
            </button>
          ))}

          {adding ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text"
                placeholder="Tvoje jméno…"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                autoFocus
                style={{ fontSize: 18 }}
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary" onClick={handleAdd} style={{ flex: 1 }}>
                  Potvrdit
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => { setAdding(false); setNewName(''); }}
                  style={{ flex: 1 }}
                >
                  Zrušit
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn-ghost"
              onClick={() => setAdding(true)}
              style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-sm)',
                minHeight: 52,
                color: 'var(--text2)',
                fontSize: 16,
              }}
            >
              + Přidat nového uživatele
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
