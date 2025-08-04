import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, query, where, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../AuthContext';

const ReferralCodesContext = createContext();

export const useReferralCodes = () => {
  const context = useContext(ReferralCodesContext);
  if (!context) {
    throw new Error('useReferralCodes must be used within a ReferralCodesProvider');
  }
  return context;
};

export const ReferralCodesProvider = ({ children }) => {
  const [referralCodeData, setReferralCodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Función para obtener el referralCode del usuario actual
  const getReferralCodeByUserId = async (userId) => {
    try {
      const q = query(collection(db, 'referralCodes'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0];
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo referralCode:', error);
      return null;
    }
  };

  // Escuchar cambios en tiempo real del referralCode del usuario
  useEffect(() => {
    if (!currentUser?.uid) {
      setReferralCodeData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchAndListenToReferralCode = async () => {
      try {
        const referralCodeDoc = await getReferralCodeByUserId(currentUser.uid);

        if (!referralCodeDoc) {
          setReferralCodeData(null);
          setLoading(false);
          return;
        }

        // Escuchar cambios en tiempo real
        const unsubscribe = onSnapshot(
          doc(db, 'referralCodes', referralCodeDoc.id),
          (doc) => {
            if (doc.exists()) {
              setReferralCodeData({
                id: doc.id,
                ...doc.data(),
              });
            } else {
              setReferralCodeData(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Error escuchando cambios en referralCode:', error);
            setError(error);
            setLoading(false);
          },
        );

        return unsubscribe;
      } catch (error) {
        console.error('Error configurando listener de referralCode:', error);
        setError(error);
        setLoading(false);
      }
    };

    const unsubscribe = fetchAndListenToReferralCode();

    return () => {
      if (unsubscribe) {
        unsubscribe.then((unsub) => unsub && unsub());
      }
    };
  }, [currentUser?.uid]);

  const value = {
    referralCodeData,
    loading,
    error,
    // Contadores calculados
    driversCount: referralCodeData?.countConductores || 0,
    passengersCount: referralCodeData?.countPasajeros || 0,
    totalReferrals:
      (referralCodeData?.countConductores || 0) + (referralCodeData?.countPasajeros || 0),
  };

  return <ReferralCodesContext.Provider value={value}>{children}</ReferralCodesContext.Provider>;
};

export default ReferralCodesContext;
