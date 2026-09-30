import WebSocket, {WebSocketServer} from "ws";
import crypto from "crypto";

import type {Card, GameState, Player} from "@/shared/types";
import type {ClientMessage, ServerMessage,} from "@/shared/messages";
import {deck} from "@/server/Deck";

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

let turnOrder: string[] = [];
let remainingCards: Card[] = [...deck];

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

    if (data.type === "START_GAME") {
        startGame();
    }

    if (data.type === "NEXT_TURN") {
        nextTurn();
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

function startGame(): void {
    turnOrder = game.players.map(p => p.id);
    game.currentPlayerId = turnOrder[0];
    game.status = "playing";

    game.currentCard = getNextCard();

    broadcastGameState();
}

function createRandomTurnOrder(players: Player[]): string[] {
    return shuffle(
        players.map((player) => player.id),
    );
}

function shuffle<T>(array: T[]): T[] {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

function getNextCard(): Card | null {
    if (remainingCards.length === 0) {
        console.log("NEW PACK OF CARDS!");
        remainingCards = [...deck];
        //todo: testi kas tootab
    }
    return remainingCards.splice(randomInt(0 ,remainingCards.length-1), 1)[0];
}

function randomInt(min: number, max: number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function nextTurn() {
    const card = getNextCard();
    if (card === null) {
        game.status = "finished";
        broadcastGameState();
        return;
    }
    game.currentCard = card;
    game.currentPlayerId = findNextPlayer();
    console.log("removed card: ");
    console.log(card);
    console.log("remainingcards: ");
    console.log(remainingCards);
    broadcastGameState();
}

function findNextPlayer(): string {
    const currentIndex = turnOrder.indexOf(
        game.currentPlayerId!
    );

    const nextPlayerId = (currentIndex + 1) % turnOrder.length;
    return turnOrder.at(nextPlayerId)!;
}