import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultOverlayProps {
    isVisible: boolean;
    onClose: () => void;
    data: {
        character_name: string;
        actor_name: string;
        safe_summary: string;
    } | null;
    loading?: boolean;
}

export default function ResultOverlay({ isVisible, onClose, data, loading }: ResultOverlayProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute inset-x-8 bottom-8 top-auto md:top-auto md:bottom-24 md:w-96 md:left-auto md:right-8 z-30"
                >
                    <div className="bg-surface/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl text-white">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-gray-400 animate-pulse">Analyzing scene context...</p>
                            </div>
                        ) : data ? (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{data.character_name}</h2>
                                    <p className="text-sm text-accent font-medium">{data.actor_name}</p>
                                </div>
                                <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent" />
                                <p className="text-sm leading-relaxed text-gray-300">
                                    {data.safe_summary}
                                </p>
                            </div>
                        ) : (
                            <div className="py-4 text-center text-gray-400">
                                No character detected.
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
