import "../../global.css"
import {DarkTheme, Stack, ThemeProvider} from "expo-router";
import {useTheme} from "@/app/hooks/use-theme";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {colorScheme} from "nativewind";
import {useFonts} from "@expo-google-fonts/syne-tactile";
import {SyneTactile_400Regular} from "@expo-google-fonts/syne-tactile/400Regular";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        SyneTactile: SyneTactile_400Regular
    })
    return <ThemeProvider value={DarkTheme}>
        <SafeAreaProvider>
            <Stack
                screenOptions={{

                    headerShown: false
                }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </SafeAreaProvider>
    </ThemeProvider>;
}
