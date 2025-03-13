export type ServiceStatus = "pending" | "success" | "failed" | "error"

export interface Service {
  id: string
  name: string
  description: string
  amount: number
  currency: string
  dueDate: string
  status?: ServiceStatus
}

export interface PaymentMethod {
  id: string
  cardNumber: string // Last 4 digits
  cardType: string
  expiryDate: string
  isDefault?: boolean
}

export interface PaymentFormData {
  cardholderName: string
  cardNumber: string
  expiryDate: string
  cvc: string
  saveCard: boolean
}

export type GenericObject = Record<string, unknown>

export interface ServiceFilters {
  status?: string;
  serviceType?: string;
  limit?: number;
  offset?: number;
}

export type EventType = 'INIT' | 'UPDATE_CONFIG' | 'REFRESH_DATA' | 'LOGOUT';

export type ThemesType = 'light' | 'dark';

export type SizeType = 'compact' | 'full';

export interface UIConfig {
  theme: ThemesType;
  size: SizeType;
}

export interface InitPayload extends UIConfig {
  userId: string; // ID de usuario para autenticación
  token: string;  // Token JWT para autenticación
  environment: 'development' | 'production';
  allowedServices: Array<'electric' | 'water' | 'internet'>; // Servicios permitidos
}

export interface Event {
  type: EventType;
  payload?: InitPayload | GenericObject;
}

export interface PaymentDetails {
  amount: number;
  paymentMethod: string;
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    holderName: string;
  };
}

export interface PaymentResult {
  transactionId: string;
  status: string;
  timestamp: string;
  receipt?: {
    url: string;
  };
}