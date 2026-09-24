import Link from 'next/link';
import { Box, Container, Stack, Typography } from '@mui/material';

const linkSx = { color: 'text.secondary', textDecoration: 'none', fontSize: 14, '&:hover': { color: 'text.primary' } };

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 'auto' }}>
      <Container
        maxWidth="lg"
        sx={{ py: 4, pb: 6, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}
      >
        <Typography fontSize={14} color="text.secondary">© {new Date().getFullYear()} DevPortfolio</Typography>
        <Stack direction="row" spacing={3} component="nav" aria-label="Rodapé">
          <Box component={Link} href="/devs" sx={linkSx}>Explorar devs</Box>
          <Box component={Link} href="/createPortfolio" sx={linkSx}>Criar portfólio</Box>
          <Box
            component="a"
            href="https://github.com/JoelFentes/DevPortfolio-Portfolio-de-Desenvolvedores-"
            target="_blank"
            rel="noopener noreferrer"
            sx={linkSx}
          >
            GitHub
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
