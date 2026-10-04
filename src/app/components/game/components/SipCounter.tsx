import React, { useState } from "react";
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
import {GameButton} from "@/app/components/game/components/GameButton";

type FloatingPlusOneProps = {
    id: number;
    onFinish: (id: number) => void;
};

function FloatingPlusOne({ id, onFinish }: FloatingPlusOneProps) {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(0.6);
    const translateX = useSharedValue(0);

    React.useEffect(() => {
        translateX.value = (Math.random() - 0.5) * 30;

        // Start the animation
        scale.value = withSequence(
            withSpring(1.1, {
                damping: 10,
                stiffness: 250,
            }),
            withTiming(0.9, {
                duration: 450,
            })
        );

        translateY.value = withTiming(
            -120,
            {
                duration: 1200,
            },
            (finished) => {
                if (finished) {
                    runOnJS(onFinish)(id);
                }
            }
        );

        opacity.value = withSequence(
            withTiming(1, {duration: 150}),
            withDelay(
                650,
                withTiming(0, {
                    duration: 400,
                })
            )
        );
    }, [id, onFinish]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            {
                translateX: translateX.value,
            },
            {
                translateY: translateY.value,
            },
            {
                scale: scale.value,
            },
        ],
    }));

    return (
        <Animated.Text
            style={animatedStyle}
            className="absolute bottom-full mb-2 text-2xl font-bold text-interaction-pink"
        >
            +1
        </Animated.Text>
    );
}
interface ICounterProps {
    className?: string,
    onPress?: () => void,
}
export default function Counter({className = "", ...props}: ICounterProps) {
    const [count, setCount] = useState(0);
    const [animations, setAnimations] = useState<number[]>([]);
    const [nextId, setNextId] = useState(0);

    const handlePress = () => {
        setCount((current) => current + 1);

        const id = nextId;

        setNextId((current) => current + 1);
        setAnimations((current) => [...current, id]);
        if (props?.onPress) {
            props?.onPress();
        }
    };

    const removeAnimation = (id: number) => {
        setAnimations((current) =>
            current.filter((animationId) => animationId !== id)
        );
    };

    return <View
        className={`relative flex-1 ${className}`}>
        <View
            pointerEvents="none"
            className="absolute inset-0 z-10 items-center justify-end" >
            {animations.map((id) => (
                <FloatingPlusOne
                    key={id}
                    id={id}
                    onFinish={removeAnimation} />
                )
            )}
        </View>
        <GameButton label="Sip taken" onPress={handlePress} />
    </View>;
}