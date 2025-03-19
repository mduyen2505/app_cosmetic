import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function OrderStatusScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trạng thái đơn hàng</Text>
      <Text style={styles.status}>Đơn hàng #12345: Đang giao</Text>
      <Text style={styles.status}>Đơn hàng #67890: Đã nhận</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  status: { fontSize: 16, marginBottom: 5 },
});
