import { handleError } from '../utils/errorHandling';

interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  publisher: string;
  logo: string;
}

interface CacheEntry {
  data: LinkMetadata;
  timestamp: number;
}

const CACHE_DURATION = 1000 * 60 * 30; // 30 minutos
const cache = new Map<string, CacheEntry>();

/**
 * Limpa entradas expiradas do cache
 */
const cleanExpiredCache = (): void => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
};

/**
 * Busca metadados de um link com cache
 */
export const fetchLinkMetadata = async (url: string): Promise<LinkMetadata | null> => {
  try {
    // Limpar cache expirado periodicamente
    if (Math.random() < 0.1) {
      // 10% de chance a cada chamada
      cleanExpiredCache();
    }

    // Verificar cache
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // Buscar dados
    const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'success') {
      const { title, description, image, url: finalUrl, publisher, logo } = data.data;

      const metadata: LinkMetadata = {
        title: title || '',
        description: description || '',
        image: image?.url || '',
        url: finalUrl || url,
        publisher: publisher || new URL(url).hostname,
        logo: logo?.url || '',
      };

      // Salvar no cache
      cache.set(url, {
        data: metadata,
        timestamp: Date.now(),
      });

      return metadata;
    }

    return null;
  } catch (error) {
    handleError(error, 'Link Preview');
    return null;
  }
};

/**
 * Limpa todo o cache
 */
export const clearLinkCache = (): void => {
  cache.clear();
};

/**
 * Remove uma URL específica do cache
 */
export const removeLinkFromCache = (url: string): void => {
  cache.delete(url);
};
