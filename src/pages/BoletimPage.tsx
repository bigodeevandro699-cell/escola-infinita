import { useEffect, useState } from 'react';
import { getAllProgresso } from '../lib/db';
import { Trophy, TrendingUp, Star, Award, BarChart3, Target } from 'lucide-react';

export function BoletimPage() {
  const [progresso, setProgresso] = useState<any[]>([]);

  useEffect(() => {
    getAllProgresso().then(setProgresso);
  }, []);

  const xpTotal = progresso.filter(p => p.concluida).length * 150;
  const modulosConcluidos = progresso.filter(p => p.concluida).length;
  const mediaNotas = progresso.length > 0 
    ? (progresso.reduce((acc, curr) => acc + (curr.nota || 0), 0) / progresso.length).toFixed(1)
    : '0.0';

  const hasPrimeirosPassos = modulosConcluidos > 0;
  const hasFocoTotal = progresso.some(p => p.nota === 10);
  const conquistasTotais = (hasPrimeirosPassos ? 1 : 0) + (hasFocoTotal ? 1 : 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Meu Boletim</h1>
        <p className="text-[var(--text-muted)] text-lg">Acompanhe seu desempenho e conquistas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="premium-card p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-indigo-400" />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-wider mb-1">XP Total</p>
          <p className="text-3xl font-black text-white">{xpTotal}</p>
        </div>
        
        <div className="premium-card p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-wider mb-1">Média Geral</p>
          <p className="text-3xl font-black text-white">{mediaNotas}</p>
        </div>

        <div className="premium-card p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-wider mb-1">Módulos</p>
          <p className="text-3xl font-black text-white">{modulosConcluidos}</p>
        </div>

        <div className="premium-card p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-wider mb-1">Conquistas</p>
          <p className="text-3xl font-black text-white">{conquistasTotais}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="premium-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Histórico de Notas</h3>
          </div>
          <div className="space-y-4">
            {progresso.length === 0 ? (
              <p className="text-[var(--text-muted)] text-center py-8">Você ainda não concluiu nenhum módulo.</p>
            ) : (
              progresso.map((p, idx) => {
                const parts = p.path.split('_');
                const title = parts.length >= 3 ? `${parts[1]} - ${parts[2]}` : p.path;
                return (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-hover)] border border-[var(--card-border)]">
                    <div>
                      <p className="font-bold text-white">{title}</p>
                      <p className="text-sm text-[var(--text-muted)]">{new Date(p.ultimaData).toLocaleDateString()}</p>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold">
                      {p.nota?.toFixed(1) || '0.0'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="premium-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-white">Conquistas Recentes</h3>
          </div>
          <div className="space-y-4">
            {conquistasTotais === 0 ? (
              <p className="text-[var(--text-muted)] text-center py-8">Estude e complete lições para desbloquear conquistas.</p>
            ) : (
              <>
                {hasPrimeirosPassos && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-hover)] border border-[var(--card-border)]">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Primeiros Passos</p>
                      <p className="text-sm text-[var(--text-muted)]">Concluiu sua primeira aula.</p>
                    </div>
                  </div>
                )}
                
                {hasFocoTotal && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-hover)] border border-[var(--card-border)]">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Foco Total</p>
                      <p className="text-sm text-[var(--text-muted)]">Nota 10 em alguma disciplina.</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
