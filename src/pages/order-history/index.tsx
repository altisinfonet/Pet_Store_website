import React, { useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import Image from "next/image";
import CheckIcon from '@mui/icons-material/Check';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CancelIcon from '@mui/icons-material/Cancel';
import brandDam from "../../../public/assets/images/brandDam.png";
import axios from "axios";
import getUrlWithKey from "../../util/_apiUrl";
import OrderDetailsShow from "../../containers/client/OrderDetailsShow";
import moment from "moment";
import { useRouter } from "next/router";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrackingSteps from "../../containers/client/OrderTrackingSteps";
interface OrderCardProps {
    orderId: string;
    date: string;
    items: {
        order_product_lookup: {
            p_qty: number;
            p_net_revenue: string;
            product: {
                images: { src: string }[];
                name: string;
            };
        };
    }[];
    total: number;
    status: "completed" | "cancelled" | "cancelled without refund" | "pending";
    onClick: () => void;
}

const OrderCardData: React.FC<OrderCardProps> = ({
    orderId,
    date,
    items,
    total,
    status,
    onClick
}) => {
    const { get_single_order } = getUrlWithKey("client_apis")
    const [singleOrderDetails, setSingleOrderDetails] = useState<any>();
    const [orderView, setOrderView] = useState(false);
    const hasScroll = items && items?.length > 0 ? items.length > 2 : 0; // Add scroll if more than 2 items
    const totalItemCount = items && items?.reduce((sum, item) => sum + (item.order_product_lookup?.p_qty || 0), 0);
    console.log(totalItemCount, "df6g2d65f2")
    const router = useRouter()
    const getSingleOrder = async (id: any) => {
        router.push('/my-orders/order-details/' + id)
        // try {
        //     const { data } = await axios.get(`${get_single_order}/${id}`);
        //     if (data?.success) {
        //         setSingleOrderDetails(data?.data);
        //         setOrderView(true);
        //         // setOrderTrackView(false);
        //         // setOrderTrackID(null);
        //     }
        // } catch (error) {
        //     console.error(error);
        // }
    };

    const statusIcon =
        status === "completed" ? (
            <CheckIcon />
        ) : (status === "cancelled" || status === "cancelled without refund") ? (
            <CancelIcon />
        ) : (
            <HourglassBottomIcon />
        );

    return (
        <>
            <Card
                className="orderlistcard_box"
                elevation={3}
                // onClick={() =>
                //     getSingleOrder(orderId,)
                // }
                onClick={onClick}
            // onClick={status !== "cancelled" ? onClick : undefined} // Skip onClick for "cancelled" status
            // style={{
            //     pointerEvents: status === "cancelled" ? "none" : "auto", // Disable interaction
            //     opacity: status === "cancelled" ? 0.6 : 1, // Dim the card
            // }}
            >
                <CardContent style={{ flexGrow: 1 }}>
                    <div className="cardHead">
                        <Typography variant="h6" style={{ fontSize: "16px", fontWeight: "600" }}>
                            Order #{orderId}
                        </Typography>
                        <Typography
                            variant="body2"
                            style={{ fontSize: "12px", color: "gray" }}
                        >
                            {/* {date} */}
                            {moment(date).format('MMM DD, YYYY, hh:mm A')}
                        </Typography>
                    </div>
                    <div
                        className={`mt-3 itemCard_div ${hasScroll ? "overflow-y-auto py-2" : ""
                            }`}
                        style={{
                            maxHeight: hasScroll ? "185px" : "none",
                        }}
                    >
                        {items && items?.map((item, index) => (
                            <>
                                <div
                                    key={index}
                                    className="itemContent_card"
                                >
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={item.order_product_lookup?.product?.images?.[0]?.src || brandDam}
                                            alt={item?.order_product_lookup?.product?.name}
                                            className="object-cover bg-transparent border p-1  rounded shadow-md"
                                            width={65}
                                            height={65}
                                        // style={{ width: "100px", height: "100px" }}
                                        />
                                        <div>
                                            <Typography
                                                variant="body1"
                                                className="font-medium"
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                    maxWidth: "200px",
                                                    wordWrap: "break-word",
                                                    wordBreak: "break-word",
                                                    color: "gray"
                                                }}
                                            >
                                                {item?.order_product_lookup?.product?.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                style={{ marginTop: "2px", fontSize: "12px", color: "#e4509d", fontWeight: "800" }}
                                            >
                                                <i className="fa-solid fa-indian-rupee-sign fa-sm"></i>
                                                {item?.order_product_lookup?.p_net_revenue}
                                            </Typography>
                                        </div>
                                    </div>
                                    <Typography
                                        variant="body2"
                                        style={{ display: "flex", fontSize: "14px", color: "gray" }}
                                    >
                                        Qty: {item?.order_product_lookup?.p_qty}
                                    </Typography>

                                </div>
                            </>
                        ))}

                    </div>
                </CardContent>
                <div
                    className="flex items-center justify-between p-3 border-t"
                    style={{ background: "#f9f9f9" }}
                >
                    <div>
                        <Typography
                            variant="body2"
                            style={{ fontSize: "12px", color: "gray" }}
                        >
                            x{totalItemCount} {totalItemCount > 1 ? "items" : "item"}
                        </Typography>
                        <Typography variant="h6" style={{ fontSize: "15px", fontWeight: "bold" }}>
                            Total: <i style={{ color: "#e4509d" }} className="fa-solid fa-indian-rupee-sign fa-sm" ></i>
                            {/* {total} */}
                            <span style={{ color: "#e4509d" }}>{total}</span>
                        </Typography>
                    </div>
                    <Button
                        variant="outlined"
                        startIcon={statusIcon}
                        size="medium"
                        style={{
                            fontSize: "12px",
                            color:
                                status === "completed"
                                    ? "green"
                                    : (status === "cancelled" || status === "cancelled without refund")
                                        ? "red"
                                        : "orange",
                            borderColor:
                                status === "completed"
                                    ? "green"
                                    : (status === "cancelled" || status === "cancelled without refund")
                                        ? "red"
                                        : "orange",
                        }}
                    >
                        {status?.toUpperCase()}
                    </Button>
                </div>
            </Card>


            {/* {orderView &&
                (
                    <div>
                        <OrderDetailsShow dataSet={singleOrderDetails} />
                    </div>
                )
            } */}

        </>
    );
};

export default OrderCardData;
