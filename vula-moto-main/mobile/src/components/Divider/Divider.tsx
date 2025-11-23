import { COLORS, FONTS } from "@/src/constants";
import React from "react";
import { StyleProp, Text, TextStyle, View } from "react-native";

const Divider = ({
  position = "left",
  title,
  titleStyles,
}: {
  position?: "left" | "right" | "center";
  title: string;
  titleStyles?: StyleProp<TextStyle>;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
      }}
    >
      {position === "center" || position === "right" ? (
        <View
          style={{
            borderBottomColor: COLORS.gray200,
            borderBottomWidth: 1,
            flex: 1,
          }}
        />
      ) : null}
      <Text style={[{ fontFamily: FONTS.bold }, titleStyles]}>{title}</Text>
      {position === "center" || position === "left" ? (
        <View
          style={{
            borderBottomColor: COLORS.gray200,
            borderBottomWidth: 1,
            flex: 1,
          }}
        />
      ) : null}
    </View>
  );
};

export default Divider;
