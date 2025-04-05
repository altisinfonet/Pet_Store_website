
import React, { useCallback, useEffect, useState } from "react";
import { useCreate, useRead } from "../../../hooks";
import getUrlWithKey from "../../../util/_apiUrl";
import useIsLogedin from "../../../hooks/useIsLogedin";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import { _ERROR, _SUCCESS, _WARNING } from "../../../util/_reactToast";
import { useRouter } from "next/router";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Image from "next/image";
import brandDam from "../../../../public/assets/images/brandDam.png";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useSelector } from "react-redux";
import { setOpenCart } from "../../../reducer/openCartReducer";
import { useDispatch } from "react-redux";
import { setThankyou } from "../../../reducer/thankyouReducer";
import RenderRazorpay from "../../../components/RenderRazorpay";
import { setOpenCartDiscount } from "../../../reducer/openCartForDiscountReducer";
import axios from "axios";
import {
  emailRegax,
  isEmptyObject,
  phoneRegax,
  zipCodeRegax,
} from "../../../util/_common";
import { setOpenCartDisable } from "../../../reducer/openCartReducerForDisable";
import DeleteIcon from "@mui/icons-material/Delete";
import { setCoupon } from "../../../reducer/couponReducer";
import { setOpenAuth } from "../../../reducer/openAuthReducer";
import { _get, _post, _put } from "../../../services";
import { setCart } from "../../../reducer/getCartReducer";
import Link from "next/link";
import EditIcon from '@mui/icons-material/Edit';
import useTabView from "../../../hooks/useTabView";
import { setThankyouAddress } from "../../../reducer/thankyouAddressReducer";
import { setCartCount } from "../../../reducer/cartCountReducer";
import { toast } from "react-toastify";

interface FormFields {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  locality?: string;
  landmark: string;
  address_type: string;
  default: boolean;
}

