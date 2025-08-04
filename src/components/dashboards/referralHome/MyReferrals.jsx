import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box, CardContent, Alert } from '@mui/material';
import DashboardCard from '../../shared/DashboardCard';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import iconPassenger from '../../../assets/images/svgs/icon-user-passenger.svg';
import Grid from '@mui/material/Grid2';
import { useReferralCodes } from '../../../context/ReferralCodesContext';
import ReferralCounterCard from './ReferralCounterCard';
import ReferralCodeInfo from './ReferralCodeInfo';
import ReferralStatsSummary from './ReferralStatsSummary';

const MyReferrals = () => {
  const { driversCount, passengersCount, loading, error } = useReferralCodes();

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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error al cargar los datos de referidos: {error.message}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
            <ReferralCounterCard
              icon={icon2}
              title="Conductores"
              count={driversCount}
              loading={loading}
              color="primary"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
            <ReferralCounterCard
              icon={iconPassenger}
              title="Pasajeros"
              count={passengersCount}
              loading={loading}
              color="secondary"
            />
          </Grid>
        </Grid>
      </>
    </DashboardCard>
  );
};

export default MyReferrals;
