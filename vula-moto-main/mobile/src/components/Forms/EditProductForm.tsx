import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { TItem } from "@/convex/tables/items";
import {
  APP_NAME,
  AUDIOS,
  COLORS,
  DELIVERY_OPTIONS,
  FONTS,
} from "@/src/constants";
import { useMediaPermissions } from "@/src/hooks";
import { useCurrentLocation } from "@/src/hooks/useCurrentLocation";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/useMeStore";
import { TAttachment } from "@/src/types";
import { onImpact } from "@/src/utils";
import { uploadFile } from "@/src/utils/react-query";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useMutation as useMutationReactQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { useAudioPlayer } from "expo-audio";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Dropdown from "react-native-input-select";
import Animated, { SlideInRight } from "react-native-reanimated";
import Button from "../Button/Button";
import Card from "../Card/Card";
import CreateInput from "../CreateInput/CreateInput";

type TState = {
  title: string;
  description: string;
  price: string;
  previousPrice: string;
  stock: string;
  error: string;
  image: TAttachment;
  loading: boolean;
  delivery: "delivery" | "collect";
};

const initialState: TState = {
  title: "",
  loading: false,
  description: "",
  price: "0",
  previousPrice: "0",
  stock: "1",
  error: "",
  delivery: "collect",
  image: {
    base64: undefined,
    type: undefined,
    uri: undefined,
  },
};
const EditProductForm = ({
  category,
  product,
}: {
  category: "services" | "spares";
  product?: TItem;
}) => {
  const { settings } = useSettingsStore();
  const updateItemMutation = useMutation(api.api.items.update);
  const router = useRouter();
  const { camera, gallery, requestCameraPermission } = useMediaPermissions();
  const { me } = useMeStore();

  const player = useAudioPlayer(AUDIOS.published);
  const location = useCurrentLocation();
  const { mutateAsync, isPending } = useMutationReactQuery({
    mutationFn: uploadFile,
    mutationKey: ["upload-file"],
  });
  const [state, setState] = React.useState<TState>(initialState);

  React.useEffect(() => {
    if (!!product) {
      setState((s) => ({
        ...s,
        category: product.type,
        stock: product?.stock?.toString() ?? "1",
        previousPrice: product.previousPrice.toString() ?? "0.0",
        description: product.description,
        price: product.price.toString(),
        title: product.title,
        // delivery: product.delivery ? product.delivery : "collect",
        image: {
          ...state.image,
          uri: product.image,
        },
      }));
    }
  }, [product]);
  const select = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (gallery) {
      const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        allowsEditing: true,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.POPOVER,
        base64: true,
      });

      if (canceled) return;
      const [asset] = assets;
      setState((s) => ({
        ...s,
        image: {
          ...s.image,
          base64: "data:image/jpeg;base64," + asset.base64,
          type: "image",
          uri: asset.uri,
        },
      }));
    }
  };
  const take = async () => {
    if (settings.haptics) {
      await onImpact();
    }

    if (camera) {
      const { assets, canceled } = await ImagePicker.launchCameraAsync({
        quality: 1,
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        allowsEditing: true,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.POPOVER,
        base64: true,
      });

      if (canceled) return;
      const [asset] = assets;
      setState((s) => ({
        ...s,
        image: {
          ...s.image,
          base64: "data:image/jpeg;base64," + asset.base64,
          type: "image",
          uri: asset.uri,
        },
      }));
    } else {
      await requestCameraPermission();
    }
  };
  const remove = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    setState((state) => ({
      ...state,
      image: {
        ...state.image,
        base64: null,
        type: undefined,
        uri: undefined,
      },
    }));
  };

  const publish = async () => {
    if (!!!product) return;
    setState((s) => ({
      ...s,
      loading: true,
      error: "",
    }));
    if (!!!me) {
      return setState((s) => ({
        ...s,
        loading: false,
        error:
          "You are not authenticated so you can not publish products on Vula Moto",
      }));
    }
    if (!!!location.address.country?.length) {
      return setState((s) => ({
        ...s,
        loading: false,
        error: "Invalid location try again.",
      }));
    }

    if (state.title.trim().length < 3) {
      return setState((s) => ({
        ...s,
        loading: false,
        error: "The product title should be at least 3 charters long.",
      }));
    }

    if (state.description.trim().length < 10) {
      return setState((s) => ({
        ...s,
        loading: false,
        error: "The product description should be at least 10 charters long.",
      }));
    }
    if (Number.parseFloat(state.price) <= 0) {
      return setState((s) => ({
        ...s,
        loading: false,
        error:
          "The product price is invalid, the product price can only be a number and can never be 0.",
      }));
    }
    if (Number.parseFloat(state.stock) <= 0) {
      return setState((s) => ({
        ...s,
        loading: false,
        error:
          "The product quantity is invalid, the product quantity can only be a number and can never be 0.",
      }));
    }

    if (!!!state.image.base64 && !!!state.image.uri?.startsWith("https://")) {
      return setState((s) => ({
        ...s,
        loading: false,
        error: "The product image is required.",
      }));
    }
    let image: Id<"_storage"> | undefined = undefined;
    if (!!!state.image.uri?.startsWith("https://")) {
      const response = await fetch(state.image!.uri!);
      const blob = await response.blob();
      const file = await mutateAsync({
        file: blob,
      });
      image = file.id;
    }
    const id = await updateItemMutation({
      id: product._id,
      values: {
        image,
        userId: me._id,
        type: category,
        title: state.title,
        description: state.description,
        price: Number.parseFloat(state.price),
        previousPrice: Number.parseFloat(state.previousPrice),
        stock: Number.parseInt(state.stock),
        category: category,
        delivery: state.delivery,
        location: {
          ...location,
        },
      },
    });
    if (!!id) {
      await player.play();
      Alert.alert(APP_NAME, "Product was updated successfully in the market.", [
        {
          text: "OK",
          style: "cancel",
          onPress: async () => {
            if (settings.haptics) {
              await onImpact();
            }
            router.replace("/(tabs)/home");
          },
        },
        {
          text: "CONTINUE EDITING",
          style: "default",
          onPress: async () => {
            if (settings.haptics) {
              await onImpact();
            }
          },
        },
      ]);
    }
    setState((s) => ({ ...s, loading: false }));
  };

  return (
    <>
      {/* <Spinner visible={state.loading || isPending} animation="fade" /> */}
      <Animated.View entering={SlideInRight.duration(400).delay(400)}>
        <Card
          style={{
            marginTop: 5,
            marginBottom: 10,
            gap: 10,
            paddingBottom: 0,
          }}
        >
          <>
            <Text
              style={{
                fontFamily: FONTS.bold,
                color: COLORS.tertiary,
                marginBottom: 10,
              }}
            >
              Field marked (*) are required.
            </Text>

            <CreateInput
              label="Product Title(*)"
              placeholder="Product Title"
              Icon={
                <TouchableOpacity>
                  <MaterialIcons name="title" size={24} color="black" />
                </TouchableOpacity>
              }
              value={state.title}
              onChangeText={(text) => setState((s) => ({ ...s, title: text }))}
              containerStyle={{ flex: 1 }}
            />
            <CreateInput
              label="Product Description(*)"
              placeholder="Product Description"
              Icon={
                <TouchableOpacity>
                  <MaterialIcons name="animation" size={24} color="black" />
                </TouchableOpacity>
              }
              value={state.description}
              onChangeText={(text) =>
                setState((s) => ({ ...s, description: text }))
              }
              containerStyle={{ marginTop: 5 }}
              inputStyle={{ maxHeight: 80 }}
              inputContainerStyle={{ alignItems: "flex-start" }}
              multiline={true}
              iconStyle={{ marginTop: 5 }}
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <CreateInput
                label="Product Price(*)"
                placeholder="Product Price"
                keyboardType="decimal-pad"
                Icon={
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 20,
                    }}
                  >
                    R
                  </Text>
                }
                value={state.price}
                onChangeText={(text) =>
                  setState((s) => ({ ...s, price: text }))
                }
                containerStyle={{ flex: 1 }}
              />
              <CreateInput
                label="Previous Price"
                placeholder="Previous Price"
                keyboardType="decimal-pad"
                Icon={
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 20,
                    }}
                  >
                    R
                  </Text>
                }
                value={state.previousPrice}
                onChangeText={(text) =>
                  setState((s) => ({ ...s, previousPrice: text }))
                }
                containerStyle={{ flex: 1 }}
              />
            </View>

            <CreateInput
              label="Product Quantity(*)"
              placeholder="Product Quantity"
              keyboardType="number-pad"
              Icon={
                <MaterialCommunityIcons
                  name="stocking"
                  size={24}
                  color={COLORS.black}
                />
              }
              value={state.stock}
              onChangeText={(text) => setState((s) => ({ ...s, stock: text }))}
              containerStyle={{ flex: 1 }}
            />

            <View>
              <Text style={{ fontFamily: FONTS.bold }}>Delivery Option(*)</Text>
              <Dropdown
                placeholder="Delivery Option(*)"
                options={DELIVERY_OPTIONS}
                optionLabel={"name"}
                optionValue={"value"}
                selectedValue={state.delivery}
                isMultiple={false}
                dropdownIconStyle={{ top: 15, right: 15 }}
                modalControls={{
                  modalOptionsContainerStyle: {
                    backgroundColor: COLORS.white,
                  },
                }}
                dropdownStyle={{
                  borderWidth: 0,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  minHeight: 40,
                  backgroundColor: COLORS.gray100,
                  flexDirection: "column-reverse",
                }}
                placeholderStyle={{
                  color: COLORS.black,
                  fontSize: 18,
                  fontFamily: FONTS.regular,
                }}
                onValueChange={async (value: any) => {
                  if (settings.haptics) await onImpact();
                  setState((state) => ({ ...state, delivery: value }));
                }}
                primaryColor={COLORS.secondary}
                dropdownHelperTextStyle={{
                  display: "none",
                }}
                selectedItemStyle={{
                  color: COLORS.black,
                  fontSize: 16,
                  fontFamily: FONTS.bold,
                }}
                listComponentStyles={{
                  itemSeparatorStyle: { borderColor: COLORS.gray },
                }}
                checkboxControls={{
                  checkboxLabelStyle: {
                    fontFamily: FONTS.bold,
                    color: COLORS.black,
                    fontSize: 18,
                  },
                  checkboxStyle: {
                    borderRadius: 999,
                    borderColor: COLORS.transparent,
                  },
                }}
              />
            </View>

            {/* Image */}
            <Text
              style={{
                fontFamily: FONTS.bold,
              }}
            >
              Select Product Image(*)
            </Text>
            {!!!state.image.uri ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                  paddingBottom: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    padding: 10,
                    width: 60,
                    height: 60,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 60,
                    alignSelf: "center",
                    backgroundColor: COLORS.gray100,
                  }}
                  activeOpacity={0.7}
                  onPress={select}
                >
                  <AntDesign name="picture" size={24} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: 10,
                    width: 60,
                    height: 60,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 60,
                    alignSelf: "center",
                    backgroundColor: COLORS.gray100,
                  }}
                  activeOpacity={0.7}
                  onPress={take}
                >
                  <Ionicons name="camera" size={24} />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Animated.Image
                  style={{
                    width: 300,
                    height: 350,
                    backgroundColor: COLORS.gray,
                    borderRadius: 10,
                    marginTop: 20,
                  }}
                  source={{ uri: state.image.uri }}
                />
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: COLORS.red,
                    borderRadius: 999,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 30,
                    width: "100%",
                    maxWidth: 300,
                    marginBottom: 10,
                  }}
                  onPress={async () => {
                    if (settings.haptics) {
                      await onImpact();
                    }
                    remove();
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontFamily: FONTS.bold,
                      fontSize: 18,
                    }}
                  >
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        </Card>
      </Animated.View>

      <Animated.View>
        <Card
          style={{
            marginTop: 5,
            paddingBottom: 0,
          }}
        >
          <Text
            style={[
              {
                textAlign: "center",
                fontFamily: FONTS.bold,
                fontSize: 18,
                height: 80,
                color: COLORS.red,
              },
            ]}
          >
            {state.error}
          </Text>

          <Button
            title="Update Product"
            onPress={publish}
            loading={state.loading || isPending}
            style={{
              padding: 10,
              backgroundColor: COLORS.tertiary,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: 300,
              marginBottom: 10,
              alignSelf: "center",
              borderColor: COLORS.tertiary,
            }}
          />
        </Card>
      </Animated.View>
    </>
  );
};

export default EditProductForm;
