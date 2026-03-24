import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import BottomNav from './components/BottomNav';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ActiveWorkoutPage from './pages/ActiveWorkoutPage';
import SessionSummaryPage from './pages/SessionSummaryPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import { useCurrentUser } from './hooks/useCurrentUser';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser } = useCurrentUser();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { currentUser } = useCurrentUser();
  if (!currentUser?.isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
          <Route path="/workout/:workoutId" element={<RequireAuth><ActiveWorkoutPage /></RequireAuth>} />
          <Route path="/session/:sessionId" element={<RequireAuth><SessionSummaryPage /></RequireAuth>} />
          <Route path="/history" element={<RequireAuth><HistoryPage /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
