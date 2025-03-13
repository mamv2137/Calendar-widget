// src/context/ConfigContext.tsx
import bridge from '@/config/bridge';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface Config {
  theme: 'light' | 'dark';
  size: 'compact' | 'full';
  userId: string | null;
  token: string | null;
  environment: 'development' | 'production';
  allowedServices: string[];
}

interface ConfigContextType {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<Config>({
    theme: 'light',
    size: 'full',
    userId: null,
    token: null,
    environment: 'development',
    allowedServices: []
  });

  useEffect(() => {
    // Escuchar mensajes de inicialización del host
    bridge.on('INIT', (payload: Partial<Config>) => {
      setConfig(current => ({ ...current, ...payload }));
      // Configurar tema de Tailwind
      if (payload.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    // Escuchar actualizaciones de configuración
    bridge.on('UPDATE_CONFIG', (payload: Partial<Config>) => {
      setConfig(prev => ({ ...prev, ...payload }));
      // Actualizar tema si cambia
      if (payload.theme) {
        if (payload.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });

    // Informar al host que estamos listos
    bridge.init();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};