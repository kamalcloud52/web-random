import React from 'react';
import { ChevronLeft, MessageCircle, Star, MapPin, CheckCircle, Clock, Award, Briefcase } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';

// DUMMY WORKER LOOKUP
const ALL_WORKERS = [
  {
    id: 'w1',
    category: 'Angkut Barang',
    categories: ['Angkut Barang', 'Pindahan', 'Bersih Rumah'],
    description: 'Siap membantu angkut barang, pindahan kecil, dan pekerjaan harian sekitar Pati. Saya punya motor dengan bak samping/tossa yang bisa angkut beban berat.',
    verified: true,
    rating: 4.8,
    activeStatus: '2 jam lalu',
    workArea: 'Pati Kota & Sekitarnya',
    experience: '3 Tahun',
    whatsapp: '628123456789',
    userData: { id: 'u1', name: 'Budi Santoso', role: 'worker' as const }
  }
];

export const ProfileScreen: React.FC = () => {
  const { setCurrentScreen, selectedWorkerId } = useAppStore();
  
  const worker = ALL_WORKERS.find(w => w.id === selectedWorkerId) || ALL_WORKERS[0];

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${worker.whatsapp}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* HEADER SECTION */}
      <div className="relative h-[300px]">
        <img 
          src={`https://picsum.photos/seed/${worker.id}/600/400`} 
          className="w-full h-full object-cover"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <button 
          onClick={() => setCurrentScreen('home')}
          className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="absolute bottom-6 left-6 right-6 flex items-end gap-5">
          <div className="w-24 h-24 rounded-3xl border-4 border-white overflow-hidden bg-gray-200 shrink-0 shadow-xl">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.id}`} alt="profile" />
          </div>
          <div className="mb-2">
            <div className="flex items-center gap-1">
              <h1 className="text-2xl font-bold text-white">{worker.userData.name}</h1>
              {worker.verified && <CheckCircle size={18} className="text-green-400" />}
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold">{worker.rating}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{worker.workArea}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="px-6 mt-8 space-y-8">
        {/* ABOUT */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Tentang</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {worker.description}
          </p>
        </section>

        {/* INFO GRIDS */}
        <section className="grid grid-cols-2 gap-4">
           <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl text-green-600 shadow-sm">
                <Award size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pengalaman</span>
                <span className="text-sm font-bold text-gray-900">{worker.experience}</span>
              </div>
           </div>
           <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl text-green-600 shadow-sm">
                <Clock size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ready</span>
                <span className="text-sm font-bold text-gray-900">{worker.activeStatus}</span>
              </div>
           </div>
        </section>

        {/* CATEGORIES */}
        <section>
           <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
             <Briefcase size={18} /> Jasa & Skill
           </h2>
           <div className="flex flex-wrap gap-2">
             {worker.categories.map(cat => (
               <span key={cat} className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium border border-green-100">
                 {cat}
               </span>
             ))}
           </div>
        </section>

        {/* PORTFOLIO FEED */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Portofolio Kerja</h2>
            <span className="text-xs text-gray-400">Total 12 Post</span>
          </div>

          <div className="space-y-6">
            {[1, 2].map((i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
                  <img src={`https://picsum.photos/seed/${worker.id}-${i+10}/800/600`} className="w-full h-full object-cover" alt="portfolio" />
                </div>
                <div className="mt-4 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Pindahan Rumah</span>
                    <span className="text-[10px] text-gray-400">2 hari lalu</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Bantu pindahan rumah di Juwana. Angkut lemari, kulkas, dan peralatan dapur ke lokasi baru. Segala medan siap tempur.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* REVIEWS */}
        <section className="bg-gray-50 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Ulasan</h2>
            <div className="flex items-center gap-1 text-yellow-500 font-bold">
               <Star size={16} fill="currentColor" /> {worker.rating}
            </div>
          </div>
          
          <div className="space-y-4">
             {[1, 2].map(i => (
               <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                 <div className="flex items-center justify-between mb-2">
                   <span className="font-bold text-sm text-gray-900">Andini Putri</span>
                   <div className="flex gap-0.5">
                     {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="text-yellow-500 fill-currentColor" />)}
                   </div>
                 </div>
                 <p className="text-xs text-gray-500 italic">"Cepat datang, kerjanya rapi, dan orangnya ramah banget. Motor tossanya beneran saktii."</p>
               </div>
             ))}
          </div>
        </section>
      </div>

      {/* CTA STICKY BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
         <button className="w-14 h-14 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-600 group active:scale-95 transition-transform">
           <Star size={24} className="group-active:text-yellow-500" />
         </button>
         <button 
           onClick={handleWhatsApp}
           className="flex-1 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-[0.98] transition-transform"
         >
           <MessageCircle size={20} /> Hubungi WhatsApp
         </button>
      </div>
    </div>
  );
};
