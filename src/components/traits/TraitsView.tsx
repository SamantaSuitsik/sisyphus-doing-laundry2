import {ScrollView, View} from "react-native";
import {Text} from "@/components/ui/text";
import PointsDisplay from "@/components/ui/PointsDisplay";
import {TRAITS, TraitId} from "@/shared/traits/traits";
import {TraitTree} from "@/components/traits/components/TraitTree";

interface TraitsViewProps {
    myPoints: number;
    myTraitPoints: Partial<Record<TraitId, number>>;
    spendTraitPoint: (traitId: TraitId) => void;
}

export default function TraitsView({
                                       myPoints,
                                       myTraitPoints,
                                       spendTraitPoint,
                                   }: TraitsViewProps) {
    return (
        <View className="flex-1 bg-background">
            <ScrollView
                contentContainerClassName="px-5 pt-6 pb-10"
                showsVerticalScrollIndicator={false}
            >

                <View className="items-center">
                    <Text className="text-3xl font-bold text-foreground">
                        Traits
                    </Text>

                    <Text className="mt-2 text-center text-muted-foreground">
                        Spend your points to unlock real-life perks.
                    </Text>

                    <View className="mt-5">
                        <PointsDisplay
                            points={myPoints}
                            size={120}
                        />
                    </View>

                    <Text className="mt-3 text-sm text-muted-foreground">
                        Available points
                    </Text>
                </View>

                <View className="mt-8">
                    {TRAITS.map(trait => (
                        <TraitTree
                            key={trait.id}
                            trait={trait}
                            spentPoints={
                                myTraitPoints[trait.id] ?? 0
                            }
                            availablePoints={myPoints}
                            onSpendPoint={() =>
                                spendTraitPoint(trait.id)
                            }
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}