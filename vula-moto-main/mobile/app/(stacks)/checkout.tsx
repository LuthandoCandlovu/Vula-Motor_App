import { View, Text, Alert, TouchableOpacity } from "react-native";
import React from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Card from "@/src/components/Card/Card";
import { APP_NAME, COLORS, FONTS } from "@/src/constants";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Button from "@/src/components/Button/Button";
import TextInput from "@/src/components/TextInput/TextInput";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";

const Page = () => {
  const params = useLocalSearchParams<{
    id: Id<"items">;
  }>();
  const router = useRouter();
  const product = useQuery(api.api.items.getItemById, {
    id: params.id,
  });
  const { settings } = useSettingsStore();
  const [state, setState] = React.useState<{
    details: null;
    email: string;
  }>({
    email: "",
    details: null,
  });

  const pay = async () => {
    Alert.alert(
      APP_NAME,
      `You have successful checked out ${product?.title}.`,
      [
        {
          style: "destructive",
          text: "OK",
          onPress: async () => {
            if (settings.haptics) {
              await onImpact();
            }

            router.replace({ pathname: "/(tabs)/home" });
          },
        },
      ]
    );
  };

  if (!!!product)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.main,
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 500,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.regular,
              color: COLORS.gray,
              fontSize: 16,
            }}
          >
            The product was not found!
          </Text>
        </Card>
      </View>
    );
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: !!product ? product.title : "Product",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={{ width: 40 }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/create");
                }
              }}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          ),
          headerLargeTitleStyle: { fontFamily: FONTS.bold, fontSize: 25 },
          headerTitleStyle: { fontFamily: FONTS.bold, color: COLORS.white },
          headerStyle: {
            backgroundColor: COLORS.tertiary,
          },
        }}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.main,
          padding: 10,
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 500,
            alignSelf: "center",
            marginTop: 20,
            height: 80,
          }}
        >
          <TextInput
            label="Email Address"
            placeholder="johndoe@gmail.com"
            onChangeText={(text) => setState((s) => ({ ...s, email: text }))}
            text={state.email}
            outerContainerStyles={{
              flex: 1,
            }}
            containerStyles={{
              paddingHorizontal: 20,
            }}
            leftIcon={<Ionicons name="mail" color={COLORS.gray200} size={20} />}
            keyboardType="email-address"
          />
        </Card>

        <Card
          style={{
            width: "100%",
            maxWidth: 500,
            alignSelf: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 18,
            }}
          >
            This will be implemented in the future works with secure payment
            gateways.
          </Text>
          <Button
            title={`Checkout R${product?.price?.toFixed(2)}`}
            onPress={pay}
            Icon={
              <MaterialIcons name="payment" size={24} color={COLORS.white} />
            }
            style={{
              backgroundColor: COLORS.tertiary,
              width: "100%",
              marginVertical: 20,
            }}
          />
        </Card>
      </View>
    </>
  );
};

export default Page;
