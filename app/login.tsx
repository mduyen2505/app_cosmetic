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
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Xử lý đăng nhập
  const handleLogin = async () => {
    if (email === "admin@example.com" && password === "123456") {
      await AsyncStorage.setItem("authToken", "fake-token");
      router.replace("/profile"); // Chuyển đến Profile sau khi đăng nhập
    } else {
      Alert.alert("Sai thông tin", "Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Ảnh Logo */}
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />

        <Text style={styles.title}>Đăng Nhập</Text>

        {/* Ô nhập Email */}
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="#999" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Ô nhập mật khẩu */}
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#999" style={styles.icon} />
          <TextInput
            placeholder="Mật khẩu"
            style={styles.input}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>

        {/* Nút đăng nhập */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </TouchableOpacity>

        {/* Quên mật khẩu */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
        </TouchableOpacity>

     {/* Hoặc đăng nhập bằng */}
<View style={styles.separatorContainer}>
  <View style={styles.separatorLine} />
  <Text style={styles.separatorText}>or continue with</Text>
  <View style={styles.separatorLine} />
</View>

<View style={styles.socialIcons}>
  <TouchableOpacity style={styles.socialIcon}>
    <Image source={require("../assets/images/facebook.png")} style={styles.iconImage} />
  </TouchableOpacity>
  <TouchableOpacity style={styles.socialIcon}>
    <Image source={require("../assets/images/google.jpg")} style={styles.iconImage} />
  </TouchableOpacity>
  <TouchableOpacity style={styles.socialIcon}>
    <Image source={require("../assets/images/apple.png")} style={styles.iconImage} />
  </TouchableOpacity>
</View>

{/* Chưa có tài khoản? Đăng ký ngay */}
<View style={styles.registerContainer}>
  <Text style={styles.registerText}>Don't have an account?</Text>
  <TouchableOpacity onPress={() => router.push("/register")}>
    <Text style={styles.registerButtonText}>Register</Text>
  </TouchableOpacity>
</View>

      </View>
    </SafeAreaView>
  );
}

// 🎨 **Styles**
const styles = StyleSheet.create({

    separatorContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "80%",
      marginVertical: 20,
    },
    separatorLine: {
      flex: 1,
      height: 1,
      backgroundColor: "#ddd",
    },
    separatorText: {
      fontSize: 14,
      color: "#999",
      marginHorizontal: 10,
    },
    socialIcons: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 20,
    },
    socialIcon: {
      backgroundColor: "#fff",
      padding: 12,
      marginHorizontal: 10,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: "#ddd",
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    iconImage: {
      width: 30,
      height: 30,
      resizeMode: "contain",
    },
    registerContainer: {
      flexDirection: "row",
      marginTop: 20,
    },
    registerText: {
      fontSize: 14,
      color: "#999",
    },
    registerButtonText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#ff758c",
      marginLeft: 5,
    },
  
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
   title: { fontSize: 26, fontWeight: "bold", color: "#333", marginBottom: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 9,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1

  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: "#333" },
  button: {
    width: "90%",
    backgroundColor: "#ff758c",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  forgotPassword: { marginTop: 10, fontSize: 14, color: "#ff758c", textDecorationLine: "underline" },
  socialText: { marginTop: 15, fontSize: 14, color: "#555" },
  
  facebook: { backgroundColor: "#3b5998" },
  google: { backgroundColor: "#DB4437" },
  twitter: { backgroundColor: "#1DA1F2" },
  linkedin: { backgroundColor: "#0077b5" },
  
});

