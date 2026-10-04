import {FlatList, Modal, Pressable, View} from "react-native";
import { Text } from "@/app/components/ui/text";
import {Player} from "@/shared/types";

interface IProps {
    show: boolean,
    onModalClosed: () => void,
    players: Player[],
    onPlayerChosen: (id: string) => void
}

export function ChoosePlayerModal(props: IProps) {
    return  <Modal
        visible={props.show}
        transparent
        animationType="fade"
        onRequestClose={() => props.onModalClosed()}
    >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
            <View className="w-full max-h-[70%] bg-background rounded-3xl p-5">
                <View className="flex-row items-center justify-between mb-4">
                    <Text
                        variant="h3"
                    >
                        Choose person
                    </Text>

                    <Pressable
                        onPress={() => props.onModalClosed()}
                        className="w-10 h-10 rounded-full items-center justify-center"
                    >
                        <Text className="text-xl">
                            ×
                        </Text>
                    </Pressable>
                </View>

                <FlatList
                    data={props.players ?? []}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => props.onPlayerChosen(item.id)}
                            className="py-4 px-4 mb-2 rounded-2xl active:opacity-70"
                        >
                            <Text className="text-lg">
                                {item.name}
                            </Text>
                        </Pressable>
                    )}
                />
            </View>
        </View>
    </Modal>
}