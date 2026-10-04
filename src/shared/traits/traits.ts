export type TraitId = | "drink" | "ruleMaker";

export type TraitIconName =
    | "beer"
    | "bottle-wine"
    | "martini"
    | "users"
    | "dices"
    | "trophy"
    | "flame"
    | "circle-question-mark";

export interface TraitLevel {
    id: string,
    name: string,
    description: string,
    cost: number,
    icon: TraitIconName
}

export interface TraitDefinition {
    id: TraitId,
    name: string,
    description: string,
    levels: TraitLevel[]
}

export const TRAITS: TraitDefinition[] = [
    {
        id: "drink",
        name: "Drink",
        description: "Unlock better drinks.",
        levels: [
            {
                id: "beer",
                name: "Beer",
                description: "A good beer",
                cost: 0,
                icon: "beer",
            },
            {
                id: "wine",
                name: "Wine",
                description: "A fine glass of wine",
                cost: 5,
                icon: "bottle-wine",
            },
            {
                id: "cocktail",
                name: "Cocktail",
                description: "Swirly funny tail",
                cost: 5,
                icon: "martini",
            },
        ],
    },
    {
        id: "ruleMaker",
        name: "Rule Maker",
        description: "Socially powerful perks.",
        levels: [
            {
                id: "social1",
                name: "Social I",
                description: "First social perk",
                cost: 0,
                icon: "users",
            },
            {
                id: "social2",
                name: "Social II",
                description: "Second social perk",
                cost: 3,
                icon: "users",
            },
            {
                id: "social3",
                name: "Social III",
                description: "Third social perk",
                cost: 6,
                icon: "trophy",
            },
        ],
    },
]