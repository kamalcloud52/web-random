import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'angkut', name: 'Angkut Barang', icon: 'Truck' },
  { id: 'bersih', name: 'Bersih Rumah', icon: 'Sparkles' },
  { id: 'rumput', name: 'Potong Rumput', icon: 'Scissors' },
  { id: 'pindahan', name: 'Pindahan', icon: 'Package' },
  { id: 'acara', name: 'Bantu Acara', icon: 'PartyPopper' },
  { id: 'titipan', name: 'Belanja Titipan', icon: 'ShoppingBag' },
  { id: 'helper', name: 'Helper Harian', icon: 'Users' },
  { id: 'halaman', name: 'Bersih Halaman', icon: 'Leaf' },
];

export const APP_THEME = {
  primary: '#16A34A',
  secondary: '#FFFFFF',
  bg: '#F3F4F6',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
  },
  accent: '#FACC15',
};
