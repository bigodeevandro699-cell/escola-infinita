import { generateEducationalContent } from "./services/aiContentEngine";

const tests = [
  {serie: "1º Ano Médio", disciplina: "Física", unidade: "Cinemática", tipo: "AULA", nivel: "Médio", quantidade_exercicios: 2},
  {serie: "6º Ano", disciplina: "Ciências", unidade: "Sistema Solar", tipo: "AULA", nivel: "Fácil", quantidade_exercicios: 2},
];

async function runTests() {
  for (const t of tests) {
    try {
      const res = await generateEducationalContent(t);
      console.log(`Success for ${t.unidade}:`, res.titulo);
    } catch(e) {
      console.log(`Failed for ${t.unidade}:`, e.message || e);
    }
  }
}

runTests();
