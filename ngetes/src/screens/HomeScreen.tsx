import React from 'react';
import { Search, Bell, MapPin, ChevronRight, Truck, Sparkles, Scissors, Package, PartyPopper, ShoppingBag, Users, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { CATEGORIES } from '../constants';
import { WorkerCard } from '../components/WorkerCard';

// Dummy data for initial display
const DUMMY_WORKERS = [
  {
    id: 'w1',
    category: 'Angkut Barang',
    categories: ['Angkut Barang', 'Pindahan', 'Bersih Rumah'],
    description: 'Siap membantu angkut barang dan pindahan.',
    verified: true,
    rating: 4.8,
    activeStatus: '2 jam lalu',
    workArea: 'Pati Kota',
    whatsapp: '628123456789',
    userData: { id: 'u1', name: 'Budi Santoso', role: 'worker' as const }
  },
  {
    id: 'w2',
    category: 'Potong Rumput',
    categories: ['Potong Rumput', 'Bersih Halaman'],
    description: 'Pekerja harian spesialis taman.',
    verified: false,
    rating: 4.5,
    activeStatus: '30 mnt lalu',
    workArea: 'Juwana',
    whatsapp: '628987654321',
    userData: { id: 'u2', name: 'Agus Salim', role: 'worker' as const }
  }
];

export const HomeScreen: React.FC = () => {
  const { userLocation, isAuthenticated, setCurrentScreen, setSearchQuery, setSelectedCategory } = useAppStore();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentScreen('worker-list');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* A. TOP BAR */}
      <header className="px-6 pt-6 flex items-center justify-between sticky top-0 bg-gray-50/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-2 rounded-full">
            <MapPin size={18} className="text-green-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Lokasi Kamu</span>
            <span className="text-sm font-bold text-gray-900">{userLocation}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          {isAuthenticated ? (
            <button className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="avatar" />
            </button>
          ) : (
            <button 
              onClick={() => useAppStore.setState({ isAuthenticated: true })}
              className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-bold shadow-sm border border-gray-100"
            >
              Masuk
            </button>
          )}
        </div>
      </header>

      {/* B. HERO CARD */}
      <section className="px-6 mt-6">
        <motion.div 
          whileHover={{ scale: 0.98 }}
          className="bg-green-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-green-100"
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-bold leading-tight max-w-[180px]">
              Butuh bantuan hari ini?
            </h2>
            <p className="text-green-100 text-sm mt-2 max-w-[200px]">
              Cari pekerja sekitar dengan cepat dan mudah.
            </p>
            <button 
              onClick={() => setCurrentScreen('worker-list')}
              className="mt-6 bg-white text-green-700 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-green-900/20"
            >
              Lihat Pekerja Sekitar
            </button>
          </div>
          
          <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
             <Truck size={180} />
          </div>
        </motion.div>
      </section>

      {/* C. SEARCH BAR */}
      <section className="px-6 mt-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari bantuan atau pekerja..." 
            className="flex-1 text-sm outline-none bg-transparent"
            onFocus={() => setCurrentScreen('worker-list')}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* D. CATEGORY SECTION */}
      <section className="mt-8">
        <div className="px-6 flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Kategori</h3>
          <button className="text-green-600 text-xs font-bold">Lihat Semua</button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 px-6 no-scrollbar pb-2">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-active:scale-95 transition-transform">
                 {/* Map icon names to Lucide components */}
                 {cat.icon === 'Truck' && <Truck className="text-green-600" size={24} />}
                 {cat.icon === 'Sparkles' && <Sparkles className="text-green-600" size={24} />}
                 {cat.icon === 'Scissors' && <Scissors className="text-green-600" size={24} />}
                 {cat.icon === 'Package' && <Package className="text-green-600" size={24} />}
                 {cat.icon === 'PartyPopper' && <PartyPopper className="text-green-600" size={24} />}
                 {cat.icon === 'ShoppingBag' && <ShoppingBag className="text-green-600" size={24} />}
                 {cat.icon === 'Users' && <Users className="text-green-600" size={24} />}
                 {cat.icon === 'Leaf' && <Leaf className="text-green-600" size={24} />}
              </div>
              <span className="text-[11px] font-bold text-gray-600 text-center max-w-[64px] leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* E. NEARBY WORKER SECTION */}
      <section className="mt-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 text-lg">Pekerja Sekitar</h3>
          <button 
            onClick={() => setCurrentScreen('worker-list')}
            className="flex items-center text-green-600 text-xs font-bold gap-1"
          >
            Lihat Semua <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DUMMY_WORKERS.map((worker: any) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      </section>

      {/* F. CTA JADI WORKER */}
      <section className="px-6 mt-12 mb-8">
        <div className="bg-green-50 rounded-3xl p-6 border border-green-100 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h4 className="font-bold text-green-900">Punya waktu luang?</h4>
            <p className="text-green-700 text-xs text-opacity-80">Daftar jadi worker sekarang.</p>
          </div>
          <button 
            onClick={() => setCurrentScreen('register-worker')}
            className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-green-200"
          >
            Daftar
          </button>
        </div>
      </section>
    </div>
  );
};
