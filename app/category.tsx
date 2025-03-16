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
import ProductCard from "../components/ProductCard";
import { useLocalSearchParams, useRouter } from "expo-router"; // ✅ Hook điều hướng
import { Ionicons } from "@expo/vector-icons";
import { getProductsByCategory } from "../api/apiconfig";

// Định nghĩa kiểu dữ liệu sản phẩm
interface Product {
  _id: string;
  name: string;
  price: number;
  discount: number;
  promotionPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
}

const CategoryScreen = () => {
  const { typeId } = useLocalSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
        try {
          if (!typeId) return;
          setLoading(true); // ✅ Bắt đầu loading khi typeId thay đổi
          setProducts([]); // ✅ Xóa danh sách sản phẩm cũ trước khi tải danh sách mới
    
          const apiUrl = getProductsByCategory(typeId.toString());
          console.log("Fetching products from:", apiUrl);
    
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);
    
          const data: Product[] = await response.json();
          setProducts(data); // ✅ Cập nhật danh sách sản phẩm mới
        } catch (error) {
          console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
        } finally {
          setLoading(false); // ✅ Kết thúc loading
        }
      };
    
      fetchProducts();
    }, [typeId]); // ✅ Mỗi khi typeId thay đổi, gọi lại API

  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (direction: "next" | "prev") => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* ✅ Header với nút quay lại */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh mục</Text>
        <View style={{ width: 40 }} /> {/* Chừa khoảng trống để căn giữa tiêu đề */}
      </View>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#ff758c" />
        ) : (
          <>
            <FlatList
              data={currentProducts}
              keyExtractor={(item) => item._id}
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
          </>
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
