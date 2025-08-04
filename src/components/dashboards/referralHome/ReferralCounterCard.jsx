import React from 'react';
import { Box, CardContent, Typography, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';

const ReferralCounterCard = ({
  icon,
  title,
  count,
  loading = false,
  color = 'primary',
  height = '170px',
}) => {
  return (
    <Box
      bgcolor={`${color}.light`}
      textAlign="center"
      sx={{
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent
        sx={{
          height,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {loading ? (
          <>
            <Skeleton variant="circular" width={50} height={50} />
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={32} />
          </>
        ) : (
          <>
            <img src={icon} alt={title} width="50" />
            <Typography color={`${color}.main`} variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
              {title}
            </Typography>
            <Typography color={`${color}.main`} variant="h4" fontWeight={600}>
              {count}
            </Typography>
          </>
        )}
      </CardContent>
    </Box>
  );
};

ReferralCounterCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
  height: PropTypes.string,
};

export default ReferralCounterCard;
