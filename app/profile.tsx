import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // ✅ Dùng expo-router để điều hướng

export default function ProfileScreen() {
  const router = useRouter(); // ✅ Sử dụng router thay vì navigation

  // ✅ Trạng thái cài đặt
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(false);
  const SettingSwitch: React.FC<{ title: string; value: boolean; onToggle: () => void }> = ({ title, value, onToggle }) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingText}>{title}</Text>
      <Switch value={value} onValueChange={onToggle} thumbColor={value ? "#ff758c" : "#ccc"} />
    </View>
  );
  

  // ✅ Xử lý đăng xuất
  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("authToken"); // Xóa token
          router.replace("/login"); // ✅ Chuyển hướng sang trang đăng nhập
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔹 Hồ sơ người dùng */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }} // 🔥 Ảnh đại diện giả lập
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Nguyen Tan Dung</Text>
            <Text style={styles.userEmail}>dung@gmail.com</Text>
          </View>
          <TouchableOpacity style={styles.editProfile}>
            <MaterialCommunityIcons name="account-edit" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Các tùy chọn */}
        <View style={styles.menu}>
          <MenuItem icon="information-outline" title="Information" />
          <MenuItem icon="package-variant-closed" title="Order status" />
          <MenuItem icon="credit-card-outline" title="Payment Info" />
          <MenuItem icon="account-remove-outline" title="Delete Account" />
          <MenuItem icon="log-out" title="Logout" color="red" onPress={handleLogout} />
          </View>

        {/* 🔹 Cài đặt ứng dụng */}
        <Text style={styles.settingsHeader}>App Settings</Text>
        <View style={styles.settings}>
          <SettingSwitch
            title="Face ID or Fingerprint for Log In"
            value={faceIdEnabled}
            onToggle={() => setFaceIdEnabled(!faceIdEnabled)}
          />
          <SettingSwitch
            title="Enable Push Notifications"
            value={pushNotifications}
            onToggle={() => setPushNotifications(!pushNotifications)}
          />
          <SettingSwitch
            title="Enable Location Services"
            value={locationServices}
            onToggle={() => setLocationServices(!locationServices)}
          />
        </View>
      </ScrollView>

      {/* 🔹 Nút tròn nổi */}
      <TouchableOpacity style={styles.floatingButton}>
        <Ionicons name="settings-outline" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ✅ Component menu item
const MenuItem: React.FC<{ icon: keyof typeof Ionicons.glyphMap; title: string; color?: string; onPress?: () => void }> = ({ icon, title, color = "#333", onPress }) => (
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
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    position: "relative",
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  userEmail: { fontSize: 14, color: "#fff" },
  editProfile: {
    position: "absolute",
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 8,
    borderRadius: 20,
  },
  menu: { marginTop: 20 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { flex: 1, fontSize: 16, marginLeft: 15, color: "#333" },
  settingsHeader: { fontSize: 18, fontWeight: "bold", marginTop: 25 },
  settings: { marginTop: 10 },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ff758c",
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
});

