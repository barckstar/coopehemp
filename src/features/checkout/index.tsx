import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, User, MapPin, CreditCard, CheckCircle2,
  ArrowRight, ArrowLeft, Loader2, AlertCircle, PackageCheck,
  Minus, Plus, Trash2,
} from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  createCart, addLineItem, updateCart,
  getShippingOptions, addShippingMethod,
  initiatePaymentSession, completeCart, getRegions,
  type MedusaShippingOption,
} from '../../shared/api/medusa-store';
import useScrollToTop from '../../shared/hooks/useScrollToTop';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactForm {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

interface AddressForm {
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
}

interface OrderInfo {
  id: string;
  display_id: number;
  total: number;
  currency: string;
}

// ─── Payment Provider Abstraction ─────────────────────────────────────────────
//
// HOW TO ADD A PAYMENT PROVIDER
// ══════════════════════════════
// 1. Install the Medusa plugin in Back-End:
//      npm install @medusajs/payment-stripe   (or paypal, etc.)
//
// 2. Register it in Back-End/medusa-config.ts → modules[]:
//      { resolve: "@medusajs/payment-stripe",
//        options: { apiKey: process.env.STRIPE_SECRET_KEY } }
//
// 3. Add STRIPE_SECRET_KEY to Back-End/.env
//
// 4. In Medusa Admin → Settings → Regions → select the region →
//      enable the new provider
//
// 5. Create a new PaymentProviderUI object below (copy SystemDefaultProvider
//    as a template), implement `render` with the provider's SDK/form,
//    and add it to PAYMENT_PROVIDERS.
//
// 6. Add VITE_STRIPE_PUBLIC_KEY (or equivalent) to Front-End/.env.local
//
// The `render` function receives total, currency, callbacks, and loading
// state — everything needed to build any payment UI.
//
// ─────────────────────────────────────────────────────────────────────────────

interface PaymentRenderProps {
  total: number;
  currency: string;
  loading: boolean;
  setLoading: (v: boolean) => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

interface PaymentProviderUI {
  id: string;
  label: string;
  description: string;
  icon?: ReactNode;
  render: (props: PaymentRenderProps) => ReactNode;
}

function fmtAmount(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-CR', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: currency.toLowerCase() === 'crc' ? 0 : 2,
    maximumFractionDigits: currency.toLowerCase() === 'crc' ? 0 : 2,
  }).format(amount / 100);
}

// ── pp_system_default ─────────────────────────────────────────────────────────
// Current placeholder — no real payment processing.
// Replace or complement this entry when a real provider is ready.
// ─────────────────────────────────────────────────────────────────────────────
const SystemDefaultProvider: PaymentProviderUI = {
  id: 'pp_system_default',
  label: 'Confirmar pedido',
  description: 'Tu pedido será procesado manualmente.',
  render: ({ total, currency, loading, onSuccess }) => (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-900 text-sm">Sin cobro inmediato</p>
          <p className="text-amber-700 text-sm mt-1 leading-relaxed">
            Al confirmar, registraremos tu pedido. Un asesor de CoopeHemp te
            contactará en 24–48 h para coordinar el pago y la entrega.
          </p>
        </div>
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-5 py-4">
          <span className="font-medium text-gray-700 text-sm">Total estimado</span>
          <span className="text-xl font-bold text-gray-900">
            {fmtAmount(total, currency, 'es')}
          </span>
        </div>
      )}

      {/*
        * ── STRIPE INTEGRATION POINT ────────────────────────────────────────────
        * import { loadStripe } from '@stripe/stripe-js'
        * import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
        * const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
        * Wrap in <Elements stripe={stripePromise} options={{ clientSecret }}>
        *   <PaymentElement />
        * </Elements>
        *
        * ── PAYPAL INTEGRATION POINT ─────────────────────────────────────────────
        * import { PayPalButtons } from '@paypal/react-paypal-js'
        * <PayPalButtons createOrder={...} onApprove={...} />
        *
        * ── SINPE MÓVIL INTEGRATION POINT ────────────────────────────────────────
        * Show IBAN / QR code with the order reference number.
        * Mark the order paid after manual confirmation webhook.
        */}

      <button
        type="button"
        onClick={onSuccess}
        disabled={loading}
        className="w-full bg-coope-green-600 hover:bg-coope-green-700 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-base"
      >
        {loading
          ? <Loader2 className="w-5 h-5 animate-spin" />
          : <CheckCircle2 className="w-5 h-5" />}
        Confirmar pedido
      </button>
    </div>
  ),
};

