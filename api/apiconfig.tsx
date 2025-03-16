const BASE_URL = "http://172.20.10.4:3000/api";

export const CATEGORIES = `${BASE_URL}/types`;
export const SUBCATEGORIES = `${BASE_URL}/subcategories`;
export const BRANDS = `${BASE_URL}/brands`;

export const FEATURED_PRODUCTS = `${BASE_URL}/products/featured?limit=8`;
export const ALL_PRODUCTS = `${BASE_URL}/products`;

// ✅ Thêm kiểu dữ liệu `string` hoặc `number` cho các tham số
export const getProductsByCategory = (categoryId: string | number): string => 
    `${BASE_URL}/products/bytypes/${categoryId}`;

export const getProductsBySubcategory = (subCategoryId: string | number): string => 
    `${BASE_URL}/products/subcategory/${subCategoryId}`;

export const getProductsbyBrand = (brandId: string | number): string => 
    `${BASE_URL}/products/brands/${brandId}`;

export const getBrandDetails = (brandId: string | number): string => 
    `${BASE_URL}/brands/${brandId}`;

export const getProductDetails = (productId: string | number): string => 
    `${BASE_URL}/products/types/${productId}`;

// 🛒 API giỏ hàng
export const GET_CART = `${BASE_URL}/carts`;
export const DELETE_CART_ITEM = (productId: string | number): string => 
    `${BASE_URL}/carts/${productId}`;
export const CLEAR_CART = `${BASE_URL}/carts`;

// 🛍️ API đặt hàng
export const ORDER_API = `${BASE_URL}/orders`;
export const getOrderDetails = (orderId: string | number): string => 
    `${ORDER_API}/${orderId}`;

export const UPDATE_CART = `${BASE_URL}/carts/update`;

// 👤 API người dùng
export const GET_USER_INFO = `${BASE_URL}/users`;
export const UPDATE_USER_INFO = `${BASE_URL}/users`;

// 🎟️ API mã giảm giá
export const COUPONS_API = `${BASE_URL}/coupons`;
export const CHECK_COUPON_API = `${BASE_URL}/coupons/check-coupon`;

// 💳 Thanh toán MOMO
export const MOMO_PAYMENT_API = `${BASE_URL}/payments`;

// 🔐 API xác thực người dùng
export const REGISTER_USER = `${BASE_URL}/users/register`;
export const LOGIN_USER = `${BASE_URL}/users/login`;
export const GOOGLE_LOGIN = `${BASE_URL}/users/auth/google`;
export const VERIFY_OTP = `${BASE_URL}/users/verify-otp`;
