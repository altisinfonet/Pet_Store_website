import React, { useEffect, useState } from 'react'
import { useCreate, useRead } from '../../../hooks';
import getUrlWithKey from '../../../util/_apiUrl';
// import { getHomePage } from '../../../util/dammyData';
import foodbrands2 from "../../../../public/assets/images/foodbrands2.png"
import productimage1 from "../../../../public/assets/images/product-image1.png"
import categorie1 from "../../../../public/assets/images/categorie1.png"
import brandDam from "../../../../public/assets/images/brandDam.png"
import Link from 'next/link';
import send_icon from "../../../../public/assets/images/send-icon.svg"
import send_icon_pink from "../../../../public/assets/images/send-icon-pink.svg"
import { Box, Dialog, Modal, Rating, Skeleton, Stack } from '@mui/material';
import Login from '../../auth/Login';
import { _ERROR, _SUCCESS, _WARNING } from '../../../util/_reactToast';
import useIsLogedin from '../../../hooks/useIsLogedin';
import Header from '../../../components/layout';
import Slider from "react-slick";
import useTabView from '../../../hooks/useTabView';
import dynamic from 'next/dynamic';
import { setOpenCart } from '../../../reducer/openCartReducer';
import { useDispatch } from 'react-redux';
import { capitalize, lowerCase } from '../../../util/_common';
import { useRouter } from 'next/router';
import Image from 'next/image';
import LazyImage from '../../../components/LazyImage';
import { setOpenAuth } from '../../../reducer/openAuthReducer';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { setMe } from '../../../reducer/me';
import CloseIcon from '@mui/icons-material/Close';
import Notifyimg from "../../../../public/assets/images/notifyimg.png"
import { _put } from '../../../services';
import festive_bg from "../../../../public/assets/images/festive-bg.jpg"

interface Banner {
    id: string;
    title: string;
    description: string;
    section: string | null;
    link: string;
    large_image_device: string;
    medium_image_device: string;
    small_image_device: string;
    updated_at: string;
}

