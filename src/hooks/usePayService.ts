import { PaymentDetails, PaymentResult } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as paymentService from "@/services/payments";

interface PayServiceParams {
  serviceId: string;
  paymentDetails: PaymentDetails;
}

export function usePayService() {
  const queryClient = useQueryClient();

  return useMutation<PaymentResult, Error, PayServiceParams>(
    ({ serviceId, paymentDetails }) =>
      paymentService.createPayment(serviceId, paymentDetails),
    {
      onSuccess: () => {
        // Invalidar consultas relacionadas para forzar refresco
        queryClient.invalidateQueries({ queryKey: ['services'] });
        queryClient.invalidateQueries({ queryKey: ['payments'] });

      },
    }
  );
}