import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  id: number;
  variantId?: string;  // Medusa variant UUID — present when fetched from backend
  name: string;
  price: number;       // numeric e.g. 15.00
  image: string;
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE'; id: number }
  | { type: 'UPDATE_QTY'; id: number; qty: number }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items };

    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] };
    }

    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };

    case 'UPDATE_QTY':
      if (action.qty < 1) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.qty } : i
        ),
      };

    case 'OPEN':   return { ...state, isOpen: true };
    case 'CLOSE':  return { ...state, isOpen: false };
    case 'TOGGLE': return { ...state, isOpen: !state.isOpen };
    case 'CLEAR':  return { ...state, items: [] };

    default: return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'coopehemp_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        if (Array.isArray(items)) dispatch({ type: 'HYDRATE', items });
      }
    } catch { /* ignore */ }
  }, []);

  // Persist to localStorage on items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal   = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addItem    = useCallback((item: Omit<CartItem, 'quantity'>) => dispatch({ type: 'ADD', item }), []);
  const removeItem = useCallback((id: number) => dispatch({ type: 'REMOVE', id }), []);
  const updateQty  = useCallback((id: number, qty: number) => dispatch({ type: 'UPDATE_QTY', id, qty }), []);
  const clearCart  = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const openCart   = useCallback(() => dispatch({ type: 'OPEN' }), []);
  const closeCart  = useCallback(() => dispatch({ type: 'CLOSE' }), []);
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE' }), []);

  return (
    <CartContext.Provider value={{ items: state.items, isOpen: state.isOpen, totalItems, subtotal, addItem, removeItem, updateQty, clearCart, openCart, closeCart, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};
