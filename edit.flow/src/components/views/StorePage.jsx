import React, { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import ProductCard from '../features/ProductCard';
import AdminDashboard from '../features/AdminDashboard';

const StorePage = ({
    isSessionActive,
    accentColor,
    setAccentColor,
    handleLogout,
    stats,
    filterCategories,
    activeCategory,
    setActiveCategory,
    products,
    loading,
    addToCart,
    setEditingProduct,
    setShowEditModal,
    handleDeleteProduct
}) => {

    // Memoized Filter
    const filteredProducts = useMemo(() => products.filter(p => {
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        return matchesCategory;
    }), [products, activeCategory]);

    return (
        <>
            {!isSessionActive && (
                <section className="relative pt-32 pb-10 text-center overflow-hidden z-10 border-b border-white/20">
                    <div className="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-10 filter blur-sm grayscale" alt="Background Texture" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]"></div>
                    </div>
                    <div className="relative z-10 max-w-5xl mx-auto px-6">
                        <h1 className="text-6xl md:text-9xl font-black mb-4 tracking-tighter uppercase leading-none">
                            DIGITAL <br /><span className="text-[#6500aa]">MASTERY</span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed font-mono">
                            PREMIUM ASSETS // CURATED FOR VISIONARIES
                        </p>
                    </div>
                </section>
            )}

            <main className="max-w-7xl mx-auto px-6 py-16 relative z-10 pb-32">
                {isSessionActive && (
                    <AdminDashboard
                        stats={stats}
                        accentColor={accentColor}
                        setAccentColor={setAccentColor}
                        onLogout={handleLogout}
                    />
                )}

                <div className="flex gap-4 mb-8 overflow-x-auto pb-4 custom-scrollbar">
                    {filterCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 text-sm font-bold uppercase tracking-widest border transition-all ${activeCategory === cat
                                ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white'
                                : 'border-white/20 text-neutral-400 hover:border-white hover:text-white'
                                }`}
                            style={activeCategory === cat ? { '--accent-color': accentColor } : {}}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? <div className="flex justify-center h-64 items-center"><Loader2 className="w-12 h-12 animate-spin" style={{ color: accentColor }} /></div> : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(p => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                addToCart={addToCart}
                                isSessionActive={isSessionActive}
                                accentColor={accentColor}
                                setEditingProduct={setEditingProduct}
                                setShowEditModal={setShowEditModal}
                                handleDeleteProduct={handleDeleteProduct}
                            />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
};

export default StorePage;
