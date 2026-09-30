import {SafeAreaView} from "react-native-safe-area-context";
import {Image, View} from "react-native";
import {Text} from "@/app/components/ui/text";
import {Button} from "@/app/components/ui/button";
import {GameState, Player} from "@/shared/types";
import {cardImages} from "@/app/constants/CardImages";
import Counter from "@/app/components/ui/SipCounter";
import {FramedButton} from "@/app/components/ui/FramedButton";
import Separator from "@/assets/separator_svg.svg";
import {FramedButtonFilled} from "@/app/components/ui/FramedButtonFilled";
import PointsDisplay from "@/app/components/ui/PointsDisplay";

interface IProps {
    game: GameState | null,
    nextTurn: () => void,
    myPlayerId: string | null
}

export default function GameView({ game, nextTurn, myPlayerId}: IProps) {
    const currentPlayer: Player | undefined = game?.players.find(p => p.id === game.currentPlayerId);
    const isMyTurn = currentPlayer?.id === myPlayerId;
    const cardImage = game?.currentCard
        ? cardImages[game.currentCard.name]
        : undefined;
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className=" pt-24 items-center">
                <View className="w-20 h-20"><PointsDisplay value={0} /></View>
                { isMyTurn
                    ? <Text variant="h1" className="text-h1">My turn</Text>
                    : <Text variant="h1" className="text-h1">{`${currentPlayer?.name}'s turn`}</Text>
                }
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
                <View className="w-full flex-row items-center h-40">
                    <Counter className="flex-1" />
                    <View className="flex-1">
                        <FramedButtonFilled onPress={nextTurn} className="w-full">
                            <Text>Next</Text>
                        </FramedButtonFilled>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}