// ── Add providers here when ready ────────────────────────────────────────────
// const StripeProvider: PaymentProviderUI = { id: 'pp_stripe', ... }
// const PayPalProvider: PaymentProviderUI = { id: 'pp_paypal', ... }
// const SINPEProvider:  PaymentProviderUI = { id: 'pp_sinpe',  ... }
// ─────────────────────────────────────────────────────────────────────────────

const PAYMENT_PROVIDERS: PaymentProviderUI[] = [
  SystemDefaultProvider,
  // StripeProvider,
  // PayPalProvider,
  // SINPEProvider,
];

// ─── Static data ──────────────────────────────────────────────────────────────

const COUNTRIES = [
  { code: 'CR', name: 'Costa Rica' },
  { code: 'US', name: 'United States' },
  { code: 'MX', name: 'México' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PA', name: 'Panamá' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'ES', name: 'España' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
];

const STEPS = ['step1', 'step2', 'step3', 'step4', 'step5'] as const;
const STEP_ICONS = [ShoppingCart, User, MapPin, CreditCard, CheckCircle2];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.slice(0, total).map((key, idx) => {
        const num = idx + 1;
        const done = num < current;
        const active = num === current;
        const Icon = STEP_ICONS[idx];
        return (
          <div key={key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                done ? 'bg-coope-green-600 text-white'
                : active ? 'bg-coope-green-700 text-white ring-4 ring-coope-green-100'
                : 'bg-gray-100 text-gray-400'
              }`}>
                {done ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              </div>
              <span className={`text-[10px] font-medium hidden sm:block ${
                active ? 'text-coope-green-700' : done ? 'text-coope-green-500' : 'text-gray-400'
              }`}>
                {t(`checkout.${key}`)}
              </span>
            </div>
            {idx < total - 1 && (
              <div className={`w-10 md:w-16 h-0.5 mx-1 mb-4 transition-colors ${
                done ? 'bg-coope-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({
  label, required, children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-coope-green-400 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm transition';

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Checkout() {
  useScrollToTop();
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const { items, subtotal, updateQty, removeItem, clearCart } = useCart();

  const [step, setStep]       = useState<1 | 2 | 3 | 4 | 5>(1);
  const [direction, setDir]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError]     = useState('');

  // Medusa state
  const [medusaCartId, setMedusaCartId] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<MedusaShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [shippingLoading, setShippingLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);

  // Form state
  const [contact, setContact] = useState<ContactForm>({
    email: '', first_name: '', last_name: '', phone: '',
  });
  const [address, setAddress] = useState<AddressForm>({
    address_1: '', address_2: '', city: '', province: '',
    postal_code: '', country_code: 'CR',
  });

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const goNext = () => { setDir(1); setStep((s) => (s + 1) as typeof step); };
  const goBack = () => { setDir(-1); setStep((s) => (s - 1) as typeof step); };
  const clearError = () => setError('');

  // ── Step 2 submit: create Medusa cart ──────────────────────────────────────
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    try {
      const { regions } = await getRegions();
      const region = regions.find((r) => r.currency_code === 'crc') ?? regions[0];
      const { cart } = await createCart({ region_id: region.id, email: contact.email });
      // Sync line items for products that have a Medusa variantId
      for (const item of items) {
        if (item.variantId) {
          await addLineItem(cart.id, item.variantId, item.quantity).catch(() => null);
        }
      }
      setMedusaCartId(cart.id);
    } catch {
      // Backend unavailable — proceed in "quote mode" (no Medusa cart)
      setMedusaCartId(null);
    } finally {
      setLoading(false);
      goNext();
    }
  };

  // ── Step 3 submit: update cart address + fetch shipping options ────────────
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (medusaCartId) {
      setShippingLoading(true);
      try {
        await updateCart(medusaCartId, {
          email: contact.email,
          shipping_address: {
            first_name: contact.first_name,
            last_name: contact.last_name,
            phone: contact.phone,
            address_1: address.address_1,
            address_2: address.address_2 || undefined,
            city: address.city,
            province: address.province || undefined,
            postal_code: address.postal_code || undefined,
            country_code: address.country_code.toLowerCase(),
          },
        });
        const { shipping_options } = await getShippingOptions(medusaCartId);
        setShippingOptions(shipping_options);
        if (shipping_options.length > 0) setSelectedShipping(shipping_options[0].id);
      } catch {
        setShippingOptions([]);
      } finally {
        setShippingLoading(false);
      }
    }

    goNext();
  };

  // ── Step 4 submit: add shipping + payment session + complete cart ──────────
  const handlePayment = async () => {
    clearError();
    setPayLoading(true);
    try {
      if (medusaCartId) {
        if (selectedShipping) {
          await addShippingMethod(medusaCartId, selectedShipping);
        }
        await initiatePaymentSession(medusaCartId, PAYMENT_PROVIDERS[0].id);
        const result = await completeCart(medusaCartId);
        if (result.type === 'order') {
          setOrderInfo({
            id: result.order.id,
            display_id: result.order.display_id,
            total: result.order.total,
            currency: result.order.currency_code,
          });
        }
      }
      clearCart();
      goNext();
    } catch {
      // Even if Medusa fails, clear cart and show success to avoid blocking customer
      clearCart();
      goNext();
    } finally {
      setPayLoading(false);
    }
  };

  // ── Derived totals ─────────────────────────────────────────────────────────
  const selectedOption = shippingOptions.find((o) => o.id === selectedShipping);
  const shippingAmt = selectedOption?.amount ?? 0;
  const shippingCurrency = selectedOption?.currency_code ?? 'usd';
  const subtotalMinor = Math.round(subtotal * 100); // convert to minor units

  // ── Slide animation ────────────────────────────────────────────────────────
  const slideVariants = {
    enter:  { opacity: 0, x: direction > 0 ? 40 : -40 },
    center: { opacity: 1, x: 0 },
    exit:   { opacity: 0, x: direction > 0 ? -40 : 40 },
  };

  // ── Empty cart guard ───────────────────────────────────────────────────────
  if (items.length === 0 && step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-coope-green-50 flex items-center justify-center">
          <ShoppingCart size={36} className="text-coope-green-300" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-700">{t('checkout.empty_title')}</p>
          <p className="text-gray-400 mt-2 text-sm">Agregá productos para continuar.</p>
        </div>
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 bg-coope-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-coope-green-700 transition-colors"
        >
          {t('checkout.empty_cta')} <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // ── Step renders ───────────────────────────────────────────────────────────

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 mb-5">{t('checkout.order_summary')}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 bg-gray-50 rounded-2xl p-3 items-center">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/hemp-plant.jpg'; }} />
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</p>
              <p className="text-xs text-coope-green-600 mt-0.5">{item.category}</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">
                ${item.price.toFixed(2)} {item.quantity > 1 && (
                  <span className="text-xs text-gray-400 font-normal">{t('checkout.each')}</span>
                )}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button onClick={() => removeItem(item.id)}
                className="text-gray-300 hover:text-red-400 transition-colors p-1">
                <Trash2 size={13} />
              </button>
              <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 px-1 py-0.5">
                <button onClick={() => updateQty(item.id, item.quantity - 1)}
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-coope-green-600 transition-colors rounded-lg hover:bg-coope-green-50">
                  <Minus size={11} />
                </button>
                <span className="w-6 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-coope-green-600 transition-colors rounded-lg hover:bg-coope-green-50">
                  <Plus size={11} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-gray-500 text-sm">{t('cart.subtotal')}</span>
        <span className="text-xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
      </div>

      <button
        onClick={goNext}
        className="w-full bg-coope-green-600 hover:bg-coope-green-700 text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 mt-2"
      >
        {t('checkout.next')} <ArrowRight size={16} />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <form onSubmit={handleContactSubmit} className="space-y-5">
      <h2 className="text-lg font-bold text-gray-900 mb-5">{t('checkout.contact_title')}</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t('checkout.first_name')} required>
          <input required className={inputCls} value={contact.first_name}
            onChange={(e) => setContact((c) => ({ ...c, first_name: e.target.value }))}
            placeholder="Juan" />
        </Field>
        <Field label={t('checkout.last_name')} required>
          <input required className={inputCls} value={contact.last_name}
            onChange={(e) => setContact((c) => ({ ...c, last_name: e.target.value }))}
            placeholder="Pérez" />
        </Field>
      </div>
      <Field label={t('checkout.email')} required>
        <input required type="email" className={inputCls} value={contact.email}
          onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
          placeholder="juan@ejemplo.cr" />
      </Field>
      <Field label={t('checkout.phone')}>
        <input type="tel" className={inputCls} value={contact.phone}
          onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
          placeholder="+506 8888-8888" />
      </Field>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={goBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
          <ArrowLeft size={14} /> {t('checkout.back')}
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 bg-coope-green-600 hover:bg-coope-green-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? t('checkout.processing') : t('checkout.next')}
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleAddressSubmit} className="space-y-5">
      <h2 className="text-lg font-bold text-gray-900 mb-5">{t('checkout.shipping_title')}</h2>
      <Field label={t('checkout.address_1')} required>
        <input required className={inputCls} value={address.address_1}
          onChange={(e) => setAddress((a) => ({ ...a, address_1: e.target.value }))}
          placeholder="Calle 10, Barrio Los Yoses" />
      </Field>
      <Field label={t('checkout.address_2')}>
        <input className={inputCls} value={address.address_2}
          onChange={(e) => setAddress((a) => ({ ...a, address_2: e.target.value }))}
          placeholder="Apto 2B" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t('checkout.city')} required>
          <input required className={inputCls} value={address.city}
            onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
            placeholder="San José" />
        </Field>
        <Field label={t('checkout.province')}>
          <input className={inputCls} value={address.province}
            onChange={(e) => setAddress((a) => ({ ...a, province: e.target.value }))}
            placeholder="San José" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t('checkout.postal_code')}>
          <input className={inputCls} value={address.postal_code}
            onChange={(e) => setAddress((a) => ({ ...a, postal_code: e.target.value }))}
            placeholder="10101" />
        </Field>
        <Field label={t('checkout.country')} required>
          <select required className={inputCls + ' bg-white'} value={address.country_code}
            onChange={(e) => setAddress((a) => ({ ...a, country_code: e.target.value }))}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Shipping method selection */}
      {medusaCartId && (
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-700 mb-3">{t('checkout.shipping_method')}</p>
          {shippingLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-3">
              <Loader2 size={14} className="animate-spin" />
              {t('checkout.shipping_loading')}
            </div>
          ) : shippingOptions.length === 0 ? (
            <p className="text-sm text-gray-400 py-2">{t('checkout.no_shipping')}</p>
          ) : (
            <div className="space-y-2">
              {shippingOptions.map((opt) => (
                <label key={opt.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    selectedShipping === opt.id
                      ? 'border-coope-green-500 bg-coope-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" value={opt.id}
                      checked={selectedShipping === opt.id}
                      onChange={() => setSelectedShipping(opt.id)}
                      className="accent-coope-green-600" />
                    <span className="text-sm font-medium text-gray-800">{opt.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {fmtAmount(opt.amount, opt.currency_code, lang)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={goBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
          <ArrowLeft size={14} /> {t('checkout.back')}
        </button>
        <button type="submit"
          className="flex-1 bg-coope-green-600 hover:bg-coope-green-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
          {t('checkout.next')} <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );

  const renderStep4 = () => {
    const provider = PAYMENT_PROVIDERS[0];
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-gray-900">{t('checkout.payment_title')}</h2>

        {/* Mini order summary */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-600">
              <span className="line-clamp-1 mr-2">{item.name} × {item.quantity}</span>
              <span className="shrink-0 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          {selectedOption && (
            <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-200">
              <span>{selectedOption.name}</span>
              <span className="font-medium">{fmtAmount(selectedOption.amount, selectedOption.currency_code, lang)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>{t('checkout.total')}</span>
            <span>${subtotal.toFixed(2)}{selectedOption ? ' + envío' : ''}</span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}

        {provider.render({
          total: subtotalMinor + shippingAmt,
          currency: shippingCurrency,
          loading: payLoading,
          setLoading: setPayLoading,
          onSuccess: handlePayment,
          onError: setError,
        })}

        <button type="button" onClick={goBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft size={13} /> {t('checkout.back')}
        </button>
      </div>
    );
  };

  const renderStep5 = () => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center space-y-6 py-4"
    >
      <div className="w-20 h-20 bg-coope-green-100 rounded-full flex items-center justify-center mx-auto">
        <PackageCheck className="w-10 h-10 text-coope-green-600" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('checkout.success_title')}</h2>
        <p className="text-coope-green-600 font-medium mt-1">{t('checkout.success_subtitle')}</p>
      </div>

      {orderInfo && (
        <div className="inline-block bg-coope-green-50 border border-coope-green-200 rounded-2xl px-6 py-3">
          <p className="text-sm text-coope-green-700 font-medium">
            {t('checkout.order_number')}<span className="font-bold text-coope-green-900">{orderInfo.display_id}</span>
          </p>
        </div>
      )}

      <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
        {t('checkout.success_msg')}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link to="/productos"
          className="inline-flex items-center justify-center gap-2 bg-coope-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-coope-green-700 transition-colors text-sm">
          {t('checkout.continue_shopping')} <ArrowRight size={14} />
        </Link>
        <Link to="/contacto"
          className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm">
          Contáctanos
        </Link>
      </div>
    </motion.div>
  );

  const stepRenders: Record<number, () => ReactNode> = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
    5: renderStep5,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold text-gray-900">{t('checkout.title')}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Step indicator — hide on confirmation */}
        {step < 5 && <StepIndicator current={step} total={5} />}

        {/* Step content */}
        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-gray-100 p-6 md:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              {stepRenders[step]?.()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
