import React from 'react';

const PremiumLogo = ({ className }) => (
    <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-8 h-8 bg-[#6500aa] flex items-center justify-center">
            <span className="text-white font-black text-lg">E</span>
        </div>
        <div className="flex flex-col leading-none">
            <span className="font-bold text-xl tracking-tight text-white uppercase font-sans">EDIT.FLOW</span>
        </div>
    </div>
);

export default PremiumLogo;
