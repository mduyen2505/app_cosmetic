import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { getOrderDetails } from "../api/apiconfig"; // Import the correct API function

const OrderDetailScreen = () => {
  const [order, setOrder] = useState<Order | null>(null); // Placeholder for order data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  
  // Use useLocalSearchParams instead of useRoute
  const params = useLocalSearchParams<{ orderId: string }>();
  const orderId = params.orderId;

  // Define types for the order and product
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
    shippingFee: number;
    VAT: number;
    paymentResult: string;
    email: string;
    phone: string;
    shippingAddress: string;
    name: string; // Add the name property
  }

  // Fetch order details from the API
  const fetchOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('You are not logged in!');
        setLoading(false);
        return;
      }

      // Ensure orderId is available
      if (!orderId) {
        setError('Order ID is missing!');
        setLoading(false);
        return;
      }

      // Use getOrderDetails with orderId to fetch the details from the API
      const response = await axios.get(getOrderDetails(orderId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'OK') {
        setOrder(response.data.data);
      } else {
        setError('Unable to fetch order details.');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Shipped':
        return 'purple';
      case 'Delivered':
        return 'blue';
      case 'Cancelled':
        return 'red';
      default:
        return 'black';
    }
  };

  const getStatusMessage = (status: string) => {
    return `Your order is ${status}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Order Details</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {/* Header with Order Status */}
          <View style={[styles.header, { backgroundColor: getStatusColor(order!.status) }]}>
            <Text style={styles.headerText}>{getStatusMessage(order!.status)}</Text>
          </View>

          {/* Customer Information */}
          <View style={styles.customerInfo}>
            <View style={styles.row}>
              <Text style={styles.boldText}>Customer Name:</Text>
              <Text style={styles.text}>{order!.name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.boldText}>Email:</Text>
              <Text style={styles.text}>{order!.email}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.boldText}>Phone:</Text>
              <Text style={styles.text}>{order!.phone}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.boldText}>Shipping Address:</Text>
              <Text style={styles.text}>{order!.shippingAddress}</Text>
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.orderDetails}>
            <View style={styles.row}>
              <Text style={styles.boldText}>Payment Status:</Text>
              <Text style={styles.text}>{order!.paymentResult}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.boldText}>Total Product Price:</Text>
              <Text style={styles.text}>{order!.orderTotal.toLocaleString()} đ</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.boldText}>Shipping Fee:</Text>
              <Text style={styles.text}>{order!.shippingFee.toLocaleString()} đ</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.boldText}>VAT:</Text>
              <Text style={styles.text}>{order!.VAT.toLocaleString()} đ</Text>
            </View>
          </View>

          {/* Product List */}
          <Text style={styles.productListTitle}>Product List</Text>
          {order!.products.map((item: Product, idx: number) => (
            <View key={idx} style={styles.productItem}>
              <Image
                source={{
                  uri: item.productId.image.startsWith("http")
                    ? item.productId.image
                    : `http://172.20.10.4:3000/images/${item.productId.image}`,
                }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.productId.name}</Text>
                <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.productPrice}>Price: {item.productId.promotionPrice.toLocaleString()} đ</Text>
              </View>
            </View>
          ))}

          {/* Total Payment */}
          <View style={styles.totalWrapper}>
            <Text style={styles.totalText}>Total Payment: {order!.orderTotal.toLocaleString()} đ</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 10,
  },
  scrollContainer: {
    paddingBottom: 80,
    padding: 20,
  },
  text: {
    fontSize: 14,
    color: '#333',
    flex: 1, // Ensure text takes up available space
    flexWrap: 'wrap', // Allow text to wrap to the next line
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
    zIndex: 1,
  },
  backButton: {
    backgroundColor: 'transparent',
    padding: 10,
  },
  header: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  customerInfo: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: -20,
    marginLeft: -20,

  },
  orderDetails: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: -20,
    marginLeft: -20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 10,
    minWidth: 150,
  },
  totalWrapper: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#ff758c',
  },
  productListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 10,
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
    backgroundColor: '#f8f8f8',

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
});

export default OrderDetailScreen;