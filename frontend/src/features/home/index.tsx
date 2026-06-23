import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Leaf,
  Droplet,
  Sun,
  Users,
  Star,
  ShoppingCart,
  Building2,
  CheckCircle,
  FlaskConical,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import { useSEO } from '../../shared/hooks/useSEO';
import { getProducts, getRegions } from '../../shared/api/medusa-store';
import { useCart } from '../cart/CartContext';
import { PLANT_STAGES, MEDICAL_ITEMS } from './home.data';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface FeaturedProduct {
  id: string;
  variantId?: string;
  name: string;
  description: string;
  price: string;
  priceNumeric: number;
  image: string;
  category: string;
}

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

// ─── PlantJourney — scrub de frames + cards por fase ─────────────────────────

// Secuencia de frames (placeholder generado): la planta "madura" de forma
// continua con el scroll. 60 frames ÷ 6 fases = 10 frames por card.
// Para usar los reales: reemplazar los .svg en /public/frames por .webp y
// cambiar la extensión aquí.
const TOTAL_FRAMES = 60;
const FRAMES_PER_STAGE = TOTAL_FRAMES / PLANT_STAGES.length;
const FRAME_SRCS = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `/frames/frame-${String(i + 1).padStart(2, '0')}.svg`
);

const TEXT_VARIANTS = {
  enter: (dir: number) => ({ opacity: 0, y: dir * 20 }),
  center: { opacity: 1, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir * -20 }),
};

const TEXT_TRANSITION = { duration: 0.3, ease: 'easeOut' as const };

