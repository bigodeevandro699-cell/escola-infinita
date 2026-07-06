import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Exercicio {
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
}

export interface Flashcard {
  frente: string;
  verso: string;
}

export interface AulaContent {
  id?: number;
  serie: string;
  disciplina: string;
  unidade: string;
  modulo?: string;
  titulo: string;
  objetivos: string[];
  conteudo: string;
  exemplos: string[];
  resumo: string;
  exercicios: Exercicio[];
  mini_prova: string[];
  flashcards: Flashcard[];
  nivel: string;
  xp: number;
  dataGeracao: number;
}

interface EscolaInfinitaDB extends DBSchema {
  aulas: {
    key: number;
    value: AulaContent;
    indexes: {
      'by-path': string; // serie_disciplina_unidade
    };
  };
  progresso: {
    key: string; // serie_disciplina_unidade
    value: {
      path: string;
      nota: number; // 0 to 10
      concluida: boolean;
      tentativas: number;
      ultimaData: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<EscolaInfinitaDB>>;

export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB<EscolaInfinitaDB>('EscolaInfinita', 1, {
      upgrade(db) {
        const aulasStore = db.createObjectStore('aulas', {
          keyPath: 'id',
          autoIncrement: true,
        });
        aulasStore.createIndex('by-path', 'path'); // Will use a synthetic property 'path'

        db.createObjectStore('progresso', {
          keyPath: 'path',
        });
      },
    });
  }
  return dbPromise;
}

export async function saveAula(aula: AulaContent) {
  const db = await initDB();
  const path = `${aula.serie}_${aula.disciplina}_${aula.unidade}`;
  return db.put('aulas', { ...aula, path } as any);
}

export async function getAula(serie: string, disciplina: string, unidade: string) {
  const db = await initDB();
  const path = `${serie}_${disciplina}_${unidade}`;
  const index = db.transaction('aulas').store.index('by-path');
  return index.get(path);
}

export async function saveProgresso(path: string, nota: number) {
  const db = await initDB();
  const concluida = nota >= 7;
  
  const existing = await db.get('progresso', path);
  const tentativas = existing ? existing.tentativas + 1 : 1;
  const bestNota = existing ? Math.max(existing.nota, nota) : nota;
  const wasConcluida = existing ? existing.concluida : false;

  return db.put('progresso', {
    path,
    nota: bestNota,
    concluida: concluida || wasConcluida,
    tentativas,
    ultimaData: Date.now()
  });
}

export async function getProgresso(path: string) {
  const db = await initDB();
  return db.get('progresso', path);
}

export async function getAllProgresso() {
  const db = await initDB();
  return db.getAll('progresso');
}

export async function clearAllData() {
  const db = await initDB();
  await db.clear('aulas');
  await db.clear('progresso');
}
