import { showError } from './toast';

/**
 * Handler global de erros não capturados
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown, context?: string): void => {
  console.error(`Error ${context ? `in ${context}` : ''}:`, error);

  if (error instanceof AppError) {
    showError(error.message, error);
  } else if (error instanceof Error) {
    showError(context ? `Error in ${context}: ${error.message}` : error.message, error);
  } else {
    showError('An unexpected error occurred');
  }
};

/**
 * Wrapper para funções assíncronas com tratamento de erro automático
 */
export const withErrorHandling = <T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: string
): T => {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      throw error;
    }
  }) as T;
};

/**
 * Setup de listeners globais de erro
 */
export const setupGlobalErrorHandlers = (): void => {
  // Erros não capturados
  window.addEventListener('error', (event) => {
    handleError(event.error, 'Global Error');
  });

  // Promises rejeitadas não tratadas
  window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, 'Unhandled Promise Rejection');
  });
};
