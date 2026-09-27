export interface Player {
    id: string,
    name: string,
    points: number,
    connected: boolean
}

export interface Card {
    id: string,
    text: string
}

export type GameStatus = "waiting" | "playing" | "finished";

export interface GameState {
    players: Player[],
    currentPlayerId: string | null,
    currentCard: Card | null,
    status: GameStatus

}