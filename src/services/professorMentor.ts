import { carregarConteudo } from "./storage";

/**
 * PROFESSOR MENTOR - CHAT INTELIGENTE
 */

export const ProfessorMentor = {
  /**
   * Monta contexto da conversa
   */
  montarContexto() {
    const aula = carregarConteudo("ultima-aula");

    if (!aula) {
      return "Aluno ainda não iniciou uma aula.";
    }

    return `
Você é o Professor Mentor da Escola Infinita.

Seu objetivo é ensinar de forma simples, clara e paciente.

CONTEXTO ATUAL DO ALUNO:
- Título: ${aula.titulo || 'Aula'}
- Disciplina: ${aula.disciplina || 'Disciplina'}
- Série: ${aula.serie || 'Série'}

CONTEÚDO DA AULA:
${aula.conteudo || ''}

REGRAS:
- Explique de forma simples
- Use exemplos do dia a dia
- Nunca responda de forma curta demais
- Sempre incentive o aluno
- Nunca diga que é uma IA
`;
  },

  /**
   * Enviar pergunta para API
   */
  async perguntar(pergunta: string) {
    const contexto = this.montarContexto();

    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contexto, pergunta })
      });

      if (!response.ok) {
        throw new Error("Falha ao comunicar com o mentor.");
      }

      const data = await response.json();
      return data.resposta || "Não foi possível gerar resposta.";
    } catch (error) {
      console.error(error);
      return "Erro ao contatar o Professor Mentor. Tente novamente mais tarde.";
    }
  },
};

