import React, { useState } from 'react';
import { ChevronLeft, Search, Filter } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { WorkerCard } from '../components/WorkerCard';

// Dummy data
const ALL_WORKERS = [
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
  },
  {
    id: 'w3',
    category: 'Bantu Acara',
    categories: ['Bantu Acara', 'Helper Harian'],
    description: 'Siap bantu cuci piring atau bantu-bantu hajatan.',
    verified: true,
    rating: 4.9,
    activeStatus: '1 hari lalu',
    workArea: 'Margorejo',
    whatsapp: '6281122334455',
    userData: { id: 'u3', name: 'Siti Aminah', role: 'worker' as const }
  }
];

const FILTER_TAGS = ['Terdekat', 'Rating Tertinggi', 'Aktif Hari Ini', 'Verified', 'Termurah'];

export const WorkerListScreen: React.FC = () => {
  const { setCurrentScreen, searchQuery, setSearchQuery, selectedCategory } = useAppStore();
  const [activeFilter, setActiveFilter] = useState('Terdekat');

  // Simple filtering
  const filteredWorkers = ALL_WORKERS.filter(w => {
    const matchesSearch = w.userData.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory ? w.categories.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase())) : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-12">
      {/* HEADER STICKY */}
      <div className="bg-white px-6 pt-6 pb-4 sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => setCurrentScreen('home')}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-900 overflow-hidden shrink-0"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 bg-gray-100 rounded-2xl flex items-center px-4 py-2 gap-2">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari bantuan atau pekerja..."
              className="bg-transparent text-sm outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FILTER CHIPS */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button className="bg-green-600 text-white p-2 rounded-xl shrink-0">
             <Filter size={18} />
          </button>
          {FILTER_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeFilter === tag 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-50 text-gray-500'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* WORKER LIST */}
      <div className="px-6 mt-6 grid grid-cols-1 gap-6">
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map(worker => (
            <WorkerCard key={worker.id} worker={worker as any} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">Tidak ada pekerja ditemukan</p>
            <button 
              onClick={() => { setSearchQuery(''); useAppStore.setState({ selectedCategory: null }); }}
              className="mt-4 text-green-600 font-bold text-xs"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
