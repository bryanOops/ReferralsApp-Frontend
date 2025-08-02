import React from 'react';
import { Box, CardContent, Chip, Paper, Stack, Typography, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SavingsImg from '../../../assets/images/backgrounds/piggy.png';

const sells = [
  {
    product: 'MaterialPro',
    price: '23,568',
    percent: 55,
    color: 'primary',
  },
  {
    product: 'Flexy Admin',
    price: '23,568',
    percent: 20,
    color: 'secondary',
  },
];

const Commisions = () => {
  const theme = useTheme();
  const secondarylight = theme.palette.secondary.light;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;
  const borderColor = theme.palette.grey[100];
  const value = 65;
  return (
    <Paper sx={{ bgcolor: 'primary.main', border: `1px solid ${borderColor}` }} variant="outlined">
      <CardContent>
        <Typography variant="h5" color="white">
          S/ 500
        </Typography>
        <Typography variant="subtitle1" color="white" mb={3}>
          Comisiones acumuladas
        </Typography>

        <Box sx={{ position: 'relative', mt: 3 }}>
          {/* Tooltip personalizado */}
          <Box
            sx={{
              position: 'absolute',
              left: `${value}%`,
              transform: 'translateX(-50%)',
              bottom: '100%', // arriba de la barra
              mb: '8px',
              bgcolor: 'white',
              color: 'primary.main',
              px: 1,
              py: '2px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: 2,
              zIndex: 1,
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid white',
              },
            }}
          >
            {value}%
          </Box>

          {/* Barra de progreso */}
          <LinearProgress
            variant="determinate"
            value={value}
            sx={{
              height: '8px',
              borderRadius: '4px',
              backgroundColor: '#7AA3FE',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white',
              },
            }}
          />
        </Box>
      </CardContent>
    </Paper>
  );
};

export default Commisions;
