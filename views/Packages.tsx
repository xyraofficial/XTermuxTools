import React, { useState, useMemo, useEffect } from 'react';
import { Search, Package, Heart, ArrowDownAZ, ArrowUpAZ, Plus, Check, ShoppingCart, Copy, X } from 'lucide-react';
import { PACKAGES } from '../constants';
import { PackageItem } from '../types';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';

type CategoryType = 'All' | 'Development' | 'System' | 'Network' | 'Utility' | 'Saved';
type SortOrder = 'AZ' | 'ZA';

import { LanguageProvider, useLanguage } from '../LanguageContext';

const Packages: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  const translations = {
    en: {
      search: "Search Vault...",
      removed: "Removed",
      saved: "Saved",
      categories: { All: "All", Saved: "Saved", Development: "Development", System: "System", Network: "Network", Utility: "Utility" }
    },
    id: {
      search: "Cari Gudang...",
      removed: "Dihapus",
      saved: "Disimpan",
      categories: { All: "Semua", Saved: "Tersimpan", Development: "Pengembangan", System: "Sistem", Network: "Jaringan", Utility: "Utilitas" }
    },
    hi: {
      search: "वॉल्ट खोजें...",
      removed: "हटाया गया",
      saved: "सहेजा गया",
      categories: { All: "सभी", Saved: "सहेजा गया", Development: "विकास", System: "सिस्टम", Network: "नेटवर्क", Utility: "उपयोगिता" }
    }
  };

  const t = translations[language];
  
  const CATEGORIES: { name: CategoryType; icon: string }[] = [
    { name: 'All', icon: '📦' },
    { name: 'Saved', icon: '❤️' },
    { name: 'Development', icon: '💻' },
    { name: 'System', icon: '⚙️' },
    { name: 'Network', icon: '🌐' },
    { name: 'Utility', icon: '🔧' },
  ];
  const FAVORITES_KEY = 'xtermux_favorites';
  const INSTALL_QUEUE_KEY = 'xtermux_install_queue';
  const ITEMS_PER_PAGE = 15;

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('AZ');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [installQueue, setInstallQueue] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showQueueOverlay, setShowQueueOverlay] = useState(false);

  useEffect(() => {
    const savedFavs = localStorage.getItem(FAVORITES_KEY);
    if (savedFavs) try { setFavorites(JSON.parse(savedFavs)); } catch (e) {}
    const savedQueue = localStorage.getItem(INSTALL_QUEUE_KEY);
    if (savedQueue) try { setInstallQueue(JSON.parse(savedQueue)); } catch (e) {}
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newFavs = favorites.includes(id) ? favorites.filter(fid => fid !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
    showToast(favorites.includes(id) ? t.removed : t.saved, 'info');
    window.dispatchEvent(new CustomEvent('favorites-updated'));
  };

  const toggleQueue = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newQueue = installQueue.includes(id) ? installQueue.filter(qid => qid !== id) : [...installQueue, id];
    setInstallQueue(newQueue);
    localStorage.setItem(INSTALL_QUEUE_KEY, JSON.stringify(newQueue));
  };

  const filteredPackages = useMemo(() => {
    return PACKAGES.filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Saved' ? favorites.includes(pkg.id) : (selectedCategory === 'All' || pkg.category === selectedCategory);
      return matchesSearch && matchesCategory;
    }).sort((a, b) => sortOrder === 'AZ' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  }, [searchTerm, selectedCategory, favorites, sortOrder]);

  const visiblePackages = filteredPackages.slice(0, visibleCount);

  return (
    <div className="flex flex-col min-h-full bg-black">
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" placeholder={t.search} value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 pl-11 pr-4 py-3 rounded-2xl text-sm focus:border-accent/50 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button key={cat.name} onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl border whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat.name ? 'bg-accent text-black border-accent' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}
            >
              {cat.icon} {(t.categories as any)[cat.name]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 gap-4 pb-32">
        {visiblePackages.map((pkg) => (
          <div key={pkg.id} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                  <Package size={20} className="text-accent" />
                </div>
                <div>
                  <h4 className="font-black text-white text-base">{pkg.name}</h4>
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{pkg.category}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={(e) => toggleFavorite(e, pkg.id)} className={`p-2.5 rounded-xl border ${favorites.includes(pkg.id) ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-zinc-900 border-white/5 text-zinc-600'}`}>
                  <Heart size={16} className={favorites.includes(pkg.id) ? 'fill-current' : ''} />
                </button>
                <button onClick={(e) => toggleQueue(e, pkg.id)} className={`p-2.5 rounded-xl border ${installQueue.includes(pkg.id) ? 'bg-accent text-black border-accent' : 'bg-zinc-900 border-white/5 text-zinc-600'}`}>
                  {installQueue.includes(pkg.id) ? <Check size={16} /> : <Plus size={16} />}
                </button>
              </div>
            </div>
            <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">{pkg.description}</p>
            <CodeBlock code={pkg.installCommand} />
          </div>
        ))}
      </div>

      {installQueue.length > 0 && (
        <button onClick={() => setShowQueueOverlay(true)} className="fixed bottom-24 right-6 z-50 bg-accent text-black p-4 rounded-2xl shadow-2xl active:scale-95 transition-all">
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-accent">{installQueue.length}</span>
        </button>
      )}
    </div>
  );
};

export default Packages;
