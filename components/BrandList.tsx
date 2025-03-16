import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router"; // ✅ Điều hướng với Expo Router
import { BRANDS } from "../api/apiconfig"; // ✅ Import API endpoint

const { width } = Dimensions.get("window");

// Định nghĩa kiểu dữ liệu cho thương hiệu
interface Brand {
  _id: string;
  title: string;
  image: string;
}

const BrandList = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        console.log("Fetching brands from:", BRANDS);
        const response = await fetch(BRANDS);
        if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);

        const data = await response.json();
        if (data && Array.isArray(data.brands)) {
          setBrands(data.brands);
        } else {
          console.error("Dữ liệu API không đúng:", data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API thương hiệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // 🔥 Component hiển thị từng thương hiệu
  const renderBrandItem = ({ item }: { item: Brand }) => (
    <TouchableOpacity
      style={styles.brandContainer}
      onPress={() => router.push(`/brand?brandId=${item._id}`)}
    >
      <Image
        source={{
          uri: item.image.startsWith("http")
            ? item.image
            : `http://172.20.10.4:3000/images/${item.image}`,                            

        }}
        style={styles.brandImage}
      />
      <Text style={styles.brandTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Brands</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ff758c" />
      ) : (
        <FlatList
          data={brands}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderBrandItem}
        />
      )}
    </View>
  );
};

// 🎨 **Styles**
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: "#fff6f1",
    paddingLeft: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  brandContainer: {
    width: width * 0.25,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
  },
  brandImage: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  brandTitle: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default BrandList;
