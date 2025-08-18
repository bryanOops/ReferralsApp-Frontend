// src/firebase/firebaseConfig.dev.js
// Configuración de Firebase para DESARROLLO LOCAL
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración para DESARROLLO (proyecto de pruebas)
const firebaseConfigDev = {
  apiKey: 'AIzaSyAanr0Px4fgccix9PwMHZtNDUGcPeDLDrE',
  authDomain: 'smartbonos.firebaseapp.com',
  projectId: 'smartbonos', // Proyecto de desarrollo
  storageBucket: 'smartbonos.firebasestorage.app',
  messagingSenderId: '280867632773',
  appId: '1:280867632773:web:e6355b918e1bb511ab1bec',
  measurementId: 'G-XXXXXXXXXX', // Opcional, agregar si tienes Analytics
};

// Initialize Firebase para desarrollo
const appDev = initializeApp(firebaseConfigDev, 'dev');
const analyticsDev = getAnalytics(appDev);
const dbDev = getFirestore(appDev);
const authDev = getAuth(appDev);

export { dbDev as db, authDev as auth };
export default appDev;
