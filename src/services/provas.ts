import { carregarConteudo, salvarConteudo } from "./storage";

/**
 * SISTEMA DE PROVAS
 */

export const Provas = {
  /**
   * Corrigir prova automaticamente
   */
  corrigirProva(respostasUsuario: Record<number, number>, prova: any) {
    let acertos = 0;

    prova.questoes.forEach((q: any, index: number) => {
      if (respostasUsuario[index] === q.correta) {
        acertos++;
      }
    });

    const nota = (acertos / prova.questoes.length) * 10;

    return {
      acertos,
      total: prova.questoes.length,
      nota: Number(nota.toFixed(1)),
      status: this.definirStatus(nota),
    };
  },

  /**
   * Status do aluno
   */
  definirStatus(nota: number) {
    if (nota >= 7) return "APROVADO";
    if (nota >= 5) return "PENDENCIA";
    return "REPROVADO";
  },

  /**
   * Salvar resultado da prova
   */
  salvarResultado(idAluno: string, resultado: any) {
    const historico =
      carregarConteudo(`boletim-${idAluno}`) || [];

    historico.push({
      data: new Date().toISOString(),
      ...resultado,
    });

    salvarConteudo(`boletim-${idAluno}`, historico);
  },

  /**
   * Gerar prova a partir de uma aula
   */
  gerarProvaDaAula(aula: any) {
    return {
      titulo: `Prova - ${aula.titulo || 'Aula'}`,
      questoes: (aula.exercicios || []).slice(0, 5).map((q: any) => ({
        enunciado: q.enunciado || q.pergunta,
        alternativas: q.alternativas || q.opcoes,
        correta: q.correta,
        explicacao: q.explicacao,
      })),
    };
  },

  /**
   * Buscar boletim do aluno
   */
  getBoletim(idAluno: string) {
    return (
      carregarConteudo(`boletim-${idAluno}`) || []
    );
  },
};
