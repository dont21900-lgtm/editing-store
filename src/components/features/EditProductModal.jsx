import React, { useState } from 'react';
import { Edit, X, Loader2, Sparkles } from 'lucide-react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../services/firebase';
import { uploadToCloudinary } from '../../services/cloudinary';
import { generateAIContent } from '../../services/ai';

const EditProductModal = ({ product, onClose, onUpdateSuccess }) => {
    const [editingProduct, setEditingProduct] = useState({ ...product });
    const [editThumbnailFile, setEditThumbnailFile] = useState(null);
    const [editProductFile, setEditProductFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let updatedThumbnailUrl = editingProduct.customThumbnailUrl || null;
            let updatedFileUrl = editingProduct.fileUrl;

            // Upload new thumbnail if selected
            if (editThumbnailFile) {
                updatedThumbnailUrl = await uploadToCloudinary(editThumbnailFile, "image");
            }

            // Upload new asset file if selected
            if (editProductFile) {
                updatedFileUrl = await uploadToCloudinary(editProductFile, "raw");
            }

            const productRef = doc(db, "products", editingProduct.id);

            // Update Firestore
            await updateDoc(productRef, {
                title: editingProduct.title,
                price: parseFloat(editingProduct.price),
                category: editingProduct.category,
                description: editingProduct.description,
                customThumbnailUrl: updatedThumbnailUrl,
                fileUrl: updatedFileUrl
            });

            alert("Product Updated Successfully!");
            onUpdateSuccess();
            onClose();

        } catch (error) {
            console.error("Update Error:", error);
            alert("Failed to update product: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleGenerateDescription = async () => {
        setIsGeneratingDesc(true);
        const prompt = `Write a short, high-converting description for a digital product named "${editingProduct.title}" in the category "${editingProduct.category}". Use emojis. Keep it under 30 words.`;

        try {
            const desc = await generateAIContent(prompt);
            setEditingProduct(prev => ({ ...prev, description: desc }));
        } catch (err) {
            console.error(err);
            alert("AI Generation Failed. Please try again.");
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-[#050505] border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
                {/* Header - Fixed */}
                <div className="flex justify-between items-start p-8 pb-4 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <Edit className="w-6 h-6 text-[#6500aa]" /> Edit Product
                    </h2>
                    <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto custom-scrollbar flex-grow p-8 pt-4">
                    <form id="editProductForm" onSubmit={handleUpdateProduct} className="space-y-6">
                        <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Title</label>
                            <input type="text" className="w-full p-4 bg-[#111] border border-white/20 text-white placeholder-neutral-600 outline-none focus:border-[#6500aa] font-mono text-sm" value={editingProduct.title} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Price</label>
                                <input type="number" className="w-full p-4 bg-[#111] border border-white/20 text-white placeholder-neutral-600 outline-none focus:border-[#6500aa] font-mono text-sm" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Category</label>
                                <select className="w-full p-4 bg-[#111] border border-white/20 text-white outline-none focus:border-[#6500aa] font-mono text-sm" value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}>
                                    <option>Templates</option><option>Assets</option><option>Bundle</option><option>Transitions</option><option>Project Files</option><option>Color</option><option>Titles</option><option>Overlays</option>
                                </select>
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Description</label>
                            <textarea className="w-full p-4 bg-[#111] border border-white/20 text-white placeholder-neutral-600 outline-none focus:border-[#6500aa] font-mono text-sm h-32" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                            <button type="button" onClick={handleGenerateDescription} disabled={isGeneratingDesc} className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-widest text-[#6500aa] hover:text-white flex items-center gap-1">
                                {isGeneratingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Sparkles className="w-3 h-3" /> AI Write</>}
                            </button>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">New Thumbnail (Optional)</label>
                            <input type="file" accept="image/*" onChange={(e) => setEditThumbnailFile(e.target.files[0])} className="w-full p-3 bg-[#111] border border-white/10 text-white font-mono text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Replace Asset (Optional)</label>
                            <input type="file" onChange={(e) => setEditProductFile(e.target.files[0])} className="w-full p-3 bg-[#111] border border-white/10 text-white font-mono text-xs" />
                        </div>
                    </form>
                </div>

                {/* Footer - Fixed Button */}
                <div className="border-t border-white/10 p-8 pt-4 flex-shrink-0 bg-[#050505]">
                    <button form="editProductForm" type="submit" disabled={isUploading} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-[#6500aa] hover:text-white transition-colors border border-transparent hover:border-white disabled:opacity-50">
                        {isUploading ? "Updating..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;
