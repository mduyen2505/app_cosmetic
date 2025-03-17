import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import ProductCard from "./ProductCard";
import { FEATURED_PRODUCTS, WISHLIST } from "../api/apiconfig";
interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  promotionPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 🟢 Gọi API lấy sản phẩm nổi bật và wishlist
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(FEATURED_PRODUCTS);
        const data = await response.json();
        setProducts(data.data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm nổi bật:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      try {
        const response = await fetch(WISHLIST, {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setWishlist(data.wishlist || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách yêu thích:", error);
      }
    };

    fetchProducts();
    fetchWishlist();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Featured Products</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ff758c" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard product={item} initialFavorite={wishlist.includes(item._id)} />
          )}
        />
      )}
    </View>
  );
};

// 🎨 **Styles**
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

export default FeaturedProducts;
