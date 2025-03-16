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
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native"; // ✅ Import RouteProp
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard"; // ✅ Sử dụng lại ProductCard
import { getProductsBySubcategory } from "../api/apiconfig"; // ✅ Import API

// 🟢 Định nghĩa ParamList cho React Navigation
type RootStackParamList = {
  SubCategoryScreen: { subCategoryId: string , subCategoryName: string};
};

// 🟢 Cập nhật kiểu route prop
type SubCategoryScreenRouteProp = RouteProp<RootStackParamList, "SubCategoryScreen">;

// 🟢 Định nghĩa kiểu dữ liệu sản phẩm từ API
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

const SubCategoryScreen = () => {
  const route = useRoute<SubCategoryScreenRouteProp>(); // ✅ Sử dụng RouteProp đúng kiểu
  const navigation = useNavigation();
  const { subCategoryId, subCategoryName } = route.params || {}; // ✅ Nhận thêm subCategoryName

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 10;

  // 🟢 Gọi API lấy danh sách sản phẩm theo danh mục con
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiUrl = getProductsBySubcategory(subCategoryId);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm theo danh mục con:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subCategoryId]);

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
        <Text style={styles.headerTitle}>{subCategoryName || "Danh mục con"}</Text> {/* ✅ Hiển thị tên */}
        <View style={{ width: 40 }} /> {/* Giữ khoảng trống để căn giữa tiêu đề */}
      </View>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#ff758c" />
        ) : (
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

export default SubCategoryScreen;
