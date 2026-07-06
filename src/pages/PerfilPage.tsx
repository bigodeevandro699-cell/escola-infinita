import { User, Settings, Bell, Shield, LogOut, Info, Check, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllProgresso } from '../lib/db';

export function PerfilPage({ user, onLogout }: { user?: any; onLogout?: () => void }) {
  const [xpTotal, setXpTotal] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // Settings State
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  // Local form state
  const [name, setName] = useState(user?.name || '');
  const [objective, setObjective] = useState(user?.objective || '');
  const [dailyGoal, setDailyGoal] = useState<number>(user?.dailyGoalMinutes || 30);
  const [phone, setPhone] = useState(user?.phone || '');
  const [notifications, setNotifications] = useState(user?.notificationsEnabled ?? false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getAllProgresso().then((progresso) => {
      const xp = progresso.filter(p => p.concluida).length * 150;
      setXpTotal(xp);
    });
  }, []);

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name,
      objective,
      dailyGoalMinutes: dailyGoal,
      phone,
      notificationsEnabled: notifications
    };
    localStorage.setItem('user-auth', JSON.stringify(updatedUser));
    // Since App state update relies on refresh or context, we simulate saving visually
    showToast('Configurações salvas com sucesso! (Recarregue para atualizar tudo)');
    setActiveTab(null);
  };

  const level = Math.floor(xpTotal / 500) + 1;
  const xpProximoNivel = level * 500;
  const xpProgresso = (xpTotal % 500);
  const progressoPercent = (xpProgresso / 500) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="premium-card p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border-4 border-[var(--surface)] shadow-xl relative z-10">
          <User className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-400" />
        </div>
        
        <div className="relative z-10 flex-1 w-full">
          <h1 className="text-3xl font-bold text-white mb-2">{user?.name || 'Estudante Infinito'}</h1>
          <p className="text-indigo-400 font-medium mb-4">Nível {level} • Explorador</p>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
            <div className="bg-[var(--surface)] px-4 py-2 rounded-xl border border-[var(--card-border)]">
              <span className="text-[var(--text-muted)] text-sm block mb-1">XP Atual</span>
              <span className="text-white font-bold">{xpTotal} XP</span>
            </div>
            <div className="bg-[var(--surface)] px-4 py-2 rounded-xl border border-[var(--card-border)]">
              <span className="text-[var(--text-muted)] text-sm block mb-1">Dias de Fogo</span>
              <span className="text-white font-bold flex items-center gap-1">
                <span className="text-orange-500">🔥</span> {xpTotal > 0 ? '1 Dia' : '0 Dias'}
              </span>
            </div>
          </div>

          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs text-[var(--text-muted)] font-medium">
              <span>Nível {level}</span>
              <span>{xpProgresso} / 500 XP para Nível {level + 1}</span>
            </div>
            <div className="progress-track h-2">
              <div className="progress-fill-animated bg-indigo-500" style={{ width: `${progressoPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="premium-card p-6 sm:p-8 md:col-span-2">
          <h3 className="text-xl font-bold text-white mb-6">Configurações</h3>
          <div className="space-y-4">
            
            {/* Account Settings */}
            <div className="bg-[var(--background)] rounded-xl border border-[var(--card-border)] overflow-hidden">
              <button 
                onClick={() => setActiveTab(activeTab === 'account' ? null : 'account')} 
                className="w-full flex items-center gap-4 p-4 hover:bg-[var(--surface-hover)] transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--surface)] flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Settings className={`w-5 h-5 transition-colors ${activeTab === 'account' ? 'text-indigo-400' : 'text-[var(--text-muted)] group-hover:text-indigo-400'}`} />
                </div>
                <span className={`font-medium ${activeTab === 'account' ? 'text-indigo-400' : 'text-white'}`}>Preferências da Conta</span>
              </button>
              
              {activeTab === 'account' && (
                <div className="p-4 border-t border-[var(--card-border)] space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="text-xs text-[var(--text-muted)] mb-1 block">Nome de exibição</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg py-2 px-3 text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-muted)] mb-1 block">Objetivo de Estudo</label>
                    <select value={objective} onChange={e => setObjective(e.target.value)} className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg py-2 px-3 text-white text-sm">
                      <option value="Reaprender">Reaprender</option>
                      <option value="Concurso">Concurso Público</option>
                      <option value="ENEM">ENEM</option>
                      <option value="Estudo Pessoal">Estudo Pessoal</option>
                      <option value="Curso">Curso</option>
                    </select>
                  </div>
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
                    <Save className="w-4 h-4" /> Salvar Preferências
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="bg-[var(--background)] rounded-xl border border-[var(--card-border)] overflow-hidden">
              <button 
                onClick={() => setActiveTab(activeTab === 'notifications' ? null : 'notifications')} 
                className="w-full flex items-center gap-4 p-4 hover:bg-[var(--surface-hover)] transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--surface)] flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Bell className={`w-5 h-5 transition-colors ${activeTab === 'notifications' ? 'text-indigo-400' : 'text-[var(--text-muted)] group-hover:text-indigo-400'}`} />
                </div>
                <span className={`font-medium ${activeTab === 'notifications' ? 'text-indigo-400' : 'text-white'}`}>Notificações</span>
              </button>

              {activeTab === 'notifications' && (
                <div className="p-4 border-t border-[var(--card-border)] space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white text-sm block">Ativar Lembretes</span>
                      <span className="text-[var(--text-muted)] text-xs">Receba avisos para estudar</span>
                    </div>
                    <button 
                      onClick={() => setNotifications(!notifications)} 
                      className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-indigo-500' : 'bg-[var(--surface)] border border-[var(--card-border)]'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-muted)] mb-1 block">Número do Celular (SMS/WhatsApp)</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} disabled={!notifications} className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg py-2 px-3 text-white text-sm disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-muted)] mb-1 block">Meta Diária de Tempo</label>
                    <select value={dailyGoal} onChange={e => setDailyGoal(Number(e.target.value))} disabled={!notifications} className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg py-2 px-3 text-white text-sm disabled:opacity-50">
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={60}>1 hora</option>
                    </select>
                  </div>
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
                    <Save className="w-4 h-4" /> Salvar Notificações
                  </button>
                </div>
              )}
            </div>

            {/* Privacy */}
            <div className="bg-[var(--background)] rounded-xl border border-[var(--card-border)] overflow-hidden">
              <button 
                onClick={() => setActiveTab(activeTab === 'privacy' ? null : 'privacy')} 
                className="w-full flex items-center gap-4 p-4 hover:bg-[var(--surface-hover)] transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--surface)] flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Shield className={`w-5 h-5 transition-colors ${activeTab === 'privacy' ? 'text-indigo-400' : 'text-[var(--text-muted)] group-hover:text-indigo-400'}`} />
                </div>
                <span className={`font-medium ${activeTab === 'privacy' ? 'text-indigo-400' : 'text-white'}`}>Privacidade e Segurança</span>
              </button>

              {activeTab === 'privacy' && (
                <div className="p-4 border-t border-[var(--card-border)] space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white text-sm block">Modo Anônimo no Ranking</span>
                      <span className="text-[var(--text-muted)] text-xs">Ocultar seu nome de outros alunos</span>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-[var(--surface)] border border-[var(--card-border)] relative">
                      <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white/50" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white text-sm block">Compartilhar Dados de Progresso</span>
                      <span className="text-[var(--text-muted)] text-xs">Ajudar a IA a melhorar as aulas</span>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-indigo-500 relative">
                      <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                  <button onClick={() => showToast('Configurações de privacidade atualizadas.')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
                    <Save className="w-4 h-4" /> Salvar Segurança
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium px-6 py-3 rounded-xl hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[var(--surface)] border border-[var(--card-border)] text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-50">
          <Info className="w-5 h-5 text-indigo-400" />
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

    </div>
  );
}
