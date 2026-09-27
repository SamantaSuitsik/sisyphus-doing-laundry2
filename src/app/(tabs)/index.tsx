import {SafeAreaView} from "react-native-safe-area-context";
import {Image, View} from 'react-native';


export default function Index() {
    return (
        <SafeAreaView>
            <View className="flex flex-col items-center">
                <Image className="object-scale-down" source={require('@/assets/images/men_drink.png')}/>
            </View>
        </SafeAreaView>
    );
}
