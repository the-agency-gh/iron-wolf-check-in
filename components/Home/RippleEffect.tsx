import { FC, useEffect, useRef, useState } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
interface RippleEffectProps {
    rippleCount: number;
    color: string;
    style?: object;
    looped: boolean;
    duration: number;
}

const RippleEffect: FC<RippleEffectProps> = ({ rippleCount, color, style, looped, duration }) => {
    const rippleRef = useRef<
        {
            pos: Animated.Value;
            opacity: Animated.Value;
        }[]
    >([]);
    const [ripples, setRipples] = useState<JSX.Element[]>([]);
    const [animation, setAnimation] = useState<Animated.CompositeAnimation | null>(null);
    const handleRippleAnimation = (looped: boolean) => {
        const staggerAni = Animated.stagger(
            duration * 0.75,
            rippleRef.current.map((rRef) => {
                return Animated.parallel([
                    Animated.timing(rRef.pos, {
                        toValue: 2.7,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rRef.opacity, {
                        toValue: 0,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                ]);
            })
        );
        if (!looped) return staggerAni.start();
        const animationLoop = Animated.loop(staggerAni);
        setAnimation(animationLoop);
        animationLoop.start();
    };
    useEffect(() => {
        if (!!animation) animation.stop();
        setRipples(() =>
            new Array(rippleCount).fill(undefined).map((_, i) => {
                rippleRef.current[i] = { pos: new Animated.Value(1), opacity: new Animated.Value(1) };
                return (
                    <Animated.View
                        key={`ripple-${i}-${color}`}
                        style={[
                            styles.rippleDefault,
                            {
                                backgroundColor: color,
                                transform: [
                                    {
                                        scale: rippleRef.current[i].pos,
                                    },
                                ],
                                opacity: rippleRef.current[i].opacity,
                            },
                        ]}
                    />
                );
            })
        );
        handleRippleAnimation(looped);
    }, [rippleCount, color, looped]);
    return <View style={[styles.rippleContainer, style, { backgroundColor: looped ? color : "transparent" }]}>{ripples}</View>;
};

const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
    rippleContainer: {
        zIndex: -1,
        position: "absolute",
        top: 0,
        left: 0,
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: width / 2,
        opacity: 0.2,
    },
    rippleDefault: {
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: width / 2,
    },
});

export default RippleEffect;
