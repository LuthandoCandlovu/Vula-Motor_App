import React from "react";
import { Dimensions } from "react-native";

export const useMediaQuery = () => {
  const { width, height } = Dimensions.get("window");
  const [dimension, setDimension] = React.useState<{
    width: number;
    height: number;
  }>({ width, height });
  React.useLayoutEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window: { height, width } }) => {
        setDimension({ height, width });
      }
    );
    return () => {
      subscription.remove();
    };
  }, [Dimensions]);
  return {
    dimension,
  };
};
