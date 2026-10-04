import { Pressable, ScrollView, View } from "react-native";
import { Plus } from "lucide-react-native";

import { Text } from "@/app/components/ui/text";
import {traitIcons} from "@/app/components/traits/constants/TraitIcons";
import {getTraitTotalCost} from "@/shared/traits/utils";
import {TraitDefinition} from "@/shared/traits/traits";

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
        <View className="mb-5 rounded-[28px] border border-border bg-card px-4 py-5">

            {/* Header */}
            <View className="flex-row items-center">
                <View className="flex-1">
                    <Text className="text-xl font-bold text-foreground">
                        {trait.name}
                    </Text>

                    <Text className="mt-1 pr-4 text-sm text-muted-foreground">
                        {trait.description}
                    </Text>
                </View>

                <View className="rounded-full bg-background px-3 py-1.5">
                    <Text className="text-xs font-semibold text-muted-foreground">
                        {spentPoints} / {totalCost}
                    </Text>
                </View>
            </View>

            {/* Tree */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="items-center"
                className="mt-7"
            >
                <View className="flex-row items-center">

                    {trait.levels.map((level, levelIndex) => {
                        const levelStart = accumulatedCost;

                        const isUnlocked =
                            spentPoints >= levelStart;

                        const Icon = traitIcons[level.icon];

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
                                {/* Big level node */}
                                <View className="items-center">
                                    <View
                                        className={[
                                            "h-[52px] w-[52px] items-center justify-center rounded-full border-2",
                                            isUnlocked
                                                ? "border-character-blue bg-character-blue"
                                                : "border-border bg-background",
                                        ].join(" ")}
                                    >
                                        <Icon
                                            size={23}
                                            strokeWidth={2.2}
                                            color={
                                                isUnlocked
                                                    ? "#FFFFFF"
                                                    : "#888888"
                                            }
                                        />
                                    </View>

                                    <Text
                                        className={[
                                            "mt-2 text-xs font-semibold",
                                            isUnlocked
                                                ? "text-foreground"
                                                : "text-muted-foreground",
                                        ].join(" ")}
                                    >
                                        {level.name}
                                    </Text>
                                </View>

                                {/* Small progress dots */}
                                {nextLevel && (
                                    <View className="mx-2 flex-row items-center">
                                        {Array.from({
                                            length: nextLevel.cost,
                                        }).map((_, index) => {
                                            const pointNumber =
                                                levelStart +
                                                index +
                                                1;

                                            const complete =
                                                spentPoints >=
                                                pointNumber;

                                            return (
                                                <View
                                                    key={`${level.id}-${index}`}
                                                    className="flex-row items-center"
                                                >
                                                    {/* Connection line */}
                                                    {index > 0 && (
                                                        <View
                                                            className={[
                                                                "h-[2px] w-4",
                                                                complete
                                                                    ? "bg-character-blue"
                                                                    : "bg-border",
                                                            ].join(" ")}
                                                        />
                                                    )}

                                                    {/* Dot */}
                                                    <View
                                                        className={[
                                                            "h-3 w-3 rounded-full",
                                                            complete
                                                                ? "bg-character-blue"
                                                                : "border border-border bg-background",
                                                        ].join(" ")}
                                                    />
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                        );
                    })}

                    {/* Spend button */}
                    <View className="ml-4 items-center">
                        <Pressable
                            disabled={
                                availablePoints <= 0 ||
                                isMaxed
                            }
                            onPress={onSpendPoint}
                            className={[
                                "h-12 w-12 items-center justify-center rounded-full",
                                availablePoints > 0 && !isMaxed
                                    ? "bg-character-blue active:opacity-70"
                                    : "bg-muted",
                            ].join(" ")}
                        >
                            <Plus
                                size={24}
                                strokeWidth={2.5}
                                color={
                                    availablePoints > 0 &&
                                    !isMaxed
                                        ? "#FFFFFF"
                                        : "#777777"
                                }
                            />
                        </Pressable>

                        <Text
                            className={[
                                "mt-2 text-[10px] font-semibold",
                                availablePoints > 0 &&
                                !isMaxed
                                    ? "text-character-blue"
                                    : "text-muted-foreground",
                            ].join(" ")}
                        >
                            {isMaxed
                                ? "MAX"
                                : "SPEND 1"}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View className="mt-5">
                {isMaxed ? (
                    <Text className="text-sm font-semibold text-character-blue">
                        Trait fully unlocked
                    </Text>
                ) : availablePoints > 0 ? (
                    <Text className="text-sm text-muted-foreground">
                        Spend a point to progress {trait.name}.
                    </Text>
                ) : (
                    <Text className="text-sm text-muted-foreground">
                        Earn more points to continue progressing.
                    </Text>
                )}
            </View>
        </View>
    );
}