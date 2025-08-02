import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { FacturacionProvider } from 'src/context/FacturacionContext/index';
import FacturacionEdit from 'src/components/apps/facturacion/Edit-facturacion/index';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Facturación Edit',
  },
];

const FacturacionEditPage = () => {
  return (
    <FacturacionProvider>
      <PageContainer title="Facturación Edit" description="this is Facturación Edit">
        <Breadcrumb title="Facturación Edit" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <FacturacionEdit />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </FacturacionProvider>
  );
};
export default FacturacionEditPage;
