import React, { useEffect, useState } from 'react'
import { capitalize, convertDateString } from '../../../util/_common';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import moment from 'moment';
import useIsLogedin from '../../../hooks/useIsLogedin';
import useTabView from '../../../hooks/useTabView';
import brandDam from "../../../../public/assets/images/brandDam.png"
import Link from 'next/link';
import Image from 'next/image';

const OrderDetailsShow = ({ dataSet }: any) => {

    const { logedData } = useIsLogedin()
    const { tabView, mobView } = useTabView()
    console.log(dataSet, "dataSet")

    const [estimated_time, setEstimated_time] = useState("");

    const getSubTotal = () => {
        let total = 0;
        if (dataSet?.order_items?.length) {
            dataSet?.order_items.map((v: any, i: number) => {
                if (v?.order_product_lookup?.p_net_revenue) {
                    total = total + (+v?.order_product_lookup?.p_net_revenue * +v?.order_product_lookup?.p_qty);
                }
            });
        }
        return total;
    }

    const getShipping = () => {
        let s = "50";
        // const total = getSubTotal();
        if (dataSet?.order_status?.total_sales > 500) {
            s = 'FREE Delivery';
        }
        return s;
    }

    const addDays = (date: Date, days: number): Date => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    useEffect(() => {
        if (dataSet?.order_items?.length) {
            // let dateArr = dataSet?.order_items?.map((v:any)=> v)
            console.log(dataSet?.order_status?.date_created, "dateArr")
            const initialDate = new Date(dataSet?.order_status?.date_created);
            const newDate = addDays(initialDate, 2);
            setEstimated_time(moment(newDate).format('MMM DD YYYY'));
        }
    }, [dataSet?.order_items?.length])

    const orderDetailsHtml = () => {
        return (
            <>
                {
                    dataSet?.order_items?.length ? dataSet?.order_items.map((v: any, i: number) => {
                        return (
                            <div key={i} className="flex items-start pb-2" style={{ borderBottom: "1px solid #d4d4d4" }}>
                                <div className='w-100'>
                                    <div className={`flex items-start  ${mobView ? "flex-col" : "flex-row gap-2"}`}>
                                        <div style={{ border: "1px solid #e4509d50", maxWidth: "60px", maxHeight: "60px" }} className='p-2 rounded'>
                                            <Image src={v?.image?.src || brandDam} alt={v?.image?.name || "product-image"} width={192} height={108} className='truncate' style={{ height: "40px" }} />
                                        </div>
                                        <div className={`${mobView ? 'items-start' : 'items-center'} m-0 flex gap-2 product-name`}><Link href={`/product/${v?.slug}`} style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "400" }}>{capitalize(v?.name)}</Link></div>
                                    </div>
                                    <div className="m-0 flex items-center justify-between gap-2 product-des">
                                        {/* {showSize(v?.variation) ? <span>Size: {showSize(v?.variation)}</span> : null} */}
                                        <span style={{ color: "#2d2d2d", fontSize: "18px", fontWeight: "500" }}>Quantity:</span><span style={{ fontSize: "16px", fontWeight: "400" }}>{v?.quantity || "0"}</span>
                                    </div>
                                    <div className="m-0 flex items-center justify-between gap-2 product-price"><span style={{ color: "#2d2d2d", fontSize: "18px", fontWeight: "500" }}>Price:</span><span style={{ fontSize: "16px", fontWeight: "400" }}>₹{(+v?.price * +v?.quantity).toFixed(2)}</span></div>
                                </div>
                            </div>
                        )
                    }) : null
                }
            </>
        )
    }

    const getTotalPrice = () => {
        const sh = getShipping();
        // const total = getSubTotal();

        if (sh === 'Free Shipping') {
            return dataSet?.order_status?.total_sales;
        } else {
            return +dataSet?.order_status?.total_sales + +sh;
        }
    }

    const orderStatusDataBilling = () => {
        return dataSet?.order_status?.billing ? JSON.parse(dataSet?.order_status?.billing) : null
    }

    console.log(orderStatusDataBilling(), "orderStatusDataBilling()")

    const detailsHtml = () => {
        return (
            <div className='account_orderDetails'>

                <div className={`flex flex-col gap-1 glowCardDisable child-1`}>

                    <div className='flex items-center justify-between'>
                        <span className='border-0' style={{ fontSize: "14px", color: "#d8428c", fontWeight: "500" }}>#{dataSet?.id}</span>
                        <span className='border-0' style={{ fontSize: "14px", textAlign: "end", color: "#989898", fontWeight: "500" }}>{moment(dataSet?.order_status?.date_created).format("DD/MM/YYYY")}</span>
                    </div>

                    <hr className='my-1' />

                    {orderDetailsHtml()}

                    <div className=''>
                        <div>
                            <div className="flex items-center justify-between">
                                <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Estimated Date:</span>
                                <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end" }}>{estimated_time}</span>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Subtotal</span>
                                <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end" }}>₹{(+dataSet?.order_status?.net_total).toFixed(2)}</span>
                            </div>
                            {dataSet?.order_status?.coupon?.discountAmount ?
                                <div className={'flex items-center justify-between'}>
                                    <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Discount</span>
                                    <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end", color: "green", fontWeight: "500" }}>-₹{dataSet?.order_status?.coupon?.discountAmount.toFixed(2)}</span>
                                </div> : null}
                            <div className='flex items-center justify-between'>
                                <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Shipping</span>
                                <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end", color: "green", fontWeight: "500" }}>{getShipping() === "FREE Delivery" ? <span><del style={{ color: "#989898" }}>₹50</del> {getShipping()}</span> : `₹` + getShipping()}</span>
                            </div>
                            {dataSet?.order_wallet?.deductFromWallet ?
                                <div className='flex items-center justify-between'>
                                    <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>From wallet</span>
                                    <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end", color: "green", fontWeight: "500" }}>-₹{dataSet?.order_wallet?.deductFromWallet}</span>
                                </div> : null}
                            {dataSet?.order_status?.coupon?.code ? <div className='flex items-center justify-between'>
                                <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Coupon</span>
                                <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end", color: "green", fontWeight: "500" }}>{dataSet?.order_status?.coupon?.code}&nbsp;{dataSet?.order_status?.coupon?.type === "parsentage" ? <>({dataSet?.order_status?.coupon?.amount}%)</> : <>(₹{dataSet?.order_status?.coupon?.amount})</>}</span>
                            </div> : null}
                            <div className='flex items-center justify-between'>
                                <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Payment method</span>
                                <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end", color: "#989898", fontWeight: "500", textTransform: "uppercase" }}>{dataSet?.order_status?.payment_method}</span>
                            </div>
                            <hr className='my-1' />
                            <div className='flex items-center justify-between'>
                                <span className='py-1 px-0 border-0' style={{ color: "#2d2d2d", fontSize: "17px", fontWeight: "500" }}>Total</span>
                                <span className='py-1 px-0 border-0' style={{ fontSize: "16px", textAlign: "end", color: "#d8428c", fontWeight: "500" }}>₹{(+dataSet?.order_status?.total_sales).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='glowCardDisable child-1' style={{ height: "fit-content" }}>
                    <p className='p-0 acc-title1 flex items-center gap-2 m-0'>Billing Address</p>

                    <div className={`${mobView ? 'flex-col' : 'flex-row gap-3'} flex items-center justify-between`}>
                        <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                            <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Name:</span>
                            <span className='py-1 px-0' style={{ fontSize: "80%", }}>{orderStatusDataBilling()?.first_name + " " + orderStatusDataBilling()?.last_name}</span>
                        </div>

                        <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                            <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>City:</span>
                            <span className='py-1 px-0' style={{ fontSize: "80%", }}>{orderStatusDataBilling()?.city}</span>
                        </div>

                    </div>

                    <div className={`${mobView ? 'flex-col' : 'flex-row gap-3'} flex items-center justify-between`}>
                        <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                            <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Pincode:</span>
                            <span className='py-1 px-0' style={{ fontSize: "80%", }}>{orderStatusDataBilling()?.postcode}</span>
                        </div>

                        <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                            <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>State:</span>
                            <span className='py-1 px-0' style={{ fontSize: "80%", }}>{orderStatusDataBilling()?.state}</span>
                        </div>
                    </div>

                    <div className={`${mobView ? 'flex-col' : 'flex-row gap-3'} flex items-center justify-between`}>
                        <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                            <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Phone:</span>
                            <span className='py-1 px-0' style={{ fontSize: "80%", }}>{orderStatusDataBilling()?.phone}</span>
                        </div>

                        <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                            <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Email:</span>
                            <span className='py-1 px-0' style={{ fontSize: "80%", }}>{logedData?.email}</span>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
    return (

        <div>
            {
                dataSet && detailsHtml()
            }
        </div>
    )
}

export default OrderDetailsShow
