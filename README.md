# 🛒 ElectroStore - E-commerce + Admin Dashboard

Proyecto completo de e-commerce para electrodomésticos con panel de administración integrado.

## 🚀 Características

### 🏪 Tienda E-commerce
- **Hero Section** con ofertas destacadas y descuentos
- **Grid de productos** en 4 columnas responsive
- **Banner de categorías** interactivo (Heladeras, Lavarropas, Hornos, etc.)
- **Sistema de filtros** y ordenamiento
- **Carrito de compras** con contador
- **Favoritos** para productos
- **Footer completo** con información de contacto y medios de pago

### 📊 Dashboard de Administración
- **Panel de inventario** con gestión de productos
- **KPIs en tiempo real** (Total productos, Stock bajo, Agotados, Valor total)
- **Insights de IA** powered by Google Gemini
- **Filtros avanzados** por categoría, ubicación y estado
- **Tabla de productos** con acciones (editar, copiar, eliminar)
- **Sincronización de inventario** entre ubicaciones

## 🎨 Diseño

- **Dark Mode Premium** - Diseño moderno y elegante
- **Glassmorphism** - Efectos de vidrio esmerilado
- **Gradientes Vibrantes** - Colores dinámicos y atractivos
- **Animaciones Suaves** - Transiciones fluidas y micro-interacciones
- **Responsive Design** - Adaptable a móviles, tablets y desktop
- **Tipografía Manrope** - Fuente moderna y profesional

## 🛠️ Tecnologías

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework de estilos
- **Google Gemini AI** - Insights inteligentes de inventario
- **Material Icons** - Iconografía consistente

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/MarcosSanchez-7/UPAP_WORK.git

# Navegar al directorio
cd UPAP_WORK

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env.local con tu API key de Google Gemini
echo "VITE_GEMINI_API_KEY=tu_api_key_aqui" > .env.local

# Iniciar servidor de desarrollo
npm run dev
```

## 🚀 Uso

1. Abre tu navegador en `http://localhost:5173`
2. Usa el **switcher en la parte superior** para cambiar entre:
   - 🛒 **Tienda** - Vista de e-commerce para clientes
   - 📊 **Dashboard** - Panel de administración

## 📁 Estructura del Proyecto

```
UPAP_WORK/
├── components/          # Componentes reutilizables
│   └── KPICard.tsx     # Tarjeta de KPI para dashboard
├── services/           # Servicios y APIs
│   └── geminiService.ts # Integración con Google Gemini
├── App.tsx             # Router principal
├── Dashboard.tsx       # Vista de administración
├── Ecommerce.tsx       # Vista de tienda
├── constants.tsx       # Datos de productos
├── types.ts            # Tipos TypeScript
├── index.css           # Estilos globales
├── index.html          # HTML principal
├── index.tsx           # Punto de entrada
├── package.json        # Dependencias
├── tsconfig.json       # Configuración TypeScript
└── vite.config.ts      # Configuración Vite
```

## 🎯 Funcionalidades Destacadas

### E-commerce
- ✅ Catálogo de productos con imágenes
- ✅ Sistema de calificaciones con estrellas
- ✅ Badges de ofertas y descuentos
- ✅ Precios con descuentos visibles
- ✅ Botón flotante de WhatsApp
- ✅ Scroll to top automático
- ✅ Animaciones on-scroll

### Dashboard
- ✅ Gestión completa de inventario
- ✅ Insights de IA con Google Gemini
- ✅ Filtros por categoría, ubicación y estado
- ✅ Visualización de stock por ubicación
- ✅ Sincronización en tiempo real
- ✅ Paginación de resultados

## 🔑 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_GEMINI_API_KEY=tu_api_key_de_google_gemini
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es parte del trabajo académico de UPAP.

## 👨‍💻 Autor

**Marcos Sanchez**
- GitHub: [@MarcosSanchez-7](https://github.com/MarcosSanchez-7)

## 🙏 Agradecimientos

- Diseño inspirado en plataformas modernas de e-commerce
- Integración con Google Gemini AI para insights inteligentes
- Universidad Politécnica y Artística del Paraguay (UPAP)

---

⭐ Si te gusta este proyecto, no olvides darle una estrella en GitHub!
