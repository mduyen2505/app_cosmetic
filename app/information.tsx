import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { GET_USER_INFO } from "../api/apiconfig";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function InformationScreen() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 📌 Lấy thông tin người dùng từ API khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const token = await AsyncStorage.getItem("authToken");
          if (!token) {
            setError("Bạn chưa đăng nhập!");
            setLoading(false);
            return;
          }

          const response = await axios.get(GET_USER_INFO, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data && response.data.data) {
            setUser({
              username: response.data.data.username,
              email: response.data.data.email,
              phoneNumber: response.data.data.phoneNumber || "",
              address: response.data.data.address || "",
            });

            await AsyncStorage.setItem("user", JSON.stringify(response.data.data));
          } else {
            setError("Không thể lấy thông tin người dùng.");
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          setError("Lỗi kết nối. Vui lòng thử lại!");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color="black" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#ff758c" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tên</Text>
              <TextInput style={styles.input} value={user.username} editable={false} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={user.email} editable={false} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput style={styles.input} value={user.phoneNumber} editable={false} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Địa chỉ</Text>
              <TextInput style={styles.input} value={user.address} editable={false} multiline={true} numberOfLines={4} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// 🎨 **Styles**
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 50, // Minimum height for the TextInput
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
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
});