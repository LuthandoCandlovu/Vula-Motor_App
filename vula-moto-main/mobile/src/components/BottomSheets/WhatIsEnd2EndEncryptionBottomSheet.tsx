import { FONTS } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { SlideInLeft } from "react-native-reanimated";

const WhatIsEnd2EndEncryptionBottomSheet = React.forwardRef<
  BottomSheetModal,
  {}
>(({}, ref) => {
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
      <BottomSheetView style={{ flex: 1 }}>
        <Text
          style={[styles.title, { paddingHorizontal: 10, textAlign: "center" }]}
        >
          End-to-End Encryption
        </Text>
        <View
          style={{
            maxWidth: 400,
            alignSelf: "center",
            flex: 1,
            paddingHorizontal: 20,
            paddingBottom: 100,
            width: "100%",
          }}
        >
          <Animated.View
            entering={SlideInLeft.delay(200).duration(1000)}
            style={{
              paddingVertical: 20,
              alignSelf: "center",
            }}
          >
            <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
          </Animated.View>

          <Text style={styles.text}>
            1. Your chats stay private 🔐. Messages are encrypted on your device
            and only decrypted by the person you're chatting with.
          </Text>
          <Text style={styles.text}>
            2. Not even Vula Moto can read or access your messages – we don’t
            store or view your private conversations.
          </Text>
          <Text style={styles.text}>
            3. End-to-end encryption keeps your messages safe from third
            parties, hackers, and anyone trying to snoop 👀.
          </Text>
          <Text style={styles.text}>
            4. By using Vula Moto, you agree to protect your account and device.
            We do our part – you do yours 💪.
          </Text>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default WhatIsEnd2EndEncryptionBottomSheet;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginBottom: 10,
  },
  text: {
    fontFamily: FONTS.bold,
    marginVertical: 3,
    fontSize: 16,
  },
});
