import { COLORS } from "@/src/constants";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View
      style={[
        {
          padding: 10,
          borderRadius: 10,
          backgroundColor: COLORS.white,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;
