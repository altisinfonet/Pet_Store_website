import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'
import { useCreate, useRead, useUpdate } from '../../hooks';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Checkbox, Drawer } from '@mui/material';
import Image from 'next/image';
import closep from "../../../public/assets/icon/close.png";
import axios from 'axios';
import getUrlWithKey from '../../util/_apiUrl';
import { _SUCCESS } from '../../util/_reactToast';
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
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

const Billing = () => {
    const router = useRouter();
    const { add_billing_address, billing_address_update, get_user_billing_addresses } = getUrlWithKey("client_apis")
    const [otherView, setOtherView] = useState<any>("billing");
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [formData, setFormData]: any = useState<FormData>(initialFormData);
    const [defaultAddress, setDefaultAddress]: any = useState(false);
    const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>({});
    const [editId, setEditId] = useState<number>(null);
    const [shipingToBilling, setShipingToBilling] = useState(false);
    const [editIdBilling, setEditIdBilling] = useState<number>(null);
    const [getbillingAddressesUrl, setGetbillingAddressesUrl]: any = useState();
    const [shiping_Id, setShiping_Id]: any = useState(null);
    const [deleteId, setDeleteId] = useState<number>(null);
    const [addShippingAddressUrl, setAddShippingAddressUrl]: any = useState();
    const [updateBillingAddressUrl, setUpdateBillingAddressUrl]: any = useState();
    const [billing, setBilling] = useState<boolean>(true);
    const [forBilling, setForBilling] = useState(false);


    const { sendData: getbilling_addresses }: any = useRead({
        selectMethod: "get",
        url: getbillingAddressesUrl,
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

    const { sendData: addAddress }: any = useCreate({
        url: addShippingAddressUrl,
        callData: editId
            ? { shipping_id: editId, shipping_address: { ...formData } }
            : deleteId
                ? { shipping_id: deleteId }
                : { shipping_address: { ...formData } },
    });

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

    console.log(billingAddresses, "d65f4g5fd6x1")
    const debounce = (func: any, wait: any) => {
        let timeout: ReturnType<typeof setTimeout>;
        return function (...args: any) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const fetchPostCodeData = async () => {
        try {
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

    useEffect(() => {
        fetchPostCodeDataDebounced();
    }, [formData?.postcode, fetchPostCodeDataDebounced]);

    useEffect(() => {
        if (updateBAddress) {
            // console.log(updateBAddress, "4fgh4gd65")
            // _SUCCESS(`Billing address is added successfully`);
            setFormData(initialFormData);
            setUpdateBillingAddressUrl(null);
            setSideBarOpen(false);
            setGetbillingAddressesUrl(get_user_billing_addresses);
            setForBilling(false);
        }

        if (updateBAddress && editIdBilling) {
            _SUCCESS(`Billing address is updated successfully`);
            console.log(editIdBilling, updateBAddress, "ssdf65s1")
            setFormData(initialFormData);
            if (editIdBilling) {
                setEditIdBilling(null);
            }
            setGetbillingAddressesUrl(get_user_billing_addresses);
            setUpdateBillingAddressUrl(null);
            setSideBarOpen(false);
            setForBilling(false);
        }
        if (updateBAddress && forBilling && !editIdBilling) {
            setShiping_Id(null);
            _SUCCESS(`Billing address is updated successfully`);
            setGetbillingAddressesUrl(get_user_billing_addresses);
            setFormData(initialFormData);
            setUpdateBillingAddressUrl(null);
            setSideBarOpen(false);
            setForBilling(false);

        }
    }, [addAddress, updateBAddress]);

    useEffect(() => {
        if (
            getbilling_addresses &&
            getbillingAddressesUrl === get_user_billing_addresses
        ) {
            setGetbillingAddressesUrl();
        }
    }, [getbilling_addresses]);


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
            // formData.address_type = "home";
            setFormData((prevFormData) => ({
                ...prevFormData,
                address_type: "home",
            }));
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveBillig = (type: any) => {
        console.log(billingAddresses, billingAddresses?.id, type, forBilling, "5fdgd6x6")
        const isValid = validateForm();
        if (isValid) {
            // alert("y")
            // Logic to save form data
            if (!billingAddresses?.id && forBilling) {
                setUpdateBillingAddressUrl(add_billing_address);
                // setGetbillingAddressesUrl(get_user_billing_addresses);
            } else {
                if (!billingAddresses?.id && type === 2) {
                    setUpdateBillingAddressUrl(add_billing_address);
                    // setGetbillingAddressesUrl(get_user_billing_addresses);
                } else {
                    setUpdateBillingAddressUrl(billing_address_update);
                    // setGetbillingAddressesUrl(get_user_billing_addresses);
                }
            }
        }
    };
    return (
        <>
            <div className="container">
                <div className="my-account mt-3">
                    <div className="tm-w-full w-100 d-flex justify-content-between ">
                        <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Billing Address</h3>
                        <button className="show-btn1 mb-3 h-fit"
                            onClick={() => router.push('/myaccount')}
                        >
                            <i className="fa-solid fa-arrow-left-long" style={{ paddingLeft: "8px", padding: "4px" }}></i>
                            <span style={{ paddingRight: "9px" }}>back</span>
                        </button>
                    </div>



                    <Box style={{ display: "flex", justifyContent: "start", padding: "16px" }}>
                        <Card
                            style={{
                                width: "100%",
                                maxWidth: "900px",
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <CardContent>
                                <Typography
                                    style={{
                                        color: "#6b7280",
                                        fontSize: "16px",
                                        marginBottom: "16px",
                                        fontWeight: "600"
                                    }}
                                >
                                    The following addresses will be used on the checkout page by default.
                                </Typography>

                                <Box
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        borderBottom: "1px solid #e0e0e0",
                                        paddingBottom: "12px",
                                        marginBottom: "16px",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: "600",
                                            color: "#e4509d",
                                        }}
                                    >
                                        Billing Address
                                    </Typography>
                                    <Button
                                        style={{
                                            backgroundColor: "#e4509d",
                                            color: "#fff",
                                            fontSize: "14px",
                                            borderRadius: "4px",
                                            textTransform: "none",
                                        }}
                                        onClick={() => handleEditClick(billingAddresses, 2)}
                                        startIcon={
                                            billingAddresses?.id ? (
                                                <EditIcon style={{ fontSize: "16px" }} />
                                            ) : (
                                                <AddIcon style={{ fontSize: "18px" }} />
                                            )
                                        }
                                    >
                                        {billingAddresses?.id ? "Edit" : "Add"}
                                    </Button>
                                </Box>

                                {billingAddresses?.id ? (
                                    <Box style={{ paddingTop: "12px" }}>
                                        <Typography
                                            style={{
                                                fontSize: "14px",
                                                color: "#4b5563",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <strong>Name:</strong> <span style={{ color: "#9CA3AF", fontWeight: "600" }}>{billingAddresses?.first_name} {billingAddresses?.last_name}</span>
                                        </Typography>
                                        <Typography
                                            style={{
                                                fontSize: "14px",
                                                color: "#4b5563",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <strong>Phone:</strong>
                                            <span style={{ color: "#9CA3AF", fontWeight: "600" }}>
                                                {billingAddresses?.phone || "--"}
                                            </span>
                                        </Typography>
                                        <Typography
                                            style={{
                                                fontSize: "14px",
                                                color: "#4b5563",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <strong>Address:</strong>
                                            <span style={{ color: "#9CA3AF", fontWeight: "600" }}>
                                                {billingAddresses?.address_1}
                                            </span>
                                        </Typography>
                                        <Typography
                                            style={{
                                                fontSize: "14px",
                                                color: "#4b5563",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <strong>City:</strong>
                                            <span style={{ color: "#9CA3AF", fontWeight: "600" }}>
                                                {billingAddresses?.city}, {billingAddresses?.postcode}
                                            </span>
                                        </Typography>
                                        <Typography
                                            style={{
                                                fontSize: "14px",
                                                color: "#4b5563",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <strong>State:</strong>
                                            <span style={{ color: "#9CA3AF", fontWeight: "600" }}>
                                                {billingAddresses?.state}
                                            </span>
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography
                                        style={{
                                            fontSize: "14px",
                                            color: "#9ca3af",
                                            textAlign: "center",
                                            padding: "16px 0",
                                        }}
                                    >
                                        No billing address added yet.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Box>

                </div>
            </div>


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
                                    : (handleSaveBillig(1))
                            }
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Drawer>
        </>
    )
}

export default Billing