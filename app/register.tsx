import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";

import { REGISTER_USER } from "../api/apiconfig";
export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setLoading(true);

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(REGISTER_USER, {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        resPassword: formData.confirmPassword.trim(),
      });

      if (response.data.message.includes("OTP sent")) {
        Alert.alert("OTP đã gửi!", "Vui lòng kiểm tra email của bạn.");
        router.push({ pathname: "/verifyotp", params: { email: formData.email } });
      } else {
        Alert.alert("Lỗi", "Không thể gửi OTP. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("❌ Lỗi đăng ký:", error.response?.data || error.message);
      Alert.alert("Lỗi", error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Create Your Account</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#888" />
          <TextInput placeholder="Tên người dùng" style={styles.input} onChangeText={(value) => handleChange("username", value)} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" />
          <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" onChangeText={(value) => handleChange("email", value)} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" />
          <TextInput placeholder="Mật khẩu" style={styles.input} secureTextEntry={!showPassword} onChangeText={(value) => handleChange("password", value)} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" />
          <TextInput placeholder="Nhập lại mật khẩu" style={styles.input} secureTextEntry={!showPassword} onChangeText={(value) => handleChange("confirmPassword", value)} />
        </View>

        <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Gửi OTP</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    marginTop: -100,
    width: 250,
    height: 250,
    marginBottom: -20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 15,
    paddingVertical: 15,

    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Hiệu ứng nổi
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#ff758c",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginPrompt: {
    marginTop: 20,
    fontSize: 14,
    color:"#555"
},

loginContainer: {
  flexDirection: "row",
  marginTop: 20,
},
loginText: {
  fontSize: 14,
  color: "#999",
},
loginLink: {
  fontSize: 14,
  fontWeight: "bold",
  color: "#ff758c",
  marginLeft: 5,
},
}
);