const PlantJourney = () => {
  const { t, tRaw } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [frame, setFrame] = useState(0);
  const prevProgress = useRef(0);
  const direction = useRef(1); // 1 = scroll ↓, -1 = scroll ↑

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Relleno continuo del tallo: refleja el scroll exactamente (0 → 100%)
  const growth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Precargar todos los frames para que el scrub sea instantáneo (sin parpadeo).
  useEffect(() => {
    FRAME_SRCS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    direction.current = v >= prevProgress.current ? 1 : -1;
    prevProgress.current = v;
    // Frame continuo (0 → 59) ligado al scroll: la imagen "madura" al scrollear.
    const idx = Math.min(TOTAL_FRAMES - 1, Math.round(v * (TOTAL_FRAMES - 1)));
    setFrame(idx);
    // La card de texto cambia cada 10 frames.
    const stage = Math.min(
      PLANT_STAGES.length - 1,
      Math.floor(idx / FRAMES_PER_STAGE)
    );
    setActiveStage(stage);
  });

  // Saltar directo a una fase (para quien no quiere recorrer todo el scroll)
  const goToStage = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const target =
      el.offsetTop +
      ((i + 0.5) / PLANT_STAGES.length) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
  };

  const total = PLANT_STAGES.length;
  const base = PLANT_STAGES[activeStage];
  const current = {
    ...base,
    title: t(`home.stages.${base.id}.title`),
    subtitle: t(`home.stages.${base.id}.subtitle`),
    description: t(`home.stages.${base.id}.description`),
    facts: tRaw<string[]>(`home.stages.${base.id}.facts`) ?? [],
  };
  // eslint-disable-next-line react-hooks/refs -- lectura intencional de la dirección de scroll para la animación
  const dir = direction.current;

  return (
    <section
      ref={containerRef}
      aria-label="Anatomía de la Planta de Cáñamo"
      style={{ minHeight: `${total * 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col lg:flex-row bg-coope-green-950">

        {/* ════ BARRA SUPERIOR (solo móvil): progreso ligado al scroll ════ */}
        <div className="lg:hidden flex-shrink-0 px-5 pt-4 pb-3 bg-coope-green-950 z-20">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-white/40 font-bold tracking-widest uppercase text-[10px]">
              {t('home.anatomy')}
            </p>
            <p className="text-white font-bold text-xs tabular-nums">
              <span style={{ color: current.accent }}>{current.phase}</span>
              <span className="text-white/30"> / 0{total}</span>
            </p>
          </div>
          <div className="relative h-[3px] w-full rounded-full bg-white/15 overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ width: growth, backgroundColor: current.accent }}
            />
          </div>
        </div>

        {/* ════ RIEL-TALLO (solo desktop): el cáñamo crece al scrollear ════ */}
        <div className="hidden lg:flex flex-col items-center justify-center w-20 flex-shrink-0 bg-coope-green-950 relative z-20">
          <div className="relative h-[64%] w-[3px] rounded-full bg-white/12">
            {/* tallo que crece con el scroll */}
            <motion.div
              className="absolute left-0 top-0 w-full rounded-full bg-gradient-to-b from-coope-green-400 to-coope-green-600"
              style={{ height: growth }}
            />
            {/* brote en la punta del tallo */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm select-none pointer-events-none"
              style={{ top: growth }}
            >
              🌱
            </motion.div>
            {/* nodos clickeables de cada fase */}
            {PLANT_STAGES.map((s, i) => {
              const reached = i <= activeStage;
              return (
                <button
                  key={s.id}
                  onClick={() => goToStage(i)}
                  aria-label={`${t('home.phase')} ${s.phase}: ${t(`home.stages.${s.id}.title`)}`}
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-[11px] border transition-all duration-500 hover:scale-125"
                  style={{
                    top: `${((i + 0.5) / total) * 100}%`,
                    backgroundColor: reached ? s.accent : 'rgba(8,35,22,1)',
                    borderColor: reached ? s.accent : 'rgba(255,255,255,0.2)',
                    boxShadow: i === activeStage ? `0 0 0 4px ${s.accent}33` : 'none',
                  }}
                >
                  <span className={reached ? 'opacity-100' : 'opacity-40'}>{s.icon}</span>
                </button>
              );
            })}
          </div>
          <span className="absolute bottom-6 text-white/25 text-[9px] font-bold tracking-[0.25em] uppercase [writing-mode:vertical-rl]">
            {t('home.scroll')}
          </span>
        </div>

        {/* ── Panel de texto ── */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-5 lg:py-0
                        bg-coope-green-950 lg:w-[42%] flex-shrink-0 relative z-10
                        flex-1 lg:flex-none min-h-0 overflow-hidden">

          <div
            className="hidden lg:block w-10 h-[3px] rounded-full mb-7 transition-colors duration-500"
            style={{ backgroundColor: current.accent }}
          />

          <p className="hidden lg:block text-white/35 font-bold tracking-widest uppercase text-[10px] mb-5">
            {t('home.anatomy')} &nbsp;·&nbsp; {current.phase} / 0{total}
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
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-white text-xs font-bold mb-4 lg:mb-5 border"
                style={{
                  backgroundColor: current.accent + '22',
                  borderColor: current.accent + '55',
                }}
              >
                <span className="text-base leading-none">{current.icon}</span>
                {t('home.phase')} {current.phase}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1.5 leading-tight">
                {current.title}
              </h2>
              <p className="text-sm font-semibold mb-3 lg:mb-4 transition-colors duration-500"
                 style={{ color: current.accent }}>
                {current.subtitle}
              </p>
              <p className="text-white/65 text-sm leading-relaxed mb-4 lg:mb-5 line-clamp-3 sm:line-clamp-4 lg:line-clamp-none">
                {current.description}
              </p>

              <ul className="space-y-1.5 lg:space-y-2">
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
        </div>

        {/* ── Panel de imagen: scrub de frames ligado al scroll ── */}
        <div className="flex-1 relative overflow-hidden h-[42%] lg:h-full min-h-0">
          {/* Secuencia de frames: la imagen "madura" de forma continua al scrollear */}
          <img
            src={FRAME_SRCS[frame]}
            alt={current.title}
            className="absolute inset-0 w-full h-full object-cover select-none"
            draggable={false}
          />

          {/* Tinte de color de fase sobre la imagen */}
          <div
            className="absolute inset-0 transition-colors duration-700 mix-blend-color pointer-events-none"
            style={{ backgroundColor: current.accent + '40' }}
          />

          {/* Fusión con el panel de texto en desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-coope-green-950/70 lg:from-coope-green-950/20 via-transparent to-transparent pointer-events-none" />

          {/* Número de fase en esquina (decorativo) */}
          <div
            className="absolute bottom-5 right-5 font-black text-7xl sm:text-8xl leading-none
                       select-none pointer-events-none opacity-10 transition-colors duration-500"
            style={{ color: current.accent }}
          >
            {current.phase}
          </div>

          {/* ════ AVISO DE ENTRADA: "seguí bajando" — solo en la 1ª fase ════ */}
          <AnimatePresence>
            {activeStage === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none px-4"
              >
                <div className="bg-black/45 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 shadow-xl">
                  <span className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">
                    {t('home.keep_scrolling', { n: String(total) })}
                  </span>
                </div>
                <motion.div
                  animate={{ y: [0, 7, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  className="flex flex-col items-center -space-y-2 text-white/90"
                >
                  <ChevronDown size={22} strokeWidth={2.5} />
                  <ChevronDown size={22} strokeWidth={2.5} className="opacity-40" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ════ AVISO DE SALIDA: fin del recorrido ════ */}
          <AnimatePresence>
            {activeStage === total - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4"
              >
                <div className="bg-black/45 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 flex items-center gap-2 shadow-xl">
                  <CheckCircle size={15} className="text-coope-green-300" />
                  <span className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">
                    Recorrido completo · seguí para ver más
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
  const { t, tRaw } = useTranslation();
  const { addItem, openCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { regions } = await getRegions();
        const region = regions.find(r => r.currency_code === 'crc') ?? regions[0];
        const { products } = await getProducts({ region_id: region?.id, limit: 20 });
        if (products.length === 0) return;
        const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 3);
        const currency = shuffled[0]?.variants?.[0]?.calculated_price?.currency_code ?? region?.currency_code ?? 'crc';
        setFeaturedProducts(shuffled.map(p => {
          const variant = p.variants?.[0];
          const rawAmount = variant?.calculated_price?.calculated_amount ?? 0;
          const priceNum = rawAmount / 100;
          return {
            id: p.id,
            variantId: variant?.id,
            name: p.title,
            description: p.description ?? '',
            price: rawAmount > 0
              ? new Intl.NumberFormat('es-CR', {
                  style: 'currency',
                  currency: currency.toUpperCase(),
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(priceNum)
              : t('home.price_ask'),
            priceNumeric: priceNum,
            image: p.thumbnail ?? '/hemp-plant.jpg',
            category: p.tags?.[0]?.value ?? t('home.category_fallback'),
          };
        }));
      } catch {
        // backend unavailable — section stays empty, no fallback needed
      }
    })();
  }, []);

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
            {t('home.hero_tag')}
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
              <ShoppingCart size={20} /> {t('home.hero_cta_products')}
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
              {t('home.showcase_label')}
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.showcase_title')}
            </h2>
            <p className="text-gray-500 text-lg">
              {t('home.showcase_sub')}
            </p>
          </motion.div>

          {featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.12, duration: 0.55 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 border border-gray-100 flex flex-col"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/hemp-plant.jpg'; }}
                    />
                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <span className="text-2xl font-bold text-coope-green-700">{product.price}</span>
                      <button
                        onClick={() => {
                          addItem({
                            id: i + 100,
                            variantId: product.variantId,
                            name: product.name,
                            price: product.priceNumeric,
                            image: product.image,
                            category: product.category,
                          });
                          openCart();
                          setAddedId(product.id);
                          setTimeout(() => setAddedId(null), 1800);
                        }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                          addedId === product.id
                            ? 'bg-coope-green-700 text-white gap-2'
                            : 'bg-coope-green-600 hover:bg-coope-green-700 text-white hover:gap-2.5'
                        }`}
                      >
                        {addedId === product.id ? (
                          <><CheckCircle size={15} /> {t('home.added')}</>
                        ) : (
                          <>{t('home.buy')} <ArrowRight size={15} /></>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div {...fadeInUp} className="text-center">
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 border-2 border-coope-green-600 text-coope-green-700 hover:bg-coope-green-600 hover:text-white px-8 py-4 rounded-full font-bold text-base transition-all group"
            >
              {t('home.showcase_all')}
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
                    <p className="text-white text-sm font-medium">{t('home.medical_badge1')}</p>
                    <p className="text-coope-green-300 text-xs mt-0.5">{t('home.medical_badge2')}</p>
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
                  {t('home.project_label')}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                    <FlaskConical size={18} className="text-red-500" />
                  </div>
                  <p className="text-red-500 font-bold tracking-widest uppercase text-sm">
                    {t('home.medical_label')}
                  </p>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                {t('home.medical_title1')}{' '}
                <span className="text-coope-green-600">{t('home.medical_title2')}</span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                {t('home.medical_p1')}
              </p>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                {t('home.medical_p2')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {MEDICAL_ITEMS.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="flex gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-coope-green-50 transition-colors"
                  >
                    <div className="text-coope-green-600 mt-0.5 flex-shrink-0">{benefit.icon}</div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-0.5">{t(`home.medical_items.${benefit.id}.title`)}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{t(`home.medical_items.${benefit.id}.desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/productos"
                className="inline-flex items-center gap-2 bg-coope-green-600 hover:bg-coope-green-700 text-white px-7 py-3.5 rounded-full font-bold transition-all hover:gap-3 group"
              >
                {t('home.medical_cta')}
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
                  {t('home.project_label')}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                    <Leaf size={18} className="text-pink-500" />
                  </div>
                  <p className="text-pink-500 font-bold tracking-widest uppercase text-sm">
                    {t('home.cosmetic_label')}
                  </p>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                {t('home.cosmetic_title1')}{' '}
                <span className="text-coope-green-600">{t('home.cosmetic_title2')}</span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                {t('home.cosmetic_p1')}
              </p>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                {t('home.cosmetic_p2')}
              </p>

              <ul className="space-y-3 mb-8">
                {(tRaw<string[]>('home.cosmetic_benefits') ?? []).map((benefit, i) => (
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
                {t('home.cosmetic_cta')}
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
                  {t('home.project_label')}
                </p>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
                {t('home.hempcrete_title1')}{' '}
                <span className="text-amber-400">{t('home.hempcrete_title2')}</span>
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                {t('home.hempcrete_p1')}
              </p>
              <p className="text-gray-400 text-base leading-relaxed mb-10">
                {t('home.hempcrete_p2')}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {(tRaw<{ value: string; label: string }[]>('home.hempcrete_stats') ?? []).map((stat, i) => (
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
                {t('home.hempcrete_cta')}
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
              {(tRaw<{ icon: string; title: string; desc: string }[]>('home.hempcrete_cards') ?? []).map((item, i) => (
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
                  <p className="text-white text-lg font-medium">{t('home.mission_caption')}</p>
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

      {/* ── 10. CTA ────────────────────────────────────────────────────── */}
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
              <ShoppingCart size={20} /> {t('home.cta_store')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
