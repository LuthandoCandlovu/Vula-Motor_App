import { COLORS } from "@/src/constants";
import { Rating } from "@kolking/react-native-rating";
import { View } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import Card from "../Card/Card";
import ContentLoader from "../ContentLoader/ContentLoader";

const ProductUserSkeleton = () => {
  return (
    <Animated.View
      entering={SlideInRight.duration(400).delay(400)}
      style={{
        marginVertical: 10,
      }}
    >
      <Card
        style={{
          maxWidth: 400,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            gap: 10,
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <ContentLoader style={{ width: 80, height: 80, borderRadius: 80 }} />
          <View style={{ flex: 1 }}>
            <ContentLoader
              style={{
                width: "80%",
                height: 20,
                marginBottom: 3,
                borderRadius: 3,
              }}
            />
            <ContentLoader
              style={{
                width: "100%",
                height: 10,
                marginBottom: 3,
                borderRadius: 3,
              }}
            />
            <Rating
              fillColor={COLORS.gray100}
              style={{}}
              size={15}
              rating={5}
              disabled
            />
          </View>
        </View>
        <ContentLoader
          style={{
            width: "50%",
            height: 15,
            marginBottom: 3,
            borderRadius: 3,
            alignSelf: "flex-end",
          }}
        />
      </Card>
    </Animated.View>
  );
};

export default ProductUserSkeleton;
