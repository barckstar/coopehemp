import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Star, ArrowRight, Leaf, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import useScrollToTop from '../../shared/hooks/useScrollToTop';
import { useSEO } from '../../shared/hooks/useSEO';
import { useCart } from '../cart/CartContext';
import { getProducts, getRegions, type MedusaProduct } from '../../shared/api/medusa-store';

// ─── SEO structured data ──────────────────────────────────────────────────────

const PRODUCTS_LD = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://coopehemp.cr/productos#webpage',
    name: 'Productos de Cáñamo — CoopeHemp R.L.',
    url: 'https://coopehemp.cr/productos',
    description: 'Catálogo de productos naturales de cáñamo de CoopeHemp: aceites CBD, pre-rolls, tés, bálsamos, proteínas y fibra textil. 100% orgánicos, certificados en Costa Rica.',
    isPartOf: { '@id': 'https://coopehemp.cr/#website' },
    breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://coopehemp.cr/' },
            { '@type': 'ListItem', position: 2, name: 'Productos', item: 'https://coopehemp.cr/productos' },
        ],
    },
};

// ─── Unified product type ──────────────────────────────────────────────────────

interface DisplayProduct {
    id: number;
    variantId?: string;    // Medusa variant UUID — present when fetched from API
    name: string;
    description: string;
    price: string;         // formatted string for display
    priceNumeric: number;  // raw number for cart
    image: string;
    category: string;
}

// ─── Hardcoded fallback ───────────────────────────────────────────────────────
// Used when Medusa returns no products (backend down or products not linked
// to sales channel yet). Remove once products are fully configured in admin.

const FALLBACK_PRODUCTS: DisplayProduct[] = [
    {
        id: 1,
        name: 'CBD Pre-rolls (5 pack)',
        description: 'Flores de cáñamo premium seleccionadas a mano, roladas en papel orgánico. Experiencia suave y natural.',
        price: '$15.00',
        priceNumeric: 15,
        image: '/productos/product-prerolls.jpg',
        category: 'Fumables',
    },
    {
        id: 2,
        name: 'Bálsamo Calmante CBD',
        description: 'Alivio tópico profundo para músculos y articulaciones. Formulado con cera de abeja y aceites esenciales.',
        price: '$25.00',
        priceNumeric: 25,
        image: '/productos/product-cbd-balm.jpg',
        category: 'Bienestar',
    },
    {
        id: 3,
        name: 'Té de Cáñamo Premium',
        description: 'Infusión relajante rica en cannabinoides no psicoactivos. Ideal para reducir el estrés y mejorar el sueño.',
        price: '$45.00',
        priceNumeric: 45,
        image: '/productos/product-hump-oil-tea.jpg',
        category: 'Bebidas',
    },
    {
        id: 4,
        name: 'Crema Facial Anti-edad',
        description: 'Hidratación profunda con poder antioxidante. Revitaliza tu piel con lo mejor de la naturaleza.',
        price: '$30.00',
        priceNumeric: 30,
        image: '/productos/product-beauty-cream.jpg',
        category: 'Belleza',
    },
    {
        id: 5,
        name: 'Cookies Artesanales CBD',
        description: 'Deliciosas galletas horneadas con harina de cáñamo y chispas de chocolate. El snack saludable perfecto.',
        price: '$12.00',
        priceNumeric: 12,
        image: '/productos/product-cookies.jpg',
        category: 'Comestibles',
    },
];

// ─── Map Medusa products → DisplayProduct ─────────────────────────────────────

function fromMedusaProducts(products: MedusaProduct[], currency: string): DisplayProduct[] {
    return products.map((p, idx) => {
        const variant = p.variants?.[0];
        const rawAmount = variant?.calculated_price?.calculated_amount ?? 0;
        const priceNum = rawAmount / 100;
        const priceFmt = rawAmount > 0
            ? new Intl.NumberFormat('es-CR', {
                style: 'currency',
                currency: currency.toUpperCase(),
                minimumFractionDigits: currency.toLowerCase() === 'crc' ? 0 : 2,
                maximumFractionDigits: currency.toLowerCase() === 'crc' ? 0 : 2,
              }).format(priceNum)
            : 'Consultar precio';

        return {
            id: idx + 1,
            variantId: variant?.id,
            name: p.title,
            description: p.description ?? '',
            price: priceFmt,
            priceNumeric: priceNum,
            image: p.thumbnail ?? '/hemp-plant.jpg',
            category: p.tags?.[0]?.value ?? 'Producto',
        };
    });
}

