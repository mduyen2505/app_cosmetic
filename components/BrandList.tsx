import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Dữ liệu giả lập danh sách thương hiệu
const brands = [
  { id: "1", title: "L'Oreal", image: "https://example.com/loreal.png" },
  { id: "2", title: "Cocoon", image: "https://example.com/cocoon.png" },
  { id: "3", title: "La Roche-Posay", image: "https://example.com/laroche.png" },
  { id: "4", title: "Cetaphil", image: "https://example.com/cetaphil.png" },
  { id: "5", title: "Simple", image: "https://example.com/simple.png" },
  { id: "6", title: "Silcot", image: "https://example.com/silcot.png" },
  { id: "7", title: "JM Solution", image: "https://example.com/jmsolution.png" },
  { id: "8", title: "DHC", image: "https://example.com/dhc.png" },
  { id: "9", title: "Some By Mi", image: "https://example.com/somebymi.png" },
];

// Component hiển thị thương hiệu nhỏ gọn
const BrandItem = ({ item }: { item: { id: string; title: string; image: string } }) => {
  return (
    <View style={styles.brandContainer}>
      <Image source={{ uri: item.image }} style={styles.brandImage} />
      <Text style={styles.brandTitle}>{item.title}</Text>
    </View>
  );
};

export default function BrandList() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Brands</Text>

      <FlatList
        data={brands}
        keyExtractor={(item) => item.id}
        horizontal // ✅ Trượt ngang
        showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn
        renderItem={({ item }) => <BrandItem item={item} />}
      />
    </View>
  );
}

// CSS Styles
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: "#fff6f1",
    paddingLeft: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  brandContainer: {
    width: width * 0.25, // ✅ Nhỏ gọn theo tỷ lệ màn hình
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10, // ✅ Tạo khoảng cách giữa các item
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
  },
  brandImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  brandTitle: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
