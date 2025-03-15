import React, { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity 
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // ✅ Import FontAwesome để hiển thị sao

export default function ProductCard({ product }: { product: any }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleWishlistToggle = () => {
    setIsFavorite(!isFavorite);
  };

  // ✅ Hàm tạo danh sách sao dựa trên rating
  const renderStars = (rating: number) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? "star" : "star-o"} // Nếu nhỏ hơn rating thì là sao đầy, ngược lại là sao rỗng
          size={14}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  return (
    <TouchableOpacity style={styles.card}>
      {/* Gắn tag giảm giá nếu có */}
      {product.discount > 0 && (
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>-{product.discount}%</Text>
        </View>
      )}

      {/* Icon Yêu thích */}
      <TouchableOpacity onPress={handleWishlistToggle} style={styles.favoriteIcon}>
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={20} 
          color={isFavorite ? "red" : "#777"} 
        />
      </TouchableOpacity>

      {/* Ảnh sản phẩm */}
      <Image source={{ uri: product.image }} style={styles.productImage} />

      {/* Thông tin sản phẩm */}
      <View style={styles.info}>
        <Text style={styles.productName}>{product.name}</Text>

        {/* ✅ Thêm đánh giá sao */}
        <View style={styles.ratingContainer}>
          {renderStars(product.rating || 0)}
          <Text style={styles.ratingCount}>({product.reviewCount || 0})</Text>
        </View>

        {/* Giá sản phẩm */}
        <View style={styles.priceContainer}>
          {product.discount > 0 && (
            <Text style={styles.originalPrice}>
              {product.price.toLocaleString()}₫
            </Text>
          )}
          <Text style={styles.discountedPrice}>
            {product.promotionPrice.toLocaleString()}₫
          </Text>
        </View>

        {/* Nút thêm vào giỏ */}
        <TouchableOpacity style={styles.addToCart}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// Styles
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
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    resizeMode: "contain",
  },
  info: {
    paddingVertical: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingCount: {
    fontSize: 12,
    marginLeft: 5,
    color: "#777",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  addToCart: {
    marginTop: 8,
    backgroundColor: "#000",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