// ─── AddToCartButton ──────────────────────────────────────────────────────────

function AddToCartButton({ product }: { product: DisplayProduct }) {
    const { addItem, openCart } = useCart();
    const { t } = useTranslation();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addItem({
            id: product.id,
            variantId: product.variantId,
            name: product.name,
            price: product.priceNumeric,
            image: product.image,
            category: product.category,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
        openCart();
    };

    return (
        <button
            onClick={handleAdd}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all active:scale-95 ${
                added
                    ? 'bg-coope-green-600 text-white'
                    : 'bg-neutral-900 text-white hover:bg-coope-green-700'
            }`}
        >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            <span>{added ? t('cart.added') : t('cart.add')}</span>
        </button>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

const Products = () => {
    useScrollToTop();
    const { t } = useTranslation();

    useSEO({
        title: 'Productos Naturales de Cáñamo',
        description: 'Catálogo de productos de cáñamo de CoopeHemp: aceites CBD de espectro completo, pre-rolls, tés, bálsamos terapéuticos, proteína y fibra. 100% orgánicos, Costa Rica.',
        path: '/productos',
        image: '/hemp-gummies.jpg',
        structuredData: PRODUCTS_LD,
    });

    const [products, setProducts] = useState<DisplayProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fromMedusa, setFromMedusa] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const { regions } = await getRegions();
            const region = regions.find((r) => r.currency_code === 'crc') ?? regions[0];
            const { products: raw } = await getProducts({
                region_id: region?.id,
                limit: 50,
            });

            if (raw.length > 0) {
                const currency = raw[0]?.variants?.[0]?.calculated_price?.currency_code ?? region?.currency_code ?? 'crc';
                setProducts(fromMedusaProducts(raw, currency));
                setFromMedusa(true);
            } else {
                // Products exist in DB but not linked to sales channel yet
                setProducts(FALLBACK_PRODUCTS);
                setFromMedusa(false);
            }
        } catch {
            // Backend unreachable — use fallback silently
            setProducts(FALLBACK_PRODUCTS);
            setFromMedusa(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            {/* Hero */}
            <div className="relative bg-green-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/hemp-field.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900/90" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 md:py-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-green-300 text-sm font-medium mb-6">
                            <Leaf className="w-4 h-4" />
                            {t('products.hero_badge')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{t('products.hero_title')}</h1>
                        <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto font-light leading-relaxed">
                            {t('products.hero_sub')}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 className="w-8 h-8 text-coope-green-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-neutral-500 mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="inline-flex items-center gap-2 text-coope-green-700 font-medium hover:underline"
                        >
                            <RefreshCw className="w-4 h-4" /> Reintentar
                        </button>
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={item}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group ring-1 ring-neutral-100 flex flex-col"
                            >
                                <div className="relative h-64 overflow-hidden bg-neutral-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => { (e.target as HTMLImageElement).src = '/hemp-plant.jpg'; }}
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-neutral-900 shadow-sm">
                                        {product.category}
                                    </div>
                                    {/* Medusa badge — shows when data is live */}
                                    {fromMedusa && product.variantId && (
                                        <div className="absolute top-4 left-4 bg-coope-green-600/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-white">
                                            En stock
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-green-800 transition-colors">
                                            {product.name}
                                        </h3>
                                        <span className="text-lg font-bold text-green-700 shrink-0 ml-2">
                                            {product.price}
                                        </span>
                                    </div>

                                    <p className="text-neutral-600 mb-6 leading-relaxed flex-grow">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-neutral-100 mt-auto">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                        <AddToCartButton product={product} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Wholesale CTA card */}
                        <motion.div
                            variants={item}
                            className="bg-green-900 rounded-3xl p-8 flex flex-col justify-center items-center text-center text-white relative overflow-hidden min-h-[400px]"
                        >
                            <div className="absolute inset-0 bg-[url('/hemp-leaves-vertical.jpg')] bg-cover bg-center opacity-10" />
                            <div className="relative z-10 space-y-6">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                                    <Leaf className="w-8 h-8 text-green-300" />
                                </div>
                                <h3 className="text-3xl font-bold">{t('products.wholesale_title')}</h3>
                                <p className="text-green-100 max-w-sm mx-auto">{t('products.wholesale_desc')}</p>
                                <Link
                                    to="/contacto"
                                    className="inline-flex items-center gap-2 bg-white text-green-900 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
                                >
                                    {t('products.wholesale_btn')} <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Products;
