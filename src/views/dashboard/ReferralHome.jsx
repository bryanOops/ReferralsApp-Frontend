import React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';

import PageContainer from 'src/components/container/PageContainer';

import WeeklyStats from 'src/components/dashboards/modern/WeeklyStats';
import YearlySales from 'src/components/dashboards/ecommerce/YearlySales';
import PaymentGateways from 'src/components/dashboards/ecommerce/PaymentGateways';
import WelcomeCard from 'src/components/dashboards/referralHome/WelcomeCard';
import Expence from 'src/components/dashboards/ecommerce/Expence';
import Commisions from 'src/components/dashboards/referralHome/Commisions';
import Growth from 'src/components/dashboards/ecommerce/Growth';
import RevenueUpdates from 'src/components/dashboards/ecommerce/RevenueUpdates';
import SalesOverview from 'src/components/dashboards/ecommerce/SalesOverview';
import SalesTwo from 'src/components/dashboards/ecommerce/SalesTwo';
import Sales from 'src/components/dashboards/ecommerce/Sales';
import MonthlyEarnings from 'src/components/dashboards/ecommerce/MonthlyEarnings';
import ProductPerformances from 'src/components/dashboards/ecommerce/ProductPerformances';
import RecentTransactions from 'src/components/dashboards/ecommerce/RecentTransactions';
import LastPayment from '../../components/dashboards/referralHome/LastPayment';
import MyReferrals from 'src/components/dashboards/referralHome/MyReferrals';
import YearlyComissions from 'src/components/dashboards/referralHome/YearlyComissions';
import { useContext } from 'react';

import { CustomizerContext } from 'src/context/CustomizerContext';
import { TicketProvider } from 'src/context/TicketContext';

const ReferralHome = () => {
  return (
    <TicketProvider>
      <PageContainer title="eCommerce Dashboard" description="this is eCommerce Dashboard page">
        <Box sx={{ pb: '0px !important' }}>
          <Grid container spacing={3}>
            {/* column */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <WelcomeCard />
            </Grid>

            {/* column */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Grid spacing={3} container columns={{ xs: 12, sm: 6 }}>
                <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                  <Commisions />
                </Grid>
                <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                  <LastPayment />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, lg: 4 }}>
              <MyReferrals />
            </Grid>
            <Grid size={{ xs: 12, sm: 8, lg: 8 }}>
              <YearlyComissions />
            </Grid>
          </Grid>
        </Box>
      </PageContainer>
    </TicketProvider>
  );
};

export default ReferralHome;
