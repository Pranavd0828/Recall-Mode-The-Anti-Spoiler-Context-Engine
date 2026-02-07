import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const prompt = `
    You are an expert on the TV show 'Succession'.
    Identify the main character(s) visible in this image.
    Context: The user is currently watching Season ${season}, Episode ${episode}.
    Constraint: Provide a 2-sentence summary of who this character is and their current motivation up to this exact point.
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
