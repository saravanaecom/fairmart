import ServerURL from "../server/serverUrl";

export const APIRoutes = {
    //Settings API
    GET_SETTINGS_DETAILS: `${ServerURL.PRODUCTION_HOST_URL}/api/WebMobileApp//SelectSettingsNew1`,
    GET_DELIVERY_TIMES: `${ServerURL.PRODUCTION_HOST_URL}/api/DeliveryChargesApp/SelectDeliveryTime`,
    GET_SELECTSETTINGS: `${ServerURL.PRODUCTION_HOST_URL}/api/WebMobileApp/SelectSettingsNew1`,



    //GET Deliveryaddress
    GET_DELIVERYCHARGE: `${ServerURL.PRODUCTION_HOST_URL}/api/DeliveryChargesApp/SelectDeliveryCharges`,


   
    // pincode

    GET_PINCODE: `${ServerURL.PRODUCTION_HOST_URL}/api/WebMobileApp/SelectDeliveryArea`,
    //Authentication API's
    APP_CHECK_EXISTING_USER: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/AppEmailMobileCheck`,
    APP_REGISTER_USER: `${ServerURL.PRODUCTION_HOST_URL}api/CustomerApp/InsertCustomer`,
    APP_LOGIN_USER: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/Login`,
    APP_FORGET_PASSWORD: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/ForgetPassword`,
    APP_OTPVERIFY: `${ServerURL.PRODUCTION_HOST_URL}/api/CustomerApp/Otpverification`,    

    //User details for address, orders, wallets, profile etc..
    GET_MY_ORDERS: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/MyOrder`,
    CANCEL_MY_ORDER: `${ServerURL.PRODUCTION_HOST_URL}api/OfferPost/CancelCustomerOrder`,    
    GET_MY_WALLET_IN: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/SelectWalletIN`,
    GET_CUSTOMER_ADDRESS: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/SelectCustomerAddress`,
    DELETE_CUSTOMER_ADDRESS: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/DeleteCustomerAddress`,
    INSERT_CUSTOMER_DETAILS: `${ServerURL.PRODUCTION_HOST_URL}api/CustomerApp/InsertCustomer`,    
    GET_MINIMUM_ORDER_AMOUNT: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/SelectMinimumOrderAmount`,
    UPDATE_PASSWORD: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/UpdatePassword`,
    UPDATE_CUSTOMER_PASSWORD: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/UpdateCustomerPassword`,

    GET_COUPONVALUE: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/SelectCoupondata`, 
    GET_SALECOUPONVALUE: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/Selectsaleordercoupon`, 

    //Sale order 
    INSERT_SALE_ORDER_SAVE: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/InsertSaleOrderSave`,

    //Category and Subcategory API's
    GET_TOP_CATEGORIES: `${ServerURL.PRODUCTION_HOST_URL}api/CategoryEcomApp/SelectCategory`,
    GET_CATEGORY_SUBCATEGORY: `${ServerURL.PRODUCTION_HOST_URL}api/ItemmasterEcomApp/SelectSubCategorId`,

    //Offer post (banner slider) and offer product API's
    GET_BANNER_OFFER_POST: `${ServerURL.PRODUCTION_HOST_URL}api/OfferPost/SelectOfferPost`,
    GET_OFFER_FAST_MOVING_PRODUCT: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/OfferProductFastingMovingProduct`,
    GET_PRODUCT_ID_MORE_ITEMS: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/SelectProductIdMoreItems`,

    //New product 
    GET_NEW_PRODUCT: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/SelectNewProdcut`,


    //GET BRAND
    GET_NEW_BRAND: `${ServerURL.PRODUCTION_HOST_URL}/api/WebMobileApp/SelectBrand`,



    //Main product index page
    GET_PRODUCT_BY_INDEX_PAGE: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/SelectProductByCategoryIndexPage`,
    GET_PRODUCT_BY_CATEGORY: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/SelectProductByCategory`,
    GET_PRODUCT_BY_SUBCATEGORY: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/SelectProductBySubCategory`,
    GET_PRODUCT_BY_ID: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/SelectProductId`,
    GET_SEARCH_BY_PRODUCT: `${ServerURL.PRODUCTION_HOST_URL}api/ItemmasterEcomApp/SelectProductAdminSearch`,

    //Wishlist product (favorite)
    INSERT_FAVORITE_PRODUCT: `${ServerURL.PRODUCTION_HOST_URL}api/WhishlistApp/InsertWishlist`,
    GET_PRODUCT_BY_FAVORITE_LISTS: `${ServerURL.PRODUCTION_HOST_URL}api/WebMobileApp/SelectProductByWishlist`,
    DELETE_FAVORITE_PRODUCT: `${ServerURL.PRODUCTION_HOST_URL}api/WhishlistApp/DeleteWishlist`,    
};

export default APIRoutes;
