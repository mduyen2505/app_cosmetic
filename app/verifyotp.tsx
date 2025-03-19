import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { VERIFY_OTP } from "../api/apiconfig"; // 🔹 Thay bằng API thực tế
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerifyOtpScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string }>();
  const [email, setEmail] = useState<string | null>(params.email);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpExpired, setOtpExpired] = useState(false);

  useEffect(() => {
    const getEmailFromStorage = async () => {
      if (!email) {
        const storedEmail = await AsyncStorage.getItem('emailForOtp');
        if (storedEmail) {
          setEmail(storedEmail);
          console.log("Email từ AsyncStorage:", storedEmail);
        } else {
          console.log("Không tìm thấy email trong AsyncStorage");
        }
      } else {
        console.log("Email từ params:", email);
      }
    };

    getEmailFromStorage();
  }, []);

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      console.log("📤 Gửi yêu cầu xác thực OTP:", { email, otp });

      const response = await axios.post(VERIFY_OTP, { email, otp });

      console.log("✅ Phản hồi từ server:", response.data);

      if (response.data.message === "Xác thực thành công") {
        Alert.alert("✅ Xác thực thành công!", "Bạn đã đăng ký thành công.", [
          { text: "OK", onPress: () => router.push("/login") },
        ]);
      } else {
        setErrorMessage(response.data.message || "OTP không chính xác. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("❌ Lỗi xác thực OTP:", error.response?.data || error.message);

      let errorMsg = "Có lỗi xảy ra, vui lòng thử lại.";
      if (error.response?.status === 400) {
        errorMsg = error.response?.data?.message || "OTP không hợp lệ.";
        if (errorMsg.includes("OTP đã hết hạn")) {
          setOtpExpired(true);
          errorMsg = "OTP đã hết hạn. Vui lòng yêu cầu gửi lại.";
        }
      } else if (error.response?.status === 500) {
        errorMsg = "Lỗi hệ thống, vui lòng thử lại sau.";
      }

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Xác Thực OTP</Text>

        <TextInput
          style={styles.input}
          placeholder="Nhập OTP"
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Đang xử lý..." : "Xác Thực"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { width: "80%", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#ff758c", padding: 15, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  errorText: { color: "red", marginTop: 10, textAlign: "center" },
  resendButton: { marginTop: 10 },
  resendButtonText: { color: "#ff758c", fontWeight: "bold" },
});

export default VerifyOtpScreen;