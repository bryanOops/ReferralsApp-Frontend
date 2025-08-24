// src/utils/emailService.js
import { db } from '../firebase/firebaseConfig';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

// Función para generar token único
export const generateUniqueToken = () => {
  return nanoid(32); // Token de 32 caracteres
};

// Función para enviar email de bienvenida
export const sendWelcomeEmail = async (referralData) => {
  try {
    // Generar token único para completar datos
    const completionToken = generateUniqueToken();

    // Crear documento en la colección emailTokens
    const tokenRef = doc(db, 'emailTokens', completionToken);
    await setDoc(tokenRef, {
      referralId: referralData.id,
      email: referralData.correo,
      dni: referralData.dni,
      nombres: referralData.nombres,
      apellidos: referralData.apellidos,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      used: false,
      type: 'onboarding_completion',
    });

    // URL para completar datos
    const completionUrl = `${window.location.origin}/complete-data?token=${completionToken}`;

    // 🔥 NUEVO: Enviar email real usando Firebase Functions
    try {
      const emailResponse = await fetch(
        'https://us-central1-smartbonos.cloudfunctions.net/sendEmail',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: referralData.correo,
            subject: '¡Bienvenido! Completa tu registro',
            template: 'welcome',
            data: {
              nombres: referralData.nombres,
              apellidos: referralData.apellidos,
              completionUrl: completionUrl,
              dni: referralData.dni,
            },
          }),
        },
      );

      if (emailResponse.ok) {
        console.log('✅ Email enviado exitosamente');
      } else {
        console.warn('⚠️ Error en envío de email, pero continuando...');
      }
    } catch (emailError) {
      console.warn('⚠️ No se pudo enviar email real:', emailError.message);
      // Continuamos sin bloquear el flujo
    }

    // Guardar log del email en Firestore
    const emailLogRef = doc(db, 'emailLogs', completionToken);
    await setDoc(emailLogRef, {
      to: referralData.correo,
      subject: '¡Bienvenido! Completa tu registro',
      body: `Hola ${referralData.nombres} ${referralData.apellidos},

¡Bienvenido! Tu registro ha sido exitoso.

Para completar tu perfil y acceder a todos los beneficios, haz clic en el siguiente enlace:

${completionUrl}

Este enlace expira en 7 días.

Saludos,
Equipo Smart Bonos`,
      sentAt: serverTimestamp(),
      status: 'sent',
      token: completionToken,
      completionUrl: completionUrl,
    });

    return {
      success: true,
      token: completionToken,
      completionUrl,
    };
  } catch (error) {
    console.error('Error enviando email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Función para validar token
export const validateCompletionToken = async (token) => {
  try {
    const tokenRef = doc(db, 'emailTokens', token);
    const tokenSnap = await getDoc(tokenRef);

    if (!tokenSnap.exists()) {
      return { valid: false, error: 'Token inválido' };
    }

    const tokenData = tokenSnap.data();

    // Verificar si ya fue usado
    if (tokenData.used) {
      return { valid: false, error: 'Token ya utilizado' };
    }

    // Verificar si expiró
    if (tokenData.expiresAt.toDate() < new Date()) {
      return { valid: false, error: 'Token expirado' };
    }

    return { valid: true, data: tokenData };
  } catch (error) {
    console.error('Error validando token:', error);
    return { valid: false, error: error.message };
  }
};
