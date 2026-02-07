# Recall Mode - The Anti-Spoiler Context Engine

A high-fidelity web prototype simulating a premium streaming service with an AI-powered "Spoiler Guard". Identify characters on screen and get spoiler-free context based on your current viewing progress.

## Features

- **Context Selector**: Set your current Season and Episode to prevent spoilers.
- **"Recall" Trigger**: Click "Who is that?" to pause and analyze the scene.
- **AI Analysis**: Uses Google Gemini 1.5 Flash to identify characters and provide safe context.
- **Cinematic UI**: Premium dark mode aesthetic with glassmorphism and smooth animations.

## Tech Stack

- React + Vite
- Tailwind CSS
- Google Generative AI SDK (`@google/generative-ai`)
- `react-player` for YouTube embedding
- `framer-motion` for animations
- `lucide-react` for icons

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the app in your browser.
5. Click the Settings icon (gear) to enter your Google Gemini API Key.

## Note
This is a prototype. The video player is embedded via YouTube, and due to browser CORS security, direct canvas capture of the video frame is simulated for this demo. The AI analysis relies on the context provided to the system prompt.
