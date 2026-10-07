import { useEffect, useRef, useState } from "react";
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
    Easing,
    FadeInDown,
    FadeOutDown,
    interpolate,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming,
} from "react-native-reanimated";

import { GameState } from "@/shared/types";
import { colors } from "@/constants/GameColors";
import {cardImages} from "@/constants/CardImages";
import {Character, getCharacter} from "@/shared/characters/characters";
import PointsDisplay from "@/components/ui/PointsDisplay";
import Counter from "@/components/game/components/Counter";
import {OutlineButton} from "@/components/ui/FrameButton";
import {ChoosePlayerModal} from "@/components/game/components/Modal";
import {characterFaces} from "@/constants/CharacterImages";
import Backdrop from "@/components/ui/Backdrop";
import {PinkButton} from "@/components/ui/PinkButton"; // adjust path

type Player = GameState["players"][number];

// The card may be wider than the screen by this much if there is vertical room
// (transparent edges of the image just get clipped).
const MAX_CARD_WIDTH_RATIO = 1.15;

interface IProps {
    game: GameState | null;
    nextTurn: () => void;
    myPlayerId: string | null;
    myPoints: number;
    earnPoint: () => void;
    onChoosePlayer: (playerId: string) => void;
}

/* Row of players, current one lights up                                */
function PlayerChip({
                        player,
                        isCurrent,
                        onLayoutX,
                    }: {
    player: Player;
    isCurrent: boolean;
    onLayoutX: (x: number) => void;
}) {
    const scale = useSharedValue(isCurrent ? 1.08 : 1);

    useEffect(() => {
        scale.value = withSpring(isCurrent ? 1.08 : 1, { damping: 12, stiffness: 180 });
    }, [isCurrent]);

    const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        <Animated.View style={style} onLayout={(e) => onLayoutX(e.nativeEvent.layout.x)}>
            <LinearGradient
                colors={
                    isCurrent
                        ? [colors.pinkLight, colors.interactionPink]
                        : [colors.glass, colors.glass]
                }
                style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: isCurrent ? "transparent" : colors.glassBorder,
                }}
            >
                <Text
                    className="text-sm font-bold"
                    style={{ color: isCurrent ? colors.textOnPink : "rgba(255,255,255,0.75)" }}
                    numberOfLines={1}
                >
                    {player.name}
                </Text>
            </LinearGradient>
        </Animated.View>
    );
}

function TurnStrip({
                       players,
                       currentPlayerId,
                   }: {
    players: Player[];
    currentPlayerId?: string | null;
}) {
    const scrollRef = useRef<ScrollView>(null);
    const positions = useRef<Record<string, number>>({});

    useEffect(() => {
        if (!currentPlayerId) return;
        const x = positions.current[currentPlayerId];
        if (x === undefined) return;
        scrollRef.current?.scrollTo({ x: Math.max(0, x - 24), animated: true });
    }, [currentPlayerId]);

    return (
        <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ gap: 8, paddingVertical: 6, paddingHorizontal: 16 }}
        >
            {players.map((p) => (
                <PlayerChip
                    key={p.id}
                    player={p}
                    isCurrent={p.id === currentPlayerId}
                    onLayoutX={(x) => (positions.current[p.id] = x)}
                />
            ))}
        </ScrollView>
    );
}

