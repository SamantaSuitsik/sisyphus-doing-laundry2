// characterImages.ts  (client / app only)
import { ImageSourcePropType } from "react-native";
import {CharacterId} from "@/shared/characters/characters";

// Record<CharacterId, ...> makes TypeScript complain if you add a character
// and forget its image, same idea as your cardImages map.
//
// Tip: use square PNGs with transparent backgrounds (about 1024x1024).
export const characterImages: Record<CharacterId, ImageSourcePropType> = {
    baller: require("@/assets/characters/baller_ok.png"),
    cocktailspecialist: require("@/assets/characters/cocktailspecialist_ok.png"),
    comrade: require("@/assets/characters/comrade.png"),
    dj: require("@/assets/characters/dj_ok.png"),
    gymlover: require("@/assets/characters/gymlover_ok.png"),
    strategist: require("@/assets/characters/strategist_ok.png"),
    thief: require("@/assets/characters/thief_ok.png"),
};

export const characterFaces: Record<CharacterId, ImageSourcePropType> = {
    baller: require("@/assets/characters/faces/icon_baller.png"),
    cocktailspecialist: require("@/assets/characters/faces/icon_coctailspecialist.png"),
    comrade: require("@/assets/characters/faces/icon_comrade.png"),
    dj: require("@/assets/characters/faces/icon_DJ.png"),
    gymlover: require("@/assets/characters/faces/icon_gymlover.png"),
    strategist: require("@/assets/characters/faces/icon_strategist.png"),
    thief: require("@/assets/characters/faces/icon_thief.png"),
};