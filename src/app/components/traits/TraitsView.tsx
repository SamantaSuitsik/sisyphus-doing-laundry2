import {Pressable, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function TraitsView() {
    return  <SafeAreaView className="flex-1">
        <View className="relative h-32 w-full justify-center">

            <View
                className="absolute h-2 bg-gray-300"
                style={{
                    left: 32,
                    right: 32,
                    top: "50%",
                }}
            />

            <Pressable
                className="absolute left-4 h-8 w-8 rounded-full bg-blue-500"
                style={{ top: "50%", transform: [{ translateY: -32 }] }}
            />

            <Pressable
                className="absolute right-4 h-12 w-12 rounded-full bg-gray-300"
                style={{ top: "50%", transform: [{ translateY: -24 }] }}
            />

        </View>
    </SafeAreaView>;
}