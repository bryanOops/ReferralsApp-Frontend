import React, { useState } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { Grid, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { IconCircle } from '@tabler/icons-react';
import { NavLink } from 'react-router';
import {
  PointsCard,
  PointsTabs,
  ConversionContent,
  StoreContent,
} from 'src/components/apps/points';

const BCrumb = [
  {
    to: '/',
    title: 'Inicio',
  },
  {
    title: 'Puntos y Canjes',
  },
];

// Custom Breadcrumb para Puntos y Canjes
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

const PointsAndExchanges = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <PageContainer title="Puntos y Canjes" description="Sistema de puntos y canjes">
      <CustomBreadcrumb title="Puntos y Canjes" items={BCrumb} />

      {/* Tarjeta de puntos disponibles */}
      <PointsCard />

      {/* Tabs de navegación */}
      <PointsTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Contenido según tab seleccionado */}
      <Box>
        {activeTab === 0 && <ConversionContent />}
        {activeTab === 1 && <StoreContent />}
        {activeTab === 2 && (
          <Box p={3}>
            <Typography variant="h6" color="text.secondary">
              Contenido de Vales - Próximamente
            </Typography>
          </Box>
        )}
        {activeTab === 3 && (
          <Box p={3}>
            <Typography variant="h6" color="text.secondary">
              Contenido de Historial - Próximamente
            </Typography>
          </Box>
        )}
        {activeTab === 4 && (
          <Box p={3}>
            <Typography variant="h6" color="text.secondary">
              Contenido de Info RUC - Próximamente
            </Typography>
          </Box>
        )}
      </Box>
    </PageContainer>
  );
};

export default PointsAndExchanges;
