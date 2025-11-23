import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FONTS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { Rating } from "@kolking/react-native-rating";
import { useMutation } from "convex/react";
import React from "react";
import { Text } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import ProductUser from "../ProductComponents/ProductUser";
const RateSellerBottomSheet = React.forwardRef<
  BottomSheetModal,
  { userId: Id<"users"> }
>(({ userId }, ref) => {
  const snapPoints = React.useMemo(() => ["50%"], []);
  const [ratting, setRatting] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const { dismiss } = useBottomSheetModal();
  const { settings } = useSettingsStore();
  const mutateRateMe = useMutation(api.api.users.rateMe);

  return (
    <>
      <Spinner animation="fade" visible={loading} />
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={true}
        enableOverDrag={false}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <BottomSheetScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <ProductUser id={userId} />
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 18,
              textAlign: "center",
              marginVertical: 10,
            }}
          >
            Rate this seller.
          </Text>
          <Rating
            style={{
              alignSelf: "center",
            }}
            size={30}
            rating={ratting}
            onChange={async (rating) => {
              if (settings.haptics) {
                await onImpact();
              }
              setRatting(rating);
              setLoading(true);
              const res = await mutateRateMe({
                id: userId,
                value: rating,
              });
              setLoading(false);
              dismiss();
            }}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
});

export default RateSellerBottomSheet;
