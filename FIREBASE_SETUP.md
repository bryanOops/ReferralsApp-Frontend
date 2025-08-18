# 🔥 Configuración de Múltiples Proyectos Firebase

Este proyecto está configurado para trabajar con múltiples proyectos de Firebase según el entorno.

## 📁 Estructura de Archivos

```
├── src/firebase/
│   ├── firebaseConfig.js          # Configuración principal (auto-detecta entorno)
│   ├── firebaseConfig.dev.js      # Configuración para desarrollo
│   └── firebaseConfig.prod.js     # Configuración para producción
├── .firebaserc.dev                # Proyecto de desarrollo
├── .firebaserc.prod               # Proyecto de producción
├── firebase.dev.json              # Configuración de hosting para desarrollo
├── firebase.prod.json             # Configuración de hosting para producción
├── deploy.ps1                     # Script de PowerShell para deploy
└── env.development/env.production # Variables de entorno
```

## 🚀 Comandos Disponibles

### NPM Scripts

```bash
# Deploy a desarrollo
npm run deploy:dev

# Deploy a producción
npm run deploy:prod

# Cambiar a proyecto de desarrollo
npm run switch:dev

# Cambiar a proyecto de producción
npm run switch:prod
```

### PowerShell Script (Windows)

```powershell
# Deploy a desarrollo
.\deploy.ps1 dev

# Deploy a producción
.\deploy.ps1 prod
```

## ⚙️ Configuración

### 1. Proyecto de Desarrollo (smartbonos)

- **URL**: https://smartbonos.firebaseapp.com
- **Base de datos**: Para pruebas y desarrollo
- **Uso**: Desarrollo local y testing

### 2. Proyecto de Producción (taxi-smiles-referral)

- **URL**: https://taxi-smiles-referral.web.app
- **Base de datos**: Para usuarios reales
- **Uso**: Producción y usuarios finales

## 🔧 Detección Automática de Entorno

El sistema detecta automáticamente el entorno basándose en:

1. **Variable de entorno**: `NODE_ENV` o `REACT_APP_ENV`
2. **Hostname**: `localhost` o `127.0.0.1` = desarrollo
3. **Dominio**: Cualquier otro = producción

## 📝 Pasos para Configurar

### 1. Proyecto de Producción ya creado

El proyecto `smartbonos` ya está creado y configurado con las credenciales correctas.

### 2. Configurar Hosting

```bash
# En el proyecto de producción
firebase init hosting
# Seleccionar: smartbonos-prod
```

### 3. Actualizar Configuración

Editar `src/firebase/firebaseConfig.js` con las credenciales reales del proyecto de producción.

### 4. Configurar Dominio Personalizado

En Firebase Console > Hosting > Agregar dominio personalizado.

## 🚨 Importante

- **Nunca** hacer commit de credenciales reales de producción
- **Siempre** usar variables de entorno para configuraciones sensibles
- **Verificar** que estés en el proyecto correcto antes de hacer deploy

## 🔍 Verificar Configuración Actual

```bash
# Ver proyecto actual
firebase projects:list

# Ver configuración actual
cat .firebaserc
cat firebase.json
```

## 📚 Recursos Adicionales

- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
