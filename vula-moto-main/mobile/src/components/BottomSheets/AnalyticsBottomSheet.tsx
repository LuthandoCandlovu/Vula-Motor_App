import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { COLORS, FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useQuery } from "convex/react";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import ContentLoader from "../ContentLoader/ContentLoader";

const AnalyticsBottomSheet = React.forwardRef<
  BottomSheetModal,
  {
    id: Id<"users">;
  }
>(({ id }, ref) => {
  const snapPoints = React.useMemo(() => ["80%"], []);
  const { dismiss } = useBottomSheetModal();
  const { settings } = useSettingsStore();
  const { me } = useMeStore();

  const analytics = useQuery(api.api.users.getUserAnalytics, {
    id: id,
    includeWishlist: me?._id === id,
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
            {me?._id === id
              ? "Your Vula Moto Analytics"
              : "Vula Moto Analytics"}
          </Text>

          <View
            style={{
              marginTop: 10,
              width: "100%",
              height: 300,
              alignItems: "center",
            }}
          >
            {!!!analytics ? (
              <ContentLoader
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 200,
                }}
              />
            ) : (
              <>
                <PieChart
                  donut
                  isAnimated
                  animationDuration={300}
                  innerRadius={80}
                  data={analytics}
                  radius={100}
                  centerLabelComponent={() => {
                    return (
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: 20, fontFamily: FONTS.bold }}>
                          Vula Moto
                        </Text>
                      </View>
                    );
                  }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    marginVertical: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {analytics.map(({ color, label, value }) => (
                    <LegendItem
                      key={color}
                      color={color}
                      label={`${label} (${value})`}
                    />
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default AnalyticsBottomSheet;

const LegendItem = ({ color, label }: { color: string; label: string }) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginRight: 16 }}
    >
      <View
        style={{
          width: 12,
          height: 12,
          backgroundColor: color,
          marginRight: 6,
          borderRadius: 6,
        }}
      />
      <Text style={{ fontSize: 14, color: "#333", fontFamily: FONTS.bold }}>
        {label}
      </Text>
    </View>
  );
};
