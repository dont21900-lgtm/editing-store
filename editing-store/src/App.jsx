import React, { useState, useRef } from 'react';
import { ShoppingBag, X, Menu, Search, Star, Play, ArrowRight, Mail, CheckCircle, Plus, Minus, Instagram, Twitter, Youtube, Upload, Lock, LogOut, FileText, Trash2, Video, Eye } from 'lucide-react';

const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: "Cinematic Glitch Transitions",
    category: "Transitions",
    price: 29.99,
    rating: 5,
    image: "purple",
    description: "Drag-and-drop transitions for Premiere Pro & After Effects. Includes 50+ unique assets.",
    fileName: "glitch-pack-v2.zip",
    videoUrl: null // Placeholder for existing items
  },
  {
    id: 2,
    title: "Urban Music Video Project",
    category: "Project Files",
    price: 49.99,
    rating: 4,
    image: "orange",
    description: "Complete AE project file breakdown. Learn how to create professional music video effects.",
    fileName: "urban-mv-project.aep",
    videoUrl: null
  },
  {
    id: 3,
    title: "Moody Color Grading LUTs",
    category: "Color",
    price: 19.99,
    rating: 5,
    image: "blue",
    description: "15 High-quality .CUBE files designed for Sony S-Log and Blackmagic RAW footage.",
    fileName: "moody-luts-bundle.zip",
    videoUrl: null
  },
  {
    id: 4,
    title: "Typography Motion Kit",
    category: "Titles",
    price: 34.50,
    rating: 5,
    image: "green",
    description: "Essential kinetic typography templates. Fully customizable fonts and colors.",
    fileName: "typo-motion-kit.mogrt",
    videoUrl: null
  },
  {
    id: 5,
    title: "VFX Asset Bundle: Smoke & Fire",
    category: "Overlays",
    price: 24.99,
    rating: 4,
    image: "red",
    description: "4K ProRes overlays with alpha channel. instant drag and drop realism.",
    fileName: "smoke-fire-vfx.mov",
    videoUrl: null
  },
  {
    id: 6,
    title: "Documentary Narrative Template",
    category: "Project Files",
    price: 39.99,
    rating: 5,
    image: "yellow",
    description: "A complete storytelling structure project file for long-form documentary editing.",
    fileName: "docu-template.prproj",
    videoUrl: null
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Alex R.",
    role: "Freelance Editor",
    text: "These assets saved me hours on my last client project. The glitch transitions are just chef's kiss! 👌",
    image: "bg-blue-500"
  },
  {
    id: 2,
    name: "Sarah K.",
    role: "YouTuber (500k subs)",
    text: "Finally, high-quality LUTs that don't break my footage. My vlogs look cinematic instantly.",
    image: "bg-purple-500"
  },
  {
    id: 3,
    name: "Marcus J.",
    role: "Filmmaker",
    text: "The project files are a goldmine for learning. Highly recommend for anyone wanting to up their game.",
    image: "bg-orange-500"
  }
];

const FAQS = [
  {
    question: "Do these work with DaVinci Resolve?",
    answer: "Yes! Our LUTs (.cube) and video overlays (ProRes) work in all major editing software including Premiere, After Effects, DaVinci, and FCPX."
  },
  {
    question: "How do I receive the files?",
    answer: "Instantly. After payment, you'll receive a direct download link via email and on the checkout confirmation page."
  },
  {
    question: "Can I use these for commercial work?",
    answer: "Absolutely. All assets come with a commercial license. You can use them in client work, YouTube videos, and films without extra fees."
  }
];

