import { motion } from 'framer-motion';
import { Heart, Sprout, Users, Rocket, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import useScrollToTop from '../../shared/hooks/useScrollToTop';
import { useSEO } from '../../shared/hooks/useSEO';

const handsImage = "/hemp-hands-soil.jpg";
const fiberImage = "/hemp-fiber-roll.jpg";
const leavesImage = "/hemp-leaves-vertical.jpg";
const gummiesImage = "/hemp-gummies.jpg";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const ABOUT_LD = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://coopehemp.cr/about#webpage',
    name: 'Sobre Nosotros — CoopeHemp R.L.',
    url: 'https://coopehemp.cr/about',
    description: 'Conoce la historia, misión, valores y equipo de CoopeHemp R.L., la cooperativa costarricense pionera en producción sostenible de cáñamo.',
    isPartOf: { '@id': 'https://coopehemp.cr/#website' },
    about: { '@id': 'https://coopehemp.cr/#organization' },
    breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://coopehemp.cr/' },
            { '@type': 'ListItem', position: 2, name: 'Sobre Nosotros', item: 'https://coopehemp.cr/about' },
        ],
    },
};

const About = () => {
    useScrollToTop();
    const { t } = useTranslation();

    useSEO({
        title: 'Sobre Nosotros — Nuestra Historia y Misión',
        description: 'Conoce CoopeHemp R.L.: más de 50 productores costarricenses comprometidos con el cáñamo 100% orgánico. Misión, valores, pilares estratégicos y equipo.',
        path: '/about',
        image: '/hemp-hands-soil.jpg',
        structuredData: ABOUT_LD,
    });

    const values = [
        { titleKey: 'about.v1_title', descKey: 'about.v1_desc' },
        { titleKey: 'about.v2_title', descKey: 'about.v2_desc' },
        { titleKey: 'about.v3_title', descKey: 'about.v3_desc' },
        { titleKey: 'about.v4_title', descKey: 'about.v4_desc' },
    ];

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={leavesImage}
                        alt="Hemp Leaves"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-coope-green-300 font-bold tracking-widest uppercase mb-4"
                    >
                        {t('about.hero_label')}
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        {t('about.hero_title1')} <span className="text-coope-green-400">{t('about.hero_title2')}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl max-w-2xl mx-auto text-gray-200"
                    >
                        {t('about.hero_sub')}
                    </motion.p>
                </div>
            </section>

            {/* Our Story / Intro */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div {...fadeIn} className="lg:w-1/2">
                            <h2 className="text-4xl font-bold mb-6 text-gray-900">
                                {t('about.story_title1')} <br />
                                <span className="text-coope-green-600">{t('about.story_title2')}</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                {t('about.story_p1')}
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                {t('about.story_p2')}
                            </p>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-4xl font-bold text-coope-green-600">50+</h3>
                                    <p className="text-sm text-gray-500 font-medium">{t('about.stat_producers')}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-4xl font-bold text-coope-green-600">100%</h3>
                                    <p className="text-sm text-gray-500 font-medium">{t('about.stat_organic')}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                                <img src={handsImage} alt="Hands in Soil" className="w-full object-cover h-[500px]" />
                            </div>
                            <div className="absolute top-10 -right-10 w-full h-full bg-coope-green-100/50 rounded-3xl -z-0" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Strategic Pillars */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900">{t('about.pillars_title')}</h2>
                        <p className="text-gray-600 text-lg">{t('about.pillars_sub')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="h-48 overflow-hidden">
                                <img src={fiberImage} alt="Sustainability" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-8">
                                <div className="w-12 h-12 bg-coope-earth-100 rounded-xl flex items-center justify-center text-coope-earth-600 mb-6">
                                    <Sprout size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{t('about.p1_title')}</h3>
                                <p className="text-gray-600">{t('about.p1_desc')}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="h-48 overflow-hidden">
                                <img src={gummiesImage} alt="Innovation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-8">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                                    <Rocket size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{t('about.p2_title')}</h3>
                                <p className="text-gray-600">{t('about.p2_desc')}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="h-48 overflow-hidden bg-coope-green-800 flex items-center justify-center text-white/20">
                                <Users size={64} />
                            </div>
                            <div className="p-8">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                    <Heart size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{t('about.p3_title')}</h3>
                                <p className="text-gray-600">{t('about.p3_desc')}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900">{t('about.team_title')}</h2>
                        <p className="text-gray-600 text-lg">{t('about.team_sub')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="text-center group">
                                <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <Users size={40} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Nombre Apellido</h3>
                                <p className="text-sm text-coope-green-600 font-medium">{t('about.team_role')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-coope-green-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">{t('about.values_title')}</h2>
                            <div className="space-y-6">
                                {values.map((val, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="mt-1 text-coope-green-400">
                                            <CheckCircle size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">
                                                {t(val.titleKey as Parameters<typeof t>[0])}
                                            </h3>
                                            <p className="text-gray-300">
                                                {t(val.descKey as Parameters<typeof t>[0])}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-[500px] overflow-hidden rounded-2xl relative">
                            <img src={leavesImage} alt="Values" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white/10 backdrop-blur-md p-8 rounded-full border border-white/20">
                                    <Award size={64} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-coope-green-900/50" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl font-bold mb-6">{t('about.cta_title')}</h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                        {t('about.cta_sub')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contacto"
                            className="bg-coope-green-500 hover:bg-coope-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            {t('about.cta_contact')} <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/productos"
                            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-colors flex items-center justify-center"
                        >
                            {t('about.cta_products')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
