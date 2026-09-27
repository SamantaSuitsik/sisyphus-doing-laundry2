import {SafeAreaView} from "react-native-safe-area-context";
import {Image, View} from "react-native";
import {Text} from "@/app/components/ui/text";
import {useGameSocket} from "@/app/hooks/useGameSocket";
import {Button} from "@/app/components/ui/button";
import {Player} from "@/shared/types";

export default function Game() {
    const { game, nextTurn, myPlayerId } = useGameSocket();
    const currentPlayer: Player | undefined = game?.players.find(p => p.id === game.currentPlayerId);
    // const isMyTurn = currentPlayer?.id === myPlayerId;
    console.log(currentPlayer?.id);
    console.log(myPlayerId);
    const isMyTurn = false;
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 pt-24 items-center">
                { isMyTurn
                    ? <Text variant="h1">My turn</Text>
                    : <Text variant="h1">{`${currentPlayer?.name}'s turn`}</Text>
                }
                <View className="flex-1 pt-16 w-full items-center">
                    {/*<Image*/}
                    {/*    source={require('@/assets/images/men_drink.png')}*/}
                    {/*    className="w-full h-4/6"*/}
                    {/*    resizeMode="contain"*/}
                    {/*/>*/}
                    <Text variant="h1">{game?.currentCard?.name}</Text>
                </View>
                <Button onPress={nextTurn}>
                    <Text>Next</Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}