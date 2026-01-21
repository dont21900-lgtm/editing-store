import React, { useState } from 'react';
import { Upload, Settings, Plus, Loader2, Sparkles } from 'lucide-react';
import { addDoc, collection } from "firebase/firestore";
import { db } from '../../services/firebase';
import { uploadToCloudinary } from '../../services/cloudinary';
import { generateAIContent } from '../../services/ai';

const AdminDashboard = ({ stats, accentColor, setAccentColor, onLogout }) => {
    const [showThemePanel, setShowThemePanel] = useState(false);
    const [assetMode, setAssetMode] = useState('upload'); // 'upload' or 'link'
    const [externalAssetLink, setExternalAssetLink] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [newProduct, setNewProduct] = useState({
        title: "",
        category: "Templates",
        price: "",
        image: "purple",
        description: "",
        productFile: null,
        previewFile: null,
        thumbnailFile: null
    });

    const handleFileChange = (e, f) => {
        const file = e.target.files[0];
        if (file) setNewProduct({ ...newProduct, [f]: file });
    };

    const handleGenerateDescription = async () => {
        if (!newProduct.title) return alert("Please enter a title first to generate a description.");

        setIsGeneratingDesc(true);
        const prompt = `Write a short, high-converting description for a digital product named "${newProduct.title}" in the category "${newProduct.category}". Use emojis. Keep it under 30 words.`;

        try {
            const desc = await generateAIContent(prompt);
            setNewProduct(prev => ({ ...prev, description: desc }));
        } catch (err) {
            console.error(err);
            alert("AI Generation Failed. Please try again.");
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.title || !newProduct.price) return alert("Missing fields.");
        if (assetMode === 'link' && !externalAssetLink) return alert("Please paste the external link.");
        if (assetMode === 'upload' && !newProduct.productFile) return alert("Please select a file to upload.");

        setIsUploading(true);
        setUploadStatus("Starting...");

        try {
            let previewUrl = null;
            let productFileUrl = null;
            let customThumbnailUrl = null;

            if (newProduct.previewFile) {
                setUploadStatus("Uploading Video...");
                previewUrl = await uploadToCloudinary(newProduct.previewFile, "video");
            }
            if (newProduct.thumbnailFile) {
                setUploadStatus("Uploading Thumbnail...");
                customThumbnailUrl = await uploadToCloudinary(newProduct.thumbnailFile, "image");
            }
            if (assetMode === 'upload' && newProduct.productFile) {
                setUploadStatus("Uploading Asset...");
                productFileUrl = await uploadToCloudinary(newProduct.productFile, "raw");
            } else if (assetMode === 'link') {
                productFileUrl = externalAssetLink;
            }

            setUploadStatus("Saving...");
            await addDoc(collection(db, "products"), {
                title: newProduct.title,
                price: parseFloat(newProduct.price),
                category: newProduct.category,
                image: newProduct.image, // Legacy field
                description: newProduct.description,
                rating: 5,
                videoUrl: previewUrl,
                fileUrl: null, // SECURITY: Do NOT save the file link to public DB. Admin must save it in Zapier/Make.
                customThumbnailUrl: customThumbnailUrl,
                fileName: assetMode === 'upload' ? (newProduct.productFile?.name || "file") : "External Link",
                originalFileUrl: productFileUrl, // Optional: Keep a reference if you want, but fileUrl must be null for users.
                createdAt: new Date().toISOString()
            });

            alert(`Product Uploaded! \n\nIMPORTANT: The Download Link is NOT saved to the website for security.\n\nCOPY THIS LINK NOW for your Zapier/Make automation:\n${productFileUrl}`);
            setNewProduct({ title: "", category: "Templates", price: "", image: "purple", description: "", productFile: null, previewFile: null, thumbnailFile: null });
            setExternalAssetLink("");
            setIsFormOpen(false);
        } catch (error) {
            console.error(error);
            alert("Upload Error: " + error.message);
        } finally {
            setIsUploading(false);
            setUploadStatus("");
        }
    };

    return (
        <section className="bg-[#111] border border-white/20 p-8 mb-16 relative overflow-hidden animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-3xl font-bold flex items-center gap-3 uppercase tracking-wider"><Upload className="w-8 h-8 text-green-500" /> Admin Dashboard (PRO)</h2>
                <div className="flex gap-4">
                    <button onClick={() => setShowThemePanel(!showThemePanel)} className="text-sm text-white hover:text-gray-300 flex items-center gap-2 px-6 py-3 border border-white/30 hover:bg-white/10 transition-all uppercase tracking-widest font-bold">
                        <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button onClick={onLogout} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2 px-6 py-3 border border-red-500/30 hover:bg-red-500/10 transition-all uppercase tracking-widest font-bold">Sign Out</button>
                </div>
            </div>

            {/* THEME SETTINGS PANEL */}
            {showThemePanel && (
                <div className="mb-8 p-6 bg-[#0a0a0a] border border-white/20 animate-fade-in">
                    <h3 className="text-white font-bold uppercase mb-4 text-xs tracking-widest">Global Theme Accent</h3>
                    <div className="flex gap-4 flex-wrap">
                        {['#6500aa', '#E50914', '#2563eb', '#22c55e', '#f97316', '#ec4899'].map(color => (
                            <button
                                key={color}
                                onClick={() => setAccentColor(color)}
                                className="w-10 h-10 border border-white/20 transition-transform hover:scale-110"
                                style={{ backgroundColor: color, borderColor: accentColor === color ? 'white' : 'rgba(255,255,255,0.2)' }}
                            />
                        ))}
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-4 font-mono">Changes apply instantly to buttons, borders, and highlights.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/20 mb-8">
                <div className="bg-black p-8 border-r border-white/20"><p className="text-xs text-neutral-500 uppercase tracking-wider mb-2 font-mono">Revenue</p><h3 className="text-4xl font-black text-white">₹{stats.totalRevenue.toLocaleString()}</h3></div>
                <div className="bg-black p-8 border-r border-white/20"><p className="text-xs text-neutral-500 uppercase tracking-wider mb-2 font-mono">Orders</p><h3 className="text-4xl font-black text-white">{stats.totalOrders}</h3></div>
                <div className="bg-black p-8"><p className="text-xs text-neutral-500 uppercase tracking-wider mb-2 font-mono">Total Visitors</p><h3 className="text-4xl font-black text-white">{stats.totalVisitors.toLocaleString()}</h3></div>
            </div>

            <button onClick={() => setIsFormOpen(!isFormOpen)} className="w-full py-5 bg-white text-black text-sm uppercase tracking-widest font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 border border-white" style={{ backgroundColor: accentColor === '#ffffff' ? 'white' : 'white', color: 'black' }}><Plus className="w-5 h-5" /> Add Product</button>

            {isFormOpen && (
                <div className="mt-8 p-8 bg-[#0a0a0a] border border-white/20 animate-fade-in">
                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 flex gap-4 p-2 bg-[#111] border border-white/10 w-fit">
                            <button type="button" onClick={() => setAssetMode('upload')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${assetMode === 'upload' ? 'bg-[#6500aa] text-white' : 'text-neutral-400 hover:text-white'}`}>Upload File</button>
                            <button type="button" onClick={() => setAssetMode('link')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${assetMode === 'link' ? 'bg-[#6500aa] text-white' : 'text-neutral-400 hover:text-white'}`}>External Link</button>
                        </div>

                        <div className="md:col-span-1"><label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Video Preview</label><input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'previewFile')} className="w-full p-3 bg-[#111] border border-white/10 text-white font-mono text-xs" /></div>
                        <div className="md:col-span-1"><label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Thumbnail (Optional)</label><input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'thumbnailFile')} className="w-full p-3 bg-[#111] border border-white/10 text-white font-mono text-xs" /></div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">Main Asset</label>
                            {assetMode === 'upload' ? (
                                <input type="file" onChange={(e) => handleFileChange(e, 'productFile')} className="w-full p-3 bg-[#111] border border-white/10 text-white font-mono text-xs" />
                            ) : (
                                <input type="url" placeholder="Paste Google Drive / External Link..." className="w-full p-4 bg-[#111] border border-white/20 text-white placeholder-neutral-600 outline-none focus:border-[#6500aa] font-mono text-sm" value={externalAssetLink} onChange={(e) => setExternalAssetLink(e.target.value)} />
                            )}
                        </div>

                        <div className="md:col-span-2"><input type="text" required placeholder="PRODUCT TITLE" className="w-full p-4 bg-[#111] border border-white/20 text-white placeholder-neutral-600 outline-none focus:border-[#6500aa] font-mono text-sm" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} /></div>
                        <div><input type="number" required placeholder="PRICE (INR)" className="w-full p-4 bg-[#111] border border-white/20 text-white placeholder-neutral-600 outline-none focus:border-[#6500aa] font-mono text-sm" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} /></div>
                        <div>
                            <select className="w-full p-4 bg-[#111] border border-white/20 text-white outline-none focus:border-[#6500aa] font-mono text-sm" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                                <option>Templates</option><option>Assets</option><option>Bundle</option><option>Transitions</option><option>Project Files</option><option>Color</option><option>Titles</option><option>Overlays</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 relative">
                            <textarea className="w-full p-4 bg-[#111] border border-white/20 text-white placeholder-neutral-600 outline-none focus:border-[#6500aa] font-mono text-sm h-32" placeholder="DESCRIPTION..." value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                            <button type="button" onClick={handleGenerateDescription} disabled={isGeneratingDesc} className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-widest text-[#6500aa] hover:text-white flex items-center gap-1">{isGeneratingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Sparkles className="w-3 h-3" /> AI Write</>}</button>
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" disabled={isUploading} className="w-full py-5 bg-white text-black font-bold uppercase tracking-widest hover:bg-[#6500aa] hover:text-white transition-colors border border-transparent hover:border-white">
                                {isUploading ? (uploadStatus || "Uploading...") : "Save Product"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
};

export default AdminDashboard;
