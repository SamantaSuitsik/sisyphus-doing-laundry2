import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getPlayerId() {
    let id = await AsyncStorage.getItem("playerId");
    if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        await AsyncStorage.setItem("playerId", id);
    }
    return id;
}