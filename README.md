# CER-FreeLancers - CRM Profesional para Freelancers

Un sistema de gestión de relaciones con clientes (CRM) diseñado específicamente para freelancers y profesionales independientes. Interfaz moderna, profesional y funcionalidades completas para gestionar clientes potenciales, interacciones, tareas y seguimiento de ventas.

## 🚀 Características Principales

### 📊 Dashboard Inteligente
- **Métricas en tiempo real**: Total de clientes, valor estimado de proyectos, tareas pendientes
- **Gráficos visuales**: Distribución de clientes por estado con indicadores de progreso
- **Tasa de conversión**: Análisis automático del rendimiento de ventas
- **Vista rápida**: Clientes recientes y próximas tareas prioritarias

### 👥 Gestión Completa de Clientes
- **Registro detallado**: Datos de contacto, empresa, teléfono, email
- **Estados del pipeline**: Nuevo → Interesado → Propuesta → Negociación → Cerrado/Perdido
- **Sistema de etiquetas**: Categorización personalizable por industria, servicio, etc.
- **Valor estimado**: Seguimiento del potencial económico de cada cliente
- **Fuente de origen**: Tracking de canales de adquisición (redes sociales, referidos, web)

### 💬 Historial de Interacciones
- **Tipos de contacto**: Email, llamada, reunión, propuesta, seguimiento
- **Cronología completa**: Registro temporal de todas las comunicaciones
- **Descripciones detalladas**: Notas y contexto de cada interacción
- **Búsqueda avanzada**: Filtros por tipo, fecha y cliente

### ✅ Sistema de Tareas y Recordatorios
- **Gestión de tareas**: Creación, asignación y seguimiento por cliente
- **Prioridades**: Alta, media, baja con código de colores
- **Estados**: Pendiente, completada, vencida con notificaciones visuales
- **Fechas límite**: Calendario integrado con alertas automáticas

### 📅 Calendario Visual
- **Vista mensual**: Navegación intuitiva con eventos destacados
- **Código de colores**: Diferenciación visual entre tareas e interacciones
- **Indicadores múltiples**: Visualización de días con varios eventos
- **Integración completa**: Sincronización con tareas y seguimientos

### 🔍 Filtros y Búsqueda Avanzada
- **Búsqueda global**: Por nombre, email, empresa en tiempo real
- **Filtros múltiples**: Estado, etiquetas, prioridad, fecha
- **Contadores dinámicos**: Resultados actualizados automáticamente
- **Guardado de filtros**: Vistas personalizadas para consultas frecuentes

## 🎨 Diseño Profesional

### Interfaz Corporativa
- **Paleta de colores**: Grises slate con acentos azules corporativos
- **Tipografía**: Inter (Google Fonts) con jerarquía visual clara
- **Layout empresarial**: Sidebar fijo, header con búsqueda, cards organizadas
- **Componentes refinados**: Sombras sutiles, bordes elegantes, estados hover

### Experiencia de Usuario
- **Responsive design**: Optimizado para desktop, tablet y móvil
- **Micro-interacciones**: Animaciones suaves y feedback visual
- **Loading states**: Skeletons profesionales durante la carga
- **Navegación intuitiva**: Flujo lógico y accesible

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript para type safety
- **Vite** como bundler y servidor de desarrollo
- **Tailwind CSS** para estilos utilitarios y responsive design
- **Lucide React** para iconografía consistente
- **React Router** para navegación SPA

### Backend y Base de Datos
- **Supabase** como backend-as-a-service
- **PostgreSQL** base de datos SQL robusta y escalable
- **Row Level Security (RLS)** para seguridad de datos
- **Real-time subscriptions** para actualizaciones en vivo

