import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ProductCard from "./ProductCard";

// Dữ liệu giả lập danh sách sản phẩm
const products = [
    { id: "1", name: "Serum dưỡng da", image: "https://example.com/serum.png", price: 300000, promotionPrice: 250000, discount: 17, rating: 4.5, reviewCount: 120 },
    { id: "2", name: "Kem chống nắng", image: "https://example.com/sunscreen.png", price: 250000, promotionPrice: 220000, discount: 12, rating: 5, reviewCount: 90 },
    { id: "3", name: "Sữa rửa mặt", image: "https://example.com/cleanser.png", price: 200000, promotionPrice: 180000, discount: 10, rating: 3.8, reviewCount: 45 },
    { id: "4", name: "Mặt nạ dưỡng", image: "https://example.com/mask.png", price: 150000, promotionPrice: 130000, discount: 13, rating: 4.2, reviewCount: 60 },
  ];
  
  export default function ProductList({ title }: { title: string }) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{title}</Text>
  
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          horizontal // ✅ Hiển thị sản phẩm dạng trượt ngang
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      </View>
    );
  }
  
  // Styles
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 15,
      paddingLeft: 10,
    },
    header: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#333",
    },
  });