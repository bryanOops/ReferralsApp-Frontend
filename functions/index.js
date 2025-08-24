const { onRequest } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const fetch = require('node-fetch');
const { doc, setDoc, serverTimestamp } = require('firebase-admin/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  updateDoc,
} = require('firebase-admin/firestore');

// Inicializar Firebase Admin (si no está ya)
let app;
let db;

if (!app) {
  app = initializeApp();
  db = getFirestore();
}

// Configuración global para las funciones
setGlobalOptions({
  maxInstances: 10,
  region: 'us-central1',
});

// Endpoint para verificar reCAPTCHA v3
exports.verifyRecaptcha = onRequest(async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: 'Token de reCAPTCHA requerido' });
      return;
    }

    // Verificar con Google reCAPTCHA
    const verificationResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: 'POST' },
    );

    const verificationData = await verificationResponse.json();

    if (verificationData.success) {
      res.json({
        success: true,
        score: verificationData.score,
        action: verificationData.action,
      });
    } else {
      res.json({
        success: false,
        error: 'Verificación de reCAPTCHA fallida',
        details: verificationData['error-codes'],
      });
    }
  } catch (error) {
    console.error('Error verificando reCAPTCHA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔥 NUEVA FUNCIÓN: Enviar emails reales
exports.sendEmail = onRequest(async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { to, subject, template, data } = req.body;

    if (!to || !subject || !template) {
      res.status(400).json({ error: 'Faltan campos requeridos: to, subject, template' });
      return;
    }

    // 🔧 OPCIÓN 1: SendGrid (Recomendado para producción con analytics)
    if (
      process.env.SENDGRID_API_KEY &&
      process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key_here'
    ) {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      let emailContent = '';

      // Template de email de bienvenida
      if (template === 'welcome') {
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2196F3;">¡Bienvenido a Smart Bonos!</h2>
            <p>Hola <strong>${data.nombres} ${data.apellidos}</strong>,</p>
            <p>Tu registro ha sido exitoso. Para completar tu perfil y acceder a todos los beneficios, haz clic en el siguiente enlace:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.completionUrl}" 
                 style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Completar Registro
              </a>
            </div>
            <p><strong>Este enlace expira en 7 días.</strong></p>
            <p>Saludos,<br>Equipo Smart Bonos</p>
          </div>
        `;
      }

      const msg = {
        to: to,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@smartbonos.com',
        subject: subject,
        html: emailContent,
      };

      await sgMail.send(msg);
      console.log(`✅ Email enviado exitosamente a ${to} via SendGrid`);

      res.json({
        success: true,
        message: 'Email enviado exitosamente via SendGrid',
        to: to,
        provider: 'SendGrid',
      });
      return;
    }

    // 🔧 OPCIÓN 2: Amazon SES (Más económico para producción)
    if (
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_ACCESS_KEY_ID !== 'your_aws_access_key_here' &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_SECRET_ACCESS_KEY !== 'your_aws_secret_key_here'
    ) {
      const AWS = require('aws-sdk');

      const ses = new AWS.SES({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
      });

      let emailContent = '';

      if (template === 'welcome') {
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2196F3;">¡Bienvenido a Smart Bonos!</h2>
            <p>Hola <strong>${data.nombres} ${data.apellidos}</strong>,</p>
            <p>Tu registro ha sido exitoso. Para completar tu perfil y acceder a todos los beneficios, haz clic en el siguiente enlace:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.completionUrl}" 
                 style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Completar Registro
              </a>
            </div>
            <p><strong>Este enlace expira en 7 días.</strong></p>
            <p>Saludos,<br>Equipo Smart Bonos</p>
          </div>
        `;
      }

      const params = {
        Source: process.env.SES_FROM_EMAIL || 'noreply@smartbonos.com',
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject },
          Body: { Html: { Data: emailContent } },
        },
      };

      await ses.sendEmail(params).promise();
      console.log(`✅ Email enviado exitosamente a ${to} via Amazon SES`);

      res.json({
        success: true,
        message: 'Email enviado exitosamente via Amazon SES',
        to: to,
        provider: 'Amazon SES',
      });
      return;
    }

    // 🔧 OPCIÓN 3: Mailgun (Alternativa económica)
    if (
      process.env.MAILGUN_API_KEY &&
      process.env.MAILGUN_API_KEY !== 'your_mailgun_api_key_here' &&
      process.env.MAILGUN_DOMAIN &&
      process.env.MAILGUN_DOMAIN !== 'smartbonos.com'
    ) {
      const formData = require('form-data');
      const Mailgun = require('mailgun.js');

      const mailgun = new Mailgun(formData);
      const client = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

      let emailContent = '';

      if (template === 'welcome') {
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2196F3;">¡Bienvenido a Smart Bonos!</h2>
            <p>Hola <strong>${data.nombres} ${data.apellidos}</strong>,</p>
            <p>Tu registro ha sido exitoso. Para completar tu perfil y acceder a todos los beneficios, haz clic en el siguiente enlace:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.completionUrl}" 
                 style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Completar Registro
              </a>
            </div>
            <p><strong>Este enlace expira en 7 días.</strong></p>
            <p>Saludos,<br>Equipo Smart Bonos</p>
          </div>
        `;
      }

      const messageData = {
        from: process.env.MAILGUN_FROM_EMAIL || `noreply@${process.env.MAILGUN_DOMAIN}`,
        to: to,
        subject: subject,
        html: emailContent,
      };

      await client.messages.create(process.env.MAILGUN_DOMAIN, messageData);
      console.log(`✅ Email enviado exitosamente a ${to} via Mailgun`);

      res.json({
        success: true,
        message: 'Email enviado exitosamente via Mailgun',
        to: to,
        provider: 'Mailgun',
      });
      return;
    }

    // 🔧 OPCIÓN 4: Gmail (Para desarrollo y volúmenes bajos)
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      const nodemailer = require('nodemailer');

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
        // Configuración para manejar límites
        pool: true, // Usar pool de conexiones
        maxConnections: 5, // Máximo 5 conexiones simultáneas
        maxMessages: 100, // Máximo 100 emails por conexión
        rateLimit: 20, // Máximo 20 emails por segundo
      });

      let emailContent = '';

      if (template === 'welcome') {
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2196F3;">¡Bienvenido a Smart Bonos!</h2>
            <p>Hola <strong>${data.nombres} ${data.apellidos}</strong>,</p>
            <p>Tu registro ha sido exitoso. Para completar tu perfil y acceder a todos los beneficios, haz clic en el siguiente enlace:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.completionUrl}" 
                 style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Completar Registro
              </a>
            </div>
            <p><strong>Este enlace expira en 7 días.</strong></p>
            <p>Saludos,<br>Equipo Smart Bonos</p>
          </div>
        `;
      }

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: to,
        subject: subject,
        html: emailContent,
      };

      // Sistema de reintento automático
      let retryCount = 0;
      const maxRetries = 3;

      const sendWithRetry = async () => {
        try {
          await transporter.sendMail(mailOptions);
          console.log(`✅ Email enviado exitosamente a ${to} via Gmail`);

          res.json({
            success: true,
            message: 'Email enviado exitosamente via Gmail',
            to: to,
            provider: 'Gmail',
            retryCount: retryCount,
          });
        } catch (error) {
          retryCount++;

          // Si es error de límite de Gmail, esperar y reintentar
          if (error.code === 'EAUTH' && retryCount < maxRetries) {
            console.log(
              `⚠️ Gmail rate limit, reintentando en ${
                retryCount * 2
              } segundos... (intento ${retryCount}/${maxRetries})`,
            );

            // Esperar antes de reintentar (tiempo exponencial)
            await new Promise((resolve) => setTimeout(resolve, retryCount * 2000));
            return sendWithRetry();
          }

          // Si es otro error o se agotaron los reintentos
          if (retryCount >= maxRetries) {
            console.error(
              `❌ Error final enviando email a ${to} via Gmail después de ${maxRetries} intentos:`,
              error,
            );

            // Guardar en cola para envío posterior
            try {
              const emailQueueRef = doc(db, 'emailQueue', `${Date.now()}_${Math.random()}`);
              await setDoc(emailQueueRef, {
                to: to,
                subject: subject,
                template: template,
                data: data,
                provider: 'Gmail',
                error: error.message,
                retryCount: retryCount,
                createdAt: serverTimestamp(),
                status: 'failed',
                nextRetry: new Date(Date.now() + 3600000), // Reintentar en 1 hora
              });

              console.log(`📧 Email agregado a cola de reintento para ${to}`);
            } catch (queueError) {
              console.error('Error guardando en cola:', queueError);
            }

            res.json({
              success: false,
              message: 'Email falló después de múltiples intentos, agregado a cola de reintento',
              to: to,
              provider: 'Gmail',
              error: error.message,
              retryCount: retryCount,
              queued: true,
            });
          } else {
            throw error;
          }
        }
      };

      await sendWithRetry();
      return;
    }

    // 🔧 OPCIÓN 5: Fallback - solo log (para desarrollo sin configuración)
    console.log('📧 SIMULANDO ENVÍO DE EMAIL:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Template:', template);
    console.log('Data:', data);
    console.log('⚠️ No hay configuración de email real. Configura alguna de estas opciones:');
    console.log('   - SENDGRID_API_KEY (SendGrid)');
    console.log('   - AWS_ACCESS_KEY_ID (Amazon SES)');
    console.log('   - MAILGUN_API_KEY (Mailgun)');
    console.log('   - GMAIL_USER (Gmail)');

    res.json({
      success: true,
      message: 'Email simulado (modo desarrollo)',
      to: to,
      note: 'Configura variables de entorno para envío real',
      availableOptions: ['SendGrid', 'Amazon SES', 'Mailgun', 'Gmail'],
    });
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
    });
  }
});

