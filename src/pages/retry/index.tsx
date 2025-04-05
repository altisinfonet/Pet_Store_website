import React, { useEffect, useState } from 'react'
import { useCreate } from '../../hooks';
import getUrlWithKey from '../../util/_apiUrl';
import { useRouter } from 'next/navigation';
import MetaHead from '../../templates/meta';

const RetryIndex = () => {
    const { cart_holding } = getUrlWithKey("client_apis");
    const [stockHoldingUrl, setStockHoldingUrl] = useState<any>({});
    const [proceedToCheckOut, setProceedToCheckOut] = useState(false);

    const router = useRouter();
    const { sendData: stockHold, error: stockHoldError }: any = useCreate(stockHoldingUrl);

    useEffect(() => {

        if (stockHold?.type === "hold") {
            setProceedToCheckOut(false);
            router.push("/order");
        }
        // if (logedIn) {
        //     localStorage.setItem("logedId", logedIn?.id);
        //     _SUCCESS("Login Successfull!")
        //     dispatch(setMe(logedIn))
        //     setOpen(false);
        // }

        if (stockHoldError) {
            // _ERROR(logedInError?.massage)
        }
    }, [stockHold, stockHoldError]);

    return (
        <div className='w-full flex items-center justify-center mt-5'>
            <MetaHead meta_title="retry" meta_description="retry" keywords={"keywords"}/>
            <button
                disabled={proceedToCheckOut}
                className="btn btn-primary"
                onClick={() => setStockHoldingUrl({ url: cart_holding, callData: { type: "hold" } })}
            >{proceedToCheckOut ? "Please wait..." : "Retry"}
            </button>
        </div>
    )
}

export default RetryIndex