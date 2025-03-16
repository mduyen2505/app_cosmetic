import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // ✅ Để quay về màn hình trước

// Dữ liệu giả cho giỏ hàng
const fakeCartData = [
  {
    id: "1",
    name: "Sữa rửa mặt Cetaphil",
    price: 150000,
    oldPrice: 200000,
    quantity: 2,
    image: "https://example.com/cetaphil.jpg",
  },
  {
    id: "2",
    name: "Kem dưỡng ẩm CeraVe",
    price: 300000,
    oldPrice: 350000,
    quantity: 1,
    image: "https://example.com/cerave.jpg",
  },
  {
    id: "3",
    name: "Kem chống nắng La Roche-Posay",
    price: 350000,
    quantity: 1,
    image: "https://example.com/la-roche-posay.jpg",
  },
];

const CartScreen = () => {
  const [cartItems, setCartItems] = useState(fakeCartData);
  const navigation = useNavigation(); // ✅ Khai báo navigation để quay về


  // Hàm tăng số lượng sản phẩm
  const handleIncrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  // Hàm giảm số lượng sản phẩm
  const handleDecrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Hàm đặt hàng
  const handleCheckout = () => {
    alert("Chức năng đặt hàng sẽ được cập nhật sau!");
  };

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        {/* Nút quay về */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={28} color="black" />
        </TouchableOpacity>

        {/* Tiêu đề CART */}
        <Text style={styles.title}>CART ({cartItems.length} product)</Text>
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }} // Để không bị che bởi summary
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
              {item.oldPrice && (
                <Text style={styles.oldPrice}>
                  {item.oldPrice.toLocaleString()} đ
                </Text>
              )}
            </View>

            {/* Chỉnh số lượng */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => handleDecrease(item.id)}
                disabled={item.quantity <= 1}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={24}
                  color={item.quantity > 1 ? "black" : "gray"}
                />
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => handleIncrease(item.id)}>
                <Ionicons name="add-circle-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Nút xóa */}
            <TouchableOpacity
              onPress={() => handleRemove(item.id)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Hóa đơn */}
      <View style={styles.summaryContainer}>
        <View style={styles.summary}>
          <Text style={styles.totalLabel}>Total price</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>

        <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Checkout</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
      </View>
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
