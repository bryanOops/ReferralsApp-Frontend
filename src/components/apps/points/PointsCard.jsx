import React from 'react';
import { Box, Typography } from '@mui/material';
import giftPointsIcon from '../../../assets/images/svgs/gift-points-icon.svg';
import coinPointsIcon from '../../../assets/images/svgs/coin-points-icon.svg';

const PointsCard = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        borderRadius: 3,
        p: 0,
        mb: 4,
        px: { xs: 2, sm: 5 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: { xs: 'center', md: 'space-between' },
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 280, md: 150 },
        boxShadow: '0 4px 20px rgba(93, 135, 255, 0.3)',
      }}
    >
      {/* Lado izquierdo con gift icon */}
      <Box
        sx={{
          width: { xs: 120, sm: 160, md: 140 },
          height: { xs: 120, sm: 160, md: 140 },
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={giftPointsIcon}
          alt="Gift Points"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'drop-shadow(0 6px 16px rgba(255, 255, 255, 0.4))',
          }}
        />
      </Box>

      {/* Centro con texto */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'center' },
          justifyContent: 'center',
          textAlign: { xs: 'center', md: 'center' },
          px: { xs: 1, sm: 2, md: 0 },
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          mb={1.5}
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.45rem' },
            lineHeight: 1.2,
          }}
        >
          Tus Puntos Disponibles
        </Typography>
        <Typography
          variant="h1"
          fontWeight={700}
          mb={1.5}
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '3.0rem' },
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          15,850
        </Typography>
        <Typography
          variant="body1"
          sx={{
            opacity: 0.95,
            fontSize: { xs: '0.875rem', sm: '1rem', md: '0.8rem' },
            fontWeight: 500,
          }}
        >
          Equivale a S/158.50 en productos
        </Typography>
      </Box>

      {/* Lado derecho con coin icon */}
      <Box
        sx={{
          width: { xs: 160, md: 150 },
          height: { xs: 160, md: 150 },
          flexShrink: 0,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={coinPointsIcon}
          alt="Coin Points"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'drop-shadow(0 6px 16px rgba(255, 255, 255, 0.4))',
          }}
        />
      </Box>

      {/* Efectos de fondo decorativos */}
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -40,
          left: -40,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default PointsCard;
