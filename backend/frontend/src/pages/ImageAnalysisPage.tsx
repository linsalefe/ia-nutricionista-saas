import { useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useLoading } from '../contexts/LoadingContext';

export default function ImageAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { setLoading } = useLoading();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('http://localhost:8000/api/image/analyze', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data);
      setSnackbar({ open: true, message: 'Imagem analisada com sucesso!', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: 'Erro ao analisar imagem.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Análise Nutricional por Imagem
      </Typography>
      <Paper sx={{ p: 3, mt: 2, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: 16 }}
            disabled={false}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!file}
            sx={{ mb: 2, ml: 2 }}
          >
            Analisar
          </Button>
        </form>
        {result && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Resultado:
            </Typography>
            <Typography>
              {typeof result.analise === "string"
                ? result.analise
                : JSON.stringify(result.analise)}
            </Typography>
          </Box>
        )}
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity as any} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
