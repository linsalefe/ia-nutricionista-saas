// src/pages/ChatPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  Avatar,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { motion } from 'framer-motion';
import { useLoading } from '../contexts/LoadingContext';

interface Mensagem {
  role: 'user' | 'bot';
  text: string;
  type?: 'text' | 'image';
  imageUrl?: string;
  created_at: string;
}

const suggestions = [
  'Quantas calorias tem arroz, feijão e frango?',
  'Qual a quantidade ideal de proteína por dia?',
  'Como balancear proteínas e carboidratos?',
];

const tips = [
  {
    title: 'Hidrate-se',
    summary: 'Beba pelo menos 2L de água por dia.',
    details: 'Manter-se hidratado ajuda no metabolismo, no transporte de nutrientes e na saúde da pele.',
  },
  {
    title: 'Inclua verduras',
    summary: 'Metade do prato deve ser verduras.',
    details: 'Verduras são ricas em fibras, vitaminas e minerais, ajudando na digestão e saciedade.',
  },
  {
    title: 'Gorduras saudáveis',
    summary: 'Prefira azeite, abacate, oleaginosas.',
    details: 'Essas gorduras ajudam no controle do colesterol e promovem saúde cardiovascular.',
  },
  {
    title: 'Lanches equilibrados',
    summary: 'Frutas e oleaginosas entre refeições.',
    details: 'Evita picos de glicemia e mantém energia estável ao longo do dia.',
  },
];

export default function ChatPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mensagem, setMensagem] = useState('');
  const [historico, setHistorico] = useState<Mensagem[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imgLoading, setImgLoading] = useState(false);
  const { setLoading } = useLoading();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Carrega histórico
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get<Mensagem[]>('/api/chat-history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistorico(data);
      } catch {
        setHistorico([
          {
            role: 'bot',
            text: 'Olá! Eu sou sua IA Nutricionista 😊 Pergunte algo ou escolha uma sugestão abaixo.',
            type: 'text',
            created_at: new Date().toISOString(),
          },
        ]);
      }
    })();
  }, []);

  // Scroll automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historico]);

  const saveMessage = async (msg: Omit<Mensagem, 'imageUrl'>) => {
    try {
      await axios.post('/api/chat/save', msg, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch {}
  };

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = mensagem.trim();
    if (!text) return;
    const userMsg: Mensagem = { role: 'user', text, type: 'text', created_at: new Date().toISOString() };
    setHistorico(h => [...h, userMsg]);
    saveMessage({ ...userMsg, imageUrl: undefined });
    setLoading(true);
    try {
      const { data } = await axios.post(
        '/api/chat/send',
        { message: text },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const botMsg: Mensagem = {
        role: 'bot',
        text: data.response,
        type: 'text',
        created_at: new Date().toISOString(),
      };
      setHistorico(h => [...h, botMsg]);
      saveMessage({ ...botMsg, imageUrl: undefined });
    } catch {
      const errMsg: Mensagem = {
        role: 'bot',
        text: 'Desculpe, houve um erro ao conectar.',
        type: 'text',
        created_at: new Date().toISOString(),
      };
      setHistorico(h => [...h, errMsg]);
      saveMessage({ ...errMsg, imageUrl: undefined });
    } finally {
      setLoading(false);
      setMensagem('');
    }
  };

  const handleFile = async (file: File) => {
    setImgLoading(true);
    const preview = URL.createObjectURL(file);
    const userMsg: Mensagem = {
      role: 'user',
      text: file.name,
      type: 'image',
      imageUrl: preview,
      created_at: new Date().toISOString(),
    };
    setHistorico(h => [...h, userMsg]);
    saveMessage({ ...userMsg, imageUrl: undefined });
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await axios.post('/api/image/analyze', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const analysis = typeof data.analise === 'string' ? data.analise : JSON.stringify(data.analise);
      const botMsg: Mensagem = {
        role: 'bot',
        text: analysis,
        type: 'image',
        imageUrl: preview,
        created_at: new Date().toISOString(),
      };
      setHistorico(h => [...h, botMsg]);
      saveMessage({ ...botMsg, imageUrl: undefined });
      setSnackbar({ open: true, message: 'Imagem analisada!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Falha ao analisar imagem.', severity: 'error' });
    } finally {
      setImgLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: 'Copiado!', severity: 'success' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height: 'calc(100vh - 64px)',
        p: 2,
        gap: 2,
      }}
    >
      {/* Chat principal */}
      <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Sugestões */}
          <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
            {suggestions.map((s) => (
              <Chip
                key={s}
                label={s}
                onClick={() => setMensagem(s)}
                sx={{
                  bgcolor: 'secondary.light',
                  color: 'secondary.contrastText',
                  '&:hover': { bgcolor: 'secondary.main' },
                }}
                icon={<SendIcon />}
              />
            ))}
          </Box>

          {/* Mensagens */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: 'grey.50' }}>
            {historico.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 12,
                }}
              >
                {msg.role === 'bot' && (
                  <Avatar sx={{ mr: 1, bgcolor: 'secondary.main' }}>
                    <SmartToyIcon />
                  </Avatar>
                )}
                <Box
                  sx={{
                    maxWidth: 400,
                    bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                    color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                    p: 1.5,
                    borderRadius:
                      msg.role === 'user'
                        ? '12px 12px 0 12px'
                        : '12px 12px 12px 0',
                    boxShadow: 1,
                    position: 'relative',
                  }}
                >
                  {msg.type === 'image' && msg.imageUrl && (
                    <Box sx={{ mb: 1 }}>
                      <img
                        src={msg.imageUrl}
                        alt=""
                        style={{ width: '100%', borderRadius: 6 }}
                      />
                    </Box>
                  )}
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </Typography>
                  {msg.role === 'bot' && (
                    <IconButton
                      size="small"
                      onClick={() => copyText(msg.text)}
                      sx={{ position: 'absolute', top: 4, right: 4 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                {msg.role === 'user' && (
                  <Avatar sx={{ ml: 1, bgcolor: 'primary.dark' }}>
                    <PersonIcon />
                  </Avatar>
                )}
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </Box>

          {/* Input */}
          <Box
            component="form"
            onSubmit={enviarMensagem}
            sx={{
              p: 2,
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              borderTop: `1px solid ${theme.palette.grey[300]}`,
            }}
          >
            <TextField
              fullWidth
              placeholder="Digite sua pergunta..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              multiline
              maxRows={4}
              sx={{ borderRadius: 2, backgroundColor: 'background.paper' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      disabled={!mensagem.trim() || imgLoading}
                      sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                      {imgLoading ? <CircularProgress size={18} /> : <SendIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <IconButton
              component="label"
              disabled={imgLoading}
              sx={{ p: 1, bgcolor: 'background.paper', boxShadow: 1 }}
            >
              <PhotoCameraIcon />
              <input
                type="file"
                hidden
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              />
            </IconButton>
          </Box>
        </Paper>
      </Box>

      {/* Painel de Dicas */}
      <Box sx={{ flex: 1 }}>
        <Paper
          elevation={3}
          sx={{ height: '100%', p: 2, borderRadius: 2, overflowY: 'auto' }}
        >
          <Typography variant="h6" gutterBottom>
            Dicas Nutricionais
          </Typography>
          {tips.map((tip) => (
            <Accordion key={tip.title} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>{tip.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" gutterBottom>
                  {tip.summary}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {tip.details}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
