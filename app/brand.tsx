import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import { getProductsbyBrand, getBrandDetails } from "../api/apiconfig";

const BrandScreen = () => {
  const { brandId } = useLocalSearchParams();
  const router = useRouter();

  const [brand, setBrand] = useState<{ title: string; image: string; description: string } | null>(
    null
  );
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandDetails = async () => {
      try {
        const response = await fetch(getBrandDetails(brandId as string));
        if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);
        const data = await response.json();
        setBrand(data.brand);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin thương hiệu:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(getProductsbyBrand(brandId as string));
        if (!response.ok) throw new Error(`Lỗi HTTP! Status: ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo thương hiệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandDetails();
    fetchProducts();
  }, [brandId]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {brand && (
          <View style={styles.brandHeader}>
            <Image
              source={{
                uri: brand.image.startsWith("http")
                  ? brand.image
                  : `http://172.20.10.4:3000/images/${brand.image}`,
              }}
              style={styles.brandLogo}
            />
            <View style={styles.brandInfo}>
              <Text style={styles.brandTitle}>{brand.title}</Text>
              <Text style={styles.brandDescription}>{brand.description}</Text>
            </View>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#ff758c" />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => <ProductCard product={item} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    width: 40,
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    marginBottom: 15,
  },
  brandLogo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginRight: 15,
  },
  brandInfo: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  brandDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  row: {
    justifyContent: "space-between",
  },
});

export default BrandScreen;
