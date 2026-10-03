import {Image, View} from "react-native";
import {Text} from "@/app/components/ui/text";
import {GameState, Player} from "@/shared/types";
import {cardImages} from "@/app/constants/CardImages";
import Separator from "@/assets/separator_svg.svg";
import PointsDisplay from "@/app/components/ui/PointsDisplay";
import {GameButton} from "@/app/components/ui/GameButton";
import Counter from "@/app/components/ui/SipCounter";

interface IProps {
    game: GameState | null,
    nextTurn: () => void,
    myPlayerId: string | null,
    myPoints: number,
    earnPoint: () => void,
}

export default function GameView({game, nextTurn, myPlayerId, myPoints, earnPoint}: IProps) {
    const currentPlayer: Player | undefined =
        game?.players.find(p => p.id === game.currentPlayerId);

    const isMyTurn = currentPlayer?.id === myPlayerId;
    const cardImage = game?.currentCard
        ? cardImages[game.currentCard.name]
        : undefined;

    return (
        <View className="flex-1 bg-background pt-3">
            <View className="items-center">
                <PointsDisplay
                    points={myPoints}
                    size={160}
                />
            </View>

            <View className="flex-1 items-center">
                {isMyTurn ? (
                    <Text variant="h1" className="text-h1">
                        My turn
                    </Text>
                ) : (
                    <Text variant="h1" className="text-h1">
                        {`${currentPlayer?.name}'s turn`}
                    </Text>
                )}

                <View className="w-full mt-2 items-center">
                    <Image
                        source={cardImage}
                        className="w-[400px] h-[400px]"
                        resizeMode="contain"
                    />
                </View>

                <Separator
                    width="100%"
                    height={100}
                />

                <View className="w-full flex-row items-center mt-auto gap-6 px-5">
                    <Counter onPress={earnPoint} />
                    <GameButton label="Next" onPress={nextTurn}></GameButton>
                </View>
            </View>
        </View>
    );
}