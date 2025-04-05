import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import WalletIcon from "@mui/icons-material/Wallet";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from '@mui/icons-material/Close';
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import ReviewsIcon from "@mui/icons-material/Reviews";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import product2 from "../../../../public/assets/icon/product-2.jpg";
import useIsLogedin from "../../../hooks/useIsLogedin";
import getUrlWithKey from "../../../util/_apiUrl";
import { useCreate, useRead, useUpdate } from "../../../hooks";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  Pagination,
  Rating,
  Slide,
  Stack,
  Tooltip,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useDispatch } from "react-redux";
import { setMe } from "../../../reducer/me";
import { setCart } from "../../../reducer/getCartReducer";
import { setCoupon } from "../../../reducer/couponReducer";
import { setCartCount } from "../../../reducer/cartCountReducer";
import { _ERROR, _SUCCESS, _WARNING } from "../../../util/_reactToast";
import { useRouter } from "next/router";
import RenderRazorpayWallet from "../../../components/RenderRazorpayWallet";
import closep from "../../../../public/assets/icon/close.png";
import OrderDetailsShow from "../OrderDetailsShow";
import axios from "axios";
import { convertDateString, lowerCase } from "../../../util/_common";
import TrackOrderDetails from "../../../components/TrackOrderDetails";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HistoryIcon from "@mui/icons-material/History";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Wishlist from "../wishList";
import brandDam from "../../../../public/assets/images/brandDam.png";
import customArrowLink from "../../../../public/assets/icon/customArrowLink.svg";
import { strongPasswordRegax } from "../../../Admin/util/_common";
import { _post, _put } from "../../../services";
import AccountList from "./AccountList";
import BillingAddress from "./BillingAddress";
import emptyBox from '../../../../public/assets/images/emptyBox.png'
import VisibilityIcon from '@mui/icons-material/Visibility';
import trackingCar from '../../../../public/assets/icon/trackingCar.svg';
import returnIcon from "../../../../public/assets/icon/return.svg"
import cancelOrder from "../../../../public/assets/icon/cancelOrder.svg"
import { Logout, Devices } from "@mui/icons-material"
import { setOpenAuth } from "../../../reducer/openAuthReducer";
interface FormData {
  address_1?: string;
  address_type?: string;
  landmark?: string;
  city?: string;
  first_name?: string;
  last_name?: string;
  locality?: string;
  phone?: string;
  postcode?: string;
  state?: string;
  display_name?: string;
  email?: string;
  mobile_no?: string;
  old_assword?: string;
  new_password?: string;
  confirm_new_password?: string;
  default?: boolean;
}

