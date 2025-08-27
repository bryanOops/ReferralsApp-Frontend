import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import driver1 from '../../../assets/images/referralRegister/driver1.png';
import driver2 from '../../../assets/images/referralRegister/driver2.png';
import logoSmartBonos from '../../../assets/images/logos/logo-smart-bonos.png';
import { validateCompletionToken } from '../../../utils/emailService';

// Configuración del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Componente para mostrar banderas
const FlagIcon = ({ countryCode }) => (
  <img
    src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
    alt={`${countryCode} flag`}
    style={{
      width: '20px',
      height: '15px',
      borderRadius: '2px',
      objectFit: 'cover',
    }}
  />
);

// Códigos de país comunes
const countryCodes = [
  { code: '+593', country: 'Ecuador', iso: 'EC' },
  { code: '+57', country: 'Colombia', iso: 'CO' },
  { code: '+51', country: 'Perú', iso: 'PE' },
  { code: '+1', country: 'Estados Unidos', iso: 'US' },
  { code: '+52', country: 'México', iso: 'MX' },
  { code: '+54', country: 'Argentina', iso: 'AR' },
  { code: '+56', country: 'Chile', iso: 'CL' },
  { code: '+55', country: 'Brasil', iso: 'BR' },
  { code: '+34', country: 'España', iso: 'ES' },
];

