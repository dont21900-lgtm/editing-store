import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Edit, Trash2, ImageIcon } from 'lucide-react';

const ProductCard = ({ product, addToCart, isSessionActive, accentColor, setEditingProduct, setShowEditModal, handleDeleteProduct }) => {
    const vRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (vRef.current) {
            if (isHovered) {
                // Ensure promise handling for play()
                const playPromise = vRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // Auto-play was prevented
                        console.log("Video play failed (likely intentional):", error);
                    });
                }
            } else {
                vRef.current.pause();
                vRef.current.currentTime = 0;
            }
        }
    }, [isHovered]);

    return (
        <div
            className="group flex flex-col bg-[#0a0a0a] border border-white/20 transition-all duration-300 relative hover:border-[var(--accent-color)] cursor-pointer"
            style={{ '--accent-color': accentColor }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate(`/product/${product.id}`)}
        >

            {isSessionActive && <div className="absolute top-4 right-4 z-50 flex gap-2"><button onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setShowEditModal(true) }} className="p-2 bg-blue-600 text-white rounded-sm"><Edit className="w-4 h-4" /></button><button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id) }} className="p-2 bg-red-600 text-white rounded-sm"><Trash2 className="w-4 h-4" /></button></div>}

            <div className="relative aspect-[16/10] bg-black overflow-hidden border-b border-white/20">
                {product.videoUrl ? <><video ref={vRef} src={product.videoUrl} preload="none" muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" />{product.customThumbnailUrl && <img src={product.customThumbnailUrl} className={`absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-0' : 'opacity-100'}`} />}</> : <div className={`absolute inset-0 bg-[#1a1a1a] opacity-80 pointer-events-none flex items-center justify-center text-white/10`}><ImageIcon className="w-12 h-12" /></div>}
                {!product.videoUrl && <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-20 pointer-events-none" />}

                {/* Add Button Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center z-30 transition-all duration-300 bg-black/50 ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product) }} className="bg-white text-black px-8 py-3 font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#6500aa] hover:text-white transition-colors pointer-events-auto border border-transparent hover:border-white">
                        <ShoppingBag className="w-4 h-4" /> Add
                    </button>
                </div>
            </div>

            <div className="p-6 bg-[#0a0a0a] group-hover:bg-[#111] transition-colors pointer-events-none flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-lg tracking-tight uppercase leading-tight relative z-10 line-clamp-1">{product.title}</h3>
                    <span className="bg-white/10 text-white text-[10px] px-2 py-1 uppercase tracking-wider">{product.category}</span>
                </div>
                <p className="text-xs text-[#888] line-clamp-2 mt-2 relative z-10 font-mono leading-relaxed mb-4">{product.description}</p>

                <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-3 pointer-events-auto">
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-black text-white">₹{product.price.toFixed(2)}</span>
                        <div className="flex gap-1 opacity-50">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-white fill-current" />)}</div>
                    </div>

                    {/* ALWAYS VISIBLE ADD BUTTON */}
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product) }} className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--accent-color)] hover:text-white transition-colors border border-transparent hover:border-white text-xs" style={{ '--accent-color': accentColor }}>
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductCard);
