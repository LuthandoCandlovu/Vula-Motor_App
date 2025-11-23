import { api } from "@/convex/_generated/api";
import { COLORS, FONTS } from "@/src/constants";
import { useMeStore } from "@/src/store/useMeStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const Layout = () => {
  const { me } = useMeStore();
  const unread = useQuery(api.api.messages.count, {
    id: me?._id,
  });
  const user = useQuery(api.api.users.getById, { id: me?._id });
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: {
          height:
            width >= 600 ? 70 : Platform.select({ ios: 100, android: 80 }),
          backgroundColor: COLORS.transparent,
          position: "absolute",
          elevation: 0,
        },
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: COLORS.black,
        tabBarActiveTintColor: COLORS.red,
        headerShown: true,
        tabBarLabelStyle: {
          fontFamily: FONTS.bold,
          fontSize: 15,
          marginTop: width >= 600 ? 10 : 0,
        },
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="engine-off"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          headerShown: false,
          title: "Publish",
          tabBarStyle: {
            display: user?.accountType === "seller" ? "flex" : "none",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cloud-upload-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox-outline" color={color} size={size} />
          ),
          tabBarBadge: !!!unread ? undefined : unread <= 9 ? unread : "9+",
          tabBarBadgeStyle: {
            fontFamily: FONTS.regular,
            color: COLORS.white,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};
export default Layout;
