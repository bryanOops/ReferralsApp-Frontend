import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { InputAdornment } from '@mui/material';
import { IconMail, IconLock, IconUser, IconIdBadge2, IconPhone } from '@tabler/icons';

import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import CustomOutlinedInput from 'src/components/forms/theme-elements/CustomOutlinedInput';
import { styled } from '@mui/material/styles';
import { useAuth } from 'src/context/AuthContext';
import {
  doc,
  updateDoc,
  query,
  where,
  collection,
  getDocs,
  runTransaction,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, deleteUser, updateProfile } from 'firebase/auth';
import { db, auth } from '../../../../firebaseConfig';

const schema = yup.object().shape({
  nombres: yup.string().required('Los nombres son obligatorios'),
  apellidos: yup.string().required('Los apellidos son obligatorios'),
  dni: yup.string().required('El DNI es obligatorio').matches(/^\d+$/, 'Solo números permitidos'),
  telefono: yup
    .string()
    .required('El teléfono es obligatorio')
    .matches(/^\d+$/, 'Solo números permitidos'),
  email: yup
    .string()
    .email('Debe ser un email válido')
    .required('El correo electrónico es obligatorio'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
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
  marginTop: '15px',
  display: 'block',
}));

const Register = () => {
  const navigate = useNavigate();
  const { findUserByCredentials } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    let createdUser = null; // Para rollback si es necesario

    try {
      console.log('🚀 Iniciando registro ATÓMICO para:', data.nombres, data.apellidos);

      // PASO 1: PRE-VALIDACIÓN - Buscar referralCodes ANTES de crear usuario
      console.log('🔍 PRE-VALIDACIÓN: Buscando referralCodes para DNI:', data.dni);

      const referralCodesByDNI = query(
        collection(db, 'referralCodes'),
        where('dni', '==', data.dni),
      );

      const dniSnapshot = await getDocs(referralCodesByDNI);
      const referralCodesFound = dniSnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));

      console.log(`✅ PRE-VALIDACIÓN: Encontrados ${referralCodesFound.length} referralCodes`);

      // PASO 2: Crear usuario en Auth SOLO después de pre-validación exitosa
      console.log('🔐 Creando usuario en Firebase Auth...');

      // Crear usuario en Auth (SIN documento de Firestore aún)
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      createdUser = userCredential.user;

      // Actualizar perfil
      if (data.nombres && data.apellidos) {
        await updateProfile(createdUser, {
          displayName: `${data.nombres} ${data.apellidos}`,
        });
      }

      console.log('✅ Usuario creado en Auth con ID:', createdUser.uid);

      // PASO 3: TRANSACCIÓN ATÓMICA - Crear documento users + actualizar referralCodes
      console.log('🔄 Iniciando transacción atómica...');

      const transactionResult = await runTransaction(db, async (transaction) => {
        // 3a. Crear documento en users
        const userDocRef = doc(db, 'users', createdUser.uid);
        const userDoc = {
          uid: createdUser.uid,
          email: createdUser.email,
          displayName: `${data.nombres} ${data.apellidos}`,
          nombres: data.nombres,
          apellidos: data.apellidos,
          dni: data.dni,
          telefono: data.telefono,
          auth: true,
          createdAt: new Date(),
          lastLoginAt: new Date(),
        };

        transaction.set(userDocRef, userDoc);
        console.log('📄 Documento users preparado para crear');

        // 3b. Actualizar referralCodes encontrados
        let updatedCodes = 0;
        for (const referralCode of referralCodesFound) {
          const referralCodeRef = doc(db, 'referralCodes', referralCode.id);
          transaction.update(referralCodeRef, {
            userId: createdUser.uid,
            updatedAt: new Date(),
          });
          updatedCodes++;
          console.log('🔗 ReferralCode preparado para actualizar:', referralCode.id);
        }

        return updatedCodes;
      });

      console.log('✅ TRANSACCIÓN COMPLETADA - Todo creado exitosamente');

      // PASO 4: Éxito - mostrar mensaje
      if (transactionResult > 0) {
        setSuccess(
          `¡Cuenta creada exitosamente! Se asociaron ${transactionResult} código(s) de referido.`,
        );
      } else {
        setSuccess('¡Cuenta creada exitosamente!');
      }

      setTimeout(() => {
        navigate('/home/dashboard');
      }, 2000);
    } catch (error) {
      console.error('❌ ERROR en registro:', error);

      // ROLLBACK: Si se creó usuario en Auth pero falló la transacción, eliminarlo
      if (createdUser) {
        try {
          console.log('🔄 ROLLBACK: Eliminando usuario de Auth...');
          await deleteUser(createdUser);
          console.log('✅ ROLLBACK completado - Usuario eliminado de Auth');
        } catch (rollbackError) {
          console.error('❌ Error en ROLLBACK:', rollbackError);
        }
      }

      // Manejar errores específicos de Firebase
      let errorMessage = 'Error al crear la cuenta. Intenta de nuevo.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está registrado.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Registro" description="Crea tu cuenta">
      <Box>
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          {/* Lado izquierdo - Solo ilustración */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              position: 'relative',
            }}
          >
            {/* Solo la ilustración del conductor */}
            <Box
              component="img"
              src="/src/assets/images/svgs/driver-icon-login-register.svg.svg"
              alt="Driver illustration"
              sx={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
              }}
            />
          </Grid>

          {/* Lado derecho - Formulario */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
            }}
          >
            <Box sx={{ maxWidth: '500px', width: '100%', p: 4 }}>
              <Typography variant="h4" fontWeight="bold" mb={1}>
                Bienvenido a Taxi Sonrisas
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" mb={3}>
                Tu admin dashboard
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Nombres y Apellidos en una fila */}
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
                      placeholder="Tus nombres"
                      {...register('nombres')}
                      fullWidth
                      error={!!errors.nombres}
                    />
                    {errors.nombres && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, mb: 0 }}>
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
                      placeholder="Tus apellidos"
                      {...register('apellidos')}
                      fullWidth
                      error={!!errors.apellidos}
                    />
                    {errors.apellidos && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, mb: 0 }}>
                        {errors.apellidos.message}
                      </Typography>
                    )}
                  </Grid>
                </Grid>

                {/* DNI */}
                <CustomFormLabel htmlFor="dni">DNI</CustomFormLabel>
                <CustomOutlinedInput
                  startAdornment={
                    <InputAdornment position="start">
                      <IconIdBadge2 size="20" />
                    </InputAdornment>
                  }
                  id="dni"
                  placeholder="Tu número de DNI"
                  {...register('dni')}
                  fullWidth
                  error={!!errors.dni}
                />
                {errors.dni && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, mb: 0 }}>
                    {errors.dni.message}
                  </Typography>
                )}

                {/* Teléfono */}
                <CustomFormLabel htmlFor="telefono">Teléfono</CustomFormLabel>
                <CustomOutlinedInput
                  startAdornment={
                    <InputAdornment position="start">
                      <IconPhone size="20" />
                    </InputAdornment>
                  }
                  id="telefono"
                  placeholder="Tu número de teléfono"
                  {...register('telefono')}
                  fullWidth
                  error={!!errors.telefono}
                />
                {errors.telefono && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, mb: 0 }}>
                    {errors.telefono.message}
                  </Typography>
                )}

                {/* Email */}
                <CustomFormLabel htmlFor="email">Correo Electrónico</CustomFormLabel>
                <CustomOutlinedInput
                  startAdornment={
                    <InputAdornment position="start">
                      <IconMail size="20" />
                    </InputAdornment>
                  }
                  id="email"
                  type="email"
                  placeholder="Tu correo electrónico"
                  {...register('email')}
                  fullWidth
                  error={!!errors.email}
                />
                {errors.email && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, mb: 0 }}>
                    {errors.email.message}
                  </Typography>
                )}

                {/* Contraseña */}
                <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
                <CustomOutlinedInput
                  startAdornment={
                    <InputAdornment position="start">
                      <IconLock size="20" />
                    </InputAdornment>
                  }
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  {...register('password')}
                  fullWidth
                  error={!!errors.password}
                />
                {errors.password && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, mb: 0 }}>
                    {errors.password.message}
                  </Typography>
                )}

                {/* Botón de registro */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  fullWidth
                  sx={{
                    mt: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    textTransform: 'none',
                    boxShadow: '0 8px 25px rgba(114, 56, 207, 0.15)',
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
                </Button>
              </form>

              {/* Link a login */}
              <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                <Typography color="textSecondary" variant="h6" fontWeight="400">
                  ¿Ya tienes cuenta?
                </Typography>
                <Typography
                  component={Link}
                  to="/auth/login"
                  fontWeight="500"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Iniciar sesión
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Register;
