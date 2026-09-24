'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, Box, Typography } from '@mui/material';
import { Portfolio, displayName, initials } from '@/types/portfolio';

export function TechTag({ label }: { label: string }) {
  return (
    <Box
      component="span"
      sx={{
        fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11.5, lineHeight: 1.6,
        px: 1, py: '2px', borderRadius: '6px', bgcolor: 'action.hover', color: 'text.secondary',
      }}
    >
      {label.trim()}
    </Box>
  );
}

/** Capa do projeto: imagem real ou um bloco tipográfico com as iniciais, sem imagem quebrada. */
function Cover({ portfolio, wide }: { portfolio: Portfolio; wide?: boolean }) {
  const [failed, setFailed] = useState(false);
  const src = portfolio.projectImage?.trim();
  const name = displayName(portfolio);

  return (
    <Box sx={{ aspectRatio: wide ? '16 / 8' : '4 / 3', borderRadius: '12px', overflow: 'hidden', bgcolor: 'action.hover', position: 'relative' }}>
      {src && !failed ? (
        <Box
          component="img"
          src={src}
          alt={portfolio.projectTitle ? `Prévia do projeto ${portfolio.projectTitle}` : `Projeto de ${name}`}
          loading="lazy"
          onError={() => setFailed(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s cubic-bezier(.2,.8,.2,1)' }}
        />
      ) : (
        <Box
          aria-hidden
          sx={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            background: 'radial-gradient(120% 90% at 0% 0%, rgba(var(--mui-palette-secondary-mainChannel) / 0.14), transparent 60%)',
          }}
        >
          <Typography sx={{ fontFamily: 'var(--font-geist-mono)', fontSize: wide ? 56 : 44, color: 'text.disabled', letterSpacing: '-0.04em' }}>
            {initials(name) || '</>'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default function PortfolioCard({ portfolio, wide = false, index = 0 }: { portfolio: Portfolio; wide?: boolean; index?: number }) {
  const name = displayName(portfolio);
  const tags = [...(portfolio.stacks ?? []), ...(portfolio.techList ?? [])].slice(0, wide ? 5 : 3);

  return (
    <Box
      component={Link}
      href={`/devs/${portfolio.id}`}
      className="rise"
      style={{ ['--i' as string]: index }}
      sx={{
        gridColumn: { xs: 'span 6', md: wide ? 'span 4' : 'span 2' },
        display: 'flex', flexDirection: 'column',
        p: 1, borderRadius: '18px', bgcolor: 'background.paper',
        color: 'inherit', textDecoration: 'none',
        border: '1px solid', borderColor: 'divider',
        transition: 'transform .2s cubic-bezier(.2,.8,.2,1), border-color .2s',
        '@media (hover: hover)': {
          '&:hover': { transform: 'translateY(-3px)', borderColor: 'text.disabled' },
          '&:hover img': { transform: 'scale(1.03)' },
        },
        '&:active': { transform: 'translateY(-1px) scale(.99)' },
      }}
    >
      <Cover portfolio={portfolio} wide={wide} />
      <Box sx={{ p: '16px 12px 12px', display: 'flex', flexDirection: 'column', gap: 1.25, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Avatar
            variant="rounded"
            src={portfolio.user?.profilePicture || undefined}
            alt=""
            sx={{ width: 32, height: 32, borderRadius: '9px', fontSize: 13, bgcolor: 'action.selected', color: 'text.primary' }}
          >
            {initials(name)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>{name}</Typography>
            {portfolio.stacks?.[0] && (
              <Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>{portfolio.stacks.join(' · ')}</Typography>
            )}
          </Box>
        </Box>

        {portfolio.projectTitle && (
          <Typography component="h3" sx={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            {portfolio.projectTitle}
          </Typography>
        )}
        {(wide || !portfolio.projectTitle) && (portfolio.projectDescription || portfolio.bio) && (
          <Typography
            sx={{ fontSize: 14, color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {portfolio.projectDescription || portfolio.bio}
          </Typography>
        )}

        {tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 'auto', pt: 0.75 }}>
            {tags.map((t, i) => <TechTag key={`${t}-${i}`} label={t} />)}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export function PortfolioCardSkeleton({ wide = false }: { wide?: boolean }) {
  const shimmer = {
    borderRadius: '8px',
    background: 'linear-gradient(90deg, var(--mui-palette-action-hover) 25%, var(--mui-palette-action-selected) 50%, var(--mui-palette-action-hover) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s linear infinite',
  };
  return (
    <Box
      aria-hidden
      sx={{
        gridColumn: { xs: 'span 6', md: wide ? 'span 4' : 'span 2' },
        p: 1, borderRadius: '18px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
      }}
    >
      <Box sx={{ ...shimmer, aspectRatio: wide ? '16 / 8' : '4 / 3', borderRadius: '12px' }} />
      <Box sx={{ p: '16px 12px 12px', display: 'grid', gap: 1.25 }}>
        <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
          <Box sx={{ ...shimmer, width: 32, height: 32, borderRadius: '9px' }} />
          <Box sx={{ ...shimmer, height: 14, width: '40%' }} />
        </Box>
        <Box sx={{ ...shimmer, height: 18, width: '75%' }} />
        <Box sx={{ ...shimmer, height: 18, width: '35%' }} />
      </Box>
    </Box>
  );
}

/** Padrão de grade assimétrica: largo/estreito alternando por linha. */
export function isWide(index: number) {
  const pos = index % 4;
  return pos === 0 || pos === 3;
}
