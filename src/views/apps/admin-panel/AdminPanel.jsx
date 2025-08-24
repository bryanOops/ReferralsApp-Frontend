import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import { IconEye, IconCheck, IconX, IconClock, IconUserCheck, IconCar } from '@tabler/icons';
import { db } from '../../../../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import PageContainer from '../../../components/container/PageContainer';

const AdminPanel = () => {
  const [pendingReferrals, setPendingReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [decision, setDecision] = useState('');
  const [notes, setNotes] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [showAlert, setShowAlert] = useState(false);

  // Cargar referidos pendientes
  useEffect(() => {
    loadPendingReferrals();
  }, []);

  const loadPendingReferrals = async () => {
    try {
      setLoading(true);

      // Buscar referidos en paso 2 (en revisión de documentos)
      const referralsQuery = query(
        collection(db, 'referrals'),
        where('onboarding_step', '==', 2),
        where('onboarding_status', '==', 'EN_REVISION_DOCS'),
        orderBy('datosCompletadosAt', 'desc'),
      );

      const referralsSnapshot = await getDocs(referralsQuery);
      const referrals = [];

      referralsSnapshot.forEach((doc) => {
        referrals.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setPendingReferrals(referrals);
    } catch (error) {
      console.error('Error cargando referidos:', error);
      setAlertMessage('Error cargando referidos');
      setAlertSeverity('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (referral) => {
    setSelectedReferral(referral);
    setDialogOpen(true);
  };

  const handleDecision = async () => {
    if (!decision || !selectedReferral) return;

    try {
      const referralRef = doc(db, 'referrals', selectedReferral.id);

      let newStatus = '';
      let newStep = 0;

      if (decision === 'APROBADO') {
        newStatus = 'APROBADO';
        newStep = 3; // Evaluado
      } else if (decision === 'RECHAZADO') {
        newStatus = 'RECHAZADO';
        newStep = 2; // Se mantiene en paso 2
      }

      await updateDoc(referralRef, {
        onboarding_status: newStatus,
        onboarding_step: newStep,
        decision: {
          status: decision,
          notes: notes,
          decidedAt: serverTimestamp(),
          decidedBy: 'admin', // Aquí podrías usar el ID del admin logueado
        },
      });

      // Crear tarea para siguiente paso si es aprobado
      if (decision === 'APROBADO') {
        await addDoc(collection(db, 'adminTasks'), {
          tipo: 'ENTREVISTA_VEHICULO',
          referralId: selectedReferral.id,
          dni: selectedReferral.dni,
          nombres: selectedReferral.nombres,
          apellidos: selectedReferral.apellidos,
          createdAt: serverTimestamp(),
          status: 'PENDIENTE',
          prioridad: 'ALTA',
        });
      }

      setAlertMessage(`Referido ${decision.toLowerCase()} exitosamente`);
      setAlertSeverity('success');
      setShowAlert(true);

      // Cerrar dialog y recargar lista
      setDialogOpen(false);
      setSelectedReferral(null);
      setDecision('');
      setNotes('');
      loadPendingReferrals();
    } catch (error) {
      console.error('Error actualizando referral:', error);
      setAlertMessage('Error actualizando referral');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_REVISION_DOCS':
        return 'warning';
      case 'APROBADO':
        return 'success';
      case 'RECHAZADO':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'EN_REVISION_DOCS':
        return 'En Revisión';
      case 'APROBADO':
        return 'Aprobado';
      case 'RECHAZADO':
        return 'Rechazado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <PageContainer title="Panel de Administrador">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Cargando referidos pendientes...</Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Panel de Administrador">
      <Box>
        <Typography variant="h3" fontWeight="700" mb={3}>
          Panel de Administrador
        </Typography>

        <Typography variant="h5" fontWeight="600" mb={2} color="primary.main">
          Referidos Pendientes de Revisión
        </Typography>

        {pendingReferrals.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="h6" textAlign="center" color="text.secondary">
                No hay referidos pendientes de revisión
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>DNI</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Nombres</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Apellidos</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Teléfono</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Estado</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fecha Completado</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Acciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>{referral.dni}</TableCell>
                    <TableCell>{referral.nombres}</TableCell>
                    <TableCell>{referral.apellidos}</TableCell>
                    <TableCell>{referral.correo}</TableCell>
                    <TableCell>{referral.telefono}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(referral.onboarding_status)}
                        color={getStatusColor(referral.onboarding_status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {referral.datosCompletadosAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Ver detalles">
                        <IconButton color="primary" onClick={() => handleViewDetails(referral)}>
                          <IconEye size={20} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Dialog para revisar detalles */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Revisar Referido: {selectedReferral?.nombres} {selectedReferral?.apellidos}
        </DialogTitle>
        <DialogContent>
          {selectedReferral && (
            <Box mt={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight="600" mb={2}>
                    Datos Personales
                  </Typography>
                  <Typography>
                    <strong>DNI:</strong> {selectedReferral.dni}
                  </Typography>
                  <Typography>
                    <strong>Nombres:</strong> {selectedReferral.nombres}
                  </Typography>
                  <Typography>
                    <strong>Apellidos:</strong> {selectedReferral.apellidos}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {selectedReferral.correo}
                  </Typography>
                  <Typography>
                    <strong>Teléfono:</strong> {selectedReferral.telefono}
                  </Typography>
                  {selectedReferral.fechaNacimiento && (
                    <Typography>
                      <strong>Fecha Nacimiento:</strong> {selectedReferral.fechaNacimiento}
                    </Typography>
                  )}
                  {selectedReferral.direccion && (
                    <Typography>
                      <strong>Dirección:</strong> {selectedReferral.direccion}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight="600" mb={2}>
                    Documentos y Vehículo
                  </Typography>
                  {selectedReferral.licenciaConducir && (
                    <Typography>
                      <strong>Licencia:</strong> {selectedReferral.licenciaConducir}
                    </Typography>
                  )}
                  {selectedReferral.marcaVehiculo && (
                    <Typography>
                      <strong>Vehículo:</strong> {selectedReferral.marcaVehiculo}{' '}
                      {selectedReferral.modeloVehiculo}
                    </Typography>
                  )}
                  {selectedReferral.placaVehiculo && (
                    <Typography>
                      <strong>Placa:</strong> {selectedReferral.placaVehiculo}
                    </Typography>
                  )}
                  {selectedReferral.numeroSOAT && (
                    <Typography>
                      <strong>SOAT:</strong> {selectedReferral.numeroSOAT}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Box mt={3}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Decisión</InputLabel>
                  <Select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    label="Decisión"
                  >
                    <MenuItem value="APROBADO">Aprobar</MenuItem>
                    <MenuItem value="RECHAZADO">Rechazar</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Observaciones"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  margin="normal"
                  placeholder="Agregar observaciones sobre la decisión..."
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDecision}
            variant="contained"
            disabled={!decision}
            color={decision === 'APROBADO' ? 'success' : 'error'}
          >
            {decision === 'APROBADO' ? 'Aprobar' : 'Rechazar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={showAlert} autoHideDuration={6000} onClose={() => setShowAlert(false)}>
        <Alert onClose={() => setShowAlert(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default AdminPanel;
