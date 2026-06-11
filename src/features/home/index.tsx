import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowRight,
  Leaf,
  Droplet,
  Sun,
  Users,
  Star,
  ShoppingCart,
  Heart,
  Building2,
  CheckCircle,
  Sprout,
  FlaskConical,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import { useSEO } from '../../shared/hooks/useSEO';

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'Aceite CBD Espectro Completo',
    description: 'Formulado con cannabinoides naturales para alivio, bienestar y equilibrio profundo.',
    price: '$45.00',
    image: '/productos/product-hump-oil-tea.jpg',
    badge: 'Más vendido',
    stars: 5,
    category: 'Terapéutico',
  },
  {
    id: 2,
    name: 'Crema Facial de Cáñamo',
    description: 'Hidratación profunda con aceite de semilla de cáñamo. pH-balanceado, no comedogénico.',
    price: '$38.00',
    image: '/productos/product-beauty-cream.jpg',
    badge: 'Nuevo',
    stars: 5,
    category: 'Cosmética',
  },
  {
    id: 3,
    name: 'Pre-Rolls CBD Artesanales',
    description: 'Flores premium seleccionadas a mano, roladas en papel orgánico. Sin nicotina.',
    price: '$15.00',
    image: '/productos/product-prerolls.jpg',
    badge: 'Especial',
    stars: 4,
    category: 'Fumable',
  },
];

const MEDICAL_BENEFITS = [
  { icon: <Heart size={20} />, title: 'Antiinflamatorio', desc: 'El CBD inhibe las vías inflamatorias sin efectos secundarios gastrointestinales.' },
  { icon: <CheckCircle size={20} />, title: 'Ansiolítico natural', desc: 'Reduce el cortisol y potencia los receptores GABA del sistema nervioso.' },
  { icon: <Sprout size={20} />, title: 'Neuroprotector', desc: 'El CBG muestra efectos prometedores en neuroprotección y regeneración celular.' },
  { icon: <Droplet size={20} />, title: 'Sin psicoactividad', desc: 'THC inferior al 0.3%. Todos los beneficios, sin efectos psicoactivos.' },
];

const COSMETIC_BENEFITS = [
  'Imita los lípidos naturales de la piel (sebo)',
  'Regula la producción de grasa — ideal para piel mixta',
  'Rico en vitamina E: antioxidante potente',
  'No comedogénico: no obstruye los poros',
  'Apto para piel sensible, eczema y psoriasis',
];

const HEMPCRETE_STATS = [
  { value: '−1.6 t', label: 'CO₂ capturado por m³ al año' },
  { value: '3×', label: 'Más liviano que el concreto' },
  { value: '100%', label: 'Biodegradable y reciclable' },
  { value: '0', label: 'Toxinas ni VOCs emitidos' },
];

