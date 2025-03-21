import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import * as Linking from "expo-linking"; // ✅ Import Linking để xử lý Google Login Redirect
import { TouchableWithoutFeedback, Keyboard } from "react-native";

import { GOOGLE_LOGIN, LOGIN_USER, FORGOT_PASSWORD, RESET_PASSWORD } from "../api/apiconfig";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);

  useEffect(() => {
    // 📌 Xử lý khi app nhận URL Redirect từ Google Login
    const handleDeepLink = async (event: Linking.EventType) => {
      const { url } = event;
      const parsedUrl = Linking.parse(url); // Sử dụng Linking.parse() thay vì new URL()
      const token = Array.isArray(parsedUrl.queryParams?.token) ? parsedUrl.queryParams?.token[0] : parsedUrl.queryParams?.token;
      const username = Array.isArray(parsedUrl.queryParams?.username) ? parsedUrl.queryParams?.username[0] : parsedUrl.queryParams?.username;
      const email = Array.isArray(parsedUrl.queryParams?.email) ? parsedUrl.queryParams?.email[0] : parsedUrl.queryParams?.email;

      if (token && username && email) {
        const user = { username, email, token };
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("authToken", token);

        Alert.alert("Thành công", "Đăng nhập Google thành công!");
        router.replace("/profile");
      }
    };

    // ✅ Đăng ký lắng nghe URL Redirect
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // ✅ Hủy đăng ký khi component unmount
    return () => {
      subscription.remove();
    };
  }, []);

  // 📌 Xử lý đăng nhập bằng API
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(LOGIN_USER, { email, password });
      if (response.data && response.data.token) {
        const user = {
          username: response.data.username,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber || "",
          token: response.data.token,
        };
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("authToken", response.data.token);
        // Chuyển đến trang Profile
        router.replace("/profile");
      } else {
        Alert.alert("Lỗi", "Không nhận được token từ server!");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Xử lý đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    const googleAuthUrl = GOOGLE_LOGIN;
    const supported = await Linking.canOpenURL(googleAuthUrl);

    if (supported) {
      await Linking.openURL(googleAuthUrl); // Mở trang đăng nhập Google
    } else {
      Alert.alert("Lỗi", "Không thể mở trang Google Login");
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // 📌 Xử lý quên mật khẩu
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email để nhận mã OTP!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(FORGOT_PASSWORD, { email });
      Alert.alert("Thành công", response.data.message);
      setShowForgotPasswordModal(false);
      setShowResetPasswordForm(true); // Hiển thị form reset mật khẩu
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý reset mật khẩu
  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã OTP và mật khẩu mới!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(RESET_PASSWORD, { email, otp, newPassword });
      Alert.alert("Thành công", response.data.message);
      setShowResetPasswordForm(false); // Đóng form reset mật khẩu
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng Nhập</Text>}
          </TouchableOpacity>

          {/* Quên mật khẩu */}
          <TouchableOpacity onPress={() => setShowForgotPasswordModal(true)}>
            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          {/* Modal Quên Mật Khẩu */}
          <Modal
            transparent={true}
            visible={showForgotPasswordModal}
            animationType="fade"
            onRequestClose={() => setShowForgotPasswordModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Quên mật khẩu</Text>
                <Text style={styles.modalText}>Vui lòng nhập email để nhận mã OTP đặt lại mật khẩu.</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleForgotPassword}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Gửi OTP</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelfgButton}
                  onPress={() => setShowForgotPasswordModal(false)}
                >
                  <Text style={styles.cancelfgButtonText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Modal Đặt Lại Mật Khẩu */}
          <Modal
            transparent={true}
            visible={showResetPasswordForm}
            animationType="slide"
            onRequestClose={() => setShowResetPasswordForm(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Đặt lại mật khẩu</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Mã OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Mật khẩu mới"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelfgButton}
                  onPress={() => setShowResetPasswordForm(false)}
                >
                  <Text style={styles.cancelfgButtonText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
            <TouchableOpacity style={styles.socialIcon} onPress={handleGoogleLogin}>
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
    </TouchableWithoutFeedback>
  );
}

// 🎨 **Styles**
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
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#333", 
    marginBottom: 20 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 9,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  icon: { 
    marginRight: 10 
  },
  input: { 
    flex: 1, 
    height: 50, 
    fontSize: 16, 
    color: "#333" 
  },
  button: {
    width: "90%",
    backgroundColor: "#ff758c",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  forgotPassword: { 
    marginTop: 10, 
    fontSize: 14, 
    color: "#ff758c", 
    textDecorationLine: "underline" 
  },
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
  cancelfgButton: {
    marginTop: 10,
  },
  cancelfgButtonText: {
    color: "#777",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  modalInput: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 9,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    color: "#333",
  },
});