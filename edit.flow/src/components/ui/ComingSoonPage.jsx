import React from 'react';
import { Wand2 } from 'lucide-react';

const ComingSoonPage = ({ onGoBack }) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white p-8 text-center relative overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10 flex flex-col items-center max-w-3xl border border-white/10 p-12 bg-black/50 backdrop-blur-sm">
            <div className="w-16 h-16 bg-[#6500aa] flex items-center justify-center mb-8">
                <Wand2 className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white uppercase">
                Studio Beta
            </h1>

            <p className="text-lg text-neutral-400 mb-10 max-w-lg mx-auto font-mono">
              // SYSTEM_STATUS: INITIALIZING...<br />
              // ACCESS_LEVEL: ADMIN_ONLY
            </p>

            <button onClick={onGoBack} className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-[#6500aa] hover:text-white transition-colors border border-white">
                Return to Store
            </button>
        </div>
    </div>
);

export default ComingSoonPage;
