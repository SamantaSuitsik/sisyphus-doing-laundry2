import WebSocket, {WebSocketServer} from "ws";
import type {ClientMessage, ServerMessage,} from "@/shared/messages";
import {Game} from "@/server/game/Game";
import {TraitId} from "@/shared/traits/traits";
import AsyncStorage from "@react-native-async-storage/async-storage"

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
            console.log("JOIN_GAME", data);
        } catch (error) {
            console.error("Invalid message:", error);
        }
    });

    socket.on("close", () => {
        console.log("Client disconnected");

        if (!socket.playerId) return;

        const stillConnected = [...wss.clients].some(
            (c) => c !== socket && (c as PlayerSocket).playerId === socket.playerId,
        );
        if (stillConnected) return;

        const player = game.players.find((p) => p.id === socket.playerId);
        if (player) {
            player.connected = false;
        }

        broadcastGameState();
    });
});

function handleMessage(
    socket: PlayerSocket,
    data: ClientMessage,
): void {
    if (data.type === "JOIN_GAME") {
        if (!data.playerId) {
            socket.send(JSON.stringify({ type: "ERROR", message: "Missing playerId" }));
            return;
        }

        const player = game.joinOrReJoin(socket, data.name, data.playerId);

        socket.playerId = player.id;

        const response: ServerMessage = {
            type: "JOINED_GAME",
            player,
        };
        socket.send(JSON.stringify(response));

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
    if (data.type === "REMOVE_POINT") {
        if (!socket.playerId) return;
        game.removePoint(socket);
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

    async function getPlayerId() {
        let id = await AsyncStorage.getItem("playerId");
        if (!id) {
            id = Math.random().toString(36).slice(2) + Date.now().toString(36);
            await AsyncStorage.setItem("playerId", id);
        }
        return id;
    }

}