import { api } from "@/convex/_generated/api";
import WishlistHeader from "@/src/components/Headers/WishlistHeader";
import Product from "@/src/components/Product/Product";
import ProductSkeleton from "@/src/components/Product/ProductSkeleton";
import { COLORS, FONTS } from "@/src/constants";
import { useMeStore } from "@/src/store/useMeStore";
import { TTab } from "@/src/types";
import { useQuery } from "convex/react";
import { Tabs } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";

const Page = () => {
  const tabs = React.useMemo(() => {
    const tabs: TTab<"services" | "spares">[] = [
      { icon: "git-branch-outline", id: "services", name: "Services" },
      { icon: "cog-outline", id: "spares", name: "Spares" },
    ];
    return tabs;
  }, []);
  const [activeTab, setActiveTab] = React.useState(0);
  const { me } = useMeStore();
  const items = useQuery(api.api.users.getMyWishListByCategory, {
    category: tabs[activeTab].id,
    id: me?._id,
  });

  return (
    <>
      <Tabs.Screen
        options={{
          header: (props) =>
            !!!me ? null : (
              <WishlistHeader
                tabs={tabs}
                {...props}
                setActiveTab={setActiveTab}
              />
            ),
        }}
      />

      {typeof items === "undefined" ? (
        <FlatList
          style={{ flex: 1, backgroundColor: COLORS.white }}
          contentContainerStyle={{
            paddingBottom: 100,
            gap: 20,
            paddingTop: 10,
            backgroundColor: COLORS.white,
            paddingHorizontal: 10,
          }}
          showsVerticalScrollIndicator={false}
          data={Array(15).fill(null)}
          numColumns={2}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({}) => (
            <View style={{ flex: 1, paddingHorizontal: 5 }}>
              <ProductSkeleton />
            </View>
          )}
        />
      ) : items.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              textAlign: "center",
              fontSize: 16,
              color: COLORS.gray,
            }}
          >
            You don't have {tabs[activeTab].id}s in your Wishlists yet.
          </Text>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1, backgroundColor: COLORS.white }}
          contentContainerStyle={{
            paddingBottom: 100,
            gap: 20,
            paddingTop: 10,
            backgroundColor: COLORS.white,
            paddingHorizontal: 10,
          }}
          showsVerticalScrollIndicator={false}
          data={items}
          numColumns={2}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={{ flex: 1, paddingHorizontal: 5 }}>
              <Product id={item} />
            </View>
          )}
        />
      )}
    </>
  );
};

export default Page;
