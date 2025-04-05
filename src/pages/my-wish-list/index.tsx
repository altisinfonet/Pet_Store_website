import { useRouter } from 'next/router';
import React, { useState } from 'react'
import Wishlist from '../../containers/client/wishList';

const MyWishList = () => {
    const router = useRouter();
    const [otherView, setOtherView] = useState<any>("Wishlist");

    return (
        <div className="container">
            <div className="my-account mt-3">
                <div className="tm-w-full  w-100 d-flex justify-content-between ">
                    <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Wishlist</h3>
                    <button className="show-btn1 mb-3 h-fit"
                        onClick={() => router.push('/myaccount')}
                    >
                        <i className="fa-solid fa-arrow-left-long" style={{ paddingLeft: "8px", padding: "4px" }}></i>
                        <span style={{ paddingRight: "9px" }}>back</span>
                    </button>
                </div>

                <div
                    className={`tab-pane fade ${otherView === "Wishlist" ? "show active" : ""
                        }`}
                    id="v-pills-settings-My-Wishlist"
                    role="tabpanel"
                    aria-labelledby="v-pills-save-for-later"
                >
                    <Wishlist listType="WISHLIST" location={"account"} />
                </div>
            </div>
        </div>
    )
}

export default MyWishList