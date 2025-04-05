import { useRouter } from "next/router";
import Layout from "../Admin/components/layout";
// import "../styles/globals.css";
import type { AppProps } from "next/app";
import { usePathname } from "next/navigation";
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import TagSharp from '@mui/icons-material/TagSharp';
import Attribution from '@mui/icons-material/Attribution';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';
// import Admin from "./admin";
// import Client from "./Admin/client";
import Head from "next/head";
import { AuthProvider } from "../Admin/services/context/AuthContext";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import DiscountIcon from '@mui/icons-material/Discount';
import ReviewsIcon from '@mui/icons-material/Reviews';
import BookIcon from '@mui/icons-material/Book';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PinDropIcon from '@mui/icons-material/PinDrop';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import { Provider } from "react-redux";
import store from "../Admin/reducer/store";
import { ToastContainer } from "react-toastify";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from "react";
import LayoutCli from "../components/layout";
import Clientstore from "../reducer/store";
import { useDispatch } from "react-redux";
import MetaHead from "../templates/meta";
// import '../styles/TailwindScoped.css';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import hsnIcon from "../../public/assets/admin/images/hsn.svg"
import Image from "next/image";
import PercentIcon from '@mui/icons-material/Percent';
import Script from "next/script";
import ScrollToTop from "../components/GlobalComponents/ScrollToTop";
import RemoveBrowserHistory from "../components/GlobalComponents/RemoveBrowserHistory ";
import HandleBackNavigation from "../components/HandleBackNavigation";


const GA_TRACKING_ID = 'G-FF4P7D6YJQ'; // Replace with your tracking ID
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "PinkPaws",
  "image": "https://pinkstore.altisinfonet.in/rest/uploads/site/bc219b61-e0e6-4586-b7e1-8dfe87b106d7-.png",
  "url": "https://pinkstore.altisinfonet.in/",
  "telephone": "18005712149",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "AC 102, Salt Lake Sector 1,",
    "addressLocality": "Kolkata",
    "postalCode": "700064",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 22.5941355,
    "longitude": 88.40563329999999
  }
};


