import { generateEducationalContent } from "./services/aiContentEngine";
async function test() {
  try {
    const res = await generateEducationalContent({serie:"9º Ano",disciplina:"História",unidade:"Segunda Guerra Mundial",tipo:"Revisão",nivel:"Fácil",quantidade_exercicios:2});
    console.log("Success:", res.titulo);
  } catch(e) {
    console.log("Error:", e);
  }
}
test();