// 🔄 NUEVA FUNCIÓN: Procesar cola de emails fallidos
exports.processEmailQueue = onRequest(async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { batchSize = 10, processAll = false } = req.body;

    // Buscar emails fallidos que estén listos para reintento
    let queueQuery = query(
      collection(db, 'emailQueue'),
      where('status', '==', 'failed'),
      where('nextRetry', '<=', new Date()),
      orderBy('nextRetry', 'asc'),
    );

    // Si no se especifica processAll, limitar el lote
    if (!processAll) {
      queueQuery = query(queueQuery, limit(batchSize));
    }

    const queueSnapshot = await getDocs(queueQuery);

    if (queueSnapshot.empty) {
      res.json({
        success: true,
        message: 'No hay emails en cola para procesar',
        processed: 0,
        totalInQueue: 0,
      });
      return;
    }

    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const doc of queueSnapshot.docs) {
      const emailData = doc.data();
      processedCount++;

      try {
        // Verificar si el email ya fue procesado recientemente
        if (
          emailData.lastAttempt &&
          Date.now() - emailData.lastAttempt.toDate().getTime() < 300000
        ) {
          // 5 minutos
          console.log(`⏭️ Email ${emailData.to} procesado recientemente, saltando...`);
          skippedCount++;
          continue;
        }

        // Intentar reenviar el email
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: emailData.to,
            subject: emailData.subject,
            template: emailData.template,
            data: emailData.data,
          }),
        });

        if (emailResponse.ok) {
          // Email enviado exitosamente, eliminar de la cola
          await deleteDoc(doc.ref);
          successCount++;
          console.log(`✅ Email de cola enviado exitosamente a ${emailData.to}`);
        } else {
          // Email falló, actualizar próximo reintento
          const nextRetry = new Date(Date.now() + (emailData.retryCount + 1) * 3600000); // Incrementar tiempo
          await updateDoc(doc.ref, {
            status: 'failed',
            retryCount: emailData.retryCount + 1,
            nextRetry: nextRetry,
            lastAttempt: serverTimestamp(),
          });
          errorCount++;
          console.log(
            `❌ Email de cola falló para ${emailData.to}, próximo reintento: ${nextRetry}`,
          );
        }
      } catch (error) {
        console.error(`Error procesando email de cola para ${emailData.to}:`, error);
        errorCount++;

        // Actualizar estado del email en cola
        await updateDoc(doc.ref, {
          status: 'error',
          lastError: error.message,
          lastAttempt: serverTimestamp(),
        });
      }
    }

    // Obtener estadísticas totales de la cola
    const totalQuery = query(collection(db, 'emailQueue'));
    const totalSnapshot = await getDocs(totalQuery);
    const totalInQueue = totalSnapshot.size;

    res.json({
      success: true,
      message: 'Cola de emails procesada',
      processed: processedCount,
      success: successCount,
      errors: errorCount,
      skipped: skippedCount,
      totalInQueue: totalInQueue,
      batchSize: batchSize,
      processAll: processAll,
    });
  } catch (error) {
    console.error('Error procesando cola de emails:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
    });
  }
});

