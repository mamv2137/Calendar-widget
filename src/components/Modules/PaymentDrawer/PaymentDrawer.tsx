"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, Calendar, User, Lock, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { PaymentFormData, PaymentMethod } from "@/types"

interface PaymentMethodDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceName: string
  serviceAmount: number
  serviceCurrency: string
  paymentMethods: PaymentMethod[]
  onAddPaymentMethod: (
    paymentDetails: PaymentFormData,
  ) => Promise<{ success: boolean; paymentMethod?: PaymentMethod; error?: string }>
  onPayWithExistingMethod: (paymentMethodId: string) => void
  onSuccess: (paymentMethodId: string) => void
}

export function PaymentMethodDrawer({
  open,
  onOpenChange,
  serviceName,
  serviceAmount,
  serviceCurrency,
  paymentMethods,
  onAddPaymentMethod,
  onPayWithExistingMethod,
  onSuccess,
}: PaymentMethodDrawerProps) {
  const [activeTab, setActiveTab] = useState<string>(paymentMethods.length > 0 ? "existing" : "new")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentMethods.length > 0 ? paymentMethods.find((pm) => pm.isDefault)?.id || paymentMethods[0].id : "",
  )
  const [formData, setFormData] = useState<PaymentFormData>({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    saveCard: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setFormData({ ...formData, [name]: formattedValue })
      return
    }

    // Format expiry date
    if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .slice(0, 5)

      setFormData({ ...formData, [name]: formattedValue })
      return
    }

    // Format CVC
    if (name === "cvc") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 3)
      setFormData({ ...formData, [name]: formattedValue })
      return
    }

    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, saveCard: checked })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required"
    }

    if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Valid card number is required"
    }

    if (!formData.expiryDate.trim() || !formData.expiryDate.includes("/")) {
      newErrors.expiryDate = "Valid expiry date is required"
    } else {
      const [month, year] = formData.expiryDate.split("/")
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1

      if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
        newErrors.expiryDate = "Invalid month"
      } else if (
        Number.parseInt(year) < currentYear ||
        (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = "Card has expired"
      }
    }

    if (!formData.cvc.trim() || formData.cvc.length < 3) {
      newErrors.cvc = "Valid CVC is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitNewCard = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const result = await onAddPaymentMethod(formData)

      if (result.success && result.paymentMethod) {
        onSuccess(result.paymentMethod.id)
        onOpenChange(false)
      } else {
        setErrors({ form: result.error || "Failed to add payment method" })
      }
    } catch (error) {
      setErrors({ form: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePayWithSelected = () => {
    if (selectedPaymentMethod) {
      onPayWithExistingMethod(selectedPaymentMethod)
      onOpenChange(false)
    }
  }

  const getCardIcon = (cardType: string) => {
    // In a real app, you might want to use specific card brand icons
    return <CreditCard className="h-6 w-6 text-primary" />
  }

  const getCardTypeColor = (cardType: string) => {
    switch (cardType.toLowerCase()) {
      case "visa":
        return "bg-blue-50 border-blue-200"
      case "mastercard":
        return "bg-orange-50 border-orange-200"
      case "american express":
        return "bg-green-50 border-green-200"
      case "discover":
        return "bg-purple-50 border-purple-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Payment Method</DrawerTitle>
            <DrawerDescription>
              Pay for {serviceName} ({formatCurrency(serviceAmount, serviceCurrency)})
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {paymentMethods.length > 0 && (
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="existing">Saved Cards</TabsTrigger>
                  <TabsTrigger value="new">New Card</TabsTrigger>
                </TabsList>
              )}

              {paymentMethods.length > 0 && (
                <TabsContent value="existing" className="mt-0">
                  <div className="space-y-4">
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onValueChange={setSelectedPaymentMethod}
                      className="space-y-3"
                    >
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`relative flex items-center rounded-lg border p-4 ${
                            selectedPaymentMethod === method.id ? "border-primary" : "border-input"
                          } ${getCardTypeColor(method.cardType)}`}
                        >
                          <RadioGroupItem value={method.id} id={method.id} className="absolute right-4" />
                          <Label htmlFor={method.id} className="flex flex-1 cursor-pointer items-center gap-4">
                            <div className="flex-shrink-0">{getCardIcon(method.cardType)}</div>
                            <div className="flex-1">
                              <p className="font-medium">{method.cardType}</p>
                              <p className="text-sm text-muted-foreground">•••• •••• •••• {method.cardNumber}</p>
                              <p className="text-xs text-muted-foreground">Expires {method.expiryDate}</p>
                            </div>
                            {method.isDefault && (
                              <span className="text-xs font-medium text-primary flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Default
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <Button onClick={handlePayWithSelected} className="w-full mt-6">
                      Pay Now
                    </Button>
                  </div>
                </TabsContent>
              )}

              <TabsContent value="new" className="mt-0">
                <form onSubmit={handleSubmitNewCard} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="cardholderName"
                        name="cardholderName"
                        placeholder="John Smith"
                        className="pl-10"
                        value={formData.cardholderName}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.cardholderName && <p className="text-sm text-red-500">{errors.cardholderName}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        className="pl-10"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          className="pl-10"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="cvc"
                          name="cvc"
                          placeholder="123"
                          className="pl-10"
                          value={formData.cvc}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.cvc && <p className="text-sm text-red-500">{errors.cvc}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="saveCard" checked={formData.saveCard} onCheckedChange={handleCheckboxChange} />
                    <Label htmlFor="saveCard" className="text-sm font-normal">
                      Save this card for future payments
                    </Label>
                  </div>

                  {errors.form && <p className="text-sm text-red-500 mt-2">{errors.form}</p>}

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Add Payment Method & Pay"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          <DrawerFooter className="px-4">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

