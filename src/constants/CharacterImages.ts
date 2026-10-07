import { ImageSourcePropType } from "react-native";
import {CharacterId} from "@/shared/characters/characters";

export const characterImages: Record<CharacterId, ImageSourcePropType> = {
    baller: require("@/assets/characters/baller_ok.png"),
    cocktailspecialist: require("@/assets/characters/cocktailspecialist_ok.png"),
    comrade: require("@/assets/characters/comrade_ok.png"),
    dj: require("@/assets/characters/dj_ok.png"),
    gymlover: require("@/assets/characters/gymlover_ok.png"),
    strategist: require("@/assets/characters/strategist_ok.png"),
    thief: require("@/assets/characters/thief_ok.png"),
};

export const characterFaces: Record<CharacterId, ImageSourcePropType> = {
    baller: require("@/assets/icons/icon_baller.png"),
    cocktailspecialist: require("@/assets/icons/icon_coctailspecialist.png"),
    comrade: require("@/assets/icons/icon_comrade.png"),
    dj: require("@/assets/icons/icon_DJ.png"),
    gymlover: require("@/assets/icons/icon_gymlover.png"),
    strategist: require("@/assets/icons/icon_strategist.png"),
    thief: require("@/assets/icons/icon_thief.png"),
};