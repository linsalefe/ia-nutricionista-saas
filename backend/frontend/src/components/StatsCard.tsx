// src/components/StatsCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
}

export default function StatsCard({
  icon,
  label,
  value,
  highlight = false,
}: StatsCardProps) {
  const theme = useTheme();
  return (
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        elevation={highlight ? 8 : 2}
        sx={{
          borderRadius: 3,
          bgcolor: highlight ? theme.palette.secondary.main : theme.palette.grey[50],
          color: highlight ? theme.palette.secondary.contrastText : theme.palette.text.primary,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: highlight ? theme.palette.secondary.main : theme.palette.primary.light,
            borderRadius: '50%',
            p: 1.5,
            display: 'inline-flex',
            boxShadow: theme.shadows[2],
          }}
        >
          {icon}
        </Box>
        <CardContent sx={{ pt: 4, textAlign: 'center' }}>
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}
