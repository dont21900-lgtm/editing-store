import React from 'react';

const PolicyPage = ({ title, content, onGoBack }) => {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 animate-fade-in relative z-10 bg-[#050505]">
            <button
                onClick={onGoBack}
                className="fixed top-24 left-6 z-50 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-sm"
            >
                &larr; Back
            </button>

            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12 border-b border-white/10 pb-8">
                    {title}
                </h1>

                <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-p:text-neutral-400 prose-li:text-neutral-400 prose-strong:text-white">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default PolicyPage;
