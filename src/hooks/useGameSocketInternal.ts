import { useCallback, useEffect, useState } from "react";

import type { ClientMessage, ServerMessage } from "@/shared/messages";
import type { GameState } from "@/shared/types";
import {TraitId} from "@/shared/traits/traits";

const SERVER_URL = "ws://192.168.1.147:3000";

export interface UseGameSocketResult {
    game: GameState | null;
    myPlayerId: string | null;
    myPoints: number;
    connected: boolean;
    error: string | null;

    startGame: () => void;
    joinGame: (name: string) => void;
    nextTurn: () => void;
    earnPoint: () => void;
    choosePlayer: (name: string) => void;
    myTraitPoints: Partial<Record<TraitId, number>>;
    spendTraitPoint: (traitId: TraitId) => void;
}

export function useGameSocketInternal(): UseGameSocketResult {
    const [game, setGame] = useState<GameState | null>(null);
    const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
    const [myPoints, setMyPoints] = useState<number>(0);
    const [myTraitPoints, setMyTraitPoints] = useState<Partial<Record<TraitId, number>>>({});

    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(SERVER_URL);

        ws.onopen = () => {
            console.log("WebSocket connected");

            setConnected(true);
            setError(null);
        };

        ws.onmessage = (event: MessageEvent<string>) => {
            try {
                const message = JSON.parse(event.data) as ServerMessage;
                switch (message.type) {
                    case "GAME_STATE":
                        setGame(message.game);
                        break;
                    case "POINTS_UPDATED":
                        setMyPoints(message.points);
                        break;
                    case "TRAITS_UPDATED":
                        setMyPoints(message.points);
                        setMyTraitPoints(message.traitPoints);
                        break;
                    case "JOINED_GAME":
                        setMyPlayerId(message.player.id);
                        break;

                    case "ERROR":
                        console.error("Server error:", message.message);
                        setError(message.message);
                        break;

                    default:
                        break;
                }
            } catch (error) {
                console.error("Failed to parse server message:", error);
            }
        };

        ws.onerror = (event) => {
            console.error("WebSocket error", event);
            setError("WebSocket connection error");
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");

            setConnected(false);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = useCallback(
        (message: ClientMessage) => {
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                console.warn("WebSocket is not connected");
                return;
            }

            socket.send(JSON.stringify(message));
        },
        [socket],
    );

    const joinGame = useCallback(
        (name: string) => {
            sendMessage({
                type: "JOIN_GAME",
                name,
            });
        },
        [sendMessage],
    );

    const startGame = useCallback(() => {
        sendMessage({
            type: "START_GAME",
        });
    }, [sendMessage]);

    const nextTurn = useCallback(() => {
        sendMessage({
            type: "NEXT_TURN",
        });
    }, [sendMessage]);

    const earnPoint = useCallback(() => {
        sendMessage({
            type: "EARN_POINT",
        });
    }, [sendMessage]);

    const choosePlayer = useCallback(
        (chosenId: string) => {
            sendMessage({
                type: "CHOOSE_PLAYER",
                chosenId,
            });
        },
        [sendMessage],
    );

    const spendTraitPoint = useCallback((traitId: TraitId) => {
        sendMessage({
            type: "SPEND_TRAIT_POINT",
            traitId,
        });
    }, [sendMessage])

    return {
        game,
        myPlayerId,
        myPoints,
        connected,
        error,
        joinGame,
        startGame,
        nextTurn,
        earnPoint,
        choosePlayer,
        myTraitPoints,
        spendTraitPoint
    };
}