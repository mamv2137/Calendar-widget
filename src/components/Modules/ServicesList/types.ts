import { PaymentFormData, PaymentMethod, Service } from "@/types";

export interface ServicesPaymentListProps {
  services: Service[]
  paymentMethods?: PaymentMethod[],
  isLoading: boolean,
  onPayService: (serviceId: string, paymentMethodId?: string) => Promise<{ success: boolean; error?: string }>
  onAddPaymentMethod: (
    paymentDetails: PaymentFormData,
  ) => Promise<{ success: boolean; paymentMethod?: PaymentMethod; error?: string }>
}