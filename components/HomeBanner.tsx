import React, { useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const bannerData = [
  { id: "1", image: "https://theme.hstatic.net/200000150709/1001127896/14/slider_3.jpg?v=486" },
  { id: "2", image: "https://media.hcdn.vn/hsk/1735633480nuoc-hoahome3112.jpg" },
  { id: "3", image: "https://media.hcdn.vn/hsk/1735814257homexakho21.jpg" },
  { id: "4", image: "https://media.hcdn.vn/hsk/1735786059byshome21.jpg" },
];

const HomeBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({ item }: { item: typeof bannerData[0] }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={bannerData}
        renderItem={renderItem}
        width={width}
        height={200}
        loop
        autoPlay
        autoPlayInterval={3000}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        alignItems: "center",
        zIndex: 1, // ✅ Giảm `zIndex` để không che Sidebar
      },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
});

export default HomeBanner;
