import { APP_NAME, COLORS, FONTS, LANGUAGE_OPTIONS } from "@/src/constants";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { translateText } from "@/src/utils/react-query";
import { isValidPhoneNumber } from "@crispengari/regex-validator";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";

import React from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const VALUES = ["buyer", "seller"];
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Button from "../Button/Button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMeStore } from "@/src/store/useMeStore";
const NewUserBottomSheet = React.forwardRef<BottomSheetModal, {}>(({}, ref) => {
  const snapPoints = React.useMemo(() => ["50%"], []);
  const { dismiss } = useBottomSheetModal();
  const { settings } = useSettingsStore();

  const colorScheme = useColorScheme();

  const isDark = React.useMemo(() => colorScheme === "dark", [colorScheme]);

  const [state, setState] = React.useState({
    index: 0,
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
            }}
          >
            Who are you?
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: FONTS.regular,
              marginBottom: 10,
              color: COLORS.gray,
            }}
          >
            Hello, new user. Please provide the following information.
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            maxWidth: 300,
          }}
        >
          <SegmentedControl
            sliderStyle={{ backgroundColor: COLORS.tertiary }}
            style={{
              flex: 1,
              backgroundColor: COLORS.tertiary,
            }}
            activeFontStyle={{
              fontFamily: FONTS.bold,
              color: COLORS.white,
              fontSize: 18,
            }}
            fontStyle={{
              fontFamily: FONTS.bold,
              color: isDark ? COLORS.white : COLORS.main,
              fontSize: 18,
            }}
            values={VALUES}
            selectedIndex={state.index}
            onChange={async (event) => {
              if (settings.haptics) {
                await onImpact();
              }
              setState((s) => ({
                ...s,
                index: event.nativeEvent?.selectedSegmentIndex || 0,
              }));
            }}
          />
        </View>

        <View style={{ width: "100%", maxWidth: 500 }}>
          {state.index === 0 ? (
            <BuyerComponent accountType={VALUES[state.index].toLowerCase()} />
          ) : (
            <SellerComponent
              accountType={VALUES[state.index].toLocaleLowerCase()}
            />
          )}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default NewUserBottomSheet;

const BuyerComponent = ({ accountType }: { accountType: string }) => {
  const { dismiss } = useBottomSheetModal();
  const { me } = useMeStore();
  const user = useQuery(api.api.users.getById, { id: me?._id });

  const [state, setState] = React.useState({
    loading: false,
    error: "",
    phoneNumber: "",
    bio: "",
  });

  const updateMutation = useMutation(api.api.users.updateProfile);
  const { settings } = useSettingsStore();
  const updateProfile = async () => {
    if (!isValidPhoneNumber(state.phoneNumber)) {
      return setState((s) => ({
        ...s,
        error: "Please enter the valid phone number.",
      }));
    }

    setState((s) => ({ ...s, loading: true, error: "" }));
    await updateMutation({
      accountType: accountType as any,
      biography: state.bio,
      id: me?._id,
      phoneNumber: state.phoneNumber,
      verified: false,
    })
      .then((id) => {
        if (!!id) {
          setState((s) => ({
            ...s,
            bio: "",
            error: "",
            loading: false,
            phoneNumber: "",
          }));
          Alert.alert(APP_NAME, "Your profile was updated successfully.", [
            {
              text: "OK",
              style: "default",
              onPress: async () => {
                if (settings.haptics) await onImpact();
              },
            },
          ]);
          dismiss();
        }
        setState((s) => ({
          ...s,
          error: "Failed to update the user profile",
        }));
      })
      .finally(() =>
        setState((s) => ({
          ...s,
          loading: false,
        }))
      );
  };

  React.useEffect(() => {
    if (!!user) {
      setState((s) => ({
        ...s,
        bio: user.biography,
        phoneNumber: user.phoneNumber,
      }));
    }
  }, [user]);
  return (
    <View
      style={{
        gap: 10,
        marginTop: 30,
        width: "100%",
        maxWidth: 500,
      }}
    >
      <BottomSheetTextInput
        style={[
          styles.input,
          {
            paddingHorizontal: 20,
          },
        ]}
        placeholderTextColor={COLORS.black}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={state.phoneNumber}
        onChangeText={(text) => setState((s) => ({ ...s, phoneNumber: text }))}
      />
      <BottomSheetTextInput
        style={[
          styles.input,
          {
            maxHeight: 100,
          },
        ]}
        placeholderTextColor={COLORS.black}
        placeholder="Explain a bit about yourself..."
        multiline
        value={state.bio}
        onChangeText={(text) => setState((s) => ({ ...s, bio: text }))}
      />
      <Text
        style={{
          fontFamily: FONTS.regular,
          fontSize: 16,
          color: COLORS.red,
        }}
      >
        {state.error}
      </Text>

      <Button
        title="Save"
        loading={state.loading}
        onPress={updateProfile}
        style={{
          width: "100%",
          backgroundColor: COLORS.tertiary,
          marginTop: 30,
        }}
      />
    </View>
  );
};

