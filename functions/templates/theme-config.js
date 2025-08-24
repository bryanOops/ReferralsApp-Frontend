// 🎨 CONFIGURACIÓN DE TEMAS PARA EMAILS
// Cambia estos colores para personalizar el diseño

const themes = {
  // 🌈 TEMA PRINCIPAL (Smart Bonos)
  primary: {
    name: 'Smart Bonos',
    colors: {
      primary: '#667eea', // Azul principal
      secondary: '#764ba2', // Púrpura secundario
      accent: '#f093fb', // Rosa acento
      success: '#4facfe', // Azul éxito
      warning: '#f093fb', // Rosa advertencia
      danger: '#fa709a', // Rosa peligro
      light: '#f8f9fa', // Gris claro
      dark: '#343a40', // Gris oscuro
      white: '#ffffff', // Blanco
      text: {
        primary: '#333333', // Texto principal
        secondary: '#666666', // Texto secundario
        light: '#6c757d', // Texto claro
        white: '#ffffff', // Texto blanco
      },
    },
    gradients: {
      header: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      button: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  },

  // 🚀 TEMA CORPORATIVO
  corporate: {
    name: 'Corporativo',
    colors: {
      primary: '#2c3e50', // Azul corporativo
      secondary: '#34495e', // Azul secundario
      accent: '#3498db', // Azul acento
      success: '#27ae60', // Verde éxito
      warning: '#f39c12', // Naranja advertencia
      danger: '#e74c3c', // Rojo peligro
      light: '#ecf0f1', // Gris claro
      dark: '#2c3e50', // Gris oscuro
      white: '#ffffff', // Blanco
      text: {
        primary: '#2c3e50', // Texto principal
        secondary: '#7f8c8d', // Texto secundario
        light: '#95a5a6', // Texto claro
        white: '#ffffff', // Texto blanco
      },
    },
    gradients: {
      header: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      button: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
      accent: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
    },
  },

  // 🌟 TEMA PREMIUM
  premium: {
    name: 'Premium',
    colors: {
      primary: '#8e44ad', // Púrpura premium
      secondary: '#9b59b6', // Púrpura secundario
      accent: '#e74c3c', // Rojo acento
      success: '#27ae60', // Verde éxito
      warning: '#f39c12', // Naranja advertencia
      danger: '#c0392b', // Rojo peligro
      light: '#f8f9fa', // Gris claro
      dark: '#2c3e50', // Gris oscuro
      white: '#ffffff', // Blanco
      text: {
        primary: '#2c3e50', // Texto principal
        secondary: '#7f8c8d', // Texto secundario
        light: '#95a5a6', // Texto claro
        white: '#ffffff', // Texto blanco
      },
    },
    gradients: {
      header: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)',
      button: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
      accent: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
    },
  },

  // 🎯 TEMA MODERNO
  modern: {
    name: 'Moderno',
    colors: {
      primary: '#00d4aa', // Verde moderno
      secondary: '#0099cc', // Azul moderno
      accent: '#ff6b6b', // Rojo acento
      success: '#51cf66', // Verde éxito
      warning: '#ffd43b', // Amarillo advertencia
      danger: '#ff6b6b', // Rojo peligro
      light: '#f8f9fa', // Gris claro
      dark: '#212529', // Gris oscuro
      white: '#ffffff', // Blanco
      text: {
        primary: '#212529', // Texto principal
        secondary: '#6c757d', // Texto secundario
        light: '#adb5bd', // Texto claro
        white: '#ffffff', // Texto blanco
      },
    },
    gradients: {
      header: 'linear-gradient(135deg, #00d4aa 0%, #0099cc 100%)',
      button: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
      accent: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
    },
  },
};

// 🎨 FUNCIÓN PARA OBTENER TEMA
function getTheme(themeName = 'primary') {
  return themes[themeName] || themes.primary;
}

// 🎨 FUNCIÓN PARA GENERAR CSS DINÁMICO
function generateCSS(theme) {
  return `
    .container {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      background-color: ${theme.colors.white};
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .header {
      background: ${theme.gradients.header};
      color: ${theme.colors.text.white};
      padding: 30px 20px;
      text-align: center;
    }
    
    .cta-button {
      background: ${theme.gradients.button};
      color: ${theme.colors.text.white};
      box-shadow: 0 4px 15px ${theme.colors.primary}40;
    }
    
    .cta-button:hover {
      box-shadow: 0 6px 20px ${theme.colors.primary}60;
    }
  `;
}

module.exports = {
  themes,
  getTheme,
  generateCSS,
};
