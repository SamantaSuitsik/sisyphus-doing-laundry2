import { NativeTabs } from 'expo-router/unstable-native-tabs';
import {GameSocketProvider} from "@/app/hooks/GameSocketContext";

export default function TabLayout() {
    return (
        <GameSocketProvider>
            <NativeTabs>
                <NativeTabs.Trigger name="index">
                    <NativeTabs.Trigger.Icon sf="key.card" md="cards" />
                    <NativeTabs.Trigger.Label>Game</NativeTabs.Trigger.Label>
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="traits">
                    <NativeTabs.Trigger.Icon sf="gear" md="settings" />
                    <NativeTabs.Trigger.Label>Traits</NativeTabs.Trigger.Label>
                </NativeTabs.Trigger>
            </NativeTabs>
        </GameSocketProvider>
    );
}
