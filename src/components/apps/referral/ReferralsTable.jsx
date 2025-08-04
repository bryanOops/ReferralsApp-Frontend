import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  Chip,
  TextField,
  TableContainer,
  CircularProgress,
  Alert,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useReferrals } from '../../../context/ReferralsContext';

const ReferralsTable = () => {
  const { visibleReferrals, loading, error, searchReferrals } = useReferrals();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setPage(1);
  }, [visibleReferrals]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Anulado':
        return 'primary';
      case 'Aceptado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error: {error}
      </Alert>
    );
  }

  // Calcular datos paginados
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedReferrals = visibleReferrals.slice(startIndex, endIndex);
  const totalPages = Math.ceil(visibleReferrals.length / rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Resetear a la primera página
  };

  return (
    <Box mt={4}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Por página</InputLabel>
          <Select value={rowsPerPage} label="Por página" onChange={handleRowsPerPageChange}>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ maxWidth: '260px' }}>
          <TextField
            size="small"
            label="Buscar"
            fullWidth
            onChange={(e) => searchReferrals(e.target.value)}
            placeholder="Buscar por nombre..."
          />
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
                <Typography variant="h6">Nombre</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Tipo</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Estado</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Comisión</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleReferrals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No se encontraron referidos
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedReferrals.map((referral, index) => (
                <TableRow key={referral.id || index} hover>
                  <TableCell>
                    <Typography variant="body2">{startIndex + index + 1}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="h6" fontWeight={600} noWrap>
                        {referral.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="h6" fontWeight={400} noWrap>
                        {referral.Type}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(referral.Status)}
                      label={referral.Status}
                      size="small"
                      sx={{ minWidth: '80px', textAlign: 'center' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="h6" fontWeight={400} noWrap>
                        {referral.Comission}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default ReferralsTable;
