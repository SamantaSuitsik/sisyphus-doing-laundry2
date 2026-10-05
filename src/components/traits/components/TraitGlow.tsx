import Svg, {
    Circle,
    Defs,
    RadialGradient,
    Stop,
} from "react-native-svg";

interface TraitGlowProps {
    size?: number;
}

export function TraitGlow({
                              size = 64,
                          }: TraitGlowProps) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
        >
            <Defs>
                <RadialGradient
                    id="traitGlow"
                    cx="50%"
                    cy="50%"
                    r="50%"
                >
                    {/* Bright center */}
                    <Stop
                        offset="0%"
                        stopColor="#FFFFFF"
                        stopOpacity="0.85"
                    />

                    {/* Soft light blue */}
                    <Stop
                        offset="25%"
                        stopColor="#D9E3FF"
                        stopOpacity="0.75"
                    />

                    {/* Blue */}
                    <Stop
                        offset="55%"
                        stopColor="#8FA3D2"
                        stopOpacity="0.45"
                    />

                    {/* Fade */}
                    <Stop
                        offset="100%"
                        stopColor="#6074AB"
                        stopOpacity="0"
                    />
                </RadialGradient>
            </Defs>

            <Circle
                cx="50"
                cy="50"
                r="50"
                fill="url(#traitGlow)"
            />
        </Svg>
    );
}