const PLANT_STAGES = [
  {
    id: 'semilla',
    phase: '01',
    icon: '🌱',
    title: 'La Semilla',
    subtitle: 'El superfood más completo del planeta',
    description:
      'Todo comienza aquí. La semilla de cáñamo concentra proteína completa con los 9 aminoácidos esenciales y omegas 3, 6 y 9 en la proporción ideal para el metabolismo humano, la misma que la leche materna.',
    facts: [
      '>30% proteína de alta biodisponibilidad',
      'Omega 3:6:9 en ratio óptimo 1:3:1',
      'Fuente de zinc, magnesio y hierro',
      'Sin gluten · apta para veganos',
    ],
    image: '/hemp-hands-soil.jpg',
    accent: '#22c55e',
  },
  {
    id: 'raiz',
    phase: '02',
    icon: '🪴',
    title: 'Raíz y Suelo',
    subtitle: 'Guardiana del ecosistema',
    description:
      'Las raíces penetran a 2+ metros, rompiendo suelos compactados y absorbiendo metales pesados en procesos de fitorremediación activa. El cáñamo no necesita pesticidas: su química natural repele plagas.',
    facts: [
      'Fitorremediación: absorbe metales pesados',
      'Sin pesticidas ni herbicidas',
      'Mejora la biodiversidad del suelo',
      'Captura CO₂ incluso en reposo',
    ],
    image: '/hands-soil-group.jpg',
    accent: '#f59e0b',
  },
  {
    id: 'fibra-bast',
    phase: '03',
    icon: '🧵',
    title: 'Fibra Bast',
    subtitle: 'La fibra más resistente de la naturaleza',
    description:
      'La corteza del tallo produce fibras largas y resistentes llamadas bast o cáñamon. Son la base de textiles técnicos, cuerdas industriales, papel de alta calidad y compuestos de bioingeniería para la industria automotriz.',
    facts: [
      '3× más resistente que el algodón',
      'Textiles antibacterianos naturales',
      'Papel sin talar un árbol',
      'Bioplásticos y compuestos de ingeniería',
    ],
    image: '/hemp-fiber-roll.jpg',
    accent: '#10b981',
  },
  {
    id: 'agramiza',
    phase: '04',
    icon: '🏗️',
    title: 'Agramiza / Hurd',
    subtitle: 'La materia prima del Hempcrete',
    description:
      'La médula leñosa interior del tallo se mezcla con cal hidráulica para producir Hempcrete: un material de construcción que se vuelve más resistente con el tiempo, es ignífugo, antibacterial y captura carbono de forma permanente.',
    facts: [
      'Captura 1.6 t de CO₂ por m³/año',
      'Aislamiento térmico y acústico superior',
      'Ignífugo y resistente a plagas',
      'Proyecto estrella de los asociados',
    ],
    image: '/hemp-field.jpg',
    accent: '#94a3b8',
  },
  {
    id: 'flor',
    phase: '05',
    icon: '🌸',
    title: 'La Flor',
    subtitle: 'La farmacia más compleja de la naturaleza',
    description:
      'Los tricomas de la flor sintetizan más de 100 cannabinoides distintos. CBD, CBG, CBN y terpenos trabajan en sinergia — el "efecto entourage" — potenciando exponencialmente cada beneficio terapéutico.',
    facts: [
      'CBD: antiinflamatorio y ansiolítico',
      'CBG: neuroprotector emergente',
      'Terpenos: aromaterapia terapéutica',
      'THC <0.3% — sin psicoactividad',
    ],
    image: '/hemp-leaves-vertical.jpg',
    accent: '#a855f7',
  },
  {
    id: 'extraccion',
    phase: '06',
    icon: '💧',
    title: 'Extracción & Productos',
    subtitle: 'De la planta al consumidor final',
    description:
      'Mediante extracción por CO₂ supercrítico, prensado en frío y procesos artesanales certificados, transformamos cada parte de la planta en productos de la más alta calidad para salud, cosmética y construcción.',
    facts: [
      'Aceites CBD espectro completo',
      'Cremas y cosméticos naturales',
      'Hempcrete para construcción sostenible',
      'Superfoods y suplementos deportivos',
    ],
    image: '/hemp-oil.jpg',
    accent: '#14b8a6',
  },
];

// ─── SEO Structured Data ───────────────────────────────────────────────────────

const HOME_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://coopehemp.cr/#webpage',
  name: 'CoopeHemp R.L. — Cooperativa de Cáñamo Sostenible · Costa Rica',
  url: 'https://coopehemp.cr/',
  description:
    'CoopeHemp R.L. es la cooperativa pionera en la producción sostenible de cáñamo en Costa Rica. Productos certificados de CBD, fibra, aceites y superfoods.',
  isPartOf: { '@id': 'https://coopehemp.cr/#website' },
  about: { '@id': 'https://coopehemp.cr/#organization' },
};

// ─── PlantJourney — flip 3D en eje Y por fase ────────────────────────────────

const IMG_VARIANTS = {
  enter: (dir: number) => ({
    rotateY: dir * -90,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    rotateY: dir * 90,
    opacity: 0,
    scale: 0.96,
  }),
};

const IMG_TRANSITION = { duration: 0.55, ease: [0.4, 0, 0.2, 1] as const };

const TEXT_VARIANTS = {
  enter: (dir: number) => ({ opacity: 0, y: dir * 20 }),
  center: { opacity: 1, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir * -20 }),
};

const TEXT_TRANSITION = { duration: 0.3, ease: 'easeOut' as const };

