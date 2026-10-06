export type CharacterId =
    | "cocktailspecialist"
    | "comrade"
    | "gymlover"
    | "baller"
    | "dj"
    | "thief"
    | "strategist"
    ;

export interface Character {
    id: CharacterId;
    name: string;
    title: string;
    description: string;
    traitName: string;
    traitDescription: string;
    accentColor: string;
    traitEmoji: string;
}

export const CHARACTERS: Character[] = [
    {
        id: "cocktailspecialist",
        name: "Cocktail Specialist",
        title: "Shaker in the dark",
        description:
            "There is this evil in his eyes, but he makes good drinks",
        traitName: "The bartender",
        traitDescription:
            "You can max out drink type trait instantly, whenever someone else does this, add 2 to your sip counter and make their cocktail",
        traitEmoji: "🍸",
        accentColor: "#86c292",
    },
    {
        id: "comrade",
        name: "Comrade",
        title: "Distributor of wealth",
        description:
            "There is no you and me, only us",
        traitName: "WE drink",
        traitDescription:
            "Always pick someone to drink with you",
        traitEmoji: "☭",
        accentColor: "#74a0d1",
    },
    {
        id: "gymlover",
        name: "Gym Lover",
        title: "Heavy-weight champion",
        description:
            "The heart is the strongest massel",
        traitName: "Until failure",
        traitDescription:
            "Do 1 push-up whenever you drink. Whenever you hit 5 push-ups, everyone has to do 5 push-ups or drink 1 sip",
        traitEmoji: "🔩",
        accentColor: "#9e5476",
    },
    {
        id: "baller",
        name: "Baller",
        title: "Sharpshooter",
        description:
            "Knows ball",
        traitName: "Balls on the wall",
        traitDescription:
            "On your turn, you can throw 2 balls: >50 = everyone drinks 2 sips; 40-50 = pick someone to drink; <40 = you drink",
        traitEmoji: "🎯",
        accentColor: "#2341c4",
    },
    {
        id: "dj",
        name: "Dee Jay",
        title: "Friends call him D",
        description:
            "One with the tunes, small and weird",
        traitName: "Perfect pitch",
        traitDescription:
            "On your turn, if you can name the song/artist, give out 2 sips, otherwise you drink",
        traitEmoji: "🎧",
        accentColor: "#627c8e",
    },
    {
        id: "thief",
        name: "Thief",
        title: "Attenzione, pickpocket!",
        description:
            "Steals your heart faster than a bami at 4am",
        traitName: "Time to play",
        traitDescription:
            "Get a token every 5 sips. Token can be used to steal someone's action (either card or character action)",
        traitEmoji: "💰",
        accentColor: "#421f42",
    },
    {
        id: "strategist",
        name: "Strategist",
        title: "The hidden hand",
        description:
            "Playing chess in a drinking game",
        traitName: "One step ahead",
        traitDescription:
            "On your turn, add 1 sip to your sip counter",
        traitEmoji: "♛",
        accentColor: "#144237",
    },

];

export function getCharacter(id?: CharacterId | null): Character | undefined {
    return CHARACTERS.find((c) => c.id === id);
}