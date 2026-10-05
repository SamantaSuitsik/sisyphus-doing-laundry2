import {
    createContext,
    PropsWithChildren,
    useContext,
} from "react";

import {
    useGameSocketInternal,
} from "./useGameSocketInternal";

import type {
    UseGameSocketResult,
} from "./useGameSocketInternal";

const GameSocketContext =
    createContext<UseGameSocketResult | null>(null);

export function GameSocketProvider({
                                       children,
                                   }: PropsWithChildren) {
    const gameSocket = useGameSocketInternal();

    return (
        <GameSocketContext.Provider value={gameSocket}>
            {children}
        </GameSocketContext.Provider>
    );
}

export function useGameSocket(): UseGameSocketResult {
    const context = useContext(GameSocketContext);

    if (!context) {
        throw new Error(
            "useGameSocketInternal must be used inside GameSocketProvider"
        );
    }

    return context;
}