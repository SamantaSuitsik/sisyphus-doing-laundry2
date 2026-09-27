import React, { useState } from "react";
import {
    Button,
    View,
} from "react-native";
import { Text } from "../components/ui/text"

import { useGameSocket } from "../hooks/useGameSocket";

export default function Traits() {
    return null;
    // const {
    //     game,
    //     myPlayerId,
    //     connected,
    //     joinGame,
    // } = useGameSocket();
    //
    // const [name, setName] = useState("William");
    //
    // return (
    //     <View>
    //         <Text>
    //             Server: {connected ? "Connected" : "Disconnected"}
    //         </Text>
    //
    //         {!game && (
    //             <Button
    //                 title={`Join as ${name}`}
    //                 onPress={() => joinGame(name)}
    //                 disabled={!connected}
    //             />
    //         )}
    //
    //         <Text>Players</Text>
    //
    //         {game?.players.map((player) => (
    //             <View key={player.id}>
    //                 <Text>
    //                     {player.name}
    //                     {player.id === myPlayerId ? " (You)" : ""}
    //                 </Text>
    //
    //                 <Text>
    //                     {player.connected
    //                         ? "Connected"
    //                         : "Disconnected"}
    //                 </Text>
    //
    //                 <Text>
    //                     {player.points} points
    //                 </Text>
    //             </View>
    //         ))}
    //     </View>
    // );
}