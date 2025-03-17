import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // ✅ Điều hướng trang
import { Ionicons } from "@expo/vector-icons"; // ✅ Nút quay về
import ProductCard from "../components/ProductCard"; // ✅ Sử dụng lại component sản phẩm

// 🔹 Dữ liệu giả lập cho voucher (Ưu đãi đặc biệt)
const dummyVouchers = [
  {
    id: "1",
    image: "https://via.placeholder.com/100",
    discount: 10,
    description: "Giảm 10% cho đơn hàng trên 500,000 VND",
    expiry: "31/12/2025",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    discount: 20,
    description: "Giảm 20% khi mua trên 200,000 VND",
    expiry: "08/03/2025",
  },
  {
    id: "3",
    image: "https://via.placeholder.com/100",
    discount: 50,
    description: "Giảm 50% khi mua từ 700,000 VND",
    expiry: "21/05/2025",
  },
];

// 🔹 Dữ liệu giả lập cho sản phẩm giảm giá
const dummyProducts = Array.from({ length: 10 }, (_, index) => ({
  _id: String(index + 1),
  name: `Sản phẩm ${index + 1}`,
  image: "https://via.placeholder.com/150",
  discount: 10,
  price: 200000,
  promotionPrice: 180000,
  rating: Math.floor(Math.random() * 5) + 1,
  reviewCount: Math.floor(Math.random() * 50),
}));

const PromoScreen = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(dummyProducts);
  const [vouchers, setVouchers] = useState(dummyVouchers);
  const navigation = useNavigation();

  useEffect(() => {
    // 🔹 Giả lập thời gian tải dữ liệu
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff5722" />
        <Text style={styles.loadingText}>Đang tải ưu đãi...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* 🔹 Nút quay về */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {/* 🔹 Tiêu đề Voucher */}
        <Text style={styles.voucherTitle}>🎉 ƯU ĐÃI ĐẶC BIỆT 🎉</Text>

        {/* 🔹 Danh sách Voucher */}
        <FlatList
          horizontal
          data={vouchers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.voucherCard}>
              <Image source={{ uri: item.image }} style={styles.voucherLogo} />
              <Text style={styles.voucherDiscount}>Giảm {item.discount}%</Text>
              <Text style={styles.voucherDescription}>{item.description}</Text>
              <Text style={styles.voucherExpiry}>Hết hạn: {item.expiry}</Text>
            </View>
          )}
          contentContainerStyle={styles.voucherContainer}
        />

        {/* 🔹 Tiêu đề Sản phẩm */}
        <Text style={styles.productTitle}>🔥 SẢN PHẨM GIẢM GIÁ 🔥</Text>

        {/* 🔹 Danh sách Sản phẩm (Sử dụng lại ProductCard.tsx) */}
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={styles.productsContainer}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// 🔹 CSS cho React Native
const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },

  // 🔹 Header có nút quay về
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    elevation: 2, // ✅ Tạo hiệu ứng nổi cho header
  },
  backButton: {
    padding: 10,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25, // ✅ Căn đều hai bên
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#555" },

  // 🔹 Voucher Style
  voucherTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff5722",
    marginVertical: 20,
  },
  voucherContainer: { paddingHorizontal: 15 },
  voucherCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 8,
    width: 180,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 180, // ✅ Đảm bảo kích thước không thay đổi dù nội dung ngắn
  },
  voucherLogo: { width: 80, height: 50, resizeMode: "contain" },
  voucherDiscount: { fontSize: 16, fontWeight: "bold", marginVertical: 5 },
  voucherDescription: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    flexShrink: 1, // ✅ Giữ nguyên bố cục nếu text dài
  },
  voucherExpiry: { fontSize: 12, color: "#888", marginTop: 5 },

  // 🔹 Product Style
  productTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#008000",
    marginVertical: 20,
  },
  productsContainer: { paddingHorizontal: 15 },
});

export default PromoScreen;
