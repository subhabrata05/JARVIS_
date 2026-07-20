import { useState, useEffect, useCallback } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const useSystemInfo = () => {
  const [sysInfo, setSysInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSystemInfo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/system`);
      if (res.ok) {
        const data = await res.json();
        setSysInfo(data.data);
      }
    } catch (err) {
      // silently fail — system info is optional
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, 10000);
    return () => clearInterval(interval);
  }, [fetchSystemInfo]);

  return { sysInfo, loading, refresh: fetchSystemInfo };
};

export default useSystemInfo;
