'use client';

import { useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Avatar, Box, Button, ButtonBase, Container, Divider, Drawer, IconButton,
  ListItemIcon, Menu, MenuItem, Stack, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/app/context/AuthContext';
import { initials } from '@/types/portfolio';

const NAV = [
  { href: '/', label: 'Início' },
  { href: '/devs', label: 'Devs' },
  { href: '/#como-funciona', label: 'Como funciona' },
];

export function Logo() {
  return (
    <Box
      component={Link}
      href="/"
      aria-label="DevPortfolio, página inicial"
      sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary', textDecoration: 'none' }}
    >
      <Box
        component="span"
        sx={{
          display: 'inline-grid', placeItems: 'center', width: 28, height: 28, borderRadius: '8px',
          bgcolor: 'primary.main', color: 'primary.contrastText',
          fontFamily: 'var(--font-geist-mono)', fontSize: 12, fontWeight: 500,
        }}
      >
        &lt;/&gt;
      </Box>
      <Typography component="span" sx={{ fontWeight: 600, letterSpacing: '-0.02em', fontSize: 17 }}>
        DevPortfolio
      </Typography>
    </Box>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : !href.includes('#') && pathname.startsWith(href));

  const handleLogout = async () => {
    setAnchorEl(null);
    setDrawerOpen(false);
    await logout();
    router.push('/');
  };

  const primaryCta = (
    <Button component={Link} href={user ? '/createPortfolio' : '/auth'} variant="contained" color="secondary">
      {user ? 'Meu portfólio' : 'Criar portfólio'}
    </Button>
  );

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky', top: 0, zIndex: 1100,
        borderBottom: '1px solid', borderColor: 'divider',
        bgcolor: 'rgba(var(--mui-palette-background-defaultChannel) / 0.82)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Logo />

        <Stack component="nav" aria-label="Principal" direction="row" spacing={0.5} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
          {NAV.map((item) => (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              sx={{
                color: isActive(item.href) ? 'text.primary' : 'text.secondary',
                px: 1.5,
                '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
              }}
            >
              {item.label}
            </Button>
          ))}

          <Box sx={{ width: 12 }} />

          {!loading && !user && (
            <Button component={Link} href="/auth" sx={{ color: 'text.primary', px: 1.5 }}>
              Entrar
            </Button>
          )}
          {!loading && primaryCta}

          {user && (
            <>
              <ButtonBase
                onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
                aria-label="Abrir menu da conta"
                aria-haspopup="menu"
                aria-expanded={Boolean(anchorEl)}
                sx={{ ml: 1.5, borderRadius: '10px' }}
              >
                <Avatar
                  variant="rounded"
                  src={user.profilePicture || undefined}
                  alt={user.name}
                  sx={{ width: 36, height: 36, borderRadius: '10px', fontSize: 14, bgcolor: 'action.selected', color: 'text.primary' }}
                >
                  {initials(user.name)}
                </Avatar>
              </ButtonBase>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { mt: 1, minWidth: 200, border: '1px solid', borderColor: 'divider' }, elevation: 0 } }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography fontWeight={600} fontSize={14}>{user.name}</Typography>
                  <Typography color="text.secondary" fontSize={13}>{user.email}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { setAnchorEl(null); router.push('/profile'); }}>
                  <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>
                  Minha conta
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>

        <IconButton
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menu"
          sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>
      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 'min(320px, 86vw)', p: 2, bgcolor: 'background.default' } } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Logo />
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Fechar menu"><CloseIcon /></IconButton>
        </Stack>
        <Stack component="nav" aria-label="Principal" spacing={0.5}>
          {NAV.map((item) => (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => setDrawerOpen(false)}
              aria-current={isActive(item.href) ? 'page' : undefined}
              sx={{ justifyContent: 'flex-start', fontSize: 18, py: 1.25, color: isActive(item.href) ? 'text.primary' : 'text.secondary' }}
            >
              {item.label}
            </Button>
          ))}
          {user && (
            <Button component={Link} href="/profile" onClick={() => setDrawerOpen(false)} sx={{ justifyContent: 'flex-start', fontSize: 18, py: 1.25, color: 'text.secondary' }}>
              Minha conta
            </Button>
          )}
        </Stack>
        <Stack spacing={1.5} sx={{ mt: 'auto' }}>
          {!loading && !user && (
            <Button component={Link} href="/auth" variant="outlined" color="primary" onClick={() => setDrawerOpen(false)}>Entrar</Button>
          )}
          {!loading && <Box onClick={() => setDrawerOpen(false)} sx={{ display: 'grid' }}>{primaryCta}</Box>}
          {user && <Button onClick={handleLogout} sx={{ color: 'text.secondary' }}>Sair</Button>}
        </Stack>
      </Drawer>
    </Box>
  );
}
