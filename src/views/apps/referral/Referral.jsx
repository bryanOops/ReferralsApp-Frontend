import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import ReferralBreadcrumb from 'src/components/apps/referral/ReferralBreadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ReferralTicket from 'src/components/apps/referral/ReferralTickets';
import ReferralsTable from 'src/components/apps/referral/ReferralsTable';
import ChildCard from 'src/components/shared/ChildCard';
import { ReferralsProvider } from 'src/context/ReferralsContext';
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
    <ReferralsProvider>
      <PageContainer title="Referidos" description="Referidos">
        <ReferralBreadcrumb title="Referidos" items={BCrumb} alternativeColor="#7C8FAC" />
        <EarningCodeBanner />
        <ChildCard>
          <ReferralTicket />
          <ReferralsTable />
        </ChildCard>
      </PageContainer>
    </ReferralsProvider>
  );
};

export default Referral;
