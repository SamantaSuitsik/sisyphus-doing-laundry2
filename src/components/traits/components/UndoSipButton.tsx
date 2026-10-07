import { Pressable, Text } from "react-native";
import { Minus } from "lucide-react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import {colors} from "@/constants/GameColors";

export default function UndoSipButton({
                                          onPress,
                                          disabled,

                                      }: {
    onPress: () => void;
    disabled: boolean;
}) {
    const press = useSharedValue(1);
    const style = useAnimatedStyle(() => ({ transform: [{ scale: press.value }] }));

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            hitSlop={12}
            onPressIn={() => {
                press.value = withSpring(0.9, { damping: 15, stiffness: 300 });
            }}
            onPressOut={() => {
                press.value = withSpring(1, { damping: 14, stiffness: 300 });
            }}
            accessibilityRole="button"
            accessibilityLabel="Remove one sip"
            accessibilityState={{ disabled }}
        >
            <Animated.View
                style={[
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 999,
                        backgroundColor: colors.glass,
                        borderWidth: 1,
                        borderColor: colors.glassBorder,
                        opacity: disabled ? 0.4 : 1,
                    },
                    style,
                ]}
            >
                <Minus size={14} color="#FFFFFF" strokeWidth={3} />
                <Text className="text-white/80 text-xs font-semibold">Undo sip</Text>
            </Animated.View>
        </Pressable>
    );
}