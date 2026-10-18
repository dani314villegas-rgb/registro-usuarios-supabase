# Registro de Personas con Supabase

Una aplicación web simple para registrar y gestionar personas, construida con HTML5, CSS3 moderno, JavaScript (ES6+), Tailwind CSS, Font Awesome y Supabase como backend.

## ✨ Características

- **Formulario de registro**: Nombre, Apellido, Cédula, Edad
- **Tabla de registros**: Visualización en tiempo real de los registros almacenados
- **Conexión a Supabase**: Almacenamiento seguro y escalable en la nube
- **Diseño moderno**: Paleta de colores lilas y morados suaves, tipografía limpia, iconografía intuitiva
- **Responsivo**: Adaptado para móviles y escritorio gracias a Tailwind CSS
- **Interactividad**: Efectos hover suaves, validación de formulario, feedback visual

## 🎨 Diseño UI/UX

### Paleta de Colores
- **Fondo**: `#F8FAFC` (gris muy claro)
- **Tarjetas/Contenedores**: `#FFFFFF` (blanco)
- **Acentos primarios**: 
  - Lila suave: `#8B5CF6` (primario)
  - Morado: `#7C3AED` (primario oscuro)
- **Textos**: 
  - Gris oscuro: `#1E293B` (texto principal)
  - Gris medio: `#64748B` (texto secundario)

### Tipografía
- **Inter** (desde Google Fonts): Moderna, limpia y altamente legible
  - Pesos: 300, 400, 500, 600, 700

### Iconografía
- **Font Awesome 6**: Iconos para:
  - Usuario (`fa-user`)
  - Tarjeta de identificación (`fa-id-card`)
  - Calendario (`fa-calendar-alt`)
  - Guardar (`fa-save`)
  - Editar (`fa-edit`)
  - Eliminar (`fa-trash`)
  - Lista (`fa-list`)
  - Etiqueta (`fa-tag`)

### Framework CSS
- **Tailwind CSS v3** (vía CDN): Para maquetado responsive y utilidades rápidas

## 📁 Estructura de Archivos

```
registro-personas-supabase/
│
├── index.html          # Interfaz principal
├── styles.css          # Estilos personalizados
├── app.js              # Lógica de la aplicación (formulario, CRUD)
├── config.js           # Configuración de Supabase
├── .gitignore          # Archivos y carpetas a ignorar en Git
└── README.md           # Este archivo
```

## 🚀 Instalación y Uso

### Prerrequisitos
1. Un proyecto en [Supabase](https://supabase.com) (gratuito)
2. Crear una tabla llamada `personas` con el siguiente schema:

```sql
CREATE TABLE personas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    cedula TEXT UNIQUE NOT NULL,
    edad INTEGER NOT NULL CHECK (edad >= 0 AND edad <= 150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security) para acceso anónimo (opcional para desarrollo)
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access for all" ON personas FOR SELECT USING (true);
CREATE POLICY "Allow insert access for all" ON personas FOR INSERT USING (true);
-- NOTA: En producción, implementar políticas de seguridad adecuadas
```

### Pasos para ejecutar localmente
1. Clonar o descargar este repositorio
2. Abrir una terminal en la carpeta del proyecto
3. Ejecutar un servidor HTTP local (requerido para evitar problemas de CORS):
   ```bash
   python -m http.server 8080
   ```
   O usar cualquier otro servidor HTTP (like `live server` en VS Code, `http-server`, etc.)
4. Abrir en el navegador: `http://localhost:8080/index.html`
5. ¡Listo! Comienza a registrar personas.

### Configuración de Supabase
El archivo `config.js` contiene las credenciales de Supabase (URL y anon key) usadas en este proyecto.
**Importante**: Estas credenciales son de solo lectura/escritura anónima para propósitos de demostración.
En un entorno de producción, se deben usar variables de entorno y políticas de seguridad más estrictas.

## 💡 Cómo Funciona

1. **Al cargar la página**:
   - Se inicializa el cliente de Supabase con las credenciales de `config.js`
   - Se carga la lista existente de registros desde la tabla `personas`
   - Se muestra un mensaje si no hay registros

2. **Al enviar el formulario**:
   - Se validan los campos (nombre, apellido, cédula, edad)
   - Se envía una petición `INSERT` a la tabla `personas` en Supabase
   - En caso de éxito, se recarga la lista de registros
   - Se muestra feedback visual al usuario

3. **Interacciones con la tabla**:
   - Los registros se muestran en una tabla con hover suave
   - Cada fila tiene botones para editar y eliminar (funcionalidad básica implementada)
   - Al eliminar, se confirma la acción y se actualiza la tabla

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3 + Tailwind CSS**: Estilos y layout responsive
- **JavaScript ES6+**: Lógica de la aplicación y manejo de eventos
- **Font Awesome 6**: Iconografía vectorial
- **Google Fonts**: Tipografía Inter
- **Supabase**: Backend como servicio (PostgreSQL + API REST)
- **Tailwind CSS CDN**: Para styling rápido sin necesidad de build process
- **Supabase JS CDN**: Cliente oficial de Supabase

## 📝 Notas importantes

- **Seguridad**: Este ejemplo usa la anon key de Supabase, lo cual es apropiado para prototipos y aplicaciones públicas donde se permite acceso de lectura/escritura anónima. Para aplicaciones reales, se deben implementar políticas de autenticación y autorización adecuadas.
- **CORS**: La aplicación debe servirse mediante HTTP (no abrir directamente el archivo `index.html` desde el sistema de archivos) para evitar bloqueos de CORS al hacer peticiones a Supabase.
- **Responsividad**: Gracias a Tailwind CSS, la interfaz se adapta a diferentes tamaños de pantalla.
- **Accesibilidad**: Se han usado etiquetas `<label>` asociadas a los inputs y se ha mantenido un contraste adecuado en los colores.

## 🤝 Contribuir

Si deseas contribuir a este proyecto:
1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) por su increíble plataforma backend
- [Tailwind CSS](https://tailwindcss.com) por su utility-first CSS framework
- [Font Awesome](https://fontawesome.com) por sus hermosos iconos
- [Google Fonts](https://fonts.google.com) por la tipografía Inter
- La comunidad de código abierto por hacer posible el desarrollo web moderno

---

¡Gracias por usar esta aplicación! Espero que te sea útil para aprender y crear tus propios proyectos web. 😊