### Arquitectura
- **Custom hooks** para lógica de negocio reutilizable
- **TypeScript interfaces** para tipado estricto
- **Modular components** para mantenibilidad
- **Utility functions** para formateo y constantes

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal con sidebar
│   ├── ClientCard.tsx  # Tarjeta de cliente
│   ├── ClientForm.tsx  # Formulario de cliente
│   ├── InteractionForm.tsx # Formulario de interacciones
│   └── TaskForm.tsx    # Formulario de tareas
├── pages/              # Páginas principales
│   ├── Dashboard.tsx   # Panel principal con métricas
│   ├── Clients.tsx     # Gestión de clientes
│   ├── Calendar.tsx    # Vista de calendario
│   ├── Tasks.tsx       # Gestión de tareas
│   └── Settings.tsx    # Configuración
├── hooks/              # Custom hooks
│   ├── useClients.ts   # Lógica de clientes
│   ├── useInteractions.ts # Lógica de interacciones
│   └── useTasks.ts     # Lógica de tareas
├── types/              # Definiciones TypeScript
├── utils/              # Utilidades y constantes
├── lib/                # Configuración de librerías
└── index.css          # Estilos globales y tema
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/cer-freelancers.git
cd cer-freelancers
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Supabase**
- Crear proyecto en [Supabase](https://supabase.com)
- Copiar `.env.example` a `.env`
- Agregar las credenciales de Supabase

4. **Ejecutar migraciones**
- Las tablas se crean automáticamente al conectar Supabase
- Incluye RLS (Row Level Security) configurado

5. **Iniciar desarrollo**
```bash
npm run dev
```

## 📊 Modelo de Datos

### Tabla: clients
- Información básica del cliente
- Estado del pipeline de ventas
- Datos de contacto y empresa
- Valor estimado y fuente

### Tabla: interactions
- Historial de comunicaciones
- Tipos: email, llamada, reunión, propuesta
- Relación con cliente específico

### Tabla: tasks
- Tareas y recordatorios
- Prioridades y estados
- Fechas límite y asignación

## 🎯 Casos de Uso Ideales

### Para Freelancers
- **Diseñadores**: Seguimiento de proyectos creativos
- **Desarrolladores**: Gestión de clientes técnicos
- **Consultores**: Pipeline de servicios profesionales
- **Marketers**: Tracking de campañas y leads

### Canales de Venta
- **Redes sociales**: LinkedIn, Instagram, Facebook
- **Email marketing**: Campañas y seguimiento
- **Referidos**: Tracking de recomendaciones
- **Web**: Leads desde sitio web o portfolio

## 🔒 Seguridad y Privacidad

- **Autenticación**: Sistema seguro con Supabase Auth
- **RLS**: Políticas de seguridad a nivel de fila
- **HTTPS**: Comunicación encriptada
- **Backup**: Respaldos automáticos en Supabase

## 📈 Roadmap Futuro

- [ ] Integración con email (Gmail, Outlook)
- [ ] Notificaciones push y por email
- [ ] Reportes avanzados y analytics
- [ ] API para integraciones externas
- [ ] App móvil nativa
- [ ] Facturación integrada

## 👨‍💻 Desarrollador

**[TU NOMBRE COMPLETO]**
- 📧 Email: [tu-email@ejemplo.com]
- 💼 LinkedIn: [tu-perfil-linkedin]
- 🌐 Portfolio: [tu-sitio-web.com]
- 📱 Teléfono: [tu-telefono]

### Especialidades
- Desarrollo Full Stack con React y Node.js
- Diseño de interfaces profesionales
- Sistemas CRM y gestión empresarial
- Integración de APIs y bases de datos

### Experiencia
- [X] años desarrollando aplicaciones web
- Especialista en soluciones para freelancers
- Enfoque en UX/UI profesional
- Arquitectura escalable y mantenible

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

¿Necesitas ayuda o tienes preguntas?

- 📧 Contacto directo: [tu-email@ejemplo.com]
- 🐛 Reportar bugs: [GitHub Issues](https://github.com/tu-usuario/cer-freelancers/issues)
- 💡 Solicitar features: [GitHub Discussions](https://github.com/tu-usuario/cer-freelancers/discussions)

---

⭐ **Si este proyecto te resulta útil, no olvides darle una estrella en GitHub**