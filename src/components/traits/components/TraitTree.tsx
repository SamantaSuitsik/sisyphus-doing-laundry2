import {useEffect, useRef, useState} from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plus, Trophy } from "lucide-react-native";
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

import {TraitDefinition, TraitLevel} from "@/shared/traits/traits";
import { getTraitTotalCost } from "@/shared/traits/utils";
import { TraitLevelNode } from "@/components/traits/components/TraitLevelNode";
import {colors} from "@/constants/GameColors";
import {TraitDescriptionModal} from "@/components/traits/components/TraitDescriptionModal";

interface TraitTreeProps {
    trait: TraitDefinition;
    spentPoints: number;
    availablePoints: number;
    onSpendPoint: () => void;
    /** Position in the list, used to stagger the entrance animation. */
    index?: number;
}

/* ---------------- spend button ---------------- */
function SpendButton({ enabled, onPress }: { enabled: boolean; onPress: () => void }) {
    const press = useSharedValue(1);
    const style = useAnimatedStyle(() => ({ transform: [{ scale: press.value }] }));

    return (
        <Pressable
            disabled={!enabled}
            onPress={onPress}
            onPressIn={() => {
                press.value = withSpring(0.88, { damping: 15, stiffness: 300 });
            }}
            onPressOut={() => {
                press.value = withSpring(1, { damping: 14, stiffness: 300 });
            }}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Spend one point"
            accessibilityState={{ disabled: !enabled }}
        >
            <Animated.View style={style}>
                {enabled ? (
                    <LinearGradient
                        colors={[colors.pinkLight, colors.interactionPink]}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: colors.interactionPink,
                            shadowOpacity: 0.7,
                            shadowRadius: 12,
                            shadowOffset: { width: 0, height: 0 },
                            elevation: 8,
                        }}
                    >
                        <Plus size={26} strokeWidth={3} color={colors.textOnPink} />
                    </LinearGradient>
                ) : (
                    <View
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: colors.glass,
                            borderWidth: 1,
                            borderColor: colors.glassBorder,
                        }}
                    >
                        <Plus size={26} strokeWidth={3} color="rgba(255,255,255,0.3)" />
                    </View>
                )}
            </Animated.View>
        </Pressable>
    );
}

/* ---------------- progress rail ---------------- */
function RailSegment({ filled }: { filled: boolean }) {
    return (
        <View
            style={{
                width: 12,
                height: 3,
                borderRadius: 2,
                backgroundColor: filled ? colors.interactionPink : "rgba(255,255,255,0.15)",
            }}
        />
    );
}

function RailDot({ complete }: { complete: boolean }) {
    const scale = useSharedValue(1);
    const first = useRef(true);

    // pop when a point gets spent here
    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        if (complete) {
            scale.value = withSequence(
                withTiming(1.5, { duration: 100 }),
                withSpring(1, { damping: 13, stiffness: 300 })
            );
        }
    }, [complete]);

    const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        <Animated.View
            style={[
                {
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: complete ? colors.interactionPink : "transparent",
                    borderWidth: complete ? 0 : 1.5,
                    borderColor: "rgba(255,255,255,0.25)",
                    shadowColor: colors.interactionPink,
                    shadowOpacity: complete ? 0.9 : 0,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 0 },
                },
                style,
            ]}
        />
    );
}

function ProgressRail({
                          startPoint,
                          cost,
                          spentPoints,
                      }: {
    startPoint: number;
    cost: number;
    spentPoints: number;
}) {
    const items = [];
    for (let i = 0; i < cost; i++) {
        const earned = spentPoints >= startPoint + i + 1;
        items.push(<RailSegment key={`s${i}`} filled={earned} />);
        if (i < cost - 1) items.push(<RailDot key={`d${i}`} complete={earned} />);
    }

    // marginTop lines the rail up with the middle of the level icons (60px tall)
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                height: 10,
                marginTop: 25,
                gap: 2,
            }}
        >
            {items}
        </View>
    );
}

