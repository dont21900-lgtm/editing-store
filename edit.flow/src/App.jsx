import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ShoppingBag, Lock, ShieldCheck } from 'lucide-react';
import { getDocs, query, collection, orderBy, deleteDoc, doc, updateDoc, increment } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import Lenis from '@studio-freight/lenis';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

// Services
import { db, auth } from './services/firebase';
import { policyContent } from './utils/policyContent';

// Components
import PremiumLogo from './components/ui/PremiumLogo';
import Confetti from './components/ui/Confetti';
import IntroOverlay from './components/ui/IntroOverlay';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ComingSoonPage from './components/ui/ComingSoonPage';
import VideoEditor from './components/ui/VideoEditor';
import LiveVisitorsBadge from './components/ui/LiveVisitorsBadge';
import Footer from './components/ui/Footer';
import PolicyPage from './components/features/PolicyPage';

import CartModal from './components/features/CartModal';
import AdminLoginModal from './components/features/AdminLoginModal';
import AIAssistant from './components/features/AIAssistant';
import EditProductModal from './components/features/EditProductModal';
import FaceAuthModal from './components/features/FaceAuthModal';

import StorePage from './components/views/StorePage';
import DownloadsPage from './components/views/DownloadsPage';
import ProductDetailsPage from './components/views/ProductDetailsPage';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [accentColor, setAccentColor] = useState("#6500aa"); // LOKAL PURPLE

  // Auth State
  const [user, setUser] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showFaceAuth, setShowFaceAuth] = useState(false);

  // Edit State
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Stats
  const [stats] = useState({ totalRevenue: 125400, totalOrders: 432, recentSales: [], totalVisitors: 15402 });

  // General UI
  const [introFinished, setIntroFinished] = useState(() => sessionStorage.getItem('introShown') === 'true');
  const [showCelebration, setShowCelebration] = useState(false);
  const filterCategories = ["All", "Templates", "Assets", "Bundle"];
  const [activeCategory, setActiveCategory] = useState("All");

  const navigate = useNavigate();
  const location = useLocation();

  // --- EFFECTS ---

  // Smooth Scroll (Lenis)
  const lenisRef = React.useRef(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Increment DB Visitor
  useEffect(() => {
    if (!db) return;
    const incrementVisitor = async () => { try { await updateDoc(doc(db, "site_stats", "general"), { visitors: increment(1) }); } catch (err) { console.error("Visitor increment failed", err); } };
    incrementVisitor();
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const s = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
      setProducts(s.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!db) return;
    fetchProducts();
  }, [fetchProducts, user]);

  // Auth Listener
  useEffect(() => {
    if (!auth) return;
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setIsSessionActive(false);
    });
  }, []);

  // --- HANDLERS (Memoized) ---

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!auth) return alert("Auth not initialized");
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setShowAdminLogin(false);
      setLoginEmail("");
      setLoginPassword("");
      setShowFaceAuth(true); // Start Face Auth Flow
      sessionStorage.setItem('introShown', 'true');
    } catch (error) {
      console.error("Login Error:", error);
      alert("Invalid Credentials");
    }
  };

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    setUser(null);
    setIsSessionActive(false);
  };

  const handleAuthSuccess = () => {
    setShowFaceAuth(false);
    setIsSessionActive(true);
  };

  const addToCart = useCallback((p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((id, d) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)), []);
  const removeFromCart = useCallback((id) => setCart(prev => prev.filter(i => i.id !== id)), []);

  const handleDeleteProduct = useCallback(async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error(error);
        alert("Delete Failed.");
      }
    }
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    setCart([]);
    setIsCartOpen(false);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 5000);
    navigate('/downloads');
    alert("Payment Successful! Check your email for the download link.");
  }, [navigate]);

  const handleAIAction = (data) => {
    if (data.action === 'theme') {
      const colors = { "red": "#ef4444", "blue": "#2563eb", "green": "#22c55e", "purple": "#a855f7", "orange": "#f97316", "pink": "#ec4899", "cyan": "#06b6d4", "lokal": "#6500aa" };
      const hex = colors[data.color.toLowerCase()] || data.color;
      setAccentColor(hex);
    } else if (data.action === 'navigate') {
      if (data.page.toLowerCase().includes('studio')) navigate('/studio');
      if (data.page.toLowerCase().includes('store')) navigate('/');
    }
  };

  const handleDetailedNavigation = (dest) => {
    // Footer uses keys like 'privacy', 'terms', 'cancellation', 'shipping', 'contact'
    switch (dest) {
      case 'store': navigate('/'); break;
      case 'studio': navigate('/studio'); break;

      // Policies
      case 'privacy': navigate('/privacypolicy'); break;
      case 'terms': navigate('/terms'); break;
      case 'cancellation': navigate('/cancellations'); break;
      case 'shipping': navigate('/shipping-policy'); break;
      case 'contact': navigate('/contact'); break;

      default: navigate('/');
    }
  };

  const activeTab = location.pathname === '/studio' ? 'studio' : 'store'; // For Nav Logic

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[var(--accent-color)] selection:text-white relative overflow-x-hidden" style={{ '--accent-color': accentColor }}>

      {showCelebration && <Confetti />}

      {!introFinished ? (
        <IntroOverlay onComplete={() => {
          setIntroFinished(true);
          sessionStorage.setItem('introShown', 'true');
        }} />
      ) : (
        <div className="animate-fade-in flex flex-col min-h-screen">
          <nav className="sticky top-0 z-40 w-full bg-[#050505]/90 backdrop-blur-md border-b border-white/20 relative z-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="cursor-pointer" onClick={() => navigate('/')}>
                  <PremiumLogo />
                </div>

                <div className="hidden md:flex items-center gap-0 border border-white/20 bg-[#111]">
                  <button onClick={() => navigate('/')} className={`px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all ${location.pathname === '/' ? 'bg-white text-black' : 'text-[#888] hover:text-white'}`}>Store</button>
                  <button onClick={() => navigate('/studio')} className={`px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all border-l border-white/20 ${location.pathname === '/studio' ? 'bg-[#6500aa] text-white' : 'text-[#888] hover:text-white'}`}>Studio</button>
                </div>

                <div className="flex items-center gap-6">
                  <LiveVisitorsBadge />

                  {!isSessionActive && (
                    <button onClick={() => setShowAdminLogin(true)} className="text-neutral-400 hover:text-white transition-colors">
                      <Lock className="w-5 h-5" />
                    </button>
                  )}

                  {isSessionActive && <span className="hidden md:inline-flex items-center gap-2 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/30 px-3 py-1 bg-green-500/10"><ShieldCheck className="w-3 h-3" /> PRO ADMIN</span>}
                  <button onClick={() => setIsCartOpen(true)} className="relative group p-2 hover:bg-white/10 transition-colors">
                    <ShoppingBag className="w-6 h-6 text-white" />
                    {cart.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold flex items-center justify-center bg-[#6500aa] text-white border border-black" style={{ backgroundColor: accentColor }}>{cart.reduce((a, b) => a + b.qty, 0)}</span>}
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex-grow">
            <Routes>
              {/* Main Store */}
              <Route path="/" element={
                <StorePage
                  isSessionActive={isSessionActive}
                  accentColor={accentColor}
                  setAccentColor={setAccentColor}
                  handleLogout={handleLogout}
                  stats={stats}
                  filterCategories={filterCategories}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  products={products}
                  loading={loading}
                  addToCart={addToCart}
                  setEditingProduct={setEditingProduct}
                  setShowEditModal={setShowEditModal}
                  handleDeleteProduct={handleDeleteProduct}
                />
              } />

              {/* Studio */}
              <Route path="/studio" element={
                isSessionActive ? <VideoEditor onGoBack={() => navigate('/')} /> : <ComingSoonPage onGoBack={() => navigate('/')} />
              } />

              {/* Product Details */}
              <Route path="/product/:id" element={<ProductDetailsPage addToCart={addToCart} accentColor={accentColor} />} />

              {/* Downloads */}
              <Route path="/downloads" element={<DownloadsPage />} />

              {/* Policies */}
              <Route path="/privacypolicy" element={<PolicyPage title={policyContent.privacy.title} content={policyContent.privacy.content} onGoBack={() => navigate('/')} />} />
              <Route path="/terms" element={<PolicyPage title={policyContent.terms.title} content={policyContent.terms.content} onGoBack={() => navigate('/')} />} />
              <Route path="/shipping-policy" element={<PolicyPage title={policyContent.shipping.title} content={policyContent.shipping.content} onGoBack={() => navigate('/')} />} />
              <Route path="/cancellations" element={<PolicyPage title={policyContent.cancellation.title} content={policyContent.cancellation.content} onGoBack={() => navigate('/')} />} />
              <Route path="/contact" element={<PolicyPage title={policyContent.contact.title} content={policyContent.contact.content} onGoBack={() => navigate('/')} />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <Footer onNavigate={handleDetailedNavigation} />

          {isSessionActive && <AIAssistant onAction={handleAIAction} activeTab={activeTab} storeStats={stats} isAdmin={true} />}

          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            accentColor={accentColor}
            onPaymentSuccess={handlePaymentSuccess}
            user={user}
          />

          <AdminLoginModal
            isOpen={showAdminLogin && !isSessionActive}
            onClose={() => setShowAdminLogin(false)}
            onLogin={handleLogin}
            email={loginEmail}
            setEmail={setLoginEmail}
            password={loginPassword}
            setPassword={setLoginPassword}
          />

          {showEditModal && editingProduct && (
            <EditProductModal
              product={editingProduct}
              onClose={() => setShowEditModal(false)}
              onUpdateSuccess={() => {
                fetchProducts(); // Refresh list
                setEditingProduct(null);
              }}
            />
          )}

          {showFaceAuth && (
            <FaceAuthModal
              user={user}
              onClose={() => setShowFaceAuth(false)}
              onSuccess={handleAuthSuccess}
              onFaceStatusUpdate={() => { }}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Wrap App with BrowserRouter
const AppWrapper = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
);
export default AppWrapper;