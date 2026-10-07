import { Modal, Pressable, Text, View } from "react-native";
import { colors } from "@/constants/GameColors";
import { PinkButton } from "@/components/ui/PinkButton";

interface Props {
    visible: boolean;
    title: string;
    description: string;
    onClose: () => void;
}

export function TraitDescriptionModal({ visible, title, description, onClose }: Props) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose} // Android back button
        >
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                }}
            >
                {/* Dark backdrop: tapping outside the card closes the modal */}
                <Pressable
                    onPress={onClose}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.7)",
                    }}
                />

                <View
                    style={{
                        width: "100%",
                        maxWidth: 360,
                        backgroundColor: colors.nightMid,
                        borderRadius: 24,
                        borderWidth: 1.5,
                        borderColor: colors.interactionPink,
                        padding: 20,
                        gap: 12,
                    }}
                >
                    <Text className="text-white text-xl font-extrabold">{title}</Text>
                    <Text className="text-white/80 text-base">{description}</Text>
                    <PinkButton title="Close" onPress={onClose} style={{ marginTop: 8 }} />
                </View>
            </View>
        </Modal>
    );
}