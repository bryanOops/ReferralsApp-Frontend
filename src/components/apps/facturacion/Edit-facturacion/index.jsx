import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { FacturacionContext } from '../../../../context/FacturacionContext/index';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { IconDeviceFloppy, IconArrowLeft } from '@tabler/icons-react';
import { Link } from 'react-router';

const FacturacionEdit = () => {
  const { facturas, updateFactura } = useContext(FacturacionContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFactura, setSelectedFactura] = useState(null);

  const [formData, setFormData] = useState({
    cliente: '',
    email: '',
    telefono: '',
    monto: '',
    fecha: '',
    estado: '',
    metodo: '',
    descripcion: '',
    ruc: '',
  });

  useEffect(() => {
    if (facturas && facturas.length > 0) {
      const factura = facturas.find((f) => f.Id === id);
      if (factura) {
        setSelectedFactura(factura);
        setFormData({
          cliente: factura.cliente || '',
          email: factura.email || '',
          telefono: factura.telefono || '',
          monto: factura.monto || '',
          fecha: factura.fecha || '',
          estado: factura.estado || '',
          metodo: factura.metodo || '',
          descripcion: factura.descripcion || '',
          ruc: factura.ruc || '',
        });
      }
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

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedFactura = {
        ...selectedFactura,
        ...formData,
      };
      await updateFactura(updatedFactura);
      navigate('/home/facturacion/list');
    } catch (error) {
      console.error('Error updating factura:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Editar Factura {selectedFactura.Id}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cliente"
              value={formData.cliente}
              onChange={handleChange('cliente')}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={handleChange('email')}
              margin="normal"
              type="email"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.telefono}
              onChange={handleChange('telefono')}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="RUC"
              value={formData.ruc}
              onChange={handleChange('ruc')}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Monto"
              value={formData.monto}
              onChange={handleChange('monto')}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha"
              value={formData.fecha}
              onChange={handleChange('fecha')}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select value={formData.estado} label="Estado" onChange={handleChange('estado')}>
                <MenuItem value="Pagada">Pagada</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Vencida">Vencida</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Método de Pago</InputLabel>
              <Select
                value={formData.metodo}
                label="Método de Pago"
                onChange={handleChange('metodo')}
              >
                <MenuItem value="Efectivo">Efectivo</MenuItem>
                <MenuItem value="Tarjeta de Crédito">Tarjeta de Crédito</MenuItem>
                <MenuItem value="Tarjeta de Débito">Tarjeta de Débito</MenuItem>
                <MenuItem value="Transferencia Bancaria">Transferencia Bancaria</MenuItem>
                <MenuItem value="Yape">Yape</MenuItem>
                <MenuItem value="Plin">Plin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              value={formData.descripcion}
              onChange={handleChange('descripcion')}
              margin="normal"
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<IconArrowLeft />}
                component={Link}
                to="/home/facturacion/list"
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                startIcon={<IconDeviceFloppy />}
              >
                Guardar Cambios
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default FacturacionEdit;
