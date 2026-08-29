import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ExternalLink, 
  MessageSquare, 
  Check, 
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  Laptop,
  Cpu,
  HardDrive,
  Monitor,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { PRODUCTS_DATA, COMPANY_INFO } from '../data/mockData';
import { ProductItem } from '../types';

interface ProductsSectionProps {
  onSelectProduct: (product: ProductItem) => void;
  onOpenQuoteModal: (productName: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  onSelectProduct, 
  onOpenQuoteModal 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Tech & Hardware' },
    { id: 'laptops', label: 'Laptops' },
    { id: 'desktops', label: 'Workstations & PCs' },
    { id: 'storage-ram', label: 'SSDs & RAM' },
    { id: 'monitors', label: 'Monitors & Displays' },
    { id: 'accessories', label: 'Chargers & Accessories' },
  ];

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'laptops':
        return <Laptop className="w-5 h-5 text-orange-600" />;
      case 'desktops':
        return <Cpu className="w-5 h-5 text-orange-600" />;
      case 'storage-ram':
        return <HardDrive className="w-5 h-5 text-orange-600" />;
      case 'monitors':
        return <Monitor className="w-5 h-5 text-orange-600" />;
      default:
        return <Zap className="w-5 h-5 text-orange-600" />;
    }
  };

  const filteredProducts = PRODUCTS_DATA.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEnquireWhatsApp = (product: ProductItem) => {
    const text = encodeURIComponent(
      `Hello Bolt Computer Services, I am interested in inquiring about the *${product.name}* (${product.condition}). Is it available at your Ikeja office?`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <section 
      id="products" 
      className="py-24 bg-gradient-to-b from-slate-50 via-orange-50/30 to-white border-b border-orange-100 relative"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-orange-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-950 text-xs font-bold tracking-wider uppercase font-display">
            <ShoppingBag className="w-3.5 h-3.5 text-orange-600" />
            <span>BOLT HARDWARE STORE &bull; VERIFIED COMPUTERS &amp; PARTS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-slate-900">
            TESTED COMPUTERS,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700">
              UPGRADES &amp; ACCESSORIES
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            Need a reliable machine or verified performance parts? We stock enterprise-grade laptops, custom workstations, genuine GaN chargers, and high-speed NVMe storage.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-700 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hardware, SSD, RAM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 font-semibold">No hardware found matching your criteria.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-3 text-sm font-bold text-orange-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-orange-300 shadow-sm hover:shadow-xl hover:shadow-orange-950/5 transition-all duration-300 flex flex-col justify-between overflow-hidden group transform hover:-translate-y-1"
              >
                <div>
                  {/* Card Header (Clean Non-Image Badge Box) */}
                  <div className="p-5 pb-4 border-b border-slate-100 bg-gradient-to-br from-orange-50/60 via-white to-amber-50/30">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0 shadow-xs">
                        {getProductIcon(product.category)}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-orange-600 text-white shadow-xs">
                          {product.condition}
                        </span>
                        {product.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">{product.brand}</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                        In Stock &bull; Tested
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div className="text-xs text-orange-700 font-bold">
                      {product.idealFor.split(',')[0]}
                    </div>

                    <h3 className="text-base font-bold font-display text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Specs snippets */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      {product.specs.slice(0, 3).map((spec, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (View Details & Enquire Now) */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectProduct(product)}
                    id={`btn-details-${product.id}`}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-700 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer bg-slate-50/50 hover:bg-orange-50/50"
                  >
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => handleEnquireWhatsApp(product)}
                    id={`btn-enquire-${product.id}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-bold transition-all shadow-sm shadow-orange-500/20 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white" />
                    <span>Enquire Now</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Custom Configuration Order Callout */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white border border-orange-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-orange-100 text-orange-600 items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold font-display text-slate-900">Looking for a specific configuration or bulk corporate procurement?</h4>
              <p className="text-sm text-slate-600">We source verified bulk business laptops, specialized workstations, and custom server hardware on demand.</p>
            </div>
          </div>
          <button
            onClick={() => onOpenQuoteModal('Custom Hardware Procurement')}
            className="shrink-0 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            Request Custom Spec Quote
          </button>
        </div>

      </div>
    </section>
  );
};
