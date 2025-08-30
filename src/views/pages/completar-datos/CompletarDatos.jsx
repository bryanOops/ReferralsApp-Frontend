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
  Grid,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Visibility, VisibilityOff, CloudUpload, CheckCircle } from '@mui/icons-material';

// Configurar dayjs en español
dayjs.locale('es');
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
      phone: userData.phone,
      userData: {
        phone: userData.phone,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email || '',
      },
    };

    console.log('Enviando al backend:', payload);
    console.log('Número de teléfono enviado:', userData.phone);

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

// Función para completar el registro completo
const completeRegistration = async (formData, files, tokenData, interviewData, token) => {
  try {
    const formDataToSend = new FormData();

    // 1. userInvitation (JSON string)
    formDataToSend.append(
      'userInvitation',
      JSON.stringify({
        nombres: tokenData.nombres,
        apellidos: tokenData.apellidos,
        email: tokenData.email,
        invitationToken: token,
      }),
    );

    // 2. registration (JSON string)
    formDataToSend.append(
      'registration',
      JSON.stringify({
        phone: formData.phone,
        password: formData.password,
        acceptTerms: formData.acceptTerms,
      }),
    );

    // 3. interview (JSON string)
    formDataToSend.append(
      'interview',
      JSON.stringify({
        interviewDate: interviewData.interviewDate,
        interviewTime: interviewData.interviewTime,
        interviewLocation: interviewData.interviewLocation,
      }),
    );

    // 4. Archivos (obligatorios según frontend)
    formDataToSend.append('dni', files.dni);
    formDataToSend.append('soat', files.soat);
    formDataToSend.append('brevete', files.brevete);
    formDataToSend.append('tarjetaPropiedad1', files.tarjetaPropiedad1);
    formDataToSend.append('tarjetaPropiedad2', files.tarjetaPropiedad2);
    formDataToSend.append('antecedentes', files.antecedentes);
    formDataToSend.append('fotosVehiculo', files.fotosVehiculo);

    console.log('🚀 Enviando registro completo al backend...');
    console.log('📁 Archivos a enviar:', files);
    console.log('📅 Datos de entrevista:', interviewData);
    console.log(
      '📄 Tipo de archivo DNI:',
      typeof files.dni,
      files.dni instanceof File ? 'File' : 'No es File',
    );
    console.log(
      '📄 Tipo de archivo Brevete:',
      typeof files.brevete,
      files.brevete instanceof File ? 'File' : 'No es File',
    );

    const response = await fetch(`${API_BASE_URL}/api/auth/complete-registration`, {
      method: 'POST',
      body: formDataToSend, // No headers para FormData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Respuesta del backend:', result);
    return result;
  } catch (error) {
    console.error('❌ Error completando registro:', error);
    return { success: false, message: 'Error completando el registro' };
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

// Schema de validación para paso 1
const schema = yup.object().shape({
  countryCode: yup.string().required('Código de país requerido'),
  phone: yup
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

// Schema de validación para paso 3
const step3Schema = yup.object().shape({
  dni: yup.string().required('DNI es requerido').min(8, 'DNI debe tener al menos 8 caracteres'),
  brevete: yup.string().required('Brevete/licencia es requerido'),
  soat: yup.string().required('SOAT es requerido'),
  tarjetaPropiedad1: yup.string().required('Tarjeta de propiedad es requerida'),
  tarjetaPropiedad2: yup.string().required('Tarjeta de propiedad es requerida'),
  antecedentes: yup.string().required('Antecedentes penales son requeridos'),
  fotosVehiculo: yup.string().required('Fotos del vehículo son requeridas'),
});

// Schema de validación para paso 4
const step4Schema = yup.object().shape({
  interviewDate: yup
    .date()
    .required('Fecha de entrevista es requerida')
    .min(new Date(), 'La fecha debe ser futura'),
  interviewTime: yup.string().required('Hora de entrevista es requerida'),
  interviewLocation: yup
    .string()
    .required('Lugar de entrevista es requerido')
    .min(5, 'Mínimo 5 caracteres'),
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
    setSuccessMessage(`Código enviado a ${userData.phone}`);
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
    const result = await verifyCode(userData.phone, codeToVerify);

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
        setSuccessMessage(`Código reenviado a ${userData.phone}`);
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

// Hook personalizado para manejar archivos
const useFileUpload = (setFormValue) => {
  const [files, setFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState({});

  const simulateUpload = (fieldName, selectedFiles) => {
    // Iniciar la subida
    setIsUploading((prev) => ({ ...prev, [fieldName]: true }));
    setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }));

    // Simular progreso de subida
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const currentProgress = prev[fieldName] || 0;
        const newProgress = currentProgress + Math.random() * 30;

        if (newProgress >= 100) {
          clearInterval(interval);
          // Completar la subida
          setFiles((prevFiles) => ({
            ...prevFiles,
            [fieldName]: selectedFiles,
          }));
          setIsUploading((prevUploading) => ({ ...prevUploading, [fieldName]: false }));

          // Actualizar el valor del formulario para que la validación funcione
          const fileName = Array.isArray(selectedFiles)
            ? selectedFiles.length === 1
              ? selectedFiles[0].name
              : `${selectedFiles.length} archivos seleccionados`
            : selectedFiles.name;
          setFormValue(fieldName, fileName, { shouldValidate: true });

          return { ...prev, [fieldName]: 100 };
        }

        return { ...prev, [fieldName]: newProgress };
      });
    }, 200);
  };

  const openFileDialog = (fieldName, accept = '*/*', multiple = false) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;

    input.onchange = (e) => {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > 0) {
        simulateUpload(fieldName, multiple ? selectedFiles : selectedFiles[0]);
      }
    };

    input.click();
  };

  const getFileDisplayName = (fieldName) => {
    const file = files[fieldName];
    if (!file) return '';

    if (Array.isArray(file)) {
      return file.length === 1 ? file[0].name : `${file.length} archivos seleccionados`;
    }

    return file.name;
  };

  const hasFile = (fieldName) => {
    const file = files[fieldName];
    return file && (Array.isArray(file) ? file.length > 0 : true);
  };

  return {
    files,
    openFileDialog,
    getFileDisplayName,
    hasFile,
    uploadProgress,
    isUploading,
  };
};

