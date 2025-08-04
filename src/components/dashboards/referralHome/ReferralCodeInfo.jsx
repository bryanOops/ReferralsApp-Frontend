import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ContentCopy, CheckCircle, Cancel } from '@mui/icons-material';
import { useReferralStats } from '../../../hooks/useReferralStats';

const ReferralCodeInfo = () => {
  const { referralCode, isActive, userType, totalReferrals, loading, error } = useReferralStats();

  const [copied, setCopied] = React.useState(false);

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

  if (loading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={20} />
          <Box sx={{ mt: 1 }}>
            <Skeleton variant="rectangular" width="100%" height={40} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error al cargar información del código de referido: {error.message}
      </Alert>
    );
  }

  if (!referralCode) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No se encontró un código de referido asociado a tu cuenta.
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight={600}>
            Tu Código de Referido
          </Typography>
          <Chip
            icon={isActive ? <CheckCircle /> : <Cancel />}
            label={isActive ? 'Activo' : 'Inactivo'}
            color={isActive ? 'success' : 'error'}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Tipo de usuario: {userType || 'No especificado'}
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          <Typography
            variant="h5"
            fontFamily="monospace"
            fontWeight={700}
            color="primary.main"
            sx={{ flexGrow: 1 }}
          >
            {referralCode}
          </Typography>

          <Tooltip title={copied ? '¡Copiado!' : 'Copiar código'}>
            <IconButton
              onClick={handleCopyCode}
              color={copied ? 'success' : 'primary'}
              size="small"
            >
              {copied ? <CheckCircle /> : <ContentCopy />}
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" mt={1}>
          Total de referidos: {totalReferrals}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReferralCodeInfo;
