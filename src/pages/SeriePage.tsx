import { useParams, Link } from 'react-router-dom';
import { DISCIPLINAS } from '../data/structure';
import { ChevronLeft, ChevronRight, Calculator, Book, Globe, Atom } from 'lucide-react';

const DISCIPLINA_ICONS: Record<string, any> = {
  'Matemática': Calculator,
  'Português': Book,
  'História': Globe,
  'Geografia': Globe,
  'Ciências': Atom,
  'Física': Atom,
  'Química': Atom,
  'Biologia': Atom,
};

export function SeriePage() {
  const { serie } = useParams<{ serie: string }>();
  const decodedSerie = decodeURIComponent(serie || '');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/" 
          className="p-2.5 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-white transition-colors"
          title="Voltar"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{decodedSerie}</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Selecione uma disciplina para continuar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DISCIPLINAS.map((disciplina) => {
          const Icon = DISCIPLINA_ICONS[disciplina] || Book;
          const totalAulas = Math.floor(Math.random() * 50) + 40;
          const prog = Math.floor(Math.random() * 60) + 10;
          
          return (
            <Link 
              key={disciplina}
              to={`/serie/${encodeURIComponent(decodedSerie)}/disciplina/${encodeURIComponent(disciplina)}`}
              className="block"
            >
              <div className="premium-card hoverable p-6 h-full flex flex-col group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--surface-hover)] flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-2">{disciplina}</h2>
                <p className="text-sm text-[var(--text-muted)] mb-6">{totalAulas} aulas disponíveis</p>
                
                <div className="mt-auto pt-4 border-t border-[var(--card-border)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-[var(--text-muted)]">Progresso</span>
                    <span className="text-xs font-bold text-indigo-400">{prog}%</span>
                  </div>
                  <div className="progress-track h-1.5 mb-4">
                    <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${prog}%` }} />
                  </div>
                  <div className="flex items-center text-indigo-400 text-sm font-medium group-hover:text-indigo-300">
                    Entrar <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
