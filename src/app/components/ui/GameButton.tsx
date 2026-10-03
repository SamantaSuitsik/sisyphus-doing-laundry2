import {Pressable, View, Text} from "react-native";

interface GameButtonProps {
    label: string;
    onPress: () => void;
    className?: string;
}

export function GameButton({
    label,
    onPress,
    className = "",
}: GameButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`flex-1 h-20 border-2 border-interaction-pink rounded-[48px] ${className}`}
        >
            <View className="flex-1 items-center justify-center">
                <Text className="text-center text-white">{label}</Text>
            </View>
        </Pressable>
    );
}
