import { createContext, useState, useEffect } from 'react';

import { getFetcher, deleteFetcher } from 'src/api/globalFetcher';
import RefillData from 'src/api/refilll/RefillData';

import useSWR from 'swr';

// Create Context
export const RefillContext = createContext({});

// Provider Component
export const RefillProvider = ({ children }) => {
  const [refills, setRefills] = useState([]);
  const [refillSearch, setRefillSearch] = useState('');
  const [filter, setFilter] = useState('total_refills');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Fetch tickets from the API when the component mounts using useEffect
  const {
    data: refillsData,
    isLoading: isRefillsLoading,
    error: refillsError,
    mutate,
  } = useSWR('/api/data/refill/RefillData', getFetcher);
  useEffect(() => {
    if (refillsData) {
      setRefills(refillsData.data);
      setLoading(isRefillsLoading);
    } else if (refillsError) {
      setError(refillsError);
      setLoading(false);
      console.log('Failed to fetch refills data, using static data as fallback');
      // Use static data as fallback
      setRefills(RefillData);
    } else {
      setLoading(isRefillsLoading);
    }
  }, [refillsData, refillsError, isRefillsLoading]);

  // Delete a ticket with the specified ID from the server and update the tickets state
  const deleteRefill = async (id) => {
    try {
      await mutate(deleteFetcher('/api/data/refill/delete', { id }));
      setRefills((prevRefills) => {
        // Filter out the ticket with the given ID from the tickets list
        const updatedRefills = prevRefills.filter((refill) => refill.Id !== id);
        return updatedRefills;
      });
    } catch (err) {
      console.error('Error deleting refill:', err);
    }
  };

  // Update the ticket search term state based on the provided search term value.
  const searchRefills = (searchTerm) => {
    setRefillSearch(searchTerm);
  };

  return (
    <RefillContext.Provider
      value={{
        refills,
        error,
        loading,
        deleteRefill,
        setRefillSearch,
        searchRefills,
        refillSearch,
        filter,
        setFilter,
      }}
    >
      {children}
    </RefillContext.Provider>
  );
};
