import { COLORS } from "@/src/constants";
import React from "react";
import { Animated, View, type StyleProp, type ViewStyle } from "react-native";
import { useMediaQuery } from "../../hooks/useMediaQuery";
interface Props {
  style?: StyleProp<ViewStyle>;
  duration?: number;
  delay?: number;
  outputRange?: number[];
}

const ContentLoader: React.FunctionComponent<Props> = ({
  style,
  duration = 2000,
  delay = 0,
  outputRange = [-200, 200],
}) => {
  const {
    dimension: { height },
  } = useMediaQuery();

  const skeletonAnimation = React.useRef(new Animated.Value(0)).current;

  const startAnimation = React.useCallback(() => {
    Animated.loop(
      Animated.timing(skeletonAnimation, {
        toValue: 1,
        delay,
        duration,
        useNativeDriver: true, // Performance boost
      })
    ).start();
  }, [duration, delay, skeletonAnimation]);

  React.useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const translateX = React.useMemo(
    () =>
      skeletonAnimation.interpolate({
        inputRange: [0, 1],
        outputRange,
      }),
    [skeletonAnimation, outputRange]
  );

  const animatedStyle = React.useMemo(
    () => ({
      width: "30%",
      height,
      transform: [{ rotate: "10deg" }, { translateX }],
      position: "absolute",
      top: -height / 2,
      opacity: 0.1,
      backgroundColor: COLORS.gray200,
    }),
    [translateX, height]
  );

  const containerStyle = React.useMemo(
    () => [{ overflow: "hidden", backgroundColor: COLORS.gray100 }, style],
    [style]
  );

  return (
    <View style={containerStyle as any}>
      <Animated.View style={animatedStyle as any} />
    </View>
  );
};

export default React.memo(ContentLoader);
