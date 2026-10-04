import WebSocket, {WebSocketServer} from "ws";
import type {ClientMessage, ServerMessage,} from "@/shared/messages";
import {Game} from "@/server/game/Game";
import {TraitId} from "@/shared/traits/traits";

export interface PlayerSocket extends WebSocket {
    playerId?: string;
}

const wss = new WebSocketServer({
    port: 3000,
});

const game = new Game();

console.log("Server running on ws://localhost:3000");

wss.on("connection", (socket: PlayerSocket) => {
    console.log("Client connected");

    socket.on("message", (message: WebSocket.RawData) => {
        try {
            const data = JSON.parse(
                message.toString(),
            ) as ClientMessage;

            handleMessage(socket, data);
        } catch (error) {
            console.error("Invalid message:", error);
        }
    });

    socket.on("close", () => {
        console.log("Client disconnected");

        if (socket.playerId) {
            const player = game.players.find(
                (player) => player.id === socket.playerId,
            );

            if (player) {
                player.connected = false;
            }

            broadcastGameState();
        }
    });
});

function handleMessage(
    socket: PlayerSocket,
    data: ClientMessage,
): void {
    if (data.type === "JOIN_GAME") {
        game.joinGame(socket, data.name);
        broadcastGameState();
    }

    if (data.type === "START_GAME") {
        game.startGame();
        broadcastGameState();
    }

    if (data.type === "NEXT_TURN") {
        game.nextTurn();
        broadcastGameState();
    }

    if (data.type === "EARN_POINT") {
        game.earnPoint(socket);
    }

    if (data.type === "CHOOSE_PLAYER") {
        if (!socket.playerId) {
            return;
        }

        const success = game.choosePlayer(
            socket.playerId,
            data.chosenId,
        );

        if (success) {
            broadcastGameState();
        }
    }

    if (data.type === "SPEND_TRAIT_POINT") {
        spendTraitPoint(socket, data.traitId);
    }

}

function broadcastGameState(): void {
    const state = game.getState();
    console.log(">>> BROADCAST");
    console.log("card:", state.currentCard?.name);
    console.log("action:", state.currentCard?.action);
    console.log("pendingAction:", state.pendingAction);
    console.log("currentPlayerId:", state.currentPlayerId);

    const message: ServerMessage = {
        type: "GAME_STATE",
        game: game.getState(),
    };

    const serializedMessage = JSON.stringify(message);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(serializedMessage);
        }
    });
}

function spendTraitPoint(socket: PlayerSocket, traitId: TraitId) {
    const result = game.spendTraitPoint(
        socket.playerId!,
        traitId
    );

    if (!result.success) {
        socket.send(JSON.stringify({
            type: "ERROR",
            error: result.error,
        }));

        return;
    }

    socket.send(JSON.stringify({
        type: "POINTS_UPDATED",
        points: result.points,
    }));

    socket.send(JSON.stringify({
        type: "TRAITS_UPDATED",
        points: result.points,
        traitPoints: result.traitPoints,
    }));
}