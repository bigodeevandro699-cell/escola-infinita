export const SERIES = [
  '6º Ano',
  '7º Ano',
  '8º Ano',
  '9º Ano',
  '1º Ano EM',
  '2º Ano EM',
  '3º Ano EM',
];

export const DISCIPLINAS = [
  'Português',
  'Matemática',
  'História',
  'Geografia',
  'Ciências',
  'Biologia',
  'Física',
  'Química',
  'Inglês',
  'Artes',
  'Educação Física',
  'Filosofia',
  'Sociologia',
  'Redação',
];

// Provide some default Unidades for typical subjects to start with.
export const UNIDADES_PADRAO: Record<string, string[]> = {
  'Matemática': [
    'Aritmética Básica',
    'Álgebra Básica',
    'Geometria Plana',
    'Estatística e Probabilidade',
    'Funções'
  ],
  'Português': [
    'Interpretação de Texto',
    'Morfologia',
    'Sintaxe',
    'Literatura',
    'Ortografia e Acentuação'
  ],
  'História': [
    'História Antiga',
    'História Medieval',
    'História Moderna',
    'História Contemporânea',
    'História do Brasil'
  ],
  'Física': [
    'Mecânica',
    'Termologia',
    'Óptica',
    'Ondulatória',
    'Eletromagnetismo'
  ]
};

// Fallback logic
export function getUnidades(disciplina: string): string[] {
  return UNIDADES_PADRAO[disciplina] || [
    'Fundamentos',
    'Conceitos Intermediários',
    'Aprofundamento',
    'Revisão Geral'
  ];
}
