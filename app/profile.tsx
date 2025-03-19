import React, { useState, useEffect, } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { GET_USER_INFO } from "../api/apiconfig";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; email: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // ✅ Lấy thông tin người dùng từ API
  useFocusEffect(
    useCallback(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Alert.alert("Lỗi", "Bạn cần đăng nhập để xem thông tin cá nhân.");
          router.replace("/login");
          return;
        }

        const response = await axios.get(GET_USER_INFO, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          setUser({
            username: response.data.data.username,
            email: response.data.data.email,
          });

          await AsyncStorage.setItem(
            "user",
            JSON.stringify(response.data.data)
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [])
);
  // ✅ Xử lý đăng xuất
  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("authToken");
          router.replace("/login");
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="black" />;
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
    <Ionicons name="arrow-back-outline" size={28} color="black" />
  </TouchableOpacity>
  <View style={styles.headerTitleContainer}>
    <Text style={styles.headerTitle}>PROFILE</Text>
  </View>
</View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Hồ sơ người dùng */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user ? user.username : " UNKNOW"}
            </Text>
            <Text style={styles.userEmail}>
              {user ? user.email : "UNKNOW@gmail.com"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editProfile}
            onPress={() => router.push("/update_info")}
          >
            <MaterialCommunityIcons name="account-edit" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Danh sách menu */}
        <View style={styles.menu}>
          <MenuItem
            icon="information-circle-outline"
            title="Thông tin cá nhân"
            onPress={() => router.push("/information")}
          />
          <MenuItem
            icon="receipt-outline"
            title="Trạng thái đơn hàng"
            onPress={() => router.push("/order_status")}
          />
          <MenuItem
            icon="log-out-outline"
            title="Đăng xuất"
            color="red"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Component MenuItem
const MenuItem: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  color?: string;
  onPress?: () => void;
}> = ({ icon, title, color = "#333", onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={[styles.menuText, { color }]}>{title}</Text>
    <Ionicons name="chevron-forward" size={24} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20 },
  profileCard: {
    backgroundColor: "#ff758c",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  userEmail: { fontSize: 14, color: "#fff" },
  editProfile: {
    position: "absolute",
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 8,
    borderRadius: 20,
  },
  menu: { marginTop: 30 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  
  backButton: {
    padding: 10,
  },
  
  headerTitleContainer: {
    flex: 1, // Để phần tiêu đề tự động căn giữa
    alignItems: "center",
    justifyContent: "center",
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  
  menuText: { flex: 1, fontSize: 16, marginLeft: 15 },
});

