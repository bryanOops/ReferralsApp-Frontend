# 🎨 GUÍA DE PERSONALIZACIÓN DE EMAILS

## 📁 **ESTRUCTURA DE ARCHIVOS**

```
functions/templates/
├── welcome.html          # Template HTML del email de bienvenida
├── theme-config.js       # Configuración de colores y temas
└── README.md            # Esta guía
```

## 🎨 **CÓMO CAMBIAR COLORES Y ESTILOS**

### **1. CAMBIO RÁPIDO DE COLORES**

Edita el archivo `theme-config.js` y cambia los valores hexadecimales:

```javascript
// Cambiar el color principal de Smart Bonos
primary: {
  colors: {
    primary: '#667eea',        // ← Cambia este color
    secondary: '#764ba2',      // ← Cambia este color
    // ... más colores
  }
}
```

### **2. TEMAS PREDEFINIDOS DISPONIBLES**

- **`primary`** - Smart Bonos (Azul-Púrpura)
- **`corporate`** - Corporativo (Azul Profesional)
- **`premium`** - Premium (Púrpura-Rojo)
- **`modern`** - Moderno (Verde-Azul)

### **3. CAMBIAR TEMA EN EL EMAIL**

En `functions/index.js`, línea ~120, cambia:

```javascript
// Cambiar de 'primary' a otro tema
const theme = getTheme('corporate'); // o 'premium', 'modern'
```

## 🎯 **ELEMENTOS PERSONALIZABLES**

### **Colores Principales:**

- **Header** - Fondo del encabezado
- **Botón CTA** - Botón "Completar Registro"
- **Texto** - Colores de títulos y párrafos
- **Acentos** - Colores de elementos especiales

### **Tipografías:**

```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

### **Espaciado:**

```css
padding: 30px 20px; /* Header */
padding: 40px 30px; /* Contenido */
margin: 20px 0; /* Botón */
```

## 🚀 **EJEMPLOS DE PERSONALIZACIÓN**

### **Ejemplo 1: Cambiar a Tema Corporativo**

```javascript
// En theme-config.js
const theme = getTheme('corporate');
```

### **Ejemplo 2: Color Personalizado**

```javascript
// En theme-config.js
primary: {
  colors: {
    primary: '#ff6b35',        // Naranja personalizado
    secondary: '#f7931e',      // Naranja secundario
    // ... más colores
  }
}
```

### **Ejemplo 3: Gradiente Personalizado**

```javascript
// En theme-config.js
gradients: {
  header: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
  button: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)'
}
```

## 📱 **RESPONSIVE DESIGN**

Los emails ya incluyen diseño responsive:

```css
@media only screen and (max-width: 600px) {
  .container {
    margin: 10px;
    border-radius: 0;
  }

  .content {
    padding: 30px 20px;
  }
}
```

## 🔧 **PASOS PARA APLICAR CAMBIOS**

1. **Edita** los archivos de template
2. **Guarda** los cambios
3. **Haz deploy** de las funciones:
   ```bash
   firebase deploy --only functions
   ```

## 🎨 **PALETAS DE COLORES RECOMENDADAS**

### **Paleta Profesional:**

- Principal: `#2c3e50` (Azul Oscuro)
- Secundario: `#34495e` (Azul Medio)
- Acento: `#3498db` (Azul Claro)

### **Paleta Moderna:**

- Principal: `#00d4aa` (Verde)
- Secundario: `#0099cc` (Azul)
- Acento: `#ff6b6b` (Rojo)

### **Paleta Elegante:**

- Principal: `#8e44ad` (Púrpura)
- Secundario: `#9b59b6` (Púrpura Claro)
- Acento: `#e74c3c` (Rojo)

## 💡 **CONSEJOS DE DISEÑO**

1. **Contraste**: Asegúrate de que el texto sea legible
2. **Consistencia**: Mantén la misma paleta en toda la aplicación
3. **Accesibilidad**: Usa colores que funcionen bien para daltónicos
4. **Branding**: Alinea los colores con tu identidad de marca

## 🆘 **SOPORTE**

Si tienes problemas:

1. Verifica que los colores hexadecimales sean válidos
2. Asegúrate de hacer deploy después de los cambios
3. Prueba en diferentes clientes de email
4. Revisa la consola de Firebase Functions

---

**¡Con estos archivos puedes personalizar completamente el diseño de tus emails!** 🎉
