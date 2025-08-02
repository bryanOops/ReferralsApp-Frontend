import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { FacturacionProvider } from 'src/context/FacturacionContext/index';
import FacturacionDetail from 'src/components/apps/facturacion/Facturacion-detail/index';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent, Box, Stack } from '@mui/material';
import { IconDownload, IconPrinter, IconShare } from '@tabler/icons-react';

const BCrumb = [
  {
    to: '/',
    title: 'Inicio',
  },
  {
    title: 'Detalles de Facturación',
  },
];

const FacturacionDetailPage = () => {
  return (
    <FacturacionProvider>
      <PageContainer title="Facturación" description="this is Facturación">
        <Breadcrumb title="Facturación" items={BCrumb} />

        {/* Íconos de acción - elemento independiente entre breadcrumb y factura */}
        <Box display="flex" justifyContent="flex-start" sx={{ mt: 2, mb: 2 }}>
          <Stack direction="row" spacing={3}>
            <IconDownload size={24} style={{ color: '#666', cursor: 'pointer' }} />
            <IconPrinter size={24} style={{ color: '#666', cursor: 'pointer' }} />
            <IconShare size={24} style={{ color: '#666', cursor: 'pointer' }} />
          </Stack>
        </Box>

        <BlankCard>
          <CardContent>
            <FacturacionDetail />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </FacturacionProvider>
  );
};
export default FacturacionDetailPage;
