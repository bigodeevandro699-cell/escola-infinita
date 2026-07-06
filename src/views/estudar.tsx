import { useEffect, useState } from 'react';
import { Pedagogico } from '../services/pedagogico';
import { carregarConteudo, salvarConteudo } from '../services/storage';
import { ProfessorMentor } from '../services/professorMentor';
import { Loader2 } from 'lucide-react';

export function Estudar() {
  const [aula, setAula] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAula() {
      setLoading(true);
      let ultimaAula = carregarConteudo("ultima-aula");

      if (!ultimaAula) {
        try {
          ultimaAula = await Pedagogico.gerarAula("6º Ano", "Matemática", "Introdução");
          salvarConteudo("ultima-aula", ultimaAula);
        } catch (error) {
          console.error("Erro ao gerar aula", error);
        }
      }
      
      setAula(ultimaAula);
      setLoading(false);
    }

    loadAula();
  }, []);

  const responder = (exercicioIndex: number, alternativaIndex: number) => {
    if (!aula || !aula.exercicios) return;
    const exercicio = aula.exercicios[exercicioIndex];
    const correto = exercicio.correta === alternativaIndex;
    
    alert(
      correto
        ? "✔ Resposta correta!"
        : `❌ Resposta incorreta. ${exercicio.explicacao || ''}`
    );
  };

  const proximaAula = async () => {
    setLoading(true);
    try {
      const novaAula = await Pedagogico.gerarAula("6º Ano", "Matemática", "Frações");
      salvarConteudo("ultima-aula", novaAula);
      setAula(novaAula);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pedirAjuda = async () => {
    if (!aula) return;
    setLoading(true);
    try {
      const mensagem = `Estou estudando ${aula.titulo}. Explique de forma mais simples e com exemplos do dia a dia.`;
      const resposta = await ProfessorMentor.perguntar(mensagem);
      alert(`Professor Mentor: \n\n${resposta}`);
    } catch (error) {
      console.error(error);
      alert("Erro ao pedir ajuda.");
    } finally {
      setLoading(false);
    }
  };

  const verificarProgresso = () => {
    const progresso = carregarConteudo("progresso-geral") || {};
    console.log(progresso);
    alert("Progresso carregado (estrutura pronta)");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-xl font-medium text-slate-700">Carregando aula...</p>
      </div>
    );
  }

  if (!aula) {
    return <div className="p-6">Erro ao carregar aula.</div>;
  }

  return (
    <div className="estudo max-w-4xl mx-auto p-6 space-y-8">
      {/* CABEÇALHO */}
      <header className="estudo-header bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800">{aula.titulo || 'Aula sem título'}</h1>
        <p className="text-slate-500 mt-2">{aula.serie} • {aula.disciplina}</p>
      </header>

      {/* CONTEÚDO */}
      <section className="conteudo bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">Explicação</h2>
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{aula.conteudo || aula.explicacao}</p>

        {aula.exemplos && aula.exemplos.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-slate-800 mt-6">Exemplos</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              {aula.exemplos.map((ex: any, idx: number) => (
                <li key={idx}>{ex}</li>
              ))}
            </ul>
          </>
        )}

        {aula.resumo && (
          <>
            <h3 className="text-xl font-semibold text-slate-800 mt-6">Resumo</h3>
            <p className="text-slate-700 leading-relaxed">{aula.resumo}</p>
          </>
        )}
      </section>

      {/* EXERCÍCIOS */}
      {aula.exercicios && aula.exercicios.length > 0 && (
        <section className="exercicios space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Exercícios</h2>

          {aula.exercicios.map((ex: any, index: number) => (
            <div key={index} className="card exercicio bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <p className="font-medium text-slate-800"><strong>{index + 1}.</strong> {ex.enunciado || ex.pergunta}</p>

              <div className="alternativas flex flex-col gap-2">
                {(ex.alternativas || ex.opcoes || []).map((alt: string, i: number) => (
                  <button 
                    key={i}
                    onClick={() => responder(index, i)}
                    className="text-left w-full p-3 rounded-lg border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                  >
                    {alt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* AÇÕES */}
      <section className="acoes flex flex-wrap gap-4 pt-4">
        <button 
          onClick={verificarProgresso}
          className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
        >
          Ver progresso
        </button>

        <button 
          onClick={proximaAula}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Próxima aula
        </button>

        <button 
          onClick={pedirAjuda}
          className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
        >
          Perguntar ao Professor Mentor
        </button>
      </section>
    </div>
  );
}
