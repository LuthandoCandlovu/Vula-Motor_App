import { api } from "@/convex/_generated/api";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Product from "../Product/Product";
import ProductSkeleton from "../Product/ProductSkeleton";

interface Props {
  header: string;
  category: string;
  navigateTo?: "near" | "new";
}
const ProductsContainer = ({ header, category, navigateTo }: Props) => {
  const { settings } = useSettingsStore();
  const router = useRouter();
  const ids = useQuery(api.api.items.getByCategory, {
    category,
    limit: 4,
    order: "desc",
  });

  const navigateMe = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (typeof navigateTo === "undefined") {
      router.navigate({
        pathname: "/(common)/more-items",
        params: {
          category,
        },
      });
    } else if (navigateTo === "new") {
      router.navigate({
        pathname: "/(common)/new-items",
      });
    } else {
      router.navigate({
        pathname: "/(common)/near-by",
      });
    }
  };
  if (ids?.page.length === 0)
    return (
      <View style={{}}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 400,
            paddingVertical: 20,
            paddingBottom: 5,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 18,
            }}
          >
            {header}
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 16,
                color: COLORS.tertiary,
              }}
            >
              See More
            </Text>
            <Ionicons
              name="chevron-forward-outline"
              size={16}
              color={COLORS.tertiary}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            flexWrap: "wrap",
            width: "100%",
            flex: 1,
          }}
        >
          {Array(4)
            .fill(9)
            .map((_, i) => (
              <ProductSkeleton key={i} withoutUser />
            ))}
        </View>
      </View>
    );

  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 400,
          paddingVertical: 20,
          paddingBottom: 5,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 18,
          }}
        >
          {header}
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
          onPress={navigateMe}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 16,
              color: COLORS.tertiary,
            }}
          >
            See More
          </Text>
          <Ionicons
            name="chevron-forward-outline"
            size={16}
            color={COLORS.tertiary}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          flexWrap: "wrap",
          width: "100%",
          flex: 1,
        }}
      >
        {!!!ids
          ? Array(4)
              .fill(9)
              .map((_, i) => <ProductSkeleton key={i} withoutUser />)
          : ids?.page.map((id) => <Product id={id} key={id} withoutUser />)}
      </View>
    </View>
  );
};

export default ProductsContainer;
