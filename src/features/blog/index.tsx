import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import useScrollToTop from '../../shared/hooks/useScrollToTop';
import { useSEO } from '../../shared/hooks/useSEO';

const BLOG_LD = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://coopehemp.cr/blog#webpage',
    name: 'Blog de Cáñamo — CoopeHemp R.L.',
    url: 'https://coopehemp.cr/blog',
    description: 'Artículos, noticias e investigaciones sobre el cáñamo, CBD, agricultura sostenible y el mercado hemp en Costa Rica y Latinoamérica.',
    publisher: { '@id': 'https://coopehemp.cr/#organization' },
    isPartOf: { '@id': 'https://coopehemp.cr/#website' },
    breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://coopehemp.cr/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://coopehemp.cr/blog' },
        ],
    },
};

const Blog = () => {
    useScrollToTop();
    const { t } = useTranslation();
    const [subscribed, setSubscribed] = useState(false);

    useSEO({
        title: 'Blog — Noticias y Artículos sobre Cáñamo',
        description: 'Descubre artículos, investigaciones y noticias sobre cáñamo, CBD, agricultura sostenible y el mercado hemp en Costa Rica. Blog oficial de CoopeHemp R.L.',
        path: '/blog',
        image: '/hemp-plant.jpg',
        type: 'article',
        structuredData: BLOG_LD,
    });
    const [email, setEmail] = useState('');

    const posts = [
        {
            id: 1,
            title: "Inicios de la Siembra",
            excerpt: "Descubre cómo nuestra comunidad se une para dar comienzo a una nueva temporada de cultivo, respetando los ciclos de la naturaleza.",
            image: "/blog/blog-hands-soil.jpg",
            category: "Comunidad",
            date: "15 Dic, 2024",
            author: "María Campos"
        },
        {
            id: 2,
            title: "Beneficios del Cáñamo",
            excerpt: "Exploramos las múltiples propiedades del cáñamo y cómo puede revolucionar la industria textil, medicinal y alimentaria.",
            image: "/blog/blog-hemp-leaves.jpg",
            category: "Educación",
            date: "10 Dic, 2024",
            author: "Dr. Roberto Solís"
        },
        {
            id: 3,
            title: "Innovación en Cultivos",
            excerpt: "Nuestros nuevos invernaderos están equipados con tecnología de punta para maximizar el rendimiento de manera sostenible.",
            image: "/blog/blog-greenhouse.jpg",
            category: "Tecnología",
            date: "05 Dic, 2024",
            author: "Ing. Carlos Ruiz"
        },
        {
            id: 4,
            title: "Cultivo Indoor: El Futuro",
            excerpt: "Ventajas y desafíos del cultivo en interiores. Cómo logramos calidad premium controlando cada aspecto del ambiente.",
            image: "/blog/blog-indoor-grow.jpg",
            category: "Cultivo",
            date: "28 Nov, 2024",
            author: "Ana Vega"
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setSubscribed(true);
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            {/* Header */}
            <div className="bg-green-900 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        {t('blog.title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-green-100 max-w-2xl mx-auto font-light"
                    >
                        {t('blog.subtitle')}
                    </motion.p>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-10">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {posts.map((post) => (
                        <motion.article
                            key={post.id}
                            variants={item}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-neutral-100 flex flex-col h-full"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-800 flex items-center gap-1 shadow-sm">
                                    <Tag className="w-3 h-3" />
                                    {post.category}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {post.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {post.author}
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>

                                <p className="text-neutral-600 text-sm mb-4 line-clamp-3 flex-grow">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-4 border-t border-neutral-100">
                                    <button className="text-green-700 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all group/btn">
                                        {t('blog.read_more')}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>

            {/* Newsletter */}
            <div className="max-w-4xl mx-auto px-4 mt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-neutral-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="relative z-10">
                        {subscribed ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-7 h-7 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold">¡Suscripción exitosa!</h3>
                                <p className="text-neutral-400">Pronto recibirás novedades de CoopeHemp.</p>
                            </motion.div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold mb-4">{t('blog.newsletter_title')}</h3>
                                <p className="text-neutral-400 mb-8 max-w-lg mx-auto">{t('blog.newsletter_desc')}</p>
                                <form
                                    className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                                    onSubmit={handleSubscribe}
                                >
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t('blog.newsletter_placeholder')}
                                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-500 transition-colors"
                                    >
                                        {t('blog.newsletter_btn')}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Blog;
