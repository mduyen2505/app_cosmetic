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
  <MaterialIcons name="close" size={24} color="#ff758c" />  {/* ✅ Đổi thành icon X */}
</TouchableOpacity>


              <ScrollView>
                {categories.map((category) => (
                  <View key={category.id} style={styles.categoryContainer}>
                    <TouchableOpacity
                      style={styles.category}
                      onPress={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    >
                      <Text style={styles.categoryText}>{category.name}</Text>
                      <MaterialIcons
    name={expandedCategory === category.id ? "keyboard-arrow-down" : "keyboard-arrow-right"}
    size={18}
    color="black"
  />                    </TouchableOpacity>

                    {expandedCategory === category.id &&
                      category.subcategories.map((sub) => (
                        <Text key={sub} style={styles.subcategory}>
                          {sub}
                        </Text>
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
    zIndex: 999, // Ensure overlay is above all other components
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    elevation: 10, // Ensure sidebar is above other content
    zIndex: 1000, // ✅ Đảm bảo Sidebar nằm trên cùng
  },
  closeButton: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  closeText: {
    fontSize: 16,
    color: "#ff758c",
  },
  categoryContainer: {
    marginBottom: 15,
  },
  category: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
