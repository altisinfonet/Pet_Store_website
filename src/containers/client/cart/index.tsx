import { Alert, Drawer } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import getUrlWithKey from '../../../util/_apiUrl'
import { useCreate, useRead } from '../../../hooks'
import brandDam from "../../../../public/assets/images/brandDam.png"
import { useRouter } from 'next/router'
import { _ERROR, _SUCCESS, _WARNING } from '../../../util/_reactToast'
import cart1 from "../../../../public/assets/icon/product-1.jpg"
import diss from "../../../../public/assets/icon/discount.png"
import dissp from "../../../../public/assets/icon/discount-green.png"
import closep from "../../../../public/assets/icon/close.png"
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { setCart } from '../../../reducer/getCartReducer'
import { setCoupon } from '../../../reducer/couponReducer'
import { setOpenCart } from '../../../reducer/openCartReducer'
import { setCartHolding } from '../../../reducer/getCartHolding'
import axios from 'axios'
import useTabView from '../../../hooks/useTabView'
import { setOpenAuth } from '../../../reducer/openAuthReducer'
import { setCartCount } from '../../../reducer/cartCountReducer'
import { toast } from 'react-toastify'

const Cart = ({ sideBarOpen, onSideBarClose, sideBarOpenForDiscount }: Props) => {
    console.log(sideBarOpenForDiscount, "6df54g6fd4df")

    const router = useRouter();
    const dispatch = useDispatch()
    const { tabView, mobView } = useTabView()
    const { get_cart_items, update_cart, cart_holding, create_wish_list, cart_item_count } = getUrlWithKey("client_apis")
    var currencyFormatter = require('currency-formatter');


    const getme = useSelector((state: any) => state?.meReducer?.value);
    const getCoupon = useSelector((state: any) => state?.couponReducer?.value);

    const [get, setGet] = useState(false)
    const [getCartUrl, setGetCartUrl]: any = useState()
    const [stockHoldingUrl, setStockHoldingUrl] = useState<any>({});
    const [updateCartUrl, setUpdateCartUrl]: any = useState()
    const [updateCart, setUpdateCart]: any = useState({})
    const [chooseCoupon, setChooseCoupon]: any = useState()
    const [applyCouponState, setApplyCouponState]: any = useState()
    const [proceedToCheckOut, setProceedToCheckOut] = useState(false);
    const [cartItemCount, setCartItemCount]: any = useState()
    const { sendData: getCart }: any = useRead({ selectMethod: "get", url: getCartUrl });
    const { sendData: updateCartData, error: updateCartDataError }: any = useCreate({ url: updateCartUrl, callData: updateCart });
    const { sendData: getCartCount }: any = useRead({ selectMethod: "get", url: cartItemCount });
    const [totalDisCountAmount, setTotalDisCountAmount] = useState(getCart?.productDiscountAmountTotal || 0)



    useEffect(() => {
        dispatch(setCartCount(getCartCount?.totalItems))
    }, [getCartCount])

    const { sendData: stockHold, error: stockHoldError }: any = useCreate(stockHoldingUrl);

    useEffect(() => {
        if (updateCartDataError && updateCart?.increase) {
            _WARNING(updateCartDataError?.massage)
        }
    }, [updateCartData, updateCartDataError, updateCart])


    const applyCoupon = () => {
        setApplyCouponState(chooseCoupon)
        // alert(`Coupon is : ${chooseCoupon}`)
    }

    const removeCoupon = () => {
        setChooseCoupon()
        setApplyCouponState()
    }

    const doCountInCart = ({ plus, minus, id }: any) => {
        if (plus) {
            setUpdateCartUrl(update_cart)
            setUpdateCart({ quantity: 1, cart_id: id, increase: true })
        }
        if (minus) {
            setUpdateCartUrl(update_cart)
            setUpdateCart({ quantity: 1, cart_id: id, increase: false })
        }
    }

    const saveForLater = async ({ quantity, id, prod_id }: any) => {
        try {
            const { data } = await axios.post(create_wish_list, { product_id: prod_id, list_type: "SAVEFORLATER" }, { withCredentials: true })
            if (data && data?.success) {
                _SUCCESS("Product saved for later successfully!")
                setUpdateCartUrl(update_cart)
                setUpdateCart({ quantity: quantity, cart_id: id, increase: false })
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    useEffect(() => {

        if (stockHold?.type === "hold") {
            setProceedToCheckOut(false);
            router.push({
                pathname: "/order",
                query: { totalDisCountAmount: totalDisCountAmount?.toFixed(2) },
            });
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

    useEffect(() => {
        if (sideBarOpen === true) {
            if (getme?.id) {
                setGetCartUrl(get_cart_items)
            }
        }
    }, [sideBarOpen, getme?.id])

    useEffect(() => {
        if (sideBarOpen === false) {
            setGetCartUrl()
        }
    }, [sideBarOpen])

    useEffect(() => {
        setGetCartUrl(get_cart_items)
    }, [updateCartUrl])

    useEffect(() => {
        setUpdateCartUrl()
        setGetCartUrl()
        dispatch(setCart(getCart))
        setCartItemCount(cart_item_count)
    }, [getCart])

    useEffect(() => {
        dispatch(setCoupon(applyCouponState))
    }, [applyCouponState])

    useEffect(() => {
        if (getCoupon?.code) {

        } else {
            setChooseCoupon()
            setApplyCouponState()
        }
    }, [getCoupon])

    useEffect(() => {
        if (updateCartDataError?.response?.data?.massage) {
            _WARNING(updateCartDataError?.response?.data?.massage)
        }
    }, [updateCartDataError])

    const totalPrice = () => {
        let count = 0
        if (getCart?.items?.length) {
            getCart?.items.map((v: any) => { count += +(v?.product?.price * v?.quantity) })
        }
        return count
    }

    useEffect(() => {
        if (!sideBarOpen) {
            setStockHoldingUrl({})
        }
    }, [sideBarOpen])


    const lastIndex = getCart?.items?.length - 1;
    const lastIdIndex = getCart?.items?.findIndex((item: any, index: number) => index === lastIndex);
    const lastId = getCart?.items?.find((item: any, index: number) => index === lastIdIndex)?.id;

    const oldfun = () => {
        return (
            <div style={{ width: "25rem" }}>
                {getCart?.items?.length ? getCart?.items.map((v: any, i: number) => {
                    return (
                        <div key={i}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} className='p-4'>
                                <img src={v?.product?.images?.length ? v?.product?.images[0]?.image : "/assets/images/brandDam.png"} alt='' height={200} width={100} sizes="(min-width: 200px) 50vw, 100vw" />
                                <p className='m-0'>{v?.product?.name}</p>
                                <div style={{ display: "flex" }}>
                                    <p className='m-0' onClick={() => doCountInCart({ plus: true, minus: false, id: v?.id })}>+</p>
                                    <div className='mx-2' style={{ height: "30px", width: "60px", textAlign: "center", border: "solid 1px #000", borderRadius: "8px" }} >{v?.quantity}</div>
                                    <p className='m-0' onClick={() => doCountInCart({ plus: false, minus: true, id: v?.id })}>-</p>
                                </div>
                            </div>
                            <hr className='my-1' />
                            <div className='px-4'>
                                <p className='m-0'>Actual Amount : {v?.product?.price * v?.quantity}</p>
                            </div>
                            <hr className='pb-4 my-1' />
                        </div>)
                }
                ) : null}
                <hr className='my-1' />
                {totalPrice() === 0 ? null : <p className='m-4'>total payable: {totalPrice()}</p>}
                {totalPrice() === 0 ? null : <button className='m-4 mt-0' style={{ width: "80%" }} onClick={() => router.push({
                    pathname: "/order",
                    query: { totalDisCountAmount: totalDisCountAmount?.toFixed(2) },
                })}>Proceed to checkout</button>}
            </div>
        )
    }

    const showSize = (val: any) => {
        let size: any = "";

        if (val?.productVariationTerms?.length) {
            if (val?.productVariationTerms[0]?.term) {
                size = val?.productVariationTerms[0]?.term?.name
            }
        }

        return size;
    }

    useEffect(() => {
        if (!sideBarOpenForDiscount) {
            if (router.pathname === "/order") {
                router.push("/")
            }
        }
    }, [sideBarOpenForDiscount])

    useEffect(() => {
        dispatch(setCartHolding(stockHold))

    }, [stockHold, stockHoldError]);

    // const ShowFinalAmmount = () => {
    //     return (applyCouponState?.couponMetaData?.general?.amount ?
    //         applyCouponState?.couponMetaData?.general?.type === "parsentage" ?
    //             getCart?.shippingTotal ?
    //                 (((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) - ((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) * +(applyCouponState?.couponMetaData?.general?.amount) / 100)) + getCart?.shippingTotal).toFixed(2)
    //                 :
    //                 ((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) - ((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) * +(applyCouponState?.couponMetaData?.general?.amount) / 100)).toFixed(2)
    //             :
    //             getCart?.shippingTotal ?
    //                 (((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) - +(applyCouponState?.couponMetaData?.general?.amount)) + getCart?.shippingTotal).toFixed(2)
    //                 :
    //                 ((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) - +(applyCouponState?.couponMetaData?.general?.amount)).toFixed(2)
    //         :
    //         getCart?.shippingTotal ?
    //             ((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) + getCart?.shippingTotal).toFixed(2)
    //             :
    //             (+getCart?.productPriceTotal - +getCart?.productDiscountAmountTotal).toFixed(2))
    // }
    // const sp = getCart.items?.map((ele: any) => ele?.product?.price)

    // =================================================================Old Price Calculations =================================================================
    const totalSum = getCart.items?.reduce((total: number, item: any) => {
        const price = parseFloat(item?.product?.price) || 0; // Convert to number and handle undefined/null
        return total + price;
    }, 0);
    const netTotal = getCart?.allTotalAmount - getCart?.productDiscountAmountTotal
    const netsp = getCart?.productDiscountAmountTotal

    const ShowFinalAmmount: any = () => {
        return (applyCouponState?.couponMetaData?.general?.amount ?
            applyCouponState?.couponMetaData?.general?.type === "parsentage" ?
                ((+getCart?.allTotalAmount) - +(netsp * (+(applyCouponState?.couponMetaData?.general?.amount) / 100)))
                :
                ((+getCart?.allTotalAmount) - +(applyCouponState?.couponMetaData?.general?.amount))
            : +getCart?.allTotalAmount)
    }
    // =================================================================Old Price Calculations =================================================================

    const shippingCalculate = () => {
        const netsp = getCart?.allTotalAmountWithoutShipping || 0;
        const couponAmount = +(applyCouponState?.couponMetaData?.general?.amount || 0);
        const couponType = applyCouponState?.couponMetaData?.general?.type || "";

        let shippingPrice = 50;
        let afterShipping;

        if (couponType === "percentage") {
            const discount = netsp * (couponAmount / 100);
            afterShipping = netsp - discount;
        } else {
            afterShipping = netsp - couponAmount;
        }

        // Set shipping price based on the total after discount
        if (afterShipping < 500) {
            shippingPrice = 50;
        } else {
            shippingPrice = 0;
        }
        console.log(afterShipping, shippingPrice, "35df4y6gd5g1r")
        return shippingPrice;
    };

    const shippingPriceData = shippingCalculate();
    console.log(shippingPriceData, "shippingPriceDatasd45f56")

    // =================================================================New Price Calculations =================================================================
    const calculateFinalPrice = () => {
        const netsp = getCart?.allTotalAmountWithoutShipping || 0;
        const orderDiscount = getCart?.productDiscountAmountTotal || 0
        const shipping = getCart?.shippingTotal || 0;
        const couponAmount = +(applyCouponState?.couponMetaData?.general?.amount || 0);
        const couponType = applyCouponState?.couponMetaData?.general?.type || "";
        let disCountedAmount = getCart?.productDiscountAmountTotal || 0
        let finalPrice = netsp;
        if (couponType === "parsentage") {
            const discount = netsp * (couponAmount / 100);
            const afterShipping = netsp - discount;
            // finalPrice = netsp - discount + shipping;
            finalPrice = afterShipping < 500 ? afterShipping + 50 : afterShipping;
            disCountedAmount = orderDiscount + discount
        } else {
            // const afterShipping = netsp - couponAmount;
            // finalPrice = afterShipping < 500 ? afterShipping + 50 : afterShipping;
            finalPrice = netsp - couponAmount + shipping;
            disCountedAmount = orderDiscount + couponAmount
        }

        // Add shipping cost
        // finalPrice += shipping;
        console.log(finalPrice, netsp, shipping, couponAmount, couponType, getCart, applyCouponState, disCountedAmount, "finalPricesds")
        return finalPrice > 0 ? finalPrice : 0;
    };
    const priceWithDiscount = calculateFinalPrice();

    useEffect(() => {
        const netsp = getCart?.allTotalAmountWithoutShipping || 0;
        const couponAmount = +(applyCouponState?.couponMetaData?.general?.amount || 0);
        const couponType = applyCouponState?.couponMetaData?.general?.type || "";
        const orderDiscount = getCart?.productDiscountAmountTotal || 0
        if (couponType === "parsentage") {
            const discount = netsp * (couponAmount / 100);
            const disCountedValue = orderDiscount + discount
            setTotalDisCountAmount(disCountedValue)
        } else {
            const disCountedAmountValue = orderDiscount + couponAmount
            setTotalDisCountAmount(disCountedAmountValue)
        }

    }, [getCart, applyCouponState]);
    // =================================================================New Price Calculations =================================================================

    const saveForLaterHandel = (v: any) => {
        if ((getme?.id && getme?.role?.label !== "guest")) {
            saveForLater({ quantity: v?.quantity, id: v?.id, prod_id: v?.product_id })
        } else {
            dispatch(setOpenAuth(true));
        }
    }

    const isOutOfStock = () => {
        return getCart?.items.some((v: any) => {
            if (!v?.variation?.stock_quantity || v?.variation?.stock_quantity === 0 || v?.variation?.stock_quantity === null) {
                return v?.product?.stock_quantity === 0 || v?.product?.stock_quantity === null;
            } else {
                return v?.variation.stock_quantity === 0 || v?.variation.stock_quantity === null;
            }
        });
    };
    console.log(getCart, "getCart3451sd")
    return (
        <div>
            <Drawer
                anchor={"right"}
                // open={true}
                open={sideBarOpen}
                onClose={() => onSideBarClose(false)}
            >
                {getCart && getCart?.items?.length ?
                    <div className='cart-root'>
                        {/* {oldfun()}  */}
                        <div className="cart">
                            <div className="row">
                                <div className="col-4">
                                    <button type="button" className="btn-close1 new" aria-label="Close" onClick={() => onSideBarClose(false)} >
                                        <Image
                                            src={closep} 
                                            // src="/assets/icon/close.png"
                                            alt="cart1" className={``} style={{ width: "70%" }} width={12} height={12} sizes="(min-width: 12px) 50vw, 100vw" />
                                    </button>
                                </div>
                                <div className="col-4">
                                    <h5>My Cart</h5>
                                </div>
                                <div className="col-4">
                                    {/* <p>{getCart?.items?.length || 0} Item(s)</p> */}
                                </div>
                            </div>
                        </div>
                        <div className="cart-sec">

                            {/* <CloseIcon /> */}
                            {getCart && getCart?.items?.length ? getCart?.items.map((v: any, i: number) =>
                                <div className={`flex flex-row gap-3 ${lastId === v?.id ? "" : "pb-3"}`} key={i}>
                                    <Link href={`/product/${v?.product?.slug}`} className="p-1" style={{ border: "1px solid #d4d4d4", borderRadius: "6px", position: "relative" }}>
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Image
                                                src={v?.product?.images?.length && v?.product?.images[0]?.src !== null ? v?.product?.images[0]?.src : brandDam}
                                                alt="cart1"
                                                className="object-cover"
                                                style={{ height: "100px", minWidth: "100px" }}
                                                width={100}
                                                height={100}
                                                sizes="(min-width: 100px) 50vw, 100vw" />
                                        </div>
                                    </Link>

                                    <div className="w-full">
                                        <p className='para-cart pt-0'>
                                            <Link className='para-cart' style={{ fontSize: "100%" }} href={`/product/${v?.product?.slug}`} onClick={() => onSideBarClose(false)}>{v?.product?.name}</Link></p>
                                        {showSize(v?.variation) ? <p className='para-cart'>size: <span style={{ color: "#c5c5c5" }}>{showSize(v?.variation)}</span></p> : null}
                                        {/* {v?.product?.size ? <p className='para-cart'>size: <span style={{ color: "#c5c5c5" }}>85Gm</span></p> : null} */}

                                        <div className={` flex justify-between  ${mobView ? "flex-col items-start gap-1" : "flex-row items-center"}`}>
                                            <div className="flex flex-col items-start">
                                                <div className="col-4">
                                                    <p className='price1 p-0 flex flex-row items-center gap-2'>
                                                        <div className='sec1-para' style={{ fontSize: "90%" }}>
                                                            {v?.product?.sale_price ? <del className=''><span className='₹'>₹</span>{currencyFormatter.format((+v?.product?.price), { code: '' })}</del> : null}
                                                        </div>
                                                        <div>
                                                            <span className='₹'>₹</span>{v?.product?.sale_price ? currencyFormatter.format((+v?.product?.sale_price), { code: '' }) : currencyFormatter.format((+v?.product?.price), { code: '' })}&nbsp;x&nbsp;{v?.quantity}
                                                        </div>
                                                    </p>
                                                </div>
                                                <div className="qty-container flex items-center gap-2">
                                                    <span className='orderUpDown' onClick={() => {
                                                        // sideBarOpenForDiscount ? null :
                                                        doCountInCart({ plus: false, minus: true, id: v?.id })
                                                    }}>-</span>
                                                    <span className='text-center' style={{ width: "30px" }}>{v?.quantity}</span>
                                                    <span className='orderUpDown' onClick={() => {
                                                        // sideBarOpenForDiscount ? null :
                                                        doCountInCart({ plus: true, minus: false, id: v?.id })
                                                    }}>+</span>
                                                </div>
                                            </div>
                                            {/*  */}
                                            {/*  */}

                                            {/* {!v?.variation?.stock_quantity ? (
                                                <>
                                                    {v?.product?.stock_quantity === 0 || v?.product?.stock_quantity === null ? (
                                                        <p className="out-of-stock" style={{ color: "red", fontSize: "14px", fontWeight: "bold", backgroundColor: "#FECDD3", borderRadius: "5px", padding: "1px 10px" }}>Out Of Stock</p>
                                                    ) : (
                                                        <button className='saveLater px-2' onClick={() => saveForLaterHandel(v)}>
                                                            Save for later
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                v?.variation?.stock_quantity === 0 || v?.variation?.stock_quantity === null
                                                    ? (
                                                        <p className="out-of-stock" style={{ color: "red", fontSize: "14px", fontWeight: "bold", backgroundColor: "#FECDD3", borderRadius: "5px", padding: "1px 10px" }}>Out Of Stock</p>
                                                    ) : (
                                                        <button className='saveLater px-2' onClick={() => saveForLaterHandel(v)}>
                                                            Save for later
                                                        </button>
                                                    )
                                            )

                                            } */}

                                            {!v?.variation?.stock_quantity || v?.variation?.stock_quantity === 0 || v?.variation?.stock_quantity === null ? (
                                                <>
                                                    {v?.product?.stock_quantity === 0 || v?.product?.stock_quantity === null ? (
                                                        <p className="out-of-stock" style={{ color: "red", fontSize: "14px", fontWeight: "bold", backgroundColor: "#FECDD3", borderRadius: "5px", padding: "1px 10px" }}>
                                                            Out Of Stock
                                                        </p>
                                                    ) : (
                                                        <button className="saveLater px-2" onClick={() => saveForLaterHandel(v)}>
                                                            Save for later
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                v?.variation?.stock_quantity === 0 || v?.variation?.stock_quantity === null ? (
                                                    <p className="out-of-stock" style={{ color: "red", fontSize: "14px", fontWeight: "bold", backgroundColor: "#FECDD3", borderRadius: "5px", padding: "1px 10px" }}>
                                                        Out Of Stock
                                                    </p>
                                                ) : (
                                                    <button className="saveLater px-2" onClick={() => saveForLaterHandel(v)}>
                                                        Save for later
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                </div>
                            ) : null}

                        </div>
                        <div className="bor"></div>

                        <div className="cart-sec1">
                            {getCart?.coupon_list?.length ?
                                <>
                                    <p className='para mb-3' style={{ color: "#d8428d", fontWeight: 600 }}>Apply Discount Code</p>
                                    <div className="example" >
                                        <input type="text" placeholder="DiscountCode" name="DiscountCode" style={{ color: "green", fontWeight: "600", fontSize: "70%", outline: "none" }} value={chooseCoupon?.code ? chooseCoupon?.code : ""} readOnly />

                                        <Image
                                            src={diss}
                                            // src="/assets/icon/discount.png"
                                            alt="cart1" className={`diss-cnt`} />
                                        <button className='apply'
                                            style={{ cursor: chooseCoupon?.code ? "pointer" : "default" }}
                                            onClick={() => {
                                                if (applyCouponState?.couponMetaData?.general?.amount) {
                                                    removeCoupon()
                                                } else {
                                                    applyCoupon()
                                                }
                                            }}
                                            disabled={!chooseCoupon?.code}
                                        > {applyCouponState?.couponMetaData?.general?.amount ? 'Reset' : 'Apply'}</button>
                                    </div>
                                </> : null}
                            {getCart?.coupon_list?.length ?
                                <div className="card1">
                                    <div className="card-body">
                                        <div className="card1-sec">
                                            <p><span></span>{getCart?.coupon_list?.length} Available Coupon To Be Used</p>
                                        </div>
                                        <div className="card1-sec1 m-0">
                                            {getCart?.coupon_list.map((v: any, i: number) =>
                                                <div className="card-sec1-txt" key={i}>
                                                    <div className="row gx-2 mt-3">
                                                        <div className="col-1">
                                                            <Image
                                                                src={dissp}
                                                                // src="/assets/icon/discount.png"
                                                                alt="cart1" className={``} />
                                                        </div>
                                                        <div className="col-3">
                                                            <h6 className={applyCouponState?.id === v?.id ? "coup-applyed" : chooseCoupon?.id === v?.id ? "coup-active" : "coup"}>{v?.code}</h6>
                                                        </div>
                                                        <div className="col-5">
                                                            <p className='exp'>{v?.couponMetaData?.general?.type === "parsentage" ? `${currencyFormatter.format((+v?.couponMetaData?.general?.amount), { code: '' })}%` : `₹${currencyFormatter.format((+v?.couponMetaData?.general?.amount), { code: '' })}`} Off</p>
                                                        </div>
                                                        <div className="col-3">
                                                            {applyCouponState?.couponMetaData?.general?.amount ? null : <button className='choose' onClick={() => setChooseCoupon(v)}>choose</button>}
                                                        </div>
                                                    </div>
                                                    <p className='sed' dangerouslySetInnerHTML={{ __html: v?.descriptions }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div> : null}

                            <h3 className='order pt-0'>Order Summary</h3>
                            <div className="row gx-5">
                                <div className="col-7">
                                    <p className='sec1-para'> Actual Amount</p>
                                    {getCart?.productDiscountAmountTotal !== 0 ? <p className='sec1-para'> Discount</p> : null}
                                    {applyCouponState ? <p className='sec1-para'>Coupon<strong>{getCoupon?.code && <>&nbsp;({getCoupon?.code})</>}</strong></p> : null}
                                    <p className='sec1-para'> Shipping Charges </p>
                                </div>
                                <div className="col-5 text-end">
                                    <p className='sec1-para '>₹{currencyFormatter.format((+getCart?.productPriceTotal), { code: '' })}</p>
                                    {/* {getCart?.productDiscountAmountTotal !== 0 ? <p className='sec1-para '>₹{(+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal).toFixed(2)}</p> : null} */}
                                    {getCart?.productDiscountAmountTotal !== 0 ? <p className='sec1-para ' style={{ color: "green", fontWeight: "600" }}>- {currencyFormatter.format((+getCart?.productDiscountAmountTotal), { code: 'INR' })}</p> : null}

                                    {applyCouponState ?
                                        <p className='sec1-para ' style={{ color: "#e4509d", fontWeight: "500" }}>-{applyCouponState?.couponMetaData?.general?.type === "parsentage" ? `${currencyFormatter.format((+applyCouponState?.couponMetaData?.general?.amount), { code: '' })}%` : `₹${currencyFormatter.format((+applyCouponState?.couponMetaData?.general?.amount), { code: '' })}`}
                                            <span style={{ color: "green", marginLeft: "5px" }}>
                                                {`(${currencyFormatter.format(totalDisCountAmount - getCart?.productDiscountAmountTotal, { code: 'INR' })})`}
                                            </span>
                                        </p> : null}
                                    <p className='sec1-para '>{shippingCalculate() === 0 ?
                                        <span ><del>₹50</del>&nbsp;<span style={{ color: "green", fontWeight: "600" }}>FREE Delivery</span></span>
                                        : <span style={{ color: "#008000" }}>{`₹${shippingCalculate()}`}</span>}</p>
                                </div>
                            </div>
                            <div className="bor my-2"></div>

                            {getCart?.productDiscountAmountTotal !== 0 ?
                                <div className="row">
                                    <div className="col-7">
                                        <p className='sec1-para' style={{ color: "#d8428d" }}>Amount To Pay </p>

                                    </div>
                                    <div className="col-5 text-end">
                                        <p className='sec1-para' style={{ color: "#d8428d" }}>
                                            {/* ₹{applyCouponState?.couponMetaData?.general?.amount ?
                                                applyCouponState?.couponMetaData?.general?.type === "parsentage" ?
                                                    getCart?.shippingTotal ?
                                                        (((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) - ((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) * +(applyCouponState?.couponMetaData?.general?.amount) / 100)) + getCart?.shippingTotal).toFixed(2)
                                                        :
                                                        ((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) - ((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) * +(applyCouponState?.couponMetaData?.general?.amount) / 100)).toFixed(2)
                                                    :
                                                    getCart?.shippingTotal ?
                                                        (((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) - +(applyCouponState?.couponMetaData?.general?.amount)) + getCart?.shippingTotal).toFixed(2)
                                                        :
                                                        ((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) - +(applyCouponState?.couponMetaData?.general?.amount)).toFixed(2)
                                                :
                                                getCart?.shippingTotal ?
                                                    ((+getCart?.productPriceTotal - getCart?.productDiscountAmountTotal) + getCart?.shippingTotal).toFixed(2)
                                                    :
                                                    (+getCart?.productPriceTotal - +getCart?.productDiscountAmountTotal).toFixed(2)} */}
                                            {/* ₹{(+getCart?.allTotalAmount).toFixed(2)} */}
                                            {currencyFormatter.format((calculateFinalPrice()), { code: 'INR' })}
                                        </p>

                                    </div>
                                    {/* <div className="col-5 text-end">
                                        <p className='sec1-para' style={{ color: "#d8428d" }}>
                                            ₹{applyCouponState?.couponMetaData?.general?.amount ?
                                                applyCouponState?.couponMetaData?.general?.type === "parsentage" ?
                                                    getCart?.shippingTotal ?
                                                        ((getCart?.productDiscountAmountTotal - (getCart?.productDiscountAmountTotal * +(applyCouponState?.couponMetaData?.general?.amount) / 100)) + getCart?.shippingTotal).toFixed(2)
                                                        :
                                                        (getCart?.productDiscountAmountTotal - (getCart?.productDiscountAmountTotal * +(applyCouponState?.couponMetaData?.general?.amount) / 100)).toFixed(2)
                                                    :
                                                    getCart?.shippingTotal ?
                                                        ((getCart?.productDiscountAmountTotal - +(applyCouponState?.couponMetaData?.general?.amount)) + getCart?.shippingTotal).toFixed(2)
                                                        :
                                                        (getCart?.productDiscountAmountTotal - +(applyCouponState?.couponMetaData?.general?.amount)).toFixed(2)
                                                :
                                                getCart?.shippingTotal ?
                                                    (getCart?.productDiscountAmountTotal + getCart?.shippingTotal).toFixed(2)
                                                    :
                                                    (+getCart?.productDiscountAmountTotal).toFixed(2)}
                                        </p>

                                    </div> */}
                                </div>
                                :
                                <div className="row">
                                    <div className="col-7">
                                        <p className='sec1-para' style={{ color: "#d8428d" }}> Amount To Pay </p>

                                    </div>
                                    <div className="col-5 text-end">
                                        <p className='sec1-para' style={{ color: "#d8428d" }}>
                                            {/* ₹{applyCouponState?.couponMetaData?.general?.amount ?
                                                applyCouponState?.couponMetaData?.general?.type === "parsentage" ?
                                                    getCart?.shippingTotal ?
                                                        ((getCart?.productPriceTotal - (getCart?.productPriceTotal * +(applyCouponState?.couponMetaData?.general?.amount) / 100)) + getCart?.shippingTotal).toFixed(2)
                                                        :
                                                        (getCart?.productPriceTotal - (getCart?.productPriceTotal * +(applyCouponState?.couponMetaData?.general?.amount) / 100)).toFixed(2)
                                                    :
                                                    getCart?.shippingTotal ?
                                                        ((getCart?.productPriceTotal - +(applyCouponState?.couponMetaData?.general?.amount)) + getCart?.shippingTotal).toFixed(2)
                                                        :
                                                        (getCart?.productPriceTotal - +(applyCouponState?.couponMetaData?.general?.amount)).toFixed(2)
                                                :
                                                getCart?.shippingTotal ?
                                                    (getCart?.productPriceTotal + getCart?.shippingTotal).toFixed(2)
                                                    :
                                                    (+getCart?.productPriceTotal).toFixed(2)} */}
                                            {/* ₹{getCart?.allTotalAmount} */}
                                            {/* ₹{ShowFinalAmmount()} */}
                                            {currencyFormatter.format((calculateFinalPrice()), { code: 'INR' })}
                                        </p>

                                    </div>
                                </div>
                            }

                            {/* {((getCart?.productPriceTotal).toFixed(2) - (+ShowFinalAmmount())) <= 0 ? null : <div className="bor my-2"></div>}
                            {((getCart?.productPriceTotal).toFixed(2) - (+ShowFinalAmmount())) <= 0 ? null :
                                <p className='sec1-para col-12' style={{ color: "green", fontWeight: 600, fontSize: "15px" }}>You will save {
                                    getCart?.shippingTotal ?
                                        currencyFormatter.format(getCart?.shippingTotal + (getCart?.productPriceTotal - ShowFinalAmmount()), { code: 'INR' })
                                        :
                                        currencyFormatter.format((getCart?.productPriceTotal - ShowFinalAmmount()), { code: 'INR' })
                                } on this order</p>} */}
                            {getCart?.productDiscountAmountTotal === 0 ? null : <div className="bor my-2"></div>}
                            {getCart?.productDiscountAmountTotal === 0 ? null :
                                <p className='sec1-para col-12' style={{ color: "green", fontWeight: 600, fontSize: "15px" }}>You will save <span style={{ color: "#e4509d" }}>{currencyFormatter.format(totalDisCountAmount, { code: 'INR' })}</span> on this order.</p>}

                            <div className='flex items-center gap-2'>
                                {!sideBarOpenForDiscount ?
                                    <button className='proceed' disabled={proceedToCheckOut}
                                        onClick={() => {
                                            if (isOutOfStock()) {
                                                toast.error("Some items are out of stock. Please update your cart to proceed.", {
                                                    style: { fontSize: "12px", padding: "10px" },
                                                });
                                            } else {
                                                setStockHoldingUrl({ url: cart_holding, callData: { type: 'hold' } });
                                                setProceedToCheckOut(true);
                                            }
                                        }}>
                                        {proceedToCheckOut ? "Please wait..." : "Proceed To Check Out"}
                                    </button>
                                    :
                                    <button className='proceed' onClick={() => { dispatch(setOpenCart(false)), setStockHoldingUrl({ url: cart_holding, callData: { type: 'hold' } }); }}>done</button>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div style={{ width: "20rem", height: "90%" }}>
                        <div className="cart">
                            <div className="row">
                                <div className="col-4">
                                    <button type="button" className="btn-close1 new" aria-label="Close" onClick={() => onSideBarClose(false)}>
                                        <Image
                                            src={closep}
                                            // src="/assets/icon/close.png"
                                            alt="cart1"
                                            width={24}
                                            height={24}
                                            style={{ width: "70%" }}
                                            className={``} />
                                    </button>
                                </div>
                                <div className="col-4">
                                    <h5>My Cart</h5>
                                </div>
                                <div className="col-4">
                                    {/* <p>{getCart?.items?.length || 0} Item(s)</p> */}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center items-center w-full h-full'>
                            <div className='flex flex-col justify-center items-center' style={{ color: "#dd75ac80" }}>
                                <ShoppingCartIcon style={{ width: "5em", height: "5em" }} />
                                <p className='my-1'>Your cart is empty</p>
                            </div>
                        </div>
                    </div>
                }
            </Drawer>
        </div>
    )

}
interface Props {
    sideBarOpen?: boolean,
    sideBarOpenForDiscount?: boolean,
    onSideBarClose?: CallableFunction
}

export default Cart