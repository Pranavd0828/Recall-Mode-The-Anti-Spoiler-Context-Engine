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

            // Standard approach: Play stream in a hidden video element and draw to canvas
            const video = document.createElement('video');
            video.srcObject = stream;

            // Wait for video to be ready
            await new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    video.play().then(resolve);
                };
            });

            // Create canvas and draw frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                stream.getTracks().forEach(track => track.stop());
                throw new Error("Could not get canvas context");
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Cleanup
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;

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
