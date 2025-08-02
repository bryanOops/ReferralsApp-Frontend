import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import ReferralBreadcrumb from 'src/components/apps/referral/ReferralBreadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import TicketListing from 'src/components/apps/tickets/TicketListing';
import ReferralTicketListing from 'src/components/apps/referral/ReferralTicketListing';
import ReferralRefillListing from 'src/components/apps/referral/ReferralRefillListing';
import CommissionsRefillListing from 'src/components/apps/referral/CommissionsRefillListing';
import Grid from '@mui/material/Grid2';
import TopCards from 'src/components/dashboards/modern/TopCards';
import TopCardsRefills from 'src/components/apps/referral/TopCardsRefills';
import TopCardsCommissions from 'src/components/apps/referral/TopCardsCommissions';
import ComplexCard from 'src/components/widgets/cards/ComplexCard';
import MusicCard from 'src/components/widgets/cards/MusicCard';
import EcommerceCard from 'src/components/widgets/cards/EcommerceCard';
import FollowerCard from 'src/components/widgets/cards/FollowerCard';
import FriendCard from 'src/components/widgets/cards/FriendCard';
import ProfileCard from 'src/components/widgets/cards/ProfileCard';
import Settings from 'src/components/widgets/cards/Settings';
import TicketFilter from 'src/components/apps/tickets/TicketFilter';
import CommissionsTicket from 'src/components/apps/referral/CommissionsTicket';
import ChildCard from 'src/components/shared/ChildCard';
import { CommissionsProvider } from 'src/context/CommissionsContext';
import EarningCodeBanner from 'src/components/apps/referral/EarningCodeBanner';
import GiftCard from 'src/components/widgets/cards/GiftCard';
import PaymentGateways from 'src/components/dashboards/ecommerce/PaymentGateways';
import UpcomingActivity from 'src/components/widgets/cards/UpcomingActivity';
import RecentTransactions from 'src/components/dashboards/ecommerce/RecentTransactions';

const BCrumb = [
  {
    to: '/',
    title: 'Inicio',
  },
  {
    title: 'Comisiones',
  },
];

const Commissions = () => {
  return (
    <CommissionsProvider>
      <PageContainer title="Comisiones" description="Comisiones">
        <ReferralBreadcrumb title="Comisiones" items={BCrumb} alternativeColor="#7C8FAC" />
        <Grid container spacing={3} mb={3}>
          <Grid size={12}>
            <TopCardsCommissions />
          </Grid>
        </Grid>
        <ChildCard>
          <CommissionsRefillListing />
        </ChildCard>
      </PageContainer>
    </CommissionsProvider>
  );
};

export default Commissions;
