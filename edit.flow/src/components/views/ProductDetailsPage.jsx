import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../services/firebase';
import { ArrowLeft, ShoppingBag, Star, Share2, ShieldCheck, Download, Loader2 } from 'lucide-react';

const ProductDetailsPage = ({ addToCart, accentColor }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!db) return;
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    alert("Product not found");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="w-8 h-8 animate-spin text-white" /></div>;
    if (!product) return null;

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-20 px-6 relative z-10 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Media */}
                    <div className="space-y-6">
                        <div className="relative aspect-video bg-black border border-white/10 overflow-hidden shadow-2xl">
                            {product.videoUrl ? (
                                <video
                                    ref={videoRef}
                                    src={product.videoUrl}
                                    controls
                                    className="w-full h-full object-contain"
                                    poster={product.customThumbnailUrl || null}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-600">No Preview Available</div>
                            )}
                        </div>

                        {/* Thumbnails / Extras could go here */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-[#111] p-4 border border-white/10 flex flex-col items-center justify-center text-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-green-500" />
                                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Secure Payment</span>
                            </div>
                            <div className="bg-[#111] p-4 border border-white/10 flex flex-col items-center justify-center text-center gap-2">
                                <Download className="w-6 h-6 text-blue-500" />
                                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Instant Download</span>
                            </div>
                            <div className="bg-[#111] p-4 border border-white/10 flex flex-col items-center justify-center text-center gap-2">
                                <Star className="w-6 h-6 text-yellow-500" />
                                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Top Rated</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col">
                        <div className="mb-2 flex items-center gap-4">
                            <span className="bg-[#6500aa] text-white text-xs px-3 py-1 uppercase tracking-wider font-bold" style={{ backgroundColor: accentColor }}>{product.category}</span>
                            <div className="flex gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">{product.title}</h1>

                        <div className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-8 flex items-center justify-between">
                            <span>₹{product.price.toFixed(2)}</span>
                            <button className="p-3 border border-white/20 rounded-full hover:bg-white/10 text-white transition-colors" title="Share">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="prose prose-invert max-w-none mb-12">
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Description</h3>
                            <p className="text-neutral-400 font-mono leading-relaxed whitespace-pre-line">
                                {product.description || "No description provided."}
                            </p>
                        </div>

                        <div className="mt-auto">
                            <button
                                onClick={() => addToCart(product)}
                                className="w-full py-6 bg-white text-black text-lg font-black uppercase tracking-widest hover:bg-[#6500aa] hover:text-white transition-all flex items-center justify-center gap-4 border border-transparent hover:border-white shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(101,0,170,0.5)]"
                                style={{ '--hover-color': accentColor }}
                            >
                                <ShoppingBag className="w-6 h-6" /> Add to Cart
                            </button>
                            <p className="text-center text-neutral-500 text-xs mt-4 font-mono uppercase">
                                License: Standard Commercial Use
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