// 🚀 NUEVA FUNCIÓN: Procesar TODOS los emails pendientes
exports.processAllPendingEmails = onRequest(async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    // Procesar TODOS los emails pendientes
    const result = await fetch('https://tu-proyecto.cloudfunctions.net/processEmailQueue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        processAll: true,
        batchSize: 1000, // Procesar en lotes grandes
      }),
    });

    const data = await result.json();

    res.json({
      success: true,
      message: 'Procesamiento masivo de emails iniciado',
      result: data,
    });
  } catch (error) {
    console.error('Error iniciando procesamiento masivo:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
    });
  }
});

// 📊 NUEVA FUNCIÓN: Obtener estadísticas de la cola
exports.getEmailQueueStats = onRequest(async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    // Obtener estadísticas de la cola
    const queueQuery = query(collection(db, 'emailQueue'));
    const queueSnapshot = await getDocs(queueQuery);

    let stats = {
      total: 0,
      failed: 0,
      error: 0,
      processing: 0,
      byRetryCount: {},
    };

    queueSnapshot.forEach((doc) => {
      const data = doc.data();
      stats.total++;

      if (data.status === 'failed') stats.failed++;
      else if (data.status === 'error') stats.error++;
      else if (data.status === 'processing') stats.processing++;

      const retryCount = data.retryCount || 0;
      stats.byRetryCount[retryCount] = (stats.byRetryCount[retryCount] || 0) + 1;
    });

    res.json({
      success: true,
      stats: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
    });
  }
});

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
