import {SafeAreaView} from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

export default function GameOverView() {
    return <SafeAreaView>
        <Text variant="h1" className="text-interaction-pink">Game over</Text>;
    </SafeAreaView>
}