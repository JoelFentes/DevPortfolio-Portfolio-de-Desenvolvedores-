'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Avatar, Box, Button, Container, Skeleton, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EmptyBlock from '@/components/EmptyBlock';
import { TechTag } from '@/components/PorfolioCard';
import { Portfolio, displayName, initials } from '@/types/portfolio';

type Status = 'loading' | 'ready' | 'notfound' | 'error';

const eyebrow = { fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'text.secondary', textTransform: 'lowercase', mb: 1.5 } as const;

export default function DevDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setStatus('loading');
      try {
        const res = await fetch(`/api/portfolio/${id}`);
        if (res.status === 404) return setStatus('notfound');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPortfolio(data.portfolio);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    })();
  }, [id]);

  useEffect(() => {
    if (portfolio) document.title = `${displayName(portfolio)} · DevPortfolio`;
  }, [portfolio]);

  const links = portfolio
    ? [
        { href: portfolio.github, label: 'GitHub', icon: <GitHubIcon fontSize="small" /> },
        { href: portfolio.linkedin, label: 'LinkedIn', icon: <LinkedInIcon fontSize="small" /> },
        { href: portfolio.website, label: 'Site', icon: <LanguageIcon fontSize="small" /> },
      ].filter((l) => l.href)
    : [];

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Container component="main" id="conteudo" maxWidth="lg" sx={{ pt: { xs: 4, md: 6 }, pb: 10 }}>
        <Button component={Link} href="/devs" sx={{ color: 'text.secondary', ml: -1, mb: 4 }}>← Todos os devs</Button>

        {status === 'loading' && <DetailSkeleton />}
        {status === 'notfound' && (
          <EmptyBlock
            title="Portfólio não encontrado."
            text="Ele pode ter sido removido ou o link está incorreto."
            action={<Button component={Link} href="/devs" variant="outlined" color="primary">Explorar devs</Button>}
          />
        )}
        {status === 'error' && <EmptyBlock title="Não foi possível carregar este portfólio." text="Verifique sua conexão e recarregue a página." />}

        {status === 'ready' && portfolio && (
          <>
            {/* Cabeçalho */}
            <Box
              component="header"
              className="rise"
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' }, gap: { xs: 3, sm: 4 }, alignItems: 'end', pb: 5, borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <Avatar
                variant="rounded"
                src={portfolio.user?.profilePicture || undefined}
                alt={`Foto de ${displayName(portfolio)}`}
                sx={{ width: { xs: 96, md: 128 }, height: { xs: 96, md: 128 }, borderRadius: '28px', fontSize: 40, bgcolor: 'action.selected', color: 'text.primary' }}
              >
                {initials(displayName(portfolio))}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                {portfolio.stacks.length > 0 && (
                  <Typography sx={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'secondary.main', mb: 1 }}>
                    {portfolio.stacks.join(' · ')}
                  </Typography>
                )}
                <Typography component="h1" sx={{ fontSize: 'clamp(34px, 5vw, 60px)', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.02 }}>
                  {displayName(portfolio)}
                </Typography>
                {links.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2.5 }}>
                    {links.map((l) => (
                      <Button
                        key={l.label}
                        component="a"
                        href={l.href!}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={l.icon}
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ borderColor: 'divider' }}
                      >
                        {l.label}
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Conteúdo */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' }, gap: { xs: 6, md: 8 }, pt: 6 }}>
              <Box component="section" aria-labelledby="projeto-title" className="rise" style={{ ['--i' as string]: 1 }}>
                <Typography sx={eyebrow}>projeto em destaque</Typography>
                {portfolio.projectTitle ? (
                  <>
                    {portfolio.projectImage && !imgFailed && (
                      <Box
                        component="img"
                        src={portfolio.projectImage}
                        alt={`Prévia do projeto ${portfolio.projectTitle}`}
                        onError={() => setImgFailed(true)}
                        sx={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', borderRadius: '16px', display: 'block', mb: 3, bgcolor: 'action.hover' }}
                      />
                    )}
                    <Typography id="projeto-title" component="h2" sx={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.03em', mb: 1.5 }}>
                      {portfolio.projectTitle}
                    </Typography>
                    {portfolio.projectDescription && (
                      <Typography sx={{ color: 'text.secondary', fontSize: 17, maxWidth: '62ch', mb: 3 }}>{portfolio.projectDescription}</Typography>
                    )}
                    {portfolio.projectLink && (
                      <Button component="a" href={portfolio.projectLink} target="_blank" rel="noopener noreferrer" variant="contained" color="secondary" endIcon={<ArrowOutwardIcon fontSize="small" />}>
                        Ver projeto
                      </Button>
                    )}
                  </>
                ) : (
                  <Typography id="projeto-title" sx={{ color: 'text.secondary' }}>Nenhum projeto em destaque ainda.</Typography>
                )}
              </Box>

              <Box component="aside" className="rise" style={{ ['--i' as string]: 2 }} sx={{ display: 'grid', gap: 5, alignContent: 'start' }}>
                {portfolio.bio && (
                  <Box>
                    <Typography sx={eyebrow}>sobre</Typography>
                    <Typography sx={{ fontSize: 17, whiteSpace: 'pre-line' }}>{portfolio.bio}</Typography>
                  </Box>
                )}
                {portfolio.techList.length > 0 && (
                  <Box>
                    <Typography sx={eyebrow}>tecnologias</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {portfolio.techList.map((t) => <TechTag key={t} label={t} />)}
                    </Box>
                  </Box>
                )}
                {portfolio.experience && (
                  <Box>
                    <Typography sx={eyebrow}>experiência</Typography>
                    <Typography sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>{portfolio.experience}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </>
        )}
      </Container>

      <Footer />
    </Box>
  );
}

function DetailSkeleton() {
  return (
    <Box aria-hidden>
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'end', pb: 5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Skeleton variant="rounded" width={128} height={128} sx={{ borderRadius: '28px' }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="20%" />
          <Skeleton width="50%" height={64} />
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' }, gap: 8, pt: 6 }}>
        <Skeleton variant="rounded" sx={{ aspectRatio: '16 / 10', height: 'auto', borderRadius: '16px' }} />
        <Box><Skeleton /><Skeleton /><Skeleton width="60%" /></Box>
      </Box>
    </Box>
  );
}