const PlantJourney = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const prevProgress = useRef(0);
  const direction = useRef(1); // 1 = scroll ↓, -1 = scroll ↑

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    direction.current = v >= prevProgress.current ? 1 : -1;
    prevProgress.current = v;
    const stage = Math.min(PLANT_STAGES.length - 1, Math.floor(v * PLANT_STAGES.length));
    setActiveStage(stage);
  });

  const current = PLANT_STAGES[activeStage];
  const dir = direction.current;

  return (
    <section
      ref={containerRef}
      aria-label="Anatomía de la Planta de Cáñamo"
      style={{ minHeight: `${PLANT_STAGES.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col lg:flex-row">

        {/* ── Panel izquierdo / superior (móvil): texto ── */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 lg:py-0
                        bg-coope-green-950 lg:w-[44%] flex-shrink-0 relative z-10
                        h-[48%] lg:h-full">

          {/* Línea de acento con color de la fase */}
          <div
            className="w-10 h-[3px] rounded-full mb-7 transition-colors duration-500"
            style={{ backgroundColor: current.accent }}
          />

          <p className="text-white/35 font-bold tracking-widest uppercase text-[10px] mb-5">
            Anatomía del Cáñamo &nbsp;·&nbsp; {current.phase} / {PLANT_STAGES.length}
          </p>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={activeStage}
              custom={dir}
              variants={TEXT_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={TEXT_TRANSITION}
            >
              {/* Badge de fase */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-white text-xs font-bold mb-5 border"
                style={{
                  backgroundColor: current.accent + '22',
                  borderColor: current.accent + '55',
                }}
              >
                <span className="text-base leading-none">{current.icon}</span>
                Fase {current.phase}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1.5 leading-tight">
                {current.title}
              </h2>
              <p className="text-sm font-semibold mb-4 transition-colors duration-500"
                 style={{ color: current.accent }}>
                {current.subtitle}
              </p>
              <p className="text-white/65 text-sm leading-relaxed mb-5 line-clamp-4 lg:line-clamp-none">
                {current.description}
              </p>

              <ul className="space-y-2">
                {current.facts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-white/75 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 transition-colors duration-500"
                      style={{ backgroundColor: current.accent }}
                    />
                    {fact}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {/* Barra de progreso por fase */}
          <div className="flex gap-1.5 mt-8">
            {PLANT_STAGES.map((s, i) => (
              <div
                key={s.id}
                className="h-[3px] rounded-full transition-all duration-500"
                style={{
                  width: i === activeStage ? '2rem' : '0.375rem',
                  backgroundColor: i === activeStage ? current.accent : 'rgba(255,255,255,0.18)',
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Panel derecho / inferior (móvil): imagen con flip 3D ── */}
        <div
          className="flex-1 relative overflow-hidden h-[52%] lg:h-full"
          style={{ perspective: '1400px' }}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={activeStage}
              custom={dir}
              variants={IMG_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={IMG_TRANSITION}
              style={{ transformOrigin: 'center center' }}
              className="absolute inset-0"
            >
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover"
              />

              {/* Tinte de color de fase sobre la imagen */}
              <div
                className="absolute inset-0 transition-colors duration-700 mix-blend-color"
                style={{ backgroundColor: current.accent + '40' }}
              />

              {/* Fusión con el panel de texto en desktop */}
              <div className="absolute inset-0 bg-gradient-to-r from-coope-green-950/70 lg:from-coope-green-950/20 via-transparent to-transparent" />

              {/* Número de fase en esquina (decorativo) */}
              <div
                className="absolute bottom-5 right-5 font-black text-7xl sm:text-8xl leading-none
                           select-none pointer-events-none opacity-10 transition-colors duration-500"
                style={{ color: current.accent }}
              >
                {current.phase}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicador de scroll */}
          {activeStage < PLANT_STAGES.length - 1 && (
            <div className="absolute bottom-4 right-5 z-10 pointer-events-none">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="text-white/30 text-xs uppercase tracking-widest text-right"
              >
                scroll ↓
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── Animations ────────────────────────────────────────────────────────────────

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6 },
};

// ─── Main Component ────────────────────────────────────────────────────────────

const Home = () => {
  const { t } = useTranslation();

  useSEO({
    title: 'Cooperativa de Cáñamo Sostenible · Costa Rica',
    description:
      'CoopeHemp R.L. es la cooperativa pionera en la producción sostenible de cáñamo en Costa Rica. Productos naturales de CBD, aceites, fibra y superfoods certificados.',
    path: '/',
    image: '/og-cover.jpg',
    structuredData: HOME_LD,
  });

  const benefits = [
    { icon: <Leaf size={36} />, titleKey: 'home.b1_title', descKey: 'home.b1_desc' },
    { icon: <Users size={36} />, titleKey: 'home.b2_title', descKey: 'home.b2_desc' },
    { icon: <Droplet size={36} />, titleKey: 'home.b3_title', descKey: 'home.b3_desc' },
    { icon: <Sun size={36} />, titleKey: 'home.b4_title', descKey: 'home.b4_desc' },
  ];

  return (
    <div className="flex flex-col">

      {/* ── 1. HERO ────────────────────────────────────────────────────── */}
      <section className="relative h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hemp-field.jpg" alt="Campos de cáñamo CoopeHemp Costa Rica" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center text-white">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-coope-green-300 font-semibold tracking-widest uppercase text-sm mb-6"
          >
            Costa Rica · CoopeHemp R.L.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight"
          >
            {t('home.hero_title1')} <br />
            <span className="text-coope-green-400">{t('home.hero_title2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-200 font-light"
          >
            {t('home.hero_subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/productos"
              className="bg-coope-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-coope-green-700 transition-all hover:scale-105 shadow-xl shadow-coope-green-900/30 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} /> Ver Productos
            </Link>
            <Link
              to="/about"
              className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
            >
              {t('home.hero_cta_secondary')}
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-9 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── 2. PRODUCT SHOWCASE ────────────────────────────────────────── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-coope-green-600 font-bold tracking-widest uppercase text-sm mb-3">
              Tienda CoopeHemp
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Productos que transforman tu bienestar
            </h2>
            <p className="text-gray-500 text-lg">
              Formulados con cáñamo 100% orgánico cultivado por nuestros asociados en Costa Rica.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {FEATURED_PRODUCTS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 border border-gray-100 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-coope-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {product.badge}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {product.category}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className={j < product.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                      />
                    ))}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{product.description}</p>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold text-coope-green-700">{product.price}</span>
                    <Link
                      to="/productos"
                      className="flex items-center gap-1.5 bg-coope-green-600 hover:bg-coope-green-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all hover:gap-2.5"
                    >
                      Comprar <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="text-center">
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 border-2 border-coope-green-600 text-coope-green-700 hover:bg-coope-green-600 hover:text-white px-8 py-4 rounded-full font-bold text-base transition-all group"
            >
              Ver catálogo completo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 3. PLANT JOURNEY PARALLAX ──────────────────────────────────── */}
      <PlantJourney />

      {/* ── 4. MEDICINAL / SALUD ───────────────────────────────────────── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/hemp-oil.jpg"
                  alt="Aceite de CBD terapéutico CoopeHemp"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coope-green-950/80 to-transparent flex items-end p-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <p className="text-white text-sm font-medium">+20,000 estudios científicos</p>
                    <p className="text-coope-green-300 text-xs mt-0.5">respaldan los beneficios del CBD</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:w-1/2"
            >
              <div className="flex flex-col gap-1 mb-4">
                <p className="text-gray-400 font-semibold tracking-widest uppercase text-[10px]">
                  Proyecto · Asociados CoopeHemp
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                    <FlaskConical size={18} className="text-red-500" />
                  </div>
                  <p className="text-red-500 font-bold tracking-widest uppercase text-sm">
                    Cáñamo Medicinal
                  </p>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                El poder terapéutico{' '}
                <span className="text-coope-green-600">del CBD</span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                El sistema endocannabinoide — presente en cada ser humano — regula el dolor, el estado de ánimo, el sueño y la respuesta inmune. El CBD activa sus receptores sin producir dependencia ni efectos psicoactivos.
              </p>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                Nuestros aceites de espectro completo preservan todos los cannabinoides, terpenos y flavonoides de la flor, potenciando el "efecto entourage" para resultados superiores.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {MEDICAL_BENEFITS.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-coope-green-50 transition-colors"
                  >
                    <div className="text-coope-green-600 mt-0.5 flex-shrink-0">{benefit.icon}</div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-0.5">{benefit.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/productos"
                className="inline-flex items-center gap-2 bg-coope-green-600 hover:bg-coope-green-700 text-white px-7 py-3.5 rounded-full font-bold transition-all hover:gap-3 group"
              >
                Ver aceites terapéuticos
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 5. COSMÉTICA ───────────────────────────────────────────────── */}
      <section className="py-24 bg-coope-green-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full bg-coope-green-200/50 rounded-3xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/productos/product-beauty-cream.jpg"
                    alt="Cosmética natural de cáñamo CoopeHemp"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-coope-green-900/60 flex items-end p-8">
                    <div className="flex flex-wrap gap-2">
                      {['CBD', 'Omega-3', 'Vitamina E', 'Natural'].map((tag) => (
                        <span
                          key={tag}
                          className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:w-1/2"
            >
              <div className="flex flex-col gap-1 mb-4">
                <p className="text-gray-400 font-semibold tracking-widest uppercase text-[10px]">
                  Proyecto · Asociados CoopeHemp
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                    <Leaf size={18} className="text-pink-500" />
                  </div>
                  <p className="text-pink-500 font-bold tracking-widest uppercase text-sm">
                    Cosmética Natural
                  </p>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                Tu piel merece{' '}
                <span className="text-coope-green-600">lo mejor de la naturaleza</span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                El aceite de semilla de cáñamo tiene un perfil lipídico que imita los lípidos naturales del manto dérmico, lo que lo hace excepcionalmente compatible con la piel humana — hidrata sin obstruir ni alterar el microbioma cutáneo.
              </p>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                Nuestra línea cosmética está libre de parabenos, sulfatos y silicones. Solo activos naturales que respetan tu piel y el planeta.
              </p>

              <ul className="space-y-3 mb-8">
                {COSMETIC_BENEFITS.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                    <CheckCircle size={16} className="text-coope-green-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <Link
                to="/productos"
                className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-7 py-3.5 rounded-full font-bold transition-all hover:gap-3 group"
              >
                Explorar línea cosmética
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. HEMPCRETE ───────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-20">
          <img src="/hemp-fiber-roll.jpg" alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/70" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Building2 size={18} className="text-amber-400" />
                </div>
                <p className="text-amber-400 font-bold tracking-widest uppercase text-sm">
                  Proyecto · Asociados CoopeHemp
                </p>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
                Hempcrete:{' '}
                <span className="text-amber-400">Construir con la naturaleza</span>
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                La agramiza (médula del tallo de cáñamo) mezclada con cal hidráulica produce Hempcrete: un material de construcción biocompuesto que es más liviano que el concreto, secuestra carbono de forma permanente y mejora con el tiempo.
              </p>
              <p className="text-gray-400 text-base leading-relaxed mb-10">
                Mientras el concreto convencional emite CO₂, el Hempcrete lo captura. Es el único material de construcción con huella de carbono negativa, volviéndose más resistente cada año gracias a la mineralización natural de la cal.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {HEMPCRETE_STATS.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5"
                  >
                    <p className="text-2xl font-bold text-amber-400 mb-1">{stat.value}</p>
                    <p className="text-gray-400 text-sm leading-snug">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/contacto"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 px-7 py-3.5 rounded-full font-bold transition-all hover:gap-3 group"
              >
                Conocer el proyecto
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Visual card stack */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:w-1/2 flex flex-col gap-5"
            >
              {[
                {
                  icon: '🌿',
                  title: 'Agramiza de cáñamo',
                  desc: 'La médula leñosa del tallo triturada — el 70% de la biomasa de la planta — se mezcla con cal para crear el compuesto.',
                },
                {
                  icon: '🏗️',
                  title: 'Carbonatación natural',
                  desc: 'Con el tiempo la cal reacciona con el CO₂ del aire y con el sílice de la agramiza, volviéndose pietra — piedra — cada vez más dura.',
                },
                {
                  icon: '♻️',
                  title: 'Ciclo de vida completo',
                  desc: 'Al final de su vida útil, el Hempcrete puede compostarse, volviéndose abono para nuevos cultivos de cáñamo.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-bold text-white mb-1">{item.title}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 7. BENEFITS ────────────────────────────────────────────────── */}
      <section className="py-24 bg-coope-green-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white p-7 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-coope-green-100/50 group"
              >
                <div className="w-14 h-14 bg-coope-green-100 rounded-2xl flex items-center justify-center text-coope-green-600 mb-5 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">
                  {t(item.titleKey as Parameters<typeof t>[0])}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {t(item.descKey as Parameters<typeof t>[0])}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. MISSION ─────────────────────────────────────────────────── */}
      <section className="py-24 overflow-hidden bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/hemp-hands-soil.jpg"
                  alt="Productores CoopeHemp Costa Rica"
                  className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <p className="text-white text-lg font-medium">Más de 50 familias productoras</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:w-1/2"
            >
              <p className="text-coope-green-600 font-bold tracking-widest uppercase text-sm mb-4">
                {t('home.mission_label')}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight">
                {t('home.mission_title')}{' '}
                <span className="text-coope-earth-600">{t('home.mission_cr')}</span>
              </h2>
              <p className="text-lg text-gray-600 mb-5 leading-relaxed">{t('home.mission_p1')}</p>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">{t('home.mission_p2')}</p>
              <Link
                to="/about"
                className="text-coope-green-700 font-bold text-lg flex items-center gap-2 hover:gap-4 transition-all group"
              >
                {t('home.mission_link')}
                <ArrowRight size={20} className="group-hover:text-coope-green-500 transition-colors" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 9. CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-coope-green-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-coope-green-800/30 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('home.cta_title')}</h2>
          <p className="text-xl text-coope-green-200 mb-10 max-w-2xl mx-auto">{t('home.cta_sub')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 bg-white text-coope-green-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-coope-green-50 transition-colors shadow-lg"
            >
              {t('home.cta_btn')} <ArrowRight size={20} />
            </Link>
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 bg-coope-green-800 hover:bg-coope-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
            >
              <ShoppingCart size={20} /> Tienda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
