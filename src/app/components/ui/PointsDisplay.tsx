import EmptyBorder from "@/assets/border_empty.svg"
import {View, Text} from "react-native";
interface IProps {
    value: number;
}

export default function PointsDisplay(props: IProps) {
    return <View className="relative">
        <EmptyBorder
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
            }}>
        </EmptyBorder>
        <View className="flex-1 items-center justify-center">
            <Text>{props.value}</Text>
        </View>
    </View>
}