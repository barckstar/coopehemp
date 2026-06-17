import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import useScrollToTop from '../../shared/hooks/useScrollToTop';
import { useSEO } from '../../shared/hooks/useSEO';
import { listBlogPosts, type BlogPostSummary } from '../../shared/api/blog';
import { subscribeNewsletter } from '../../shared/api/newsletter';

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

const FALLBACK_IMAGE = '/hemp-plant.jpg';
const CATEGORIES = ['', 'Comunidad', 'Educación', 'Tecnología', 'Cultivo', 'Medicinal', 'Cosmética', 'Construcción', 'Normativa', 'Nutrición', 'Mercado'];
const LIMIT = 9;

function formatDate(iso: string | null, locale: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-CR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PostCard({ post, locale }: { post: BlogPostSummary; locale: string }) {
    const { t } = useTranslation();
    const image = post.cover_image || FALLBACK_IMAGE;

    return (
        <Link to={`/blog/${post.slug}`} className="block h-full">
            <motion.article
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-neutral-100 flex flex-col h-full"
            >
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
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
                            {formatDate(post.published_at, locale)}
                        </div>
                        <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author_name}
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
                        {post.title}
                    </h2>

                    <p className="text-neutral-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {post.excerpt}
                    </p>

                    <div className="mt-auto pt-4 border-t border-neutral-100">
                        <span className="text-green-700 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            {t('blog.read_more')}
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-neutral-100 animate-pulse">
            <div className="h-48 bg-neutral-200" />
            <div className="p-6 space-y-3">
                <div className="h-3 bg-neutral-200 rounded w-1/3" />
                <div className="h-5 bg-neutral-200 rounded w-3/4" />
                <div className="h-5 bg-neutral-200 rounded w-1/2" />
                <div className="h-3 bg-neutral-200 rounded" />
                <div className="h-3 bg-neutral-200 rounded w-5/6" />
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const Blog = () => {
    useScrollToTop();
    const { t, lang: language } = useTranslation();

    useSEO({
        title: 'Blog — Noticias y Artículos sobre Cáñamo',
        description: 'Descubre artículos, investigaciones y noticias sobre cáñamo, CBD, agricultura sostenible y el mercado hemp en Costa Rica. Blog oficial de CoopeHemp R.L.',
        path: '/blog',
        image: '/hemp-plant.jpg',
        type: 'article',
        structuredData: BLOG_LD,
    });

    const [posts, setPosts] = useState<BlogPostSummary[]>([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
    const [subMessage, setSubMessage] = useState('');

    const totalPages = Math.ceil(count / LIMIT);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await listBlogPosts({ locale: language, category: category || undefined, page, limit: LIMIT });
            setPosts(res.posts);
            setCount(res.count);
        } catch {
            setError('No se pudieron cargar los artículos. Verificá tu conexión.');
        } finally {
            setLoading(false);
        }
    }, [language, category, page]);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    // Reset to page 1 on filter change
    const handleCategoryChange = (cat: string) => {
        setCategory(cat);
        setPage(1);
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setSubStatus('loading');
        setSubMessage('');
        try {
            const res = await subscribeNewsletter(email, language);
            setSubStatus('ok');
            setSubMessage(res.message);
            setEmail('');
        } catch (err: unknown) {
            setSubStatus('error');
            setSubMessage(err instanceof Error ? err.message : 'Error al suscribirse.');
        }
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

            {/* Category filter */}
            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat || 'all'}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                            category === cat
                                ? 'bg-green-700 text-white shadow-md'
                                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-green-400 hover:text-green-700'
                        }`}
                    >
                        {cat || (language === 'en' ? 'All' : 'Todos')}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4">
                {error ? (
                    <div className="text-center py-20">
                        <p className="text-neutral-500 mb-4">{error}</p>
                        <button
                            onClick={fetchPosts}
                            className="inline-flex items-center gap-2 text-green-700 font-medium hover:underline"
                        >
                            <RefreshCw className="w-4 h-4" /> Reintentar
                        </button>
                    </div>
                ) : loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-neutral-500">
                        {language === 'en' ? 'No posts found.' : 'No hay artículos en esta categoría.'}
                    </div>
                ) : (
                    <>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${category}-${page}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {posts.map((post) => (
                                    <PostCard key={post.id} post={post} locale={language} />
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-12">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-600 hover:border-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    ← {language === 'en' ? 'Prev' : 'Anterior'}
                                </button>
                                <span className="text-sm text-neutral-500">
                                    {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-600 hover:border-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    {language === 'en' ? 'Next' : 'Siguiente'} →
                                </button>
                            </div>
                        )}
                    </>
                )}
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
                        {subStatus === 'ok' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-7 h-7 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold">{subMessage || '¡Suscripción exitosa!'}</h3>
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
                                        disabled={subStatus === 'loading'}
                                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {subStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {t('blog.newsletter_btn')}
                                    </button>
                                </form>
                                {subStatus === 'error' && (
                                    <p className="mt-4 text-red-400 text-sm">{subMessage}</p>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Blog;
