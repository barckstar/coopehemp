import { Heart, CheckCircle, Sprout, Droplet } from 'lucide-react';
import type { ReactNode } from 'react';

// Config ESTRUCTURAL de Home (no traducible): iconos, colores, rutas de imagen, ids.
// El TEXTO de cada sección vive en i18n (es.json / en.json → home.*).

export type PlantStage = {
  id: string;
  phase: string;
  icon: string;
  image: string;
  accent: string;
};

// Etapas de la planta. Texto en: home.stages.<id>.{title,subtitle,description,facts}
export const PLANT_STAGES: PlantStage[] = [
  { id: 'semilla',    phase: '01', icon: '🌱', image: '/hemp-hands-soil.jpg',      accent: '#22c55e' },
  { id: 'raiz',       phase: '02', icon: '🪴', image: '/hands-soil-group.jpg',     accent: '#f59e0b' },
  { id: 'fibra-bast', phase: '03', icon: '🧵', image: '/hemp-fiber-roll.jpg',      accent: '#10b981' },
  { id: 'agramiza',   phase: '04', icon: '🏗️', image: '/hemp-field.jpg',           accent: '#94a3b8' },
  { id: 'flor',       phase: '05', icon: '🌸', image: '/hemp-leaves-vertical.jpg', accent: '#a855f7' },
  { id: 'extraccion', phase: '06', icon: '💧', image: '/hemp-oil.jpg',             accent: '#14b8a6' },
];

// Beneficios medicinales: solo el icono (estructural). Texto en: home.medical_items.<id>.{title,desc}
export const MEDICAL_ITEMS: { id: string; icon: ReactNode }[] = [
  { id: 'antiinflamatorio',  icon: <Heart size={20} /> },
  { id: 'ansiolitico',       icon: <CheckCircle size={20} /> },
  { id: 'neuroprotector',    icon: <Sprout size={20} /> },
  { id: 'sin-psicoactividad', icon: <Droplet size={20} /> },
];
