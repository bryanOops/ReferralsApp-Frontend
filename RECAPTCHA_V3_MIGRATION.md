# Migración de reCAPTCHA v2 a v3

## Resumen de cambios

Se ha migrado exitosamente el formulario de registro de referidos de reCAPTCHA v2 a reCAPTCHA v3.

## Principales diferencias

### reCAPTCHA v2 (Anterior)

- ✅ Requería interacción del usuario (checkbox)
- ✅ Validación visible
- ✅ Resultado binario (verificado/no verificado)
- ❌ Interrumpía el flujo del usuario

### reCAPTCHA v3 (Nuevo)

- ✅ Invisible, no requiere interacción del usuario
- ✅ Asigna un score (0.0 - 1.0) basado en el comportamiento
- ✅ Más fluido para el usuario
- ✅ Mejor protección contra bots
- ✅ Análisis de comportamiento en tiempo real

## Cambios realizados

### Frontend (`src/views/pages/referal-register/ReferalRegister.jsx`)

1. **Eliminado:**

   - Importación de `react-google-recaptcha`
   - Componente visual `ReCAPTCHA`
   - Estado `isCaptchaVerified`
   - Referencia `recaptchaRef`

2. **Agregado:**

   - Estado `recaptchaScore` para almacenar el score
   - Estado `isRecaptchaLoading` para indicar carga
   - Función `executeRecaptcha()` para ejecutar la verificación
   - Verificación automática antes del envío del formulario

3. **Modificado:**
   - URLs de endpoints actualizadas
   - Validación del botón de envío
   - Almacenamiento del score en metadata

### Backend (`functions/index.js`)

1. **Nuevo endpoint:** `verifyRecaptcha`

   - Verifica tokens de reCAPTCHA v3
   - Valida score y acción
   - Retorna resultado detallado

2. **Actualizado:** `validarCodigo`

   - Migrado a Firebase Functions v5
   - Mejorado manejo de parámetros

3. **Dependencias actualizadas:**
   - `firebase-functions` v5.1.0
   - `node-fetch` v2.7.0

## Configuración

### Site Keys utilizadas:

- **Frontend:** `6LfVdVwrAAAAAHX1wbJtRmc2ZGF_JrALgEpTvBWb`
- **Backend:** `6LfVdVwrAAAAAOpJDqdp-5hNNS2Lk0gx0ipH9up3`

### URLs de endpoints:

- **Validación de códigos:** `https://validarcodigo-q7nx2wkxda-uc.a.run.app`
- **Verificación reCAPTCHA:** `https://verifyrecaptcha-q7nx2wkxda-uc.a.run.app`

## Umbral de score

- **Umbral recomendado:** 0.5
- **Score 1.0:** Comportamiento muy humano
- **Score 0.0:** Comportamiento muy sospechoso

## Beneficios obtenidos

1. **Mejor UX:** No interrumpe el flujo del usuario
2. **Mayor seguridad:** Análisis de comportamiento avanzado
3. **Menos fricción:** Proceso más fluido
4. **Datos adicionales:** Score para análisis y monitoreo

## Monitoreo

El score de reCAPTCHA se almacena en la metadata de cada registro para:

- Análisis de patrones de comportamiento
- Detección de posibles ataques
- Optimización del umbral de score

## Próximos pasos recomendados

1. Monitorear los scores durante las primeras semanas
2. Ajustar el umbral según los resultados
3. Implementar alertas para scores muy bajos
4. Considerar acciones adicionales para scores críticos
