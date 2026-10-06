export type TraitId =  "drink" | "ruleMaker" | "trivia" | "gambling" ;

export type TraitIconName =
    | "beer"
    | "bottle-wine"
    | "martini"
    | "crown"
    | "square-stack"
    | "brain"
    | "chef-hat"
    | "trending-up-down"
    | "squircle-dashed"
    | "trending-up";

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
        name: "Drink type",
        description: "Road to new drinks",
        levels: [
            {
                id: "beer",
                name: "Beer",
                description: "the drink of the commoners",
                cost: 0,
                icon: "beer",
            },
            {
                id: "wine",
                name: "Wine",
                description: "a bit more sophisticated aren't we",
                cost: 4,
                icon: "bottle-wine",
            },
            {
                id: "cocktail",
                name: "Cocktail",
                description: "true enjoyer of fine beverages",
                cost: 4,
                icon: "martini",
            },
        ],
    },
    {
        id: "ruleMaker",
        name: "Rule Maker",
        description: "Road to great evil",
        levels: [
            {
                id: "rulemaker0",
                name: "Darkness",
                description: "Nothing cool happening yet",
                cost: 0,
                icon: "squircle-dashed",
            },
            {
                id: "rulemaker1",
                name: "Great wit",
                description: "Say something smart, like a king",
                cost: 1,
                icon: "chef-hat",
            },
            {
                id: "rulemaker2",
                name: "Great strength",
                description: "Drink 3 sips, don't add them to the sip counter",
                cost: 3,
                icon: "square-stack",
            },
            {
                id: "rulemaker3",
                name: "New rule",
                description: "Make a new rule for the game",
                cost: 5,
                icon: "crown",
            },
        ],
    },
    {
        id: "trivia",
        name: "Trivia",
        description: "Road to great knowledge",
        levels: [
            {
                id: "trivia1",
                name: "Trivia",
                description: "Do one trivia, wrong answer = drink",
                cost: 4,
                icon: "brain",
            },
            {
                id: "trivia2",
                name: "Trivia",
                description: "Do one trivia, wrong answer = drink",
                cost: 4,
                icon: "brain",
            },
            {
                id: "trivia3",
                name: "Trivia",
                description: "Do one trivia, wrong answer = drink",
                cost: 4,
                icon: "brain",
            },
        ],
    },
    {
        id: "gambling",
        name: "Gambling",
        description: "Road to maxing your potential",
        levels: [
            {
                id: "gambling1",
                name: "1 sip bets",
                description: "Bet on duel results, if you win, give out 1 sip that is not added to sip counter, " +
                    "if you lose, remove 1 sip from yourself",
                cost: 5,
                icon: "trending-up-down",
            },
            {
                id: "gambling2",
                name: "2 sip bets",
                description: "Bet on duel results, if you win, give out 2 sips that is not added to sip counter, " +
                    "if you lose, remove 2 sips from yourself",
                cost: 4,
                icon: "trending-up-down",
            },
            {
                id: "gambling3",
                name: "Guaranteed win",
                description: "Losing a bet won't affect you anymore",
                cost: 4,
                icon: "trending-up",
            },
        ],
    },
]