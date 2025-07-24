import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';

export default function SettingsPage() {
  const [form, setForm] = useState({ nome: '', objetivo: '', username: '' });
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm({ nome: res.data.nome, objetivo: res.data.objetivo, username: res.data.username });
      } catch {
        setSnackbar({ open: true, message: 'Erro ao carregar dados.', severity: 'error' });
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/api/user/me', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({ open: true, message: 'Dados atualizados!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Erro ao atualizar dados.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSenha = async () => {
    if (!senha) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/api/user/password', { password: senha }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({ open: true, message: 'Senha alterada!', severity: 'success' });
      setSenha('');
    } catch {
      setSnackbar({ open: true, message: 'Erro ao alterar senha.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 450, mx: 'auto', mt: 4 }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>Dados do Usuário</Typography>
          <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Nome" name="nome" value={form.nome} onChange={handleChange} fullWidth />
            <TextField label="E-mail" name="username" value={form.username} onChange={handleChange} fullWidth disabled />
            <TextField label="Objetivo" name="objetivo" value={form.objetivo} onChange={handleChange} fullWidth />
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              Salvar Alterações
            </Button>
          </Box>
          <Typography variant="h6" fontWeight={600} sx={{ mt: 3 }}>Alterar Senha</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <TextField label="Nova Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} fullWidth />
            <Button variant="outlined" color="primary" disabled={loading || !senha} onClick={handleSenha}>
              Salvar
            </Button>
          </Box>
        </CardContent>
      </Card>
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
