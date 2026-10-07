import "../../global.css"
import {DarkTheme, router, Stack, ThemeProvider} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {useFonts} from "@expo-google-fonts/syne-tactile";
import {SyneTactile_400Regular} from "@expo-google-fonts/syne-tactile/400Regular";
import {useState} from "react";
import {GameSocketProvider, useGameSocket} from "@/hooks/GameSocketContext";
import {getCharacter} from "@/shared/characters/characters";
import CharacterView from "@/components/character/CharacterView";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        SyneTactile: SyneTactile_400Regular
    })

    return <GameSocketProvider>
        <ThemeProvider value={DarkTheme}>
            <SafeAreaProvider>
                <Stack
                    screenOptions={{

                        headerShown: false
                    }}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </SafeAreaProvider>
        </ThemeProvider>
    </GameSocketProvider>;
}
