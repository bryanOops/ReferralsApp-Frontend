// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useContext, useEffect } from 'react';

import { format } from 'date-fns';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Tooltip,
  TextField,
  Pagination,
  useTheme,
  TableContainer,
} from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { RefillContext } from 'src/context/RefillContext';

const ReferralRefillListing = () => {
  const { refills, deleteRefill, searchRefills, refillSearch, filter } = useContext(RefillContext);

  const theme = useTheme();

  const getVisibleRefills = (refills, filter, refillSearch) => {
    // Verificar que refills sea un array válido
    if (!refills || !Array.isArray(refills)) {
      return [];
    }

    // Asegurar que refillSearch sea una cadena válida
    const searchTerm = refillSearch ? refillSearch.toLocaleLowerCase() : '';

    switch (filter) {
      case 'total_refills':
        return refills.filter(
          (c) =>
            !c.deleted && c.ticketTitle && c.ticketTitle.toLocaleLowerCase().includes(searchTerm),
        );

      case 'Exitoso':
        return refills.filter(
          (c) =>
            !c.deleted &&
            c.Status === 'Exitoso' &&
            c.ticketTitle &&
            c.ticketTitle.toLocaleLowerCase().includes(searchTerm),
        );

      case 'Fallido':
        return refills.filter(
          (c) =>
            !c.deleted &&
            c.Status === 'Fallido' &&
            c.ticketTitle &&
            c.ticketTitle.toLocaleLowerCase().includes(searchTerm),
        );

      default:
        // Si el filtro es undefined o no reconocido, mostrar todos los refills
        return refills.filter(
          (c) =>
            !c.deleted && c.ticketTitle && c.ticketTitle.toLocaleLowerCase().includes(searchTerm),
        );
    }
  };

  // Verificar que refills esté disponible antes de procesar
  const visibleRefills = refills ? getVisibleRefills(refills, filter, refillSearch) : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Exitoso':
        return 'success';
      case 'Fallido':
        return 'error';
      default:
        return 'default';
    }
  };

  const getMethodText = (type) => {
    switch (type) {
      case 'Conductor':
        return 'Tarjeta';
      case 'Pasajero':
        return 'Efectivo';
      default:
        return 'Tarjeta';
    }
  };

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Últimas recargas
        </Typography>
        <Box sx={{ maxWidth: '260px' }}>
          <TextField
            size="small"
            label="Search"
            fullWidth
            onChange={(e) => searchRefills(e.target.value)}
          />
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">FECHA</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">MONTO</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">MÉTODO</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">ESTADO</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRefills.map((refill) => (
              <TableRow key={refill.Id} hover>
                <TableCell>
                  <Typography variant="body1" noWrap>
                    {format(new Date(refill.Date), 'dd MMM')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight={500} noWrap>
                    {refill.Comission}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" noWrap>
                    {getMethodText(refill.Type)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    color={getStatusColor(refill.Status)}
                    label={refill.Status}
                    size="small"
                    sx={{ minWidth: '80px', textAlign: 'center' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box my={3} display="flex" justifyContent={'center'}>
        <Pagination count={10} color="primary" />
      </Box>
    </Box>
  );
};

export default ReferralRefillListing;
