import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingCart, Check, Star, ChevronLeft, Loader2, RefreshCw, Minus, Plus } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import useScrollToTop from '../../shared/hooks/useScrollToTop';
import { useSEO } from '../../shared/hooks/useSEO';
import { useCart } from '../cart/CartContext';
import { getProductByHandle, getRegions, type MedusaProduct, type MedusaVariant } from '../../shared/api/medusa-store';

const FALLBACK_IMG = '/hemp-plant.jpg';

// El carrito dedupea por id numérico → derivamos uno estable del UUID de la variante,
// así cada variante es una línea propia y re-agregar la misma suma cantidad.
function variantNumericId(variantId: string): number {
    let h = 0;
    for (let i = 0; i < variantId.length; i++) h = (h * 31 + variantId.charCodeAt(i)) | 0;
    return Math.abs(h);
}

function formatPrice(variant: MedusaVariant | null, fallbackCurrency: string, t: (k: string) => string): { num: number; fmt: string } {
    const raw = variant?.calculated_price?.calculated_amount ?? 0;
    const num = raw / 100;
    if (raw <= 0) return { num: 0, fmt: t('products.price_ask') };
    const currency = (variant?.calculated_price?.currency_code ?? fallbackCurrency).toUpperCase();
    const fmt = new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency,
        minimumFractionDigits: currency.toLowerCase() === 'crc' ? 0 : 2,
        maximumFractionDigits: currency.toLowerCase() === 'crc' ? 0 : 2,
    }).format(num);
    return { num, fmt };
}

export default function ProductDetail() {
    useScrollToTop();
    const { handle } = useParams<{ handle: string }>();
    const { t } = useTranslation();
    const { addItem, openCart } = useCart();

    const [product, setProduct] = useState<MedusaProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [variant, setVariant] = useState<MedusaVariant | null>(null);
    const [currency, setCurrency] = useState('crc');
    const [activeImg, setActiveImg] = useState(0);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    const fetchOne = async () => {
        setLoading(true);
        setError('');
        try {
            const { regions } = await getRegions();
            const region = regions.find((r) => r.currency_code === 'crc') ?? regions[0];
            const { product: p } = await getProductByHandle(handle ?? '', region?.id);
            if (!p) {
                setError(t('products.error'));
                return;
            }
            setProduct(p);
            setVariant(p.variants?.[0] ?? null);
            setCurrency(p.variants?.[0]?.calculated_price?.currency_code ?? region?.currency_code ?? 'crc');
        } catch {
            setError(t('products.error'));
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect -- carga al montar / cambiar handle
    useEffect(() => { fetchOne(); }, [handle]);

    useSEO({
        title: product?.title ?? 'Producto',
        description: product?.description ?? 'Producto natural de cáñamo de CoopeHemp R.L.',
        path: `/productos/${handle ?? ''}`,
        image: product?.thumbnail ?? FALLBACK_IMG,
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-coope-green-500 animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
                <p className="text-neutral-500">{error || t('products.error')}</p>
                <button onClick={fetchOne} className="inline-flex items-center gap-2 text-coope-green-700 font-medium hover:underline">
                    <RefreshCw className="w-4 h-4" /> {t('products.retry')}
                </button>
                <Link to="/productos" className="inline-flex items-center gap-2 text-neutral-600 hover:underline">
                    <ChevronLeft className="w-4 h-4" /> {t('products.back')}
                </Link>
            </div>
        );
    }

    const images = [product.thumbnail, ...(product.images?.map((i) => i.url) ?? [])].filter((x): x is string => !!x);
    const gallery = images.length ? images : [FALLBACK_IMG];
    const { num: priceNum, fmt: priceFmt } = formatPrice(variant, currency, t);
    const category = product.tags?.[0]?.value ?? t('products.category_fallback');

    const handleAdd = () => {
        if (!variant) return;
        const suffix = variant.title && variant.title !== 'Default' ? ` — ${variant.title}` : '';
        const item = {
            id: variantNumericId(variant.id),
            variantId: variant.id,
            name: `${product.title}${suffix}`,
            price: priceNum,
            image: gallery[0],
            category,
        };
        for (let i = 0; i < qty; i++) addItem(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
        openCart();
    };

    return (
        <div className="min-h-screen bg-white pt-24 md:pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6" aria-label="breadcrumb">
                    <Link to="/" className="hover:text-coope-green-700">{t('nav.home')}</Link>
                    <span>/</span>
                    <Link to="/productos" className="hover:text-coope-green-700">{t('nav.products')}</Link>
                    <span>/</span>
                    <span className="text-neutral-900 font-medium truncate">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Galería */}
                    <div className="flex gap-4">
                        {gallery.length > 1 && (
                            <div className="flex flex-col gap-3">
                                {gallery.map((src, i) => (
                                    <button
                                        key={i}
                                        onMouseEnter={() => setActiveImg(i)}
                                        onClick={() => setActiveImg(i)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden ring-2 transition ${i === activeImg ? 'ring-coope-green-600' : 'ring-neutral-200'}`}
                                        aria-label={`${product.title} ${i + 1}`}
                                    >
                                        <img loading="lazy" src={src} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="flex-1 rounded-2xl overflow-hidden bg-neutral-100 aspect-square">
                            <img src={gallery[activeImg]} alt={product.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
                        </div>
                    </div>

                    {/* Caja de compra */}
                    <div>
                        <span className="inline-block bg-neutral-100 text-neutral-700 text-xs font-bold px-3 py-1 rounded-full mb-3">{category}</span>
                        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">{product.title}</h1>
                        <div className="flex items-center gap-2 mb-5">
                            <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}</div>
                            {variant && <span className="text-coope-green-700 text-sm font-medium">{t('products.in_stock')}</span>}
                        </div>
                        <p className="text-3xl font-bold text-green-700 mb-6">{priceFmt}</p>

                        {/* Selector de variante */}
                        {product.variants.length > 1 && (
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-neutral-700 mb-2">{product.options?.[0]?.title ?? t('products.quantity')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setVariant(v)}
                                            className={`px-4 py-2 rounded-xl border-2 font-medium transition ${variant?.id === v.id ? 'border-coope-green-600 bg-coope-green-50 text-coope-green-800' : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'}`}
                                        >
                                            {v.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cantidad + agregar */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center border-2 border-neutral-200 rounded-xl">
                                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-neutral-100 rounded-l-xl" aria-label="-"><Minus className="w-4 h-4" /></button>
                                <span className="w-10 text-center font-semibold">{qty}</span>
                                <button onClick={() => setQty((q) => q + 1)} className="p-3 hover:bg-neutral-100 rounded-r-xl" aria-label="+"><Plus className="w-4 h-4" /></button>
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={!variant}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition active:scale-95 disabled:opacity-50 ${added ? 'bg-coope-green-600 text-white' : 'bg-neutral-900 text-white hover:bg-coope-green-700'}`}
                            >
                                {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                                {added ? t('cart.added') : t('cart.add')}
                            </button>
                        </div>

                        {/* Descripción */}
                        {product.description && (
                            <div className="border-t border-neutral-100 pt-6">
                                <h2 className="text-lg font-bold text-neutral-900 mb-2">{t('products.specs')}</h2>
                                <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
