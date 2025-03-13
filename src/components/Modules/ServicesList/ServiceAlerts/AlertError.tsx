import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { XCircle } from 'lucide-react'
import { AlertProps } from './types'

const AlertError = ({ serviceName }: AlertProps) => (
  <Alert variant="error">
    <XCircle />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>An error occurred while processing your payment for {serviceName}. Please try again later.</AlertDescription>
  </Alert>
)

export default AlertError