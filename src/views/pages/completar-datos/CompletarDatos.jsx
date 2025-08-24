import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import PageContainer from 'src/components/container/PageContainer';
import logoSmartBonos from 'src/assets/images/logos/logo-smart-bonos.png';
import {
  InputAdornment,
  Button,
  MenuItem,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { OutlinedInput } from '@mui/material';
import {
  IconUser,
  IconCar,
  IconIdBadge2,
  IconPhone,
  IconMail,
  IconFileText,
  IconPhoto,
  IconUpload,
  IconCheck,
  IconX,
  IconAlertTriangle,
} from '@tabler/icons';
import CustomSelect from '../../../components/forms/theme-elements/CustomSelect';
import { db } from '../../../../firebaseConfig';
import { validateCompletionToken } from '../../../utils/emailService';
import { doc, getDoc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';

// Schema de validación para el formulario de completar datos
const schema = yup.object().shape({
  // Datos personales
  nombres: yup.string().required('Los nombres son obligatorios').max(50, 'Máximo 50 caracteres'),
  apellidos: yup
    .string()
    .required('Los apellidos son obligatorios')
    .max(50, 'Máximo 50 caracteres'),
  fechaNacimiento: yup.date().required('La fecha de nacimiento es obligatoria'),
  direccion: yup.string().required('La dirección es obligatoria').max(200, 'Máximo 200 caracteres'),

  // Documentos
  dni: yup
    .string()
    .required('El DNI es obligatorio')
    .matches(/^\d+$/, 'Solo números permitidos')
    .min(8, 'Mínimo 8 dígitos')
    .max(12, 'Máximo 12 dígitos'),
  licenciaConducir: yup
    .string()
    .required('El número de licencia es obligatorio')
    .max(20, 'Máximo 20 caracteres'),
  fechaVencimientoLicencia: yup
    .date()
    .required('La fecha de vencimiento de la licencia es obligatoria'),

  // Vehículo
  marcaVehiculo: yup.string().required('La marca del vehículo es obligatoria'),
  modeloVehiculo: yup.string().required('El modelo del vehículo es obligatorio'),
  añoVehiculo: yup
    .number()
    .required('El año del vehículo es obligatorio')
    .min(1990, 'Año mínimo 1990')
    .max(new Date().getFullYear() + 1, 'Año máximo permitido'),
  placaVehiculo: yup
    .string()
    .required('La placa del vehículo es obligatoria')
    .max(10, 'Máximo 10 caracteres'),
  colorVehiculo: yup.string().required('El color del vehículo es obligatorio'),

  // Seguros y documentos
  numeroSOAT: yup.string().required('El número de SOAT es obligatorio'),
  fechaVencimientoSOAT: yup.date().required('La fecha de vencimiento del SOAT es obligatoria'),
  numeroTarjetaPropiedad: yup.string().required('El número de tarjeta de propiedad es obligatorio'),

  // Contacto
  telefono: yup
    .string()
    .required('El teléfono es obligatorio')
    .matches(/^\d+$/, 'Solo números permitidos')
    .max(12, 'Máximo 12 caracteres'),
  email: yup
    .string()
    .email('Debe ser un email válido')
    .required('El correo electrónico es obligatorio'),
  telefonoEmergencia: yup
    .string()
    .required('El teléfono de emergencia es obligatorio')
    .matches(/^\d+$/, 'Solo números permitidos')
    .max(12, 'Máximo 12 caracteres'),

  // Información adicional
  ocupacion: yup.string().required('La ocupación es obligatoria'),
  experienciaConduccion: yup
    .number()
    .required('Los años de experiencia son obligatorios')
    .min(0, 'Mínimo 0 años')
    .max(50, 'Máximo 50 años'),
});

const CustomFormLabel = styled((props) => (
  <Typography
    variant="subtitle1"
    fontWeight={600}
    {...props}
    component="label"
    htmlFor={props.htmlFor}
  />
))(() => ({
  marginBottom: '5px',
  marginTop: '25px',
  display: 'block',
}));

const CustomOutlinedInput = styled((props) => <OutlinedInput {...props} />)(({ theme }) => ({
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '0.8',
  },
  '& .MuiTypography-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '1',
  },
}));