/* The card: flips in whenever a new card is drawn, floats gently       */
function CardStage({
                       source,
                       cardKey,
                       size,
                       isMyTurn,
                   }: {
    source?: any;
    cardKey?: string;
    size: number;
    isMyTurn: boolean;
}) {
    const reduceMotion = useReducedMotion();
    const enter = useSharedValue(0);
    const float = useSharedValue(0);

    useEffect(() => {
        enter.value = 0;
        enter.value = withSpring(1, { damping: 12, stiffness: 80 });
    }, [cardKey]);

    useEffect(() => {
        if (reduceMotion) return;
        float.value = withRepeat(
            withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
        );
    }, [reduceMotion]);

    const cardStyle = useAnimatedStyle(() => ({
        opacity: interpolate(enter.value, [0, 0.35, 1], [0, 1, 1]),
        transform: [
            { perspective: 900 },
            {
                translateY:
                    interpolate(enter.value, [0, 1], [70, 0]) +
                    interpolate(float.value, [0, 1], [0, -6]),
            },
            { rotateY: `${interpolate(enter.value, [0, 1], [-75, 0])}deg` },
            { scale: interpolate(enter.value, [0, 1], [0.8, 1]) },
        ],
    }));

    const shadowStyle = useAnimatedStyle(() => ({
        opacity: interpolate(float.value, [0, 1], [0.35, 0.2]),
        transform: [{ scaleX: interpolate(float.value, [0, 1], [1, 0.85]) }],
    }));

    const glowColor = isMyTurn ? colors.interactionPink : colors.playerBlue;

    return (
        <View style={{ alignItems: "center" }}>
            <Animated.View
                style={[
                    {
                        width: size,
                        height: size,
                        shadowColor: glowColor,
                        shadowOpacity: 0.7,
                        shadowRadius: 28,
                        shadowOffset: { width: 0, height: 0 },
                    },
                    cardStyle,
                ]}
            >
                {source ? (
                    <Image
                        source={source}
                        style={{ width: size, height: size }}
                        resizeMode="contain"
                    />
                ) : (
                    <LinearGradient
                        colors={[colors.structurePurple, colors.playerAccent]}
                        style={{
                            width: size * 0.7,
                            height: size,
                            alignSelf: "center",
                            borderRadius: 24,
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 2,
                            borderColor: colors.glassBorder,
                        }}
                    >
                        <Text className="text-white/80 text-lg font-bold">Drawing a card…</Text>
                    </LinearGradient>
                )}
            </Animated.View>

            <Animated.View
                style={[
                    {
                        width: size * 0.5,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "#000",
                        marginTop: 4,
                    },
                    shadowStyle,
                ]}
            />
        </View>
    );
}

