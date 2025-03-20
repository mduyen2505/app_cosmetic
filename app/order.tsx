import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';



const OrderScreen = () => {
    const [name, setName] = useState('test');
    const [phone, setPhone] = useState('098765');
    const [email, setEmail] = useState('d@gmail.com');
    const [address, setAddress] = useState('42, Phường 13, Quận Tân Bình, Thành phố Hồ Chí Minh');
    const [voucherCode, setVoucherCode] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState('');
    const [expanded, setExpanded] = useState(false); // 🔥 Khai báo trạng thái mở rộng
    const [modalVisible, setModalVisible] = useState(false); // 🔥 Modal hiển thị mã giảm giá
    const router = useRouter();

    

    const vouchers = [
        { id: '1', code: 'NEWYEAR2025', description: 'Giảm giá 10% cho đơn hàng trên 500,000 VND', discount: '10%' },
        { id: '2', code: 'WOMENDAY2025', description: 'Giảm 30% cho đơn hàng từ 200,000 VND nhân dịp 8/3', discount: '20%' }
    ];

    const orderItems = [
        { id: '1', name: 'Nước Tẩy Trang L\'Oreal Làm Sạch Sâu Trang Điểm', quantity: 1, price: 165600, image: 'https://example.com/image.jpg' }
    ];

    const applyDiscountCode = (code: string) => {
        setAppliedVoucher(code);
        setVoucherCode(code); // ✅ Cập nhật mã giảm giá
        setModalVisible(false); // ✅ Đóng Modal
        Alert.alert('Áp dụng thành công!', `Bạn đã chọn mã: ${code}`);
    };

    const handleOrder = () => {
        Alert.alert('Đặt hàng thành công!', 'Cảm ơn bạn đã mua hàng.');
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
               <View style={styles.header}>
                 <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                   <Ionicons name="arrow-back-outline" size={28} color="black" />
                 </TouchableOpacity>
                 <View style={styles.headerTitleContainer}>
                   <Text style={styles.headerTitle}>CHECKOUT </Text>
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
                            {orderItems.map((item) => (
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
                    <TextInput
                        style={styles.input}
                        value={voucherCode}
                        onChangeText={setVoucherCode}
                        placeholder="Nhập mã giảm giá"
                    />
                    <TouchableOpacity style={styles.applyButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.applyButtonText}>Chọn mã giảm giá</Text>
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
                                        key={voucher.id}
                                        style={styles.voucherCard}
                                        onPress={() => applyDiscountCode(voucher.code)}
                                    >
                                        <View style={styles.voucherIconContainer}>
                                            <Ionicons name="pricetag-outline" size={24} color="#000" />
                                        </View>
                                        <View style={styles.voucherDetails}>
                                            <Text style={styles.voucherCode}>{voucher.code}</Text>
                                            <Text style={styles.voucherDescription}>{voucher.description}</Text>
                                        </View>
                                        <View style={styles.voucherRadio}>
                                            <Ionicons
                                                name={appliedVoucher === voucher.code ? "ellipse" : "ellipse-outline"}
                                                size={24}
                                                color={appliedVoucher === voucher.code ? "#000" : "#777"}
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
                            <Text style={styles.totalPrice}>165,600₫</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.totalLabel}>Giảm giá:</Text>
                            <Text style={styles.discountPrice}>0₫</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.totalLabel}>Phí vận chuyển:</Text>
                            <Text style={styles.shippingFee}>30,000₫</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.totalLabel}>VAT (10%):</Text>
                            <Text style={styles.vat}>16,560₫</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.totalLabelBold}>Thành tiền (Đã VAT):</Text>
                            <Text style={styles.totalAmount}>212,160₫</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.checkoutButton} onPress={handleOrder}>
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
    
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10 },
    applyButton: { backgroundColor: '#ff758c', padding: 10, borderRadius: 8, alignItems: 'center' },
    applyButtonText: { color: '#fff', fontWeight: 'bold' },
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