const CompletarDatos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Validar token al cargar la página
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setAlertMessage('Token no proporcionado');
        setAlertSeverity('error');
        setOpen(true);
        return;
      }

      setIsLoading(true);
      try {
        const validation = await validateCompletionToken(token);
        if (validation.valid) {
          setTokenValid(true);
          setTokenData(validation.data);

          // Pre-llenar campos con datos del token
          setValue('nombres', validation.data.nombres);
          setValue('apellidos', validation.data.apellidos);
          setValue('dni', validation.data.dni);
          setValue('email', validation.data.email);
        } else {
          setAlertMessage(validation.error);
          setAlertSeverity('error');
          setOpen(true);
        }
      } catch (error) {
        setAlertMessage('Error validando token');
        setAlertSeverity('error');
        setOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token, setValue]);

  const handleClose = (reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setAlertMessage(null);
  };

  const handleFileUpload = (field, file) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [field]: {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      },
    }));
  };

  const onSubmit = async (data) => {
    if (!tokenValid || !tokenData) {
      setAlertMessage('Token no válido');
      setAlertSeverity('error');
      setOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      // Actualizar el referral con los datos completados
      const referralRef = doc(db, 'referrals', tokenData.referralId);
      await updateDoc(referralRef, {
        // Datos personales
        nombres: data.nombres,
        apellidos: data.apellidos,
        fechaNacimiento: data.fechaNacimiento,
        direccion: data.direccion,

        // Documentos
        licenciaConducir: data.licenciaConducir,
        fechaVencimientoLicencia: data.fechaVencimientoLicencia,

        // Vehículo
        marcaVehiculo: data.marcaVehiculo,
        modeloVehiculo: data.modeloVehiculo,
        añoVehiculo: data.añoVehiculo,
        placaVehiculo: data.placaVehiculo,
        colorVehiculo: data.colorVehiculo,

        // Seguros y documentos
        numeroSOAT: data.numeroSOAT,
        fechaVencimientoSOAT: data.fechaVencimientoSOAT,
        numeroTarjetaPropiedad: data.numeroTarjetaPropiedad,

        // Contacto
        telefono: data.telefono,
        telefonoEmergencia: data.telefonoEmergencia,

        // Información adicional
        ocupacion: data.ocupacion,
        experienciaConduccion: data.experienciaConduccion,

        // Estado del onboarding
        onboarding_step: 2,
        onboarding_status: 'EN_REVISION_DOCS',
        datosCompletados: true,
        datosCompletadosAt: serverTimestamp(),

        // Archivos subidos
        archivos: uploadedFiles,
      });

      // Marcar token como usado
      const tokenRef = doc(db, 'emailTokens', token);
      await updateDoc(tokenRef, {
        used: true,
        usedAt: serverTimestamp(),
      });

      // Crear tarea para el administrador
      await addDoc(collection(db, 'adminTasks'), {
        tipo: 'REVISION_DOCUMENTOS',
        referralId: tokenData.referralId,
        dni: data.dni,
        nombres: data.nombres,
        apellidos: data.apellidos,
        createdAt: serverTimestamp(),
        status: 'PENDIENTE',
        prioridad: 'MEDIA',
      });

      setAlertMessage('¡Datos completados exitosamente! Tu perfil está en revisión.');
      setAlertSeverity('success');
      setOpen(true);

      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error guardando datos:', error);
      setAlertMessage(`Error: ${error.message}`);
      setAlertSeverity('error');
      setOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !tokenValid) {
    return (
      <PageContainer title="Completar Datos">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (!tokenValid) {
    return (
      <PageContainer title="Error">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Card elevation={9} sx={{ p: 4, m: 3, maxWidth: '480px' }}>
            <Typography variant="h5" color="error" textAlign="center">
              Token inválido o expirado
            </Typography>
            <Typography variant="body1" textAlign="center" mt={2}>
              El enlace que estás usando no es válido o ha expirado.
            </Typography>
            <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </Card>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Completar Datos">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ minHeight: '100vh', py: 4 }}>
          <Grid
            size={{ xs: 12, sm: 12, lg: 8, xl: 6 }}
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
          >
            <Card elevation={9} sx={{ p: 4, m: 3, zIndex: 1, width: '100%', maxWidth: '800px' }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Box
                  component="img"
                  src={logoSmartBonos}
                  alt="Logo Smart Bonos"
                  sx={{
                    width: '230px',
                    objectFit: 'contain',
                    overflow: 'hidden',
                    height: 'auto',
                    display: 'block',
                    mb: 3,
                    mt: 1,
                  }}
                />
              </Box>

              <Typography variant="h4" fontWeight="700" mb={3} textAlign="center">
                Completar Perfil de Referido
              </Typography>

              <Typography variant="body1" textAlign="center" mb={4} color="text.secondary">
                Hola {tokenData?.nombres} {tokenData?.apellidos}, completa tu perfil para continuar
                con el proceso.
              </Typography>

              {/* Indicador de pasos */}
              <Box display="flex" justifyContent="center" mb={4}>
                <Stack direction="row" spacing={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: currentStep >= 1 ? 'primary.main' : 'grey.300',
                      color: currentStep >= 1 ? 'white' : 'text.secondary',
                      fontWeight: 'bold',
                    }}
                  >
                    1
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: currentStep >= 2 ? 'primary.main' : 'grey.300',
                      color: currentStep >= 2 ? 'white' : 'text.secondary',
                      fontWeight: 'bold',
                    }}
                  >
                    2
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: currentStep >= 3 ? 'primary.main' : 'grey.300',
                      color: currentStep >= 3 ? 'white' : 'text.secondary',
                      fontWeight: 'bold',
                    }}
                  >
                    3
                  </Box>
                </Stack>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Paso 1: Datos Personales */}
                {currentStep === 1 && (
                  <Box>
                    <Typography variant="h6" fontWeight="600" mb={3} color="primary.main">
                      Paso 1: Datos Personales
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <CustomFormLabel htmlFor="nombres">Nombres</CustomFormLabel>
                        <CustomOutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <IconUser size="20" />
                            </InputAdornment>
                          }
                          id="nombres"
                          {...register('nombres')}
                          fullWidth
                          error={!!errors.nombres}
                        />
                        {errors.nombres && (
                          <Typography variant="caption" color="error">
                            {errors.nombres.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="apellidos">Apellidos</CustomFormLabel>
                        <CustomOutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <IconUser size="20" />
                            </InputAdornment>
                          }
                          id="apellidos"
                          {...register('apellidos')}
                          fullWidth
                          error={!!errors.apellidos}
                        />
                        {errors.apellidos && (
                          <Typography variant="caption" color="error">
                            {errors.apellidos.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="fechaNacimiento">
                          Fecha de Nacimiento
                        </CustomFormLabel>
                        <CustomOutlinedInput
                          type="date"
                          id="fechaNacimiento"
                          {...register('fechaNacimiento')}
                          fullWidth
                          error={!!errors.fechaNacimiento}
                        />
                        {errors.fechaNacimiento && (
                          <Typography variant="caption" color="error">
                            {errors.fechaNacimiento.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="dni">DNI</CustomFormLabel>
                        <CustomOutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <IconIdBadge2 size="20" />
                            </InputAdornment>
                          }
                          id="dni"
                          {...register('dni')}
                          fullWidth
                          error={!!errors.dni}
                        />
                        {errors.dni && (
                          <Typography variant="caption" color="error">
                            {errors.dni.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={12}>
                        <CustomFormLabel htmlFor="direccion">Dirección</CustomFormLabel>
                        <CustomOutlinedInput
                          id="direccion"
                          {...register('direccion')}
                          fullWidth
                          error={!!errors.direccion}
                        />
                        {errors.direccion && (
                          <Typography variant="caption" color="error">
                            {errors.direccion.message}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="space-between" mt={4}>
                      <Button variant="outlined" disabled>
                        Anterior
                      </Button>
                      <Button variant="contained" onClick={() => setCurrentStep(2)}>
                        Siguiente
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Paso 2: Documentos y Vehículo */}
                {currentStep === 2 && (
                  <Box>
                    <Typography variant="h6" fontWeight="600" mb={3} color="primary.main">
                      Paso 2: Documentos y Vehículo
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <CustomFormLabel htmlFor="licenciaConducir">
                          Número de Licencia
                        </CustomFormLabel>
                        <CustomOutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <IconIdBadge2 size="20" />
                            </InputAdornment>
                          }
                          id="licenciaConducir"
                          {...register('licenciaConducir')}
                          fullWidth
                          error={!!errors.licenciaConducir}
                        />
                        {errors.licenciaConducir && (
                          <Typography variant="caption" color="error">
                            {errors.licenciaConducir.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="fechaVencimientoLicencia">
                          Vencimiento Licencia
                        </CustomFormLabel>
                        <CustomOutlinedInput
                          type="date"
                          id="fechaVencimientoLicencia"
                          {...register('fechaVencimientoLicencia')}
                          fullWidth
                          error={!!errors.fechaVencimientoLicencia}
                        />
                        {errors.fechaVencimientoLicencia && (
                          <Typography variant="caption" color="error">
                            {errors.fechaVencimientoLicencia.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="marcaVehiculo">
                          Marca del Vehículo
                        </CustomFormLabel>
                        <CustomOutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <IconCar size="20" />
                            </InputAdornment>
                          }
                          id="marcaVehiculo"
                          {...register('marcaVehiculo')}
                          fullWidth
                          error={!!errors.marcaVehiculo}
                        />
                        {errors.marcaVehiculo && (
                          <Typography variant="caption" color="error">
                            {errors.marcaVehiculo.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="modeloVehiculo">
                          Modelo del Vehículo
                        </CustomFormLabel>
                        <CustomOutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <IconCar size="20" />
                            </InputAdornment>
                          }
                          id="modeloVehiculo"
                          {...register('modeloVehiculo')}
                          fullWidth
                          error={!!errors.modeloVehiculo}
                        />
                        {errors.modeloVehiculo && (
                          <Typography variant="caption" color="error">
                            {errors.modeloVehiculo.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={4}>
                        <CustomFormLabel htmlFor="añoVehiculo">Año</CustomFormLabel>
                        <CustomOutlinedInput
                          type="number"
                          id="añoVehiculo"
                          {...register('añoVehiculo')}
                          fullWidth
                          error={!!errors.añoVehiculo}
                        />
                        {errors.añoVehiculo && (
                          <Typography variant="caption" color="error">
                            {errors.añoVehiculo.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={4}>
                        <CustomFormLabel htmlFor="placaVehiculo">Placa</CustomFormLabel>
                        <CustomOutlinedInput
                          id="placaVehiculo"
                          {...register('placaVehiculo')}
                          fullWidth
                          error={!!errors.placaVehiculo}
                        />
                        {errors.placaVehiculo && (
                          <Typography variant="caption" color="error">
                            {errors.placaVehiculo.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={4}>
                        <CustomFormLabel htmlFor="colorVehiculo">Color</CustomFormLabel>
                        <CustomOutlinedInput
                          id="colorVehiculo"
                          {...register('colorVehiculo')}
                          fullWidth
                          error={!!errors.colorVehiculo}
                        />
                        {errors.colorVehiculo && (
                          <Typography variant="caption" color="error">
                            {errors.colorVehiculo.message}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="space-between" mt={4}>
                      <Button variant="outlined" onClick={() => setCurrentStep(1)}>
                        Anterior
                      </Button>
                      <Button variant="contained" onClick={() => setCurrentStep(3)}>
                        Siguiente
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Paso 3: Seguros y Contacto */}
                {currentStep === 3 && (
                  <Box>
                    <Typography variant="h6" fontWeight="600" mb={3} color="primary.main">
                      Paso 3: Seguros y Contacto
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <CustomFormLabel htmlFor="numeroSOAT">Número de SOAT</CustomFormLabel>
                        <CustomOutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <IconFileText size="20" />
                            </InputAdornment>
                          }
                          id="numeroSOAT"
                          {...register('numeroSOAT')}
                          fullWidth
                          error={!!errors.numeroSOAT}
                        />
                        {errors.numeroSOAT && (
                          <Typography variant="caption" color="error">
                            {errors.numeroSOAT.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="fechaVencimientoSOAT">
                          Vencimiento SOAT
                        </CustomFormLabel>
                        <CustomOutlinedInput
                          type="date"
                          id="fechaVencimientoSOAT"
                          {...register('fechaVencimientoSOAT')}
                          fullWidth
                          error={!!errors.fechaVencimientoSOAT}
                        />
                        {errors.fechaVencimientoSOAT && (
                          <Typography variant="caption" color="error">
                            {errors.fechaVencimientoSOAT.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="numeroTarjetaPropiedad">
                          Tarjeta de Propiedad
                        </CustomFormLabel>
                        <CustomOutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <IconFileText size="20" />
                            </InputAdornment>
                          }
                          id="numeroTarjetaPropiedad"
                          {...register('numeroTarjetaPropiedad')}
                          fullWidth
                          error={!!errors.numeroTarjetaPropiedad}
                        />
                        {errors.numeroTarjetaPropiedad && (
                          <Typography variant="caption" color="error">
                            {errors.numeroTarjetaPropiedad.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="telefono">Teléfono</CustomFormLabel>
                        <CustomOutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <IconPhone size="20" />
                            </InputAdornment>
                          }
                          id="telefono"
                          {...register('telefono')}
                          fullWidth
                          error={!!errors.telefono}
                        />
                        {errors.telefono && (
                          <Typography variant="caption" color="error">
                            {errors.telefono.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
                        <CustomOutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <IconMail size="20" />
                            </InputAdornment>
                          }
                          id="email"
                          {...register('email')}
                          fullWidth
                          error={!!errors.email}
                        />
                        {errors.email && (
                          <Typography variant="caption" color="error">
                            {errors.email.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="telefonoEmergencia">
                          Teléfono de Emergencia
                        </CustomFormLabel>
                        <CustomOutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              <IconPhone size="20" />
                            </InputAdornment>
                          }
                          id="telefonoEmergencia"
                          {...register('telefonoEmergencia')}
                          fullWidth
                          error={!!errors.telefonoEmergencia}
                        />
                        {errors.telefonoEmergencia && (
                          <Typography variant="caption" color="error">
                            {errors.telefonoEmergencia.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="ocupacion">Ocupación</CustomFormLabel>
                        <CustomOutlinedInput
                          id="ocupacion"
                          {...register('ocupacion')}
                          fullWidth
                          error={!!errors.ocupacion}
                        />
                        {errors.ocupacion && (
                          <Typography variant="caption" color="error">
                            {errors.ocupacion.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={6}>
                        <CustomFormLabel htmlFor="experienciaConduccion">
                          Años de Experiencia
                        </CustomFormLabel>
                        <CustomOutlinedInput
                          type="number"
                          id="experienciaConduccion"
                          {...register('experienciaConduccion')}
                          fullWidth
                          error={!!errors.experienciaConduccion}
                        />
                        {errors.experienciaConduccion && (
                          <Typography variant="caption" color="error">
                            {errors.experienciaConduccion.message}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="space-between" mt={4}>
                      <Button variant="outlined" onClick={() => setCurrentStep(2)}>
                        Anterior
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                      >
                        {isLoading ? 'Guardando...' : 'Completar Registro'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default CompletarDatos;
