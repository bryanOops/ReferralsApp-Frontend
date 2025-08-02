// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useContext, useEffect, useState } from 'react';

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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { CommissionsContext } from 'src/context/CommissionsContext';

const CommissionsRefillListing = () => {
  const { refills, deleteRefill, searchRefills, refillSearch, refillFilter } =
    useContext(CommissionsContext);
  const [monthFilter, setMonthFilter] = useState('March 2022');
  const [typeFilter, setTypeFilter] = useState('Todos');

  const theme = useTheme();

  const getVisibleRefills = (refills, filter, refillSearch) => {
    // Verificar que refills sea un array válido
    if (!refills || !Array.isArray(refills)) {
      return [];
    }

    // Asegurar que refillSearch sea una cadena válida
    const searchTerm = refillSearch ? refillSearch.toLocaleLowerCase() : '';

    let filteredRefills = refills.filter((c) => !c.deleted);

    // Filtrar por búsqueda
    if (searchTerm) {
      filteredRefills = filteredRefills.filter(
        (c) => c.Description && c.Description.toLocaleLowerCase().includes(searchTerm),
      );
    }

    // Filtrar por tipo
    if (typeFilter !== 'Todos') {
      filteredRefills = filteredRefills.filter((c) => c.Type === typeFilter);
    }

    return filteredRefills;
  };

  // Verificar que refills esté disponible antes de procesar
  const visibleRefills = refills ? getVisibleRefills(refills, refillFilter, refillSearch) : [];

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Comisiones
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Mes</InputLabel>
            <Select
              value={monthFilter}
              label="Mes"
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <MenuItem value="March 2022">March 2022</MenuItem>
              <MenuItem value="April 2022">April 2022</MenuItem>
              <MenuItem value="May 2022">May 2022</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Tipo</InputLabel>
            <Select value={typeFilter} label="Tipo" onChange={(e) => setTypeFilter(e.target.value)}>
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Bono">Bono</MenuItem>
              <MenuItem value="Referido">Referido</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ maxWidth: '260px' }}>
            <TextField
              size="small"
              label="Search"
              fullWidth
              onChange={(e) => searchRefills(e.target.value)}
            />
          </Box>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Id</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Descripción</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Referidos</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Monto</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Fecha</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRefills.map((refill) => (
              <TableRow key={refill.Id} hover>
                <TableCell>
                  <Typography variant="body1" noWrap>
                    {refill.Id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" noWrap>
                    {refill.Description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight={500} noWrap>
                    {refill.Referrals}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={refill.Amount}
                    size="small"
                    sx={{
                      backgroundColor: '#E6FFFA',
                      color: '#333333',
                      fontWeight: 600,
                      borderRadius: '8px',
                      minWidth: '100px',
                      textAlign: 'center',
                      '& .MuiChip-label': {
                        px: 2,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" noWrap>
                    {refill.Date}
                  </Typography>
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

export default CommissionsRefillListing;
