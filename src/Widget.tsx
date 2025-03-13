
import { useEffect, useRef, useState } from "react"
import ServicesList from "@/components/Modules/ServicesList"
import { getCardType } from "./lib/card-utils"
import { PaymentFormData, PaymentMethod, Service } from "./types"
import { useGetServices } from "./hooks/useGetServices"
import { useConfig } from "./contexts/ConfigContext"
import bridge from "./config/bridge"

export default function ServicesPaymentDemo() {
  const { config } = useConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm-1",
      cardNumber: "4242",
      cardType: "Visa",
      expiryDate: "12/25",
      isDefault: true,
    },
    {
      id: "pm-2",
      cardNumber: "5678",
      cardType: "Mastercard",
      expiryDate: "09/24",
      isDefault: false,
    },
  ])

  const { data = [], isPending } = useGetServices();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        bridge.resize(height);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const handlePayService = async (serviceId: string) => {
    // Simulate API call with random success/failure
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        const randomOutcome = Math.random()

        if (randomOutcome > 0.7) {
          resolve({ success: false, error: "Payment failed" })
        } else {
          resolve({ success: true })
        }
      }, 1500)
    })
  }

  const handleAddPaymentMethod = async (paymentDetails: PaymentFormData) => {
    // Simulate API call to add payment method
    return new Promise<{ success: boolean; paymentMethod?: PaymentMethod; error?: string }>((resolve) => {
      setTimeout(() => {
        // Create a new payment method from the form data
        const newPaymentMethod: PaymentMethod = {
          id: `pm-${Date.now()}`,
          cardNumber: paymentDetails.cardNumber.slice(-4),
          cardType: getCardType(paymentDetails.cardNumber),
          expiryDate: paymentDetails.expiryDate,
          isDefault: paymentMethods.length === 0, // Make default if it's the first card
        }

        // Update state with the new payment method
        setPaymentMethods((prev) => {
          if (prev.length === 0) {
            return [newPaymentMethod]
          }

          // If this should be the default, update existing cards
          if (newPaymentMethod.isDefault) {
            return prev.map((pm) => ({ ...pm, isDefault: false })).concat(newPaymentMethod)
          }

          return [...prev, newPaymentMethod]
        })

        resolve({
          success: true,
          paymentMethod: newPaymentMethod,
        })
      }, 1000)
    })
  }

  return (
    <div className={`container py-10 mx-auto ${config.size === 'compact' ? 'max-w-md' : 'w-full'}`} ref={containerRef}>
      <h1 className="text-3xl font-bold mb-8 text-center">Tus Servicios por pagar</h1>
      <ServicesList
        services={data as Service[]}
        isLoading={isPending}
        paymentMethods={paymentMethods}
        onPayService={handlePayService}
        onAddPaymentMethod={handleAddPaymentMethod}
      />
    </div>
  )
}

