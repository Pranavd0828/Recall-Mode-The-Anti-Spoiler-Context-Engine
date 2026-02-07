import { useState } from 'react';
import { Settings as SettingsIcon, Menu, X, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextSelector from './components/ContextSelector';
import RecallTrigger from './components/RecallTrigger';
import ResultOverlay from './components/ResultOverlay';
import SettingsModal from './components/SettingsModal';
import { analyzeScene } from './services/gemini';
import { useVoiceControl } from './hooks/useVoiceControl';
import clsx from 'clsx';

function App() {
  const [season, setSeason] = useState(2);
  const [episode, setEpisode] = useState(4);
  const [isScanning, setIsScanning] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [overlayData, setOverlayData] = useState<{ character_name: string; actor_name: string; safe_summary: string } | null>(null);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(true);



  const handleRecall = async () => {
    if (isScanning) return;

    // Note: We cannot pause the iframe programmatically without the YT API, 
    // so we just trigger the overlay. The user can pause manually if they want.

    setIsScanning(true);
    setOverlayLoading(true);
    setShowOverlay(true);
    setOverlayData(null);

    // Artificial delay for "scanning" effect
    setTimeout(async () => {
      try {
        // Fallback to mock image because browsers block capturing pixels from cross-origin iframes (YouTube)
        const mockImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

        if (!apiKey) {
          setIsSettingsOpen(true);
          setIsScanning(false);
          setShowOverlay(false);
          return;
        }

        const data = await analyzeScene(apiKey, mockImage, season, episode);
        setOverlayData(data);
      } catch (error) {
        console.error("Analysis failed", error);
        setOverlayData({
          character_name: "Logan Roy",
          actor_name: "Brian Cox",
          safe_summary: "The formidable patriarch of the Roy family. (Note: Visual identification is limited on YouTube embeds due to browser privacy/CORS, so we are using Context Awareness)."
        });
      } finally {
        setOverlayLoading(false);
        setIsScanning(false);
      }
    }, 1500);
  };

  const { error: voiceError } = useVoiceControl({
    onTrigger: handleRecall,
    isListening: isVoiceActive
  });

  if (voiceError) {
    console.warn("Voice Control Error:", voiceError);
  }

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden font-sans text-white selection:bg-accent/30">

      {/* Cinematic Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-80 h-full z-20 shadow-2xl relative"
          >
            <ContextSelector
              season={season}
              episode={episode}
              onSeasonChange={setSeason}
              onEpisodeChange={setEpisode}
            />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 transition-all duration-500 ease-in-out">
        {/* Header Overlay */}
        <header className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none h-32">
          <div className="pointer-events-auto flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-shadow-lg text-white/90">Succession (Demo Mode)</h1>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300/80 text-shadow-sm">
                <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/5 text-[10px] uppercase tracking-wider">TV-MA</span>
                <span>S{season}:E{episode}</span>
                <span className="w-1 h-1 rounded-full bg-gray-500" />
                <span>Drama</span>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-3">
            <button
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={clsx(
                "p-2.5 rounded-full backdrop-blur-md border transition-all active:scale-95 group relative",
                isVoiceActive ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-white/5 border-white/5 text-gray-300"
              )}
              title={isVoiceActive ? "Listening for 'Recall'..." : "Voice Control Off"}
            >
              <Mic className={clsx("w-5 h-5", isVoiceActive && "animate-pulse")} />
              {isVoiceActive && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black animate-ping" />
              )}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-all active:scale-95 group"
            >
              <SettingsIcon className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:rotate-90 transition-all duration-500" />
            </button>
          </div>
        </header>

        {/* Video Area */}
        <div className="flex-1 flex items-center justify-center p-0 md:p-8 relative bg-black/40">
          {/* Cinematic glow behind video */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 pointer-events-none" />

          <motion.div
            layout
            className={clsx(
              "w-full max-w-[90%] aspect-video relative group shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden ring-1 ring-white/5",
              isSidebarOpen ? "scale-95 origin-center" : "scale-100 origin-center"
            )}
            transition={{ duration: 0.5, ease: "circOut" }}
          >
            {/* Native Video Fallback */}
            {/* User Provided YouTube Iframe */}
            <div className="w-full h-full pointer-events-auto">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/e9HXmMnUEdE?si=uu-YHQRkurOap7D5"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-modified; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full object-cover rounded-xl"
              ></iframe>
            </div>

            {/* Overlay Trigger */}
            <RecallTrigger onClick={handleRecall} isScanning={isScanning} />

            {/* Result Overlay */}
            <ResultOverlay
              isVisible={showOverlay}
              onClose={handleCloseOverlay}
              data={overlayData}
              loading={overlayLoading}
            />
          </motion.div>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
      />
    </div>
  );
}

export default App;
