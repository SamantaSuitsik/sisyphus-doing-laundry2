import {useGameSocket} from "@/hooks/GameSocketContext";
import TraitsView from "@/components/traits/TraitsView";

export default function Traits() {
    const { myPoints, myTraitPoints, spendTraitPoint, removePoint } = useGameSocket();
    return <TraitsView myPoints={myPoints} myTraitPoints={myTraitPoints} spendTraitPoint={spendTraitPoint} removePoint={removePoint} />;
}