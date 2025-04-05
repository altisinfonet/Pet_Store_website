const _URLS: any = {

  client_apis: {
    get_order_state: "/get-order-state",
    home_page_banner: "/home-page-banner",
    home_page_bestSeller_banner: "/home-page-bestSeller",
    home_page_category_data: "/home-page-category-data",
    home_page: "/home-page",
    create_cart: "/create-cart",
    // get_cart_items: "/get-cart-items",
    get_cart_items: "/get-cart-items-op",
    update_cart: "/update-cart",
    update_cart_holding: "/update-cart-holding",
    // create_order: "/create-order",
    create_order: "/create-order-op",
    get_user_billing_addresses: "/get-user-billing-addresses",
    get_user_shipping_addresses: "/get-user-shipping-addresses",
    cart_item_count: "/cart-item-count",
    add_shipping_address: "/add-shipping-address",
    update_shipping_address: "/update-shipping-address",
    get_arrival: "/new-arrivals",
    get_best_selling: "/best-sellings",
    get_product: "/get-product",
    product_list: "/product-list",
    order_list: "/order-list",
    get_user_review: "/get-user-review",
    get_menu_types: "/get-menu-types",
    get_products_by_category: "/get-products-by-category/",
    dtdc_pincode: "/dtdc-pincode",
    create_leave_email: "/create-leave-email",
    read_theam_options: "/read-theam-options",
    popular_search_list: "/popular-search-list",
    front_get_related_product: "/front-get-related-product",
    delete_shipping_address: "/delete-shipping-address",
    billing_address_update: "/update-billing-address",
    payment: "/payment",
    cart_holding: "/cart-holding",
    cart_holding_details: "/cart-holding-details",
    razor_pay_order_create: "/create/order-id",
    get_products_by_attribute_term: "/get-products-by-attribute-term/",
    get_product_offer_list: "/get-product-offer-list",
    get_product_brand_list: "/get-product-brand-list",
    get_store_locator: "/store-locations",
    create_wish_list: "/create-wish-list",
    get_wish_list: "/get-wish-list",
    delete_wish_list: "/delete-wish-list",
    change_account_details: "/change-account-details",
    change_password: "/change-password",
    create_wallet_transaction: "/create-wallet-transaction",
    wallet_transaction_details: "/wallet-transaction-details",
    get_total_wallet_amount: "/get-total-wallet-amount",
    create_user_review: "/create-user-review",
    get_product_reviews: "/get-product-reviews",
    update_user_review_image: "/update-user-review-image",
    get_single_order: "/get-client-order-list",
    create_notify_me: "/create-notify-me",
    add_billing_address: "/add-billing-address",
    get_blog: "/get-blog",
    get_client_blog: "/get-client-blog",
    get_search_history: "/get-search-history",
    proxy_pincode: "/proxy",
    update_order: "/customer-update-order",
    order_return: "/order-return",
    quick_verify: "/quick-verify-p-or-e",
    create_contact_us: "/create-contact-us",
    get_faq_module: "/get-faq-module",
    faqs: "/faqs",
    relevant_search: "/relevant-search",
    upload_profile_picture: "/update-profile-picture"
  },

  auth_apis: {
    signin: "/signin",
    me: "/me",
    user_find: "/user-find",
    send_otp: "/send-otp",
    account_verify_otp: "/verify-delete-account-otp",
    delete_account: "/delete-account",
    request_data: "/request-user-data",
    signin_with_otp: "/signin-with-otp",
    signin_with_password: "/signin-with-password",
    signup_mobile_email_otp: "/signup-mobile-email-otp",
    signup_mobile_email_password: "/signup-mobile-email-password",
    logout: "/logout",
    logout_all: "/logout-all"
  },

  dtdcTracking: {
    get_tracking: "/get-client-order-dtdc-track",
    get_awb_number: "/get-awb-numbers",
    get_product_Track_details: "/get-product-dtdc-track"
  },

  pages: {
    get_page_by_slug_web: "/get-page",
  },

  commons: {
    sitemap_items: "/sitemap-items",
    get_page_meta: "/get-page-meta",
    get_page_meta_account_policy: "/get-page/account-data-policy"
  }

};


const getUrlWithKey = (key: any) => {
  const generateUrl: any = new Object();
  if (_URLS[key]) {
    for (let sub_key in _URLS[key]) {
      generateUrl[
        sub_key
      ] = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}${_URLS[key][sub_key]}`;
    }
  }
  return generateUrl;
};

export default getUrlWithKey;
