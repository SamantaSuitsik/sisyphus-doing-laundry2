export interface Player {
    id: string,
    name: string,
    points: number,
    connected: boolean
}

export interface Card {
    id: string,
    name: CardName,
}

export type CardName =
    | "men_drink_ok"
    | "communal_art_ok"
    | "ballstothewall_ok"
    | "ballswall_ok"
    | "chooseperson_ok"
    | "glaze_ok"
    | "kingofquestions_ok"
    | "skribbl_ok"
    | "stealasip_ok"
    | "swapseats_ok"
    | "thumbwar_ok"
    | "womendrink_ok"
    | "cardblow_ok"
    | "you_drink_ok"

export type GameStatus = "waiting" | "playing" | "finished";

export interface GameState {
    players: Player[],
    currentPlayerId: string | null,
    currentCard: Card | null,
    status: GameStatus

}