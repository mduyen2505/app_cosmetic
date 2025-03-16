import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; 
import { useRouter } from "expo-router";

import { API_CART, WISHLIST } from "../api/apiconfig";

// 🛒 **Hàm xử lý giỏ hàng**
const addToCart = async (productId: string, quantity: number = 1) => {
  try {
    const response = await fetch(API_CART, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) throw new Error("Lỗi khi thêm vào giỏ hàng!");

    Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng.");
  } catch (error) {
    Alert.alert("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng.");
  }
};

// ❤️ **Hàm xử lý yêu thích**
const getWishlist = async (): Promise<string[]> => {
  try {
    const response = await fetch(WISHLIST);
    if (!response.ok) throw new Error("Lỗi khi lấy danh sách yêu thích!");

    const data = await response.json();
    return data.wishlist || [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu thích:", error);
    return [];
  }
};

const addToWishlist = async (productId: string) => {
  try {
    const response = await fetch(`${WISHLIST}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) throw new Error("Lỗi khi thêm vào yêu thích!");
  } catch (error) {
    Alert.alert("Lỗi", "Không thể thêm vào danh sách yêu thích.");
  }
};

const removeFromWishlist = async (productId: string) => {
  try {
    const response = await fetch(`${WISHLIST}/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) throw new Error("Lỗi khi xóa khỏi yêu thích!");
  } catch (error) {
    Alert.alert("Lỗi", "Không thể xóa khỏi danh sách yêu thích.");
  }
};

// 🛍️ **Component ProductCard**
interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  promotionPrice?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  // 🟢 Kiểm tra sản phẩm có trong danh sách yêu thích không
  useEffect(() => {
    const fetchWishlist = async () => {
      const wishlist = await getWishlist();
      setIsFavorite(wishlist.includes(product._id));
    };

    fetchWishlist();
  }, [product._id]);

  // 🟢 Xử lý toggle yêu thích
  const handleWishlistToggle = async () => {
    try {
      if (!isFavorite) {
        await addToWishlist(product._id);
      } else {
        await removeFromWishlist(product._id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật danh sách yêu thích.");
    }
  };

  // 🟢 Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    await addToCart(product._id);
  };

  // ⭐ Hiển thị đánh giá sao
  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesome
        key={index}
        name={index < rating ? "star" : "star-o"} 
        size={14}
        color="#FFD700"
        style={{ marginRight: 2 }}
      />
    ));
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/productdetail?productId=${product._id}`)} 
    >
      {/* 🔥 Hiển thị giảm giá */}
      {product.discount && product.discount > 0 && (
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>-{product.discount}%</Text>
        </View>
      )}

      {/* ❤️ Nút yêu thích */}
      <TouchableOpacity onPress={handleWishlistToggle} style={styles.favoriteIcon}>
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={20} 
          color={isFavorite ? "red" : "#777"} 
        />
      </TouchableOpacity>

      {/* 🖼 Hình ảnh sản phẩm */}
      <Image
  source={{
    uri: product.image.startsWith("http")
      ? product.image
      : `http://172.20.10.4:3000/images/${product.image}`,
  }}
  style={styles.productImage}
/>

      {/* 📝 Thông tin sản phẩm */}
      <View style={styles.info}>
        <Text style={styles.productName}>{product.name}</Text>

        <View style={styles.ratingContainer}>
          {renderStars(product.rating)}
          <Text style={styles.ratingCount}>({product.reviewCount || 0})</Text>
        </View>

        {/* 💰 Hiển thị giá tiền */}
        <View style={styles.priceContainer}>
          {product.discount && product.discount > 0 ? (
            <>
              {product.price > 0 && (
                <Text style={styles.originalPrice}>
                  {product.price.toLocaleString()}₫
                </Text>
              )}
              <Text style={styles.discountedPrice}>
                {product.promotionPrice?.toLocaleString()}₫
              </Text>
            </>
          ) : (
            <Text style={styles.discountedPrice}>
              {product.price?.toLocaleString()}₫
            </Text>
          )}
        </View>

        {/* 🛍️ Nút thêm vào giỏ hàng */}
        <TouchableOpacity style={styles.addToCart} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// 🎨 **Styles**
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: 170,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    elevation: 3,
    position: "relative",
  },
  discountTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ff758c",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    zIndex: 10, // ✅ Đảm bảo tag giảm giá nằm trên cùng
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    resizeMode: "contain",
  },

  /** 🟢 Giữ khoảng trống cố định cho nội dung sản phẩm */
  info: {
    flexGrow: 1, // ✅ Luôn lấp đầy không gian
    minHeight: 90, // ✅ Đảm bảo chiều cao tối thiểu
    justifyContent: "space-between", // ✅ Giữ nút "Thêm vào giỏ hàng" luôn ở cuối
    paddingVertical: 8,
  },

  productName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  ratingCount: {
    fontSize: 12,
    marginLeft: 5,
    color: "#777",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#999",
    marginRight: 5,
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff758c",
  },

  /** 🟢 Giữ vị trí cố định cho nút "Thêm vào giỏ hàng" */
  addToCart: {
    backgroundColor: "#000",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15, // ✅ Đẩy nút xuống cuối cùng
  },

  addToCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
