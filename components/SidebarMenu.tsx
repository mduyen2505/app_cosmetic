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

const categories = [
  { id: "1", name: "Làm Sạch Da", subcategories: ["Tẩy Trang Mặt", "Sữa Rửa Mặt", "Tẩy Tế Bào Chết Da Mặt", "Toner/Nước Cân Bằng Da"] },
  { id: "2", name: "Đặc Trị", subcategories: [] },
  { id: "3", name: "Dưỡng Ẩm", subcategories: [] },
  { id: "4", name: "Dụng Cụ/Phụ Kiện", subcategories: [] },
  { id: "5", name: "Dưỡng Mắt/Môi", subcategories: [] },
  { id: "6", name: "Chống Nắng", subcategories: [] },
  { id: "7", name: "Mặt Nạ", subcategories: [] },
  { id: "8", name: "Trang Điểm Mặt", subcategories: [] },
];

export default function SidebarMenu({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const translateX = new Animated.Value(isOpen ? 0 : -250);
  const router = useRouter(); // ✅ Hook điều hướng của Expo Router

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -250,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

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
                {categories.map((category) => (
                  <View key={category.id} style={styles.categoryContainer}>
                    <TouchableOpacity
                      style={styles.category}
                      onPress={() => {
                        toggleSidebar();
                        router.push(`/category?typeId=${category.id}`); // ✅ Điều hướng đến màn hình category
                      }}
                    >
                      <Text style={styles.categoryText}>{category.name}</Text>

                      <TouchableOpacity
                        onPress={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                      >
                        <MaterialIcons
                          name={expandedCategory === category.id ? "keyboard-arrow-down" : "keyboard-arrow-right"}
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>

                    {/* Danh mục con */}
                    {expandedCategory === category.id &&
                      category.subcategories.map((sub) => (
                        <TouchableOpacity
                          key={sub}
                          onPress={() => {
                            toggleSidebar();
                            router.push(`/subcategory?subCategoryId=${sub}`); // ✅ Điều hướng đến màn hình subcategory
                          }}
                        >
                          <Text style={styles.subcategory}>{sub}</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    )
  );
}

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

