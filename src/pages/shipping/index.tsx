import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'
import { useCreate, useRead, useUpdate } from '../../hooks';
import getUrlWithKey from '../../util/_apiUrl';
import { _SUCCESS } from '../../util/_reactToast';
import axios from 'axios';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, Drawer, IconButton } from '@mui/material';
import Image from 'next/image';
import closep from "../../../public/assets/icon/close.png";
import useTabView from '../../hooks/useTabView';
import { _get } from '../../services';
import { Card, CardContent, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EditIcon from "@mui/icons-material/Edit";

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
    default: false,
};
const ShippingAddress = () => {
    const router = useRouter();
    const { tabView, mobView } = useTabView();
    const { get_user_billing_addresses, delete_shipping_address, billing_address_update, add_billing_address, get_user_shipping_addresses, add_shipping_address, update_shipping_address } = getUrlWithKey("client_apis")
    const [otherView, setOtherView] = useState<any>("shipping");
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [formData, setFormData]: any = useState<FormData>(initialFormData);
    const [defaultAddress, setDefaultAddress]: any = useState(false);
    const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>({});
    const [editId, setEditId] = useState<number>(null);
    const [shipingToBilling, setShipingToBilling] = useState(false);
    const [editIdBilling, setEditIdBilling] = useState<number>(null);
    const [getShippingAddressesUrl, setGetShippingAddressesUrl]: any = useState();
    const [getbillingAddressesUrl, setGetbillingAddressesUrl]: any = useState();
    const [shiping_Id, setShiping_Id]: any = useState(null);
    const [deleteId, setDeleteId] = useState<number>(null);
    const [addShippingAddressUrl, setAddShippingAddressUrl]: any = useState();
    const [updateBillingAddressUrl, setUpdateBillingAddressUrl]: any = useState();
    const [DeleteAdressID, setDeleteIDAddress] = useState<any>('');
    const [DeleteAddress, setDeleteAddress] = useState<any>(false);
    const [billing, setBilling] = useState<boolean>(false);
    const [forBilling, setForBilling] = useState(false);

    const [shippingAddressData, setShippingAddressData] = useState<any[] | undefined>(undefined);
    const [billingAddressData, setBillingAddressData] = useState<[]>()

    const { sendData: getshipping_addresses }: any = useRead({
        selectMethod: "get",
        url: getShippingAddressesUrl,
    });

    console.log(shippingAddressData, shippingAddressData?.[0]?.id, "5ddszzv4f")

    const fetchShippingAddressData = async () => {
        const res = await _get(get_user_shipping_addresses)
        if (res && res?.status) {
            setShippingAddressData(res?.data?.data)
        } else {
            setShippingAddressData([])
        }
    }

    const fetchBillingAddressData = async () => {
        const res = await _get(get_user_billing_addresses)
        if (res && res?.status) {
            setBillingAddressData(res?.data?.data)
        } else {
            setBillingAddressData([])
        }
    }
    useEffect(() => {
        fetchShippingAddressData();
        fetchBillingAddressData();
    }, [])

    const { sendData: getbilling_addresses }: any = useRead({
        selectMethod: "get",
        url: getbillingAddressesUrl,
    });

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

    console.log(billingAddresses, "dsrtgrd5f561")
    let shippingAddresses =
        getshipping_addresses?.length && getshipping_addresses?.[0]?.shipping.length
            ? getshipping_addresses?.[0]?.shipping.map((v: any) =>
                addressDataModify(JSON.parse(v?.meta_data), v?.id)
            )
            : null;

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
            _SUCCESS(`Billing address is updated successfully`);
            setFormData(initialFormData);
            if (editIdBilling) {
                setEditIdBilling(null);
            }
            setUpdateBillingAddressUrl(null);
            setSideBarOpen(false);
            setGetbillingAddressesUrl(get_user_billing_addresses);
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


    const handleEditClick = (data: any, type: number = 1) => {
        setErrors({});
        // Logic for handling edit button click
        if (data) {
            const parseData = JSON.parse(data?.meta_data)
            // if (type == 1) {
            setEditId(+data?.id);
            setSideBarOpen(true);
            setFormData(parseData);
            setShipingToBilling(true);
            // }

            // if (type == 2) {
            // setEditIdBilling(+data?.id);
            // setSideBarOpen(true);
            // setFormData(data);
            // setShipingToBilling(false);
            // }
            // } else {
            // _ERROR("Something went to wrong");
            // if (type == 2) {
            //     // setEditIdBilling(+data?.id);
            //     setSideBarOpen(true);
            //     setFormData(data);
            //     setShipingToBilling(false);
            // }
        }
    };

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
            // console.log(res, update_shipping_address, "sded")

            if (res?.data?.success) {

                setGetShippingAddressesUrl(get_user_shipping_addresses)
                _SUCCESS("Set as default address")
            }


        } catch (error) {
            console.log('error: ', error);
        }

    }

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

    const handleDeleteClick = (id: string) => {
        // Logic for handling delete button click
        setDeleteId(+id);

        setAddShippingAddressUrl(delete_shipping_address);

    };

    const fetchPostCodeDataDebounced = useCallback(
        debounce(fetchPostCodeData, 300),
        [formData?.postcode]
    );

    useEffect(() => {

        fetchPostCodeDataDebounced();

    }, [formData?.postcode, fetchPostCodeDataDebounced]);

    useEffect(() => {
        if (formData?.default) {
            setDefaultAddress(formData?.default);
        }
    }, [formData]);

    useEffect(() => {
        if (getShippingAddressesUrl === get_user_shipping_addresses) {
            setGetShippingAddressesUrl();
        }
    }, [getShippingAddressesUrl]);


    useEffect(() => {
        if (addAddress && addAddress?.id) {
            fetchShippingAddressData()
            console.log(addAddress, "df35431")
        }
    }, [addAddress, addAddress?.id])
    return (
        <>
            <div className="container">
                <div className="my-account mt-3">
                    <div className="tm-w-full w-100 d-flex justify-content-between ">
                        <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Shipping Address</h3>

                        <div>
                            {shippingAddressData && shippingAddressData?.[0]?.shipping?.length !== 0 &&
                                <button className="show-btn1 mb-3 h-fit"
                                    onClick={() => {
                                        setErrors({});
                                        setSideBarOpen(true);
                                        setEditId(null);
                                    }}
                                >
                                    <i className="fa-solid fa-plus" style={{ paddingLeft: "8px", padding: "4px" }}></i>
                                    <span style={{ paddingRight: "9px" }}>Add Address</span>
                                </button>
                            }

                            <button className="show-btn1 h-fit"
                                onClick={() => router.push('/myaccount')}
                            >
                                <i className="fa-solid fa-arrow-left-long" style={{ paddingLeft: "8px", padding: "4px" }}></i>
                                <span style={{ paddingRight: "9px" }}>back</span>
                            </button>
                        </div>
                    </div>

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

                                    {(shippingAddressData && shippingAddressData?.[0]?.shipping?.length === 0) ? (
                                        <div
                                            className="singAddress_box deshborder"
                                            onClick={() => {
                                                setErrors({});
                                                setSideBarOpen(true);
                                                setEditId(null);
                                            }}
                                        >
                                            <button className="address_addbtn">
                                                <span className="icon">
                                                    <i className="fa-solid fa-plus"></i>
                                                </span>
                                                <h4 className="head">Add address</h4>
                                            </button>
                                        </div>

                                    ) : (
                                        ""
                                    )}
                                    {/* 
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
                                    }) : null} */}

                                </div>
                            </div>

                            {/* <div className="address-card-container">
                                {shippingAddressData?.length
                                    ? shippingAddressData.map((v: any) =>
                                        v?.shipping?.length
                                            ? v?.shipping.map((itm: any, idx: number) => {
                                                const value = JSON.parse(itm?.meta_data);
                                                return (
                                                    <Card key={idx} className="address-card">
                                                        <CardContent>
                                                            <Typography variant="h6" className="card-title">
                                                                {value?.first_name} {value?.last_name}
                                                            </Typography>
                                                            <Typography variant="body2" className="card-text">
                                                                {value?.address_1}
                                                                <br />
                                                                {value?.landmark}, {value?.state}, {value?.postcode}
                                                            </Typography>
                                                            <Typography variant="body2" className="card-text">
                                                                <strong>Phone:</strong> {value?.phone || "--"}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })
                                            : null
                                    )
                                    : null}
                            </div> */}
                            {shippingAddressData && shippingAddressData?.[0]?.shipping?.length !== 0 &&
                                < div className="address-card-container -mt-1">
                                    {shippingAddressData && shippingAddressData?.[0]?.shipping?.length
                                        ? shippingAddressData.map((v: any) =>
                                            v?.shipping?.length
                                                ? v?.shipping.map((itm: any, idx: number) => {
                                                    const value = JSON.parse(itm?.meta_data);
                                                    return (
                                                        <Card key={idx} className="address-card">
                                                            <CardContent>
                                                                {/* Name */}
                                                                <div className="card-header">
                                                                    <Typography variant="h6" className="card-title flex items-center justify-between" style={{ textTransform: "uppercase", color: "#de398f" }}>
                                                                        {value?.first_name} {value?.last_name}
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => {
                                                                                setErrors({});
                                                                                handleEditClick(itm);
                                                                                setShiping_Id(itm?.id);
                                                                            }}
                                                                        >
                                                                            <EditIcon sx={{ color: "#475569" }} />
                                                                        </IconButton>
                                                                    </Typography>
                                                                </div>

                                                                {/* Address */}
                                                                <div className="card-row flex items-start justify-start gap-2 text-justify">
                                                                    <LocationOnIcon style={{ color: "#e4509d" }} />:
                                                                    <Typography variant="body2" className="card-text" style={{ fontWeight: "600", color: "#9CA3AF", textTransform: "capitalize" }}>
                                                                        {value?.address_1}
                                                                        <br />
                                                                        {value?.landmark}, {value?.state}, {value?.postcode}
                                                                    </Typography>
                                                                </div>

                                                                {/* Phone */}
                                                                <div className="card-row flex items-center justify-start gap-2 text-justify">
                                                                    <PhoneIcon style={{ color: "#e4509d" }} />:
                                                                    <Typography variant="body2" className="card-text" style={{ fontWeight: "600", color: "#9CA3AF" }}>
                                                                        +91 {value?.phone || "--"}
                                                                    </Typography>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                })
                                                : null
                                        )
                                        : null}
                                </div>}


                        </div>

                    </div>
                </div>


            </div >



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
                                        // checked={formData?.default}
                                        name="default"
                                        value={formData?.default}
                                        style={{ cursor: "pointer" }}
                                        onChange={(e: any) =>
                                            setFormData((prevData: any) => ({
                                                ...prevData,
                                                default: e.target.checked,
                                            }))
                                        }
                                    // onClick={(e: any) =>
                                    //     defaultAddress
                                    //         ? setDefaultAddress(false)
                                    //         : setDefaultAddress(true)
                                    // }
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
                            // onClick={() =>
                            //     billing
                            //         ? handleSaveBillig(2)
                            //         : (handleSaveBillig(1),
                            //             handleSaveShipping())
                            // }

                            onClick={() =>
                                handleSaveShipping()
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
                            Are you sure you want1 to remove{" "}
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
        </>
    )
}

export default ShippingAddress