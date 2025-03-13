import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { AlertProps } from './types'

const AlertFailed = ({ serviceName }: AlertProps) => (
  <Alert variant="failed">
    <AlertCircle />
    <AlertTitle>Payment Failed</AlertTitle>
    <AlertDescription>
      Your payment for {serviceName} could not be processed. Please try again or use a different payment method.
    </AlertDescription>
  </Alert>
)

export default AlertFailed