const App = () => {
  // State for Products (Dynamic now)
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  
  // Existing States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Admin States
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "Transitions",
    price: "",
    image: "purple",
    description: "",
    productFile: null, // The actual asset (zip, aep)
    previewFile: null  // The video preview (mp4)
  });

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword("");
    } else {
      alert("Incorrect Password!");
    }
  };

  const handleProductFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, productFile: file });
    }
  };

  const handlePreviewFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, previewFile: file });
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return;

    // Simulate file upload (create a local URL for the file if needed, or just store the name)
    const productFileName = newProduct.productFile ? newProduct.productFile.name : "digital-download.zip";
    
    // Create a Blob URL for the video preview so it plays instantly
    let previewUrl = null;
    if (newProduct.previewFile) {
      previewUrl = URL.createObjectURL(newProduct.previewFile);
    }

    const productToAdd = {
      id: products.length + 1,
      ...newProduct,
      price: parseFloat(newProduct.price),
      rating: 5,
      fileName: productFileName,
      videoUrl: previewUrl
    };

    setProducts([productToAdd, ...products]);
    setNewProduct({
        title: "",
        category: "Transitions",
        price: "",
        image: "purple",
        description: "",
        productFile: null,
        previewFile: null
    });
    alert(`Product "${productToAdd.title}" uploaded successfully!`);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const getGradient = (colorName) => {
    const colors = {
      purple: "from-purple-600 to-blue-600",
      orange: "from-orange-500 to-red-600",
      blue: "from-blue-500 to-cyan-400",
      green: "from-emerald-500 to-teal-600",
      red: "from-red-600 to-rose-500",
      yellow: "from-yellow-400 to-orange-500"
    };
    return colors[colorName] || "from-gray-700 to-gray-900";
  };

  // Helper component for Product Card with Video Hover
  const ProductCard = ({ product }) => {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.log("Play failed", e));
      }
    };

    const handleMouseLeave = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Reset to start
      }
    };

    return (
      <div 
        className="group flex flex-col bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Image / Video Area */}
        <div className="relative aspect-[16/10] overflow-hidden bg-black">
          
          {/* Gradient Thumbnail - SIRF TAB DIKHEGA JAB VIDEO NAHI HAI */}
          {!product.videoUrl && (
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(product.image)} opacity-80 group-hover:scale-110 transition-transform duration-700`} />
          )}
          
          {/* Video Layer (Always Visible if URL exists) - No opacity transition */}
          {product.videoUrl && (
            <video
              ref={videoRef}
              src={product.videoUrl}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          )}

          {/* Overlay Content - Only show dark overlay if NO video, to keep video clear */}
          {!product.videoUrl && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-10 pointer-events-none">
            </div>
          )}

           {/* Add to Cart Button (Centered on hover) */}
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 hover:bg-neutral-200 cursor-pointer shadow-xl"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
           </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10 z-20">
            {product.category}
          </div>

          {/* Video Indicator Badge */}
          {product.videoUrl && (
             <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-1.5 rounded-full text-white border border-white/10 z-20 group-hover:opacity-0 transition-opacity">
               <Video className="w-3 h-3" />
             </div>
          )}
        </div>

        {/* Card Info */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              {product.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < product.rating ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-700'}`} />
            ))}
            <span className="text-xs text-neutral-500 ml-2">({Math.floor(Math.random() * 50) + 10} reviews)</span>
          </div>

          <p className="text-sm text-neutral-400 mb-6 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
            <button 
              onClick={() => addToCart(product)}
              className="md:hidden p-2 bg-white/10 rounded-full text-white"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-neutral-950/80 border-b border-white/5 supports-[backdrop-filter]:bg-neutral-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">EDIT.FLOW</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-400">
              <a href="#products" className="hover:text-white transition-colors">Assets</a>
              <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>

            <div className="flex items-center gap-4">
              {isAdmin && (
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded border border-green-500/20">
                  <Lock className="w-3 h-3" /> Admin Mode
                </span>
              )}

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-white/10 rounded-full transition-colors group"
              >
                <ShoppingBag className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
                    {cart.reduce((a, b) => a + b.qty, 0)}
                  </span>
                )}
              </button>
              <button 
                className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-white/10 p-4 space-y-4">
          <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className="block text-neutral-400 hover:text-white">Assets</a>
          <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="block text-neutral-400 hover:text-white">Reviews</a>
          <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="block text-neutral-400 hover:text-white">FAQ</a>
        </div>
      )}

      {/* Admin Dashboard Section (Only Visible to Admin) */}
      {isAdmin && (
        <section className="bg-neutral-900 border-b border-white/10 border-t-4 border-t-green-500 py-8 px-4">
          <div className="max-w-4xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Upload className="w-6 h-6 text-green-500" /> Admin Upload Panel
                </h2>
                <button 
                    onClick={() => setIsAdmin(false)}
                    className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
             </div>
             
             <form onSubmit={handleAddProduct} className="bg-black/40 p-6 rounded-xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Video Preview Upload Section */}
                <div className="md:col-span-1">
                   <label className="block text-xs font-medium text-neutral-400 mb-2">Video Preview (MP4)</label>
                   <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors h-40 flex flex-col items-center justify-center ${newProduct.previewFile ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}>
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={handlePreviewFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {newProduct.previewFile ? (
                        <>
                           <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                             <Video className="w-5 h-5 text-blue-500" />
                           </div>
                           <p className="text-sm font-bold text-white truncate max-w-[200px]">{newProduct.previewFile.name}</p>
                           <p className="text-xs text-blue-400 mt-1">Preview Ready</p>
                        </>
                      ) : (
                        <>
                           <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center mb-2">
                             <Eye className="w-5 h-5 text-neutral-400" />
                           </div>
                           <p className="text-sm font-medium text-white">Upload Demo Video</p>
                           <p className="text-xs text-neutral-500 mt-1">MP4, MOV (Max 10MB)</p>
                        </>
                      )}
                   </div>
                </div>

                {/* 2. Project File Upload Section */}
                <div className="md:col-span-1">
                   <label className="block text-xs font-medium text-neutral-400 mb-2">Project Asset (Zip/AEP)</label>
                   <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors h-40 flex flex-col items-center justify-center ${newProduct.productFile ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}>
                      <input 
                        type="file" 
                        onChange={handleProductFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {newProduct.productFile ? (
                        <>
                           <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                             <FileText className="w-5 h-5 text-green-500" />
                           </div>
                           <p className="text-sm font-bold text-white truncate max-w-[200px]">{newProduct.productFile.name}</p>
                           <p className="text-xs text-green-400 mt-1">Asset Ready</p>
                        </>
                      ) : (
                        <>
                           <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center mb-2">
                             <Upload className="w-5 h-5 text-neutral-400" />
                           </div>
                           <p className="text-sm font-medium text-white">Upload Project File</p>
                           <p className="text-xs text-neutral-500 mt-1">ZIP, AEP, PRPROJ</p>
                        </>
                      )}
                   </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Product Title</label>
                    <input 
                        type="text" 
                        required
                        placeholder="e.g. Cinematic LUTS Pack"
                        className="w-full px-4 py-3 bg-neutral-800 rounded-lg border border-white/10 focus:border-green-500 outline-none text-white transition-all"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Price ($)</label>
                    <input 
                        type="number" 
                        required
                        placeholder="29.99"
                        step="0.01"
                        className="w-full px-4 py-3 bg-neutral-800 rounded-lg border border-white/10 focus:border-green-500 outline-none text-white transition-all"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Category</label>
                    <select 
                        className="w-full px-4 py-3 bg-neutral-800 rounded-lg border border-white/10 focus:border-green-500 outline-none text-white transition-all"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                        <option value="Transitions">Transitions</option>
                        <option value="Project Files">Project Files</option>
                        <option value="Color">Color</option>
                        <option value="Titles">Titles</option>
                        <option value="Overlays">Overlays</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Thumbnail Gradient</label>
                    <select 
                        className="w-full px-4 py-3 bg-neutral-800 rounded-lg border border-white/10 focus:border-green-500 outline-none text-white transition-all"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    >
                        <option value="purple">Purple (Premiere)</option>
                        <option value="orange">Orange (After Effects)</option>
                        <option value="blue">Blue (LUTs)</option>
                        <option value="green">Green (Titles)</option>
                        <option value="red">Red (VFX)</option>
                        <option value="yellow">Yellow (Templates)</option>
                    </select>
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Description</label>
                    <textarea 
                        rows="3"
                        className="w-full px-4 py-3 bg-neutral-800 rounded-lg border border-white/10 focus:border-green-500 outline-none text-white transition-all"
                        placeholder="Short description of the asset..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    />
                </div>

                <div className="md:col-span-2">
                    <button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-[0.98]">
                        Upload Product to Store
                    </button>
                </div>
             </form>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Season 2 Assets Dropped
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            <span className="bg-gradient-to-b from-white via-white to-neutral-400 bg-clip-text text-transparent">Create Content That</span>
            <br />
            <span className="text-blue-500">Stops The Scroll.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Professional grade transitions, LUTs, and project files used by top creators. 
            Download instantly and elevate your edits today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#products" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2">
              Start Creating <ArrowRight className="w-4 h-4" />
            </a>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-semibold rounded-full hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" /> Watch Showreel
            </button>
          </div>

          {/* Social Proof Strip */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="text-sm font-semibold tracking-widest">TRUSTED BY CREATORS FROM</div>
             <div className="flex items-center gap-8">
               <span className="font-bold text-xl">NETFLIX</span>
               <span className="font-bold text-xl">YouTube</span>
               <span className="font-bold text-xl">Vimeo</span>
               <span className="font-bold text-xl">AVID</span>
             </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Latest Assets</h2>
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    activeCategory === cat 
                      ? 'bg-white text-black border-white' 
                      : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-full text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-white/5 border-dashed">
            <Search className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">No assets found matching "{searchTerm}".</p>
            <button onClick={() => {setSearchTerm(""); setActiveCategory("All")}} className="mt-4 text-blue-400 hover:underline">Clear Filters</button>
          </div>
        )}
      </main>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-neutral-900 py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Loved by Editors</h2>
            <p className="text-neutral-400">Join thousands of creators who trust Edit.Flow</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(testimonial => (
              <div key={testimonial.id} className="bg-neutral-950 p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full ${testimonial.image} flex items-center justify-center text-white font-bold`}>
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-blue-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed">"{testimonial.text}"</p>
                <div className="flex gap-1 mt-4 text-yellow-500">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div key={index} className="bg-neutral-900 rounded-xl overflow-hidden border border-white/5">
              <button 
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold">{faq.question}</span>
                {openFaqIndex === index ? <Minus className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-neutral-500" />}
              </button>
              {openFaqIndex === index && (
                <div className="p-6 pt-0 text-neutral-400 text-sm leading-relaxed border-t border-white/5 mt-2">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-3xl p-8 md:p-12 text-center border border-white/10 relative overflow-hidden">
          <div className="relative z-10">
            <Mail className="w-12 h-12 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Creator Club</h2>
            <p className="text-neutral-300 mb-8 max-w-lg mx-auto">Get free assets, editing tutorials, and exclusive discounts delivered to your inbox weekly.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-5 py-3 rounded-full bg-black/50 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-4">No spam, unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-neutral-950 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="text-xl font-bold tracking-tighter">EDIT.FLOW</span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                Empowering creators with professional digital assets. Built for speed, quality, and creativity.
              </p>
              <div className="flex gap-4">
                 <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"><Instagram className="w-4 h-4" /></button>
                 <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"><Twitter className="w-4 h-4" /></button>
                 <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"><Youtube className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Marketplace</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">All Assets</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Premiere Pro</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">After Effects</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">DaVinci Resolve</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Become a Creator</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Affiliate Program</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Licensing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600 text-sm">© 2024 Edit.Flow. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="text-neutral-600 hover:text-white text-sm flex items-center gap-1 transition-colors"
              >
                <Lock className="w-3 h-3" /> Admin
              </button>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Systems Normal
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl w-full max-w-sm shadow-2xl relative">
            <button 
              onClick={() => setShowAdminLogin(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-500" /> Admin Login
            </h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                    <label className="block text-sm text-neutral-400 mb-1">Password</label>
                    <input 
                        type="password" 
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-blue-500 outline-none text-white"
                        placeholder="Enter admin password"
                    />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg">
                    Access Dashboard
                </button>
                <p className="text-xs text-neutral-500 text-center">Hint: password is 'admin123'</p>
            </form>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-neutral-900 border-l border-white/10 z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-neutral-900/50 backdrop-blur-md">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 opacity-50" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Your cart is empty</h3>
                  <p className="max-w-xs mx-auto mb-8">Looks like you haven't added any assets yet. Check out our best sellers!</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className={`w-24 h-24 rounded-lg bg-gradient-to-br ${getGradient(item.image)} flex-shrink-0 shadow-lg`} />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-white text-sm line-clamp-1">{item.title}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-500 hover:text-red-400 p-1 hover:bg-red-400/10 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">{item.category}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                        <div className="flex items-center gap-3 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                          <span className="text-xs text-neutral-400">Qty: {item.qty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-neutral-900 safe-bottom">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-neutral-400 text-sm">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-sm">
                    <span>Taxes</span>
                    <span className="text-white font-medium">Calculated at next step</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-white/5">
                  Checkout Securely <ArrowRight className="w-4 h-4" />
                </button>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-neutral-500">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Secure 256-bit SSL Encrypted Payment</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};

export default App;