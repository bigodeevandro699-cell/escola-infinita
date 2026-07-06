import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { ChevronLeft, Loader2, Sparkles, AlertCircle, CheckCircle, Brain, BookOpen, FileText, Lightbulb, ListChecks, Trophy } from 'lucide-react';
import { AulaContent, saveProgresso } from '../lib/db';
import { Pedagogico } from '../services/pedagogico';

export function AulaPage() {
  const { serie: serieParam, disciplina: disciplinaParam, unidade: unidadeParam } = useParams<{ serie: string; disciplina: string; unidade: string }>();
  
  const serie = decodeURIComponent(serieParam || '');
  const disciplina = decodeURIComponent(disciplinaParam || '');
  const unidade = decodeURIComponent(unidadeParam || '');

  const [aula, setAula] = useState<AulaContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  const [notaFinal, setNotaFinal] = useState<number | null>(null);
  const [showResultados, setShowResultados] = useState(false);
  
  type TabId = 'objetivos' | 'conteudo' | 'exemplos' | 'resumo' | 'exercicios';
  const [activeTab, setActiveTab] = useState<TabId>('objetivos');

  useEffect(() => {
    async function loadAula() {
      if (!serie || !disciplina || !unidade) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const novaAula = await Pedagogico.getAula({ serie, disciplina, unidade });
        setAula(novaAula);
        localStorage.setItem('ultima-aula', JSON.stringify({ serie, disciplina, unidade, titulo: novaAula.titulo }));
      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setLoading(false);
      }
    }
    loadAula();
  }, [serie, disciplina, unidade]);

  const handleResponder = (indexExercicio: number, indexAlternativa: number) => {
    if (showResultados) return;
    setRespostas(prev => ({ ...prev, [indexExercicio]: indexAlternativa }));
  };

  const finalizarAula = async () => {
    if (!aula) return;
    
    let acertos = 0;
    aula.exercicios.forEach((ex, idx) => {
      if (respostas[idx] === ex.correta) {
        acertos++;
      }
    });

    const nota = (acertos / aula.exercicios.length) * 10;
    setNotaFinal(nota);
    setShowResultados(true);

    // Salvar progresso
    const path = `${serie}_${disciplina}_${unidade}`;
    await saveProgresso(path, nota);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
          <Brain className="w-20 h-20 text-indigo-400 relative z-10 animate-bounce" />
          <Loader2 className="w-10 h-10 text-white animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white mb-2">Preparando sua aula...</p>
          <p className="text-[var(--text-muted)]">O Professor Mentor está gerando conteúdo exclusivo com IA</p>
        </div>
      </div>
    );
  }

  if (error || !aula) {
    return (
      <div className="premium-card p-6 bg-red-500/10 border-red-500/20 flex items-start gap-4">
        <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-xl text-red-400 mb-2">Houve um problema</h3>
          <p className="text-red-200/80 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const tabsList: TabId[] = ['objetivos', 'conteudo', 'exemplos', 'resumo', 'exercicios'];
  const currentStep = tabsList.indexOf(activeTab) + 1;
  const progressPercent = showResultados ? 100 : (currentStep / tabsList.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header and Progress */}
      <div className="sticky top-0 z-40 bg-[var(--background)] pt-2 pb-4 border-b border-[var(--card-border)] mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link 
            to={`/serie/${encodeURIComponent(serie || '')}/disciplina/${encodeURIComponent(disciplina || '')}`}
            className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Voltar
          </Link>
          <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Passo {currentStep} de {tabsList.length}
          </div>
        </div>
        
        <div className="progress-track h-2 w-full">
          <div className="progress-fill-animated" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-[var(--surface-hover)] text-[var(--text-muted)] text-xs font-bold rounded-lg uppercase tracking-wider">
            {serie}
          </span>
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider">
            {disciplina}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{aula.titulo}</h1>
      </div>

      {activeTab === 'objetivos' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          
          <div className="premium-card p-6 sm:p-8 bg-gradient-to-br from-indigo-900/40 to-[var(--card)] border-indigo-500/30">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Olá! Aqui é o Professor Mentor.</h3>
                <p className="text-[var(--text-muted)] text-lg leading-relaxed">
                  Preparei esta aula com muito carinho para você. Vamos explorar {aula.titulo.toLowerCase()} de forma simples e direta.
                </p>
              </div>
            </div>
          </div>

          <div className="premium-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <ListChecks className="w-6 h-6 text-indigo-400" />
              <h3 className="text-2xl font-bold text-white">O que vamos aprender hoje?</h3>
            </div>
            <ul className="space-y-4">
              {aula.objetivos.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-400 font-bold text-sm">{idx + 1}</span>
                  </div>
                  <span className="text-lg text-[var(--text-muted)] leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={() => setActiveTab('conteudo')}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              Começar a Aula <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'conteudo' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="premium-card p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-8 border-b border-[var(--card-border)] pb-6">
              <BookOpen className="w-7 h-7 text-indigo-400" />
              <h3 className="text-3xl font-bold text-white">Explicação</h3>
            </div>
            <div className="text-[var(--text-muted)] leading-relaxed text-lg prose prose-invert max-w-none">
              <Markdown>{aula.conteudo}</Markdown>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button 
              onClick={() => setActiveTab('objetivos')}
              className="px-6 py-3.5 bg-[var(--surface-hover)] hover:bg-[var(--primary)] hover:text-white text-[var(--text-muted)] font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> Anterior
            </button>
            <button 
              onClick={() => setActiveTab(aula.exemplos && aula.exemplos.length > 0 ? 'exemplos' : 'resumo')}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              Próximo <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'exemplos' && aula.exemplos && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="premium-card p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-8 border-b border-[var(--card-border)] pb-6">
              <Lightbulb className="w-7 h-7 text-amber-400" />
              <h3 className="text-3xl font-bold text-white">Exemplos Práticos</h3>
            </div>
            <div className="space-y-6">
              {aula.exemplos.map((ex, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[var(--surface-hover)] border border-[var(--card-border)]">
                  <div className="prose prose-invert max-w-none text-lg leading-relaxed text-[var(--text-muted)]">
                    <Markdown>{ex}</Markdown>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button 
              onClick={() => setActiveTab('conteudo')}
              className="px-6 py-3.5 bg-[var(--surface-hover)] hover:bg-[var(--primary)] hover:text-white text-[var(--text-muted)] font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> Anterior
            </button>
            <button 
              onClick={() => setActiveTab('resumo')}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              Resumo <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'resumo' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="premium-card p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 border-b border-[var(--card-border)] pb-6">
                <FileText className="w-7 h-7 text-indigo-400" />
                <h3 className="text-3xl font-bold text-white">Resumo da Aula</h3>
              </div>
              <div className="text-[var(--text-muted)] leading-relaxed text-lg prose prose-invert max-w-none">
                <Markdown>{aula.resumo}</Markdown>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button 
              onClick={() => setActiveTab(aula.exemplos && aula.exemplos.length > 0 ? 'exemplos' : 'conteudo')}
              className="px-6 py-3.5 bg-[var(--surface-hover)] hover:bg-[var(--primary)] hover:text-white text-[var(--text-muted)] font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> Anterior
            </button>
            <button 
              onClick={() => setActiveTab('exercicios')}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              Praticar <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'exercicios' && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
          <div className="premium-card p-6 sm:p-10 bg-gradient-to-br from-[var(--surface-hover)] to-[var(--card)]">
            <h2 className="text-3xl font-bold text-white mb-2">Verificação de Aprendizado</h2>
            <p className="text-[var(--text-muted)] text-lg">Responda aos exercícios abaixo para consolidar seu conhecimento e ganhar XP.</p>
          </div>

          <div className="space-y-8">
            {aula.exercicios.map((ex, idx) => (
              <div key={idx} className="premium-card p-6 sm:p-8 space-y-6">
                <h4 className="text-xl font-bold text-white leading-snug">
                  <span className="text-indigo-400 mr-2">Questão {idx + 1}.</span>
                  {ex.enunciado}
                </h4>
                
                <div className="space-y-3">
                  {ex.alternativas.map((alt, altIdx) => {
                    const isSelected = respostas[idx] === altIdx;
                    let bgClass = "bg-[var(--surface-hover)] border-[var(--card-border)] text-[var(--text-muted)]";
                    
                    if (isSelected && !showResultados) {
                      bgClass = "bg-indigo-500/20 border-indigo-500 text-indigo-300";
                    }
                    
                    if (showResultados) {
                      if (altIdx === ex.correta) {
                        bgClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                      } else if (isSelected && altIdx !== ex.correta) {
                        bgClass = "bg-red-500/20 border-red-500 text-red-400 opacity-70";
                      } else {
                        bgClass = "bg-[var(--surface-hover)] border-[var(--card-border)] text-[var(--text-muted)] opacity-50";
                      }
                    }

                    return (
                      <button
                        key={altIdx}
                        onClick={() => handleResponder(idx, altIdx)}
                        disabled={showResultados}
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all text-lg font-medium hover:scale-[1.01] ${bgClass}`}
                      >
                        <div className="flex gap-4">
                          <span className="font-bold opacity-70 mt-0.5">{String.fromCharCode(65 + altIdx)}.</span>
                          <span>{alt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showResultados && (
                  <div className={`p-6 rounded-2xl mt-6 flex items-start gap-4 animate-in zoom-in duration-300 ${respostas[idx] === ex.correta ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                    <div className="mt-1 flex-shrink-0">
                      {respostas[idx] === ex.correta ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <AlertCircle className="w-6 h-6 text-red-500" />}
                    </div>
                    <div>
                      <span className={`font-bold text-lg block mb-2 ${respostas[idx] === ex.correta ? 'text-emerald-400' : 'text-red-400'}`}>
                        {respostas[idx] === ex.correta ? 'Você Acertou!' : 'Alternativa Incorreta.'}
                      </span>
                      <div className="text-base prose prose-invert prose-sm max-w-none text-[var(--text-muted)]">
                        <Markdown>{ex.explicacao}</Markdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!showResultados ? (
            <div className="flex justify-between pt-6 border-t border-[var(--card-border)]">
              <button 
                onClick={() => setActiveTab('resumo')}
                className="px-6 py-3.5 bg-[var(--surface-hover)] hover:bg-[var(--primary)] hover:text-white text-[var(--text-muted)] font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Anterior
              </button>
              <button
                onClick={finalizarAula}
                disabled={Object.keys(respostas).length < aula.exercicios.length}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all"
              >
                Finalizar
              </button>
            </div>
          ) : (
            <div className="premium-card p-8 sm:p-12 text-center space-y-6 mt-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
              <div className="inline-block p-6 rounded-3xl bg-[var(--surface-hover)] mb-4 border border-[var(--card-border)] relative z-10 shadow-lg shadow-indigo-500/10">
                <Trophy className="w-12 h-12 text-indigo-400 mx-auto mb-2" />
                <span className="text-5xl font-black text-white">{notaFinal?.toFixed(1)}</span>
              </div>
              
              <div className="relative z-10">
                {notaFinal !== null && notaFinal >= 7 ? (
                  <div>
                    <h3 className="text-3xl font-bold mb-3 text-emerald-400">Aprovado! Parabéns!</h3>
                    <p className="text-[var(--text-muted)] text-lg">Você mandou muito bem nesta unidade.</p>
                  </div>
                ) : notaFinal !== null && notaFinal >= 5 ? (
                  <div>
                    <h3 className="text-3xl font-bold mb-3 text-amber-400">Quase lá!</h3>
                    <p className="text-[var(--text-muted)] text-lg">Reveja os conceitos e tente novamente para melhorar.</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-3xl font-bold mb-3 text-red-400">Precisamos rever!</h3>
                    <p className="text-[var(--text-muted)] text-lg">O Professor Mentor sugere ler o conteúdo com mais calma.</p>
                  </div>
                )}
              </div>
              
              <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <button 
                  onClick={() => {
                    setShowResultados(false);
                    setRespostas({});
                    setNotaFinal(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-8 py-3.5 rounded-xl bg-[var(--surface-hover)] hover:bg-[var(--card-border)] text-white font-medium transition-colors text-lg"
                >
                  Refazer Exercícios
                </button>
                <Link 
                  to={`/serie/${encodeURIComponent(serie || '')}/disciplina/${encodeURIComponent(disciplina || '')}`}
                  className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] text-lg"
                >
                  Voltar para Disciplina
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
