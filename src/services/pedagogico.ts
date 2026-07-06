import { gerarConteudoAI } from "./aiClient";
import { salvarConteudo, carregarConteudo } from "./storage";

/**
 * MOTOR PEDAGÓGICO CENTRAL
 * Responsável por toda navegação educacional
 */

export const Pedagogico = {
  /**
   * Buscar aula (offline-first)
   */
  async getAula({ serie, disciplina, unidade }: { serie: string, disciplina: string, unidade: string }) {
    const key = `${serie}-${disciplina}-${unidade}`;

    // 1. tenta buscar offline
    const cache = carregarConteudo(key);

    if (cache) {
      return cache;
    }

    // 2. se não existir, gera com IA
    const aula = await gerarConteudoAI({
      serie,
      disciplina,
      unidade,
      tipo: "AULA",
      quantidade_exercicios: 10,
    });

    // 3. salva localmente
    salvarConteudo(key, aula);

    return aula;
  },

  /**
   * Listar estrutura base (fixa)
   */
  getEstrutura() {
    return {
      series: [
        "6º Ano",
        "7º Ano",
        "8º Ano",
        "9º Ano",
        "1º EM",
        "2º EM",
        "3º EM",
      ],

      disciplinas: [
        "Português",
        "Matemática",
        "História",
        "Geografia",
        "Ciências",
        "Biologia",
        "Física",
        "Química",
        "Inglês",
        "Redação",
      ],
    };
  },

  /**
   * Gerar aula sob demanda
   */
  async gerarAula(serie: string, disciplina: string, unidade: string) {
    return await this.getAula({ serie, disciplina, unidade });
  },

  /**
   * Registrar progresso do aluno
   */
  salvarProgresso(chave: string, dados: any) {
    salvarConteudo(`progresso-${chave}`, dados);
  },

  /**
   * Carregar progresso
   */
  carregarProgresso(chave: string) {
    return carregarConteudo(`progresso-${chave}`);
  },
};
