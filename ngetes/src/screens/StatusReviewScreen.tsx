import React from 'react';
import { Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';

export const StatusReviewScreen: React.FC = () => {
  const { setCurrentScreen } = useAppStore();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-32 h-32 bg-green-50 rounded-[48px] flex items-center justify-center text-green-600 mb-8 shadow-inner shadow-green-100">
           <Clock size={64} className="animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profilmu sedang ditinjau</h1>
        <p className="text-gray-500 text-sm max-w-[280px] leading-relaxed">
          Kami mengecek profil kamu untuk menjaga kualitas worker di GoSerabutan. Mohon tunggu maksimal 1x24 jam.
        </p>

        <div className="mt-12 space-y-4 w-full max-w-[280px]">
           <div className="flex items-center gap-3 text-left bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <CheckCircle2 size={24} className="text-green-600" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">Pendaftaran Berhasil</span>
                <span className="text-[10px] text-gray-400">Data kamu sudah masuk ke sistem kami.</span>
              </div>
           </div>
           
           <div className="flex items-center gap-3 text-left bg-white p-4 rounded-2xl border border-dashed border-gray-200">
              <Clock size={24} className="text-gray-300" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-300">Proses Peninjauan</span>
                <span className="text-[10px] text-gray-400">Tim kami sedang memvalidasi data kamu.</span>
              </div>
           </div>
        </div>

        <button 
          onClick={() => setCurrentScreen('home')}
          className="mt-12 flex items-center gap-2 text-green-600 font-bold group"
        >
          Kembali ke Home <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
};
