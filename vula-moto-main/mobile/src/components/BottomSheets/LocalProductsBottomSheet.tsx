import { api } from "@/convex/_generated/api";
import { COLORS, FONTS } from "@/src/constants";
import { useLocationStore } from "@/src/store/locationStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { onImpact } from "@/src/utils";
import { calculateDistance } from "@/src/utils/distance";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useQuery } from "convex/react";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import Animated, { SlideInLeft } from "react-native-reanimated";

const { height } = Dimensions.get("window");
const LocalProductsBottomSheet = React.forwardRef<BottomSheetModal, {}>(
  ({}, ref) => {
    const snapPoints = React.useMemo(() => ["80%"], []);
    const { dismiss } = useBottomSheetModal();
    const { settings } = useSettingsStore();
    const { location } = useLocationStore();
    const { me } = useMeStore();
    const sellers = useQuery(api.api.users.getLocalSeller, {
      id: me?._id,
    });
    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={false}
        enableOverDrag={false}
        handleComponent={null}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <BottomSheetView
          style={{
            flex: 1,
            padding: 10,
            paddingBottom: 100,
          }}
        >
          <View
            style={{
              alignSelf: "flex-end",
              paddingHorizontal: 20,
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                backgroundColor: COLORS.main,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30,
              }}
              hitSlop={20}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                dismiss();
              }}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: FONTS.bold,
                marginBottom: 10,
              }}
            >
              Products within your Radius..
            </Text>
          </View>

          <MapView
            initialRegion={{
              latitude: location.lat,
              longitude: location.lon,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={{
              width: "100%",
              height: height / 2,
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
          >
            <Marker
              coordinate={{
                latitude: location.lat,
                longitude: location.lon,
              }}
              title="You"
              description="This is you."
              identifier="you"
            >
              <Image
                style={{
                  width: 35,
                  height: 35,
                  resizeMode: "contain",
                }}
                source={require("@/assets/images/user.png")}
              />
            </Marker>

            {sellers?.map((seller, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: seller.location?.lat as any,
                  longitude: seller?.location?.lon as any,
                }}
                title={seller.fullName}
                description={`${calculateDistance(
                  {
                    latitude: location.lat,
                    longitude: location.lon,
                  },
                  {
                    latitude: seller.location?.lat as any,
                    longitude: seller.location?.lon as any,
                  }
                )} away`}
                identifier={seller.fullName}
              >
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    resizeMode: "contain",
                  }}
                  source={require("@/assets/images/service.png")}
                />
              </Marker>
            ))}
          </MapView>

          <Animated.View
            style={{
              paddingVertical: 20,
            }}
            entering={SlideInLeft.duration(200).delay(400)}
          >
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 18,
              }}
            >
              5+ services stations • 157+ spares listed near you.
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontFamily: FONTS.regular,
                color: COLORS.secondary,
              }}
            >
              {location.address.name}, {location.address.street}{" "}
              {location.address.streetNumber}, {location.address.city}
            </Text>
          </Animated.View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default LocalProductsBottomSheet;
