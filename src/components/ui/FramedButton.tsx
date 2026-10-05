import { Pressable, View } from "react-native";
import ButtonFrame from "@/assets/border2_svg.svg";

type ButtonFramedProps = {
    children: React.ReactNode;
    onPress?: () => void;
    className?: string;
};

export function FramedButton({ children, onPress, className = ""}: ButtonFramedProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`relative items-center justify-center ${className}`}
        >
            <ButtonFrame
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
            />

            <View className="items-center justify-center py-4">
                {children}
            </View>
        </Pressable>
    );
}