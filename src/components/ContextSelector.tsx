import { ChevronDown, Info } from 'lucide-react';

interface ContextSelectorProps {
    season: number;
    episode: number;
    onSeasonChange: (season: number) => void;
    onEpisodeChange: (episode: number) => void;
}

const SEASONS = [1, 2, 3, 4];
const EPISODES = Array.from({ length: 10 }, (_, i) => i + 1);

export default function ContextSelector({ season, episode, onSeasonChange, onEpisodeChange }: ContextSelectorProps) {
    return (
        <div className="flex flex-col gap-6 p-8 bg-[#0f0f0f] border-r border-white/5 w-full h-full">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                    <Info className="w-5 h-5 text-accent" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Recall Mode</h2>
                    <p className="text-xs text-gray-500 font-medium">Context Awareness</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="group">
                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest group-hover:text-gray-400 transition-colors">Active Content</label>
                    <div className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-200 font-medium flex items-center justify-between shadow-sm">
                        <span>Succession</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-500 font-bold tracking-wide">LIVE</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Your Progress</label>

                    <div className="space-y-3">
                        <div className="relative group">
                            <select
                                value={season}
                                onChange={(e) => onSeasonChange(Number(e.target.value))}
                                className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-white/20 transition-all cursor-pointer hover:bg-white/5"
                            >
                                {SEASONS.map((s) => (
                                    <option key={s} value={s} className="bg-surface text-white">Season {s}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none group-hover:text-gray-400 transition-colors" />
                        </div>

                        <div className="relative group">
                            <select
                                value={episode}
                                onChange={(e) => onEpisodeChange(Number(e.target.value))}
                                className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-white/20 transition-all cursor-pointer hover:bg-white/5"
                            >
                                {EPISODES.map((e) => (
                                    <option key={e} value={e} className="bg-surface text-white">Episode {e}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none group-hover:text-gray-400 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-xs text-blue-200/60 leading-relaxed font-medium">
                    <span className="text-blue-400 font-bold block mb-1">Spoiler Guard Active</span>
                    Details from future episodes will be strictly redacted.
                </p>
            </div>
        </div>
    );
}
