'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Box, Button, Container, InputAdornment, MenuItem, Pagination, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EmptyBlock from '@/components/EmptyBlock';
import PortfolioCard, { PortfolioCardSkeleton, isWide } from '@/components/PorfolioCard';
import { Portfolio, displayName } from '@/types/portfolio';

const PER_PAGE = 8;

export default function DevsPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchName, setSearchName] = useState('');
  const [selectedStack, setSelectedStack] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPortfolios(data.portfolios || data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allStacks = useMemo(() => [...new Set(portfolios.flatMap((p) => p.stacks))].sort(), [portfolios]);
  const allTechs = useMemo(() => [...new Set(portfolios.flatMap((p) => p.techList))].sort(), [portfolios]);

  const filtered = useMemo(() => {
    const q = searchName.trim().toLowerCase();
    return portfolios.filter((p) =>
      displayName(p).toLowerCase().includes(q) &&
      (!selectedStack || p.stacks.includes(selectedStack)) &&
      (!selectedTech || p.techList.includes(selectedTech)),
    );
  }, [portfolios, searchName, selectedStack, selectedTech]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const hasFilters = Boolean(searchName || selectedStack || selectedTech);

  const clearFilters = () => {
    setSearchName('');
    setSelectedStack('');
    setSelectedTech('');
    setCurrentPage(1);
  };

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Container component="main" id="conteudo" maxWidth="lg" sx={{ pt: { xs: 6, md: 9 }, pb: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 3, flexWrap: 'wrap', mb: 4 }}>
          <Box>
            <Typography component="h1" className="rise" sx={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05 }}>
              Explore os devs
            </Typography>
            <Typography className="rise" style={{ ['--i' as string]: 1 }} sx={{ color: 'text.secondary', mt: 1.5, maxWidth: '48ch' }}>
              Filtre por stack ou tecnologia e abra o portfólio de quem combina com o que você procura.
            </Typography>
          </Box>
          {!loading && !error && (
            <Typography sx={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'text.secondary' }} aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
            </Typography>
          )}
        </Box>

        {/* Filtros */}
        <Box
          role="search"
          sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr auto' }, mb: 4, alignItems: 'center' }}
        >
          <TextField
            label="Buscar por nome"
            value={searchName}
            onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }}
            size="small"
            sx={{ gridColumn: { sm: 'span 2', md: 'auto' } }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
          />
          <TextField
            select
            label="Stack"
            value={selectedStack}
            onChange={(e) => { setSelectedStack(e.target.value); setCurrentPage(1); }}
            size="small"
          >
            <MenuItem value="">Todas</MenuItem>
            {allStacks.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField
            select
            label="Tecnologia"
            value={selectedTech}
            onChange={(e) => { setSelectedTech(e.target.value); setCurrentPage(1); }}
            size="small"
          >
            <MenuItem value="">Todas</MenuItem>
            {allTechs.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <Button onClick={clearFilters} disabled={!hasFilters} sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
            Limpar filtros
          </Button>
        </Box>

        {error ? (
          <EmptyBlock title="Não foi possível carregar os portfólios." text="Verifique sua conexão e recarregue a página." />
        ) : !loading && paginated.length === 0 ? (
          <EmptyBlock
            title={hasFilters ? 'Nenhum dev com esses filtros.' : 'Nenhum portfólio publicado ainda.'}
            text={hasFilters ? 'Tente outra stack ou tecnologia, ou limpe os filtros.' : 'Seja o primeiro a publicar o seu.'}
            action={
              hasFilters
                ? <Button onClick={clearFilters} variant="outlined" color="primary">Limpar filtros</Button>
                : <Button component={Link} href="/createPortfolio" variant="contained" color="secondary">Criar meu portfólio</Button>
            }
          />
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            {loading
              ? [0, 1, 2, 3].map((i) => <PortfolioCardSkeleton key={i} wide={isWide(i)} />)
              : paginated.map((p, i) => <PortfolioCard key={p.id} portfolio={p} wide={isWide(i)} index={i} />)}
          </Box>
        )}

        {totalPages > 1 && (
          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              shape="rounded"
            />
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
}
