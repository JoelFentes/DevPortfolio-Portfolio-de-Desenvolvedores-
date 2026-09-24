'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { Logo } from '@/components/Navbar';

type Errors = Partial<Record<'name' | 'email' | 'password', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (isSignup && name.trim().length < 2) e.name = 'Informe seu nome.';
    if (!EMAIL_RE.test(email)) e.email = 'Informe um e-mail válido.';
    if (password.length < (isSignup ? 6 : 1)) e.password = isSignup ? 'Use pelo menos 6 caracteres.' : 'Informe sua senha.';
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      const res = await fetch(isSignup ? '/api/auth/signup' : '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isSignup ? { name, email, password } : { email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(data.error || 'Não foi possível entrar. Tente novamente.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success(isSignup ? 'Conta criada. Agora monte seu portfólio.' : `Bem-vindo de volta, ${data.user?.name?.split(' ')[0] ?? ''}.`);
      router.push(isSignup ? '/createPortfolio' : '/');
    } catch {
      setFormError('Falha de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setIsSignup((v) => !v);
    setErrors({});
    setFormError('');
  };

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ height: 64, display: 'flex', alignItems: 'center' }}>
        <Logo />
      </Container>

      <Box component="main" id="conteudo" sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 2, py: 6 }}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          className="rise"
          sx={{
            width: '100%', maxWidth: 400, display: 'grid', gap: 2.5,
            bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '20px',
            p: { xs: 3, sm: 4 },
          }}
        >
          <Box>
            <Typography component="h1" sx={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.03em' }}>
              {isSignup ? 'Crie sua conta' : 'Entre na sua conta'}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: 15 }}>
              {isSignup ? 'Leva menos de um minuto.' : 'Para editar e publicar seu portfólio.'}
            </Typography>
          </Box>

          {formError && <Alert severity="error" variant="outlined">{formError}</Alert>}

          {isSignup && (
            <TextField
              id="name" label="Nome" autoComplete="name" value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name} helperText={errors.name} fullWidth
            />
          )}
          <TextField
            id="email" label="E-mail" type="email" autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email} helperText={errors.email} fullWidth
          />
          <TextField
            id="password" label="Senha" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password} helperText={errors.password} fullWidth
          />

          <Button type="submit" variant="contained" color="primary" size="large" disabled={submitting} sx={{ mt: 0.5, height: 46 }}>
            {submitting ? <CircularProgress size={20} color="inherit" aria-label="Enviando" /> : isSignup ? 'Criar conta' : 'Entrar'}
          </Button>

          <Typography sx={{ fontSize: 14, color: 'text.secondary', textAlign: 'center' }}>
            {isSignup ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
            <Box
              component="button"
              type="button"
              onClick={switchMode}
              sx={{ all: 'unset', cursor: 'pointer', color: 'text.primary', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3, '&:focus-visible': { outline: '2px solid', outlineColor: 'secondary.main', outlineOffset: 2, borderRadius: '4px' } }}
            >
              {isSignup ? 'Entrar' : 'Criar conta'}
            </Box>
          </Typography>
        </Box>

        <Button component={Link} href="/" sx={{ color: 'text.secondary', mt: 3 }}>← Voltar para o início</Button>
      </Box>
    </Box>
  );
}
