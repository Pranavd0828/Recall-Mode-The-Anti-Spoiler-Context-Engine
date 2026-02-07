import { ChevronDown, Info } from 'lucide-react';

interface ContextSelectorProps {
    season: number;
    episode: number;
    onSeasonChange: (season: number) => void;
    onEpisodeChange: (episode: number) => void;
}

// Mock data for Succession
const SEASONS = [1, 2, 3, 4];
const EPISODES = Array.from({ length: 10 }, (_, i) => i + 1);

export default function ContextSelector({ season, episode, onSeasonChange, onEpisodeChange }: ContextSelectorProps) {
    return (
        <div className="flex flex-col gap-4 p-4 bg-surface/50 backdrop-blur-md border-r border-white/10 w-64 h-full">
            <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-white">Spoiler Guard</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Show</label>
                    <div className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-gray-300 cursor-not-allowed">
                        Succession
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Current Season</label>
                    <div className="relative">
                        <select
                            value={season}
                            onChange={(e) => onSeasonChange(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                            {SEASONS.map((s) => (
                                <option key={s} value={s} className="bg-surface text-white">Season {s}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Current Episode</label>
                    <div className="relative">
                        <select
                            value={episode}
                            onChange={(e) => onEpisodeChange(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                            {EPISODES.map((e) => (
                                <option key={e} value={e} className="bg-surface text-white">Episode {e}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="mt-auto text-xs text-gray-500">
                <p>Recall Mode safeguards you from spoilers beyond this point.</p>
            </div>
        </div>
    );
}
