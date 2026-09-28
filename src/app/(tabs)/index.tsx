import {useGameSocket} from "@/app/hooks/useGameSocket";
import JoinGameView from "@/app/components/game/JoinGameView";
import GameView from "@/app/components/game/GameView";

export default function Index() {
    const { game, nextTurn, myPlayerId, joinGame, startGame } = useGameSocket();

    if (game?.status === "waiting") return <JoinGameView game={game} joinGame={joinGame} startGame={startGame} />
    return <GameView game={game} nextTurn={nextTurn} myPlayerId={myPlayerId} />;
}