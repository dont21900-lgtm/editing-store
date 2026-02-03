import React from 'react';

const VideoEditor = ({ onGoBack }) => (
    <div className="fixed inset-0 bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="text-center border border-white/20 p-10 bg-black">
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-6">Video Editor</h2>
            <button onClick={onGoBack} className="px-6 py-2 bg-white text-black uppercase font-bold hover:bg-[#6500aa] hover:text-white transition-colors">Back</button>
        </div>
    </div>
);

export default VideoEditor;
