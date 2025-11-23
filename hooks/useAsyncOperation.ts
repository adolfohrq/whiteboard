import { useState, useCallback } from 'react';

export interface AsyncState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

export interface UseAsyncOperationReturn<T> extends AsyncState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook para gerenciar operações assíncronas com estados de loading, error e data
 * Inclui timeout automático de 30 segundos
 *
 * @param operation - Função assíncrona a ser executada
 * @param timeout - Tempo limite em ms (padrão: 30000)
 * @returns Estado da operação e função execute
 *
 * @example
 * const { loading, error, data, execute } = useAsyncOperation(
 *   async (url: string) => fetch(url).then(r => r.json())
 * );
 *
 * await execute('https://api.example.com/data');
 */
export const useAsyncOperation = <T>(
  operation: (...args: unknown[]) => Promise<T>,
  timeout = 30000
): UseAsyncOperationReturn<T> => {
  const [state, setState] = useState<AsyncState<T>>({
    loading: false,
    error: null,
    data: null,
  });

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setState({ loading: true, error: null, data: null });

      try {
        const result = await Promise.race<T>([
          operation(...args),
          new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('Operation timeout')), timeout)
          ),
        ]);

        setState({ loading: false, error: null, data: result });
        return result;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setState({ loading: false, error: errorObj, data: null });
        return null;
      }
    },
    [operation, timeout]
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return { ...state, execute, reset };
};
