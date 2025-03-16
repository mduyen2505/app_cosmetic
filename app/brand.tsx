import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // ✅ Lấy params & điều hướng
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard"; // ✅ Dùng lại ProductCard

// 🔥 Dữ liệu giả lập thương hiệu
const dummyBrands = {
  "1": {
    id: "1",
    title: "L'Oreal",
    image: "https://example.com/loreal.png",
    description: "L'Oreal - thương hiệu mỹ phẩm hàng đầu thế giới.",
  },
  "2": {
    id: "2",
    title: "Cocoon",
    image: "https://example.com/cocoon.png",
    description: "Cocoon - mỹ phẩm thiên nhiên an toàn cho da.",
  },
};

// 🔥 Dữ liệu giả lập sản phẩm
const dummyProducts = Array.from({ length: 20 }, (_, index) => ({
  id: index.toString(),
  name: `Sản phẩm ${index + 1}`,
  price: 200000 + index * 10000,
  discount: index % 2 === 0 ? 15 : 0,
  promotionPrice: 200000 + index * 10000 - 15000,
  rating: Math.floor(Math.random() * 5) + 1,
  reviewCount: Math.floor(Math.random() * 50),
  image: "https://via.placeholder.com/150",
}));

const BrandScreen = () => {
  const { brandId } = useLocalSearchParams();
  const router = useRouter(); // ✅ Điều hướng quay lại

  if (!brandId) {
    return <Text>Không tìm thấy thương hiệu!</Text>;
  }

  // Lấy dữ liệu thương hiệu
  const brand = dummyBrands[brandId as keyof typeof dummyBrands];
  const [products, setProducts] = useState(dummyProducts);
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" /> 

      {/* 🔥 Header có nút quay lại */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
       
      </View>

      <View style={styles.container}>
        {/* 🔥 Hiển thị thông tin thương hiệu */}
        {brand && (
          <View style={styles.brandHeader}>
            <Image source={{ uri: brand.image }} style={styles.brandLogo} />
            <View style={styles.brandInfo}>
              <Text style={styles.brandTitle}>{brand.title}</Text>
              <Text style={styles.brandDescription}>{brand.description}</Text>
            </View>
          </View>
        )}

        {/* 🔥 Hiển thị danh sách sản phẩm */}
        {loading ? (
          <ActivityIndicator size="large" color="#ff758c" />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row} // ✅ Căn đều các cột
            renderItem={({ item }) => <ProductCard product={item} />}
            showsVerticalScrollIndicator={false} // ✅ Ẩn thanh trượt
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// 🎨 **Styles**
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    width: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    paddingHorizontal: 25, // ✅ Căn đều hai bên
  },
  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#E8E8E8", // ✅ Màu nền nổi bật hơn
    borderRadius: 10,
    marginBottom: 15,
  },
  brandLogo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginRight: 15,
  },
  brandInfo: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  brandDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  row: {
    justifyContent: "space-between",
  },
});

export default BrandScreen;
