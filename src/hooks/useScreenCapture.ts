import { useState, useCallback } from 'react';

export const useScreenCapture = () => {
    const [error, setError] = useState<string | null>(null);

    const captureScreen = useCallback(async (): Promise<string | null> => {
        try {
            setError(null);
            // Request permission to capture the screen (user must select "This Tab")
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: 1920,
                    height: 1080,
                    displaySurface: 'browser', // Hint to browser to prefer tab sharing
                },
                audio: false,
            });

            const videoTrack = stream.getVideoTracks()[0];
            // @ts-ignore
            const imageCapture = new ImageCapture(videoTrack) as any;

            // Grab a frame
            const bitmap = await imageCapture.grabFrame() as ImageBitmap;

            // Stop the stream immediately after capture to stop the "Sharing" indicator
            videoTrack.stop();

            // Convert bitmap to base64
            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) throw new Error("Could not get canvas context");

            ctx.drawImage(bitmap, 0, 0);
            return canvas.toDataURL('image/jpeg', 0.8);

        } catch (err) {
            console.error("Screen capture error:", err);
            // @ts-ignore
            if (err.name === 'NotAllowedError') {
                setError("Capture cancelled by user");
            } else {
                setError("Failed to capture screen");
            }
            return null;
        }
    }, []);

    return { captureScreen, error };
};
