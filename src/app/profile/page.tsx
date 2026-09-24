'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/app/context/AuthContext';
import { initials } from '@/types/portfolio';

interface ProfileData {
  name: string;
  bio: string;
  email: string;
  profilePicture?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

const URL_RE = /^https?:\/\/\S+\.\S+/i;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, loading: authLoading } = useAuth();
  const [data, setData] = useState<ProfileData>({ name: '', bio: '', email: '', profilePicture: '', github: '', linkedin: '', website: '' });
  // Portfólio completo: reenviado junto para não zerar stacks, projeto etc. ao salvar
  const [portfolio, setPortfolio] = useState<Record<string, unknown> | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});

  useEffect(() => {
    if (!authLoading && !user) router.replace('/auth');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error();
        const json = await res.json();
        const p = json.portfolio;
        setPortfolio(p);
        setData({
          name: json.user?.name || '',
          email: p?.email || json.user?.email || '',
          profilePicture: json.user?.profilePicture || '',
          bio: p?.bio || '',
          github: p?.github || '',
          linkedin: p?.linkedin || '',
          website: p?.website || '',
        });
      } catch {
        toast.error('Não foi possível carregar seus dados.');
      } finally {
        setFetching(false);
      }
    })();
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((d) => ({ ...d, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error('Imagem muito grande. Use uma de até 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setData((d) => ({ ...d, profilePicture: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found: typeof errors = {};
    if (!data.name.trim()) found.name = 'Informe seu nome.';
    (['github', 'linkedin', 'website'] as const).forEach((k) => {
      if (data[k] && !URL_RE.test(data[k]!)) found[k] = 'Use um link completo, começando com https://';
    });
    if (portfolio && !data.bio.trim()) found.bio = 'A bio não pode ficar vazia.';
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const userRes = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicture: data.profilePicture, name: data.name }),
      });
      if (!userRes.ok) throw new Error((await userRes.json().catch(() => ({}))).error || 'Não foi possível atualizar seu perfil.');

      if (portfolio) {
        const portfolioRes = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...portfolio, name: data.name, bio: data.bio, email: data.email, github: data.github, linkedin: data.linkedin, website: data.website }),
        });
        if (!portfolioRes.ok) throw new Error((await portfolioRes.json().catch(() => ({}))).error || 'Não foi possível atualizar o portfólio.');
      }

      if (user) setUser({ ...user, name: data.name, profilePicture: data.profilePicture });
      toast.success('Perfil salvo.');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const busy = authLoading || fetching;

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Container component="main" id="conteudo" maxWidth="sm" sx={{ py: { xs: 6, md: 9 } }}>
        <Typography component="h1" className="rise" sx={{ fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 600, letterSpacing: '-0.035em' }}>
          Minha conta
        </Typography>
        <Typography className="rise" style={{ ['--i' as string]: 1 }} sx={{ color: 'text.secondary', mt: 1, mb: 5 }}>
          Foto, nome e links que aparecem no seu portfólio.
        </Typography>

        {busy ? (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 10 }}><CircularProgress size={28} aria-label="Carregando" /></Box>
        ) : (
          <Box component="form" noValidate onSubmit={handleSubmit} className="rise" style={{ ['--i' as string]: 2 }} sx={{ display: 'grid', gap: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 1 }}>
              <Avatar
                variant="rounded"
                src={data.profilePicture || undefined}
                alt="Sua foto de perfil"
                sx={{ width: 88, height: 88, borderRadius: '22px', fontSize: 28, bgcolor: 'action.selected', color: 'text.primary' }}
              >
                {initials(data.name)}
              </Avatar>
              <Box>
                <Button variant="outlined" color="primary" component="label" size="small" sx={{ borderColor: 'divider' }}>
                  Trocar foto
                  <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                </Button>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.75 }}>JPG ou PNG, até 2 MB.</Typography>
              </Box>
            </Box>

            <TextField label="Nome" name="name" value={data.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} fullWidth />

            {portfolio ? (
              <>
                <TextField label="Bio" name="bio" value={data.bio} onChange={handleChange} error={!!errors.bio} helperText={errors.bio} multiline minRows={4} fullWidth />
                <TextField label="E-mail de contato" name="email" type="email" value={data.email} onChange={handleChange} fullWidth />
                <TextField label="GitHub" name="github" value={data.github} onChange={handleChange} error={!!errors.github} helperText={errors.github} fullWidth />
                <TextField label="LinkedIn" name="linkedin" value={data.linkedin} onChange={handleChange} error={!!errors.linkedin} helperText={errors.linkedin} fullWidth />
                <TextField label="Site" name="website" value={data.website} onChange={handleChange} error={!!errors.website} helperText={errors.website} fullWidth />
              </>
            ) : (
              <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: '14px', p: 3 }}>
                <Typography sx={{ fontWeight: 600 }}>Você ainda não publicou um portfólio.</Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5, mb: 2 }}>Bio, stack e links são definidos na criação.</Typography>
                <Button component={Link} href="/createPortfolio" variant="contained" color="secondary">Criar meu portfólio</Button>
              </Box>
            )}

            <Button type="submit" variant="contained" color="primary" size="large" disabled={saving} sx={{ mt: 1, height: 46, justifySelf: 'start', minWidth: 160 }}>
              {saving ? <CircularProgress size={20} color="inherit" aria-label="Salvando" /> : 'Salvar alterações'}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
