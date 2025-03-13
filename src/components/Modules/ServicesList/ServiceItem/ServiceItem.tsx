import { CheckCircle, AlertCircle, XCircle, CreditCard, Plus } from "lucide-react"
import dayjs from 'dayjs';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ServiceItemProps } from "./types";

export function ServiceItem({ service, paymentMethods, onPaymentClick, isLoading }: ServiceItemProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount)
  }

  const renderStatusAlert = () => {
    if (!service.status || service.status === "pending") return null

    if (service.status === "success") {
      return (
        <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Payment Successful</AlertTitle>
          <AlertDescription>Your payment for {service.name} has been processed successfully.</AlertDescription>
        </Alert>
      )
    }

    if (service.status === "failed") {
      return (
        <Alert className="mt-4 bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle>Payment Failed</AlertTitle>
          <AlertDescription>
            Your payment could not be processed. Please try again or use a different payment method.
          </AlertDescription>
        </Alert>
      )
    }

    if (service.status === "error") {
      return (
        <Alert className="mt-4 bg-red-50 text-red-800 border-red-200">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>An error occurred while processing your payment. Please try again later.</AlertDescription>
        </Alert>
      )
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{service.name}</CardTitle>
        <CardDescription className="line-clamp-2">{service.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold">{formatCurrency(service.amount, service.currency)}</div>
          <div className="text-sm text-muted-foreground">Due: {dayjs(new Date(service.dueDate)).format("MMM d, yyyy")}</div>
        </div>
        {renderStatusAlert()}
      </CardContent>
      <CardFooter className="bg-muted/10 pt-3">
        <Button
          className="w-full"
          onClick={() => onPaymentClick(service)}
          disabled={isLoading || service.status === "success"}
          variant={service.status === "success" ? "outline" : "default"}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center">
              {service.status === "success" ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Paid
                </>
              ) : paymentMethods.length === 0 ? (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment Method
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now
                </>
              )}
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

