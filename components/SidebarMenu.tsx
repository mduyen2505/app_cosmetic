import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ✅ Sử dụng Expo Router để điều hướng
import { CATEGORIES, SUBCATEGORIES } from "../api/apiconfig";

// Định nghĩa kiểu dữ liệu cho danh mục
interface Category {
  _id: string;
  Type_name?: string; // ✅ Dữ liệu từ API có thể có `Type_name`
  name?: string; // ✅ Dữ liệu sau khi format sẽ có `name`
}

// Định nghĩa kiểu dữ liệu cho danh mục con
interface Subcategory {
  _id: string;
  name: string;
  typeId: { _id: string }; // ID của danh mục cha
}

export default function SidebarMenu({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]); // ✅ Lưu danh mục chính
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory[]>>({}); // ✅ Lưu danh mục con theo dạng { categoryId: [subcategories] }
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const translateX = new Animated.Value(isOpen ? 0 : -250);
  const router = useRouter(); // ✅ Hook điều hướng của Expo Router

  // Hiệu ứng mở sidebar
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -250,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  // Fetch danh mục chính
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories from:", CATEGORIES);
        const response = await fetch(CATEGORIES);
        if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);
  
        const data: Category[] = await response.json();
        
        // ✅ Đổi `Type_name` thành `name` để thống nhất
        const formattedCategories = data.map(cat => ({
          _id: cat._id,
          name: cat.Type_name // Dùng Type_name từ API
        }));
  
        console.log("Danh mục chính đã sửa:", formattedCategories);
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Lỗi khi tải danh mục chính:", error);
      }
    };
  
    fetchCategories();
  }, []);

  // Fetch danh mục con
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        console.log("Fetching subcategories from:", SUBCATEGORIES);
        const response = await fetch(SUBCATEGORIES);
        if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);

        const data: Subcategory[] = await response.json();
        console.log("Danh mục con nhận được:", data);

        // Chuyển danh mục con thành object { categoryId: [subcategories] }
        const formattedSubcategories = data.reduce((acc: Record<string, Subcategory[]>, sub) => {
          const parentId = sub.typeId._id; // Lấy ID danh mục cha
          if (!acc[parentId]) {
            acc[parentId] = [];
          }
          acc[parentId].push(sub);
          return acc;
        }, {});

        setSubcategories(formattedSubcategories);
      } catch (error) {
        console.error("Lỗi khi tải danh mục con:", error);
      }
    };

    fetchSubcategories();
  }, []);

  return (
    isOpen && (
      <TouchableWithoutFeedback onPress={toggleSidebar}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
              <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#ff758c" />
              </TouchableOpacity>

              <ScrollView>
  {categories.length === 0 ? (
    <Text style={{ padding: 20, textAlign: "center" }}>Không có danh mục nào</Text>
  ) : (
    categories.map((category) => (
      <View key={category._id} style={styles.categoryContainer}>
        <TouchableOpacity
          style={styles.category}
          onPress={() => {
            toggleSidebar();
            router.push(`/category?typeId=${category._id}`); // ✅ Điều hướng đến màn hình category
          }}
        >
<Text style={styles.categoryText}>{category.name}</Text> // ✅ ĐÚNG

          <TouchableOpacity
            onPress={() =>
              setExpandedCategory(expandedCategory === category._id ? null : category._id)
            }
          >
            <MaterialIcons
              name={expandedCategory === category._id ? "keyboard-arrow-down" : "keyboard-arrow-right"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Danh mục con */}
        {expandedCategory === category._id &&
          subcategories[category._id]?.map((sub) => (
            <TouchableOpacity
  key={sub._id}
  onPress={() => {
    toggleSidebar();
    router.push({
      pathname: "/subcategory",
      params: {
        subCategoryId: sub._id,
        subCategoryName: sub.name, // ✅ Truyền cả tên danh mục con
      },
    });
  }}
>
  <Text style={styles.subcategory}>{sub.name}</Text>
</TouchableOpacity>

          ))}
      </View>
    ))
  )}
</ScrollView>

            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    )
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: "200%",
    height: "350%",
    zIndex: 999,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 40,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    elevation: 10,
    zIndex: 1000,
  },
  closeButton: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  categoryContainer: {
    marginBottom: 15,
  },
  category: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ✅ Căn chỉnh để icon nằm cuối
    paddingVertical: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subcategory: {
    fontSize: 14,
    paddingLeft: 20,
    color: "#666",
    marginBottom: 10,
  },
});

