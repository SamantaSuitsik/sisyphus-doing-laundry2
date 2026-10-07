import { NativeTabs } from 'expo-router/unstable-native-tabs';
import {GameSocketProvider, useGameSocket} from "@/hooks/GameSocketContext";
import {useState} from "react";
import {getCharacter} from "@/shared/characters/characters";
import CharacterView from "@/components/character/CharacterView";
import {router} from "expo-router";
import {UserStar} from "lucide-react-native";

export default function TabLayout() {
    const [characterSeen, setCharacterSeen] = useState(false);
    const  { game, myPlayerId } = useGameSocket();

    const me = game?.players.find(p => p.id === myPlayerId);
    const myCharacter = getCharacter(me?.characterId);

    // Reveal screen when the game starts
    if (game?.status === "playing" && !characterSeen) {
        return (
            <CharacterView
                character={myCharacter}
                onContinue={() => {
                    setCharacterSeen(true);
                    router.navigate("/");
                }}
            />
        );
    }

    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Icon sf="suit.spade.fill" md="playing_cards" />
                <NativeTabs.Trigger.Label>Game</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="character">
                <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
                <NativeTabs.Trigger.Label>You</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="traits">
                <NativeTabs.Trigger.Icon sf="star.fill" md="stars" />
                <NativeTabs.Trigger.Label>Traits</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
