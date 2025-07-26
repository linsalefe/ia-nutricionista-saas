// src/pages/DashboardPage.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HeightIcon from '@mui/icons-material/Height';
import FlagIcon from '@mui/icons-material/Flag';
import ScaleIcon from '@mui/icons-material/Scale';

import StatsCard from '../components/StatsCard';
import ChartCard from '../components/ChartCard';
import ProgressCard from '../components/ProgressCard';

interface LogItem {
  date: string;
  weight: number;
}

interface DashboardMetrics {
  objective?: string;
  height_cm?: number;
  initial_weight?: number;
  current_weight?: number;
  weight_lost?: number;
  bmi?: number;
  history: LogItem[];
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [period, setPeriod] = useState<string>('30d');
  const [userName, setUserName] = useState<string>('Usuário');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newWeight, setNewWeight] = useState<string>('');
  const [newHeight, setNewHeight] = useState<string>('');
  const [loadingAction, setLoadingAction] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Extrai nome do usuário do JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.nome || payload.username || 'Usuário');
      } catch {}
    }
  }, []);

  // Busca métricas
  const fetchMetrics = async (p: string) => {
    setLoadingAction(true);
    try {
      const token = localStorage.getItem('token');
      const url = `/api/dashboard/metrics${p ? `?period=${p}` : ''}`;
      const { data } = await axios.get<DashboardMetrics>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };
  useEffect(() => {
    fetchMetrics(period);
  }, [period]);

  // Handlers do modal
  const handleOpenDialog = () => {
    setNewWeight('');
    setNewHeight('');
    setDialogOpen(true);
  };
  const handleCloseDialog = () => setDialogOpen(false);
  const handleConfirm = async () => {
    const weight = parseFloat(newWeight.replace(',', '.'));
    const height = parseFloat(newHeight.replace(',', '.'));
    if (isNaN(weight) || weight <= 0 || isNaN(height) || height <= 0) {
      return;
    }
    setLoadingAction(true);
    try {
      const token = localStorage.getItem('token')!;
      await axios.patch(
        '/api/user',
        { height_cm: height },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await axios.post(
        '/api/weight-logs',
        { weight },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDialogOpen(false);
      fetchMetrics(period);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  // Spinner enquanto carrega métricas
  if (!metrics) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 64px)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const history = metrics.history || [];

  // Cálculo de classificação de IMC
  const bmiValue = metrics.bmi ?? 0;
  const classification =
    bmiValue < 18.5
      ? 'Abaixo do peso'
      : bmiValue < 25
      ? 'Peso normal'
      : bmiValue < 30
      ? 'Sobrepeso'
      : 'Obesidade';

  // Empty state (sem histórico)
  if (history.length === 0 && !loadingAction) {
    return (
      <Box sx={{ px: isMobile ? 2 : 6, py: isMobile ? 3 : 6 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Olá, {userName} 👋
        </Typography>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Box textAlign="center" py={6}>
          <Typography variant="body1" color="text.secondary">
            Você ainda não registrou nenhum peso.
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenDialog}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: '1.1rem',
              bgcolor: 'primary.dark',
              '&:hover': { bgcolor: 'primary.main' },
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            Registrar Peso e Altura
          </Button>
        </Box>

        {/* Modal de registro */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="xs">
          <DialogTitle>Registrar Peso e Altura</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Peso (kg)"
              type="text"
              fullWidth
              variant="outlined"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              helperText="Use ponto ou vírgula"
            />
            <TextField
              margin="dense"
              label="Altura (cm)"
              type="text"
              fullWidth
              variant="outlined"
              value={newHeight}
              onChange={(e) => setNewHeight(e.target.value)}
              helperText="Ex.: 170"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loadingAction}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={loadingAction} variant="contained">
              {loadingAction ? <CircularProgress size={20} /> : 'Ok'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Layout principal
  return (
    <Box sx={{ px: isMobile ? 2 : 6, py: isMobile ? 3 : 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Olá, {userName} 👋
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            bgcolor: 'primary.dark',
            '&:hover': { bgcolor: 'primary.main' },
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          Registrar Peso/Altura
        </Button>
      </Box>

      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<FitnessCenterIcon />}
            label="Objetivo"
            value={metrics.objective || '-'}
            highlight
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard icon={<HeightIcon />} label="Altura" value={`${metrics.height_cm ?? '-'} cm`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard icon={<FlagIcon />} label="Peso Inicial" value={`${metrics.initial_weight ?? '-'} kg`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard icon={<ScaleIcon />} label="Peso Atual" value={`${metrics.current_weight ?? '-'} kg`} />
        </Grid>

        <Grid item xs={12} md={8}>
          <ChartCard data={history} activePeriod={period} onChangePeriod={setPeriod} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProgressCard
            initialWeight={metrics.initial_weight}
            currentWeight={metrics.current_weight}
            weightLost={metrics.weight_lost}
            bmi={metrics.bmi}
          />
          <Typography variant="subtitle1" mt={2} align="center">
            {classification}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
