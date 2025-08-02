import React, { useContext, useState } from 'react';
import { FacturacionContext } from 'src/context/FacturacionContext/index';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Grid,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconListDetails,
  IconReceiptDollar,
  IconCheck,
  IconClock,
  IconDownload,
} from '@tabler/icons-react';
import { Link } from 'react-router';
import user1 from 'src/assets/images/profile/user-1.jpg';
import { useTheme } from '@mui/material/styles';

const FacturacionList = () => {
  const theme = useTheme();
  const { facturas, deleteFactura } = useContext(FacturacionContext);
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const getVisibleFacturas = (facturas, filter, search) => {
    if (!facturas || !Array.isArray(facturas)) {
      return [];
    }

    return facturas.filter((factura) => {
      const matchesFilter = filter === 'Todos' || factura.estado === filter;
      const matchesSearch =
        (factura.cliente || '').toLowerCase().includes(search.toLowerCase()) ||
        (factura.factura || '').toLowerCase().includes(search.toLowerCase()) ||
        (factura.email || '').toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  };

  const visibleFacturas = getVisibleFacturas(facturas, estadoFilter, searchTerm);

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Pagada':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Vencida':
        return 'error';
      default:
        return 'default';
    }
  };

  // Calculate counts for different statuses
  const Total = facturas?.length || 0;
  const Pagadas = facturas?.filter((f) => f.estado === 'Pagada').length || 0;
  const Pendientes = facturas?.filter((f) => f.estado === 'Pendiente').length || 0;
  const Vencidas = facturas?.filter((f) => f.estado === 'Vencida').length || 0;

  // Handle filter card click
  const handleFilterClick = (status) => {
    setEstadoFilter(status);
  };

  return (
    <Box>
      {/* Filter Cards estilo Figma mejorado */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <Box
            bgcolor={theme.palette.primary.light}
            p={4}
            borderRadius={2}
            textAlign="center"
            minHeight={100}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.06)' },
            }}
            onClick={() => handleFilterClick('Todos')}
          >
            <Typography fontWeight={700} color={theme.palette.primary.main} fontSize={32} mb={1.5}>
              {Total}
            </Typography>
            <Typography fontWeight={500} color={theme.palette.primary.main} fontSize={16}>
              Total de Facturas
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Box
            bgcolor={theme.palette.warning.light}
            p={4}
            borderRadius={2}
            textAlign="center"
            minHeight={100}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.06)' },
            }}
            onClick={() => handleFilterClick('Pendiente')}
          >
            <Typography fontWeight={700} color={theme.palette.warning.main} fontSize={32} mb={1.5}>
              {Pendientes}
            </Typography>
            <Typography fontWeight={500} color={theme.palette.warning.main} fontSize={16}>
              Facturas pendientes
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Box
            bgcolor={theme.palette.success.light}
            p={4}
            borderRadius={2}
            textAlign="center"
            minHeight={100}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.06)' },
            }}
            onClick={() => handleFilterClick('Pagada')}
          >
            <Typography fontWeight={700} color={theme.palette.success.main} fontSize={32} mb={1.5}>
              {Pagadas}
            </Typography>
            <Typography fontWeight={500} color={theme.palette.success.main} fontSize={16}>
              Facturas aceptadas
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Box
            bgcolor={theme.palette.error.light}
            p={4}
            borderRadius={2}
            textAlign="center"
            minHeight={100}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.06)' },
            }}
            onClick={() => handleFilterClick('Vencida')}
          >
            <Typography fontWeight={700} color={theme.palette.error.main} fontSize={32} mb={1.5}>
              {Vencidas}
            </Typography>
            <Typography fontWeight={500} color={theme.palette.error.main} fontSize={16}>
              Facturas rechazadas
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Barra superior de acciones */}
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm="auto">
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 160 },
            }}
          >
            Generar Factura
          </Button>
        </Grid>
        <Grid item xs={12} sm={true}>
          <Box display="flex" justifyContent="flex-end">
            <TextField
              id="search"
              type="text"
              size="small"
              variant="outlined"
              placeholder="Buscar factura"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 240 },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconEye size={'16'} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Tabla */}
      <Box mt={4}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Id</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Factura</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Fecha Emisión</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Estado</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6">Monto</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6">Acciones</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleFacturas && visibleFacturas.length > 0 ? (
                visibleFacturas.map((factura) => (
                  <TableRow key={factura.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{factura.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500} color="primary" sx={{ cursor: 'pointer' }}>
                        {factura.factura}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{factura.fechaEmision}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(factura.estado)}
                        label={
                          factura.estado === 'Pagada'
                            ? 'Aceptada'
                            : factura.estado === 'Vencida'
                            ? 'Rechazada'
                            : factura.estado
                        }
                        size="small"
                        sx={{ minWidth: '80px', fontWeight: 600, fontSize: 14 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={600}>{factura.monto}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            component={Link}
                            to={`/home/facturacion/detail/${factura.id}`}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': {
                                color: 'text.primary',
                                backgroundColor: 'action.hover',
                              },
                            }}
                          >
                            <IconEye size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Descargar">
                          <IconButton
                            size="small"
                            sx={{
                              color: 'text.secondary',
                              '&:hover': {
                                color: 'text.primary',
                                backgroundColor: 'action.hover',
                              },
                            }}
                          >
                            <IconDownload size={18} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="textSecondary">
                      {facturas && facturas.length === 0
                        ? 'No hay facturas disponibles'
                        : 'Cargando facturas...'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box my={3} display="flex" justifyContent={'center'}>
        <Pagination count={10} color="primary" />
      </Box>
    </Box>
  );
};

export default FacturacionList;
