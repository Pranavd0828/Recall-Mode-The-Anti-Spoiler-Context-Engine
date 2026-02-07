// This is a "RAG-lite" knowledge base.
// In a real app, this would be a vector database or a larger JSON file fetched from a server.
// Here we hardcode context for specific Season/Episode ranges to give Gemini ground truth.

export interface ShowContext {
    season: number;
    episode_start: number;
    episode_end: number;
    summary: string;
    characters: Record<string, string>; // Name -> Current Status/Motivation
}

export const SUCCESSION_KNOWLEDGE_BASE: ShowContext[] = [
    {
        season: 1,
        episode_start: 1,
        episode_end: 10,
        summary: "Logan Roy's health crisis triggers a power struggle. Kendall attempts a hostile takever but fails. Shiv keeps her options open in politics. Roman is erratic. Connor is delusional.",
        characters: {
            "Logan Roy": "Recovering from a stroke. Furious at Kendall's betrayal. Ruthless and testing everyone's loyalty.",
            "Kendall Roy": "Defeated after the failed vote of no confidence. relapse into drug use. Currently submissive to Logan.",
            "Shiv Roy": "Working for Gil Eavis (Bernie Sanders type). Conflicted about joining Waystar.",
            "Roman Roy": "Trying to prove himself to Logan but failing. COO position is a token title.",
            "Tom Wambsgans": "Engaged to Shiv. Anxious about his place in the family. abusing Greg.",
            "Greg Hirsch": "Clueless but learning. Tom's 'disgusting brother'. Holding leverage (cruise papers)."
        }
    },
    {
        season: 2,
        episode_start: 1,
        episode_end: 5,
        summary: "Post-bear hug defense. Logan is looking for a successor (or pretending to). Kendall is a 'broken robot'. The 'Boar on the Floor' incident happens in Episode 3, showing Logan's tyranny.",
        characters: {
            "Logan Roy": " paranoid about a 'rat' in the camp. Using humiliation (Boar on the Floor) to assert dominance. Considering Pierce acquisition.",
            "Kendall Roy": "Gutted and subservient. Acting as Logan's hatchet man. Dead inside.",
            "Shiv Roy": "Promised the CEO role by Logan secretly. Quit politics. Impatient to take over.",
            "Roman Roy": "Sent to management training. cynical but desperate for daddy's love.",
            "Tom Wambsgans": " Now head of ATN. Stressed about the cruise line scandal surfacing.",
            "Greg Hirsch": "Navigating the cruise scandal with Tom. Still awkward but surviving."
        }
    },
    // Add more as needed for the demo
];

export const getContextForEpisode = (season: number, episode: number): string => {
    const context = SUCCESSION_KNOWLEDGE_BASE.find(
        (c) => c.season === season && episode >= c.episode_start && episode <= c.episode_end
    );

    if (!context) {
        return "The user is watching Succession. No specific context available for this episode range, so rely on general knowledge but AVOID SPOILERS from future seasons.";
    }

    const charContext = Object.entries(context.characters)
        .map(([name, desc]) => `- ${name}: ${desc}`)
        .join("\n");

    return `
    CURRENT SHOW STATE (Season ${season}, Episode ${episode}):
    Plot Summary: ${context.summary}
    Character Statuses:
    ${charContext}
  `;
};
