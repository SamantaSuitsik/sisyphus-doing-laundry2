// Backdrop.tsx
// Shared gradient background for GameView and TraitsView.
// warm = true fades in the pink/purple wash (your turn / traits screen).
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import {colors} from "@/constants/GameColors";

export default function Backdrop({ warm = false }: { warm?: boolean }) {
    const mood = useSharedValue(warm ? 1 : 0);

    useEffect(() => {
        mood.value = withTiming(warm ? 1 : 0, { duration: 700 });
    }, [warm]);

    const warmStyle = useAnimatedStyle(() => ({ opacity: mood.value }));

    return (
        <>
            <LinearGradient
                colors={[colors.playerAccent, colors.nightMid, colors.night]}
                locations={[0, 0.45, 1]}
                style={StyleSheet.absoluteFill}
            />
            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, warmStyle]}>
                <LinearGradient
                    colors={[
                        colors.interactionPink + "66",
                        colors.structurePurple + "40",
                        colors.night + "00",
                    ]}
                    locations={[0, 0.4, 0.85]}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        </>
    );
}