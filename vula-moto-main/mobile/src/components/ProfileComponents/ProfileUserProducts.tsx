import { api } from "@/convex/_generated/api";
import { TUser } from "@/convex/tables/users";
import { COLORS, FONTS } from "@/src/constants";
import { TTab } from "@/src/types";
import { useQuery } from "convex/react";
import React from "react";
import { FlatList, Text, View } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import Card from "../Card/Card";
import Product from "../Product/Product";
import ProductSkeleton from "../Product/ProductSkeleton";
import ProfileTabComponent from "./ProfileTabComponent";

const ProfileUserProducts = ({
  user,
  tabs,
  isMe,
}: {
  user?: TUser | null;
  tabs: TTab<"services" | "spares" | "wishlist">[];
  isMe: boolean;
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const items = useQuery(api.api.users.getUserItems, {
    category: tabs[activeTab].id,
    id: user?._id,
  });
  return (
    <Animated.View
      style={{
        flex: 1,
        marginTop: 10,
      }}
      entering={SlideInRight.duration(400).delay(400)}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          flex: 1,
        }}
      >
        <Text
          style={{ fontSize: 18, fontFamily: FONTS.bold, textAlign: "center" }}
        >
          Spares and Services
        </Text>
        <ProfileTabComponent tabs={tabs} setActiveTab={setActiveTab} />

        {typeof items === "undefined" ? (
          <FlatList
            style={{ flex: 1, backgroundColor: COLORS.white }}
            contentContainerStyle={{
              paddingBottom: 100,
              gap: 20,
              paddingTop: 10,
            }}
            showsVerticalScrollIndicator={false}
            data={Array(15).fill(null)}
            numColumns={2}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({}) => (
              <View style={{ flex: 1, paddingHorizontal: 5 }}>
                <ProductSkeleton
                  withoutUser={tabs[activeTab].id !== "wishlist"}
                />
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
              {isMe
                ? `You don't have ${tabs[activeTab].id}s yet.`
                : `No ${tabs[activeTab].id}s listed by ${user?.firstName}
              ${user?.lastName}.`}
            </Text>
          </View>
        ) : (
          <FlatList
            style={{ flex: 1, backgroundColor: COLORS.white }}
            contentContainerStyle={{
              paddingBottom: 100,
              gap: 20,
              paddingTop: 10,
            }}
            showsVerticalScrollIndicator={false}
            data={items}
            numColumns={2}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={{ flex: 1, paddingHorizontal: 5 }}>
                <Product
                  id={item}
                  withoutUser={tabs[activeTab].id !== "wishlist"}
                />
              </View>
            )}
          />
        )}
      </Card>
    </Animated.View>
  );
};

export default ProfileUserProducts;
