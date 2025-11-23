import { FONTS } from "@/src/constants";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { Text } from "react-native";

const UserBiographyBottomSheet = React.forwardRef<
  BottomSheetModal,
  {
    biography: string;
  }
>(({ biography }, ref) => {
  const snapPoints = React.useMemo(() => ["50%"], []);

  return (
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
      <BottomSheetView
        style={{
          flex: 1,
          padding: 10,
          paddingBottom: 100,
        }}
      >
        <BottomSheetScrollView>
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 16,
            }}
          >
            {biography}
          </Text>
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default UserBiographyBottomSheet;
