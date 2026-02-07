import { useState, useEffect, useRef } from 'react';

interface VoiceControlProps {
    onTrigger: () => void;
    isListening: boolean;
}

export function useVoiceControl({ onTrigger, isListening }: VoiceControlProps) {
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check browser support
        if (!('webkitSpeechRecognition' in window)) {
            setError("Speech recognition not supported in this browser.");
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
            const lastResultIndex = event.results.length - 1;
            const transcript = event.results[lastResultIndex][0].transcript.trim().toLowerCase();
            console.log("Voice Input:", transcript);

            if (transcript.includes("recall") || transcript.includes("who is that") || transcript.includes("identify")) {
                onTrigger();
            }
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error("Voice Error:", event.error);
            if (event.error === 'not-allowed') {
                setError("Microphone access denied.");
            }
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onTrigger]);

    useEffect(() => {
        if (isListening && recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                // ignore if already started
            }
        } else if (!isListening && recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    return { error };
}
