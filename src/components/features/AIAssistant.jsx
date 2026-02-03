import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, ArrowRight, ImagePlus } from 'lucide-react';
import { generateAIContent } from '../../services/ai';

const AIAssistant = ({ onAction, activeTab, storeStats, isAdmin }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([{ role: 'ai', text: isAdmin ? "ADMIN SYSTEM ONLINE. COMMAND?" : "SYSTEM ONLINE. AWAITING INPUT." }]);
    const [isThinking, setIsThinking] = useState(false);
    const [chatImage, setChatImage] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => scrollToBottom(), [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() && !chatImage) return;
        const userText = input;
        const userImg = chatImage ? URL.createObjectURL(chatImage) : null;
        setMessages(prev => [...prev, { role: 'user', text: userText, image: userImg }]);
        setInput(""); setChatImage(null); setIsThinking(true);
        try {
            const statsInfo = storeStats ? `Revenue: ₹${storeStats.totalRevenue || 0}, Orders: ${storeStats.totalOrders || 0}` : "No data.";
            const systemPrompt = `AI Manager for Edit.Flow. User is ${isAdmin ? 'ADMIN (Pro Access)' : 'Visitor'}. Stats: ${statsInfo}. Context: ${activeTab}. You can change themes (action: theme) and navigate (action: navigate).`;
            const data = await generateAIContent(userText, systemPrompt, chatImage, true);
            if (data.action === 'theme' || data.action === 'navigate') onAction(data);
            let responseText = "Task complete.";
            if (data.response) responseText = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
            setMessages(prev => [...prev, { role: 'ai', text: responseText, code: data.code, language: data.language }]);
        } catch (error) { console.error(error); setMessages(prev => [...prev, { role: 'ai', text: "SYSTEM ERROR." }]); } finally { setIsThinking(false); }
    };

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-8 right-8 z-50 w-14 h-14 ${isAdmin ? 'bg-green-600 border-green-400' : 'bg-[#6500aa] border-white/20'} border text-white flex items-center justify-center shadow-lg hover:bg-white hover:text-black transition-colors`}>
                {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
            </button>
            {isOpen && (
                <div className="fixed bottom-24 right-8 z-50 w-80 md:w-96 bg-[#0a0a0a] border border-white/20 shadow-2xl flex flex-col h-[500px]">
                    <div className="p-4 border-b border-white/20 flex items-center gap-3 bg-[#111]">
                        <div className={`w-2 h-2 ${isAdmin ? 'bg-green-500' : 'bg-[#6500aa]'} animate-pulse`}></div>
                        <span className="font-bold text-xs tracking-widest uppercase text-white font-mono">{isAdmin ? 'ADMIN TERMINAL (PRO)' : 'AI TERMINAL'}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#050505]">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-3 text-xs leading-relaxed font-mono border ${msg.role === 'user' ? 'bg-white text-black border-white' : 'bg-[#111] text-[#ccc] border-white/20'}`}>{typeof msg.text === 'object' ? JSON.stringify(msg.text) : msg.text}</div>
                            </div>
                        ))}
                        {isThinking && <div className={`text-xs font-mono animate-pulse ${isAdmin ? 'text-green-500' : 'text-[#6500aa]'}`}>PROCESSING...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t border-white/20 bg-[#111]">
                        <div className="flex gap-2 relative">
                            <label className="p-2 border border-white/20 hover:bg-white/10 cursor-pointer transition-colors"><ImagePlus className="w-4 h-4 text-white" /><input type="file" accept="image/*" className="hidden" onChange={(e) => setChatImage(e.target.files[0])} /></label>
                            <input type="text" placeholder={isAdmin ? "ADMIN COMMAND..." : "ENTER COMMAND..."} className="w-full bg-transparent border-b border-white/20 text-xs text-white outline-none placeholder:text-white/30 font-mono py-2 focus:border-[#6500aa]" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
                            <button onClick={handleSend} className="p-2 bg-white text-black hover:bg-[#6500aa] hover:text-white transition-colors"><ArrowRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIAssistant;
