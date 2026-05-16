import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';

export const SplashScreen: React.FC = () => {
  const setSplashVisible = useAppStore((state) => state.setSplashVisible);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [setSplashVisible]);

  return (
    <div id="splash-screen" className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-green-600 rounded-3xl flex items-center justify-center shadow-lg mb-4">
          <span className="text-white text-4xl font-bold">GS</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">GoSerabutan</h1>
        <p className="text-gray-500 mt-2">Cari bantuan sekitar dengan cepat</p>
      </motion.div>
      
      <div className="absolute bottom-12 w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-600"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2 }}
        />
      </div>
    </div>
  );
};
