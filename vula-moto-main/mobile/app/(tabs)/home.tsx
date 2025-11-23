import { api } from "@/convex/_generated/api";
import ChatbotAssistantBottomSheet from "@/src/components/BottomSheets/ChatbotAssistantBottomSheet";
import NewUserBottomSheet from "@/src/components/BottomSheets/NewUserBottomSheet";
import HomeHeader from "@/src/components/Headers/HomeHeader";
import LocalMapSellers from "@/src/components/LocalMapSellers/LocalMapSellers";
import ProductsContainer from "@/src/components/ProductsContainer/ProductsContainer";
import { COLORS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { onImpact } from "@/src/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "convex/react";
import { Tabs } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const Page = () => {
  const [category, setCategory] = React.useState("all");
  const { settings } = useSettingsStore();
  const { me } = useMeStore();
  const user = useQuery(api.api.users.getById, { id: me?._id });
  const chatbotAssistantBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const newUserBottomSheetRef = React.useRef<BottomSheetModal>(null);
  React.useEffect(() => {
    if (!!user?.new) {
      newUserBottomSheetRef.current?.present();
    }
  }, [user]);

  return (
    <>
      <Tabs.Screen
        options={{
          header: (props) => (
            <HomeHeader
              {...props}
              category={category}
              setCategory={setCategory}
            />
          ),
        }}
      />

      <ChatbotAssistantBottomSheet ref={chatbotAssistantBottomSheetRef} />
      <NewUserBottomSheet ref={newUserBottomSheetRef} />
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            chatbotAssistantBottomSheetRef.current?.present();
          }}
          style={{
            position: "absolute",
            bottom: 120,
            width: 60,
            height: 60,
            borderRadius: 60,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            backgroundColor: COLORS.tertiary,
            right: 15,
          }}
        >
          <MaterialCommunityIcons
            name="robot-happy-outline"
            size={30}
            color={COLORS.white}
          />
        </TouchableOpacity>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 10,
            paddingBottom: 100,
          }}
          style={{ flex: 1, backgroundColor: COLORS.main }}
        >
          <LocalMapSellers />

          <ProductsContainer
            category="all"
            header="Newly Listed"
            navigateTo="new"
          />
          <ProductsContainer
            category="all"
            header="Near By"
            navigateTo="near"
          />
          <ProductsContainer category="service" header="Automotive Services" />
          <ProductsContainer category="spares" header="Automotive Spares" />
        </ScrollView>
      </View>
    </>
  );
};

export default Page;
