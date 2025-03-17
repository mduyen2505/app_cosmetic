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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";



export default function RegisterScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Hiển thị/Ẩn mật khẩu
  const [loading, setLoading] = useState(false);

  // 📌 Xử lý nhập dữ liệu
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 Xử lý đăng ký (hiện tại là dữ liệu giả)
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

    // 🔹 Giả lập đăng ký thành công
    setTimeout(() => {
      Alert.alert("Thành công", "Bạn đã đăng ký thành công!");
      router.push("/login"); // Chuyển đến trang đăng nhập
    }, 1000);
  };


  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Logo */}
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />

        {/* Tiêu đề */}
        <Text style={styles.title}>Create Your Account </Text>

        {/* Trường nhập tên người dùng */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Tên người dùng"
            style={styles.input}
            value={formData.username}
            onChangeText={(value) => handleChange("username", value)}
          />
        </View>

        {/* Trường nhập email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
          />
        </View>

        {/* Trường nhập mật khẩu */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Mật khẩu"
            style={styles.input}
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Trường nhập lại mật khẩu */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Nhập lại mật khẩu"
            style={styles.input}
            secureTextEntry={!showPassword}
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange("confirmPassword", value)}
          />
        </View>

        {/* Nút gửi OTP */}
        <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Gửi OTP</Text>
          )}
        </TouchableOpacity>

        {/* Chuyển sang màn hình đăng nhập */}
         {/* 📌 Chuyển sang đăng nhập */}
         <View style={styles.loginContainer}>

         <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginLink}>Login </Text>
        </TouchableOpacity>
        </View>

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

