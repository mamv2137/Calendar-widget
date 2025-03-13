import { PaymentsFetcher } from "@/config/adapters/Payments.adapter"
import { PaymentDetails, PaymentResult } from "@/types"

export const createPayment = async (serviceId: string, paymentDetails: PaymentDetails): Promise<PaymentResult> => {
  return PaymentsFetcher.post('/payments', {
    serviceId,
    ...paymentDetails
  })
}