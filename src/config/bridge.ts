// src/bridge.ts
export interface WidgetMessage {
  type: string;
  payload?: any;
}

export interface WidgetEventListener {
  (payload: any): void;
}

export class WidgetBridge {
  private eventListeners: Record<string, WidgetEventListener[]>;
  private hostOrigin: string;
  private allowedOrigins: string[];

  constructor(allowedOrigins: string[] = []) {
    this.eventListeners = {};
    this.hostOrigin = '*'; // Se debe configurar con orígenes permitidos
    this.allowedOrigins = allowedOrigins;

    // Escuchar mensajes del host
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  public init(): void {
    // Notificar al host que está listo
    this.sendToHost('READY');
  }

  private handleMessage(event: MessageEvent): void {
    // Validar origen en producción
    if (this.allowedOrigins.length && !this.allowedOrigins.includes(event.origin)) {
      console.error(`Mensaje rechazado de origen no permitido: ${event.origin}`);
      return;
    }

    const { type, payload } = event.data as WidgetMessage;

    if (this.eventListeners[type]) {
      this.eventListeners[type].forEach(callback => callback(payload));
    }
  }

  public on(eventType: string, callback: WidgetEventListener): void {
    if (!this.eventListeners[eventType]) {
      this.eventListeners[eventType] = [];
    }
    this.eventListeners[eventType].push(callback);
  }

  public sendToHost(type: string, payload: any = {}): void {
    window.parent.postMessage({ type, payload } as WidgetMessage, this.hostOrigin);
  }

  // Métodos específicos para eventos comunes
  public resize(height: number): void {
    this.sendToHost('RESIZE', { height });
  }

  public notifyPayment(paymentData: {
    transactionId: string;
    amount: number;
    serviceId: string;
    timestamp: string;
  }): void {
    this.sendToHost('PAYMENT_COMPLETED', paymentData);
  }

  public reportError(code: string, message: string): void {
    this.sendToHost('ERROR', { code, message });
  }
}

export default new WidgetBridge();