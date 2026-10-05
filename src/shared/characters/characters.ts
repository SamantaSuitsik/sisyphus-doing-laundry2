export type CharacterId =
    | "sheriff"
    | "jester"
    | "oracle"
    | "pirate"
    | "wizard"
    | "vampire"
    | "knight"
    | "bard";

export interface Character {
    id: CharacterId;
    name: string;
    /** Short tagline shown under the name */
    title: string;
    /** Lore / flavour text */
    description: string;
    /** The real-life perk this character has */
    traitName: string;
    traitDescription: string;
    /** Emoji shown next to the trait */
    traitEmoji: string;
    /** Main colour used for glow / accents on the character screen */
    accentColor: string;
}

export const CHARACTERS: Character[] = [
    {
        id: "sheriff",
        name: "The Sheriff",
        title: "Keeper of the table",
        description:
            "Nobody knows who made him the law, but nobody dares to argue.",
        traitName: "Final Say",
        traitDescription:
            "Once per game, overrule any decision at the table. No appeals.",
        traitEmoji: "⚖️",
        accentColor: "#E0A030",
    },
    {
        id: "jester",
        name: "The Jester",
        title: "Chaos in a funny hat",
        description:
            "Rules are more like suggestions, and suggestions are meant to be ruined.",
        traitName: "Fool's Pardon",
        traitDescription:
            "You may skip one dare or action card without penalty.",
        traitEmoji: "🃏",
        accentColor: "#E2506F",
    },
    {
        id: "oracle",
        name: "The Oracle",
        title: "She saw this coming",
        description:
            "Always one step ahead, and never lets anyone forget it.",
        traitName: "Foresight",
        traitDescription:
            "Before your turn, you may predict the next card. Guess right and give out 2 sips.",
        traitEmoji: "🔮",
        accentColor: "#9B6BFF",
    },
    {
        id: "pirate",
        name: "The Pirate",
        title: "Plunder first, ask later",
        description:
            "Sailed every sea, lost every map, still never lost a drinking contest.",
        traitName: "Plunder",
        traitDescription:
            "Once per round, steal a sip from any player of your choice.",
        traitEmoji: "🏴‍☠️",
        accentColor: "#2FB8A6",
    },
    {
        id: "wizard",
        name: "The Wizard",
        title: "Spells. Mostly harmless.",
        description:
            "Claims every coincidence was intentional. Nobody can prove otherwise.",
        traitName: "Hex",
        traitDescription:
            "Pick a word. Anyone who says it has to take a sip until your next turn.",
        traitEmoji: "🪄",
        accentColor: "#4F8CFF",
    },
    {
        id: "vampire",
        name: "The Vampire",
        title: "Thirsty since 1642",
        description:
            "Hates sunlight, loves company, and absolutely loves your drink.",
        traitName: "Bite",
        traitDescription:
            "Once per game, make another player share their drink with you.",
        traitEmoji: "🧛",
        accentColor: "#C0262D",
    },
    {
        id: "knight",
        name: "The Knight",
        title: "Honour above all",
        description:
            "Sworn to protect the weak, the thirsty, and the last slice of pizza.",
        traitName: "Shield",
        traitDescription:
            "Take a sip in place of another player once per round.",
        traitEmoji: "🛡️",
        accentColor: "#8FA3B8",
    },
    {
        id: "bard",
        name: "The Bard",
        title: "Every night is a ballad",
        description:
            "Turns every small moment into a song nobody asked for.",
        traitName: "Encore",
        traitDescription:
            "Sing a line about any player. If the table cheers, they drink.",
        traitEmoji: "🎶",
        accentColor: "#F08A4B",
    },
];

export function getCharacter(id?: CharacterId | null): Character | undefined {
    return CHARACTERS.find((c) => c.id === id);
}