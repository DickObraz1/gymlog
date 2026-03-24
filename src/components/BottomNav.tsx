import { NavLink, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function BottomNav() {
  const location = useLocation();
  const { currentUser } = useCurrentUser();

  const hide = ['/login', '/session'].some((p) => location.pathname.startsWith(p));
  if (hide) return null;

  const links = [
    { to: '/', label: 'Domů', icon: '🏠' },
    { to: '/workout', label: 'Trénink', icon: '💪' },
    { to: '/history', label: 'Historie', icon: '📊' },
    { to: '/profile', label: 'Profil', icon: '👤' },
    ...(currentUser?.isAdmin ? [{ to: '/admin', label: 'Správa', icon: '⚙️' }] : []),
  ];

  return (
    <nav className="bottom-nav">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => (isActive ? 'active' : '')}
          end={link.to === '/'}
        >
          <span className="nav-icon">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
