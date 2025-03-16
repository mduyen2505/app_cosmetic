import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router"; // ✅ Sử dụng useLocalSearchParams()

const dummyProducts = [
  {
    id: "1",
    name: "Sản phẩm dưỡng da",
    image: "https://via.placeholder.com/400",
    price: 300000,
    discount: 20,
    promotionPrice: 240000,
    description: "Sản phẩm giúp dưỡng ẩm và làm sáng da.",
    averageRating: 4.5,
    totalReviews: 12,
    ingredients: "Vitamin C, Hyaluronic Acid, Niacinamide.",
    usageInstructions: "Thoa nhẹ lên mặt sau khi rửa sạch da.",
  },
];

export default function ProductDetail() {
    const params = useLocalSearchParams(); // ✅ Lấy tham số từ URL
    const productId = params.productId;
  const product = dummyProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Sản phẩm không tồn tại!</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <View style={styles.infoBox}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>{product.promotionPrice.toLocaleString()}₫</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 15 },
  productImage: { width: "100%", height: 300, resizeMode: "contain" },
  infoBox: { paddingVertical: 10 },
  productName: { fontSize: 20, fontWeight: "bold" },
  price: { fontSize: 18, fontWeight: "bold", color: "#ff758c", marginVertical: 10 },
  description: { fontSize: 14, color: "#555" },
});
