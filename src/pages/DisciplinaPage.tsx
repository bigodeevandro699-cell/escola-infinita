import { Link, useParams } from 'react-router-dom';
import { getUnidades } from '../data/structure';
import { ChevronLeft, CheckCircle2, Circle, LayoutGrid, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllProgresso } from '../lib/db';

export function DisciplinaPage() {
  const { serie: serieParam, disciplina: disciplinaParam } = useParams<{ serie: string; disciplina: string }>();
  const serie = decodeURIComponent(serieParam || '');
  const disciplina = decodeURIComponent(disciplinaParam || '');
  const [progressoUnidades, setProgressoUnidades] = useState<Record<string, boolean>>({});
  
  const unidades = getUnidades(disciplina || '');

  useEffect(() => {
    async function carregarProgresso() {
      const todos = await getAllProgresso();
      
      const p: Record<string, boolean> = {};
      todos.forEach((item) => {
        const parts = item.path.split('_');
        if (parts[0] === serie && parts[1] === disciplina) {
          p[parts[2]] = item.concluida;
        }
      });
      setProgressoUnidades(p);
    }
    carregarProgresso();
  }, [serie, disciplina]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to={`/serie/${encodeURIComponent(serie || '')}`} 
          className="p-2.5 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-white transition-colors"
          title="Voltar"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="text-sm font-bold text-indigo-400 mb-1 tracking-wider uppercase">{serie}</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{disciplina}</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Escolha um módulo para começar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {unidades.map((unidade, index) => {
          const isConcluida = progressoUnidades[unidade];
          
          return (
            <Link 
              key={unidade}
              to={`/serie/${encodeURIComponent(serie || '')}/disciplina/${encodeURIComponent(disciplina || '')}/unidade/${encodeURIComponent(unidade)}`}
              className="block"
            >
              <div className={`premium-card hoverable p-6 h-full flex flex-col group ${isConcluida ? 'border-emerald-500/30' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isConcluida ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[var(--surface-hover)] text-indigo-400 group-hover:bg-indigo-500/20'
                  }`}>
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  {isConcluida ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-[var(--card-border)] group-hover:text-indigo-400 transition-colors" />
                  )}
                </div>
                
                <h3 className="text-sm font-bold text-[var(--text-muted)] mb-1 uppercase tracking-wider">
                  Módulo {index + 1}
                </h3>
                <h2 className="text-lg font-bold text-white mb-6 line-clamp-2">
                  {unidade}
                </h2>
                
                <div className="mt-auto pt-4 border-t border-[var(--card-border)] flex items-center justify-between">
                  <span className={`text-sm font-medium ${isConcluida ? 'text-emerald-400' : 'text-indigo-400 group-hover:text-indigo-300'}`}>
                    {isConcluida ? 'Revisar' : 'Iniciar Aula'}
                  </span>
                  <Play className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isConcluida ? 'text-emerald-400' : 'text-indigo-400'}`} fill="currentColor" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
