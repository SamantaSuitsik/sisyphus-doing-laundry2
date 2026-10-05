import { Pressable, ScrollView, View } from "react-native";
import { Plus } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import {TraitDefinition, TraitIconName} from "@/shared/traits/traits";
import {getTraitTotalCost} from "@/shared/traits/utils";
import {TraitLevelNode} from "@/components/traits/components/TraitLevelNode";

interface TraitTreeProps {
    trait: TraitDefinition;
    spentPoints: number;
    availablePoints: number;
    onSpendPoint: () => void;
}

export function TraitTree({
                              trait,
                              spentPoints,
                              availablePoints,
                              onSpendPoint,
                          }: TraitTreeProps) {
    const totalCost = getTraitTotalCost(trait);
    const isMaxed = spentPoints >= totalCost;

    let accumulatedCost = 0;

    return (
        <View className="mb-5 rounded-[26px] border border-border bg-card px-4 py-4">
            {/* Header */}
            <View className="flex-row items-center">
                <View className="flex-1">
                    <Text className="text-xl font-bold text-foreground">
                        {trait.name}
                    </Text>

                    <Text className="mt-1 pr-3 text-xs text-muted-foreground">
                        {trait.description}
                    </Text>
                </View>

                <View className="ml-3 items-center">
                    <View className="flex-row items-center gap-2">
                        <View className="rounded-full bg-background px-3 py-1.5">
                            <Text className="text-xs font-semibold text-muted-foreground">
                                {spentPoints} / {totalCost}
                            </Text>
                        </View>

                        <Pressable
                            disabled={
                                availablePoints <= 0 ||
                                isMaxed
                            }
                            onPress={onSpendPoint}
                            className={[
                                "h-11 w-11 items-center justify-center rounded-full",
                                availablePoints > 0 && !isMaxed
                                    ? "bg-character-blue active:opacity-70"
                                    : "bg-muted",
                            ].join(" ")}
                        >
                            <Plus
                                size={23}
                                strokeWidth={2.5}
                                color={
                                    availablePoints > 0 && !isMaxed
                                        ? "#FFFFFF"
                                        : "#777777"
                                }
                            />
                        </Pressable>
                    </View>

                    {/*<Text*/}
                    {/*    className={[*/}
                    {/*        "mt-1 text-[9px] font-semibold",*/}
                    {/*        availablePoints > 0 && !isMaxed*/}
                    {/*            ? "text-character-blue"*/}
                    {/*            : "text-muted-foreground",*/}
                    {/*    ].join(" ")}*/}
                    {/*>*/}
                    {/*    {isMaxed ? "MAX" : "SPEND 1"}*/}
                    {/*</Text>*/}
                </View>
            </View>

            {/* Progress tree */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-5"
                contentContainerClassName="items-center px-1"
            >
                <View className="flex-row items-center">
                    {trait.levels.map((level, levelIndex) => {
                        const levelStart = accumulatedCost;

                        const isUnlocked =
                            spentPoints >= levelStart;

                        const nextLevel =
                            trait.levels[levelIndex + 1];

                        if (nextLevel) {
                            accumulatedCost += nextLevel.cost;
                        }

                        return (
                            <View
                                key={level.id}
                                className="flex-row items-center"
                            >
                                <TraitLevelNode
                                    icon={level.icon}
                                    name={level.name}
                                    unlocked={isUnlocked}
                                />

                                {nextLevel && (
                                    <ProgressRail
                                        startPoint={levelStart}
                                        cost={nextLevel.cost}
                                        spentPoints={spentPoints}
                                    />
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Progress information */}
            <View className="mt-4 flex-row items-center justify-between">
                {isMaxed ? (
                    <Text className="text-xs font-semibold text-character-blue">
                        Trait fully unlocked
                    </Text>
                ) : availablePoints > 0 ? (
                    <Text className="text-xs text-muted-foreground">
                        Spend a point to progress {trait.name}.
                    </Text>
                ) : (
                    <Text className="text-xs text-muted-foreground">
                        Earn more points to continue.
                    </Text>
                )}

                {!isMaxed && (
                    <Text className="text-xs font-semibold text-muted-foreground">
                        {availablePoints} available
                    </Text>
                )}
            </View>
        </View>
    );
}

interface ProgressRailProps {
    startPoint: number;
    cost: number;
    spentPoints: number;
}

function ProgressRail({
                          startPoint,
                          cost,
                          spentPoints,
                      }: ProgressRailProps) {
    return (
        <View className="flex-row items-center px-1">
            {/* Line from level circle to first dot */}
            <View
                className={[
                    "h-[2px] w-2",
                    spentPoints >= startPoint + 1
                        ? "bg-character-blue"
                        : "bg-border",
                ].join(" ")}
            />

            {Array.from({ length: cost-1 }).map((_, index) => {
                const pointNumber =
                    startPoint + index + 1;

                const complete =
                    spentPoints >= pointNumber;

                const isLast =
                    index === cost - 1;

                const nextPointComplete =
                    spentPoints >= pointNumber + 1;

                return (
                    <View
                        key={index}
                        className="flex-row items-center"
                    >
                        {/* Dot */}
                        <View
                            className={[
                                "h-[9px] w-[9px] rounded-full",
                                complete
                                    ? "bg-character-blue"
                                    : "border border-border bg-background",
                            ].join(" ")}
                        />

                        {/* Line to next dot / level */}
                        {!isLast && (
                            <View
                                className={[
                                    "h-[2px] w-3",
                                    nextPointComplete
                                        ? "bg-character-blue"
                                        : "bg-border",
                                ].join(" ")}
                            />
                        )}

                        {/* Final connector toward next big circle */}
                        {isLast && (
                            <View
                                className={[
                                    "h-[2px] w-2",
                                    complete
                                        ? "bg-character-blue"
                                        : "bg-border",
                                ].join(" ")}
                            />
                        )}
                    </View>
                );
            })}
        </View>
    );
}