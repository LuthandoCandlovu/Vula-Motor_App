import { COLORS, FONTS } from "@/src/constants";
import React from "react";
import { Text, View } from "react-native";

const MessageDeletedForEveryone = ({ isMine }: { isMine: boolean }) => {
  return (
    <View
      style={{
        maxWidth: "80%",
        alignSelf: isMine ? "flex-end" : "flex-start",
        marginBottom: 2,
        minWidth: 100,
        backgroundColor: isMine ? COLORS.main : COLORS.gray100,
        padding: 20,
        paddingVertical: 3,
        borderRadius: 999,
      }}
    >
      <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
        This message was deleted
      </Text>
    </View>
  );
};

export default MessageDeletedForEveryone;
