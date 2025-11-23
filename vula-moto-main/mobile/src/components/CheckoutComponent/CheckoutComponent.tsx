import { View, Text } from "react-native";
import React from "react";

import Animated, { SlideInLeft } from "react-native-reanimated";
import Card from "../Card/Card";
import Button from "../Button/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/src/constants";
import { useRouter } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";

const CheckoutComponent = ({
  price,
  delivery,
  id,
}: {
  price: number;
  delivery: string;
  id: Id<"items">;
}) => {
  const router = useRouter();

  return (
    <Animated.View entering={SlideInLeft.duration(400).delay(400)}>
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          alignSelf: "center",
          gap: 10,
          marginTop: 5,
        }}
      >
        <View style={{}}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 20 }}>
            Interested?
          </Text>
          <Text
            style={{
              fontFamily: FONTS.regular,
              color: COLORS.gray,
            }}
          >
            If you are interested proceed to the checkout page.{" "}
          </Text>
        </View>

        <Button
          title={`Checkout R${price.toFixed(2)}.`}
          onPress={() =>
            router.navigate({
              pathname: "/(stacks)/checkout",
              params: {
                id: id,
              },
            })
          }
          Icon={
            <MaterialIcons
              name="shopping-cart-checkout"
              size={24}
              color={COLORS.white}
            />
          }
          style={{
            backgroundColor: COLORS.tertiary,
            width: "100%",
          }}
        />
        <Text
          style={{
            fontFamily: FONTS.bold,
            color: COLORS.secondary,
            textTransform: "uppercase",
            marginTop: 10,
          }}
        >
          {delivery}{" "}
        </Text>
      </Card>
    </Animated.View>
  );
};

export default CheckoutComponent;
