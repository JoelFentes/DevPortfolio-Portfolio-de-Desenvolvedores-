'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioCard, { PortfolioCardSkeleton, isWide } from '@/components/PorfolioCard';
import { useAuth } from './context/AuthContext';
import { Portfolio } from '@/types/portfolio';
import EmptyBlock from '@/components/EmptyBlock';

type Status = 'loading' | 'ready' | 'error';

const STEPS = [
  { title: 'Crie sua conta', text: 'Nome, e-mail e senha. Nada de formulário longo antes de começar.' },
  { title: 'Conte o que você faz', text: 'Bio, stacks, tecnologias e experiência, em um passo a passo curto.' },
  { title: 'Destaque um projeto', text: 'Título, descrição, link e uma imagem. É o que aparece primeiro no seu card.' },
  { title: 'Compartilhe o link', text: 'Seu portfólio entra na busca e pode ser filtrado por stack e tecnologia.' },
];

export default function HomePage() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) {
          setPortfolios(data.portfolios ?? []);
          setStatus('ready');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    const techs = new Set<string>();
    portfolios.forEach((p) => [...(p.stacks ?? []), ...(p.techList ?? [])].forEach((t) => techs.add(t.trim().toLowerCase())));
    return [
      { value: portfolios.length, label: 'devs publicados' },
      { value: portfolios.filter((p) => p.projectTitle).length, label: 'projetos em destaque' },
      { value: techs.size, label: 'tecnologias filtráveis' },
      { value: 5, label: 'etapas no formulário' },
    ];
  }, [portfolios]);

  const featured = portfolios.slice(0, 4);
  const ctaHref = user ? '/createPortfolio' : '/auth';

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Container component="main" id="conteudo" maxWidth="lg">
        {/* Hero */}
        <Box
          component="section"
          sx={{
            display: 'grid', gap: { xs: 5, md: 7 }, alignItems: 'end',
            gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr' },
            pt: { xs: 7, md: 12 }, pb: { xs: 8, md: 10 },
          }}
        >
          <Box>
            <Typography
              className="rise"
              sx={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'text.secondary', display: 'inline-flex', alignItems: 'center', gap: 1, mb: 3 }}
            >
              <Box component="span" sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'secondary.main', boxShadow: '0 0 0 4px rgba(var(--mui-palette-secondary-mainChannel) / 0.18)' }} />
              Portfólios de desenvolvedores
            </Typography>
            <Typography
              component="h1"
              className="rise"
              style={{ ['--i' as string]: 1 }}
              sx={{ fontSize: 'clamp(44px, 7vw, 84px)', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.02 }}
            >
              Seu trabalho,<br />visto por quem{' '}
              <Box component="span" sx={{ color: 'secondary.main' }}>contrata</Box>.
            </Typography>
            <Typography
              className="rise"
              style={{ ['--i' as string]: 2 }}
              sx={{ color: 'text.secondary', fontSize: 18, maxWidth: '46ch', mt: 3, mb: 4 }}
            >
              Monte um portfólio com seus projetos, stack e links em poucos minutos. Quem procura dev filtra por tecnologia e chega direto em você.
            </Typography>
            <Box className="rise" style={{ ['--i' as string]: 3 }} sx={{ display: 'flex', gap: 2.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button component={Link} href={ctaHref} variant="contained" color="secondary" size="large" sx={{ px: 2.5 }}>
                {user ? 'Meu portfólio' : 'Criar meu portfólio'} →
              </Button>
              <Button component={Link} href="/devs" sx={{ color: 'text.primary', '&:hover': { textDecoration: 'underline', textUnderlineOffset: 4, bgcolor: 'transparent' } }}>
                Explorar devs
              </Button>
            </Box>
          </Box>

          {status !== 'error' && (
          <Box
            className="rise"
            style={{ ['--i' as string]: 4 }}
            sx={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px',
              bgcolor: 'divider', border: '1px solid', borderColor: 'divider', borderRadius: '16px', overflow: 'hidden',
            }}
          >
            {stats.map((s) => (
              <Box key={s.label} sx={{ bgcolor: 'background.paper', p: 2.75 }}>
                <Typography sx={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
                  {status === 'ready' ? s.value.toLocaleString('pt-BR') : '—'}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
          )}
        </Box>

        {/* Devs em destaque */}
        <Box component="section" id="devs" aria-labelledby="devs-title" sx={{ py: { xs: 7, md: 9 }, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 3, mb: 4.5, flexWrap: 'wrap' }}>
            <Typography id="devs-title" component="h2" sx={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 600, letterSpacing: '-0.03em' }}>
              Devs em destaque
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'end', gap: 3, flexWrap: 'wrap' }}>
              <Typography sx={{ color: 'text.secondary', maxWidth: '42ch' }}>
                Projetos reais, com código e deploy. Clique para ver o portfólio completo.
              </Typography>
              <Button component={Link} href="/devs" sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}>Ver todos →</Button>
            </Box>
          </Box>

          {status === 'error' ? (
            <EmptyBlock title="Não foi possível carregar os portfólios." text="Verifique sua conexão e recarregue a página." />
          ) : status === 'ready' && featured.length === 0 ? (
            <EmptyBlock
              title="Nenhum portfólio publicado ainda."
              text="Seja o primeiro: leva poucos minutos."
              action={<Button component={Link} href={ctaHref} variant="contained" color="secondary">Criar meu portfólio</Button>}
            />
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
              {status === 'loading'
                ? [0, 1, 2, 3].map((i) => <PortfolioCardSkeleton key={i} wide={isWide(i)} />)
                : featured.map((p, i) => <PortfolioCard key={p.id} portfolio={p} wide={isWide(i)} index={i} />)}
            </Box>
          )}
        </Box>

        {/* Como funciona */}
        <Box
          component="section"
          id="como-funciona"
          aria-labelledby="como-title"
          sx={{
            py: { xs: 7, md: 9 }, borderTop: '1px solid', borderColor: 'divider',
            display: 'grid', gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: '1fr', md: '1fr 1.4fr' },
          }}
        >
          <Box sx={{ position: { md: 'sticky' }, top: { md: 96 }, alignSelf: 'start' }}>
            <Typography id="como-title" component="h2" sx={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 600, letterSpacing: '-0.03em', mb: 2 }}>
              Como funciona
            </Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: '38ch' }}>
              Uma vitrine profissional sem precisar montar site, escolher template ou pagar hospedagem.
            </Typography>
          </Box>
          <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {STEPS.map((s, i) => (
              <Box
                component="li"
                key={s.title}
                sx={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 2, py: 3, borderBottom: '1px solid', borderColor: 'divider', '&:first-of-type': { pt: 0 } }}
              >
                <Typography sx={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'secondary.main', pt: '5px' }}>
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Box>
                  <Typography component="h3" sx={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', mb: 0.5 }}>{s.title}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{s.text}</Typography>
                </Box>
              </Box>
            ))}
            <Box component="li" sx={{ pt: 4 }}>
              <Button component={Link} href={ctaHref} variant="contained" color="secondary" size="large">
                Começar agora →
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}

