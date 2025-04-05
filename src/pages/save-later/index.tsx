import { useRouter } from 'next/router';
import React, { useState } from 'react'
import Wishlist from '../../containers/client/wishList';

const SaveLater = () => {
    const router = useRouter();
    const [otherView, setOtherView] = useState<any>("saveforlater");
    return (
        <div className="container">
            <div className="my-account mt-3">
                <div className="tm-w-full  w-100 d-flex justify-content-between ">
                    <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Save For Later</h3>
                    <button className="show-btn1 mb-3 h-fit"
                        onClick={() => router.push('/myaccount')}
                    >
                        <i className="fa-solid fa-arrow-left-long" style={{ paddingLeft: "8px", padding: "4px" }}></i>
                        <span style={{ paddingRight: "9px" }}>back</span>
                    </button>
                </div>

                <div
                    className={`tab-pane fade ${otherView === "saveforlater" ? "show active" : ""
                        }`}
                    id="v-pills-messages-save-for-later"
                    role="tabpanel"
                    aria-labelledby="v-pills-save-for-later"
                >
                    <Wishlist listType="SAVEFORLATER" location={"account"} />
                </div>
            </div >
        </div >
    )
}

export default SaveLater