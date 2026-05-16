import { create } from 'zustand';

interface AppState {
  isSplashVisible: boolean;
  setSplashVisible: (visible: boolean) => void;
  userLocation: string;
  setUserLocation: (location: string) => void;
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  currentScreen: 'home' | 'worker-list' | 'worker-profile' | 'register-worker' | 'status-review';
  setCurrentScreen: (screen: AppState['currentScreen']) => void;
  selectedWorkerId: string | null;
  setSelectedWorkerId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSplashVisible: true,
  setSplashVisible: (visible) => set({ isSplashVisible: visible }),
  userLocation: 'Pati Kota',
  setUserLocation: (location) => set({ userLocation: location }),
  isAuthenticated: false,
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  currentScreen: 'home',
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  selectedWorkerId: null,
  setSelectedWorkerId: (id) => set({ selectedWorkerId: id }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
