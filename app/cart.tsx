import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Import API Endpoints
import {
  GET_CART,
  UPDATE_CART,
  DELETE_CART_ITEM,
  CLEAR_CART,
} from "../api/apiconfig";

const CartScreen: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ Thay useNavigation bằng useRouter

  // ✅ Lấy dữ liệu giỏ hàng từ API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Lỗi", "Bạn cần đăng nhập để xem giỏ hàng.");
          router.push("/login");
          return;
        }

        const response = await axios.get(GET_CART, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.products) {
          AsyncStorage.setItem("cart", JSON.stringify({ _id: response.data._id }));
          const formattedCartItems = response.data.products.map((product: any) => ({
            id: product.productId._id,
            name: product.productId.name,
            price: product.productId.promotionPrice,
            oldPrice: product.productId.discount
              ? product.productId.promotionPrice / (1 - product.productId.discount / 100)
              : null,
            quantity: product.quantity,
            image: product.productId.image.startsWith("http")
              ? product.productId.image
              : `http://localhost:3000/images/${product.productId.image}`,
          }));

          setCartItems(formattedCartItems);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ✅ Hàm cập nhật số lượng sản phẩm
  const updateCartQuantity = async (productId: string, action: "increase" | "decrease") => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      await axios.post(
        UPDATE_CART,
        { productId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: action === "increase" ? item.quantity + 1 : item.quantity - 1 }
            : item
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
    }
  };

  // ✅ Hàm xóa sản phẩm khỏi giỏ hàng
  const handleDeleteItem = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      await axios.delete(DELETE_CART_ITEM(id), {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  // ✅ Hàm xóa toàn bộ giỏ hàng
  const handleClearCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      await axios.delete(CLEAR_CART, { headers: { Authorization: `Bearer ${token}` } });

      setCartItems([]);
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error);
    }
  };

  // ✅ Hàm chuyển đến thanh toán
  const handleCheckout = async () => {
    const user = JSON.parse(await AsyncStorage.getItem("user") || "{}");
    if (!user) {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để đặt hàng!");
      router.push("/login");
      return;
    }

    const storedCart = JSON.parse(await AsyncStorage.getItem("cart") || "{}");
    const cartId = storedCart?._id || null;

    if (!cartId) {
      Alert.alert("Lỗi", "Không tìm thấy giỏ hàng. Vui lòng thử lại.");
      return;
    }

    router.push({
      pathname: "/order",
      params: {
        cartId,
        productList: JSON.stringify(cartItems),
        totalPrice,
        shippingAddress: user.address || "",
        name: user.username || "",
        phone: user.phoneNumber || "",
        email: user.email || "",
      },
    });
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) return <ActivityIndicator size="large" color="black" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>CART ({cartItems.length} product)</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
              {item.oldPrice && <Text style={styles.oldPrice}>{item.oldPrice.toLocaleString()} đ</Text>}
            </View>

            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => updateCartQuantity(item.id, "decrease")}>
                <Ionicons name="remove-circle-outline" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateCartQuantity(item.id, "increase")}>
                <Ionicons name="add-circle-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
        <Text style={styles.checkoutText}>Checkout</Text>
        <Ionicons name="arrow-forward" size={18} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Style cho giỏ hàng
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 10,
    marginTop:10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    elevation: 3,
    height:150,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  details: {
    flex: 1,
    
    
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    color: "#ff758c",
  },
  oldPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  removeButton: {
    padding: 5,
  },
  summaryContainer: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10, // ✅ Giữ hiệu ứng nổi lên
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    position: "absolute",
    bottom: 70, // ✅ Đẩy lên trên tabBar
    left: 0,
    right: 0,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: "#888",
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 30, // Bo góc tròn
    elevation: 5, // ✅ Hiệu ứng nổi
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  checkoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
});

export default CartScreen;
