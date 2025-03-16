import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import ProductCard from "../components/ProductCard"; // ✅ Import component
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type SubCategoryScreenRouteProp = RouteProp<{ SubCategoryScreen: { subCategoryId: string } }, "SubCategoryScreen">;

const dummyProducts = Array.from({ length: 30 }, (_, index) => ({
  id: index.toString(),
  name: `Sản phẩm con ${index + 1}`,
  price: 50000 + index * 2000,
  discount: index % 3 === 0 ? 15 : 0,
  promotionPrice: 50000 + index * 2000 - 5000,
  rating: Math.floor(Math.random() * 5) + 1,
  reviewCount: Math.floor(Math.random() * 50),
  image: "https://via.placeholder.com/150",
}));

const SubCategoryScreen = () => {
  const route = useRoute<SubCategoryScreenRouteProp>();
  const navigation = useNavigation();
  const { subCategoryId } = route.params || {}; // ✅ Tránh lỗi nếu `params` bị undefined
  const [products, setProducts] = useState(dummyProducts);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* ✅ Header với nút quay lại */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh mục con: {subCategoryId}</Text>
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
                  onPress={() => setCurrentPage((prev) => prev - 1)}
                  style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                >
                  <Text style={styles.pageText}>Trước</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={currentPage === totalPages}
                  onPress={() => setCurrentPage((prev) => prev + 1)}
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

export default SubCategoryScreen;
