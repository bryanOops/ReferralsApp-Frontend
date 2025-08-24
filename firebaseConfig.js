// firebaseConfig.js
// Configuración principal de Firebase que detecta automáticamente el entorno

// Detectar el entorno
const isDevelopment =
  process.env.NODE_ENV === 'development' ||
  process.env.REACT_APP_ENV === 'development' ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

// Importar configuración según el entorno
let firebaseConfig;

if (isDevelopment) {
  // Configuración para DESARROLLO LOCAL
  firebaseConfig = {
    apiKey: 'AIzaSyAanr0Px4fgccix9PwMHZtNDUGcPeDLDrE',
    authDomain: 'smartbonos.firebaseapp.com',
    projectId: 'smartbonos', // Proyecto de desarrollo
    storageBucket: 'smartbonos.firebasestorage.app',
    messagingSenderId: '280867632773',
    appId: '1:280867632773:web:e6355b918e1bb511ab1bec',
    measurementId: 'G-XXXXXXXXXX', // Opcional, agregar si tienes Analytics
  };

  console.log('🚀 Firebase: Usando configuración de DESARROLLO (smartbonos)');
} else {
  // Configuración para PRODUCCIÓN
  firebaseConfig = {
    apiKey: 'AIzaSyBWB4S7ptxCSte6IEgRDGxXwTD9jKEbyg4',
    authDomain: 'taxi-smiles-referral.firebaseapp.com',
    projectId: 'taxi-smiles-referral', // Proyecto de producción
    storageBucket: 'taxi-smiles-referral.firebasestorage.app',
    messagingSenderId: '271799247786',
    appId: '1:271799247786:web:09ce57fd8976c0412ec1d3',
    measurementId: 'G-P97VRHY5C5',
  };

  console.log('🌐 Firebase: Usando configuración de PRODUCCIÓN (taxi-smiles-referral)');
}

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;
