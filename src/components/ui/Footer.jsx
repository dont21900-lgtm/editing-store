import React from 'react';

const Footer = ({ onNavigate }) => {
    return (
        <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-8 px-6 relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="space-y-4">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">Edit.Flow</h3>
                    <p className="text-neutral-500 text-sm font-mono leading-relaxed">
                        Premium digital assets for visionaries. Elevate your creative workflow with our curated tools.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-6">Policies</h4>
                    <ul className="space-y-3 text-sm text-neutral-400 font-mono">
                        <li><button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors uppercase">Privacy Policy</button></li>
                        <li><button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors uppercase">Terms & Conditions</button></li>
                        <li><button onClick={() => onNavigate('cancellation')} className="hover:text-white transition-colors uppercase">Cancellation & Refund</button></li>
                        <li><button onClick={() => onNavigate('shipping')} className="hover:text-white transition-colors uppercase">Shipping Policy</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-6">Support</h4>
                    <ul className="space-y-3 text-sm text-neutral-400 font-mono">
                        <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors uppercase">Contact Us</button></li>
                        <li><a href="mailto:support@editflow.com" className="hover:text-white transition-colors uppercase">Email Support</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-6">Social</h4>
                    <ul className="space-y-3 text-sm text-neutral-400 font-mono">
                        <li><a href="#" className="hover:text-white transition-colors uppercase">Instagram</a></li>
                        <li><a href="#" className="hover:text-white transition-colors uppercase">Twitter</a></li>
                        <li><a href="#" className="hover:text-white transition-colors uppercase">YouTube</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-neutral-600 text-xs font-mono uppercase">© {new Date().getFullYear()} Edit.Flow. All rights reserved.</p>
                <p className="text-neutral-600 text-xs font-mono uppercase">Secure Payments by Razorpay</p>
            </div>
        </footer>
    );
};

export default Footer;
