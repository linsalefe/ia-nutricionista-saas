// src/components/ChartCard.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

const periods = [
  { label: '7 dias', value: '7d' },
  { label: '30 dias', value: '30d' },
  { label: '1 ano', value: '1y' },
];

interface LogItem {
  date: string;
  weight: number;
}

interface ChartCardProps {
  data: LogItem[];            // dados iniciais (vêm de props)
  onChangePeriod: (p: string) => void;
  activePeriod: string;
}

export default function ChartCard({
  data,
  onChangePeriod,
  activePeriod,
}: ChartCardProps) {
  return (
    <Card elevation={2} sx={{ minHeight: 350 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Evolução de Peso</Typography>
          <ButtonGroup size="small">
            {periods.map((p) => (
              <Button
                key={p.value}
                variant={activePeriod === p.value ? 'contained' : 'outlined'}
                onClick={() => onChangePeriod(p.value)}
              >
                {p.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        {data.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="body1" color="text.secondary">
              Sem dados para o período selecionado.
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E9F3" />
              <XAxis dataKey="date" tick={{ fill: '#677294' }} />
              <YAxis tick={{ fill: '#677294' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#2AB7CA"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
