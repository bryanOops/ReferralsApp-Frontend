// src/firebase/firebaseConfig.js
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBWB4S7ptxCSte6IEgRDGxXwTD9jKEbyg4',
  authDomain: 'taxi-smiles-referral.firebaseapp.com',
  projectId: 'taxi-smiles-referral',
  storageBucket: 'taxi-smiles-referral.firebasestorage.app',
  messagingSenderId: '271799247786',
  appId: '1:271799247786:web:09ce57fd8976c0412ec1d3',
  measurementId: 'G-P97VRHY5C5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
