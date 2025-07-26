// src/components/ChartCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, ButtonGroup, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface LogItem { date: string; weight: number; }
interface ChartCardProps {
  data: LogItem[];
  activePeriod: string;
  onChangePeriod: (p: string) => void;
}

const periods = [
  { label: '7 dias', value: '7d' },
  { label: '30 dias', value: '30d' },
  { label: '1 ano',  value: '1y' },
];

export default function ChartCard({ data, activePeriod, onChangePeriod }: ChartCardProps) {
  const theme = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          bgcolor: theme.palette.grey[50],
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Evolução de Peso</Typography>
            <ButtonGroup size="small" variant="outlined">
              {periods.map((p) => (
                <Button
                  key={p.value}
                  onClick={() => onChangePeriod(p.value)}
                  color={activePeriod === p.value ? 'primary' : 'inherit'}
                >
                  {p.label}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
          <Box sx={{ height: 300, mt: 1 }}>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    dot={{ r: 4, stroke: theme.palette.primary.dark, fill: theme.palette.primary.main }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  px: 2,
                }}
              >
                Poucos dados para exibir o gráfico.<br />
                Registre mais pesos para acompanhar sua evolução!
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
