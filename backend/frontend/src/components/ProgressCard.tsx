// src/components/ProgressCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface ProgressCardProps {
  initialWeight?: number | null;
  currentWeight?: number | null;
  weightLost?: number | null;
  bmi?: number | null;
}

export default function ProgressCard({
  initialWeight = 0,
  weightLost = 0,
  bmi = 0,
}: ProgressCardProps) {
  const theme = useTheme();
  const wl = weightLost ?? 0;
  const bmiVal = bmi ?? 0;
  const progress = initialWeight > 0 ? (wl / initialWeight) * 100 : 0;

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          bgcolor: theme.palette.grey[50],
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Progresso
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex', mt: 2 }}>
            <CircularProgress
              variant="determinate"
              value={Math.min(Math.max(progress, 0), 100)}
              size={140}
              thickness={6}
              sx={{ color: theme.palette.success.main }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" fontWeight={700} color={theme.palette.success.main}>
                {`${Math.round(progress)}%`}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color={theme.palette.text.secondary} mt={2}>
            {wl.toFixed(1)} kg perdidos
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            IMC: {bmiVal.toFixed(1)}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}
