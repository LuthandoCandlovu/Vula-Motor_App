import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { COLORS, FONTS } from "@/src/constants";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useMutation } from "convex/react";
import React from "react";
import { Text, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import ProductUser from "../ProductComponents/ProductUser";
import Button from "../Button/Button";
import { useMeStore } from "@/src/store/useMeStore";

const UserReviewBottomSheet = React.forwardRef<
  BottomSheetModal,
  { userId: Id<"users"> }
>(({ userId }, ref) => {
  const snapPoints = React.useMemo(() => ["50%"], []);
  const [loading, setLoading] = React.useState(false);
  const { dismiss } = useBottomSheetModal();
  const mutateWriteReview = useMutation(api.api.reviews.create);
  const [review, setReview] = React.useState("");
  const { me } = useMeStore();
  const addReview = async () => {
    if (!!!review.length) return;
    if (!!!me) return;
    setLoading(true);
    await mutateWriteReview({
      review,
      userId: me._id,
      sellerId: userId,
    })
      .then((res) => {
        if (res.success) {
          setReview("");
          dismiss();
        }
      })
      .finally(() => setLoading(false));
  };

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
              marginVertical: 10,
            }}
          >
            Write a review about this user.
          </Text>

          <View style={{ width: "100%" }}>
            <BottomSheetTextInput
              onChangeText={(text) => {
                setReview(text);
              }}
              value={review}
              multiline
              style={{
                fontFamily: FONTS.regular,
                fontSize: 18,
                backgroundColor: COLORS.main,
                maxHeight: 100,
                width: "100%",
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
              placeholder="Type a review about this seller."
            />

            <Button
              title="Submit"
              loading={loading}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 20,
                backgroundColor: COLORS.tertiary,
              }}
              onPress={addReview}
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
});

export default UserReviewBottomSheet;
