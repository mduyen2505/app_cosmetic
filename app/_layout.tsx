import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // Ẩn tên tab
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          height: 70,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "index") iconName = "home-outline";
          else if (route.name === "cart") iconName = "cart-outline";
          else if (route.name === "myorder") iconName = "receipt-outline";
          else if (route.name === "wishlist") iconName = "heart-outline";
          else if (route.name === "profile") iconName = "person-outline";
          else iconName = "help-circle-outline"; // Biểu tượng mặc định

          return (
            <Ionicons
              name={iconName}
              size={focused ? 30 : 27} // 🔥 Kích thước lớn hơn khi tab được chọn
              color={focused ? "#ff758c" : "#999"} // ✅ Đổi màu khi tab được chọn
            />
          );
        },
        tabBarActiveTintColor: "#ff758c", // ✅ Màu khi được chọn
        tabBarInactiveTintColor: "#999", // ✅ Màu khi chưa chọn
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart", tabBarIcon: ({ color, size }) => (
    <Ionicons name="cart-outline" size={size} color={color} />
) }} />
      <Tabs.Screen name="myorder" options={{ title: "Orders" }} />
      <Tabs.Screen name="wishlist" options={{ title: "Wishlist" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="category" options={{ href: null }} />
      <Tabs.Screen name="subcategory" options={{ href: null }} />
    </Tabs>
  );
}
