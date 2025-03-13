import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle } from 'lucide-react'
import { AlertProps } from './types'

const AlertSuccess = ({ serviceName }: AlertProps) => (
  <Alert variant="success">
    <CheckCircle />
    <AlertTitle>Payment Successful</AlertTitle>
    <AlertDescription>Your payment for {serviceName} has been processed successfully.</AlertDescription>
  </Alert>
)

export default AlertSuccess