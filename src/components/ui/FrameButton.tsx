import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { SvgProps } from "react-native-svg";
import BorderFilled from "@/assets/border_filled.svg";
import Border2 from "@/assets/border2_svg.svg";

export const FRAME_RATIO = 1500 / 690;

interface IProps {
    label: string;
    onPress?: () => void;
    disabled?: boolean;
    /**
     * Width / height of the button. Lower = taller.
     * If it differs from the frame's own ratio (about 2.17) the frame is
     * stretched, so check that the corners still look right.
     */
    aspectRatio?: number;
}

interface IBaseProps extends IProps {
    Frame: React.ComponentType<SvgProps>;
    /** Space kept free on the left and right of the label (share of the width). */
    labelInset?: `${number}%`;
}

function FrameButtonBase({
                             Frame,
                             label,
                             onPress,
                             disabled = false,
                             aspectRatio = FRAME_RATIO,
                             labelInset = "10%",
                         }: IBaseProps) {
    const press = useSharedValue(1);

    const bodyStyle = useAnimatedStyle(() => ({
        transform: [{ scale: press.value }],
    }));

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            onPressIn={() => {
                press.value = withSpring(0.94, { damping: 15, stiffness: 300 });
            }}
            onPressOut={() => {
                press.value = withSpring(1, { damping: 8, stiffness: 250 });
            }}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
            style={{ width: "100%", aspectRatio, opacity: disabled ? 0.4 : 1 }}
        >
            <Animated.View style={[StyleSheet.absoluteFill, bodyStyle]}>
                <Frame
                    width="100%"
                    height="100%"
                    preserveAspectRatio={aspectRatio === FRAME_RATIO ? "xMidYMid meet" : "none"}
                    style={StyleSheet.absoluteFill}
                />
                <View
                    style={{
                        ...StyleSheet.absoluteFill,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: labelInset,
                    }}
                >
                    {/* shrinks automatically if the label doesn't fit the frame */}
                    <Text
                        className="text-xl font-extrabold text-foreground"
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.6}
                    >
                        {label}
                    </Text>
                </View>
            </Animated.View>
        </Pressable>
    );
}

export function FilledButton(props: IProps) {
    return <FrameButtonBase Frame={BorderFilled} {...props} />;
}

// Tuning knobs for the outline button:
//  - lower OUTLINE_ASPECT_RATIO = taller button (the frame gets stretched)
//  - higher OUTLINE_LABEL_INSET = more empty space between the label and the border
const OUTLINE_ASPECT_RATIO = 1.5;
const OUTLINE_LABEL_INSET = "22%" as const;

export function OutlineButton({ aspectRatio = OUTLINE_ASPECT_RATIO, ...props }: IProps) {
    return (
        <FrameButtonBase
            Frame={Border2}
            aspectRatio={aspectRatio}
            labelInset={OUTLINE_LABEL_INSET}
            {...props}
        />
    );
}