import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function getCacheKey(payload: any): string {
  const { serie, disciplina, unidade, tipo, nivel } = payload;
  const keyStr = `${serie}_${disciplina}_${unidade}_${tipo}_${nivel}`;
  // Basic safe filename
  return keyStr.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.json';
}

export function getCachedContent(payload: any): any | null {
  try {
    const key = getCacheKey(payload);
    const filePath = path.join(CACHE_DIR, key);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from cache:', error);
  }
  return null;
}

export function saveToCache(payload: any, content: any): void {
  try {
    const key = getCacheKey(payload);
    const filePath = path.join(CACHE_DIR, key);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
}
