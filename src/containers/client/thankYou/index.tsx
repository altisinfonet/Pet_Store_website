import Image from 'next/image';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import brandDam from "../../../../public/assets/images/brandDam.png"
import Link from 'next/link';
import useTabView from '../../../hooks/useTabView';
import { setThankyouAddress } from '../../../reducer/thankyouAddressReducer';
import { useDispatch } from 'react-redux';
import moment from 'moment';

const ThankYouPage = () => {

    const router = useRouter()
    const { tabView, mobView } = useTabView()
    const dispatch = useDispatch()

    const [estimated_time, setEstimated_time] = useState("");

    const thanksData = useSelector((state: any) => state?.thankyouReducer?.value);
    const thanksAddressData = useSelector((state: any) => state?.thankyouAddressReducer?.value);
    console.log(thanksAddressData, thanksData, "5g4f41thanksData")

    var currencyFormatter = require('currency-formatter');

    // const thanksData = {
    //     "payment_method": "cod",
    //     "total": 495,
    //     "Date": "Thursday, April 18, 2024",
    //     "order_number": "98",
    //     "order_items": [
    //         {
    //             "name": "TRUELOVE CAT & SMALL DOG HARNESS (ORANGE)",
    //             "quantity": 1,
    //             "price": "825"
    //         }
    //     ]
    // }

    console.log(thanksAddressData, thanksData, 'thansdgvsksData')


    useEffect(() => {
        if (!thanksData?.order_number) {
            router.push("/")
            dispatch(setThankyouAddress({}))
        }
    }, [thanksData?.order_number])

    const addDays = (date: Date, days: number): Date => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    // const totalAmount = thanksData && thanksData?.order_items && thanksData?.order_items?.reduce((total: number, item: any) => {
    //     return total + (item.total_product_amount || 0);
    // }, 0);
    
    const totalAmount = thanksData?.order_items?.reduce((total: number, item: any) => {
        return total + (Number(item.total_product_amount) || 0);
    }, 0) || 0;

    console.log(thanksData, totalAmount, "d3f65h4g6df")

    useEffect(() => {
        const initialDate = new Date(thanksData?.date);
        const newDate = addDays(initialDate, 2);
        setEstimated_time(moment(newDate).format('MMM DD YYYY'));
    }, [thanksData?.date])

    return (
        <>
            {!thanksData?.order_number ? null :
                <section className='thank thank-Youbg'>
                    <div className="container">
                        <div className="contact-card">
                            <div className="card-body">
                                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>

                                <h2 className='thank-title text-center pt-3 m-0'>Order placed successfully!</h2>
                                <p className='store-para-thank text-center py-2 mb-0'>We have sent you a confirmation email with the order details</p>
                                <ul className='thank-ul p-0 m-0'>
                                    <li className=' p-0 m-0 border-0'>
                                        <strong className='store-title you'><span style={{ textTransform: "none" }}>Order ID:</span> <span className='color-e4509d'>#{thanksData?.order_number}</span></strong>
                                    </li>
                                </ul>
                                {/* <p className='store-para text-center'>Thanks a bunch for filling that out. It means a lot to us, just like you do! <br /> We really appreciate you giving us a moment of your time today. Thanks for being you.</p> */}
                                <ul className='thank-ul pt-2'>

                                    <li >
                                        <span className='store-title you'>Date: </span> <strong className='color-e4509d'>{thanksData?.date}</strong>
                                    </li>
                                    <li >
                                        <span className='store-title you'>Total payble: </span> <strong className='color-e4509d'><span ><span >₹</span>{currencyFormatter.format((thanksData?.total), { code: '' })}</span></strong>
                                    </li>
                                    <li className='border-0'>
                                        <span className='store-title you'>Payment method: </span> <strong className='color-e4509d'>{thanksData?.payment_method}</strong>
                                    </li>
                                </ul>

                                <div className="row">
                                    <div className="col-md-1"></div>
                                    <div className="col-md-10">
                                        <div className='productThankCard'>
                                            {thanksData?.order_items?.length ? thanksData?.order_items.map((v: any, i: number) =>
                                                <div key={i}>
                                                    {/* borderProdTnks */}
                                                    <div className={mobView ? `flex items-start flex-col gap-2 w-full` : `flex items-start gap-2 w-full`}>
                                                        <div style={{ border: "1px solid #e4509d50", width: "80px", height: "80px" }} className='p-2 rounded truncate'>
                                                            <Image src={v?.image?.src || brandDam} alt={v?.image?.name || "product-image"} width={192} height={108} style={{ height: "auto", width: "auto" }} />
                                                        </div>
                                                        <p className='flex flex-col items-start w-full m-0 pe-0'>
                                                            <span className='text-black flex flex-flex-wrap items-center justify-between w-full'>
                                                                <span><Link className='text-black' href={`/product/${v?.slug}`}>{v?.name}</Link></span>
                                                                <span style={{ fontWeight: "500" }}>₹{currencyFormatter.format((v?.price * v?.quantity), { code: '' })}</span>
                                                            </span>
                                                            <div className='flex gap-4 sm:flex-col'>
                                                                <span className='grid items-center'>
                                                                    <span className='flex items-center gap-2' style={{ fontSize: "16px" }}>
                                                                        <span>Quantity:</span><span className='text-black'>{v?.quantity}</span>
                                                                    </span>

                                                                    <span className='flex items-center gap-2' style={{ fontSize: "16px" }}>
                                                                        <span>Estimated Date:</span><span className='text-black'>{estimated_time}</span>
                                                                    </span>
                                                                </span>
                                                                {v?.promotional_discount_applicable_qty && <span className='flex items-center'><span>Free Item:</span>&nbsp;<span className='text-black'>{v?.promotional_discount_applicable_qty}</span></span>}
                                                                {v?.promotional_discount_amount && <span className='flex items-center'><span>Discount:</span>&nbsp;<span className='text-black'>₹{currencyFormatter.format((+v?.promotional_discount_amount), { code: '' })}</span></span>}
                                                            </div>
                                                        </p>
                                                    </div>
                                                    {i === (thanksData?.order_items?.length - 1) ? null : <hr className='my-2 p-0' />}
                                                </div>) : null}
                                        </div>
                                        <div className={`flex items-start flex-wrap mt-4  ${mobView ? 'gap-2 flex-row' : 'gap-4 flex-row'}`}>
                                            <div className={`px-2 ${mobView ? `width-100` : `width-100`}`}>
                                                {thanksData?.order_items &&
                                                    <p className='p-0 m-0 flex items-center justify-between' style={{ fontSize: "16px", fontWeight: "500", }}>
                                                        <span style={{ width: "50%", fontWeight: "600", }}>Total Amount:</span>
                                                        <span style={{ fontWeight: "bold", color: "#000", width: "50%", textAlign: "right" }}>
                                                            {`₹${currencyFormatter.format((+totalAmount), { code: '' })}`}</span>
                                                    </p>
                                                }
                                                {/* {thanksData?.couponDetails?.code &&
                                                    <p className='p-0 m-0 flex items-center justify-between' style={{ fontSize: "16px", fontWeight: "500", }}>
                                                        <span style={{ width: "50%" }}>Coupon Code&nbsp;({thanksData?.couponDetails?.code}):</span>
                                                        <span style={{ color: "#09895e", width: "50%", textAlign: "right" }}>
                                                            {thanksData?.couponDetails?.type === "parsentage" ? `${currencyFormatter.format((+thanksData?.couponDetails?.amount), { code: '' })}%` : `₹${currencyFormatter.format((+thanksData?.couponDetails?.amount), { code: '' })}`}</span>
                                                    </p>} */}
                                                {thanksData?.couponDetails === null ? "" :
                                                    <p className='p-0 m-0 flex items-center justify-between' style={{ fontSize: "16px", fontWeight: "500", }}>
                                                        <span style={{ width: "50%" }}>Discount({thanksData?.couponDetails?.code}):</span>
                                                        <span style={{ color: "#9CA3AF", width: "50%", textAlign: "right" }}>
                                                            -₹{currencyFormatter.format((+thanksData?.couponDetails?.discountAmount), { code: '' })}</span>
                                                        <span style={{ color: "#008000" }}>({thanksData?.couponDetails?.type === "parsentage" && `${currencyFormatter.format((+thanksData?.couponDetails?.amount), { code: '' })}%`})</span></p>}
                                                
                                                {/* {thanksData?.deduct_from_wllet && thanksData?.deduct_from_wllet === 0 ? ""
                                                    :
                                                    <p className='p-0 m-0 flex items-center justify-between' style={{ fontSize: "16px", fontWeight: "500", }}>
                                                        {thanksData?.deduct_from_wllet && <span style={{ width: "50%" }}>Deduct From Wallet:</span>}
                                                        {thanksData?.deduct_from_wllet &&
                                                            <span style={{ color: "#9CA3AF", width: "50%", textAlign: "right" }}>
                                                            -₹{currencyFormatter.format((thanksData?.deduct_from_wllet !==0 && +thanksData?.deduct_from_wllet), { code: '' })}</span>}
                                                    </p>
                                                } */}

                                                {thanksData?.deduct_from_wllet !== 0 && thanksData?.deduct_from_wllet !== undefined && (
                                                    <p className='p-0 m-0 flex items-center justify-between' style={{ fontSize: "16px", fontWeight: "500" }}>
                                                        <span style={{ width: "50%" }}>Deduct From Wallet:</span>
                                                        <span style={{ color: "#9CA3AF", width: "50%", textAlign: "right" }}>
                                                            -₹{currencyFormatter.format(+thanksData?.deduct_from_wllet, { code: '' })}
                                                        </span>
                                                    </p>
                                                )}

                                                {thanksData?.shipping_total === "0" ? "" : <p className='p-0 m-0 flex items-center justify-between' style={{ fontSize: "16px", fontWeight: "500", }}><span style={{ width: "50%" }}>Shipping Charge:</span><span style={{ color: "#9CA3AF", width: "50%", textAlign: "right" }}>{`₹${currencyFormatter.format((+thanksData?.shipping_total), { code: '' })}`}
                                                </span></p>}
                                                <hr className='my-1 p-0' />
                                                <p className='p-0 m-0 flex items-center justify-between' style={{ fontSize: "16px", fontWeight: "500", }}>
                                                    <span style={{ width: "50%" }}>
                                                        Total
                                                        {/* Price To be Paid */}
                                                    </span>
                                                    <strong className='color-e4509d' style={{ width: "50%", textAlign: "right" }}>
                                                        {/* thanksData?.payment_method ==="Wallet + Razorpay" === "Wallet" || thanksData?.payment_method === "razorpay" ? `₹00.00` : "payment_method": "Wallet + Razorpay", */}

                                                        {
                                                            `₹${currencyFormatter.format((thanksData?.total), { code: '' })}`
                                                        }

                                                    </strong>
                                                </p>
                                            </div>

                                            <hr className='my-0 p-0 width-100' />

                                            <div className={`px-2 ${mobView ? `width-100` : `width-100`}`}>
                                                {/* {thanksAddressData?.billing?.first_name ? */}
                                                {/* <>
                                                        <h1 style={{ fontSize: "14px" }} className='mb-1 m-0'>Billing Address</h1>
                                                        <div style={{ fontSize: "14px" }}>
                                                            {thanksAddressData?.billing?.first_name && <p className='p-0 m-0'>{thanksAddressData?.billing?.first_name + " " + thanksAddressData?.billing?.last_name}</p>}
                                                            {thanksAddressData?.billing?.phone && <p className='p-0 m-0'><span>Phone:</span>&nbsp;<span>{thanksAddressData?.billing?.phone}</span></p>}
                                                            {thanksAddressData?.billing?.email && <p className='p-0 m-0'><span>Email:</span>&nbsp;<span>{thanksAddressData?.billing?.email}</span></p>}
                                                            <p className='p-0 m-0'>{thanksAddressData?.billing?.state},&nbsp;{thanksAddressData?.billing?.city},&nbsp;{thanksAddressData?.billing?.postcode}</p>
                                                        </div>
                                                    </> */}
                                                {/* : */}
                                                <>
                                                    <h2 style={{ fontSize: "26px", fontWeight: "600", textDecoration: "underline" }} className='mb-1 m-0'>Shipping Address:</h2>
                                                    <div style={{ fontSize: "14px" }}>
                                                        {thanksAddressData?.shipping?.first_name && <p className='p-0 m-0'><span style={{ fontWeight: "600", }}>Name:</span>&nbsp;{thanksAddressData?.shipping?.first_name + " " + thanksAddressData?.shipping?.last_name}</p>}
                                                        {thanksAddressData?.shipping?.phone && <p className='p-0 m-0'><span style={{ fontWeight: "600", }}>Phone:</span>&nbsp;<span>{thanksAddressData?.shipping?.phone}</span></p>}
                                                        {thanksAddressData?.shipping?.email && <p className='p-0 m-0'><span style={{ fontWeight: "600", }}>Email:</span>&nbsp;<span>{thanksAddressData?.shipping?.email}</span></p>}
                                                        {thanksAddressData?.shipping?.address_1 && <p className='p-0 m-0'><span style={{ fontWeight: "600", }}>Address:</span>&nbsp;<span>{thanksAddressData?.shipping?.address_1}</span>,</p>}
                                                        <p className='p-0 m-0'>{thanksAddressData?.shipping?.state},&nbsp;{thanksAddressData?.shipping?.city},&nbsp;{thanksAddressData?.shipping?.postcode}</p>
                                                    </div>
                                                </>
                                                {/* } */}
                                            </div>
                                        </div>
                                        <div className="table-responsive mt-4 mb-3">

                                        </div>
                                    </div>
                                    <div className="col-md-1"></div>
                                </div>





                                <div className="thank-op">
                                    <div className="">
                                        <button className='show-btn' onClick={() => router.push("/")}>Home</button>
                                    </div>
                                    <div className="">
                                        <button className='show-btn' onClick={() => router.push("/myaccount")}>My&nbsp;Account</button>
                                    </div>
                                </div>




                            </div>
                        </div>



                    </div>

                </section>
            }

        </>
    )
}

export default ThankYouPage

