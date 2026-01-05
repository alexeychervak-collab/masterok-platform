import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
  initialData?: T;
  autoFetch?: boolean;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiFunction: () => Promise<{ data?: T; error?: string; status: number }>,
  options: UseApiOptions<T> = {}
) {
  const { initialData = null, autoFetch = true } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: autoFetch,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction();

      if (response.error) {
        setState({
          data: null,
          loading: false,
          error: response.error,
        });
      } else {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }, [apiFunction]);

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [autoFetch, execute]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return {
    ...state,
    refetch,
    execute,
  };
}

export function useMutation<TData, TVariables>(
  apiFunction: (variables: TVariables) => Promise<{ data?: TData; error?: string; status: number }>
) {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await apiFunction(variables);

        if (response.error) {
          setState({
            data: null,
            loading: false,
            error: response.error,
          });
          return { success: false, error: response.error };
        } else {
          setState({
            data: response.data || null,
            loading: false,
            error: null,
          });
          return { success: true, data: response.data };
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Unknown error';
        setState({
          data: null,
          loading: false,
          error,
        });
        return { success: false, error };
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}



