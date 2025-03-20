import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, StatusBar } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ORDER_LIST,ORDER_CANCEL,ORDER_DELIVER } from '../api/apiconfig';

// Define types for product and order
interface Product {
  productId: {
    name: string;
    image: string;
    promotionPrice: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: string;
  status: string;
  products: Product[];
  orderTotal: number;
}

const OrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]); 
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken"); // Fetch token from AsyncStorage
        if (!token) {
          setError("Bạn chưa đăng nhập!");
          setLoading(false);
          return;
        }

        const response = await axios.get(ORDER_LIST,{
          headers: { Authorization: `Bearer ${token}` },
        });

       
        if (response.data.status === "OK") {
          setOrders(response.data.data);
        } else {
          setError("Không thể tải danh sách đơn hàng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
        setError("Lỗi kết nối đến server.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Cancel pending order
  const cancelOrder = async (orderId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setError("Bạn chưa đăng nhập!");
        return;
      }

      const response = await axios.put(
        ORDER_CANCEL,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.status === "OK") {
        // Update the orders state to reflect the canceled order
        setOrders(prevOrders => prevOrders.map(order => 
          order._id === orderId ? { ...order, status: 'Cancelled' } : order
        ));
        alert("Đơn hàng đã được hủy");
      } else {
        alert("Không thể hủy đơn hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
  };

  // Confirm shipped order
  const confirmReceived = async (orderId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setError("Bạn chưa đăng nhập!");
        return;
      }

      const response = await axios.post(
        ORDER_DELIVER,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "OK") {
        
        // Update the orders state to reflect the shipped order
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: "Delivered" } : order
          )
        );
        

        alert("Đơn hàng đã được xác nhận là đã nhận");
      } else {
        alert("Không thể xác nhận đơn hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi xác nhận đơn hàng:", error);
    }
  };

  // Filter orders based on selected status
  const filterOrders = () => {
    if (selectedStatus === 'All') return orders;
    return orders.filter(order => order.status === selectedStatus);
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <Text style={styles.orderId}>Mã đơn hàng: {item._id}</Text>
      <Text style={styles.orderDate}>
        Ngày đặt hàng: {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
      </Text>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status}</Text>
      {item.products.map((product, idx) => (
        <View key={idx} style={styles.productRow}>
<Image 
  source={{ 
    uri: product.productId.image.startsWith("http") 
      ? product.productId.image 
      : `http://172.20.10.4:3000/images/${product.productId.image}` 
  }} 
  style={styles.productImage} 
/>          <View style={styles.productDetails}>
            <Text style={styles.productName}>{product.productId.name}</Text>
            <Text style={styles.productQuantity}>Số lượng: {product.quantity}</Text>
            <Text style={styles.productPrice}>
              Giá: {product.productId.promotionPrice.toLocaleString()} đ
            </Text>
          </View>
        </View>
      ))}
      <View style={styles.summary}>
        <Text style={styles.total}>Tổng tiền: {item.orderTotal.toLocaleString()} đ</Text>

        {/* Conditional rendering of buttons */}
        <View style={styles.buttonContainer}>
          {item.status === 'Pending' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => cancelOrder(item._id)} // Handle cancel
            >
              <Text style={styles.buttonText}>Hủy đơn hàng</Text>
            </TouchableOpacity>
          )}
          {item.status === 'Shipped' && (
            <TouchableOpacity
              style={styles.receivedButton}
              onPress={() => confirmReceived(item._id)} // Handle received
            >
              <Text style={styles.buttonText}>Đã nhận hàng</Text>
            </TouchableOpacity>
          )}

          {/* The "View Details" button is shown in all statuses */}
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => router.push(`/orderdetail?orderId=${item._id}`)}
            >
            <Text style={styles.buttonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Confirmed':
        return 'green';
      case 'Delivered':
        return 'blue';
      case 'Shipped':
        return 'purple';
      case 'Cancelled':
        return 'red';
      default:
        return 'black';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // Go back to previous screen
        >
          <Ionicons name="arrow-back-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Danh sách đơn hàng</Text>
      <View style={styles.statusFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          {['All', 'Pending', 'Confirmed', 'Delivered', 'Shipped', 'Cancelled'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterButton, selectedStatus === status && styles.selectedFilter]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={styles.filterText}>{status}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.orderList}>
        <FlatList
          data={filterOrders()}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 10,

    zIndex: 1, // Ensure the button is above other elements
  },
  backButton: {
    backgroundColor: 'transparent', // No background for Ionicons button
    padding: 10,
  },
  backButtonText: {
    color: 'black',
    fontSize: 14,
  },
  statusFilter: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  scrollView: {
    flexDirection: 'row',
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginRight: 10, // Add margin to space out buttons
  },
  selectedFilter: {
    borderBottomWidth: 2,
    borderBottomColor: '#ff758c', // Underline color
    paddingBottom: 2, // Add space between text and the underline
  },
  filterText: {
    fontSize: 15,
    color: '#333',
  },
  orderList: {
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  orderId: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  orderDate: {
    color: 'green',
    marginTop: 5,
  },
  status: {
    marginTop: 10,
    fontSize: 16,
  },
  productRow: {
    flexDirection: 'row',
    marginTop: 15,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: '#ddd',
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 5,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
  },
  productPrice: {
    fontSize: 14,
    color: '#333',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    alignItems: 'center',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',


  
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10, // Add some space between buttons
  },
  receivedButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10, // Add some space between buttons
  },
  detailButton: {
    backgroundColor: '#ff758c',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'column', // Stack buttons vertically
  },
});

export default OrdersScreen;
