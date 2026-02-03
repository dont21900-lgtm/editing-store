import React from 'react';
import { createPortal } from 'react-dom';

const AdminLoginModal = ({
    isOpen,
    onClose,
    onLogin,
    email,
    setEmail,
    password,
    setPassword
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-[#050505] p-10 w-full max-w-sm border border-white/20 shadow-2xl z-10 animate-popup-scale rounded-lg">
                <h2 className="text-2xl font-black mb-6 text-white uppercase tracking-wider text-center">Admin Access</h2>
                <form onSubmit={onLogin} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full p-4 bg-[#111] border border-white/20 text-white placeholder-neutral-600 outline-none focus:border-[#6500aa] font-mono text-sm rounded-sm"
                        placeholder="EMAIL"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-4 bg-[#111] border border-white/20 text-white placeholder-neutral-600 outline-none focus:border-[#6500aa] font-mono text-sm rounded-sm"
                        placeholder="PASSWORD"
                    />
                    <button type="submit" className="w-full py-4 bg-white text-black hover:bg-[#6500aa] hover:text-white uppercase font-bold tracking-widest transition-colors rounded-sm">Enter</button>
                </form>
                <button onClick={onClose} className="mt-6 text-xs text-neutral-500 w-full hover:text-white uppercase tracking-widest">Cancel</button>
            </div>
        </div>,
        document.body
    );
};

export default AdminLoginModal;
