import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllProgresso } from '../lib/db';
import { carregarConteudo } from '../services/storage';
import { BookOpen, Star, Flame, Trophy, Play, ChevronRight, GraduationCap, Compass, Blocks, BookMarked, Target } from 'lucide-react';

const getTracksForObjective = (objective: string | undefined) => {
  if (objective === 'ENEM') {
    return [
      { id: '1º Ano EM', name: '1º Ano EM', desc: 'Introdução ao médio.', icon: Blocks },
      { id: '2º Ano EM', name: '2º Ano EM', desc: 'Foco e desenvolvimento.', icon: Compass },
      { id: '3º Ano EM', name: '3º Ano EM', desc: 'Preparação para o ENEM.', icon: GraduationCap },
      { id: 'Redação', name: 'Redação ENEM', desc: 'Prática e teoria.', icon: BookMarked }
    ];
  }
  if (objective === 'Concurso') {
    return [
      { id: 'Básico', name: 'Nível Básico', desc: 'Fundamentos essenciais.', icon: Blocks },
      { id: 'Intermediário', name: 'Nível Intermediário', desc: 'Aprofundamento.', icon: Compass },
      { id: 'Avançado', name: 'Nível Avançado', desc: 'Alta complexidade.', icon: GraduationCap },
    ];
  }
  // Default for Reaprender, Estudo Pessoal, Curso or missing
  return [
    { id: '6º Ano', name: '6º Ano', desc: 'Fundamentos essenciais.', icon: Blocks },
    { id: '7º Ano', name: '7º Ano', desc: 'Aprofundando conceitos.', icon: Compass },
    { id: '8º Ano', name: '8º Ano', desc: 'Preparação avançada.', icon: BookMarked },
    { id: '9º Ano', name: '9º Ano', desc: 'Conclusão do fundamental.', icon: GraduationCap },
    { id: '1º Ano EM', name: '1º Ano EM', desc: 'Introdução ao médio.', icon: Blocks },
    { id: '2º Ano EM', name: '2º Ano EM', desc: 'Foco e desenvolvimento.', icon: Compass },
    { id: '3º Ano EM', name: '3º Ano EM', desc: 'Preparação para o ENEM.', icon: GraduationCap }
  ];
};

