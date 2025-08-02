import { createContext, useEffect, useState } from 'react';
import React from 'react';
import useSWR from 'swr';
import { deleteFetcher, getFetcher, postFetcher, putFetcher } from 'src/api/globalFetcher';

export const FacturacionContext = createContext(undefined);

export const FacturacionProvider = ({ children }) => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    data: facturasData,
    isLoading: isFacturasLoading,
    error: facturasError,
    mutate,
  } = useSWR('/api/data/facturacion/FacturacionData', getFetcher);

  useEffect(() => {
    if (facturasData) {
      setFacturas(facturasData.data);
      setLoading(isFacturasLoading);
    } else if (facturasError) {
      setLoading(isFacturasLoading);
      setError(facturasError);
    } else {
      setLoading(isFacturasLoading);
    }
  }, [facturasData, facturasError, isFacturasLoading]);

  // Function to delete a factura
  const deleteFactura = async (facturaId) => {
    try {
      await mutate(deleteFetcher('/api/data/facturacion/delete', { facturaId }));
    } catch (error) {
      console.error('Error deleting factura:', error);
    }
  };

  const addFactura = async (newFactura) => {
    try {
      await mutate(postFetcher('/api/data/facturacion/add', newFactura));
    } catch (error) {
      console.error('Error adding factura:', error);
    }
  };

  // Function to update a factura
  const updateFactura = async (updatedFactura) => {
    try {
      await mutate(putFetcher('/api/data/facturacion/update', updatedFactura));
    } catch (error) {
      console.error('Error updating factura:', error);
    }
  };

  return (
    <FacturacionContext.Provider
      value={{ facturas, loading, error, deleteFactura, addFactura, updateFactura }}
    >
      {children}
    </FacturacionContext.Provider>
  );
};