/* ---------------- the card ---------------- */
export function TraitTree({
                              trait,
                              spentPoints,
                              availablePoints,
                              onSpendPoint,
                              index = 0,
                          }: TraitTreeProps) {
    const [selectedLevel, setSelectedLevel] = useState<TraitLevel | null>(null);
    const totalCost = getTraitTotalCost(trait);
    const isMaxed = spentPoints >= totalCost;
    const canSpend = availablePoints > 0 && !isMaxed;
    // points needed to unlock each level
    const starts: number[] = [];
    let acc = 0;
    trait.levels.forEach((level, i) => {
        if (i > 0) acc += level.cost;
        starts.push(acc);
    });
    const nextIndex = starts.findIndex((s) => spentPoints < s);

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 120).springify().damping(14)}
            style={{ marginBottom: 20 }}
        >
            {/* gradient border */}
            <LinearGradient
                colors={
                    isMaxed
                        ? [colors.pinkLight, colors.interactionPink, colors.structurePurple]
                        : ["rgba(255,255,255,0.28)", "rgba(255,255,255,0.06)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 26, padding: 1.5 }}
            >
                <LinearGradient
                    colors={[colors.playerAccent, colors.nightMid]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 24.5, padding: 16 }}
                >
                    {/* Header */}
                    <View className="flex-row items-center">
                        <View className="flex-1">
                            <Text className="text-white text-2xl font-extrabold">
                                {trait.name}
                            </Text>
                            <Text className="text-white/65 text-sm mt-1 pr-3">
                                {trait.description}
                            </Text>
                        </View>

                        <View className="items-center gap-2">
                            <SpendButton enabled={canSpend} onPress={onSpendPoint} />
                            <View
                                style={{
                                    paddingHorizontal: 10,
                                    paddingVertical: 3,
                                    borderRadius: 999,
                                    backgroundColor: colors.glass,
                                }}
                            >
                                <Text className="text-white/80 text-xs font-bold">
                                    {spentPoints} / {totalCost}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Levels */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginTop: 6 }}
                        contentContainerStyle={{
                            paddingHorizontal: 10,
                            paddingTop: 16,
                            paddingBottom: 12,
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                            {trait.levels.map((level, i) => {
                                const next = trait.levels[i + 1];
                                return (
                                    <View
                                        key={level.id}
                                        style={{ flexDirection: "row", alignItems: "flex-start" }}
                                    >
                                        <TraitLevelNode
                                            icon={level.icon}
                                            name={level.name}
                                            unlocked={spentPoints >= starts[i]}
                                            isNext={i === nextIndex}
                                            cost={level.cost}
                                            onPress={() => setSelectedLevel(level)}
                                        />
                                        {next && (
                                            <ProgressRail
                                                startPoint={starts[i]}
                                                cost={next.cost}
                                                spentPoints={spentPoints}
                                            />
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>

                    {/* Status line */}
                    <View className="mt-4 flex-row items-center justify-between">
                        {isMaxed ? (
                            <View className="flex-row items-center gap-2">
                                <Trophy size={16} color={colors.interactionPink} />
                                <Text
                                    className="text-sm font-bold"
                                    style={{ color: colors.interactionPink }}
                                >
                                    Fully unlocked
                                </Text>
                            </View>
                        ) : canSpend ? (
                            <Text className="text-white/70 text-sm">
                                Tap + to level up {trait.name}.
                            </Text>
                        ) : (
                            <Text className="text-white/50 text-sm">
                                Earn more sips to continue.
                            </Text>
                        )}

                        {!isMaxed && (
                            <Text className="text-white/60 text-sm font-semibold">
                                {availablePoints} available
                            </Text>
                        )}
                    </View>
                </LinearGradient>
            </LinearGradient>

            <TraitDescriptionModal
                visible={selectedLevel !== null}
                title={selectedLevel?.name ?? ""}
                description={selectedLevel?.description ?? ""}
                onClose={() => setSelectedLevel(null)}
            />
        </Animated.View>
    );
}