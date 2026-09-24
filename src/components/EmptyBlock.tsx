import { Box, Typography } from '@mui/material';

export default function EmptyBlock({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: '18px', p: { xs: 4, md: 6 }, display: 'grid', gap: 1, justifyItems: 'start' }}>
      <Typography sx={{ fontWeight: 600, fontSize: 18 }}>{title}</Typography>
      <Typography sx={{ color: 'text.secondary', mb: action ? 2 : 0 }}>{text}</Typography>
      {action}
    </Box>
  );
}
