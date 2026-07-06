import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SeriePage } from './pages/SeriePage';
import { DisciplinaPage } from './pages/DisciplinaPage';
import { AulaPage } from './pages/AulaPage';
import { MentorPage } from './pages/MentorPage';
import { PerfilPage } from './pages/PerfilPage';
import { BoletimPage } from './pages/BoletimPage';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/Layout';
import { Bell } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user-auth');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Simulate mobile notification
      if (parsedUser.notificationsEnabled) {
        setTimeout(() => {
          setNotification(`Lembrete: Você tem uma meta diária de ${parsedUser.dailyGoalMinutes} min para concluir hoje!`);
          setTimeout(() => setNotification(null), 6000);
        }, 1500);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[var(--background)]" />;
  }

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <>
      <Layout user={user} onLogout={() => {
        localStorage.removeItem('user-auth');
        setUser(null);
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trilhas" element={<HomePage />} />
          <Route path="/mentor" element={<MentorPage />} />
          <Route path="/perfil" element={<PerfilPage user={user} onLogout={() => {
            localStorage.removeItem('user-auth');
            setUser(null);
          }} />} />
          <Route path="/boletim" element={<BoletimPage />} />
          <Route path="/serie/:serie" element={<SeriePage />} />
          <Route path="/serie/:serie/disciplina/:disciplina" element={<DisciplinaPage />} />
          <Route path="/serie/:serie/disciplina/:disciplina/unidade/:unidade" element={<AulaPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>

      {/* Simulated Mobile Push Notification */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-sm z-[100] px-4 animate-in slide-in-from-top-10 fade-in duration-500">
          <div className="bg-[var(--surface)] border border-indigo-500/30 shadow-2xl rounded-2xl p-4 flex gap-4 items-start relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bell className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Escola Infinita</h4>
              <p className="text-[var(--text-muted)] text-xs mt-1 leading-relaxed">
                {notification}
              </p>
            </div>
            <button onClick={() => setNotification(null)} className="absolute top-2 right-2 p-1 text-[var(--text-muted)] hover:text-white transition-colors">
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
