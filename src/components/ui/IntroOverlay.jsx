import React, { useState, useEffect } from 'react';

const IntroOverlay = ({ onComplete }) => {
    const [animationState, setAnimationState] = useState('initial');

    useEffect(() => {
        const t1 = setTimeout(() => setAnimationState('reveal'), 100);
        const t2 = setTimeout(() => setAnimationState('exit'), 2500);
        const t3 = setTimeout(onComplete, 3000);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [onComplete]);

    if (animationState === 'done') return null;

    return (
        <div className={`fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden transition-all duration-700 ease-in-out ${animationState === 'exit' ? '-translate-y-full' : 'translate-y-0'}`}>
            <div className="relative">
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white flex items-center gap-4 select-none uppercase font-sans">
                    <span className={`inline-block transition-all duration-1000 transform ${animationState === 'initial' ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                        EDIT
                    </span>
                    <span className={`w-4 h-4 md:w-8 md:h-8 bg-[#6500aa] inline-block transition-all duration-1000 delay-300 transform ${animationState === 'initial' ? 'scale-0' : 'scale-100'}`}></span>
                    <span className={`inline-block transition-all duration-1000 delay-100 transform ${animationState === 'initial' ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                        FLOW
                    </span>
                </h1>
            </div>
        </div>
    );
};

export default IntroOverlay;
