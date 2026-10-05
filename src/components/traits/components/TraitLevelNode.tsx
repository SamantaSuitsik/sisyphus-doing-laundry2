import { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

import { Text } from "@/components/ui/text";
import { TraitGlow } from "./TraitGlow";
import {traitIcons} from "@/components/traits/constants/TraitIcons";

interface TraitLevelNodeProps {
    icon: keyof typeof traitIcons;
    name: string;
    unlocked: boolean;
}

export function TraitLevelNode({
                                   icon,
                                   name,
                                   unlocked,
                               }: TraitLevelNodeProps) {
    const Icon = traitIcons[icon];

    const scale = useSharedValue(1);
    const glowOpacity = useSharedValue(0);
    const glowScale = useSharedValue(0.7);

    const firstRender = useRef(true);

    useEffect(() => {
        /*
         * Don't play the unlock animation when the screen
         * is first loaded. Only play it when the node
         * changes from locked -> unlocked.
         */
        if (firstRender.current) {
            firstRender.current = false;

            if (unlocked) {
                scale.value = 1;
                glowOpacity.value = 0;
                glowScale.value = 0.7;
            }

            return;
        }

        if (!unlocked) {
            scale.value = 1;
            glowOpacity.value = 0;
            glowScale.value = 0.7;
            return;
        }

        // Big satisfying pop
        scale.value = withSequence(
            withTiming(1.18, {
                duration: 120,
            }),
            withSpring(1, {
                damping: 8,
                stiffness: 180,
            }),
        );

        // One-time glow burst
        glowOpacity.value = withSequence(
            withTiming(0.7, {
                duration: 100,
            }),
            withTiming(0, {
                duration: 700,
            }),
        );

        glowScale.value = withSequence(
            withTiming(1, {
                duration: 120,
            }),
            withTiming(1.25, {
                duration: 650,
            }),
        );
    }, [unlocked]);

    const nodeStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: scale.value,
            },
        ],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
        transform: [
            {
                scale: glowScale.value,
            },
        ],
    }));

    return (
        <View className="items-center">
            <View className="h-[50px] w-[50px] items-center justify-center">

                {unlocked && (
                    <Animated.View
                        pointerEvents="none"
                        style={glowStyle}
                        className="absolute h-[50px] w-[50px] items-center justify-center"
                    >
                        <TraitGlow size={64} />
                    </Animated.View>
                )}

                {/* Node */}
                <Animated.View
                    style={nodeStyle}
                    className={[
                        "h-[44px] w-[44px] items-center justify-center rounded-full border-2",
                        unlocked
                            ? "border-character-blue bg-character-blue"
                            : "border-border bg-background",
                    ].join(" ")}
                >
                    <Icon
                        size={20}
                        strokeWidth={2.2}
                        color={
                            unlocked
                                ? "#FFFFFF"
                                : "#888888"
                        }
                    />
                </Animated.View>
            </View>

            <Text
                className={[
                    "mt-1 text-[9px] font-semibold",
                    unlocked
                        ? "text-foreground"
                        : "text-muted-foreground",
                ].join(" ")}
            >
                {name}
            </Text>
        </View>
    );
}