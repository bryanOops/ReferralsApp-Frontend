import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import rocketPointsIcon from '../../../assets/images/svgs/rocket-points-icon.svg';

const ConversionContent = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Contenedor blanco con borde para Conversión Automática de Saldo */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: '1px solid',
          borderColor: theme.palette.divider,
          borderRadius: '15px',
          padding: '6px',
          boxShadow: theme.shadows[1],
          mb: 3,
          p: 4,
        }}
      >
        {/* Conversión Automática de Saldo */}
        <Box
          sx={{
            backgroundColor: 'secondary.main',
            borderRadius: '12px',
            p: 4,
            textAlign: 'center',
            color: 'white',
            mb: 3,
          }}
        >
          <Typography variant="h3" fontWeight={600} mb={2} color="white">
            Conversión Automática de Saldo
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.6,
              color: 'white',
              fontSize: '1rem',
              fontWeight: 400,
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            Cada S/1.00 = 10 puntos | Sin RUC = Conversión automática ¡Tu saldo se convierte
            automáticamente en puntos!
          </Typography>
        </Box>

        {/* ¿Cómo funciona? - Todo dentro del breadcrumb azul */}
        <Box
          sx={{
            backgroundColor: 'secondary.light',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Header del breadcrumb */}

          {/* Contenido dentro del breadcrumb */}
          <Box sx={{ p: 5 }}>
            <Grid
              container
              spacing={4}
              alignItems="flex-start"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Rocket icon - Columna izquierda */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={rocketPointsIcon} alt="Rocket Points" />
                </Box>
              </Grid>

              {/* Texto explicativo - Columna derecha */}
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Si tienes RUC */}
                  <Box>
                    <Typography variant="h3" fontWeight={600} color="text.primary" mb={3}>
                      <strong>¿Cómo funciona?</strong>
                    </Typography>
                    <Typography variant="h6" fontWeight={600} mb={1} color="text.primary">
                      Si tienes RUC
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 2,
                        p: 3,
                        borderLeft: '4px solid',
                        borderLeftColor: 'secondary.main',
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Se emite comprobante electrónico normal
                      </Typography>
                    </Box>
                  </Box>

                  {/* ¿No tienes RUC? */}
                  <Box>
                    <Typography variant="h6" fontWeight={600} mb={1} color="text.primary">
                      ¿No tienes RUC?
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 2,
                        p: 3,
                        borderLeft: '4px solid',
                        borderLeftColor: 'secondary.main',
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        ¡No te preocupes! Tu monto se convierte automáticamente en puntos.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ConversionContent;
