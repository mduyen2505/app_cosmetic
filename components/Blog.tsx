import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { GET_BLOB } from "../api/apiconfig";

// ✅ Định nghĩa kiểu dữ liệu blog
interface Blog {
  _id: string;
  title: string;
  author: string;
  createdAt: string;
  descriptions: string;
  images: string[];
}

const BlogScreen = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(GET_BLOB);
        setBlogs(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff758c" />
        <Text>Đang tải bài viết...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FlatList
          data={blogs}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer} // ✅ Thêm padding tránh che bởi bottom navigation
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              {/* Ảnh blog */}
              <Image
                source={{
                  uri: `http://172.20.10.4:3000/images/${item.images[0]}`,
                }}
                style={styles.blogImage}
              />

              {/* Thông tin blog */}
              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>
                  {item.author} | {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                <Text numberOfLines={2} style={styles.description}>
                  {item.descriptions}
                </Text>

                {/* ✅ Nút xem chi tiết có marginBottom để không bị che */}
                <TouchableOpacity style={styles.readMore}>
                  <Text style={styles.readMoreText}>Xem chi tiết</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 80, // ✅ Đảm bảo không bị che bởi bottom navigation
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingVertical: 15,
    paddingLeft: 10,
  },
  flatListContainer: {
    paddingBottom: 50, // ✅ Tạo khoảng trống ở dưới
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

export default BlogScreen;
