# Script de PowerShell para deploy de Firebase
# Uso: .\deploy.ps1 [dev|prod]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("dev", "prod")]
    [string]$Environment
)

Write-Host "🚀 Iniciando deploy para entorno: $Environment" -ForegroundColor Green

# Cambiar a la configuración correspondiente
if ($Environment -eq "dev") {
    Write-Host "📁 Cambiando a configuración de DESARROLLO..." -ForegroundColor Yellow
    Copy-Item ".firebaserc.dev" ".firebaserc" -Force
    Copy-Item "firebase.dev.json" "firebase.json" -Force
    Write-Host "✅ Configuración de desarrollo aplicada" -ForegroundColor Green
} else {
    Write-Host "📁 Cambiando a configuración de PRODUCCIÓN..." -ForegroundColor Yellow
    Copy-Item ".firebaserc.prod" ".firebaserc" -Force
    Copy-Item "firebase.prod.json" "firebase.json" -Force
    Write-Host "✅ Configuración de producción aplicada" -ForegroundColor Green
}

# Hacer build
Write-Host "🔨 Haciendo build de la aplicación..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en el build. Abortando deploy." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completado exitosamente" -ForegroundColor Green

# Deploy a Firebase
Write-Host "🚀 Haciendo deploy a Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deploy completado exitosamente para $Environment!" -ForegroundColor Green
} else {
    Write-Host "❌ Error en el deploy." -ForegroundColor Red
    exit 1
}
