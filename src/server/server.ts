import WebSocket, { WebSocketServer } from "ws";
import crypto from "crypto";

import type { GameState, Player } from "@/shared/types";
import type {
    ClientMessage,
    ServerMessage,
} from "@/shared/messages";

interface PlayerSocket extends WebSocket {
    playerId?: string;
}

const wss = new WebSocketServer({
    port: 3000,
});

const game: GameState = {
    players: [],
    currentPlayerId: null,
    currentCard: null,
    status: "waiting",
};

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
        const id = crypto.randomUUID();

        const player: Player = {
            id,
            name: data.name,
            points: 0,
            connected: true,
        };

        game.players.push(player);

        socket.playerId = id;

        const response: ServerMessage = {
            type: "JOINED_GAME",
            player,
        };

        socket.send(JSON.stringify(response));

        broadcastGameState();
    }
}

function broadcastGameState(): void {
    const message: ServerMessage = {
        type: "GAME_STATE",
        game,
    };

    const serializedMessage = JSON.stringify(message);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(serializedMessage);
        }
    });
}