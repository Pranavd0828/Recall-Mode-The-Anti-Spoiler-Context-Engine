import { GoogleGenerativeAI } from "@google/generative-ai";
import { getContextForEpisode } from "../data/knowledge";

interface RecallResponse {
    character_name: string;
    actor_name: string;
    safe_summary: string;
}

export const analyzeScene = async (apiKey: string, imageBase64: string, season: number, episode: number): Promise<RecallResponse> => {
    if (!apiKey) {
        throw new Error("API Key is missing");
    }

    // Remove data:image/png;base64, prefix if present for Gemini SDK
    const base64Data = imageBase64.split(',')[1] || imageBase64;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    // Retrieve RAG Context
    const ragContext = getContextForEpisode(season, episode);

    const prompt = `
    You are an expert on the TV show 'Succession', but also capable of general visual identification.
    Identify the main character(s) visible in this image.
    
    CONTEXT (Ground Truth for Succession Timeline):
    ${ragContext}

    Context: The user is currently watching Season ${season}, Episode ${episode}.
    
    Constraint: 
    1. If the image clearly contains characters from Succession (Logan, Kendall, Shiv, Roman, etc.), identify them and provide a 2-sentence summary of their current motivation up to this exact point. Use the provided Character Statuses as the primary source of truth.
    2. If the image does NOT look like Succession (e.g., sci-fi, cartoon, different actors), identify what is actually in the image (e.g. "A robot", "A generic man in a suit") and briefly mention that this doesn't appear to be from Succession.

    Safety: You must NEVER mention events that happen after Season ${season}, Episode ${episode}. If the character dies, betrays someone, or leaves the show in a future season, DO NOT reveal it.
    Output Format: JSON { "character_name": "...", "actor_name": "...", "safe_summary": "..." }
    If multiple characters are present, choose the most prominent one or the one focusing on the camera.
  `;

    try {
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/png",
                },
            },
        ]);

        const responseText = result.response.text();
        return JSON.parse(responseText) as RecallResponse;
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw error;
    }
};
