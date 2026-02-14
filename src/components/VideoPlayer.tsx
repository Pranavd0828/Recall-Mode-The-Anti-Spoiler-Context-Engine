import ReactPlayer from 'react-player';
import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from 'lucide-react';
import clsx from 'clsx';

interface VideoPlayerProps {
    url: string;
    className?: string;
    onProgress?: (state: { playedSeconds: number }) => void;
    playing?: boolean;
    onPlayPause?: (playing: boolean) => void;
}

export interface VideoPlayerHandle {
    getCurrentTime: () => number;
    getInternalPlayer: () => any;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({ url, className, onProgress, playing: externalPlaying, onPlayPause }, ref) => {
    const playerRef = useRef<any>(null);
    const [playing, setPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [duration, setDuration] = useState(0);

    // Sync external playing state if provided
    useEffect(() => {
        if (externalPlaying !== undefined) {
            setPlaying(externalPlaying);
        }
    }, [externalPlaying]);

    useImperativeHandle(ref, () => ({
        getCurrentTime: () => playerRef.current?.getCurrentTime() || 0,
        getInternalPlayer: () => playerRef.current?.getInternalPlayer(),
    }));

    const handlePlayPause = () => {
        const newPlaying = !playing;
        setPlaying(newPlaying);
        if (onPlayPause) onPlayPause(newPlaying);
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPlayed = parseFloat(e.target.value);
        setPlayed(newPlayed);
        playerRef.current?.seekTo(newPlayed);
    };

    const handleProgress = (state: any) => {
        setPlayed(state.played);
        if (onProgress) onProgress(state);
    };

    const handleDuration = (duration: number) => {
        setDuration(duration);
    }

    const formatTime = (seconds: number) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    // Cast to any to avoid strict type checking issues with external library
    const ReactPlayerAny = ReactPlayer as any;

    return (
        <div
            className={clsx("relative group bg-black overflow-hidden rounded-xl", className)}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <ReactPlayerAny
                ref={playerRef}
                url={url}
                width="100%"
                height="100%"
                playing={playing}
                volume={volume}
                muted={muted}
                onProgress={handleProgress}
                onDuration={handleDuration}
                controls={false} // Hide native controls
                config={{
                    youtube: {
                        playerVars: { showinfo: 0, controls: 0, modestbranding: 1, rel: 0, fs: 0, iv_load_policy: 3, disablekb: 1 }
                    } as any
                }}
            />

            {/* Cinematic Gradient Overlay (Top and Bottom) */}
            <div className={clsx(
                "absolute inset-0 pointer-events-none transition-opacity duration-300 flex flex-col justify-between",
                showControls || !playing ? "opacity-100" : "opacity-0"
            )}>
                <div className="h-32 bg-gradient-to-b from-black/80 to-transparent" />
                <div className="h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            {/* Custom Controls */}
            <div className={clsx(
                "absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 z-10",
                showControls || !playing ? "opacity-100" : "opacity-0"
            )}>
                {/* Progress Bar */}
                <div className="w-full mb-4 group/progress cursor-pointer">
                    <input
                        type="range"
                        min={0}
                        max={0.999999}
                        step="any"
                        value={played}
                        onChange={handleSeekChange}
                        className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:opacity-0 transition-all hover:h-2 group-hover/progress:[&::-webkit-slider-thumb]:opacity-100"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handlePlayPause}
                            className="text-white hover:text-white/80 transition-transform active:scale-95"
                        >
                            {playing ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white" />}
                        </button>

                        <button className="text-gray-300 hover:text-white transition-colors">
                            <SkipBack className="w-6 h-6" />
                        </button>
                        <button className="text-gray-300 hover:text-white transition-colors">
                            <SkipForward className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-2 group/volume relative">
                            <button
                                onClick={() => setMuted(!muted)}
                                className="text-gray-300 hover:text-white"
                            >
                                {muted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </button>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step="any"
                                value={volume}
                                onChange={(e) => {
                                    setVolume(parseFloat(e.target.value));
                                    setMuted(false);
                                }}
                                className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 h-1.5 bg-white/20 rounded-full appearance-none ml-2 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            />
                        </div>

                        <div className="text-sm font-medium text-gray-300 font-mono tracking-wider ml-2">
                            {formatTime(played * duration)} / {formatTime(duration)}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-2 py-1 rounded bg-white/10 border border-white/10 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                            4K HDR
                        </div>
                        <button className="text-gray-300 hover:text-white">
                            <Maximize className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Center Play Button (only when paused) */}
            {!playing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-2xl">
                        <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                </div>
            )}
        </div>
    );
});

export default VideoPlayer;
