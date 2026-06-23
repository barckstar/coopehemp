import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useTranslation } from '../../i18n/LanguageContext';

const FALLBACK_IMG = '/hemp-plant.jpg';

export const CartDrawer = () => {
  const { items, isOpen, totalItems, subtotal, removeItem, updateQty, closeCart } = useCart();
  const { t, lang } = useTranslation();

  const currency = lang === 'en' ? 'USD' : 'USD';
  const fmtPrice = (n: number) =>
    new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-CR', {
      style: 'currency',
      currency,
    }).format(n);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <ShoppingCart size={20} className="text-coope-green-600" />
                <h2 className="text-lg font-bold text-gray-900">{t('cart.title')}</h2>
                {totalItems > 0 && (
                  <span className="bg-coope-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label={t('a11y.close')}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-coope-green-50 flex items-center justify-center">
                    <ShoppingCart size={32} className="text-coope-green-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 text-lg">{t('cart.empty')}</p>
                    <p className="text-gray-400 text-sm mt-1">{t('cart.empty_desc')}</p>
                  </div>
                  <Link
                    to="/productos"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 bg-coope-green-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-coope-green-700 transition-colors"
                  >
                    {t('cart.browse')} <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }}
                        className="flex gap-4 bg-gray-50 rounded-2xl p-3"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-grow min-w-0">
                          <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-xs text-coope-green-600 font-medium mt-0.5">{item.category}</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{fmtPrice(item.price)}</p>
                        </div>

                        {/* Qty + remove */}
                        <div className="flex flex-col items-end justify-between shrink-0">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                            aria-label={t('cart.remove')}
                          >
                            <Trash2 size={14} />
                          </button>

                          <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 px-1 py-0.5">
                            <button
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              aria-label={t('a11y.decrease')}
                              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-coope-green-600 transition-colors rounded-lg hover:bg-coope-green-50"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              aria-label={t('a11y.increase')}
                              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-coope-green-600 transition-colors rounded-lg hover:bg-coope-green-50"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer — only when items exist */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-white">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{t('cart.subtotal')}</span>
                  <span className="text-xl font-bold text-gray-900">{fmtPrice(subtotal)}</span>
                </div>

                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full bg-coope-green-600 hover:bg-coope-green-700 text-white font-bold py-3.5 rounded-2xl transition-colors"
                >
                  {t('cart.checkout')} <ArrowRight size={16} />
                </Link>

                <p className="text-center text-xs text-gray-400">{t('cart.checkout_note')}</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
