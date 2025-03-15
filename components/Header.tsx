import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { StatusBar } from "expo-status-bar";

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <SafeAreaView style={styles.safeArea}> {/* Tránh bị che bởi thanh trạng thái */}
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Nút mở Sidebar */}
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>

        {/* Thanh tìm kiếm */}
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.search} 
            placeholder="Tìm kiếm sản phẩm..." 
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Ionicons name="search" size={20} color="pink" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ff758c", // Giữ màu nền đồng nhất với header
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 80,
    backgroundColor: "#ff758c",
    elevation: 5,
  },
  menuButton: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 10,
    width: "80%", // Tăng chiều dài thanh tìm kiếm
  },
  search: {
    height: 40,
    flex: 1,
  },
  searchIcon: {
    padding: 5,
  },
});