/* ------------------------------------------------------------------ */
/* Character box: face on the left, trait on the right                  */
/* ------------------------------------------------------------------ */
function CharacterBox({ character }: { character?: Character }) {
    if (!character) return null;

    return (
        <Animated.View entering={FadeInDown.delay(200).springify()} className="px-4 mt-3">
            <LinearGradient
                colors={[character.accentColor + "40", colors.glass]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: character.accentColor + "77",
                }}
            >
                <View
                    style={{
                        width: 76,
                        height: 76,
                        borderRadius: 16,
                        overflow: "hidden",
                        backgroundColor: character.accentColor + "33",
                        borderWidth: 1,
                        borderColor: character.accentColor + "88",
                    }}
                >
                    <Image
                        source={characterFaces[character.id]}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                    />
                </View>

                <View className="flex-1 ml-3">
                    <Text className="text-white text-lg font-extrabold" numberOfLines={1}>
                        {character.name}
                    </Text>
                    <Text
                        className="text-sm font-bold mt-0.5"
                        style={{ color: character.accentColor }}
                        numberOfLines={1}
                    >
                        {character.traitEmoji} {character.traitName}
                    </Text>
                    <Text className="text-white/75 text-sm leading-5 mt-1" numberOfLines={3}>
                        {character.traitDescription}
                    </Text>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

/* ------------------------------------------------------------------ */
/* Main view                                                            */
/* ------------------------------------------------------------------ */
export default function GameView({
                                     game,
                                     nextTurn,
                                     myPlayerId,
                                     myPoints,
                                     earnPoint,
                                     onChoosePlayer,
                                 }: IProps) {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const [stageHeight, setStageHeight] = useState(0);
    const [showChoosePlayerModal, setShowChoosePlayerModal] = useState(false);

    const currentPlayer = game?.players.find((p) => p.id === game.currentPlayerId);
    const isMyTurn = !!currentPlayer && currentPlayer.id === myPlayerId;

    const cardImage = game?.currentCard ? cardImages[game.currentCard.name] : undefined;

    const needsToChoosePlayer =
        game?.pendingAction?.type === "swapSeats" &&
        game.pendingAction.playerId === myPlayerId;

    const me = game?.players.find((p) => p.id === myPlayerId);
    const otherPlayers = (game?.players ?? []).filter((p) => p.id !== myPlayerId);
    const myCharacter = getCharacter(me?.characterId);

    // The stage takes ALL space left between the strip and the character box,
    // and the card fills it. That's why there is no empty gap anymore.
    const cardSize = Math.max(
        180,
        Math.min(stageHeight - 20, width * MAX_CARD_WIDTH_RATIO)
    );

    function handleChoosePlayer(id: string) {
        onChoosePlayer(id);
        setShowChoosePlayerModal(false);
    }

    return (
        <View className="flex-1" style={{ backgroundColor: colors.night }}>
            <Backdrop warm={isMyTurn} />

            {/* Top row: whose turn (left), my sips (right) */}
            <View
                className="flex-row items-center px-4"
                style={{ paddingTop: insets.top + (Platform.OS === "ios" ? 0 : 8) }}
            >
                <Animated.View
                    key={currentPlayer?.id ?? "none"}
                    entering={FadeInDown.springify().damping(14)}
                    className="flex-1 mr-3"
                >
                    <Text
                        className="text-white text-3xl font-extrabold"
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={{
                            textShadowColor: isMyTurn ? colors.interactionPink : colors.playerBlue,
                            textShadowRadius: 14,
                            textShadowOffset: { width: 0, height: 0 },
                        }}
                    >
                        {isMyTurn ? "Your turn" : `${currentPlayer?.name ?? "…"}'s turn`}
                    </Text>
                    <Text className="text-white/65 text-sm mt-0.5" numberOfLines={2}>
                        {isMyTurn
                            ? "Do what the card says, if you need to drink press 'Sip'"
                            : `${currentPlayer?.name ?? "the next player"}'s turn.`}
                    </Text>
                </Animated.View>

                <PointsDisplay points={myPoints} size={130} />
            </View>

            {otherPlayers.length > 0 && (
                <TurnStrip
                    players={otherPlayers}
                    currentPlayerId={game?.currentPlayerId}
                />
            )}

            {/* Card stage: takes all remaining space */}
            <View
                className="flex-1 items-center justify-center"
                onLayout={(e) => setStageHeight(e.nativeEvent.layout.height)}
            >
                {stageHeight > 0 && (
                    <CardStage
                        source={cardImage}
                        cardKey={game?.currentCard?.id}
                        size={cardSize}
                        isMyTurn={isMyTurn}
                    />
                )}
            </View>

            <CharacterBox character={myCharacter} />

            {/* Actions */}
            <View className="px-4 mt-3" style={{ paddingBottom: insets.bottom + 12 }}>
                {needsToChoosePlayer && (
                    <Animated.View
                        entering={FadeInDown.springify()}
                        exiting={FadeOutDown}
                        className="mb-3"
                    >
                        <Pressable
                            onPress={() => setShowChoosePlayerModal(true)}
                            accessibilityRole="button"
                            accessibilityLabel="Choose a player to swap seats with"
                        >
                            <LinearGradient
                                colors={[colors.structurePurple, colors.interactionPink]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={{
                                    paddingVertical: 16,
                                    borderRadius: 18,
                                    alignItems: "center",
                                }}
                            >
                                <Text className="text-white text-lg font-extrabold">
                                    Choose who to swap with
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>
                )}

                <View className="flex-row gap-3">
                    <Counter onPress={earnPoint} />
                    <View className="flex-1">
                        <PinkButton
                            title="Next"
                            onPress={nextTurn}
                            disabled={!isMyTurn}
                        />
                    </View>
                </View>
            </View>

            <ChoosePlayerModal
                show={showChoosePlayerModal}
                onModalClosed={() => setShowChoosePlayerModal(false)}
                players={game?.players ?? []}
                onPlayerChosen={handleChoosePlayer}
            />
        </View>
    );
}