// Funciones para interactuar con el backend
const sendVerificationCode = async (userData) => {
  try {
    const payload = {
      phone: userData.celular,
      userData: {
        phone: userData.celular,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email || '',
      },
    };

    console.log('Enviando al backend:', payload);
    console.log('Número de teléfono enviado:', userData.celular);

    const response = await fetch(`${API_BASE_URL}/api/auth/send-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    const result = await response.json();
    console.log('Respuesta del backend:', result);
    return result;
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false, message: 'Error enviando código de verificación' };
  }
};

const verifyCode = async (phone, code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error verifying code:', error);
    return { success: false, message: 'Error validando código' };
  }
};

// Schema de validación
const schema = yup.object().shape({
  codigoPais: yup.string().required('Código de país requerido'),
  celular: yup
    .string()
    .required('El celular es requerido')
    .matches(/^\d+$/, 'Solo números permitidos')
    .max(12, 'Máximo 12 caracteres'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  repeatPassword: yup
    .string()
    .required('Repite tu contraseña')
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
  acceptTerms: yup.boolean().oneOf([true], 'Debes aceptar los términos y condiciones'),
});

// Componente Header
const Header = () => (
  <Box
    component="header"
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.03)',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      px: { xs: 2, sm: 3, md: 4 },
    }}
  >
    <Box
      component="img"
      src={logoSmartBonos}
      alt="Smart Bonos"
      sx={{
        height: { xs: '28px', md: '32px' },
        width: 'auto',
        filter: 'drop-shadow(0 1px 2px rgba(93, 135, 255, 0.08))',
      }}
    />
  </Box>
);

// Componente Progress Indicator
const ProgressIndicator = ({ currentStep }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: { xs: 'center', md: 'flex-start' },
      gap: 0,
      mb: { xs: 2, md: 3 },
      p: { xs: 1, md: 2 },
      px: { xs: 2, md: 2 },
    }}
  >
    {[1, 2, 3, 4].map((step, index) => (
      <Box key={step} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: { xs: 32, md: 40 },
            height: { xs: 32, md: 40 },
            borderRadius: '50%',
            backgroundColor: step <= currentStep ? 'white' : '#4474FF',
            color: step <= currentStep ? '#5D87FF' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: { xs: '14px', md: '16px' },
            border: 'none',
            transition: 'all 0.3s ease',
          }}
        >
          {step <= currentStep ? step : ''}
        </Box>
        {index < 3 && (
          <Box
            sx={{
              width: { xs: 60, sm: 80, md: 150 },
              height: { xs: 4, md: 6 },
              backgroundColor: step < currentStep ? 'white' : '#4474FF',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
            }}
          />
        )}
      </Box>
    ))}
  </Box>
);

// Componente Step 2 - Verificación de Código
const VerificationStep = ({ userData, onVerificationSuccess, onBack }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutos
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const inputRefs = useRef([]);

  // Inicializar refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Ya no enviamos código inicial aquí, se envía desde el paso 1
  useEffect(() => {
    // Solo inicializar el estado cuando lleguemos al paso 2
    setError('');
    setSuccessMessage('');
    setRetryCount(0);
    setIsLoading(false);

    // Mostrar mensaje informativo
    setSuccessMessage(`Código enviado a ${userData.celular}`);
  }, [userData]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Solo un dígito por input

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-validar cuando se completen los 6 dígitos
    if (newCode.every((digit) => digit !== '') && newCode.join('').length === 6) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (codeToVerify = code.join('')) => {
    if (codeToVerify.length !== 6) {
      setError('Por favor ingresa el código completo');
      return;
    }

    setIsLoading(true);
    const result = await verifyCode(userData.celular, codeToVerify);

    if (result.success) {
      onVerificationSuccess();
    } else {
      setError(result.message || 'Código incorrecto');
      // Limpiar código en caso de error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
    setIsLoading(false);
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError(''); // Limpiar errores previos

    try {
      const result = await sendVerificationCode(userData);

      if (result.success) {
        setCountdown(180);
        setCanResend(false);
        setCode(['', '', '', '', '', '']);
        setError('');
        setSuccessMessage(`Código reenviado a ${userData.celular}`);
        inputRefs.current[0]?.focus();
      } else {
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);

        if (newRetryCount >= 3) {
          setError(
            'Demasiados intentos fallidos. Por favor, verifica tu número de teléfono o contacta soporte.',
          );
          setCanResend(false);
        } else {
          setError(
            result.message ||
              `Error al reenviar el código (Intento ${newRetryCount}/3). Intenta nuevamente.`,
          );
          setCanResend(true);
          setCountdown(0);
        }
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error al reenviar código:', error);
      setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      setCanResend(true);
      setCountdown(0);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 2.5, md: 5 }, pt: ' 0 !important ' }}>
      {/* Título */}
      <Typography
        variant="h4"
        sx={{
          color: 'white',
          fontSize: { xs: '22px', sm: '28px', md: '40px' },
          fontWeight: 800,
          textAlign: { xs: 'center', md: 'left' },
          mb: { xs: 2, md: 3 },
          mt: { xs: 2, md: 1 },
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          px: { xs: 1, md: 0 },
        }}
      >
        Ingresa el código de verificación
      </Typography>

      {/* Descripción con Reenviar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'space-between' },
          alignItems: 'center',
          mb: { xs: 3, md: 4 },
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 0 },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 500,
            lineHeight: 1.4,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Código de verificación de 6 dígitos
        </Typography>

        {/* Reenviar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            onClick={canResend && !isLoading ? handleResendCode : undefined}
            sx={{
              color: canResend ? 'white' : 'rgba(255, 255, 255, 0.5)',
              fontSize: { xs: '13px', md: '14px' },
              cursor: canResend ? 'pointer' : 'default',
              textDecoration: canResend ? 'underline' : 'none',
              '&:hover': canResend
                ? {
                    color: 'rgba(255, 255, 255, 0.8)',
                  }
                : {},
            }}
          >
            Reenviar
          </Typography>
          {!canResend && (
            <Typography
              sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '13px', md: '14px' } }}
            >
              {formatTime(countdown)}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Inputs para código */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1, md: 2 },
          mb: 3,
          justifyContent: { xs: 'center', md: 'flex-start' },
          px: { xs: 1, md: 0 },
        }}
      >
        {code.map((digit, index) => (
          <TextField
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: window.innerWidth < 600 ? '24px' : '32px',
                fontWeight: 'bold',
              },
            }}
            sx={{
              width: { xs: '48px', md: '64px' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: '12px',
                height: { xs: '56px', md: '72px' },
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'rgba(93, 135, 255, 0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#5D87FF', borderWidth: '2px' },
              },
              '& .MuiInputBase-input': {
                color: '#5D87FF',
                fontSize: { xs: '24px', md: '32px' },
                fontWeight: 700,
              },
            }}
          />
        ))}
      </Box>

      {/* Error message */}
      {error && (
        <Typography
          sx={{
            color: '#FA896B',
            fontSize: { xs: '13px', md: '14px' },
            textAlign: { xs: 'center', md: 'left' },
            mb: 3,
            px: { xs: 1, md: 0 },
          }}
        >
          {error}
        </Typography>
      )}

      {/* Success message */}
      {successMessage && (
        <Typography
          sx={{
            color: 'white',
            fontSize: { xs: '13px', md: '14px' },
            textAlign: { xs: 'center', md: 'left' },
            mb: 3,
            px: { xs: 1, md: 0 },
          }}
        >
          {successMessage}
        </Typography>
      )}

      {/* Botones */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1, md: 2 },
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' },
          flexDirection: { xs: 'column', sm: 'row' },
          px: { xs: 1, md: 0 },
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleVerifyCode()}
          disabled={isLoading || code.some((digit) => digit === '')}
          sx={{
            backgroundColor: 'white',
            color: '#5D87FF',
            py: { xs: 2, md: 1.5 },
            px: { xs: 6, md: 4 },
            fontSize: { xs: '15px', md: '16px' },
            fontWeight: 700,
            borderRadius: '16px',
            textTransform: 'none',
            height: { xs: '48px', md: '40px' },
            width: { xs: '100%', sm: '48%', md: '30%' },
            minWidth: { xs: 'auto', md: '120px' },
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.16)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              color: 'rgba(93, 135, 255, 0.5)',
              boxShadow: 'none',
              transform: 'none',
            },
          }}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? 'Validando...' : 'Validar'}
        </Button>

        {/* Botón Atrás */}
        <Button
          variant="contained"
          onClick={onBack}
          sx={{
            backgroundColor: '#4A79FF',
            color: 'white',
            py: { xs: 2, md: 1.5 },
            px: { xs: 6, md: 4 },
            fontSize: { xs: '15px', md: '16px' },
            fontWeight: 700,
            borderRadius: '16px',
            textTransform: 'none',
            height: { xs: '48px', md: '40px' },
            width: { xs: '100%', sm: '48%', md: '30%' },
            minWidth: { xs: 'auto', md: '120px' },
            border: 'none',
            boxShadow: '0 4px 16px rgba(74, 121, 255, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#3A69FF',
              boxShadow: '0 6px 24px rgba(74, 121, 255, 0.4)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Atrás
        </Button>
      </Box>
    </Box>
  );
};

// Componente Imagen Alternante
const AlternatingImage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [driver1, driver2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${images[currentImage]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: { xs: '16px 16px 0 0', md: '16px 0 0 16px' },
        transition: 'background-image 0.8s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(135deg, rgba(93, 135, 255, 0.06) 0%, rgba(93, 135, 255, 0.02) 100%)',
          zIndex: 1,
        },
      }}
    />
  );
};

// Componente Formulario
const FormSection = ({
  tokenData,
  currentStep,
  onSubmit,
  register,
  errors,
  isFormValid,
  isLoading,
  watchedFields,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowRepeatPassword = () => setShowRepeatPassword((show) => !show);

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        p: { xs: 3, sm: 3, md: 5 },
        borderRadius: '8px',
        overflow: 'hidden', // Previene scroll horizontal
      }}
    >
      {/* Título principal */}
      <Typography
        variant="h4"
        sx={{
          color: 'white',
          fontSize: { xs: '24px', sm: '28px', md: '35px' },
          fontWeight: 800,
          textAlign: { xs: 'center', md: 'left' },
          mb: { xs: 2, md: 3 },
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          px: { xs: 1, md: 0 },
        }}
      >
        Conduce, regístrate y genera ingresos a tu ritmo.
      </Typography>

      {/* Mensaje de bienvenida */}
      {tokenData && (
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: { xs: '14px', md: '16px' },
            textAlign: { xs: 'center', md: 'left' },
            mb: { xs: 3, md: 2 },
            fontWeight: 500,
            lineHeight: 1.4,
            px: { xs: 1, md: 0 },
          }}
        >
          Hola {tokenData.nombres} {tokenData.apellidos}, completa tu perfil para continuar con el
          proceso.
        </Typography>
      )}

      {/* Campo Celular con Código de País */}
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 } }}>
          {/* Selector de Código de País */}
          <FormControl
            sx={{
              minWidth: { xs: 100, md: 120 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
                borderRadius: '8px',
                height: { xs: '52px', md: '48px' },
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#90B0FF', borderWidth: '2px' },
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              },
              '& .MuiSelect-select': {
                color: 'white',
                fontSize: { xs: '12px', md: '14px' },
                fontWeight: 600,
                padding: { xs: '16px 12px', md: '14px 15px' },
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, md: 1 },
              },
              '& .MuiSelect-icon': {
                color: 'white',
              },
            }}
          >
            <Select
              {...register('codigoPais')}
              defaultValue="+593"
              error={!!errors.codigoPais}
              renderValue={(value) => {
                const selectedCountry = countryCodes.find((country) => country.code === value);
                return selectedCountry ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
                    <FlagIcon countryCode={selectedCountry.iso} />
                    <Typography
                      sx={{ fontSize: { xs: '12px', md: '14px' }, fontWeight: 600, color: 'white' }}
                    >
                      {selectedCountry.code}
                    </Typography>
                  </Box>
                ) : (
                  value
                );
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    mt: 1,
                    '& .MuiMenuItem-root': {
                      color: '#5D87FF',
                      fontWeight: 500,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(93, 135, 255, 0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(93, 135, 255, 0.2)',
                        color: '#5D87FF',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(93, 135, 255, 0.3)',
                        },
                      },
                    },
                  },
                },
              }}
            >
              {countryCodes.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <FlagIcon countryCode={country.iso} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 'inherit' }}>
                        {country.iso}
                      </Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: 'inherit' }}>
                        {country.code}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Campo de Número */}
          <TextField
            fullWidth
            variant="outlined"
            {...register('celular')}
            error={!!errors.celular}
            placeholder="Número de celular"
            inputProps={{ maxLength: 12 }}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                height: { xs: '52px', md: '48px' },
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#90B0FF', borderWidth: '2px' },
                transition: 'all 0.3s ease',
              },
              '& .MuiInputBase-input': {
                color: 'white',
                fontSize: { xs: '14px', md: '14px' },
                fontWeight: 500,
                padding: { xs: '16px 15px', md: '14px 15px' },
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.8)',
                  opacity: 1,
                  fontSize: { xs: '14px', md: '14px' },
                },
                // Estilos para autocompletado
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.15) inset',
                  WebkitTextFillColor: 'white',
                  transition: 'background-color 5000s ease-in-out 0s',
                },
                '&:-webkit-autofill:hover': {
                  WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.15) inset',
                },
                '&:-webkit-autofill:focus': {
                  WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.15) inset',
                },
              },
            }}
          />
        </Box>

        {/* Error messages */}
        {(errors.codigoPais || errors.celular) && (
          <Typography
            sx={{
              color: '#FA896B',
              fontSize: '12px',
              marginLeft: '8px',
              marginTop: '6px',
            }}
          >
            {errors.codigoPais?.message || errors.celular?.message}
          </Typography>
        )}
      </Box>

      {/* Campo Contraseña */}
      <Box sx={{ mb: 2.5 }}>
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          placeholder="Contraseña"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    size: { xs: 'small', md: 'medium' },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              height: { xs: '52px', md: '48px' },
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&.Mui-focused fieldset': { borderColor: '#90B0FF', borderWidth: '2px' },
              transition: 'all 0.3s ease',
            },
            '& .MuiInputBase-input': {
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
              padding: { xs: '16px 15px', md: '14px 15px' },
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.8)',
                opacity: 1,
                fontSize: '14px',
              },
              // Estilos para autocompletado
              '&:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.15) inset',
                WebkitTextFillColor: 'white',
                transition: 'background-color 5000s ease-in-out 0s',
              },
              '&:-webkit-autofill:hover': {
                WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.15) inset',
              },
              '&:-webkit-autofill:focus': {
                WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.15) inset',
              },
            },
            '& .MuiFormHelperText-root': {
              color: '#FA896B',
              fontSize: { xs: '11px', md: '12px' },
              marginLeft: '8px',
              marginTop: '6px',
            },
          }}
        />
      </Box>

      {/* Campo Repite Contraseña */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          type={showRepeatPassword ? 'text' : 'password'}
          variant="outlined"
          {...register('repeatPassword')}
          error={!!errors.repeatPassword}
          helperText={errors.repeatPassword?.message}
          placeholder="Repite tu Contraseña"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowRepeatPassword}
                  edge="end"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    size: { xs: 'small', md: 'medium' },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              height: { xs: '52px', md: '48px' },
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&.Mui-focused fieldset': { borderColor: '#90B0FF', borderWidth: '2px' },
              transition: 'all 0.3s ease',
            },
            '& .MuiInputBase-input': {
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
              padding: { xs: '16px 15px', md: '14px 15px' },
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.8)',
                opacity: 1,
                fontSize: '14px',
              },
              // Estilos para autocompletado
              '&:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.15) inset',
                WebkitTextFillColor: 'white',
                transition: 'background-color 5000s ease-in-out 0s',
              },
              '&:-webkit-autofill:hover': {
                WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.15) inset',
              },
              '&:-webkit-autofill:focus': {
                WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.15) inset',
              },
            },
            '& .MuiFormHelperText-root': {
              color: '#FA896B',
              fontSize: { xs: '11px', md: '12px' },
              marginLeft: '8px',
              marginTop: '6px',
            },
          }}
        />
      </Box>

      {/* Checkbox términos y condiciones */}
      <Box sx={{ mb: { xs: 3, md: 1.5 } }}>
        <FormControlLabel
          control={
            <Checkbox
              {...register('acceptTerms')}
              checked={watchedFields[4] || false}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '&.Mui-checked': { color: 'white' },
                '& .MuiSvgIcon-root': { fontSize: { xs: '18px', md: '20px' } },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                padding: '9px', // Asegurar padding consistente
              }}
            />
          }
          label={
            <Typography
              sx={{
                color: 'white',
                fontSize: { xs: '13px', md: '14px' },
                opacity: 0.95,
                lineHeight: 1.4,
                fontWeight: 500,
                marginTop: '2px', // Pequeño ajuste para alineación perfecta
              }}
            >
              Acepto los términos y condiciones
            </Typography>
          }
          sx={{
            alignItems: 'center', // Siempre centrado
            mt: { xs: 1, md: 0 },
            margin: 0, // Resetear márgenes por defecto
            '& .MuiFormControlLabel-label': {
              marginLeft: '8px', // Espaciado consistente entre checkbox y texto
            },
          }}
        />
      </Box>

      {/* Botón Empezar */}
      <Button
        type="submit"
        variant="contained"
        disabled={!isFormValid() || isLoading}
        sx={{
          backgroundColor: 'white',
          color: '#5D87FF',
          py: { xs: 2, md: 1.5 },
          px: { xs: 6, md: 4 },
          fontSize: { xs: '15px', md: '16px' },
          fontWeight: 700,
          borderRadius: '16px',
          textTransform: 'none',
          height: { xs: '48px', md: '40px' },
          width: { xs: '100%', sm: '60%', md: '30%' },
          alignSelf: { xs: 'center', md: 'flex-start' },
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.16)',
            transform: 'translateY(-1px)',
          },
          '&:disabled': {
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            color: 'rgba(93, 135, 255, 0.5)',
            boxShadow: 'none',
            transform: 'none',
          },
        }}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {isLoading ? 'Guardando...' : '¡Empezar!'}
      </Button>
    </Box>
  );
};

// Componente Principal
const CompletarDatos = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState(null);
  const [formData, setFormData] = useState(null);

  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      codigoPais: '+593',
      celular: '',
      password: '',
      repeatPassword: '',
      acceptTerms: false,
    },
  });

  const watchedFields = watch([
    'codigoPais',
    'celular',
    'password',
    'repeatPassword',
    'acceptTerms',
  ]);

  const isFormValid = () => {
    return (
      watchedFields[0]?.trim() !== '' &&
      watchedFields[1]?.trim() !== '' &&
      watchedFields[2]?.trim() !== '' &&
      watchedFields[3]?.trim() !== '' &&
      watchedFields[2] === watchedFields[3] &&
      watchedFields[4] === true
    );
  };

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
  }, [token]);

  const handleClose = (reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setAlertMessage(null);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  // Effect para restaurar datos del formulario cuando se regresa al paso 1
  useEffect(() => {
    if (currentStep === 1 && formData) {
      // Usar setTimeout para asegurar que el formulario esté listo
      setTimeout(() => {
        setValue('codigoPais', formData.codigoPais, { shouldValidate: true });
        setValue('celular', formData.celular, { shouldValidate: true });
        setValue('password', formData.password, { shouldValidate: true });
        setValue('repeatPassword', formData.repeatPassword, { shouldValidate: true });
        setValue('acceptTerms', formData.acceptTerms, { shouldValidate: true });
      }, 100);
    }
  }, [currentStep, formData, setValue]);

  const onSubmit = async (data) => {
    if (!isFormValid()) return;

    setIsLoading(true);
    try {
      // Guardar todos los datos del formulario para persistencia
      setFormData(data);

      // Convertir datos a inglés para el backend
      const fullPhoneNumber = `${data.codigoPais}${data.celular}`;
      const userData = {
        celular: fullPhoneNumber,
        password: data.password,
        firstName: tokenData?.nombres || '',
        lastName: tokenData?.apellidos || '',
        email: tokenData?.email || '',
        acceptTerms: data.acceptTerms,
      };

      console.log('Datos del formulario (español):', data);
      console.log('Número completo sin espacios:', fullPhoneNumber);
      console.log('Datos para backend (inglés):', userData);

      // Intentar enviar el código SMS antes de ir al paso 2
      const smsResult = await sendVerificationCode(userData);

      if (!smsResult.success) {
        // Mostrar error en el paso 1
        setAlertMessage(
          smsResult.message ||
            'Error al enviar el código de verificación. Por favor, verifica tu número de teléfono.',
        );
        setAlertSeverity('error');
        setOpen(true);
        return; // No avanzar al paso 2
      }

      // Si el SMS se envió correctamente, guardar datos y avanzar
      setStep1Data(userData);
      setCurrentStep(2);

      setAlertMessage('Código de verificación enviado correctamente');
      setAlertSeverity('success');
      setOpen(true);
    } catch (error) {
      console.error('Error en el paso 1:', error);
      setAlertMessage('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      setAlertSeverity('error');
      setOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !tokenValid) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#5D87FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: 'white', size: 60 }} />
      </Box>
    );
  }

  if (!tokenValid) return null;

  return (
    <>
      <Header />

      {/* Layout principal usando CSS Grid */}
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#5D87FF',
          display: 'flex',
          gridTemplateRows: 'auto 1fr',
          pt: { xs: '64px', md: '64px' }, // Espacio para el header fijo
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'center',
          pb: { xs: 2, md: 0 }, // Padding bottom para móviles
        }}
      >
        {/* Contenedor principal del contenido */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '4fr 1fr' },
            gap: { xs: 0, md: 0 },
            maxWidth: { xs: '100%', md: '1600px' },
            margin: '0 auto',
            width: '100%',
            height: 'fit-content',
            minHeight: { xs: 'calc(100vh - 64px)', md: '500px' },
            alignSelf: { xs: 'stretch', md: 'center' },
            p: { xs: 0, sm: 3, md: 4 },
            borderRadius: { xs: 0, md: '16px' },
            alignItems: 'center',
          }}
        >
          {/* Sección de imagen - IZQUIERDA */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              height: { xs: 'auto', md: '470px' },
              borderRadius: '16px ',
              overflow: 'hidden',
            }}
          >
            <AlternatingImage />
          </Box>

          {/* Sección de formulario - DERECHA */}

          <Box
            sx={{
              backgroundColor: '#5D87FF',
              borderRadius: { xs: 0, md: '0 16px 16px 0' },
              height: 'fit-content',
              minHeight: { xs: 'calc(100vh - 64px)', md: '500px' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: currentStep === 2 ? 'flex-start' : { xs: 'flex-start', md: 'center' },
              position: 'relative',
              pt: { xs: 1, md: 0 }, // Padding top para móviles
            }}
          >
            {/* Indicador de progreso */}
            <ProgressIndicator currentStep={currentStep} />

            {currentStep === 1 ? (
              <FormSection
                tokenData={tokenData}
                currentStep={currentStep}
                onSubmit={handleSubmit(onSubmit)}
                register={register}
                errors={errors}
                isFormValid={isFormValid}
                isLoading={isLoading}
                watchedFields={watchedFields}
              />
            ) : currentStep === 2 ? (
              <VerificationStep
                userData={step1Data}
                onVerificationSuccess={() => setCurrentStep(3)}
                onBack={handleBackToStep1}
              />
            ) : (
              <Box sx={{ p: 5, textAlign: 'center' }}>
                <Typography sx={{ color: 'white', fontSize: '18px' }}>
                  Paso {currentStep} - En desarrollo
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CompletarDatos;
