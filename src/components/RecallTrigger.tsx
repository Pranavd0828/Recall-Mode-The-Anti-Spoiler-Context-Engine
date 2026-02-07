import { Eye, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecallTriggerProps {
    onClick: () => void;
    isScanning: boolean;
}

export default function RecallTrigger({ onClick, isScanning }: RecallTriggerProps) {
    return (
        <div className="absolute bottom-8 right-8 z-20">
            <AnimatePresence mode="wait">
                {isScanning ? (
                    <motion.div
                        key="scanning"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/50 text-primary shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                    >
                        <Scan className="w-8 h-8 animate-pulse" />
                        <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_2s_linear_infinite]" />
                    </motion.div>
                ) : (
                    <motion.button
                        key="trigger"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClick}
                        className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white shadow-2xl hover:bg-white/10 hover:border-white/25 transition-all cursor-pointer ring-1 ring-white/5"
                    >
                        <div className="relative">
                            <Eye className="w-5 h-5 text-white/90 group-hover:text-accent transition-colors" />
                            <div className="absolute inset-0 bg-accent/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <span className="font-medium tracking-wide text-sm text-white/90">Identify</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
