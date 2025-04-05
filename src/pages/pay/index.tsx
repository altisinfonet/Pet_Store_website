import axios from "axios";
import { useEffect, useState } from "react";
import React from 'react'
import RenderRazorpay from "../../components/RenderRazorpay";
import MetaHead from "../../templates/meta";


const Pay = () => {
    const [displayRazorpay, setDisplayRazorpay] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        razorpayOrderId: null,
        currency: null,
        amount: null,
    });

    const handleCreateOrder = async (amount, currency) => {
        const data: any = await axios.post('http://localhost:8080/api/v1/create/order-id',
            {
                amount: amount * 100,
                currency
            }
        );

        if (data && data?.data && data?.data?.data && data.data.data.orderId) {
            setOrderDetails({
                razorpayOrderId: data.data.data.orderId,
                currency: data.data.data.currency,
                amount: data.data.data.amount,
            });
            setDisplayRazorpay(true);
        };
    }

    return (
        <div>
            <MetaHead meta_title="place order" meta_description="place order" keywords={"keywords"} />
            <button
                className="btn btn-primary"
                onClick={() => handleCreateOrder(100, 'INR')}
            >Place Order
            </button>

            {displayRazorpay && (
                <RenderRazorpay
                    amount={orderDetails.amount}
                    orderId={orderDetails.razorpayOrderId}
                    currency={orderDetails.currency}
                    razorpayOrderId={orderDetails.razorpayOrderId}
                    keyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}
                    keySecret={process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET}
                />)
            }
        </div>
    );
}
export default Pay;