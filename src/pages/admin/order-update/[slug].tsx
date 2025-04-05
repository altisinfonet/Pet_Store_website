import moment from 'moment'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import SelectField from '../../../Admin/components/SelectField'
import SimpleCard from '../../../Admin/components/SimpleCard'
import { alertClasses, Box, Button, Dialog, DialogContent, FormControl, InputLabel, MenuItem, Modal, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material'
import Image from 'next/image'
import product from "../../../../public/assets/images/product.png"
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PinkPawsbutton from '../../../Admin/components/PinkPawsbutton'
import { emailRegax, isEmptyObject, phoneRegax } from '../../../util/_common'
import DTDCTracking from '../../../Admin/components/DTDCTracking'
import getUrlWithKey from '../../../Admin/util/_apiUrl'
// import { _post } from '../../../../services'
import { _ERROR, _SUCCESS } from '../../../util/_reactToast'
import RightSideModal from '../../../Admin/components/RightSideModal'
import TextAreaField from '../../../Admin/components/TextAreaField'
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
// import OrdersNote from '../orderNote'
import OrderNote from '../../../Admin/containers/orders/orderNote';
import axios from 'axios'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { _get, _post, _put } from '../../../services'
import { FaEdit, FaPlus } from "react-icons/fa";
import { useRead, useUpdate } from '../../../hooks'
import { useRouter } from 'next/router'
import OrdersNote from '../../../Admin/containers/orders/orderNote'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify'
import Loader from '../../../components/CustomLoader'
import AdminLoader from '../../../Admin/components/AdminLoader'
import AdminDTDCTracking from '../../../Admin/components/AdminNewTrackOrder'

interface FormFields {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
}

interface OrderItem {
  id: string;
  name: string;
  sku: string;
  slug: string;
  variation_id: string;
  quantity: number;
  batch: string | null;
  image: {
    id: string;
    src: string;
    name: string;
    main_image: boolean;
  };
  price: string;
  total_product_amount: string;
}

interface OrderStatus {
  order_status: {
    id: string;
    title: string;
  };
  billing: string;
  shipping: string;
  shipping_total: string;
  net_total: string;
  total_sales: string;
  payment_method: string;
  date_created: string;
  coupon: {
    code: string;
    type: string;
    amount: string;
    discountAmount: string;
  };
}

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  avatar_url: string | null;
  deleted_at: boolean;
  date_created: string;
  status: {
    id: string;
    title: string;
  };
}

interface OrderData {
  id: string;
  order_items: OrderItem[];
  order_status: OrderStatus;
  order_notes: {
    id: string;
    order_id: string;
    note: string;
    user_id: string | null;
    created_at: string;
  }[];
  order_wallet: null | any;
  user: User;
  dtdc_traking: {
    statusCode: number;
  };
  awb: string | null;
  pdf_generate_invoice_disabled: boolean;
}

interface UseReadResponse {
  sendData: { data: OrderData };
  rawData: any;
  loading: boolean;
  error: any;
}

interface StoreLocator {
  id: string;
  title: string;
  slug: string;
  site_code: number | null;
  latitude: number;
  longitude: number;
  address_1: string;
  address_2: string;
}
interface AwbServices {
  id: string;
  title: string;
}