const OrderPage = () => {
  const {
    get_cart_items,
    create_order,
    get_user_billing_addresses,
    get_user_shipping_addresses,
    add_shipping_address,
    update_shipping_address,
    cart_holding_details,
    cart_holding,
    get_total_wallet_amount,
    update_cart_holding,
    proxy_pincode,
    update_cart,
    quick_verify,
    dtdc_pincode,
    cart_item_count
  } = getUrlWithKey("client_apis");

  const defaultAddressFields = {
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
    email: "",
    locality: "",
    landmark: "",
    address_type: "",
    default: false
  };

  const { tabView, mobView } = useTabView();

  const { me: me_url } = getUrlWithKey("auth_apis");
  const [seconds, setSeconds] = useState<number>(0);
  const [proceedToCheckOut, setProceedToCheckOut] = useState(false);
  const [stockHoldingUrl, setStockHoldingUrl] = useState<any>({});
  const { isLoged, logedData } = useIsLogedin();
  const router = useRouter();
  const { totalDisCountAmount } = router.query;
  const dispatch = useDispatch();
  const [cartItemCount, setCartItemCount]: any = useState()
  var currencyFormatter = require('currency-formatter');
  const [pin_Code, setPinCode] = useState<string | null>(null);
  const { sendData: getCartCount }: any = useRead({ selectMethod: "get", url: cartItemCount });

  const [no_new_address_add, setNoNewAddressAdd] = useState(false);


  const [isUserPhoneNumberAlreadyExist, setIsUserPhoneNumberAlreadyExist] = useState(false);
  const [isUserEmailAlreadyExist, setIsUserEmailAlreadyExist] = useState(false);

  useEffect(() => {
    dispatch(setCartCount(getCartCount?.totalItems))
  }, [getCartCount])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPinCode = localStorage.getItem('PIN_Code');
      setPinCode(storedPinCode);
    }
  }, []);

  const getCoupon = useSelector((state: any) => state?.couponReducer?.value);
  const CartHolding = useSelector(
    (state: any) => state?.getCartHoldingReducer?.value
  );
  console.log(CartHolding, "fg4fds566CartHolding")
  const getCartByReducer = useSelector(
    (state: any) => state?.getCartReducer?.value
  );
  const getme = useSelector((state: any) => state?.meReducer?.value);

  const getopenCartDisable = useSelector(
    (state: any) => state?.openCartDisableReducer?.value
  );

  useEffect(() => {
    if (getopenCartDisable) {
      setTimeout(() => {
        dispatch(setOpenCartDisable(false));
      }, 1500);
    }
  }, [getopenCartDisable]);

  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    razorpayOrderId: null,
    currency: null,
    amount: null,
    orderId: null,
  });

  const [getCartUrl, setGetCartUrl]: any = useState();
  const [getbillingAddressesUrl, setGetbillingAddressesUrl]: any = useState();
  const [getShippingAddressesUrl, setGetShippingAddressesUrl]: any = useState();
  const [cartHoldingDetailsUrl, setCartHoldingDetailsUrl]: any = useState();
  const [unavailableProducts, setUnavailableProducts]: any = useState([]);
  const [proceedToPayment, setProceedToPayment] = useState(false);
  const [metaData, setMetaData]: any = useState();
  const [orderUrl, setOrderUrl]: any = useState();
  const [cartData, setCartData]: any = useState([]);
  const [selectedValue, setSelectedValue]: any = useState();
  const [addNewAddress, setAddNewAddress]: any = useState(false);
  const [addressType, setAddressType]: any = useState("home");
  const [addNewShippingAddress, setAddNewShippingAddress]: any =
    useState<FormFields>({ ...defaultAddressFields, address_type: "home", default: true });
  const [fieldsErrors, setFieldsErrors] =
    useState<FormFields>(defaultAddressFields);
  const [metaDataAddress, setMetaDataAddress]: any = useState<any>();
  const [addShippingAddressUrl, setAddShippingAddressUrl]: any = useState();
  const [editId, setEditId]: any = useState();
  const [paymentOption, setPaymentOption]: any = useState("cod");
  const [walletUrl, setWallerUrl]: any = useState();
  const [walletAmount, setWallerAmount] = useState(0);
  const [walletBalenceCheck, setWalletBalenceCheck] = useState(false);
  const [getWalletAmount, setGetWalletAmount]: any = useState({});
  const [updateCartUrl, setUpdateCartUrl]: any = useState();
  const [updateCart, setUpdateCart]: any = useState({});
  const [openLastModal, setOpenLastModal]: any = useState({});
  const [delevery_msg, setDeleveryMsg] = useState("");
  const [cod, setCOD] = useState(0);

  const { sendData: getCart }: any = useRead({
    selectMethod: "get",
    url: getCartUrl,
  });
  const [totalDisCountAmountc, setTotalDisCountAmount] = useState(getCart?.productDiscountAmountTotal || totalDisCountAmount)
  console.log(getCart, getWalletAmount, walletAmount, "dfgdgetCart")
  const highlightedMessage = delevery_msg.split("2 business days").map((part, index) => {
    return index === 0 ? (
      <span key={index}>{part}</span>
    ) : (
      <>
        <span key={index}>{part}</span>
        <span style={{ color: "#f43f5e", fontWeight: "bold" }}>2 business days</span>
      </>
    );
  });
  useEffect(() => {
    setUpdateCartUrl()
    setGetCartUrl()
    dispatch(setCart(getCart))
    setCartItemCount(cart_item_count)
  }, [getCart])
  // const { sendData: getWalletAmount }: any = useRead({ selectMethod: "get", url: walletUrl });
  const getWltAmmount = async () => {
    try {
      const data: any = await _get(get_total_wallet_amount);
      if (data?.data?.success) {
        setGetWalletAmount(data?.data?.data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  const { sendData: getbilling_addresses }: any = useRead({
    selectMethod: "get",
    url: getbillingAddressesUrl,
  });
  const { sendData: getshipping_addresses }: any = useRead({
    selectMethod: "get",
    url: getShippingAddressesUrl,
  });

  // console.log("=============getshipping_addresses=====================")
  // console.log(getshipping_addresses)
  // console.log("================getshipping_addresses==================")

  const { sendData: cart_holding_detail }: any = useRead({
    selectMethod: "get",
    url: cartHoldingDetailsUrl,
  });

  const { sendData: stockHold, error: stockHoldError }: any =
    useCreate(stockHoldingUrl);

  const { sendData: doOrder }: any = useCreate({
    url: orderUrl,
    callData: metaData,
  });
  const { sendData: addAddress, error: addAddressError }: any = useCreate({
    url: addShippingAddressUrl,
    callData: editId
      ? { shipping_id: editId, shipping_address: metaDataAddress }
      : { shipping_address: metaDataAddress },
  });
  // console.log("=============editId==============")
  console.log(doOrder, "df4g5df351")
  // console.log("=============editId==============")

  const { sendData: updateCartData, error: updateCartDataError }: any =
    useCreate({ url: updateCartUrl, callData: updateCart });

  // useEffect(() => {
  //   setUpdateCartUrl()
  //   setGetCartUrl()
  //   dispatch(setCart(getCart))
  //   setCartHoldingDetailsUrl(`${cart_holding_details}`)
  //   if (updateCartDataError && updateCart?.increase) {
  //     _WARNING(updateCartDataError?.massage)
  //   }

  // }, [updateCartData, updateCartDataError, updateCart])
  console.log(cod, paymentOption, "codwdwdawd");

  useEffect(() => {
    if (updateCartData && updateCartData?.type === "hold") {
      setUpdateCartUrl();
      setGetCartUrl(get_cart_items);
      setCartHoldingDetailsUrl(`${cart_holding_details}`);
    }
    if (updateCartDataError && updateCart?.increase) {
      _WARNING(updateCartDataError?.massage);
    }

    console.log(getCartByReducer, "updateCartData");
  }, [updateCartData, updateCartDataError, updateCart]);


  useEffect(() => {
    if (totalDisCountAmount) {
      setGetCartUrl(get_cart_items);
    }
  }, [totalDisCountAmount])

  const [openOption, setopenOption] = useState<boolean>(true);
  const [showOtherOption, setShowOtherOption] = useState<boolean>(false);

  useEffect(() => {
    if (!editId && addNewAddress) {
      if (logedData?.role?.label !== "guest") {
        setAddNewShippingAddress({ ...defaultAddressFields, address_type: "home", default: true, postcode: pin_Code, email: logedData?.email });
      }
    }
  }, [addNewAddress, logedData]);

  const [getlocationLoading, setGetlocationLoading]: any = useState(false);
  const [pincodeError, setPinCodeError] = useState<String>("");

  const fetchAddressData = async (code: number) => {
    try {
      setCOD(0);
      setGetlocationLoading(true);

      // Fetch address data
      const response = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      const data = await response.json();

      if (data[0]?.Status === "Success") {
        setAddNewShippingAddress((prev: any) => ({
          ...prev,
          city: data[0]?.PostOffice[0]?.District,
          state: data[0]?.PostOffice[0]?.State,
          locality: data[0]?.PostOffice[0]?.Name,
        }));
        setPinCodeError("");
        setFieldsErrors((prev) => ({
          ...prev,
          state: "",
          city: "",
          locality: "",
        }));
      } else {
        setPinCodeError("Invalid Pincode");
        setAddNewShippingAddress((prev: any) => ({
          ...prev,
          state: "",
          city: "",
          locality: "",
        }));
      }

      // Call _put to update DTDC data
      const { data: dtdcData } = await _put(dtdc_pincode, { zipcode: code });
      if (dtdcData?.success && dtdcData?.data?.estimatedTimeText) {
        setDeleveryMsg(dtdcData?.data?.estimatedTimeText);
        setCOD(dtdcData?.data?.cod);
      }

    } catch (error) {
      console.log(error, "checkAddress");
      setAddNewShippingAddress((prev: any) => ({
        ...prev,
        state: "",
        city: "",
        locality: "",
      }));
    } finally {
      setGetlocationLoading(false);
    }
  };

  const callCartHolding = async () => {
    try {
      const data = {
        type: 'rollback'
      }
      const res = await _post(cart_holding, data)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if (addNewShippingAddress?.postcode?.length === 6) {
      fetchAddressData(addNewShippingAddress?.postcode);
    }
  }, [addNewShippingAddress?.postcode]);

  useEffect(() => {
    if (walletBalenceCheck) {
      let subTotal: number = +getCart?.productPriceTotal;
      if (subTotal < 500) {
        subTotal = subTotal + 50;
      }
      let w_a: number = +getWalletAmount?.total_amount;
      let calculate: number = w_a - subTotal;
      if (calculate > 0) {
        setopenOption(false);
      }
    } else {
      setopenOption(true);
    }
  }, [walletBalenceCheck]);

  useEffect(() => {
    // setWallerUrl(get_total_wallet_amount);
    getWltAmmount();
  }, [getCart]);

  // useEffect(() => {
  //   if (walletUrl === get_total_wallet_amount) {
  //     setWallerUrl();
  //   }
  // }, [getWalletAmount?.id]);

  // console.log(walletUrl, "walletUrl")

  // useEffect(() => {
  //   if (getCart?.items?.length) {
  //     setWallerUrl(get_total_wallet_amount);
  //   }
  // }, [getCart?.items?.length]);


  useEffect(() => {
    if (getWalletAmount && getWalletAmount?.id) {
      const netsp = getCart?.allTotalAmountWithoutShipping || 0;
      const shipping = getCart?.shippingTotal || 0;
      const couponAmount = +(getCoupon?.couponMetaData?.general?.amount || 0);
      const couponType = getCoupon?.couponMetaData?.general?.type || "";

      let discount = 0;
      if (couponType === "parsentage") {
        discount = netsp * (couponAmount / 100);
      } else {
        discount = couponAmount;
      }

      const finalPrice = netsp - discount + shipping;
      const walletBalance = walletBalenceCheck
        ? getWalletAmount?.total_amount - finalPrice
        : getWalletAmount?.total_amount;

      setWallerAmount(walletBalance > 0 ? walletBalance : 0);
    }
  }, [getWalletAmount, getCart, getCoupon, walletBalenceCheck]);

  useEffect(() => {
    setGetCartUrl(get_cart_items);
    if (isLoged) {
      setGetbillingAddressesUrl(`${get_user_billing_addresses}`);
      setGetShippingAddressesUrl(`${get_user_shipping_addresses}`);
      setCartHoldingDetailsUrl(`${cart_holding_details}`);
    }
  }, [isLoged, getme?.role?.label]);

  useEffect(() => {
    setGetCartUrl(get_cart_items);
  }, [getme?.role?.label]);

  useEffect(() => {
    if (getCartUrl === get_cart_items) {
      setGetCartUrl();
      dispatch(setCart(getCart));
    }
  }, [getCartUrl]);

  let billingAddresses =
    getbilling_addresses?.length &&
      getbilling_addresses[0]?.billing &&
      getbilling_addresses[0]?.billing?.length &&
      getbilling_addresses[0]?.billing[0]?.meta_data
      ? JSON.parse(getbilling_addresses[0]?.billing[0]?.meta_data)
      : null;



  useEffect(() => {
    let newArr: any = [];
    if (getCart?.items?.length) {
      getCart?.items.map(
        (v: any) =>
        (newArr = [
          ...newArr,
          {
            product_id: v?.product?.id,
            quantity: v?.quantity,
            variation_id: v?.variation?.id || null,
          },
        ])
      );
    }
    setCartData(newArr);
  }, [getCart]);

  useEffect(() => {
    if (doOrder) {
      // payment_method,
      // orderId, razorpayOrderId: razorpayOrderId, amount: options?.amount, currency: options?.currency

      // amount: 930
      // currency: "INR"
      // orderId: 124
      // payment_method: "razorpay"
      // razorpayOrderId: "order_O38cnnLoNwzdt9"

      if (
        doOrder &&
        doOrder.orderId &&
        doOrder?.payment_method === "razorpay" &&
        doOrder?.amount != 0
      ) {
        setOrderDetails({
          razorpayOrderId: doOrder.razorpayOrderId,
          currency: doOrder.currency,
          amount: doOrder.amount,
          orderId: doOrder.orderId,
        });
        setDisplayRazorpay(true);
      } else {
        if (doOrder?.payment_method !== "cod") {
          _SUCCESS("Your Order has been placed successfully");
          dispatch(setThankyou(doOrder));
          setTimeout(() => router.push("/thankyou"), 700);
          dispatch(setCartCount(""));
        }
      }

      if (doOrder?.payment_method === "cod") {
        _SUCCESS("Your Order has been placed successfully");
        dispatch(setThankyou(doOrder));
        setTimeout(() => router.push("/thankyou"), 700);
        dispatch(setCartCount(""));
      }
    }
  }, [doOrder]);

  const handleSubmit = () => {
    if (cod === 0 && paymentOption === "cod") {
      return _WARNING("Select Payment Method");
    }
    setProceedToCheckOut(true);
    // console.log({
    //   payment_method: paymentOption ? paymentOption : "cod",
    //   payment_method_title: "Direct Bank Transfer",
    //   set_paid: true,
    //   wallet_balance: walletBalenceCheck,
    //   coupon_id: getCoupon?.id,
    //   billing_id: getbilling_addresses && getbilling_addresses[0] && getbilling_addresses[0].id,
    //   shipping_id: selectedValue && selectedValue.value,
    //   line_items: cartData,
    // })


    setOrderUrl(create_order);
    setMetaData({
      payment_method: paymentOption ? paymentOption : "cod",
      payment_method_title: "Direct Bank Transfer",
      set_paid: true,
      wallet_balance: walletBalenceCheck,
      coupon_id: getCoupon?.id,
      billing_id: getbilling_addresses && getbilling_addresses[0] && getbilling_addresses[0].billing[0] && getbilling_addresses[0].billing[0].id,
      shipping_id: selectedValue && selectedValue.value,
      line_items: cartData,
    });

    // console.log(selectedValue)

    dispatch(setThankyouAddress({
      billing: {
        first_name: billingAddresses?.first_name,
        last_name: billingAddresses?.last_name,
        address_1: billingAddresses?.address,
        city: billingAddresses?.city,
        state: billingAddresses?.state,
        postcode: billingAddresses?.postcode,
        country: billingAddresses?.country,
        email: billingAddresses?.email,
        phone: billingAddresses?.phone,
      },
      shipping: {
        first_name: selectedValue?.getshippingAddresses?.first_name,
        last_name: selectedValue?.getshippingAddresses?.last_name,
        address_1: selectedValue?.getshippingAddresses?.address_1,
        city: selectedValue?.getshippingAddresses?.city,
        state: selectedValue?.getshippingAddresses?.state,
        postcode: selectedValue?.getshippingAddresses?.postcode,
        country: selectedValue?.getshippingAddresses?.country,
        email: selectedValue?.getshippingAddresses?.email,
        phone: selectedValue?.getshippingAddresses?.phone,
      }
    }))
  };

  const clear = () => {
    setFieldsErrors({
      first_name: "",
      last_name: "",
      address_1: "",
      city: "",
      state: "",
      postcode: "",
      phone: "",
      email: "",
      locality: "",
      landmark: "",
      address_type: "",
      default: false,
    });
  };

  const doAddressHandleChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;

    setAddNewShippingAddress((pre: any) => ({
      ...pre,
      [name]: value,
    }));

    let runTimeValidationObject: any = {};

    if ("phone" === name) {
      runTimeValidationObject[name] = {
        v: value,
        regax: phoneRegax,
        m: "Invalid phone number",
      };
    }


    if ("postcode" === name) {
      runTimeValidationObject[name] = {
        v: value,
        regax: zipCodeRegax,
        m: "Invalid Pin No",
      };
    }

    if ("email" === name) {
      runTimeValidationObject[name] = {
        v: value,
        regax: emailRegax,
        m: "Invalid email address",
      };
    }

    if (isEmptyObject(runTimeValidationObject)) {
      // Clear the error message when user starts typing again
      setFieldsErrors({ ...fieldsErrors, [name]: "" });
      // clearValidation(name);
    } else {
      runTimeValidationField(runTimeValidationObject);
    }
  };

  const runTimeValidationField = (dataSet: { [x: string]: any }) => {
    if (!isEmptyObject(dataSet)) {
      for (const key in dataSet) {
        const value = dataSet[key]?.v;
        const regax = dataSet[key]?.regax;
        const message = dataSet[key]?.m;
        if (!regax(value)) {
          setFieldsErrors((pre) => ({
            ...pre,
            [key]: message,
          }));
        } else {
          setFieldsErrors((pre) => ({
            ...pre,
            [key]: "",
          }));
        }
      }
    }
  };


  const [userBillingAddress, setBillingAddress] = useState('');

  useEffect(() => {
    const getbillingAddress = async () => {
      try {
        const res = await _get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-user-billing-addresses`);
        // setBillingAddress(res && res.data);
        setBillingAddress(res && res.data.data && res.data.data[0] && res.data.data[0].billing);
        console.log(res && res.data.data && res.data.data[0] && res.data.data[0].billing, "===========")
        // if (res && res.data.data && res.data.data[0] && res.data.data[0].billing && res.data.data[0].billing.length < 0) {
        //   await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/add-billing-address`, addNewShippingAddress);
        //   setAddShippingAddressUrl(add_shipping_address);
        // }
      } catch (error) {
        console.log(error.message)
      }
    };
    getbillingAddress();
  }, [])

  console.log(userBillingAddress, "=================================")

  const doAddressUpdate = async () => {
    // console.log("======================")
    // console.log("doAddressUpdate ====> method called")
    // console.log("======================")

    // if(isUserEmailAlreadyExist || isUserPhoneNumberAlreadyExist){
    //   return;
    // }
    try {
      // Validate form fields
      let errors: any = {};
      Object.keys(addNewShippingAddress).forEach((fieldName: any) => {
        console.log("fieldName: ", addNewShippingAddress, fieldName);
        if (fieldName != "landmark") {
          if (fieldName != "address_1") {
            if (
              addNewShippingAddress[fieldName as keyof FormFields] == "" ||
              addNewShippingAddress[fieldName as keyof FormFields] == undefined
            ) {
              errors[fieldName as keyof FormFields] = `${fieldName.replace(
                "_",
                " "
              )} is required`;
            }
          } else {
            if (
              addNewShippingAddress[fieldName as keyof FormFields] == "" ||
              addNewShippingAddress[fieldName as keyof FormFields] == undefined
            ) {
              errors[fieldName as keyof FormFields] = `address is required`;
            }
          }

          if (fieldName === "email") {
            const value = addNewShippingAddress[fieldName as keyof FormFields];
            const regax = emailRegax;
            const message = "Invalid email address";
            console.log("args regax(value)", regax(value));
            if (!regax(value)) {
              errors[fieldName as keyof FormFields] = `is required`;
            }
          }

          if (fieldName === "phone") {
            const value = addNewShippingAddress[fieldName as keyof FormFields];
            const regax = phoneRegax;
            const message = "Invalid phone number";
            console.log("args regax(value)", regax(value));
            if (!regax(value)) {
              errors[fieldName as keyof FormFields] = `is required`;
            }
          }

          if (fieldName === "postcode") {
            const value = addNewShippingAddress[fieldName as keyof FormFields];
            const regax = zipCodeRegax;
            const message = "Invalid Pin No";
            console.log("args regax(value)", regax(value));
            if (!regax(value)) {
              errors[fieldName as keyof FormFields] = `is required`;
            }
          }
        }
      });

      let runtimeError: boolean = false;

      console.log("fieldsErrors>>>>>>>>>>>>>>>>>>>", fieldsErrors)

      Object.keys(fieldsErrors).forEach((errorFieldName: any) => {
        if (errorFieldName && fieldsErrors[errorFieldName]) {
          runtimeError = true;
        }
      });

      // If there are errors, update fieldsErrors state
      console.log("er: ", errors);
      if (Object.keys(errors).length > 0) {
        setFieldsErrors(errors);

        Object.keys(addNewShippingAddress).forEach((fieldName: any) => {
          let runTimeValidationObject: any = {};

          if ("phone" === fieldName) {
            runTimeValidationObject[fieldName] = {
              v: addNewShippingAddress[fieldName as keyof FormFields],
              regax: phoneRegax,
              m: "Invalid phone number",
            };
          }

          if ("postcode" === fieldName) {
            runTimeValidationObject[fieldName] = {
              v: addNewShippingAddress[fieldName as keyof FormFields],
              regax: zipCodeRegax,
              m: "Invalid Pin No",
            };
          }

          if ("email" === fieldName) {
            runTimeValidationObject[fieldName] = {
              v: addNewShippingAddress[fieldName as keyof FormFields],
              regax: emailRegax,
              m: "Invalid email address",
            };
          }

          if (isEmptyObject(runTimeValidationObject)) {
            // Clear the error message when user starts typing again
            if (fieldName == "phone" || fieldName == "email") {
              // setFieldsErrors({ ...fieldsErrors, [fieldName]: '' });
            }
            // clearValidation(name);
          } else {
            runTimeValidationField(runTimeValidationObject);
          }
        });
        console.log("d: ", "ee");
        return;
      } else if (runtimeError) {
        return;
      } else {
        console.log("addNewShippingAddress", addNewShippingAddress);
        if (addNewShippingAddress) {
          if (editId) {
            console.log("update_shipping_address", editId, addNewShippingAddress);
            setAddShippingAddressUrl(update_shipping_address);
          } else {
            if (userBillingAddress && userBillingAddress.length == 0) {
              // console.log(metaDataAddress,"=========billing")
              // console.log(addNewShippingAddress,"=========billing")
              await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/add-billing-address`, { billing_address: addNewShippingAddress });
              setAddShippingAddressUrl(add_shipping_address);

            } else {
              // console.log(metaDataAddress)
              setAddShippingAddressUrl(add_shipping_address);
            }


            // console.log(response, "==========get billing address============")
            // if (response && response.data && response.data[0] && response.data[0].billing?.length > 0) {
            //   setAddShippingAddressUrl(add_shipping_address);
            // } else {

            // }
            console.log("add_shipping_address", editId, addNewShippingAddress);


          }
          setMetaDataAddress(addNewShippingAddress);
          if (getme?.role?.label === "guest") {
            // setNoNewAddressAdd(true); 
            console.log(getme?.role?.label)
          }
        }
      }
    } catch (error: any) {
      console.log("error: ", error);
    }
  };

  const [newEmal, setNewEmail]: any = useState("")
  console.log(addNewShippingAddress?.email, newEmal, "__newEmal")
  const handleOpenEdit = ({ id, data }: any) => {
    setEditId(id);
    setNewEmail(data?.email ? data.email : "");
    setAddNewShippingAddress({
      ...defaultAddressFields,
      ...{
        first_name: data?.first_name,
        last_name: data?.last_name,
        address_1: data?.address_1,
        postcode: data?.postcode,
        locality: data?.locality,
        city: data?.city,
        state: data?.state,
        landmark: data?.landmark,
        phone: data?.phone,
        email: data?.email ? data?.email : "",
        default: true,
        address_type:
          data && data?.address_type != "" ? data?.address_type : "home",
      },
    });
    setAddressType(
      data && data?.address_type != "" ? data?.address_type : "home"
    );
  };

  useEffect(() => {
    if (addAddress) {
      if (addAddress?.id) {
        setProceedToPayment(true);
        setSelectedValue({
          value: addAddress?.id,
          getshippingAddresses: JSON.parse(addAddress?.meta_data),
        });
      }

      setAddNewShippingAddress({
        first_name: "",
        last_name: "",
        address_1: "",
        city: "",
        state: "",
        postcode: "",
        phone: "",
        email: "",
        locality: "",
        landmark: "",
        address_type: "",
      });
      setMetaDataAddress();
      setAddNewAddress(false);
      setGetShippingAddressesUrl(`${get_user_shipping_addresses}`);

      if (editId) {
        _SUCCESS("Shipping address is updated successfully");
        setEditId();
      } else {
        _SUCCESS("Shipping address is created successfully");
      }
    }
    if (editId) {
      let data = getshipping_addresses?.length
        ? getshipping_addresses?.map(
          (v: any) =>
            v?.shipping?.length &&
            v?.shipping
              .filter((itm: any) => itm?.id === editId)
              .map((val: any) => val?.meta_data)
        )
        : null;
      setSelectedValue({
        value: editId,
        getshippingAddresses: JSON.parse(data[0]),
      });
    }
  }, [addAddress]);

  useEffect(() => {
    if (getme?.role?.label === "guest") {
      setAddNewAddress(true);
    }
  }, [getme?.role?.label]);

  useEffect(() => {
    if (getbillingAddressesUrl) {
      setGetbillingAddressesUrl();
    }
  }, [getbillingAddressesUrl]);

  useEffect(() => {
    if (getShippingAddressesUrl) {
      setGetShippingAddressesUrl();
    }
  }, [getShippingAddressesUrl]);

  useEffect(() => {
    if (addShippingAddressUrl) {
      setAddShippingAddressUrl();
    }
  }, [addShippingAddressUrl]);

  useEffect(() => {
    if (addAddressError) {
      console.log("addAddressError", addAddressError);
      if (addAddressError?.massage && addAddressError?.massage?.phone) {
        setFieldsErrors((pre) => ({
          ...pre,
          phone: addAddressError?.massage?.phone,
        }));
      }

      if (addAddressError?.massage && addAddressError?.massage?.email) {
        setFieldsErrors((pre) => ({
          ...pre,
          email: addAddressError?.massage?.email,
        }));
      }
    }
    // if (addAddressError?.massage) {
    //   _ERROR(addAddressError?.massage)
    // }
  }, [addAddressError]);

  useEffect(() => {
    if (cart_holding_detail) {
      setSeconds(cart_holding_detail?.differenceInSeconds);
      setUnavailableProducts(cart_holding_detail?.unavailable_products);
      const intervalId = setInterval(() => {
        // Update the seconds every second
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [cart_holding_detail]);

  // Convert seconds to minutes and seconds
  const minutes: number = Math.floor(seconds / 60);
  const remainingSeconds: number = Math.floor(seconds % 60);

  useEffect(() => {
    if (seconds < 0) {
      setStockHoldingUrl({ url: cart_holding, callData: { type: "rollback" } });
    }
  }, [seconds]);

  useEffect(() => {
    if (getCart?.items?.length < 1) {
      router.push("/");
    }
  }, [getCart?.items?.length]);

  useEffect(() => {
    if (getme?.role?.label !== "guest") {
      setStockHoldingUrl({ url: cart_holding, callData: { type: "hold" } });
    }
  }, [getme?.role?.label]);

  useEffect(() => {
    if (stockHold?.type === "rollback") {
      // setProceedToCheckOut(false);
      router.push("/retry");
    }
    // if (logedIn) {
    //     localStorage.setItem("logedId", logedIn?.id);
    //     _SUCCESS("Login Successfull!")
    //     dispatch(setMe(logedIn))
    //     setOpen(false);
    // }

    if (stockHoldError) {
      // _ERROR(logedInError?.massage)
    }
  }, [stockHold, stockHoldError]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await axios.get(me_url, { withCredentials: true });
        if (data?.success && !data?.data?.id) {
          router.push("/");
          _WARNING("Please login");
        }
      } catch (error) {
        console.error(error, "me_error");
        if (error && error?.response?.status === 401) {
          router.push("/");
          _WARNING("Please login");
        }
      }
    };
    fetchMe();
  }, []);

  const showSize = (val: any) => {
    let size: any = "";

    if (val?.productVariationTerms?.length) {
      if (val?.productVariationTerms[0]?.term) {
        size = val?.productVariationTerms[0]?.term?.name;
      }
    }

    return size;
  };

  // const ShowFinalAmmount = () => {
  //   return getCoupon?.couponMetaData?.general?.amount
  //     ? getCoupon?.couponMetaData?.general?.type === "parsentage"
  //       ? getCart?.shippingTotal
  //         ? (
  //           +(
  //             getCart?.productPriceTotal - getCart?.productDiscountAmountTotal
  //           ) -
  //           (+(
  //             getCart?.productPriceTotal - getCart?.productDiscountAmountTotal
  //           ) *
  //             +getCoupon?.couponMetaData?.general?.amount) /
  //           100 +
  //           getCart?.shippingTotal
  //         ).toFixed(2)
  //         : (
  //           +(
  //             getCart?.productPriceTotal - getCart?.productDiscountAmountTotal
  //           ) -
  //           (+(
  //             getCart?.productPriceTotal - getCart?.productDiscountAmountTotal
  //           ) *
  //             +getCoupon?.couponMetaData?.general?.amount) /
  //           100
  //         ).toFixed(2)
  //       : getCart?.shippingTotal
  //         ? (
  //           +(
  //             getCart?.productPriceTotal - getCart?.productDiscountAmountTotal
  //           ) -
  //           +getCoupon?.couponMetaData?.general?.amount +
  //           getCart?.shippingTotal
  //         ).toFixed(2)
  //         : (
  //           +(
  //             getCart?.productPriceTotal - getCart?.productDiscountAmountTotal
  //           ) - +getCoupon?.couponMetaData?.general?.amount
  //         ).toFixed(2)
  //     : getCart?.shippingTotal
  //       ? (
  //         +(getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) +
  //         getCart?.shippingTotal
  //       ).toFixed(2)
  //       : (+(
  //         getCart?.productPriceTotal - getCart?.productDiscountAmountTotal
  //       )).toFixed(2);
  // };


  // =================================================================Old Price Calculations =================================================================
  const totalSum = getCart.items?.reduce((total: number, item: any) => {
    const price = parseFloat(item?.product?.price) || 0; // Convert to number and handle undefined/null
    return total + price;
  }, 0);

  const netTotal = totalSum - getCart?.productDiscountAmountTotal
  const netsp = getCart?.productDiscountAmountTotal ? netTotal : totalSum

  const ShowFinalAmmount: any = () => {
    return (getCoupon?.couponMetaData?.general?.amount ?
      getCoupon?.couponMetaData?.general?.type === "parsentage" ?
        ((+getCart?.allTotalAmount) - (netsp * +(getCoupon?.couponMetaData?.general?.amount) / 100))
        :
        ((+getCart?.allTotalAmount) - (+(getCoupon?.couponMetaData?.general?.amount)))
      : +getCart?.allTotalAmount)
  }
  // =================================================================Old Price Calculations =================================================================

  const shippingCalculate = () => {
    const netsp = getCart?.allTotalAmountWithoutShipping || 0;
    const couponAmount = +(getCoupon?.couponMetaData?.general?.amount || 0);
    const couponType = getCoupon?.couponMetaData?.general?.type || "";

    let shippingPrice = 50;
    let afterShipping;

    if (couponType === "percentage") {
      const discount = netsp * (couponAmount / 100);
      afterShipping = netsp - discount;
    } else {
      afterShipping = netsp - couponAmount;
    }

    // Set shipping price based on the total after discount
    if (afterShipping < 500) {
      shippingPrice = 50;
    } else {
      shippingPrice = 0;
    }
    console.log(afterShipping, shippingPrice, "35df4y6gd5g1r")
    return shippingPrice;
  };

  const shippingPriceData = shippingCalculate();

  // =================================================================New Price Calculations =================================================================
  const calculateFinalPrice = () => {
    const netsp = getCart?.allTotalAmountWithoutShipping || 0;
    const shipping = getCart?.shippingTotal || 0;
    const couponAmount = +(getCoupon?.couponMetaData?.general?.amount || 0);
    const couponType = getCoupon?.couponMetaData?.general?.type || "";

    let finalPrice = netsp;
    if (couponType === "parsentage") {
      const discount = netsp * (couponAmount / 100);
      const afterShipping = netsp - discount;
      finalPrice = afterShipping < 500 ? afterShipping + 50 : afterShipping;
    } else {
      // const afterShipping = netsp - couponAmount;
      // finalPrice = afterShipping < 500 ? afterShipping + 50 : afterShipping;
      finalPrice = netsp - couponAmount + shipping;
    }
    console.log(finalPrice, "35fgggg2")

    // Add shipping cost
    // finalPrice += shipping;
    return finalPrice > 0 ? finalPrice : 0;
  };
  const priceWithDiscount = calculateFinalPrice();

  useEffect(() => {
    const netsp = getCart?.allTotalAmountWithoutShipping || 0;
    const couponAmount = +(getCoupon?.couponMetaData?.general?.amount || 0);
    const couponType = getCoupon?.couponMetaData?.general?.type || "";
    const orderDiscount = getCart?.productDiscountAmountTotal || 0
    if (couponType === "parsentage") {
      const discount = netsp * (couponAmount / 100);
      const disCountedValue = orderDiscount + discount
      setTotalDisCountAmount(disCountedValue)
    } else {
      const disCountedAmountValue = orderDiscount + couponAmount
      setTotalDisCountAmount(disCountedAmountValue)
    }

  }, [getCart, getCoupon, totalDisCountAmount]);
  // =================================================================New Price Calculations =================================================================

  useEffect(() => {
    console.log("getshipping_addresses", getshipping_addresses);
    if (
      getme?.role?.label === "guest" &&
      getshipping_addresses?.length == 1 &&
      getshipping_addresses[0]?.shipping?.length == 1
    ) {
      getshipping_addresses.map((v: any) => {
        if (v?.shipping?.length == 1) {
          v?.shipping.map((itm: any, idx: number) => {
            let value = JSON?.parse(itm?.meta_data);
            handleOpenEdit({ id: itm?.id, data: value });
            setAddNewAddress(true);
            clear();
            setSelectedValue({ value: itm?.id, getshippingAddresses: value });
          });
        }
      });
      setNoNewAddressAdd(true);
    }
  }, [getme, getme?.role?.label, getshipping_addresses?.length]);

  const AddNewAddressHTML = ({ edit }: any) => {
    const verifyNumber = useCallback(async () => {
      console.log("verifyNumber");
      try {
        // Check if phone exists and the role is "guest"
        if (addNewShippingAddress?.phone && getme?.role?.label === "guest") {
          const { data } = await _put(quick_verify, {
            c: addNewShippingAddress?.phone,
          });

          console.log("====================================");
          console.log(data && data);
          console.log("====================================");

          if (data?.success && data?.data) {
            console.log("data?.data", data?.data);
            setIsUserPhoneNumberAlreadyExist(true);
            setFieldsErrors({
              ...fieldsErrors,
              phone: `Phone number is ${data?.data}`,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }, [addNewShippingAddress?.phone, getme?.role?.label, fieldsErrors]);

    const verifyEmail = useCallback(async () => {
      console.log("verifyEmail");
      try {
        if (addNewShippingAddress?.email && getme?.role?.label === "guest") {
          const { data } = await _put(quick_verify, {
            c: addNewShippingAddress?.email,
          });
          if (data?.success && data?.data) {
            console.log("data?.data", data?.data);
            setIsUserEmailAlreadyExist(true);
            setFieldsErrors({
              ...fieldsErrors,
              email: `Email is ${data?.data}`,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }, [addNewShippingAddress?.email && getme?.role?.label === "guest", addNewShippingAddress?.email])

    // useEffect(() => {
    //   verifyNumber();
    // }, [addNewShippingAddress?.phone && getme?.role?.label === "guest", addNewShippingAddress?.phone]);

    // useEffect(() => {
    //   verifyEmail();
    // }, [addNewShippingAddress?.email && getme?.role?.label === "guest", addNewShippingAddress?.email]);


    return (
      <>
        {!addNewAddress ? (
          <>
            {edit ? null : (
              <button
                className="btn2 w-fit items-center my-3"
                onClick={() => {
                  setAddNewAddress(true);
                  setProceedToPayment(false);
                  setSelectedValue();
                  clear();
                }}
              >
                <div className={"mx-2 my-1 flex items-center gap-2"}>
                  <AddCircleIcon
                    style={{ color: "#ffffff", fill: "#ffffff" }}
                  />
                  Add New Address
                </div>
              </button>
            )}
          </>
        ) : (
          <div className="add_address_root w-full flex flex-col gap-2 my-3">
            {edit ? null : (
              <div className="flex items-center">
                {/* <input type='radio' id={`${1}`} checked={true} />&nbsp; */}
                {getme?.role?.label === "guest" ? null : (
                  <p className="addnew_address_selected m-0">
                    ADD A NEW ADDRESS
                  </p>
                )}
              </div>
            )}
            {/* <button type="submit" className="btn2 w-fit items-center">
              <div className={"mx-2 my-1 "}>
                <MyLocationIcon style={{ color: "#ffffff", fill: "#ffffff" }} />&nbsp;Use my current location
              </div>
            </button> */}

            <div className="col-md-8 col-8 flex w-full gap-2">
              <div
                className="flex flex-col items-start"
                style={{ width: "50%" }}
              >
                <input
                  type="number"
                  className="form-control"
                  value={addNewShippingAddress?.phone}
                  name="phone"
                  placeholder={
                    getme?.role?.label === "guest"
                      ? "Phone number"
                      : "Contact number"
                  }
                  onChange={(e: any) => doAddressHandleChange(e)}
                  onBlur={() => verifyNumber()}
                />
                {fieldsErrors?.phone && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {fieldsErrors.phone}
                  </span>
                )}
              </div>

              <div
                className="flex flex-col items-start justify-center"
                style={{ width: "50%" }}
              >
                {/* {getme?.role?.label === "guest" ?
                  <> */}
                <input
                  type="email"
                  className="form-control"
                  disabled={
                    getme?.role?.label !== "guest" ?
                      edit ?
                        newEmal ?
                          true
                          :
                          false
                        :
                        true
                      :
                      false
                  }
                  value={addNewShippingAddress?.email}
                  name="email"
                  placeholder="Email"
                  onChange={(e: any) => doAddressHandleChange(e)}
                  onBlur={() => verifyEmail()}
                />
                {fieldsErrors?.email && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {fieldsErrors.email}
                  </span>
                )}
                {/* </>
                  :
                  <span style={{ fontSize: "14px" }}>{addNewShippingAddress?.email}</span>} */}
              </div>
            </div>

            <div className="col-md-8 col-8 flex w-full gap-2">
              <div
                className="flex flex-col items-start"
                style={{ width: "50%" }}
              >
                <input
                  type="text"
                  className="form-control"
                  value={addNewShippingAddress?.first_name}
                  name="first_name"
                  placeholder="First name"
                  onChange={(e: any) => doAddressHandleChange(e)}
                />
                {fieldsErrors?.first_name && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {fieldsErrors.first_name}
                  </span>
                )}
              </div>

              <div
                className="flex flex-col items-start"
                style={{ width: "50%" }}
              >
                <input
                  type="text"
                  className="form-control"
                  value={addNewShippingAddress?.last_name}
                  name="last_name"
                  placeholder="Last name"
                  onChange={(e: any) => doAddressHandleChange(e)}
                />
                {fieldsErrors?.last_name && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {fieldsErrors.last_name}
                  </span>
                )}
              </div>
            </div>

            {/* <div className="col-md-8 col-8 flex w-full gap-2 add_address_text_area">
              <div className='flex flex-col items-start' style={{ width: "100%" }}>
                <textarea typeof="text" className="form-control" value={addNewShippingAddress?.address_1} name="address_1" placeholder="Address (Area and Street)" onChange={(e: any) => doAddressHandleChange(e)} />
                {fieldsErrors?.address_1 && <span style={{ color: "red", fontSize: "12px" }}>{fieldsErrors.address_1}</span>}
              </div>
            </div> */}

            <div className="col-md-8 col-8 flex w-full gap-2">
              <div
                className="flex flex-col items-start"
                style={{ width: "50%" }}
              >
                <input
                  type="number"
                  className="form-control"
                  value={addNewShippingAddress?.postcode}
                  name="postcode"
                  min={6}
                  max={6}
                  placeholder="Pincode"
                  onChange={(e: any) => doAddressHandleChange(e)}
                />
                {fieldsErrors?.postcode ? (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {fieldsErrors.postcode}
                  </span>
                ) : pincodeError ? (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {pincodeError}
                  </span>
                ) : ""
                }
              </div>

              <div
                className="flex flex-col items-start"
                style={{ width: "50%" }}
              >
                <input
                  type="text"
                  className="form-control"
                  value={addNewShippingAddress?.address_1}
                  name="address_1"
                  placeholder="Address (Area and Street)"
                  onChange={(e: any) => doAddressHandleChange(e)}
                />
                {fieldsErrors?.address_1 && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {fieldsErrors.address_1}
                  </span>
                )}
                {/* <textarea typeof="text" className="form-control" value={addNewShippingAddress?.address_1} name="address_1" placeholder="Address (Area and Street)" onChange={(e: any) => doAddressHandleChange(e)} />
                  {fieldsErrors?.address_1 && <span style={{ color: "red", fontSize: "12px" }}>{fieldsErrors.address_1}</span>} */}
              </div>

              {/* <div className='flex flex-col items-start' style={{ width: "50%" }}>
                <input type="text" className="form-control" value={addNewShippingAddress?.locality} name="locality" placeholder="Locality" onChange={(e: any) => doAddressHandleChange(e)} />
                {fieldsErrors?.locality && <span style={{ color: "red", fontSize: "12px" }}>{fieldsErrors.locality}</span>}
              </div> */}
            </div>
            <div className="col-md-8 col-8 flex w-full gap-2">
              <div
                className="flex flex-col items-start relative"
                style={{ width: "50%" }}
              >
                <input
                  type="text"
                  className="form-control"
                  value={addNewShippingAddress?.city}
                  name="city"
                  placeholder="City/District/Town"
                  disabled
                // onChange={(e: any) => doAddressHandleChange(e)}
                />
                {fieldsErrors?.city && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {fieldsErrors.city}
                  </span>
                )}
                {getlocationLoading ? (
                  <CircularProgress
                    color="inherit"
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "25%",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                ) : null}
              </div>

              <div
                className="flex flex-col items-start relative"
                style={{ width: "50%" }}
              >
                <input
                  type="text"
                  className="form-control"
                  value={addNewShippingAddress?.state}
                  name="state"
                  placeholder="State"
                  disabled
                // onChange={(e: any) => doAddressHandleChange(e)}
                />
                {fieldsErrors?.state && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {fieldsErrors.state}
                  </span>
                )}
                {getlocationLoading ? (
                  <CircularProgress
                    color="inherit"
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "25%",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                ) : null}
              </div>
            </div>

            <div className="col-md-8 col-8 flex w-full gap-2">
              <div
                className="flex flex-col items-start"
                style={{ width: "50%" }}
              >
                <input
                  type="text"
                  className="form-control"
                  value={addNewShippingAddress?.locality}
                  name="locality"
                  placeholder="Locality"
                  // onChange={(e: any) => doAddressHandleChange(e)}
                  disabled
                />
                {fieldsErrors?.locality && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {fieldsErrors.locality}
                  </span>
                )}
              </div>

              <div
                className="flex flex-col items-start"
                style={{ width: "50%" }}
              >
                <input
                  type="text"
                  className="form-control"
                  value={addNewShippingAddress?.landmark}
                  name="landmark"
                  placeholder="Landmark (Optional)"
                  onChange={(e: any) => doAddressHandleChange(e)}
                />
              </div>
            </div>

            {/* <div className="col-md-8 col-8 flex w-full gap-2">
              <input type="text" className="form-control" value={addNewShippingAddress?.landmark} name="landmark" placeholder="Landmark (Optional)" onChange={(e: any) => doAddressHandleChange(e)} />
            </div> */}
            <div className="flex flex-col items-start my-1 ">
              <p className="m-0 address_type w-full">Address Type</p>
              <div className="flex items-center gap-4 tm-gap-2 w-full tm-items-start tm-flex-col">
                <div className="flex items-center">
                  <input
                    type="radio"
                    className="cursor-pointer"
                    checked={addressType === "home"}
                    name="home"
                    onChange={(e: any) => {
                      setAddressType(e.target.name);
                      setAddNewShippingAddress((pre: any) => ({
                        ...pre,
                        address_type: e.target.name,
                      }));
                    }}
                  />
                  &nbsp;
                  <p className="address_type_selected m-0">
                    Home (All day delivery)
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    className="cursor-pointer"
                    checked={addressType === "work"}
                    name="work"
                    onChange={(e: any) => {
                      setAddressType(e.target.name);
                      setAddNewShippingAddress((pre: any) => ({
                        ...pre,
                        address_type: e.target.name,
                      }));
                    }}
                  />
                  &nbsp;
                  <p className="address_type_selected m-0">
                    Work (Delivery between 10 AM - 5 PM)
                  </p>
                </div>
                {/* {fieldsErrors?.address_type && <span style={{ color: "red" }}>{fieldsErrors.address_type}</span>} */}
              </div>
            </div>
            <div className="col-md-8 col-8 flex w-full items-end gap-2">
              <button
                className="btn2 w-fit items-center"
                onClick={() => doAddressUpdate()}
              >
                <div className={"mx-2 my-1 "}>
                  {editId
                    ? "Update and delivery here"
                    : "Save and delivery here"}
                </div>
              </button>
              {getme?.role?.label === "guest" ? null : (
                <p
                  className="edit-order-cancel m-0 cursor-pointer"
                  onClick={() => {
                    setAddNewAddress(false);
                    setAddNewShippingAddress({
                      first_name: "",
                      last_name: "",
                      address_1: "",
                      city: "",
                      state: "",
                      postcode: "",
                      phone: "",
                      email: "",
                      locality: "",
                      landmark: "",
                      address_type: "",
                    });
                    setEditId();
                    clear();
                  }}
                >
                  Cancel
                </p>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  const timeCounter = () => {
    let m = minutes < 10 ? `0${minutes}:` : `${minutes}:`;
    let s = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return seconds < 0 ? "Time Out" : m + s;
  };

  const doManualyRollback = async () => {
    try {
      const { data } = await axios.post(
        cart_holding,
        { type: "rollback" },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error, "__error");
    }
  };

  useEffect(() => {
    return () => {
      // Code to run on component unmount
      doManualyRollback();
    };
  }, []);
  const [unavailable_product_ids, setUnavailable_product_ids]: any = useState(
    []
  );
  const [getCart_ids, setGetCart_ids]: any = useState();
  useEffect(() => {
    setUnavailable_product_ids(
      CartHolding?.unavailable_product_ids?.length
        ? CartHolding?.unavailable_product_ids.map((v: any) => ({ id: v }))
        : []
    );
    setGetCart_ids(
      getCart?.items?.length
        ? getCart?.items.map((v: any) => ({ id: v?.product_id }))
        // ? getCart?.items.map((v: any) => ({ id: v?.stock_quantity }))
        : []
    );
  }, [CartHolding, getCart]);

  const getMissingIds: any = (array1: any, array2: any) => {
    const ids1: any = new Set(
      array1?.length ? array1.map((item: any) => item.id) : []
    );
    const ids2: any = new Set(
      array2?.length ? array2.map((item: any) => item.id) : []
    );
    const missingFromA1 = [...ids1]
      .filter((id: any) => ids2.has(id))
      .map((v: any) => ({ id: v }));

    console.log(array1, ids1, array2, ids2, missingFromA1, "fg4fds566CartHolding")
    return {
      missingFromA1,
    };
  };

  const { missingFromA1 } = getMissingIds(unavailable_product_ids, getCart_ids);
  const outOfStockIds = new Set(missingFromA1.map((item: any) => item.id));
  console.log(outOfStockIds, "g53h4j45gh")

  useEffect(() => {
    let value: any = [];
    if (getshipping_addresses?.length) {
      getshipping_addresses?.map((v: any) => {
        if (v?.shipping?.length) {
          v?.shipping.map((itm: any, idx: number) => {
            value = [
              ...value,
              { value: JSON.parse(itm?.meta_data), id: itm?.id },
            ];
          });
        }
      });
    }
    let selectedValue: any = {};
    if (value?.length) {
      selectedValue = value
        ?.filter((v: any) => v?.value?.default === true)
        .map((val: any) => val);
    }
    if (selectedValue?.length) {
      setSelectedValue({
        value: selectedValue[0]?.id,
        getshippingAddresses: selectedValue[0]?.value,
      });
      console.log("fetchAddressData", selectedValue);

      if (
        selectedValue[0] &&
        selectedValue[0]?.value &&
        selectedValue[0]?.value?.postcode
      ) {
        fetchAddressData(selectedValue[0]?.value?.postcode);
      }

      setProceedToPayment(true);
      setAddNewAddress(false);
    }
  }, [getshipping_addresses]);

  const doCountInCart = ({ plus, minus, id }: any) => {
    if (plus) {
      setUpdateCartUrl(update_cart_holding);
      setUpdateCart({ quantity: 1, cart_id: id, increase: true });
    }
    if (minus) {
      setUpdateCartUrl(update_cart_holding);
      setUpdateCart({ quantity: 1, cart_id: id, increase: false });
    }
  };

  const handleChangePayment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = e.target.name;

    if (selectedOption === "codNotAvl") {
      // setPaymentOption('')

      _WARNING("COD Not Available");
    } else if (selectedOption !== "codNotAvl") {
      setPaymentOption(selectedOption);
    }
  };


  // console.log("=====================================")
  // console.log(selectedValue)
  // console.log("=====================================")

  return (
    <div className="container checkout_root py-4">
      <div className={"checkout_root_right"}>
        {getme?.role?.label === "guest" ? (
          <div className="flex items-center gap-2">
            <span>Already registered ?</span>
            <button
              onClick={() => dispatch(setOpenAuth(true))}
              className="proceed my-2 px-2"
              style={{
                width: "fit-content",
                height: "34px",
                borderRadius: "6px",
              }}
            >
              Login or Sign In
            </button>
          </div>
        ) : null}

        <div className="flex items-center p-2 bg-pink-100 border-solid-pink-2 roundded-2">
          <div className="rounde-pink-dot">
            <span>1</span>
          </div>
          &nbsp;&nbsp;
          <p className="m-0 checkout-headers">Delivery address</p>
        </div>

        {/* check address */}
        <div
          className="delivery_address"
        >
          {getshipping_addresses?.length
            ? getshipping_addresses?.map((v: any) =>
              v?.shipping?.length
                ? v?.shipping.map((itm: any, idx: number) => {
                  let value = JSON.parse(itm?.meta_data);
                  // if (value?.default === true) {
                  // setSelectedValue({ value: itm?.id, getshippingAddresses: value })
                  // }
                  console.log(idx, getshipping_addresses, getshipping_addresses?.length, "d354hf61")
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-start pt-2 p-0 w-full"
                    >
                      <div className="w-full">
                        <div className="flex flex-row items-center tm-w-full order_shipping_address_loop_root">
                          <input
                            type="radio"
                            className="cursor-pointer m-0 me-2"
                            id={itm?.id}
                            checked={selectedValue?.value == itm?.id}
                            value={itm?.id}
                            onChange={(e: any) => {
                              setProceedToPayment(true);
                              setAddNewAddress(false);
                              value && value?.postcode
                                ? fetchAddressData(value?.postcode)
                                : setCOD(0);
                              setSelectedValue({
                                value: e.target.value,
                                getshippingAddresses: value,
                              });
                            }}
                          />
                          <div className="flex items-start flex-col gap-1 w-full">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <p className="shipping_address_name m-0">
                                  {value?.first_name + " " + value?.last_name}
                                </p>
                              </div>
                              <div className="flex items-center">
                                <p className="order-place m-0">
                                  {value?.address_type || "--"}
                                </p>
                                &nbsp;
                                &nbsp;
                                <p
                                  style={{ border: "1px solid #a7a7a7" }}
                                  className="edit-order m-0 cursor-pointer rounded"
                                  onClick={() => {
                                    handleOpenEdit({ id: itm?.id, data: value });
                                    setAddNewAddress(true);
                                    clear();
                                  }}
                                >
                                  {/* <div className=""> */}
                                  <EditIcon style={{ fontSize: "16px" }} className="m-1" />
                                  {/* </div> */}
                                </p>
                              </div>
                            </div>
                            <p className="order-address m-0 flex w-full">
                              {/* <span style={mobView ? { color: "#6f6f6f", fontWeight: "600" } : { color: "#6f6f6f", fontWeight: "600", width: "15%" }}>Address:&nbsp;</span> */}
                              <span style={mobView ? {} : { width: "85%", textAlign: "start" }}>{value?.address_1}<br />{value?.landmark}, {value?.state}, {value?.postcode}</span>
                            </p>
                            <p className="order-address m-0 flex items-center w-full">
                              <span style={{ color: "#6f6f6f", fontWeight: "600" }}>Phone Number:&nbsp;</span><span>{value?.phone || "--"}</span>
                            </p>
                          </div>
                          {/* <p className="order-address m-0">{value?.address_1 + " " + value?.address_2}</p> */}
                        </div>
                      </div>
                      {editId === itm?.id
                        ? AddNewAddressHTML({ edit: true })
                        : null}
                      <hr className="w-full m-0 mt-2" />
                    </div>
                  );
                })
                : null
            )
            : null
          }
        </div>
        {/* add new address */}
        {editId
          ? null
          : !no_new_address_add && AddNewAddressHTML({ edit: false })}

        <div className="flex items-center p-2 bg-pink-100 border-solid-pink-2 roundded-2">
          <div className="rounde-pink-dot">
            <span>2</span>
          </div>
          &nbsp;&nbsp;
          <p className="m-0 checkout-headers">Payment Options</p>
        </div>
        {proceedToPayment && (
          <div className="add_address_root flex flex-col gap-2 mb-3">
            {/* {walletAmount != 0 && ( */}
            <div className="payment_option_balance">
              <input
                type="checkbox"
                name="wallet_balance"
                onChange={(e: any) => {
                  setWalletBalenceCheck(e?.target?.checked)
                  // setopenOption(false)
                  // setShowOtherOption(true)
                }
                }
                disabled={getWalletAmount?.total_amount === 0}
              />
              &nbsp;&nbsp;Use Wallet Balance{" "}
              <span className="ammount">(₹{walletAmount?.toFixed(2)})</span>
            </div>
            {/* )} */}
            {openOption && (
              <div className="flex flex-col items-start  my-1">
                <div className={`flex items-center tm-items-start tm-flex-col ${tabView ? `gap-2` : mobView ? `gap-2` : `gap-4`} w-full`}>
                  {cod ? (
                    <div className="flex items-center">
                      <input
                        type="radio"
                        style={{ cursor: "pointer" }}
                        checked={paymentOption === "cod"}
                        name={"cod"}
                        onChange={handleChangePayment}
                      />
                      &nbsp;
                      <p className="address_type_selected m-0">
                        Cash On Delivery
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <input
                        type="radio"
                        style={{ cursor: "pointer" }}
                        checked={false}
                        name={"codNotAvl"}
                        onChange={handleChangePayment}
                      />
                      &nbsp;
                      <p className="address_type_selected m-0">
                        Cash On Delivery
                      </p>
                    </div>
                  )}
                  <div className="flex items-center">
                    <input
                      type="radio"
                      style={{ cursor: "pointer" }}
                      checked={paymentOption === "razorpay"}
                      name={"razorpay"}
                      onChange={handleChangePayment}
                    />
                    &nbsp;
                    <p className="address_type_selected m-0">
                      Credit Card/Debit Card/NetBanking/UPI Payment
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-8 col-8 flex w-full items-end gap-2">
              <button
                className="btn2 w-fit items-center"
                // disabled={
                //   CartHolding?.unavailable_product_ids?.length
                //     ? CartHolding?.unavailable_product_ids.map((v: any) =>
                //       getMissingIds(unavailable_product_ids, getCart_ids)
                //         ?.missingFromA1
                //         ? getMissingIds(
                //           unavailable_product_ids,
                //           getCart_ids
                //         )?.missingFromA1.map(
                //           (val: any) => val?.id === v?.id
                //         )
                //         : []
                //     )
                //       ? true
                //       : false
                //     : false
                // }
                onClick={() => {
                  if (missingFromA1.some((item: any) => outOfStockIds.has(item.id))) {
                    toast.error("Some items are out of stock. Please update your cart.", {
                      style: { fontSize: "12px", padding: "10px" },
                    });
                  } else {
                    handleSubmit()
                  }
                }}
              // onClick={() => {
              //   handleSubmit();
              // }}
              >
                <div className={"mx-2 my-1 "}>
                  {proceedToCheckOut ? "Processing..." : "Proceed to payment"}
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={"checkout_root_left"}>
        {cart_holding_detail && (
          <div className="flex flex-col gap-2 mb-2">
            {timeCounter() !== "NaN:NaN" ? (
              <div className="flex items-center gap-2">
                <b>Remaining Order Time: </b>
                <span
                  style={
                    timeCounter() <= "02:00"
                      ? {
                        color: "#ffffff",
                        background: "red",
                        padding: "0.05rem 0",
                        borderRadius: "6px",
                        width: "4rem",
                        fontSize: "16px",
                      }
                      : {
                        color: "#ffffff",
                        background: "#08c388",
                        padding: "0.05rem 0",
                        borderRadius: "6px",
                        width: "4rem",
                        fontSize: "16px",
                      }
                  }
                  className="flex items-center justify-center"
                >
                  {timeCounter()}
                  <br />
                </span>
              </div>
            ) : null}

            {CartHolding?.unavailable_product_ids?.length ? (
              CartHolding?.unavailable_product_ids.map(
                (v: any) =>
                  getMissingIds(unavailable_product_ids, getCart_ids)
                    ?.missingFromA1 &&
                  getMissingIds(
                    unavailable_product_ids,
                    getCart_ids
                  )?.missingFromA1.map((val: any) => val?.id === v?.id)
              ) ? (
                <>
                  <b style={{ color: "red" }}>
                    {/* Currently Out of Stock Products */}
                  </b>
                </>
              ) : null
            ) : null}
          </div>
        )}

        <div
          className={`flex flex-col gap-2 mb-2 ${getopenCartDisable ? "glowCard" : "glowCardDisable"
            }`}
        >
          {getCart?.items?.length
            ? getCart?.items.map((v: any, i: number) => {
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="productImage_bg mt-1">
                    <Image
                      src={
                        v?.product?.images?.length
                          && v?.product?.images[0]?.src !== null ? v?.product?.images[0]?.src
                          : brandDam
                      }
                      alt="product-image"
                      // style={{ height: "80px" }}
                      // width={80}
                      // height={100}
                      className="object-cover"
                      style={{ height: "100px", width: "100px" }}
                      width={100}
                      height={100}
                      sizes="(min-width: 100px) 50vw, 100vw"
                    />
                  </div>
                  <div style={{ width: "80%" }}>
                    <p className="m-0 product-name">
                      <Link
                        className="product-name"
                        style={{ fontSize: "100%" }}
                        href={`/product/${v?.product?.slug}`}
                      >
                        {v?.product?.name.charAt(0).toUpperCase() +
                          v?.product?.name.slice(1).toLowerCase()}
                      </Link>
                    </p>
                    <div className="flex gap-5">
                      <div className="m-0 flex items-center gap-2 product-des">
                        {showSize(v?.variation) ? (
                          <span>Size: {showSize(v?.variation)}</span>
                        ) : null}
                        <span>Quantity:</span>
                        <span
                          className="orderUpDown"
                          onClick={() => {
                            v?.quantity === 1
                              ? setOpenLastModal({
                                plus: false,
                                minus: true,
                                id: v?.id,
                                p_name: v?.product?.name,
                              })
                              : doCountInCart({
                                plus: false,
                                minus: true,
                                id: v?.id,
                              });
                          }}
                        >
                          -
                        </span>
                        &nbsp;{v?.quantity || "0"}&nbsp;
                        <span
                          className="orderUpDown"
                          onClick={() =>
                            doCountInCart({
                              plus: true,
                              minus: false,
                              id: v?.id,
                            })
                          }
                        >
                          +
                        </span>
                      </div>

                      {outOfStockIds.has(v?.product_id) && (
                        <div>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 10px",
                              backgroundColor: "#f44336",
                              color: "#fff",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "14px",
                              textAlign: "center",
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                            }}
                            onClick={() => {
                              setOpenLastModal({
                                plus: false,
                                minus: true,
                                id: v?.id,
                                p_name: v?.product?.name,
                              })
                            }}
                          //                             onClick={() => {
                          //                               setUpdateCartUrl(update_cart_holding);
                          //                               setUpdateCart({ quantity: 0, cart_id: v?.id, increase: false });
                          // }}
                          >
                            Remove
                          </span>
                        </div>)}

                    </div>
                    <p className="m-0 product-price">
                      {v?.product?.sale_price ? (
                        <div>
                          <del className="m-0" style={{ color: "#959494" }}>
                            {v?.product?.price}
                          </del>
                          &nbsp;₹{v?.product?.sale_price}
                        </div>
                      ) : (
                        <div>₹{v?.product?.price}</div>
                      )}
                    </p>
                    {/* {getMissingIds(unavailable_product_ids, getCart_ids)
                      ?.missingFromA1 ? (
                      getMissingIds(
                        unavailable_product_ids,
                        getCart_ids
                      )?.missingFromA1.map(
                        (val: any) => val?.id === v?.product_id
                      ).length ? (
                        <p
                          className="m-0 p-0"
                          style={{
                            color: "red",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          Out of Stock
                        </p>
                      ) : null
                    ) : null} */}
                    {outOfStockIds.has(v?.product_id) && (
                      <p
                        className="m-0 p-0"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Out of Stock
                      </p>
                    )}
                  </div>
                </div>
              );
            })
            : null}
          <hr className="my-2" />

          <span
            style={{
              color: "#e4509d",
              backgroundColor: "transparent",
              padding: "10px 0",
              textAlign: "center",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
              fontWeight: "600",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              display: "inline-block",
            }}
            onClick={() => {
              callCartHolding()
              // setStockHoldingUrl({ url: cart_holding, callData: { type: 'rollback' } });
              if (getCoupon?.couponMetaData?.general?.amount) {
                dispatch(setCoupon({}));
                const netsp = getCart?.allTotalAmountWithoutShipping || 0;
                const shipping = getCart?.shippingTotal || 0;
                const walletBalanceAfterCouponRemoval =
                  getWalletAmount?.total_amount - (netsp + shipping);
                setWallerAmount(walletBalanceAfterCouponRemoval);
              } else {
                dispatch(setOpenCart(true));
                dispatch(setOpenCartDiscount(true));
              }
            }}
          >
            {getCoupon?.couponMetaData?.general?.amount ? "Remove coupon" : "Apply coupon"}
          </span>

          <hr className="my-2" />

          <div>
            <div className="checkout_payments_root">
              <p className="m-0 checkout_payments">
                <span>Subtotal : </span>
                <span>₹{currencyFormatter.format((+getCart?.productPriceTotal), { code: '' })}</span>
              </p>
              {getCart?.productDiscountAmountTotal !== 0 ? (
                <p className="m-0 checkout_payments">
                  <span>Discount : </span>
                  <span style={{ color: "green", fontWeight: "600" }}>
                    - ₹{currencyFormatter.format((getCart?.productDiscountAmountTotal), { code: '' })}
                  </span>
                </p>
              ) : null}
              {getCoupon?.couponMetaData?.general?.amount &&
                // <p className="m-0 checkout_payment">
                //   <span className="flex items-center">
                //     Coupon
                //     <strong>
                //       {getCoupon?.code && <>&nbsp;({getCoupon?.code})</>}
                //     </strong>
                //     &nbsp;:
                //   </span>
                //   {getCoupon?.couponMetaData?.general?.amount ? (
                //     <div className="mx-5 flex items-center gap-1 justify-start">
                //       <div>-</div>
                //       <span style={{ color: "green", fontWeight: "600", marginLeft: "0px" }}>
                //         {`(${currencyFormatter.format(totalDisCountAmountc - getCart?.productDiscountAmountTotal, { code: 'INR' })})`}
                //       </span>

                //       <span style={{ color: "green", }}>
                //         {getCoupon?.couponMetaData?.general?.type === "parsentage"
                //           ? `${currencyFormatter.format((getCoupon?.couponMetaData?.general?.amount), { code: '' })}%`
                //           : `₹${currencyFormatter.format((getCoupon?.couponMetaData?.general?.amount), { code: '' })}`}
                //         &nbsp;
                //       </span>
                //     </div>
                //   ) : (
                //     ""
                //   )}
                // </p>
                <p className="m-0 checkout_payment relative flex items-center justify-between">
                  <span className="flex items-center" style={{ fontSize: "14px" }}>
                    Coupon
                    <strong>
                      {getCoupon?.code && <>&nbsp;({getCoupon?.code})</>}
                    </strong>
                    &nbsp; :
                  </span>
                  {getCoupon?.couponMetaData?.general?.amount ? (
                    <div className="flex items-center gap-1"
                    // style={{
                    //   position: "absolute",
                    //   top: "0",
                    //   left: "57.5%"
                    // }}
                    >
                      <div style={{ color: "green" }}>-</div>
                      {getCoupon?.couponMetaData?.general?.type === "parsentage" &&
                        <span
                          style={{
                            color: "green",
                            fontWeight: "600",
                            fontSize: "14px"
                          }}
                        >
                          {`${currencyFormatter.format(totalDisCountAmountc - getCart?.productDiscountAmountTotal, { code: 'INR' })}`}
                        </span>}
                      <span style={{ color: "green", fontSize: "14px" }}>
                        {getCoupon?.couponMetaData?.general?.type === "parsentage"
                          ? `(${currencyFormatter.format(getCoupon?.couponMetaData?.general?.amount, { code: '' })}%)`
                          : `₹${currencyFormatter.format(getCoupon?.couponMetaData?.general?.amount, { code: '' })}`}
                        &nbsp;
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </p>

              }
              <p className="m-0 checkout_payments">
                <span>Shipping : </span>
                {shippingCalculate() === 0 ? (
                  <span>
                    <del>₹50</del>&nbsp;
                    <span style={{ color: "green", fontWeight: "600" }}>
                      FREE Delivery
                    </span>
                  </span>
                ) : (
                  <span style={{ color: "#008000" }}>₹{shippingCalculate()}</span>
                )}
              </p>

              {walletBalenceCheck && <p className="m-0 checkout_payments">
                <span>Wallet : </span>
                <span style={{ color: "green", fontWeight: "600" }}>
                  {getWalletAmount?.total_amount < getCart?.allTotalAmountWithoutShipping
                    ? `₹${(getWalletAmount?.total_amount).toFixed(2)}`
                    : `₹${calculateFinalPrice().toFixed(2)}`
                  }
                </span>
              </p>}
            </div>
            <hr className="mt-4 mb-3" />
            {getCart?.productDiscountAmountTotal !== 0 ? (
              <p className="m-0 checkout_payments">
                <span>Total</span>
                <span style={{ color: "#d8428d", fontWeight: 600 }}>
                  {/* ₹
                  {getCoupon?.couponMetaData?.general?.amount
                    ? getCoupon?.couponMetaData?.general?.type === "parsentage"
                      ? getCart?.shippingTotal
                        ? (
                          +(
                            getCart?.productPriceTotal -
                            getCart?.productDiscountAmountTotal
                          ) -
                          (+(
                            getCart?.productPriceTotal -
                            getCart?.productDiscountAmountTotal
                          ) *
                            +getCoupon?.couponMetaData?.general?.amount) /
                          100 +
                          getCart?.shippingTotal
                        ).toFixed(2)
                        : (
                          +(
                            getCart?.productPriceTotal -
                            getCart?.productDiscountAmountTotal
                          ) -
                          (+(
                            getCart?.productPriceTotal -
                            getCart?.productDiscountAmountTotal
                          ) *
                            +getCoupon?.couponMetaData?.general?.amount) /
                          100
                        ).toFixed(2)
                      : getCart?.shippingTotal
                        ? (
                          +(
                            getCart?.productPriceTotal -
                            getCart?.productDiscountAmountTotal
                          ) -
                          +getCoupon?.couponMetaData?.general?.amount +
                          getCart?.shippingTotal
                        ).toFixed(2)
                        : (
                          +(
                            getCart?.productPriceTotal -
                            getCart?.productDiscountAmountTotal
                          ) - +getCoupon?.couponMetaData?.general?.amount
                        ).toFixed(2)
                    : getCart?.shippingTotal
                      ? (
                        +(
                          getCart?.productPriceTotal -
                          getCart?.productDiscountAmountTotal
                        ) + getCart?.shippingTotal
                      ).toFixed(2)
                      : (+(
                        getCart?.productPriceTotal -
                        getCart?.productDiscountAmountTotal
                      )).toFixed(2)} */}
                  {/* ₹{ShowFinalAmmount()} */}

                  {walletBalenceCheck && getWalletAmount?.total_amount < getCart?.allTotalAmountWithoutShipping
                    ? `₹${(calculateFinalPrice().toFixed(2) - getWalletAmount?.total_amount).toFixed(2)}`
                    // `₹${(getCart?.allTotalAmountWithoutShipping - getWalletAmount?.total_amount).toFixed(2)}`
                    : walletBalenceCheck ? `₹0`
                      : `₹${calculateFinalPrice().toFixed(2)}`
                  }

                  {/* ₹{walletBalenceCheck
                    ? "0"
                    : currencyFormatter.format(calculateFinalPrice(), { code: '' })} */}
                </span>
                {/* <span>
                  ₹{getCoupon?.couponMetaData?.general?.amount ?
                    getCoupon?.couponMetaData?.general?.type === "parsentage" ?
                      getCart?.shippingTotal ?
                        ((getCart?.productDiscountAmountTotal - (getCart?.productDiscountAmountTotal * +(getCoupon?.couponMetaData?.general?.amount) / 100)) + getCart?.shippingTotal).toFixed(2)
                        :
                        (getCart?.productDiscountAmountTotal - (getCart?.productDiscountAmountTotal * +(getCoupon?.couponMetaData?.general?.amount) / 100)).toFixed(2)
                      :
                      getCart?.shippingTotal ?
                        ((getCart?.productDiscountAmountTotal - +(getCoupon?.couponMetaData?.general?.amount)) + getCart?.shippingTotal).toFixed(2)
                        :
                        (getCart?.productDiscountAmountTotal - +(getCoupon?.couponMetaData?.general?.amount)).toFixed(2)
                    :
                    getCart?.shippingTotal ?
                      (getCart?.productDiscountAmountTotal + getCart?.shippingTotal).toFixed(2)
                      :
                      (+getCart?.productDiscountAmountTotal).toFixed(2)}
                </span> */}
              </p>
            ) : (
              <p className="m-0 checkout_payments">
                <span>Total</span>
                <span style={{ color: "#008000", fontWeight: "bold" }}>
                  {walletBalenceCheck && getWalletAmount?.total_amount < getCart?.allTotalAmountWithoutShipping
                    ? `₹${(calculateFinalPrice().toFixed(2) - getWalletAmount?.total_amount).toFixed(2)}`
                    // `₹${(getCart?.allTotalAmountWithoutShipping - getWalletAmount?.total_amount).toFixed(2)}`
                    : walletBalenceCheck ? `₹0`
                      : `₹${calculateFinalPrice().toFixed(2)}`
                  }
                  {/* ₹{currencyFormatter.format(calculateFinalPrice(), { code: '' })} */}
                  {/* {getCoupon?.couponMetaData?.general?.amount
                    ? getCoupon?.couponMetaData?.general?.type === "parsentage"
                      ? getCart?.shippingTotal
                        ? (
                          getCart?.productPriceTotal -
                          (getCart?.productPriceTotal *
                            +getCoupon?.couponMetaData?.general?.amount) /
                          100 +
                          getCart?.shippingTotal
                        ).toFixed(2)
                        : (
                          getCart?.productPriceTotal -
                          (getCart?.productPriceTotal *
                            +getCoupon?.couponMetaData?.general?.amount) /
                          100
                        ).toFixed(2)
                      : getCart?.shippingTotal
                        ? (
                          getCart?.productPriceTotal -
                          +getCoupon?.couponMetaData?.general?.amount +
                          getCart?.shippingTotal
                        ).toFixed(2)
                        : (
                          getCart?.productPriceTotal -
                          +getCoupon?.couponMetaData?.general?.amount
                        ).toFixed(2)
                    : getCart?.shippingTotal
                      ? (
                        getCart?.productPriceTotal + getCart?.shippingTotal
                      ).toFixed(2)
                      : (+getCart?.productPriceTotal).toFixed(2)} */}
                </span>
              </p>
            )}
            {/* {getCart?.productPriceTotal?.toFixed(2) - ShowFinalAmmount() <=
              0 ? null : (
              <hr className="mt-3 mb-2" />
            )}
            {getCart?.productPriceTotal?.toFixed(2) - ShowFinalAmmount() <= 0 ? null : (<p className="sec1-para col-7 w-full" style={{ color: "green", fontWeight: 600, fontSize: "15px" }}>You will save ₹ {currencyFormatter.format(totalDisCountAmountc, { code: '' })} on this order</p>)} */}
            <hr className="mt-3 mb-2" />

            {getCart?.productDiscountAmountTotal === 0 ? null :
              <p className='sec1-para col-12' style={{ color: "green", fontWeight: 600, fontSize: "15px" }}>You will save
                <span className="mx-1" style={{ color: "#e4509d" }}>
                  {currencyFormatter.format(totalDisCountAmountc, { code: 'INR' })}
                </span>
                on this order</p>}
            <p
              className="sec1-para col-7 w-full"
              style={{ fontSize: "15px" }}
            >
              {highlightedMessage}
            </p>
          </div>
        </div>
      </div>

      <Dialog
        open={openLastModal?.id}
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
                {openLastModal?.p_name}
              </span>{" "}
              from your cart?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ fontSize: "14px", fontWeight: "500", color: "red" }}
              onClick={() => setOpenLastModal({})}
            >
              cancel
            </Button>
            <Button
              style={{ fontSize: "14px", fontWeight: "500", color: "green" }}
              onClick={() => {
                doCountInCart({
                  plus: openLastModal?.plus,
                  minus: openLastModal?.minus,
                  id: openLastModal?.id,
                });
                setOpenLastModal({});
              }}
            >
              yes
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      {displayRazorpay && (
        <RenderRazorpay
          amount={orderDetails.amount}
          currency={orderDetails.currency}
          razorpayOrderId={orderDetails.razorpayOrderId}
          orderId={orderDetails.orderId}
          keyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}
          keySecret={process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET}
        />
      )}
    </div>
  );
};

export default OrderPage;

function setPaymentMethod(selectedOption: string) {
  throw new Error("Function not implemented.");
}
