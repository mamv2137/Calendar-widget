import bridge from '@/config/bridge';
import { useEffect, useCallback, useState, RefObject } from 'react';

/**
 * Tipo de función para manejar mensajes del host
 */
export type MessageHandler<T = any> = (payload: T) => void;

/**
 * Tipo de función para enviar mensajes al host
 */
export type PostMessageFunction<T = any> = (type: string, payload?: T) => void;

/**
 * Interfaz para la configuración del widget
 */
export interface WidgetConfig {
  theme?: 'light' | 'dark';
  size?: 'compact' | 'full';
  userId?: string | null;
  token?: string | null;
  environment?: 'development' | 'production';
  allowedServices?: string[];
}

/**
 * Hook para manejar la comunicación bidireccional con el sitio host
 * a través del API postMessage.
 * 
 * @param messageHandlers - Objeto con tipos de mensajes y sus manejadores
 * @returns - Función para enviar mensajes al host y estado de conexión
 * 
 * @example
 * ```tsx
 * const sendMessage = usePostMessage({
 *   UPDATE_CONFIG: (payload) => setConfig(prev => ({...prev, ...payload})),
 *   REFRESH_DATA: () => queryClient.invalidateQueries(),
 * });
 * 
 * // Para enviar un mensaje al host
 * sendMessage('CUSTOM_EVENT', { data: 'some data' });
 * ```
 */
export function usePostMessage(
  messageHandlers: Record<string, MessageHandler> = {}
): [PostMessageFunction, boolean] {
  const [isReady, setIsReady] = useState(false);

  // Registrar todos los handlers de mensajes
  useEffect(() => {
    // Registrar cada tipo de mensaje con su handler
    Object.entries(messageHandlers).forEach(([type, handler]) => {
      bridge.on(type, handler);
    });

    // Registrar handler para INIT específicamente para marcar
    // cuando la comunicación está lista
    const initHandler = (payload: any) => {
      setIsReady(true);
      // Si hay un handler específico para INIT, también llamarlo
      if (messageHandlers.INIT) {
        messageHandlers.INIT(payload);
      }
    };

    bridge.on('INIT', initHandler);

    // Inicializar bridge
    bridge.init();
  }, [messageHandlers]);

  // Función para enviar mensajes al host
  const sendToHost = useCallback<PostMessageFunction>((type, payload = {}) => {
    bridge.sendToHost(type, payload);
  }, []);

  return [sendToHost, isReady];
}

/**
 * Hook especializado para manejar el redimensionamiento automático
 * del iframe basado en el contenido
 * 
 * @param ref - Referencia al elemento contenedor
 * 
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * useAutoResize(containerRef);
 * 
 * return <div ref={containerRef}>...</div>;
 * ```
 */
export function useAutoResize(ref: RefObject<HTMLElement>): void {
  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        bridge.resize(height);
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref]);
}

/**
 * Hook para notificar pagos completados al host
 * 
 * @returns Función para notificar un pago completado
 * 
 * @example
 * ```tsx
 * const notifyPayment = usePaymentNotification();
 * 
 * // Después de completar un pago
 * notifyPayment({
 *   transactionId: '12345',
 *   amount: 56.78,
 *   serviceId: 'srv-001',
 *   timestamp: new Date().toISOString()
 * });
 * ```
 */
export function usePaymentNotification() {
  return useCallback((paymentData: {
    transactionId: string;
    amount: number;
    serviceId: string;
    timestamp: string;
  }) => {
    bridge.notifyPayment(paymentData);
  }, []);
}

/**
 * Hook para reportar errores al host
 * 
 * @returns Función para reportar un error
 * 
 * @example
 * ```tsx
 * const reportError = useErrorReporting();
 * 
 * try {
 *   // Código que puede fallar
 * } catch (error) {
 *   reportError('PAYMENT_FAILED', error.message);
 * }
 * ```
 */
export function useErrorReporting() {
  return useCallback((code: string, message: string) => {
    bridge.reportError(code, message);
  }, []);
}