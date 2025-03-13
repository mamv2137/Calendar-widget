import { ServiceAlertManagerProps } from './types'
import { getServiceAlertByStatus } from './utils'

const ServiceAlertManager = ({ service }: ServiceAlertManagerProps) => {
  const AlertComponent = getServiceAlertByStatus(service?.status)
  return AlertComponent ? <AlertComponent serviceName={service?.name} /> : null;
}

export default ServiceAlertManager