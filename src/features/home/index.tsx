import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Droplet, Sun, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Home = () => {
  const { t } = useTranslation();

  const benefits = [
    { icon: <Leaf size={36} />, titleKey: 'home.b1_title', descKey: 'home.b1_desc' },
    { icon: <Users size={36} />, titleKey: 'home.b2_title', descKey: 'home.b2_desc' },
    { icon: <Droplet size={36} />, titleKey: 'home.b3_title', descKey: 'home.b3_desc' },
    { icon: <Sun size={36} />, titleKey: 'home.b4_title', descKey: 'home.b4_desc' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hemp-field.jpg" alt="Hemp Field" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
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
              to="/contacto"
              className="bg-coope-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-coope-green-700 transition-all hover:scale-105 shadow-xl shadow-coope-green-900/30 flex items-center justify-center gap-2"
            >
              {t('home.hero_cta_primary')} <ArrowRight size={20} />
            </Link>
            <Link
              to="/about"
              className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
            >
              {t('home.hero_cta_secondary')}
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
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

      {/* Benefits */}
      <section className="py-24 bg-coope-green-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
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

      {/* Mission */}
      <section className="py-24 overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div {...fadeInUp} className="lg:w-1/2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/hemp-oil.jpg"
                  alt="Hemp Oil"
                  className="w-full h-[560px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <p className="text-white text-lg font-medium">Extractos puros y naturales</p>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="lg:w-1/2">
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

      {/* Products Preview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">{t('home.products_title')}</h2>
            <p className="text-gray-500 text-lg">{t('home.products_sub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl overflow-hidden h-[480px] shadow-xl"
            >
              <img
                src="/hemp-gummies.jpg"
                alt="Comestibles"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Comestibles & Superfoods</h3>
                <p className="text-gray-300 mb-5 text-sm">Nutrición deliciosa y saludable.</p>
                <Link
                  to="/productos"
                  className="bg-white text-gray-900 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-coope-green-50 transition-colors inline-block"
                >
                  Ver Productos
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl overflow-hidden h-[480px] shadow-xl bg-coope-green-900"
            >
              <img
                src="/hemp-oil.jpg"
                alt="CBD Oil"
                className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-start p-10">
                <h3 className="text-2xl font-bold text-white mb-3">Aceites & Terapéuticos</h3>
                <p className="text-coope-green-100 mb-7 max-w-xs text-sm leading-relaxed">
                  Bienestar natural con nuestros aceites de CBD de espectro completo y fórmulas terapéuticas.
                </p>
                <Link
                  to="/productos"
                  className="border-2 border-white text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-white hover:text-coope-green-900 transition-colors"
                >
                  Explorar Línea
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-coope-green-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-coope-green-800/30 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('home.cta_title')}</h2>
          <p className="text-xl text-coope-green-200 mb-10 max-w-2xl mx-auto">{t('home.cta_sub')}</p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 bg-white text-coope-green-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-coope-green-50 transition-colors shadow-lg"
          >
            {t('home.cta_btn')} <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
