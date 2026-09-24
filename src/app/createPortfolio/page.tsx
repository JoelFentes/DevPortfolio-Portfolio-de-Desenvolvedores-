'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Button, Chip, CircularProgress, Container, IconButton, InputAdornment, TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkIcon from '@mui/icons-material/Link';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import Navbar from '@/components/Navbar';
import CustomStepper from '@/components/CustomStepper';

type FormData = {
  name: string;
  bio: string;
  stack: string;
  stacks: string[];
  github: string;
  linkedin: string;
  email: string;
  website: string;
  technologies: string;
  techList: string[];
  experience: string;
  projectTitle: string;
  projectDescription: string;
  projectLink: string;
  projectImage: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const steps = ['Sobre você', 'Stack', 'Experiência', 'Projeto', 'Contato'];

const HINTS = [
  'Como você quer ser apresentado. A bio aparece no topo do seu portfólio.',
  'Stacks viram filtros na busca. Tecnologias aparecem como tags no seu card.',
  'Anos de experiência, empresas, projetos relevantes. Texto livre.',
  'Um projeto que represente bem seu trabalho. A imagem vira a capa do card.',
  'Onde quem gostou do seu trabalho pode falar com você.',
];

const URL_RE = /^https?:\/\/\S+\.\S+/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function capitalizeFirstLetter(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export default function CreatePortfolio() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '', bio: '', stack: '', stacks: [], github: '', linkedin: '', email: '', website: '',
    technologies: '', techList: [], experience: '', projectTitle: '', projectDescription: '', projectLink: '', projectImage: '',
  });

  useEffect(() => {
    if (!loading && !user) router.replace('/auth');
  }, [loading, user, router]);

  useEffect(() => {
    if (user) setFormData((prev) => ({ ...prev, name: prev.name || user.name, email: prev.email || user.email }));
  }, [user]);

  if (loading || !user) {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress size={28} aria-label="Carregando" />
      </Box>
    );
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const addTo = (field: 'stack' | 'technologies', list: 'stacks' | 'techList') => {
    const value = capitalizeFirstLetter(formData[field].trim());
    if (!value) return;
    if (formData[list].some((v) => v.toLowerCase() === value.toLowerCase())) {
      setFormData((prev) => ({ ...prev, [field]: '' }));
      return;
    }
    setFormData((prev) => ({ ...prev, [list]: [...prev[list], value], [field]: '' }));
  };

  const removeFrom = (list: 'stacks' | 'techList', index: number) =>
    setFormData((prev) => ({ ...prev, [list]: prev[list].filter((_, i) => i !== index) }));

  const onEnter = (fn: () => void) => (e: KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); fn(); }
  };

  const validateStep = (step: number): Errors => {
    const e: Errors = {};
    if (step === 0) {
      if (!formData.name.trim()) e.name = 'Informe seu nome.';
      if (!formData.bio.trim()) e.bio = 'Escreva uma bio curta.';
    }
    if (step === 3) {
      if (formData.projectLink && !URL_RE.test(formData.projectLink)) e.projectLink = 'Use um link completo, começando com https://';
      if (formData.projectImage && !URL_RE.test(formData.projectImage)) e.projectImage = 'Use um link completo, começando com https://';
    }
    if (step === 4) {
      if (!EMAIL_RE.test(formData.email)) e.email = 'Informe um e-mail válido.';
      (['github', 'linkedin', 'website'] as const).forEach((k) => {
        if (formData[k] && !URL_RE.test(formData[k])) e[k] = 'Use um link completo, começando com https://';
      });
    }
    return e;
  };

  const handleNext = () => {
    const found = validateStep(activeStep);
    setErrors(found);
    if (Object.keys(found).length) return;
    setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (activeStep < steps.length - 1) return handleNext();
    const found = validateStep(activeStep);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(result.error || 'Não foi possível salvar o portfólio. Tente novamente.');
        return;
      }
      toast.success('Portfólio publicado.');
      router.push(result.portfolio?.id ? `/devs/${result.portfolio.id}` : '/devs');
    } catch {
      toast.error('Falha de conexão. Seus dados continuam aqui; tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name: keyof FormData, label: string, extra: Record<string, unknown> = {}) => (
    <TextField
      name={name}
      label={label}
      value={formData[name] as string}
      onChange={handleChange}
      error={!!errors[name]}
      helperText={errors[name]}
      fullWidth
      {...extra}
    />
  );

  const icon = (node: React.ReactNode) => ({
    slotProps: { input: { startAdornment: <InputAdornment position="start">{node}</InputAdornment> } },
  });

  const listInput = (fieldName: 'stack' | 'technologies', list: 'stacks' | 'techList', label: string, placeholder: string) => (
    <Box sx={{ display: 'grid', gap: 1.5 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          name={fieldName}
          label={label}
          placeholder={placeholder}
          value={formData[fieldName]}
          onChange={handleChange}
          onKeyDown={onEnter(() => addTo(fieldName, list))}
          fullWidth
        />
        <IconButton onClick={() => addTo(fieldName, list)} aria-label={`Adicionar ${label.toLowerCase()}`} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '10px', width: 56, height: 56 }}>
          <AddIcon />
        </IconButton>
      </Box>
      {formData[list].length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData[list].map((v, i) => (
            <Chip key={v} label={v} onDelete={() => removeFrom(list, i)} size="small" />
          ))}
        </Box>
      )}
    </Box>
  );

  const stepContent = [
    <>
      {field('name', 'Nome completo', { autoComplete: 'name' })}
      {field('bio', 'Bio', { multiline: true, minRows: 3, placeholder: 'Ex.: Dev front-end focado em acessibilidade e interfaces rápidas.' })}
    </>,
    <>
      {listInput('stack', 'stacks', 'Stack', 'Front-end, Back-end, Mobile…')}
      {listInput('technologies', 'techList', 'Tecnologia', 'React, Node.js, PostgreSQL…')}
    </>,
    <>{field('experience', 'Experiência', { multiline: true, minRows: 5, placeholder: 'Ex.: 3 anos com React na Empresa X, liderando o redesign do checkout…' })}</>,
    <>
      {field('projectTitle', 'Título do projeto')}
      {field('projectDescription', 'Descrição', { multiline: true, minRows: 3 })}
      {field('projectLink', 'Link do projeto', { type: 'url', ...icon(<LinkIcon fontSize="small" />) })}
      {field('projectImage', 'URL da imagem de capa (opcional)', { type: 'url' })}
    </>,
    <>
      {field('email', 'E-mail para contato', { type: 'email', autoComplete: 'email', ...icon(<EmailOutlinedIcon fontSize="small" />) })}
      {field('github', 'GitHub', { type: 'url', placeholder: 'https://github.com/…', ...icon(<GitHubIcon fontSize="small" />) })}
      {field('linkedin', 'LinkedIn (opcional)', { type: 'url', ...icon(<LinkedInIcon fontSize="small" />) })}
      {field('website', 'Site pessoal (opcional)', { type: 'url', ...icon(<LinkIcon fontSize="small" />) })}
    </>,
  ];

  const isLast = activeStep === steps.length - 1;

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Container component="main" id="conteudo" maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, display: 'grid', gap: { xs: 5, md: 8 }, gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' }, alignItems: 'start' }}>
        <Box sx={{ position: { md: 'sticky' }, top: { md: 112 } }}>
          <Typography className="rise" sx={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'secondary.main', mb: 2 }}>
            etapa {activeStep + 1} de {steps.length}
          </Typography>
          <Typography component="h1" className="rise" style={{ ['--i' as string]: 1 }} sx={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05 }}>
            Monte seu portfólio
          </Typography>
          <Typography className="rise" style={{ ['--i' as string]: 2 }} sx={{ color: 'text.secondary', mt: 2, maxWidth: '40ch', fontSize: 17 }}>
            {HINTS[activeStep]}
          </Typography>
        </Box>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          className="rise"
          style={{ ['--i' as string]: 2 }}
          sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '20px', p: { xs: 3, sm: 4 }, display: 'grid', gap: 3 }}
        >
          <CustomStepper activeStep={activeStep} steps={steps} />

          <Typography component="h2" sx={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>
            {steps[activeStep]}
          </Typography>

          <Box key={activeStep} sx={{ display: 'grid', gap: 2.5, animation: 'rise .35s cubic-bezier(.2,.8,.2,1) both' }}>
            {stepContent[activeStep]}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
            <Button onClick={handleBack} disabled={activeStep === 0} sx={{ color: 'text.secondary' }}>
              ← Voltar
            </Button>
            {isLast ? (
              <Button type="submit" variant="contained" color="secondary" disabled={submitting} sx={{ minWidth: 150, height: 44 }}>
                {submitting ? <CircularProgress size={20} color="inherit" aria-label="Publicando" /> : 'Publicar portfólio'}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} variant="contained" color="primary" sx={{ minWidth: 120, height: 44 }}>
                Continuar →
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
