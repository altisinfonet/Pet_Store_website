const _URLS: any = {
  products: {
    get_product: "/get-product",
    get_product_details: "/get-product",
    delete_product: "/delete-product",
    total_items_product: "/total-items/products",
    update_product_image: "/update-product-image",
    update_product: "/update-product",
    delete_multiple_product: "/delete-multiple-product",
    create_product: "/create-product",
    get_product_type: "/get-product-type",
    get_product_stock_type: "/get-product-stock-type",
    get_status: "/get-status",
    update_product_status: "/update-product-status",
    admin_get_product_slug: "/admin-get-product-slug",
    product_search: "/product-search",
    product_category_search: "/category-search",
    get_product_search: "/get-product-search",
    upload_downloadable_file: "/upload-downloadable-file",
    hsn_search: "/hsn-search"
  },

  category: {
    category_search: "/category-search"
  },

  products_categories: {
    create_product_category: "/create-product-category",
    update_product_category_image: "/update-product-category-image",
    get_product_category: "/get-product-category",
    get_product_category_details: "/get-product-category",
    update_product_category: "/update-product-category",
    total_items_category: "/total-items/categories",
    delete_multiple_product_category: "/delete-multiple-product-category"
  },

  product_tags: {
    get_product_tag: "/get-product-tag",
    create_product_tag: "/create-product-tag",
    get_product_tag_id: "/get-product-tag",
    update_product_tag: "/update-product-tag",
    delete_multiple_product_tag: "/delete-multiple-product-tag",
    total_items_tag: "/total-items/product_tag"
  },

  users: {
    get_users: "/get-user",
    create_user: "/create-user",
    get_user_by_id: "/get-user",
    update_user: "/update-user",
    total_items_user: "/total-items/user",
    delete_multiple_user: "/delete-multiple-user",
    get_delete_user_account: "/get-account-deleted-user",
    get_downloadable_data: "/get-request",
    approve_delete_user_account_status: "/update-request",
    getAllUserReview: "/get-all-user-review",
    getUserReviewPermission: "/get-user-review-permission",
    updateReviewPermission: "/update-review-permission",
    updateReviewUrl: "/update-review",
    total_items_review: "/total-items/review",
    multi_delete_review: "/delete-multiple-reviews",
    multi_status_update: "/update-multiple-reviews-status",

    me: "/me",
    admin_me: "/admin-me",
    signin: "/signin-admin-with-password",
    user_logout: "/logout"

  },

  roles: {
    get_roles: "/get-role"
  },

  pages: {
    get_home_page: "/get-home-page",
    create_home_banner: "/create-home-banner",
    update_home_banner: "/update-home-banner",
    update_home_banner_image: "/update-home-banner-image",
    update_home_page: "/update-home-page",
    get_all_pages: "/get-page-list",
    total_items: "/total-items/page",
    get_page_by_slug: "/get-page",
    update_page: "/update-home-page",
    create_page: "/create-home-page",
    delete_page: "/delete-page",
    home_page_banner: "/home-page-banner",
    home_banner_list: "/home-banner-list",
    delete_multiple_home_banner: "/delete-multiple-home-banner",
    total_items_only: "/total-items",
    admin_get_slug: "/admin-get-page-slug",
    get_template: "/get-page-template",
    home_page_meta_update: "/home-page-meta-update",
    get_page_meta: "/get-page-meta",
    create_meta: "/create-meta",
    update_meta: "/update-meta",
    get_slug_by_meta: "/get-slug-by-meta"
  },

  seller_banner: {
    update_seller_banner: "/update-seller-banner",
    create_seller_banner: "/create-seller-banner",
    update_seller_banner_image: "/update-seller-banner-image",
    seller_banner_list: "/home-seller-list",
    delete_multiple_seller_banner: "/delete-multiple-seller-banner",
    total_items_only: "/total-items"
  },

  menus: {
    get_all_menu_types: "/get-all-menu-types",
    get_menu_items: "/get-menu-types",
    custom_menu_create: "/custom-menu-create",
    add_menu_item: "/create-menu-item",
    menu_item_delete: "/delete-menu-item",
    add_menu_type: "/create-menu-type",
    delete_menu_type: "/delete-menu-type",
    remove_menu_item: "/remove-menu-item ",
    update_menu_type: "/update-custom-menu",
    get_custom_menu_type: "/get-custom-menu-item"
  },

  product_attributes: {
    create_product_attribute: "/create-product-attribute",
    get_product_attribute: "/get-product-attribute",
    get_product_attribute_details: "/get-product-attribute",
    update_product_attribute: "/update-product-attribute",
    delete_product_attribute: "/delete-product-attribute",
    update_product_attribute_term: "/update-product-attribute-term",
    delete_product_arributes_term: "/delete-product-attribute-term",
    total_items_product: "/total-items/attributes",
    create_product_attribute_term: "/create-product-attribute-term",
    update_product_attribute_term_image: "/update-product-attribute-term-image"
  },

  testimonial: {
    get_testimonial: "/get-testimonial",
    create_testimonial: "/create-testimonial",
    get_by_id_testimonial: "/get-testimonial",
    update_testimonial: "/update-testimonial",
    get_user_dropdown: "/get-user/dropdown",
    total_items: "/total-items/testimonial",
    __delete: "/delete-testimonial"
  },

  store_locator: {
    get: "/get-store-location",
    get_store_location_by_id: "/get-store-location",
    create_store_location: "/create-store-location",
    update_store_location: "/update-store-location",
    total_items: "/total-items/storeLocator",
    __delete: "/delete-store-location",
    get_all_pincode: "/get-all-pincodes",
    add_non_delivery_pincode: "/add-non-delivery-pincode",
    update_pincode: "/update-pincode",
    delete_pincode: "/delete-multiple-pincodes"
  },

  orders: {
    get_order_list: "/get-order-list",
    get_order_state: "/get-order-state",
    update_order: "/update-order",
    total_items: "/total-items/order",
    update_multiple_order_status: "/update-multiple-order-status",
    delete_multiple_order: "/delete-multiple-order",

    get_order_notes: "/order/notes",
    create_order_notes: "/orders",
    delete_order_note: "/orders",

    order_email_send: "/order/email/send",
    order_address_update: "/order/update",

    order_get_pdf: "/order/get-pdf",
    get_order_date: "/get-order-date",
    get_order_status_list: "/get-order-status-list",

    update_product_hsn: "/update-product-hsn",

    get_awb_number: "/get-awb-service-type",
    add_awb_number: "/get-awb-number"
  },

  coupon: {
    get: "/get-coupon",
    __delete: "/delete-coupon",
    total_items_coupon: "/total-items/coupon",
    create: "/create-coupon",
    update: "/update-coupon"
  },

  hsn: {
    get_gst: "/get-gst",
    delete_gst: "/delete-gst",
    total_items_hsn: "/total-items/hsn",
    create_gst: "/create-gst",
    update_gst: "/update-gst",
    get_by_id: "/get-gst"
  },

  options: {
    create_theam_options: "/create-theam-options",
    read_theam_options: "/read-theam-options",
    update_theam_options: "/update-theam-options",
    update_theam_options_image: "/update-theam-options-image"
  },

  discount: {
    createDiscount: "/create-discount",
    getDiscountType: "/discount-types",
    getDiscountFilterType: "/discount-filter-types",
    getDiscountById: "/get-discount-by-id",
    createDiscounyFilter: "/create-discount-filter",
    deleteDiscountFilter: "/discount-filter-delete",
    createDiscountRange: "/create-discount-range",
    deleteDiscountRange: "/delete-discount-range",
    craeteDiscountRuleLimit: "/create-discount-ruleLimit",
    getDiscount: "/get-discount",
    total_items_discount: "/total-items/discount",
    deleteDiscount: "/discount-delete-force",
    enbleStatusUpdate: "/discount-update-enable",
    create_discount_item_quantity: "/create-discount-item-quantity"
  },

  blogs: {
    create_blog: "/create-blog",
    get_blog: "/get-blog",
    get_blog_details: "/get-blog",
    update_blog_image: "/update-blog-image",
    update_blog: '/update-blog',
    delete_blog: "/delete-blog",
    total_items_blog: "/total-items/blogs",
    delete_multiple_blog: "/delete-multiple-blog",
  },

  blog_categories: {
    create_blog_category: "/create-blog-category",
    get_blog_category: "/get-blog-category",
    get_blog_category_details: "/get-blog-category",
    update_blog_category: "/update-blog-category",
    total_items_category: "/total-items/blog_categories",
    delete_multiple_blog_category: "/delete-multiple-blog-category"
  },

  blog_tags: {
    get_blog_tag: "/get-blog-tag",
    create_blog_tag: "/create-blog-tag",
    get_blog_tag_id: "/get-blog-tag",
    update_blog_tag: "/update-blog-tag",
    delete_multiple_blog_tag: "/delete-multiple-blog-tag",
    total_items_tag: "/total-items/blog_tag"
  },

  dtdc: {
    add_batch: "/add-batch-number",
    get_tracking: "/dtdc-tracking",
    send_info: "/generate-adhoc-invoice",
    get_product_Track_details: "/get-product-dtdc-track"
  },

  store_address: {
    get_first: "/get-store-address/first",
    update: "/update-store-address",
    create: "/create-store-address"
  },

  admin_setting: {
    a_get_with_id: "/get-admin-setting",
    a_update: "/update-admin-setting",
    a_create: "/create-admin-setting"
  },

  best_selling: {
    get_best_selling: "/get-best-selling",
    create_best_selling_rank: "/create-best-selling-rank",
    create_best_selling_product: "/create-best-selling-product",
    update_best_selling: "/update-best-selling",
    delete_best_selling: "/delete-best-selling"
  },

  new_arrivals: {
    get_arrival: "/get-arrival",
    create_arrival_rank: "/create-arrival-rank",
    create_arrival_product: "/create-arrival-product",
    update_arrival: "/update-arrival",
    delete_arrival: "/delete-arrival"
  },

  offer: {
    get_offer: "/get-offer",
    create_offer_rank: "/create-offer-rank",
    create_offer_product: "/create-offer-product",
    update_offer: "/update-offer",
    delete_offer: "/delete-offer"
  },

  feature_seation: {
    get_feature_section: "/get-feature-section",
    create_feature_section_rank: "/create-feature-section-rank",
    create_feature_section_product: "/create-feature-section-product",
    update_feature_section: "/update-feature-section",
    delete_feature_section: "/delete-feature-section"
  },

  dashboard: {
    dashboard_item_count: "/dashboard-item-count",
    dashboard_order_list: "/dashboard-order-list",
    dashboard_user_list: "/dashboard-user-list"
  },

  common: {
    get_status: "/get-status",
  },

  theam_option: {
    get_support_email_theam_options: "/get-support-email-theam-options",
    get_sobot_template: "/get-sobot-template"
  },

  faqs: {
    create_faq_module: "/create-faq-module",
    update_faq_module: "/update-faq-module",
    update_faq_module_rank: "/update-faq-module-rank",
    delete_faq_module: "/delete-faq-module",
    get_faq_module: "/get-faq-module",

    create_faq: "/create-faq",
    update_faq: "/update-faq",
    update_faq_rank: "/update-faq-rank",
    delete_faq: "/delete-faq",
    get_faq_by_module: "/get-faq-by-module",
    get_faq_by_id: "/get-faq",
  },

  wallet: {
    razor_pay_order_create: "/create/order-id",
    wallet_transaction_details: "/all-wallet-transaction-details",
    gift_user_wallet_amount: "/gift-user-wallet-amount"
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
