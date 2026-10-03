import crypto from "crypto";
import type {Card, GameState, GameStatus, Player} from "@/shared/types";
import type {ServerMessage} from "@/shared/messages";
import {PlayerSocket} from "@/server/server";
import {deck} from "@/server/Deck";
import {randomInt} from "@/server/game/utils"

export class Game {
    players: Player[] = [];
    currentPlayerId?: string | null;
    currentCard?: Card | null;
    status?: GameStatus;

    turnOrder: string[] = [];
    remainingCards: Card[] = [...deck];

    getState(): GameState {
        return {
            players: this.players,
            currentPlayerId: this.currentPlayerId ?? null,
            currentCard: this.currentCard ?? null,
            status: this.status ?? "waiting"
        }
    }

    joinGame(socket: PlayerSocket, name: string) {
        const id = crypto.randomUUID();

        const player: Player = {
            id,
            name,
            points: 0,
            connected: true,
        };

        this.players.push(player);

        socket.playerId = id;

        const response: ServerMessage = {
            type: "JOINED_GAME",
            player,
        };

        socket.send(JSON.stringify(response));

    }

    startGame(): void {
        this.turnOrder = this.players.map(p => p.id);
        this.currentPlayerId = this.turnOrder[0];
        this.status = "playing";

        this.currentCard = this.getNextCard();

    }

    getNextCard(): Card | null {
        if (this.remainingCards.length === 0) {
            console.log("NEW PACK OF CARDS!");
            this.remainingCards = [...deck];
            console.log(this.remainingCards);
            //todo: testi kas tootab
        }
        return this.remainingCards.splice(randomInt(0 ,this.remainingCards.length-1), 1)[0];
    }

    nextTurn() {
        const card = this.getNextCard();
        if (card === null) {
            this.status = "finished";
            return;
        }
        this.currentCard = card;
        this.currentPlayerId = this.findNextPlayer();
        console.log("removed card: ");
        console.log(card);
        console.log("remainingcards: ");
        console.log(this.remainingCards);
    }

    findNextPlayer(): string {
        const currentIndex = this.turnOrder.indexOf(
            this.currentPlayerId!
        );

        const nextPlayerId = (currentIndex + 1) % this.turnOrder.length;
        return this.turnOrder.at(nextPlayerId)!;
    }

    earnPoint(socket: PlayerSocket) {
        const playerId = socket.playerId;
        if (!playerId) return;

        const player = this.players.find(p => p.id === playerId);
        if (!player) return;

        player.points += 1;

        const response: ServerMessage = {
            type: "POINTS_UPDATED",
            points: player.points,
        };

        socket.send(JSON.stringify(response));
    }
}