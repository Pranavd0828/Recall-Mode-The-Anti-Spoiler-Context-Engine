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
                        className="group flex items-center gap-3 px-6 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl hover:bg-white/20 transition-all cursor-pointer"
                    >
                        <Eye className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                        <span className="font-medium tracking-wide">Who is that?</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
