export const getCardType = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s+/g, "")

  if (/^4/.test(cleanNumber)) return "Visa"
  if (/^5[1-5]/.test(cleanNumber)) return "Mastercard"
  if (/^3[47]/.test(cleanNumber)) return "American Express"
  if (/^6(?:011|5)/.test(cleanNumber)) return "Discover"

  return "Credit Card"
}