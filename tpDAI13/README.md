# Aplicación de Calendario - React Native

Una aplicación móvil desarrollada en React Native con Expo que permite gestionar eventos del calendario local del dispositivo.

## Funcionalidades

- 📅 **Visualizar eventos**: Ver todos los eventos del calendario local en una interfaz de calendario intuitiva
- ➕ **Agregar eventos**: Crear nuevos eventos con título, fecha, hora, ubicación y notas
- ✏️ **Editar eventos**: Modificar eventos existentes
- 🗑️ **Eliminar eventos**: Borrar eventos del calendario
- 🔄 **Sincronización**: Los eventos se sincronizan automáticamente con el calendario nativo del dispositivo

## Características Técnicas

- **React Native** con **Expo** para desarrollo multiplataforma
- **expo-calendar** para acceso al calendario local
- **react-native-calendars** para la interfaz del calendario
- **@react-native-community/datetimepicker** para selección de fechas y horas
- **@expo/vector-icons** para iconos

## Instalación

1. **Instalar dependencias**:
   ```bash
   cd tp13dai
   npm install
   ```

2. **Instalar dependencias nativas** (si es necesario):
   ```bash
   npx expo install --fix
   ```

3. **Ejecutar la aplicación**:
   ```bash
   npm start
   ```

## Uso

### Permisos
La aplicación solicitará permisos para acceder al calendario del dispositivo. Es necesario conceder estos permisos para que la aplicación funcione correctamente.

### Navegación
- **Calendario**: Desplázate por los meses y toca cualquier día para ver los eventos
- **Agregar evento**: Toca el botón "+" en la parte superior derecha
- **Editar evento**: Toca el ícono de lápiz en cualquier evento
- **Eliminar evento**: Toca el ícono de papelera en cualquier evento

### Crear/Editar Eventos
1. Toca el botón "+" o el ícono de editar en un evento existente
2. Completa los campos:
   - **Título** (obligatorio)
   - **Ubicación** (opcional)
   - **Fecha y hora de inicio**
   - **Fecha y hora de fin**
   - **Notas** (opcional)
3. Toca "Guardar" para crear o actualizar el evento

## Estructura del Proyecto

```
src/
├── components/
│   ├── EventForm.js      # Formulario para crear/editar eventos
│   └── EventItem.js      # Componente para mostrar cada evento
├── screens/
│   └── CalendarScreen.js # Pantalla principal del calendario
└── services/
    └── CalendarLocal.js  # Servicio para manejar el calendario local
```

## Dependencias Principales

- `expo-calendar`: Acceso al calendario nativo del dispositivo
- `expo-permissions`: Gestión de permisos
- `react-native-calendars`: Componente de calendario
- `@react-native-community/datetimepicker`: Selector de fecha y hora
- `@expo/vector-icons`: Iconos

## Requisitos del Sistema

- Node.js 16 o superior
- Expo CLI
- Dispositivo móvil con Android 6+ o iOS 11+
- Permisos de calendario en el dispositivo

## Notas de Desarrollo

- La aplicación está optimizada para dispositivos móviles
- Los eventos se sincronizan automáticamente con el calendario nativo
- La interfaz está diseñada siguiendo las guías de Material Design y Human Interface Guidelines
- Soporte completo para fechas en español

## Solución de Problemas

### Error de permisos
Si la aplicación no puede acceder al calendario:
1. Verifica que los permisos estén concedidos en la configuración del dispositivo
2. Reinicia la aplicación
3. En Android, verifica que la aplicación tenga permisos de calendario en Configuración > Aplicaciones

### Error de dependencias
Si hay problemas con las dependencias:
```bash
rm -rf node_modules
npm install
npx expo install --fix
```
