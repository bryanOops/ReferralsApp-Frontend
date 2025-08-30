import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { InputAdornment } from '@mui/material';
import { IconMail, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react';
import { styled, useTheme } from '@mui/material/styles';

import PageContainer from 'src/components/container/PageContainer';
import CustomOutlinedInput from 'src/components/forms/theme-elements/CustomOutlinedInput';
import logoSmartBonos from 'src/assets/images/logos/logo-smart-bonos.png';

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
))(({ theme }) => ({
  marginBottom: '8px',
  marginTop: '0px',
  display: 'block',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    marginBottom: '6px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '13px',
    marginBottom: '5px',
  },
}));

// Estilos personalizados para el diseño del Figma
const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: '#5D87FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  borderRadius: '0px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    minHeight: '100vh',
  },
}));

const StyledCard = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '16px',
  padding: `${theme.spacing(8)} ${theme.spacing(6)}`,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  maxWidth: '520px',
  width: '100%',
  textAlign: 'left',
  [theme.breakpoints.down('md')]: {
    maxWidth: '480px',
    padding: `${theme.spacing(6)} ${theme.spacing(4)}`,
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    padding: `${theme.spacing(4)} ${theme.spacing(3)}`,
    margin: theme.spacing(1),
    borderRadius: '12px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
    margin: theme.spacing(0.5),
  },
}));

const StyledLogo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(5),
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4),
  },
  [theme.breakpoints.down('xs')]: {
    marginBottom: theme.spacing(3),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: '#5D87FF',
  borderRadius: '12px',
  padding: theme.spacing(2, 3),
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 16px rgba(93, 135, 255, 0.3)',
  '&:hover': {
    background: '#4A6FE6',
    boxShadow: '0 6px 20px rgba(93, 135, 255, 0.4)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 2.5),
    fontSize: '15px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: theme.spacing(1.5, 2),
    fontSize: '14px',
  },
}));

const StyledInput = styled(CustomOutlinedInput)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    height: '48px',
    '& fieldset': {
      borderColor: '#e0e0e0',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#5D87FF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#5D87FF',
      borderWidth: '2px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiOutlinedInput-root': {
      height: '44px',
      borderRadius: '10px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    '& .MuiOutlinedInput-root': {
      height: '40px',
      borderRadius: '8px',
    },
  },
}));

const AdminLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recaptchaScore, setRecaptchaScore] = useState(null);
  const [isRecaptchaLoading, setIsRecaptchaLoading] = useState(false);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Precargar reCAPTCHA cuando la página se carga
  useEffect(() => {
    const loadRecaptcha = async () => {
      if (!window.grecaptcha) {
        const script = document.createElement('script');
        script.src =
          'https://www.google.com/recaptcha/api.js?render=6LfVdVwrAAAAAHX1wbJtRmc2ZGF_JrALgEpTvBWb';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
          // Esperar a que reCAPTCHA se inicialice
          const checkRecaptcha = setInterval(() => {
            if (window.grecaptcha && window.grecaptcha.ready) {
              window.grecaptcha.ready(() => {
                setIsRecaptchaReady(true);
                console.log('✅ reCAPTCHA v3 cargado y listo');
              });
              clearInterval(checkRecaptcha);
            }
          }, 100);
        };
      } else {
        setIsRecaptchaReady(true);
        console.log('✅ reCAPTCHA v3 ya estaba cargado');
      }
    };

    loadRecaptcha();
  }, []);

  // Función para ejecutar reCAPTCHA v3
  const executeRecaptcha = async (action = 'submit') => {
    setIsRecaptchaLoading(true);
    try {
      // Verificar que reCAPTCHA esté disponible
      if (!window.grecaptcha) {
        throw new Error('reCAPTCHA no está disponible');
      }

      // Ejecutar reCAPTCHA
      const token = await window.grecaptcha.execute('6LfVdVwrAAAAAHX1wbJtRmc2ZGF_JrALgEpTvBWb', {
        action,
      });

      // Verificar el token en el backend
      const verificationResponse = await fetch('https://verifyrecaptcha-q7nx2wkxda-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, action }),
      });

      const verificationResult = await verificationResponse.json();

      if (
        verificationResult &&
        verificationResult.success &&
        verificationResult.score !== undefined
      ) {
        setRecaptchaScore(verificationResult.score);
        console.log('🔒 reCAPTCHA Score:', verificationResult.score.toFixed(2));
        return {
          success: verificationResult.score >= 0.5, // Umbral recomendado por Google
          score: verificationResult.score,
        };
      } else {
        setRecaptchaScore(0);
        console.log('❌ reCAPTCHA falló:', verificationResult?.error || 'Error desconocido');
        return {
          success: false,
          score: 0,
        };
      }
    } catch (error) {
      console.error('Error ejecutando reCAPTCHA:', error);
      setRecaptchaScore(0);
      return {
        success: false,
        score: 0,
      };
    } finally {
      setIsRecaptchaLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      // Ejecutar reCAPTCHA antes de procesar el formulario
      const recaptchaResult = await executeRecaptcha('admin_login');

      if (!recaptchaResult.success) {
        setError('Verificación de seguridad fallida. Inténtalo de nuevo.');
        return;
      }

      // Aquí iría la lógica de autenticación para super administradores
      console.log('Datos del formulario:', data);
      console.log('Score de reCAPTCHA:', recaptchaResult.score);

      // Por ahora, simulamos un delay y navegamos
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Login Super Administrador"
      description="Acceso exclusivo para super administradores"
    >
      <StyledContainer>
        <StyledCard>
          <StyledLogo>
            <Box
              component="img"
              src={logoSmartBonos}
              alt="Logo Smart Bonos"
              sx={{
                width: '160px',
                objectFit: 'contain',
                overflow: 'hidden',
                height: 'auto',
                display: 'block',
                [theme.breakpoints.down('md')]: {
                  width: '140px',
                },
                [theme.breakpoints.down('sm')]: {
                  width: '120px',
                },
                [theme.breakpoints.down('xs')]: {
                  width: '100px',
                },
              }}
            />
          </StyledLogo>

          <Typography
            variant="h5"
            color="textPrimary"
            fontWeight={600}
            mb={4}
            textAlign="left"
            sx={{
              [theme.breakpoints.down('sm')]: {
                fontSize: '1.25rem',
                mb: 3,
              },
              [theme.breakpoints.down('xs')]: {
                fontSize: '1.1rem',
                mb: 2,
              },
            }}
          >
            Acceso Super Administrador
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Campo Correo electrónico */}
            <Box
              mb={4}
              sx={{
                [theme.breakpoints.down('sm')]: { mb: 3 },
                [theme.breakpoints.down('xs')]: { mb: 2 },
              }}
            >
              <CustomFormLabel htmlFor="email">Correo electrónico</CustomFormLabel>
              <StyledInput
                startAdornment={
                  <InputAdornment position="start">
                    <IconMail size="20" />
                  </InputAdornment>
                }
                id="email"
                type="email"
                {...register('email')}
                fullWidth
                placeholder="ejemplo@correo.com"
              />
              {errors.email && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.email.message}
                </Typography>
              )}
            </Box>

            {/* Campo Contraseña */}
            <Box
              mb={6}
              sx={{
                [theme.breakpoints.down('sm')]: { mb: 4 },
                [theme.breakpoints.down('xs')]: { mb: 3 },
              }}
            >
              <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
              <StyledInput
                startAdornment={
                  <InputAdornment position="start">
                    <IconLock size="20" />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <Box
                      component="span"
                      sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#666',
                        '&:hover': {
                          color: '#333',
                        },
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IconEyeOff size="20" /> : <IconEye size="20" />}
                    </Box>
                  </InputAdornment>
                }
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                fullWidth
                placeholder="••••••••"
              />
              {errors.password && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.password.message}
                </Typography>
              )}
            </Box>

            {/* Botón de inicio de sesión */}
            <Box
              mt={6}
              sx={{
                [theme.breakpoints.down('sm')]: { mt: 4 },
                [theme.breakpoints.down('xs')]: { mt: 3 },
              }}
            >
              <StyledButton
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                type="submit"
                disabled={loading || !isValid || isRecaptchaLoading || !isRecaptchaReady}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading
                  ? 'Iniciando sesión...'
                  : !isRecaptchaReady
                  ? 'Cargando...'
                  : 'Iniciar sesión'}
              </StyledButton>
            </Box>

            {/* Enlace de recuperación de contraseña */}
            <Box
              mt={4}
              textAlign="left"
              sx={{
                [theme.breakpoints.down('sm')]: { mt: 3 },
                [theme.breakpoints.down('xs')]: { mt: 2 },
              }}
            >
              <Typography variant="body2" color="textSecondary" component="span">
                ¿Olvidaste tu contraseña?{' '}
              </Typography>
              <Typography
                variant="body2"
                component="span"
                sx={{
                  cursor: 'pointer',
                  color: '#5D87FF',
                  fontWeight: 500,
                  fontSize: '14px',
                  '&:hover': {
                    color: '#4A6FE6',
                  },
                  transition: 'all 0.2s ease-in-out',
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '13px',
                  },
                  [theme.breakpoints.down('xs')]: {
                    fontSize: '12px',
                  },
                }}
              >
                Recuperar contraseña
              </Typography>
            </Box>
          </form>
        </StyledCard>
      </StyledContainer>
    </PageContainer>
  );
};

export default AdminLogin;
