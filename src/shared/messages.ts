import type { GameState, Player } from "./types";

export type ClientMessage =
    | {
    type: "JOIN_GAME";
    name: string;
}
    | {
    type: "NEXT_TURN";
}
    | {
    type: "EARN_POINT";
}
    | {
    type: "START_GAME";
}
    | {
    type: "CHOOSE_PLAYER";
    chosenId: string;
}

export type ServerMessage =
    | {
    type: "GAME_STATE";
    game: GameState;
}
    | {
    type: "JOINED_GAME";
    player: Player;
}
    | {
    type: "ERROR";
    message: string;
}
    | {
    type: "POINTS_UPDATED";
    points: number
}