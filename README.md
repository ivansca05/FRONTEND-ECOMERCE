# FRONTEND-ECOMERCE

Interfaz web de una plataforma de comercio electrónico local diseñada para que los usuarios puedan navegar productos, autenticarse, gestionar su carrito y finalizar compras de forma rápida y sencilla. La experiencia está pensada para minimizar fricción en el proceso de compra, mantener un flujo claro de navegación y ofrecer un acceso diferenciado para administradores que gestionan productos desde un panel dedicado.

## Título y Descripción

Este proyecto es el frontend de una solución de e-commerce local orientada a pequeños negocios. La interfaz prioriza:

- navegación simple y rápida por productos,
- autenticación de usuarios con sesión persistente,
- carrito de compras sincronizado entre cliente y backend,
- proceso de checkout con envío de la orden hacia el backend,
- redirección al flujo de pago,
- panel administrativo para crear, editar y eliminar productos.

La aplicación actúa como capa de presentación de la API, consumiendo los servicios del backend para productos, autenticación, carrito y órdenes.

## Stack Tecnológico

- **React 19**
- **Vite 7** como herramienta de desarrollo y empaquetado
- **React Router 7** para navegación y rutas protegidas
- **Axios** para consumo de API
- **React Hook Form** para formularios de login, registro y checkout
- **React Hot Toast** para notificaciones de éxito y error
- **React Icons** para iconografía
- **Tailwind CSS** para estilos utilitarios
- **DaisyUI** para componentes visuales sobre Tailwind
- **JavaScript (ES Modules)**

## Prerrequisitos

Antes de ejecutar el proyecto, asegúrate de contar con lo siguiente:

- **Node.js 20.19+** o una versión superior compatible con Vite 7.
- **npm** instalado junto con Node.js.
- **Git** para clonar el repositorio.
- El **backend correspondiente** ejecutándose y accesible desde la URL que se configurará en `VITE_BACKEND_URL`.

## Instalación y Despliegue Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/ivansca05/FRONTEND-ECOMERCE.git
cd FRONTEND-ECOMERCE
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo llamado `.env` en la raíz del proyecto usando como base el ejemplo de abajo.

### 4. Levantar el entorno de desarrollo

```bash
npm run dev
```

Luego abre la URL que te indique Vite, normalmente:

```bash
http://localhost:5173
```

### 5. Generar build de producción

```bash
npm run build
```

### 6. Previsualizar la build localmente

```bash
npm run preview
```

## Variables de Entorno

Este frontend solo requiere la URL base del backend. En el código, los servicios consumen `import.meta.env.VITE_BACKEND_URL` y construyen desde ahí las rutas de autenticación, carrito, productos y órdenes.

### `.env.example`

```env
VITE_BACKEND_URL=http://localhost:3001/api
```

### Notas de configuración

- Si tu backend corre en otro puerto o dominio, reemplaza la URL anterior.
- Esta variable debe apuntar a la **ruta base de la API**, no a un endpoint específico.
- El frontend envía peticiones con cookies habilitadas para mantener la sesión y la autenticación entre frontend y backend.

## Estructura de Carpetas

```text
src/
├── assets/
├── components/
│   ├── AdminDashboard/
│   │   ├── CreateProductForm/
│   │   ├── TableProductDashboard/
│   │   └── UpdateProductForm/
│   ├── CardProduct/
│   │   └── CardProduct.jsx
│   ├── Login/
│   │   └── LoginForm.jsx
│   ├── Navbar/
│   │   ├── AuthButtons.jsx
│   │   ├── Cart.jsx
│   │   ├── ModalCart.jsx
│   │   ├── Navbar.jsx
│   │   └── UserDropDown.jsx
│   ├── ProtectedRoute/
│   │   └── ProtectedRoute.jsx
│   └── Register/
│       └── RegisterForm.jsx
├── context/
│   ├── CartContext.jsx
│   ├── ProductContext.jsx
│   └── UserContext.jsx
├── layout/
│   ├── DashboardLayout.jsx
│   └── Layout.jsx
├── pages/
│   ├── AdminDashboard.jsx
│   ├── Checkout.jsx
│   ├── CreateProduct.jsx
│   ├── DetailProduct.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── PaymentFailure.jsx
│   ├── PaymentPending.jsx
│   ├── PaymentSuccess.jsx
│   ├── Register.jsx
│   └── UpdateProducts.jsx
├── services/
│   ├── authServices.js
│   ├── cartServices.js
│   └── orderServices.js
├── App.jsx
├── index.css
└── main.jsx
```

### Descripción de las carpetas principales

- **components/**: contiene componentes reutilizables de UI y módulos específicos como navegación, login, registro y administración.
- **context/**: centraliza el estado global de usuario, productos y carrito.
- **layout/**: define estructuras visuales generales para la aplicación pública y el panel administrativo.
- **pages/**: reúne las vistas principales de la aplicación, incluyendo home, checkout, autenticación y estados de pago.
- **services/**: encapsula la lógica de comunicación con la API del backend.
- **assets/**: almacena recursos estáticos como imágenes o íconos del proyecto.

## Scripts disponibles

Los comandos definidos en `package.json` son los siguientes:

### `npm run dev`
Inicia el servidor de desarrollo de Vite con hot reload.

### `npm run build`
Genera la versión optimizada de producción en la carpeta `dist/`.

### `npm run preview`
Sirve localmente la build generada para validar el resultado final antes de desplegar.

### `npm run lint`
Ejecuta ESLint sobre el proyecto para detectar errores de estilo y posibles problemas de código.

## Flujo funcional principal

La aplicación está organizada para cubrir el ciclo completo de compra:

1. El usuario entra al home y visualiza productos.
2. Puede registrarse o iniciar sesión.
3. El carrito se mantiene sincronizado entre sesión autenticada y almacenamiento local.
4. En checkout se capturan los datos de envío.
5. Se crea la orden en el backend y se redirige al flujo de pago.
6. El administrador dispone de un área protegida para gestionar el catálogo.

## Observaciones técnicas

- La sesión del usuario se valida desde el backend al cargar la aplicación.
- El carrito soporta persistencia local como respaldo y sincronización cuando el usuario inicia sesión.
- Las rutas administrativas están protegidas para evitar acceso no autorizado.
- Las peticiones HTTP se realizan con `withCredentials` para mantener cookies de sesión.
- La interfaz usa Tailwind CSS con DaisyUI para acelerar el desarrollo visual y mantener consistencia en componentes.

## Recomendación de uso en local

Para que el frontend funcione correctamente, el backend debe estar disponible y la variable `VITE_BACKEND_URL` debe coincidir con su base real. Si el backend cambia de puerto, dominio o prefijo, ajusta únicamente esa variable sin modificar el resto del código.
