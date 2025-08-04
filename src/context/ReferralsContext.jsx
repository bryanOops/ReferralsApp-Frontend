import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from './AuthContext';

const ReferralsContext = createContext();

export const useReferrals = () => {
  const context = useContext(ReferralsContext);
  if (!context) {
    throw new Error('useReferrals debe ser usado dentro de un ReferralsProvider');
  }
  return context;
};

export const ReferralsProvider = ({ children }) => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('total_referrals');
  const { currentUser } = useAuth();

  // Función para generar comisión aleatoria (temporal)
  const generateRandomCommission = () => {
    const min = 10;
    const max = 25;
    return `S/ ${(Math.random() * (max - min) + min).toFixed(2)}`;
  };

  // Función para obtener referidos desde Firestore
  const fetchReferrals = async (referralCode) => {
    if (!referralCode) return;

    try {
      setLoading(true);
      setError(null);

      const referralsRef = collection(db, 'referrals');
      const q = query(referralsRef, where('codeId', '==', referralCode));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const referralsData = [];
          console.log('Query snapshot size:', querySnapshot.size);
          console.log('Referral code being searched:', referralCode);

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Referral data found:', data);
            referralsData.push({
              id: doc.id,
              ...data,
              // Agregar campos temporales para la tabla
              Status: 'Aceptado', // Temporal: todos como aceptados
              Comission: generateRandomCommission(), // Temporal: comisión aleatoria
              name: `${data.nombres} ${data.apellidos}`, // Combinar nombre y apellido
              Type: data.roleName || 'Pasajero', // Usar roleName o default
            });
          });

          // Ordenar por fecha de creación (más reciente primero)
          referralsData.sort((a, b) => {
            // Si hay timestamp de creación, usarlo
            if (a.createdAt && b.createdAt) {
              return b.createdAt.toDate
                ? b.createdAt.toDate() - a.createdAt.toDate()
                : b.createdAt - a.createdAt;
            }
            // Si no hay timestamp, usar el ID del documento (más reciente primero)
            return b.id.localeCompare(a.id);
          });

          console.log('Processed and sorted referrals data:', referralsData);
          setReferrals(referralsData);
          setLoading(false);
        },
        (error) => {
          console.error('Error obteniendo referidos:', error);
          setError(error.message);
          setLoading(false);
        },
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error en fetchReferrals:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Función para buscar referidos
  const searchReferrals = (term) => {
    setSearchTerm(term);
  };

  // Función para filtrar referidos
  const filterReferrals = (filterType) => {
    setFilter(filterType);
  };

  // Obtener referidos visibles basados en filtros y búsqueda
  const getVisibleReferrals = () => {
    let filteredReferrals = referrals.filter((referral) =>
      referral.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Aplicar filtros adicionales
    switch (filter) {
      case 'total_referrals':
        break; // No aplicar filtro adicional

      case 'Conductor':
        filteredReferrals = filteredReferrals.filter((referral) => referral.Type === 'Conductor');
        break;

      case 'Pasajero':
        filteredReferrals = filteredReferrals.filter((referral) => referral.Type === 'Pasajero');
        break;

      case 'Pendiente':
        filteredReferrals = filteredReferrals.filter((referral) => referral.Status === 'Pendiente');
        break;

      case 'Anulado':
        filteredReferrals = filteredReferrals.filter((referral) => referral.Status === 'Anulado');
        break;

      case 'Aceptado':
        filteredReferrals = filteredReferrals.filter((referral) => referral.Status === 'Aceptado');
        break;

      default:
        break; // No aplicar filtro adicional
    }

    // Mantener el orden original (más reciente primero)
    return filteredReferrals;
  };

  // Efecto para obtener el código de referido del usuario y cargar los referidos
  useEffect(() => {
    if (currentUser) {
      // Obtener el código de referido desde la colección referralCodes
      const getUserReferralCode = async () => {
        try {
          console.log('Current user:', currentUser);

          // Buscar en referralCodes el documento que tenga userId igual al uid del usuario
          const referralCodesRef = collection(db, 'referralCodes');
          const q = query(referralCodesRef, where('userId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);

          console.log('ReferralCodes query snapshot size:', querySnapshot.size);

          if (!querySnapshot.empty) {
            const referralCodeData = querySnapshot.docs[0].data();
            console.log('ReferralCode data found:', referralCodeData);
            const referralCode = referralCodeData.code;
            console.log('Referral code from referralCodes:', referralCode);

            if (referralCode) {
              fetchReferrals(referralCode);
            } else {
              console.log('No referral code found in referralCodes');
              setLoading(false);
            }
          } else {
            console.log('No referralCode document found for user');
            setLoading(false);
          }
        } catch (error) {
          console.error('Error obteniendo código de referido:', error);
          setError(error.message);
          setLoading(false);
        }
      };

      getUserReferralCode();
    }
  }, [currentUser]);

  const value = {
    referrals,
    visibleReferrals: getVisibleReferrals(),
    loading,
    error,
    searchTerm,
    filter,
    searchReferrals,
    filterReferrals,
    fetchReferrals,
  };

  return <ReferralsContext.Provider value={value}>{children}</ReferralsContext.Provider>;
};