export function HomePage() {
  const [progressoData, setProgressoData] = useState<any[]>([]);
  const [ultimaAula, setUltimaAula] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user-auth');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    getAllProgresso().then(setProgressoData);
    const uAula = carregarConteudo('ultima-aula');
    if (uAula) {
      setUltimaAula(uAula);
    }
  }, []);

  const totalXP = progressoData.filter(p => p.concluida).length * 150;
  const modulosConcluidos = progressoData.filter(p => p.concluida).length;
  const streak = totalXP > 0 ? 1 : 0;
  const level = Math.floor(totalXP / 1000) + 1;
  const progressToNextLevel = (totalXP % 1000) / 10;
  
  const activeTracks = getTracksForObjective(user?.objective);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Hero Section */}
      <div className="premium-card p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[var(--surface)] to-[var(--background)]">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -z-10 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] -z-10 translate-y-1/2 -translate-x-1/4" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 z-10 relative">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Bom dia, <span className="gradient-text">{user?.name || 'Aluno'}</span>
            </h1>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed">
              Aqui é o Professor Mentor. Você está indo muito bem! Seu foco esta semana está excelente.
              Continue assim para alcançar seus objetivos.
            </p>
            {user?.objective && (
              <div className="flex items-center gap-2 pt-1 pb-2">
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5 border border-indigo-500/20">
                  <Target className="w-3.5 h-3.5" /> Foco: {user.objective}
                </span>
                {user.dailyGoalMinutes && (
                   <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-lg uppercase tracking-wider border border-purple-500/20">
                     Meta: {user.dailyGoalMinutes} min/dia
                   </span>
                )}
              </div>
            )}
            <div className="pt-2">
              <Link to="/trilhas" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]">
                Continuar estudando
              </Link>
            </div>
          </div>

          <div className="flex gap-4 md:gap-6 flex-wrap md:flex-nowrap">
            <div className="bg-[var(--surface-hover)] rounded-2xl p-4 min-w-[120px] flex flex-col items-center justify-center border border-[var(--card-border)]">
              <Star className="w-6 h-6 text-amber-400 mb-2" fill="currentColor" />
              <span className="text-2xl font-black text-white">{level}</span>
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Nível</span>
            </div>
            <div className="bg-[var(--surface-hover)] rounded-2xl p-4 min-w-[120px] flex flex-col items-center justify-center border border-[var(--card-border)]">
              <Trophy className="w-6 h-6 text-indigo-400 mb-2" />
              <span className="text-2xl font-black text-white">{totalXP}</span>
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Total XP</span>
            </div>
            <div className="bg-[var(--surface-hover)] rounded-2xl p-4 min-w-[120px] flex flex-col items-center justify-center border border-[var(--card-border)]">
              <Flame className="w-6 h-6 text-orange-500 mb-2" fill="currentColor" />
              <span className="text-2xl font-black text-white">{streak}</span>
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Dias seguidos</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--card-border)] relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[var(--text-muted)]">Progresso para o Nível {level + 1}</span>
            <span className="text-sm font-bold text-indigo-400">{totalXP % 1000} / 1000 XP</span>
          </div>
          <div className="progress-track h-3">
            <div className="progress-fill-animated" style={{ width: `${progressToNextLevel}%` }} />
          </div>
        </div>
      </div>

      {/* Continue Studying */}
      {ultimaAula && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Play className="w-5 h-5 text-indigo-400" fill="currentColor" />
            Continue de onde parou
          </h2>
          <Link 
            to={`/serie/${encodeURIComponent(ultimaAula.serie)}/disciplina/${encodeURIComponent(ultimaAula.disciplina)}/unidade/${encodeURIComponent(ultimaAula.unidade)}`}
            className="block"
          >
            <div className="premium-card hoverable p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                      {ultimaAula.serie}
                    </span>
                    <span className="text-sm font-medium text-[var(--text-muted)]">{ultimaAula.disciplina}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{ultimaAula.titulo || ultimaAula.unidade}</h3>
                  <div className="flex items-center gap-4 mt-3 text-sm text-[var(--text-muted)]">
                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> Resumo • Exercícios</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:items-end gap-3 min-w-[200px]">
                  <div className="w-full">
                  </div>
                  <button className="w-full sm:w-auto px-6 py-2.5 bg-[var(--surface-hover)] hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                    Continuar <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Trilhas (Series Grid) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Trilhas de Aprendizagem {user?.objective && `- Foco: ${user.objective}`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeTracks.map((serie) => {
            const Icon = serie.icon;
            // Simulated progress for visual appeal
            const prog = totalXP > 0 ? Math.floor(Math.random() * 40) + 10 : 0;
            
            return (
              <Link 
                key={serie.id}
                to={`/serie/${encodeURIComponent(serie.id)}`}
                className="block"
              >
                <div className="premium-card hoverable p-5 h-full flex flex-col group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon className="w-24 h-24 text-indigo-400" />
                  </div>
                  
                  <div className="relative z-10 flex-1">
                    <div className="w-12 h-12 bg-[var(--surface-hover)] rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                      <Icon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{serie.name}</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-4">{serie.desc}</p>
                  </div>
                  
                  <div className="relative z-10 mt-auto">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[var(--text-muted)]">Conclusão</span>
                      <span className="text-indigo-400 font-bold">{prog}%</span>
                    </div>
                    <div className="progress-track h-1.5 mb-4">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${prog}%` }} />
                    </div>
                    <button className="w-full py-2 bg-[var(--surface-hover)] group-hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors">
                      Entrar
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
