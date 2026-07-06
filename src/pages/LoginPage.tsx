import { useState } from 'react';
import { Zap, Sparkles, LogIn, ArrowRight, BookOpen, Brain, Trophy, ChevronLeft, Target, Clock, Bell } from 'lucide-react';
import { clearAllData } from '../lib/db';

const OBJECTIVES = [
  { id: 'Reaprender', label: 'Reaprender', desc: 'Revisar e reaprender do zero' },
  { id: 'Concurso', label: 'Concurso Público', desc: 'Foco em editais e provas' },
  { id: 'ENEM', label: 'ENEM', desc: 'Preparação para o exame' },
  { id: 'Estudo Pessoal', label: 'Estudo Pessoal', desc: 'Aprender por hobby ou curiosidade' },
  { id: 'Curso', label: 'Curso', desc: 'Acompanhar graduação ou técnico' },
];

const DAILY_GOALS = [
  { id: 15, label: '15 min/dia', desc: 'Casual - para dias corridos' },
  { id: 30, label: '30 min/dia', desc: 'Regular - ritmo constante' },
  { id: 60, label: '1h/dia', desc: 'Intenso - resultados rápidos' },
];

export function LoginPage({ onLogin }: { onLogin: (user: any) => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [dailyGoal, setDailyGoal] = useState<number>(30);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;

    if (isRegistering && step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem('registered-users') || '[]');

    if (!isRegistering) {
      // Login flow
      const existingUser = users.find((u: any) => u.name === name.trim() && u.password === password);
      if (existingUser) {
        localStorage.setItem('user-auth', JSON.stringify(existingUser));
        onLogin(existingUser);
      } else {
        setErrorMsg('Nome de usuário ou senha incorretos.');
      }
      setLoading(false);
      return;
    }
    
    // Register flow
    // Clear all previous user data to start fresh (as requested)
    await clearAllData();
    localStorage.removeItem('ultima-aula');

    const newUser = { 
      name: name.trim(), 
      password: password,
      level: 1, 
      xp: 0,
      objective: objective,
      dailyGoalMinutes: dailyGoal,
      phone: phone,
      notificationsEnabled: phone.length > 8
    };

    const newUsersList = [...users.filter((u: any) => u.name !== newUser.name), newUser];
    localStorage.setItem('registered-users', JSON.stringify(newUsersList));
    localStorage.setItem('user-auth', JSON.stringify(newUser));
    onLogin(newUser);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-center z-10">
        
        {/* Left Side - Hero / Value Prop */}
        <div className="flex-1 text-center lg:text-left space-y-6 lg:pr-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-7 h-7 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Escola Infinita</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">caminho inteligente</span> para aprender.
          </h1>
          <p className="text-[var(--text-muted)] text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0">
            Comece sua jornada do zero e desenvolva seu conhecimento com a ajuda do nosso Professor Mentor Inteligente.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 hidden md:grid">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold">Aulas com IA</h3>
              <p className="text-[var(--text-muted)] text-sm">Conteúdo gerado sob medida.</p>
            </div>
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold">Ganhe XP</h3>
              <p className="text-[var(--text-muted)] text-sm">Avance e suba de nível.</p>
            </div>
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-2">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold">Trilhas Completas</h3>
              <p className="text-[var(--text-muted)] text-sm">Do 6º ano ao Ensino Médio.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md">
          <div className="premium-card p-8 sm:p-10 relative overflow-hidden shadow-2xl border border-[var(--card-border)] bg-[var(--surface)]/80 backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            
            <div className="relative z-10 text-center mb-8">
              {isRegistering && step > 1 && (
                <button 
                  type="button" 
                  onClick={() => setStep(step - 1)}
                  className="absolute left-0 top-0 p-2 -ml-2 -mt-2 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-white mb-2">
                {!isRegistering ? 'Acesse sua conta' : 
                 step === 1 ? 'Crie sua conta' : 
                 step === 2 ? 'Qual seu objetivo?' : 
                 'Meta e Lembretes'}
              </h2>
              <p className="text-[var(--text-muted)] text-sm">
                {!isRegistering ? 'Bem-vindo de volta à sua jornada.' : 
                 step === 1 ? 'E comece a desenvolver seus estudos agora mesmo.' :
                 step === 2 ? 'Vamos adaptar a trilha para você.' :
                 'Configure seu ritmo de estudos diário.'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="relative z-10 space-y-5">
              
              {(!isRegistering || step === 1) && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[var(--text-muted)] ml-1">Como devemos te chamar?</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl py-3.5 px-4 text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[var(--text-muted)] ml-1">Sua Senha</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl py-3.5 px-4 text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                      {errorMsg}
                    </div>
                  )}
                </div>
              )}

              {isRegistering && step === 2 && (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-4">
                  {OBJECTIVES.map(obj => (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => setObjective(obj.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                        objective === obj.id 
                          ? 'bg-indigo-500/20 border-indigo-500' 
                          : 'bg-[var(--surface-hover)] border-[var(--card-border)] hover:border-indigo-500/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${objective === obj.id ? 'bg-indigo-500/30 text-indigo-400' : 'bg-[var(--surface)] text-[var(--text-muted)]'}`}>
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{obj.label}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-0.5">{obj.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {isRegistering && step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-[var(--text-muted)] ml-1">Tempo diário de estudo</label>
                    <div className="grid gap-3">
                      {DAILY_GOALS.map(goal => (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => setDailyGoal(goal.id)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                            dailyGoal === goal.id 
                              ? 'bg-indigo-500/20 border-indigo-500' 
                              : 'bg-[var(--surface-hover)] border-[var(--card-border)] hover:border-indigo-500/50'
                          }`}
                        >
                          <Clock className={`w-5 h-5 ${dailyGoal === goal.id ? 'text-indigo-400' : 'text-[var(--text-muted)]'}`} />
                          <div>
                            <div className="font-bold text-white text-sm">{goal.label}</div>
                            <div className="text-xs text-[var(--text-muted)]">{goal.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[var(--text-muted)] ml-1 flex items-center gap-2">
                      <Bell className="w-4 h-4" /> Celular para Lembretes
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl py-3.5 px-4 text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <p className="text-xs text-[var(--text-muted)] px-1 mt-1">Opcional. Para receber notificações do seu tempo de estudo.</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !name.trim() || (isRegistering && step === 2 && !objective)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-indigo-200" />
                    <span>
                      {!isRegistering ? 'Entrar na Plataforma' :
                       step < 3 ? 'Continuar' : 'Começar Jornada'}
                    </span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {(!isRegistering || step === 1) && (
              <div className="mt-8 text-center relative z-10">
                <p className="text-[var(--text-muted)] text-sm">
                  {isRegistering ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                  <button 
                    type="button"
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setStep(1);
                    }}
                    className="ml-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  >
                    {isRegistering ? 'Entrar aqui' : 'Criar agora'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
