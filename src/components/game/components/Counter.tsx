import React, { useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import {OutlineButton} from "@/components/ui/FrameButton";
import {colors} from "@/constants/GameColors";
import {PinkButton} from "@/components/ui/PinkButton";

type FloatingPlusOneProps = {
    id: number;
    onFinish: (id: number) => void;
};

function FloatingPlusOne({ id, onFinish }: FloatingPlusOneProps) {
    const translateY = useSharedValue(0);
    const translateX = useSharedValue((Math.random() - 0.5) * 40);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(0.6);

    React.useEffect(() => {
        scale.value = withSequence(
            withSpring(1.2, { damping: 10, stiffness: 250 }),
            withTiming(0.9, { duration: 450 })
        );

        translateY.value = withTiming(-130, { duration: 1200 }, (finished) => {
            if (finished) runOnJS(onFinish)(id);
        });

        opacity.value = withSequence(
            withTiming(1, { duration: 150 }),
            withDelay(650, withTiming(0, { duration: 400 }))
        );
    }, [id, onFinish]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    return (
        <Animated.Text
            style={[
                animatedStyle,
                {
                    position: "absolute",
                    bottom: "100%",
                    marginBottom: 8,
                    fontSize: 28,
                    fontWeight: "800",
                    color: colors.interactionPink,
                    textShadowColor: colors.interactionPink,
                    textShadowRadius: 10,
                    textShadowOffset: { width: 0, height: 0 },
                },
            ]}
        >
            +1
        </Animated.Text>
    );
}

interface ICounterProps {
    className?: string;
    onPress?: () => void;
}

export default function Counter({ className = "", onPress }: ICounterProps) {
    const [animations, setAnimations] = useState<number[]>([]);
    const nextId = useRef(0);

    const handlePress = () => {
        const id = nextId.current++;
        setAnimations((current) => [...current, id]);
        onPress?.();
    };

    const removeAnimation = React.useCallback((id: number) => {
        setAnimations((current) => current.filter((a) => a !== id));
    }, []);

    return (
        <View className={`relative flex-1 ${className}`}>
            <View
                pointerEvents="none"
                className="absolute inset-0 z-10 items-center justify-end"
            >
                {animations.map((id) => (
                    <FloatingPlusOne key={id} id={id} onFinish={removeAnimation} />
                ))}
            </View>
            <PinkButton title="Sip" onPress={handlePress} />
        </View>
    );
}