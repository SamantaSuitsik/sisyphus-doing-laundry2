import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import {
    CircleQuestionMark,
} from "lucide-react-native";
import { TraitIconName } from "@/shared/traits/traits";
import {traitIcons} from "@/components/traits/constants/TraitIcons";
import { colors } from "@/constants/GameColors";

interface IProps {
    icon: TraitIconName;
    name: string;
    unlocked: boolean;
    /** The next level you are working towards. */
    isNext?: boolean;
    /** Points needed for this level (shown while it is the next one). */
    cost?: number;
}

const BOX = 60;

export function TraitLevelNode({ icon, name, unlocked, isNext = false, cost }: IProps) {
    const Icon = traitIcons[icon] ?? CircleQuestionMark;
    const pop = useSharedValue(1);
    const first = useRef(true);

    // little pop when a level gets unlocked (not on first render)
    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        if (unlocked) {
            pop.value = withSequence(
                withTiming(1.18, { duration: 110 }),
                withSpring(1, { damping: 13, stiffness: 300 })
            );
        }
    }, [unlocked]);

    const style = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

    return (
        <View style={{ width: 76, alignItems: "center" }}>
            <Animated.View style={style}>
                {unlocked ? (
                    <LinearGradient
                        colors={[colors.pinkLight, colors.interactionPink]}
                        style={{
                            width: BOX,
                            height: BOX,
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: colors.interactionPink,
                            shadowOpacity: 0.8,
                            shadowRadius: 14,
                            shadowOffset: { width: 0, height: 0 },
                            elevation: 8,
                        }}
                    >
                        <Icon size={28} color={colors.textOnPink} strokeWidth={2.2} />
                    </LinearGradient>
                ) : (
                    <View
                        style={{
                            width: BOX,
                            height: BOX,
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: colors.glass,
                            borderWidth: isNext ? 2 : 1,
                            borderColor: isNext ? colors.interactionPink + "AA" : colors.glassBorder,
                        }}
                    >
                        <Icon
                            size={26}
                            color={isNext ? colors.interactionPink : "rgba(255,255,255,0.35)"}
                            strokeWidth={2}
                        />
                    </View>
                )}
            </Animated.View>

            <Text
                className="mt-2 text-sm font-bold text-center"
                style={{ color: unlocked ? "#FFFFFF" : "rgba(255,255,255,0.5)" }}
                numberOfLines={1}
            >
                {name}
            </Text>
            {isNext && !unlocked && cost !== undefined && (
                <Text className="text-xs font-semibold" style={{ color: colors.interactionPink }}>
                    {cost} pts
                </Text>
            )}
        </View>
    );
}