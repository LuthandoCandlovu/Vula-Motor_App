import { FONTS } from "@/src/constants";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { Text, View } from "react-native";

const ChatsOptionsBottomSheet = React.forwardRef<BottomSheetModal, {}>(
  ({}, ref) => {
    const snapPoints = React.useMemo(() => ["25%"], []);

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
          <View>
            <Text
              style={[
                {
                  textAlign: "center",
                  fontFamily: FONTS.bold,
                  fontSize: 16,
                },
              ]}
            >
              Will be implemented!!!
            </Text>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default ChatsOptionsBottomSheet;
