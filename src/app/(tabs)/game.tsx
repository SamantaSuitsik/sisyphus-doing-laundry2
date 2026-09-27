import {SafeAreaView} from "react-native-safe-area-context";
import {Image, View} from "react-native";
import {Text} from "@/app/components/ui/text";

export default function Game() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 pt-24 items-center">
                <Text variant="h1">Your turn</Text>
                <View className="flex-1 pt-16 w-full items-center">
                    <Image
                        source={require('@/assets/images/men_drink.png')}
                        className="w-full h-4/6"
                        resizeMode="contain"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}