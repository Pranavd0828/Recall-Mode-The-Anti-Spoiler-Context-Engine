// This is a "RAG-lite" knowledge base.
// In a real app, this would be a vector database or a larger JSON file fetched from a server.
// Here we hardcode context for specific Season/Episode ranges to give Gemini ground truth.

export interface ShowContext {
    season: number;
    episode_start: number;
    episode_end: number;
    summary: string;
}

export const SUCCESSION_KNOWLEDGE_BASE: ShowContext[] = [
    {
        season: 1,
        episode_start: 1,
        episode_end: 10,
        summary: "Logan Roy's health crisis triggers a power struggle. Kendall attempts a hostile takever but fails. Shiv keeps her options open in politics. Roman is erratic. Connor is delusional."
    },
    {
        season: 2,
        episode_start: 1,
        episode_end: 5,
        summary: "Post-bear hug defense. Logan is looking for a successor (or pretending to). Kendall is a 'broken robot'. The 'Boar on the Floor' incident happens in Episode 3, showing Logan's tyranny."
    },
    {
        season: 3,
        episode_start: 1,
        episode_end: 9,
        summary: "The shareholder meeting looms. Kendall, Shiv, and Roman are briefly united against Logan but eventually fracture. Tom betrays Shiv to align with Logan."
    },
    {
        season: 4,
        episode_start: 1,
        episode_end: 10,
        summary: "The Final Season. Logan dies (Spoiler!). The kids fight for control against Matsson. Tom becomes CEO."
    }
];

export const getContextForEpisode = (season: number, episode: number): string => {
    const context = SUCCESSION_KNOWLEDGE_BASE.find(
        (c) => c.season === season && episode >= c.episode_start && episode <= c.episode_end
    );

    if (!context) {
        return "The user is watching Succession. No specific context available for this episode range, so rely on general knowledge but AVOID SPOILERS from future seasons.";
    }

    return `
    CURRENT SHOW STATE (Season ${season}, Episode ${episode}):
    Plot Summary: ${context.summary}
    `;
};
