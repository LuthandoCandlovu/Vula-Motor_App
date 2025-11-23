import Card from "@/src/components/Card/Card";
import { COLORS, FONTS } from "@/src/constants";
import { useLocationStore } from "@/src/store/locationStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { onImpact } from "@/src/utils";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInLeft } from "react-native-reanimated";

import { ScrollView } from "react-native-gesture-handler";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import Button from "@/src/components/Button/Button";

const Page = () => {
  const { location } = useLocationStore();
  const { me } = useMeStore();
  const { settings } = useSettingsStore();
  const router = useRouter();

  if (!!!location) return <Text>Loading...</Text>;
  return (
    <>
      <Tabs.Screen
        options={{
          headerTitle: "Market an Agric Product",
          headerShadowVisible: false,
          headerShown: true,
          headerTitleStyle: {
            fontFamily: FONTS.bold,
            fontSize: 20,
            color: COLORS.white,
          },
          headerStyle: {
            backgroundColor: COLORS.tertiary,
            height: 120,
          },
        }}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          padding: 10,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            {
              textAlign: "center",
              fontFamily: FONTS.bold,
              fontSize: 18,
              paddingBottom: 20,
            },
          ]}
        >
          Hello {me?.firstName?.concat(" ", me?.lastName || "")} 👋, What are
          you listing today!
        </Text>

        <Animated.View
          style={{
            flexDirection: "row",
            maxWidth: 400,
            alignSelf: "center",
            alignItems: "center",
            marginBottom: 40,
            gap: 10,
          }}
        >
          <TouchableOpacity
            disabled={!!!location?.address.name}
            style={{
              width: 150,
              height: 200,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLORS.white,
              borderRadius: 10,
              padding: 10,
            }}
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }

              router.navigate({
                pathname: "/(stacks)/list-item",
                params: {
                  category: "services",
                },
              });
            }}
          >
            <MaterialIcons
              name="miscellaneous-services"
              size={24}
              color={COLORS.tertiary}
            />
            <Text
              style={{
                fontFamily: FONTS.bold,
                marginTop: 20,
                fontSize: 18,
                textAlign: "center",
              }}
            >
              Service
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!!!location?.address.name}
            style={{
              width: 150,
              height: 200,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLORS.white,
              borderRadius: 10,
              padding: 10,
            }}
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }
              router.navigate({
                pathname: "/(stacks)/list-item",
                params: {
                  category: "spares",
                },
              });
            }}
          >
            <MaterialCommunityIcons
              name="engine-off-outline"
              size={24}
              color={COLORS.tertiary}
            />
            <Text
              style={{
                fontFamily: FONTS.bold,
                marginTop: 20,
                fontSize: 18,
                textAlign: "center",
              }}
            >
              Spares
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            flex: 1,
          }}
          entering={SlideInLeft.delay(100).duration(200)}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: 400,
              alignSelf: "center",
              position: "relative",
              paddingTop: 30,
              gap: 3,
            }}
          >
            <View
              style={[
                styles.badge,
                {
                  gap: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 5,
                  backgroundColor: COLORS.tertiary,
                },
              ]}
            >
              <Ionicons
                size={16}
                name="location-outline"
                color={COLORS.white}
              />
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.bold,
                  textTransform: "uppercase",
                  fontSize: 14,
                }}
              >
                Listing Location
              </Text>
            </View>

            {Object.entries(location.address).map(([key, value]) => (
              <View key={key} style={{ flexDirection: "row", gap: 10 }}>
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 12,
                    textTransform: "uppercase",
                    flex: 0.4,
                  }}
                >
                  {key}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 16,
                    flex: 0.6,
                    backgroundColor: COLORS.gray100,
                    borderRadius: 2,
                    paddingHorizontal: 10,
                  }}
                >
                  {value}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        <Card
          style={{
            elevation: 2,
            marginTop: 20,
          }}
        >
          <MapView
            initialRegion={{
              latitude: location.lat,
              longitude: location.lon,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={{
              width: "100%",
              height: 400,
              marginTop: 10,
            }}
            showsUserLocation={true}
            zoomEnabled={true}
            zoomControlEnabled={true}
            pitchEnabled={true}
            followsUserLocation={true}
            showsTraffic={true}
            showsIndoorLevelPicker={true}
            loadingEnabled={true}
            provider={Platform.select({
              android: PROVIDER_GOOGLE,
              ios: PROVIDER_DEFAULT,
            })}
            region={{
              latitude: location.lat,
              longitude: location.lon,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </Card>

        <Button
          title="Cancel"
          style={{
            width: 300,
            backgroundColor: COLORS.tertiary,
            marginVertical: 20,
          }}
          onPress={() => router.replace("..")}
        />
      </ScrollView>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    backgroundColor: COLORS.secondary,
    top: -10,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    shadowOpacity: 0.5,
    elevation: 2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    shadowColor: COLORS.tertiary,
    alignSelf: "center",
  },
});
