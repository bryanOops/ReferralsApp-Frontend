import React from 'react';
import { Box, CardContent, Typography, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';

import icon1 from '../../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import icon3 from '../../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../../assets/images/svgs/icon-favorites.svg';
import icon6 from '../../../assets/images/svgs/icon-speech-bubble.svg';
import bagIcon from '../../../assets/images/svgs/bagIcon.svg';
import refillPayIcon from '../../../assets/images/svgs/refillPayIcon.svg';

const topcards = [
  {
    icon: bagIcon,
    title: 'Saldo actual',
    digits: 'S/ 45.50',
    bgcolor: 'success',
    lgsize: 4,
    showRefill: false,
    variantValue: 'h4',
    sizeIcon: '50',
    py: 4, // Igualo con el card blanco
    forcePaddingBottom: '32px', // Ajusto proporcionalmente
    forceBgColor: 'success',
    borderStyle: 'none',
  },
  {
    icon: refillPayIcon,
    title: 'Recarga Ya',
    digits: 'Recarga súper rápida y segura',
    bgcolor: 'info',
    lgsize: 8,
    showRefill: true,
    variantValue: 'h7',
    sizeIcon: '120',
    py: 4, // Igualo con el card verde
    forcePaddingBottom: '32px', // Igualo proporcionalmente
    forceBgColor: 'white',
    borderStyle: '1px solid #EAEFF4',
  },
];

const TopCards = () => {
  return (
    <Grid container spacing={3}>
      {topcards.map((topcard, i) => (
        <Grid size={{ xs: 12, sm: 12, lg: topcard.lgsize }} key={i}>
          <Box
            bgcolor={topcard.forceBgColor + '.light'}
            sx={{
              border: topcard.borderStyle,
              borderRadius: 1,
              height: { xs: topcard.showRefill ? '200px' : '140px', sm: '160px' }, // Más altura en mobile para card recarga
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent
              sx={{
                pt: topcard.py,
                pb: topcard.py,
                flex: 1, // Ocupa todo el espacio disponible
                display: 'flex',
                flexDirection: 'column',
                '&:last-child': {
                  paddingBottom: topcard.forcePaddingBottom,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1, // Usa todo el espacio disponible
                  px: 4,
                }}
              >
                {/* Renderizado condicional según el tipo de card */}
                {topcard.showRefill ? (
                  // Card de Recarga (como en Figma)
                  <>
                    {/* Contenido de recarga a la izquierda */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        flex: 1,
                      }}
                    >
                      <Typography
                        color="primary.main" // Azul #5D87FF
                        variant="h5"
                        fontWeight={600}
                        sx={{ mb: 0.5 }}
                      >
                        {topcard.title}
                      </Typography>
                      <Typography
                        color="grey.400" // Gris #7C8FAC
                        variant="body2"
                        sx={{ mb: 2 }}
                      >
                        {topcard.digits}
                      </Typography>

                      {/* Input y botón como en Figma - Responsive */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' }, // Vertical en mobile, horizontal en desktop
                          gap: { xs: 1.5, sm: 1 }, // Más gap en mobile
                          width: '100%',
                          maxWidth: '400px',
                        }}
                      >
                        <TextField
                          placeholder="Importe de la recarga"
                          size="small"
                          sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <Typography color="primary.main" variant="body2" fontWeight={600}>
                                PEN
                              </Typography>
                            ),
                          }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            borderRadius: 1,
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            width: { xs: '100%', sm: 'auto' }, // Ancho completo en mobile, auto en desktop
                          }}
                        >
                          Continuar
                        </Button>
                      </Box>
                    </Box>

                    {/* Ícono a la derecha - Oculto en mobile para card de recarga */}
                    <Box
                      sx={{
                        display: { xs: 'none', sm: 'block' },
                        transform: 'scale(1.2)', // Hace la imagen 20% más grande
                        transformOrigin: 'center', // Escala desde el centro
                      }}
                    >
                      <img src={topcard.icon} alt={topcard.icon} width={topcard.sizeIcon} />
                    </Box>
                  </>
                ) : (
                  // Card normal (Saldo actual)
                  <>
                    {/* Texto a la izquierda */}
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                    >
                      <Typography
                        color={topcard.bgcolor + '.main'}
                        variant="h5"
                        fontWeight={600}
                        sx={{ mb: 0.5 }}
                      >
                        {topcard.title}
                      </Typography>
                      <Typography
                        color={topcard.bgcolor + '.main'}
                        variant={topcard.variantValue}
                        fontWeight={600}
                      >
                        {topcard.digits}
                      </Typography>
                    </Box>

                    {/* Ícono a la derecha - Siempre visible para card normal */}
                    <Box>
                      <img src={topcard.icon} alt={topcard.icon} width={topcard.sizeIcon} />
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
