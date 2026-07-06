import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let ai: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

export interface GenerateContentRequest {
  serie: string;
  disciplina: string;
  unidade: string;
  tipo: string;
  nivel: string;
  quantidade_exercicios?: number;
  idioma?: string;
}

export async function generateEducationalContent(request: GenerateContentRequest) {
  const {
    serie,
    disciplina,
    unidade,
    tipo,
    nivel,
    quantidade_exercicios = 10,
    idioma = "pt-BR",
  } = request;

  const aiClient = getGeminiClient();

  const prompt = `Você é o Professor Mentor da Escola Infinita.

Gere conteúdo educacional estruturado.

OBRIGATÓRIO:
- Responder APENAS em JSON válido
- Não adicionar texto fora do JSON
- Não explicar nada
- O conteúdo em Markdown dentro do JSON é aceitável para o campo 'conteudo' e 'resumo', mas a estrutura geral deve ser estritamente JSON.

DADOS:
Série: ${serie}
Disciplina: ${disciplina}
Unidade: ${unidade || "geral"}
Tipo: ${tipo}
Nível: ${nivel || "intermediário"}
Quantidade de exercícios: ${quantidade_exercicios}
Idioma: ${idioma}

IMPORTANTE:
Antes de responder, revise tudo e corrija erros internos. Garanta JSON válido.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      titulo: { type: Type.STRING },
      objetivos: { type: Type.ARRAY, items: { type: Type.STRING } },
      conteudo: { type: Type.STRING, description: "Conteúdo formatado em Markdown" },
      exemplos: { type: Type.ARRAY, items: { type: Type.STRING } },
      resumo: { type: Type.STRING },
      exercicios: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            enunciado: { type: Type.STRING },
            alternativas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exatamente 4 alternativas" },
            correta: { type: Type.INTEGER, description: "Índice de 0 a 3 da alternativa correta" },
            explicacao: { type: Type.STRING }
          },
          required: ["enunciado", "alternativas", "correta", "explicacao"]
        }
      },
      mini_prova: { type: Type.ARRAY, items: { type: Type.STRING } },
      flashcards: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            frente: { type: Type.STRING },
            verso: { type: Type.STRING }
          },
          required: ["frente", "verso"]
        }
      },
      nivel: { type: Type.STRING },
      xp: { type: Type.INTEGER }
    },
    required: ["titulo", "objetivos", "conteudo", "exemplos", "resumo", "exercicios", "mini_prova", "flashcards", "nivel", "xp"]
  };

  let attempts = 0;
  const maxAttempts = 3;
  let jsonResult = null;
  let lastError = null;

  while (attempts < maxAttempts) {
    try {
      const modelToUse = "gemini-2.5-flash";

      const config: any = {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "Você é o Professor Mentor da Escola Infinita. O conteúdo deve ser didático, encorajador e voltado para a compreensão profunda do tópico."
      };

      const response = await aiClient.models.generateContent({
        model: modelToUse,
        contents: prompt,
        config: config,
      });

      if (response.text) {
        let textToParse = response.text.trim();
        // Remove markdown formatting if present
        if (textToParse.startsWith('```json')) {
          textToParse = textToParse.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (textToParse.startsWith('```')) {
          textToParse = textToParse.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        const parsed = JSON.parse(textToParse);
        if (validarConteudo(parsed)) {
          jsonResult = parsed;
          break; // Sucesso, sai do loop
        } else {
          throw new Error("JSON inválido ou incompleto");
        }
      }
    } catch (e: any) {
      lastError = e;
      console.warn(`Attempt ${attempts + 1} failed:`, e.message || e);

      if (attempts < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    attempts++;
  }

  if (jsonResult) {
    return jsonResult;
  } else {
    throw lastError || new Error("Falha ao gerar conteúdo. Tente novamente.");
  }
}

function validarConteudo(data: any) {
  if (!data) return false;
  if (!data.titulo) return false;
  if (!Array.isArray(data.exercicios)) return false;
  return true;
}

function gerarFallback() {
  return {
    titulo: "Conteúdo indisponível no momento",
    objetivos: ["Revisar posteriormente"],
    conteudo: "Conteúdo não gerado devido a falha na IA.",
    exemplos: [],
    resumo: "",
    exercicios: [],
    mini_prova: [],
    flashcards: [],
    nivel: "fallback",
    xp: 0,
  };
}

export async function chatMentor(contexto: string, pergunta: string) {
  const aiClient = getGeminiClient();
  const prompt = `
${contexto}

ALUNO PERGUNTA:
${pergunta}

Responda como Professor Mentor.
`;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é o Professor Mentor da Escola Infinita. Você deve ensinar de forma simples, clara e paciente. Use exemplos do dia a dia. Nunca responda de forma curta demais. Sempre incentive o aluno. Nunca diga que é uma IA."
      }
    });

    return response.text || "Não foi possível gerar resposta.";
  } catch (error: any) {
    console.error("Erro no chatMentor:", error);
    throw error;
  }
}
