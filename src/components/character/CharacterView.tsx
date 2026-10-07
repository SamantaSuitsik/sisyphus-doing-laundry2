// CharacterView.tsx
// Requires: npx expo install expo-linear-gradient react-native-safe-area-context
import { useEffect, useMemo, useRef, useState } from "react";
import {
    AccessibilityInfo,
    Animated,
    Easing,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {Character} from "@/shared/characters/characters";
import {characterImages} from "@/constants/CharacterImages";

interface IProps {
    character?: Character | null;
    /** Shows the bottom button. Use for the reveal at game start. */
    onContinue?: () => void;
    continueLabel?: string;
}

const BG = "#15111F";
const IMAGE_HEIGHT_RATIO = 0.6;
const EMBER_COUNT = 10;
const TOP_PADDING = 60;

/** Small glowing dots drifting upwards behind the character. */
function Embers({ color, height, width }: { color: string; height: number; width: number }) {
    const embers = useMemo(
        () =>
            Array.from({ length: EMBER_COUNT }, () => ({
                value: new Animated.Value(Math.random()),
                x: Math.random() * width,
                size: 3 + Math.random() * 5,
                duration: 4000 + Math.random() * 4000,
                drift: (Math.random() - 0.5) * 40,
            })),
        [width]
    );

    useEffect(() => {
        let cancelled = false;
        const anims: Animated.CompositeAnimation[] = [];

        AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
            if (cancelled || reduce) return;
            embers.forEach((e) => {
                const loop = Animated.loop(
                    Animated.timing(e.value, {
                        toValue: 1,
                        duration: e.duration,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                );
                // start at a random point so they don't all begin together
                e.value.setValue(Math.random());
                anims.push(loop);
                loop.start();
            });
        });

        return () => {
            cancelled = true;
            anims.forEach((a) => a.stop());
        };
    }, [embers]);

    return (
        <View
            pointerEvents="none"
            style={{ position: "absolute", left: 0, right: 0, top: 0, height }}
        >
            {embers.map((e, i) => (
                <Animated.View
                    key={i}
                    style={{
                        position: "absolute",
                        left: e.x,
                        bottom: 0,
                        width: e.size,
                        height: e.size,
                        borderRadius: e.size / 2,
                        backgroundColor: color,
                        opacity: e.value.interpolate({
                            inputRange: [0, 0.15, 0.8, 1],
                            outputRange: [0, 0.9, 0.5, 0],
                        }),
                        transform: [
                            {
                                translateY: e.value.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -height * 0.9],
                                }),
                            },
                            {
                                translateX: e.value.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, e.drift],
                                }),
                            },
                        ],
                    }}
                />
            ))}
        </View>
    );
}

