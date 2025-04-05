import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import rotate from "../../../../public/assets/icon/no-rotate.png"
import loc from "../../../../public/assets/icon/pin.png"
import cart1 from "../../../../public/assets/icon/product-1.jpg"
import categ from "../../../../public/assets/icon/Categories.png"
import country from "../../../../public/assets/icon/country.png"
import impt from "../../../../public/assets/icon/import.png"
import face from "../../../../public/assets/icon/facebook.png"
import linke from "../../../../public/assets/icon/linkedin-pink.png"
import whats from "../../../../public/assets/icon/whatsapp-pink.png"
import print from "../../../../public/assets/icon/pinterest-pink.png"
import twi from "../../../../public/assets/icon/twitter-pink.png"
import product from "../../../../public/assets/icon/product-11.jpg"
import product2 from "../../../../public/assets/icon/product-2.jpg"
import product3 from "../../../../public/assets/icon/product-3.jpg"
import product4 from "../../../../public/assets/icon/product-4.jpg"
import product5 from "../../../../public/assets/icon/product-5.jpg"
import product6 from "../../../../public/assets/icon/product-6.jpg"
import product7 from "../../../../public/assets/icon/product-7.jpg"
import tri from "../../../../public/assets/icon/Triangle-grey.png"
import tri1 from "../../../../public/assets/icon/Triangle-wh.png"
import Slider from 'react-slick'
import MegaMenu1 from '../../../components/megaMenu/MegaMenu1'
import { useCreate, useRead } from '../../../hooks'
import { _ERROR, _SUCCESS, _WARNING } from '../../../util/_reactToast'
import useIsLogedin from '../../../hooks/useIsLogedin'
import getUrlWithKey from '../../../util/_apiUrl'
import Cart from '../cart'
import brandDam from "../../../../public/assets/images/brandDam.png"
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import useTabView from '../../../hooks/useTabView'
import { useRouter } from 'next/router'
import { capitalize, persentageCalculate, separator } from '../../../util/_common'
import { Alert, Box, Breadcrumbs, Button, Checkbox, CircularProgress, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, Modal, Rating, Skeleton, Stack, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import MuiSlider from '@mui/material/Slider';
import CancelIcon from '@mui/icons-material/Cancel';
import { setOpenAuth } from '../../../reducer/openAuthReducer'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import LazyImage from '../../../components/LazyImage'
import styled from 'styled-components'
import DeleteIcon from '@mui/icons-material/Delete';
// import Dropzone from 'react-dropzone'
import axios from 'axios'
import useForceIsLogedin from '../../../hooks/useForceIsLogedin'
import { setMe } from '../../../reducer/me';
import CloseIcon from '@mui/icons-material/Close';
import Notifyimg from "../../../../public/assets/images/notifyimg.png"
import InfoIcon from '@mui/icons-material/Info';
import StarRateIcon from '@mui/icons-material/StarRate';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { setBreadcrumbs } from '../../../reducer/breadcrumbsReaducer'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import NextBreadcrumb from '../../../components/GlobalComponents/NextBreadcrumb'
import ReactImageMagnify from 'react-image-magnify';
import zIndex from '@mui/material/styles/zIndex'

import defaultImage from "../../../assets/images/brandDam.png"
import { Height } from '@mui/icons-material'
import Loader from '../../../components/CustomLoader'
import { _put } from '../../../services'
import ErrorIcon from "@mui/icons-material/Error";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReplyIcon from '@mui/icons-material/Reply';
import Login from '../../auth/Login'

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const Productdetails = ({ productData, loadingdetails, slug, isLoading }: Props) => {
    const openAuth = useSelector((state: any) => state?.openAuthReducer?.value);
    const pin_Code = localStorage.getItem("PIN_Code")
    const { isLoged, logedData } = useIsLogedin();
    const router = useRouter()
    const dispatch = useDispatch()
    const { tabView, mobView } = useTabView()
    const [activeImage, setActiveImage] = useState(0);
    const [open, setOpen] = useState(false)
    const [specificRating, setSpecificRating] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    const totalRatings = Object.values(specificRating).reduce((acc, count) => acc + count, 0) || 1;
    const { create_cart, get_cart_items, update_cart, dtdc_pincode, get_arrival, front_get_related_product, create_user_review, get_product_reviews, update_user_review_image, create_notify_me, get_wish_list, create_wish_list } = getUrlWithKey("client_apis");
    // get category hooks
    const { me: me_url } = getUrlWithKey("auth_apis");
    var currencyFormatter = require('currency-formatter');
    // const [breadcrumbs, setBreadcrumbs]: any = useState<any[]>([]);

    // useEffect(() => {
    //     const handleRouteChange = (url: any) => {
    //         setBreadcrumbs((prev: any) => [...prev, url]);
    //     };

    //     router.events.on('routeChangeComplete', handleRouteChange);
    //     return () => {
    //         router.events.off('routeChangeComplete', handleRouteChange);
    //     };
    // }, [router]);

    // console.log(breadcrumbs, "breadcrumbs")

    // const breadcrumbs = [
    //     { name: "MUI" },
    //     { name: "Core" },
    //     { name: "Breadcrumb" },
    // ];

    console.log(productData, 'productData')
    const handleSlideChange = (currentIndex: number) => {
        setActiveImage(currentIndex); // Update active image index
    };
    var settings1 = {
        margin: 30,
        infinite: true,
        speed: 500,
        // autoplay: true,
        slidesToScroll: 1,
        // autoplaySpeed: 3000,
        adaptiveHeight: true,
        pauseOnHover: true,
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const getme = useSelector((state: any) => state?.meReducer?.value);
    const [createCartUrl, setCreateCartUrl]: any = useState()
    const [createCartBody, setCreateCartBody]: any = useState({})
    const [count, setCount]: any = useState(1)
    const [sideBarOpen, setSideBarOpen]: any = useState<boolean>(false)
    const [totalAmmountToPay, setTotalAmmountToPay]: any = useState({})
    const [variationsId, setVariationsId]: any = useState()
    const [descriptionType, setDescriptionType] = useState("nav-home")
    const [categorieSlugs, setCategorieSlugs]: any = useState()
    const [front_get_related_product_url, setFront_get_related_product_url]: any = useState()
    const [slugLink, setSlugLink]: any = useState()
    const [arrivalMeta, setArrivalMeta]: any = useState()
    const [get_arrival_url, setGet_arrival_url]: any = useState()
    const [dtdcPincode_url, setDtdcPincodeUrl]: any = useState()
    const [payload_dtdc_pincode, setPayloadDtdcPincode] = useState<{ "zipcode": string }>({
        zipcode: ""
    });
    const [productReviewPagination, setProductReviewPagination]: any = useState({});
    const [deliveryPincode, setDeliveryPincode] = useState('');
    const [payloadData, setPayloadData]: any = useState<any>();
    const [errorPin, setPinError]: any = useState();
    const [pickAndShowSideImage, setPickAndShowSideImage]: any = useState<number>()
    const [showMainImage, setShowMainImage]: any = useState<number>(0)
    const [openPinCodeDetails, setOpenPinCodeDetails]: any = useState(false)
    const [rateProductOpen, setRateProductOpen]: any = useState(false)
    const [isRateProduct, setIsRateProduct]: any = useState(false)

    const [isOpen, setIsOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const { sendData: createCart, error: cartError }: any = useCreate({ url: createCartUrl, callData: createCartBody });
    const { sendData: getArrival }: any = useRead({ selectMethod: "put", url: get_arrival_url, callData: arrivalMeta });
    const { sendData: getRelatedProduct }: any = useRead({ selectMethod: "put", url: front_get_related_product_url, callData: categorieSlugs });
    const { sendData: getReviews }: any = useRead({ selectMethod: "put", url: get_product_reviews, callData: productReviewPagination });
    const breadcrumbs = useSelector((state: any) => state?.breadcrumbsReaducer?.value);
    const secondLastData = breadcrumbs[breadcrumbs.length - 2];
    // console.log(createWishList, createWishListError, "df51gss65f3")
    const [isWishlist, setIsWishlist] = useState(false)

    console.log(getReviews?.sendReview, "pin_Code")
    console.log(pickAndShowSideImage, "productData")

    const fetchWishlistData = async () => {
        try {
            const res = await _put(get_wish_list, { page: 1, rowsPerPage: 1000000, list_type: "WISHLIST" })
            if (res && res?.status) {
                const wishlistProducts = res?.data?.data?.products || [];
                const existsInWishlist = wishlistProducts.some(item => item?.product?.id === productData?.id);
                setIsWishlist(existsInWishlist);
                console.log(res?.data?.data?.products, productData?.id, existsInWishlist, "3gd41h65ggggfd")
            }
        } catch (err) {
            console.log(err)
            _ERROR(err?.response?.data?.massage || "Something went wrong...!")
        }
    }

    const createWishListDetails = async (url: any, metaData: any) => {
        if (getme?.id && getme?.role?.label !== "guest") {
            try {
                const res = await axios.post(
                    url,
                    { product_id: metaData?.product_id, list_type: metaData?.list_type },
                    { withCredentials: true }
                );

                if (res && res?.status === 200) {
                    _SUCCESS(res?.data?.message || "Item added to your wishlist");
                    await fetchWishlistData();
                    console.log(res?.data, "Wishlist Updated Successfully");
                }
            } catch (err) {
                _ERROR(err?.response?.data?.message || "Something went wrong...!");
                console.error(err, "Wishlist Error");
            }
        } else {
            dispatch(setOpenAuth(true));
        }
    };


    useEffect(() => {
        if (getme?.id) {
            fetchWishlistData()
        }
    }, [getme?.id])

    useEffect(() => {
        if (pin_Code) {
            setDeliveryPincode(pin_Code)
        }
    }, [pin_Code])
    useEffect(() => {
        if (pin_Code && deliveryPincode) {
            setDtdcPincodeUrl(dtdc_pincode);
            setPayloadDtdcPincode({ zipcode: pin_Code });
        }
    }, [pin_Code, deliveryPincode])
    useEffect(() => {
    }, [breadcrumbs])


    let lcsBreadcrumbs = localStorage.getItem("lcsBreadcrumbs")
    let lcsbc = JSON.parse(lcsBreadcrumbs)

    useEffect(() => {
        if (lcsbc?.length) {
            dispatch(setBreadcrumbs(lcsbc))
            localStorage.setItem("lcsBreadcrumbs", JSON.stringify(lcsbc))
        } else {
            localStorage.setItem("lcsBreadcrumbs", JSON.stringify(breadcrumbs))
        }
    }, [lcsbc?.length])

    useEffect(() => {
        return () => {
            localStorage.setItem("lcsBreadcrumbs", JSON.stringify([]))
        }
    }, [])

    // console.log(separator("100000"), "formattedPrice")

    console.log(breadcrumbs, "breadcrumbs")
    console.log(getReviews, "getReviews")

    useEffect(() => {
        setSlugLink({ slug: productData?.slug, name: productData?.name })
    }, [productData])

    useEffect(() => {
        // if (descriptionType === "nav-contact1") {
        setProductReviewPagination((pre: any) => ({ ...pre, product_id: +productData?.id }))
        // }
    }, [descriptionType, productData?.id])

    useEffect(() => {
        if (productData?.name && slug) {
            setGet_arrival_url(get_arrival)
            setArrivalMeta({ all: false })
            setVariationsId()
            setShowMainImage(0)
        }
    }, [productData, slug])

    useEffect(() => {
        let productCategories = productData?.categories?.length ? productData?.categories.map((v: any, i: number) => v?.slug) : null;

        if (productData?.categories?.length && productCategories) {
            setFront_get_related_product_url(front_get_related_product)
            setCategorieSlugs({ slugs: productCategories })
        }
    }, [productData?.categories?.length])


    const fetchMe = async () => {
        try {
            const { data: me }: any = await axios.get(me_url, { withCredentials: true });
            if (me?.success && me?.data?.id) {
                localStorage.setItem("logedId", "true");
                dispatch(setMe(me?.data))
            }
        } catch (error) {
            if (error && error === "access_denied") {
                localStorage.removeItem("logedId");
            }
        }
    }

    const onCreateCart = () => {
        // if (productData?.variations?.length && !variationsId?.id) {
        //     _WARNING("Select a variation")
        // } else {
        if (createCartUrl !== create_cart) {
            setCreateCartUrl(create_cart)
            setCreateCartBody({
                product_id: productData?.id,
                variation_id: variationsId?.id || null,
                quantity: count
            });
        }
        // }
    }



    useEffect(() => {
        if (createCartUrl === create_cart) {
            setCreateCartUrl()
        }
    }, [createCartUrl])

    useEffect(() => {
        if (createCart) {
            setSideBarOpen(true);
            fetchMe();
        }
    }, [createCart])

    useEffect(() => {
        if (cartError?.massage) {
            _WARNING(cartError?.massage)
        }
    }, [cartError])


    // dtdc deliveryPincode

    const { sendData: dtdcPincode, error: dtdcError, loading: dtdcLoading }: any = useRead({ selectMethod: "put", url: dtdcPincode_url, callData: payload_dtdc_pincode });
    const handleInputChange = (event: any) => {
        setDeliveryPincode(event.target.value);
    };

    const zipCodeRegex = /^\d{6}$/;

    const handleSubmit = () => {
        // Handle form submission or any other action
        if (zipCodeRegex.test(deliveryPincode)) {
            setDtdcPincodeUrl(dtdc_pincode);
            setPayloadDtdcPincode({ zipcode: deliveryPincode });
            localStorage.setItem("PIN_Code", deliveryPincode)
        } else {
            _WARNING("enter valid zipcode")
        }
    };
    useEffect(() => {
        if (payload_dtdc_pincode?.zipcode === "") {
            setPayloadData()
        }
    }, [payload_dtdc_pincode?.zipcode])


    useEffect(() => {
        if (dtdcPincode) {
            setPayloadData(dtdcPincode);
            setPinError(null);
        }

        if (dtdcError) {
            setPinError(dtdcError?.response?.data?.massage);
        }
    }, [dtdcPincode, dtdcError]);

    useEffect(() => {
        if (deliveryPincode === "") {
            setPayloadData();
            setPinError()
        }
        if (deliveryPincode !== payload_dtdc_pincode?.zipcode) {
            setPayloadData();
        }
    }, [deliveryPincode, payload_dtdc_pincode])

    useEffect(() => {
        if (pickAndShowSideImage?.id) {

        } else {
            setTimeout(() => {
                setShowMainImage(showMainImage >= productData?.images?.length - 1 ? 0 : showMainImage + 1)
            }, 5000)
        }
    }, [showMainImage, pickAndShowSideImage])

    const linksArr = [
        { name: "Facebook", class: `fa-facebook-f`, link: `https://www.facebook.com/sharer/sharer.php?u=https://pinkstore.altisinfonet.in/product/${slugLink?.slug}/` },
        { name: "Twitter", class: `fa-twitter`, link: `https://twitter.com/share?url=https://pinkstore.altisinfonet.in/product/${slugLink?.slug}/&text=${slugLink?.name}` },
        { name: "Pinterest", class: `fa-pinterest-p`, link: `https://pinterest.com/pin/create/button/?url=https://pinkstore.altisinfonet.in/product/${slugLink?.slug}/&media=` },
        { name: "Linkedin", class: `fa-linkedin-in`, link: `https://www.linkedin.com/shareArticle?mini=true&url=https://pinkstore.altisinfonet.in/product/${slugLink?.slug}/&title=${slugLink?.name}` },
        { name: "Telegram", class: `fa-telegram`, link: `https://telegram.me/share/url?url=https://pinkstore.altisinfonet.in/product/${slugLink?.slug}/` },
        { name: "Whatsapp", class: `fa-whatsapp`, link: `https://wa.me/?text=https://pinkstore.altisinfonet.in/product/${slugLink?.slug}/` },
    ]

    // Close drawer when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                drawerRef.current &&
                !drawerRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const toggleDrawer = (event: React.MouseEvent) => {
        event.stopPropagation(); // Stop event bubbling
        setIsOpen((prev) => !prev);
    };

    const variationNameCheck = (arrCheck: any[]) => {
        let newArr: any[] = []
        arrCheck.map((v: any, i: number) => { return v?.attributes?.length && v?.attributes[0]?.option === "" ? [] : newArr.push(v?.attributes[0]?.option) })
        console.log(arrCheck, newArr, "54564654sfdgsd")
        return newArr?.length ? true : false
    }

    // const checkDtdc = () => {
    //     let check = false;
    //     if (dtdcPincode?.ans) {
    //         if (payload_dtdc_pincode?.zipcode === deliveryPincode) {
    //             check = true;
    //         }
    //     }

    //     return { check }
    // }

    useEffect(() => {
        if (productData?.description === "" && productData?.attributes?.length) {
            setDescriptionType("nav-profile")
        } else if (productData?.description !== "" && !productData?.attributes?.length) {
            setDescriptionType("nav-home")
        } else if (productData?.description === "" && !productData?.attributes?.length) {
            setDescriptionType("nav-contact1")
        }
    }, [productData])

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (file: any) => {
        setSelectedFile(file);
        if (file[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file[0]);
        }
    };

    const clearPreviewData = () => {
        setSelectedFile(null);
        setPreview(null);
    }

    const [anonymousReview, setAnonymousReview]: any = useState(false)

    const initialReview = {
        item_rating: 0,
        description: "",
        product_id: +productData?.id,
        // anonymous: anonymousReview
    }

    const [review, setPeview]: any = useState(initialReview)
    const [descriptionError, setDescriptionError]: any = useState("");
    const [ratingError, setRatingError]: any = useState("");
    const [reviewError, setPeviewError]: any = useState("")

    useEffect(() => {
        if (review?.description !== "") {
            setPeviewError("")
        }
    }, [review])

    useEffect(() => {
        if (productData?.id) {
            setPeview((pre: any) => ({ ...pre, product_id: +productData?.id }))
        }
    }, [productData])

    const onReview = (e: any) => {
        let { name, value } = e.target;
        setPeview((pre: any) => ({ ...pre, [name]: value }))
    }

    const doReview = async () => {

        setDescriptionError("");
        setRatingError("");

        if (!review?.item_rating || review?.item_rating <= 0) {
            setRatingError("Please provide a rating for the product.");
            return;
        }

        if (!review?.description || review?.description.trim() === "") {
            setDescriptionError("Please enter a review description.");
            return;
        }
        try {
            const data = await axios.post(create_user_review, { ...review, anonymous: anonymousReview, item_rating: +review?.item_rating }, { withCredentials: true })
            if (data?.data?.success) {
                // this comented code for image upload
                // if (selectedFile?.length) {
                //     let formData: any = new FormData();
                //     selectedFile?.map((v: any) => {
                //         formData.append('review_images', v);
                //     })
                //     formData.append('user_review_id', data?.data?.data?.id);

                //     const imageData = await axios.post(update_user_review_image, formData, { withCredentials: true })
                //     if (imageData?.data?.success) {
                setPeview(initialReview)
                setSelectedFile(null)
                setPreview(null)
                setAnonymousReview(false)
                _SUCCESS("Review submited")
                setProductReviewPagination((pre: any) => ({ ...pre, product_id: +productData?.id }))
                setRateProductOpen(false);
            }
        } catch (error) {
            console.log(error, "__error")
        }

    }

    const [clickNotify, setClickNotify] = useState<boolean>(false);
    const [emial_id, setEmailID] = useState<any>("");
    const [phone_no, setPhone_no] = useState<any>("");
    const [emial_idErr, setEmailIDErr] = useState<any>("");
    const [phone_noErr, setPhone_noErr] = useState<any>("");

    // useEffect(() => {
    //     if (logedData?.email || logedData?.email) {
    //         setEmailID(logedData?.email)
    //         setPhone_no(logedData?.phone_no)
    //     }
    // }, [logedData])

    const notifyMe = () => {
        // if (!isLoged) {
        setClickNotify(true);
        if (getme?.role?.label !== "guest") {
            if (logedData?.email || logedData?.email) {
                setEmailID(logedData?.email)
                setPhone_no(logedData?.phone_no)
            }
        }
        // } else {
        //     notifyMeSubmit();
        // }
    }
    // console.log(logedData, "logedData")
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
                    product_id: productData?.id
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
                    setPhone_no("");
                }
                else {
                    _ERROR(data?.massage)
                }
            } catch (error) {
                console.error("Error", error);
            }
        }
    }

    const recently = async () => {
        try {
            const { data } = await axios.post(create_wish_list, { product_id: productData?.id, list_type: "RESENTLYVIEWPRODUCT" }, { withCredentials: true })
        } catch (error) {
            console.log(error, "__error")
        }
    }

    useEffect(() => {
        if (productData?.id) {
            recently()
        }
    }, [productData])

    const variationStockQ = (value: any) => {
        let qtt = [];
        let sum = 0;
        if (value?.length) {
            qtt = value.map((v: any) => v?.stock_quantity || 0)
            if (qtt?.length) {
                sum = qtt.reduce((acc, curr) => acc + curr, 0)
            }
        }
        // console.log(sum, "qtt")
        return sum;
    }

    useEffect(() => {
        if (productData && productData?.variations?.length)
            productData?.variations.map((v: any) => {
                v?.stock_quantity === 0 ? null : setVariationsId(v)
            })
    }, [productData, productData?.variations])


    const handleRateProduct = async (productData) => {
        console.log(productData, "56g4h65465gf")

        try {
            const res = await _put(get_product_reviews, { product_id: +productData })
            if (res && res?.status) {
                if (res?.data.data?.sendReview === true) {
                    setRateProductOpen(true)
                    setIsRateProduct(false)
                } else {
                    setRateProductOpen(false)
                    setIsRateProduct(true)
                }
                console.log(res?.data.data?.sendReview, "654fdg56fdg35fd")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (getReviews?.reviews?.length > 0) {
            const ratingCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

            getReviews.reviews.forEach((review) => {
                if (review.item_rating >= 1 && review.item_rating <= 5) {
                    ratingCount[review.item_rating] += 1;
                }
            });

            setSpecificRating(ratingCount);
        }

        console.log(getReviews?.reviews, "f5d4g65f1gf")
    }, [getReviews]);

    const handleCloseAuthModal = () => {
        setOpen(false)
    }

    const handleOpenAuthModal = () => {
        if (getme?.id
            && getme?.role?.label !== "guest"
        ) {
            // _SUCCESS("alredy loged in!")
            console.log(getme, "45gh5df1g32df")
            router.push("/")
            // setOpen(true)
        } else {
            setOpen(true)
        }
    }

    // useEffect(() => {
    //     if (openAuth) {
    //         setOpen(openAuth)
    //     }
    // }, [openAuth])

    // useEffect(() => {
    //     dispatch(setOpenAuth(open))
    // }, [open])

    return (
        <>
            <div className="container">
                {/* <p className='pro-para'>  Home/ Products / Cats / Cat Food / Dry Cat Food /Royal Canin – Persian Adult</p> */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-screen">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <div className='for_mobile flex items-center gap-1 mb-2' style={{ fontSize: "14px" }}>
                            <div className='flex items-center justify-between w-full'>
                                <div className='flex items-center gap-1'>
                                    <Link href={`/`} style={{ color: "#989898" }} className='capitalize'>{`home`}</Link>
                                    <NavigateNextIcon style={{ fontSize: "14px" }} />

                                    {breadcrumbs?.length ? breadcrumbs?.slice(-3).map((v: any, i: number) => <div key={i} className='flex items-center gap-1'>
                                        {v?.urls?.length ? v?.urls.map((val: any, idx: number) =>
                                            val?.name && <div key={idx} className='flex items-center gap-1'>
                                                <Link href={i === breadcrumbs?.length - 1 ? `javascript:void(0);` : val?.slug !== secondLastData?.urls[0]?.slug ? `javascript:void(0);` : `${secondLastData?.urls[0]?.slug}`} style={{ color: "#989898" }}><span className='breadcrumbs_text'>{val?.name}</span></Link>
                                                {i === breadcrumbs?.length - 1 ? idx === v?.urls?.length - 1 ? null : <NavigateNextIcon style={{ fontSize: "14px" }} /> : <NavigateNextIcon style={{ fontSize: "14px" }} />}
                                            </div>) : null}
                                    </div>) : null}
                                </div>



                            </div>

                        </div>
                        <div className="row mt-2" >

                            {/* leftSide start */}
                            <div className="col-lg-5 p-0">
                                <div className="product_details_new" id='pro-row'>

                                    <div className="side_view">
                                        <Tabs
                                            orientation="vertical"
                                            variant="scrollable"
                                            // value={value}
                                            // onChange={handleChange}
                                            aria-label="Vertical tabs example"
                                            sx={{ borderRight: 1, borderColor: 'divider' }}
                                            // style={{ height: "60vh", border: "0" }}
                                            className='border-0 h-60vh'
                                        >
                                            {!loadingdetails ?
                                                productData?.images?.length ?
                                                    productData?.images.map((v: any, i: number) =>
                                                        <div className="mb-1  cursor-pointer" onClick={() => setPickAndShowSideImage(v)} style={mobView ? null : { border: "1px solid #d4d4d4", borderRadius: "6px" }} key={i}>
                                                            <LazyImage src={v?.src ? v?.src : "/assets/images/brandDam.png"}
                                                                // onClick={() => v?.id ? setPickAndShowSideImage(v) : null}
                                                                // onMouseEnter={() => v?.id ? setPickAndShowSideImage(v) : null}
                                                                // onMouseLeave={() => { setPickAndShowSideImage() }}
                                                                alt="cart1"
                                                                width={200}
                                                                height={400}
                                                                className={`pro-mg-new`}
                                                                sizes="(min-width: 200px) 50vw, 100vw"
                                                            />
                                                        </div>)
                                                    :
                                                    null
                                                :
                                                null}
                                        </Tabs>
                                    </div>
                                    <div className="col-md-10 col-10" style={{ height: "fit-content" }}>
                                        {!loadingdetails ?
                                            productData?.images?.length ?
                                                <>
                                                    {(tabView || mobView) ?
                                                        <>
                                                            <Slider className='pps productDetails_pps' {...settings1} arrows={false} dots={true} slidesToShow={1}>
                                                                {productData?.images.map((v: any, i: number) =>
                                                                    <img key={i} style={{ borderRadius: "6px" }} src={v?.src && v?.src !== null && v?.src !== "" ? v?.src : "/assets/images/brandDam.png"} alt="cart1" width={1920} height={1080} className={`product-img-new`} sizes="(min-width: 1920px) 50vw, 100vw" loading="lazy" />
                                                                )}
                                                            </Slider>


                                                        </>
                                                        :
                                                        <>
                                                            <div className="relative"
                                                            >
                                                                <div className='z-50'
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: "8px",
                                                                        right: "0px",
                                                                        borderRadius: "50%",
                                                                        transition: "all 0.3s ease-in-out",
                                                                        cursor: isWishlist ? "default" : "pointer",
                                                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                                                        pointerEvents: "auto"
                                                                    }}
                                                                >
                                                                    {!isWishlist ? (
                                                                        <Link href="javascript:void(0);"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                createWishListDetails(create_wish_list, { product_id: productData?.id, list_type: "WISHLIST" });
                                                                            }}
                                                                        >
                                                                            <Tooltip title="Add to Wishlist" arrow>
                                                                                <FavoriteBorderIcon
                                                                                    style={{
                                                                                        fontSize: "30px",
                                                                                        color: "#e4509d",
                                                                                        backgroundColor: "white",
                                                                                        border: "1px solid #e4509d",
                                                                                        borderRadius: "50%",
                                                                                        padding: "6px",
                                                                                        transition: "all 0.2s ease-in-out"
                                                                                    }}
                                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "white"}
                                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                                                                                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
                                                                                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                                                                                />
                                                                            </Tooltip>
                                                                        </Link>
                                                                    ) : (
                                                                        <Tooltip title="Added to Wishlist" arrow>
                                                                            <FavoriteIcon
                                                                                style={{
                                                                                    fontSize: "30px",
                                                                                    color: "#e4509d",
                                                                                    backgroundColor: "white",
                                                                                    borderRadius: "50%",
                                                                                    border: "1px solid #e4509d",
                                                                                    padding: "6px",
                                                                                    transition: "all 0.3s ease-in-out",
                                                                                    animation: "pulse 1s infinite"
                                                                                }}
                                                                            />
                                                                        </Tooltip>
                                                                    )}
                                                                </div>

                                                                <ReactImageMagnify
                                                                    {...{
                                                                        smallImage: {
                                                                            alt: 'Zoomed product view',
                                                                            isFluidWidth: true,
                                                                            src: pickAndShowSideImage?.src || productData?.images[showMainImage]?.src || "/assets/images/brandDam.png"
                                                                        },
                                                                        largeImage: {
                                                                            src: pickAndShowSideImage?.src || productData?.images[showMainImage]?.src || "/assets/images/brandDam.png",
                                                                            width: 1200,
                                                                            height: 1400
                                                                        },
                                                                        imageClassName: 'magnify-image',
                                                                        enlargedImageContainerDimensions: {
                                                                            width: '150%',
                                                                            height: '100%',
                                                                            objectFit: "cover"
                                                                        },
                                                                        enlargedImagePosition: 'beside',
                                                                        zoomPosition: 'left',
                                                                        enlargedImageContainerStyle: {
                                                                            borderRadius: '6px',
                                                                            backgroundColor: 'white',
                                                                            overflow: 'hidden',
                                                                            zIndex: 2000,
                                                                        },
                                                                    }}
                                                                />
                                                            </div>

                                                        </>

                                                    }
                                                </>
                                                :
                                                <div className="relative">
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            top: "8px",
                                                            right: "0px",
                                                            borderRadius: "50%",
                                                            transition: "all 0.3s ease-in-out",
                                                            cursor: isWishlist ? "default" : "pointer",
                                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
                                                        }}
                                                    >
                                                        {!isWishlist ? (
                                                            <Link href="javascript:void(0);"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    createWishListDetails(create_wish_list, { product_id: productData?.id, list_type: "WISHLIST" });
                                                                }}
                                                            >
                                                                <Tooltip title="Add to Wishlist" arrow>
                                                                    <FavoriteBorderIcon
                                                                        style={{
                                                                            fontSize: "30px",
                                                                            color: "#e4509d",
                                                                            backgroundColor: "white",
                                                                            border: "1px solid #e4509d",
                                                                            borderRadius: "50%",
                                                                            padding: "6px",
                                                                            transition: "all 0.2s ease-in-out"
                                                                        }}
                                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "white"}
                                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                                                                        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
                                                                        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                                                                    />
                                                                </Tooltip>
                                                            </Link>
                                                        ) : (
                                                            <Tooltip title="Added to Wishlist" arrow>
                                                                <FavoriteIcon
                                                                    style={{
                                                                        fontSize: "30px",
                                                                        color: "#e4509d",
                                                                        backgroundColor: "white",
                                                                        borderRadius: "50%",
                                                                        border: "1px solid #e4509d",
                                                                        padding: "6px",
                                                                        transition: "all 0.3s ease-in-out",
                                                                        animation: "pulse 1s infinite"
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </div>


                                                    <Image
                                                        src={brandDam}
                                                        alt="cart1"
                                                        quality={100}
                                                        width={1920}
                                                        height={1080}
                                                        className="product-img-new w-full h-auto"
                                                        sizes="(min-width: 1920px) 50vw, 100vw"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            :
                                            <Skeleton
                                                variant="rounded"
                                                // width={"100%"}
                                                // height={"100%"}
                                                className='w-full h-full'
                                            />}

                                        {productData?.variations?.length ?
                                            variationStockQ(productData?.variations) !== 0 ?
                                                <div className="row gx-2 mt-3">
                                                    <div className="flex items-center justify-end w-full">
                                                        {/* <button
                                            className={`btn btn-primary ${variationsId?.stock_quantity === 0 ? 'disabled' : ''}`}
                                            disabled={(productData?.variations?.length && !variationsId?.id)}
                                            onClick={() => { getme.id ? (productData?.variations?.length && !variationsId?.id) ? null : onCreateCart() : dispatch(setOpenAuth(true)) }}>
                                            Add To Cart
                                        </button> */}

                                                        <button
                                                            className={`btn btn-primary button_detailsPage ${(tabView || mobView) ? `mt-3` : ``} ${variationsId?.stock_quantity === 0 ? 'disabled' : ''}`}
                                                            disabled={(productData?.variations?.length && !variationsId?.id)}
                                                            onClick={() => { getme.id ? (productData?.variations?.length && !variationsId?.id) ? null : onCreateCart() : onCreateCart() }}>
                                                            Add To Cart
                                                        </button>
                                                    </div>
                                                    {/* <div className="col-lg-5"></div> */}
                                                </div>
                                                :
                                                <div className="row gx-2 mt-3">
                                                    <div className="flex items-center justify-end w-full">
                                                        <button type='button' className={` ${"btn btn-primary button_detailsPage"}`} style={{ borderRadius: "10px !important" }} onClick={notifyMe} >Notify Me&nbsp;&nbsp;<i className="fa fa-bell" style={{ fontSize: "90%", color: "#ffffff" }}></i></button>
                                                        {/* {clickNotify && <><input type="text" name="s" placeholder="Enter your email id"
                                                autoComplete="off"
                                                value={emial_id}
                                                onChange={(e: any) => setEmailID(e.target.value)} /><button type="button" onClick={notifyMeSubmit} className=''>
                                                    Send
                                                </button></>} */}
                                                    </div>
                                                </div>
                                            :
                                            (productData?.stock_quantity === 0 || productData?.stock_quantity === null) ?
                                                <div className="row gx-2 mt-3">
                                                    <div className="flex items-center justify-end w-full">
                                                        <button type='button' className={` ${"btn btn-primary button_detailsPage"}`} style={{ borderRadius: "10px !important" }} onClick={notifyMe} >Notify Me&nbsp;&nbsp;<i className="fa fa-bell" style={{ fontSize: "90%", color: "#ffffff" }}></i></button>
                                                        {/* {clickNotify && <><input type="text" name="s" placeholder="Enter your email id"
                                                autoComplete="off"
                                                value={emial_id}
                                                onChange={(e: any) => setEmailID(e.target.value)} /><button type="button" onClick={notifyMeSubmit} className=''>
                                                    Send
                                                </button></>} */}
                                                    </div>
                                                </div>
                                                :
                                                <div className="row gx-2 mt-3">
                                                    {/* <div className="col-xl-5">
                                            <button className={` ${!productData?.stock_quantity ? 'btn btn-primary disabled' : 'btn btn-primary'}`} disabled={(productData?.variations?.length && !variationsId?.id)} onClick={() => { getme.id ? (productData?.variations?.length && !variationsId?.id) ? null : onCreateCart() : dispatch(setOpenAuth(true)) }}>Add To Cart</button>
                                        </div> */}

                                                    <div className="flex items-center justify-end w-full">
                                                        <button className={` ${!productData?.stock_quantity ? 'btn btn-primary button_detailsPage disabled' : 'btn btn-primary button_detailsPage'}`} disabled={(productData?.variations?.length && !variationsId?.id)} onClick={() => { getme.id ? (productData?.variations?.length && !variationsId?.id) ? null : onCreateCart() : onCreateCart() }}>Add To Cart</button>
                                                    </div>
                                                    {/* <div className="col-lg-5"></div> */}
                                                </div>
                                        }

                                        {/* <p>Share On:</p> */}
                                        {/* <div className={`share for_desktop tm-flex-col`}>

                                            <ul className="footer-social pro text-center">
                                                {linksArr?.length ? linksArr.map((v: any, i: number) => <li key={i}>
                                                    <Link target="_blank" href={`${v?.link}`}><i className={`fa-brands ${v?.class}`}></i></Link></li>)
                                                    :
                                                    null
                                                }
                                            </ul>

                                        </div> */}


                                    </div>
                                </div>
                            </div>
                            {/* leftSide end */}

                            {/* right start */}
                            <div className={`col-lg-7  ${tabView ? "mt-2" : mobView ? "mt-2" : "mt-4"} mt-lg-0`}>
                                <div className='w-100 flex items-center justify-end for_desktop'>
                                    <button
                                        type='button'
                                        className={`btn btn-primary py-0 flex items-center gap-1`}
                                        style={{ borderRadius: "10px !important" }}
                                        onClick={() => router.push(secondLastData?.urls[0]?.slug)}
                                    >
                                        <ArrowBackIosIcon style={{ fontSize: "16px", fontWeight: "700" }} />
                                        <span>Back</span>
                                    </button>
                                </div>
                                {/* <NextBreadcrumb
                            homeElement={'Home'}
                            separator={<NavigateNextIcon style={{ fontSize: "14px" }} />}
                            activeClasses='breadcrumbs_text'
                            containerClasses='flex items-center'
                            listClasses='breadcrumbs_text'
                            capitalizeLinks
                        /> */}
                                <div className='for_desktop flex items-center gap-1 mb-2' style={{ fontSize: "14px" }}>
                                    <div className='flex items-center justify-between w-full'>
                                        <div className='flex items-center gap-1'>
                                            <Link href={`/`} style={{ color: "#989898" }}>{`Home`}</Link>
                                            <NavigateNextIcon style={{ fontSize: "14px" }} />


                                            {breadcrumbs?.length ? breadcrumbs?.slice(-3).map((v: any, i: number) => <div key={i} className='flex items-center gap-1'>
                                                {v?.urls?.length ? v?.urls.map((val: any, idx: number) =>
                                                    val?.name && <div key={idx} className='flex items-center gap-1'>
                                                        <Link
                                                            href={i === breadcrumbs?.length - 1 ? `javascript:void(0);` : val?.slug !== secondLastData?.urls[0]?.slug ? `javascript:void(0);` : `${secondLastData?.urls[0]?.slug}`}
                                                            style={{ color: "#989898" }}
                                                        >
                                                            <span className='breadcrumbs_text'>{val?.name}</span>
                                                        </Link>
                                                        {i === breadcrumbs?.length - 1 ? idx === v?.urls?.length - 1 ? null : <NavigateNextIcon style={{ fontSize: "14px" }} /> : <NavigateNextIcon style={{ fontSize: "14px" }} />}
                                                    </div>) : null}
                                            </div>) : null}
                                        </div>

                                        {/* // className="share-container" */}
                                        {/* <div
                                        className="share-container relative"
                                    >
                                        <Tooltip title="Share on" placement="right" arrow>
                                            <button ref={buttonRef} className={`share-button ${isOpen ? "open" : ""}`} onClick={toggleDrawer}>
                                                <i className="fa-solid fa-share-nodes"></i>
                                            </button>
                                        </Tooltip>

                                        <div ref={drawerRef} className={`share-drawer ${isOpen ? "open" : ""}`}>
                                            <ul className="share-icons">
                                                {linksArr?.length
                                                    ? linksArr.map((v: any, i: number) => (
                                                        <li key={i} style={{ transitionDelay: `${i * 0.05}s` }}>
                                                            <Tooltip title={v.name} placement="right" arrow>
                                                                <Link target="_blank" href={v?.link} className="rounded-icon">
                                                                    <i className={`fa-brands ${v?.class}`}></i>
                                                                </Link>
                                                            </Tooltip>
                                                        </li>
                                                    ))
                                                    : null}
                                            </ul>
                                        </div>
                                         </div> */}

                                        <div className="share-container">
                                            {/* Share Button */}

                                            <div className='flex items-end justify-end'>
                                                <button
                                                    ref={buttonRef}
                                                    onMouseEnter={() => setIsHovered(true)}
                                                    onMouseLeave={() => setIsHovered(false)}
                                                    style={{
                                                        marginTop: "5px",
                                                        padding: "6px 12px",
                                                        fontSize: "14px",
                                                        color: isHovered ? "#fff" : "#007bff",
                                                        backgroundColor: isHovered ? "#007bff" : "transparent",
                                                        border: "1px solid #007bff",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        fontWeight: "bold",
                                                        transition: "all 0.3s ease",
                                                    }}
                                                    onClick={toggleDrawer}
                                                >
                                                    Share <i className="fa-solid fa-share" style={{ fontSize: "10px" }}></i>
                                                </button>
                                            </div>

                                            {/* Share Drawer - Now Opens from Right to Left */}
                                            <div ref={drawerRef} className={`share-drawer ${isOpen ? "open" : "close"}`}>
                                                <ul className="share-icons">
                                                    {linksArr?.length
                                                        ? linksArr.map((v: any, i: number) => (
                                                            <li key={i} style={{ transitionDelay: `${i * 0.05}s` }}>
                                                                <Tooltip title={v.name} placement="right" arrow>
                                                                    <Link target="_blank" href={v?.link} className="rounded-icon">
                                                                        <i className={`fa-brands ${v?.class}`}></i>
                                                                    </Link>
                                                                </Tooltip>
                                                            </li>
                                                        ))
                                                        : null}
                                                </ul>
                                            </div>
                                        </div>

                                    </div>


                                </div>
                                {!loadingdetails ? <h3 className='pro-title mb-0'>{productData?.name}</h3> : null}
                                <div className='flex items-center gap-2 py-2'>
                                    <Stack spacing={1}>
                                        {productData?.rating_count ?
                                            <Rating name="half-rating" defaultValue={+(productData?.rating_count)} precision={0.1} readOnly size='small' />
                                            :
                                            <Rating name="half-rating" defaultValue={0} precision={0.1} readOnly size='small' />
                                        }
                                    </Stack>
                                    {/* <span style={{ fontSize: "12px", color: "#ffffff", background: "#359c39", borderRadius: "4px" }} className='flex items-center gap-1 px-2'>
                                <span className='p-0 m-0' style={{ lineHeight: "22px" }}>{(+productData?.rating_count).toFixed(1)}</span>
                                <StarRateIcon style={{ fontSize: "100%" }} />
                            </span> */}
                                    {(productData?.total_ratings > 0 || productData?.total_reviews > 0) && (
                                        <strong style={{ color: "#989898", fontSize: "14px" }}>
                                            {productData?.total_ratings > 0 && `${productData.total_ratings} Ratings`}
                                            {productData?.total_ratings > 0 && productData?.total_reviews > 0 && " & "}
                                            {productData?.total_reviews > 0 && `${productData.total_reviews} Reviews`}
                                        </strong>
                                    )}
                                    {/*<strong style={{ color: "#989898", fontSize: "14px" }}>{+productData?.total_ratings}&nbsp;{`Ratings &`}&nbsp;{+productData?.total_reviews}&nbsp;Reviews</strong> */}
                                </div>


                                {/* <div className="share-container">
                                        <Tooltip title="Share on" placement="right" arrow>
                                            <button ref={buttonRef} className={`share-button ${isOpen ? "open" : ""}`} onClick={toggleDrawer}>
                                                <i className="fa-solid fa-share-nodes"></i>
                                            </button>
                                        </Tooltip>

                                        <div ref={drawerRef} className={`share-drawer ${isOpen ? "open" : ""}`}>
                                            <ul className="share-icons">
                                                {linksArr?.length
                                                    ? linksArr.map((v: any, i: number) => (
                                                        <li key={i} style={{ transitionDelay: `${i * 0.05}s` }}>
                                                            <Tooltip title={v.name} placement="right" arrow>
                                                                <Link target="_blank" href={v?.link} className="rounded-icon">
                                                                    <i className={`fa-brands ${v?.class}`}></i>
                                                                </Link>
                                                            </Tooltip>
                                                        </li>
                                                    ))
                                                    : null}
                                            </ul>
                                        </div>
                                    </div> */}

                                {/* <div className="share-container">
                                        <Tooltip title="Share on" placement="right" arrow>
                                            <button ref={buttonRef} className={`share-button ${isOpen ? "open" : ""}`} onClick={toggleDrawer}>
                                                <i className="fa-solid fa-share-nodes"></i>
                                            </button>
                                        </Tooltip>

                                        <div ref={drawerRef} className={`share-drawer ${isOpen ? "open" : ""}`}>
                                            <ul className="share-icons">
                                                {linksArr?.map((v: any, i: number) => (
                                                    <li key={i} style={{ transitionDelay: `${i * 0.05}s` }}>
                                                        <Tooltip title={v.name} placement="right" arrow>
                                                            <Link target="_blank" href={v?.link} className="rounded-icon">
                                                                <i className={`fa-brands ${v?.class}`}></i>
                                                            </Link>
                                                        </Tooltip>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div> */}

                                {!loadingdetails ?
                                    <p className='mt-1 mb-1'>
                                        {variationsId?.id ?
                                            <span style={{ color: "#595959", fontSize: "100%", fontWeight: "500", padding: "3px 9px", }} className='rounded ps-0 bg-transparent flex items-center gap-2'>
                                                <div>
                                                    {variationsId?.sale_price ?
                                                        <span>
                                                            <>
                                                                <span className="inr" style={{ color: "#989898" }}>₹</span><del className='pe-2' style={{ color: "#989898" }}>{currencyFormatter.format(variationsId?.price, { code: '' })}</del>
                                                            </>
                                                            <span className='rounded'>
                                                                <span className="inr">₹</span>{currencyFormatter.format((+variationsId?.sale_price * count), { code: '' })}
                                                            </span>
                                                        </span>
                                                        :
                                                        <span className='rounded' ><span className="inr">₹</span>{currencyFormatter.format((+variationsId?.price * count), { code: '' })}</span>
                                                    }
                                                </div>
                                                {variationsId?.sale_price ? <h5 className='offer m-0 pt-1  rounded' style={{ color: "#1f6623", padding: "3px 9px", fontSize: "80%" }} >{persentageCalculate(variationsId?.price, variationsId?.sale_price)}% Off</h5> : null}
                                            </span>
                                            :
                                            <span className='pro-para1 new flex items-center gap-2 ps-0' style={{ textAlign: "center", color: "#e3509c", fontFamily: "DM Sans", fontSize: "90%", fontWeight: "600" }}>
                                                {/* {productData?.variations?.length ? "Price Starting From:" : null} */}
                                                {productData?.sale_price ?
                                                    <span className='flex items-center'>
                                                        {/* <span style={{ color: "#e4509d", fontSize: "150%", fontWeight: "600", padding: "3px 9px", }} className='rounded ps-0 bg-transparent'>
                                                            <span style={{ fontFamily: "unset" }}><span className="inr">₹</span></span>{currencyFormatter.format(productData?.sale_price, { code: '' })}
                                                        </span>
                                                        <><span className="inr" style={{ color: "#989898" }}>₹</span><del style={{ color: "#989898", fontSize: "100%", letterSpacing: "2px" }}>{currencyFormatter.format(productData?.price, { code: '' })}</del></> */}
                                                    </span>
                                                    :
                                                    <span style={{ color: "#e4509d", fontSize: "160%", fontWeight: "600", padding: "3px 9px", }} className='rounded bg-transparent' ><span className="inr">₹</span>{currencyFormatter.format(productData?.price, { code: '' })}</span>
                                                }
                                                {productData?.sale_price ? <h5 className='offer m-0 pt-0 rounded' style={{ color: "#1f6623", background: "#fff", fontSize: "100%", fontWeight: "700", lineHeight: "20px" }}>&nbsp;{persentageCalculate(productData?.price, productData?.sale_price)}% Off</h5> : null}
                                            </span>
                                        }
                                    </p>
                                    :
                                    <Skeleton
                                        variant="rounded"
                                        // width={"100%"}
                                        // height={"1.5rem"}
                                        className='skeliton-3rd'
                                    />}

                                {/* pinCode start*/}
                                {!variationsId?.id ?
                                    !productData?.stock_quantity ? null :
                                        <div className="row mt-0 mb-b">
                                            <div className={`${mobView ? `width-100` : `width-50`}`}>
                                                <div className="example pro flex items-center gg">
                                                    <input
                                                        type="number"
                                                        name="s"
                                                        placeholder="Enter Delivery Pincode"
                                                        autoComplete="off"
                                                        value={deliveryPincode}
                                                        onChange={handleInputChange}
                                                        className='product_delivery_pin'
                                                    />
                                                    <Image src={loc} style={mobView ? { width: "3%", left: "0", top: "" } : tabView ? { width: "3%", left: "0", top: "" } : { width: "", left: "0", top: "" }} alt="cart1" className={`diss-cnt`} loading="lazy" />
                                                    {!pin_Code ? <button type="button" onClick={handleSubmit} disabled={(payload_dtdc_pincode?.zipcode && dtdcLoading)} className='check'>
                                                        {(payload_dtdc_pincode?.zipcode && dtdcLoading) ?
                                                            <CircularProgress className='loader_cls' />
                                                            :

                                                            "Check"
                                                        }
                                                    </button> :
                                                        <button type="button" onClick={() => { localStorage.removeItem("PIN_Code"); setDeliveryPincode('') }} disabled={(payload_dtdc_pincode?.zipcode && dtdcLoading)} className='check'>

                                                            Change

                                                        </button>}
                                                </div>
                                            </div>
                                            <div className="col-xl-4 flex items-center">
                                            </div>

                                        </div>
                                    :
                                    !variationsId?.stock_quantity ? null : <div className="row mt-0 mb-2">
                                        <div className={`${mobView ? `width-100` : `width-50`}`}>
                                            <div className="example pro flex items-center">
                                                <input
                                                    type="number"
                                                    name="s"
                                                    placeholder="Enter Delivery Pincode"
                                                    autoComplete="off"
                                                    value={deliveryPincode}
                                                    onChange={handleInputChange}
                                                    className='product_delivery_pin'
                                                />
                                                <Image src={loc} style={mobView ? { width: "2%", left: "0", top: "" } : tabView ? { width: "2%", left: "0", top: "" } : { width: "", left: "0", top: "" }} alt="cart1" className={`diss-cnt`} loading="lazy" />
                                                {!pin_Code ? <button type="button" onClick={handleSubmit} className='check'>Check</button> :
                                                    <button type="button" onClick={() => { localStorage.removeItem("PIN_Code"); setDeliveryPincode('') }} className='check'>Change</button>}
                                            </div>
                                        </div>
                                        <div className='flex items-center'>

                                        </div>
                                        {/* <div className="col-xl-4"></div> */}
                                    </div>}
                                {errorPin ? <p className='error m-0'>{errorPin}</p> : (zipCodeRegex.test(deliveryPincode)) ? null : deliveryPincode ? < p className='error m-0'>Enter valid pincode</p> : null}
                                {!dtdcError && deliveryPincode && payloadData && payload_dtdc_pincode?.zipcode === deliveryPincode && payloadData?.cod && payloadData?.service &&


                                    <div className="relative my-1">
                                        {/* {productData?.stock_quantity || productData?.variations &&  */}
                                        {<div>
                                            <ul className='p-0 m-0'>
                                                <li className='flex items-center gap-2'>
                                                    {productData?.stock_quantity > 0 || variationStockQ(productData?.variations) > 0 ? <div className="" style={{ fontSize: "15px", color: "#F43F5E", fontWeight: "bold" }}>{payloadData?.estimatedTimeText}</div> : ''}
                                                    {productData?.stock_quantity > 0 || variationStockQ(productData?.variations) > 0 ? <InfoIcon style={{ height: "20px" }} className='cursor-pointer' onClick={() => setOpenPinCodeDetails(true)} /> : ""}
                                                </li>
                                            </ul>
                                            {/* } */}
                                            {openPinCodeDetails &&
                                                <ClickAwayListener onClickAway={() => setOpenPinCodeDetails(false)}>
                                                    <div className="pdts mt-3">
                                                        <ul>
                                                            <li className='flex items-center gap-2'>
                                                                <img className="thumb" style={{ height: "44px" }} src="/assets/images/delivery-icon1.png" alt="delivery-icon" width={44} height={44} sizes="(min-width: 44px) 50vw, 100vw" />
                                                                <div className="con" dangerouslySetInnerHTML={{ __html: payloadData?.ans }} />
                                                            </li>
                                                            <li className='flex items-center gap-2 mt-2'>
                                                                <img className="thumb" style={{ height: "44px" }} src="/assets/images/delivery-icon2.png" alt="delivery-icon" width={44} height={44} sizes="(min-width: 44px) 50vw, 100vw" />
                                                                <div className="con">{payloadData?.estimatedTimeText}</div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </ClickAwayListener>
                                            }
                                        </div>}
                                    </div>
                                }
                                {/* pinCode end*/}

                                {/* price add section */}
                                {!loadingdetails ? <>
                                    {/* <div className="bor"></div> */}
                                    {productData?.backorders_allowed ? <p className='non'><span><Image src={rotate} alt="logo" className={`non-m`} loading="lazy" /></span> Non Returnable product</p> : null}
                                    <div className='flex gap-2'>
                                        {
                                            //  !productData?.stock_quantity ? null :
                                            productData?.variations?.length ?
                                                variationStockQ(productData?.variations) !== 0 ?
                                                    <div className='flex items-center gap-2'>
                                                        {variationNameCheck(productData?.variations) &&
                                                            <p className='pro-para2'>{productData?.variations[0]?.attributes[0]?.name}</p>}
                                                        <div className="widget__buttons my-2">
                                                            {productData?.variations.map((v: any, i: number) => {
                                                                console.log(v, "we4ew654e6w")
                                                                // setVariationOption(v?.attributes[0]?.option)
                                                                return (
                                                                    <>
                                                                        {v?.attributes[0]?.option ?
                                                                            <span
                                                                                key={i}
                                                                                className='size cursor-pointer relative'
                                                                                onClick={() => { v?.stock_quantity === 0 ? null : setVariationsId(v); variationsId?.id === v?.id ? null : setCount(1) }}
                                                                                style={v?.stock_quantity === 0 ?
                                                                                    { borderColor: "#8c8c8c50", color: "#8c8c8c50", overflow: "hidden" }
                                                                                    :
                                                                                    variationsId?.id === v?.id ?
                                                                                        { borderColor: "#e3509c", color: "#e3509c", }
                                                                                        : {}
                                                                                }
                                                                            >
                                                                                <div className={`${v?.stock_quantity === 0 ? 'selection-option' : ''}`}>
                                                                                    {capitalize(v?.attributes[0]?.option)}
                                                                                </div>
                                                                            </span> : null}
                                                                    </>
                                                                )
                                                            }
                                                            )}

                                                            {variationsId?.id ?
                                                                <CancelIcon style={{ display: "none", width: "22px", height: "22px", color: "red", cursor: "pointer" }} onClick={() => setVariationsId()} />
                                                                : null}

                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="my-2">
                                                        <h5 className='offer p-0 m-0' style={{ color: "#ff8e1d", fontSize: "105%", fontWeight: "500" }}>Curently Out Of Stock!</h5>
                                                    </div>
                                                : (productData?.stock_quantity === 0 || productData?.stock_quantity === null) ?
                                                    <div className="my-2">
                                                        <h5 className='offer p-0 m-0' style={{ color: "#ff8e1d", fontSize: "105%", fontWeight: "500" }}>Curently Out Of Stock!</h5>
                                                    </div> : null
                                        }
                                    </div>
                                    {/* {(productData?.stock_quantity === 0 ?? productData?.stock_quantity === null) ? <div className="row gx-2 mt-3">
                                <h5 className='offer' style={{ color: "red" }}>Out Of Stock</h5>
                            </div> : null} */}
                                    {/* {variationsId?.id ?
                                <span className='pro-para1 new ps-0 flex items-center mt-2 gap-3' style={{ textAlign: "center", color: "#e3509c", fontFamily: "DM Sans", fontSize: "90%", fontWeight: "600" }}>
                                    <span className='pro-para3' style={{ color: "#e3509c", fontWeight: "600" }}>{capitalize(variationsId?.attributes[0]?.option)}:</span>
                                    {variationsId?.sale_price ?
                                        <span>
                                            <><span className="inr" style={{ color: "#989898" }}>₹</span><del className='pe-2' style={{ color: "#989898" }}>{currencyFormatter.format(variationsId?.price, { code: '' })}</del></>
                                            <span style={{ background: "#ffd8ec", padding: "5px 9px 3px 9px", fontSize: "90%", }} className='rounded color-e4509d'>
                                                <span className="inr">₹</span>{currencyFormatter.format((+variationsId?.sale_price * count), { code: '' })}
                                            </span>
                                        </span>
                                        :
                                        <span style={{ background: "#ffd8ec", padding: "5px 9px 3px 9px", fontSize: "90%", }} className='rounded color-e4509d' ><span className="inr">₹</span>{currencyFormatter.format((+variationsId?.price * count), { code: '' })}</span>
                                    }
                                    {variationsId?.sale_price ? <h5 className='offer m-0 pt-1  rounded' style={{ color: "#fff", background: "#1f6623", padding: "3px 9px", fontSize: "14px" }} >{persentageCalculate(variationsId?.price, variationsId?.sale_price)}% Off</h5> : null}
                                </span>
                                : null} */}

                                    {/* Quantity */}
                                    <div className={`flex items-center gap-3 ${variationsId?.stock_quantity ? "my-3" : (!productData?.stock_quantity || productData?.variations?.length) ? "" : "my-3"}`}>
                                        {!productData?.stock_quantity || productData?.variations?.length ? null : <p className='pro-para2 py-1'>Quantity</p>}
                                        {!variationsId?.stock_quantity ? null : <p className='pro-para2 py-1'>Quantity</p>}

                                        {!productData?.stock_quantity || productData?.variations?.length ? null :
                                            <div className="items-center flex gap-4">
                                                <div className="">
                                                    <div className="qty-container">
                                                        <button
                                                            className={`qty-btn-minus p-0 btn-light ${!productData?.stock_quantity && 'disabled'}`}
                                                            // disabled={!productData?.stock_quantity || productData?.sold_individually}
                                                            disabled={!productData?.stock_quantity}
                                                            type="button"
                                                            style={{ fontSize: "18px" }}
                                                            onClick={() => productData?.stock_quantity ? setCount(count <= 1 ? 1 : count - 1) : null}
                                                        >-</button>
                                                        <input type="text" name="qty" value={count} style={{ border: "0px" }} className={`input-qty bg-transparent ${!productData?.stock_quantity && 'disabled'}`} disabled={true} />
                                                        <button
                                                            className={`qty-btn-plus p-0 btn-light ${!productData?.stock_quantity && 'disabled'}`}
                                                            disabled={!productData?.stock_quantity}
                                                            type="button"
                                                            style={{ fontSize: "18px" }}
                                                            onClick={() => productData?.sold_individually ? _WARNING("You can add upto one product at a time") : productData?.stock_quantity ? setCount(productData?.stock_quantity <= count ? productData?.stock_quantity : count + 1) : null}
                                                        >+</button>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <p className='stock w-fit text-white p-0' style={{ fontFamily: "DM Sans", fontSize: "90%" }} >
                                                        {productData?.stock_quantity <= 2 && <span style={{ background: "#ffffff", color: "#ff8c00", padding: "2px 9px", borderRadius: "4px 0 0 4px", border: "1px solid #ff8c00" }}>{productData?.stock_quantity}</span>}
                                                        <span style={productData?.stock_quantity <= 2 ? { background: "#ff8c00", padding: "3px 9px", fontFamily: "DM Sans", borderRadius: "0 4px 4px 0" } : { background: "#08c355", padding: "3px 9px", fontFamily: "DM Sans", borderRadius: "4px" }} >{productData?.stock_quantity <= 2 ? <>Low&nbsp;Stock</> : "Instock"}</span>
                                                    </p>
                                                </div>
                                                <div className="col-lg-3 col-md-5 col-xl-4">
                                                </div>
                                            </div>
                                        }
                                        {!variationsId?.stock_quantity ? null :
                                            <div className="items-center flex gap-4">
                                                <div className="">
                                                    <div className="qty-container">
                                                        <button
                                                            className={`qty-btn-minus p-0 btn-light ${!variationsId?.stock_quantity && 'disabled'}`}
                                                            disabled={!variationsId?.stock_quantity}
                                                            type="button"
                                                            style={{ fontSize: "18px" }}
                                                            onClick={() => variationsId?.stock_quantity ? setCount(count <= 1 ? 1 : count - 1) : null}
                                                        >-</button>
                                                        <input type="text" name="qty" value={count} style={{ border: "0px" }} className={`input-qty bg-transparent ${!variationsId?.stock_quantity && 'disabled'}`} disabled={true} />
                                                        <button
                                                            className={`qty-btn-plus p-0 btn-light ${!variationsId?.stock_quantity && 'disabled'}`}
                                                            disabled={!variationsId?.stock_quantity}
                                                            type="button"
                                                            style={{ fontSize: "18px" }}
                                                            // onClick={() =>
                                                            //     variationsId?.stock_quantity ?
                                                            //         setCount(
                                                            //             variationsId?.stock_quantity <= count ?
                                                            //                 variationsId?.stock_quantity
                                                            //                 :
                                                            //                 count + 1
                                                            //         )
                                                            //         :
                                                            //         null
                                                            // }
                                                            onClick={() =>
                                                                variationsId?.stock_quantity
                                                                    ? variationsId?.stock_quantity <= count
                                                                        ? _WARNING("No more stock!")
                                                                        : setCount(count + 1)
                                                                    : null
                                                            }
                                                        >+</button>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-4 col-xl-4 col-5">
                                                    <p className='stock w-fit text-white p-0' style={{ fontFamily: "DM Sans", fontSize: "90%" }} >
                                                        {variationsId?.stock_quantity <= 2 && <span style={{ background: "#ffffff", color: "#ff8c00", padding: "2px 9px", borderRadius: "4px 0 0 4px", border: "1px solid #ff8c00" }}>{variationsId?.stock_quantity}</span>}
                                                        <span style={variationsId?.stock_quantity <= 2 ? { background: "#ff8c00", padding: "3px 9px", fontFamily: "DM Sans", borderRadius: "0 4px 4px 0" } : { background: "#08c355", padding: "3px 9px", fontFamily: "DM Sans", borderRadius: "4px" }} >{variationsId?.stock_quantity <= 2 ? <>Low&nbsp;Stock</> : "Instock"}</span>
                                                    </p>
                                                </div>
                                                <div className="col-lg-3 col-md-5 col-xl-4">
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    {/* Categories */}
                                    <div className="row gx-2">
                                        <div className="col-md-11 col-11">
                                            <p className='pro-para2 flex wrap gap-2 items-center'><b>Categories:</b>
                                                {productData?.categories?.length ?
                                                    productData?.categories.map((v: any, i: number) =>
                                                        <Link key={i} className='pro-cat m-0 flex w-fit h-fit leading-2 cursor-pointer uppercase' style={{ color: "#ffffff" }} href={`/product_category/${v?.slug}`}><span dangerouslySetInnerHTML={{ __html: v?.name }} /></Link>
                                                    ) : null}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Information */}
                                    {productData?.attributes?.length ?
                                        <div className='my-2 flex flex-col items-start gap-2'>
                                            <p className='pro-para2'>
                                                <b className=''>Information:</b>
                                            </p>
                                            <div className='w-full flex flex-col gap-2'>
                                                {productData?.attributes.map((v: any, i: number) =>
                                                    <div key={i} className='m-0'>
                                                        <div className='information-root'>
                                                            <div style={{ width: "15%" }}>
                                                                <span className={'information-name !h-fit !w-fit flex items-center gap-1'} style={v?.slug === "breed" ? { background: "#4caf50" } : v?.slug === "packsize" ? { background: "#008eff" } : {}}>
                                                                    <span className='!h-fit !w-fit flex' style={{ background: "#ffffff", padding: "3px", borderRadius: "50px" }}></span>
                                                                    {v?.name}
                                                                </span>
                                                            </div>
                                                            <div className='m-0 flex flex-wrap' style={{}}>
                                                                {v?.options?.length ? v?.options.map((val: any, idx: number) =>
                                                                    <span className='' key={idx}>
                                                                        {(v?.slug === "breed" || v?.slug === "brand") ?
                                                                            <Link href={v?.slug === "breed" ? `/shop/breed/${val?.slug}` : v?.slug === "brand" ? `/shop/brand/${val?.slug}` : `javascript:void(0)`} className='information-sub-name mx-1' style={v?.slug === "breed" ? { background: "#4caf5010", color: "#4caf50" } : {}}>{capitalize(val?.name)}</Link>
                                                                            :
                                                                            <span className='information-sub-name mx-1' style={{ background: "#008eff10", color: "#008eff" }}>{capitalize(val?.name)}</span>}
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>)}
                                            </div>
                                        </div> : null}

                                    {/* Description */}
                                    {productData?.description && <div className='my-2 flex flex-col items-start gap-2'>
                                        <p className='pro-para2'>
                                            <b className=''>Description:</b>
                                        </p>
                                        <div className={`descriptions_ulType`} dangerouslySetInnerHTML={{ __html: productData?.description }} />
                                    </div>}

                                    {/* Country Of Origin */}
                                    {productData?.country_of_origin && <>
                                        <div className="my-2 flex flex-row items-center gap-2">
                                            <p className='pro-para2'>
                                                <b className=''>Country Of Origin:</b>
                                            </p>
                                            <div className='descriptions_ulType'>{productData?.country_of_origin}</div>
                                        </div>
                                    </>}

                                    {/* importer name */}
                                    {productData?.importer_name && <>
                                        <div className="my-2 flex flex-row items-center gap-2">
                                            <p className='pro-para2'>
                                                <b className=''>Importer Name:</b>
                                            </p>
                                            <div className='descriptions_ulType'>{productData?.importer_name}</div>
                                        </div>
                                    </>}

                                    {/* <div className="pro-card">
                                <div className="card-body">
                                    <div className="row gx-2">
                                        <div className="col-md-1 col-1">
                                            <Image src={categ} style={mobView ? { width: "80%" } : tabView ? { width: "30%" } : { width: "50%" }} alt="cart1" className={``} loading="lazy" />
                                        </div>
                                        <div className="col-md-11 col-11">
                                            <p className='pro-para2 flex wrap gap-2 items-center'><b>Categories:</b>
                                                {productData?.categories?.length ?
                                                    productData?.categories.map((v: any, i: number) =>
                                                        <Link key={i} className='pro-cat ms-1 flex w-fit h-fit leading-2 cursor-pointer uppercase' style={{ color: "#ffffff" }} href={`/product_category/${v?.slug}`}>{v?.name}</Link>
                                                    ) : null}
                                            </p>
                                        </div>
                                    </div>
                                    {productData?.importer_name && <>
                                        <div className="bor my-3"></div>
                                        <div className="row gx-2">
                                            <div className="col-md-1 col-1">
                                                <Image src={impt} alt="cart1" className={``} loading="lazy" />
                                            </div>
                                            <div className="col-md-11 col-11">
                                                <p className='pro-para3'>
                                                    <b>Importer Name:</b>
                                                    &nbsp;<span style={{ color: "#e3509c", fontSize: "100%" }}>{productData?.importer_name}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </>}
                                    <div className="bor my-3"></div>
                                    {productData?.country_of_origin && <>
                                        <div className="row gx-2 items-center">
                                            <div className="col-md-1 col-1">
                                                <Image src={country} alt="cart1" className={``} loading="lazy" />
                                            </div>
                                            <div className="col-md-11 col-11">
                                                <p className='pro-para3'><b>Country of Origin:</b>
                                                    &nbsp;<span style={{ color: "#c5c5c5", textTransform: "uppercase" }}>{productData?.country_of_origin}</span> </p>
                                            </div>
                                        </div>
                                    </>}
                                </div>
                            </div> */}

                                </> :
                                    <Skeleton
                                        variant="rounded"
                                        className='mt-3 w-full'
                                        // width={"100%"}
                                        height={"90%"}
                                    />}

                                {/* <p>Share On:</p> */}
                                {/* <div className={`share for_mobile tm-flex-col `}>

                                    <ul className="footer-social pro text-center">
                                        {linksArr?.length ? linksArr.map((v: any, i: number) => <li key={i}>
                                            <Link target="_blank" href={`${v?.link}`}><i className={`fa-brands ${v?.class}`}></i></Link></li>)
                                            :
                                            null
                                        }
                                    </ul>

                                </div> */}

                                <div className='my-3 flex items-start gap-3'>
                                    {/* <p className='pro-para2'>
                                <b className=''>Reviews:</b>
                            </p> */}

                                    <div className='w-full'>

                                        {/* {(+productData?.rating_count <= 0 || +productData?.total_reviews <= 0) && (
                                            <div>
                                                <div className='flex items-center justify-between'>
                                                    <h2 style={{ fontSize: "20px", fontWeight: "600", }} className='m-0'>Ratings & Reviews</h2>
                                                    {getReviews?.sendReview ? <div className='rateProduct' onClick={() => setRateProductOpen(true)}>Rate Product</div> : null}
                                                </div>
                                                <hr />
                                                <div className={`flex items-center justify-between ${mobView ? `flex-col` : `flex-row`}`}>
                                                    <div className={`flex flex-col items-center ${mobView ? `width-100` : `width-20`}`}>
                                                        <span className='flex items-center gap-2' style={{ color: "#2d2d2d", fontWeight: "400" }}><span style={{ fontSize: "200%" }}>{(+productData?.rating_count).toFixed(1)}</span> <StarRateIcon style={{ fontSize: "160%" }} /></span>
                                                        <span className='text-center' style={{ fontSize: "80%" }}>
                                                            {+productData?.total_ratings}&nbsp;{`Ratings &`}
                                                            <br />
                                                            {+productData?.total_reviews} Reviews
                                                        </span>
                                                    </div>
                                                    <div className={`myReview_slider ${mobView ? `w-full` : ``}`}>
                                                        <span className={`${productData?.specificRating?.five ? 'strong' : ''} flex items-center gap-1`}><span className='flex items-center justify-end gap-1' style={{ width: "5%", fontSize: "12px", color: "#2d2d2d" }}>5<StarRateIcon style={{ fontSize: "13px" }} /></span>&nbsp;<MuiSlider style={{ width: "80%" }} disabled value={productData?.specificRating?.five} aria-label="Disabled slider" /><span style={{ width: "10%", fontSize: "70%", fontWeight: "500", color: "#2d2d2d" }}>&nbsp;{productData?.specificRating?.five}</span></span>
                                                        <span className={`${productData?.specificRating?.four ? 'strong' : ''} flex items-center gap-1`}><span className='flex items-center justify-end gap-1' style={{ width: "5%", fontSize: "12px", color: "#2d2d2d" }}>4<StarRateIcon style={{ fontSize: "13px" }} /></span>&nbsp;<MuiSlider style={{ width: "80%" }} disabled value={productData?.specificRating?.four} aria-label="Disabled slider" /><span style={{ width: "10%", fontSize: "70%", fontWeight: "500", color: "#2d2d2d" }}>&nbsp;{productData?.specificRating?.four}</span></span>
                                                        <span className={`${productData?.specificRating?.three ? 'strong' : ''} flex items-center gap-1`}><span className='flex items-center justify-end gap-1' style={{ width: "5%", fontSize: "12px", color: "#2d2d2d" }}>3<StarRateIcon style={{ fontSize: "13px" }} /></span>&nbsp;<MuiSlider style={{ width: "80%" }} disabled value={productData?.specificRating?.three} aria-label="Disabled slider" /><span style={{ width: "10%", fontSize: "70%", fontWeight: "500", color: "#2d2d2d" }}>&nbsp;{productData?.specificRating?.three}</span></span>
                                                        <span className={`${productData?.specificRating?.two ? 'mid' : ''} flex items-center gap-1`}><span className='flex items-center justify-end gap-1' style={{ width: "5%", fontSize: "12px", color: "#2d2d2d" }}>2<StarRateIcon style={{ fontSize: "13px" }} /></span>&nbsp;<MuiSlider style={{ width: "80%" }} disabled value={productData?.specificRating?.two} aria-label="Disabled slider" /><span style={{ width: "10%", fontSize: "70%", fontWeight: "500", color: "#2d2d2d" }}>&nbsp;{productData?.specificRating?.two}</span></span>
                                                        <span className={`${productData?.specificRating?.one ? 'low' : ''} flex items-center gap-1`}><span className='flex items-center justify-end gap-1' style={{ width: "5%", fontSize: "12px", color: "#2d2d2d" }}>1<StarRateIcon style={{ fontSize: "13px" }} /></span>&nbsp;<MuiSlider style={{ width: "80%" }} disabled value={productData?.specificRating?.one} aria-label="Disabled slider" /><span style={{ width: "10%", fontSize: "70%", fontWeight: "500", color: "#2d2d2d" }}>&nbsp;{productData?.specificRating?.one}</span></span>
                                                    </div>
                                                </div>
                                                <hr />
                                            </div>
                                        )} */}

                                        <div className="rating-section">
                                            {+productData?.rating_count > 0 || +productData?.total_reviews > 0 ? (
                                                <div>
                                                    <div className='flex items-center justify-between'>
                                                        <h2 className='rating-title'>Ratings & Reviews</h2>
                                                        {getReviews?.sendReview && (
                                                            <div className='rateProduct' onClick={() => setRateProductOpen(true)}>Rate Product</div>
                                                        )}
                                                    </div>
                                                    <hr />
                                                    <div className={`flex items-center justify-between ${mobView ? `flex-col` : `flex-row`}`}>
                                                        <div className={`flex flex-col items-center ${mobView ? `width-100` : `width-20`}`}>
                                                            <span className='flex items-center gap-2 rating-score'>
                                                                <span className="rating-number">{(+productData?.rating_count).toFixed(1)}</span>
                                                                <StarRateIcon className="star-icon" />
                                                            </span>
                                                            <span className='text-center rating-text'>
                                                                {+productData?.total_ratings} Ratings & {+productData?.total_reviews} Reviews
                                                            </span>
                                                        </div>
                                                        <div className={`myReview_slider ${mobView ? `w-full` : ``}`}>
                                                            {[5, 4, 3, 2, 1].map((star) => {
                                                                const ratingPercentage = (specificRating[star] / totalRatings) * 100 || 0; // Convert count to percentage
                                                                return (
                                                                    <span key={star} className="flex items-center gap-1 rating-row">
                                                                        <span className="flex items-center justify-end gap-1 star-label">
                                                                            {star}
                                                                            <StarRateIcon className="small-star-icon" />
                                                                        </span>
                                                                        <MuiSlider
                                                                            style={{ width: "80%" }}
                                                                            disabled
                                                                            value={ratingPercentage}
                                                                            max={3000}
                                                                            step={10}
                                                                            sx={{
                                                                                "& .MuiSlider-track": {
                                                                                    backgroundColor: "#008000",
                                                                                },
                                                                                "& .MuiSlider-thumb": {
                                                                                    display: "none",
                                                                                },
                                                                                "& .MuiSlider-mark": {
                                                                                    backgroundColor: "#f1c40f",
                                                                                    height: "6px",
                                                                                    width: "6px",
                                                                                    borderRadius: "50%",
                                                                                },
                                                                            }}
                                                                        />
                                                                        <span className="rating-count">{specificRating[star] || 0}</span>
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </div>
                                            ) : (
                                                // <div className="no-rating">
                                                //     <h2>Ratings & Reviews</h2>
                                                //     <div className="stars">
                                                //         {Array(5).fill(0).map((_, i) => (
                                                //             <StarRateIcon key={i} className="empty-star" />
                                                //         ))}
                                                //     </div>
                                                //     <p className="no-rating-text">
                                                //         This product has not been rated yet. Be the first to share your experience and help others make a choice!
                                                //     </p>
                                                //     {/* <button className="rate-btn" onClick={() => setRateProductOpen(true)}>Rate This Product</button> */}
                                                //     {getReviews?.sendReview === undefined ?
                                                //         null :
                                                //         <button className="rate-btn" onClick={() => handleRateProduct(productData?.id)}>Rate This Product</button>
                                                //     }
                                                // </div>

                                                <div className="rating-container">
                                                    <div className="rating-content">
                                                        <h2 className="rating-title">Ratings & Reviews</h2>
                                                        <div className="childDiv">
                                                            <p className="rating-text">
                                                                This product has not been rated yet. Be the first to share your experience and help others make a choice!
                                                            </p>
                                                            {
                                                                // getReviews?.sendReview !== undefined
                                                                !getme?.id
                                                                    ? (
                                                                        <button className="rate-btn" onClick={handleOpenAuthModal}>
                                                                            Rate This Product
                                                                        </button>
                                                                    ) : (
                                                                        <button className="rate-btn" onClick={() => handleRateProduct(productData?.id)}>
                                                                            Rate This Product
                                                                        </button>
                                                                    )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex flex-wrap justify-between review'>
                                            {productData?.userReview?.length > 0 && (
                                                productData?.userReview?.map((v: any, i: number) => (
                                                    <div className='w-full' key={i}>
                                                        <div className='flex flex-col gap-2'>
                                                            <div className='flex items-center gap-3'>
                                                                <div className='flex items-center gap-2'>
                                                                    <div className='flex justify-end'>
                                                                        <div className='px-2 flex items-center gap-1'
                                                                            style={{ borderRadius: "4px", background: "green", color: "#ffffff", fontSize: "15px" }}>
                                                                            <span className='flex items-center gap-1' style={{ lineHeight: "24px", fontSize: "14px" }}>
                                                                                {v?.item_rating}
                                                                                <StarRateIcon style={{ fontSize: "100%" }} />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {!v?.anonymous ? (
                                                                        <p className='m-0 reviewer_name' style={{ fontSize: "16px" }}>
                                                                            {v?.user?.first_name}&nbsp;{v?.user?.last_name}
                                                                        </p>
                                                                    ) : (
                                                                        <p className='m-0 reviewer_name' style={{ fontSize: "16px" }}>Anonymous</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className='reviewer_content_root gap-1'>
                                                                <span className='reviewer_content'>
                                                                    {v?.description}
                                                                </span>
                                                                {v?.userReviewImage?.length > 0 && (
                                                                    <Image
                                                                        src={v?.userReviewImage[0]?.src}
                                                                        alt={v?.userReviewImage[0]?.name}
                                                                        className='review_image'
                                                                        width={80}
                                                                        height={80}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <hr />
                                                    </div>
                                                ))
                                            )
                                                //     : (
                                                // <p className='w-full text-center my-4'>No Review Available</p>
                                                //     )
                                            }
                                        </div>

                                    </div>

                                </div>

                            </div>
                            {/* right end */}
                        </div>

                        <Modal
                            open={open}
                            onClose={handleCloseAuthModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            className='mode'
                        >
                            <>
                                <Box sx={modalStyle} id={"authModal_cls"}>
                                    <div className='w-full flex justify-between'>
                                        <div></div>
                                        <CloseIcon onClick={handleCloseAuthModal} className={`btn-close cursor-pointer`} />
                                    </div>
                                    <Login handleClickExtra={handleCloseAuthModal} setOpen={setOpen} />
                                    {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseAuthModal}></button> */}
                                </Box>
                            </>
                        </Modal>

                        {/* Review warning modal */}
                        <Dialog
                            open={isRateProduct}
                            onClose={() => setIsRateProduct(false)}
                            sx={{ "& .MuiPaper-root": { borderRadius: "12px", padding: "16px", width: "400px" } }}
                        >
                            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: { xs: "16px", sm: "18px" } }}>
                                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                                    <ErrorIcon sx={{ fontSize: { xs: 35, sm: 40 }, color: "#ff6f61" }} />
                                </Box>
                                {"Oops! You haven't purchased this product yet."}
                            </DialogTitle>

                            <DialogContent>
                                <Typography sx={{ fontSize: { xs: "13px", sm: "14px" }, textAlign: "justify", color: "#555", lineHeight: 1.5 }}>
                                    {"To leave a rating or review, please complete your purchase first. Once you've bought it, you'll be able to share your feedback."}
                                </Typography>
                                <Typography sx={{ fontSize: { xs: "13px", sm: "15px" }, mt: 2, textAlign: "center", color: "#e4509d", fontWeight: "bold" }}>
                                    {"Thank you for your understanding!"}
                                </Typography>
                            </DialogContent>

                            <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        textTransform: "none",
                                        width: "120px",
                                        backgroundColor: "#ff6f61",
                                        "&:hover": { backgroundColor: "#e65c50" },
                                    }}
                                    onClick={() => setIsRateProduct(false)}
                                >
                                    OK
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        textTransform: "none",
                                        width: "130px",
                                        color: "#e4509d",
                                        borderColor: "#e4509d",
                                        "&:hover": {
                                            color: "#fff",
                                            backgroundColor: "#e4509d",
                                            borderColor: "#e4509d",
                                        },
                                    }}
                                    // onClick={() => onCreateCart()}
                                    onClick={() => { getme.id ? (productData?.variations?.length && !variationsId?.id) ? null : onCreateCart() : onCreateCart(), setIsRateProduct(false) }}
                                >
                                    Add to Cart
                                </Button>
                            </DialogActions>
                        </Dialog>


                        <div className="mt-4">
                            <div className="flex gx-2">
                                <div className="">
                                    <h4 className='pro-title1'>NEW PRODUCT</h4>
                                </div>
                            </div>
                            <hr className="mt-2" />
                            <div className={`flex flex-wrap items-start justify-between flex-row`}>
                                {getArrival?.length ? getArrival?.slice(1, 8).map((v: any, i: number) =>
                                    <div key={i} className={`flex flex-col items-center cursor-pointer ${mobView ? `width-50` : `w-10rem`}`} onClick={() => router.push(`/product/${v?.product_details?.slug}`)}>
                                        <div className="flex items-center justify-center">
                                            <img src={v?.product_details?.images[0]?.src} alt="cart1" width={107} height={129} className={`pro-img`} sizes="(min-width: 107px) 50vw, 100vw" />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="star-rating">
                                                <Stack spacing={1}>
                                                    <Rating name="half-rating" size='small' defaultValue={+(v?.rating_count)} precision={0.5} readOnly />
                                                </Stack>
                                            </div>
                                            <p className='royal text-center' style={{ width: "80%" }}>{v?.product_details?.name.substring(0, 34)}{v?.product_details?.name?.length >= 34 ? `...` : ``}</p>
                                            <h4 className='pro-price m-0'>
                                                <span style={{ background: "#ffd8ec", padding: "3px 9px", }} className='rounded color-e4509d' >
                                                    <span className="inr">₹</span>{v?.product_details?.price}
                                                </span>
                                            </h4>
                                        </div>
                                    </div>) : null}
                            </div>
                        </div>

                        {getRelatedProduct?.length ?
                            <div className="related mt-4 mt-lg-5">
                                <h3 className='rel'>Related Products</h3>
                                <p className='rel-para mb-5 mb-xl-3 pb-2 pb-xl-0'>Our wide range of high-quality pet food from the best global brands is available at affordable price points.</p>

                                <Slider className='pps' {...settings1} slidesToShow={tabView ? 2 : mobView ? 1 : 4}>
                                    <div className="item">
                                        <div className="product-box">
                                            <div className="thumb-wrap">
                                                <div className="thumb"><Link href="javascript:void(0);"><img src="/assets/images/product-image1.png" alt="product-image" width={257} height={257} sizes="(min-width: 257px) 50vw, 100vw" /></Link></div>
                                                <ul className="thumb-list">
                                                    <li><Link href="javascript:void(0);"><img src="/assets/images/product-image1.png" alt="product-image" width={45} height={45} sizes="(min-width: 45px) 50vw, 100vw" /></Link></li>
                                                    <li><Link href="javascript:void(0);"><img src="/assets/images/product-image1.png" alt="product-image" width={45} height={45} sizes="(min-width: 45px) 50vw, 100vw" /></Link></li>
                                                </ul>
                                                <ul className="plinks">
                                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-heart"></i></Link></li>
                                                    <li><Link href="javascript:void(0);"><i className="fa-solid fa-cart-shopping"></i></Link></li>
                                                </ul>
                                            </div>
                                            <div className="rating">
                                                <i className="fa-solid fa-star active"></i>
                                                <i className="fa-solid fa-star active"></i>
                                                <i className="fa-solid fa-star active"></i>
                                                <i className="fa-solid fa-star active"></i>
                                                <i className="fa-solid fa-star"></i>
                                            </div>
                                            <h3 className="ptitle"><Link href="javascript:void(0);">Royal Canin – Kitten 36</Link></h3>
                                            <div className="price pt-0"><span><span className="inr">₹</span></span>396.50  <del><span><span className="inr">₹</span></span>450.00</del></div>
                                        </div>
                                    </div>
                                </Slider>

                            </div>
                            : null}
                    </>
                )}
            </div >


            {/* <MegaMenu1 /> */}
            <Cart sideBarOpen={sideBarOpen} onSideBarClose={() => setSideBarOpen(false)} />

            <Modal
                open={rateProductOpen}
                onClose={() => { setRateProductOpen(false); }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className=''
                style={(tabView || mobView) ? { width: "90%", height: "fit-content", margin: "auto" } : { width: "60%", height: "fit-content", margin: "auto" }}
            >
                <>
                    {getReviews?.sendReview ?
                        <div className='flex flex-col items-end gap-2 p-4 rounded doReview_root' style={{ background: "#ffffff" }}>
                            <div className='write_review'>
                                <div className='review_img_cls gap-1 w-full'>
                                    <div className='flex flex-col w-full'>
                                        <p className='m-0 flex w-full items-center'>
                                            <span className='pro-para3 '><b className='capitalize'>post as an anonymous:</b>&nbsp;</span>
                                            <Checkbox
                                                name='anonymous'
                                                checked={anonymousReview}
                                                onClick={() => setAnonymousReview(!anonymousReview)}
                                                className='w-fit'
                                                sx={{
                                                    color: "#e4509d",
                                                    '&.Mui-checked': {
                                                        color: "#e4509d",
                                                    },
                                                }} />
                                        </p>
                                        <p className='m-0'>
                                            <span className='pro-para3'><b>Name:</b>&nbsp;</span>{(getme?.first_name && getme?.last_name) ? capitalize(getme?.first_name + " " + getme?.last_name) : null}
                                        </p>
                                        <p className='m-0'>
                                            <span className='pro-para3'><b>Email:</b>&nbsp;</span>{getme?.email}
                                        </p>
                                        <div className='w-full flex'>
                                            <span className='pro-para3'><b>Rating:</b>&nbsp;</span><Rating precision={0.5} value={review?.item_rating} name='item_rating' onChange={(e: any) => onReview(e)} />
                                        </div>
                                        <p className='m-0 error'>{ratingError}</p>
                                    </div>
                                </div>
                                <div className='review_cls_root'>
                                    <textarea className='rounded p-2 review_cls' placeholder='Write a review...' value={review?.description} name='description' onChange={(e: any) => onReview(e)} />
                                    <p className='m-0 error'>{descriptionError}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className="edit-order-cancel m-0 cursor-pointer" onClick={() => { setRateProductOpen(false); }} style={(tabView || mobView) ? { padding: "8px 8px", borderRadius: "0 10px 0 10px" } : { borderRadius: "0 10px 0 10px" }}>Close</div>
                                <button className='btn btn-primary' onClick={() => { doReview() }}>Submit</button>
                            </div>
                        </div> : null}
                </>
            </Modal>


            <Dialog
                open={clickNotify}
                onClose={() => { setClickNotify(false); setEmailIDErr(""); setPhone_noErr(""); }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className='px-3 py-3 flex flex-col ' >
                    <div className='flex justify-between items-center'>
                        <span style={{ fontSize: "16px", fontWeight: "600" }}>Notify Me</span>
                        <CloseIcon style={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={() => { setClickNotify(false); setEmailIDErr(""); setPhone_noErr(""); }} />
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
                            <label style={{ fontSize: "80%", fontWeight: "500" }}>Phone no</label>
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

interface Props {
    productData: any,
    loadingdetails: boolean,
    slug: any,
    isLoading: boolean;
}

export default Productdetails