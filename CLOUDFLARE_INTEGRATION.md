# Integración de Cloudflare con Formulario de Referidos

## 🚀 **Opción 1: Cloudflare Pages (Recomendado)**

### **Ventajas:**

- ✅ **Hosting gratuito** para React apps
- ✅ **CDN global** automático
- ✅ **SSL gratuito** automático
- ✅ **Integración con Git** (deploy automático)
- ✅ **Funciones serverless** incluidas

### **Pasos de implementación:**

#### **1. Preparar el proyecto**

```bash
# En tu directorio raíz
npm run build
```

#### **2. Crear archivo de configuración**

```javascript
// _redirects (en la carpeta public/)
/*    /index.html   200
```

#### **3. Conectar con Cloudflare**

1. Ve a [Cloudflare Pages](https://pages.cloudflare.com/)
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`

#### **4. Variables de entorno**

```bash
# En Cloudflare Pages Dashboard
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_RECAPTCHA_SITE_KEY=6LfVdVwrAAAAAHX1wbJtRmc2ZGF_JrALgEpTvBWb
```

---

## 🛡️ **Opción 2: Cloudflare Workers (Funciones serverless)**

### **Crear worker para validación adicional:**

```javascript
// workers/recaptcha-validator.js
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST') {
    const { token, action } = await request.json();

    // Validación adicional de Cloudflare
    const cf = request.cf;
    const riskScore = cf.riskScore || 0;

    // Si el riesgo es alto, rechazar
    if (riskScore > 50) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Riesgo detectado por Cloudflare',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Continuar con validación normal
    const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: 'TU_SECRET_KEY',
        response: token,
      }),
    });

    return verificationResponse;
  }

  return new Response('Método no permitido', { status: 405 });
}
```

---

## 🔧 **Opción 3: Cloudflare WAF (Web Application Firewall)**

### **Reglas personalizadas:**

```javascript
// Reglas WAF para tu formulario
{
  "rules": [
    {
      "name": "Proteger formulario de referidos",
      "expression": "(http.request.uri.path contains \"/referal-register\") and (http.request.method eq \"POST\")",
      "action": "challenge",
      "enabled": true
    },
    {
      "name": "Limitar intentos de reCAPTCHA",
      "expression": "(http.request.uri.path contains \"verifyrecaptcha\") and (ip.src in $malicious_ips)",
      "action": "block",
      "enabled": true
    }
  ]
}
```

---

## 📊 **Configuración recomendada para tu caso:**

### **1. Cloudflare Pages + Workers**

- **Hosting:** Cloudflare Pages
- **Funciones:** Cloudflare Workers para validación adicional
- **Protección:** WAF + Bot Management

### **2. Variables de entorno actualizadas:**

```javascript
// .env.production
VITE_CLOUDFLARE_WORKER_URL=https://tu-worker.tu-subdomain.workers.dev
VITE_CLOUDFLARE_ZONE_ID=tu_zone_id
```

### **3. Integración en tu formulario:**

```javascript
// En ReferalRegister.jsx
const CLOUDFLARE_WORKER_URL = import.meta.env.VITE_CLOUDFLARE_WORKER_URL;

// Función mejorada de reCAPTCHA
const executeRecaptcha = async (action = 'submit') => {
  // ... código existente ...

  // Validación adicional con Cloudflare
  const cfResponse = await fetch(CLOUDFLARE_WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, action }),
  });

  const cfResult = await cfResponse.json();

  if (!cfResult.success) {
    console.log('❌ Cloudflare detectó riesgo:', cfResult.error);
    return false;
  }

  // ... resto del código ...
};
```

---

## 🎯 **Beneficios específicos para tu formulario:**

### **Seguridad:**

- ✅ **Doble validación:** reCAPTCHA v3 + Cloudflare
- ✅ **Protección DDoS** automática
- ✅ **Detección de bots** avanzada
- ✅ **Rate limiting** inteligente

### **Rendimiento:**

- ✅ **CDN global** (tu formulario carga más rápido)
- ✅ **Caché inteligente** de recursos estáticos
- ✅ **Compresión automática** de archivos
- ✅ **HTTP/3** y **QUIC** automáticos

### **Monitoreo:**

- ✅ **Analytics** detallados de ataques
- ✅ **Logs** de seguridad en tiempo real
- ✅ **Métricas** de rendimiento global
- ✅ **Alertas** automáticas

---

## 💰 **Costos:**

### **Plan Gratuito:**

- ✅ **Cloudflare Pages:** Gratis (100,000 requests/mes)
- ✅ **Workers:** Gratis (100,000 requests/día)
- ✅ **WAF:** Gratis (reglas básicas)
- ✅ **CDN:** Gratis (ilimitado)

### **Plan Pro ($20/mes):**

- ✅ **WAF avanzado**
- ✅ **Bot Management**
- ✅ **Rate limiting** avanzado
- ✅ **Analytics** detallados

---

## 🚀 **Implementación paso a paso:**

### **Paso 1: Crear cuenta Cloudflare**

1. Ve a [cloudflare.com](https://cloudflare.com)
2. Crea cuenta gratuita
3. Agrega tu dominio

### **Paso 2: Configurar DNS**

1. Cambia nameservers a Cloudflare
2. Activa proxy (nube naranja)

### **Paso 3: Desplegar en Pages**

1. Conecta tu repositorio
2. Configura build settings
3. Despliega automáticamente

### **Paso 4: Configurar Workers (opcional)**

1. Crea worker para validación adicional
2. Configura variables de entorno
3. Prueba integración

### **Paso 5: Activar WAF**

1. Ve a Security > WAF
2. Activa reglas recomendadas
3. Crea reglas personalizadas

---

## 🎉 **Resultado final:**

Tu formulario tendrá:

- **🔒 Seguridad de nivel empresarial**
- **⚡ Rendimiento global optimizado**
- **📊 Monitoreo completo**
- **🛡️ Protección automática** contra ataques
- **💰 Todo gratis** (plan básico)

¡Cloudflare transformará tu formulario en una aplicación web de nivel profesional! 🚀
