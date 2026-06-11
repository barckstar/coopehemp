import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, User, Tag, ArrowLeft, Share2, Check } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import useScrollToTop from '../../shared/hooks/useScrollToTop';
import { useSEO } from '../../shared/hooks/useSEO';
import { getBlogPost, type BlogPostFull } from '../../shared/api/blog';

const FALLBACK_IMG = '/hemp-plant.jpg';

function formatDate(iso: string | null, locale: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-CR', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}

// ---------------------------------------------------------------------------
// Markdown component styles (Tailwind prose-like without the prose plugin)
// ---------------------------------------------------------------------------
const MD_COMPONENTS: React.ComponentProps<typeof ReactMarkdown>['components'] = {
    h2: ({ children }) => (
        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">{children}</h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">{children}</h3>
    ),
    p: ({ children }) => (
        <p className="text-gray-700 leading-relaxed mb-5 text-[1.05rem]">{children}</p>
    ),
    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
    ul: ({ children }) => (
        <ul className="list-none space-y-2 mb-6 pl-0">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal list-inside space-y-2 mb-6 pl-2 text-gray-700">{children}</ol>
    ),
    li: ({ children }) => (
        <li className="flex items-start gap-2 text-gray-700">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-coope-green-500 shrink-0" />
            <span>{children}</span>
        </li>
    ),
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-coope-green-400 bg-coope-green-50 px-5 py-3 my-6 rounded-r-xl text-coope-green-900 italic">
            {children}
        </blockquote>
    ),
    table: ({ children }) => (
        <div className="overflow-x-auto my-6 rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">{children}</table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-coope-green-900 text-white">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-gray-100">{children}</tbody>,
    th: ({ children }) => <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">{children}</th>,
    td: ({ children }) => <td className="px-4 py-3 text-gray-700">{children}</td>,
    tr: ({ children }) => <tr className="even:bg-gray-50">{children}</tr>,
    code: ({ children }) => (
        <code className="bg-gray-100 text-coope-green-700 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
    ),
    a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-coope-green-600 underline underline-offset-2 hover:text-coope-green-800 transition-colors">
            {children}
        </a>
    ),
};

// ---------------------------------------------------------------------------

export default function BlogPost() {
    useScrollToTop();
    const { slug } = useParams<{ slug: string }>();
    const { lang } = useTranslation();
    const navigate = useNavigate();

    const [post, setPost] = useState<BlogPostFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useSEO({
        title: post?.title || 'Artículo',
        description: post?.excerpt || '',
        path: `/blog/${slug}`,
        image: post?.cover_image || FALLBACK_IMG,
        type: 'article',
    });

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        setError('');
        getBlogPost(slug, lang)
            .then(setPost)
            .catch(() => setError('Artículo no encontrado.'))
            .finally(() => setLoading(false));
    }, [slug, lang]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* ignore */ }
    };

    // ── Loading skeleton ─────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-white">
            <div className="h-[45vh] bg-gray-200 animate-pulse" />
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6" />
            </div>
        </div>
    );

    // ── Error ────────────────────────────────────────────────────────────────
    if (error || !post) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
            <p className="text-2xl font-bold text-gray-700">{error || 'Artículo no disponible'}</p>
            <Link to="/blog" className="inline-flex items-center gap-2 text-coope-green-600 font-semibold hover:underline">
                <ArrowLeft size={16} /> Volver al blog
            </Link>
        </div>
    );

    // ── Article ──────────────────────────────────────────────────────────────
    return (
        <article className="min-h-screen bg-white">
            {/* Hero image */}
            <div className="relative h-[50vh] lg:h-[58vh] overflow-hidden">
                <img
                    src={post.cover_image || FALLBACK_IMG}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-4 md:left-8 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                >
                    <ArrowLeft size={14} /> Blog
                </button>

                {/* Category badge */}
                <div className="absolute top-6 right-4 md:right-8 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <Tag size={11} />
                    {post.category}
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-8 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-bold text-white leading-tight"
                    >
                        {post.title}
                    </motion.h1>
                </div>
            </div>

            {/* Meta row */}
            <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <User size={14} className="text-coope-green-500" />
                        <strong className="text-gray-800">{post.author_name}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-coope-green-500" />
                        {formatDate(post.published_at, lang)}
                    </span>
                </div>

                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-coope-green-600 transition-colors"
                >
                    {copied ? <Check size={14} className="text-coope-green-500" /> : <Share2 size={14} />}
                    {copied ? 'Link copiado' : 'Compartir'}
                </button>
            </div>

            {/* Article body */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-3xl mx-auto px-4 md:px-6 py-10"
            >
                {/* Excerpt / lead */}
                <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-coope-green-400 pl-4">
                    {post.excerpt}
                </p>

                {/* Markdown content */}
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
                    {post.content}
                </ReactMarkdown>
            </motion.div>

            {/* Footer CTA */}
            <div className="bg-coope-green-900 text-white py-14 px-4 mt-8">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-coope-green-300 text-sm font-semibold tracking-widest uppercase mb-3">CoopeHemp R.L.</p>
                    <h2 className="text-2xl font-bold mb-4">¿Te interesa el cáñamo sostenible?</h2>
                    <p className="text-coope-green-100 mb-8 max-w-lg mx-auto">
                        Somos una cooperativa costarricense de productores. Contáctanos para conocer más.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft size={14} /> Más artículos
                        </Link>
                        <Link
                            to="/contacto"
                            className="inline-flex items-center gap-2 bg-coope-green-500 hover:bg-coope-green-400 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
                        >
                            Contáctanos
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
