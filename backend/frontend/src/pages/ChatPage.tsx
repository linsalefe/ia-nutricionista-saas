import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box, Typography, TextField, Button, Paper, Stack, Snackbar, Alert, IconButton, InputAdornment
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { motion } from 'framer-motion';
import { useLoading } from '../contexts/LoadingContext';

interface Mensagem {
  role: 'user' | 'bot';
  text: string;
  type?: 'text' | 'image';
  imageUrl?: string; // para imagens locais, frontend
  created_at?: string;
}

export default function ChatPage() {
  const [mensagem, setMensagem] = useState('');
  const [historico, setHistorico] = useState<Mensagem[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imgLoading, setImgLoading] = useState(false);
  const { setLoading } = useLoading();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Carrega o histórico do backend ao abrir a página
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/chat/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistorico(res.data);
      } catch (err) {
        setSnackbar({ open: true, message: 'Erro ao carregar histórico.', severity: 'error' });
      }
    };
    fetchHistory();
  }, []);

  // Salva uma mensagem (user ou bot) no backend
  async function saveMessage(msg: Omit<Mensagem, 'imageUrl'>) {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/chat/save', msg, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // não bloqueia fluxo se der erro
    }
  }

  // Enviar texto
  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) return;
    const userMsg = {
      role: 'user',
      text: mensagem,
      type: 'text',
      created_at: new Date().toISOString()
    };
    setHistorico(h => [...h, userMsg]);
    saveMessage(userMsg); // salva no backend
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:8000/api/chat/send',
        { message: mensagem },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const botMsg = {
        role: 'bot',
        text: res.data.response,
        type: 'text',
        created_at: new Date().toISOString()
      };
      setHistorico(h => [...h, botMsg]);
      saveMessage(botMsg);
    } catch {
      const botMsg = {
        role: 'bot',
        text: 'Erro ao consultar a IA.',
        type: 'text',
        created_at: new Date().toISOString()
      };
      setHistorico(h => [...h, botMsg]);
      saveMessage(botMsg);
    } finally {
      setLoading(false);
      setMensagem('');
    }
  };

  // Enviar imagem
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImgLoading(true);

    // Mensagem do usuário (imagem)
    const userMsg: Mensagem = {
      role: 'user',
      text: file.name,
      type: 'image',
      imageUrl: URL.createObjectURL(file),
      created_at: new Date().toISOString()
    };
    setHistorico(h => [...h, userMsg]);
    saveMessage({ ...userMsg, imageUrl: undefined }); // imageUrl não é salva no backend

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
      const botMsg: Mensagem = {
        role: 'bot',
        text: typeof res.data.analise === "string"
          ? res.data.analise
          : JSON.stringify(res.data.analise),
        type: 'image',
        imageUrl: userMsg.imageUrl, // só no frontend, para exibir a imagem do user
        created_at: new Date().toISOString()
      };
      setHistorico(h => [...h, botMsg]);
      saveMessage({ ...botMsg, imageUrl: undefined });
      setSnackbar({ open: true, message: 'Imagem analisada com sucesso!', severity: 'success' });
    } catch {
      const botMsg: Mensagem = {
        role: 'bot',
        text: 'Erro ao analisar imagem.',
        type: 'image',
        imageUrl: userMsg.imageUrl,
        created_at: new Date().toISOString()
      };
      setHistorico(h => [...h, botMsg]);
      saveMessage({ ...botMsg, imageUrl: undefined });
      setSnackbar({ open: true, message: 'Erro ao analisar imagem.', severity: 'error' });
    } finally {
      setImgLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Chat com IA Nutricionista
      </Typography>
      <Paper sx={{ p: { xs: 1, md: 2 }, minHeight: 350, mb: 2, borderRadius: 4 }}>
        <Stack spacing={2}>
          {historico.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Box sx={{ fontSize: 60, mb: 2 }}>🥗</Box>
              <Typography variant="h6" fontWeight={700}>
                Que tal tirar uma dúvida nutricional?
              </Typography>
              <Typography color="text.secondary">
                Envie sua pergunta ou uma foto da sua refeição e receba a análise na hora!
              </Typography>
            </Box>
          )}
          {historico.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.role === 'user' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.04, boxShadow: "0 4px 18px 0 rgba(79,70,229,0.09)" }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                width: 'fit-content',
                maxWidth: '85%',
              }}
            >
              <Box
                sx={{
                  bgcolor: msg.role === 'user' ? 'primary.light' : 'grey.100',
                  color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  mb: 1,
                  boxShadow: 1,
                  fontSize: { xs: '0.97rem', md: '1rem' }
                }}
              >
                <strong>{msg.role === 'user' ? 'Você' : 'IA'}:</strong>{' '}
                {msg.type === 'image' && msg.imageUrl ? (
                  <Box sx={{ mt: 1 }}>
                    <img src={msg.imageUrl} alt="Imagem enviada" style={{ maxWidth: 180, borderRadius: 8, marginBottom: 8 }} />
                    <br />
                    <span>{msg.text}</span>
                  </Box>
                ) : (
                  msg.text
                )}
              </Box>
            </motion.div>
          ))}
        </Stack>
      </Paper>
      <Box
        component="form"
        onSubmit={enviarMensagem}
        sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Digite sua pergunta..."
          value={mensagem}
          onChange={e => setMensagem(e.target.value)}
          disabled={imgLoading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  component="label"
                  disabled={imgLoading}
                >
                  <PhotoCameraIcon />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={imgLoading || !mensagem.trim()}
        >
          Enviar
        </Button>
      </Box>
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
