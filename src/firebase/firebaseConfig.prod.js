// src/firebase/firebaseConfig.prod.js
// Configuración de Firebase para PRODUCCIÓN
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración para PRODUCCIÓN (smartbonos.com)
const firebaseConfigProd = {
  apiKey: 'AIzaSyBWB4S7ptxCSte6IEgRDGxXwTD9jKEbyg4',
  authDomain: 'taxi-smiles-referral.firebaseapp.com',
  projectId: 'taxi-smiles-referral', // Proyecto de producción
  storageBucket: 'taxi-smiles-referral.firebasestorage.app',
  messagingSenderId: '271799247786',
  appId: '1:271799247786:web:09ce57fd8976c0412ec1d3',
  measurementId: 'G-P97VRHY5C5',
};

// Initialize Firebase para producción
const appProd = initializeApp(firebaseConfigProd, 'prod');
const analyticsProd = getAnalytics(appProd);
const dbProd = getFirestore(appProd);
const authProd = getAuth(appProd);

export { dbProd as db, authProd as auth };
export default appProd;
