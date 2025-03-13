import { useEffect, useState } from "react";
import { ServicesPaymentListProps } from "./types";
import { PaymentMethod, Service } from "@/types";
import ServiceItem from "./ServiceItem";
import PaymentMethodDrawer from "../PaymentDrawer";

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

  useEffect(() => {
    setServices(initialServices)
  }, [initialServices])

  const handlePayment = async (service: Service) => {
    // Always show the drawer to either select a saved payment method or add a new one
    setSelectedService(service)
    setDrawerOpen(true)
  }

  const processPayment = async (serviceId: string, paymentMethodId?: string) => {
    setLoading((prev) => ({ ...prev, [serviceId]: true }))

    try {
      const result = await onPayService(serviceId, paymentMethodId)

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
    } finally {
      setLoading((prev) => ({ ...prev, [serviceId]: false }))
    }
  }

  const handlePaymentMethodAdded = (paymentMethodId: string) => {
    if (selectedService) {
      processPayment(selectedService.id, paymentMethodId)
    }
  }

  const handlePayWithExistingMethod = (paymentMethodId: string) => {
    if (selectedService) {
      processPayment(selectedService.id, paymentMethodId)
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

