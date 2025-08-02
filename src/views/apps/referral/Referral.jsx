import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import ReferralBreadcrumb from 'src/components/apps/referral/ReferralBreadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import TicketListing from 'src/components/apps/tickets/TicketListing';
import ReferralTicketListing from 'src/components/apps/referral/ReferralTicketListing';

import TicketFilter from 'src/components/apps/tickets/TicketFilter';
import ReferralTicket from 'src/components/apps/referral/ReferralTickets';
import ChildCard from 'src/components/shared/ChildCard';
import { TicketProvider } from 'src/context/TicketContext';
import EarningCodeBanner from 'src/components/apps/referral/EarningCodeBanner';

const BCrumb = [
  {
    to: '/',
    title: 'Inicio',
  },
  {
    title: 'Referidos',
  },
];

const Referral = () => {
  return (
    <TicketProvider>
      <PageContainer title="Referidos" description="Referidos">
        <ReferralBreadcrumb title="Referidos" items={BCrumb} alternativeColor="#7C8FAC" />
        <EarningCodeBanner />
        <ChildCard>
          <ReferralTicket />
          <ReferralTicketListing />
        </ChildCard>
      </PageContainer>
    </TicketProvider>
  );
};

export default Referral;
