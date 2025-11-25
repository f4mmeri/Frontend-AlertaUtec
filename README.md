# 🚨 Alerta UTEC - Sistema de Gestión de Incidentes

<div align="center">

![Alerta UTEC](https://img.shields.io/badge/Alerta-UTEC-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?style=for-the-badge&logo=tailwind-css)

**Sistema moderno y eficiente para reportar, gestionar y resolver incidentes en el campus universitario**

[Características](#-características-principales) • [Instalación](#-instalación) • [Uso](#-guía-de-uso) • [Tecnologías](#-stack-tecnológico)

</div>

---

## 📋 Descripción del Proyecto

**Alerta UTEC** es una aplicación web moderna diseñada para la Universidad de Ingeniería y Tecnología (UTEC) que permite a estudiantes, trabajadores y administradores gestionar incidentes del campus de manera eficiente y en tiempo real.

El sistema facilita la comunicación entre la comunidad universitaria y el personal de mantenimiento, permitiendo reportar problemas de infraestructura, seguridad, limpieza y otros servicios del campus con actualizaciones instantáneas mediante WebSockets.

### 🎯 Problema que Resuelve

- **Comunicación fragmentada**: Centraliza todos los reportes de incidentes en un solo lugar
- **Lentitud en respuestas**: Sistema de notificaciones en tiempo real para actualizaciones instantáneas
- **Falta de trazabilidad**: Seguimiento completo del ciclo de vida de cada incidente
- **Asignación ineficiente**: Sistema inteligente de asignación de trabajadores según disponibilidad

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- **Sistema de registro** con validación completa de campos
- **Inicio de sesión** seguro con tokens JWT
- **Validación de correo institucional** (@utec.edu.pe)
- **Roles de usuario** con permisos diferenciados
- **Protección de rutas** basada en autenticación

### 👥 Gestión de Usuarios

#### 🎓 **Estudiante (Alumno)**
- Registro con código de estudiante
- Selección de facultad y carrera
  - **Facultades**: Computación, Negocios, Ingeniería
  - **Carreras dinámicas** según la facultad seleccionada
- Reportar incidentes con descripción detallada
- Seguimiento de sus propios reportes
- Visualización del estado de sus incidentes

#### 👷 **Trabajador (Worker)**
- Registro con especialidad y departamento
- Visualización de incidentes asignados
- Actualización del estado de incidentes
- Comentarios en tiempo real
- Gestión de carga de trabajo

#### 👨‍💼 **Administrador (Admin)**
- Vista completa de todos los incidentes
- Asignación manual de trabajadores a incidentes
- Gestión de usuarios y permisos
- Estadísticas y reportes del sistema
- Panel de control completo

### 📊 Sistema de Incidentes

#### 📝 **Creación de Incidentes**
- **Título y descripción** detallada del problema
- **Categorías disponibles**:
  - 🔧 Mantenimiento General
  - 🛡️ Seguridad
  - 🏗️ Infraestructura
  - 🧹 Limpieza
  - ⚡ Electricidad
  - 🔌 Plomería
  - 💻 Sistemas y Tecnología
  - 🛗 Elevadores
  - 📦 Otros

- **Niveles de prioridad**:
  - 🟢 Baja
  - 🟡 Media
  - 🔴 Alta
  - 🔴 Urgente

- **Ubicación del incidente**:
  - Edificio
  - Piso
  - Sala/Aula
  - Descripción adicional

#### 🔄 **Estados del Incidente**
1. **Pendiente**: Recién reportado, esperando asignación
2. **Asignado**: Trabajador asignado al incidente
3. **En Progreso**: Trabajo activo en la resolución
4. **Resuelto**: Incidente solucionado, pendiente de confirmación
5. **Cerrado**: Incidente completamente finalizado

#### 🔍 **Filtrado y Búsqueda**
- Búsqueda por texto en título y descripción
- Filtro por estado (pendiente, asignado, en progreso, etc.)
- Filtro por prioridad (baja, media, alta, urgente)
- Filtro por categoría
- Vista personalizada según el rol del usuario

### 📈 Dashboard Interactivo

#### 📊 **Panel de Estadísticas**
- **Tarjetas de métricas**:
  - ⏰ Pendientes
  - 🔄 En Progreso
  - ✅ Resueltos
  - ⚡ Urgentes

#### 🚀 **Accesos Rápidos**
- Crear nuevo incidente (estudiantes)
- Ver todos los incidentes
- Mis asignados (trabajadores)
- Panel de administración (admins)

#### 📋 **Incidentes Recientes**
- Lista de los últimos 5 incidentes
- Vista rápida de estado y prioridad
- Navegación directa a detalles

### ⚡ Actualizaciones en Tiempo Real
- **WebSocket Integration**: Actualizaciones instantáneas sin recargar la página
- **Notificaciones push**: Alerts para nuevos incidentes y cambios de estado
- **Sincronización automática**: Todos los usuarios ven cambios en tiempo real

### 🎨 Diseño Moderno

#### **Interfaz de Usuario**
- ✨ Diseño moderno con **glassmorphism**
- 🌈 Gradientes animados de fondo
- 🎭 Animaciones suaves y transiciones fluidas
- 📱 **Totalmente responsive** para móviles, tablets y desktop
- 🌙 Tema oscuro con paleta de colores UTEC
- 🎯 **UX intuitiva** con navegación clara

#### **Componentes Visuales**
- Tarjetas con efecto glassmorphism
- Animaciones de entrada (fade-in, slide-up)
- Blobs animados en el fondo
- Hover effects interactivos
- Iconos de Lucide React
- Logo UTEC integrado

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.2.0** - Biblioteca de UI
- **TypeScript 5.9.3** - Tipado estático
- **Vite 6.1.0** - Build tool y dev server
- **React Router DOM 7.9.6** - Enrutamiento
- **Tailwind CSS 4.1.17** - Framework de estilos
- **Lucide React** - Iconos modernos

### Backend Integration
- **Axios 1.13.2** - Cliente HTTP
- **WebSocket API** - Comunicación en tiempo real
- **JWT Tokens** - Autenticación segura

### Desarrollo
- **ESLint** - Linter de código
- **TypeScript ESLint** - Linting para TypeScript

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (incluido con Node.js)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd Frontend-AlertaUtec
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (si es necesario)
   
   Las URLs de API están configuradas en `src/utils/constants.ts`:
   ```typescript
   export const API_BASE_URL = 'https://gvi4wdtw7f.execute-api.us-east-1.amazonaws.com';
   export const WS_URL = 'wss://3hvxj1td1d.execute-api.us-east-1.amazonaws.com/dev';
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```
   
   La aplicación estará disponible en `http://localhost:5173`

5. **Build para producción**
   ```bash
   npm run build
   ```

6. **Preview del build de producción**
   ```bash
   npm run preview
   ```

---

## 📖 Guía de Uso

### 🏠 Página de Inicio (Landing Page)

**Ruta**: `/` o `/landing`

Al acceder por primera vez, verás la página de bienvenida con:

- **Información del sistema**: Descripción de Alerta UTEC
- **Características principales**: Beneficios del sistema
- **Cómo funciona**: Proceso paso a paso
- **Botones de acción**:
  - 🔵 **Comienza ahora**: Te lleva al registro
  - ⚪ **Iniciar Sesión**: Te lleva al login

**Navegación**:
- Header con logo UTEC
- Botones de "Iniciar Sesión" y "Registrarse"

### 🔐 Registro de Usuario

**Ruta**: `/register`

#### **Para Estudiantes**:

1. **Información Personal**:
   - Nombre completo
   - Correo institucional (@utec.edu.pe o @alumno.utec.edu.pe)
   - Contraseña (mínimo 8 caracteres, con mayúscula, minúscula y número)
   - Teléfono (con selector de país, por defecto +51 Perú)

2. **Información Académica**:
   - Código de estudiante
   - Facultad (Computación, Negocios, Ingeniería)
   - Carrera (se filtra automáticamente según la facultad)

#### **Para Trabajadores**:

1. **Información Personal**:
   - Nombre completo
   - Correo institucional
   - Contraseña
   - Teléfono

2. **Información Profesional**:
   - Especialidad (ej: Electricista, Plomero)
   - Departamento (ej: Mantenimiento, Seguridad)

#### **Validaciones**:

- ✅ Email debe ser institucional de UTEC
- ✅ Contraseña con requisitos de seguridad
- ✅ Todos los campos obligatorios marcados con *
- ✅ Mensajes de error específicos por campo
- ✅ Validación en tiempo real al perder el foco

**Botón "Volver"**: Regresa a la página de inicio

### 🔑 Inicio de Sesión

**Ruta**: `/login`

1. Ingresa tu **correo institucional**
2. Ingresa tu **contraseña**
3. Haz clic en **"Ingresar"**

Si no tienes cuenta, puedes hacer clic en **"Regístrate"** al final del formulario.

**Botón "Volver"**: Regresa a la página de inicio

### 📊 Dashboard Principal

**Ruta**: `/dashboard` (requiere autenticación)

El dashboard es diferente según tu rol:

#### **Para Todos los Usuarios**:

**Panel de Estadísticas**:
- 📈 4 tarjetas con métricas:
  - ⏰ **Pendientes**: Número de incidentes pendientes
  - 🔄 **En Progreso**: Incidentes en proceso de resolución
  - ✅ **Resueltos**: Incidentes ya solucionados
  - ⚡ **Urgentes**: Incidentes con prioridad urgente

**Accesos Rápidos**:
- **Ver Incidentes**: Ver lista completa de incidentes

#### **Acciones por Rol**:

**Estudiantes**:
- ➕ **Crear Incidente**: Botón para reportar nuevo problema

**Trabajadores**:
- ✅ **Mis Asignados**: Ver incidentes asignados a ti

**Incidentes Recientes**:
- Lista de los últimos 5 incidentes
- Muestra: título, ubicación, prioridad y estado
- Clic en cualquier incidente para ver detalles

**Header del Dashboard**:
- Logo UTEC
- Nombre del usuario y rol
- 🔔 Icono de notificaciones
- 🏠 Botón Home (lleva al dashboard)
- 🚪 Botón de cerrar sesión

### 📝 Gestión de Incidentes

**Ruta**: `/incidents` (requiere autenticación)

#### **Crear Nuevo Incidente** (Solo Estudiantes)

1. Haz clic en el botón **"Nuevo Incidente"** o **"Crear Incidente"**
2. Completa el formulario:
   - **Título**: Nombre descriptivo del problema
   - **Descripción**: Detalles del incidente
   - **Categoría**: Selecciona el tipo (Mantenimiento, Seguridad, etc.)
   - **Prioridad**: Baja, Media, Alta o Urgente
   - **Ubicación**:
     - Edificio
     - Piso
     - Sala/Aula
     - Descripción adicional (opcional)
3. Haz clic en **"Crear Incidente"**

El incidente se creará con estado **"Pendiente"** y aparecerá en tiempo real para todos los usuarios.

#### **Ver y Filtrar Incidentes**

**Barra de Búsqueda**:
- Busca por título o descripción
- Búsqueda en tiempo real

**Filtros**:
- **Estado**: Pendiente, Asignado, En Progreso, Resuelto, Cerrado
- **Prioridad**: Baja, Media, Alta, Urgente
- **Categoría**: Todos los tipos disponibles

**Vista de Tarjetas**:
- Cada incidente muestra:
  - 📍 Ubicación (edificio y sala)
  - 🏷️ Categoría
  - ⚠️ Prioridad (con color)
  - 📊 Estado (con color)
  - 👤 Asignado a (si está asignado)
  - ⏰ Fecha de creación
- Clic en cualquier tarjeta para ver detalles completos

#### **Detalles del Incidente**

Al hacer clic en un incidente, se abre un modal con:

**Información Completa**:
- Título y descripción completa
- Ubicación detallada
- Categoría y prioridad
- Estado actual
- Fechas de creación y última actualización
- Usuario que reportó
- Trabajador asignado (si aplica)

**Acciones Disponibles** (según rol):

**Estudiantes**:
- Ver historial del incidente
- Agregar comentarios

**Trabajadores** (para sus incidentes asignados):
- ✅ Cambiar estado:
  - Marcar como "En Progreso"
  - Marcar como "Resuelto"
- 💬 Agregar comentarios
- 📝 Actualizar el incidente

**Administradores**:
- 👷 **Asignar trabajador**: 
  - Selecciona de la lista de trabajadores disponibles
  - Sistema muestra carga de trabajo actual
  - Asignación en tiempo real
- ✅ Cambiar estado del incidente
- 💬 Agregar comentarios
- 📊 Ver estadísticas del trabajador asignado

**Comentarios**:
- Historial completo de comentarios
- Fecha y hora de cada comentario
- Usuario que hizo el comentario
- Orden cronológico (más recientes primero)

#### **Panel Lateral** (Solo Administradores)

**Vista de Trabajadores**:
- Lista de todos los trabajadores
- Carga de trabajo actual
- Especialidad y departamento
- Disponibilidad para asignaciones
- Estadísticas por trabajador

**Asignación Inteligente**:
- Sistema muestra trabajadores con menos carga
- Filtrado por especialidad y departamento
- Asignación con un clic

---

## 🎯 Flujos de Trabajo Principales

### 🔄 Flujo: Reportar y Resolver Incidente

1. **Estudiante reporta incidente**
   - Crea incidente con todos los detalles
   - Estado: **Pendiente**

2. **Administrador asigna trabajador**
   - Selecciona trabajador apropiado
   - Estado cambia a: **Asignado**
   - Notificación en tiempo real

3. **Trabajador toma acción**
   - Ve el incidente en "Mis Asignados"
   - Cambia estado a: **En Progreso**
   - Agrega comentarios de progreso

4. **Trabajador resuelve**
   - Marca como: **Resuelto**
   - Agrega comentario final
   - Notificación al estudiante

5. **Confirmación** (Opcional)
   - Estudiante confirma resolución
   - Estado final: **Cerrado**

### ⚡ Actualizaciones en Tiempo Real

Todas las acciones se propagan instantáneamente:

- ✨ Nuevo incidente creado → Aparece para todos
- 👷 Trabajador asignado → Cambio visible inmediatamente
- 🔄 Estado actualizado → Todos ven el cambio
- 💬 Nuevo comentario → Se agrega en tiempo real
- 🔔 Notificaciones push → Alerts instantáneos

---

## 📁 Estructura del Proyecto

```
Frontend-AlertaUtec/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── NotificationContainer.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── UTECLogo.tsx
│   │
│   ├── context/             # Context API
│   │   ├── AuthContext.tsx      # Autenticación
│   │   ├── NotificationContext.tsx  # Notificaciones
│   │   └── WebSocketContext.tsx     # WebSocket
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useIncidents.ts
│   │   ├── useNotification.ts
│   │   └── useWorkers.ts
│   │
│   ├── pages/               # Páginas principales
│   │   ├── DashboardPage.tsx
│   │   ├── IncidentsPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── services/            # Servicios API
│   │   ├── api.ts              # Cliente Axios
│   │   ├── authService.ts      # Autenticación
│   │   ├── incidentService.ts  # Incidentes
│   │   ├── workerService.ts    # Trabajadores
│   │   └── websocketService.ts # WebSocket
│   │
│   ├── types/               # TypeScript types
│   │   ├── incident.types.ts
│   │   ├── user.types.ts
│   │   └── worker.types.ts
│   │
│   ├── utils/               # Utilidades
│   │   └── constants.ts        # Constantes (CATEGORIES, STATUSES, etc.)
│   │
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globales
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔌 APIs y Servicios

### Endpoints Principales

#### **Autenticación**
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `GET /auth/me` - Obtener usuario actual

#### **Incidentes**
- `GET /incidents` - Listar incidentes (con filtros)
- `POST /incidents` - Crear nuevo incidente
- `GET /incidents/:id` - Obtener detalle de incidente
- `PUT /incidents/:id` - Actualizar incidente
- `DELETE /incidents/:id` - Eliminar incidente (solo admin)
- `POST /incidents/:id/assign` - Asignar trabajador

#### **Trabajadores**
- `GET /workers` - Listar trabajadores
- `GET /workers/:id` - Obtener detalles de trabajador
- `GET /workers/stats` - Estadísticas de trabajadores

### WebSocket Events

- `NEW_INCIDENT` - Nuevo incidente creado
- `UPDATE_INCIDENT` - Incidente actualizado
- `ASSIGN_INCIDENT` - Trabajador asignado
- `DELETE_INCIDENT` - Incidente eliminado
- `UPDATE_WORKER` - Trabajador actualizado

---

## 🎨 Personalización y Estilos

### Paleta de Colores

El sistema usa una paleta de colores inspirada en UTEC:

- **Azul principal**: `blue-900` a `blue-200`
- **Índigo**: `indigo-900`
- **Púrpura**: `purple-900` a `purple-200`
- **Fondo degradado**: Gradiente de azul → índigo → púrpura
- **Glassmorphism**: `white/10` con `backdrop-blur-lg`

### Animaciones

- **fadeIn**: Aparición suave
- **slideUp**: Deslizamiento desde abajo
- **bounceIn**: Entrada con rebote
- **blob**: Animación de formas de fondo
- **Hover effects**: Escalado y transiciones en botones

---

## 🔒 Seguridad

- ✅ Autenticación basada en JWT tokens
- ✅ Validación de correos institucionales
- ✅ Contraseñas seguras (requisitos mínimos)
- ✅ Protección de rutas sensibles
- ✅ Validación de roles y permisos
- ✅ Sanitización de inputs
- ✅ HTTPS en producción

---

## 🚧 Próximas Mejoras

### Funcionalidades Planeadas
- [ ] Sistema de notificaciones por email
- [ ] App móvil (React Native)
- [ ] Reportes y estadísticas avanzadas
- [ ] Sistema de calificaciones para trabajadores
- [ ] Chat en tiempo real por incidente
- [ ] Adjuntar imágenes a incidentes
- [ ] Historial completo de cambios
- [ ] Exportar reportes a PDF/Excel
- [ ] Dashboard de analytics para administradores
- [ ] Sistema de tags/etiquetas personalizadas

### Mejoras Técnicas
- [ ] Tests unitarios y de integración
- [ ] PWA (Progressive Web App)
- [ ] Optimización de bundle size
- [ ] Caché inteligente de datos
- [ ] Modo offline con sincronización
- [ ] Internacionalización (i18n)

---

## 👥 Equipo y Contribución

Este proyecto fue desarrollado para la Universidad de Ingeniería y Tecnología (UTEC).

### Contribuir

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📞 Contacto y Soporte

Para soporte técnico o preguntas:

- **Universidad**: Universidad de Ingeniería y Tecnología - UTEC
- **Ubicación**: Lima, Perú

---

<div align="center">

**Desarrollado con ❤️ para la comunidad UTEC**

![UTEC](https://img.shields.io/badge/Powered%20by-UTEC-blue?style=flat-square)

</div>
