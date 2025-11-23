import { z } from 'zod';
import DOMPurify from 'dompurify';
import { BoardItemSchema } from '../schemas/boardItem.schema';

/**
 * Valida se uma string é uma URL válida
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlSchema = z.string().url();
    urlSchema.parse(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida e sanitiza uma URL
 */
export const validateAndSanitizeUrl = (url: string): string | null => {
  const trimmed = url.trim();

  // Adicionar https:// se começar com www.
  const normalized = trimmed.startsWith('www.') ? `https://${trimmed}` : trimmed;

  if (!isValidUrl(normalized)) {
    return null;
  }

  // Sanitizar para prevenir XSS
  return DOMPurify.sanitize(normalized);
};

/**
 * Sanitiza conteúdo HTML
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};

/**
 * Sanitiza texto simples (remove HTML)
 */
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

/**
 * Valida um objeto BoardItem completo
 */
export const validateBoardItem = (item: unknown) => {
  return BoardItemSchema.safeParse(item);
};

/**
 * Valida tamanho de conteúdo
 */
export const validateContentLength = (content: string, maxLength = 10000): boolean => {
  return content.length <= maxLength;
};
