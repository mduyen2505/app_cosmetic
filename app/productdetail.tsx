import React, { useState, useEffect } from "react";
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
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { getProductDetails, UPDATE_CART, WISHLIST } from "../api/apiconfig";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// ✅ Định nghĩa kiểu dữ liệu sản phẩm
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  promotionPrice: number;
  description: string;
  averageRating: number;
  totalReviews: number;
  ingredients: string;
  usageInstructions: string;
  reviews: { id: string; user: string; rating: number; comment: string }[];
}

export default function ProductDetail() {
  const route = useRoute();
  const { productId } = route.params as { productId: string };
  const navigation = useNavigation();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState("ingredients");
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [reviews, setReviews] = useState(product?.reviews || []);

  // ✅ Fetch dữ liệu sản phẩm từ API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(getProductDetails(productId));
        setProduct(response.data);
        setReviews(response.data.reviews || []);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải sản phẩm. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);
  // ✅ Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    try {
      await axios.post(UPDATE_CART, { productId, action: "increase" });
      Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  // ✅ Xử lý thêm vào wishlist
  const handleToggleFavorite = async () => {
    try {
      setIsFavorite(!isFavorite);
      await axios.post(WISHLIST, { productId });
      Alert.alert("Thành công", isFavorite ? "Đã xóa khỏi danh sách yêu thích!" : "Đã thêm vào danh sách yêu thích!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật danh sách yêu thích!");
    }
  };

  // ✅ Xử lý gửi đánh giá sản phẩm
  const handleReviewSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung đánh giá!");
      return;
    }

    try {
      const response = await axios.post(
        `http://172.20.10.4:3000/api/reviews/`, // 🔥 API Web của bạn
        { productId, rating, comment },
        { headers: { Authorization: `Bearer YOUR_AUTH_TOKEN` } }
      );

      if (response.data.message === "Đánh giá thành công!") {
        Alert.alert("Thành công", "Cảm ơn bạn đã đánh giá!");
        setShowReviewModal(false);
        setComment("");
        setRating(5);

        // 🔥 Cập nhật danh sách đánh giá mới
        setReviews((prevReviews) => [
          ...prevReviews,
          { id: new Date().toISOString(), user: "Bạn", rating, comment },
        ]);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Bạn đã đánh giá sản phẩm này rồi!");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff758c" />
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Sản phẩm không tồn tại hoặc đã bị xóa</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
     <View style={styles.header}>
     <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
     <Ionicons name="arrow-back" size={24} color="black" />
     </TouchableOpacity>
        
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
        <Image
  source={{
    uri: product.image.startsWith("http")
      ? product.image
      : `http://172.20.10.4:3000/images/${product.image}`,
  }}
  style={styles.productImage}
/>
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

      {/* Nội dung tab */}
      <View style={styles.tabContent}>
        {selectedTab === "ingredients" && (
          <Text>{product.ingredients || "Chưa có thông tin thành phần"}</Text>
        )}

        {selectedTab === "instructions" && (
          <Text>{product.usageInstructions || "Chưa có hướng dẫn sử dụng"}</Text>
        )}

        {selectedTab === "reviews" && (
          reviews.length > 0 ? (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
                <Text>{review.comment}</Text>
              </View>
            ))
          ) : (
            <Text>Chưa có đánh giá nào</Text>
          )
        )}
      </View>

     {/* Nút viết đánh giá */}
     {selectedTab === "reviews" && (
          <TouchableOpacity onPress={() => setShowReviewModal(true)} style={styles.reviewButton}>
            <Text style={styles.buttonText}>Viết đánh giá</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal đánh giá */}
      <Modal visible={showReviewModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Nút đóng modal */}
            <TouchableOpacity onPress={() => setShowReviewModal(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>✖</Text>
            </TouchableOpacity>

            {/* Tiêu đề modal */}
            <Text style={styles.modalTitle}>Viết đánh giá</Text>

            {/* Hình ảnh & tên sản phẩm */}
            <View style={styles.productInfo}>
            <Image
                source={{
                  uri: product.image.startsWith("http")
                    ? product.image
                    : `http://172.20.10.4:3000/images/${product.image}`,
                }}
                style={styles.productImageSmall}
              />              <Text style={styles.modalProductName}>{product.name}</Text>

            </View>

            {/* Chọn sao đánh giá */}
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <FontAwesome name="star" size={30} color={star <= rating ? "#ff758c" : "#ddd"} />
                </TouchableOpacity>
              ))}
            </View>

            

            {/* Nhập nội dung đánh giá */}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nội dung đánh giá..."
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
      {/* Thanh điều khiển ở dưới cùng */}
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
    marginBottom: 80, // ✅ Thêm khoảng trống để tránh bị footer che
  },
  modalTitle: {
    fontSize: 13, // ✅ Giảm kích thước chữ
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
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
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff", // Giữ nền trắng hoặc đổi màu theo ý muốn
    elevation: 3, // Tạo hiệu ứng bóng nổi lên
  },
  backButton: {
    padding: 10,
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
    height: 60,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  // ✅ Sửa lỗi thiếu `errorContainer`
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  modalProductName: {
    fontSize: 13, // ✅ Giảm kích thước chữ trong modal
    fontWeight: "bold",
    marginBottom: 2, // ✅ Tạo khoảng cách giữa các phần tử
  },



});
