import { useEffect, useRef } from 'react';
import crypto from 'crypto-js';
import Axios from 'axios';
import getUrlWithKey from '../../util/_apiUrl';
import { _ERROR, _SUCCESS } from '../../util/_reactToast';
import { useDispatch } from 'react-redux';
import { setThankyou } from '../../reducer/thankyouReducer';
import { useRouter } from 'next/navigation';

// Function to load script and append in DOM tree.
const loadScript = (src: any) => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
        resolve(true);
    };
    script.onerror = () => {
        resolve(false);
    };
    document.body.appendChild(script);
});


const RenderRazorpay = ({
    razorpayOrderId,
    orderId,
    keyId,
    keySecret,
    currency,
    amount,
}: any) => {
    const paymentId = useRef(null);
    const paymentMethod = useRef(null);
    const { payment } = getUrlWithKey("client_apis")
    const dispatch = useDispatch()
    const router = useRouter();

    // To load razorpay checkout modal script.
    const displayRazorpay = async (options: any) => {
        const res = await loadScript(
            'https://checkout.razorpay.com/v1/checkout.js',
        );

        if (!res) {
            return;
        }
        // All information is loaded in options which we will discuss later.
        const rzp1 = (window as any).Razorpay(options);
        // const rzp1 = new window.Razorpay(options);

        // If you want to retreive the chosen payment method.
        rzp1.on('payment.submit', (response: any) => {
            paymentMethod.current = response.method;
        });

        // To get payment id in case of failed transaction.
        rzp1.on('payment.failed', (response: any) => {
            paymentId.current = response.error.metadata.payment_id;
        });

        // to open razorpay checkout modal.
        rzp1.open();
    };


    // informing server about payment
    const handlePayment = async (status: any, orderDetails: any = {}) => {
        try {
            const res: any = await Axios.post(payment,
                {
                    status,
                    orderDetails,
                }, { withCredentials: true });

            let resData = res && res?.data && res?.data?.data;
            if (resData?.paymentStatus === "succeeded") {
                _SUCCESS("Your Order has been placed successfully")
                dispatch(setThankyou(resData))
                setTimeout(() => router.push("/thankyou"), 700);
            } else {
                _ERROR(`Order ${resData?.paymentStatus}`);
                // setTimeout(() => router.push("/"), 700);
                if (resData?.paymentStatus === "failed" || resData?.paymentStatus === "timedout" || resData?.paymentStatus === "cancelled") {
                    router.push("/retry");
                }
            }
        } catch (error) {
            console.log(error, "__error")
        }
    };


    // we will be filling this object in next step.
    const options = {
        key: keyId, // key id from props
        amount, // Amount in lowest denomination from props
        currency, // Currency from props.
        name: 'Pink Store', // Title for your organization to display in checkout modal
        // image, // custom logo  url
        order_id: razorpayOrderId, // order id from props
        // This handler menthod is always executed in case of succeeded payment
        handler: (response: any) => {
            paymentId.current = response.razorpay_payment_id

            // Most important step to capture and authorize the payment. This can be done of Backend server.
            const succeeded =
                crypto.HmacSHA256(`${razorpayOrderId}|${response.razorpay_payment_id}`, keySecret).toString() ===
                response.razorpay_signature

            // If successfully authorized. Then we can consider the payment as successful.
            if (succeeded) {
                handlePayment('succeeded', {
                    payment_method: "razorpay",
                    razorpay_order_id: razorpayOrderId,
                    payment_id: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                    order_id: orderId,
                    amount: amount / 100
                })
            } else {
                handlePayment('failed', {
                    payment_method: "razorpay",
                    razorpay_order_id: razorpayOrderId,
                    payment_id: response.razorpay_payment_id,
                    order_id: orderId,
                    amount: amount / 100
                })
            }
        },
        modal: {
            confirm_close: true, // this is set to true, if we want confirmation when clicked on cross button.
            // This function is executed when checkout modal is closed
            // There can be 3 reasons when this modal is closed.
            ondismiss: async (reason: any) => {
                // const { reason: paymentReason, field, step, code } = reason && reason.error ? reason.error : {}

                // Reason 1 - when payment is cancelled. It can happend when we click cross icon or cancel any payment explicitly.
                if (reason === undefined) {
                    handlePayment('cancelled', {
                        payment_method: "razorpay",
                        order_id: orderId,
                        amount: amount / 100
                    })
                }
                // Reason 2 - When modal is auto closed because of time out
                else if (reason === 'timeout') {
                    handlePayment('timedout', {
                        payment_method: "razorpay",
                        order_id: orderId,
                        amount: amount / 100
                    })
                }
                // Reason 3 - When payment gets failed.
                else {
                    handlePayment('failed', {
                        payment_method: "razorpay",
                        order_id: orderId,
                        amount: amount / 100
                    })
                    // handlePayment('failed', {
                    //     paymentReason,
                    //     field,
                    //     step,
                    //     code,
                    // })
                }
            },
        },
        // This property allows to enble/disable retries.
        // This is enabled true by default.
        retry: {
            enabled: false,
        },
        timeout: 900, // Time limit in Seconds
        theme: {
            color: '#d9589c', // Custom color for your checkout modal.
        },
    }

    useEffect(() => {
        displayRazorpay(options);
    }, []);

    return null;
};

export default RenderRazorpay;