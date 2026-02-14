import { motion } from 'framer-motion';

interface ScannerOverlayProps {
    isScanning: boolean;
}

export default function ScannerOverlay({ isScanning }: ScannerOverlayProps) {
    if (!isScanning) return null;

    return (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
            {/* Dark tint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-accent/10 backdrop-blur-[2px]"
            />

            {/* Scanning Line */}
            <motion.div
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear"
                }}
                className="absolute left-0 right-0 h-1 bg-accent/80 shadow-[0_0_20px_rgba(251,191,36,0.8)] z-30"
            />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

            {/* Corner Brackets */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-accent/50 rounded-tl-xl" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-accent/50 rounded-tr-xl" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-accent/50 rounded-bl-xl" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-accent/50 rounded-br-xl" />

            {/* Status Text (Typing Effect) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-2">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="px-6 py-2 bg-black/60 backdrop-blur-md rounded-full border border-accent/30"
                >
                    <p className="text-accent font-mono text-sm tracking-widest uppercase animate-pulse">
                        Analyzing Biometrics...
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
