import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import PointsDisplay from "@/components/ui/PointsDisplay";
import { TRAITS, TraitId } from "@/shared/traits/traits";
import { TraitTree } from "@/components/traits/components/TraitTree";
import Backdrop from "@/components/ui/Backdrop";
import {colors} from "@/constants/GameColors";
import UndoSipButton from "@/components/traits/components/UndoSipButton";

interface TraitsViewProps {
    myPoints: number;
    myTraitPoints: Partial<Record<TraitId, number>>;
    spendTraitPoint: (traitId: TraitId) => void;
    removePoint: () => void;
}

export default function TraitsView({
                                       myPoints,
                                       myTraitPoints,
                                       spendTraitPoint,
                                       removePoint,
                                   }: TraitsViewProps) {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1" style={{ backgroundColor: colors.night }}>
            <Backdrop warm />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: insets.top + 8,
                    paddingHorizontal: 16,
                    paddingBottom: 32,
                }}
            >
                <View className="flex-row items-center">
                    <Animated.View
                        entering={FadeInDown.springify().damping(14)}
                        className="flex-1 mr-3"
                    >
                        <Text
                            className="text-white text-4xl font-extrabold"
                            style={{
                                textShadowColor: colors.interactionPink,
                                textShadowRadius: 14,
                                textShadowOffset: { width: 0, height: 0 },
                            }}
                        >
                            Traits
                        </Text>
                        <Text className="text-white/65 text-base mt-1">
                            Spend your sips to unlock perks.
                        </Text>
                    </Animated.View>

                    <View className="items-end gap-1">
                        <PointsDisplay points={myPoints} size={130} />
                        <UndoSipButton onPress={removePoint} disabled={myPoints <= 0} />
                    </View>
                </View>

                <View className="mt-6">
                    {TRAITS.map((trait, index) => (
                        <TraitTree
                            key={trait.id}
                            index={index}
                            trait={trait}
                            spentPoints={myTraitPoints[trait.id] ?? 0}
                            availablePoints={myPoints}
                            onSpendPoint={() => spendTraitPoint(trait.id)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}