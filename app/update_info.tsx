import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { GET_USER_INFO, UPDATE_USER_INFO } from "../api/apiconfig";
import { Ionicons } from "@expo/vector-icons";


// Định nghĩa kiểu dữ liệu
interface Location {
  code: number;
  name: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  // State cho địa chỉ
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState("province");
  const [modalData, setModalData] = useState<Location[]>([]);

  // ✅ Lấy thông tin người dùng khi vào trang
  useEffect(() => {
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
            phoneNumber: response.data.data.phoneNumber || "",
            address: response.data.data.address || "",
          });

          const parts = response.data.data.address?.split(", ") || [];
          setStreetAddress(parts[0] || "");
          setSelectedWard(parts[1] || "");
          setSelectedDistrict(parts[2] || "");
          setSelectedProvince(parts[3] || "");

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
    fetchProvinces();
  }, []);

  // ✅ Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const res = await axios.get("https://provinces.open-api.vn/api/p/");
      setProvinces(res.data);
    } catch (err) {
      console.error("Lỗi tải tỉnh/thành phố:", err);
    }
  };

  const handleOpenModal = (type: string) => {
    setCurrentSelection(type);
    if (type === "province") {
      setModalData(provinces);
    } else if (type === "district") {
      setModalData(districts);
    } else if (type === "ward") {
      setModalData(wards);
    }
    setModalVisible(true);
  };

  const handleSelect = (item: Location) => {
    setModalVisible(false);
    if (currentSelection === "province") {
      setSelectedProvince(item.name);
      handleProvinceChange(item.code);
      
    } else if (currentSelection === "district") {
      setSelectedDistrict(item.name);
      handleDistrictChange(item.code);
    } else if (currentSelection === "ward") {
      setSelectedWard(item.name);
    }
  };

  const handleProvinceChange = async (provinceCode:number) => {
    setSelectedProvince(provinces.find(p => p.code === provinceCode)?.name || "");
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);

    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      setDistricts(res.data.districts);
    } catch (error) {
      console.error("Lỗi tải quận/huyện:", error);
    }
  };

  const handleDistrictChange = async (districtCode: number) => {
    setSelectedDistrict(districts.find(d => d.code === districtCode)?.name || "");
    setSelectedWard("");
    setWards([]);

    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      setWards(res.data.wards);
    } catch (error) {
      console.error("Lỗi tải xã/phường:", error);
    }
  };
  // ✅ Xử lý chọn xã/phường
  const handleWardChange = (wardCode: string) => {
    setSelectedWard(wardCode);
  };

  // ✅ Xử lý lưu thông tin
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập!");
        return;
      }

      const fullAddress = `${streetAddress ? streetAddress + ", " : ""}${
        selectedWard ? selectedWard + ", " : ""
      }${selectedDistrict ? selectedDistrict + ", " : ""}${selectedProvince}`;

      const response = await axios.put(
        UPDATE_USER_INFO,
        {
          username: user.username,
          phoneNumber: user.phoneNumber,
          address: fullAddress, // Cập nhật địa chỉ mới
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Alert.alert("Thành công", "Cập nhật thông tin thành công!");
        // ✅ Cập nhật AsyncStorage ngay sau khi cập nhật thành công
      const updatedUser = { ...user, address: fullAddress };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

        router.replace("/profile"); // Quay về trang Profile
      }
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="black" />;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
    <Ionicons name="arrow-back-outline" size={28} color="black" />
  </TouchableOpacity>
  <View style={styles.headerTitleContainer}>
    <Text style={styles.headerTitle}>Cập nhật thông tin cá nhân</Text>
  </View>
</View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tên</Text>
          <TextInput
            style={styles.input}
            value={user.username}
            onChangeText={(text) => setUser({ ...user, username: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={user.email} editable={false} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={user.phoneNumber}
            onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tỉnh / Thành phố</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => handleOpenModal("province")}>
            <Text>{selectedProvince || "Chọn tỉnh/thành"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Quận / Huyện</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => handleOpenModal("district")}>
            <Text>{selectedDistrict || "Chọn quận/huyện"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Xã / Phường</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => handleOpenModal("ward")}>
            <Text>{selectedWard || "Chọn xã/phường"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Số nhà, tên đường</Text>
          <TextInput
            style={styles.input}
            value={streetAddress}
            onChangeText={setStreetAddress}
            placeholder="Nhập số nhà, tên đường"
          />
        </View>

        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <FlatList
              data={modalData}
              keyExtractor={(item) => item.code.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => handleSelect(item)}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// 🎨 **Styles**
const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#f9f9f9" },
  container: { padding: 20, flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 20,     textAlign:"center",
  },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: "#555", marginBottom: 5 },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#ff758c",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
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
  
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  dropdown: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, backgroundColor: "#fff" },
  modalContainer: { flex: 1, padding: 20, backgroundColor: "white" },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
});