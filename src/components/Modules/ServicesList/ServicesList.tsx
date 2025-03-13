import { useEffect, useState } from "react";
import { ServicesPaymentListProps } from "./types";
import { PaymentMethod, Service } from "@/types";
import ServiceItem from "./ServiceItem";
import PaymentMethodDrawer from "../PaymentDrawer";
import { usePostMessage } from "@/hooks/usePostMessage";

export default function ServicesPaymentList({
  services: initialServices = [],
  isLoading,
  paymentMethods: initialPaymentMethods = [],
  onPayService,
  onAddPaymentMethod,
}: ServicesPaymentListProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const [sendMessage] = usePostMessage({
    // Manejador para cuando el host solicita refrescar datos
    REFRESH_DATA: () => {
      console.log("Solicitada actualización de datos");
      // Invalidar consultas para refrescar datos
    }
  });

  useEffect(() => {
    setServices(initialServices)
  }, [initialServices])

  const handlePayment = async (service: Service) => {
    // Always show the drawer to either select a saved payment method or add a new one
    setSelectedService(service)
    setDrawerOpen(true)
  }

  const processPayment = async (service: Service, paymentMethodId?: string) => {
    const serviceId = service.id;
    setLoading((prev) => ({ ...prev, [serviceId]: true }))

    try {
      const result = await onPayService(serviceId, paymentMethodId)
      sendMessage('PAYMENT_COMPLETED', {
        ...service,
      });

      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === serviceId
            ? {
                ...service,
                status: result.success ? "success" : "failed",
              }
            : service,
        ),
      )
    } catch (error) {
      setServices((prevServices) =>
        prevServices.map((service) => (service.id === serviceId ? { ...service, status: "error" } : service)),
      )
      sendMessage('ERROR', {
        code: error?.code,
        message: error?.message,
      })
    } finally {
      setLoading((prev) => ({ ...prev, [serviceId]: false }))
    }
  }

  const handlePaymentMethodAdded = (paymentMethodId: string) => {
    if (selectedService) {
      processPayment(selectedService, paymentMethodId)
    }
  }

  const handlePayWithExistingMethod = (paymentMethodId: string) => {
    if (selectedService) {
      processPayment(selectedService, paymentMethodId)
    }
  }

  const hasServices = services.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
        {
          !hasServices ? (
            <div className="text-center text-gray-500">
              No tienes servicios por pagar
            </div>
          )
          : (
            <div className="grid gap-6 items-center md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceItem
                key={service.id}
                service={service}
                paymentMethods={paymentMethods}
                onPaymentClick={handlePayment}
                isLoading={!!loading[service.id]}
              />
            ))}
            </div>
          )
        }

      {selectedService && (
        <PaymentMethodDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          serviceName={selectedService.name}
          serviceAmount={selectedService.amount}
          serviceCurrency={selectedService.currency}
          paymentMethods={paymentMethods}
          onAddPaymentMethod={onAddPaymentMethod}
          onPayWithExistingMethod={handlePayWithExistingMethod}
          onSuccess={handlePaymentMethodAdded}
        />
      )}
    </div>
  )
}

