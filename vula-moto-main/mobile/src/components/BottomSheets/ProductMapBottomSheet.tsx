import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import { useLocationStore } from "@/src/store/locationStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { calculateDistance } from "@/src/utils/distance";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import Constants from "expo-constants";
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
import MapViewDirections from "react-native-maps-directions";
import Animated, { SlideInLeft } from "react-native-reanimated";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
const { height } = Dimensions.get("window");
const ProductMapBottomSheet = React.forwardRef<
  BottomSheetModal,
  {
    product: any;
  }
>(({ product }, ref) => {
  const snapPoints = React.useMemo(() => ["80%"], []);
  const { dismiss } = useBottomSheetModal();
  const { settings } = useSettingsStore();
  const { location } = useLocationStore();

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
            }}
          >
            {product.title}
          </Text>
          <Text
            style={{
              fontSize: 25,
              fontFamily: FONTS.bold,
            }}
          >
            R {product.price.toFixed(2)}
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
          rotateEnabled={true}
          scrollDuringRotateOrZoomEnabled={true}
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
            latitude: product.location.lat,
            longitude: product.location.lon,
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
          <MapViewDirections
            origin={{
              latitude: product.location.lat,
              longitude: product.location.lon,
            }}
            destination={{ latitude: location.lat, longitude: location.lon }}
            apikey={Constants.expoConfig?.extra?.GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor={COLORS.secondary}
            strokeColors={[COLORS.tertiary, COLORS.secondary]}
          />
          <Marker
            title={product?.title}
            description={`${calculateDistance(
              {
                latitude: location.lat,
                longitude: location.lon,
              },
              {
                latitude: product.location.lat,
                longitude: product.location.lon,
              }
            )} away • listed ${dayjs(new Date(product._creationTime!)).fromNow()} ago`}
            identifier="product"
            coordinate={{
              latitude: product.location.lat,
              longitude: product.location.lon,
            }}
          >
            <Image
              style={{
                width: 35,
                height: 35,
                resizeMode: "contain",
                top: -3,
              }}
              source={
                product.type !== "services"
                  ? require("@/assets/images/service.png")
                  : require("@/assets/images/spares.png")
              }
            />
          </Marker>
        </MapView>

        <Animated.View
          style={{
            paddingVertical: 20,
          }}
          entering={SlideInLeft.duration(200).delay(400)}
        >
          {!!product.stock ? (
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 16,
                marginTop: -5,
                color: product.stock < 10 ? COLORS.red : COLORS.tertiary,
              }}
            >
              {product.stock} left in stock.
            </Text>
          ) : null}

          <Text
            style={{
              fontSize: 16,
              fontFamily: FONTS.bold,
              color: COLORS.black,
            }}
          >
            {product.location.address.name}, {product.location.address.street}{" "}
            {product.location.address.streetNumber},{" "}
            {product.location.address.city}
          </Text>
        </Animated.View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ProductMapBottomSheet;
