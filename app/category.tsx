import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import ProductCard from "../components/ProductCard"; // ✅ Import component
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type CategoryScreenRouteProp = RouteProp<{ CategoryScreen: { typeId: string } }, "CategoryScreen">;

const dummyProducts = Array.from({ length: 50 }, (_, index) => ({
  id: index.toString(),
  name: `Sản phẩm ${index + 1}`,
  price: 100000 + index * 5000,
  discount: index % 2 === 0 ? 10 : 0,
  promotionPrice: 100000 + index * 5000 - 10000,
  rating: Math.floor(Math.random() * 5) + 1,
  reviewCount: Math.floor(Math.random() * 100),
  image: "https://via.placeholder.com/150",
}));

const CategoryScreen = () => {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation();
  const { typeId } = route.params || {}; // ✅ Tránh lỗi nếu `params` bị undefined
  const [products, setProducts] = useState(dummyProducts);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const loadMoreProducts = async () => {
    setLoading(true);
    try {
      const newProducts = Array.from({ length: 10 }, (_, index) => ({
        id: `${products.length + index}`,
        name: `Sản phẩm mới ${index + 1}`,
        price: 100000 + index * 5000,
        discount: index % 2 === 0 ? 10 : 0,
        promotionPrice: 100000 + index * 5000 - 10000,
        rating: Math.floor(Math.random() * 5) + 1,
        reviewCount: Math.floor(Math.random() * 100),
        image: "https://via.placeholder.com/150",
      }));
      setProducts([...products, ...newProducts]);
    } catch (error) {
      console.error("Lỗi tải thêm sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (direction: "next" | "prev") => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      if (currentPage === totalPages - 1) {
        loadMoreProducts();
      }
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* ✅ Header với nút quay lại */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh mục: {typeId}</Text>
        <View style={{ width: 40 }} /> {/* Chừa khoảng trống để căn giữa tiêu đề */}
      </View>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#ff758c" />
        ) : (
          <FlatList
            data={currentProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row} // ✅ Căn chỉnh đều các cột
            renderItem={({ item }) => <ProductCard product={item} />}
            ListFooterComponent={
              <View style={styles.pagination}>
                <TouchableOpacity
                  disabled={currentPage === 1}
                  onPress={() => handlePageChange("prev")}
                  style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                >
                  <Text style={styles.pageText}>Trước</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={currentPage === totalPages}
                  onPress={() => handlePageChange("next")}
                  style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                >
                  <Text style={styles.pageText}>Tiếp</Text>
                </TouchableOpacity>
              </View>
            }
            showsVerticalScrollIndicator={false} // ✅ Ẩn thanh trượt
          />
        )}
      </View>
    </SafeAreaView>
  );
};

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
  row: {
    justifyContent: "space-between", // ✅ Căn đều giữa các cột sản phẩm
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  pageButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  pageText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});

export default CategoryScreen;
