import React, { useContext } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box, CardContent } from '@mui/material';
import DashboardCard from '../../shared/DashboardCard';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import iconPassenger from '../../../assets/images/svgs/icon-user-passenger.svg';
import Grid from '@mui/material/Grid2';
import { TicketContext } from 'src/context/TicketContext';

const MyReferrals = () => {
  // Get ticket data from context
  const { tickets } = useContext(TicketContext);

  // Calculate dynamic counts
  const driversCount = tickets.filter((t) => t.Type === 'Conductor' && !t.deleted).length;
  const passengersCount = tickets.filter((t) => t.Type === 'Pasajero' && !t.deleted).length;

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 320,
      offsetX: -20,
      stacked: true,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '20%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    yaxis: {
      min: -5,
      max: 5,
      tickAmount: 4,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: 'Footware',
      data: [2.5, 3.7, 3.2, 2.6, 1.9],
    },
    {
      name: 'Fashionware',
      data: [-2.8, -1.1, -3.0, -1.5, -1.9],
    },
  ];

  return (
    <DashboardCard
      title="Mis Referidos"
      subtitle="Revisa quién se unió con tu código "
      alternativeColor="#7C8FAC"
    >
      <>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
            <Box bgcolor={'primary.light'} textAlign="center">
              <CardContent sx={{ height: '170px', alignItems: 'center', justifyContent: 'center' }}>
                <img src={icon2} alt={icon2} width="50" />
                <Typography color={'primary.main'} mt={1} variant="subtitle1" fontWeight={600}>
                  Conductores
                </Typography>
                <Typography color={'primary.main'} variant="h4" fontWeight={600}>
                  {driversCount}
                </Typography>
              </CardContent>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
            <Box bgcolor={'secondary.light'} textAlign="center">
              <CardContent sx={{ height: '170px', alignItems: 'center', justifyContent: 'center' }}>
                <img src={iconPassenger} alt={iconPassenger} width="50" />
                <Typography color={'secondary.main'} mt={1} variant="subtitle1" fontWeight={600}>
                  Pasajeros
                </Typography>
                <Typography color={'secondary.main'} variant="h4" fontWeight={600}>
                  {passengersCount}
                </Typography>
              </CardContent>
            </Box>
          </Grid>
        </Grid>
      </>
    </DashboardCard>
  );
};

export default MyReferrals;
