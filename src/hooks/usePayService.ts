import { useMutation, useQueryClient } from "@tanstack/react-query";

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
        queryClient.invalidateQueries('services');
        queryClient.invalidateQueries('payments');

      },
    }
  );
}