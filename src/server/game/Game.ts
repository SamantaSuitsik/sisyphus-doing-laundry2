import crypto from "crypto";
import type {Card, GameState, GameStatus, PendingAction, Player} from "@/shared/types";
import type {ServerMessage} from "@/shared/messages";
import {PlayerSocket} from "@/server/server";
import {deck} from "@/server/Deck";
import {randomInt} from "@/server/game/utils"
import {applyCardActions} from "@/server/game/Rules";

export class Game {
    public players: Player[] = [];
    public currentPlayerId?: string | null;
    public currentCard?: Card | null;
    public status?: GameStatus;
    public pendingAction: PendingAction = null;

    private turnOrder: string[] = [];
    private remainingCards: Card[] = [...deck];

    getState(): GameState {
        return {
            players: this.players,
            currentPlayerId: this.currentPlayerId ?? null,
            currentCard: this.currentCard ?? null,
            status: this.status ?? "waiting",
            pendingAction: this.pendingAction
        }
    }

    getCurrentPlayer(): Player | null {
        return this.players?.find(p => p.id === this.currentPlayerId) ?? null;
    }

    getTurnOrder(): string[] {
        return this.turnOrder;
    }

    setTurnOrder(newOrder: string[]) {
        this.turnOrder = newOrder;
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

        const card = this.getNextCard();
        this.currentCard = card;
        if (card?.action) {
            applyCardActions(this);
            return;
        }

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
    private drawCard(): void {
        const card = this.getNextCard();

        if (card === null) {
            this.status = "finished";
            return;
        }

        this.currentCard = card;

        if (card.action) {
            applyCardActions(this);
            return;
        }

        console.log("removed card:");
        console.log(card);
        console.log("remainingcards:");
        console.log(this.remainingCards);
    }

    nextTurn() {
        if (this.pendingAction) return;

        this.currentPlayerId = this.findNextPlayer();

        this.drawCard();
    }

    findNextPlayer(playerId: string = this.currentPlayerId!): string {
        const currentIndex = this.turnOrder.indexOf(playerId);

        const nextPlayerIndex =
            (currentIndex + 1) % this.turnOrder.length;

        return this.turnOrder[nextPlayerIndex];
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

    choosePlayer(requestingPlayerId: string, targetPlayerId: string): boolean {
        const pendingAction = this.pendingAction;

        if (!pendingAction) {
            console.log("No pending action");
            return false;
        }

        if (pendingAction.type !== "swapSeats") {
            console.log("Pending action is not swapSeats");
            return false;
        }

        const targetPlayer = this.players.find(
            player => player.id === targetPlayerId,
        );

        if (!targetPlayer) {
            return false;
        }

        if (targetPlayerId === requestingPlayerId) {
            console.log("Player cannot choose themselves");
            return false;
        }

        this.swapSeats(
            requestingPlayerId,
            targetPlayerId,
        );

        this.pendingAction = null;
        this.currentPlayerId = requestingPlayerId;
        this.drawCard();
        return true;
    }

    private swapSeats(playerIdA: string, playerIdB: string) {
        const currentOrder = this.getTurnOrder();
        const newOrder = [...currentOrder];

        const indexA = currentOrder.indexOf(playerIdA);
        const indexB = currentOrder.indexOf(playerIdB);

        if (indexA === -1 || indexB === -1) {
            return;
        }

        newOrder[indexA] = playerIdB;
        newOrder[indexB] = playerIdA;
        console.log("persons");
        console.log(this.players.map(p => `$name/id: ${p.name} - ${p.id}`));
        console.log("new turnorder");
        console.log(newOrder);
        this.setTurnOrder(newOrder);

    }
}