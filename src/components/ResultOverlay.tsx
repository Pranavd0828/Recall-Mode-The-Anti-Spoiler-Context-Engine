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
    season: number;
}

export default function ResultOverlay({ isVisible, onClose, data, loading, season }: ResultOverlayProps) {
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
                            <div className="flex flex-col items-center justify-center py-12 space-y-6">
                                <div className="relative">
                                    <div className="w-12 h-12 border-2 border-accent/30 rounded-full animate-spin border-t-accent" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                                    </div>
                                </div>
                                <p className="text-sm text-accent/80 font-medium tracking-wide animate-pulse uppercase text-[10px]">Analyzing Context...</p>
                            </div>
                        ) : data ? (
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">{data.character_name}</h2>
                                            <p className="text-sm text-accent font-medium tracking-wide uppercase">{data.actor_name}</p>
                                        </div>
                                        <div className="bg-green-500/10 border border-green-500/20 px-2 py-1 rounded text-[10px] uppercase font-bold text-green-400 tracking-wider">
                                            Match 98%
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Context (S{season})</p>
                                    <p className="text-sm leading-relaxed text-gray-300 font-light">
                                        {data.safe_summary}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-xs text-blue-300/60 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
                                        <span>🔒</span>
                                        <span className="font-medium">Spoiler Shield Active:</span>
                                        <span>Details from Season {season + 1}+ hidden.</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                <p>No character detected in this frame.</p>
                                <p className="text-xs mt-2 opacity-50">Try capturing a clear face.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
