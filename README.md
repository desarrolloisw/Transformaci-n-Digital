# **Proyecto Transformación Digital Integrando Procesos Académicos Inteligentes y Tecnología Avanzada en el Ámbito Universitario** <br><br>


## **Tabla de Contenidos**
- [Resumen](#resumen)
- [Objetivo](#objetivo)
- [Tecnologías y Herramientas](#tecnologías-y-herramientas)
    - [Tecnologías y Herramientas de la Base de Datos](#tecnologías-y-herramientas-de-la-base-de-datos)
    - [Tecnologías y Herramientas del Backend](#tecnologías-y-herramientas-del-backend)    
    - [Tecnologías y Herramientas del Frontend](#tecnologías-y-herramientas-del-frontend)
    - [Tecnologías y Herramientas del Chatbot Vanilla](#tecnologías-y-herramientas-del-chatbot-vanilla)
- [Estructura del Proyecto](#estructura-del-proyecto)
    - [Estructura del Backend](#estructura-del-backend)
    - [Explicación de la Estructura del Backend](#explicación-de-la-estructura-del-backend)
    - [Estructura del Frontend](#estructura-del-frontend)
    - [Explicación de la Estructura del Frontend](#explicación-de-la-estructura-del-frontend)
    - [Estructura del Chatbot Vanilla](#estructura-del-chatbot-vanilla)
    - [Explicación de la Estructura del Chatbot Vanilla](#explicación-de-la-estructura-del-chatbot-vanilla)
- [Características del Sistema](#características-del-sistema)
- [Requisitos Previos](#requisitos-previos)
- [Inicio Rápido](#inicio-rápido)
- [Integraciones](#integraciones)
- [Variables de Entorno](#variables-de-entorno)
- [Deployment](#deployment)
- [Contribuidores](#contribuidores)

<br><br>

## **Resumen**

Sistema web integral de transformación digital para el Departamento de Ciencias del Deporte de la Universidad de Sonora (UNISON), que centraliza y automatiza procesos académicos mediante una plataforma digital moderna con panel administrativo, dashboard analítico y chatbot inteligente híbrido (estático/dinámico).

La plataforma permite la gestión de procesos académicos como Servicio Social y Prácticas Profesionales, con un sistema de preguntas frecuentes (FAQ) estructurado por categorías, métricas de uso en tiempo real, y asistencia virtual automatizada para estudiantes.

<br><br>

## **Objetivo**
Proyecto de Transformación Digital orientado a digitalizar y centralizar procesos académicos clave del departamento mediante la implementación de una plataforma digital con flujos de trabajo automatizados y asistencia virtual (Chatbot).

<br><br>

## **Tecnologías y Herramientas**

### Tecnologías y Herramientas de la Base de Datos
- **MySQL**: Motor de base de datos relacional utilizado para almacenar y gestionar los datos del proyecto.
- **Prisma ORM**: Herramienta de mapeo objeto-relacional que simplifica la interacción con la base de datos mediante un cliente type-safe.

### Tecnologías y Herramientas del Backend
- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework utilizado para crear la API REST, manejar rutas, middlewares y configurar el servidor.
- **Autenticación y privacidad**:
    - **JWT**: Para autenticación basada en tokens seguros.
    - **BCrypt**: Utilizado para el hash seguro de contraseñas.
    - **Crypto**: Para cifrado y descifrado de datos sensibles.
- **CORS**: Habilita solicitudes entre dominios de forma segura.
- **Morgan**: Middleware de logging para HTTP requests.
- **Helmet**: Middleware de seguridad para Express.
- **Zod**: Validación y parsing de esquemas de datos.
- **Luxon**: Manejo avanzado de fechas y tiempo.

### Tecnologías y Herramientas del Frontend
- **React**: Biblioteca principal para la construcción de la interfaz de usuario (v19.1.0).
- **Vite**: Herramienta de desarrollo y bundler para optimizar el rendimiento.
- **Gestión de datos**:
    - **@tanstack/react-query**: Para gestión eficiente de datos, caché y sincronización con el servidor.
    - **Axios**: Cliente HTTP para consumir la API del backend.
- **Estilos**:
    - **Tailwind CSS v4**: Framework de utilidades CSS para diseños responsivos y modernos.
- **Formularios y validación**:
    - **React Hook Form**: Gestión eficiente de formularios con validación.
- **Editor de texto**:
    - **Tiptap**: Editor de texto enriquecido para contenido dinámico.
- **Gráficos y visualización**:
    - **Recharts**: Librería de gráficos responsivos para visualización de datos analíticos.
- **Iconografía**:
    - **React Icons**: Biblioteca completa de iconos para la interfaz.
- **Navegación**:
    - **React Router DOM**: Sistema de enrutamiento para SPA.
- **Lenguajes**: JavaScript (ES6+) y JSX como base del desarrollo.

### Tecnologías y Herramientas del Chatbot Vanilla
- **JavaScript Vanilla**: Implementación pura sin frameworks para máximo rendimiento.
- **HTML5 & CSS3**: Estructura semántica y estilos modernos con animaciones.
- **Fetch API**: Comunicación asíncrona con el backend.
- **CSS Grid & Flexbox**: Layout responsivo y adaptativo.
- **LocalStorage**: Persistencia de historial de conversaciones.
- **SVG Icons**: Iconografía vectorial escalable.

<br><br>

## **Estructura del Proyecto**

### Estructura del Backend
```
backend/
├── package.json                    # Dependencias y scripts del backend
├── prisma/
│   ├── schema.prisma              # Esquema de la base de datos
│   ├── seed.js                    # Datos iniciales para poblar la BD
│   └── migrations/                # Migraciones de la base de datos
├── public/                        # Archivos estáticos del frontend compilado
├── src/
│   ├── index.js                   # Punto de entrada del servidor
│   ├── config/                    # Configuraciones (bcrypt, crypto, jwt, server)
│   ├── controllers/               # Controladores de rutas (lógica de negocio)
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── static-chatbot.controller.js
│   │   ├── dinamic-chatbot.controller.js
│   │   ├── chatbot-config/        # Controladores de configuración del chatbot
│   │   └── dashboard/             # Controladores de métricas y analytics
│   ├── libs/                      # Librerías utilitarias
│   │   ├── prisma.lib.js         # Cliente de Prisma
│   │   ├── jwt.lib.js            # Utilidades JWT
│   │   └── date.lib.js           # Utilidades de fechas
│   ├── middlewares/               # Middlewares de autenticación y validación
│   │   └── auth.middleware.js
│   ├── routes/                    # Definición de rutas de la API
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── static-chatbot.routes.js
│   │   ├── dinamic-chatbot.routes.js
│   │   ├── chatbot-config/        # Rutas de configuración del chatbot
│   │   └── dashboard/             # Rutas de métricas y analytics
│   ├── schemas/                   # Esquemas de validación con Zod
│   │   ├── auth.schema.js
│   │   ├── user.schema.js
│   │   ├── static-chatbot.schema.js
│   │   ├── dinamic-chatbot.schema.js
│   │   ├── chatbot-config/
│   │   └── dashboard/
│   ├── server/                    # Configuración del servidor Express
│   │   └── app.js
│   └── services/                  # Lógica de negocio y servicios
│       ├── auth.service.js
│       ├── user.service.js
│       ├── static-chatbot.service.js
│       ├── dinamic-chatbot.service.js
│       ├── chatbot-config/
│       └── dashboard/
```

### Explicación de la Estructura del Backend

**Arquitectura por capas** que separa responsabilidades:

- **`src/index.js`**: Punto de entrada que inicializa el servidor Express y conecta con la base de datos.
- **`config/`**: Contiene configuraciones centralizadas para bcrypt, crypto, JWT y el servidor.
- **`controllers/`**: Manejan las peticiones HTTP, procesan datos y devuelven respuestas. Separados por funcionalidad (auth, users, chatbot, dashboard).
- **`services/`**: Contienen la lógica de negocio pura, interactúan con la base de datos a través de Prisma ORM.
- **`routes/`**: Definen los endpoints de la API REST y conectan con los controladores correspondientes.
- **`middlewares/`**: Funciones que procesan requests antes de llegar a los controladores (autenticación, validación, CORS).
- **`schemas/`**: Validación de datos de entrada usando Zod para garantizar integridad y seguridad.
- **`libs/`**: Utilidades compartidas como el cliente de Prisma, funciones JWT y manejo de fechas.
- **`prisma/`**: Gestión de la base de datos con esquema, migraciones y datos de semilla.

El backend implementa una **API RESTful** con autenticación JWT, roles de usuario (PAT, COORD), operaciones CRUD completas, sistema de logs para analytics, y integración con servicios de IA para el chatbot dinámico.

### Estructura del Frontend
```
frontend/
├── package.json                   # Dependencias y scripts del frontend
├── vite.config.js                # Configuración de Vite
├── tailwind.config.js            # Configuración de Tailwind CSS
├── eslint.config.js              # Configuración de ESLint
├── index.html                     # HTML principal
├── public/                        # Archivos estáticos públicos
│   ├── Escudo_Unison.png         # Logo de UNISON
│   └── vanilla-chatbot/           # Chatbot vanilla integrado
│       └── script.js
├── src/
│   ├── main.jsx                   # Punto de entrada de React
│   ├── App.jsx                    # Componente raíz de la aplicación
│   ├── index.css                  # Estilos globales con Tailwind
│   ├── api/                       # Hooks y funciones de API con React Query
│   │   ├── auth.api.js           # Autenticación y autorización
│   │   ├── user.api.js           # Gestión de usuarios
│   │   ├── process.api.js        # Procesos académicos
│   │   ├── category.api.js       # Categorías de FAQ
│   │   ├── faq.api.js           # Preguntas frecuentes
│   │   └── dashboard.api.js      # Métricas y analytics
│   ├── assets/                    # Recursos estáticos (imágenes, iconos)
│   ├── components/                # Componentes reutilizables
│   │   ├── ui/                   # Componentes de interfaz base
│   │   │   ├── Sidebar.jsx       # Barra lateral de navegación
│   │   │   ├── Footer.jsx        # Pie de página
│   │   │   ├── Toast.jsx         # Notificaciones
│   │   │   ├── Search.jsx        # Componente de búsqueda
│   │   │   └── CreateModal.jsx   # Modal de creación
│   │   ├── chatbotConfig/        # Gestión de configuración del chatbot
│   │   │   ├── Process.jsx       # Gestión de procesos
│   │   │   ├── Category.jsx      # Gestión de categorías
│   │   │   └── Details.jsx       # Detalles y edición
│   │   ├── dashboard/            # Componentes de dashboard
│   │   │   ├── DashboardProcess.jsx
│   │   │   ├── DashboardCategories.jsx
│   │   │   ├── DashboardCategoriesByProcess.jsx
│   │   │   └── DashboardCharts.jsx
│   │   ├── user/                 # Gestión de usuarios
│   │   └── notFound/             # Páginas de error
│   ├── config/                    # Configuraciones del frontend
│   │   └── enviroments.config.js # Variables de entorno
│   ├── layout/                    # Layouts de la aplicación
│   │   └── PrincipalLayout.jsx   # Layout principal con sidebar
│   ├── libs/                      # Librerías y utilidades
│   ├── pages/                     # Páginas principales de la aplicación
│   │   ├── Login.jsx             # Página de inicio de sesión
│   │   ├── Dashboard.jsx         # Dashboard principal
│   │   ├── Users.jsx             # Gestión de usuarios
│   │   ├── ChatbotConfigPage.jsx # Configuración del chatbot
│   │   ├── ProcessDetails.jsx    # Detalles de proceso
│   │   ├── CategoryDetails.jsx   # Detalles de categoría
│   │   ├── UserDetails.jsx       # Detalles de usuario
│   │   └── notFound/404.jsx      # Página 404
│   ├── routes/                    # Configuración de rutas
│   │   ├── routes.jsx            # Rutas principales
│   │   └── PrivateRoute.jsx      # Rutas protegidas
│   └── vanilla-chatbot/           # Integración del chatbot vanilla
│       └── VanillaChatbot.jsx    # Componente contenedor
```

### Explicación de la Estructura del Frontend

**Arquitectura de componentes** moderna con React y herramientas actuales:

- **`src/main.jsx`**: Punto de entrada que configura React Query y renderiza la aplicación en modo estricto.
- **`src/App.jsx`**: Componente raíz que establece las rutas principales y el contexto global.
- **`api/`**: Hooks personalizados con React Query para gestión de estado del servidor, caché automático y sincronización.
- **`components/`**: Arquitectura modular con componentes reutilizables organizados por funcionalidad.
- **`pages/`**: Páginas principales que combinan múltiples componentes para crear vistas completas.
- **`routes/`**: Sistema de enrutamiento con protección basada en roles y autenticación JWT.
- **`layout/`**: Layouts reutilizables que definen la estructura visual de las páginas.
- **`libs/`**: Utilidades compartidas, funciones helper y lógica reutilizable.

El frontend implementa un **dashboard analítico completo** con gráficos interactivos (Recharts), **panel de administración** para gestión de usuarios y configuración del chatbot, **sistema de autenticación** con roles diferenciados, y **integración híbrida** del chatbot vanilla.

### Estructura del Chatbot Vanilla
```
chatbot (vanilla)/
├── bot/
│   ├── html/
│   │   └── index.html            # Página principal del chatbot standalone
│   ├── img/
│   │   └── Escudo_Unison.png     # Logo de UNISON
│   └── js/
│       └── script.js             # Lógica completa del chatbot

frontend/public/vanilla-chatbot/
└── script.js                     # Versión integrada en React
```

### Explicación de la Estructura del Chatbot Vanilla

**Implementación híbrida dual**:

- **Versión Standalone** (`chatbot (vanilla)/`): Chatbot completamente independiente que puede ejecutarse en cualquier sitio web mediante la inclusión del script.
- **Versión Integrada** (`frontend/public/vanilla-chatbot/`): Versión optimizada para integración con el frontend React, cargada dinámicamente.

**Características técnicas**:

- **Dual Mode**: 
  - **Modo Estático**: Flujo guiado por opciones predefinidas basado en procesos y categorías.
  - **Modo Dinámico**: Chat libre con procesamiento de lenguaje natural y respuestas contextuales.
- **Comunicación con API**: Consume endpoints `/api/chatbot/static` y `/api/chatbot/dinamic` del backend.
- **Gestión de Estado**: Manejo de historial de conversación, sesiones y contexto entre modos.
- **UI/UX Avanzada**: Animaciones CSS, transiciones suaves, diseño responsivo y accesibilidad.
- **Persistencia**: Historial de conversaciones separado por modo (estático/dinámico).

<br><br>

## **Características del Sistema**

### **Panel de Administración**
- **Gestión de Usuarios**: Creación, edición, habilitación/deshabilitación de cuentas con roles diferenciados (PAT, COORD).
- **Configuración de Chatbot**: Administración completa de procesos académicos, categorías y respuestas FAQ.
- **Sistema de Roles**: Permisos granulares basados en tipos de usuario.

### **Dashboard Analítico**
- **Métricas en Tiempo Real**: Visualización de estadísticas de uso del chatbot.
- **Gráficos Interactivos**: Múltiples tipos de visualización (barras, circular, líneas, área, radar).
- **Filtros Temporales**: Análisis por rangos de fechas personalizables.
- **Análisis por Proceso**: Métricas específicas por proceso académico.

### **Chatbot Inteligente Híbrido**
- **Modo Estático**: Flujo guiado por opciones para consultas estructuradas.
- **Modo Dinámico**: Procesamiento de lenguaje natural para consultas libres.
- **Respuestas Contextuales**: Sistema de scoring y relevancia para respuestas precisas.
- **Historial Persistente**: Conservación de contexto entre sesiones.

### **Gestión de Contenido**
- **Editor Rico**: Edición de respuestas FAQ con formato HTML.
- **Categorización**: Sistema de procesos y categorías para organización de contenido.
- **Versionado**: Control de cambios en configuraciones.

<br><br>

## **Requisitos Previos**

- **Node.js** (v18.0.0 o superior)
- **pnpm** (v8.0.0 o superior) - Gestor de paquetes preferido
- **MySQL** (v8.0 o superior)
- **Git** para control de versiones

**Verificación de requisitos:**
```bash
node --version
pnpm --version
mysql --version
git --version
```

<br><br>

## **Inicio Rápido**

### **1. Clonar el repositorio**
```bash
git clone https://github.com/desarrolloisw/Transformaci-n-Digital.git
cd Transformaci-n-Digital
```

### **2. Configuración del Backend**
```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
pnpm install

# Configurar variables de entorno (crear .env)
cp .env.example .env
# Editar .env con tus configuraciones de base de datos

# Ejecutar migraciones de Prisma
pnpm prisma:migrate

# Poblar la base de datos con datos iniciales
pnpm prisma:seed

# Iniciar servidor de desarrollo
pnpm dev
```

### **3. Configuración del Frontend**
```bash
# En una nueva terminal, navegar al directorio del frontend
cd frontend

# Instalar dependencias
pnpm install

# Configurar variables de entorno (crear .env)
cp .env.example .env
# Editar .env con la URL del backend

# Iniciar servidor de desarrollo
pnpm dev
```

### **4. Acceso a la aplicación de forma local**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Chatbot Vanilla**: http://localhost:5173/ (ruta raíz)
- **Panel Admin**: http://localhost:5173/admin

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

<br><br>

## **Integraciones**

### **Base de Datos**
- **MySQL** con **Prisma ORM**
- Migraciones automáticas y esquemas type-safe
- Seeding automático de datos iniciales

### **Autenticación**
- **JWT** (JSON Web Tokens) para sesiones seguras
- **BCrypt** para hashing de contraseñas
- Middleware de autorización basado en roles

### **APIs Externas**
- **Hugging Face API** para procesamiento de lenguaje natural en el chatbot dinámico
- Servicios de IA para análisis de sentimientos y respuestas contextuales

### **Monitoreo y Logs**
- **Morgan** para logging de requests HTTP
- Sistema de métricas personalizado para analytics del chatbot
- Tracking de acciones de usuario para dashboard

<br><br>

## **Variables de Entorno**

### **Backend (.env)**
```env
# Base de datos
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/transformacion_digital"

# JWT
JWT_SECRET="tu_jwt_secret_muy_seguro"
JWT_EXPIRES_IN="7d"

# Encriptación
CRYPTO_SECRET_KEY="tu_crypto_secret_de_32_caracteres"

# Servidor
PORT=3000
NODE_ENV=development

# APIs externas (opcional) - Para uso de IA (Próximamente)
HUGGINGFACE_API_KEY="tu_huggingface_api_key"
```

### **Frontend (.env)**
```env
# URL del backend
VITE_BACKEND_URL=http://localhost:3000

# Configuración de desarrollo
VITE_APP_NAME="Transformación Digital UNISON"
VITE_APP_VERSION="1.0.0"
```

<br><br>

## **Deployment**

### **Servidor Debian con pnpm**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Instalar PM2 para gestión de procesos
npm install -g pm2

# Clonar proyecto
git clone https://github.com/desarrolloisw/Transformaci-n-Digital.git
cd Transformaci-n-Digital

# Configurar backend
cd backend
pnpm install --production
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed

# Configurar frontend
cd ../frontend
pnpm install
pnpm build

# Copiar build al backend/public
cp -r dist/* ../backend/public/

# Iniciar con PM2
cd ../backend
pm2 start ecosystem.config.js

# Configurar auto-restart en reinicio del sistema
pm2 startup
pm2 save
```

### **Configuración de PM2 (ecosystem.config.js) - Opcional**
```javascript
module.exports = {
  apps: [{
    name: 'transformacion-digital',
    script: 'src/index.js',
    cwd: './backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

<br><br>

## **Contribuidores**

### **Equipo de Desarrollo**
- **[desarrolloisw](https://github.com/desarrolloisw)** - Organización principal
- **[Alejandro Fontes Fernández](https://github.com/alexfonfdz)** - Idea, creador y desarrollador
- **[Repositorio del Proyecto](https://github.com/desarrolloisw/Transformaci-n-Digital)** - Código fuente

### **Universidad de Sonora**
- **Departamento de Ciencias del Deporte** - Cliente y usuario final

### **Tecnologías y Créditos**
- React, Vite, Tailwind CSS, Node.js, Express, Prisma, MySQL
- Iconografía: React Icons, Escudo UNISON oficial
- Hosting y deployment: Infraestructura propia UNISON

**Para contribuir al proyecto, consulta las [issues abiertas](https://github.com/desarrolloisw/Transformaci-n-Digital/issues).**
