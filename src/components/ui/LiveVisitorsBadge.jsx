import React, { useState, useEffect } from 'react';

const LiveVisitorsBadge = () => {
    const [liveVisitors, setLiveVisitors] = useState(145);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveVisitors(prev => {
                const change = Math.floor(Math.random() * 11) - 5;
                return Math.max(100, prev + change);
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 px-3 py-1 border border-white/20 bg-black/50">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-white tracking-widest">LIVE: {liveVisitors}</span>
        </div>
    );
};

export default LiveVisitorsBadge;
