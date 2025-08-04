import React from 'react';
import { Box, Typography, Card, CardContent, LinearProgress, Skeleton, Grid } from '@mui/material';
import { useReferralStats } from '../../../hooks/useReferralStats';

const ReferralStatsSummary = () => {
  const {
    driversCount,
    passengersCount,
    totalReferrals,
    driversPercentage,
    passengersPercentage,
    loading,
  } = useReferralStats();

  if (loading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={8} />
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Skeleton variant="text" width="80%" height={20} />
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant="text" width="80%" height={20} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={1}>
          Resumen de Referidos
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Distribución de tus referidos por tipo
        </Typography>

        {/* Barra de progreso total */}
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight={500}>
              Total de referidos
            </Typography>
            <Typography variant="body2" fontWeight={600} color="primary.main">
              {totalReferrals}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        {/* Estadísticas detalladas */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" fontWeight={500}>
                  Conductores
                </Typography>
                <Typography variant="body2" fontWeight={600} color="primary.main">
                  {driversCount} ({driversPercentage}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={driversPercentage}
                color="primary"
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" fontWeight={500}>
                  Pasajeros
                </Typography>
                <Typography variant="body2" fontWeight={600} color="secondary.main">
                  {passengersCount} ({passengersPercentage}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={passengersPercentage}
                color="secondary"
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Información adicional */}
        <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {totalReferrals === 0
              ? 'Aún no tienes referidos. ¡Comparte tu código para empezar!'
              : totalReferrals === 1
              ? '¡Excelente! Ya tienes 1 referido.'
              : `¡Increíble! Ya tienes ${totalReferrals} referidos.`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReferralStatsSummary;