export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter()
  let pathname = router.pathname
  const showLayout = pathname === "/admin/login" || pathname === "/admin/signup" || pathname === "/admin/login" || pathname === "/admin/signup"


  const slpitPath = pathname.split("/")
  console.log(pathname, slpitPath[1], "pathndzzame")
  const [loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    const loadCSS = async () => {
      if (!router.isReady) return; // Ensure router is ready before accessing pathname

      if (router.pathname.startsWith('/admin')) {
        try {
          await import('../styles/TailwindScoped.css');
          setLoader(false)
          console.log('Admin CSS loaded');
        } catch (err) {
          console.error('Error loading globals.css:', err);
          setLoader(true)
        }
      } else {
        try {
          await import('../styles/globals.css');
          console.log('Client CSS loaded');
          setLoader(false)
        } catch (err) {
          console.error('Error loading clientglobal.css:', err);
          setLoader(true)
        }
      }
    };

    loadCSS();
  }, [router.pathname, router.isReady]);


  console.log(slpitPath[1], "slpitPath")
  const linkArray: any = [
    // {
    //   icon: <InventoryIcon className="h-5 w-6" />,
    //   name: "Products",
    //   sublink: [
    //     { icon: <InventoryIcon className="h-5 w-6" />, name: "All Products", link: "/products", },
    //     { icon: <CategoryIcon className="h-5 w-6" />, name: "Categories", link: "/categories", },
    //   ]
    // },
    { id: "1", icon: <DashboardIcon className="!text-[130%]" />, key: "dashboard", name: "dashboard", link: "/admin/", },
    {
      id: "2", icon: <InventoryIcon className="!text-[130%]" />, key: "products", name: "Products", sublink: [
        { id: "3", icon: <InventoryIcon className="!text-[130%]" />, key: "products", subKey: "allProducts", name: "All Products", link: "/admin/products", },
        { id: "4", icon: <CategoryIcon className="!text-[130%]" />, key: "products", subKey: "categories", name: "Categories", link: "/admin/categories", },
        { id: "5", icon: <TagSharp className="!text-[130%]" />, key: "products", subKey: "tags", name: "Tags", link: "/admin/tags", },
        { id: "6", icon: <Attribution className="!text-[130%]" />, key: "products", subKey: "attributes", name: "Attributes", link: "/admin/attributes", },
        { id: "7", icon: <AutoAwesomeMotionIcon className="!text-[130%]" />, key: "products", subKey: "featuredProducts", name: "Featured Products", link: "/admin/featured-products", },
        { id: "8", icon: <AddShoppingCartIcon className="!text-[130%]" />, key: "products", subKey: "bestSelling", name: "Best Selling", link: "/admin/best-selling", },
        { id: "9", icon: <ShoppingCartCheckoutIcon className="!text-[130%]" />, key: "products", subKey: "newArrivals", name: "New Arrivals", link: "/admin/new-arrivals", },
        { id: "10", icon: <LocalOfferIcon className="!text-[130%]" />, key: "products", subKey: "offer", name: "Offer", link: "/admin/offer", },
      ]
    },
    {
      id: "11", icon: <ListIcon className="!text-[130%]" />, key: "orders", name: "orders", sublink: [
        { id: "11", icon: <ListIcon className="!text-[130%]" />, key: "orders", name: "orders", link: "/admin/orders" },
        { id: "43", icon: <PinDropIcon className="!text-[130%]" />, key: "manage-pincode", name: "manage pincode", link: "/admin/manage-pincode" },
      ]
    },
    { id: "12", icon: <SupervisorAccountIcon className="h-6 w-6" />, key: "users", name: "Users", link: "/admin/users", },
    { id: "13", icon: <ViewCarouselIcon className="h-6 w-6" />, key: "slider", name: "slider", link: "/admin/slider" },
    { id: "14", icon: <DynamicFeedIcon className="h-6 w-6" />, key: "banner", name: "ads banner", link: "/admin/banner" },
    // { id: "43", icon: <DynamicFeedIcon className="h-6 w-6" />, key: "newbanner", name: "new banner", link: "/admin/new-banner" },
    { id: "15", icon: <FileCopyIcon className="!text-[130%]" />, key: "pages", name: "pages", link: "/admin/cmspages", },
    { id: "16", icon: <WidgetsIcon className="!text-[130%]" />, key: "menu", name: "menu", link: "/admin/menu", },
    { id: "17", icon: <ReceiptLongIcon className="!text-[130%]" />, key: "testimonial", name: "testimonial", link: "/admin/testimonial" },
    { id: "18", icon: <AddLocationAltIcon className="!text-[130%]" />, key: "storeLocatore", name: "store locatore", link: "/admin/store-locator" },
    {
      id: "19", icon: <BookIcon className="!text-[130%]" />, key: "blogs", name: "Blogs", sublink: [
        { id: "20", icon: <BookIcon className="!text-[130%]" />, key: "blogs", subKey: "allBlogs", name: "All Blogs", link: "/admin/blogs", },
        { id: "21", icon: <CategoryIcon className="!text-[130%]" />, key: "blogs", subKey: "blogCategories", name: "Categories", link: "/admin/blog-categories", },
        { id: "22", icon: <TagSharp className="!text-[130%]" />, key: "blogs", subKey: "blogTags", name: "Tags", link: "/admin/blog-tags", },
      ]
    },
    {
      id: "38", icon: <LiveHelpIcon className="!text-[130%]" />, key: "faq", name: "FAQ", sublink: [
        { id: "39", icon: <CategoryIcon className="!text-[130%]" />, key: "faq", subKey: "categories", name: "Categories", link: "/admin/faq/categories", },
        { id: "40", icon: <LiveHelpIcon className="!text-[130%]" />, key: "faq", subKey: "faqs", name: "F&Qs", link: "/admin/faq", },
      ]
    },
    { id: "23", icon: <CardGiftcardIcon className="!text-[130%]" />, key: "couponCode", name: "coupon code", link: "/admin/coupon" },
    { id: "42", icon: <ManageAccountsIcon className="!text-[130%]" />, key: "user-deleted-account", name: "user deleted account", link: "/admin/user-account" },
    { id: "41", icon: <AccountBalanceWalletIcon className="!text-[130%]" />, key: "wallet", name: "wallet", link: "/admin/wallet" },
    { id: "36", icon: <PercentIcon className="!text-[130%]" />, key: "hsnMaster", name: "HSN Master", link: "/admin/hsn" },

    {
      id: "24", icon: <ReviewsIcon className="!text-[130%]" />, key: "reviews", name: "Reviews", sublink: [
        { id: "25", icon: <ReviewsIcon className="!text-[130%]" />, key: "reviews", subKey: "allReviews", name: "All Reviews", link: "/admin/reviews", },
        { id: "26", icon: <DisplaySettingsIcon className="!text-[130%]" />, key: "reviews", subKey: "reviewsSettings", name: "Settings", link: "/admin/reviews/settings", },
      ]
    },
    { id: "27", icon: <DiscountIcon className="!text-[130%]" />, key: "discountRules", name: "discount rules", link: "/admin/discount" },
    {
      id: "28", icon: <BookIcon className="!text-[130%]" />, key: "emailTemplates", name: "Email Templates", sublink: [
        { id: "29", icon: <BookIcon className="!text-[130%]" />, key: "emailTemplates", subKey: "contactUsAdmin", name: "Contact Us - Admin", link: "/admin/contact-us-admin", },
        { id: "30", icon: <CategoryIcon className="!text-[130%]" />, key: "emailTemplates", subKey: "contactUsPoster", name: "Contact Us - Poster", link: "/admin/contact-us-poster", },
        { id: "31", icon: <TagSharp className="!text-[130%]" />, key: "emailTemplates", subKey: "notifyMe", name: "Notify Me - Poster", link: "/admin/notify-me-poster", },
        { id: "32", icon: <TagSharp className="!text-[130%]" />, key: "emailTemplates", subKey: "otpTemplate", name: "OTP Template", link: "/admin/otp-template", },
        { id: "33", icon: <TagSharp className="!text-[130%]" />, key: "emailTemplates", subKey: "orderTemplate", name: "Order Template", link: "/admin/order-template", },
      ]
    },
    { id: "37", icon: <WhatsAppIcon className="!text-[130%]" />, key: "wp_templates", name: "WP Templates", link: "/admin/wp-templates" },
    { id: "39", icon: <NotificationsActiveRoundedIcon className="!text-[130%]" />, key: "push_notification", name: "Push Notification", link: "/admin/push-notification" },
    { id: "34", icon: <DisplaySettingsIcon className="!text-[130%]" />, key: "settings", name: "settings", link: "/admin/settings" },
    {
      id: "35", icon: <LogoutIcon className="!text-[130%]" />,
      name: "Logout",
      link: "/admin/logout"
    }
  ] // make a copy

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // if (loader) {
  //   return;
  // }

  return (
    <>
      <ScrollToTop />
      <RemoveBrowserHistory />
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Script
        type="application/ld+json"
        id="pinkpaws-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />



      {/* {loader ? <></> : */}
      <>
        {slpitPath[1] === "admin" ?
          <Provider store={store}>
            <AuthProvider>
              {!showLayout ?
                <Layout sideBar={true} linkArray={linkArray} container={false}>
                  <Head>
                    <meta charSet="utf-8" />
                    <title>PinkPaws</title>
                    <meta name="description" content="" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/assets/icon/favicon.png" />
                  </Head>
                  <Component {...pageProps} />
                </Layout>
                : <Component {...pageProps} />
              }
            </AuthProvider>
          </Provider>
          :
          <Provider store={Clientstore}>
            <Head>
              <meta charSet="utf-8" />
              <title>PinkPaws Store</title>
              <meta name="description" content="" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.ico" type="image/x-icon" />
              <link rel="icon" type="image/png" sizes="32x32" href="/assets/icon/favicon.png" />
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
              <link rel="stylesheet" href="assets/css/bootstrap.min.css" />
              <link rel="stylesheet" href="assets/css/all.css" />
              <link rel="stylesheet" href="assets/css/fontawesome.css" />
              <link rel="stylesheet" href="assets/css/slick.css" />
              <link rel="stylesheet" href="assets/css/slick-theme.css" />
              <link rel="stylesheet" href="assets/css/style.css" />
              <link rel="stylesheet" href="assets/css/styleII.css" />
              <link rel="stylesheet" href="assets/css/pp_library.css" />
              <link rel="stylesheet" href="assets/animation/animations.min.css" />
              {/* <script type="text/javascript" src="assets/js/bootstrap.bundle.min.js" async></script>
              <script type="text/javascript" src="assets/js/jquery-3.6.0.min.js" async></script> */}
            </Head>

            <LayoutCli>
              {/* <HandleBackNavigation /> */}
              <Component {...pageProps} />
            </LayoutCli>

          </Provider>}
      </>
      {/* } */}
      <ToastContainer />

    </>
  );
}
