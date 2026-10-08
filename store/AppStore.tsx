import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppNotification, CartItem, Claim, Land, Lease, Order, Policy, Role, User, KycStatus,
} from '@/types';
import { LANDS, LEASES, ORDERS, NOTIFICATIONS, POLICIES, CLAIMS, USERS } from '@/data';

const KEY = 'kethwadi.state.v1';

export interface State {
  hydrated: boolean;
  onboarded: boolean;
  user: User | null;
  lands: Land[];
  leases: Lease[];
  cart: CartItem[];
  orders: Order[];
  policies: Policy[];
  claims: Claim[];
  notifications: AppNotification[];
}

const initial: State = {
  hydrated: false,
  onboarded: false,
  user: null,
  lands: LANDS,
  leases: LEASES,
  cart: [],
  orders: ORDERS,
  policies: POLICIES,
  claims: CLAIMS,
  notifications: NOTIFICATIONS,
};

type Action =
  | { type: 'HYDRATE'; payload: Partial<State> }
  | { type: 'ONBOARDED' }
  | { type: 'LOGIN'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_KYC'; status: KycStatus }
  | { type: 'ADD_LAND'; land: Land }
  | { type: 'SET_LAND_STATUS'; id: string; status: Land['status'] }
  | { type: 'ADD_LEASE'; lease: Lease }
  | { type: 'SET_LEASE_STATUS'; id: string; status: Lease['status'] }
  | { type: 'CART_ADD'; productId: string; qty: number }
  | { type: 'CART_SET'; productId: string; qty: number }
  | { type: 'CART_REMOVE'; productId: string }
  | { type: 'CART_CLEAR' }
  | { type: 'ADD_ORDER'; order: Order }
  | { type: 'ADD_POLICY'; policy: Policy }
  | { type: 'ADD_CLAIM'; claim: Claim }
  | { type: 'SET_CLAIM_STATUS'; id: string; status: Claim['status'] }
  | { type: 'NOTIFY'; item: AppNotification }
  | { type: 'READ_ALL' }
  | { type: 'RESET' };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'HYDRATE': return { ...s, ...a.payload, hydrated: true };
    case 'ONBOARDED': return { ...s, onboarded: true };
    case 'LOGIN': return { ...s, user: a.user };
    case 'LOGOUT': return { ...s, user: null };
    case 'SET_KYC': return s.user ? { ...s, user: { ...s.user, kycStatus: a.status, verified: a.status === 'verified' } } : s;
    case 'ADD_LAND': return { ...s, lands: [a.land, ...s.lands] };
    case 'SET_LAND_STATUS':
      return { ...s, lands: s.lands.map(l => (l.id === a.id ? { ...l, status: a.status } : l)) };
    case 'ADD_LEASE': return { ...s, leases: [a.lease, ...s.leases] };
    case 'SET_LEASE_STATUS':
      return {
        ...s,
        leases: s.leases.map(l =>
          l.id === a.id ? { ...l, status: a.status, paymentStatus: a.status === 'active' ? 'paid' : l.paymentStatus } : l,
        ),
      };
    case 'CART_ADD': {
      const found = s.cart.find(c => c.productId === a.productId);
      return found
        ? { ...s, cart: s.cart.map(c => (c.productId === a.productId ? { ...c, qty: c.qty + a.qty } : c)) }
        : { ...s, cart: [...s.cart, { productId: a.productId, qty: a.qty }] };
    }
    case 'CART_SET':
      return a.qty <= 0
        ? { ...s, cart: s.cart.filter(c => c.productId !== a.productId) }
        : { ...s, cart: s.cart.map(c => (c.productId === a.productId ? { ...c, qty: a.qty } : c)) };
    case 'CART_REMOVE': return { ...s, cart: s.cart.filter(c => c.productId !== a.productId) };
    case 'CART_CLEAR': return { ...s, cart: [] };
    case 'ADD_ORDER': return { ...s, orders: [a.order, ...s.orders], cart: [] };
    case 'ADD_POLICY': return { ...s, policies: [a.policy, ...s.policies] };
    case 'ADD_CLAIM': return { ...s, claims: [a.claim, ...s.claims] };
    case 'SET_CLAIM_STATUS':
      return { ...s, claims: s.claims.map(c => (c.id === a.id ? { ...c, status: a.status } : c)) };
    case 'NOTIFY': return { ...s, notifications: [a.item, ...s.notifications] };
    case 'READ_ALL': return { ...s, notifications: s.notifications.map(n => ({ ...n, read: true })) };
    case 'RESET': return { ...initial, hydrated: true };
    default: return s;
  }
}

interface Ctx extends State {
  dispatch: React.Dispatch<Action>;
  users: User[];
  unread: number;
  cartCount: number;
  isLandlord: boolean;
  isFarmer: boolean;
  reset: () => void;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        dispatch({ type: 'HYDRATE', payload: raw ? JSON.parse(raw) : {} });
      } catch {
        dispatch({ type: 'HYDRATE', payload: {} });
      }
    })();
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated, ...persist } = state;
    AsyncStorage.setItem(KEY, JSON.stringify(persist)).catch(() => {});
  }, [state]);

  const reset = useCallback(() => {
    AsyncStorage.removeItem(KEY).catch(() => {});
    dispatch({ type: 'RESET' });
  }, []);

  const value = useMemo<Ctx>(() => ({
    ...state,
    dispatch,
    users: USERS,
    reset,
    unread: state.notifications.filter(n => !n.read).length,
    cartCount: state.cart.reduce((t, c) => t + c.qty, 0),
    isLandlord: state.user?.role === 'landlord',
    isFarmer: state.user?.role === 'farmer',
  }), [state, reset]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
