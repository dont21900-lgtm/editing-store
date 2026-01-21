import React from 'react';
import { NavLink } from 'react-router-dom';

const DownloadsPage = () => {
    return (
        <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto text-center flex flex-col items-center justify-center">
            <h1 className="text-4xl font-black text-white uppercase mb-4">Payment Successful!</h1>
            <div className="p-8 bg-[#111] border border-white/20 max-w-lg w-full">
                <p className="text-neutral-300 font-mono mb-6 text-sm leading-relaxed">
                    Thank you for your purchase. <br /><br />
                    <span className="text-[#6500aa] font-bold">CHECK YOUR EMAIL</span> for the secure download links.
                    They have been sent to you automatically.
                </p>
                <div className="flex justify-center">
                    <NavLink to="/" className="px-8 py-3 bg-white text-black font-bold uppercase hover:bg-[#6500aa] hover:text-white transition-colors">
                        Back to Store
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default DownloadsPage;