const SellerComponent = ({ accountType }: { accountType: string }) => {
  const { dismiss } = useBottomSheetModal();
  const { me } = useMeStore();
  const { settings } = useSettingsStore();
  const user = useQuery(api.api.users.getById, { id: me?._id });
  const [state, setState] = React.useState({
    loading: false,
    error: "",
    phoneNumber: "",
    bio: "",
  });
  const updateMutation = useMutation(api.api.users.updateProfile);
  const updateProfile = async () => {
    if (!isValidPhoneNumber(state.phoneNumber)) {
      return setState((s) => ({
        ...s,
        error: "Please enter the valid phone number.",
      }));
    }
    setState((s) => ({ ...s, loading: true, error: "" }));
    await updateMutation({
      accountType: accountType as any,
      biography: state.bio,
      id: me?._id,
      phoneNumber: state.phoneNumber,
      verified: false,
    })
      .then((id) => {
        if (!!id) {
          setState((s) => ({
            ...s,
            bio: "",
            error: "",
            loading: false,
            phoneNumber: "",
          }));
          Alert.alert(APP_NAME, "Your profile was updated successfully.", [
            {
              text: "OK",
              style: "default",
              onPress: async () => {
                if (settings.haptics) await onImpact();
              },
            },
          ]);
          dismiss();
        }
        setState((s) => ({
          ...s,
          error: "Failed to update the user profile",
        }));
      })
      .finally(() =>
        setState((s) => ({
          ...s,
          loading: false,
        }))
      );
  };
  React.useEffect(() => {
    if (!!user) {
      setState((s) => ({
        ...s,
        bio: user.biography,
        phoneNumber: user.phoneNumber,
      }));
    }
  }, [user]);
  return (
    <View
      style={{
        gap: 10,
        marginTop: 30,
        width: "100%",
        maxWidth: 500,
      }}
    >
      <BottomSheetTextInput
        style={[
          styles.input,
          {
            paddingHorizontal: 20,
          },
        ]}
        placeholderTextColor={COLORS.black}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={state.phoneNumber}
        onChangeText={(text) => setState((s) => ({ ...s, phoneNumber: text }))}
      />
      <BottomSheetTextInput
        style={[
          styles.input,
          {
            maxHeight: 100,
          },
        ]}
        placeholderTextColor={COLORS.black}
        placeholder="Explain a bit about yourself..."
        multiline
        value={state.bio}
        onChangeText={(text) => setState((s) => ({ ...s, bio: text }))}
      />
      <Text
        style={{
          marginTop: 30,
          fontFamily: FONTS.regular,
          fontSize: 16,
        }}
      >
        For local buyers of services and spares, upload the following documents
        so that your profile will get verified.
      </Text>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <TouchableOpacity style={styles.btnCard}>
          <Text
            style={{
              alignSelf: "center",
              textAlign: "center",
              fontFamily: FONTS.bold,
              fontSize: 18,
            }}
          >
            Add LICENSE DOCUMENT
          </Text>
          <MaterialCommunityIcons
            style={{
              alignSelf: "center",
            }}
            name="license"
            size={30}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnCard}>
          <Text
            style={{
              alignSelf: "center",
              textAlign: "center",
              fontFamily: FONTS.bold,
              fontSize: 18,
            }}
          >
            Add ID COPY
          </Text>
          <MaterialCommunityIcons
            name="identifier"
            size={30}
            color="black"
            style={{
              alignSelf: "center",
            }}
          />
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontFamily: FONTS.regular,
          fontSize: 16,
          color: COLORS.red,
        }}
      >
        {state.error}
      </Text>

      <Button
        title="Save"
        loading={state.loading}
        onPress={updateProfile}
        style={{
          width: "100%",
          backgroundColor: COLORS.tertiary,
          marginTop: 30,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontFamily: FONTS.regular,
    fontSize: 18,
    backgroundColor: COLORS.main,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnCard: {
    width: 150,
    height: 200,
    borderRadius: 10,
    justifyContent: "center",
    alignContent: "center",
    gap: 20,
    backgroundColor: COLORS.primary,
    padding: 30,
  },
});
