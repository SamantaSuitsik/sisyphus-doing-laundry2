import { useCallback, useEffect, useState } from "react";

import type { ClientMessage, ServerMessage } from "@/shared/messages";
import type { GameState } from "@/shared/types";

const SERVER_URL = "ws://192.168.1.147:3000";

interface UseGameSocketResult {
    game: GameState | null;
    myPlayerId: string | null;
    connected: boolean;
    error: string | null;

    startGame: () => void;
    joinGame: (name: string) => void;
    nextTurn: () => void;
    earnPoint: () => void;
}

export function useGameSocket(): UseGameSocketResult {
    const [game, setGame] = useState<GameState | null>(null);
    const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
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

    return {
        game,
        myPlayerId,
        connected,
        error,
        joinGame,
        startGame,
        nextTurn,
        earnPoint,
    };
}