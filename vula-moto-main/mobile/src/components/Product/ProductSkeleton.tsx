import { COLORS } from "@/src/constants";
import { Rating } from "@kolking/react-native-rating";
import React from "react";
import { View } from "react-native";
import ContentLoader from "../ContentLoader/ContentLoader";

const ProductSkeleton = ({ withoutUser }: { withoutUser?: boolean }) => {
  return (
    <View
      style={{
        flex: 1,
        maxWidth: 200,
        minWidth: 150,
        height: 300,
        backgroundColor: COLORS.main,
        position: "relative",
        marginVertical: 15,
      }}
    >
      <ContentLoader
        style={{
          width: 30,
          height: 30,
          position: "absolute",
          zIndex: 1,
          right: 0,
          backgroundColor: COLORS.gray200,
        }}
      />
      <ContentLoader
        style={{
          width: "100%",
          flex: 1,
        }}
      />

      <ContentLoader
        style={{ width: "50%", padding: 8, marginVertical: 5, borderRadius: 2 }}
      />
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <ContentLoader style={{ width: 100, padding: 5, borderRadius: 3 }} />
          <ContentLoader style={{ width: 50, padding: 5, borderRadius: 2 }} />
        </View>
      </View>
      <View
        style={{
          gap: 10,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <ContentLoader
          style={{
            width: 40,
            height: 40,
            borderRadius: 40,
          }}
        />
        {!!!withoutUser ? null : (
          <View style={{ flex: 1, marginTop: -10 }}>
            <ContentLoader
              style={{
                width: "100%",
                padding: 8,
                marginBottom: 3,
                borderRadius: 3,
              }}
            />
            <Rating
              fillColor={COLORS.gray100}
              style={{}}
              size={15}
              rating={5}
              disabled
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default ProductSkeleton;