// Componente Step 3 - Datos del Conductor
const Step3Component = ({
  onSubmit,
  onBack,
  register,
  errors,
  isFormValid,
  isLoading,
  watchedFields,
  setValueStep3,
  onFilesReady,
}) => {
  const { files, openFileDialog, getFileDisplayName, hasFile, uploadProgress, isUploading } =
    useFileUpload(setValueStep3);

  // Pasar los archivos reales al componente padre cuando estén listos
  React.useEffect(() => {
    if (onFilesReady && Object.keys(files).length > 0) {
      onFilesReady(files);
    }
  }, [files, onFilesReady]);

  // Función para verificar si todos los archivos están cargados
  const areAllFilesUploaded = () => {
    const requiredFields = [
      'dni',
      'brevete',
      'soat',
      'tarjetaPropiedad1',
      'tarjetaPropiedad2',
      'antecedentes',
      'fotosVehiculo',
    ];
    return requiredFields.every((field) => hasFile(field));
  };

  // Función para obtener el icono correcto
  const getFieldIcon = (fieldName) => {
    if (isUploading[fieldName]) {
      return <CloudUpload sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />;
    }
    if (hasFile(fieldName)) {
      return <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />;
    }
    return <CloudUpload sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />;
  };

  // Función helper para crear campos de upload
  const createUploadField = (fieldName, placeholder, accept = 'image/*,.pdf', multiple = false) => (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        variant="outlined"
        {...register(fieldName)}
        error={!!errors[fieldName]}
        helperText={errors[fieldName]?.message}
        placeholder={placeholder}
        value={getFileDisplayName(fieldName)}
        onClick={() => !isUploading[fieldName] && openFileDialog(fieldName, accept, multiple)}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">{getFieldIcon(fieldName)}</InputAdornment>
          ),
        }}
        sx={{
          cursor: isUploading[fieldName] ? 'default' : 'pointer',
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            height: { xs: '52px', md: '48px' },
            cursor: isUploading[fieldName] ? 'default' : 'pointer',
            overflow: 'hidden',
            position: 'relative',
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': {
              borderColor: isUploading[fieldName] ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': { borderColor: '#90B0FF', borderWidth: '2px' },
            transition: 'all 0.3s ease',
            '&::before': isUploading[fieldName]
              ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${uploadProgress[fieldName] || 0}%`,
                  backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  zIndex: 1,
                  transition: 'width 0.3s ease',
                }
              : {},
          },
          '& .MuiInputBase-input': {
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            padding: { xs: '16px 15px', md: '14px 15px' },
            cursor: isUploading[fieldName] ? 'default' : 'pointer',
            position: 'relative',
            zIndex: 2,
            '&::placeholder': {
              color: 'rgba(255, 255, 255, 0.8)',
              opacity: 1,
              fontSize: '14px',
            },
          },
          '& .MuiInputAdornment-root': {
            position: 'relative',
            zIndex: 2,
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
  );

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
        overflow: 'hidden',
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
        Regístrate y genera ingresos conduciendo
      </Typography>

      {/* Subtítulo */}
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: { xs: '14px', md: '16px' },
          textAlign: { xs: 'center', md: 'left' },
          mb: { xs: 3, md: 4 },
          fontWeight: 500,
          lineHeight: 1.4,
          px: { xs: 1, md: 0 },
        }}
      >
        Completa los campos y regístrate
      </Typography>

      {/* Grid de campos - 2 columnas en desktop, 1 en móvil */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 2.5, md: 2 },
          mb: 3,
        }}
      >
        {/* DNI (Frontal/Vertical) */}
        {createUploadField('dni', 'DNI (Frontal/Vertical)')}

        {/* Brevete/licencia */}
        {createUploadField('brevete', 'Brevete/licencia')}

        {/* SOAT */}
        {createUploadField('soat', 'SOAT')}

        {/* Tarjeta de propiedad 1 */}
        {createUploadField('tarjetaPropiedad1', 'Tarjeta de propiedad')}

        {/* Antecedentes penales */}
        {createUploadField('antecedentes', 'Antecedentes penales')}

        {/* Tarjeta de propiedad 2 */}
        {createUploadField('tarjetaPropiedad2', 'Tarjeta de propiedad')}
      </Box>

      {/* Campo Fotos del vehículo - Ancho completo */}
      <Box sx={{ mb: 3 }}>
        {createUploadField(
          'fotosVehiculo',
          'Fotos del vehículo (frontal, posterior, lateral, interior)',
          'image/*',
          true,
        )}
      </Box>

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
        {/* Botón Siguiente */}
        <Button
          type="submit"
          variant="contained"
          disabled={!areAllFilesUploaded() || isLoading}
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
          {isLoading ? 'Guardando...' : 'Siguiente'}
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

// Componente Step 4 - Entrevista y Revisión del Vehículo
const Step4Component = ({
  onSubmit,
  onBack,
  register,
  errors,
  isFormValid,
  isLoading,
  watchedFields,
  setValue,
  tokenData,
}) => {
  // Generar horas disponibles (8 AM a 6 PM)
  const horasDisponibles = [];
  for (let i = 8; i <= 18; i++) {
    const hora12 = i > 12 ? i - 12 : i;
    const ampm = i >= 12 ? 'PM' : 'AM';
    const horaDisplay = `${hora12 === 0 ? 12 : hora12}:00 ${ampm}`;
    const horaValue = `${i.toString().padStart(2, '0')}:00`;
    horasDisponibles.push({ value: horaValue, label: horaDisplay });
  }

  const handleSubmit = async (data) => {
    // Solo llamar onSubmit para que se maneje en el componente padre
    onSubmit(data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          p: { xs: 3, sm: 3, md: 5 },
          borderRadius: '8px',
          overflow: 'hidden',
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
          Entrevista y Revisión del Vehículo
        </Typography>

        {/* Subtítulo */}
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: { xs: '14px', md: '16px' },
            textAlign: { xs: 'center', md: 'left' },
            mb: { xs: 3, md: 4 },
            fontWeight: 500,
            lineHeight: 1.4,
            px: { xs: 1, md: 0 },
          }}
        >
          Completa los campos y regístrate
        </Typography>

        {/* Grid de campos */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 2.5, md: 2 },
            mb: 3,
          }}
        >
          {/* Campo Fecha de entrevista */}
          <Box>
            <DatePicker
              value={watchedFields[0] ? dayjs(watchedFields[0]) : null}
              onChange={(newValue) => {
                setValue('interviewDate', newValue ? newValue.toDate() : null, {
                  shouldValidate: true,
                });
              }}
              minDate={dayjs().add(1, 'day')} // Mínimo mañana
              maxDate={dayjs().add(30, 'day')} // Máximo 30 días
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: 'Fecha de entrevista',
                  error: !!errors.interviewDate,
                  helperText: errors.interviewDate?.message,
                  sx: {
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
                    },
                    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                      color: 'rgba(255, 255, 255, 0.8)',
                    },
                    '& .MuiInputAdornment-root .MuiIconButton-root': {
                      color: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: 'rgba(255, 255, 255, 1)',
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#FA896B',
                      fontSize: { xs: '11px', md: '12px' },
                      marginLeft: '8px',
                      marginTop: '6px',
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Campo Hora de entrevista */}
          <Box>
            <FormControl
              fullWidth
              error={!!errors.interviewTime}
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
                '& .MuiSelect-select': {
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: { xs: '16px 15px', md: '14px 15px' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  '&.Mui-focused': { color: '#90B0FF' },
                },
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.8)',
                },
                '& .MuiFormHelperText-root': {
                  color: '#FA896B',
                  fontSize: { xs: '11px', md: '12px' },
                  marginLeft: '8px',
                  marginTop: '6px',
                },
              }}
            >
              <Select
                {...register('interviewTime')}
                value={watchedFields[1] || ''}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <em style={{ color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'normal' }}>
                        Hora de entrevista
                      </em>
                    );
                  }
                  const hora = horasDisponibles.find((h) => h.value === selected);
                  return hora ? hora.label : selected;
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
                      maxHeight: '300px',
                      '& .MuiMenuItem-root': {
                        color: '#5D87FF',
                        fontWeight: 500,
                        py: 1,
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
                {horasDisponibles.map((hora) => (
                  <MenuItem key={hora.value} value={hora.value}>
                    {hora.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.interviewTime && (
                <Typography
                  sx={{
                    color: '#FA896B',
                    fontSize: { xs: '11px', md: '12px' },
                    marginLeft: '8px',
                    marginTop: '6px',
                  }}
                >
                  {errors.interviewTime.message}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Box>

        {/* Campo Lugar de entrevista - Ancho completo */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            {...register('interviewLocation')}
            error={!!errors.interviewLocation}
            helperText={errors.interviewLocation?.message}
            placeholder="Lugar de entrevista"
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

        {/* Texto descriptivo */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: { xs: '12px', md: '14px' },
            textAlign: { xs: 'center', md: 'left' },
            mb: { xs: 3, md: 4 },
            fontWeight: 400,
            lineHeight: 1.4,
            px: { xs: 1, md: 0 },
          }}
        >
          En esta etapa se realizará una entrevista personal al conductor y la revisión del
          vehículo, donde se evaluará su estado general, documentación y condiciones de seguridad
        </Typography>

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
          {/* Botón Finalizar */}
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
            {isLoading ? 'Finalizando...' : 'Finalizar'}
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
    </LocalizationProvider>
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
              {...register('countryCode')}
              defaultValue="+593"
              error={!!errors.countryCode}
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
            {...register('phone')}
            error={!!errors.phone}
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
        {(errors.countryCode || errors.phone) && (
          <Typography
            sx={{
              color: '#FA896B',
              fontSize: '12px',
              marginLeft: '8px',
              marginTop: '6px',
            }}
          >
            {errors.countryCode?.message || errors.phone?.message}
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
  const [step2Data, setStep2Data] = useState(null);
  const [formData, setFormData] = useState(null);
  const [step3FormData, setStep3FormData] = useState(null);
  const [step4FormData, setStep4FormData] = useState(null);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});

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
      countryCode: '+593',
      phone: '',
      password: '',
      repeatPassword: '',
      acceptTerms: false,
    },
  });

  // Hook de formulario para paso 3
  const {
    register: registerStep3,
    handleSubmit: handleSubmitStep3,
    formState: { errors: errorsStep3 },
    watch: watchStep3,
    setValue: setValueStep3,
    reset: resetStep3,
  } = useForm({
    resolver: yupResolver(step3Schema),
    mode: 'onChange',
    defaultValues: {
      dni: '',
      brevete: '',
      soat: '',
      tarjetaPropiedad1: '',
      tarjetaPropiedad2: '',
      antecedentes: '',
      fotosVehiculo: '',
    },
  });

  // Hook de formulario para paso 4
  const {
    register: registerStep4,
    handleSubmit: handleSubmitStep4,
    formState: { errors: errorsStep4 },
    watch: watchStep4,
    setValue: setValueStep4,
    reset: resetStep4,
  } = useForm({
    resolver: yupResolver(step4Schema),
    mode: 'onChange',
    defaultValues: {
      interviewDate: null,
      interviewTime: '',
      interviewLocation: '',
    },
  });

  const watchedFields = watch([
    'countryCode',
    'phone',
    'password',
    'repeatPassword',
    'acceptTerms',
  ]);

  const watchedStep3Fields = watchStep3([
    'dni',
    'brevete',
    'soat',
    'tarjetaPropiedad1',
    'tarjetaPropiedad2',
    'antecedentes',
    'fotosVehiculo',
  ]);

  const watchedStep4Fields = watchStep4(['interviewDate', 'interviewTime', 'interviewLocation']);

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

  const isStep3FormValid = () => {
    return (
      watchedStep3Fields[0]?.trim() !== '' &&
      watchedStep3Fields[1]?.trim() !== '' &&
      watchedStep3Fields[2]?.trim() !== '' &&
      watchedStep3Fields[3]?.trim() !== '' &&
      watchedStep3Fields[4]?.trim() !== '' &&
      watchedStep3Fields[5]?.trim() !== '' &&
      watchedStep3Fields[6]?.trim() !== ''
    );
  };

  const isStep4FormValid = () => {
    return (
      watchedStep4Fields[0] !== null &&
      watchedStep4Fields[1]?.trim() !== '' &&
      watchedStep4Fields[2]?.trim() !== '' &&
      !errorsStep4.interviewDate &&
      !errorsStep4.interviewTime &&
      !errorsStep4.interviewLocation
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

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  const handleBackToStep3 = () => {
    setCurrentStep(3);
  };

  // Función para capturar los archivos reales del paso 3
  const handleFilesReady = (files) => {
    setUploadedFiles(files);
    console.log('📁 Archivos reales capturados:', files);
    console.log('📄 Verificación de tipos de archivo:');
    Object.keys(files).forEach((key) => {
      const file = files[key];
      if (file) {
        console.log(
          `  ${key}:`,
          typeof file,
          file instanceof File ? 'File' : 'No es File',
          file.name || 'Sin nombre',
        );
      }
    });
  };

  const handleVerificationSuccess = () => {
    setStep2Data({ verified: true });
    setCurrentStep(3);
  };

  // Effect para restaurar datos del formulario cuando se regresa al paso 1
  useEffect(() => {
    if (currentStep === 1 && formData) {
      // Usar setTimeout para asegurar que el formulario esté listo
      setTimeout(() => {
        setValue('countryCode', formData.countryCode, { shouldValidate: true });
        setValue('phone', formData.phone, { shouldValidate: true });
        setValue('password', formData.password, { shouldValidate: true });
        setValue('repeatPassword', formData.repeatPassword, { shouldValidate: true });
        setValue('acceptTerms', formData.acceptTerms, { shouldValidate: true });
      }, 100);
    }
  }, [currentStep, formData, setValue]);

  // Effect para restaurar datos del formulario paso 3 cuando se regresa
  useEffect(() => {
    if (currentStep === 3 && step3FormData) {
      setTimeout(() => {
        setValueStep3('dni', step3FormData.dni, { shouldValidate: true });
        setValueStep3('brevete', step3FormData.brevete, { shouldValidate: true });
        setValueStep3('soat', step3FormData.soat, { shouldValidate: true });
        setValueStep3('tarjetaPropiedad1', step3FormData.tarjetaPropiedad1, {
          shouldValidate: true,
        });
        setValueStep3('tarjetaPropiedad2', step3FormData.tarjetaPropiedad2, {
          shouldValidate: true,
        });
        setValueStep3('antecedentes', step3FormData.antecedentes, { shouldValidate: true });
        setValueStep3('fotosVehiculo', step3FormData.fotosVehiculo, { shouldValidate: true });
      }, 100);
    }
  }, [currentStep, step3FormData, setValueStep3]);

  // Effect para restaurar datos del formulario paso 4 cuando se regresa
  useEffect(() => {
    if (currentStep === 4 && step4FormData) {
      setTimeout(() => {
        setValueStep4('interviewDate', step4FormData.interviewDate, { shouldValidate: true });
        setValueStep4('interviewTime', step4FormData.interviewTime, { shouldValidate: true });
        setValueStep4('interviewLocation', step4FormData.interviewLocation, {
          shouldValidate: true,
        });
      }, 100);
    }
  }, [currentStep, step4FormData, setValueStep4]);

  const onSubmit = async (data) => {
    if (!isFormValid()) return;

    setIsLoading(true);
    try {
      // Guardar todos los datos del formulario para persistencia
      setFormData(data);

      // Convertir datos a inglés para el backend
      const fullPhoneNumber = `${data.countryCode}${data.phone}`;
      const userData = {
        phone: fullPhoneNumber,
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

  // Función para manejar el envío del paso 3
  const onSubmitStep3 = async (data) => {
    if (!isStep3FormValid()) return;

    setIsLoading(true);
    try {
      // Guardar datos del paso 3
      setStep3FormData(data);

      console.log('Datos del paso 3:', data);

      // Por ahora solo avanzamos al paso 4
      setCurrentStep(4);

      setAlertMessage('Datos guardados correctamente');
      setAlertSeverity('success');
      setOpen(true);
    } catch (error) {
      console.error('Error en el paso 3:', error);
      setAlertMessage('Error al guardar los datos. Intenta nuevamente.');
      setAlertSeverity('error');
      setOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar el envío del paso 4
  const onSubmitStep4 = async (data) => {
    if (!isStep4FormValid()) return;

    setIsLoading(true);
    try {
      // Guardar datos del paso 4
      setStep4FormData(data);

      // Console.log completo con todos los datos del formulario
      console.log('🎯 === RESUMEN COMPLETO DEL FORMULARIO === 🎯');
      console.log('📱 PASO 1 - REGISTRO BÁSICO:', step1Data);
      console.log('📋 PASO 3 - DOCUMENTOS:', step3FormData);
      console.log('📅 PASO 4 - ENTREVISTA:', data);
      console.log('🔑 TOKEN DATA:', tokenData);
      console.log('📅 Verificación datos entrevista:', {
        interviewDate: data.interviewDate,
        interviewTime: data.interviewTime,
        interviewLocation: data.interviewLocation,
        hasDate: !!data.interviewDate,
        hasTime: !!data.interviewTime,
        hasLocation: !!data.interviewLocation,
      });

      // Llamar al backend para completar el registro
      const result = await completeRegistration(
        {
          phone: step1Data?.phone || 'N/A',
          password: step1Data?.password || 'N/A',
          acceptTerms: step1Data?.acceptTerms || false,
        },
        uploadedFiles, // Usar los archivos reales en lugar de los nombres
        {
          nombres: tokenData?.nombres || 'N/A',
          apellidos: tokenData?.apellidos || 'N/A',
          email: tokenData?.email || 'N/A',
        },
        data, // Pasar los datos de la entrevista del paso 4
        token,
      );

      if (result.success) {
        console.log('✅ Registro completado exitosamente:', result);
        setAlertMessage('¡Registro completado exitosamente!');
        setAlertSeverity('success');
        setOpen(true);

        // Marcar como completado para mostrar la pantalla de confirmación
        setRegistrationCompleted(true);
      } else {
        console.error('❌ Error en el backend:', result.message);
        setAlertMessage(result.message || 'Error al completar el registro. Intenta nuevamente.');
        setAlertSeverity('error');
        setOpen(true);
      }
    } catch (error) {
      console.error('Error en el paso 4:', error);
      setAlertMessage('Error al completar el registro. Intenta nuevamente.');
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
                onVerificationSuccess={handleVerificationSuccess}
                onBack={handleBackToStep1}
              />
            ) : currentStep === 3 ? (
              <Step3Component
                onSubmit={handleSubmitStep3(onSubmitStep3)}
                onBack={handleBackToStep2}
                register={registerStep3}
                errors={errorsStep3}
                isFormValid={isStep3FormValid}
                isLoading={isLoading}
                watchedFields={watchedStep3Fields}
                setValueStep3={setValueStep3}
                onFilesReady={handleFilesReady}
              />
            ) : currentStep === 4 ? (
              registrationCompleted ? (
                // Pantalla de confirmación
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: { xs: 3, sm: 3, md: 5 },
                    minHeight: '400px',
                  }}
                >
                  {/* Título principal */}
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'white',
                      fontSize: { xs: '24px', sm: '28px', md: '35px' },
                      fontWeight: 800,
                      mb: { xs: 3, md: 4 },
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    ¡Bienvenido a Smart Bonos!
                  </Typography>

                  {/* Card de confirmación */}
                  <Box
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      p: { xs: 4, md: 5 },
                      maxWidth: '500px',
                      width: '100%',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {/* Icono de check verde */}
                    <Box
                      sx={{
                        width: { xs: '60px', md: '80px' },
                        height: { xs: '60px', md: '80px' },
                        backgroundColor: '#4CAF50',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 3,
                        boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
                      }}
                    >
                      <CheckCircle
                        sx={{
                          color: 'white',
                          fontSize: { xs: '32px', md: '40px' },
                        }}
                      />
                    </Box>

                    {/* Mensaje de confirmación */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#333',
                        fontSize: { xs: '14px', md: '16px' },
                        lineHeight: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      Has finalizado el proceso de registro, recibirás un correo confirmando la
                      fecha y hora de tu entrevista con lo necesario. Bienvenido
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Step4Component
                  onSubmit={handleSubmitStep4(onSubmitStep4)}
                  onBack={handleBackToStep3}
                  register={registerStep4}
                  errors={errorsStep4}
                  isFormValid={isStep4FormValid}
                  isLoading={isLoading}
                  watchedFields={watchedStep4Fields}
                  setValue={setValueStep4}
                  tokenData={tokenData}
                  step1Data={step1Data}
                  step3FormData={step3FormData}
                />
              )
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

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CompletarDatos;
