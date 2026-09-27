import {SafeAreaView} from "react-native-safe-area-context";
import {Image, Pressable, TextInput, View} from 'react-native';
import {useGameSocket} from "@/app/hooks/useGameSocket";
import {useState} from "react";
import {Input} from "@/app/components/ui/input";
import {Button} from "@/app/components/ui/button";
import { Text } from "react-native";

export default function Index() {
    const [name, setName] = useState<string>("");
    const { game, myPlayerId, connected, joinGame, startGame } = useGameSocket();


    function handleJoinGame() {
        if (!name.trim()) {
            return;
        }
        joinGame(name.trim());
        setName("");
    }

    return <SafeAreaView className="flex-1 justify-center items-center">
        <View className="w-8/12 flex-1 justify-center items-center gap-5">
            <View className="w-full flex gap-3">
                <Text className="text-white">Name</Text>
                <Input value={name} onChangeText={setName}/>
            </View>
            <Button onPress={handleJoinGame}>
                <Text>Join Game</Text>
            </Button>
        </View>

        <View className="flex-1">
            <Text className="text-white font-bold">Players</Text>
            {game?.players.map((p, i) =>
                <Text key={i} className="text-white mb-2">{`${i+1}. ${p.name}`}</Text>
            )}
        </View>

        { name.trim().toLowerCase()==="i want to play" && <View >
            <Button onPress={startGame}>
                <Text>Start Game</Text>
            </Button>
        </View> }
    </SafeAreaView>;
}