import React from 'react';
import { Box, Avatar, Typography, Card, CardContent, Divider, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconArrowUpRight } from '@tabler/icons';

import welcomeImg from 'src/assets/images/backgrounds/avatar-welcome-card.svg';
import userImg from 'src/assets/images/profile/user-1.jpg';
import { color } from 'framer-motion';

const WelcomeCard = () => {
  return (
    <Card
      elevation={0}
      sx={{ backgroundColor: (theme) => theme.palette.primary.light, py: 0, position: 'relative' }}
    >
      <CardContent sx={{ py: 4, px: 2 }}>
        <Grid container justifyContent="space-between">
          <Grid size={{ sm: 6 }} display="flex" alignItems="center">
            <Box>
              <Box
                gap="16px"
                mb={3}
                sx={{
                  display: {
                    xs: 'block',
                    sm: 'flex',
                  },
                  alignItems: 'start',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h4" whiteSpace="nowrap">
                  ¡Bienvenido, Eduardo! <br />
                  Consulta tu panel
                </Typography>
                <Typography variant="h7" whiteSpace="nowrap" mt={2} sx={{ color: '#7C8FAC' }}>
                  Este es tu resumen de hoy.¡Gracias por
                  <br />
                  seguir conduciendo con nosotros!
                </Typography>
              </Box>

              <Stack
                mt={2}
                spacing={2}
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
              >
                <Box>
                  <Typography variant="h4" whiteSpace="nowrap">
                    S/ 20.50
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    whiteSpace="nowrap"
                    mt={2}
                    sx={{
                      color: '#7C8FAC',
                      border: '1px solid #fff',
                      backgroundColor: 'white',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      fontWeight: '700',
                    }}
                  >
                    Lunes, 22 de junio de 2025
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Grid size={{ sm: 6 }}>
            <Box
              sx={{
                width: '250px',
                height: '200px',
                position: 'absolute',
                right: '70px',
                bottom: '48px',
                marginTop: '20px',
              }}
            >
              <img src={welcomeImg} alt={welcomeImg} width={'230px'} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
