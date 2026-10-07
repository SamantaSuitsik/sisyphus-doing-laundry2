import {useGameSocket} from "@/hooks/GameSocketContext";
import CharacterView from "@/components/character/CharacterView";
import {useState} from "react";
import {getCharacter} from "@/shared/characters/characters";

export default function Character() {
    const  { game, myPlayerId } = useGameSocket();

    const me = game?.players.find(p => p.id === myPlayerId);
    const myCharacter = getCharacter(me?.characterId);

    return <CharacterView character={myCharacter} />
}