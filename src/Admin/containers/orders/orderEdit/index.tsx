import moment from 'moment'
import React, { useEffect, useState } from 'react'
import SelectField from '../../../components/SelectField'
import SimpleCard from '../../../components/SimpleCard'
import { alertClasses, Box, Button, Dialog, DialogContent, FormControl, InputLabel, MenuItem, Modal, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material'
import Image from 'next/image'
import product from "../../../../../public/assets/images/product.png"
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PinkPawsbutton from '../../../components/PinkPawsbutton'
import { emailRegax, isEmptyObject, phoneRegax } from '../../../util/_common'
import DTDCTracking from '../../../components/DTDCTracking'
import getUrlWithKey from '../../../util/_apiUrl'
import { _post } from '../../../../services'
import { _ERROR, _SUCCESS } from '../../../util/_reactToast'
import RightSideModal from '../../../components/RightSideModal'
import TextAreaField from '../../../components/TextAreaField'
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import OrdersNote from '../orderNote'
import axios from 'axios'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { _get, _put } from '../../../services'
import { FaEdit, FaPlus } from "react-icons/fa";
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

const OrdersEdit = ({ orderData, getOrderState, sendStatus, ordersNote, refetchUpdateDetails, track, ModalHandleClose }: any) => {
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

    console.log(orderData, "dfg2fd56g65")

    const { get_tracking, add_batch } = getUrlWithKey("dtdc");
    const { get_order_list } = getUrlWithKey("orders");
    const [orderIDM, setOrderIdM] = useState();

    console.log('orderData?.id', orderData?.id)
    useEffect(() => {
        if (orderData?.id) {
            setOrderIdM(orderData?.id);
        }

        // try {
        //     const fDt = async () => {
        //         const { data } = await _post(get_tracking, { id: orderData?.id });
        //         console.log('datttttttttt', data);
        //     }

        //     fDt();
        // }catch(err: any) {
        //     console.log('err: ', err);
        // }

    }, [orderData?.id]);

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


    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [batchData, setBatchData] = useState<string[]>([]);
    const [orderId, setOrderId] = useState(null);
    const [isSetBatch, setIsSetBatch] = useState(false);

    console.log('adress:: ', shipingAddress, billingAddress);
    console.log('ordersNote ', ordersNote)

    const [storeLocatorId, setStoreId] = useState(null);



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

    const [allStoreLocatorDetails, SetAllStoreLocatorDetails] = useState<StoreLocator[]>([]);
    const [selectedStoreLocator, setSelectedStoreLocator] = useState<string>('');
    const [selectedStoreLocatorObject, setSelectedStoreLocatorObject] = useState<any>('');


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


    const handleStoreLocatorChange = (event: any) => {
        setSelectedStoreLocator(event.target.value); // Update the selected store id
    };

    const updateStoreDetails = async () => {
        const payloda = {
            "order_id": orderId,
            "store_location_id": selectedStoreLocator && selectedStoreLocator
        }

        console.log(payloda)
        try {
            // /add-site-code
            const res = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/add-site-code`, payloda)
            _SUCCESS("Store update successfully")
            ModalHandleClose();
            console.log(res)
        } catch (error) {
            console.log(error.message);
        }
    }

    // console.log(typeof storeLocatorDetails)
    console.log(selectedStoreLocator)





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
        setOrderNotes({ ...ordersNote });
        console.log('llllllllll', orderNotes)
    }, [ordersNote])

    // const totalPrice = () => {
    //     let count = 0
    //     if (orderData?.order_items?.length) {
    //         orderData?.order_items.map((v: any) => { count += +(v?.order_product_lookup?.shipping_amount) })
    //     }
    //     return count
    // }

    const onStatusChange = (e: any) => {
        setStatus({ status: e.target.value })
    }

    const onStatusChangeHsn = async (e: any, id: any) => {

        if (e.target.value && id) {
            try {
                const { data } = await _post(update_product_hsn, { id: id, hsn_id: e.target.value })
                if (data?.success) {
                    refetchUpdateDetails(orderData?.id)
                    _SUCCESS("Product HSN Update is Successful")
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

    const handleChangeOrderStatus = () => {
        console.log("orderData: ", orderData)
        sendStatus({ status: status?.status, id: orderData?.id });
        setConfirmStatus(false);

        console.log('getOrder: ', getOrderState)
        // refetchUpdateDetails(+(orderData?.id))
    }

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

    const handlePdf = async (pdfType: string) => {
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
        }
    }

    const submitSendOrderEmail = async () => {
        try {
            console.log('orderEmailResponse: ')
            if (sendEmailType !== "") {
                const data = {
                    order_id: +(orderData?.id),
                    email_type: sendEmailType,
                };

                const res = await _post(`${order_email_send}`, data);

                if (res?.data && res?.data?.success) {
                    setSendEmailType("");
                    _SUCCESS("Order email is sent successfully")
                    setOrderDetails(ordersNote)
                }
                console.log('orderEmailResponse: ', res);
            }
        } catch (error) {
            console.log("error: ", error);
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
            });
            // setStoreLocatorDetails()
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
            // console.log(orderData)
            setSelectedStoreLocatorObject(orderData?.order_status?.store_location);
            setOrderId(orderData?.id);
        } else {
            // setStoreLocatorDetails(""); // Set to empty string when no order data is available
            setOrderId(null);
        }
    }, [orderData])

    const fetchOrderData = async () => {
        try {
            const { data: orderData } = await axios.get(`${get_order_list}/${orderId}`);
            const updatedItem = orderData?.data?.order_items?.find(
                (item: any) => item.id === selectedItem?.id
            );
            if (updatedItem) {
                const existingBatch = updatedItem.batch || '';
                setBatchData(
                    existingBatch.split(', ').map((batch: string) => batch || '')
                );
                setIsSetBatch(true);
            } else {
                setBatchData([]);
            }
            console.log(updatedItem, batchData, orderData, "d56fgh6df3")
        } catch (error) {
            console.error("Error fetching order data", error);
        }
    };


    const handleOpenModal = (item: any) => {
        setSelectedItem(item);

        // Check if the item already has batch data
        const existingBatch = item.batch
            ? item.batch.split(', ')
            : Array(item.quantity).fill('');

        setBatchData(existingBatch); // Pre-fill modal with batch data
        setOpenModal(true); // Open modal
    };

    const isScrollable = selectedItem?.quantity > 4;
    // Handle modal close
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedItem(null);
        setBatchData([]);
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
                await fetchOrderData();
                // setOrderId(null);
                setSelectedItem(null);
                setOpenModal(false);
            } else {
                _ERROR(res?.data?.message || "Something went wrong!");
            }
        } catch (error) {
            _ERROR("Please try again.");
        }
    };



    const flexColG1 = "flex flex-col gap-1"
    const txtFieldCls = "!w-full p-1 border border-solid border-[#c4c4c4] rounded"

    const [orderDetails, setOrderDetails]: any = useState()

    useEffect(() => {
        setOrderDetails(ordersNote)
    }, [ordersNote]);

    const disabledStatusOption = () => {
        console.log("cancelled");
        if (status?.status === "refunded" || orderData?.order_status?.order_status?.title === "refunded") {
            return status?.status === "refunded" ? true : (orderData?.order_status?.order_status?.title === "refunded") ? true : false
        }

        if (status?.status === "refunded" || orderData?.order_status?.order_status?.title === "cancelled") {
            console.log("cancelled 123");
            return status?.status === "cancelled" ? true : (orderData?.order_status?.order_status?.title === "cancelled") ? true : false
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
    console.log(hsnArray, "hsnArray")

    return (
        <>
            <div className='flex flex-col gap-4'>
                {/* nned to add {payment_method_title}{transaction_id}{customer_ip_address} */}
                {track !== true ?
                    <>
                        <SimpleCard heading={<h1>Order #{orderData?.id} details</h1>}>
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
                                                    disabled={orderData?.order_status?.order_status?.title ? disabledStatusOption() : null}
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
                                        <div className='flex flex-col items-start gap-1'>
                                            <span className='font-medium'>Store locator:</span>
                                            <div className='flex items-center gap-2 w-full'>
                                                {/* 
                                                <select name="" id="" className='!px-4 !py-1 selectFieldCls border '
                                                    //  value={storeLocatorDetails || ""} 
                                                    onChange={(e: any) => setStoreLocatorDetails(e.target.value)}
                                                >
                                                    <option value="">Select locator</option>
                                                    {allStoreLocatorDetails?.length ? allStoreLocatorDetails.map((i: any, e: any) => <option key={e} value={i}>{i?.title}</option>) : null}
                                                </select> */}
                                                {/* <Select
                                                    // value={status?.status ? status?.status : orderData?.order_status?.order_status?.title ? orderData?.order_status?.order_status?.title : null}
                                                    // disabled={orderData?.order_status?.order_status?.title ? disabledStatusOption() : null}
                                                    onChange={(e: any) => setStoreLocatorDetails(e.target.value)}
                                                    fullWidth
                                                    className='!px-4 !py-1 selectFieldCls'
                                                    value={storeLocatorDetails && storeLocatorDetails !== undefined && storeLocatorDetails.title || ""}
                                                >
                                                    <MenuItem value="">Select locator</MenuItem>
                                                    {allStoreLocatorDetails?.length ? allStoreLocatorDetails.map((i: any, e: number) => <MenuItem key={e} value={i}>{i?.title}</MenuItem>) : null}
                                                </Select> */}



                                                <div className="flex items-center gap-2 w-full">
                                                    <FormControl fullWidth>
                                                        {/* <InputLabel>Select Store Locator</InputLabel> */}
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
                                                                        {store.title} {/* Display the store name */}
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
                                            </div>
                                            <span>Store Locator name: {selectedStoreLocatorObject && selectedStoreLocatorObject.title}</span>
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
                        <SimpleCard className='w-full' heading={
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='p-0 border-0 w-[70%]'>
                                            Item
                                        </TableCell>
                                        <TableCell className='p-0 border-0 w-[10%]'>
                                            Batch
                                        </TableCell>
                                        <TableCell className='p-0 border-0 w-[10%]'>
                                            Cost
                                        </TableCell>
                                        <TableCell className='p-0 border-0 w-[10%]'>
                                            Qty
                                        </TableCell>
                                        <TableCell className='p-0 border-0 w-[10%]'>
                                            Total
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>}>
                            {orderData?.order_items?.length ?
                                <div>
                                    <Table>
                                        <TableBody>
                                            {orderData?.order_items.map((v: any, i: number) =>
                                                <TableRow key={i}>
                                                    <TableCell className='pb-2 p-0 border-0 w-[70%]'>
                                                        <div className='flex items-start gap-4'>
                                                            <Image src={(v && v?.image && v?.image?.src) ? v?.image?.src : product} alt='productImage' width={60} height={60} />
                                                            <div className='flex flex-col gap-1'>
                                                                <span>{v && v?.name}</span>
                                                                <span><span className='font-medium'>sku:</span>&nbsp;{v && v?.sku}</span>
                                                                <div className='flex flex-row items-center gap-1 w-52'>
                                                                    <span className='font-medium'>HSN:</span>
                                                                    <span className='flex items-center gap-2 w-full'>
                                                                        <Select
                                                                            value={v?.hsn_id || ""}
                                                                            onChange={(e: any) => onStatusChangeHsn(e, v?.id)}
                                                                            fullWidth
                                                                            className='!px-4 !py-1 selectFieldCls'
                                                                        >
                                                                            {hsnArray?.length ? hsnArray.map((i: any, e: number) => <MenuItem key={e} value={i?.id}>{i?.label}</MenuItem>) : null}
                                                                        </Select>
                                                                        {/* <SelectField selectFieldRootCls='w-full ' handleChange={() => { }} menuItemArray={getOrderState} /> */}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='pb-2 p-0 border-0 w-[10%]'>
                                                        {/* <Button variant="outlined" color={`${v?.batch && v?.batch !== null ? "primary" : "success"}`} className='whitespace-nowrap' onClick={() => {
                                                            handleOpenModal(v)
                                                        }}>{v?.batch && v?.batch !== null ? <FaEdit style={{ marginRight: "5px" }} /> : <FaPlus style={{ marginRight: "5px" }} />}
                                                            {v?.batch && v?.batch !== null ? "Update Batch" : "Add Batch"}
                                                        </Button> */}
                                                        <Button
                                                            variant="outlined"
                                                            color={`${v?.batch && v?.batch !== null ? "primary" : "success"}`}
                                                            className="whitespace-nowrap"
                                                            onClick={() => handleOpenModal(v)}
                                                        >
                                                            {v?.batch && v?.batch !== null ? (
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
                                                    </TableCell>
                                                    <TableCell className='pb-2 p-0 border-0 w-[10%]'>
                                                        ₹{v && v?.price}
                                                    </TableCell>
                                                    <TableCell className='pb-2 p-0 border-0 w-[10%]'>
                                                        {v?.quantity ? "x" : ""}&nbsp;{v?.quantity || 0}
                                                    </TableCell>
                                                    <TableCell className='pb-2 p-0 border-0 w-[10%]'>
                                                        ₹{v && v?.price * v?.quantity}
                                                    </TableCell>
                                                </TableRow>
                                            )}

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
                                                                <span className='font-semibold'>{(orderData?.order_status && orderData?.order_status?.shipping_total == 0) ? "Free Shipping" : "Shipping charge:"}</span>
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
                                    <div>
                                        <PinkPawsbutton variant='outlined' name={status?.status === "refunded" ? status?.status : (orderData?.order_status?.order_status?.title === "refunded") ? orderData?.order_status?.order_status?.title : "refund"} handleClick={handleRefundClick} disabled={status?.status === "refunded" ? true : (orderData?.order_status?.order_status?.title === "refunded") ? true : status?.status === 'cancelled' ? true : (orderData?.order_status?.order_status?.title === "cancelled") ? true : false} />
                                    </div>
                                </div>
                                : <span className='flex items-center justify-center w-full py-4 text-xl'>No data found</span>}
                        </SimpleCard>

                        {/* Batch Modal */}
                        <Modal open={openModal} onClose={handleCloseModal}>
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
                                    {batchData && batchData?.map((batchValue: any, index: number) => (
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
                                <div className='lg:w-3/5 w-full'>
                                    <Select
                                        value={sendEmailType ? sendEmailType : "placeholder"}
                                        // disabled={status?.status === "refunded" ? true : (orderData?.order_status?.order_status?.title === "refunded") ? true : false}
                                        onChange={(e: any) => onSendOrderEmailChange(e)}
                                        fullWidth
                                        className='!px-4 !py-1 selectFieldCls'
                                    >
                                        <MenuItem disabled value="placeholder">
                                            <em className='text-gray-400 text-base'>Send Email</em>
                                        </MenuItem>
                                        <MenuItem key={2} value={"processing_order"}>{"Processing Order"}</MenuItem>
                                        <MenuItem key={3} value={"completed_order"}>{"Completed Order"}</MenuItem>
                                        <MenuItem key={1} value={"cancel_order"}>{"Cancel Order"}</MenuItem>
                                        <MenuItem key={4} value={"customer_invoice"}>{"Customer Invoice & Order Details"}</MenuItem>
                                    </Select>
                                    {/* <PinkPawsbutton name='Save Order & Send Email' pinkPawsButtonExtraCls='w-full' handleClick={() => submitSendOrderEmail()} /> */}
                                </div>
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
                                    <PinkPawsbutton name='Create PDF Invoice' pinkPawsButtonExtraCls='w-[15%]' handleClick={() => handlePdf("invoice")} />
                                    <PinkPawsbutton name='Create PDF Packing Slip' pinkPawsButtonExtraCls='w-[15%]' handleClick={() => handlePdf("packing_slip")} />
                                </div>
                            </div>

                        </SimpleCard>
                        {/* </div> */}
                        {/* </div> */}
                        <OrdersNote orderNoteData={orderNotes} />
                        <SimpleCard heading={
                            <div className='flex items-center justify-between'>
                                <h1>DTDC Tracking</h1>
                                <ArrowDropDownIcon className='w-auto h-8 cursor-pointer' onClick={() => setHandleSection(!handleSection)} />
                            </div>
                        }>
                            {handleSection && orderData && orderData?.dtdc_traking && <DTDCTracking dtdcData={orderData?.dtdc_traking} handleSection={handleSection} />}
                        </SimpleCard>
                    </>
                    :
                    <SimpleCard heading={
                        <div className='flex items-center justify-between'>
                            <h1>DTDC Tracking</h1>
                            <ArrowDropDownIcon className='w-auto h-8 cursor-pointer' onClick={() => setHandleSection(!handleSection)} />
                        </div>
                    }>
                        {handleSection && orderData && orderData?.dtdc_traking && <DTDCTracking dtdcData={orderData?.dtdc_traking} handleSection={handleSection} />}
                    </SimpleCard>
                }
            </div >
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
                            <span> with &nbsp;<span className='font-semibold'>`{sendEmailType}`</span></span>
                        </p>
                        <div className='flex items-center gap-4'>
                            <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { submitSendOrderEmail(); setConfirmSendEmailStatus(false) }} />
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