const initialFormData: FormData = {
  address_1: "",
  address_type: "home",
  landmark: "",
  city: "",
  first_name: "",
  last_name: "",
  locality: "",
  phone: "",
  postcode: "",
  state: "",
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MyAccount = () => {

  // const addressbox = [
  //   {
  //     id: 1,
  //     name: "Shiltu Kumar Ghosh",
  //     adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
  //     Phone: "9881215456",
  //   },

  //   {
  //     id: 2,
  //     name: "Shiltu Kumar Ghosh",
  //     adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
  //     Phone: "9881215456",
  //   },
  //   {
  //     id: 3,
  //     name: "Shiltu Kumar Ghosh",
  //     adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
  //     Phone: "9881215456",
  //   },
  //   {
  //     id: 4,
  //     name: "Shiltu Kumar Ghosh",
  //     adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
  //     Phone: "9881215456",
  //   },
  //   {
  //     id: 5,
  //     name: "Shiltu Kumar Ghosh",
  //     adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
  //     Phone: "9881215456",
  //   },
  //   {
  //     id: 6,
  //     name: "Shiltu Kumar Ghosh",
  //     adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
  //     Phone: "9881215456",
  //   },
  //   {
  //     id: 7,
  //     name: "Shiltu Kumar Ghosh",
  //     adderss: "Subarnaprova, Flat-2A.2nd Floor. 18/1/1, Dakshinpara road, Baguihati, Kolkata, West Bengal 700028, India",
  //     Phone: "9881215456",
  //   },
  // ];

  const {
    order_list,
    get_user_review,
    get_user_billing_addresses,
    get_user_shipping_addresses,
    add_shipping_address,
    update_shipping_address,
    delete_shipping_address,
    billing_address_update,
    razor_pay_order_create,
    change_account_details,
    change_password,
    get_total_wallet_amount,
    get_single_order,
    add_billing_address,
    get_wish_list,
    get_search_history,
    update_order,
    order_return,
    wallet_transaction_details
  } = getUrlWithKey("client_apis");
  const { logout, logout_all } = getUrlWithKey("auth_apis");
  const { logedData } = useIsLogedin();
  const dispatch = useDispatch();
  const router = useRouter();

  const [orderList, setOrderList]: any = useState();
  const [getbillingAddressesUrl, setGetbillingAddressesUrl]: any = useState();
  const [getShippingAddressesUrl, setGetShippingAddressesUrl]: any = useState();
  const [logoutUrl, setLogoutUrl]: any = useState();
  const [logoutAllUrl, setLogoutAllUrl]: any = useState();
  const [addShippingAddressUrl, setAddShippingAddressUrl]: any = useState();
  const [updateBillingAddressUrl, setUpdateBillingAddressUrl]: any = useState();
  const [shiping_Id, setShiping_Id]: any = useState(null);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [shipingToBilling, setShipingToBilling] = useState(false);
  const [forBilling, setForBilling] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const [formData, setFormData]: any = useState<FormData>(initialFormData);
  const [defaultAddress, setDefaultAddress]: any = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>(
    {}
  );
  const [editId, setEditId] = useState<number>(null);
  const [editIdBilling, setEditIdBilling] = useState<number>(null);

  const [amount, setAmount] = useState<string>("");
  const [razorpayOrderId, setrazorpayOrderId] = useState(null);
  const [razorPayOrderUrl, setRazorPayOrderUrl] = useState(null);
  const { sendData: orderPaymentRes }: any = useCreate({
    url: razorPayOrderUrl,
    callData: { amount: +amount * 100, currency: "INR" },
  });
  const [orderView, setOrderView] = useState(false);
  const [orderTrackView, setOrderTrackView] = useState(false);
  const [orderTrackID, setOrderTrackID] = useState(null);
  const [get_wish_list_url, setGet_wish_list_url]: any = useState();
  const [wishListMeta, setWishListMeta]: any = useState();
  const [orderDetailsArr, setOrderDetailsArr]: any = useState([]);

  const [waleGetUrl, setWaleGetUrl] = useState<string>(null);
  const [DefaultDataSet, setDefaultDataSet] = useState<any>(null);
  const [DeleteAddress, setDeleteAddress] = useState<any>(false);
  const [DeleteAdressID, setDeleteIDAddress] = useState<any>('');
  const [ModalShowStatus, setModalShowStatus] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [trunsactionDetails, setTrunsactionDetails]: any = useState<object>()

  const [open, setOpen] = useState(false);
  const [logoutOption, setLogoutOption] = useState("");


  var currencyFormatter = require('currency-formatter');

  console.log(editId, "editId")
  console.log(DefaultDataSet, "DefaultDataSet")
  console.log(ModalShowStatus, "ModalShowStatus")
  // get_total_wallet_amount

  useEffect(() => {
    if (formData?.default) {
      setDefaultAddress(formData?.default);
    }
  }, [formData]);

  const [orderListPayload, setOrderListPayload] = useState({
    page: 1,
    rowsPerPage: 8,
  });

  const orderListPagenation = (page: any) => {
    setOrderListPayload((pre: any) => ({ ...pre, page: page }));
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Adds smooth scrolling animation
    });
  };

  const trackYourOrder = (id: any) => {
    if (id) {
      setOrderTrackID(id);
      setOrderTrackView(true);
    }
  };

  const canselOrder = async (id: any) => {
    let url = `${update_order}/${id}`;
    try {
      const data = await _post(url, { status: "cancelled" });
      if (data?.data?.success) {
        setOrderListPayload({
          page: 1,
          rowsPerPage: 8,
        });
        setWaleGetUrl(get_total_wallet_amount);
      }
    } catch (error) {
      console.log(error, "__error");
    }
  };

  const returnOrderRequest = async (orderId: any) => {
    let url = `${order_return}`;
    try {
      const data = await _post(
        url,
        { order_id: orderId },
        { withCredentials: true }
      );
      if (data?.data?.success) {
        setOrderListPayload({
          page: 1,
          rowsPerPage: 8,
        });
      }
    } catch (error) {
      console.log(error, "__error");
    }
  };

  useEffect(() => {
    if (orderPaymentRes && orderPaymentRes?.orderId) {
      setRazorPayOrderUrl(null);
      setrazorpayOrderId(orderPaymentRes?.orderId);
    }
  }, [orderPaymentRes?.orderId]);

  useEffect(() => {
    setWaleGetUrl(get_total_wallet_amount);
  }, []);

  const { sendData: getWishListRVI }: any = useRead({
    selectMethod: "put",
    url: get_wish_list_url,
    callData: wishListMeta,
  });
  const { sendData: getWishListSH }: any = useRead({
    selectMethod: "get",
    url: get_search_history,
  });
  const { sendData: orderDetails }: any = useRead({
    selectMethod: "put",
    url: order_list,
    callData: orderListPayload,
  });
  const { sendData: getUserReviewDetails }: any = useRead({
    selectMethod: "put",
    url: orderList,
  });
  const { sendData: walet_amount }: any = useRead({
    selectMethod: "get",
    url: waleGetUrl,
  });
  const { sendData: getbilling_addresses }: any = useRead({
    selectMethod: "get",
    url: getbillingAddressesUrl,
  });
  const { sendData: getshipping_addresses }: any = useRead({
    selectMethod: "get",
    url: getShippingAddressesUrl,
  });
  const { sendData: logoutss, data: logoutData }: any = useUpdate({
    selectMethod: "post",
    url: logoutUrl,
  });

  const { sendData: logoutAll, data: logoutAllData }: any = useUpdate({
    selectMethod: "post",
    url: logoutAllUrl,
  });

  console.log(orderDetails, "orderDetails")

  useEffect(() => {
    if (orderDetails?.length) {
      setOrderDetailsArr(orderDetails);
    }
  }, [orderDetails]);

  const addressDataModify = (data: any, id: string) => {
    return {
      ...data,
      id,
    };
  };
  let billingAddresses =
    getbilling_addresses?.length &&
      getbilling_addresses[0]?.billing.length &&
      getbilling_addresses[0]?.billing[0]?.meta_data
      ? addressDataModify(
        JSON.parse(getbilling_addresses[0]?.billing[0]?.meta_data),
        getbilling_addresses[0]?.billing[0]?.id
      )
      : null;

  let shippingAddresses =
    getshipping_addresses?.length && getshipping_addresses[0]?.shipping.length
      ? getshipping_addresses[0]?.shipping.map((v: any) =>
        addressDataModify(JSON.parse(v?.meta_data), v?.id)
      )
      : null;

  console.log(shippingAddresses, "shippingAddresses")
  useEffect(() => {
    if (walet_amount && walet_amount?.id) {
      setWaleGetUrl(null);
      WalletTableData(startDate, endDate)
    }
  }, [walet_amount]);

  useEffect(() => {
    if (orderDetails?.totalPage?.length == 0) {
      setOrderListPayload({
        page: 1,
        rowsPerPage: 8,
      });
    }
  }, [orderDetails?.orders]);

  const [deleteId, setDeleteId] = useState<number>(null);
  const { sendData: addAddress }: any = useCreate({
    url: addShippingAddressUrl,
    callData: editId
      ? { shipping_id: editId, shipping_address: { ...formData } }
      : deleteId
        ? { shipping_id: deleteId }
        : { shipping_address: { ...formData } },
  });
  const { sendData: updateBAddress, data: updateBAddressRaw }: any = useUpdate({
    selectMethod: "post",
    url: updateBillingAddressUrl,
    callData: editIdBilling
      ? {
        billing_id: editIdBilling,
        billing_address: shiping_Id
          ? { ...formData, shiping_id: shiping_Id }
          : { ...formData },
      }
      : {
        billing_address: shiping_Id
          ? { ...formData, shiping_id: shiping_Id }
          : { ...formData },
      },
  });

  useEffect(() => {
    if (orderList === order_list) {
      setOrderList();
    }
  }, [orderList]);

  // useEffect(() => {
  //   if (
  //     getbilling_addresses &&
  //     getbillingAddressesUrl === get_user_billing_addresses
  //   ) {
  //     setGetbillingAddressesUrl();
  //   }
  // }, [getbilling_addresses]);

  useEffect(() => {
    if (getShippingAddressesUrl === get_user_shipping_addresses) {
      setGetShippingAddressesUrl();
    }
  }, [getShippingAddressesUrl]);

  const doLogout = () => {
    setLogoutUrl(logout);
    localStorage.clear()
    router.push("/");
  };

  const doLogOutAll = () => {
    setLogoutAllUrl(logout_all)
    localStorage.clear()
    // router.push("/");
    router.push("/").then(() => window.location.reload());
  }

  useEffect(() => {
    if (logoutUrl === logout) {
      setLogoutUrl();
    }
  }, [logoutUrl]);

  useEffect(() => {
    if (logoutData?.success) {
      dispatch(setCart([]));
      dispatch(setCoupon({}));
      dispatch(setMe({}));
      dispatch(setCartCount(""));
      _SUCCESS(logoutData?.massage);
      router.push("/");
    }
  }, [logoutData]);

  const { me: me_url } = getUrlWithKey("auth_apis");

  // useEffect(() => {
  //   const fetchMe = async () => {
  //     try {
  //       const { data } = await axios.get(me_url, { withCredentials: true });
  //       if (data?.success && !data?.data?.id) {
  //         router.push("/");
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       if (error?.response?.status === 401) {
  //         router.push("/");
  //         setTimeout(() => {
  //           dispatch(setOpenAuth(true));
  //         }, 1000);
  //       }
  //     }
  //   };
  //   fetchMe();
  // }, []);

  //START ----- after postcode hit get the condiotional data..........................................
  const debounce = (func: any, wait: any) => {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: any) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };
  const fetchPostCodeData = async () => {
    try {
      // if (formData?.postcode?.length < 6) {
      //     setFormData((prevState:any) => ({
      //         ...prevState,
      //         state: "",
      //         city: "",
      //     }));
      //     return;
      // }

      const { data } = await axios.get(
        `https://api.postalpincode.in/pincode/${formData?.postcode}`
      );
      console.log(data?.[0], "hghjfjh");

      if (data?.[0]?.Status === "Success" && formData?.postcode?.length >= 6) {
        setFormData((prevState: any) => ({
          ...prevState,
          state: data?.[0]?.PostOffice?.[0]?.State,
          city: data?.[0]?.PostOffice?.[0]?.District,
        }));
      }
      else if (data?.[0]?.Status === "Error" && formData?.postcode?.length >= 6) {
        setFormData((prevState: any) => ({
          ...prevState,
          state: " ",
          city: " ",
        }));
      } else if (data?.[0]?.Status === "Error" && formData?.postcode?.length < 6) {
        setFormData((prevState: any) => ({
          ...prevState,
          state: "",
          city: "",
        }));
      }

    } catch (error) {
      console.error(error);
    }
  };

  const fetchPostCodeDataDebounced = useCallback(
    debounce(fetchPostCodeData, 300),
    [formData?.postcode]
  );

  // Effect to trigger debounced fetch when postcode changes
  useEffect(() => {

    fetchPostCodeDataDebounced();

  }, [formData?.postcode, fetchPostCodeDataDebounced]);

  //END ----- after postcode hit get the condiotional data..........................................

  useEffect(() => {
    if (addAddress && !billing) {
      _SUCCESS(
        `Shipping address is ${editId ? "updated" : deleteId ? "deleted" : "created"
        } successfully`
      );
      setFormData(initialFormData);
      if (editId) {
        setEditId(null);
      }
      if (deleteId) {
        setDeleteId(null);
      }
      setSideBarOpen(false);
      setGetShippingAddressesUrl(get_user_shipping_addresses);
      setAddShippingAddressUrl(null);
      setForBilling(false);
    }

    if (updateBAddress && editIdBilling) {
      _SUCCESS(`Billing address is updated 123 successfully`);
      console.log(editIdBilling, updateBAddress, "ssdf65s1")
      setFormData(initialFormData);
      if (editIdBilling) {
        setEditIdBilling(null);
      }
      setUpdateBillingAddressUrl(null);
      setSideBarOpen(false);
      // setGetbillingAddressesUrl(get_user_billing_addresses);
      setForBilling(false);
    }
    if (updateBAddress && forBilling && !editIdBilling) {
      setShiping_Id(null);
      _SUCCESS(`Billing address is updated successfully`);
      setGetbillingAddressesUrl(get_user_billing_addresses);
      setFormData(initialFormData);
      setUpdateBillingAddressUrl(null);
      setSideBarOpen(false);
      // if (forBilling) {
      setForBilling(false);
      // }
    }
  }, [addAddress, updateBAddress]);

  // Define your onClick handlers
  const handleEditClick = (data: any, type: number = 1) => {
    setErrors({});
    // Logic for handling edit button click
    if (data) {
      if (type == 1) {
        setEditId(+data?.id);
        setSideBarOpen(true);
        setFormData(data);
        setShipingToBilling(true);
      }

      if (type == 2) {
        setEditIdBilling(+data?.id);
        setSideBarOpen(true);
        setFormData(data);
        setShipingToBilling(false);
      }
    } else {
      // _ERROR("Something went to wrong");
      if (type == 2) {
        // setEditIdBilling(+data?.id);
        setSideBarOpen(true);
        setFormData(data);
        setShipingToBilling(false);
      }
    }
  };

  const handleDeleteClick = (id: string) => {
    // Logic for handling delete button click
    setDeleteId(+id);

    setAddShippingAddressUrl(delete_shipping_address);

  };

  const validateForm = () => {
    const newErrors: { [key in keyof FormData]?: string } = {};
    if (!formData?.address_1?.trim()) {
      newErrors.address_1 = "Address Street is required";
    }
    // if (!formData?.landmark?.trim()) {
    //   newErrors.landmark = "Landmark is required";
    // }
    if (!formData?.city?.trim()) {
      newErrors.city = "Town / City is required";
    }
    if (!formData?.first_name?.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData?.last_name?.trim()) {
      newErrors.last_name = "Last name is required";
    }
    // if (!formData.locality?.trim()) {
    //     newErrors.locality = 'Locality is required';
    // }
    if (!formData?.postcode?.trim()) {
      newErrors.postcode = "Postcode name is required";
    }
    if (!formData?.state?.trim()) {
      newErrors.state = "State name is required";
    }
    if (!formData?.phone?.trim()) {
      newErrors.phone = "Mobile phone is required";
    } else if (!/^\d{10}$/.test(formData.phone?.trim())) {
      newErrors.phone = "Invalid mobile phone number";
    }

    if (!formData?.address_type?.trim()) {
      formData.address_type = "home";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setFormData({
      ...formData,
      default: defaultAddress,
    });
  }, [defaultAddress]);
  console.log(formData, defaultAddress, "namevalue");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ) => {
    const newErrors: { [key in keyof FormData]?: string } = {};
    const value = e.target.value;

    setFormData({
      ...formData,
      [field]: field === "address_type" ? e.target.name : e.target.value,
    });

    if (field === 'postcode') {
      if (value.length < 6) {
        newErrors.postcode = "Invalid Postcode";
      }
    }
    // setFormData({
    //     ...formData,
    //     [field]: field === "default" ? e.target.name : e.target.value
    // });

    // Clear error message when user starts typing

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveShipping = () => {
    // alert("x")
    const isValid = validateForm();
    if (isValid) {
      // Logic to save form data
      setAddShippingAddressUrl(
        editId ? update_shipping_address : add_shipping_address
      );
    }
  };

  const handleSaveBillig = (type: any) => {
    // alert("y")
    const isValid = validateForm();
    if (isValid) {
      // Logic to save form data
      if (!billingAddresses?.id && forBilling) {
        setUpdateBillingAddressUrl(add_billing_address);
      } else {
        if (!billingAddresses?.id && type === 2) {
          setUpdateBillingAddressUrl(add_billing_address);
        } else {
          setUpdateBillingAddressUrl(billing_address_update);
        }
      }
    }
  };

  useEffect(() => {
    if (forBilling) {
      setEditIdBilling(billingAddresses?.id);
    }
  }, [forBilling]);

  const [billing, setBilling] = useState<boolean>(false);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // Validate that input is numeric
    if (/^\d*$/.test(inputValue)) {
      setAmount(inputValue);
    }
  };

  const handleRechargeClick = () => {
    // Implement recharge logic here
    setRazorPayOrderUrl(razor_pay_order_create);
  };

  const initialAcDetailsFormData: FormData = {
    first_name: "",
    last_name: "",
    display_name: "",
    email: "",
    mobile_no: "",
  };

  const initialAcDetailsFormDataError: FormData = {
    first_name: "",
    last_name: "",
    display_name: "",
    email: "",
    mobile_no: "",
  };

  const initialChangePasswordFormData: FormData = {
    new_password: "",
    confirm_new_password: "",
  };

  const [acDetailsFormData, setAcDetailsFormData] = useState<FormData>(
    initialAcDetailsFormData
  );
  const [acDetailsFormDataError, setAcDetailsFormDataError] =
    useState<FormData>(initialAcDetailsFormDataError);
  const [changePassFormData, setChangePassFormData] = useState<FormData>(
    initialChangePasswordFormData
  );
  const [change_account_details_url, setChange_account_details_url]: any =
    useState();
  const [change_password_url, setChange_password_url]: any = useState();
  const [change_password_errpr, setChange_password_error]: any = useState();
  const [change_password_errpr1, setChange_password_error1]: any = useState();


  console.log(change_password_url, "change_password_url")
  console.log(billing, "billing")

  const {
    sendData: changeAc,
    serverData: changeAcData,
    error: chanageAcError,
  }: any = useUpdate({
    selectMethod: "post",
    url: change_account_details_url,
    callData: acDetailsFormData,
  });
  // update the default

  const {
    sendData: changeChangePass,
    serverData: changeChangePassData,
    error: passwError,
  }: any = useUpdate({
    selectMethod: "post",
    url: change_password_url,
    callData: { new_password: changePassFormData?.new_password },
  });


  useEffect(() => {
    if (changeAcData?.success) {
      _SUCCESS(`${changeAcData?.message}`);
    }

    if (
      chanageAcError &&
      chanageAcError?.response &&
      chanageAcError?.response?.data &&
      chanageAcError?.response?.data?.success == false
    ) {
      _ERROR(`${chanageAcError?.response?.data?.massage}`);
    }
  }, [changeAc, changeAcData, chanageAcError]);

  useEffect(() => {
    if (changeChangePassData?.success) {
      setChangePassFormData(initialChangePasswordFormData);
      // _SUCCESS(`${changeChangePassData?.message}`)
    }

    if (
      passwError &&
      passwError?.response &&
      passwError?.response?.data &&
      passwError?.response?.data?.success == false
    ) {
      _ERROR(`${passwError?.response?.data?.massage}`);
    }
  }, [changeChangePass, changeChangePassData, passwError]);

  useEffect(() => {
    if (logedData && logedData?.role && logedData?.role?.label !== "guest") {
      setAcDetailsFormData((pre: any) => ({
        ...pre,
        first_name: logedData?.first_name,
        last_name: logedData?.last_name,
        display_name:
          logedData?.display_name != null
            ? logedData?.display_name
            : logedData?.username,
        email: logedData?.email,
        mobile_no: logedData?.phone_no,
      }));

      // if (logedData && logedData?.role && logedData?.role?.label !== "guest") {
      setShowLogout(true);
      // }
    }
  }, [logedData]);

  useEffect(() => {
    if (change_account_details_url) {
      setChange_account_details_url();
    }
    if (change_password_url) {
      setChange_password_url();
    }
  }, [change_account_details_url, change_password_url]);

  const handleAcDetailsChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;

    setAcDetailsFormData((pre: any) => ({
      ...pre,
      [name]: value,
    }));

    setAcDetailsFormDataError((pre: any) => ({
      ...pre,
      [name]: "",
    }));
  };

  const handleChangePassChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;

    setChangePassFormData((pre: any) => ({
      ...pre,
      [name]: value,
    }));

    if (name === "new_password" && !strongPasswordRegax(value)) {
      setChange_password_error1(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
    } else if (name === "new_password" && strongPasswordRegax(value)) {
      setChange_password_error1();
    }

    if (
      name === "confirm_new_password" &&
      changePassFormData?.new_password !== "" &&
      changePassFormData?.new_password &&
      changePassFormData?.new_password !== value
    ) {
      setChange_password_error("Confirm password is not matched");
    } else if (changePassFormData?.new_password === value) {
      setChange_password_error();
    }
  };

  const SavedAc = () => {
    let valid: boolean = true;

    if (acDetailsFormData?.first_name === "") {
      valid = false;
      setAcDetailsFormDataError((pre: any) => ({
        ...pre,
        first_name: "This field is requered*",
      }));
    }

    if (acDetailsFormData?.last_name === "") {
      valid = false;
      setAcDetailsFormDataError((pre: any) => ({
        ...pre,
        last_name: "This field is requered*",
      }));
    }

    if (acDetailsFormData?.display_name === "") {
      valid = false;
      setAcDetailsFormDataError((pre: any) => ({
        ...pre,
        display_name: "This field is requered*",
      }));
    }

    if (acDetailsFormData?.email === "") {
      valid = false;
      setAcDetailsFormDataError((pre: any) => ({
        ...pre,
        email: "This field is requered*",
      }));
    }

    if (acDetailsFormData?.mobile_no == "") {
      valid = false;
      setAcDetailsFormDataError((pre: any) => ({
        ...pre,
        mobile_no: "This field is requered*",
      }));
    } else if (!/^\d{10}$/.test(acDetailsFormData?.mobile_no)) {
      valid = false;
      setAcDetailsFormDataError((pre: any) => ({
        ...pre,
        mobile_no: "Invalid mobile phone number",
      }));
    }

    if (change_password_errpr) {
      valid = false;
    }

    if (
      changePassFormData?.new_password !== "" &&
      changePassFormData?.new_password &&
      changePassFormData?.new_password !==
      changePassFormData?.confirm_new_password
    ) {
      valid = false;
      setChange_password_error("Confirm password is not matched");
    }

    if (
      changePassFormData?.new_password !== "" &&
      !strongPasswordRegax(changePassFormData?.new_password)
    ) {
      valid = false;
      setChange_password_error1(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
    }

    if (valid) {
      setChange_account_details_url(change_account_details);
    }
  };

  const SavedChangePass = () => {
    // alert("dded")
    if (
      changePassFormData?.new_password !== "" &&
      !strongPasswordRegax(changePassFormData?.new_password)
    ) {
      setChange_password_error1(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
    }

    if (
      (changePassFormData?.new_password !== "" &&
        changePassFormData?.confirm_new_password !== "") ||
      (changePassFormData?.new_password &&
        changePassFormData?.new_password ===
        changePassFormData?.confirm_new_password)
    ) {
      if (changePassFormData?.new_password !== "" &&
        strongPasswordRegax(changePassFormData?.new_password)) {
        // alert("alert")
        setChange_password_url(change_password);
      }

    }

    if (
      changePassFormData?.new_password !== "" &&
      changePassFormData?.new_password &&
      changePassFormData?.new_password !==
      changePassFormData?.confirm_new_password
    ) {
      setChange_password_error("Confirm password is not matched");
    }
  };

  const [singleOrderDetails, setSingleOrderDetails] = useState<any>();
  const getSingleOrder = async (id: any) => {
    try {
      const { data } = await axios.get(`${get_single_order}/${id}`);
      if (data?.success) {
        setSingleOrderDetails(data?.data);
        setOrderView(true);
        setOrderTrackView(false);
        setOrderTrackID(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [otherView, setOtherView] = useState<any>("");

  console.log(otherView, "otherView")
  const orderOtherViewFalse = () => {
    setOrderView(false);
    setOrderTrackView(false);
    setOrderTrackID(null);
  };

  useEffect(() => {
    setGet_wish_list_url(get_wish_list);
    setWishListMeta({
      page: 1,
      rowsPerPage: 10,
      list_type: "RESENTLYVIEWPRODUCT",
    });
  }, []);

  const DefaultAdd = async (item: any) => {
    // console.log(item, "khijghuhu")
    // console.log(update_shipping_address, "update_shipping_address")
    const data = {
      "address_1": item?.address_1,
      "address_type": item?.address_type,
      "landmark": item?.landmark,
      "city": item?.city,
      "first_name": item?.first_name,
      "last_name": item?.last_name,
      "locality": item?.locality,
      "phone": item?.phone,
      "postcode": item?.postcode,
      "state": item?.state,
      "id": item?.id,
      "default": true
    };

    try {
      const res = await axios.post(`${update_shipping_address}`, { shipping_address: { ...data }, shipping_id: +item?.id }, { withCredentials: true })
      console.log(res, update_shipping_address, "sded")

      if (res?.data?.success) {

        setGetShippingAddressesUrl(get_user_shipping_addresses)
        _SUCCESS("Set as default address")
      }


    } catch (error) {
      console.log('error: ', error);
    }



  }

  const WalletTableData = async (startDate: any, endDate: any) => {
    try {
      const { data } = await _put(wallet_transaction_details, { start_date: startDate, end_date: endDate })
      if (data?.success) {
        setTrunsactionDetails(data?.data)
      }
    } catch (error) {
      console.log(error, "__error")
    }
  }

  useEffect(() => {
    const today = new Date();
    const end = today.toISOString().split("T")[0];
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    const startFormatted = start.toISOString().split("T")[0];

    setStartDate(startFormatted);
    setEndDate(end);

    if (startFormatted && end) {
      WalletTableData(startFormatted, end)
    }
  }, [otherView]);

  return (
    <>
      <div className="container">
        <div className="my-account mt-3">
          {/* <div className="flex items-start tm-flex-col gap-4"> */}

          {/* <div className="tm-w-full w-25">
              <div
                className="nav flex-column nav-pills me-5"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
              >
                <button
                  role="tab"
                  type="button"
                  className={
                    otherView === "dashboard" ? "nav-link active" : "nav-link"
                  }
                  data-bs-toggle="pill"
                  aria-selected="true"
                  id="v-pills-home-tab"
                  aria-controls="v-pills-home"
                  data-bs-target="#v-pills-home"
                  onClick={() => {
                    orderOtherViewFalse();
                    setOtherView("dashboard");
                  }}
                >
                  <span className="mu-ic">
                    <PersonIcon />
                  </span>{" "}
                  Dashboard
                </button>

                <button
                  role="tab"
                  type="button"
                  className={
                    otherView === "mywallet" ? "nav-link active" : "nav-link"
                  }
                  data-bs-toggle="pill"
                  aria-selected="false"
                  id="v-pills-profile-tab"
                  aria-controls="v-pills-profile"
                  data-bs-target="#v-pills-profile"
                  onClick={() => {
                    orderOtherViewFalse();
                    setOtherView("mywallet");
                  }}
                >
                  <span className="mu-ic">
                    <WalletIcon />
                  </span>{" "}
                  My Wallet
                </button>

                <button
                  role="tab"
                  type="button"
                  className={
                    otherView === "order" ? "nav-link active" : "nav-link"
                  }
                  data-bs-toggle="pill"
                  aria-selected="false"
                  id="v-pills-messages-tab"
                  aria-controls="v-pills-messages"
                  data-bs-target="#v-pills-messages"
                  onClick={() => {
                    orderOtherViewFalse();
                    setOtherView("order");
                  }}
                >
                  <span className="mu-ic">
                    <Inventory2Icon />
                  </span>{" "}
                  Orders
                </button>

                <button
                  role="tab"
                  type="button"
                  className={
                    otherView === "saveforlater"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  data-bs-toggle="pill"
                  aria-selected="false"
                  id="v-pills-save-for-later"
                  aria-controls="v-pills-messages"
                  data-bs-target="#v-pills-messages-save-for-later"
                  onClick={() => {
                    orderOtherViewFalse();
                    setOtherView("saveforlater");
                  }}
                >
                  <span className="mu-ic">
                    <BookmarkIcon />
                  </span>{" "}
                  Save For Later
                </button>

                <button
                  role="tab"
                  type="button"
                  className={
                    otherView === "recentviewitem"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  data-bs-toggle="pill"
                  aria-selected="false"
                  id="v-pills-Recently-Viewed-Items"
                  aria-controls="v-pills-messages"
                  data-bs-target="#v-pills-messages-Recently-Viewed-Items"
                  onClick={() => {
                    orderOtherViewFalse();
                    setOtherView("recentviewitem");
                  }}
                >
                  <span className="mu-ic">
                    <ScheduleIcon />
                  </span>
                  Recently Viewed Items
                </button>

                <button
                  role="tab"
                  type="button"
                  className={
                    otherView === "savehistory" ? "nav-link active" : "nav-link"
                  }
                  data-bs-toggle="pill"
                  aria-selected="false"
                  id="v-pills-Search-History"
                  aria-controls="v-pills-messages"
                  data-bs-target="#v-pills-messages-Search-History"
                  onClick={() => {
                    orderOtherViewFalse();
                    setOtherView("savehistory");
                  }}
                >
                  <span className="mu-ic">
                    <HistoryIcon />
                  </span>
                  Search History
                </button>
                <button
                  role="tab"
                  type="button"
                  className={
                    otherView === "myreview" ? "nav-link active" : "nav-link"
                  }
                  data-bs-toggle="pill"
                  aria-selected="false"
                  id="v-pills-settings-tab"
                  aria-controls="v-pills-settings"
                  data-bs-target="#v-pills-settings"
                  onClick={() => {
                    setOrderList(`${get_user_review}`);
                    orderOtherViewFalse();
                    setOtherView("myreview");
                  }}
                >
                  <span className="mu-ic">
                    <ReviewsIcon />
                  </span>{" "}
                  My Reviews
                </button>

                <button
                  role="tab"
                  type="button"
                  className={
                    otherView === "Wishlist" ? "nav-link active" : "nav-link"
                  }
                  data-bs-toggle="pill"
                  aria-selected="false"
                  id="v-pills-settings-tab-My-Wishlist"
                  aria-controls="v-pills-settings"
                  data-bs-target="#v-pills-settings-My-Wishlist"
                  onClick={() => setOtherView("Wishlist")}
                >
                  <span className="mu-ic">
                    <FavoriteIcon />
                  </span>{" "}
                  My Wishlist
                </button>

                <button
                  role="tab"
                  type="button"
                  className={
                    otherView === "billing" ? "nav-link active" : "nav-link"
                  }
                  data-bs-toggle="pill"
                  aria-selected="false"
                  id="v-pills-settings-tab1"
                  aria-controls="v-pills-settings1"
                  data-bs-target="#v-pills-settings1"
                  onClick={() => {
                    setGetbillingAddressesUrl(get_user_billing_addresses);
                    setBilling(true);
                    orderOtherViewFalse();
                    setOtherView("billing");
                  }}
                >
                  <span className="mu-ic">
                    <HomeIcon />
                  </span>{" "}
                  Billing Address
                </button>

                <button
                  role="tab"
                  type="button"
                  className={
                    otherView === "shipping" ? "nav-link active" : "nav-link"
                  }
                  data-bs-toggle="pill"
                  aria-selected="false"
                  id="v-pills-settings-tab2"
                  aria-controls="v-pills-settings2"
                  data-bs-target="#v-pills-settings2"
                  onClick={() => {
                    setGetShippingAddressesUrl(get_user_shipping_addresses);
                    setGetbillingAddressesUrl(get_user_billing_addresses);
                    setBilling(false);
                    orderOtherViewFalse();
                    setOtherView("shipping");
                    setShipingToBilling(true);
                  }}
                >
                  <span className="mu-ic">
                    <BusinessIcon />
                  </span>{" "}
                  Shipping Address
                </button>

                <button
                  role="tab"
                  type="button"
                  className={
                    otherView === "accountdetails"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  data-bs-toggle="pill"
                  aria-selected="false"
                  id="v-pills-settings-tab3"
                  aria-controls="v-pills-settings3"
                  data-bs-target="#v-pills-settings3"
                  onClick={() => {
                    orderOtherViewFalse();
                    setOtherView("accountdetails");
                  }}
                >
                  <span className="mu-ic">
                    <ManageAccountsIcon />
                  </span>{" "}
                  Account Details
                </button>

                {showLogout && (
                  <button
                    role="tab"
                    type="button"
                    className="nav-link"
                    data-bs-toggle="pill"
                    aria-selected="false"
                    id="v-pills-settings-tab4"
                    aria-controls="v-pills-settings4"
                    data-bs-target="#v-pills-settings4"
                    onClick={() => doLogout()}
                  >
                    <span className="mu-ic">
                      <LogoutIcon />
                    </span>
                    Logout
                  </button>
                )}
              </div>
            </div> */}
          {!ModalShowStatus && <div className="tm-w-full w-100 d-flex justify-content-between ">

            {/* <i className="fa-solid fa-arrow-left-long" style={{ paddingLeft: "8px", padding: "4px" }}></i> */}
            {otherView === "dashboard" ? <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Dashboard</h3> :
              otherView === "mywallet" ? <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">My Wallet</h3> :
                otherView === "order" ? <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Orders</h3> :
                  otherView === "saveforlater" ? <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Save For Later</h3> :
                    otherView === "recentviewitem" ? <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Recently Viewed Item</h3> :
                      otherView === "savehistory" ? <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Search History</h3> :
                        otherView === "myreview" ? <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">My Reviews</h3> :
                          otherView === "Wishlist" ? <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Wishlist</h3> :
                            otherView === "billing" ? <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Billing Address</h3> :
                              otherView === "shipping" ? <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Shipping Address</h3> :
                                otherView === "accountdetails" ? <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Account Details</h3> :
                                  ''
            }


            <button className="show-btn1 mb-3 h-fit" onClick={() => { setModalShowStatus(true) }} >
              <i className="fa-solid fa-arrow-left-long" style={{ paddingLeft: "8px", padding: "4px" }}></i>
              <span style={{ paddingRight: "9px" }}>back</span>
            </button>

          </div>}

          {!ModalShowStatus && <div className="tm-w-full w-100">
            <div className="tab-content" id="v-pills-tabContent">
              {/* dashboard */}
              {otherView === "dashboard" && (
                <div
                  className="tab-pane fade show active"
                  id="v-pills-home"
                  role="tabpanel"
                  aria-labelledby="v-pills-home-tab"
                >
                  <p className="acc-para !h-[5px]">
                    {logedData?.role?.label !== "guest" ? (
                      <>
                        Hello <strong> {logedData?.first_name}</strong>
                      </>
                    ) : null}
                    {showLogout && (
                      <>
                        ( not <strong>{logedData?.first_name}?</strong>{" "}
                        <Link
                          href="javascript:void(0);"
                          className="textLinkPink"
                          onClick={() => doLogout()}
                        >
                          Log out
                        </Link>{" "}
                        )
                      </>
                    )}
                  </p>
                  <p className="acc-para">
                    From your account dashboard you can view your{" "}
                    <Link
                      href="javascript:void(0);"
                      className="textLinkPink"
                      onClick={() => {
                        orderOtherViewFalse();
                        setOtherView("order");
                      }}
                    >
                      recent orders
                    </Link>{" "}
                    , manage your{" "}
                    <Link
                      href="javascript:void(0);"
                      className="textLinkPink"
                      onClick={() => {
                        setGetShippingAddressesUrl(
                          get_user_shipping_addresses
                        );
                        setGetbillingAddressesUrl(get_user_billing_addresses);
                        setBilling(false);
                        orderOtherViewFalse();
                        setOtherView("shipping");
                      }}
                    >
                      shipping
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="javascript:void(0);"
                      className="textLinkPink"
                      onClick={() => {
                        setGetbillingAddressesUrl(get_user_billing_addresses);
                        setBilling(true);
                        orderOtherViewFalse();
                        setOtherView("billing");
                      }}
                    >
                      billing addresses
                    </Link>{" "}
                    , and{" "}
                    <Link
                      href="javascript:void(0);"
                      className="textLinkPink"
                      onClick={() => {
                        orderOtherViewFalse();
                        setOtherView("accountdetails");
                      }}
                    >
                      edit your password and account details
                    </Link>{" "}
                    .
                  </p>
                </div>
              )}

              {/* wallet */}
              <div
                className={`tab-pane fade ${otherView === "mywallet" ? "show active" : ""
                  }`}
                id="v-pills-profile"
                role="tabpanel"
                aria-labelledby="v-pills-profile-tab"
              >
                <div className="acc-card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 col-7">
                        <h3 className="acc-title">
                          ₹{walet_amount?.id ? walet_amount?.total_amount : 0}
                        </h3>
                        <p className="acc-para1">Wallet Balance</p>
                      </div>
                      {/* <div className="col-md-6 col-5">
                                                    <button className='del'>Clean <span><DeleteIcon /></span></button>
                                                </div> */}
                    </div>
                  </div>
                </div>

                <div className="acc-card1">
                  <div className="card-body">
                    <span className="acc-svg">
                      <AccountBalanceWalletIcon />
                    </span>
                    <h3 className="recharge text-center pt-3">
                      Recharge Your Wallet
                    </h3>
                    <p className="acc-para text-center">
                      Add money to your wallet using Credit/ Debit card, UPI
                      or Net Banking
                    </p>

                    <div
                      className="relative flex items-center gap-2 amoutboxwrap_input"
                      style={{ width: "70%", margin: "1rem auto" }}
                    >
                      {/* <label for="exampleFormControlInput1" class="form-label">Email address</label> */}
                      <span
                        style={{
                          position: "absolute",
                          fontWeight: "600",
                          left: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: "1",
                          fontSize: "70%",
                        }}
                      >
                        ₹
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        style={{ margin: "0", paddingLeft: "30px", paddingRight: "100px", }}
                        id="exampleFormControlInput1"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={handleAmountChange}
                      />
                      <button
                        className="re-btn"
                        style={{ right: "4px", transform: "translateY(-50%)" }}
                        onClick={handleRechargeClick}
                      >
                        Recharge
                      </button>
                    </div>

                  </div>
                </div>

                <div
                  className={`tab-pane fade mt-3 ${!orderView ? "show active" : ""}`}
                  id="v-pills-messages"
                  role="tabpanel"
                  aria-labelledby="v-pills-messages-tab"
                >
                  <div className="flex items-center justify-between mb-2 show_wallet_filter_root">
                    <h4 className="m-0">All transaction details</h4>
                    <div className="flex items-end justify-end gap-2 filter" style={{ width: "60%" }}>
                      <div className="flex flex-col items-start w-full">
                        <span style={{ fontSize: "12px" }}>Start Date</span>
                        <input type="date" className="form-control cursor-pointer" value={startDate} onChange={(e: any) => setStartDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                      </div>
                      <div className="flex flex-col items-start w-full">
                        <span style={{ fontSize: "12px" }}>End Date</span>
                        <input type="date" className="form-control cursor-pointer" value={endDate} onChange={(e: any) => setEndDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                      </div>
                      <button
                        className="show-btn1 text-white m-0 px-4"
                        style={{ height: "36px" }}
                        onClick={() => WalletTableData(startDate, endDate)}
                      >
                        Filter
                      </button>
                    </div>
                  </div>
                  <div className="table-responsive mb-4 show_wallet_table_root">
                    <table className="table table-bordered bsb-table-xl text-nowrap align-middle m-0">
                      <thead>
                        <tr>
                          <th style={{ color: "#ffffff" }} scope="col">
                            Date
                          </th>
                          <th style={{ color: "#ffffff" }} scope="col">
                            Desc
                          </th>
                          <th style={{ color: "#ffffff" }} scope="col">
                            Debit
                          </th>
                          <th style={{ color: "#ffffff" }} scope="col">
                            Credit
                          </th>
                          <th style={{ color: "#ffffff" }} scope="col">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ width: "15%" }} className="acc-para text-center">{startDate}</td>
                          <td style={{ width: "40%" }} className="acc-para text-center">Opening Balance As On {currencyFormatter.format((+trunsactionDetails?.opening_balance), { code: 'INR' })}&nbsp;{trunsactionDetails?.start_date}</td>
                          <td style={{ width: "15%" }} className="acc-para text-center">{trunsactionDetails?.opening_transaction_type !== "CREDIT" && "Debit"}</td>
                          <td style={{ width: "15%" }} className="acc-para text-center">{trunsactionDetails?.opening_transaction_type === "CREDIT" && "Credit"}</td>
                          <td style={{ width: "15%" }} className="acc-para text-center">{currencyFormatter.format((+trunsactionDetails?.opening_balance), { code: 'INR' })}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "15%" }} className="acc-para text-center">{endDate}</td>
                          <td style={{ width: "40%" }} className="acc-para text-center">Closing Balance As On {currencyFormatter.format((+trunsactionDetails?.closing_balance), { code: 'INR' })}&nbsp;{trunsactionDetails?.end_date}</td>
                          <td style={{ width: "15%" }} className="acc-para text-center">{trunsactionDetails?.closing_transaction_type !== "CREDIT" && "Debit"}</td>
                          <td style={{ width: "15%" }} className="acc-para text-center">{trunsactionDetails?.closing_transaction_type === "CREDIT" && "Credit"}</td>
                          <td style={{ width: "15%" }} className="acc-para text-center">{currencyFormatter.format((+trunsactionDetails?.closing_balance), { code: 'INR' })}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="show_wallet_card_root">
                    <div className="card gap-1">
                      <div className="data_root_order flex items-center">
                        <div className="data_header" style={{ width: "30%" }}>Date:</div>
                        <div className="data_body" style={{ width: "70%" }}>{startDate} To {endDate}</div>
                      </div>
                      <div className="data_root_order flex">
                        <div className="data_header" style={{ width: "30%" }}>Balance:</div>
                        <div className="data_body" style={{ width: "70%" }}>{currencyFormatter.format((+trunsactionDetails?.closing_balance), { code: 'INR' })}</div>
                      </div>
                      <div className="data_root_order flex">
                        <div className="data_header" style={{ width: "60%" }}>Opening Transaction Type:</div>
                        <div className="data_body text-white" style={{ width: "40%" }}><span style={trunsactionDetails?.opening_transaction_type === "CREDIT" ? { background: "#466d00", padding: "2px 8px" } : { background: "#51247f", padding: "2px 8px" }} className="rounded">{trunsactionDetails?.opening_transaction_type === "CREDIT" ? "Credit" : "Debit"}</span></div>
                      </div>
                      <div className="data_root_order flex">
                        <div className="data_header" style={{ width: "60%" }}>Closing Transaction Type:</div>
                        <div className="data_body text-white" style={{ width: "40%" }}><span style={trunsactionDetails?.closing_transaction_type === "CREDIT" ? { background: "#466d00", padding: "2px 8px" } : { background: "#51247f", padding: "2px 8px" }} className="rounded">{trunsactionDetails?.closing_transaction_type === "CREDIT" ? "Credit" : "Debit"}</span></div>
                      </div>
                      <div className="data_root_order">
                        <div className="data_header">Desc:</div>
                        <div className="data_body w-100">
                          <p className="m-0 ps-1" style={{ fontSize: "12px" }}>Opening Balance As On <strong>{currencyFormatter.format((+trunsactionDetails?.opening_balance), { code: 'INR' })}</strong>&nbsp;{trunsactionDetails?.start_date}</p>
                          <p className="m-0 ps-1" style={{ fontSize: "12px" }}>Closing Balance As On <strong>{currencyFormatter.format((+trunsactionDetails?.closing_balance), { code: 'INR' })}</strong>&nbsp;{trunsactionDetails?.end_date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* {orderDetails?.totalPage > 1 ? (
                    <div className="w-full flex items-center justify-center">
                      <Pagination
                        count={orderDetails?.totalPage}
                        defaultPage={orderListPayload?.page}
                        variant="outlined"
                        shape="rounded"
                        onChange={(event: any, page: any) => {
                          orderListPagenation(page);
                        }}
                      />
                    </div>
                  ) : null} */}
                </div>

                {/* <h3 className='acc-title1 mt-4'>All Transaction Detail</h3> */}

                {/* 
                                    <div className="row mt-4">
                                        <div className="col-md-3">
                                            <div className="mb-3">
                                                <label htmlFor="inputPassword" className="col-form-label">Transaction:</label>
                                                <div className="">
                                                    <input type="date" className="form-control" id="inputdate" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="mb-3">
                                                <label htmlFor="inputPassword" className=" col-form-label">To:</label>
                                                <div className="">
                                                    <input type="date" className="form-control" id="inputdate" />

                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2" style={{ marginTop: "11px" }}>
                                            <button className='show-btn mt-md-4'>Show</button>
                                        </div>
                                        <div className="col-md-3"></div>
                                    </div> */}

                {/* <div className="table-responsive mt-5 mb-4">
                                        <table className="table table-bordered bsb-table-xl text-nowrap align-middle m-0">
                                            <thead >
                                                <tr>

                                                    <th scope="col">Date</th>
                                                    <th scope="col">Desc</th>
                                                    <th scope="col">Debit</th>
                                                    <th scope="col">Credit</th>
                                                    <th scope="col">Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td></td>
                                                    <td>OPENING BALANCE AS ON 13-03-2024</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>2000.00</td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>CLOSING BALANCE AS ON 12-04-2024</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>2000.00</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div> */}
              </div>


              {/* order */}
              {!orderView &&
                !orderTrackView &&
                orderDetails &&
                orderDetails?.orders?.length ? (
                otherView === "order" ? (
                  <div
                    className={`tab-pane fade ${!orderView ? "show active" : ""
                      }`}
                    id="v-pills-messages"
                    role="tabpanel"
                    aria-labelledby="v-pills-messages-tab"
                  >
                    {/* <div className="oreder_card_root">
                      {orderDetails?.totalPage > 1 ? (
                        <div className="w-full flex items-center justify-center order_pagination">
                          <Pagination
                            count={orderDetails?.totalPage}
                            defaultPage={orderListPayload?.page}
                            
                            variant="outlined"
                            shape="rounded"
                            onChange={(event: any, page: any) => {
                              orderListPagenation(page);
                            }}
                          />
                        </div>
                      ) : null}
                    </div> */}
                    <div className="table-responsive  mb-4 oreder_card_root_list">
                      <table className="table table-bordered bsb-table-xl text-nowrap align-middle m-0">
                        <thead>
                          <tr>
                            <th style={{ color: "#ffffff" }} scope="col">
                              Order
                            </th>
                            <th style={{ color: "#ffffff" }} scope="col">
                              Image
                            </th>
                            <th style={{ color: "#ffffff" }} scope="col" className="text-start">
                              Date
                            </th>
                            <th style={{ color: "#ffffff" }} scope="col" className="text-start">
                              Status
                            </th>
                            <th style={{ color: "#ffffff" }} scope="col" className="text-start">
                              Total
                            </th>
                            <th style={{ color: "#ffffff" }} scope="col">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderDetails?.orders?.length
                            ? orderDetails?.orders.map(
                              (v: any, i: number) => {
                                return (
                                  <tr key={i}>
                                    {/* <th scope="row">1</th> */}
                                    <td className="color-e4509d" style={{ width: "5%" }}>
                                      #{v?.id}
                                    </td>
                                    <td className="color-e4509d" style={{ width: "5%" }}>
                                      {/* {v?.order_items[0]?.order_product_lookup?.product?.images ?  */}
                                      <div className="flex items-center justify-center w-full h-full">
                                        <Image
                                          src={v?.order_items[0]?.order_product_lookup?.product?.images ? v?.order_items[0]?.order_product_lookup?.product?.images[0]?.src : brandDam}
                                          alt={v?.order_items[0]?.order_product_lookup?.product[0]?.images[0]?.name || "product data"}
                                          style={{ width: "40px", height: "40px" }}
                                          width={192}
                                          height={108}
                                        />
                                      </div>
                                      {/* : null} */}
                                    </td>
                                    <td style={{ width: "25%" }}>
                                      {v?.order_status ?
                                        convertDateString(
                                          v?.order_status?.date_created
                                        ) : "--"}
                                    </td>
                                    <td style={{ width: "15%" }}>
                                      {v?.order_status &&
                                        v?.order_status &&
                                        v?.order_status?.order_status &&
                                        v?.order_status?.order_status
                                          ?.title}
                                      {/* {
                                                                                v?.order_status && v?.order_status && v?.order_status?.customer_return == true ?
                                                                                    "Return Processing" : v?.order_status?.order_status?.title
                                                                            } */}
                                    </td>
                                    <td style={{ width: "25%" }}>
                                      {currencyFormatter.format((+v?.order_status?.net_total), { code: 'INR' })}
                                    </td>
                                    <td style={{ width: "15%" }}>
                                      <div className="flex items-center justify-end gap-2" style={{ marginRight: "20px" }}>
                                        {/* <button
                                          className="show-btn1"
                                          type="button"
                                          onClick={() =>
                                            getSingleOrder(v?.id)
                                          }
                                        > */}
                                        <Tooltip title="View" placement="left" arrow>
                                          <div className="cursor-pointer pinkBorder">
                                            <VisibilityIcon
                                              style={{ fontSize: "20px" }}
                                              className="color-e4509d"
                                              onClick={() =>
                                                getSingleOrder(v?.id)
                                              }
                                            />
                                          </div>
                                        </Tooltip>
                                        {/* </button> */}
                                        {/* <button
                                          className="show-btn1"
                                          type="button"
                                          onClick={() =>
                                            trackYourOrder(v?.id)
                                          }
                                        >
                                          Track Your Order
                                          
                                        </button> */}
                                        <Tooltip title="Track Your Order" placement="bottom" arrow>
                                          <div className="cursor-pointer pinkBorder" style={{ borderColor: "#008000" }}>
                                            <Image
                                              src={trackingCar}
                                              alt="trackingCar"
                                              style={{ width: "20px", minWidth: "20px", height: "auto" }}
                                              onClick={() =>
                                                trackYourOrder(v?.id)
                                              }
                                            />
                                          </div>
                                        </Tooltip>
                                        {v &&
                                          v?.order_status &&
                                          v?.order_status?.order_status &&
                                          v?.order_status?.order_status
                                            ?.title === "completed" &&
                                          v?.is_returnable == true &&
                                          v?.order_status?.customer_return !=
                                          true ? (
                                          // <button
                                          //   className="show-btn1"
                                          //   type="button"
                                          //   onClick={() =>
                                          //     returnOrderRequest(v?.id)
                                          //   }
                                          // >
                                          //   Return Request
                                          // </button>
                                          <Tooltip title="Return Request" placement="bottom" arrow>
                                            <div className="cursor-pointer pinkBorder" style={{ borderColor: "#FFA500", }}>
                                              <Image
                                                src={returnIcon}
                                                alt="trackingCar"
                                                style={{ width: "20px", minWidth: "20px", height: "auto" }}
                                                onClick={() =>
                                                  returnOrderRequest(v?.id)
                                                }
                                              />
                                            </div>
                                          </Tooltip>
                                        ) : v &&
                                          v?.order_status &&
                                          v?.order_status?.order_status &&
                                          v?.order_status?.order_status
                                            ?.title ===
                                          "cancelled" ? null : (v &&
                                            v?.order_status &&
                                            v?.order_status?.order_status &&
                                            v?.order_status?.order_status
                                              ?.title === "completed") ||
                                            (v &&
                                              v?.order_status &&
                                              v?.order_status?.order_status &&
                                              v?.order_status?.order_status
                                                ?.title ===
                                              "return processing") ||
                                            (v &&
                                              v?.order_status &&
                                              v?.order_status?.order_status &&
                                              v?.order_status?.order_status
                                                ?.title ===
                                              "refunded") ? null : (
                                          // <button
                                          //   className="show-btn1"
                                          //   type="button"
                                          //   onClick={() =>
                                          //     canselOrder(v?.id)
                                          //   }
                                          // >
                                          //   Cancel
                                          // </button>
                                          <Tooltip title="Cancel" placement="right" arrow>
                                            <div className="cursor-pointer pinkBorder" style={{ borderColor: "#EE0000" }}>
                                              <Image
                                                src={cancelOrder}
                                                alt="trackingCar"
                                                style={{ width: "20px", minWidth: "20px", height: "auto" }}
                                                onClick={() =>
                                                  canselOrder(v?.id)
                                                }
                                              />
                                            </div>
                                          </Tooltip>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }
                            )
                            : null}
                        </tbody>
                      </table>
                    </div>
                    <div className="oreder_card_root">
                      {orderDetails?.orders?.length
                        ? orderDetails?.orders.map(
                          (v: any, i: number) => {
                            return (
                              <div key={i} className="card">
                                <div className="data_root">
                                  <div className="data_body"><span className="text-white w-fit px-1 rounded" style={{ background: "#179a17" }}>#{v?.id}</span></div>
                                  <div className="data_header">
                                    <div className="flex items-center justify-end gap-2 pb-1" style={{ marginRight: "20px" }}>
                                      <Tooltip title="View" placement="left" arrow>
                                        <div className="cursor-pointer pinkBorder">
                                          <VisibilityIcon
                                            style={{ fontSize: "15px" }}
                                            className="color-e4509d"
                                            onClick={() =>
                                              getSingleOrder(v?.id)
                                            }
                                          />
                                        </div>
                                      </Tooltip>
                                      <Tooltip title="Track Your Order" placement="bottom" arrow>
                                        <div className="cursor-pointer pinkBorder" style={{ borderColor: "#008000" }}>
                                          <Image
                                            src={trackingCar}
                                            alt="trackingCar"
                                            style={{ width: "15px", minWidth: "15px", height: "auto" }}
                                            onClick={() =>
                                              trackYourOrder(v?.id)
                                            }
                                          />
                                        </div>
                                      </Tooltip>
                                      {v &&
                                        v?.order_status &&
                                        v?.order_status?.order_status &&
                                        v?.order_status?.order_status
                                          ?.title === "completed" &&
                                        v?.is_returnable == true &&
                                        v?.order_status?.customer_return !=
                                        true ? (
                                        <Tooltip title="Return Request" placement="bottom" arrow>
                                          <div className="cursor-pointer pinkBorder" style={{ borderColor: "#FFA500", }}>
                                            <Image
                                              src={returnIcon}
                                              alt="trackingCar"
                                              style={{ width: "15px", minWidth: "15px", height: "auto" }}
                                              onClick={() =>
                                                returnOrderRequest(v?.id)
                                              }
                                            />
                                          </div>
                                        </Tooltip>
                                      ) : v &&
                                        v?.order_status &&
                                        v?.order_status?.order_status &&
                                        v?.order_status?.order_status
                                          ?.title ===
                                        "cancelled" ? null : (v &&
                                          v?.order_status &&
                                          v?.order_status?.order_status &&
                                          v?.order_status?.order_status
                                            ?.title === "completed") ||
                                          (v &&
                                            v?.order_status &&
                                            v?.order_status?.order_status &&
                                            v?.order_status?.order_status
                                              ?.title ===
                                            "return processing") ||
                                          (v &&
                                            v?.order_status &&
                                            v?.order_status?.order_status &&
                                            v?.order_status?.order_status
                                              ?.title ===
                                            "refunded") ? null : (
                                        <Tooltip title="Cancel" placement="right" arrow>
                                          <div className="cursor-pointer pinkBorder" style={{ borderColor: "#EE0000" }}>
                                            <Image
                                              src={cancelOrder}
                                              alt="trackingCar"
                                              style={{ width: "15px", minWidth: "15px", height: "auto" }}
                                              onClick={() =>
                                                canselOrder(v?.id)
                                              }
                                            />
                                          </div>
                                        </Tooltip>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="data_root">
                                  <div className="data_header">Date:</div>
                                  <div className="data_body">
                                    {convertDateString(
                                      v?.order_status?.date_created
                                    )}
                                  </div>
                                </div>
                                <div className="data_root">
                                  <div className="data_header">Status:</div>
                                  <div className="data_body capitalize" style={{ fontWeight: "600" }}>
                                    {v?.order_status &&
                                      v?.order_status &&
                                      v?.order_status?.order_status &&
                                      v?.order_status?.order_status
                                        ?.title}
                                  </div>
                                </div>
                                <div className="data_root">
                                  <div className="data_header">Total:</div>
                                  <div className="data_body">
                                    {currencyFormatter.format((+v?.order_status?.net_total), { code: 'INR' })}
                                  </div>
                                </div>
                                <div className="data_root">
                                  <div className="data_header"></div>
                                  <div className="data_body">

                                  </div>
                                </div>
                              </div>
                            )
                          }) : null}
                    </div>
                    {orderDetails?.totalPage > 1 ? (
                      <div className="w-full flex items-center justify-center order_pagination">
                        <Pagination
                          count={orderDetails?.totalPage}
                          defaultPage={orderListPayload?.page}
                          variant="outlined"
                          shape="rounded"
                          onChange={(event: any, page: any) => {
                            orderListPagenation(page);
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null
              ) : !orderDetails?.orders?.length && otherView === "order" ? (null) : orderTrackView ? (
                <TrackOrderDetails tid={orderTrackID} />
              ) : (
                <OrderDetailsShow dataSet={singleOrderDetails} />
              )}

              {otherView === "order" ?
                orderDetails?.orders?.length ? null : <div className='flex flex-col items-center justify-center w-full h-full'>
                  <Image src={emptyBox} alt='no_data_ill' width={192} height={108} />
                  <h4 className='flex flex-col items-center justify-center w-full h-full gap-1'>
                    <span style={{ fontSize: '18px' }}>Oops! No order found</span>
                    <span style={{ fontSize: '14px' }}>
                      <Link href='/' className="color-e4509d">Go to homepage</Link>
                    </span>
                  </h4>
                </div> : null}

              {/* SAVEFORLATER */}
              <div
                className={`tab-pane fade ${otherView === "saveforlater" ? "show active" : ""
                  }`}
                id="v-pills-messages-save-for-later"
                role="tabpanel"
                aria-labelledby="v-pills-save-for-later"
              >
                <Wishlist listType="SAVEFORLATER" location={"account"} />
              </div>

              {/* Recently Viewed */}
              <div
                className={`tab-pane fade ${otherView === "recentviewitem" ? "show active" : ""
                  }`}
                id="v-pills-messages-Recently-Viewed-Items"
                role="tabpanel"
                aria-labelledby="v-pills-Recently-Viewed-Items"
              >
                {getWishListRVI?.products?.length ?
                  <div className="viewedItems_root">

                    {getWishListRVI?.products.map((v: any, i: number) => (
                      <Link
                        key={i}
                        href={`/product/${v?.product?.slug}`}
                        className="storeLocator_card viewedItems"
                      >
                        <div className="flex items-start justify-start gap-2">
                          <div style={{
                            border: "1px solid rgb(212, 212, 212)",
                            borderRadius: "6px",
                            width: "20%",
                            height: "80px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <Image
                              src={
                                v?.product?.images?.length
                                  ? v?.product?.images[0]?.src
                                  : brandDam
                              }
                              style={{
                                width: "auto",
                                height: "75px",
                              }}
                              alt="productImage"
                              width={192}
                              height={108}
                            />
                          </div>

                          <div className="" style={{ width: "75%" }}>
                            <p className="m-0 p-0 truncate">
                              {v?.product?.name}
                            </p>
                            <div
                              className="rating"
                              style={{ width: "fit-content" }}
                            >
                              <Stack spacing={1}>
                                <Rating
                                  name="half-rating"
                                  defaultValue={v?.product?.rating}
                                  precision={0.5}
                                  readOnly
                                  size="small"
                                />
                              </Stack>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}

                  </div>
                  :
                  <div className='flex flex-col items-center justify-center w-full h-full'>
                    <Image src={emptyBox} alt='no_data_ill' width={192} height={108} />
                    <h4 className='flex flex-col items-center justify-center w-full h-full gap-1'>
                      <span style={{ fontSize: '18px' }}>Oops! No recently viewed item found</span>
                      <span style={{ fontSize: '14px' }}>
                        <Link href='/' className="color-e4509d">Go to homepage</Link>
                      </span>
                    </h4>
                  </div>
                }
              </div>

              {/* Search History */}
              <div
                className={`tab-pane fade ${otherView === "savehistory" ? "show active" : ""
                  }`}
                id="v-pills-messages-Search-History"
                role="tabpanel"
                aria-labelledby="v-pills-Search-History"
              >
                {getWishListSH?.length ? (
                  <div className="viewedHistory_root">
                    {getWishListSH.map((v: any, i: number) => (
                      <Link
                        key={i}
                        href={`/shop/${lowerCase(v?.searchterm)}?type=search`}
                        className="searchHistory_card viewedHistory"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className="m-0 p-0 truncate"
                            style={{ color: "#2d2d2d", fontWeight: "bold" }}
                          >
                            {i + 1}
                          </p>
                          <p className="m-0 p-0 truncate">{v?.searchterm}</p>
                          <Image
                            src={customArrowLink}
                            alt="customArrowLink"
                            width={15}
                            height={15}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center w-full h-full'>
                    <Image src={emptyBox} alt='no_data_ill' width={192} height={108} />
                    <h4 className='flex flex-col items-center justify-center w-full h-full gap-1'>
                      <span style={{ fontSize: '18px' }}>Oops! No search history found</span>
                      <span style={{ fontSize: '14px' }}>
                        <Link href='/' className="color-e4509d">Go to homepage</Link>
                      </span>
                    </h4>
                  </div>
                )}
              </div>

              {/* v-pills-messages-Notification-Setting */}
              {/* <div
                className={`tab-pane fade ${otherView === "mywallet" ? "show active" : ""
                  }`}
                id="v-pills-messages-Notification-Setting"
                role="tabpanel"
                aria-labelledby="v-pills-Notification-Setting"
              >
                v-pills-messages-Notification-Setting
              </div> */}

              {/* my review */}
              <div
                className={`tab-pane fade ${otherView === "myreview" ? "show active" : ""
                  }`}
                id="v-pills-settings"
                role="tabpanel"
                aria-labelledby="v-pills-settings-tab"
              >
                <div className="row review gap-2">
                  {getUserReviewDetails?.length ? (
                    getUserReviewDetails.map(
                      (v: any, i: number) => (
                        <div className="storeLocator_card relative" key={i}>
                          <div className="flex flex-col">
                            <div className="flex items-start gap-3">
                              {/* <Image src={"/assets/images/testimonial-thumb.png"} alt='reviewer_image' width={42} height={42} /> */}
                              <div className="flex flex-col items-start">
                                <div className="flex items-center gap-2">
                                  {!v?.anonymous ? (
                                    <p className="m-0 reviewer_name capitalize">
                                      {logedData?.first_name}&nbsp;
                                      {logedData?.last_name}
                                    </p>
                                  ) : (
                                    <p className="m-0 reviewer_name">
                                      Anonymous
                                    </p>
                                  )}
                                  <p className={`m-0 px-3 review_status ${v?.review_status === "PENDING" ? "p_review_status" : "a_review_status"} uppercase`}>{v?.review_status === "PENDING" ? v?.review_status : "Approved"}</p>
                                </div>
                                <div className="flex items-start">
                                  <Image
                                    src={v?.product?.images ? v?.product?.images[0]?.src : brandDam}
                                    alt={v?.product?.images[0]?.alt || "Prduct Image"}
                                    width={192}
                                    height={108}
                                    style={{ width: "48px", height: "52px" }}
                                  />
                                  <Link
                                    href={`/product/${v?.product?.slug}`}
                                    className={`truncate w-100`}
                                    style={{ fontSize: "16px", padding: "2px 0 0 4px" }}
                                  >
                                    {v?.product?.name.slice(1, 70)}{v?.product?.name?.length > 69 ? `...` : null}
                                  </Link>
                                </div>
                                <div className="flex justify-end">
                                  <Rating
                                    precision={0.5}
                                    value={v?.item_rating}
                                    size="small"
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="reviewer_content_root gap-1">
                              <span className="reviewer_content">
                                {v?.description}
                              </span>
                            </div>
                          </div>
                        </div>
                      )

                      // <div key={i} className="col-xl-7">
                      //     <div className="acc-card1 mb-4 mt-0">
                      //         <div className="card-body">
                      //             <div className="col-md-6 col-6">
                      //                 <Image src={v?.userReviewImage?.length[0]?.src ? v?.userReviewImage[0]?.src : "/assets/images/testimonial-thumb.png"} alt="cart1" className={``} width={60} height={60} />
                      //             </div>

                      //             <h3 className="ptitle nw"><Link href="javascript:void(0);">{v?.product?.name}</Link></h3>

                      //             <div className="rating">
                      //                 <Stack spacing={1}>
                      //                     <Rating name="half-rating" defaultValue={+(v?.item_rating)} precision={0.5} readOnly />
                      //                 </Stack>
                      //             </div>
                      //             <p className='acc-para'>{v?.description}</p>
                      //         </div>
                      //     </div>
                      // </div>
                    )
                  ) : (
                    <div className='flex flex-col items-center justify-center w-full h-full'>
                      <Image src={emptyBox} alt='no_data_ill' width={192} height={108} />
                      <h4 className='flex flex-col items-center justify-center w-full h-full gap-1'>
                        <span style={{ fontSize: '18px' }}>Oops! No review found</span>
                        <span style={{ fontSize: '14px' }}>
                          <Link href='/' className="color-e4509d">Go to homepage</Link>
                        </span>
                      </h4>
                    </div>
                  )}
                  <div className="col-md-5"></div>
                </div>
              </div>

              {/* WISHLIST */}
              <div
                className={`tab-pane fade ${otherView === "Wishlist" ? "show active" : ""
                  }`}
                id="v-pills-settings-My-Wishlist"
                role="tabpanel"
                aria-labelledby="v-pills-save-for-later"
              >
                <Wishlist listType="WISHLIST" location={"account"} />
              </div>

              {/* Billing Address */}
              <div
                className={`tab-pane fade ${otherView === "billing" ? "show active" : ""
                  }`}
                id="v-pills-settings1"
                role="tabpanel"
                aria-labelledby="v-pills-settings-tab1"
              >
                <div className="row">
                  <div className="col-xl-7">
                    <div className="acc-card1 mb-4 mt-0">
                      <p className="acc-para">
                        The following addresses will be used on the checkout
                        page by default.
                      </p>
                      <h3 className="acc-title1 pt-2 flex items-center gap-2 m-0">
                        Billing Address{" "}
                        <span>
                          <button
                            className="show-btn1 flex items-center py-1 px-2 m-0 h-fit"
                            onClick={() =>
                              handleEditClick(billingAddresses, 2)
                            }
                          >
                            <span className="me-1">
                              {billingAddresses?.id ? (
                                <EditIcon
                                  style={{ width: "14px", height: "14px" }}
                                />
                              ) : (
                                <AddIcon
                                  style={{ width: "18px", height: "18px" }}
                                />
                              )}
                            </span>
                            {billingAddresses?.id ? "Edit" : "Add"}
                          </button>
                        </span>
                      </h3>
                      {billingAddresses?.id && (
                        <>
                          <p className="acc-para">
                            {billingAddresses?.first_name +
                              billingAddresses?.last_name}
                          </p>
                          <p className="acc-para">
                            {billingAddresses?.address_1}
                          </p>
                          <p className="acc-para">
                            {billingAddresses?.city +
                              " " +
                              billingAddresses?.postcode}
                          </p>
                          <p className="acc-para">
                            {billingAddresses?.state}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-xl-5"></div>
                </div>
              </div>

              {/* Shiping Address */}
              <div
                className={`tab-pane fade ${otherView === "shipping" ? "show active" : ""
                  }`}
                id="v-pills-settings2"
                role="tabpanel"
                aria-labelledby="v-pills-settings-tab2"
              >
                {/* <div className="row">
                    <div className="col-md-10"></div>
                    <div className="col-md-2">
                      <button
                        className="show-btn1 float-end flex items-center"
                        style={{ background: "#28a745" }}
                        onClick={() => {
                          setErrors({});
                          setSideBarOpen(true);
                          setEditId(null);
                        }}
                      >
                        Add <AddIcon className="plusIcon" />
                      </button>
                    </div>
                  </div> */}

                {/* Shipping address content v?.address_1 && v.address_1 !== "" && v.city !== "" && v?.postcode && v.postcode !== "" */}

                <div className='BillingAddress_sec'>
                  <div className='container'>
                    <div className='allbilling_address'>

                      <div className='singAddress_box deshborder' onClick={() => {
                        setErrors({});
                        setSideBarOpen(true);
                        setEditId(null);
                      }}>
                        <button className='address_addbtn'>
                          <span className='icon'><i className="fa-solid fa-plus"></i></span>
                          <h4 className='head'>Add address</h4>
                        </button>
                      </div>

                      {shippingAddresses?.length ? shippingAddresses.map((items: any, index: number) => {
                        return (
                          <div className={`singAddress_box flex flex-col justify-between ${items?.default ? `shadow` : ``}`} key={index}>
                            <div>
                              <h4 className='name truncate'>{items.first_name} {items?.last_name}</h4>
                              <p className='adderss truncate'>{items?.address_1}</p>
                              <p className='phone m-0'>Phone Number: <span>{items?.phone}</span></p>
                            </div>
                            <ul className='bottom_area'>
                              <li><button className='hero_btn' onClick={() => {
                                setErrors({});
                                handleEditClick(items);
                                setShiping_Id(items?.id);
                              }}>Edit</button></li>
                              <li><button className='hero_btn' onClick={() => { setDeleteIDAddress(items?.id); setDeleteAddress(true) }
                              }>Remove</button></li>
                              {!items?.default && <li><button className='hero_btn' onClick={() => DefaultAdd(items)}>Set as Default</button></li>}
                            </ul>
                          </div>
                        )
                      }) : null}

                    </div>
                  </div>
                </div>
              </div>

              {/* account details */}
              <div
                className={`tab-pane fade ${otherView === "accountdetails" ? "show active" : ""
                  }`}
                id="v-pills-settings3"
                role="tabpanel"
                aria-labelledby="v-pills-settings-tab3"
              >
                {logedData?.role?.label === "guest" ? (
                  <div className="short_note mb-3 p-3 flex ga-4">
                    {/* <div className='dotMain m-0'>
                                                <span className='dot m-0'></span>
                                                <span className='blink m-0'></span>
                                            </div> */}
                    Currently, you are a guest. Please fill in your account
                    details to create your account.
                  </div>
                ) : null}
                <div className="acc-card1 mt-0 mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className=" inp-nx mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            First name{" "}
                            <span className="color-e4509d">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Enter First Name "
                            name="first_name"
                            value={acDetailsFormData?.first_name}
                            onChange={(e: any) => handleAcDetailsChange(e)}
                          />
                          {acDetailsFormDataError?.first_name ===
                            "" ? null : (
                            <div
                              style={{
                                fontSize: "65%",
                                fontWeight: "500",
                                color: "red",
                              }}
                              className="form-text"
                            >
                              {acDetailsFormDataError?.first_name}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className=" inp-nx mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Last name{" "}
                            <span className="color-e4509d">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Enter Last Name "
                            name="last_name"
                            value={acDetailsFormData?.last_name}
                            onChange={(e: any) => handleAcDetailsChange(e)}
                          />
                          {acDetailsFormDataError?.last_name === "" ? null : (
                            <div
                              style={{
                                fontSize: "65%",
                                fontWeight: "500",
                                color: "red",
                              }}
                              className="form-text"
                            >
                              {acDetailsFormDataError?.last_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className=" inp-nx mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Display name{" "}
                            <span className="color-e4509d">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder=" Enter Display Name"
                            name="display_name"
                            value={acDetailsFormData?.display_name}
                            onChange={(e: any) => handleAcDetailsChange(e)}
                          />
                        </div>
                        {acDetailsFormDataError?.display_name ===
                          "" ? null : (
                          <div
                            style={{
                              fontSize: "65%",
                              fontWeight: "500",
                              color: "red",
                            }}
                            className="form-text"
                          >
                            {acDetailsFormDataError?.display_name}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <div className=" inp-nx mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Email Address{" "}
                            <span className="color-e4509d">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Enter Email Address"
                            name="email"
                            value={acDetailsFormData?.email}
                            onChange={(e: any) => handleAcDetailsChange(e)}
                          />
                        </div>
                        {acDetailsFormDataError?.email === "" ? null : (
                          <div
                            style={{
                              fontSize: "65%",
                              fontWeight: "500",
                              color: "red",
                            }}
                            className="form-text"
                          >
                            {acDetailsFormDataError?.email}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <div className=" inp-nx mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Mobile phone{" "}
                            <span className="color-e4509d">*</span>
                          </label>
                          <input
                            disabled={true}
                            type="number"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Enter Phone Number"
                            name="mobile_no"
                            value={acDetailsFormData?.mobile_no}
                            onChange={(e: any) => handleAcDetailsChange(e)}
                          />
                          {acDetailsFormDataError?.mobile_no === "" ? null : (
                            <div
                              style={{
                                fontSize: "65%",
                                fontWeight: "500",
                                color: "red",
                              }}
                              className="form-text"
                            >
                              {acDetailsFormDataError?.mobile_no}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <h3 className="acc-title1 pt-4">Change password</h3>

                    {showLogout && (
                      <>
                        <div className="row">
                          {/* <div className="col-md-6">
                                                            <div className=" inp-nx mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label">Current password (leave blank to leave unchanged) <span className="color-e4509d"></span></label>
                                                                <input
                                                                    type="password"
                                                                    className="form-control"
                                                                    id="exampleFormControlInput1"
                                                                    placeholder="Enter Current password"
                                                                    name='old_assword'
                                                                    value={changePassFormData?.old_assword}
                                                                    onChange={(e: any) => handleChangePassChange(e)}
                                                                />
                                                            </div>
                                                        </div> */}

                          <div className="col-md-6">
                            <div className=" inp-nx mb-3">
                              <label
                                htmlFor="exampleFormControlInput1"
                                className="form-label"
                              >
                                New password (leave blank to leave unchanged){" "}
                                <span className="color-e4509d"></span>
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Enter New password"
                                name="new_password"
                                value={changePassFormData?.new_password}
                                onChange={(e: any) =>
                                  handleChangePassChange(e)
                                }
                              />
                              {!change_password_errpr1 ? null : (
                                <div
                                  style={{
                                    fontSize: "65%",
                                    fontWeight: "500",
                                    color: "red",
                                  }}
                                  className="form-text"
                                >
                                  {change_password_errpr1}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className=" inp-nx mb-3">
                              <label
                                htmlFor="exampleFormControlInput1"
                                className="form-label"
                              >
                                Confirm new password{" "}
                                <span className="color-e4509d"></span>
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Enter Confirm new password"
                                name="confirm_new_password"
                                value={
                                  changePassFormData?.confirm_new_password
                                }
                                onChange={(e: any) =>
                                  handleChangePassChange(e)
                                }
                              />
                              {!change_password_errpr ? null : (
                                <div
                                  style={{
                                    fontSize: "65%",
                                    fontWeight: "500",
                                    color: "red",
                                  }}
                                  className="form-text"
                                >
                                  {change_password_errpr}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {!showLogout && (
                      <>
                        <div className="row">
                          <div className="col-md-6">
                            <div className=" inp-nx mb-3">
                              <label
                                htmlFor="exampleFormControlInput1"
                                className="form-label"
                              >
                                New password (leave blank to leave unchanged){" "}
                                <span className="color-e4509d"></span>
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Enter New password"
                                name="new_password"
                                value={changePassFormData?.new_password}
                                onChange={(e: any) =>
                                  handleChangePassChange(e)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className=" inp-nx mb-3">
                              <label
                                htmlFor="exampleFormControlInput1"
                                className="form-label"
                              >
                                Confirm new password{" "}
                                <span className="color-e4509d"></span>
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Enter Confirm new password"
                                name="confirm_new_password"
                                value={
                                  changePassFormData?.confirm_new_password
                                }
                                onChange={(e: any) =>
                                  handleChangePassChange(e)
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className=" inp-nx mb-3">
                              <label
                                htmlFor="exampleFormControlInput1"
                                className="form-label"
                              >
                                Mobile phone{" "}
                                <span className="color-e4509d">*</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Enter Phone Number"
                                name="mobile_no"
                                value={acDetailsFormData?.mobile_no}
                                onChange={(e: any) =>
                                  handleAcDetailsChange(e)
                                }
                              />
                              {acDetailsFormDataError?.mobile_no ===
                                "" ? null : (
                                <div
                                  style={{
                                    fontSize: "65%",
                                    fontWeight: "500",
                                    color: "red",
                                  }}
                                  className="form-text"
                                >
                                  {acDetailsFormDataError?.mobile_no}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <button
                      className="save-btn"
                      onClick={() => {
                        SavedAc();
                        SavedChangePass();
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>}
          {/* </div> */}
        </div>


      </div >
      {ModalShowStatus && <section className="myaccount_wrap">
        <div className="container">
          <div className="allbox_wrap row">

            <div className="col-lg-4 col-md-6 col-6">
              <button className="sing_box" onClick={() => {
                router.push('/dashboard')
                // orderOtherViewFalse();
                // setOtherView("dashboard");
                // setModalShowStatus(false)
              }} type="button">
                <div className="icon_wrap">
                  <PersonIcon />
                </div>
                <div className="details_wrap">
                  <h4 className="head">Dashboard</h4>
                  <p className="text">Manage appointments, track services, and access offers</p>
                </div>
              </button>
            </div>

            <div className="col-lg-4 col-md-6 col-6" >
              <button
                role="tab"
                type="button"
                className="sing_box"
                // data-bs-toggle="pill"
                // aria-selected="false"
                // id="v-pills-profile-tab"
                // aria-controls="v-pills-profile"
                // data-bs-target="#v-pills-profile"
                onClick={() => {
                  router.push('/my-wallet')
                  // orderOtherViewFalse();
                  // setOtherView("mywallet");
                  // setModalShowStatus(false)
                }}
              >
                <div className="icon_wrap">
                  <WalletIcon />
                </div>
                <div className="details_wrap">
                  <h4 className="head">My Wallet</h4>
                  <p className="text">View and manage your payment methods and balance.</p>
                </div>
              </button>
            </div>
            <div className="col-lg-4 col-md-6 col-6"  >
              <button className="sing_box" type="button" onClick={() => {
                router.push('/my-orders')
                // orderOtherViewFalse();
                // setOtherView("order");
                // setModalShowStatus(false)
              }}>
                <div className="icon_wrap">
                  <Inventory2Icon />
                </div>
                <div className="details_wrap">
                  <h4 className="head">Orders</h4>
                  <p className="text">Track and manage your orders </p>
                </div>
              </button>
            </div>
            <div className="col-lg-4 col-md-6 col-6" >
              <button className="sing_box" type="button" onClick={() => {
                router.push('/save-later')
                // orderOtherViewFalse();
                // setOtherView("saveforlater");
                // setModalShowStatus(false)
              }}>
                <div className="icon_wrap">
                  <BookmarkIcon />
                </div>
                <div className="details_wrap">
                  <h4 className="head">Save For Later</h4>
                  <p className="text">Easily bookmark and revisit your favorite items or services!</p>
                </div>
              </button>
            </div>
            <div className="col-lg-4 col-md-6 col-6" >
              <button className="sing_box" type="button" onClick={() => {
                // orderOtherViewFalse();
                // setOtherView("recentviewitem");
                // setModalShowStatus(false)
                router.push('/recently-viewed')
              }}>
                <div className="icon_wrap">
                  <ScheduleIcon />
                </div>
                <div className="details_wrap">
                  <h4 className="head">Recently Viewed Items</h4>
                  <p className="text">{`Quickly revisit the products you've checked out.`}</p>
                </div>
              </button>
            </div>
            <div className="col-lg-4 col-md-6 col-6">
              <button className="sing_box" onClick={() => {
                router.push('/search-history')
                // orderOtherViewFalse();
                // setOtherView("savehistory");
                // setModalShowStatus(false)
              }} type="button">
                <div className="icon_wrap">
                  <HistoryIcon />
                </div>
                <div className="details_wrap">
                  <h4 className="head">Search History</h4>
                  <p className="text">Review your recent searches </p>
                </div>
              </button>
            </div>
            <div className="col-lg-4 col-md-6 col-6">
              <button className="sing_box" type="button" onClick={() => {
                // setOrderList(`${get_user_review}`);
                // orderOtherViewFalse();
                // setOtherView("myreview");
                // setModalShowStatus(false)
                router.push('/my-reviews');
              }}>
                <div className="icon_wrap">
                  <ReviewsIcon />
                </div>
                <div className="details_wrap">
                  <h4 className="head">My Reviews</h4>
                  <p className="text">View and manage feedbacks </p>
                </div>
              </button>
            </div>
            <div className="col-lg-4 col-md-6 col-6">
              <button className="sing_box" type="button" onClick={() => {
                router.push('/my-wish-list')
                // setOtherView("Wishlist");
                // setModalShowStatus(false)
              }}>
                <div className="icon_wrap">
                  <FavoriteIcon />
                </div>
                <div className="details_wrap">
                  <h4 className="head">My Wishlist</h4>
                  <p className="text">Keep track of your favorite items. </p>
                </div>
              </button>
            </div>
            <div className="col-lg-4 col-md-6 col-6">
              <button className="sing_box" type="button" onClick={() => {
                // setGetbillingAddressesUrl(get_user_billing_addresses);
                // setBilling(true);
                router.push('/billing')
                // orderOtherViewFalse();
                // setOtherView("billing");
                // setModalShowStatus(false)
              }}>
                <div className="icon_wrap">
                  <HomeIcon />
                </div>
                <div className="details_wrap">
                  <h4 className="head">Billing Address</h4>
                  <p className="text">Manage your billing details </p>
                </div>
              </button>
            </div>
            <div className="col-lg-4 col-md-6 col-6">
              <button className="sing_box" type="button" onClick={() => {
                router.push('/shipping')
                setGetShippingAddressesUrl(get_user_shipping_addresses);
                setGetbillingAddressesUrl(get_user_billing_addresses);
                setBilling(false);
                // orderOtherViewFalse();
                // setOtherView("shipping");
                setShipingToBilling(true);
                // setModalShowStatus(false)
              }}>
                <div className="icon_wrap">
                  <BusinessIcon />
                </div>
                <div className="details_wrap">
                  <h4 className="head">Shipping Addess</h4>
                  <p className="text">Manage and update your delivery details </p>
                </div>
              </button>
            </div>
            <div className="col-lg-4 col-md-6 col-6">
              <button className="sing_box" type="button" onClick={() => {
                router.push('/account-details')
                // orderOtherViewFalse();
                // setOtherView("accountdetails");
                // setModalShowStatus(false)
              }}>
                <div className="icon_wrap">
                  <ManageAccountsIcon />
                </div>
                <div className="details_wrap">
                  <h4 className="head">Account Details</h4>
                  <p className="text">View and update your personal information </p>
                </div>
              </button>
            </div>
            <div className="col-lg-4 col-md-6 col-6">
              <button className="sing_box" type="button" onClick={() => {
                router.push('/notification-preference')
                // orderOtherViewFalse();
                // setOtherView("accountdetails");
                // setModalShowStatus(false)
              }}>
                <div className="icon_wrap">
                  <NotificationsIcon />
                </div>
                <div className="details_wrap">
                  <h4 className="head">Notification Preference</h4>
                  <p className="text">View and update your notification preference </p>
                </div>
              </button>
            </div>
            <div className="col-lg-4 col-md-6 col-6">
              <button className="sing_box" type="button" onClick={() =>
                // doLogout()
                setOpen(true)
              }>
                <div className="icon_wrap">
                  <LogoutIcon />
                </div>
                <div className="details_wrap">
                  <h4 className="head text-red-500">Log Out</h4>
                  <p className="text">Log out your Account...</p>
                </div>
              </button>
            </div>

            {/* Logout Modal */}
            {open && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2 className="modal-title">Log out from?</h2>
                  <CloseIcon
                    className="close-icon cursor-pointer"
                    onClick={() => { setOpen(false), setLogoutOption("") }}
                  />

                  <div className="binary-tree">
                    {/* Child Nodes */}
                    <div className="tree-branches">
                      <button
                        onClick={() => { setLogoutOption("this"), doLogout() }}
                        className={`tree-node option ${logoutOption === "this" ? "selected" : ""}`}
                      >
                        <Logout />
                        <span>This Device</span>
                      </button>

                      <button
                        onClick={() => { setLogoutOption("all"), doLogOutAll() }}
                        className={`tree-node option ${logoutOption === "all" ? "selected" : ""}`}
                      >
                        <Devices />
                        <span>All Devices</span>
                      </button>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="modal-actions mx-1">
                    <button onClick={() => { setOpen(false), setLogoutOption("") }} className="cancel-button">
                      <CloseIcon style={{ fontSize: "20px" }} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section >}


      {/* ****My Account Start**
      < AccountList /> */}

      {/* <BillingAddress /> */}
      {/*****My account End***/}

      <Drawer
        anchor={"right"}
        open={sideBarOpen}
        onClose={() => {
          setSideBarOpen(false);
          setFormData(initialFormData);
        }}
        className="shipping-address-form-root"
      >
        <div className="cart">
          <div className="row">
            <div className="col-4">
              <button
                type="button"
                className="btn-close1 new"
                aria-label="Close"
                onClick={() => {
                  setSideBarOpen(false);
                  setFormData(initialFormData);
                }}
              >
                <Image
                  src={closep}
                  alt="cart1"
                  className={``}
                  style={{ width: "70%" }}
                  width={12}
                  height={12}
                  sizes="(min-width: 12px) 50vw, 100vw"
                />
              </button>
            </div>
            {/* <div className="col-4">
                            <h5>My Cart</h5>
                        </div> */}
            {/* <div className="col-4">
                                    <p>{getCart?.items?.length || 0} Item(s)</p>
                                </div> */}
          </div>
        </div>

        <div className="w-full p-4">
          {shipingToBilling && (
            <div className=" inp-nx mb-1 w-full mt-2">
              <div className="flex items-center gap-4 tm-gap-2 w-full tm-items-start tm-flex-col">
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={formData?.default === true ? true : false}
                    name="default"
                    style={{ cursor: "pointer" }}
                    onClick={(e: any) =>
                      defaultAddress
                        ? setDefaultAddress(false)
                        : setDefaultAddress(true)
                    }
                  />
                  &nbsp;
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label m-0"
                  >
                    Use as Default
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 w-full">
            <div className=" inp-nx mb-1 w-full">
              <label htmlFor="street" className="form-label mb-1">
                Address (Area and Street){" "}
                <span className="color-e4509d">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                style={{ height: "36px" }}
                id="street"
                placeholder="Enter Street Name"
                value={formData?.address_1}
                onChange={(e) => handleInputChange(e, "address_1")}
              />
              {errors.address_1 && (
                <div className="text-red-500">{errors.address_1}</div>
              )}
            </div>
            {/* <div className=" inp-nx mb-1 w-full">
                            <label htmlFor="exampleFormControlInput1" className="form-label mb-1">Apartment, suite, unit, etc. <span className="color-e4509d">*</span></label>
                            <input type="text" className="form-control" style={{height: "36px"}} id="exampleFormControlInput1" placeholder="Apartment, suite, unit, etc. " onChange={(e) => handleInputChange(e, 'apartment')} value={formData.apartment} />
                            {errors.apartment && <div className="text-red-500">{errors.apartment}</div>}
                        </div> */}
          </div>
          <div className="m-flex-col flex gap-shipping w-full">
            <div className=" inp-nx mb-1 w-full mt-2">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label mb-1"
              >
                Town / City / District{" "}
                <span className="color-e4509d">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                style={{ height: "36px" }}
                id="exampleFormControlInput1"
                placeholder="Enter Town / City Name "
                onChange={(e) => handleInputChange(e, "city")}
                value={formData?.city}
              />
              {errors.city && <div className="text-red-500">{errors.city}</div>}
            </div>
            <div className=" inp-nx mb-1 w-full mt-2">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label mb-1"
              >
                PIN Code <span className="color-e4509d">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                style={{ height: "36px" }}
                id="exampleFormControlInput1"
                placeholder="Enter PIN Code "
                onChange={(e) => handleInputChange(e, "postcode")}
                onBlur={() => fetchPostCodeDataDebounced()} // Trigger on blur
                value={formData?.postcode}
              />
              {errors.postcode && (
                <div className="text-red-500">{errors.postcode}</div>
              )}
            </div>
          </div>
          <div className="m-flex-col flex gap-shipping w-full">
            <div className=" inp-nx mb-1 w-full mt-2">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label mb-1"
              >
                State <span className="color-e4509d">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                style={{ height: "36px" }}
                id="exampleFormControlInput1"
                placeholder="Enter State Name "
                onChange={(e) => handleInputChange(e, "state")}
                value={formData?.state}
              />
              {errors.state && (
                <div className="text-red-500">{errors.state}</div>
              )}
            </div>
            <div className=" inp-nx mb-1 w-full mt-2">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label mb-1"
              >
                Landmark
                {/* <span className="color-e4509d">*</span> */}
              </label>
              <input
                type="text"
                className="form-control"
                style={{ height: "36px" }}
                id="exampleFormControlInput1"
                placeholder="Enter Landmark "
                onChange={(e) => handleInputChange(e, "landmark")}
                value={formData?.landmark}
              />
              {errors.landmark && (
                <div className="text-red-500">{errors.landmark}</div>
              )}
            </div>
          </div>
          <div className="m-flex-col flex gap-shipping w-full">
            <div className=" inp-nx mb-1 w-full mt-2">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label mb-1"
              >
                First name <span className="color-e4509d">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                style={{ height: "36px" }}
                id="exampleFormControlInput1"
                placeholder="Enter First Name "
                onChange={(e) => handleInputChange(e, "first_name")}
                value={formData?.first_name}
              />
              {errors.first_name && (
                <div className="text-red-500">{errors.first_name}</div>
              )}
            </div>
            <div className=" inp-nx mb-1 w-full mt-2">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label mb-1"
              >
                Last name <span className="color-e4509d">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                style={{ height: "36px" }}
                id="exampleFormControlInput1"
                placeholder="Enter Last Name "
                onChange={(e) => handleInputChange(e, "last_name")}
                value={formData?.last_name}
              />
              {errors.last_name && (
                <div className="text-red-500">{errors.last_name}</div>
              )}
            </div>
          </div>

          <div className="m-flex-col flex gap-shipping w-full">
            {/* <div className=" inp-nx mb-1 w-full mt-2">
                            <label htmlFor="exampleFormControlInput1" className="form-label mb-1">Display name <span className="color-e4509d">*</span></label>
                            <input type="text" className="form-control" style={{height: "36px"}} id="exampleFormControlInput1" placeholder=" Enter Display Name" onChange={(e) => handleInputChange(e, 'displayName')} value={formData.displayName} />
                            {errors.displayName && <div className="text-red-500">{errors.displayName}</div>}
                        </div> */}
            <div className=" inp-nx mb-1 w-full mt-2">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label mb-1"
              >
                Mobile phone <span className="color-e4509d">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                style={{ height: "36px" }}
                id="exampleFormControlInput1"
                placeholder="Enter Phone Number"
                onChange={(e) => handleInputChange(e, "phone")}
                value={formData?.phone}
              />
              {errors.phone && (
                <div className="text-red-500">{errors.phone}</div>
              )}
            </div>
          </div>

          <div className=" inp-nx mb-1 w-full mt-2">
            <label
              htmlFor="exampleFormControlInput1"
              className="form-label mb-1"
            >
              Address Type <span className="color-e4509d">*</span>
            </label>
            <div className="flex items-center gap-4 tm-gap-2 w-full tm-items-start tm-flex-col">
              <div className="flex items-center">
                <input
                  type="radio"
                  checked={formData?.address_type === "home"}
                  name="home"
                  onChange={(e: any) => handleInputChange(e, "address_type")}
                />
                &nbsp;
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label m-0"
                >
                  Home (All day delivery)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  checked={formData?.address_type === "work"}
                  name="work"
                  onChange={(e: any) => handleInputChange(e, "address_type")}
                />
                &nbsp;
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label m-0"
                >
                  Work (Delivery between 10 AM - 5 PM)
                </label>
              </div>
            </div>
          </div>

          <div className="flex pt-3 justify-end gap-2" style={{}}>
            {shipingToBilling && (
              <div className="flex items-center gap-2">
                <Checkbox
                  name="anonymous"
                  checked={
                    forBilling
                      ? forBilling
                      : formData?.id === billingAddresses?.shiping_id
                        ? true
                        : false
                  }
                  onClick={(e: any) => setForBilling(e.target.checked)}
                  className="w-fit px-0"
                  sx={{
                    color: "#e4509d",
                    "&.Mui-checked": {
                      color: "#e4509d",
                    },
                  }}
                />
                <p className="p-0 m-0">Use as billing address</p>
              </div>
            )}
            <button
              className="btn btn-primary"
              onClick={() =>
                billing
                  ? handleSaveBillig(2)
                  : (handleSaveBillig(1), handleSaveShipping())
              }
            >
              Save
            </button>
          </div>
        </div>
      </Drawer>

      <Dialog
        open={DeleteAddress}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{ width: "30vw" }}>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              className="product-name"
              style={{ fontSize: "16px" }}
            >
              Are you sure you want to remove{" "}
              <span
                style={{
                  fontWeight: "500",
                  fontSize: "15px",
                  color: "#c53881",
                }}
              >
                {/* {openLastModal?.p_name} */}
              </span>{" "}
              from your cart?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ fontSize: "14px", fontWeight: "500", color: "red" }}
              onClick={() => setDeleteAddress(false)}
            >
              cancel
            </Button>
            <Button
              style={{ fontSize: "14px", fontWeight: "500", color: "green" }}
              onClick={() => {

                handleDeleteClick(DeleteAdressID); setDeleteAddress(false)
              }}
            >
              yes
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      {
        razorpayOrderId && (
          <RenderRazorpayWallet
            razorpayOrderId={razorpayOrderId}
            amount={Number(amount)}
            currency={"INR"}
            keyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}
            keySecret={process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET}
            orderId={razorpayOrderId}
            response={() => {
              setWaleGetUrl(get_total_wallet_amount);
              setAmount("");
              setrazorpayOrderId(null);
            }}
          />
        )
      }
    </>
  );
};

export default MyAccount;
