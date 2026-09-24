import Link from 'next/link';
import { Box, Button, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Box component="main" id="conteudo" sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', px: 3, textAlign: 'center' }}>
      <Box>
        <Typography sx={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'secondary.main', mb: 2 }}>erro 404</Typography>
        <Typography component="h1" sx={{ fontSize: 'clamp(34px, 6vw, 60px)', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05 }}>
          Esta página não existe.
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 2, mb: 4 }}>O link pode estar errado ou o conteúdo foi removido.</Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} href="/" variant="contained" color="primary">Ir para o início</Button>
          <Button component={Link} href="/devs" sx={{ color: 'text.primary' }}>Explorar devs</Button>
        </Box>
      </Box>
    </Box>
  );
}
