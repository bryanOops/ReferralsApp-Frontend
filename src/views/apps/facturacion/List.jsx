import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import FacturacionList from 'src/components/apps/facturacion/Facturacion-list/index';
import { FacturacionProvider } from 'src/context/FacturacionContext/index';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent, Grid, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { IconCircle } from '@tabler/icons-react';
import { NavLink } from 'react-router';

const BCrumb = [
  {
    to: '/',
    title: 'Inicio',
  },
  {
    title: 'Lista de Facturación',
  },
];

// Custom Breadcrumb without decorative icon
const CustomBreadcrumb = ({ items, title }) => (
  <Grid
    container
    sx={{
      backgroundColor: 'primary.light',
      borderRadius: (theme) => theme.shape.borderRadius / 4,
      p: '30px 25px 20px',
      marginBottom: '30px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Grid size={{ xs: 12, sm: 12, lg: 12 }} mb={1}>
      <Typography variant="h4">{title}</Typography>
      <Breadcrumbs
        separator={
          <IconCircle
            size="5"
            fill="textSecondary"
            fillOpacity={'0.6'}
            style={{ margin: '0 5px' }}
          />
        }
        sx={{ alignItems: 'center', mt: items ? '10px' : '' }}
        aria-label="breadcrumb"
      >
        {items
          ? items.map((item) => (
              <div key={item.title}>
                {item.to ? (
                  <Link
                    underline="none"
                    sx={{ color: 'textSecondary' }}
                    component={NavLink}
                    to={item.to}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <Typography sx={{ color: 'textSecondary' }}>{item.title}</Typography>
                )}
              </div>
            ))
          : ''}
      </Breadcrumbs>
    </Grid>
  </Grid>
);

const FacturacionListing = () => {
  return (
    <FacturacionProvider>
      <PageContainer title="Facturación" description="this is Facturación">
        <CustomBreadcrumb title="Facturación" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <FacturacionList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </FacturacionProvider>
  );
};
export default FacturacionListing;
