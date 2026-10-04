import JoinGameView from "@/app/components/game/JoinGameView";
import GameView from "@/app/components/game/GameView";
import GameOverView from "@/app/components/game/GameOverView";
import {useGameSocket} from "@/app/hooks/GameSocketContext";

export default function Index() {
    const { game, nextTurn, myPlayerId, myPoints, joinGame, startGame, earnPoint, choosePlayer } = useGameSocket();

    if (game?.status === "playing")
        return <GameView
            game={game}
            nextTurn={nextTurn}
            myPlayerId={myPlayerId}
            myPoints={myPoints}
            earnPoint={earnPoint}
            onChoosePlayer={choosePlayer}/>;

    if (game?.status === "finished") return <GameOverView />;
    return  <JoinGameView game={game} joinGame={joinGame} startGame={startGame} />
}