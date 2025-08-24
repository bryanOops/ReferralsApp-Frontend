# 📧 Configuración de Envío de Emails

## 🚨 **PROBLEMA ACTUAL**

El sistema **NO envía emails reales**. Solo simula el envío y guarda logs en Firestore.

## 🔧 **SOLUCIONES DISPONIBLES**

### **OPCIÓN 1: SendGrid (Recomendado para Producción)**

1. **Crear cuenta en SendGrid:**

   - Ve a [sendgrid.com](https://sendgrid.com)
   - Crea una cuenta gratuita (100 emails/día gratis)
   - Verifica tu dominio de email

2. **Obtener API Key:**

   - Settings → API Keys
   - Create API Key
   - Full Access o Restricted Access (solo Mail Send)

3. **Configurar variables de entorno:**
   ```bash
   # En functions/.env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=noreply@tudominio.com
   ```

### **OPCIÓN 2: Gmail (Para Desarrollo)**

1. **Habilitar 2FA en tu cuenta de Gmail**

2. **Generar App Password:**

   - Google Account → Security
   - 2-Step Verification → App passwords
   - Generate → Mail

3. **Configurar variables de entorno:**
   ```bash
   # En functions/.env
   GMAIL_USER=tu_email@gmail.com
   GMAIL_PASS=abcd efgh ijkl mnop
   ```

### **OPCIÓN 3: Ethereal (Solo para Testing)**

1. **Instalar dependencias:**

   ```bash
   cd functions
   npm install ethereal
   ```

2. **Configurar en el código:**
   ```javascript
   // En functions/index.js, agregar opción Ethereal
   ```

## 🚀 **PASOS PARA IMPLEMENTAR**

### **1. Instalar Dependencias**

```bash
cd functions
npm install
```

### **2. Configurar Variables de Entorno**

```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar .env con tus credenciales
nano .env
```

### **3. Deploy de Firebase Functions**

```bash
firebase deploy --only functions
```

### **4. Probar Envío**

- Registra un nuevo referido
- Revisa la consola del navegador
- Verifica que aparezca "✅ Email enviado exitosamente"

## 📋 **VERIFICACIÓN**

### **En Consola del Navegador:**

```
✅ Email enviado exitosamente
```

### **En Firebase Functions Logs:**

```bash
firebase functions:log
```

### **En Firestore:**

- Colección `emailLogs` debe tener registros
- Campo `status: 'sent'`

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error: "No hay configuración de email real"**

- Verifica que las variables de entorno estén configuradas
- Reinicia las Firebase Functions después de cambios

### **Error: "Unauthorized" (SendGrid)**

- Verifica que la API Key sea correcta
- Asegúrate de que el dominio esté verificado

### **Error: "Invalid login" (Gmail)**

- Usa App Password, no tu contraseña normal
- Verifica que 2FA esté habilitado

### **Emails no llegan:**

- Revisa carpeta de spam
- Verifica que el email de origen esté configurado correctamente
- Revisa logs de Firebase Functions

## 🔒 **SEGURIDAD**

- **NUNCA** subas el archivo `.env` a Git
- Usa App Passwords para Gmail
- Restringe permisos de API Keys
- Considera usar Firebase Secret Manager para producción

## 📞 **SOPORTE**

Si tienes problemas:

1. Revisa los logs de Firebase Functions
2. Verifica la configuración de variables de entorno
3. Prueba con un email de prueba simple
4. Revisa la documentación del servicio de email elegido
