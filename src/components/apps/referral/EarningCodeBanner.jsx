import React, { useState } from 'react';
import {
  Box,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography,
  LinearProgress,
  Fab,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import SavingsImg from '../../../assets/images/backgrounds/piggy.png';
import DashboardCard from '../../shared/DashboardCard';

import iconEarnings from '../../../assets/images/svgs/earning-code.svg';
import iconCopyMyCode from '../../../assets/images/svgs/earning-copy-my-code.svg';
import {
  IconCopy,
  IconShare,
  IconCheck,
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconBrandFacebook,
} from '@tabler/icons-react';
import { useReferralStats } from '../../../hooks/useReferralStats';

const EarningCodeBanner = () => {
  const theme = useTheme();
  const secondarylight = theme.palette.secondary.light;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;
  const borderColor = theme.palette.grey[100];
  const value = 65;

  // Usar datos reales de referidos
  const { referralCode, totalReferrals, loading } = useReferralStats();

  const [copied, setCopied] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);

  const handleCopyCode = async () => {
    if (referralCode) {
      try {
        await navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copiando código:', error);
      }
    }
  };

  const handleShareClick = (event) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleShare = (platform) => {
    const text = `¡Únete a SONRISAS usando mi código de referido: ${referralCode}! Tu taxi de confianza.`;
    const url = window.location.origin; // URL de la aplicación

    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
          text,
        )}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url,
        )}&quote=${encodeURIComponent(text)}`;
        break;

      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    handleShareClose();
  };

  return (
    <Paper
      sx={{
        bgcolor: 'primary.main',
        border: `1px solid ${borderColor}`,
        borderRadius: '7px 7px 0 0',
      }}
      variant="outlined"
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '0px 20px',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Grid
            container
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: { xs: 2, sm: 2, md: 0 },
            }}
          >
            <Grid size={{ xs: 12, sm: 5, md: 3 }}>
              <DashboardCard
                sx={{
                  with: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '15px 0px 0px 0px !important',
                  '&:last-child': {
                    paddingBottom: '22px !important',
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0px',

                    '&:last-child': {
                      paddingBottom: '0px !important',
                    },
                  }}
                >
                  <img src={iconEarnings} alt={iconEarnings} width="35" />

                  <Box ml={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="h7"
                      whiteSpace="nowrap"
                      sx={{ color: 'text.primary', fontWeight: '700' }}
                    >
                      Ganancias
                    </Typography>
                    <Typography variant="h8" fontWeight="600" mt={0.2} sx={{ color: '#7C8FAC' }}>
                      S/ 180.00 este mes
                    </Typography>
                  </Box>
                </CardContent>
              </DashboardCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 5, md: 3 }}>
              <DashboardCard
                sx={{
                  with: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '15px 22px 0px 15px !important',
                  '&:last-child': {
                    paddingBottom: '22px !important',
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0px',

                    '&:last-child': {
                      paddingBottom: '0px !important',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img src={iconCopyMyCode} alt={iconCopyMyCode} width="25" />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'center', sm: 'center', md: 'flex-start' },
                      }}
                    >
                      <Typography
                        variant="h7"
                        whiteSpace="nowrap"
                        sx={{ color: 'text.primary', fontWeight: '700' }}
                      >
                        Mi código
                      </Typography>
                      <Typography variant="h8" fontWeight="600" mt={0.2} sx={{ color: '#7C8FAC' }}>
                        {loading ? 'Cargando...' : referralCode || 'No disponible'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      ml: { xs: 0, sm: 0, md: 0, lg: 3 },
                    }}
                  >
                    <Tooltip title={copied ? '¡Copiado!' : 'Copiar código'}>
                      <IconButton
                        onClick={handleCopyCode}
                        disabled={!referralCode}
                        size="small"
                        sx={{ color: copied ? 'success.main' : 'inherit' }}
                      >
                        {copied ? <IconCheck size={20} /> : <IconCopy size={20} />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Compartir código">
                      <IconButton onClick={handleShareClick} disabled={!referralCode} size="small">
                        <IconShare size={20} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </DashboardCard>
            </Grid>
          </Grid>
        </Box>
      </CardContent>

      {/* Menú de compartir */}
      <Menu
        anchorEl={shareAnchorEl}
        open={Boolean(shareAnchorEl)}
        onClose={handleShareClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleShare('whatsapp')}>
          <ListItemIcon>
            <IconBrandWhatsapp size={20} color="#25D366" />
          </ListItemIcon>
          <ListItemText>WhatsApp</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleShare('telegram')}>
          <ListItemIcon>
            <IconBrandTelegram size={20} color="#0088cc" />
          </ListItemIcon>
          <ListItemText>Telegram</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleShare('facebook')}>
          <ListItemIcon>
            <IconBrandFacebook size={20} color="#1877f2" />
          </ListItemIcon>
          <ListItemText>Facebook</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default EarningCodeBanner;
