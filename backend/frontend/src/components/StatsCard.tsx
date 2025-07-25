// src/components/StatsCard.tsx
import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export default function StatsCard({ icon, label, value }: StatsCardProps) {
  return (
    <Card elevation={2}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Box
          sx={{
            bgcolor: 'primary.light',
            color: 'primary.main',
            p: 1.5,
            borderRadius: '50%',
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
