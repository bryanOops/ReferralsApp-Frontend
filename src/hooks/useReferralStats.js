import { useReferralCodes } from '../context/ReferralCodesContext';

/**
 * Hook personalizado para obtener estadísticas de referidos
 * @returns {Object} Objeto con estadísticas de referidos
 */
export const useReferralStats = () => {
  const { referralCodeData, driversCount, passengersCount, totalReferrals, loading, error } =
    useReferralCodes();

  return {
    // Datos completos del referralCode
    referralCodeData,

    // Contadores
    driversCount,
    passengersCount,
    totalReferrals,

    // Estados
    loading,
    error,

    // Métodos de utilidad
    hasReferrals: totalReferrals > 0,
    hasDrivers: driversCount > 0,
    hasPassengers: passengersCount > 0,

    // Porcentajes
    driversPercentage: totalReferrals > 0 ? Math.round((driversCount / totalReferrals) * 100) : 0,
    passengersPercentage:
      totalReferrals > 0 ? Math.round((passengersCount / totalReferrals) * 100) : 0,

    // Información del código de referido
    referralCode: referralCodeData?.code || null,
    isActive: referralCodeData?.activo || false,
    userType: referralCodeData?.type || null,
  };
};
