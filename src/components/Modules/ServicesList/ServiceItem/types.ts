import { PaymentMethod, Service } from "@/types"

export interface ServiceItemProps {
  service: Service
  paymentMethods: PaymentMethod[]
  onPaymentClick: (service: Service) => void
  isLoading: boolean
}