const HomePage = ({
    getHomePageBanner,
    getHomePageBestSellerBanner,
    getHomePageCategoryData,
    getHomePage,
    getArrivalData,
    getBestSellingData
}: any) => {


    // const { isLoged } = useIsLogedin();
    const { isLoged, logedData } = useIsLogedin();
    const { tabView, mobView } = useTabView()
    const dispatch = useDispatch()
    const router = useRouter()
    var currencyFormatter = require('currency-formatter');
    const getme = useSelector((state: any) => state?.meReducer?.value);
    const { create_cart, home_page, get_arrival, get_best_selling, cart_item_count, create_wish_list, home_page_banner, home_page_bestSeller_banner, home_page_category_data, create_notify_me } = getUrlWithKey("client_apis")
    const { me: me_url } = getUrlWithKey("auth_apis");

    let imageSrc = `${process.env.NEXT_PUBLIC_API_URL}/uploads/`;
    const openAuth = useSelector((state: any) => state?.openAuthReducer?.value);
    const [allTrue, setAllTrue]: any = useState<object>({ all: true })
    const [createCartUrl, setCreateCartUrl]: any = useState()
    const [createCartBody, setCreateCartBody]: any = useState({})
    const [cartItemCountUrl, setCartItemCountUrl]: any = useState()
    const [arrivalMeta, setArrivalMeta]: any = useState({ all: false })
    const [bestSellingMeta, setBestSellingMeta]: any = useState({ all: false })
    const [wishListMeta, setWishListMetaMeta]: any = useState()
    const [create_wish_list_url, setCreate_wish_list_url]: any = useState()
    const [productDataid, SetProductDataid] = useState<any>("")
    const [clickNotify, setClickNotify] = useState<boolean>(false);
    const [emial_id, setEmailID] = useState<any>("");
    const [phone_no, setPhone_no] = useState<any>("");
    const [emial_idErr, setEmailIDErr] = useState<any>("");
    const [phone_noErr, setPhone_noErr] = useState<any>("");
    const [arrivalApiUrl, setArrivalApiUrl] = useState("");
    const [getArrival, setGetArrival] = useState<any>();
    const [getBestSelling, setGetBestSelling] = useState<any>();

    // const { sendData: getHomePageBanner }: any = useRead({ selectMethod: "get", url: home_page_banner });
    // const { sendData: getHomePageBestSellerBanner }: any = useRead({ selectMethod: "get", url: home_page_bestSeller_banner });
    // const { sendData: getHomePageCategoryData }: any = useRead({ selectMethod: "get", url: home_page_category_data });
    // const { sendData: getHomePage }: any = useRead({ selectMethod: "get", url: home_page });
    // const { sendData: getArrival }: any = useRead({ selectMethod: "put", url: get_arrival, callData: { all: false } });
    // const { sendData: getBestSelling }: any = useRead({ selectMethod: "put", url: get_best_selling, callData: { all: false } });
    // const { sendData: getCartCount }: any = useRead({ selectMethod: "get", url: cartItemCountUrl });
    const { sendData: createWishList, loading: createWishListLoading, error: createWishListError }: any = useCreate({ url: create_wish_list_url, callData: wishListMeta });
    console.log(getArrival, getBestSelling, getHomePage, "fghfgcg")
    console.log(getHomePage, "dg6d54gr6f")

    useEffect(() => {
        if (getArrivalData?.length) {
            setGetArrival(getArrivalData);
        }
    }, [getArrivalData?.length])

    useEffect(() => {
        if (getBestSellingData?.length) {
            setGetBestSelling(getBestSellingData);
        }
    }, [getBestSellingData?.length])


    var settings1 = {
        infinite: true,
        speed: 500,
        // autoplay: true,
        // autoplay: false,
        slidesToScroll: 1,
        margin: 30,
        // autoplaySpeed: 3000,
        adaptiveHeight: true,
    };

    var settings2 = {
        infinite: true,
        speed: 500,
        margin: 30,
        // autoplay: true,
        // autoplaySpeed: 3000,
        adaptiveHeight: true,
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };



    var responsivefor4 = [
        {
            breakpoint: 2000,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 480,
            // dots: true,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 320,
            // dots: true,
            settings: {
                slidesToShow: 1,
            }
        }
    ]


    var settings6 = {
        infinite: true,
        speed: 500,
        margin: 30,
        // autoplay: true,
        // autoplaySpeed: 3000,
        adaptiveHeight: true,
        dots: false,
        slidesToShow: 6,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 2000,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1
                }
            },

            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 3000
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 340,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }

    var responsivefor6 = [
        {
            breakpoint: 2000,
            settings: {
                slidesToShow: 6,
                slidesToScroll: 1
            }
        },

        {
            breakpoint: 1600,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 320,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]

    var responsivefor4_2 = [
        {
            breakpoint: 2000,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 320,
            settings: {
                slidesToShow: 1,
            }
        }
    ]

    var responsivefor7 = [
        {
            breakpoint: 2000,
            settings: {
                slidesToShow: 7,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 320,
            settings: {
                slidesToShow: 1,
            }
        }
    ]

    const [wishListUrl, setWishListUrl]: any = useState("")
    const [wishListMetaData, setWishListMetaData]: any = useState({})

    const createWishListDetails = (url: any, metaData: any) => {

        if (getme?.id && getme?.role?.label !== "guest") {
            setCreate_wish_list_url(url)
            setWishListMetaMeta(metaData)
        } else {
            setWishListUrl(url)
            setWishListMetaData(metaData)
            dispatch(setOpenAuth(true))
        }
    }

    useEffect(() => {
        if (getme?.id && getme?.role?.label !== "guest" && openAuth === false) {
            setCreate_wish_list_url(wishListUrl)
            setWishListMetaMeta(wishListMetaData)
        }
    }, [getme, openAuth, wishListUrl, wishListMetaData])

    useEffect(() => {
        setWishListMetaMeta()
        setCreate_wish_list_url()
    }, [createWishList, createWishListError])

    useEffect(() => {
        if (createWishList?.id) {
            _SUCCESS("Item added to your wishlist")
        }
    }, [createWishList])

    useEffect(() => {
        if (createWishListError?.massage) {
            _WARNING(createWishListError?.massage)
        }
    }, [createWishListError])

    //**create cart start */
    const { sendData: createCart, error: cartError }: any = useCreate({ url: createCartUrl, callData: createCartBody });

    const onCreateCart = ({ id, v_id }: any) => {
        if (createCartUrl !== create_cart) {
            setCreateCartUrl(create_cart)
            setCreateCartBody({
                product_id: id,
                variation_id: v_id || null,
                // customer_id: 31,   //need to change
                quantity: 1
            })
        }
    }

    // const openCart = () => {
    //     let openCart: any = false
    //     return openCart = true
    // }

    const fetchMe = async () => {
        try {
            const { data: me }: any = await axios.get(me_url, { withCredentials: true });
            if (me?.success && me?.data?.id) {
                localStorage.setItem("logedId", "true");
                dispatch(setMe(me?.data))
            }
        } catch (error) {
            console.log(error);
            if (error && error === "access_denied") {
                localStorage.removeItem("logedId");
            }
        }
    }

    useEffect(() => {
        if (createCartUrl === create_cart) {
            setCreateCartUrl()
        }
    }, [createCartUrl])

    useEffect(() => {
        if (createCart) {
            setCartItemCountUrl(cart_item_count)
            fetchMe();
            dispatch(setOpenCart(true))
        }
    }, [createCart])

    // useEffect(() => {
    //     return returnCartCount
    // }, [getCartCount])

    useEffect(() => {
        if (cartError?.massage) {
            _WARNING(cartError?.massage)
        }
    }, [cartError])

    //**create cart end */

    const decodedTxt = (txt: any) => {
        return txt.replace(/\\r\\n|\\r|\\n/g, '');
    }



    const [recommends, setRecommends] = useState("new_arrivals")

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
            <div className="wrapper">

                {(getHomePageBanner && getHomePageBanner?.home_banners?.length) ?
                    getHomePageBanner?.home_banners?.length > 1 ?
                        <Slider autoplaySpeed={4500} {...settings1} draggable={getHomePageBanner?.home_banners?.length === 1 ? false : true} autoplay={getHomePageBanner?.home_banners?.length === 1 ? false : true} className='pps home_banner h-full' slidesToShow={1} dots={true} arrows={false}>
                            {getHomePageBanner?.home_banners?.length ? getHomePageBanner?.home_banners.map((v: any, i: number) =>
                                (v?.medium_image_device && v?.small_image_device && v?.large_image_device) ?
                                    <div key={i} className="main-ban-sec">
                                        <div className="item" key={i}>
                                            <div className="figure">
                                                <div
                                                    className={`slide-image ih-full ${v?.searchTerm ? "cursor-pointer" : "cursor-default"}`}
                                                    onClick={() => {
                                                        if (v?.searchTerm) {
                                                            router.push(`/shop/${lowerCase(v?.searchTerm)}?type=search`);
                                                        }
                                                    }}
                                                >
                                                    {/* <Image src={tabView, mobView v?.large_image_device} alt="large_image_device" quality={100} width={2560} height={1061} objectFit='' /> */}
                                                    <Image src={tabView ? v?.medium_image_device : mobView ? v?.small_image_device : v?.large_image_device} alt={`${v?.title}`} width={1920} height={600} sizes="(min-width: 1920px) 50vw, 100vw" />
                                                    {/* <LazyImage src={tabView ? v?.medium_image_device : mobView ? v?.small_image_device : v?.large_image_device} alt='hero banner' /> */}
                                                </div>
                                                {/* <div className="caption1">
                                            <div className="container">
                                                <div className="con">
                                                    <h3>Find Right Nutrition For Your Pet</h3>
                                                    <h1>Every Breed Has Unique Needs</h1>
                                                    <p className='wide'>Our wide range of high-quality pet food from the best global brands is available at affordable price points.</p>
                                                    <p><a href="javascript:void(0);" className="btn btn-primary btn-arrow">Shop Now</a></p>
                                                </div>
                                            </div>
                                        </div> */}
                                            </div>
                                        </div>
                                    </div> : null
                            ) : null}
                        </Slider>
                        :
                        <>
                            {getHomePageBanner?.home_banners?.length ? getHomePageBanner?.home_banners.map((v: any, i: number) =>
                                <div className="item" key={i}>
                                    <div className="figure">
                                        <div className="slide-image">
                                            <Image src={tabView ? v?.medium_image_device : mobView ? v?.small_image_device : v?.large_image_device} alt="large_image_device" width={1920} height={600} sizes="(min-width: 1920px) 50vw, 100vw" />
                                        </div>
                                    </div>
                                </div>) : null}
                        </>
                    :
                    <>
                        <div className="item">
                            <div className="figure">
                                <div className="slide-image">
                                    <Image src={festive_bg} alt="large_image_device" width={1920} height={600} sizes="(min-width: 1920px) 50vw, 100vw" />
                                </div>
                            </div>
                        </div>
                    </>
                }

                {/* <!-- Main Start --> */}
                {/* <div id="content" className="site-content p-0"> */}
                {/* <div className="content-area"> */}

                {/* Popular Food Brands */}
                {getHomePage?.id ? <div className="foodbrands-sec h-full">
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            {getHomePage?.page_metas?.length ? getHomePage?.page_metas.filter((fv: any) => fv?.key === "popular_brand").map((v: any, i: number) => {
                                const value = JSON.parse(v?.value)
                                return (
                                    <div className="col-lg-6" key={i}>
                                        <h5 className="text-primary mb-2">{value?.title}</h5>
                                        <h1 className="sp-title text-center">{value?.sub_title}</h1>
                                        <p>{value?.description}</p>
                                    </div>
                                )
                            }) : null}
                        </div>

                        <div className="foodbrands-slider">

                            {getHomePage?.popular_brand_values?.length ?
                                <Slider
                                    autoplaySpeed={3000}
                                    className='pps'
                                    {...settings6}
                                    draggable={getHomePage?.popular_brand_values?.length <= 6 ? false : true}
                                    arrows={tabView ? false : mobView ? false : getHomePage?.popular_brand_values?.length <= 6 ? false : true}
                                // autoplay={getHomePage?.popular_brand_values?.length <= 6 ? false : true}
                                // responsive={responsivefor6}
                                >
                                    {getHomePage?.popular_brand_values.map((v: any, i: number) => {
                                        return (
                                            <div className="item" key={i} data-aos="fade-left">
                                                <Link href={`/shop/brand/${v?.slug}`} className='flex flex-col items-center'>
                                                    <div className="thumb flex justify-center items-center">
                                                        <Image
                                                            src={v?.productTermImage?.image ? v?.productTermImage?.image : "/assets/images/brandDam.png"}
                                                            alt={v?.name}
                                                            style={{
                                                                width: mobView ? "120px" : "170px",
                                                                height: mobView ? "120px" : "170px",
                                                                objectFit: "contain",
                                                                margin: "0 auto",
                                                                borderRadius: "50%",
                                                                border: "1px solid #e4e4e4",
                                                                background: "#fafafa",
                                                                padding: "10px",
                                                            }}
                                                            height={mobView ? 120 : 170}
                                                            width={mobView ? 120 : 170}

                                                            loading="lazy"
                                                            sizes={`(min-width: ${mobView ? "120px" : "170px"}) 50vw, 100vw`}
                                                        />
                                                        {/* <LazyImage
                                                                    src={v?.productTermImage?.image ? v?.productTermImage?.image : "/assets/images/brandDam.png"}
                                                                    alt={v?.name}
                                                                    style={{
                                                                        width: "170px",
                                                                        height: "170px",
                                                                        objectFit: "contain",
                                                                        margin: "0 auto",
                                                                        borderRadius: "50%",
                                                                        border: "1px solid #e4e4e4",
                                                                        background: "#fafafa",
                                                                        padding: "10px",
                                                                    }}
                                                                /> */}
                                                    </div>
                                                    <h5 className='m-0' dangerouslySetInnerHTML={{ __html: v?.name }} />
                                                </Link>
                                            </div>)
                                    })}
                                </Slider> : null}
                        </div>

                    </div>
                </div> : null}

                {/* Featured Products */}
                {getHomePage?.id ? <div className="featured-sec">
                    <div className="container">
                        <div className="row" data-aos="zoom-in">
                            {getHomePage?.features_section?.length ? getHomePage?.features_section.map((v: any, i: number) => {
                                console.log(v, "sdf45g53fsd123")
                                return (
                                    <div className="col-md-8" key={i}>
                                        <h1 className="sp-title">{v?.sub_title}</h1>
                                        <p>{v?.description}</p>
                                    </div>)
                            }) : null}
                        </div>
                        <div className="featured-slider" style={{ padding: "0" }} >
                            {getHomePage?.features_section ? getHomePage?.features_section[0]?.products?.length ?
                                <Slider autoplaySpeed={4500} className='pps' {...settings2} draggable={getHomePage?.features_section[0]?.products?.length <= 4 ? false : true} arrows={tabView ? false : mobView ? false : getHomePage?.features_section[0]?.products?.length <= 4 ? false : true} autoplay={getHomePage?.features_section[0]?.products?.length <= 4 ? false : true} responsive={responsivefor4}>
                                    {getHomePage?.features_section[0].products.map((v: any, i: number) => {
                                        console.log(getHomePage?.features_section, v, "sdf4gf3sdf2")
                                        return (
                                            <div className={mobView ? `item ps-1` : `item`} key={i} data-aos="fade-right">
                                                <div className="product-box">
                                                    <div className="thumb-wrap">
                                                        {/* {!v?.variations?.length ?
                                                            <>
                                                                {(v?.stock_quantity !== 0 ?
                                                                    <>{v?.sale_price ? <h5 style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }} className="offer">{Math.round((v?.price - v?.sale_price) * 100 / v?.price)}% Off</h5> : null}</>
                                                                    : v?.variations?.length ? "" :
                                                                        <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5>)}

                                                                {(v?.stock_quantity !== null ?
                                                                    <>{v?.sale_price ? <h5 style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }} className="offer">{Math.round((v?.price - v?.sale_price) * 100 / v?.price)}% Off</h5> : null}</>
                                                                    : v?.variations?.length ? "" :
                                                                        <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5>)}
                                                            </>
                                                            :
                                                            variationStockQ(v?.variations) === 0 ? <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5> :
                                                                <>{v?.sale_price ? <h5 style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }} className="offer">{Math.round((v?.price - v?.sale_price) * 100 / v?.price)}% Off</h5> : null}</>
                                                        } */}

                                                        {!v?.variations?.length ? (
                                                            <>
                                                                {/* If no variations, check the stock quantity of the main product */}
                                                                {(v?.stock_quantity === 0 || v?.stock_quantity === null) ? (
                                                                    <h5 className="offer" style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5>
                                                                ) : (
                                                                    <>
                                                                        {v?.sale_price && (
                                                                            <h5
                                                                                style={{
                                                                                    fontSize: "14px",
                                                                                    padding: "4px 8px",
                                                                                    margin: "0 20px",
                                                                                    width: "fit-content",
                                                                                    background: "#1f6623",
                                                                                    color: "#ffffff",
                                                                                    borderRadius: "20px",
                                                                                }}
                                                                                className="offer"
                                                                            >
                                                                                {Math.round((v?.price - v?.sale_price) * 100 / v?.price)}% Off
                                                                            </h5>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            variationStockQ(v?.variations) === 0 || variationStockQ(v?.variations) === null ? (
                                                                <h5 className="offer" style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5>
                                                            ) : (
                                                                <>
                                                                    {v?.sale_price && (
                                                                        <h5
                                                                            style={{
                                                                                fontSize: "14px",
                                                                                padding: "4px 8px",
                                                                                margin: "0 20px",
                                                                                width: "fit-content",
                                                                                background: "#1f6623",
                                                                                color: "#ffffff",
                                                                                borderRadius: "20px",
                                                                            }}
                                                                            className="offer"
                                                                        >
                                                                            {Math.round((v?.price - v?.sale_price) * 100 / v?.price)}% Off
                                                                        </h5>
                                                                    )}
                                                                </>
                                                            )
                                                        )}


                                                        {/* {v?.sale_price ? <h5 className="offer">{Math.round((v?.price - v?.sale_price) * 100 / v?.price)}% Off</h5> : null} */}
                                                        <Link href={`/product/${v?.slug}`}>
                                                            <div className="thumb thumb-card">
                                                                <Image src={v?.images?.length ? v?.images[0]?.src : "/assets/images/brandDam.png"} alt="productimage" width={157} height={222} className={`product-img`} sizes="(min-width: 157px) 50vw, 100vw" loading="lazy" />
                                                            </div>
                                                        </Link>
                                                        <ul className="thumb-list">
                                                            {v?.images?.length ? v?.images?.slice(1, 3).map((itm: any, idx: number) =>
                                                                <li key={idx}>
                                                                    <img src={itm?.src ? itm?.src : "/assets/images/brandDam.png"} className='product_smallImage' alt="productimage" width={45} height={45} loading="lazy" sizes="(min-width: 45px) 50vw, 100vw" />
                                                                </li>)
                                                                :
                                                                <li><img src={`/assets/images/brandDam.png`} alt="productimage" className='product_smallImage' width={45} height={45} loading="lazy" sizes="(min-width: 45px) 50vw, 100vw" /></li>}
                                                        </ul>
                                                        <ul className="plinks">
                                                            <li>
                                                                <Link href="javascript:void(0);" style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} onClick={() => { createWishListDetails(create_wish_list, { product_id: v?.id, list_type: "WISHLIST" }); }}><i className="fa-solid fa-heart" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>
                                                            {!v?.variations?.length ? (
                                                                (v?.stock_quantity === 0 || v?.stock_quantity === null) ? (
                                                                    <li><Link href="javascript:void(0);" onClick={() => { getme.id ? v?.variations?.length ? router.push(`/product/${v?.slug}`) : v?.stock_quantity !== 0 || v?.stock_quantity !== null ? onCreateCart({ id: v?.id }) : router.push(`/product/${v?.slug}`) : onCreateCart({ id: v?.id }) }}><i className="fa-solid fa-cart-shopping" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>
                                                                ) : (v?.variations?.length ? "" :
                                                                    <li><Link style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} href={`#`} onClick={() => notifyMe(v?.id)}><i className="fa fa-bell" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>
                                                                )
                                                            ) : (
                                                                variationStockQ(v?.variations) === 0 || variationStockQ(v?.variations) === null ? (

                                                                    <li>
                                                                        <Link style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} href={`#`} onClick={() => notifyMe(v?.id)}><i className="fa fa-bell" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>
                                                                ) : (
                                                                    <li><Link href="javascript:void(0);" style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} onClick={() => { getme.id ? v?.variations?.length ? router.push(`/product/${v?.slug}`) : v?.stock_quantity !== 0 || v?.stock_quantity !== null ? onCreateCart({ id: v?.id }) : router.push(`/product/${v?.slug}`) : onCreateCart({ id: v?.id }) }}><i className="fa-solid fa-cart-shopping" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>
                                                                )
                                                            )
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div className="rating">
                                                        <Stack spacing={1}>
                                                            <Rating name="half-rating" defaultValue={+(v?.rating_count)} precision={0.1} readOnly />
                                                        </Stack>
                                                    </div>
                                                    <h3 className="ptitle truncate m-0">{capitalize(v?.name)}</h3>
                                                    <div className="price">
                                                        {v?.sale_price ? <del className='m-0'><span>₹</span>{v?.price ? currencyFormatter.format(v?.price, { code: '' }) : "00.00"}</del> : null}
                                                        &nbsp;
                                                        <span>₹</span>{v?.sale_price ? currencyFormatter.format(v?.sale_price, { code: '' }) : v?.price ? currencyFormatter.format(v?.price, { code: '' }) : "00.00"}
                                                    </div>
                                                </div>
                                            </div>)
                                    })}
                                </Slider> : null : null}
                        </div>
                    </div>
                </div> : null}

                {/* Explore More Categories */}
                <div className="categories-sec">
                    <div className="container">
                        {getHomePage?.id ? <div className="row" data-aos="zoom-in">
                            {getHomePage?.page_metas?.length ? getHomePage?.page_metas.filter((fv: any) => fv?.key === "explore_categories").map((v: any, i: number) => {
                                const value = JSON.parse(v?.value)
                                console.log(v, value, "352gd415f")

                                return (
                                    <div className="col-md-8" key={i}>
                                        <h5 className="text-primary mb-2">{value?.title}</h5>
                                        <h1 className="sp-title">{value?.sub_title}</h1>
                                        {/* <p>{value?.description}</p> */}
                                    </div>)
                            }) : null}
                        </div> : null}
                        {getHomePageCategoryData && getHomePageCategoryData?.explore_categories_lists && getHomePageCategoryData?.explore_categories_lists?.length ?
                            <div className="categories-slider">
                                {getHomePageCategoryData?.explore_categories_lists?.length ?
                                    <Slider
                                        autoplaySpeed={3000}
                                        className='pps'
                                        {...settings1}
                                        draggable={getHomePageCategoryData?.explore_categories_lists?.length <= 7 ? false : true}
                                        arrows={tabView ? false : mobView ? false : getHomePageCategoryData?.explore_categories_lists?.length <= 7 ? false : true}
                                        autoplay={getHomePageCategoryData?.explore_categories_lists?.length <= 7 ? false : true}
                                        responsive={responsivefor7}
                                    >
                                        {getHomePageCategoryData?.explore_categories_lists.map((v: any, i: number) => {
                                            // console.log(v, "352gd415f")
                                            return (
                                                <div className="item" key={i} onClick={() => router.push(`/shop/${v?.slug}`)} data-aos="zoom-in">
                                                    <Link href={`/product_category/${v?.slug}`}>
                                                        <div className="thumb">
                                                            <Image
                                                                src={v?.image ? v?.image : "/assets/images/brandDam.png"}
                                                                alt="categorieImage"
                                                                style={mobView ? { width: "125px" } : { width: "157px" }}
                                                                width={mobView ? 125 : 157}
                                                                height={175}
                                                                loading="lazy"
                                                                sizes={`(min-width: ${mobView ? "125px" : "157px"}) 50vw, 100vw`}
                                                            />
                                                        </div>
                                                        <h5><span className='capitalize'>{capitalize(v?.name)}</span></h5>
                                                    </Link>
                                                </div>)
                                        })}
                                    </Slider> : null}
                            </div> : null}
                    </div>
                </div>

                {/* best seller banners 1 */}
                {/* {getHomePageBestSellerBanner && getHomePageBestSellerBanner?.best_seller_banners?.length ? getHomePageBestSellerBanner?.best_seller_banners[0]?.large_image_device ?
                    <div className="festive-sec" style={{
                        background: `URL(${tabView ? getHomePageBestSellerBanner?.best_seller_banners[0]?.medium_image_device : mobView ? getHomePageBestSellerBanner?.best_seller_banners[0]?.small_image_device : getHomePageBestSellerBanner?.best_seller_banners[0]?.large_image_device}) center center no-repeat #fbf2f4`,
                        backgroundSize: "cover"
                    }}
                    >
                        <div className="container">
                            <div className="caption">
                                <h1>Furry Fashion For This Festive Seasons</h1>
                                <p><Link href="/offer" className="btn btn-primary" tabIndex={0} >Shop Today</Link></p>
                            </div>
                        </div>
                    </div> : null : null} */}

                {/* Best seller banners with section === 'section1' */}
                {/* {getHomePageBestSellerBanner && getHomePageBestSellerBanner?.best_seller_banners?.length ?
                    getHomePageBestSellerBanner?.best_seller_banners.filter(banner => banner.section === 'section1').map((banner, index) => {
                        const isLinkValid = banner.link && banner.link.includes("://") && banner.link.split("/").length > 3;
                        return (
                            <div
                                key={index}
                                className="festive-sec"
                                style={{
                                    background: `url(${tabView ? banner.medium_image_device : mobView ? banner.small_image_device : banner.large_image_device}) center center no-repeat #fbf2f4`,
                                    backgroundSize: "cover",
                                    cursor: isLinkValid ? 'pointer' : 'default',
                                }}
                                onClick={() => {
                                    if (isLinkValid) {
                                        window.location.href = banner.link;
                                    }
                                }}
                            >
                                <div className="container">
                                    <div className="caption">
                                        <h1>{banner.title}</h1>
                                        <p>{banner.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : null} */}
                {getHomePageBestSellerBanner && getHomePageBestSellerBanner?.best_seller_banners?.length ? (
                    getHomePageBestSellerBanner?.best_seller_banners
                        .filter((banner) => banner.section === 'section1')
                        .sort((a, b) => {
                            const dateA = new Date(a.updated_at as string);
                            const dateB = new Date(b.updated_at as string);
                            return dateB.getTime() - dateA.getTime();
                        })
                        .slice(0, 1)
                        .map((banner: any, index: number) => {
                            const isLinkValid =
                                banner.link && banner.link.includes('://') && banner.link.split('/').length > 3;
                            return (
                                <div
                                    key={index}
                                    className="festive-sec"
                                    style={{
                                        background: `url(${tabView
                                            ? banner.medium_image_device
                                            : mobView
                                                ? banner.small_image_device
                                                : banner.large_image_device
                                            }) center center no-repeat #fbf2f4`,
                                        backgroundSize: 'cover',
                                        cursor: isLinkValid ? 'pointer' : 'default',
                                    }}
                                    onClick={() => {
                                        if (isLinkValid) {
                                            window.location.href = banner.link;
                                        }
                                    }}
                                >
                                    <div className="container">
                                        <div className="caption">
                                            <h1 className='sp-title'>{banner.title}</h1>
                                            <p className=''>{banner.description}</p>
                                            <p className='mt-2 btn btn-primary'
                                                onClick={() => {
                                                    if (isLinkValid) {
                                                        window.location.href = banner.link;
                                                    }
                                                }}
                                            >
                                                Shop Today
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                ) : null}





                {/* New Arrivals Best Sellers */}
                <div className="exclusive-sec">
                    <div className="container">

                        <div className="row justify-content-center text-center" data-aos="fade-down">
                            {getHomePage?.page_metas?.length ? getHomePage?.page_metas.filter((fv: any) => fv?.key === "recommends").map((v: any, i: number) => {
                                const value = JSON.parse(v?.value)
                                return (
                                    <div className="col-lg-6" key={i}>
                                        <h5 className="text-primary mb-2">{value?.title}</h5>
                                        <h1 className="sp-title text-center">{value?.sub_title}</h1>
                                        <p>{value?.description}</p>
                                    </div>)
                            }) : null}
                        </div>

                        <ul className="nav nav-exclusive" id="pills-tab" role="tablist">
                            {getArrival?.length ?
                                <li className="nav-item">
                                    <button className={`nav-link ${recommends === "new_arrivals" ? "active" : ""}`} onClick={() => setRecommends("new_arrivals")} type="button">New Arrivals</button>
                                </li>
                                :
                                null
                            }
                            {getBestSelling?.length ?
                                <li className="nav-item">
                                    <button className={`nav-link ${recommends === "best_sellers" ? "active" : ""}`} onClick={() => setRecommends("best_sellers")} type="button">Best Sellers</button>
                                </li>
                                :
                                null
                            }
                        </ul>


                        <div className="tab-content" id="pills-tabContent">

                            {/*New Arrivals*/}
                            {recommends === "new_arrivals" ?
                                <div className="PListing">
                                    <div className="product-grid">
                                        {getArrival?.length ? getArrival.map((v: any, i: number) =>
                                            <div className="item" key={i} data-aos="zoom-in-up">
                                                <div className="product-box">
                                                    <div className="thumb-wrap">

                                                        {/* Old code for New Arrivals  */}
                                                        {/* {!v?.product_details?.variations?.length ?
                                                            <>
                                                                {(v?.product_details?.stock_quantity !== 0 ?
                                                                    <>
                                                                        {v?.product_details?.sale_price ?
                                                                            <h5 style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }} className="offer">{Math.round((v?.product_details?.price - v?.product_details?.sale_price) * 100 / v?.product_details?.price)}% Off</h5> : null}
                                                                    </>
                                                                    : v?.product_details?.variations?.length ? "" :
                                                                        <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5>)}

                                                                {(v?.product_details?.stock_quantity !== null ?
                                                                    <>{v?.product_details?.sale_price ? <h5 style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }} className="offer">{Math.round((v?.product_details?.price - v?.product_details?.sale_price) * 100 / v?.product_details?.price)}% Off</h5> : null}</>
                                                                    : v?.product_details?.variations?.length ? "" :
                                                                        <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5>)}
                                                            </>
                                                            :
                                                            variationStockQ(v?.product_details?.variations) === 0 ? <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5> :
                                                                <>{v?.product_details?.sale_price ? <h5 style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }} className="offer">{Math.round((v?.product_details?.price - v?.product_details?.sale_price) * 100 / v?.product_details?.price)}% Off</h5> : null}</>
                                                        } */}

                                                        {/* New Updaetd code New Arrivals  */}
                                                        {
                                                            !v?.product_details?.variations?.length ? (
                                                                <>
                                                                    {/* Check if variations is empty and check stock_quantity for the simple product */}
                                                                    {v?.product_details?.stock_quantity !== 0 && v?.product_details?.stock_quantity !== null ? (
                                                                        <>
                                                                            {/* Show offer if stock is available */}
                                                                            {v?.product_details?.sale_price && (
                                                                                <h5
                                                                                    style={{
                                                                                        fontSize: "14px",
                                                                                        padding: "4px 8px",
                                                                                        margin: "0 20px",
                                                                                        width: "fit-content",
                                                                                        background: "#1f6623",
                                                                                        color: "#ffffff",
                                                                                        borderRadius: "20px",
                                                                                    }}
                                                                                    className="offer"
                                                                                >
                                                                                    {Math.round(
                                                                                        (v?.product_details?.price - v?.product_details?.sale_price) * 100 /
                                                                                        v?.product_details?.price
                                                                                    )}
                                                                                    % Off
                                                                                </h5>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <h5 className="offer" style={{ color: "red", fontSize: "14px" }}>
                                                                            Out Of Stock
                                                                        </h5>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                // If variations exist, check each variation's stock quantity
                                                                v?.product_details?.variations.some(
                                                                    (variation: any) => variation.stock_quantity === 0 || variation.stock_quantity === null
                                                                ) ? (
                                                                    <h5 className="offer" style={{ color: "red", fontSize: "14px" }}>
                                                                        Out Of Stock
                                                                    </h5>
                                                                ) : (
                                                                    <>
                                                                        {/* Show offer if stock is available for any variation */}
                                                                        {v?.product_details?.sale_price && (
                                                                            <h5
                                                                                style={{
                                                                                    fontSize: "14px",
                                                                                    padding: "4px 8px",
                                                                                    margin: "0 20px",
                                                                                    width: "fit-content",
                                                                                    background: "#1f6623",
                                                                                    color: "#ffffff",
                                                                                    borderRadius: "20px",
                                                                                }}
                                                                                className="offer"
                                                                            >
                                                                                {Math.round(
                                                                                    (v?.product_details?.price - v?.product_details?.sale_price) * 100 /
                                                                                    v?.product_details?.price
                                                                                )}
                                                                                % Off
                                                                            </h5>
                                                                        )}
                                                                    </>
                                                                )
                                                            )
                                                        }


                                                        {/* {!v?.product_details.variations?.length ?
                                                                    ((v?.product_details?.stock_quantity !== 0 || v?.product_details?.stock_quantity !== null) ?
                                                                        <>{v?.product_details?.sale_price ? <h5 style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }} className="offer">{Math.round((v?.product_details?.price - v?.product_details?.sale_price) * 100 / v?.product_details?.price)}% Off</h5> : null}</>
                                                                        :
                                                                        v?.product_details?.variations?.length ? "" :
                                                                            <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5>)
                                                                    :
                                                                    variationStockQ(v?.product_details?.variations) === 0 ? <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5>
                                                                        :
                                                                        <>{v?.product_details?.sale_price ? <h5 style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }} className="offer">{Math.round((v?.product_details?.price - v?.product_details?.sale_price) * 100 / v?.product_details?.price)}% Off</h5> : null}</>
                                                                } */}
                                                        {/* {v?.sale_price ? <h5 className="offer">{Math.round((v?.price - v?.sale_price) * 100 / v?.price)}% Off</h5> : null} */}
                                                        <Link href={`/product/${v?.product_details?.slug}`}>
                                                            <div className="thumb thumb-card">
                                                                <Image src={v?.product_details?.images[0]?.src || "/assets/images/brandDam.png"} alt="product-image" className={`product-img`} width={157} height={222} sizes="(min-width: 157px) 50vw, 100vw" loading="lazy" />
                                                            </div>
                                                        </Link>
                                                        <ul className="thumb-list">
                                                            {v?.product_details?.images?.length ? v?.product_details?.images.slice(1, 3).map((val: any, idx: number) => <li key={idx}>
                                                                <Link href="javascript:void(0);">
                                                                    <Image src={val?.src || "/assets/images/brandDam.png"} alt="product-image" className='product_smallImage' width={45} height={45} sizes="(min-width: 45px) 50vw, 100vw" loading="lazy" />
                                                                </Link>
                                                            </li>) : null}
                                                        </ul>
                                                        <ul className="plinks">
                                                            <li><Link
                                                                href="javascript:void(0);"
                                                                style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                onClick={() => { createWishListDetails(create_wish_list, { product_id: v?.product_details?.id, list_type: "WISHLIST" }); }}>
                                                                <i className="fa-solid fa-heart" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>

                                                            {/* Old code for New Arrivals  */}
                                                            {/*
                                                            {!v?.product_details.variations?.length ?
                                                                ((v?.product_details?.stock_quantity !== 0 || v?.product_details?.stock_quantity !== null) ?
                                                                    <li><Link
                                                                        style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                        href="javascript:void(0);"
                                                                        onClick={() => { getme.id ? v?.product_details?.variations?.length ? router.push(`/product/${v?.product_details?.slug}`) : (v?.product_details?.stock_quantity !== 0 || v?.product_details?.stock_quantity !== null) ? onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id }) : router.push(`/product/${v?.product_details?.slug}`) : onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id }) }}>
                                                                        <i className="fa-solid fa-cart-shopping" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i>
                                                                    </Link></li>
                                                                    :
                                                                    v?.product_details?.variations?.length ? "" :
                                                                        <li><Link style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} href={`#`} onClick={() => notifyMe(v?.product_details?.id)}><i className="fa fa-bell" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>)
                                                                :
                                                                variationStockQ(v?.product_details?.variations) === 0 ?
                                                                    <li><Link style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} href={`#`} onClick={() => notifyMe(v?.product_details?.id)}><i className="fa fa-bell" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>
                                                                    :
                                                                    <li>
                                                                        <Link
                                                                            style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                            href={v?.product_details?.variations?.length ? `/product/${v?.product_details?.slug}` : "javascript:void(0);"}
                                                                            onClick={() => { getme.id ? v?.product_details?.variations?.length ? router.push(`/product/${v?.product_details?.slug}`) : (v?.product_details?.stock_quantity !== 0 || v?.product_details?.stock_quantity !== null) ? onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id }) : router.push(`/product/${v?.product_details?.slug}`) : onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id }) }}>
                                                                            <i className="fa-solid fa-cart-shopping" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i>
                                                                        </Link>
                                                                    </li>
                                                            } */}

                                                            {/* New Updaetd code for New Arrivals */}
                                                            {
                                                                !v?.product_details?.variations?.length ? (
                                                                    <>
                                                                        {/* For Simple Product */}
                                                                        {v?.product_details?.stock_quantity !== 0 && v?.product_details?.stock_quantity !== null ? (
                                                                            <li>
                                                                                <Link
                                                                                    style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                                    href="javascript:void(0);"
                                                                                    onClick={() => {
                                                                                        getme.id
                                                                                            ? v?.product_details?.variations?.length
                                                                                                ? router.push(`/product/${v?.product_details?.slug}`)
                                                                                                : v?.product_details?.stock_quantity !== 0 && v?.product_details?.stock_quantity !== null
                                                                                                    ? onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id })
                                                                                                    : router.push(`/product/${v?.product_details?.slug}`)
                                                                                            : onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id });
                                                                                    }}
                                                                                >
                                                                                    <i className="fa-solid fa-cart-shopping" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i>
                                                                                </Link>
                                                                            </li>
                                                                        ) : (
                                                                            <li>
                                                                                <Link
                                                                                    style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                                    href={`#`}
                                                                                    onClick={() => notifyMe(v?.product_details?.id)}
                                                                                >
                                                                                    <i className="fa fa-bell" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i>
                                                                                </Link>
                                                                            </li>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    // For variations
                                                                    v?.product_details?.variations?.some(
                                                                        (variation) => variation.stock_quantity === 0 || variation.stock_quantity === null
                                                                    ) ? (
                                                                        // If any variation has 0 or null stock quantity, show the "Out of Stock" bell icon
                                                                        <li>
                                                                            <Link
                                                                                style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                                href={`#`}
                                                                                onClick={() => notifyMe(v?.product_details?.id)}
                                                                            >
                                                                                <i className="fa fa-bell" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i>
                                                                            </Link>
                                                                        </li>
                                                                    ) : (
                                                                        // If all variations have stock, show the cart icon
                                                                        <li>
                                                                            <Link
                                                                                style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                                href={`javascript:void(0);`}
                                                                                onClick={() => {
                                                                                    getme.id
                                                                                        ? v?.product_details?.variations?.length
                                                                                            ? router.push(`/product/${v?.product_details?.slug}`)
                                                                                            : v?.product_details?.stock_quantity !== 0 && v?.product_details?.stock_quantity !== null
                                                                                                ? onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id })
                                                                                                : router.push(`/product/${v?.product_details?.slug}`)
                                                                                        : onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id });
                                                                                }}
                                                                            >
                                                                                <i className="fa-solid fa-cart-shopping" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i>
                                                                            </Link>
                                                                        </li>
                                                                    )
                                                                )
                                                            }


                                                        </ul>
                                                    </div>
                                                    <div className="rating">
                                                        <Stack spacing={1}>
                                                            <Rating name="half-rating" defaultValue={+(v?.product_details?.rating_count)} precision={0.1} readOnly />
                                                        </Stack>
                                                    </div>
                                                    <h3 className="ptitle truncate m-0"><Link href="javascript:void(0);">{capitalize(v?.product_details?.name)}</Link></h3>
                                                    <div className="price">
                                                        {/* <span>₹</span>396.50  <del><span>₹</span>450.00</del> */}
                                                        {v?.product_details?.sale_price ? <del className='m-0'><span>₹</span>{v?.product_details?.price ? currencyFormatter.format(v?.product_details?.price, { code: '' }) : "00.00"}</del> : null}&nbsp;
                                                        <span>₹</span>{v?.product_details?.sale_price ? currencyFormatter.format(v?.product_details?.sale_price, { code: '' }) : v?.product_details?.price ? currencyFormatter.format(v?.product_details?.price, { code: '' }) : "00.00"}
                                                    </div>
                                                </div>
                                            </div>)
                                            :
                                            null
                                        }
                                    </div>
                                </div> : null}

                            {/*Best Sellers*/}
                            {recommends === "best_sellers" ?
                                <div className="PListing" id="tab-best" tabIndex={0}>
                                    <div className="product-grid">
                                        {getBestSelling?.length ? getBestSelling.map((v: any, i: number) =>
                                            <div className="item" key={i} data-aos="zoom-in-up">
                                                <div className="product-box">
                                                    <div className="thumb-wrap">

                                                        {/* Old code for Best Seller */}

                                                        {/* {!v?.product_details?.variations?.length ?
                                                            <>
                                                                {(v?.product_details?.stock_quantity !== 0 ?
                                                                    <>{v?.product_details?.sale_price ? <h5 style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }} className="offer">{Math.round((v?.product_details?.price - v?.product_details?.sale_price) * 100 / v?.product_details?.price)}% Off</h5> : null}</>
                                                                    : v?.product_details?.variations?.length ? "" :
                                                                        <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5>)}

                                                                {(v?.product_details?.stock_quantity !== null ?
                                                                    <>{v?.product_details?.sale_price ? <h5 style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }} className="offer">{Math.round((v?.product_details?.price - v?.product_details?.sale_price) * 100 / v?.product_details?.price)}% Off</h5> : null}</>
                                                                    : v?.product_details?.variations?.length ? "" :
                                                                        <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5>)}
                                                            </>
                                                            :
                                                            variationStockQ(v?.product_details?.variations) === 0 ? <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5> :
                                                                <>{v?.product_details?.sale_price ? <h5 style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }} className="offer">{Math.round((v?.product_details?.price - v?.product_details?.sale_price) * 100 / v?.product_details?.price)}% Off</h5> : null}</>
                                                        } */}


                                                        {/* New updated code for Best Seller */}
                                                        {
                                                            !v?.product_details?.variations?.length ? (
                                                                <>
                                                                    {/* Condition for Simple Product */}
                                                                    {v?.product_details?.stock_quantity !== 0 && v?.product_details?.stock_quantity !== null ? (
                                                                        // Cart option can be added here in place of "Out of Stock" notification.
                                                                        <>
                                                                            {v?.product_details?.sale_price && (
                                                                                <h5
                                                                                    style={{
                                                                                        fontSize: "14px",
                                                                                        padding: "4px 8px",
                                                                                        margin: "0 20px",
                                                                                        width: "fit-content",
                                                                                        background: "#1f6623",
                                                                                        color: "#ffffff",
                                                                                        borderRadius: "20px",
                                                                                    }}
                                                                                    className="offer"
                                                                                >
                                                                                    {Math.round(
                                                                                        (v?.product_details?.price - v?.product_details?.sale_price) * 100 /
                                                                                        v?.product_details?.price
                                                                                    )}
                                                                                    % Off
                                                                                </h5>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        // Simple Product, Out of Stock
                                                                        <h5 className="offer" style={{ color: "red", fontSize: "14px" }}>
                                                                            Out Of Stock
                                                                        </h5>
                                                                    )}

                                                                </>
                                                            ) : (
                                                                v?.product_details?.variations.some(
                                                                    (variation: any) => variation.stock_quantity === 0 || variation.stock_quantity === null
                                                                ) ? (
                                                                    <h5 className="offer" style={{ color: "red", fontSize: "14px" }}>
                                                                        Out Of Stock
                                                                    </h5>
                                                                ) : (
                                                                    <>
                                                                        {v?.product_details?.sale_price && (
                                                                            <h5
                                                                                style={{
                                                                                    fontSize: "14px",
                                                                                    padding: "4px 8px",
                                                                                    margin: "0 20px",
                                                                                    width: "fit-content",
                                                                                    background: "#1f6623",
                                                                                    color: "#ffffff",
                                                                                    borderRadius: "20px",
                                                                                }}
                                                                                className="offer"
                                                                            >
                                                                                {Math.round(
                                                                                    (v?.product_details?.price - v?.product_details?.sale_price) * 100 /
                                                                                    v?.product_details?.price
                                                                                )}
                                                                                % Off
                                                                            </h5>
                                                                        )}
                                                                    </>
                                                                )
                                                            )
                                                        }
                                                        <Link href={`/product/${v?.product_details?.slug}`}>
                                                            <div className="thumb thumb-card">
                                                                <Image src={v?.product_details?.images[0]?.src || "/assets/images/brandDam.png"} width={157} height={222} alt="product-image" className={`product-img`} loading="lazy" sizes="(min-width: 157px) 50vw, 100vw" />
                                                            </div>
                                                        </Link>
                                                        <ul className="thumb-list">
                                                            {v?.product_details?.images?.length ? v?.product_details?.images.slice(1, 3).map((val: any, idx: number) => <li key={idx}><Link href="javascript:void(0);"><Image src={val?.src || "/assets/images/brandDam.png"} alt="product-image" className='product_smallImage' width={45} height={45} loading="lazy" sizes="(min-width: 45px) 50vw, 100vw" /></Link></li>) : null}
                                                        </ul>
                                                        <ul className="plinks">
                                                            <li><Link href="javascript:void(0);" style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} onClick={() => { createWishListDetails(create_wish_list, { product_id: v?.product_details?.id, list_type: "WISHLIST" }); }}><i className="fa-solid fa-heart" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>

                                                            {/* Old code for Best Seller */}

                                                            {/* {!v?.product_details.variations?.length ?
                                                                ((v?.product_details?.stock_quantity !== 0 || v?.product_details?.stock_quantity !== null) ?
                                                                    <li>
                                                                        <Link
                                                                            href="javascript:void(0);"
                                                                            style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                            onClick={() => { getme.id ? v?.product_details?.variations?.length ? router.push(`/product/${v?.product_details?.slug}`) : (v?.product_details?.stock_quantity !== 0 || v?.product_details?.stock_quantity !== null) ? onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id }) : router.push(`/product/${v?.product_details?.slug}`) : onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id }) }}>
                                                                            <i className="fa-solid fa-cart-shopping" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i>
                                                                        </Link></li>
                                                                    :
                                                                    v?.product_details?.variations?.length ? "" :
                                                                        <li><Link style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} href={`#`} onClick={() => notifyMe(v?.product_details?.id)}><i className="fa fa-bell" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>)
                                                                :
                                                                variationStockQ(v?.product_details?.variations) === 0 ?
                                                                    <li><Link style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} href={`#`} onClick={() => notifyMe(v?.product_details?.id)}><i className="fa fa-bell" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>
                                                                    :
                                                                    <li>
                                                                        <Link
                                                                            style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                            href={v?.product_details?.variations?.length ? `/product/${v?.product_details?.slug}` : "javascript:void(0);"}
                                                                            onClick={() => { getme.id ? v?.product_details?.variations?.length ? router.push(`/product/${v?.product_details?.slug}`) : (v?.product_details?.stock_quantity !== 0 || v?.product_details?.stock_quantity !== null) ? onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id }) : router.push(`/product/${v?.product_details?.slug}`) : onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id }) }}>
                                                                            <i className="fa-solid fa-cart-shopping" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i>
                                                                        </Link>
                                                                    </li>
                                                            } */}

                                                            {/* New updated code for Best Seller */}
                                                            {
                                                                !v?.product_details?.variations?.length ? (
                                                                    <>
                                                                        {/* Check if the product has stock */}
                                                                        {v?.product_details?.stock_quantity !== 0 && v?.product_details?.stock_quantity !== null ? (
                                                                            <li>
                                                                                <Link
                                                                                    href="javascript:void(0);"
                                                                                    style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                                    onClick={() => {
                                                                                        getme.id
                                                                                            ? v?.product_details?.variations?.length
                                                                                                ? router.push(`/product/${v?.product_details?.slug}`)
                                                                                                : (v?.product_details?.stock_quantity !== 0 || v?.product_details?.stock_quantity !== null)
                                                                                                    ? onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id })
                                                                                                    : router.push(`/product/${v?.product_details?.slug}`)
                                                                                            : onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id })
                                                                                    }}
                                                                                >
                                                                                    <i className="fa-solid fa-cart-shopping" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i>
                                                                                </Link>
                                                                            </li>
                                                                        ) : (
                                                                            // Out of stock, show the bell icon
                                                                            <li>
                                                                                <Link
                                                                                    style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                                    href="#"
                                                                                    onClick={() => notifyMe(v?.product_details?.id)}
                                                                                >
                                                                                    <i className="fa fa-bell" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i>
                                                                                </Link>
                                                                            </li>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    // Handle variations
                                                                    variationStockQ(v?.product_details?.variations) === 0 ? (
                                                                        <li>
                                                                            <Link
                                                                                style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                                href="#"
                                                                                onClick={() => notifyMe(v?.product_details?.id)}
                                                                            >
                                                                                <i className="fa fa-bell" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i>
                                                                            </Link>
                                                                        </li>
                                                                    ) : (
                                                                        <li>
                                                                            <Link
                                                                                style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}
                                                                                href={v?.product_details?.variations?.length ? `/product/${v?.product_details?.slug}` : "javascript:void(0);"}
                                                                                onClick={() => {
                                                                                    getme.id
                                                                                        ? v?.product_details?.variations?.length
                                                                                            ? router.push(`/product/${v?.product_details?.slug}`)
                                                                                            : (v?.product_details?.stock_quantity !== 0 || v?.product_details?.stock_quantity !== null)
                                                                                                ? onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id })
                                                                                                : router.push(`/product/${v?.product_details?.slug}`)
                                                                                        : onCreateCart({ id: v?.product_details?.id, v_id: v?.product_details?.variation_id })
                                                                                }}
                                                                            >
                                                                                <i className="fa-solid fa-cart-shopping" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i>
                                                                            </Link>
                                                                        </li>
                                                                    )
                                                                )
                                                            }


                                                        </ul>
                                                    </div>
                                                    <div className="rating">
                                                        <Stack spacing={1}>
                                                            <Rating name="half-rating" defaultValue={+(v?.product_details?.rating_count)} precision={0.1} readOnly />
                                                        </Stack>
                                                    </div>
                                                    <h3 className="ptitle truncate m-0"><Link href="javascript:void(0);">{capitalize(v?.product_details?.name)}</Link></h3>
                                                    <div className="price">
                                                        {v?.product_details?.sale_price ? <del className='m-0'><span>₹</span>{v?.product_details?.price ? currencyFormatter.format(v?.product_details?.price, { code: '' }) : "00.00"}</del> : null}&nbsp;
                                                        <span>₹</span>{v?.product_details?.sale_price ? currencyFormatter.format(v?.product_details?.sale_price, { code: '' }) : v?.product_details?.price ? currencyFormatter.format(v?.product_details?.price, { code: '' }) : "00.00"}

                                                    </div>
                                                </div>
                                            </div>) : null}
                                    </div>
                                </div> : null}
                        </div>
                    </div>
                </div>

                {/* best seller banners - section2 */}
                {/* {getHomePageBestSellerBanner && getHomePageBestSellerBanner?.best_seller_banners?.length ?
                    getHomePageBestSellerBanner?.best_seller_banners.filter(banner => banner.section === 'section2').map((banner, index) => {
                        const isLinkValid = banner.link && banner.link.includes("://") && banner.link.split("/").length > 3;
                        return (
                            <div
                                key={index}
                                className="paw-sec"
                                style={{
                                    background: `url(${tabView ? banner.medium_image_device : mobView ? banner.small_image_device : banner.large_image_device}) center center no-repeat`,
                                    backgroundSize: "cover",
                                    cursor: isLinkValid ? 'pointer' : 'default',
                                }}
                                onClick={() => {
                                    if (isLinkValid) {
                                        window.location.href = banner.link;
                                    }
                                }}
                            >
                                <div className="container" style={{ height: "100%", display: "flex", alignItems: "center" }}>
                                    <div className="caption" style={{ color: "#fff", textAlign: "center", padding: "0 20px", maxWidth: "600px", margin: "0 auto" }}>
                                        <h1>{banner.title}</h1>
                                        <p>{banner.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : null} */}
                {getHomePageBestSellerBanner && getHomePageBestSellerBanner?.best_seller_banners?.length ? (
                    getHomePageBestSellerBanner?.best_seller_banners
                        .filter((banner) => banner.section === 'section2')
                        .sort((a, b) => {
                            const dateA = new Date(a.updated_at as string);
                            const dateB = new Date(b.updated_at as string);
                            return dateB.getTime() - dateA.getTime();
                        })
                        .slice(0, 1)
                        .map((banner: any, index: number) => {
                            const isLinkValid =
                                banner.link && banner.link.includes('://') && banner.link.split('/').length > 3;
                            return (
                                <div
                                    key={index}
                                    className="paw-sec"
                                    style={{
                                        background: `url(${tabView
                                            ? banner.medium_image_device
                                            : mobView
                                                ? banner.small_image_device
                                                : banner.large_image_device
                                            }) center center no-repeat`,
                                        backgroundSize: 'cover',
                                        cursor: isLinkValid ? 'pointer' : 'default',
                                    }}
                                    onClick={() => {
                                        if (isLinkValid) {
                                            window.location.href = banner.link;
                                        }
                                    }}
                                >
                                    <div
                                        className="container"
                                        style={{ height: '100%', display: 'flex', alignItems: 'center' }}
                                    >
                                        <div
                                            className="caption"
                                        // style={{
                                        //     color: '#fff',
                                        //     textAlign: 'right',
                                        //     padding: '0 20px',
                                        //     maxWidth: '600px',
                                        //     margin: '0 auto',
                                        // }}
                                        >
                                            <h1 className='sp-title text-white'>{banner.title}</h1>
                                            <p>{banner.description}</p>
                                            <p className='mt-2 btn btn-primary'
                                                onClick={() => {
                                                    if (isLinkValid) {
                                                        window.location.href = banner.link;
                                                    }
                                                }}
                                            >
                                                Shop Today
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            );
                        })
                ) : null}


                {/* Fun ways & Our Story */}
                {getHomePage?.id ? <div className="fun-and-story-sec">
                    <div className="container">
                        <div className="row items-baseline">
                            <div className="col-lg-6">
                                <h1 className="sp-title mb-xl-5">{getHomePage?.diff_leases ? getHomePage?.diff_leases[0]?.sub_title : null}</h1>
                                <div className="row">
                                    <div className="col-xl-7">
                                        <p>{getHomePage?.diff_leases ? getHomePage?.diff_leases[0]?.description : null}</p>
                                    </div>
                                </div>
                                <Slider
                                    autoplaySpeed={4000}
                                    className='pps'
                                    {...settings1}
                                    draggable={getHomePage?.diff_leases[0]?.categories?.length <= 4 ? false : true}
                                    arrows={tabView ? false : mobView ? false : getHomePage?.diff_leases[0]?.categories?.length <= 4 ? false : true}
                                    autoplay={getHomePage?.diff_leases[0]?.categories?.length <= 4 ? false : true}
                                    responsive={responsivefor4_2}
                                >
                                    {getHomePage?.diff_leases ? getHomePage?.diff_leases[0]?.categories?.length ? getHomePage?.diff_leases[0]?.categories.map((v: any, i: number) =>
                                        <div className="item" key={i} data-aos="fade-right">
                                            <Link href={`/product_category/${v?.slug}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                                <div className="thumb">
                                                    {v?.image ? <Image
                                                        src={v?.image}
                                                        alt={v?.name}
                                                        style={mobView ? { width: "100px" } : { width: "137px" }}
                                                        width={mobView ? 100 : 137}
                                                        height={153}
                                                        sizes={`(min-width: ${mobView ? 100 : 137}) 50vw, 100vw`}
                                                        loading="lazy"
                                                    />
                                                        :
                                                        <Image
                                                            src={brandDam}
                                                            alt='brandDam'
                                                            style={mobView ? { width: "100px" } : { width: "137px" }}
                                                            width={mobView ? 100 : 137}
                                                            height={153}
                                                            sizes={`(min-width: ${mobView ? 100 : 137}) 50vw, 100vw`}
                                                            loading="lazy"
                                                        />}
                                                </div>
                                                <h5 style={{ fontSize: "90%" }}><span className='color-e4509d'>{capitalize(v?.name)}</span></h5>
                                            </Link>
                                        </div>) : null : null}
                                </Slider>
                            </div>
                            <div className="col-lg-6">
                                <div className="our-story">
                                    <h1 className="sp-title" data-aos="zoom-in">Our Story</h1>
                                    <div className="testimonials-slider h-full">
                                        {getHomePage?.our_stories?.length ?
                                            <Slider autoplaySpeed={5000} {...settings1} draggable={getHomePage?.our_stories?.length === 1 ? false : true} arrows={tabView ? false : mobView ? false : getHomePage?.our_stories?.length === 1 ? false : true} autoplay={getHomePage?.our_stories?.length === 1 ? false : true} slidesToShow={1} className='pps h-full'>
                                                {getHomePage?.our_stories.map((v: any, i: number) =>
                                                    <div className="item h-full" key={i} data-aos="zoom-in">
                                                        <div className="testimonials-box flex flex-col justify-between h-full">
                                                            <div>
                                                                <h5>Trusted By All Pet Parents</h5>
                                                                <div className='mb-3' style={{ height: "13rem", overflowX: "auto" }}>

                                                                    <p className='m-0' dangerouslySetInnerHTML={{ __html: decodedTxt(v?.description) }} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="thumb"><Image src="/assets/images/testimonial-thumb.png" alt="testimonialImage" width={64} height={64} sizes="(min-width: 64px) 50vw, 100vw" /></div>
                                                                {/* <h5 className="mb-0">-{v?.customer?.first_name}&nbsp;{v?.customer?.last_name}</h5> */}
                                                                <h5 className="mb-0">{v?.title}</h5>
                                                                <div className="rating">
                                                                    <Stack spacing={1}>
                                                                        <Rating name="half-rating" defaultValue={+(v?.rating)} precision={0.5} readOnly />
                                                                    </Stack>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Slider> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : null}
                {/* </div> */}
                {/* </div> */}
                {/* <!-- Main End --> */}

                {/* <!-- Footer Start --> */}

                {/* <!-- Footer End --> */}
                <Link id="back-top" href="javascript:void(0);"></Link>

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
            </div>
        </>
    )
}

export default dynamic(() => Promise.resolve(HomePage), { ssr: false, }) 