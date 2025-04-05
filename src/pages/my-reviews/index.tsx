import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import emptyBox from '../../../public/assets/images/emptyBox.png'
import brandDam from "../../../public/assets/images/brandDam.png";
import { useRead } from '../../hooks';
import getUrlWithKey from '../../util/_apiUrl';
import useIsLogedin from '../../hooks/useIsLogedin';
import { Rating } from '@mui/material';

const MyReviews = () => {
    const router = useRouter();
    const { logedData } = useIsLogedin();
    const { order_list, get_user_review } = getUrlWithKey("client_apis");
    const [otherView, setOtherView] = useState<any>("myreview");
    const [orderList, setOrderList]: any = useState();
    const [orderListPayload, setOrderListPayload] = useState({
        page: 1,
        rowsPerPage: 8,
    });
    const { sendData: getUserReviewDetails }: any = useRead({
        selectMethod: "put",
        url: orderList,
    });

    const { sendData: orderDetails }: any = useRead({
        selectMethod: "put",
        url: order_list,
        callData: orderListPayload,
    });


    useEffect(() => {
        if (orderList === order_list) {
            setOrderList();
        }
    }, [orderList]);

    useEffect(() => {
        setOrderList(`${get_user_review}`);
    }, []);

    return (
        <div className="container">
            <div className="my-account mt-3">
                <div className="tm-w-full  w-100 d-flex justify-content-between ">
                    <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">My Reviews</h3>
                    <button className="show-btn1 mb-3 h-fit"
                        onClick={() => router.push('/myaccount')}
                    >
                        <i className="fa-solid fa-arrow-left-long" style={{ paddingLeft: "8px", padding: "4px" }}></i>
                        <span style={{ paddingRight: "9px" }}>back</span>
                    </button>
                </div>

                <div
                    className={`tab-pane fade ${otherView === "myreview" ? "show active" : ""
                        }`}
                    id="v-pills-settings"
                    role="tabpanel"
                    aria-labelledby="v-pills-settings-tab"
                >
                    <div className="row review gap-2">
                        {getUserReviewDetails?.length ? (
                            getUserReviewDetails.map(
                                (v: any, i: number) => (
                                    <div className="storeLocator_card relative" key={i}>
                                        <div className="flex flex-col">
                                            <div className="flex items-start gap-3">
                                                {/* <Image src={"/assets/images/testimonial-thumb.png"} alt='reviewer_image' width={42} height={42} /> */}
                                                <div className="flex flex-col items-start">
                                                    <div className="flex items-center gap-2">
                                                        {!v?.anonymous ? (
                                                            <p className="m-0 reviewer_name capitalize">
                                                                {logedData?.first_name}&nbsp;
                                                                {logedData?.last_name}
                                                            </p>
                                                        ) : (
                                                            <p className="m-0 reviewer_name">
                                                                Anonymous
                                                            </p>
                                                        )}
                                                        <p className={`m-0 px-3 review_status ${v?.review_status === "PENDING" ? "p_review_status" : "a_review_status"} uppercase`}>{v?.review_status === "PENDING" ? v?.review_status : "Approved"}</p>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <Image
                                                            src={v?.product?.images ? v?.product?.images[0]?.src : brandDam}
                                                            alt={v?.product?.images[0]?.alt || "Prduct Image"}
                                                            width={192}
                                                            height={108}
                                                            style={{ width: "48px", height: "52px" }}
                                                        />
                                                        <Link
                                                            href={`/product/${v?.product?.slug}`}
                                                            className={`truncate w-100`}
                                                            style={{ fontSize: "16px", padding: "2px 0 0 4px" }}
                                                        >
                                                            {v?.product?.name.slice(1, 70)}{v?.product?.name?.length > 69 ? `...` : null}
                                                        </Link>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <Rating
                                                            precision={0.5}
                                                            value={v?.item_rating}
                                                            size="small"
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="reviewer_content_root gap-1">
                                                <span className="reviewer_content">
                                                    {v?.description}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )

                                // <div key={i} className="col-xl-7">
                                //     <div className="acc-card1 mb-4 mt-0">
                                //         <div className="card-body">
                                //             <div className="col-md-6 col-6">
                                //                 <Image src={v?.userReviewImage?.length[0]?.src ? v?.userReviewImage[0]?.src : "/assets/images/testimonial-thumb.png"} alt="cart1" className={``} width={60} height={60} />
                                //             </div>

                                //             <h3 className="ptitle nw"><Link href="javascript:void(0);">{v?.product?.name}</Link></h3>

                                //             <div className="rating">
                                //                 <Stack spacing={1}>
                                //                     <Rating name="half-rating" defaultValue={+(v?.item_rating)} precision={0.5} readOnly />
                                //                 </Stack>
                                //             </div>
                                //             <p className='acc-para'>{v?.description}</p>
                                //         </div>
                                //     </div>
                                // </div>
                            )
                        ) : (
                            <div className='flex flex-col items-center justify-center w-full h-full'>
                                <Image src={emptyBox} alt='no_data_ill' width={192} height={108} />
                                <h4 className='flex flex-col items-center justify-center w-full h-full gap-1'>
                                    <span style={{ fontSize: '18px' }}>Oops! No review found</span>
                                    <span style={{ fontSize: '14px' }}>
                                        <Link href='/' className="color-e4509d">Go to homepage</Link>
                                    </span>
                                </h4>
                            </div>
                        )}
                        <div className="col-md-5"></div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default MyReviews