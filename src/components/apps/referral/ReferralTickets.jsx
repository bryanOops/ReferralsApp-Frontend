import { Box, Grid2 as Grid, Typography, styled } from '@mui/material';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import iconPassenger from '../../../assets/images/svgs/icon-user-passenger.svg';
import { useReferrals } from '../../../context/ReferralsContext';

const BoxStyled = styled(Box)(() => ({
  padding: '30px',
  transition: '0.1s ease-in',
  cursor: 'pointer',
  color: 'inherit',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

const ReferralTickets = () => {
  // Usar datos reales de referidos desde el contexto
  const { referrals, filterReferrals, loading } = useReferrals();

  // Calcular estadísticas desde los datos reales
  const totalReferrals = referrals.length;
  const driversCount = referrals.filter((ref) => ref.Type === 'Conductor').length;
  const passengersCount = referrals.filter((ref) => ref.Type === 'Pasajero').length;

  return (
    <Grid container spacing={3} textAlign="center">
      <Grid
        size={{
          lg: 4,
          sm: 4,
          xs: 12,
        }}
      >
        <BoxStyled
          onClick={() => filterReferrals('total_referrals')}
          sx={{ backgroundColor: 'warning.light', color: 'warning.main' }}
        >
          <Typography variant="h6">Total de referidos</Typography>
          <Typography variant="h3">{loading ? '...' : totalReferrals}</Typography>
        </BoxStyled>
      </Grid>
      <Grid
        size={{
          lg: 4,
          sm: 4,
          xs: 12,
        }}
      >
        <BoxStyled
          onClick={() => filterReferrals('Conductor')}
          sx={{
            backgroundColor: 'primary.light',
            color: 'primary.main',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <img src={icon2} alt={icon2} width="50" />
          <Box>
            <Typography variant="h6">Conductores</Typography>
            <Typography variant="h3">{loading ? '...' : driversCount}</Typography>
          </Box>
        </BoxStyled>
      </Grid>

      <Grid
        size={{
          lg: 4,
          sm: 4,
          xs: 12,
        }}
      >
        <BoxStyled
          onClick={() => filterReferrals('Pasajero')}
          sx={{
            backgroundColor: 'secondary.light',
            color: 'success.main',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <img src={iconPassenger} alt={iconPassenger} width="50" />
          <Box>
            <Typography color={'secondary.main'} variant="h6">
              Pasajeros
            </Typography>
            <Typography color={'secondary.main'} variant="h3">
              {loading ? '...' : passengersCount}
            </Typography>
          </Box>
        </BoxStyled>
      </Grid>
    </Grid>
  );
};

export default ReferralTickets;
