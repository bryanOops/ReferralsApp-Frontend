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
import { InputAdornment, FormControlLabel, Checkbox } from '@mui/material';
import { IconMail, IconLock } from '@tabler/icons';

import PageContainer from 'src/components/container/PageContainer';
import CustomOutlinedInput from 'src/components/forms/theme-elements/CustomOutlinedInput';
import { styled } from '@mui/material/styles';
import { useAuth } from 'src/context/AuthContext';
import driverIcon from 'src/assets/images/svgs/driver-icon-login-register.svg.svg';

const schema = yup.object().shape({
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

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      await login(data.email, data.password);
      navigate('/home/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      switch (error.code) {
        case 'auth/user-not-found':
          setError('No existe una cuenta con este correo electrónico');
          break;
        case 'auth/wrong-password':
          setError('Contraseña incorrecta');
          break;
        case 'auth/invalid-email':
          setError('Correo electrónico inválido');
          break;
        case 'auth/user-disabled':
          setError('Esta cuenta ha sido deshabilitada');
          break;
        default:
          setError('Error al iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Iniciar Sesión" description="Inicia sesión en tu cuenta">
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
            }}
          >
            <Box>
              {/* Ilustración del conductor */}
              <Box
                component="img"
                src={driverIcon}
                alt="Driver illustration"
                sx={{
                  width: '100%',
                  maxWidth: '400px',
                  height: 'auto',
                }}
              />
            </Box>
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
              <Typography variant="h4" fontWeight="bold" mb={1} sx={{ textAlign: 'left' }}>
                Bienvenido a Taxi Sonrisas
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                mb={3}
                sx={{ textAlign: 'left' }}
              >
                Tu admin dashboard
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                  <CustomFormLabel htmlFor="email">Correo Electrónico</CustomFormLabel>
                  <CustomOutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        <IconMail size="20" />
                      </InputAdornment>
                    }
                    id="email"
                    type="email"
                    {...register('email')}
                    fullWidth
                    placeholder="tu@correo.com"
                    error={!!errors.email}
                  />
                  {errors.email && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, mb: 0 }}>
                      {errors.email.message}
                    </Typography>
                  )}
                </Box>

                <Box mt={2}>
                  <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
                  <CustomOutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        <IconLock size="20" />
                      </InputAdornment>
                    }
                    id="password"
                    type="password"
                    {...register('password')}
                    fullWidth
                    placeholder="Tu contraseña"
                    error={!!errors.password}
                  />
                  {errors.password && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, mb: 0 }}>
                      {errors.password.message}
                    </Typography>
                  )}
                </Box>

                <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
                  <FormControlLabel control={<Checkbox />} label="Recordar este dispositivo" />
                  <Typography
                    component={Link}
                    to="/auth/forgot-password"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                      fontSize: '14px',
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Typography>
                </Stack>

                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  type="submit"
                  disabled={loading}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '16px',
                    py: 1.5,
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
                </Button>
              </form>

              <Box textAlign="center" mt={3}>
                <Typography variant="body2">
                  ¿No tienes cuenta?{' '}
                  <Typography
                    component={Link}
                    to="/auth/register"
                    fontWeight="600"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    Crear cuenta
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login;
