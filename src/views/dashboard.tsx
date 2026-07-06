import { useNavigate } from 'react-router-dom';
import { Pedagogico } from '../services/pedagogico';
import { carregarConteudo, salvarConteudo } from '../services/storage';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * DASHBOARD PRINCIPAL
 * Conecta usuário ao Motor Pedagógico
 */

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const user = carregarConteudo("user") || {
    nome: "Estudante",
  };

  const estrutura = Pedagogico.getEstrutura();
  const progresso = carregarConteudo("progresso-geral") || {};
  const aulaAtual = carregarConteudo("ultima-aula");

  const iniciarJornada = async () => {
    try {
      setLoading(true);
      const aula = await Pedagogico.gerarAula(
        "6º Ano",
        "Matemática",
        "Introdução"
      );

      salvarConteudo("ultima-aula", aula);
      window.location.href = "/estudar"; // ou navigate('/estudar')
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const abrirAula = () => {
    window.location.href = "/estudar";
  };

  const irParaEstudos = () => {
    window.location.href = "/estudar";
  };

  return (
    <div className="dashboard max-w-4xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <header className="dash-header">
        <h1 className="text-3xl font-bold text-slate-800">Olá, {user.nome}</h1>
        <p className="text-slate-600">Continue sua jornada de estudos</p>
      </header>

      {/* PROGRESSO */}
      <section className="progress-section space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">Seu progresso</h2>

        <div className="card bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-600">Séries disponíveis: {estrutura.series.length}</p>
          <p className="text-slate-600">Disciplinas: {estrutura.disciplinas.length}</p>
        </div>
      </section>

      {/* CONTINUAR ESTUDANDO */}
      <section className="continue-section space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">Continuar estudando</h2>

        {aulaAtual ? (
          <div className="card highlight bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-900">{aulaAtual.titulo || "Aula Atual"}</h3>
            <p className="text-indigo-700 mb-4">{aulaAtual.serie} - {aulaAtual.disciplina}</p>

            <button 
              onClick={abrirAula}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continuar aula
            </button>
          </div>
        ) : (
          <div className="card bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-600 mb-4">Você ainda não iniciou uma aula.</p>
            <button 
              onClick={iniciarJornada}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Começar agora
            </button>
          </div>
        )}
      </section>

      {/* SUGESTÃO */}
      <section className="suggestion space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">Sugestão do Professor Mentor</h2>

        <div className="card bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-4">
            Continue em Matemática - Frações para fortalecer sua base.
          </p>

          <button 
            onClick={irParaEstudos}
            className="px-4 py-2 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 transition-colors"
          >
            Ir para estudos
          </button>
        </div>
      </section>
    </div>
  );
}
