# Plan de Desarrollo: Aplicación React Embebida para Visualización de Servicios por Pagar

## Objetivos

### Objetivo General
Desarrollar una aplicación web en React que pueda ser embebida en un iframe en otros sitios web, con el fin de mostrar los servicios por pagar de un cliente específico, integrando un backend basado en AWS Lambda y API Gateway.

### Objetivos Específicos
- Diseñar una interfaz de usuario moderna y responsiva utilizando React, Tailwind CSS y componentes de Shadcn.
- Implementar una arquitectura robusta que permita la comunicación segura entre el widget embebido y el sitio host mediante `postMessage`.
- Desarrollar funciones backend utilizando AWS Lambdas y exponerlas a través de API Gateway para gestionar la obtención y actualización de servicios.
- Configurar medidas de seguridad como CORS, autenticación y restricciones de dominio tanto en el frontend como en el backend.
- Garantizar la modularidad y escalabilidad de la aplicación, facilitando futuras mejoras y mantenimientos.

## Plan de Trabajo / Desarrollo

1. **Análisis y Requerimientos**
   - Recopilar información sobre los servicios a visualizar y definir casos de uso específicos.
   - Identificar requerimientos funcionales y de seguridad.

2. **Diseño de la Arquitectura**
   - **Frontend:** Diseñar la aplicación en React utilizando Tailwind CSS y componentes de Shadcn.
   - **Backend:** Definir funciones en AWS Lambda expuestas mediante API Gateway.
   - **Comunicación:** Establecer un protocolo seguro de comunicación con `postMessage` para interactuar con el sitio host.

3. **Desarrollo del Frontend**
   - Configurar el entorno (por ejemplo, usando Create React App o Vite).
   - Implementar la estructura de carpetas y los componentes necesarios para visualizar la información.
   - Integrar la funcionalidad para recibir configuraciones (tema, tamaño, etc.) desde el host mediante `postMessage`.

4. **Desarrollo del Backend**
   - Crear funciones en AWS Lambda para:
     - **GET /api/services:** Recuperar la lista de servicios por pagar.
     - **POST /api/services/update:** Actualizar el estado de un servicio.
   - Configurar API Gateway para exponer estos endpoints y aplicar las medidas de seguridad necesarias.

5. **Pruebas e Integración**
   - Realizar pruebas unitarias y de integración en el frontend y backend.
   - Validar la correcta comunicación entre el widget embebido y el sitio host.
   - Verificar el cumplimiento de las políticas de seguridad (CORS, autenticación, etc.).

6. **Documentación y Entrega**
   - Elaborar un README detallado con instrucciones para la instalación, configuración y despliegue.
   - Documentar las decisiones técnicas y posibles mejoras a futuro.
   - Entregar el proyecto en un repositorio (GitHub/GitLab).

## Arquitectura de Carpetas en React, Dependencias y Tecnologías

### Estructura de Carpetas

calendar-widget/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Calendar/
│   │   │   ├── Calendar.jsx
│   │   │   ├── CalendarHeader.jsx
│   │   │   ├── CalendarGrid.jsx
│   │   │   ├── CalendarDay.jsx
│   │   │   ├── CalendarEvent.jsx
│   │   │   ├── Calendar.module.css
│   │   │   └── index.js
│   │   ├── EventForm/
│   │   │   ├── EventForm.jsx
│   │   │   ├── EventForm.module.css
│   │   │   └── index.js
│   │   ├── EventDetails/
│   │   │   ├── EventDetails.jsx
│   │   │   ├── EventDetails.module.css
│   │   │   └── index.js
│   │   └── common/
│   │       ├── Button/
│   │       ├── Loader/
│   │       └── ErrorBoundary/
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── CalendarContext.jsx
│   │   └── ConfigContext.jsx
│   ├── hooks/
│   │   ├── useEvents.js
│   │   ├── useCalendarNavigation.js
│   │   ├── useCache.js
│   │   └── usePostMessage.js
│   ├── services/
│   │   ├── api.js
│   │   ├── eventService.js
│   │   ├── auth.js
│   │   └── cache.js
│   ├── utils/
│   │   ├── dateUtils.js
│   │   ├── postMessage.js
│   │   ├── eventFormatter.js
│   │   └── colorUtils.js
│   ├── App.jsx
│   ├── index.js
│   └── config.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── vite.config.js


### Dependencias y Tecnologías a Utilizar
- **React:** Librería para construir la interfaz de usuario.
- **Tailwind CSS:** Framework para estilos y diseño responsivo.
- **Shadcn:** Biblioteca de componentes UI para React.
- **API Gateway & AWS Lambdas:** Infraestructura para el backend.
- **Otras Dependencias:**
  - Axios (o uso nativo de Fetch API) para realizar llamadas HTTP.
  - Librerías para autenticación (por ejemplo, JWT) según el mecanismo seleccionado.
  - Herramientas de desarrollo como ESLint y Prettier.

## Diseño del Esquema del API (AWS Lambdas)

### Endpoints y Funcionalidades

1. **GET /api/services**
   - **Descripción:** Recupera la lista de servicios por pagar para un cliente específico.
   - **Respuesta Ejemplo:**
     ```json
     [
       {
         "id": "service1",
         "description": "Servicio de mantenimiento",
         "amount": 150.00,
         "dueDate": "2025-05-01T00:00:00Z"
       },
       {
         "id": "service2",
         "description": "Servicio de consultoría",
         "amount": 300.00,
         "dueDate": "2025-05-15T00:00:00Z"
       }
     ]
     ```

2. **POST /api/services/update**
   - **Descripción:** Actualiza el estado de un servicio (por ejemplo, marcarlo como pagado).
   - **Payload de Solicitud:**
     ```json
     {
       "id": "service1",
       "status": "paid"
     }
     ```
   - **Respuesta Ejemplo:**
     ```json
     {
       "message": "Servicio actualizado exitosamente."
     }
     ```

## Consideraciones de Seguridad

1. **CORS:**
   - Configurar API Gateway para permitir solicitudes únicamente desde dominios autorizados (ejemplo: `https://cliente-especifico.com`).
   - Incluir en las respuestas de las Lambdas los encabezados:
     ```
     Access-Control-Allow-Origin: https://cliente-especifico.com
     Access-Control-Allow-Methods: GET, POST, OPTIONS
     Access-Control-Allow-Headers: Content-Type, Authorization
     ```

2. **Autenticación:**
   - Implementar un mecanismo de autenticación (por ejemplo, JWT o API Keys) para proteger los endpoints.
   - Validar los tokens en cada solicitud utilizando un Lambda Authorizer en API Gateway.

3. **Restricciones de Dominio:**
   - En el frontend, utilizar `postMessage` para comunicarse únicamente con dominios verificados, validando el `event.origin` de cada mensaje.
   - Definir políticas en API Gateway que restrinjan el acceso basado en dominios o direcciones IP.

4. **Configuración en API Gateway:**
   - Habilitar y configurar CORS correctamente.
   - Configurar un Lambda Authorizer o utilizar AWS Cognito para gestionar el acceso.
   - Establecer reglas de seguridad que limiten el acceso según el origen, la IP o la autenticación.
