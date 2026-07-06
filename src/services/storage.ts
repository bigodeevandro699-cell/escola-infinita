export function salvarConteudo(chave: string, dados: any) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

export function carregarConteudo(chave: string) {
  const data = localStorage.getItem(chave);
  return data ? JSON.parse(data) : null;
}
