import React, { useState } from 'react';
import { ChevronLeft, Camera, Upload, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../constants';

export const RegisterWorkerScreen: React.FC = () => {
  const { setCurrentScreen } = useAppStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    location: '',
    category: '',
    description: '',
    photo: null,
    portfolios: [] as any[]
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) setCurrentScreen('home');
    else setStep(s => s - 1);
  };

  const handleSubmit = () => {
    setCurrentScreen('status-review');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="px-6 py-6 bg-white flex items-center gap-4 sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <button onClick={prevStep} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-900">Daftar Worker</h1>
          <span className="text-xs text-gray-400">Langkah {step} dari 5</span>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="h-1 bg-gray-100 w-full overflow-hidden">
         <motion.div 
           className="h-full bg-green-600"
           initial={{ width: '0%' }}
           animate={{ width: `${(step / 5) * 100}%` }}
         />
      </div>

      <div className="flex-1 p-6 max-w-xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">Info Dasar</h2>
                <p className="text-sm text-gray-500">Bantu pelanggan mengenali profil kamu.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Budi Santoso"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:border-green-600 transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nomor WhatsApp</label>
                  <input 
                    type="tel" 
                    placeholder="Contoh: 6281234..."
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:border-green-600 transition-colors"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pilih Kategori Utama</label>
                  <select 
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:border-green-600 transition-colors"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Pilih Kategori</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={nextStep}
                disabled={!formData.name || !formData.whatsapp || !formData.category}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-100 disabled:opacity-50"
              >
                Lanjut
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
               key="step2"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">Foto Profil</h2>
                <p className="text-sm text-gray-500">Gunakan foto asli agar lebih dipercaya pelanggan.</p>
              </div>

              <div className="flex flex-col items-center py-10">
                <div className="w-40 h-40 bg-white rounded-[40px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 relative overflow-hidden group hover:border-green-400 transition-colors cursor-pointer">
                  <Camera size={40} className="mb-2" />
                  <span className="text-[10px] font-bold uppercase">Unggah Foto</span>
                </div>
                <p className="mt-8 text-xs text-gray-400 text-center max-w-[200px]">
                  Foto yang jelas membantu meningkatkan kepercayaan pelanggan.
                </p>
              </div>

              <button 
                onClick={nextStep}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-100"
              >
                Lanjut
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">Ceritakan Keahlianmu</h2>
                <p className="text-sm text-gray-500">Tulis deskripsi menarik tentang bantuan yang bisa kamu berikan.</p>
              </div>

              <textarea 
                className="w-full h-48 bg-white border border-gray-200 rounded-[32px] p-6 outline-none focus:border-green-600 transition-colors resize-none text-gray-700"
                placeholder="Contoh: Saya siap membantu pindahan, angkut barang berat, dan bersih-bersih halaman. Saya jujur dan pekerja keras..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />

              <button 
                onClick={nextStep}
                disabled={!formData.description}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-100 disabled:opacity-50"
              >
                Lanjut
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">Portofolio (Opsional)</h2>
                <p className="text-sm text-gray-500">Unggah foto hasil kerja kamu sebelumnya.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/3] bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 group hover:border-green-400 cursor-pointer transition-colors">
                  <Upload size={24} className="mb-2" />
                  <span className="text-[10px] font-bold">TAMBAH FOTO</span>
                </div>
              </div>

              <button 
                onClick={nextStep}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-100"
              >
                Lanjut
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">Review & Kirim</h2>
                <p className="text-sm text-gray-500">Periksa kembali profil kamu sebelum dikirim ke sistem.</p>
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                 <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`} alt="preview" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Nama</span>
                     <span className="font-bold text-gray-900">{formData.name}</span>
                   </div>
                 </div>
                 
                 <div className="flex flex-col gap-1">
                   <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Kategori Jasa</span>
                   <span className="font-bold text-green-600">{formData.category}</span>
                 </div>

                 <div className="flex flex-col gap-1">
                   <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Deskripsi</span>
                   <p className="text-xs text-gray-600 line-clamp-3">{formData.description}</p>
                 </div>
              </div>

              <button 
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-100"
              >
                Kirim Pendaftaran
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
