import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";

import BorderFilled from "@/assets/border_filled.svg";
import { Text } from "@/components/ui/text";

interface PointsDisplayProps {
    points: number;
    size?: number;
}

export default function PointsDisplay({
                                          points,
                                          size = 120,
                                      }: PointsDisplayProps) {
    const numberScale = useSharedValue(1);

    useEffect(() => {
        numberScale.value = withSequence(
            withTiming(1.18, {
                duration: 100,
            }),
            withTiming(1, {
                duration: 180,
            }),
        );
    }, [points]);

    const numberStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: numberScale.value,
            },
        ],
    }));

    return (
        <View
            style={{
                width: size,
                height: size,
            }}
        >
            <BorderFilled
                width={size}
                height={size}
                style={{
                    position: "absolute",
                }}
            />

            <View className="absolute inset-0 flex-row gap-2 items-center justify-center">
                <Animated.View style={numberStyle}>
                    <Text className="text-4xl font-bold text-foreground">
                        {points}
                    </Text>
                </Animated.View>

                <Text className="mt-3 font-semibold text-muted-foreground text-sm ">
                    SIPS
                </Text>
            </View>
        </View>
    );
}