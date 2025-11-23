import React from "react";
import { View } from "react-native";
import ContentLoader from "../ContentLoader/ContentLoader";

const ChatSkeleton = () => {
  return (
    <View
      style={{
        gap: 10,
        marginBottom: 5,
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
      }}
    >
      <View>
        <ContentLoader
          style={{
            width: 50,
            height: 50,
            borderRadius: 5,
          }}
        />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <ContentLoader
          style={{
            width: "80%",
            padding: 10,
            borderRadius: 5,
            marginTop: -10,
          }}
        />
        <ContentLoader
          style={{
            width: "70%",
            padding: 5,
            borderRadius: 5,
          }}
        />
      </View>
      <ContentLoader
        style={{
          width: 25,
          height: 25,
          borderRadius: 25,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </View>
  );
};

export default ChatSkeleton;
