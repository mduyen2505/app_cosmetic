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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import { getCoupons, ALL_PRODUCTS } from "../api/apiconfig";

// ✅ Định nghĩa kiểu dữ liệu voucher
interface Voucher {
  _id: string;
  image: string;
  discount: number;
  description: string;
  expiry: string;
}

// ✅ Định nghĩa kiểu dữ liệu sản phẩm
interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  promotionPrice?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
}

const PromoScreen = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Gọi API lấy danh sách voucher từ `getCoupons`
        const voucherRes = await fetch(getCoupons);
        const voucherData = await voucherRes.json();
        setVouchers(voucherData.data || []);

        // ✅ Gọi API lấy danh sách sản phẩm giảm giá
        const productRes = await fetch(ALL_PRODUCTS); // Sử dụng ALL_PRODUCTS để lấy tất cả sản phẩm
        const productData = await productRes.json();
        const discountedProducts = Array.isArray(productData)
        ? productData.filter((product) => product.discount && product.discount > 0)
        : [];
      setProducts(discountedProducts);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <Text style={styles.headerTitle}>Ưu Đãi</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* 🔹 Tiêu đề Voucher */}
        <Text style={styles.voucherTitle}>🎉 ƯU ĐÃI ĐẶC BIỆT 🎉</Text>

        {/* 🔹 Danh sách Voucher */}
        <FlatList
          horizontal
          data={vouchers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.voucherCard}>
              <Image source={{ uri: `http://172.20.10.4:3000/images/${item.image}` }} style={styles.voucherLogo} />
              <Text style={styles.voucherDiscount}>Giảm {item.discount}%</Text>
              <Text style={styles.voucherDescription}>{item.description}</Text>
              <Text style={styles.voucherExpiry}>Hết hạn: {new Date(item.expiry).toLocaleDateString()}</Text>
            </View>
          )}
          contentContainerStyle={styles.voucherContainer}
        />

        {/* 🔹 Tiêu đề Sản phẩm */}
        <Text style={styles.productTitle}>🔥 SẢN PHẨM GIẢM GIÁ 🔥</Text>

        {/* 🔹 Danh sách Sản phẩm */}
        {products.length > 0 ? (
          <FlatList
            data={products}
            numColumns={2}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <ProductCard product={item} />}
            contentContainerStyle={styles.productsContainer}
          />
        ) : (
          <Text style={{ textAlign: "center", fontSize: 16, color: "#888", marginVertical: 20 }}>
            Không có sản phẩm giảm giá nào.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ✅ CSS cho React Native
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
  backButton: { padding: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
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
    flexShrink: 1,
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
