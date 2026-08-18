import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ApiConfig {
  baseUrl: string;
  apiKey: string;
}

interface ApiConfigContextProps {
  config: ApiConfig;
  setConfig: (newConfig: ApiConfig) => void;
}

const defaultConfig: ApiConfig = {
  baseUrl: 'http://localhost:20128/v1',
  apiKey: 'sk-273f9f90362c27d8-o859cs-dae2c440'
};

const ApiConfigContext = createContext<ApiConfigContextProps | undefined>(undefined);

export const ApiConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfigState] = useState<ApiConfig>(defaultConfig);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('apiConfig');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ApiConfig;
        setConfigState(parsed);
      } catch (_) {}
    }
  }, []);

  const setConfig = (newConfig: ApiConfig) => {
    setConfigState(newConfig);
    localStorage.setItem('apiConfig', JSON.stringify(newConfig));
  };

  return (
    <ApiConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ApiConfigContext.Provider>
  );
};

export const useApiConfig = (): ApiConfigContextProps => {
  const context = useContext(ApiConfigContext);
  if (!context) {
    throw new Error('useApiConfig must be used within an ApiConfigProvider');
  }
  return context;
};
