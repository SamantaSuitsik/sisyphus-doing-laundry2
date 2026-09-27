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
};

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
};