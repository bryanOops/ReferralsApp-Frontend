const { onRequest } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const fetch = require('node-fetch');

// Configuración global para las funciones
setGlobalOptions({
  maxInstances: 10,
  region: 'us-central1',
});

// Endpoint para verificar reCAPTCHA v3
exports.verifyRecaptcha = onRequest(
  {
    cors: true,
    maxInstances: 10,
    region: 'us-central1',
    invoker: 'public', // Permite invocaciones públicas
  },
  async (req, res) => {
    // Configurar CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Método no permitido' });
      return;
    }

    try {
      const { token, action } = req.body;

      if (!token) {
        res.status(400).json({ error: 'Token de reCAPTCHA requerido' });
        return;
      }

      // Verificar el token con Google
      const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: '6LfVdVwrAAAAAOpJDqdp-5hNNS2Lk0gx0ipH9up3', // Tu secret key de reCAPTCHA v3
          response: token,
        }),
      });

      const verificationResult = await verificationResponse.json();

      if (verificationResult.success) {
        // Verificar el score (0.0 - 1.0)
        const score = verificationResult.score;
        const isActionMatch = verificationResult.action === action;

        // Umbral recomendado: 0.5
        const isScoreValid = score >= 0.5;

        res.status(200).json({
          success: true,
          score: score,
          action: verificationResult.action,
          isActionMatch: isActionMatch,
          isScoreValid: isScoreValid,
          timestamp: verificationResult.challenge_ts,
          hostname: verificationResult.hostname,
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Verificación de reCAPTCHA fallida',
          errorCodes: verificationResult['error-codes'],
        });
      }
    } catch (error) {
      console.error('Error verificando reCAPTCHA:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
);

// Endpoint para validar códigos (mantener el existente)
exports.validarCodigo = onRequest(
  {
    cors: true,
    maxInstances: 10,
    region: 'us-central1',
    invoker: 'public', // Permite invocaciones públicas
  },
  async (req, res) => {
    // Configurar CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    // Extraer el código de la URL
    const urlParts = req.url.split('/');
    const code = urlParts[urlParts.length - 1];

    if (!code) {
      res.status(400).json({ error: 'Código requerido' });
      return;
    }

    try {
      const response = await fetch(`https://taxisonrisas.com/admin/v3/express/validar/${code}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer WwGkWiwDuHtUnLVXqZeRou2sDAcY3plI6e8WQKvVHBbmGkiOq3IsSAhogN0yS7YIyskArLoqM1ciJ7Ux2XUxuhQUrf5wduKupDs7XwozG9SG3RI7owJbApkoKBcgGsgO`,
        },
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error al validar código:', error);
      res.status(500).json({ error: 'Error en proxy Firebase.' });
    }
  },
);
