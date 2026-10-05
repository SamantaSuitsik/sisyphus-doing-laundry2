import {View} from "react-native";
import {Text} from "@/components/ui/text";
import BorderFilled from "@/assets/border_filled.svg";

interface PointsDisplayProps {
    points: number;
    size?: number;
}

export default function PointsDisplay({
                                          points,
                                          size = 80,
                                      }: PointsDisplayProps) {
    return (
        <View
            className="items-center justify-center"
            style={{
                width: size,
                height: size,
            }}
        >
            <BorderFilled
                width="100%"
                height="100%"
                style={{
                    position: "absolute",
                }}
            />

            <Text className="text-4xl font-bold">
                {points}
            </Text>
        </View>
    );
}