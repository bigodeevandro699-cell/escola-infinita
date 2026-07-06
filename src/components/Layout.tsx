import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, User, Zap, Sparkles, LineChart, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Layout({ children, user, onLogout }: { children: React.ReactNode; user?: any; onLogout?: () => void }) {
  const location = useLocation();
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('app-theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/trilhas', icon: BookOpen, label: 'Trilhas' },
    { path: '/boletim', icon: LineChart, label: 'Boletim' },
    { path: '/mentor', icon: MessageCircle, label: 'Mentor' },
    { path: '/perfil', icon: User, label: 'Perfil' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-layout">
      {/* Top right theme toggle for mobile */}
      <div className="md:hidden fixed top-4 right-4 z-[60]">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--card-border)] flex items-center justify-center shadow-lg text-[var(--text-muted)] hover:text-indigo-400 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] fixed inset-y-0 left-0 bg-[var(--surface)] border-r border-[var(--card-border)] z-50">
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Escola Infinita</span>
          </Link>
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg bg-[var(--surface-hover)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-indigo-400 transition-colors ml-2"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                  active 
                    ? 'bg-indigo-500/10 text-indigo-400' 
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-indigo-400' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm text-white">Professor Mentor AI</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Sempre pronto para ajudar nos seus estudos.</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content min-h-screen relative">
        <div className="max-w-5xl mx-auto w-full pt-8 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[70px] bg-[var(--surface)] border-t border-[var(--card-border)] z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-[20%] h-full space-y-1 transition-colors ${
                active ? 'text-indigo-400' : 'text-[var(--text-muted)]'
              }`}
            >
              <item.icon className={`w-6 h-6 ${active ? 'fill-indigo-400/20' : ''}`} />
              <span className="text-[10px] font-medium hidden sm:block whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
