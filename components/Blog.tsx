import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Dữ liệu giả lập blog
const blogs = [
  { id: "1", title: "10 Bước Chăm Sóc Da", author: "Admin", createdAt: "2024-03-16", descriptions: "Hướng dẫn chăm sóc da hiệu quả...", image: "https://example.com/skincare.jpg" },
  { id: "2", title: "Top 5 Serum Hot Nhất", author: "Beauty Team", createdAt: "2024-03-15", descriptions: "Serum nào phù hợp với làn da của bạn?", image: "https://example.com/serum.jpg" },
  { id: "3", title: "Cách Chọn Kem Chống Nắng", author: "Skincare Experts", createdAt: "2024-03-14", descriptions: "Hướng dẫn chọn kem chống nắng phù hợp", image: "https://example.com/sunscreen.jpg" },
  { id: "4", title: "Tẩy Trang Đúng Cách", author: "Dr. Skin", createdAt: "2024-03-13", descriptions: "Những sai lầm khi tẩy trang và cách khắc phục", image: "https://example.com/cleanser.jpg" },
];

export default function BlogList() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>BLOG</Text>

      <FlatList
        data={blogs}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            {/* Ảnh blog */}
            <Image source={{ uri: item.image }} style={styles.blogImage} />

            {/* Thông tin blog */}
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.author} | {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              <Text numberOfLines={2} style={styles.description}>
                {item.descriptions}
              </Text>

              {/* Nút xem chi tiết */}
              <TouchableOpacity style={styles.readMore}>
                <Text style={styles.readMoreText}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingLeft: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    elevation: 3,
    marginRight: 15,
    overflow: "hidden",
  },
  blogImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  meta: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  readMore: {
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 14,
    color: "#ff758c",
    fontWeight: "bold",
  },
});
