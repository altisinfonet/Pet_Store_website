import React, { useEffect, useState } from 'react'
import emptyBox from '../../../public/assets/images/emptyBox.png'
import { useRead } from '../../hooks';
import getUrlWithKey from '../../util/_apiUrl';
import Image from 'next/image';
import NoOrderImage from "../../../public/assets/images/no_order_found.jpg"
import Link from 'next/link';
import { useRouter } from 'next/router';
import { _post } from '../../services';
import { Pagination, Tooltip, Typography, Select, MenuItem } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from 'axios';
import { convertDateString } from '../../util/_common';
import brandDam from "../../../public/assets/images/brandDam.png";
import trackingCar from '../../../public/assets/icon/trackingCar.svg';
import returnIcon from "../../../public/assets/icon/return.svg"
import cancelOrder from "../../../public/assets/icon/cancelOrder.svg"
import TrackOrderDetails from '../../components/TrackOrderDetails';
import OrderDetailsShow from '../../containers/client/OrderDetailsShow';
import OrderCard from '../order-history';
import Loader from '../../components/CustomLoader';
const MyOrders = () => {
    var currencyFormatter = require('currency-formatter');
    const router = useRouter();
    const { order_list, order_return, update_order, get_single_order, get_order_state } = getUrlWithKey("client_apis")
    const [orderListPayload, setOrderListPayload] = useState({
        page: 1,
        rowsPerPage: 8,
        filter: ""
    });
    const [orderView, setOrderView] = useState(false);
    const [singleOrderDetails, setSingleOrderDetails] = useState<any>();
    const [orderTrackView, setOrderTrackView] = useState(false);
    const [orderTrackID, setOrderTrackID] = useState(null);
    const [otherView, setOtherView]: any = useState("order");
    const [selectedValue, setSelectedValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { sendData: orderDetails }: any = useRead({
        selectMethod: "put",
        url: order_list,
        callData: orderListPayload,
    });

    const { sendData: getOrderState } = useRead({ selectMethod: "get", url: get_order_state })
    const filterArray = getOrderState?.map((ele: any) => ({ value: ele?.title, name: ele?.title })).sort((a: any, b: any) => a.name.localeCompare(b.name));
    const handleChange = (e: any) => {
        setSelectedValue(e.target.value);
        setOrderListPayload({
            page: 1,
            rowsPerPage: 8,
            filter: e.target.value
        });
    };

    const clearFilter = () => {
        setSelectedValue("");
        setOrderListPayload({
            page: 1,
            rowsPerPage: 8,
            filter: ""
        });
    };

    console.log(orderDetails, filterArray, getOrderState, "df41g65sdfsdf56")

    const getSingleOrder = async (id: any) => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    const orderOtherViewFalse = () => {
        setOrderView(false);
        setOrderTrackView(false);
        setOrderTrackID(null);
    };

    const trackYourOrder = (id: any) => {
        if (id) {
            setOrderTrackID(id);
            setOrderTrackView(true);
        }
    };

    const orderListPagenation = (page: any) => {
        setOrderListPayload((pre: any) => ({ ...pre, page: page }));
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const canselOrder = async (id: any) => {
        let url = `${update_order}/${id}`;
        try {
            const data = await _post(url, { status: "cancelled" });
            if (data?.data?.success) {
                setOrderListPayload({
                    page: 1,
                    rowsPerPage: 8,
                    filter: ""
                });
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
                    filter: ""
                });
            }
        } catch (error) {
            console.log(error, "__error");
        }
    };

    const handleCardClick = (orderId: string, isReturn: boolean) => {
        // router.push(`/order-history/order-details/${orderId}?isReturn=${isReturn}`);
        let url = `/order-history/order-details/${orderId}`;

        if (isReturn !== undefined) {
            url += `?isReturn=${isReturn}`;
        }
        router.push(url);
    };

    useEffect(() => {
        if (orderDetails?.totalPage?.length == 0) {
            setOrderListPayload({
                page: 1,
                rowsPerPage: 8,
                filter: ""
            });
        }
    }, [orderDetails?.orders]);

    useEffect(() => {
        if (!orderDetails) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [orderDetails]);


    return (
        <div className="container">
            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <Loader />
                </div>
            ) :
                (
                    <div className="my-account mt-3">
                        <div className="tm-w-full mb-4 w-100 d-flex justify-content-between">
                            <h3
                                style={{ paddingRight: "9px" }}
                                className="w-fit sp-title accountHeader"
                            >
                                Orders
                            </h3>
                            <button
                                className="show-btn1 mb-3 h-fit"
                                onClick={() => router.push("/myaccount")}
                            >
                                <i
                                    className="fa-solid fa-arrow-left-long"
                                    style={{ paddingLeft: "8px", padding: "4px" }}
                                ></i>
                                <span style={{ paddingRight: "9px" }}>back</span>
                            </button>
                        </div>

                        {/* Filter section */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
                            {/* Dropdown Container */}
                            <div style={{ position: "relative", width: "190px" }}>
                                {/* Custom Button UI */}
                                <button
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        padding: "10px 16px",
                                        color: "white",
                                        backgroundColor: "transparent",
                                        borderRadius: "8px",
                                        boxShadow: "0px 6px 10px rgba(232, 3, 153, 0.2)",
                                        border: "1px solid #e4509d",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <FilterAltIcon style={{ width: "20px", height: "20px", color: "#e4509d" }} />
                                        <span style={{ fontSize: "18px", color: "#e4509d", textTransform: "capitalize", fontWeight: "bold" }}>
                                            {selectedValue ? selectedValue : "Filters"}
                                        </span>
                                    </div>
                                    <span style={{
                                        color: "#e4509d",
                                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.3s ease-in-out",
                                        display: "inline-block",
                                    }}
                                    >
                                        <KeyboardArrowDownIcon />
                                    </span>
                                </button>

                                <Select
                                    value={selectedValue}
                                    onChange={handleChange}
                                    style={{
                                        position: "absolute",
                                        top: "0",
                                        left: "0",
                                        opacity: "0",
                                        width: "100%",
                                        height: "100%",
                                        cursor: "pointer",
                                    }}
                                    onOpen={() => setIsOpen(true)}
                                    onClose={() => setIsOpen(false)}
                                >
                                    <MenuItem value="" disabled>
                                        Select a filter
                                    </MenuItem>
                                    {filterArray.map((option) => (
                                        <MenuItem key={option.value} value={option.value} style={{ textTransform: "capitalize", color: "#e4509d", fontSize: "14px", fontWeight: "bold" }}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>

                            {/* Clear Filter Button */}
                            <button
                                onClick={clearFilter}
                                style={{
                                    padding: "10px 16px",
                                    color: "#fff",
                                    backgroundColor: "#e4509d",
                                    border: "1px solid #e4509d",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
                                    transition: "background-color 0.3s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#E80399";
                                    e.currentTarget.style.boxShadow = "0px 6px 12px rgba(232, 3, 153, 0.5)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#e4509d";
                                    e.currentTarget.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.4)";
                                }}
                            >
                                Clear Filter
                            </button>
                        </div>

                        {/* Responsive grid for order cards */}

                        <div className="flex justify-content-start flex-wrap gap-3">
                            {orderDetails?.orders?.length > 0 ?
                                orderDetails?.orders.map((order: any) => (
                                    <OrderCard
                                        key={order.id}
                                        orderId={order.id}
                                        date={order.order_status?.date_created}
                                        items={order.order_items}
                                        total={order.order_status?.total_sales}
                                        status={order.order_status?.order_status?.title}
                                        onClick={() => handleCardClick(order.id, order?.is_returnable)}
                                    // isReturn={order?.is_returnable}
                                    />
                                ))
                                :
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minHeight: "calc(100vh - 450px)",
                                        width: "100%",
                                        padding: "20px",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "350px",
                                            padding: "30px",
                                            backgroundColor: "#fff",
                                            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                                            borderRadius: "12px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {/* No Orders Image/GIF */}
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            marginBottom: "16px",
                                        }}>
                                            <img
                                                src={NoOrderImage?.src}
                                                alt="No Orders"
                                                style={{
                                                    width: "40%",
                                                    maxWidth: "150px",
                                                    height: "120px",
                                                    marginBottom: "16px",
                                                    borderRadius: "50%",
                                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>

                                        <Typography
                                            variant="h6"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "clamp(16px, 2vw, 20px)",
                                                color: "#E8036b",
                                            }}
                                        >
                                            No Orders Found!
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            style={{
                                                marginTop: "10px",
                                                fontSize: "clamp(12px, 1.8vw, 16px)",
                                                color: "lightgray",
                                            }}
                                        >
                                            You haven’t placed any orders yet. Start{" "}
                                            <Link
                                                href="/"
                                                style={{
                                                    // color: "gray",

                                                    fontWeight: "bold",
                                                    textDecoration: "none",
                                                    transition: "color 0.3s ease-in-out",
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.color = "#c1027a")}
                                                onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                                            >
                                                shopping now!
                                            </Link>
                                        </Typography>
                                    </div>
                                </div>
                            }

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

                    </div>
                )}
        </div>


    )
}

export default MyOrders