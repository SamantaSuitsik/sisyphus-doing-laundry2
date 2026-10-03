import type { Player} from "@/shared/types";
import {Game} from "@/server/game/Game";

export function applyCardActions(game: Game) {
    switch (game.currentCard?.action) {
        case "swapSeats":
            requestSwapSeats(game);
    }

    return null;
}

function requestSwapSeats(game: Game) {
    if (!game.currentPlayerId) {
        return null;
    }

    game.pendingAction = {
        type: "swapSeats",
        playerId: game.currentPlayerId,
    };
}