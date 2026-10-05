import {Pressable, View} from "react-native";
import ButtonFrameFilled from "@/assets/border2_svg.svg";

type FrameButtonProps = {
    children: React.ReactNode;
    onPress?: () => void;
    className?: string;
};

export function FramedButtonFilled({children, onPress, className = ""}: FrameButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`relative items-center justify-center ${className}`}
        >
            <ButtonFrameFilled
                width="100%"
                height="100%"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
            />

            <View className="items-center justify-center">
                {children}
            </View>
        </Pressable>
    );
}