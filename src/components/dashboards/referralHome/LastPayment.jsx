import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab, CardContent, Box, useMediaQuery } from '@mui/material';
import { IconArrowDownRight, IconCurrencyDollar } from '@tabler/icons';

import DashboardCard from '../../shared/DashboardCard';

const LastPayment = () => {
  // chart color
  const theme = useTheme();

  return (
    <DashboardCard sx={{ padding: '0px !important', margin: '0px !important' }}>
      <CardContent
        sx={{
          padding: '20px 24px !important',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'left',
        }}
      >
        <Box>
          <Fab
            color="secondary"
            sx={{
              width: 56,
              height: 56,
              minHeight: 'unset',
              minWidth: 'unset',
              padding: 0,
              borderRadius: '50%',
              boxShadow: 'none',
            }}
          >
            <IconCurrencyDollar size={24} />
          </Fab>
        </Box>

        <Box ml={4}>
          <Typography variant="h7" whiteSpace="nowrap" sx={{ color: '#7C8FAC' }}>
            Último pago recibido
          </Typography>
          <Typography variant="h4" fontWeight="700" mt={0.2}>
            S/ 180.00 - 23 Jun
          </Typography>
        </Box>
      </CardContent>
    </DashboardCard>
  );
};

export default LastPayment;
