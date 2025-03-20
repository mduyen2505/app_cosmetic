import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, TouchableOpacity } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: route.name === "index" ? styles.tabBar : { display: "none" }, // ✅ Ẩn bottom tab khi không ở trang Home
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "index") iconName = "home-outline";
          else if (route.name === "cart") iconName = "cart-outline";
          else if (route.name === "offer") iconName = "pricetag-outline";
          else if (route.name === "wishlist") iconName = "heart-outline";
          else if (route.name === "profile") iconName = "person-outline";
          else return <View />;

          if (route.name === "cart") {
            return (
              <View style={styles.cartButton}>
                <Ionicons name="cart-outline" size={32} color="white" />
              </View>
            );
          }

          return (
            <Ionicons
              name={iconName}
              size={focused ? 28 : 25}
              color={focused ? "#ff758c" : "#999"}
            />
          );
        },
        tabBarActiveTintColor: "#ff758c",
        tabBarInactiveTintColor: "#999",
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="offer" options={{ title: "Offer" }} />
      <Tabs.Screen
        name="cart"
        options={{
          title: "",
          tabBarButton: (props) => <CustomCartButton {...props} />, 
        }}
      />
      <Tabs.Screen name="wishlist" options={{ title: "Wishlist" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      
      <Tabs.Screen name="category" options={{ href: null }} />
      <Tabs.Screen name="subcategory" options={{ href: null }} />
      <Tabs.Screen name="productdetail" options={{ href: null }} />
      <Tabs.Screen name="brand" options={{ href: null }} />
      <Tabs.Screen name="register" options={{ href: null }} />
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="verifyotp" options={{ href: null }} />
      <Tabs.Screen name="update_info" options={{ href: null }} />
      <Tabs.Screen name="order_status" options={{ href: null }} />
      <Tabs.Screen name="information" options={{ href: null }} />
      <Tabs.Screen name="order" options={{ href: null }} />
      <Tabs.Screen name="orderdetail" options={{ href: null }} />

    </Tabs>
  );
}

const CustomCartButton = ({ children, ...props }: any) => {
  return (
    <TouchableOpacity {...props} style={[props.style, styles.cartButtonWrapper]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    height: 70,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  cartButton: {
    width: 65,
    height: 65,
    backgroundColor: "#ff758c",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});