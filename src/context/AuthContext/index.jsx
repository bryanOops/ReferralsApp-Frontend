import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  collection,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registro de usuario
  const register = async (email, password, additionalData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar el perfil con nombre si se proporcionó
      if (additionalData.displayName) {
        await updateProfile(user, {
          displayName: additionalData.displayName,
        });
      }

      // Crear documento de usuario en Firestore
      const userDoc = {
        uid: user.uid,
        email: user.email,
        displayName: additionalData.displayName || '',
        nombres: additionalData.nombres || '',
        apellidos: additionalData.apellidos || '',
        dni: additionalData.dni || '',
        telefono: additionalData.telefono || '',
        auth: true,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        ...additionalData,
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Inicio de sesión
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Actualizar último login
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(
        userRef,
        {
          lastLoginAt: serverTimestamp(),
        },
        { merge: true },
      );

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // Recuperar contraseña
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // Buscar usuario por DNI para hacer match con referidos
  const findUserByCredentials = async (email, dni) => {
    try {
      const q = query(
        collection(db, 'users'),
        where('correo', '==', email),
        where('dni', '==', dni),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.error('Error buscando usuario:', error);
      return null;
    }
  };

  // Obtener datos completos del usuario desde Firestore
  const getUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      return null;
    }
  };

  // Obtener referidos de un conductor
  const getUserReferrals = async (registerCode) => {
    try {
      const q = query(
        collection(db, 'users'),
        where('registerCode', '==', registerCode),
        where('type', '==', 'referido'),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error obteniendo referidos:', error);
      return [];
    }
  };

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Obtener datos adicionales del usuario desde Firestore
        const data = await getUserData(user.uid);
        setUserData(data);
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    register,
    login,
    logout,
    resetPassword,
    findUserByCredentials,
    getUserData,
    getUserReferrals,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
