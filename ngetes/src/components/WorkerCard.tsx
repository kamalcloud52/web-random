import React from 'react';
import { Star, MapPin, CheckCircle, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Worker, User } from '../types';
import { cn } from '../lib/utils';
import { useAppStore } from '../store/useAppStore';

interface WorkerCardProps {
  worker: Worker & { userData?: User };
  className?: string;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, className }) => {
  const setCurrentScreen = useAppStore(state => state.setCurrentScreen);
  const setSelectedWorkerId = useAppStore(state => state.setSelectedWorkerId);

  const handleOpenProfile = () => {
    setSelectedWorkerId(worker.id);
    setCurrentScreen('worker-profile');
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://wa.me/${worker.whatsapp}`, '_blank');
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3",
        className
      )}
      onClick={handleOpenProfile}
    >
      <div className="relative">
        <img
          src={worker.userData?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.id}`}
          alt={worker.userData?.name}
          className="w-full h-48 object-cover rounded-2xl"
        />
        {worker.verified && (
          <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full shadow-sm">
            <CheckCircle size={14} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-gray-900 text-lg leading-tight">
          {worker.userData?.name || 'Pekerja'}
        </h3>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {worker.categories.slice(0, 2).map((cat) => (
            <span key={cat} className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
              {cat}
            </span>
          ))}
          {worker.categories.length > 2 && (
            <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
              +{worker.categories.length - 2} lainnya
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
          <MapPin size={12} />
          <span>{worker.workArea}</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-gray-900 text-sm">{worker.rating}</span>
            <span className="text-gray-400 text-xs">• 1.2 km</span>
          </div>
          <span className="text-[10px] text-gray-400">Aktif {worker.activeStatus}</span>
        </div>
      </div>

      {/* Portfolio Preview */}
      <div className="grid grid-cols-3 gap-1 mt-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
             <img 
              src={`https://picsum.photos/seed/${worker.id}-${i}/200`} 
              className="w-full h-full object-cover grayscale-[0.5]"
              alt="portfolio"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleOpenProfile}
          className="flex-1 bg-green-50 text-green-700 font-bold py-2 rounded-xl text-sm"
        >
          Lihat Profil
        </button>
        <button
          onClick={handleWhatsApp}
          className="bg-green-600 text-white p-2 rounded-xl"
        >
          <MessageCircle size={20} />
        </button>
      </div>
    </motion.div>
  );
};
