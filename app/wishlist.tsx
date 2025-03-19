import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import ProductCard from "../components/ProductCard"; // ✅ Import ProductCard
import { WISHLIST } from "../api/apiconfig"; // ✅ API lấy danh sách yêu thích
import { useFocusEffect } from "@react-navigation/native";

export default function WishlistScreen() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set()); // ✅ Lưu danh sách ID yêu thích
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Lấy danh sách yêu thích từ API khi vào trang
  useFocusEffect(
    React.useCallback(() => {
      fetchWishlist();
    }, [])
  );

  const fetchWishlist = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Lỗi", "Bạn cần đăng nhập để xem danh sách yêu thích.");
        router.replace("/login");
        return;
      }

      const response = await axios.get(WISHLIST, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.wishlist) {
        setWishlist(response.data.wishlist);
        setWishlistIds(new Set(response.data.wishlist.map((item: any) => item._id))); // ✅ Lưu ID yêu thích
      } else {
        setWishlist([]);
        setWishlistIds(new Set());
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích:", error);
      setWishlist([]);
      setWishlistIds(new Set());
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xóa sản phẩm khỏi danh sách yêu thích và cập nhật UI toàn bộ ứng dụng
  const removeFromWishlist = async (productId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      await axios.delete(`${WISHLIST}/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId },
      });

      // ✅ Cập nhật danh sách toàn bộ ứng dụng
      fetchWishlist();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi danh sách yêu thích:", error);
      Alert.alert("Lỗi", "Không thể xóa sản phẩm khỏi danh sách yêu thích.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff758c" />
        <Text>Đang tải danh sách yêu thích...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách yêu thích</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Danh sách yêu thích */}
      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn chưa có sản phẩm yêu thích nào.</Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              isFavorite={wishlistIds.has(item._id)} // ✅ Luôn hiển thị trái tim màu đỏ
              onRemoveFavorite={() => removeFromWishlist(item._id)} // ✅ Thêm chức năng xóa
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

// 🎨 **Styles**
const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    elevation: 3,
  },
  backButton: { padding: 10 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 16, color: "#777" },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
});
