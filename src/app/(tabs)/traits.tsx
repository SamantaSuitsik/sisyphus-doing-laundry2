import TraitsView from "../components/traits/TraitsView";
import {useGameSocket} from "@/app/hooks/GameSocketContext";

export default function Traits() {
    const { myPoints, myTraitPoints, spendTraitPoint } = useGameSocket();
    return <TraitsView myPoints={myPoints} myTraitPoints={myTraitPoints} spendTraitPoint={spendTraitPoint} />;
}