// hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface ApiState<T> {
  data: T | null;
  error: AxiosError | null;
  loading: boolean;
}

const useApi = <T,>(
  url: string,
  options: AxiosRequestConfig = {},
  immediate: boolean = true,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET'
): ApiState<T> & { refetch: (payload?: any) => void } => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (payload?: any) => {
    setLoading(true);
    setError(null);

    const config: AxiosRequestConfig = {
      ...options,
      method,
      url,
      data: payload,
    };

    try {
      const response: AxiosResponse<T> = await axios(config);
      setData(response.data);
    } catch (err) {
      setError(err as AxiosError);
    } finally {
      setLoading(false);
    }
  }, [url, options, method]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  const refetch = (newPayload?: any) => {
    fetchData(newPayload);
  };

  return { data, error, loading, refetch };
};

export default useApi;
