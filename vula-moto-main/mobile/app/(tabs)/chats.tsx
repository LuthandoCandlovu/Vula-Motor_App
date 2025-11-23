import { api } from "@/convex/_generated/api";
import Chat from "@/src/components/ChatComponents/Chat";
import ChatSkeleton from "@/src/components/ChatComponents/ChatSkeleton";
import ChatsHeader from "@/src/components/Headers/ChatsHeader";
import { COLORS, FONTS } from "@/src/constants";
import { useMeStore } from "@/src/store/useMeStore";
import { TTab } from "@/src/types";
import { useQuery } from "convex/react";
import { Tabs } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";
const Page = () => {
  const tabs = React.useMemo(() => {
    const tabs: TTab<"read" | "unread" | "all">[] = [
      { icon: "list-outline", id: "all", name: "All" },
      { icon: "mail-unread-outline", id: "unread", name: "Unread" },
      { icon: "mail-open-outline", id: "read", name: "Read" },
    ];
    return tabs;
  }, []);
  const [activeTab, setActiveTab] = React.useState(0);
  const { me } = useMeStore();
  const [query, setQuery] = React.useState("");
  const chats = useQuery(api.api.chats.chats, {
    userId: me?._id,
  });

  const onSearchButtonPress = async () => {};
  return (
    <>
      <Tabs.Screen
        options={{
          header: (props) => (
            <ChatsHeader
              query={query}
              setQuery={setQuery}
              onSearchButtonPress={onSearchButtonPress}
              tabs={tabs}
              {...props}
              setActiveTab={setActiveTab}
            />
          ),
        }}
      />

      {typeof chats === "undefined" ? (
        <FlatList
          style={{ flex: 1, backgroundColor: COLORS.white }}
          contentContainerStyle={{
            paddingBottom: 100,
            paddingTop: 10,
            backgroundColor: COLORS.white,
            paddingHorizontal: 10,
          }}
          showsVerticalScrollIndicator={false}
          data={Array(15).fill(null)}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({}) => (
            <View style={{ flex: 1, paddingHorizontal: 5 }}>
              <ChatSkeleton />
            </View>
          )}
        />
      ) : chats.length === 0 ? (
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
            You don't have {tabs[activeTab].id}s in your Chats.
          </Text>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1, backgroundColor: COLORS.white }}
          contentContainerStyle={{
            paddingBottom: 100,
            paddingTop: 10,
            backgroundColor: COLORS.white,
            paddingHorizontal: 10,
          }}
          showsVerticalScrollIndicator={false}
          data={chats}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <Chat id={item} />}
        />
      )}
    </>
  );
};

export default Page;
