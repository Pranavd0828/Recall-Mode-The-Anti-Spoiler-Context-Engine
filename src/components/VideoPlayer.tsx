import ReactPlayer from 'react-player';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import clsx from 'clsx';

interface VideoPlayerProps {
    url: string;
    className?: string;
    onProgress?: (state: { playedSeconds: number }) => void;
    playing?: boolean;
}

export interface VideoPlayerHandle {
    getCurrentTime: () => number;
    getInternalPlayer: () => any;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({ url, className, onProgress, playing = false }, ref) => {
    const playerRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        getCurrentTime: () => playerRef.current?.getCurrentTime() || 0,
        getInternalPlayer: () => playerRef.current?.getInternalPlayer(),
    }));

    const playerConfig: any = {
        youtube: {
            playerVars: { showinfo: 0, controls: 1, modestbranding: 1, rel: 0 }
        }
    };

    // Cast the component to any to bypass strict type definition mismatches
    const ReactPlayerAny = ReactPlayer as any;

    return (
        <div className={clsx("relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl bg-black", className)}>
            <ReactPlayerAny
                ref={playerRef}
                url={url}
                width="100%"
                height="100%"
                controls={false}
                playing={playing}
                onProgress={onProgress}
                config={playerConfig}
            />
        </div>
    );
});

export default VideoPlayer;