export default function CharacterView({
                                          character,
                                          onContinue,
                                          continueLabel = "Enter the game",
                                      }: IProps) {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const imageAreaHeight = height * IMAGE_HEIGHT_RATIO;
    const portraitAreaHeight = imageAreaHeight + TOP_PADDING;

    const flash = useRef(new Animated.Value(0)).current;
    const reveal = useRef(new Animated.Value(0)).current;
    const textAnims = useRef([
        new Animated.Value(0), // name + title
        new Animated.Value(0), // trait
        new Animated.Value(0), // lore + button
    ]).current;
    const float = useRef(new Animated.Value(0)).current;
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    }, []);

    useEffect(() => {
        if (!character) return;

        let floatLoop: Animated.CompositeAnimation | null = null;

        flash.setValue(1);
        reveal.setValue(0);
        textAnims.forEach((a) => a.setValue(0));

        Animated.parallel([
            // quick flash, like a card being turned over
            Animated.timing(flash, {
                toValue: 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.spring(reveal, {
                    toValue: 1,
                    friction: 7,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.stagger(
                    130,
                    textAnims.map((a) =>
                        Animated.timing(a, {
                            toValue: 1,
                            duration: 380,
                            easing: Easing.out(Easing.cubic),
                            useNativeDriver: true,
                        })
                    )
                ),
            ]),
        ]).start();

        if (!reduceMotion) {
            floatLoop = Animated.loop(
                Animated.sequence([
                    Animated.timing(float, {
                        toValue: 1,
                        duration: 2600,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(float, {
                        toValue: 0,
                        duration: 2600,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ])
            );
            floatLoop.start();
        }

        return () => floatLoop?.stop();
    }, [character?.id, reduceMotion]);

    if (!character) {
        return (
            <View
                className="flex-1 items-center justify-center px-8"
                style={{ backgroundColor: BG }}
            >
                <Text className="text-white text-xl font-bold text-center">
                    No character yet
                </Text>
                <Text className="text-white/60 text-base text-center mt-2">
                    Join the game and your character will appear here.
                </Text>
            </View>
        );
    }

    const accent = character.accentColor;

    const fadeUp = (v: Animated.Value) => ({
        opacity: v,
        transform: [
            {
                translateY: v.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                }),
            },
        ],
    });

    return (
        <View className="flex-1" style={{ backgroundColor: BG }}>
            {/* Colour wash from the top, tinted by the character */}
            <LinearGradient
                colors={[accent + "66", accent + "1A", BG]}
                locations={[0, 0.25, 0.5]}
                style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: onContinue ? 40 : insets.bottom + 56,
                }}
            >
                {/* Portrait area */}
                <View
                    style={{
                        width,
                        height: portraitAreaHeight,
                        alignItems: "center",
                        justifyContent: "flex-end",
                        overflow: "hidden",
                    }}
                >
                    <Embers color={accent} height={portraitAreaHeight} width={width} />

                    <Animated.View
                        style={{
                            opacity: reveal,
                            transform: [
                                {
                                    scale: reveal.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.8, 1],
                                    }),
                                },
                                {
                                    translateY: Animated.add(
                                        reveal.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [60, 0],
                                        }),
                                        float.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -10],
                                        })
                                    ),
                                },
                            ],
                        }}
                    >
                        <Image
                            source={characterImages[character.id]}
                            // Square image as tall as the area. On narrow phones the
                            // transparent edges get cropped, which is what we want.
                            style={{ width: imageAreaHeight, height: imageAreaHeight }}
                            resizeMode="contain"
                            accessibilityLabel={`${character.name} portrait`}
                        />
                    </Animated.View>

                    {/* Fade the bottom of the portrait into the dark background */}
                    <LinearGradient
                        colors={[BG + "00", BG]}
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: imageAreaHeight * 0.3,
                        }}
                        pointerEvents="none"
                    />
                </View>

                {/* Text sits over the faded bottom of the portrait */}
                <View className="px-6" style={{ marginTop: -56 }}>
                    <Animated.View style={[{ alignItems: "center" }, fadeUp(textAnims[0])]}>
                        <Text
                            className="text-white text-4xl font-extrabold text-center"
                            style={{
                                textShadowColor: accent,
                                textShadowRadius: 16,
                                textShadowOffset: { width: 0, height: 0 },
                            }}
                        >
                            {character.name}
                        </Text>
                        <Text
                            className="text-lg italic text-center mt-1"
                            style={{ color: accent }}
                        >
                            {character.title}
                        </Text>
                    </Animated.View>

                    <Animated.View
                        className="mt-5 rounded-2xl p-4"
                        style={[
                            {
                                backgroundColor: "rgba(255,255,255,0.07)",
                                borderWidth: 1,
                                borderColor: accent + "55",
                                borderLeftWidth: 4,
                                borderLeftColor: accent,
                            },
                            fadeUp(textAnims[1]),
                        ]}
                    >
                        <View className="flex-row items-center">
                            <Text className="text-2xl mr-2">{character.traitEmoji}</Text>
                            <View className="flex-1">
                                <Text className="text-white/55 text-sm">Special trait</Text>
                                <Text className="text-white text-xl font-bold">
                                    {character.traitName}
                                </Text>
                            </View>
                        </View>
                        <Text className="text-white/85 text-base leading-6 mt-2">
                            {character.traitDescription}
                        </Text>
                    </Animated.View>

                    <Animated.Text
                        className="text-white/55 text-base leading-6 text-center mt-5"
                        style={fadeUp(textAnims[2])}
                    >
                        {character.description}
                    </Animated.Text>
                </View>
            </ScrollView>

            {onContinue && (
                <Animated.View
                    className="px-6 pt-3"
                    style={[{ paddingBottom: insets.bottom + 20 }, fadeUp(textAnims[2])]}
                >
                    <Pressable
                        onPress={onContinue}
                        accessibilityRole="button"
                        className="rounded-2xl py-4 items-center active:opacity-80 active:scale-95"
                        style={{
                            backgroundColor: accent,
                            shadowColor: accent,
                            shadowOpacity: 0.6,
                            shadowRadius: 14,
                            shadowOffset: { width: 0, height: 4 },
                            elevation: 8,
                        }}
                    >
                        <Text className="text-black text-lg font-extrabold">
                            {continueLabel}
                        </Text>
                    </Pressable>
                </Animated.View>
            )}

            {/* Reveal flash */}
            <Animated.View
                pointerEvents="none"
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: "#FFFFFF",
                    opacity: flash.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.55],
                    }),
                }}
            />
        </View>
    );
}