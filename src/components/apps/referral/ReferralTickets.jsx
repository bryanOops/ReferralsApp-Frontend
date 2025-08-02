import { Box, Grid2 as Grid, Typography, styled } from '@mui/material';
import { useContext } from 'react';
import { TicketContext } from 'src/context/TicketContext';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import iconPassenger from '../../../assets/images/svgs/icon-user-passenger.svg';
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
  const { tickets, setFilter } = useContext(TicketContext);
  const pendingC = tickets.filter((t) => t.Status === 'Pending').length;
  const openC = tickets.filter((t) => t.Status === 'Open').length;
  const closeC = tickets.filter((t) => t.Status === 'Closed').length;
  const driversC = tickets.filter((t) => t.Type === 'Conductor').length;
  const passengersC = tickets.filter((t) => t.Type === 'Pasajero').length;

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
          onClick={() => setFilter('total_tickets')}
          sx={{ backgroundColor: 'warning.light', color: 'warning.main' }}
        >
          <Typography variant="h6">Total de referidos</Typography>
          <Typography variant="h3">{tickets.length}</Typography>
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
          onClick={() => setFilter('Conductor')}
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
            <Typography variant="h3">{driversC}</Typography>
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
          onClick={() => setFilter('Pasajero')}
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
              {passengersC}
            </Typography>
          </Box>
        </BoxStyled>
      </Grid>
    </Grid>
  );
};

export default ReferralTickets;
