import { PropsWithChildren } from 'react';
import { queryClient } from '@/config/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from './ConfigContext';

/**
 * Proveedores de contexto
 */

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        {children}
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default Providers