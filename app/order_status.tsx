import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Import Ionicons for the back button
import { useRouter } from 'expo-router';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

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

// Mock data
const mockOrders: Order[] = [
  {
    _id: '67c7ba4a336f617178b4c336',
    createdAt: '2025-03-05T16:43:22',
    status: 'Confirmed',
    products: [
      {
        productId: {
          name: 'Dung Dịch Tẩy Da Chết Paula’s Choice 2% BHA',
          image: 'https://via.placeholder.com/80',
          promotionPrice: 219000,
        },
        quantity: 1,
      },
      {
        productId: {
          name: 'Nước Tẩy Trang L\'Oreal Dưỡng Ẩm Cho Da Thường, Khô',
          image: 'https://via.placeholder.com/80',
          promotionPrice: 166500,
        },
        quantity: 1,
      },
    ],
    orderTotal: 454050,
  },
];

const OrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders); // Use mock data for now
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const router = useRouter();

  // Filter orders based on selected status
  const filterOrders = () => {
    if (selectedStatus === 'All') return orders;
    return orders.filter((order) => order.status === selectedStatus);
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
          <Image source={{ uri: product.productId.image }} style={styles.productImage} />
          <View style={styles.productDetails}>
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
            <>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => console.log('Cancel order', item._id)} // Handle cancel
              >
                <Text style={styles.buttonText}>Hủy đơn hàng</Text>
              </TouchableOpacity>
            </>
          )}
          {item.status === 'Shipped' && (
            <>
              <TouchableOpacity
                style={styles.receivedButton}
                onPress={() => console.log('Confirm received', item._id)} // Handle received
              >
                <Text style={styles.buttonText}>Đã nhận được hàng</Text>
              </TouchableOpacity>
            </>
          )}
          
          {/* The "View Details" button is shown in all statuses */}
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => router.push(`/orderdetail/${item._id}`)} // Use expo-router for navigation
          >
            <Text style={styles.buttonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  
  
  // Get color for the order status
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
      {/* Hide the status bar (optional, if you want to fully hide it) */}
      <StatusBar hidden={true} />
      
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // Go back to previous screen
        >
          <Ionicons name="arrow-back-outline" size={28} color="black" /> {/* Ionicons back button */}
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