const OrdersEdit = () => {
  const defaultFieldSet = {
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    phone: '',
    email: '',
  }

  const router = useRouter()
  const { slug, page } = router?.query
  const { get_tracking, add_batch, send_info } = getUrlWithKey("dtdc");
  const { get_order_list, get_order_state, update_order, get_awb_number, add_awb_number } = getUrlWithKey("orders");
  const [orderIDM, setOrderIdM] = useState();
  const [getOrderListById, setGetOrderListById] = useState<string>()
  const [getOrderStateUrl, setGetOrderStateUrl]: any = useState()
  const [updateStatus, setUpdateStatus]: any = useState()
  const [updatedOrderStatus, setUpdatedOrderStatus]: any = useState()
  const [track, setTrack] = useState(false)
  const [allStoreLocatorDetails, SetAllStoreLocatorDetails] = useState<StoreLocator[]>([]);
  const [selectedStoreLocator, setSelectedStoreLocator] = useState<string>('1');
  const [selectedStoreLocatorObject, setSelectedStoreLocatorObject] = useState<any>('');
  const [createInvoice, setCreateInvoice] = useState<boolean>(false)
  const [awbServiceType, setAwbServiceType] = useState<AwbServices[]>([])
  const [selectedAwb, setSelectedAwb] = useState<string>('B2C SMART EXPRESS');
  const [awbDisabled, setAwbDisabled] = useState([])
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const { sendData: orderData }: { sendData: any } = useRead({
    selectMethod: "get",
    url: `${get_order_list}/${slug}`
  });
  // const orderData: OrderData = rawOrderData?.data as OrderData;

  // let { sendData: orderData }: { sendData: OrderData } = useRead({ selectMethod: "get", url: getOrderListById })
  const { sendData: getOrderState } = useRead({ selectMethod: "get", url: getOrderStateUrl })
  // const { sendData: getAwbServices } = useRead({ selectMethod: "get", url: get_awb_number })

  console.log('orderDataid', orderData, updatedOrderStatus)
  useEffect(() => {
    setGetOrderStateUrl(get_order_state)
  }, [])

  useEffect(() => {
    if (slug) {
      setGetOrderListById(`${get_order_list}/${slug}`);
    }
  }, [slug]);

  useEffect(() => {
    if (orderData?.id) {
      setOrderDetails(orderData);
      setGetOrderListById("")
    }
  }, [orderData])

  const [status, setStatus]: any = useState()
  const [confirmStatus, setConfirmStatus]: any = useState(false);
  const [confirmSendEmailStatus, setConfirmSendEmailStatus]: any = useState(false);
  const [sendEmailType, setSendEmailType]: any = useState("");
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [addressHeadingType, setAddressHeadingType] = useState("");
  const [fields, setFields] = useState<FormFields>(defaultFieldSet);
  const [fieldsErrors, setFieldsErrors] = useState<FormFields>(defaultFieldSet);
  const [handleSection, setHandleSection]: any = useState(true)

  const [billingAddress, setBillingAddress] = useState<any>({});
  const [shipingAddress, setShipingAddress] = useState<any>({});
  const [updateAddress, setUpdateAddress] = useState(false);
  const [orderNotes, setOrderNotes] = useState({});
  const [hsnArray, setHsnArray]: any = useState([])
  const [hsn, setHsn] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false);


  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [batchData, setBatchData] = useState<string[]>([]);
  const [orderId, setOrderId] = useState(null);
  const [isSetBatch, setIsSetBatch] = useState(false);
  const isApiInProgress = useRef(false);
  console.log('adress:: ', shipingAddress, billingAddress);

  const borderBlack = "px-2 py-1 border border-solid border-black rounded w-fit "
  // let billingAddress = orderData?.order_status?.billing ? JSON.parse(orderData?.order_status?.billing) : {};
  const shipingAddressCheck = orderData?.order_status?.shipping ? JSON.parse(orderData?.order_status?.shipping) : {};
  // let shipingAddress = isEmptyObject(shipingAddressCheck) ? (orderData?.order_status?.billing ? JSON.parse(orderData?.order_status?.billing) : {}) : JSON.parse(orderData?.order_status?.shipping);

  const { order_email_send, order_address_update, order_get_pdf, update_product_hsn } = getUrlWithKey("orders");
  const { hsn_search } = getUrlWithKey("products");


  console.log(isEmptyObject(shipingAddressCheck), "ddd")

  console.log(billingAddress, shipingAddress, "billingShipingAddress")


  useEffect(() => {
    if (updateAddress == false) {
      setBillingAddress(orderData?.order_status?.billing ? JSON.parse(orderData?.order_status?.billing) : {});
      setShipingAddress(isEmptyObject(shipingAddressCheck) ? (orderData?.order_status?.billing ? JSON.parse(orderData?.order_status?.billing) : {}) : JSON.parse(orderData?.order_status?.shipping))
    }
  }, [updateAddress, orderData?.order_status])

  useEffect(() => {
    setOrderNotes({ ...orderData });
  }, [orderData])


  useEffect(() => {
    if (updateStatus?.id) {
      // setUpdateOrder()
      setGetOrderStateUrl(get_order_state)
      if (orderDetails?.id) {
        refetchUpdateDetails(orderDetails?.id)
      }
      _SUCCESS("order update sucessfully")
    }
  }, [updateStatus])

  // const totalPrice = () => {
  //     let count = 0
  //     if (orderData?.order_items?.length) {
  //         orderData?.order_items.map((v: any) => { count += +(v?.order_product_lookup?.shipping_amount) })
  //     }
  //     return count
  // }


  const onStatusChange = (e: any) => {
    console.log(orderData, "h6gh56dfg6fg")
    setStatus({ status: e.target.value })
  }

  const refetchUpdateDetails = (orderId: any) => {
    console.log("orderId: ", orderId)
    if (orderId) {
      // setOrderDetails(null);
      setGetOrderListById(`${get_order_list}/${orderId}`)
    }
  }
  const [hsnStatus, setHsnStatus]: any = useState({})
  console.log(hsnStatus, "sdddf5dshsnStatus")
  const onStatusChangeHsn = async (e: any, id: any) => {
    const newStatus = e.target.value;
    setHsnStatus((prevStatus: any) => ({
      ...prevStatus,
      [id]: newStatus,
    }));
    // return
    if (newStatus && id) {
      try {
        const { data } = await _post(update_product_hsn, { id: id, hsn_id: newStatus })
        if (data?.success) {
          refetchUpdateDetails(slug)
          _SUCCESS("Product HSN Update is Successful")
          fetchOrderData()
        }
      } catch (error) {
        console.log(error, "__error")
      }
    }
  }

  const handleRefundClick = () => {
    const filteredData = getOrderState.filter((item: { title: string }) => item.title === 'refunded');
    console.log('refund me!', filteredData.length)
    if (filteredData.length && filteredData[0]?.title === 'refunded') {
      setStatus({ status: filteredData[0]?.title });
      setConfirmStatus(true);
    }
  }


  // const handleChangeOrderStatus = async () => {
  //   if (isApiInProgress.current) return;
  //   // sendStatus({ status: status?.status, id: slug });
  //   isApiInProgress.current = true;
  //   try {
  //     const { data } = await _post(`${update_order}/${slug}`, {
  //       id: slug,
  //       status: status?.status,
  //     })
  //     if (data?.success === true) {
  //       if ((status?.status === "cancelled" || status?.status === "cancelled without refund") && orderData?.genesys_invoice_generated === true) {
  //         sendInformation("RETURN")
  //       }
  //       submitSendOrderEmail(status?.status)
  //       console.log(data?.data, data, "dgh5d56f")
  //       setConfirmStatus(false);
  //       // setGetOrderListById(`${get_order_list}/${slug}`);
  //       fetchOrderData()
  //       console.log('getOrder: ', getOrderState)
  //       // refetchUpdateDetails(+(orderData?.id))
  //     }
  //   } catch (error) {
  //     _ERROR(error?.response?.data?.massage || "Something went wrong!")
  //     console.log("error: ", error);
  //   } finally {
  //     isApiInProgress.current = false; // Reset the flag after the API call completes
  //   }
  // }

  useEffect(() => {
    if (status?.status) {
      setConfirmStatus(true)
    }
  }, [status?.status])

  const onCloseDilog = () => {
    console.log('handleSection: ', null)
    setConfirmSendEmailStatus(false);
    setConfirmStatus(false)
    setStatus()
    setHandleSection(false)
  }

  const onSendOrderEmailChange = (e: any) => {
    setSendEmailType(e?.target?.value);
    setConfirmSendEmailStatus(true)
    console.log('e: ', e?.target?.value);
  }

  const onOrderSendStatusToEmail = () => {
    setConfirmSendEmailStatus(true)
  }

  const handlePdf = async (pdfType: string) => {
    setIsLoading(true);
    try {
      const data = {
        order_id: +(orderData?.id),
        pdf_type: pdfType,
      };

      const res = await _post(`${order_get_pdf}`, data, { responseType: 'blob' });

      // if (res?.data && res?.data?.success) {
      console.log("pdfData: ", res?.data);

      // Create a Blob from the response data
      const blob = new Blob([res?.data], { type: 'application/pdf' });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(url);

      // setSendEmailType("");
      // _SUCCESS("Order email is sent successfully")
      // }
      // axios.get('http://localhost:8080/api/v1/order/get-pdf', {
      //     responseType: 'blob' // specify response type as blob
      // })
      //     .then(response => {
      //         console.log('pdf:: ', response)
      //         // Create a Blob from the response data
      //         const blob = new Blob([response.data], { type: 'application/pdf' });

      //         // Create a URL for the Blob
      //         const url = window.URL.createObjectURL(blob);

      //         // Open the PDF in a new tab
      //         window.open(url);
      //     })
      //     .catch(error => {
      //         console.error('Error fetching PDF:', error);
      //     });
    } catch (error: any) {
      console.log('error: ', error)
    } finally {
      setIsLoading(false);
    }
  }


  const submitSendOrderEmail = async (status: any) => {
    if (isApiInProgress.current) return;

    isApiInProgress.current = true;
    try {
      // if (sendEmailType !== "") {
      const data = {
        order_id: +(orderData?.id),
        email_type: status ? status : updatedOrderStatus?.order_status?.order_status?.title,
      };

      console.log('orderEmailResponse: ')
      const res = await _post(`${order_email_send}`, data);

      if (res?.data && res?.data?.success) {
        // setSendEmailType("");
        _SUCCESS("Order email is sent successfully")
        setOrderDetails(orderData)
      }
      console.log('orderEmailResponse: ', res);
      // }
    } catch (error) {
      console.log("error: ", error);
    } finally {
      isApiInProgress.current = false; // Reset the flag once the API call is complete
    }
  }

  const editOrderAddress = (address_type: string, addressDetails: any) => {
    console.log("addressTypell: ", address_type, addressDetails);
    setUpdateAddress(true);
    setFields(defaultFieldSet);
    setFieldsErrors(defaultFieldSet);

    setAddressHeadingType(address_type);

    if (!isEmptyObject(addressDetails)) {
      setFields({
        first_name: addressDetails?.first_name ? addressDetails?.first_name : '',
        last_name: addressDetails?.last_name ? addressDetails?.last_name : "",
        address_1: addressDetails?.address_1 ? addressDetails?.address_1 : "",
        address_2: addressDetails?.address_2 ? addressDetails?.address_2 : "",
        city: addressDetails?.city ? addressDetails?.city : "",
        state: addressDetails?.state ? addressDetails?.state : "",
        postcode: addressDetails?.postcode ? addressDetails?.postcode : "",
        country: addressDetails?.country ? addressDetails?.country : "",
        phone: addressDetails?.phone ? addressDetails?.phone : "",
        email: addressDetails?.email ? addressDetails?.email : "",
      })
    }

    setOpenAddressModal(true);
    console.log('open: ', openAddressModal)
  }

  const clear = () => {
    // setAddTUrl("");
    // setUpdateTUrl("");
    // setGetByIdUrl("");
    // setFields(fields_dataSet);
    setFields(defaultFieldSet);
    setFieldsErrors(defaultFieldSet);
    setOpenAddressModal(false);
    setAddressHeadingType("")
    setHandleSection(false);
  }
  console.log(orderData, "orderData")
  console.log(orderData?.order_status?.order_status?.id, "statusstatus")
  console.log(getOrderState, "getOrderState");



  // Function to handle onChange event of text fields
  const handelOnChange = (e: any) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });

    let runTimeValidationObject: any = {};

    if ("phone" === name) {
      runTimeValidationObject[name] = {
        v: value,
        regax: phoneRegax,
        m: "Invalid phone number"
      }
    }

    if ("email" === name) {
      runTimeValidationObject[name] = {
        v: value,
        regax: emailRegax,
        m: "Invalid email address"
      }
    }

    if (isEmptyObject(runTimeValidationObject)) {
      // Clear the error message when user starts typing again
      setFieldsErrors({ ...fieldsErrors, [name]: '' });
      // clearValidation(name);
    } else {
      runTimeValidationField(runTimeValidationObject);
    }
  };

  const runTimeValidationField = (dataSet: { [x: string]: any }) => {
    console.log("args", dataSet)
    if (!isEmptyObject(dataSet)) {
      for (const key in dataSet) {
        const value = dataSet[key]?.v;
        const regax = dataSet[key]?.regax;
        const message = dataSet[key]?.m;
        console.log("args regax(value)", regax(value))
        if (!regax(value)) {
          setFieldsErrors(pre => ({
            ...pre,
            [key]: message
          }));

        } else {
          setFieldsErrors(pre => ({
            ...pre,
            [key]: ""
          }));
        }
      }
    }
  }

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form fields
      let errors: any = {};
      Object.keys(fields).forEach((fieldName: any) => {
        console.log("fieldName: ", fields, fieldName)
        if (fieldName != "address_2") {
          if (fields[fieldName as keyof FormFields] == '' || fields[fieldName as keyof FormFields] == undefined) {
            errors[fieldName as keyof FormFields] = `${fieldName.replace('_', ' ')} is required`;
          }
        }
      });

      // If there are errors, update fieldsErrors state
      if (Object.keys(errors).length > 0) {
        console.log('er: ', errors)
        setFieldsErrors(errors);

        Object.keys(fields).forEach((fieldName: any) => {

          let runTimeValidationObject: any = {};

          if ("phone" === fieldName) {
            runTimeValidationObject[fieldName] = {
              v: fields[fieldName as keyof FormFields],
              regax: phoneRegax,
              m: "Invalid phone number"
            }
          }

          if ("email" === fieldName) {
            runTimeValidationObject[fieldName] = {
              v: fields[fieldName as keyof FormFields],
              regax: emailRegax,
              m: "Invalid email address"
            }
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
        console.log('d: ', "ee")
        return;
      }



      // If no errors, proceed with form submission logic
      // Add your actual form submission logic here
      if (orderData && orderData?.id) {
        console.log('d: ', orderData?.id)
        const data = {
          order_id: +(orderData?.id),
          address: fields,
        };

        const res = await _post(`${order_address_update}/${addressHeadingType}`, data);

        if (res?.data && res?.data?.success) {
          setUpdateAddress(true);
          if (addressHeadingType == 'shipping') {
            console.log('res::::', fields, addressHeadingType, shipingAddress)
            setShipingAddress({ ...fields })
            // setUpdateAddress(false);
          }

          if (addressHeadingType == 'billing') {
            setBillingAddress({ ...fields });
          }

          _SUCCESS("Order Address is updated successfully");
          // if(addressHeadingType == 'shipping') {
          //     shipingAddress = { ...fields };
          // }

          // if(addressHeadingType == 'billing') {
          //     billingAddress = { ...fields };
          // }

          clear()
        }
        console.log('orderEmailResponse: ', res);
      }

      // Reset form fields after submission (optional)
      // setFields(defaultFieldSet);

      // console.log('Form submitted successfully', fields);
    } catch (error: any) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (orderData) {
      setOrderId(orderData?.id)
    } else {
      setOrderId(null)
    }
  }, [orderData])
  console.log(orderData, "dfg2fd56g65")
  const fetchOrderData = async () => {
    setIsLoading(true);
    try {
      const { data: orderData } = await axios.get(`${get_order_list}/${slug}`);

      const mappedItem = orderData?.data?.order_items
        ?.map((ele: any) => ele?.awb)
        ?.filter((awb: any) => awb !== null && awb !== undefined) || [];
      setAwbDisabled(mappedItem)
      console.log(orderData, orderData?.data?.order_items, mappedItem, mappedItem?.length, "35df41h564fd")
      setUpdatedOrderStatus(orderData?.data)
      const updatedItem = orderData?.data?.order_items?.find(
        (item: any) => item.id === selectedItem?.id
      );
      if (updatedItem) {
        const existingBatch = updatedItem.batch || '';
        setBatchData(
          existingBatch.split(', ').map((batch: string) => batch || '')
        );
        setIsSetBatch(true);
      }
      // else {
      //   setBatchData([]);
      // }
      console.log(updatedItem, batchData, orderData, "d56fgh6df3")
    } catch (error) {
      console.error("Error fetching order data", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleOpenModal = (item: any) => {
    setSelectedItem(item);
    const existingBatch = item.batch
      ? item.batch.split(', ')
      : Array(item.quantity).fill('');

    setBatchData(existingBatch);
    setOpenModal(true);
  };

  const isScrollable = selectedItem?.quantity > 4;
  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
    // setBatchData([]);
    // fetchOrderData()
  };

  // Handle input change for text input
  const handleInputChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    const updatedBatchData = [...batchData];
    updatedBatchData[index] = sanitizedValue;
    setBatchData(updatedBatchData);
  };

  // Handle Save Batch
  const handleSaveBatch = async () => {
    const isValid = batchData.every(value => value.trim() !== '');
    if (!isValid) {
      _ERROR("Please fill in all batch fields.");
      return;
    }
    setIsLoading(true);
    try {
      const data = {
        product_id: parseFloat(selectedItem?.id),
        variation_id: selectedItem?.variation_id ? parseFloat(selectedItem?.variation_id) : null,
        batch: batchData?.join(', '),
      };
      const res = await axios.post(`${add_batch}/${orderId}`, data);

      if (res && res?.data?.success) {
        _SUCCESS(res?.data?.message || "Batch added successfully.");
        // const { data: orderData } = await axios.get(`${get_order_list}/${orderId}`);
        // const updatedItem = orderData?.order_items?.find(
        //     (item: any) => item.id === selectedItem?.id
        // );
        // if (updatedItem) {
        //     const batchValue = updatedItem.batch || '';
        //     setBatchData(
        //         Array(updatedItem.quantity)
        //             .fill(batchValue)
        //     );
        //     setIsSetBatch(true)
        // } else {
        //     setBatchData([]);
        // }
        // router.push('/admin/orders')
        window.location.reload()
        await fetchOrderData();
        // setOrderId(null);
        setSelectedItem(null);
        setOpenModal(false);
      } else {
        _ERROR(res?.data?.message || "Something went wrong!");
      }
    } catch (error) {
      _ERROR("Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getAllStoreLocator() {
      try {
        const res = await _put(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-store-location`, {
          "page": 1,
          "rowsPerPage": 100000000000
        });
        // Assuming the response is in the format res.data.data
        SetAllStoreLocatorDetails(res?.data?.data || []); // setting the response data
        console.log(res?.data?.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getAllStoreLocator();
  }, []);

  useEffect(() => {
    async function getAllAwbServicesType() {
      try {
        const res = await _get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-awb-service-type`);
        // Assuming the response is in the format res.data.data
        setAwbServiceType(res?.data?.data || []); // setting the response data
        console.log(res?.data?.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getAllAwbServicesType();
  }, []);

  useEffect(() => {
    if (allStoreLocatorDetails.length > 0) {
      let defaultStore;

      // Check if order_status has a store_location set
      if (orderData?.order_status?.store_location) {
        defaultStore = allStoreLocatorDetails.find(store => store.id === orderData.order_status.store_location.id);
      }
      // else {
      //   defaultStore = allStoreLocatorDetails.find(store => store.title === "Saltlake Branch");
      // }

      if (defaultStore) {
        setSelectedStoreLocator(defaultStore.id);
        updateStoreDetails(defaultStore?.id)
      }
    }
  }, [allStoreLocatorDetails, orderData]);

  useEffect(() => {
    updateStoreDetails(selectedStoreLocator)
  }, [])


  const handleAwbServiceChange = async (event: any) => {
    const newValue = event.target.value;
    setSelectedAwb(newValue);
    // await updateAwbServices(newValue);
    console.log(event.target.value, "3fd14g651f03")
  };

  const handleStoreLocatorChange = async (event: any) => {
    const newValue = event.target.value;
    setSelectedStoreLocator(newValue);
    await updateStoreDetails(newValue);
    console.log(event.target.value, "3fd14g651f03")
  };

  // useEffect(() => {
  //   if (slug) {
  //     console.log(slug, "df354g6fd3")
  //     const updateStoreDetailsDefault = async () => {
  //       const payloda = {
  //         "order_id": slug,
  //         "store_location_id": "1"
  //       }

  //       console.log(payloda)
  //       try {
  //         const res = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/add-site-code`, payloda)
  //         console.log(res)
  //       } catch (error) {
  //         console.log(error.message);
  //       }
  //     }

  //     updateStoreDetailsDefault()
  //   }
  // }, [slug])

  useEffect(() => {
    if (orderData) {
      // console.log(orderData)
      setSelectedStoreLocatorObject(orderData?.order_status?.store_location);
      setOrderId(orderData?.id);
    } else {
      // setStoreLocatorDetails(""); // Set to empty string when no order data is available
      setOrderId(null);
    }
  }, [orderData])


  const updateStoreDetails = async (storeLocationId: string) => {
    const payloda = {
      "order_id": slug,
      "store_location_id": storeLocationId
    }

    console.log(payloda)

    try {
      const res = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/add-site-code`, payloda)
      // _SUCCESS("Store update successfully")
      // ModalHandleClose();
      console.log(res)
    } catch (error) {
      console.log(error.message);
    }
  }

  // const updateAwbServices = async (awbId: string) => {
  const updateAwbServices = async () => {
    const payloda = {
      "order_id": +orderId,
      // "service_type_id": awbId selectedAwb
      "service_type_id": selectedAwb
    }

    console.log(payloda)
    setIsLoading(true);
    try {
      // /add-site-code
      const res = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-awb-number`, payloda)
      _SUCCESS("AWB number added successfully.")
      if (res?.data?.success) {
        _SUCCESS("AWB number added successfully.");
        // const updatedOrderData = await fetchOrderData();
        const response = await _get(`${get_order_list}/${slug}`)
        console.log(response?.data?.data, "5f4g55df31322")
        setOrderDetails(response?.data?.data);
        const newAwbNumbers = res?.data?.data?.awbNumbers || [];
        setAwbDisabled(newAwbNumbers);
        // window.location.reload()
        fetchOrderData()
        console.log(newAwbNumbers, newAwbNumbers.length, "df54gd35");
      } else {
        _ERROR("Failed to add AWB number.");
      }
      // fetchOrderData()
      // setAwbDisabled(res?.data?.data?.awbNumbers)
      console.log(res?.data?.data?.awbNumbers, res?.data?.data?.awbNumbers?.length, "df54gd35")
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }


  // const sendInformation = async (value: any) => {

  //   const data = {
  //     order_id: +orderData?.id,
  //     invoiceType: value
  //   }
  //   try {
  //     const res = await axios.post(`${send_info}`, data);

  //     if (res && res?.data) {
  //       _SUCCESS(res?.data?.data?.message || "Batch data sent successfully.");
  //       setCreateInvoice(res?.data?.data?.success)
  //       // window.location.reload()
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.massage?.message || "Something went wrong!")
  //   } 
  // }

  const sendInformation = useCallback(async (value: any) => {
    const isHsnID = updatedOrderStatus?.order_items && updatedOrderStatus?.order_items?.map((ele: any) => ele?.hsn_id)
    console.log(updatedOrderStatus, "dfgfdg5456")
    const hasNullHsnId = isHsnID?.some((hsnId: any) => hsnId === null);
    if (hasNullHsnId) {
      toast.error("Each product must have a valid HSN ID. Please ensure all products have an HSN ID before proceeding!", {
        autoClose: 5000,
      })
      return false;
    }
    if (isRequestInProgress) return;

    // setIsLoading(true);
    setIsRequestInProgress(true);
    const data = {
      order_id: +orderData?.id,
      invoiceType: value
    }
    try {
      const res = await axios.post(`${send_info}`, data);

      if (res && res?.data) {
        _SUCCESS(res?.data?.data?.message || "Batch data sent successfully.");
        setCreateInvoice(res?.data?.data?.success)

        // setAwbDisabled()
        window?.location?.reload()
        fetchOrderData()
      }
    } catch (error) {
      toast.error(error?.response?.data?.massage || "Something went wrong!")
    } finally {
      setIsRequestInProgress(false);
      setIsLoading(false);
    }
  }, [isRequestInProgress, updatedOrderStatus, orderData?.id, send_info]);

  useEffect(() => {
    if (slug) {
      fetchOrderData();
    }
  }, [slug])

  const flexColG1 = "flex flex-col gap-1"
  const txtFieldCls = "!w-full p-1 border border-solid border-[#c4c4c4] rounded"

  const [orderDetails, setOrderDetails]: any = useState()

  useEffect(() => {
    setOrderDetails(orderData)
  }, [orderData]);

  const disabledStatusOption = () => {
    console.log("cancelled");
    if (status?.status === "refunded" || orderData?.order_status?.order_status?.title === "refunded") {
      return status?.status === "refunded" ? true : (orderData?.order_status?.order_status?.title === "refunded") ? true : false
    }

    // if (status?.status === "refunded" || orderData?.order_status?.order_status?.title === "cancelled" || status?.status === "cancelled without refund" || orderData?.order_status?.order_status?.title === "cancelled without refund" ) {
    //   console.log("cancelled 123");
    //   return status?.status === "cancelled" || status?.status === "cancelled without refund" ? true : (orderData?.order_status?.order_status?.title === "cancelled" || orderData?.order_status?.order_status?.title === "cancelled without refund") ? true : false
    // }

    if (
      status?.status === "refunded" ||
      orderData?.order_status?.order_status?.title === "cancelled" ||
      status?.status === "cancelled without refund" ||
      orderData?.order_status?.order_status?.title === "cancelled without refund"
    ) {
      const isCancelled = status?.status === "cancelled" || status?.status === "cancelled without refund" ||
        orderData?.order_status?.order_status?.title === "cancelled" ||
        orderData?.order_status?.order_status?.title === "cancelled without refund";

      return isCancelled;
    }
  }

  useEffect(() => {
    const getHsn = async () => {
      try {
        const { data } = await _get(hsn_search)
        if (data?.success) {
          setHsnArray(data?.data)
        }
      } catch (error) {
        console.log(error, "__error")
      }
    }

    getHsn();
  }, [])


  const handleChangeOrderStatus = async () => {
    if (isApiInProgress.current) return;
    // sendStatus({ status: status?.status, id: slug });
    isApiInProgress.current = true;
    try {
      const { data } = await _post(`${update_order}/${slug}`, {
        id: slug,
        status: status?.status,
      })
      if (data?.success === true) {
        if ((status?.status === "cancelled" || status?.status === "cancelled without refund") && orderData?.genesys_invoice_generated === true) {
          sendInformation("RETURN")
        }
        submitSendOrderEmail(status?.status)
        console.log(data?.data, data, "dgh5d56f")
        setConfirmStatus(false);
        // setGetOrderListById(`${get_order_list}/${slug}`);
        fetchOrderData()
        console.log('getOrder: ', getOrderState)
        // refetchUpdateDetails(+(orderData?.id))
      }
    } catch (error) {
      _ERROR(error?.response?.data?.massage || "Something went wrong!")
      console.log("error: ", error);
    } finally {
      isApiInProgress.current = false; // Reset the flag after the API call completes
    }
  }
  console.log(hsnArray, "hsnArray")

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <AdminLoader />
        </div>

      ) : (
        <div className='flex flex-col gap-4'>
          {/* nned to add {payment_method_title}{transaction_id}{customer_ip_address} */}
          {track !== true ?
            <>
              <div className="tm-w-full w-100 d-flex justify-content-between ">
                <Button
                  variant="outlined"
                  startIcon={<KeyboardBackspaceIcon />}
                  onClick={() => router.push(`/admin/orders?page=${page}`)}
                  sx={{
                    borderColor: '#4B5563',
                    color: '#000',
                    fontWeight: "bold",
                    '&:hover': {
                      color: '#fff',
                      borderColor: "#9CA3AF",
                      backgroundColor: '#9CA3AF',
                    },
                  }}
                >
                  Back
                </Button>
              </div>
              <SimpleCard heading={<h1 style={{ fontWeight: "600", fontSize: "20px" }}>Order #{orderData?.id} details</h1>}>
                <p className='pb-2.5'>{`Payment via ${orderData && orderData?.order_status && orderData?.order_status?.payment_method}. Ordered on ${moment(orderData && orderData?.order_status && orderData?.order_status?.date_created
                ).format('MMMM Do YYYY, h:mm:ss a')}.`}</p>
                <div className='flex items-start justify-between gap-4'>
                  <div className={`w-4/12`}>
                    <p className='font-bold'>General</p>
                    <div className='w-full flex flex-col gap-2'>
                      <div className='flex flex-col items-start gap-1'>
                        <span className='font-medium'>Date created:</span>
                        <span className='flex items-center gap-2'>
                          <span className={`${borderBlack}`}>{moment(orderData?.user?.date_created).format("YYYY-MM-DD")}</span>
                          <span className={`${borderBlack}`}>{moment(orderData?.user?.date_created).format("HH")}</span>:
                          <span className={`${borderBlack}`}>{moment(orderData?.user?.date_created).format("MM")}</span>
                        </span>
                      </div>

                      <div className='flex flex-col items-start gap-1 w-full'>
                        <span className='font-medium'>Status:</span>
                        <span className='flex items-center gap-2 w-full'>
                          <Select
                            value={status?.status ? status?.status : orderData?.order_status?.order_status?.title ? orderData?.order_status?.order_status?.title : null}
                            disabled={updatedOrderStatus?.order_status?.order_status?.title === "cancelled"}
                            // ?.order_status?.order_status?.title ? disabledStatusOption() : null}
                            onChange={(e: any) => onStatusChange(e)}
                            fullWidth
                            className='!px-4 !py-1 selectFieldCls'
                          >
                            {getOrderState?.length ? getOrderState.map((i: any, e: number) => <MenuItem key={e} value={i?.title}>{i?.title}</MenuItem>) : null}
                          </Select>
                          {/* <SelectField selectFieldRootCls='w-full ' handleChange={() => { }} menuItemArray={getOrderState} /> */}
                        </span>
                      </div>

                      <div className='flex flex-col items-start gap-1'>
                        <span className='font-medium'>Customer:</span>
                        <span className='flex items-center gap-2'>
                          <span className={`${borderBlack}`}>{orderData?.user?.first_name}{orderData?.user?.last_name} (#{orderData?.user?.id} - {orderData?.user?.email})</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className='font-bold flex items-center justify-between'>
                      <span>Billing</span>
                      {addressHeadingType !== "billing" && <EditIcon onClick={() => editOrderAddress("billing", billingAddress)} className='cursor-pointer !text-base' />}
                    </div>
                    <div className='w-full'>
                      <p className='w-1/2 mb-1'>
                        {billingAddress?.first_name} {billingAddress?.last_name}
                        <br />
                        {billingAddress?.city}
                        <br />
                        {billingAddress?.address_1}
                        {billingAddress?.postcode} {billingAddress?.state}
                      </p>
                      <p className='flex items-start gap-1'>
                        <span className='font-medium'>Email:</span>
                        <span className='flex items-center gap-2'>
                          <span>{billingAddress?.email || "--"}</span>
                        </span>
                      </p>
                      <p className='flex items-start gap-1'>
                        <span className='font-medium'>Phone:</span>
                        <span className='flex items-center gap-2'>
                          <span>{billingAddress?.phone || "--"}</span>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className='font-bold flex items-center justify-between'>
                      <span>Shipping</span>
                      {addressHeadingType !== "shipping" && <EditIcon onClick={() => editOrderAddress("shipping", shipingAddress)} className='cursor-pointer !text-base' />}
                    </div>
                    <div className='w-full'>
                      <p className='w-1/2 mb-1'>
                        {shipingAddress?.first_name} {shipingAddress?.last_name}
                        <br />
                        {shipingAddress?.city}
                        <br />
                        {shipingAddress?.address_1}
                        {shipingAddress?.postcode} {shipingAddress?.state}
                      </p>
                      <p className='flex items-start gap-1'>
                        <span className='font-medium'>Phone:</span>
                        <span className='flex items-center gap-2'>
                          <span>{shipingAddress?.phone || "--"}</span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* order shipping and billing address */}
                {
                  openAddressModal &&
                  <div className='p-4 shadow-ppa-6xl mt-4 rounded'>

                    <div className='flex items-center justify-between'>
                      <span className='text-base font-semibold'>{addressHeadingType === "billing" ? 'Update billing address' : 'Update shipping address'}</span>
                      <ClearIcon onClick={() => clear()} style={{ cursor: "pointer " }} />
                    </div>

                    <hr className='border-gray-400 my-2' />

                    <div className='flex w-[100%] flex-col gap-4'>
                      <div className='flex lg:flex-row flex-col items-center gap-4'>
                        <div className='flex w-full items-center gap-4'>
                          {/* First Name */}
                          <div className={`${flexColG1} w-full`}>
                            <p className='text-sm font-medium'>First name</p>
                            <div className={`${flexColG1}`}>
                              <input
                                type='text'
                                className={`${txtFieldCls}`}
                                placeholder='Enter First Name'
                                name='first_name'
                                value={fields.first_name}
                                onChange={handelOnChange}
                              />
                              {fieldsErrors.first_name && <span style={{ color: "red" }}>{fieldsErrors.first_name}</span>}
                            </div>
                          </div>

                          {/* Last Name */}
                          <div className={`${flexColG1} w-full`}>
                            <p className='text-sm font-medium'>Last Name</p>
                            <div className={`${flexColG1}`}>
                              <input
                                type='text'
                                className={`${txtFieldCls}`}
                                placeholder='Enter Last Name'
                                name='last_name'
                                value={fields.last_name}
                                onChange={handelOnChange}
                              />
                            </div>
                            {fieldsErrors.last_name && <span style={{ color: "red" }}>{fieldsErrors.last_name}</span>}
                          </div>
                        </div>
                        <div className='flex w-full items-center gap-4'>
                          {/* Phone no */}
                          <div className={`${flexColG1} w-full`}>
                            <p className='text-sm font-medium'>Phone no</p>
                            <div className={`${flexColG1}`}>
                              {/* <TextField className='!w-full p-1' placeholder='Enter Phone no' name='phone_no' handelState={handelOnChange} value={fields?.phone} /> */}
                              <input
                                type='text'
                                className={`${txtFieldCls}`}
                                placeholder='Enter Phone no'
                                name='phone'
                                value={fields?.phone}
                                onChange={handelOnChange}
                              />

                            </div>
                            <span style={{ color: "red" }}>{fieldsErrors?.phone}</span>
                          </div>

                          {/* email */}
                          <div className={`${flexColG1} w-full`}>
                            <p className='text-sm font-medium'>Email</p>
                            <div className={`${flexColG1}`}>
                              {/* <TextField className='!w-full p-1' placeholder='Enter Email' name='email' handelState={handelOnChange} value={fields?.email} /> */}
                              <input
                                type='text'
                                className={`${txtFieldCls}`}
                                placeholder='Enter Email'
                                name='email'
                                value={fields?.email}
                                onChange={handelOnChange}
                              />

                            </div>
                            <span style={{ color: "red" }}>{fieldsErrors?.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className='flex lg:flex-row flex-col items-center gap-4'>
                        <div className='flex w-full items-center gap-4'>
                          {/* City */}
                          <div className={`${flexColG1} w-full`}>
                            <p className='text-sm font-medium'>City</p>
                            <div className={`${flexColG1}`}>
                              {/* <TextField className='!w-full p-1' placeholder='Enter City' name='city' handelState={handelOnChange} value={fields?.city} /> */}
                              <input
                                type='text'
                                className={`${txtFieldCls}`}
                                placeholder='Enter City'
                                name='city'
                                value={fields?.city}
                                onChange={handelOnChange}
                              />
                            </div>
                            <span style={{ color: "red" }}>{fieldsErrors?.city}</span>
                          </div>

                          {/* State */}
                          <div className={`${flexColG1} w-full`}>
                            <p className='text-sm font-medium'>State</p>
                            <div className={`${flexColG1}`}>
                              {/* <TextField className='!w-full p-1' placeholder='Enter State' name='state' handelState={handelOnChange} value={fields?.state} /> */}
                              <input
                                type='text'
                                className={`${txtFieldCls}`}
                                placeholder='Enter State'
                                name='state'
                                value={fields?.state}
                                onChange={handelOnChange}
                              />
                            </div>
                            <span style={{ color: "red" }}>{fieldsErrors?.state}</span>
                          </div>
                        </div>

                        <div className='flex w-full items-center gap-4'>
                          {/* Zip_code */}
                          <div className={`${flexColG1} w-full`}>
                            <p className='text-sm font-medium'>Zip Code</p>
                            <div className={`${flexColG1}`}>
                              {/* <TextField className='!w-full p-1' placeholder='Enter Zip Code' name='zip_code' handelState={handelOnChange} value={fields?.postcode} /> */}
                              <input
                                type='text'
                                className={`${txtFieldCls}`}
                                placeholder='Enter Zip Code'
                                name='postcode'
                                value={fields?.postcode}
                                onChange={handelOnChange}
                              />

                            </div>
                            <span style={{ color: "red" }}>{fieldsErrors?.postcode}</span>
                          </div>

                          {/* Country */}
                          <div className={`${flexColG1} w-full`}>
                            <p className='text-sm font-medium'>Country</p>
                            <div className={`${flexColG1}`}>
                              {/* <TextField className='!w-full p-1' placeholder='Enter Country' name='country' handelState={handelOnChange} value={fields?.country} /> */}
                              <input
                                type='text'
                                className={`${txtFieldCls}`}
                                placeholder='Enter Country'
                                name='country'
                                value={fields?.country}
                                onChange={handelOnChange}
                              />
                            </div>
                            <span style={{ color: "red" }}>{fieldsErrors?.country}</span>
                          </div>
                        </div>
                      </div>

                      <div className='flex lg:flex-row flex-col items-center gap-4'>
                        {/* Address 1 */}
                        <div className={`${flexColG1} w-full`}>
                          <p className='text-sm font-medium'>Address 1</p>
                          <div className={`${flexColG1}`}>
                            <TextAreaField
                              className={`${txtFieldCls}`}
                              placeholder='Enter Address One'
                              name='address_1'
                              value={fields.address_1}
                              handelState={handelOnChange}
                            />
                          </div>
                          {fieldsErrors.address_1 && <span style={{ color: "red" }}>{fieldsErrors.address_1}</span>}
                        </div>

                        {/* Address 2 */}
                        <div className={`${flexColG1} w-full`}>
                          <p className='text-sm font-medium'>Address 2</p>
                          <div className={`${flexColG1}`}>
                            <TextAreaField
                              className={`${txtFieldCls}`}
                              placeholder='Enter Address Two'
                              name='address_2'
                              handelState={handelOnChange}
                              value={fields?.address_2}
                            />
                          </div>
                          {fieldsErrors.address_2 && <span style={{ color: "red" }}>{fieldsErrors.address_2}</span>}
                        </div>
                      </div>

                      <div className='flex items-center justify-end'>
                        <PinkPawsbutton
                          variant={"solid"}
                          name={addressHeadingType === "billing" ? 'Update Billing Address' : 'Update Shipping Address'}
                          icon={""}
                          handleClick={handleSubmit}
                          pinkPawsButtonExtraCls={""}
                          style={{}}
                          disabled={false}
                          title={""}
                        />
                      </div>
                    </div>
                  </div>
                }

              </SimpleCard >

              {/* <div className='flex lg:flex-row flex-col gap-4'> */}
              <div className='relative border border-black'>


                {/* <SimpleCard className='w-full' headingClassName='h-10 px-4 py-2' heading={ */}

                {/* //  }>  */}
                {orderData?.order_items?.length ?
                  <div>
                    <Table>
                      {/* Table Head */}
                      <TableHead className="bg-gray-300">
                        <TableRow>
                          <TableCell className="p-2 w-[40%] font-semibold">Item</TableCell>
                          <TableCell className="p-2 w-[15%] font-semibold">AWB No.</TableCell>
                          {orderData?.order_items?.some((ele: any) => ele?.batch_available) && (
                            <TableCell className="p-2 w-[15%] font-semibold">Batch</TableCell>
                          )}
                          <TableCell className="p-2 w-[15%] font-semibold">Cost</TableCell>
                          <TableCell className="p-2 w-[15%] font-semibold">Qty</TableCell>
                          <TableCell className="p-2 w-[15%] font-semibold">Total</TableCell>
                        </TableRow>
                      </TableHead>

                      {/* Table Body */}
                      <TableBody>
                        {updatedOrderStatus?.order_items?.map((v: any, i: number) => (
                          <TableRow key={i}>
                            {/* Item Column */}
                            <TableCell className="p-2 w-[40%]">
                              <div className="flex items-start gap-4">
                                <Image
                                  src={(v?.image?.src) ? v.image.src : product}
                                  alt="productImage"
                                  width={60}
                                  height={60}
                                />
                                <div className="flex flex-col gap-1">
                                  <span>{v?.name}</span>
                                  <span><span className="font-medium">SKU:</span> {v?.sku}</span>
                                  <div className="flex flex-row items-center gap-1 w-52">
                                    <span className="font-medium">HSN:</span>
                                    <span className="flex items-center gap-2 w-full">
                                      <Select
                                        value={hsnStatus[v.id] || v?.hsn_id || ""}
                                        onChange={(e: any) => onStatusChangeHsn(e, v?.id)}
                                        fullWidth
                                        className="!px-4 !py-1 selectFieldCls"
                                      >
                                        {hsnArray?.length ? hsnArray.map((i: any, e: number) => (
                                          <MenuItem key={e} value={i?.id}>{i?.label}</MenuItem>
                                        )) : null}
                                      </Select>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="p-2 w-[15%]" style={{ fontSize: "15px", color: v?.awb ? "#0369A1" : "#EF4444", fontWeight: "600" }}>
                              {v?.awb ? v.awb : "- - -"}
                            </TableCell>

                            {/* Batch Column */}
                            {orderData?.order_items?.some((ele: any) => ele?.batch_available) && (
                              <TableCell className="p-2 w-[15%]">
                                {v?.batch_available && (
                                  <Button
                                    variant="outlined"
                                    color={v?.batch ? "primary" : "success"}
                                    className="whitespace-nowrap"
                                    onClick={() => handleOpenModal(v)}
                                    disabled={orderData?.order_status?.order_status?.title === "cancelled"}
                                  >
                                    {v?.batch ? (
                                      <>
                                        <FaEdit style={{ marginRight: "5px" }} />
                                        Update Batch
                                      </>
                                    ) : (
                                      <>
                                        <FaPlus style={{ marginRight: "5px" }} />
                                        Add Batch
                                      </>
                                    )}
                                  </Button>
                                )}
                              </TableCell>
                            )}

                            {/* Cost Column */}
                            <TableCell className="p-2 w-[15%]">
                              ₹{v?.price}
                            </TableCell>

                            {/* Quantity Column */}
                            <TableCell className="p-2 w-[15%]">
                              {v?.quantity ? "x" : ""}&nbsp;{v?.quantity || 0}
                            </TableCell>

                            {/* Total Column */}
                            <TableCell className="p-2 w-[15%]">
                              ₹{(v?.price * v?.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className='pb-2 p-0 border-0 w-[70%]'>
                            <hr className='w-full' />
                          </TableCell>
                          <TableCell className='pb-2 p-0 border-0 w-[10%]'>
                            <hr className='w-full' />
                          </TableCell>
                          <TableCell className='pb-2 p-0 border-0 w-[10%]'>
                            <hr className='w-full' />
                          </TableCell>
                          <TableCell className='pb-2 p-0 border-0 w-[10%]'>
                            <hr className='w-full' />
                          </TableCell>
                        </TableRow>

                        {
                          (orderData?.order_wallet && orderData?.order_wallet?.amount &&
                            <>
                              <TableRow>
                                <TableCell className='p-0 border-0 w-[70%]'>
                                  <div className='flex items-start gap-4'>
                                    <LocalShippingIcon className='text-color-gray-1' />
                                    <div className='flex flex-col gap-2'>
                                      <span className='flex justify-between'>
                                        <span className='font-semibold'>{"From Wallet: "}</span>
                                        <span>₹{(orderData?.order_wallet && orderData?.order_wallet?.amount) ? orderData?.order_wallet?.amount : 0}</span>
                                      </span>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                              <hr className='my-2' />
                            </>
                          )
                        }
                        <TableRow>
                          <TableCell className='p-0 border-0 w-[70%]'>
                            <div className='flex items-start gap-4'>
                              <LocalShippingIcon className='text-color-gray-1' />
                              <div className='flex flex-col gap-2'>
                                <span className='flex justify-between'>
                                  <span className='font-semibold'>{(orderData?.order_status && orderData?.order_status?.shipping_total === "0") ? "Free Shipping" : "Shipping charge:"}</span>
                                  <span>₹{orderData?.order_status && orderData?.order_status?.shipping_total}</span>
                                  {/* <span>₹{totalPrice().toFixed(2)}</span> */}
                                </span>
                                <div>
                                  <span className='font-semibold'>Items:</span>
                                  {orderData?.order_items.map((v: any, i: number) =>
                                    <span key={i}> {v && v?.name ? v?.name : ""},</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    {/* <div> */}


                    {/* </div> */}
                    <hr className='my-2' />
                    {
                      orderData?.order_status &&
                      <div className='flex items-start justify-between px-4'>
                        <div></div>
                        <div className='flex flex-col w-2/4'>
                          <p className='flex items-center justify-end gap-28'>
                            <span className='text-end w-[20%]'>Items Subtotal:</span>
                            <span className='text-end w-[20%]'>₹{orderData?.order_status?.net_total}</span>
                          </p>
                          <p className='flex items-center justify-end gap-28'>
                            <span className='text-end w-[20%]'>Shipping:</span>
                            <span className='text-end w-[20%]'>₹{orderData?.order_status?.shipping_total}</span>
                          </p>
                          {
                            (orderData?.order_wallet && orderData?.order_wallet?.amount &&
                              <p className='flex items-center justify-end gap-28'>
                                <span className='text-end w-[20%]'>Wallet:</span>
                                <span className='text-end w-[20%]'>- ₹{(orderData?.order_wallet && orderData?.order_wallet?.amount) ? orderData?.order_wallet?.amount : 0}</span>
                              </p>)
                          }

                          <p className='flex items-center justify-end gap-28'>
                            <span className='text-end w-[20%]'>Order Total:</span>
                            <span className='text-end w-[20%]'>
                              ₹{((+orderData?.order_status?.total_sales) -
                                +((orderData?.order_wallet && orderData?.order_wallet?.amount) ?
                                  orderData?.order_wallet?.amount : 0)).toFixed(2)}
                            </span>
                            {/* <span className='text-end w-[20%]'>₹{+(orderData?.order_status?.total_sales) - +((orderData?.order_wallet && orderData?.order_wallet?.amount) ? orderData?.order_wallet?.amount : 0).toFixed(2)}</span> */}
                          </p>
                          <hr className='w-full my-2' />
                          {/* <p className='flex items-center justify-end gap-28'>
                                            <span className='text-end w-[20%]'>Paid:</span>
                                            <span className='text-end w-[20%]'>₹1,364.00</span>
                                        </p> */}
                        </div>
                      </div>

                    }
                    <hr className='my-3' />
                    {/* <div>
                      <PinkPawsbutton variant='outlined' name={status?.status === "refunded" ? status?.status : (orderData?.order_status?.order_status?.title === "refunded") ? orderData?.order_status?.order_status?.title : "Refund"} handleClick={handleRefundClick} disabled={status?.status === "refunded" ? true : (orderData?.order_status?.order_status?.title === "refunded") ? true : status?.status === 'cancelled' ? true : (orderData?.order_status?.order_status?.title === "cancelled") ? true : false} />
                    </div>
                    <div className='flex items-center gap-2 w-25'>
                      <div className="flex items-center gap-2 w-full">
                        <FormControl fullWidth>
                          <Select
                            value={selectedStoreLocator || ""}
                            onChange={handleStoreLocatorChange}
                            label="Select Store Locator"
                            fullWidth
                            className="!px-4 !py-1 selectFieldCls"
                          >
                            <MenuItem value="">Select locator</MenuItem>
                            {allStoreLocatorDetails.length > 0 ? (
                              allStoreLocatorDetails.map((store) => (
                                <MenuItem key={store.id} value={store.id}>
                                  {store.title}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value="">No stores available</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </div>
                      <button className='border px-2 py-1 rounded bg-[#2271b1] text-white' onClick={updateStoreDetails}>
                        update
                      </button>
                    </div> */}


                    <div className="p-2 flex items-center justify-between gap-4 flex-wrap w-full">
                      {/* Refund Button */}
                      <PinkPawsbutton
                        variant="outlined"
                        name={status?.status === "refunded" ? status?.status : (orderData?.order_status?.order_status?.title === "refunded") ? orderData?.order_status?.order_status?.title : "Refund"}
                        handleClick={handleRefundClick}
                        disabled={status?.status === "refunded" || orderData?.order_status?.order_status?.title === "refunded" || status?.status === 'cancelled' || orderData?.order_status?.order_status?.title === "cancelled"}
                      />

                      {/* Bill to Name Select Input & Update Button */}
                      {/* <div className='flex gap-4'> */}
                      <div className="flex items-center gap-2 w-[320px]">
                        <div className="flex items-center gap- w-full">
                          <span className="font-medium whitespace-nowrap mx-1">Billing from:</span>


                          {orderData?.genesys_invoice_generated ? (
                            <p className="font-semibold text-sky-600 text-lg">{allStoreLocatorDetails.find(store => store.id === selectedStoreLocator)?.title || "No store selected"}</p>
                          ) : (
                            <FormControl fullWidth>
                              <Select
                                value={selectedStoreLocator || ""}
                                onChange={handleStoreLocatorChange}
                                displayEmpty
                                className="!px-4 !py-1 selectFieldCls"
                              >
                                {allStoreLocatorDetails.length > 0 ? (
                                  allStoreLocatorDetails.map((store) => (
                                    <MenuItem key={store.id} value={store.id} >
                                      {store.title}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem value="">No stores available</MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          )}
                          {/* Create Invoice Button */}
                        </div>
                      </div>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => sendInformation("NEW")}
                        sx={{

                          borderColor: "#475569",
                          color: "#475569",
                          fontWeight: "bold",
                          fontSize: "12px",
                          zIndex: "10",
                          "&:hover": {
                            color: "#fff",
                            borderColor: "#1E293B",
                            backgroundColor: "#1E293B",
                          },
                          whiteSpace: "nowrap",
                        }}
                        endIcon={!orderData?.genesys_invoice_generated && <SendIcon />}
                        disabled={!selectedStoreLocator || updatedOrderStatus?.order_status?.order_status?.title === "cancelled" || orderData?.genesys_invoice_generated}
                      // disabled={orderData?.order_items?.some((ele) => ele?.batch === null) ?? false}
                      >
                        {orderData?.genesys_invoice_generated ? "Invoice Created" : "Create Invoice"}
                        {/* {orderData?.genesys_invoice_generated === true ? "Invoice Created" : "Create Invoice"} */}
                      </Button>

                      {/* <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => sendInformation("RETURN")}
                        sx={{

                          borderColor: "#475569",
                          color: "#475569",
                          fontWeight: "bold",
                          fontSize: "12px",
                          zIndex: "10",
                          "&:hover": {
                            color: "#fff",
                            borderColor: "#1E293B",
                            backgroundColor: "#1E293B",
                          },
                          whiteSpace: "nowrap",
                        }}
                      >
                        Return Invoice
                      </Button> */}



                      {/* AWB No. Button */}

                      <div className="flex items-center gap-2 w-[420px]">
                        <div className="flex items-center gap-2 w-full">
                          <span className="font-medium whitespace-nowrap">Service type:</span>
                          <FormControl fullWidth>
                            <Select
                              value={selectedAwb || ""}
                              onChange={handleAwbServiceChange}
                              displayEmpty
                              className="!px-4 !py-1 selectFieldCls"
                              disabled={orderData?.order_status?.order_status?.title === "cancelled" || (awbDisabled && awbDisabled.length > 0)}
                            >
                              {/* <MenuItem value="">Select service type</MenuItem> */}
                              {awbServiceType.length > 0 ? (
                                awbServiceType.map((ele) => (
                                  <MenuItem key={ele.id} value={ele.title} >
                                    <span className='text-xs'>

                                      {ele.title}
                                    </span>
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="">No AWB Services available</MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </div>

                        <button

                          disabled={!orderData?.genesys_invoice_generated || awbDisabled.length > 0}
                          // className='bg-[#2271b1] text-white w-[180px] h-[32px] border px-0 py-1 rounded text-sm'
                          className={`w-[180px] h-[32px] border px-0 py-1 rounded text-sm 
    ${!orderData?.genesys_invoice_generated || orderData?.order_status?.order_status?.title === "cancelled" || awbDisabled.length > 0 ?
                              "text-gray-400 bg-gray-200 cursor-default" : "bg-[#2271b1] text-white"}`}
                          onClick={updateAwbServices}
                        >
                          Generate AWB
                        </button>
                      </div>

                      {/* </div> */}
                    </div>


                  </div>
                  : <span className='flex items-center justify-center w-full py-4 text-xl'>No data found</span>}
                {/* </SimpleCard> */}
              </div >
              {/* Batch Modal */}
              <Modal open={openModal} onClose={handleCloseModal} >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    maxHeight: '80vh',
                  }}
                >
                  <h3 className='text-slate-600 nowrap font-bold'>Add Batches for : <span className='text-gray-400 font-semibold'>{selectedItem?.name}</span></h3>
                  <hr />
                  <div style={{
                    marginTop: "15px",
                    boxShadow: "0 5px 10px rgba(0,0,0,0.5)",
                    maxHeight: '400px',
                    overflowY: isScrollable ? 'auto' : 'hidden',
                    marginBottom: '16px',
                    padding: "10px",
                    borderRadius: "10px"
                  }}>
                    {/* {batchData.map((_, index) => (
                                        <TextField
                                            key={index}
                                            label={`Batch ${index + 1}`}
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={batchData[index]}
                                            onChange={(e: any) => handleInputChange(index, e.target.value)} // Handle text input
                                            type="text"
                                        />
                                    ))} */}
                    {batchData.map((batchValue, index) => (
                      <TextField
                        key={index}
                        label={`Batch ${index + 1}`}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={batchValue} // Display pre-filled value
                        onChange={(e: any) => handleInputChange(index, e.target.value)}
                        type="text"
                      />
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveBatch}>Save</Button>
                  </div>
                </Box>
              </Modal>

              <SimpleCard className='w-full' heading={<h1>Order Action</h1>}>
                <div className='flex lg:flex-row flex-col justify-between gap-4'>
                  <div className='lg:w-2/5 w-full'>

                    <PinkPawsbutton name='Send E-Mail To User' pinkPawsButtonExtraCls='w-[15%]' handleClick={() => onOrderSendStatusToEmail()} />

                  </div>
                  {/* <PinkPawsbutton name='Save Order & Send Email' pinkPawsButtonExtraCls='w-full' handleClick={() => submitSendOrderEmail()} /> */}
                  {/* <div className='border border-solid border-gray-400'>
                    <p className='px-4 py-2'>Order Action</p>
                    <hr />
                    <div className='p-4 flex flex-col gap-2 bg-offWhite-03'>
                        <div className='w-full border border-solid border-offWhite-02'>

                            <Select
                                value={status?.status ? status?.status : orderData?.order_status?.order_status?.title ? orderData?.order_status?.order_status?.title : null}
                                onChange={(e: any) => onStatusChange(e)}
                                fullWidth
                                className='!px-4 !py-1 selectFieldCls'
                            >
                                <MenuItem key={2} value={"email_invoice"}>{"Email Invoice | Order Details to Customer"}</MenuItem>
                            </Select>

                        </div>
                        <PinkPawsbutton name='Update' pinkPawsButtonExtraCls='w-full' handleClick={() => { sendStatus({ status: status?.status, id: orderData?.id }); setConfirmStatus(false) }} disabled={sendEmailType == "" ? true : false} />
                    </div>
                </div> */}
                  <div className='lg:border-l border-b border-solid border-gray-400' />
                  <div className='flex items-center gap-4 justify-end'>
                    <PinkPawsbutton disabled={!orderData?.genesys_invoice_generated || orderData?.order_status?.order_status?.title === "cancelled"} name='Create PDF Invoice' pinkPawsButtonExtraCls='w-[15%]' handleClick={() => handlePdf("invoice")} />
                    <PinkPawsbutton name='Create PDF Packing Slip' disabled={!orderData?.genesys_invoice_generated || orderData?.order_status?.order_status?.title === "cancelled"} pinkPawsButtonExtraCls='w-[15%]' handleClick={() => handlePdf("packing_slip")} />
                  </div>
                </div>

              </SimpleCard>
              {/* </div> */}
              {/* </div> */}
              <OrdersNote orderNoteData={orderDetails} isValue={"edit"} />
              {/* <SimpleCard heading={
                <div className='flex items-center justify-between'>
                  <h1>DTDC Tracking</h1>
                  <ArrowDropDownIcon className='w-auto h-8 cursor-pointer' onClick={() => { setHandleSection(!handleSection), console.log(orderData, orderData?.order_items, "5d4gh65d3f") }} />
                </div>
              }>
                {handleSection && <DTDCTracking dtdcData={orderData?.order_items} handleSection={handleSection} />}
              </SimpleCard> */}
            </>
            :""
            // <SimpleCard heading={
            //   <div className='flex items-center justify-between'>
            //     <h1>DTDC Tracking</h1>
            //     <ArrowDropDownIcon className='w-auto h-8 cursor-pointer' onClick={() => { setHandleSection(!handleSection), console.log(orderData?.dtdc_traking, "5d4gh65d3f") }} />
            //   </div>
            // }>
            //   {handleSection && <DTDCTracking dtdcData={orderData?.dtdc_traking} handleSection={handleSection} />}
            // </SimpleCard>
          }
        </div >
      )}
      <Dialog
        open={confirmSendEmailStatus}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className='w-80 h-40 p-4'>
          <div className='bg-white flex flex-col justify-between h-full'>
            <p className='flex flex-col items-center justify-center'>
              <span>Do you want to Send Email</span>
              <span> with &nbsp;<span className='font-semibold'>`{updatedOrderStatus?.order_status?.order_status?.title}`</span></span>
            </p>
            <div className='flex items-center gap-4'>
              <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { submitSendOrderEmail(updatedOrderStatus?.order_status?.order_status?.title); setConfirmSendEmailStatus(false) }} />
              <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => onCloseDilog()} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={confirmStatus}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className='w-80 h-40 p-4'>
          <div className='bg-white flex flex-col justify-between h-full'>
            <p className='flex flex-col items-center justify-center'>
              <span>Do you want to change the order status</span>
              <span>to&nbsp;<span className='font-semibold'>`{status?.status}`</span></span>
            </p>
            <div className='flex items-center gap-4'>
              <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => handleChangeOrderStatus()} />
              <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => onCloseDilog()} />
            </div>
          </div>
        </DialogContent>
      </Dialog>









      {/* Full page modal */}
      {/* {openAddressModal &&
                <RightSideModal modalStat={openAddressModal} handleClose={clear} heading={addressHeadingType === "billing" ? 'Update Billing Address' : 'Update Shipping Address'}> */}
      {/* <div className='p-4 flex items-start gap-2.5'>
                <div className='flex w-[100%] flex-col gap-4'>

                    <div className='border border-solid border-gray-400'>
                        <p className='px-4 py-2'>Title</p>
                        <hr />
                        <div className='p-4 flex flex-col gap-2 bg-offWhite-03'>
                            <div className='w-full border border-solid border-offWhite-02'><TextField className='!w-full p-1' placeholder='Enter Title' name='title' handelState={handelOnChange} value={fields?.title} /></div>
                            <span style={{ color: "red" }}>{fieldsErrors?.title}</span>
                        </div>
                    </div>


                    <PinkPawsbutton
                        variant={"solid"}
                        name={addressHeadingType === "billing" ? 'Update Billing Address' : 'Update Shipping Address'}
                        icon={""}
                        // handleClick={handelSubmit}
                        pinkPawsButtonExtraCls={""}
                        style={{}}
                        disabled={false}
                        title={""}
                    />
                </div>

            </div> */}
      {/* </RightSideModal> */}
      {/* } */}
    </>
  )
}

export default OrdersEdit