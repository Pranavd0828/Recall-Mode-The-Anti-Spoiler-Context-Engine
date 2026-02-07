import { useEffect } from 'react';

export const EffectBridge = ({ isPlaying, playerRef }: { isPlaying: boolean, playerRef: any }) => {
    useEffect(() => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.play().catch((e: any) => console.error("Play failed", e));
            } else {
                playerRef.current.pause();
            }
        }
    }, [isPlaying, playerRef]);
    return null;
};
