import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import driver1 from '../../../assets/images/referralRegister/driver1.png';
import driver2 from '../../../assets/images/referralRegister/driver2.png';

// Componente para el indicador de progreso
const ProgressIndicator = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      {[1, 2, 3, 4].map((step, index) => (
        <Box key={step} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: step === 1 ? '#5D87FF' : 'rgba(255, 255, 255, 0.3)',
              color: step === 1 ? 'white' : 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px',
              border: step === 1 ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            {step === 1 ? step : ''}
          </Box>
          {index < 3 && (
            <Box
              sx={{
                width: 40,
                height: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                mx: 1,
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

// Componente para la imagen alternante
const AlternatingImage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [driver1, driver2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0));
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: { xs: 300, sm: 400 },
        backgroundImage: `url(${images[currentImage]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: { xs: '16px 16px 0 0', sm: '16px 0 0 16px' },
        transition: 'background-image 0.5s ease-in-out',
      }}
    />
  );
};

const ReferralRegistrationStep1 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    celular: '',
    password: '',
    repeatPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});

  // Validar si el formulario está completo
  const isFormValid = () => {
    return (
      formData.celular.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.repeatPassword.trim() !== '' &&
      formData.password === formData.repeatPassword &&
      formData.acceptTerms
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    const newErrors = {};

    if (!formData.celular.trim()) {
      newErrors.celular = 'El celular es requerido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.repeatPassword.trim()) {
      newErrors.repeatPassword = 'Repite tu contraseña';
    } else if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Formulario válido:', formData);
      // Aquí irá la lógica para enviar al API
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#2A3547', // Color de fondo del template
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="md" sx={{ p: 0 }}>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: '#5D87FF', // Color primario del template
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            minHeight: { xs: 'auto', sm: 600 },
          }}
        >
          {/* Sección de imagen - Izquierda */}
          <Box
            sx={{
              flex: { xs: 'none', sm: '1' },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <AlternatingImage />
          </Box>

          {/* Sección de formulario - Derecha */}
          <Box
            sx={{
              flex: { xs: 'none', sm: '1' },
              p: { xs: 3, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Logo Smart Bonos */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#5D87FF',
                    fontWeight: 'bold',
                    fontSize: '20px',
                  }}
                >
                  B
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    lineHeight: 1,
                  }}
                >
                  Smart
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    lineHeight: 1,
                  }}
                >
                  Bonos
                </Typography>
              </Box>
            </Box>

            {/* Indicador de progreso */}
            <ProgressIndicator />

            {/* Título principal */}
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '24px', sm: '28px' },
                lineHeight: 1.2,
              }}
            >
              Conduce, regístrate y genera ingresos a tu ritmo.
            </Typography>

            {/* Subtítulo */}
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                mb: 4,
                fontSize: '16px',
                opacity: 0.9,
              }}
            >
              Completa los campos y regístrate
            </Typography>

            {/* Formulario */}
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Celular */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Celular"
                    variant="outlined"
                    value={formData.celular}
                    onChange={(e) => handleInputChange('celular', e.target.value)}
                    error={!!errors.celular}
                    helperText={errors.celular}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#2A3547',
                      },
                      '& .MuiInputBase-input': {
                        color: '#2A3547',
                      },
                    }}
                  />
                </Grid>

                {/* Contraseña */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#2A3547',
                      },
                      '& .MuiInputBase-input': {
                        color: '#2A3547',
                      },
                    }}
                  />
                </Grid>

                {/* Repite Contraseña */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Repite tu Contraseña"
                    type="password"
                    variant="outlined"
                    value={formData.repeatPassword}
                    onChange={(e) => handleInputChange('repeatPassword', e.target.value)}
                    error={!!errors.repeatPassword}
                    helperText={errors.repeatPassword}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#2A3547',
                      },
                      '& .MuiInputBase-input': {
                        color: '#2A3547',
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Checkbox términos y condiciones */}
              <Box sx={{ mt: 3, mb: 4 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: 'white',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: 'white',
                        fontSize: '14px',
                        opacity: 0.9,
                      }}
                    >
                      Acepto los términos y condiciones
                    </Typography>
                  }
                />
                {errors.acceptTerms && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#FA896B',
                      display: 'block',
                      mt: 1,
                    }}
                  >
                    {errors.acceptTerms}
                  </Typography>
                )}
              </Box>

              {/* Botón Empezar */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isFormValid()}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#5D87FF',
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                ¡Empezar!
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ReferralRegistrationStep1;
