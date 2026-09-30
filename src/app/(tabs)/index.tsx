import {useGameSocket} from "@/app/hooks/useGameSocket";
import JoinGameView from "@/app/components/game/JoinGameView";
import GameView from "@/app/components/game/GameView";
import GameOverView from "@/app/components/game/GameOverView";

export default function Index() {
    const { game, nextTurn, myPlayerId, joinGame, startGame } = useGameSocket();

    if (game?.status === "playing") return <GameView game={game} nextTurn={nextTurn} myPlayerId={myPlayerId} />;
    if (game?.status === "finished") return <GameOverView />;
    return  <JoinGameView game={game} joinGame={joinGame} startGame={startGame} />
}