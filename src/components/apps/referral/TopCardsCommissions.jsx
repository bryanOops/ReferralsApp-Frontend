import React, { useContext } from 'react';
import { Box, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CommissionsContext } from 'src/context/CommissionsContext';

import icon1 from '../../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import icon3 from '../../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../../assets/images/svgs/icon-favorites.svg';
import icon6 from '../../../assets/images/svgs/icon-speech-bubble.svg';

const TopCardsCommissions = () => {
  const { refills } = useContext(CommissionsContext);

  // Calcular estadísticas de comisiones
  const totalCommissions = 'S / 2700';
  const successfulCommissions = 'S/ 1500';
  const failedCommissions = 'S/ 1200';

  const driverCommissions = '15/07/2024';
  const passengerCommissions = refills ? refills.filter((r) => r.Type === 'Pasajero').length : 0;

  const topcards = [
    {
      icon: icon2,
      title: 'Comisiones acumuladas',
      digits: totalCommissions.toString(),
      bgcolor: 'primary',
    },
    {
      icon: icon3,
      title: 'Bonos por servicio',
      digits: successfulCommissions.toString(),
      bgcolor: 'warning',
    },
    {
      icon: icon4,
      title: 'Comisiones por referidos',
      digits: failedCommissions.toString(),
      bgcolor: 'secondary',
    },

    {
      icon: icon6,
      title: 'Próximo pago',
      digits: driverCommissions.toString(),
      bgcolor: 'success',
    },
  ];

  return (
    <Grid container spacing={3}>
      {topcards.map((topcard, i) => (
        <Grid size={{ xs: 12, sm: 3, lg: 3 }} key={i}>
          <Box bgcolor={topcard.bgcolor + '.light'} textAlign="center">
            <CardContent>
              <img src={topcard.icon} alt={topcard.icon} width="50" />
              <Typography
                color={topcard.bgcolor + '.main'}
                mt={1}
                variant="subtitle1"
                fontWeight={600}
              >
                {topcard.title}
              </Typography>
              <Typography color={topcard.bgcolor + '.main'} variant="h4" fontWeight={600}>
                {topcard.digits}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCardsCommissions;
