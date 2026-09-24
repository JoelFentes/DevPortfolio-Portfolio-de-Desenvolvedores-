import { Box } from '@mui/material';

type CustomStepperProps = {
  activeStep: number;
  steps: string[];
};

/** Progresso em segmentos: legível em qualquer largura, sem rótulos espremidos. */
export default function CustomStepper({ activeStep, steps }: CustomStepperProps) {
  return (
    <Box
      component="ol"
      aria-label={`Etapa ${activeStep + 1} de ${steps.length}: ${steps[activeStep]}`}
      sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 0.75 }}
    >
      {steps.map((label, i) => (
        <Box component="li" key={label} aria-current={i === activeStep ? 'step' : undefined} title={label}>
          <Box
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: i <= activeStep ? 'secondary.main' : 'action.selected',
              transition: 'background-color .3s ease',
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
