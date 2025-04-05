import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import getUrlWithKey from '../../util/_apiUrl';
import Image from 'next/image';
import Link from 'next/link';
import emptyBox from '../../../public/assets/images/emptyBox.png'
import brandDam from "../../../public/assets/images/brandDam.png";
import { useRead } from '../../hooks';
import { Rating, Stack } from '@mui/material';
const RecentlyViewedItems = () => {
    const router = useRouter();
    const { get_wish_list } = getUrlWithKey("client_apis");
    const [otherView, setOtherView] = useState<any>("recentviewitem");
    const [get_wish_list_url, setGet_wish_list_url]: any = useState();
    const [wishListMeta, setWishListMeta]: any = useState();
    const { sendData: getWishListRVI }: any = useRead({
        selectMethod: "put",
        url: get_wish_list_url,
        callData: wishListMeta,
    });

    useEffect(() => {
        setGet_wish_list_url(get_wish_list);
        setWishListMeta({
            page: 1,
            rowsPerPage: 10,
            list_type: "RESENTLYVIEWPRODUCT",
        });
    }, []);
    return (
        <div className="container">
            <div className="my-account mt-3">
                <div className="tm-w-full  w-100 d-flex justify-content-between ">
                    <h3 style={{ paddingRight: "9px" }} className="w-fit sp-title accountHeader">Recently Viewed Item</h3>
                    <button className="show-btn1 mb-3 h-fit"
                        onClick={() => router.push('/myaccount')}
                    >
                        <i className="fa-solid fa-arrow-left-long" style={{ paddingLeft: "8px", padding: "4px" }}></i>
                        <span style={{ paddingRight: "9px" }}>back</span>
                    </button>
                </div>

                <div
                    className={`tab-pane mt-3 fade ${otherView === "recentviewitem" ? "show active" : ""
                        }`}
                    id="v-pills-messages-Recently-Viewed-Items"
                    role="tabpanel"
                    aria-labelledby="v-pills-Recently-Viewed-Items"
                >
                    {getWishListRVI?.products?.length ?
                        <div className="viewedItems_root">

                            {getWishListRVI?.products.map((v: any, i: number) => (
                                <Link
                                    key={i}
                                    href={`/product/${v?.product?.slug}`}
                                    className="storeLocator_card viewedItems"
                                >
                                    <div className="flex items-start justify-start gap-2">
                                        <div style={{
                                            border: "1px solid rgb(212, 212, 212)",
                                            borderRadius: "6px",
                                            width: "20%",
                                            height: "80px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <Image
                                                src={
                                                    v?.product?.images?.length
                                                        ? v?.product?.images[0]?.src
                                                        : brandDam
                                                }
                                                style={{
                                                    width: "auto",
                                                    height: "75px",
                                                }}
                                                alt="productImage"
                                                width={192}
                                                height={108}
                                            />
                                        </div>

                                        <div className="" style={{ width: "75%" }}>
                                            <p className="m-0 p-0 truncate">
                                                {v?.product?.name}
                                            </p>
                                            <div
                                                className="rating"
                                                style={{ width: "fit-content" }}
                                            >
                                                <Stack spacing={1}>
                                                    <Rating
                                                        name="half-rating"
                                                        defaultValue={v?.product?.rating}
                                                        precision={0.5}
                                                        readOnly
                                                        size="small"
                                                    />
                                                </Stack>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        :
                        <div className='flex flex-col items-center justify-center w-full h-full'>
                            <Image src={emptyBox} alt='no_data_ill' width={192} height={108} />
                            <h4 className='flex flex-col items-center justify-center w-full h-full gap-1'>
                                <span style={{ fontSize: '18px' }}>Oops! No recently viewed item found</span>
                                <span style={{ fontSize: '14px' }}>
                                    <Link href='/' className="color-e4509d">Go to homepage</Link>
                                </span>
                            </h4>
                        </div>
                    }
                </div>
            </div >
        </div >
    )
}

export default RecentlyViewedItems