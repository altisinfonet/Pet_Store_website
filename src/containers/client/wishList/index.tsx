import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import DeleteIcon from '@mui/icons-material/Delete';
import cart11 from "../../../../public/assets/icon/product-11.jpg"
import getUrlWithKey from '../../../util/_apiUrl';
import { useCreate, useRead } from '../../../hooks';
import { capitalize } from '../../../util/_common';
import axios from 'axios';
import { setOpenCart } from '../../../reducer/openCartReducer';
import { _ERROR, _SUCCESS, _WARNING } from '../../../util/_reactToast';
import { useDispatch } from 'react-redux';
import { setOpenAuth } from '../../../reducer/openAuthReducer';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import useTabView from '../../../hooks/useTabView';
import { Dialog, Skeleton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import emptyBox from '../../../../public/assets/images/emptyBox.png'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import useIsLogedin from '../../../hooks/useIsLogedin';
import CloseIcon from '@mui/icons-material/Close';
import Notifyimg from "../../../../public/assets/images/notifyimg.png"

const Wishlist = ({ listType, location }: any) => {

    const { get_wish_list, delete_wish_list, create_cart, create_notify_me } = getUrlWithKey("client_apis")
    const { me: me_url } = getUrlWithKey("auth_apis");

    const dispatch = useDispatch();
    const router = useRouter()
    const { tabView, mobView } = useTabView()

    const getme = useSelector((state: any) => state?.meReducer?.value);
    const { logedData } = useIsLogedin();
    const [get_wish_list_url, setGet_wish_list_url]: any = useState()
    const [wishListMeta, setWishListMeta]: any = useState()
    const [deleteWishListMetaMeta, setDeleteWishListMetaMeta]: any = useState()
    const [delete_wish_list_url, setDelete_wish_list_url]: any = useState()
    const [wishListDeta, setWishListDeta]: any = useState([])
    const [productDataid, SetProductDataid] = useState<any>("")
    const [clickNotify, setClickNotify] = useState<boolean>(false);
    const [emial_id, setEmailID] = useState<any>("");
    const [phone_no, setPhone_no] = useState<any>("");
    const [emial_idErr, setEmailIDErr] = useState<any>("");
    const [phone_noErr, setPhone_noErr] = useState<any>("");

    console.log(wishListDeta, "getHomePageBannergetHomePageBanner")
    const { sendData: getWishList, error: wishListError, loading: wishListLoading }: any = useRead({ selectMethod: "put", url: get_wish_list_url, callData: wishListMeta });
    const { sendData: deleteWishListDeta }: any = useCreate({ url: delete_wish_list_url, callData: deleteWishListMetaMeta });

    useEffect(() => {
        setGet_wish_list_url(get_wish_list)
        setWishListMeta({ page: 1, rowsPerPage: 9, list_type: listType })
    }, [deleteWishListDeta, getme])

    useEffect(() => {
        if (listType === "SAVEFORLATER") {
            setGet_wish_list_url(get_wish_list)
            setWishListMeta({ page: 1, rowsPerPage: 9, list_type: listType })
        }
    }, [listType, get_wish_list, getme])

    useEffect(() => {
        setDeleteWishListMetaMeta()
        setDelete_wish_list_url()
    }, [deleteWishListDeta])


    useEffect(() => {
        const fetchMe = async () => {
            try {
                const { data } = await axios.get(me_url, { withCredentials: true });
                if (data?.success && !data?.data?.id) {
                    router.push("/")
                    _WARNING("Please login")
                }
            } catch (error) {
                console.error(error, "me_error");
                if (error && error?.response?.status === 401) {
                    router.push("/")
                    _WARNING("Please login")
                }
            }
        }
        fetchMe();
    }, [])


    //**create cart start */

    const [createCartUrl, setCreateCartUrl]: any = useState()
    const [createCartBody, setCreateCartBody]: any = useState({})


    const { sendData: createCart, error: cartError }: any = useCreate({ url: createCartUrl, callData: createCartBody });

    const onCreateCart = async ({ id, v_id }: any) => {
        if (createCartUrl !== create_cart) {
            setGet_wish_list_url(get_wish_list)
            setWishListMeta({ page: 1, rowsPerPage: 9, list_type: listType })
            setCreateCartUrl(create_cart)
            setCreateCartBody({
                product_id: id,
                variation_id: v_id || null,
                quantity: 1
            })
        }

    }

    useEffect(() => {
        setGet_wish_list_url(get_wish_list)
        setWishListMeta({ page: 1, rowsPerPage: 9, list_type: listType })
    }, [createCartBody, createCartUrl, getme])


    useEffect(() => {
        if (createCartUrl === create_cart) {
            setCreateCartUrl()
        }
    }, [createCartUrl])

    useEffect(() => {
        if (createCart) {
            dispatch(setOpenCart(true))
        }
    }, [createCart])


    useEffect(() => {
        if (cartError?.massage) {
            _WARNING(cartError?.massage)
        }
    }, [cartError])

    //**create cart end */

    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [more, setMore] = useState(false)

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const windowHeight = window.innerHeight;
    //         const documentHeight = document.documentElement.scrollHeight; // More reliable for content height
    //         const scrollTop = window.scrollY;
    //         const isNearBottom = mobView ? scrollTop + windowHeight >= documentHeight - 250 : tabView ? scrollTop + windowHeight >= documentHeight - 500 : scrollTop + windowHeight >= documentHeight - 700; // Allow for buffer (customizable)

    //         setIsScrolledToBottom(isNearBottom);
    //     };

    //     window.addEventListener('scroll', handleScroll);

    //     // Cleanup function to remove event listener on unmount
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    // useEffect(() => {
    //     if (isScrolledToBottom === true) {
    //         if (getWishList?.old_page_no === wishListMeta?.page) {
    //             setWishListMeta((pre: any) => ({
    //                 ...pre,
    //                 page: pre?.page + 1
    //             }));
    //             setMore(true)
    //         }

    //     }
    // }, [isScrolledToBottom])

    useEffect(() => {
        setMore(false)
    }, [more])


    useEffect(() => {

        if (getWishList?.products && more === false) {
            if (getWishList?.products?.length) {
                setWishListDeta(getWishList?.products)
            } else {
                setWishListDeta([])
            }
        }
        if (getWishList && more === true && getWishList?.old_page_no === wishListMeta?.page) {
            if (getWishList?.products?.length) {
                setWishListDeta((pre: any) => pre?.length ? [...pre, ...getWishList?.products] : getWishList?.products)
            } else {
                setWishListDeta([])
            }
        }

    }, [getWishList, more])

    const getName = () => {
        let name = "wishlist"
        switch (listType) {
            case "savehistory":
                name = "save for later"
                break;
            case "recentviewitem":
                name = "recent view item"
                break;
            default:
                break;
        }
        return name;
    }

    const variationStockQ = (value: any) => {
        let qtt = [];
        let sum = 0;
        if (value?.length) {
            qtt = value.map((v: any) => v?.stock_quantity || 0)
            if (qtt?.length) {
                sum = qtt.reduce((acc, curr) => acc + curr, 0)
            }
        }
        return sum;
    }

    const notifyMe = (id: any) => {
        // if (!isLoged) {
        setClickNotify(true);
        SetProductDataid(id)
        if (getme?.role?.label !== "guest") {
            if (logedData?.email || logedData?.phone_no) {
                setEmailID(logedData?.email)
                setPhone_no(logedData?.phone_no)
            }
        }
        // } else {
        //     notifyMeSubmit();
        // }
    }

    const notifyMeSubmit = async () => {
        let valid = true;

        if (emial_id === "") {
            valid = false;
            setEmailIDErr("This field is mandatory")
        }
        if (phone_no === "") {
            valid = false;
            setPhone_noErr("This field is mandatory")
        }

        if (valid) {
            try {
                let e = "";
                let dataSet: any = {
                    product_id: productDataid
                }
                if (emial_id || phone_no) {
                    dataSet['email'] = emial_id;
                    dataSet['phone_no'] = phone_no;
                } else {
                    setClickNotify(true);
                    setEmailID("")
                    setPhone_no("")
                    return;
                }
                const { data } = await axios.post(create_notify_me, dataSet, { withCredentials: true });
                if (data?.success) {
                    _SUCCESS("Notify Product Added!");
                    setClickNotify(false);
                    setEmailID("");
                    SetProductDataid("");
                    setPhone_no("")
                } else {
                    _ERROR(data?.massage || "Notification already exist!")
                }
            } catch (error) {
                _ERROR(error?.response?.data?.massage)
                console.error("Error", error);
            }
        }
    }


    return (
        <>

            <div className={location === "account" ? "" : "container mt-5"}>
                {/* <h3 className='page-title2'>My Wishlist</h3> */}
                <div className='flex items-center justify-between mt-4'>
                    {location === "account" ?
                        <div></div>
                        :
                        <div className='w-full'>
                            <div className="flex items-center justify-start w-full uppercase font-medium ppsL">
                                <h1 className="sp-title m-0" style={{ fontSize: "150%" }}>My Wishlist</h1>
                            </div>
                        </div>}

                    <div className='flex items-center gap-2'>
                        <div
                            style={{ border: "1px solid #2d2d2d", height: "30px", width: "40px", borderRadius: "5px" }}
                            className='flex items-center justify-center cursor-pointer'
                            onClick={() => {
                                if (wishListMeta?.page > 1)
                                    setWishListMeta((pre: any) => ({
                                        ...pre,
                                        page: pre?.page - 1
                                    }));
                            }}
                        >
                            <ChevronLeftIcon />
                        </div>
                        <div
                            style={{ border: "1px solid #2d2d2d", height: "30px", width: "40px", borderRadius: "5px" }}
                            className='flex items-center justify-center cursor-pointer'
                            onClick={() => {
                                if (wishListMeta?.page > 0) {
                                    setWishListMeta((pre: any) => ({
                                        ...pre,
                                        page: pre?.page + 1
                                    }));
                                }
                            }}
                        >
                            <ChevronRightIcon />
                        </div>
                    </div>

                </div>

                {wishListLoading ?
                    <Skeleton
                        className='mt-4 skeliton-4th'
                        variant="rounded"
                    // width={"100%"}
                    // height={"20vh"}
                    />
                    :
                    <div className={`flex flex-wrap gap-2 ${location === "account" ? "" : "my-4"}`}>
                        {wishListDeta?.length ? wishListDeta?.map((v: any, i: number) =>
                            <div className="wishcard" key={i}>
                                <div className="card-body" style={mobView ? { height: "auto" } : { height: "100%" }}>
                                    <div className="row gx-2 items-start" style={mobView ? { height: "auto" } : { height: "100%" }}>
                                        <div className="col-md-4">
                                            <Link href={`/product/${v?.product?.slug}`}>
                                                <img src={v?.product?.images?.length ? v?.product?.images[0]?.src : cart11} alt={v?.product?.images?.length ? v?.product?.images[0]?.name : "dummy image"} className={`wish-img`} />
                                            </Link>
                                        </div>
                                        <div className="col-md-8 flex flex-col justify-between" style={mobView ? { height: "auto" } : { height: "100%" }}>
                                            <div style={mobView ? { height: "auto" } : { height: "100%" }}>
                                                <Link href={`/product/${v?.product?.slug}`}>
                                                    <p className='wish-title1 p-0 mb-0 truncate'>{capitalize(v?.product?.name)}</p>
                                                </Link>
                                                <p className='mb-0'>
                                                    <span className='wish-title'>₹
                                                        {v?.product?.sale_price !== "" ? v?.product?.sale_price : v?.product?.price !== "" ? v?.product?.price : "00.00"}
                                                        {v?.product?.sale_price !== "" ? <del style={{ color: "#989898" }} className='mx-1'>(₹{v?.product?.price !== "" ? v?.product?.price : "00.00"})&nbsp;</del> : null}
                                                    </span>
                                                </p>
                                                {/* {v?.product?.stock_quantity !== 0 ?
                                                    <p className='m-0'><span>Stock :</span> <span className='wish-title'>{v?.product?.stock_quantity}&nbsp;In Stock</span></p>
                                                    :
                                                    <p className='m-0'><span className='wish-title' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</span></p>
                                                } */}

                                                {!v?.product?.variations?.length ? (
                                                    v?.product?.stock_quantity !== 0 && v?.product?.stock_quantity !== null ? (
                                                        ""
                                                    ) : (
                                                        <p className='m-0'>
                                                            <span className='wish-title' style={{ color: "red", fontWeight: "bold", fontSize: "14px" }}>
                                                                Out Of Stock
                                                            </span>
                                                        </p>
                                                    )
                                                ) : (
                                                    variationStockQ(v?.product?.variations) > 0 ? (
                                                        ""
                                                    ) : (
                                                        <p className='m-0'>
                                                            <span className='wish-title' style={{ color: "red", fontWeight: "bold", fontSize: "14px" }}>
                                                                Out Of Stock
                                                            </span>
                                                        </p>
                                                    )
                                                )}
                                            </div>
                                            <div className="flex justify-end mt-2 gap-2">
                                                {
                                                    !v?.product?.variations?.length ? (
                                                        // If no variations, check if product is in stock
                                                        v?.product?.stock_quantity > 0 ? (
                                                            <button
                                                                className={`btn2 btn-primary rounded-2`}
                                                                style={{ height: "auto", padding: "0 10px" }}

                                                                onClick={() => { getme?.id ? v?.product?.variations?.length === 0 ? router.push(`/product/${v?.product?.slug}`) : onCreateCart({ id: v?.product?.id }) : dispatch(setOpenAuth(true)) }}
                                                            >
                                                                <ShoppingCartIcon />
                                                            </button>
                                                        ) : (
                                                            // Out of stock, show Notify Me button
                                                            <button
                                                                className={`btn2 btn-primary rounded-2`}
                                                                style={{ height: "auto", padding: "0 10px" }}
                                                                onClick={() => notifyMe(v?.product?.id)}
                                                            >
                                                                <span><NotificationsIcon /></span> {/* Notify Me icon */}
                                                            </button>
                                                        )
                                                    ) : (
                                                        // If variations exist, check stock for variations
                                                        variationStockQ(v?.product?.variations) > 0 ? (
                                                            <button
                                                                className={`btn2 btn-primary rounded-2`}
                                                                style={{ height: "auto", padding: "0 10px" }}
                                                                onClick={() => { getme?.id ? v?.product?.variations?.length === 0 ? router.push(`/product/${v?.product?.slug}`) : onCreateCart({ id: v?.product?.id }) : dispatch(setOpenAuth(true)) }}
                                                            >
                                                                <ShoppingCartIcon />
                                                            </button>
                                                        ) : (
                                                            // Out of stock for variations, show Notify Me button
                                                            <button
                                                                className={`btn2 btn-primary rounded-2`}
                                                                style={{ height: "auto", padding: "0 10px" }}
                                                                onClick={() => notifyMe(v?.product?.id)}
                                                            >
                                                                <span><NotificationsIcon /></span> {/* Notify Me icon */}
                                                            </button>
                                                        )
                                                    )
                                                }

                                                <button
                                                    className={`btn2 btn-primary rounded-2`}
                                                    style={{ height: "auto", padding: "0 10px" }}
                                                    onClick={() => { setDelete_wish_list_url(delete_wish_list); setDeleteWishListMetaMeta({ wish_list_id: v?.id }) }}
                                                >
                                                    <span><DeleteIcon /></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) :
                            (!wishListDeta?.length && !wishListLoading) ?
                                // <div className='flex items-center justify-center w-full h-full'>
                                //     <h4>Your {getName()} is empty</h4>
                                // </div>
                                <div className='flex flex-col items-center justify-center w-full h-full'>
                                    <Image src={emptyBox} alt='no_data_ill' width={192} height={108} />
                                    <h4 className='flex flex-col items-center justify-center w-full h-full gap-1'>
                                        <span style={{ fontSize: '18px' }}>Oops! No data found</span>
                                        <span style={{ fontSize: '14px' }}>
                                            <Link href='/' className='color-e4509d'>Go to homepage</Link>
                                        </span>
                                    </h4>
                                </div>
                                :
                                null
                        }

                    </div>}

            </div>




            <Dialog
                open={clickNotify}
                onClose={() => { setClickNotify(false); SetProductDataid(""); setEmailIDErr(""); setPhone_noErr(""); }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className='px-3 py-3 flex flex-col ' >
                    <div className='flex justify-between items-center'>
                        <span style={{ fontSize: "16px", fontWeight: "600" }}>Notify Me</span>
                        <CloseIcon style={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={() => { setClickNotify(false); SetProductDataid(""); setEmailIDErr(""); setPhone_noErr(""); }} />
                    </div>
                    <hr className='py-2 m-0' />
                    <div className='flex flex-col items-center gap-2'>
                        <Image src={Notifyimg} alt='Notifyimg' height={192} width={108} style={{ width: "100px", height: "100px" }} />
                        <div className='flex flex-col'>
                            <label style={{ fontSize: "80%", fontWeight: "500" }}>Email</label>
                            <input
                                type="text"
                                name="s"
                                placeholder="Enter your email id"
                                className='form-control cont contifyCls'
                                style={mobView ? { width: "200px", borderRadius: "4px", padding: "0 4px", fontSize: "90%", outline: "none" } : { width: "400px", borderRadius: "4px", padding: "0 4px", fontSize: "90%", outline: "none" }}
                                autoComplete="off"
                                value={emial_id}
                                onChange={(e: any) => setEmailID(e.target.value)} />
                            {emial_id === "" ? <span style={{ fontSize: "12px", color: "red", fontWeight: "600" }}>{emial_idErr}</span> : null}
                        </div>
                        <div className='flex flex-col'>
                            <label style={{ fontSize: "80%", fontWeight: "500" }}>Phone no12</label>
                            <input
                                type="number"
                                name="p"
                                placeholder="Enter your phone no"
                                className='form-control cont contifyCls'
                                style={mobView ? { width: "200px", borderRadius: "4px", padding: "0 4px", fontSize: "90%", outline: "none" } : { width: "400px", borderRadius: "4px", padding: "0 4px", fontSize: "90%", outline: "none" }}
                                autoComplete="off"
                                value={phone_no}
                                onChange={(e: any) => setPhone_no(e.target.value)} />
                            {phone_no === "" ? <span style={{ fontSize: "12px", color: "red", fontWeight: "600" }}>{phone_noErr}</span> : null}
                        </div>
                    </div>
                    <div className='w-full flex justify-end mt-2' style={{}}>
                        <button className="btn mt-2" style={{ background: `#e4509d`, padding: "0px 20px", color: "#ffffff", }} type="button" onClick={notifyMeSubmit} >
                            Send
                        </button>
                    </div>
                </div>
            </Dialog>

        </>
    )
}

export default Wishlist