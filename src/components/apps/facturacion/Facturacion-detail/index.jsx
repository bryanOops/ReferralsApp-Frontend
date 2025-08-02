import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FacturacionContext } from '../../../../context/FacturacionContext/index';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import { IconEdit, IconArrowLeft } from '@tabler/icons-react';
import { Link } from 'react-router';
import user1 from 'src/assets/images/profile/user-1.jpg';
import logoSonrisas from 'src/assets/images/logos/logo-sonrisas.svg';

const FacturacionDetail = () => {
  const { facturas } = useContext(FacturacionContext);
  const { id } = useParams();
  const [selectedFactura, setSelectedFactura] = useState(null);

  useEffect(() => {
    if (facturas && facturas.length > 0) {
      let factura = facturas.find((f) => String(f.id) === String(id));
      if (!factura) {
        // Si no se encuentra, mostrar la más reciente (mayor id)
        factura = facturas.reduce((a, b) => (a.id > b.id ? a : b));
      }
      setSelectedFactura(factura);
    }
  }, [facturas, id]);

  if (!selectedFactura) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" color="textSecondary">
          Cargando factura...
        </Typography>
      </Box>
    );
  }

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

  return (
    <Box>
      {/* Header de la factura reorganizado */}
      <Grid container spacing={4} mb={2}>
        {/* Logo e información de la empresa (izquierda) */}
        <Grid item xs={12} md={9}>
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <img
                src={logoSonrisas}
                alt="SONRISAS TU TAXI DE CONFIANZA"
                style={{ height: 50, marginRight: 10 }}
              />
            </Box>
            <Typography variant="body2" color="textSecondary" mb={1}>
              {selectedFactura.empresa?.direccion ||
                '2089, Runolfsson Harbors Suite 886 - Lima Perú'}
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={1}>
              Teléfono: {selectedFactura.empresa?.telefono || '955-439-2578'}{' '}
              &nbsp;&nbsp;|&nbsp;&nbsp; Correo:{' '}
              {selectedFactura.empresa?.email || 'admin@sonrisas.com'}
            </Typography>
          </Box>
        </Grid>

        {/* Factura y número (derecha) */}
        <Grid item xs={12} md={3} sx={{ textAlign: 'left' }}>
          <Box>
            <Typography variant="h6" fontWeight={600} color="primary" mb={1}>
              Factura
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'left' }}>
              Invoice No: {selectedFactura.factura}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      {/* Información del cliente */}
      <Grid container spacing={4} mb={3}>
        <Grid item xs={12} md={6}>
          <Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h6" fontWeight={600} sx={{ mr: 1, ml: -1 }}>
                To:
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                {selectedFactura.cliente}
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" mb={1} sx={{ ml: 3 }}>
              {selectedFactura.direccion}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ ml: 3 }}>
              Phone: {selectedFactura.telefono}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            textAlign="left"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <Typography variant="body2" color="textSecondary">
              Date: <br /> <strong>{selectedFactura.fechaEmision}</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary" pl={3}>
              Due Date: <br /> <strong>{selectedFactura.fechaVencimiento}</strong>
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Tabla de items */}
      <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 'none', border: 'none' }}>
        <Table sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell
                sx={{ fontWeight: 600, border: 'none', borderBottom: '1px solid #e0e0e0' }}
              >
                No.
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, border: 'none', borderBottom: '1px solid #e0e0e0' }}
              >
                Description
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  border: 'none',
                  borderBottom: '1px solid #e0e0e0',
                  textAlign: 'right',
                }}
              >
                Qty
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  border: 'none',
                  borderBottom: '1px solid #e0e0e0',
                  textAlign: 'right',
                }}
              >
                Unit Price
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  border: 'none',
                  borderBottom: '1px solid #e0e0e0',
                  textAlign: 'right',
                }}
              >
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedFactura.items?.map((item, index) => (
              <TableRow key={item.id} sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell sx={{ border: 'none', borderBottom: '1px solid #e0e0e0' }}>
                  {(index + 1).toString().padStart(2, '0')}
                </TableCell>
                <TableCell sx={{ border: 'none', borderBottom: '1px solid #e0e0e0' }}>
                  {item.descripcion}
                </TableCell>
                <TableCell
                  sx={{ border: 'none', borderBottom: '1px solid #e0e0e0', textAlign: 'right' }}
                >
                  {item.cantidad}
                </TableCell>
                <TableCell
                  sx={{ border: 'none', borderBottom: '1px solid #e0e0e0', textAlign: 'right' }}
                >
                  S/ {item.precioUnitario.toFixed(2)}
                </TableCell>
                <TableCell
                  sx={{ border: 'none', borderBottom: '1px solid #e0e0e0', textAlign: 'right' }}
                >
                  S/ {item.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Resumen de totales */}
      <Box textAlign="right" mb={3}>
        <Box mb={2} sx={{ display: 'inline-block', textAlign: 'right' }}>
          <Typography
            variant="body2"
            mb={1}
            sx={{ display: 'flex', justifyContent: 'space-between', py: 1, minWidth: '200px' }}
          >
            <span>Subtotal:</span>
            <strong>S/ {selectedFactura.subtotal}</strong>
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="body2"
            mb={1}
            sx={{ display: 'flex', justifyContent: 'space-between', py: 1, minWidth: '200px' }}
          >
            <span>Discount:</span>
            <strong>S/ {selectedFactura.descuento}</strong>
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="body2"
            mb={1}
            sx={{ display: 'flex', justifyContent: 'space-between', py: 1, minWidth: '200px' }}
          >
            <span>Taxes @ 18%:</span>
            <strong>S/ {selectedFactura.impuestos}</strong>
          </Typography>
        </Box>
        <Divider sx={{ my: 2, width: '200px', marginLeft: 'auto' }} />
        <Box
          sx={{
            backgroundColor: 'primary.light',
            p: 2,
            borderRadius: 1,
            display: 'inline-block',
            minWidth: '200px',
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <span>Total:</span>
            <span> {selectedFactura.monto}</span>
          </Typography>
        </Box>
      </Box>

      {/* Métodos de pago, notas y firma - alineados horizontalmente */}
      <Grid container spacing={4}>
        {/* Payment Methods y Note - izquierda */}
        <Grid item xs={12} md={8}>
          <Box>
            <Box mb={3}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Payment Methods
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={1}>
                {selectedFactura.empresa?.banco || 'Swiss Bank'}
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={1}>
                AC No: {selectedFactura.empresa?.cuenta || '1234567890'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Swift Code: {selectedFactura.empresa?.swiftCode || '12swisbank'}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Note
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Signature - derecha, alineado con Payment Methods */}
        <Grid
          item
          xs={12}
          md={4}
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-end"
          flexDirection="column"
          mt={7}
        >
          <Box textAlign="right">
            <Divider sx={{ mb: 2, width: '200px' }} />
            <Typography variant="body2" color="textSecondary" mb={1}>
              Signature
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Botones de acción */}
      <Box mt={3} display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft />}
          component={Link}
          to="/home/facturacion/list"
        >
          Regresar
        </Button>
      </Box>
    </Box>
  );
};

export default FacturacionDetail;
