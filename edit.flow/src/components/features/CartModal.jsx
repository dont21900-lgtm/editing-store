import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight, Loader2, Phone, Mail } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from '../../services/firebase';
import { loadRazorpayScript, RAZORPAY_KEY_ID } from '../../services/razorpay';

const CartModal = ({
    isOpen,
    onClose,
    cart,
    updateQuantity,
    removeFromCart,
    accentColor,
    onPaymentSuccess,
    user
}) => {
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");

    // Auto-fill email if user is logged in
    useEffect(() => {
        if (user && user.email) {
            // eslint-disable-next-line
            setEmail(prev => (prev !== user.email ? user.email : prev));
        }
    }, [user, isOpen]);

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const handlePayment = async () => {
        if (cart.length === 0) return;

        // Validation
        if (!phoneNumber || phoneNumber.length < 10) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }
        if (!email || !email.includes('@')) {
            alert("Please enter a valid email address for delivery.");
            return;
        }

        setIsProcessingPayment(true);
        const res = await loadRazorpayScript();
        if (!res) { alert("Razorpay SDK failed to load."); setIsProcessingPayment(false); return; }

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: cartTotal * 100, // Amount in paise
            currency: "INR",
            name: "Edit.Flow Store",
            description: "Digital Asset Purchase",
            image: "https://via.placeholder.com/150",
            notes: {
                products: cart.map(item => item.title).join(", ")
            },
            handler: async function (response) {
                setIsProcessingPayment(false);

                // Save Order to Firestore
                try {
                    await addDoc(collection(db, "orders"), {
                        items: cart,
                        amount: cartTotal,
                        paymentId: response.razorpay_payment_id,
                        customerPhone: phoneNumber,
                        customerEmail: email,
                        createdAt: serverTimestamp(),
                        status: 'paid'
                    });

                    // Notify parent
                    onPaymentSuccess(cart);
                } catch (e) {
                    console.error("Order Save Error", e);
                    alert("Payment success but failed to create order: " + e.message);
                }
            },
            prefill: {
                name: "User",
                email: email,
                contact: phoneNumber
            },
            modal: {
                ondismiss: function () {
                    setIsProcessingPayment(false);
                }
            },
            theme: { color: accentColor }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on('payment.failed', function (response) {
            setIsProcessingPayment(false);
            alert(response.error.description);
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-lg bg-[#050505] border border-white/20 shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[90vh] animate-popup-scale">

                {/* Fixed Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/20 bg-[#0a0a0a] flex-shrink-0">
                    <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">Your Cart</h2>
                    <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors rounded-full"><X className="w-5 h-5" /></button>
                </div>

                {/* Scrollable Content (Items + Inputs) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#050505]">
                    {cart.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-neutral-500 space-y-4 opacity-50 font-mono">
                            <ShoppingBag className="w-12 h-12" /><p>CART_EMPTY</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 bg-[#0a0a0a] p-4 border border-white/20 hover:border-white transition-all rounded-sm">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white text-sm uppercase tracking-tight">{item.title}</h4>
                                            <p className="text-[10px] text-neutral-500 mb-2 font-mono uppercase">{item.category}</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-0 border border-white/20 rounded-sm overflow-hidden">
                                                    <button onClick={() => updateQuantity(item.id, -1)} disabled={item.qty <= 1} className="px-2 py-1 text-white hover:bg-white/10 disabled:opacity-30 border-r border-white/20"><Minus className="w-3 h-3" /></button>
                                                    <span className="text-xs font-bold text-white w-8 text-center font-mono bg-[#111]">{item.qty}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-white hover:bg-white/10 border-l border-white/20"><Plus className="w-3 h-3" /></button>
                                                </div>
                                                <span className="font-bold text-sm text-white">₹{(item.price * item.qty).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-[#666] hover:text-[#6500aa] self-start transition-colors" style={{ color: accentColor === '#6500aa' ? undefined : accentColor }}><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>

                            {/* Inputs integrated into scrollable area */}
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest flex items-center gap-2"><Phone className="w-3 h-3" /> Mobile <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={10}
                                        placeholder="Phone Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        className="w-full p-3 bg-[#111] border border-white/20 text-white placeholder-neutral-600 outline-none focus:border-[var(--accent-color)] font-mono text-xs transition-colors rounded-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest flex items-center gap-2"><Mail className="w-3 h-3" /> Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 bg-[#111] border border-white/20 text-white placeholder-neutral-600 outline-none focus:border-[var(--accent-color)] font-mono text-xs transition-colors rounded-sm"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Fixed Footer */}
                {cart.length > 0 && (
                    <div className="p-6 bg-[#0a0a0a] border-t border-white/20 space-y-4 flex-shrink-0 z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                        <div className="flex justify-between items-center text-xl font-black text-white uppercase tracking-tight"><span>Total</span><span>₹{cartTotal.toFixed(2)}</span></div>
                        <button onClick={handlePayment} disabled={isProcessingPayment} className="w-full py-4 bg-white hover:opacity-90 text-black font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-colors border border-transparent hover:border-white text-sm rounded-sm shadow-lg" style={{ backgroundColor: 'white', color: 'black' }}>{isProcessingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Checkout <ArrowRight className="w-4 h-4" /></>}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
