import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data-fetch hook.
 * @param {Function} fetchFn - Async function returning axios response
 * @param {any} initialData - Default value before data loads
 * @param {boolean} immediate - Fetch on mount
 */
const useFetch = (fetchFn, initialData = null, immediate = true) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'An error occurred';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (immediate) execute();
  }, []);

  return { data, loading, error, execute, setData };
};

export default useFetch;
