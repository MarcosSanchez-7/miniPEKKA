import React from 'react';

const Logo = ({ className = "h-10", textSize = "text-2xl" }: { className?: string, textSize?: string }) => {
    return (
        <div className="flex items-center gap-2">
            <div className={`${className} aspect-square relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 20 20 L 50 10 L 80 20 L 90 50 L 80 80 L 50 90 L 20 80 L 10 50 Z"
                        fill="url(#logoGradient)"
                        className="drop-shadow-sm"
                    />
                    <path
                        d="M 35 35 L 50 30 L 65 35 L 70 50 L 65 65 L 50 70 L 35 65 L 30 50 Z"
                        fill="white"
                        fillOpacity="0.9"
                    />
                    <path
                        d="M 42 42 L 58 42 L 58 58 L 42 58 Z"
                        fill="url(#logoGradient)"
                    />
                </svg>
            </div>
            <span className={`${textSize} font-bold tracking-tight text-slate-900`}>
                Mini<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-amber-500 to-cyan-500">Pekka</span>
            </span>
        </div>
    );
};

export default Logo;
