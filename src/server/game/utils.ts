import type {Card, Player} from "@/shared/types";

export function randomInt(min: number, max: number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function createRandomTurnOrder(players: Player[]): string[] {
    return shuffle(
        players.map((player) => player.id),
    );
}

export function shuffle<T>(array: T[]): T[] {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}