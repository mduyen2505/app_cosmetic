import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  Alert
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const dummyProduct = {
  id: "1",
  name: "Nước Tẩy Trang L'Oreal Làm Sạch Sâu Trang Điểm",
  image: "https://via.placeholder.com/400",
  price: 184000,
  discount: 10,
  promotionPrice: 165600,
  description: "Tẩy trang hiệu quả, phù hợp với mọi loại da.",
  averageRating: 4.3,
  totalReviews: 4,
  ingredients: "Aqua, Cyclopentasiloxane, Isohexadecane, Sodium Chloride.",
  usageInstructions: "Lắc đều trước khi sử dụng. Thấm bông tẩy trang và lau nhẹ lên mặt.",
  reviews: [
    { id: "r1", user: "Unknown User", rating: 5, comment: "Tốt" },
    { id: "r2", user: "Test", rating: 3, comment: "Cũng ổn" },
  ],
};

export default function ProductDetail() {
  const [product] = useState(dummyProduct);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTab, setSelectedTab] = useState("ingredients");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");

  const handleReviewSubmit = () => {
    Alert.alert("Cảm ơn bạn đã đánh giá!", "Chúng tôi đã nhận được đánh giá của bạn.");
    setShowReviewModal(false);
  };


  const handleAddToCart = () => {
    Alert.alert("Thêm vào giỏ hàng", "Sản phẩm đã được thêm vào giỏ hàng!");
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
  <Image source={{ uri: product.image }} style={styles.productImage} />

  {/* Nút Yêu thích Nổi trên Hình */}
  <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
    {isFavorite ? (
      <FontAwesome name="heart" size={30} color="red" />
    ) : (
      <FontAwesome name="heart-o" size={30} color="gray" />
    )}
  </TouchableOpacity>
</View>

        <View style={styles.infoBox}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
            {product.discount > 0 && (
              <Text style={styles.originalPrice}>{product.price.toLocaleString()}₫</Text>
            )}
            <Text style={styles.promotionPrice}>{product.promotionPrice.toLocaleString()}₫</Text>
          </View>

          <Text style={styles.rating}>⭐ {product.averageRating} ({product.totalReviews} đánh giá)</Text>
          <Text style={styles.description}>{product.description}</Text>

          

          
        </View>

        <View style={styles.tabs}>
          {["ingredients", "instructions", "reviews"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
              <Text style={[styles.tab, selectedTab === tab && styles.activeTab]}>
                {tab === "ingredients" ? "Thành phần" : tab === "instructions" ? "Hướng dẫn" : "Đánh giá"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {selectedTab === "ingredients" && <Text>{product.ingredients}</Text>}
          {selectedTab === "instructions" && <Text>{product.usageInstructions}</Text>}
          {selectedTab === "reviews" && product.reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <Text style={styles.reviewUser}>{review.user}</Text>
              <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
              <Text>{review.comment}</Text>
            </View>
          ))}
        </View>

        {selectedTab === "reviews" && (
          <TouchableOpacity onPress={() => setShowReviewModal(true)} style={styles.reviewButton}>
            <Text style={styles.buttonText}>Viết đánh giá</Text>
          </TouchableOpacity>
        )}
        <Modal visible={showReviewModal} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Nút đóng modal */}
              <TouchableOpacity onPress={() => setShowReviewModal(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>✖</Text>
              </TouchableOpacity>

              {/* Tiêu đề modal */}
              <Text style={styles.modalTitle}>Write a review</Text>

              {/* Hình ảnh & tên sản phẩm */}
              <View style={styles.productInfo}>
                <Image source={{ uri: product.image }} style={styles.productImageSmall} />
                <Text style={styles.productName}>{product.name}</Text>
              </View>

              {/* Chọn sao đánh giá */}
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <FontAwesome name="star" size={30} color={star <= rating ? "#ff758c" : "#ddd"} />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Nhập tiêu đề đánh giá */}
              <TextInput
                style={styles.input}
                placeholder="Review Title"
                value={title}
                onChangeText={setTitle}
              />

              {/* Nhập nội dung đánh giá */}
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write your review..."
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
              />

              {/* Nút gửi đánh giá */}
              <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
                <Text style={styles.buttonText}>Gửi đánh giá</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
            <FontAwesome name="minus-circle" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
            <FontAwesome name="plus-circle" size={28} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <FontAwesome name="shopping-bag" size={18} color="white" />
          <Text style={styles.buttonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 15, paddingBottom: 100 }, // 🔥 Thêm padding để tránh footer bị che khuất
  productImage: { width: "100%", height: 300, resizeMode: "contain" },
  infoBox: { paddingVertical: 10 },
  productName: { fontSize: 20, fontWeight: "bold" },
  priceContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  originalPrice: { textDecorationLine: "line-through", color: "gray", marginRight: 10 },
  promotionPrice: { fontSize: 18, fontWeight: "bold", color: "#ff758c" },
  rating: { fontSize: 16, color: "#ffa500", marginBottom: 10 },
  description: { fontSize: 14, color: "#555", marginBottom: 10 },
  actionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  // 🔥 Tabs cho Thành phần, Hướng dẫn, Đánh giá
  tabs: { flexDirection: "row", justifyContent: "space-around", marginVertical: 15 },
  tab: { padding: 10, color: "#555" },
  activeTab: { fontWeight: "bold", color: "#ff758c", borderBottomWidth: 2, borderBottomColor: "#ff758c" },
  tabContent: { padding: 10 },

  // 🔥 Thanh điều khiển ở dưới cùng (CỐ ĐỊNH)
  footer: {
    position: "absolute",
    bottom: 70, // 🔥 Đẩy lên cao hơn sidebar (có thể chỉnh nếu cần)
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2, // 🔥 Đậm hơn để nổi bật
    shadowRadius: 6,
    elevation: 15, // 🔥 Độ nổi trên Android
    zIndex: 1000,
  },

  // 🔥 Chỉnh lại layout số lượng sản phẩm
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  quantity: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    position: "relative", // Để phần tử con có thể dùng absolute
  },
  favoriteButton: {
    position: "absolute",
    top: 15, // Cách mép trên 15px
    right: 15, // Cách mép phải 15px
    padding: 8,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Cho Android
  },
  
  // 🔥 Nút "Thêm vào giỏ hàng" lớn hơn & dễ bấm hơn
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    paddingVertical: 14, // 🔥 Tăng chiều cao để dễ bấm
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, // 🔥 Hiệu ứng bóng tốt hơn
    shadowRadius: 5,
    elevation: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  reviewButton: {
    backgroundColor: "#ff758c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 10,
  },

  // 🔥 Modal đánh giá
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Background mờ
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  closeText: {
    fontSize: 20,
    color: "#888",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },

  // 🔥 Thông tin sản phẩm trong modal
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  productImageSmall: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },

  // 🔥 Chọn sao đánh giá
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },

  // 🔥 Input nhập tiêu đề và nội dung đánh giá
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginVertical: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  // 🔥 Nút gửi đánh giá
  submitButton: {
    backgroundColor: "#ff758c",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
    reviewItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // 🔥 Hiệu ứng nổi trên Android
  },
  reviewUser: {
    fontWeight: "bold",
    fontSize: 16,
  },
  reviewRating: {
    color: "#ffa500",
    fontSize: 14,
    marginVertical: 5,
  },


});
