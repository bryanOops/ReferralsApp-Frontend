import { createContext, useState, useEffect } from 'react';

import { getFetcher, deleteFetcher } from 'src/api/globalFetcher';
import CommissionsData from 'src/api/commissions/CommissionsData';

import useSWR from 'swr';

// Create Context
export const CommissionsContext = createContext({});

// Provider Component
export const CommissionsProvider = ({ children }) => {
  // Commissions state
  const [commissions, setCommissions] = useState([]);
  const [commissionSearch, setCommissionSearch] = useState('');
  const [commissionFilter, setCommissionFilter] = useState('total_commissions');

  // Common state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch commissions from the API
  const {
    data: commissionsData,
    isLoading: isCommissionsLoading,
    error: commissionsError,
    mutate: mutateCommissions,
  } = useSWR('/api/data/commissions/CommissionsData', getFetcher);

  // Handle commissions data
  useEffect(() => {
    if (commissionsData) {
      setCommissions(commissionsData.data);
      setLoading(isCommissionsLoading);
    } else if (commissionsError) {
      setError(commissionsError);
      setLoading(false);
      console.log('Failed to fetch commissions data, using static data as fallback');
      setCommissions(CommissionsData);
    } else {
      setLoading(isCommissionsLoading);
    }
  }, [commissionsData, commissionsError, isCommissionsLoading]);

  // Delete a commission
  const deleteCommission = async (id) => {
    try {
      await mutateCommissions(deleteFetcher('/api/data/commissions/delete', { id }));
      setCommissions((prevCommissions) => {
        const updatedCommissions = prevCommissions.filter((commission) => commission.Id !== id);
        return updatedCommissions;
      });
    } catch (err) {
      console.error('Error deleting commission:', err);
    }
  };

  // Search functions
  const searchCommissions = (searchTerm) => {
    setCommissionSearch(searchTerm);
  };

  return (
    <CommissionsContext.Provider
      value={{
        // Commissions (using refills as alias for backward compatibility)
        refills: commissions,
        refillSearch: commissionSearch,
        refillFilter: commissionFilter,
        setRefillFilter: setCommissionFilter,
        deleteRefill: deleteCommission,
        searchRefills: searchCommissions,

        // Common
        error,
        loading,
      }}
    >
      {children}
    </CommissionsContext.Provider>
  );
};
