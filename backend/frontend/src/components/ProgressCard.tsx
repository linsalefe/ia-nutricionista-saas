// src/components/ProgressCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';

interface ProgressCardProps {
  initialWeight?: number | null;
  currentWeight?: number | null;
  weightLost?: number | null;
  bmi?: number | null;
}

export default function ProgressCard({
  initialWeight,
  currentWeight,
  weightLost,
  bmi,
}: ProgressCardProps) {
  // se vier null ou undefined, cai em 0
  const init   = initialWeight  ?? 0;
  const curr   = currentWeight  ?? 0;
  const lost   = weightLost     ?? 0;
  const index  = bmi            ?? 0;

  const progress = init
    ? Math.min(Math.max(((init - curr) / init) * 100, 0), 100)
    : 0;

  return (
    <Card elevation={2} sx={{ minHeight: 350, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Progresso</Typography>

        <Box position="relative" display="inline-flex" mt={2}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={140}
            thickness={5}
            sx={{ color: 'secondary.main', opacity: 0.3 }}
          />
          <CircularProgress
            variant="determinate"
            value={progress}
            size={140}
            thickness={5}
            sx={{ color: 'secondary.main', position: 'absolute', left: 0 }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Typography variant="h4" fontWeight={700} color="secondary.main">
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" mt={2}>
          {lost.toFixed(1)} kg perdidos
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          IMC: {index.toFixed(1)}
        </Typography>
      </CardContent>
    </Card>
  );
}
