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
    description: string;
    traitDescription: string;
    accentColor: string;
}

export const CHARACTERS: Character[] = [
    {
        id: "cocktailspecialist",
        name: "Cocktail Specialist",
        description:
            "There is this evil in his eyes, but he makes good drinks",
        traitDescription:
            "You can max out drink type trait instantly, whenever someone else does this, add 2 to your sip counter and make their cocktail",
        accentColor: "#86c292",
    },
    {
        id: "comrade",
        name: "Comrade",
        description:
            "There is no you and me, only us",
        traitDescription:
            "Always pick someone to drink with you",
        accentColor: "#74a0d1",
    },
    {
        id: "gymlover",
        name: "Gym Lover",
        description:
            "The heart is the strongest massel",
        traitDescription:
            "Do 1 push-up whenever you drink. Whenever you hit 5 push-ups, everyone has to do 5 push-ups or drink 1 sip",
        accentColor: "#9e5476",
    },
    {
        id: "baller",
        name: "Baller",
        description:
            "Knows ball",
        traitDescription:
            "On your turn, you can throw 2 balls: >50 = everyone drinks 2 sips; 40-50 = pick someone to drink; <40 = you drink",
        accentColor: "#2341c4",
    },
    {
        id: "dj",
        name: "Dee Jay",
        description:
            "One with the tunes, small and weird",
        traitDescription:
            "On your turn, if you can name the song/artist, give out 2 sips, otherwise you drink",
        accentColor: "#627c8e",
    },
    {
        id: "thief",
        name: "Thief",
        description:
            "Steals your heart faster than a bami at 4am",
        traitDescription:
            "Get a token every 5 sips. Token can be used to steal someone's action (either card or character action)",
        accentColor: "#421f42",
    },
    {
        id: "strategist",
        name: "Strategist",
        description:
            "Playing chess in a drinking game",
        traitDescription:
            "On your turn, add 1 sip to your sip counter",
        accentColor: "#144237",
    },

];

export function getCharacter(id?: CharacterId | null): Character | undefined {
    return CHARACTERS.find((c) => c.id === id);
}