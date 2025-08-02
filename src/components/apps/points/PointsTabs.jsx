import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

// Botón personalizado para el tab activo - más suave
const ActiveTabButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.8rem',
  padding: '8px 8px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  minHeight: '42px',
  flex: 1,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: 'none',
  transform: 'scale(1)',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    transform: 'scale(1.02)',
  },
  '&:active': {
    transform: 'scale(0.98)',
    transition: 'all 0.1s ease',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '0.95rem',
    padding: '10px 13px',
    minHeight: '48px',
  },
}));

// Texto simple para tabs inactivos - más suave
const InactiveTabText = styled(Typography)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: { xs: '0.8rem', sm: '0.95rem' },
  padding: { xs: '6px 8px', sm: '10px 16px' },
  color: theme.palette.text.secondary,
  minHeight: { xs: '36px', sm: '40px' },
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '6px',
  transform: 'scale(1)',
  '&:hover': {
    color: theme.palette.text.primary,
    transform: 'scale(1.05)',
    backgroundColor: theme.palette.action.hover,
  },
  '&:active': {
    transform: 'scale(0.95)',
    transition: 'all 0.1s ease',
  },
}));

const PointsTabs = ({ activeTab, onTabChange }) => {
  const theme = useTheme();
  const tabs = [
    { label: 'Conversión', value: 0 },
    { label: 'Tienda', value: 1 },
    { label: 'Vales', value: 2 },
    { label: 'Historial', value: 3 },
    { label: 'Info RUC', value: 4 },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Contenedor blanco con borde - más suave */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: '1px solid',
          borderColor: theme.palette.divider,
          borderRadius: '15px',
          padding: { xs: '4px', sm: '6px' },
          boxShadow: theme.shadows[1],
        }}
      >
        <Stack
          direction="row"
          spacing={{ xs: 0.25, sm: 0.5 }}
          sx={{
            px: { xs: 1, sm: 3 },
            py: { xs: 1, sm: 2 },
            width: '100%',
            '& > *': {
              flex: 1,
            },
          }}
        >
          {tabs.map((tab) =>
            activeTab === tab.value ? (
              <ActiveTabButton
                key={tab.value}
                onClick={() => onTabChange(null, tab.value)}
                variant="contained"
              >
                {tab.label}
              </ActiveTabButton>
            ) : (
              <InactiveTabText
                key={tab.value}
                onClick={() => onTabChange(null, tab.value)}
                component="div"
              >
                {tab.label}
              </InactiveTabText>
            ),
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default PointsTabs;
