import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Modal, 
  SafeAreaView, 
  Linking,

  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import API endpoints
import { 
  ORDER_API, 
  MOMO_PAYMENT_API, 
  CHECK_COUPON_API, 
  COUPONS_API, 
  UPDATE_PAYMENT_STATUS, 
  GET_CART 
} from  '../api/apiconfig';

// Định nghĩa chính xác cho các tham số truyền qua route
interface RouteParams {
    cartId: string;
    productList: Product[];  // Sửa từ string thành mảng các đối tượng Product
    totalPrice: number;
    shippingAddress: string;
    name: string;
    phone: string;
    email: string;
    voucherCode: string;
  }
  
  // Định nghĩa chính xác cho từng sản phẩm
  interface Product {
    id: string;       // ID sản phẩm
    name: string;     // Tên sản phẩm
    price: number;    // Giá sản phẩm
    quantity: number; // Số lượng
    image: string;    // URL ảnh sản phẩm
  }
  
  // Định nghĩa cho một mã giảm giá
  interface Voucher {
    _id: string;       // ID của mã giảm giá
    name: string;      // Tên mã giảm giá
    discount: number;  // Phần trăm giảm giá
    expiry: string;    // Ngày hết hạn
    message: string;   // Thông báo
  }
  
  // Định nghĩa thêm một interface cho thông tin voucher đã tính toán
  interface VoucherInfo extends Voucher {
    discountAmount: number; // Số tiền giảm giá
    newTotal: number;       // Tổng tiền sau khi giảm
  }
  

const OrderScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as RouteParams;
  
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<{[key: string]: string}>({});
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [voucherInfo, setVoucherInfo] = useState<VoucherInfo | null>(null);
  const [showVoucherList, setShowVoucherList] = useState(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  
  
  const [orderData, setOrderData] = useState({
    cartId: '',
    totalPrice: 0,
    productList: [] as string[],
    shippingAddress: '',
    name: '',
    phone: '',
    email: '',
    voucherCode: '',
  });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Lỗi', 'Bạn cần đăng nhập để xem thông tin đơn hàng');
          navigation.navigate('Login' as never);
          return;
        }

        const response = await axios.get(GET_CART, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.products) {
          const productMap: {[key: string]: string} = {};
          response.data.products.forEach((product: any) => {
            productMap[product.productId._id] = product.productId.name;
          });
          setProducts(productMap);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  // Fetch vouchers
  const fetchVouchers = async () => {
    try {
      const response = await axios.get(COUPONS_API);
      if (response.data.status === 'OK') {
        setVouchers(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách voucher:', error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // Check voucher validity
  const checkVoucher = async () => {
    if (!voucherCode.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã giảm giá!');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(CHECK_COUPON_API, {
        name: voucherCode,
        orderTotal: orderData.totalPrice,  // Chỉ truyền tổng tiền sản phẩm
      });

      if (response.data && typeof response.data.discount === 'number') {
        const currentDate = new Date();
        const expiryDate = new Date(response.data.expiry);
        if (expiryDate < currentDate) {
          Alert.alert('Thông báo', '❌ Mã giảm giá đã hết hạn!');
          setVoucherInfo(null);
          return;
        }

        // Tính số tiền được giảm
        const discountAmount = Math.round(
          (orderData.totalPrice + shippingFee + vat) * (response.data.discount / 100)
        );

        setVoucherInfo({
          ...response.data,
          discountAmount: discountAmount,
          newTotal: orderData.totalPrice + shippingFee + vat - discountAmount,
        });

        Alert.alert('Thông báo', `✅ Mã hợp lệ! ${response.data.message}`);
      } else {
        setVoucherInfo(null);
        Alert.alert('Thông báo', '❌ Mã giảm giá không hợp lệ hoặc đã hết hạn!');
      }
    } catch (error) {
      console.error('❌ Lỗi khi kiểm tra mã giảm giá:', error);
      Alert.alert('Lỗi', '❌ Không thể kiểm tra mã giảm giá. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalPrice = productList.reduce((total, product) => total + product.price * product.quantity, 0);
  const vat = totalPrice * 0.1;
  const freeShippingThreshold = 500000;
  const baseShippingFee = 30000;
  const shippingFee = totalPrice >= freeShippingThreshold ? 0 : baseShippingFee;
  const discountAmount = voucherInfo ? (totalPrice + shippingFee + vat) * (voucherInfo.discount / 100) : 0;
  const orderTotal = totalPrice + shippingFee + vat - discountAmount;

  // Process route params
  useEffect(() => {
    const processParams = async () => {
      try {
        if (!params) {
          Alert.alert('Lỗi', 'Dữ liệu đặt hàng không hợp lệ! Quay lại giỏ hàng.');
          navigation.goBack();
          return;
        }

        let parsedProductList: Product[] = [];
        if (typeof params.productList === 'string') {
          try {
            parsedProductList = JSON.parse(params.productList);
          } catch (e) {
            console.error('Lỗi khi parse productList:', e);
          }
        } else if (Array.isArray(params.productList)) {
          parsedProductList = params.productList;
        }

        setProductList(parsedProductList);
        
        setOrderData({
          cartId: params.cartId || '',
          productList: parsedProductList.map(product => product.id),
          totalPrice: params.totalPrice || 0,
          shippingAddress: params.shippingAddress || '',
          name: params.name || '',
          phone: params.phone || '',
          email: params.email || '',
          voucherCode: params.voucherCode || '',
        });

        setName(params.name || '');
        setPhone(params.phone || '');
        setEmail(params.email || '');
        setAddress(params.shippingAddress || '');
        setVoucherCode(params.voucherCode || '');
      } catch (error) {
        console.error('Lỗi khi xử lý params:', error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải thông tin đơn hàng');
      }
    };

    processParams();
  }, [params, navigation]);
  useEffect(() => {
    return () => {
      setVoucherCode('');
      setVoucherInfo(null);
      setAppliedVoucher(null);
    };
  }, [navigation]);

  // Handle MoMo payment
  const handlePayment = async (orderId: string) => {
    if (!orderId) {
      console.error('❌ Lỗi: orderId bị undefined, không thể tiếp tục thanh toán!');
      Alert.alert('Lỗi', 'Lỗi khi thanh toán: Không tìm thấy mã đơn hàng!');
      return;
    }

    try {
      setLoading(true);
      const paymentData = {
        orderId: orderId,
        amount: voucherInfo ? voucherInfo.newTotal : orderData.totalPrice,
        orderInfo: `Thanh toán đơn hàng #${orderId}`,
        redirectUrl: 'https://momo.vn',
        ipnUrl: 'https://webhook.site/test',
        payment: 'MoMo',
      };

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Lỗi', 'Bạn cần đăng nhập để thanh toán');
        navigation.navigate('Login' as never);
        return;
      }

      const response = await fetch(MOMO_PAYMENT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (data && data.payUrl) {
        // Check if the payUrl is available in the response
        Linking.openURL(data.payUrl);
        console.log('Redirecting to payment page:', data.payUrl);
        // Update payment status after successful payment
        const paymentStatusData = {
          orderId: data.orderId || orderId,
          requestId: data.requestId || orderId,
          amount: paymentData.amount,
          message: data.message || 'Thành công',
          resultCode: data.resultCode || 0,
          transId: data.transId || '123456789'
        };

        updatePaymentStatus(paymentStatusData);
      } else {
        console.error('Error: No payUrl in response');
        Alert.alert('Lỗi', 'Lỗi khi tạo yêu cầu thanh toán MoMo. Không có đường dẫn thanh toán.');
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán MoMo:', error);
      Alert.alert('Lỗi', 'Lỗi khi thanh toán MoMo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  // Update payment status
  const updatePaymentStatus = async (paymentStatusData: any) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('❌ Lỗi: Không tìm thấy token, không thể cập nhật trạng thái thanh toán!');
        return;
      }

      const response = await axios.post(UPDATE_PAYMENT_STATUS, paymentStatusData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ Phản hồi từ API cập nhật trạng thái thanh toán:', response.data);
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật trạng thái thanh toán:', error);
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!orderData.cartId || !orderData.productList.length) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn trống hoặc có lỗi với đơn hàng!');
      return;
    }

    if (
      !orderData.name ||
      !orderData.phone ||
      !orderData.email ||
      !orderData.shippingAddress
    ) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin nhận hàng!');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        navigation.navigate('Login' as never);
        return;
      }

      const formattedOrderData = {
        cartId: orderData.cartId,
        totalPrice: orderData.totalPrice,
        shippingAddress: orderData.shippingAddress,
        name: orderData.name,
        phone: orderData.phone,
        email: orderData.email,
        voucherCode: orderData.voucherCode,
        productList: orderData.productList,
      };

      const response = await axios.post(ORDER_API, formattedOrderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 'OK' && response.data.data && response.data.data.data) {
        const orderId = response.data.data.data._id;
        console.log('✅ Order ID:', orderId);
        handlePayment(orderId);
      } else {
        console.error('Error: Invalid response data', response.data);
        Alert.alert('Lỗi', 'Đặt hàng thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('❌ Lỗi khi đặt hàng:', error);
      Alert.alert('Lỗi', `Lỗi đặt hàng: Không thể đặt hàng`);
    } finally {
      setLoading(false);
    }
  };

  const applyDiscountCode = (code: string) => {
    setVoucherCode(code);
    setOrderData((prev) => ({ ...prev, voucherCode: code }));
    setAppliedVoucher(code);
    setModalVisible(false);
    checkVoucher(); // Gọi hàm kiểm tra mã giảm giá
  };


  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color="black" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>CHECKOUT</Text>
          </View>
        </View>
        
        {/* Thông tin nhận hàng */}
        <View style={styles.section}>
          <Text style={styles.title}>Thông tin nhận hàng</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Tên" />
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Số điện thoại" />
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Địa chỉ" />
        </View>
        
        {/* Chi tiết đơn hàng */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header}>
            <Text style={styles.title}>Chi tiết đơn hàng</Text>
            <View style={styles.iconRight}>
              <Ionicons name={expanded ? "chevron-up-outline" : "chevron-down-outline"} size={24} color="#333" />
            </View>
          </TouchableOpacity>
          {expanded && (
            <View style={styles.itemContainer}>
              {productList.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                      <Text style={styles.itemPrice}>{item.price.toLocaleString()}₫</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Mã giảm giá */}
        <View style={styles.section}>
          <Text style={styles.title}>Mã giảm giá</Text>
          <View style={styles.voucherInputContainer}>
            <TextInput
              style={styles.voucherInput}
              value={voucherCode}
              onChangeText={setVoucherCode}
              placeholder="Nhập mã giảm giá"
            />
            <TouchableOpacity style={styles.applyButtonInline} onPress={checkVoucher}>
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.chooseVoucherButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.chooseVoucherButtonText}>Chọn mã giảm giá</Text>
          </TouchableOpacity>

          {/* Modal hiển thị danh sách mã giảm giá */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Chọn mã giảm giá</Text>
                {vouchers.map((voucher) => (
                  <TouchableOpacity
                    key={voucher._id}
                    style={styles.voucherCard}
                    onPress={() => applyDiscountCode(voucher.name)}
                  >
                    <View style={styles.voucherIconContainer}>
                      <Ionicons name="pricetag-outline" size={24} color="#000" />
                    </View>
                    <View style={styles.voucherDetails}>
                      <Text style={styles.voucherCode}>{voucher.name}</Text>
                      <Text style={styles.voucherDescription}>{voucher.message}</Text>
                    </View>
                    <View style={styles.voucherRadio}>
                      <Ionicons
                        name={appliedVoucher === voucher.name ? "ellipse" : "ellipse-outline"}
                        size={24}
                        color={appliedVoucher === voucher.name ? "#000" : "#777"}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {/* Tổng tiền */}
        <View style={styles.checkoutContainer}>
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Tạm tính:</Text>
              <Text style={styles.totalPrice}>
                {totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Giảm giá:</Text>
              <Text style={styles.discountPrice}>
                {discountAmount > 0 ? `-${discountAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}` : "0₫"}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Phí vận chuyển:</Text>
              <Text style={styles.shippingFee}>
                {shippingFee > 0 ? shippingFee.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "Miễn phí"}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>VAT (10%):</Text>
              <Text style={styles.vat}>
                {vat.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.totalLabelBold}>Thành tiền (Đã VAT):</Text>
              <Text style={styles.totalAmount}>
                {orderTotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.checkoutButton} onPress={handlePlaceOrder}>
            <Text style={styles.checkoutText}>Đặt hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        paddingBottom: 80,
        padding: 20,
    },
    voucherInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      voucherInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        marginRight: 5,
      },
      applyButtonInline: {
        backgroundColor: '#ff758c',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      },
      applyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      chooseVoucherButton: {
        backgroundColor: '#ff758c',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 5,
      },
      chooseVoucherButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
    
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10 },
    applyButton: { backgroundColor: '#ff758c', padding: 10, borderRadius: 8, alignItems: 'center' },
    total: { fontSize: 20, fontWeight: 'bold', color: '#e63946', marginTop: 10 },
    orderButton: { backgroundColor: '#ff758c', padding: 15, borderRadius: 8, alignItems: 'center' },
    orderButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    section: { marginVertical: 10, backgroundColor: "#fff", borderRadius: 10, padding: 10, elevation: 2 },
    title: { fontSize: 18, fontWeight: "bold", color: "#333",  },
    itemContainer: { paddingVertical: 10 },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    itemInfo: {
        flex: 1,
        justifyContent: "space-between",
    },
    itemName: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#333",
        flexWrap: "wrap",
    },
    itemDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    itemQuantity: {
        fontSize: 13,
        color: "#777",
    },
    itemPrice: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#ff758c",
    },
    iconRight: {
    marginLeft: "auto",  // Đẩy icon sang bên phải
},
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 10,
      },
      
      backButton: {
        padding: 10,
      },
      
      headerTitleContainer: {
        flex: 1, // Để phần tiêu đề tự động căn giữa
        alignItems: "center",
        justifyContent: "center",
      },
      
      headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
      },
      
    voucherRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },
    voucherCode: { fontSize: 16, fontWeight: "bold" },
    useVoucherButton: { backgroundColor: "green", padding: 5, borderRadius: 5 },
    useVoucherText: { color: "#fff", fontWeight: "bold" },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    voucherCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f7f7f7',
        marginVertical: 8,
        padding: 15,
        borderRadius: 20,
        elevation: 2,
        width: '100%',
    },
    voucherIconContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#000',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    voucherDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    voucherDescription: {
        fontSize: 14,
        color: '#777',
    },
    voucherRadio: {
        marginLeft: 15,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#ff758c',
        borderRadius: 8,
        alignItems: 'center',
        width: '60%',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    checkoutContainer: {
        backgroundColor: "white",
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -3 },
        elevation: 10,
        position: "relative",
        left: 0,
        right: 0,
        zIndex: 10,
        bottom: -90,
        marginTop:-80,
    },
    priceContainer: {
        marginBottom: 10,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
    },
    totalLabel: {
        fontSize: 16,
        color: "#555",
        fontWeight: "500",
    },
    totalLabelBold: {
        fontSize: 16,
        color: "#000",
        fontWeight: "bold",
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    discountPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    shippingFee: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    vat: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    totalAmount: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#e63946",
    },
    checkoutButton: {
        backgroundColor: "#ff758c",
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 10,
        marginHorizontal: 5,
    },
    checkoutText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    
});

export default OrderScreen;