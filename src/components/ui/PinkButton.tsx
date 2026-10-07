import { useState } from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import { colors } from "@/constants/GameColors";

interface PinkButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function PinkButton({ title, onPress, disabled = false, style }: PinkButtonProps) {
    const [pressed, setPressed] = useState(false);

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            style={style}
        >
            <View
                style={{
                    borderWidth: 2,
                    borderColor: colors.interactionPink,
                    borderStyle: "solid",
                    borderRadius: 999,
                    paddingVertical: 10,
                    paddingHorizontal: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: disabled ? 0.4 : pressed ? 0.6 : 1,
                }}
            >
                <Text style={{ color: colors.interactionPink, fontWeight: "700", fontSize: 16 }}>
                    {title}
                </Text>
            </View>
        </Pressable>
    );
}