import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { _SUCCESS, _WARNING } from '../../util/_reactToast'
import useIsLogedin from '../../hooks/useIsLogedin'
import { useCreate, useRead } from '../../hooks'
import getUrlWithKey from '../../util/_apiUrl'
import { Box, CircularProgress, ClickAwayListener, colors, Drawer, Modal, Skeleton } from '@mui/material'
import Login from '../../containers/auth/Login'
import Cart from '../../containers/client/cart'
import MegaMenu1 from '../megaMenu/MegaMenu1'
import MegaMenu2 from '../megaMenu/MegaMenu2'
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router'
import send_icon from "../../../public/assets/images/send-icon.svg"
import send_icon_pink from "../../../public/assets/images/send-icon-pink.svg"
import { useSelector } from 'react-redux'
import { setOpenCart } from '../../reducer/openCartReducer'
import { useDispatch } from 'react-redux'
import { setCartCount } from '../../reducer/cartCountReducer'
import { setListingType } from '../../reducer/listingTypeReducer'
import supmail from '../../../public/assets/images/email.png'
import supcal from '../../../public/assets/images/schedule.png'
import supwhat from '../../../public/assets/images/whatsapp.png'
import { capitalize, createSlugModifier, isEmptyObject, lowerCase } from '../../util/_common'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MegaMenuTest from '../megaMenu1'
import WhatsAppLink from '../SupportNumber'
import moment from 'moment'
import { setLinkName } from '../../reducer/linkNameReducer'
import SupportNumber from '../SupportNumber'
import { setOpenAuth } from '../../reducer/openAuthReducer'
import useTabView from '../../hooks/useTabView'
import axios from 'axios'
import { setOpenCartDisable } from '../../reducer/openCartReducerForDisable'
import { setBreadcrumbs } from '../../reducer/breadcrumbsReaducer'
import { _post, _put } from '../../services'
import { GetServerSideProps } from 'next'
import { setMe } from '../../reducer/me'
import { BorderBottom, ExpandMore } from '@mui/icons-material'
import { generateToken, messaging } from '../../util/firebase'
// import { onMessage } from 'firebase/messaging'


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


const Layout = ({ children }: any) => {
    // const { isLoged, logedData } = useIsLogedin()


    // useEffect(() => {
    //     const token = generateToken();
    //     console.log(token);
    // }, []);


    const router = useRouter()
    const dispatch = useDispatch()
    const { tabView, mobView } = useTabView()

    const { cart_item_count, get_menu_types, dtdc_pincode, create_leave_email, read_theam_options, product_list, popular_search_list, relevant_search } = getUrlWithKey("client_apis")
    const { me: me_url } = getUrlWithKey("auth_apis")

    const [FCM_TOKEN, setFCM_TOKEN] = useState<any>("")

    const getFCMToken = async () => {
        try {
            const token = await generateToken();

            if (token && token !== "" && token !== null && token !== undefined) {
                setFCM_TOKEN(token)
            }
        } catch (error) {
            console.error("Error getting token:", error);
        }
    };

    useEffect(() => {
        getFCMToken();
    }, [])

    console.log(FCM_TOKEN)

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const { data: me }: any = await axios.get(me_url, { withCredentials: true });
                console.log(me, "d3g153f1g65fd")
                if (me?.success && me?.data?.id) {
                    localStorage.setItem("logedId", "true");
                    dispatch(setMe(me?.data))
                    const token = await generateToken();

                    if (token && token !== null && token !== undefined && token !== "") {
                        try {
                            const res = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/add-fcm-token`, { device_token: [token] });
                            console.log(res)
                        } catch (error) {
                            console.log(error)
                        }
                    }
                } else {
                    // api call for create geust_user for push notification
                    try {
                        const token = await generateToken();
                        const res = await _put(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/new-user`);
                        if (res?.data?.success && token && token !== null && token !== undefined && token !== "") {
                            try {
                                const res = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/add-fcm-token`, { device_token: [token] });
                                console.log(res)
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    } catch (error: any) {
                        console.log(error);
                    }
                }
            } catch (error) {
                console.log(error);
                if (error && error === "access_denied") {
                    localStorage.removeItem("logedId");

                    // api call for create geust_user for push notification
                    try {
                        const token = await generateToken();
                        const res = await _put(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/new-user`);
                        if (res?.data?.success) {
                            if (token && token !== null && token !== undefined) {
                                try {
                                    const res = await _post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/add-fcm-token`, { device_token: [token] });
                                    console.log(res)
                                } catch (error) {
                                    console.log(error)
                                }
                            }
                        }
                    } catch (error: any) {
                        console.log(error);
                    }

                }
            }
        }



        // onMessage(messaging, (payload: any) => {
        //     console.log(payload);
        // })


        // navigator.serviceWorker
        //     .register('/firebase-messaging-sw.js')
        //     .then((registration) => console.log("Service Worker registered:", registration))
        //     .catch((error) => console.error("Service Worker registration failed:", error));


        fetchMe();
    }, [])


    const [cartItemCount, setCartItemCount]: any = useState()
    const [dtdcPincode_url, setDtdcPincodeUrl]: any = useState()
    const [payload_dtdc_pincode, setPayloadDtdcPincode] = useState<{ "zipcode": string }>({
        zipcode: ""
    });
    const [payloadData, setPayloadData]: any = useState<any>();
    const [errorPin, setPinError]: any = useState();
    const [getMenuTypes, setGetMenuTypes]: any = useState(get_menu_types)
    const [getMenuCallData, setGetMenuCallData]: any = useState({ code: [1, 2, 3, 4] })
    const [leaveEmail, setLeaveEmail]: any = useState<object>({})
    const [sendEmail, setSendEmail]: any = useState<object>({})
    const [create_leave_email_url, setCreate_leave_email_url]: any = useState()
    const [showSupportRes, setShowSupportRes]: any = useState(false)
    const dropdownRef = useRef(null);

    const [breadcrumbsLocal, setBreadcrumbsLocal]: any = useState<any[]>([])

    const getCart = useSelector((state: any) => state?.getCartReducer?.value);
    const getme = useSelector((state: any) => state?.meReducer?.value);
    const openAuth = useSelector((state: any) => state?.openAuthReducer?.value);
    const getopenCart = useSelector((state: any) => state?.openCartReducer?.value);
    const getopenCartDiscount = useSelector((state: any) => state?.openCartDiscountReducer?.value);
    const cartCount = useSelector((state: any) => state?.getCartCountReducer?.value);
    const { sendData: getCartCount }: any = useRead({ selectMethod: "get", url: cartItemCount });
    const { sendData: getReadTheamOptions }: any = useRead({ selectMethod: "get", url: read_theam_options });
    const { sendData: createLeaveEmail, success: createLeaveEmailSuccess }: any = useCreate({ url: create_leave_email_url, callData: sendEmail });
    const { sendData: dtdcPincode, error: dtdcError, loading: dtdcLoading }: any = useRead({ selectMethod: "put", url: dtdcPincode_url, callData: payload_dtdc_pincode });
    const { sendData: getPopulerSeratch }: any = useRead({ selectMethod: "get", url: popular_search_list });

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSupportRes(false);
            }
        };

        // Attach event listener
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);




    console.log(openAuth, "leavedvszEmail")
    console.log(getReadTheamOptions, getReadTheamOptions?.length, "getReadThvveamOptions")
    useEffect(() => {
        const handleRouteChange = (url: any) => {
            let newUrl = url.split("/")
            setBreadcrumbsLocal((prev: any) => [...prev, { urls: newUrl.length ? newUrl.map((v: any) => ({ name: v, slug: url })) : [] }]);
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router]);

    useEffect(() => {
        if (breadcrumbsLocal?.length) {
            dispatch(setBreadcrumbs(breadcrumbsLocal))
        }
    }, [breadcrumbsLocal])

    const [homeLeveError, setHomeLeaveError] = useState<any>("");
    const doSendEmail = () => {
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // old regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // new regex
        if (leaveEmail?.email && emailRegex.test(leaveEmail?.email)) {
            setCreate_leave_email_url(create_leave_email)
            setSendEmail(leaveEmail)
        } else {
            setHomeLeaveError("Please Enter Your valid Email-Id");
            setTimeout(() => {
                setHomeLeaveError("")
            }, 2000)
        }
    }
    useEffect(() => {
        if (create_leave_email_url) {
            setCreate_leave_email_url()
        }
    }, [create_leave_email_url])

    useEffect(() => {
        if (createLeaveEmailSuccess?.success) {
            setLeaveEmail({})
            setSendEmail({})
            setCreate_leave_email_url()
            _SUCCESS("Email leave successfully")
        }
    }, [createLeaveEmailSuccess])


    useEffect(() => {
        if (dtdcPincode) {
            setPayloadData(dtdcPincode);
            setPinError(null);
        }

        if (dtdcError) {
            setPinError(dtdcError?.response?.data?.massage);
        }
    }, [dtdcPincode, dtdcError]);
    const { sendData: menueArr }: any = useRead({ selectMethod: "put", url: getMenuTypes, callData: getMenuCallData });

    // const [menueArr, setMenueArr]: any = useState()
    // const getMenueArr = async () => {
    //     try {
    //         const { data }: any = await _put(getMenuTypes, getMenuCallData)
    //         if (data?.success) {
    //             // console.log(data?.data?.data, 'getMenueArr')
    //             setMenueArr(data?.data)
    //         }
    //     } catch (error) {
    //         console.log(error, "__error")
    //     }
    // }

    // useEffect(() => {
    //     getMenueArr()
    // }, [])

    // useEffect(()=>{
    //     if(router.pathname === "/"){
    // setMenueArr(menuArrData)
    //     }
    // },[menuArrData])

    console.log(menueArr, "getMenueArr")



    const [sideBarOpen, setSideBarOpen]: any = useState<boolean>(false)
    const [sideBarOpenForDiscount, setSideBarOpenForDiscount]: any = useState<boolean>(false)
    const [changeSendIcon, stChangeSendIcon] = useState(false)

    // console.log(sideBarOpenForDiscount, "sideBarOpenForDiscount")

    useEffect(() => {
        setSideBarOpen(false);
        // console.log("router.pathname in layout", router.pathname);
        setOpen(false);
    }, [router.pathname]);

    useEffect(() => {
        setSideBarOpen(getopenCart)
        setSideBarOpenForDiscount(getopenCartDiscount)
    }, [getopenCart])

    useEffect(() => {
        if (!sideBarOpen) {
            dispatch(setOpenCart(false))
        }
    }, [sideBarOpen])

    useEffect(() => {
        if (getme?.id) {
            setCartItemCount(cart_item_count)
        }
    }, [sideBarOpen, getCart?.productPriceTotal, getme?.id, router.pathname])

    useEffect(() => {
        if (cartItemCount === cart_item_count) {
            setCartItemCount()
        }
    }, [cartItemCount])

    useEffect(() => {
        dispatch(setCartCount(getCartCount?.totalItems))
    }, [getCartCount])


    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (openAuth) {
            setOpen(openAuth)
        }
    }, [openAuth])

    useEffect(() => {
        dispatch(setOpenAuth(open))
    }, [open])

    const handleOpenAuthModal = () => {
        if (getme?.id && getme?.role?.label !== "guest") {
            // _SUCCESS("alredy loged in!")
            router.push("/myaccount")
            // setOpen(true)
        } else {
            setOpen(true)
        }
    }

    const handleOpenAuthModalWishlist = () => {
        if (getme?.id && getme?.role?.label !== "guest") {
            // _SUCCESS("alredy loged in!")
            router.push("/wishlist")
            // setOpen(true)
        } else {
            setOpen(true)
        }
    }

    const handleOpenAuthModalMyAccount = () => {
        if (!getme || !getme?.id || getme?.role?.label === "guest") {
            dispatch(setOpenAuth(true));
        }
    };

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



    const handleCloseAuthModal = () => {
        setOpen(false)
    }
    const [dropEnter, setDropEnter]: any = useState(false)
    const [dropType, setDropType]: any = useState()
    const doOpenMegaMenu = (type: any) => {
        setDropEnter(true)
        setDropType(type)
    }
    const doCloseMegaMenu = () => {
        setDropEnter(false)
    }

    // dtdc deliveryPincode
    const [deliveryPincode, setDeliveryPincode] = useState('');

    // useEffect(() => {
    //     const pin_Code = localStorage.getItem("PIN_Code")
    //     setDeliveryPincode(pin_Code)
    // }, [])

    const handleInputChange = (event: any) => {
        setDeliveryPincode(event.target.value);
        // localStorage.setItem("PIN_Code", event.target.value)
        if (!event.target.value) {
            setPayloadData(null);
            setPinError(null);
        }
    };

    const handleSubmit = () => {
        // Handle form submission or any other action
        const zipCodeRegex = /^\d{6}$/;

        if (deliveryPincode?.trim() === "") {
            _WARNING("ZIP code cannot be empty");
            return;
        }

        if (!zipCodeRegex.test(deliveryPincode)) {
            _WARNING("ZIP code must be exactly 6 digits");
            return;
        }

        setDtdcPincodeUrl(dtdc_pincode);
        setPayloadDtdcPincode({ zipcode: deliveryPincode });
        // if (zipCodeRegex.test(deliveryPincode)) {
        //     setDtdcPincodeUrl(dtdc_pincode);
        //     setPayloadDtdcPincode({ zipcode: deliveryPincode });
        // } else {
        //     _WARNING("Please enter zipcode")
        // }
    };

    const doOnMouseEnter = (linkName: string) => {
        if (linkName === "DOGS") {
            doOpenMegaMenu("dog");
            dispatch(setListingType({ type: "dog" }))
        }

        if (linkName === "CATS") {
            doOpenMegaMenu("cat");
            dispatch(setListingType({ type: "cat" }))
        }

        if (linkName === "SMALL ANIMALS") {
            doOpenMegaMenu("smAnimal")
            dispatch(setListingType({ type: "smAnimal" }))
        }

        if (linkName === "Brand") {
            doOpenMegaMenu("brand")
            dispatch(setListingType({ type: "brand" }))
        }

        if (linkName === "SHOP BY BREED") {
            doOpenMegaMenu("sbb")
            dispatch(setListingType({ type: "sbb" }))
        }

        // if (linkName === "Best Selling") { }

        // if (linkName === "New arrivals") { }

        // if (linkName === "Offer") {

        // }

        // if (linkName === "Stores Locator") { }

        // if (linkName === "Contact us") { }
    }
    const doOnMouseLeave = (event: any, linkName: string) => {

        const rect = event.target.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const conditions = (name: string) => {
            if (name === "DOGS") {
                doCloseMegaMenu()
            }

            if (name === "CATS") {
                doCloseMegaMenu()
            }

            if (name === "SMALL ANIMALS") {
                doCloseMegaMenu()
            }

            if (name === "Brand") {
                doCloseMegaMenu()
            }

            if (name === "SHOP BY BREED") {
                doCloseMegaMenu()
            }
        }

        if (mouseX < rect.left) {
            conditions(linkName)
        } else if (mouseX > rect.right) {
            conditions(linkName)
        } else if (mouseY < rect.top) {
            conditions(linkName)
        }

    }

    const doOnClick = (linkName: string) => {

        if (linkName === "Home") {
            dispatch(setListingType({ type: "" }))
            router.push("/")
        }

        if (linkName === "Offer") {
            dispatch(setListingType({ type: "" }))
            router.push("/offer")
        }

        if (linkName === "Blog") {
            dispatch(setListingType({ type: "" }))
            router.push("/blog")
        }

        if (linkName === "Contact us") {
            dispatch(setListingType({ type: "" }))
            router.push("/contact-us")
        }

        if (linkName === "Stores Locator") {
            dispatch(setListingType({ type: "" }))
            router.push("/stores-locator")
        }

        if (linkName === "New arrivals") {
            dispatch(setListingType({ type: "" }))
            router.push("/new-arrivals")
        }

        if (linkName === "Best Selling") {
            dispatch(setListingType({ type: "" }))
            router.push("/best-selling")
        }
    }

    const [dropEnterRes, setDropEnterRes]: any = useState()
    // const [dropTypeRes, setDropTypeRes]: any = useState()

    // const doOpenMegaMenuRes = (type: any) => {
    //     setDropEnterRes(true)
    //     setDropTypeRes(type)
    // }
    // const doCloseMegaMenuRes = () => {
    //     setDropEnterRes(false)
    // }
    const [menuLoopType, setMenuLoopType]: any = useState([])
    const [menueResOpen, setMenueResOpen]: any = useState(false)
    const [routesName, setRoutesName]: any = useState()

    useEffect(() => {
        setMenueResOpen(false)
    }, [routesName])

    const doOnClickRes = (linkName: string) => {


        if (dropEnterRes === linkName) {
            setDropEnterRes();
            dispatch(setListingType({ type: "" }))
            setMenuLoopType([])
        } else {
            setDropEnterRes(linkName);

            if (linkName === "DOGS") {
                dispatch(setListingType({ type: "dog" }))
            }

            if (linkName === "CATS") {
                dispatch(setListingType({ type: "cat" }))
            }

            if (linkName === "SHOP BY BREED") {
                dispatch(setListingType({ type: "sbb" }))
            }

            if (linkName === "Brand") {
                dispatch(setListingType({ type: "brand" }))
            }

            if (linkName === "SMALL ANIMALS") {
                dispatch(setListingType({ type: "smAnimal" }))
            }

            if (linkName === "Home") {
                setMenuLoopType([])
                dispatch(setListingType({ type: "" }))
                router.push("/")
                setMenueResOpen(false)
            }

            if (linkName === "Offer") {
                setMenuLoopType([])
                dispatch(setListingType({ type: "" }))
                router.push("/offer")
                setMenueResOpen(false)
            }

            if (linkName === "Blog") {
                setMenuLoopType([])
                dispatch(setListingType({ type: "" }))
                router.push("/blog")
                setMenueResOpen(false)
            }

            if (linkName === "Contact us") {
                setMenuLoopType([])
                dispatch(setListingType({ type: "" }))
                router.push("/contact-us")
                setMenueResOpen(false)
            }

            if (linkName === "Stores Locator") {
                setMenuLoopType([])
                dispatch(setListingType({ type: "" }))
                router.push("/stores-locator")
                setMenueResOpen(false)
            }

            if (linkName === "New arrivals") {
                setMenuLoopType([])
                dispatch(setListingType({ type: "" }))
                router.push("/new-arrivals")
                setMenueResOpen(false)
            }

            if (linkName === "Best Selling") {
                setMenuLoopType([])
                dispatch(setListingType({ type: "" }))
                router.push("/best-selling")
                setMenueResOpen(false)
            }

        }
    }

    const listingType = useSelector((state: any) => state?.listingTypeReducer?.value)
    useEffect(() => {
        if (listingType?.type === "dog") {
            const _DOGS = menueArr?.["1"]?.menus?.length ? menueArr?.["1"]?.menus?.filter((val: any) => val?.menu_item_id?.name === "DOGS").map((v: any, i: number) => ({ data: v?.menu_item_id?.sub_categories, p_slug: v?.menu_item_id?.slug })) : null
            _DOGS[0]['data'] = _DOGS[0]['data'].map(createSlugModifier(_DOGS[0]['p_slug']));
            setMenuLoopType([_DOGS[0]['data']])
        }
        if (listingType?.type === "cat") {
            const _CATS = menueArr?.["1"]?.menus?.length ? menueArr?.["1"]?.menus?.filter((val: any) => val?.menu_item_id?.name === "CATS").map((v: any, i: number) => ({ data: v?.menu_item_id?.sub_categories, p_slug: v?.menu_item_id?.slug })) : null
            _CATS[0]['data'] = _CATS[0]['data'].map(createSlugModifier(_CATS[0]['p_slug']));
            setMenuLoopType([_CATS[0]['data']])
        }
        if (listingType?.type === "smAnimal") {
            let _SMANIMAL = menueArr?.["1"]?.menus?.length ? menueArr?.["1"]?.menus?.filter((val: any) => val?.menu_item_id?.name === "SMALL ANIMALS").map((v: any, i: number) => ({ data: v?.menu_item_id?.sub_categories, p_slug: v?.menu_item_id?.slug })) : null
            _SMANIMAL[0]['data'] = _SMANIMAL[0]['data'].map(createSlugModifier(_SMANIMAL[0]['p_slug']));
            setMenuLoopType([_SMANIMAL[0]['data']]);
        }
        if (listingType?.type === "sbb") {
            const _SBB = menueArr?.["1"]?.menus?.length ? menueArr?.["1"]?.menus?.filter((val: any) => val?.menu_item_id?.name === "SHOP BY BREED").map((v: any, i: number) => v?.menu_item_id?.options) : null
            setMenuLoopType(_SBB)
        }
        if (listingType?.type === "brand") {
            const _BRAND = menueArr?.["1"]?.menus?.length ? menueArr?.["1"]?.menus?.filter((val: any) => val?.menu_item_id?.title === "Brand").map((v: any, i: number) => v?.menu_item_id?.attributes?.options) : null
            setMenuLoopType(_BRAND)
        }

    }, [listingType])


    const [productSearch, setProductSearch]: any = useState("");
    const [relevantSearchData, setRelevantSearchData]: any = useState([]);
    const [relevantSearchDataOpen, setRelevantSearchDataOpen]: any = useState(false);

    const handleProductSearch = () => {
        // productSearch && setProductSearchUrl({ selectMethod: "put", url: `${product_list}?search=${productSearch}` })
        if (productSearch.trim() !== "") {
            router.push(`/shop/${lowerCase(productSearch)}?type=search`)
            setRelevantSearchDataOpen(false)
        }
    }

    const handleKeyDown = (event: any) => {
        if (productSearch !== "") {
            if (event.key === 'Enter') {
                handleProductSearch();
            }
        }
    }

    const relevantSearch = async (value: any) => {
        let { data } = await _put(`${relevant_search}?search=${value}`)
        console.log(data?.data, "_dataRS")
        if (data?.data.length > 0) {
            setRelevantSearchDataOpen(true)
            setRelevantSearchData(data?.data)
        }
    }
    const handleProductSearchRelevant = (value: any) => {
        // productSearch && setProductSearchUrl({ selectMethod: "put", url: `${product_list}?search=${productSearch}` })
        if (value.trim() !== "") {
            router.push(`/shop/${lowerCase(value)}?type=search`)
            setProductSearch(value)
            setRelevantSearchDataOpen(false)
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        // setRelevantSearchDataOpen(false);
        const target = event.target as HTMLElement;

        if (!target.closest('.my-search')) {
            setRelevantSearchDataOpen(false);
        }
    };



    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickInsideSearch = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    useEffect(() => {
        if (productSearch === "") {
            setRelevantSearchData([])
        }
    }, [productSearch])

    const cartSideBarOpen = (type: any) => {
        if (type === 1) {
            setSideBarOpen(true)
        } else {
            dispatch(setOpenCartDisable(true))
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }

    const [disableCart, setDisableCart] = useState(false)
    useEffect(() => {
        if (router.pathname === "/order") {
            setDisableCart(true)
        } else {
            setDisableCart(false)
            setSideBarOpenForDiscount(false)
        }
    }, [router.pathname])

    // useEffect(() => {
    //     if (getme &&!getme?.id) {
    //         setDisableCart(true)
    //         // setOpen(true)
    //     }
    // }, [getme, getme?.id])



    const Navs = () => {
        // const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
        const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
        const [openBrandMenu, setOpenBrandMenu] = useState(false);
        const [openShopByBreed, setShowByBreed] = useState(false)

        // useEffect(() => {
        //     setMenueResOpen(!menueResOpen);
        // }, [router.pathname]);

        return (
            <>
                {menueArr?.["1"]?.menus?.length ? (
                    menueArr["1"].menus.map((v: any, i: number) => {
                        console.log(v, "dfghdf56gfd");

                        const menuType = v?.menu_item_type;
                        const menuId = v?.menu_item_id?.id;
                        const menuName = v?.menu_item_id?.name;
                        const menuTitle = v?.menu_item_id?.title;
                        const menuSlug = v?.menu_item_id?.slug;
                        const menuLink = v?.menu_item_id?.link;
                        const subCategories = v?.menu_item_id?.sub_categories || [];
                        const hasSubCategories = subCategories.length > 0;
                        const brandAtt = v?.menu_item_id?.title === "Brand" ? v?.menu_item_id?.attributes
                            ?.options : ""
                        const shopByOption = menuName === "SHOP BY BREED" ? v?.menu_item_id?.options : ""
                        console.log(menuName, v, "65fr6gds65")

                        // Determine the correct href based on conditions
                        let href = "#";
                        if (menuType === "pages") {
                            href = menuTitle === "Home" ? "/" : `/${menuSlug}`;
                        } else if (menuType === "productCategory") {
                            href = hasSubCategories ? `/shop/${menuSlug}` : `/${menuSlug}`;
                        } else if (menuName === "Blog") {
                            href = menuLink;
                        }

                        const prefix = menuName === "DOGS" ? "dogs" : menuName === "CATS" ? "cats" : menuName === "SMALL ANIMALS" ? "small-animals" : "";

                        const isBrand = menuTitle === "Brand" ? true : false

                        return (
                            <li key={i} className="relative">
                                <div
                                    className="flex items-center cursor-pointer px-4 justify-between"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isBrand) {
                                            setOpenBrandMenu((prev) => !prev);
                                            setShowByBreed(false)
                                            setOpenMenus({});
                                        }
                                        else if (shopByOption && shopByOption?.length > 0) {
                                            setShowByBreed((prev) => !prev)
                                            setOpenBrandMenu(false);
                                            setOpenMenus({});
                                        }
                                        else if (hasSubCategories) {
                                            // setOpenMenus((prev: any) => ({
                                            //     ...prev,
                                            //     [menuName]: !prev[menuName],
                                            // }));
                                            setOpenMenus((prev) => ({
                                                DOGS: menuName === "DOGS" ? !prev["DOGS"] : false,
                                                CATS: menuName === "CATS" ? !prev["CATS"] : false,
                                                "SMALL ANIMALS": menuName === "SMALL ANIMALS" ? !prev["SMALL ANIMALS"] : false,
                                            }));
                                            setOpenBrandMenu(false);
                                            setShowByBreed(false);
                                        }
                                    }}
                                >
                                    {/* <Link href={href} className="flex-grow" onClick={(e: any) => {
                                        if (menuName === "SHOP BY BREED") {
                                            e.stopPropagation();
                                        } else {
                                            setMenueResOpen(false)
                                            e.stopPropagation();
                                        }
                                    }}>
                                        {menuType === "pages" ? menuTitle : menuName}
                                    </Link> */}
                                    {menuName === "SHOP BY BREED" ? (
                                        <span className="flex-grow cursor-pointer" style={{ color: "#000", fontSize: "14px", textAlign: "justify", marginLeft: "20px", padding: "10px 0px" }} onClick={(e) => e.stopPropagation()}>
                                            {menuType === "pages" ? menuTitle : menuName}
                                        </span>
                                    ) : (
                                        <Link href={href} className="flex-grow" onClick={(e: any) => {
                                            setMenueResOpen(false);
                                            e.stopPropagation();
                                        }}>
                                            {menuType === "pages" ? menuTitle : menuName}
                                        </Link>
                                    )}
                                    {(hasSubCategories || isBrand || shopByOption) && (
                                        <ExpandMore
                                            className={`ml-2 text-gray-500 transform transition-transform duration-500 ${(openMenus[menuName] || (isBrand && openBrandMenu) || (shopByOption && openShopByBreed)) ? "rotate-180" : ""
                                                }`}
                                        />
                                    )}
                                </div>

                                {isBrand && openBrandMenu && (
                                    <ul
                                        className="relative left-0 top-full bg-white shadow-lg w-48 mt-2 rounded-lg transition-all opacity-100 pointer-events-auto overflow-y-auto max-h-60"
                                        style={{ width: "234px" }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {brandAtt?.map((brand: any) => (
                                            <li key={brand.id} className="border-b last:border-none">
                                                <Link
                                                    href={`/shop/brand/${brand.slug}`}
                                                    onClick={() => setMenueResOpen(false)}
                                                    className="px-4 py-2 hover:bg-gray-100 font-bold text-gray-700 flex items-center space-x-3"
                                                >
                                                    <i className="fa-regular fa-circle-dot fa-2xs mr-2"></i>
                                                    <span style={{ fontSize: "12px" }}>{brand.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {shopByOption && openShopByBreed && (
                                    <ul
                                        className="relative left-0 top-full bg-white shadow-lg w-48 mt-2 rounded-lg transition-all opacity-100 pointer-events-auto overflow-y-auto max-h-60"
                                        style={{ width: "234px" }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {shopByOption && shopByOption?.map((shop: any) => {
                                            console.log(shop, "shopVyOptionsdfg545")
                                            return (
                                                <li key={shop.id} className="border-b last:border-none">
                                                    <Link
                                                        href={`/shop/breed/${shop.slug}`}
                                                        onClick={() => setMenueResOpen(false)}
                                                        className="px-4 py-2 hover:bg-gray-100 font-bold text-gray-700 flex items-center space-x-3"
                                                    >
                                                        <i className="fa-regular fa-circle-dot fa-2xs mr-2"></i>
                                                        <span style={{ fontSize: "12px" }}>{shop.name}</span>
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}

                                {/* Subcategories Dropdown */}
                                {hasSubCategories && openMenus[menuName] && (
                                    <ul
                                        className="relative left-0 top-full bg-white shadow-lg w-48 mt-2 rounded-lg transition-all transform opacity-100 pointer-events-auto overflow-y-auto max-h-60"
                                        style={{ width: "234px" }}
                                    >
                                        {subCategories.map((sub: any) => (
                                            <li key={sub.id} className="border-b last:border-none">
                                                <Link
                                                    href={`/product_category/${prefix}/${sub.slug}`}
                                                    onClick={() => setMenueResOpen(false)}
                                                    // className="block px-4 py-2 hover:bg-gray-100 font-bold text-pink-500 underline"
                                                    // style={{ color: "#e4509d", fontWeight: "bold" }}
                                                    className={`block px-4 py-2 hover:bg-gray-100 font-bold ${menuName === "SMALL ANIMALS" ? "" : "text-pink-500 underline"
                                                        }`}
                                                    style={menuName === "SMALL ANIMALS" ? {} : { color: "#e4509d", fontWeight: "bold" }}
                                                >
                                                    {menuName === "SMALL ANIMALS" ? (
                                                        // If menuName is "SMALL ANIMALS", show an icon instead of text styles
                                                        <span className="flex items-center space-x-2 ">
                                                            <i className="fa-regular fa-circle-dot fa-2xs"></i> {/* Add the icon */}
                                                            <span style={{ fontSize: "12px" }}>{sub.name}</span>
                                                        </span>
                                                    ) : (
                                                        // Default style for other menus
                                                        <span className="border-b-4 border-pink-500 pb-1">{sub.name}</span>
                                                    )}
                                                    {/* <span className={`border-b-4 border-pink-500 pb-1`}>{sub.name}</span> */}
                                                </Link>

                                                {/* Show second-level subcategories if available */}
                                                {sub.sub_categories?.length > 0 && (
                                                    <ul className="ml-4 mt-1">
                                                        {sub.sub_categories.map((subSub: any) => (
                                                            <li key={subSub.id} className="pl-2">
                                                                <Link
                                                                    onClick={() => setMenueResOpen(false)}
                                                                    href={`/product_category/${prefix}/${sub.slug}/${subSub.slug}`}
                                                                    className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-200 text-gray-500 font-medium"
                                                                >
                                                                    <i className="fa-regular fa-circle-dot fa-2xs"></i>
                                                                    <span style={{ fontSize: "12px" }}>{subSub.name}</span>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })
                ) : null}
            </>
        )
    }
    {/* <li className={`dropdown d-lg-none border-0`}>
        {menueArr?.["1"]?.menus?.length ? menueArr?.["1"]?.menus.map((v: any, i: number) =>
            <div
                key={i}
                onClick={() => v?.menu_item_type === "pages" ? doOnClickRes(v?.menu_item_id?.title) : doOnClickRes(v?.menu_item_id?.name)}
            >
                {(v?.menu_item_type === "pages" || v?.menu_item_type === "productCategory" || v?.menu_item_type === "customMenu") ?
                    <div className='flex'>
                        <Link
                            href={`${v?.menu_item_type === "pages" ?
                                v?.menu_item_id?.title === "Home" ? "/" : v?.menu_item_id?.title === "Offer" ? `/${v?.menu_item_id?.slug}` : `/${v?.menu_item_id?.slug}`
                                :
                                v?.menu_item_id?.name === "DOGS" ? `/product_category/${v?.menu_item_id?.slug}` : v?.menu_item_id?.name === "CATS" ? `/product_category/${v?.menu_item_id?.slug}` : v?.menu_item_id?.name === "SMALL ANIMALS" ? `/product_category/${v?.menu_item_id?.slug_url}` : v?.menu_item_id?.name === "Blog" ? `${v?.menu_item_id?.link}` : "#"
                                }`} className='pe-2' style={{ fontWeight: "800" }}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name} </Link>
                        <div style={dropEnterRes === (v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name) ?
                            menuLoopType[0]?.length ?
                                {} : { rotate: "-90deg" } : { rotate: "-90deg" }
                        }>
                            <Link href="javascript:void(0);" className={`nav-link p-2 ${(v?.menu_item_type === "pages" || v?.menu_item_id?.name === "Blog") ? "" : "dropdown-toggle"} ${v?.menu_item_id?.title === "Brand" && "dropdown-toggle"}`}></Link>
                        </div>
                    </div >
                    : null}
{
    dropEnterRes === (v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name) ?
        menuLoopType[0]?.length ?
            <ul className="">
                {menuLoopType[0]?.map((v: any, i: number) =>
                    <div key={i} className="drp-menu1">
                        <li onClick={() => { router.push(v?.slug_url ? `/product_category/${v?.slug_url}` : dropEnterRes === "Brand" ? `/shop/brand/${v?.slug}` : `/shop/breed/${v?.slug}`); setRoutesName(+v?.id) }}>
                            <Link
                                href={`${v?.menu_item_type === "pages" ?
                                    v?.menu_item_id?.title === "Home" ? "/" : v?.menu_item_id?.title === "Offer" ? `/${v?.menu_item_id?.slug}` : `/${v?.menu_item_id?.slug}`
                                    :
                                    v?.menu_item_id?.name === "DOGS" ? `/product_category/${v?.menu_item_id?.slug_url}` : v?.menu_item_id?.name === "CATS" ? `/product_category/${v?.menu_item_id?.slug_url}` : v?.menu_item_id?.name === "SMALL ANIMALS" ? `/product_category/${v?.menu_item_id?.slug_url}` : v?.menu_item_id?.name === "Blog" ? `${v?.menu_item_id?.link}` : "#"
                                    }`}
                                className='food mb-2'> <b>{capitalize(v?.name)}</b></Link>
                        </li>
                        {v?.sub_categories?.length ? v?.sub_categories.map((val: any, idx: number) =>
                            <div key={idx} className="food-sec ms-2" onClick={() => { router.push(v?.slug_url ? `/product_category/${val?.slug_url}` : ``); setRoutesName(+val?.id) }}>
                                <li><Link href="javascript:void(0);">{capitalize(val?.name)}</Link></li>
                            </div>) : null}
                    </div>)}
            </ul> : null
        : null
}
            </div >

        ) : null}
    </li > */}

    return (
        <>
            {/* header start */}
            {/* <Link className="hovBtn btn btn-topmenu d-lg-none" href="javascript:void(0);" ><span onClick={() => setMenueResOpen(true)} className="menu-bar"></span></Link> */}
            {router.pathname === "/thankyou" || router.pathname === "/store-locator-mobile" ? null :
                <Link className={`right-14px z-index-999 ${menueResOpen ? "btn-topmenu on" : "btn-topmenu"}`}
                    href="javascript:void(0);" onClick={() => setMenueResOpen(!menueResOpen)} ><span className="menu-bar"></span></Link>}

            {router.pathname === "/thankyou" || router.pathname === "/store-locator-mobile" ? null :
                <div className="header-wrap">
                    <header className="header header-fix">
                        <div className="header-top">
                            <div className="container">
                                <div className="row justify-content-sm-between justify-content-center align-items-center">
                                    <div className="col-xl-7 col-lg-6 header-top-left">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="my-search-wrap">
                                                    {/* Pincode Search */}
                                                    <div className="my-search">
                                                        <div>
                                                            <input
                                                                type="number"
                                                                name="s"
                                                                placeholder="Enter Delivery Pincode"
                                                                autoComplete="off"
                                                                value={deliveryPincode}
                                                                onChange={handleInputChange}
                                                            />

                                                            {(payload_dtdc_pincode?.zipcode && dtdcLoading) ?
                                                                <div style={{ position: "absolute", top: "4px", right: "0", zIndex: "9" }}>
                                                                    <CircularProgress className='loader_cls' style={{ color: "white" }} />
                                                                </div>

                                                                :
                                                                <button type="button" disabled={(payload_dtdc_pincode?.zipcode && dtdcLoading)} onClick={handleSubmit}>
                                                                    <i className="fa-solid fa-location-dot"></i>
                                                                </button>

                                                            }
                                                        </div>
                                                    </div>
                                                    {!dtdcError && deliveryPincode && payloadData && payloadData?.cod && payloadData?.service && <div className="my-search-dropdown">
                                                        <ul>
                                                            <li>
                                                                <div className="thumb"><img src="/assets/images/delivery-icon1.png" alt="delivery-icon" width={44} height={44} sizes="(min-width: 44px) 50vw, 100vw" /></div>
                                                                <div className="con" dangerouslySetInnerHTML={{ __html: payloadData?.ans }} />
                                                                {/* Congratulations! We are giving full Service <strong className="text-primary">(Delivery, COD</strong> and <strong className="text-primary">Return Pickup)</strong> */}
                                                            </li>
                                                            <li>
                                                                <div className="thumb"><img src="/assets/images/delivery-icon2.png" alt="delivery-icon" width={44} height={44} sizes="(min-width: 44px) 50vw, 100vw" /></div>
                                                                <div className="con">{payloadData?.estimatedTimeText}</div>
                                                            </li>
                                                        </ul>
                                                    </div>}
                                                    {
                                                        deliveryPincode && errorPin && <div className="my-search-dropdown">
                                                            <ul>
                                                                <li className='flex iitems-center' >
                                                                    <div className="thumb m-0 bg-transparent">
                                                                        {/* <img src="/assets/images/delivery-icon2.png" alt="delivery-icon" width={44} height={44} /> */}
                                                                        <CancelOutlinedIcon style={{ color: "red" }} />
                                                                    </div>
                                                                    <div className="con">{dtdcError?.response?.data?.massage}</div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            {/* Products Search */}
                                            <div className="col-6">
                                                <div className="my-search" onClick={handleClickInsideSearch}>
                                                    <div className='relative'>
                                                        <input
                                                            type="search"
                                                            name="search"
                                                            placeholder="Search Product By Keyword"
                                                            value={productSearch} autoComplete='off'
                                                            onKeyDown={handleKeyDown}
                                                            onChange={(e: any) => { setProductSearch(e.target.value); relevantSearch(e.target.value) }}
                                                        />
                                                        <button type="submit"
                                                            onClick={handleProductSearch}
                                                        >
                                                            <i className="fa-solid fa-magnifying-glass"></i>
                                                        </button>
                                                    </div>
                                                    {relevantSearchDataOpen ?
                                                        <div className='related-search'>
                                                            {relevantSearchData?.map((v: any, i: number) =>
                                                                <span
                                                                    key={i}
                                                                    onClick={() => handleProductSearchRelevant(v?.name)}
                                                                >
                                                                    {v?.name}
                                                                </span>)
                                                            }
                                                        </div>
                                                        :
                                                        null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-auto header-top-right d-lg-block d-none">
                                        <div className="header-top-link">
                                            <ul>

                                                <li className='my-support-wrap'>
                                                    <Link href="javascript:void(0);">
                                                        {/* <i className="icon-support" style={{ background: "URL(/assets/images/support-icon.png) center center no-repeat" }}></i>  */}
                                                        <i className="fa fa-comments icon-support" aria-hidden="true"></i>
                                                        <span>Support</span></Link>
                                                    <div className="my-search-dropdown support shadow">
                                                        <ul>
                                                            {/* <div className="media address-box">
                                                            <div className="thumb"><img src="/assets/images/phone.png" alt="phone" width={20} height={20} /></div>
                                                            <div className="media-body">
                                                                <p>+91 9147182149</p>
                                                            </div>
                                                        </div> */}

                                                            {
                                                                getReadTheamOptions?.support_days ?
                                                                    <div className="flex w-full justify-center items-center gap-2 mt-2">
                                                                        <Image src={supcal} alt="phone" width={20} height={20} />
                                                                        <span className='support-wrap-txt'>
                                                                            {getReadTheamOptions?.support_days},&nbsp;{getReadTheamOptions?.support_time_start}&nbsp;-&nbsp;{getReadTheamOptions?.support_time_end}
                                                                        </span>
                                                                    </div>
                                                                    : null
                                                            }

                                                            {getReadTheamOptions?.support_phone ?
                                                                <div className="flex justify-center items-center gap-3 w-full mt-2">
                                                                    <div className="sup-rp">
                                                                        <li className='iflex iitems-center gap-2'>
                                                                            <span className='phone-thum m-0 text-center'>
                                                                                <Image src="/assets/images/phone.png" alt="phone" width={14} height={14} />
                                                                            </span>
                                                                            <span className='sup-rp-txt'>
                                                                                <SupportNumber phone phoneNumber={getReadTheamOptions?.support_phone}>
                                                                                    {getReadTheamOptions?.support_phone}
                                                                                </SupportNumber>
                                                                            </span>
                                                                        </li>
                                                                    </div>

                                                                    <div className="sup-rp">
                                                                        <li className='iflex iitems-center gap-2'>
                                                                            <span className='phone-thum m-0 ps-1.5'>
                                                                                <Image src={supwhat} alt="phone" width={16} height={16} />
                                                                            </span>
                                                                            <span className='sup-rp-txt'>
                                                                                <SupportNumber phoneNumber={getReadTheamOptions?.support_whatsapp}>{getReadTheamOptions?.support_whatsapp}</SupportNumber>
                                                                            </span>
                                                                        </li>
                                                                    </div>
                                                                </div>
                                                                :
                                                                null
                                                            }


                                                            <div className="support-wrap2 mt-3">
                                                                <Image src={supmail} alt="phone" width={20} height={20} />
                                                                {/* <span>
                                                                    </span> */}
                                                                <span className='support-wrap2-txt'>
                                                                    <Link href={`mailto:${getReadTheamOptions?.support_email}`}>{getReadTheamOptions?.support_email}</Link>
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-center items-center w-full my-2">
                                                                <div className='ms-3'>
                                                                    <Link href={`https://api.whatsapp.com/send?phone=${getReadTheamOptions?.support_phone}&text=Hi`} target="_blank" className='color-5a5a5a'>
                                                                        Chat With Us
                                                                    </Link>
                                                                    <span className='ms-3'>|</span></div>
                                                                <div className='ms-3'>
                                                                    <Link href={`/terms-of-use`} className='color-5a5a5a' >
                                                                        Terms Of Use
                                                                    </Link>
                                                                    <span className='ms-3'>|</span>
                                                                </div>
                                                                <div className='ms-3'>
                                                                    <Link href={`https://www.dtdc.in/trace.asp`} target="_blank" className='color-5a5a5a'>
                                                                        Track Order
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </ul>
                                                    </div>
                                                </li>

                                                {/* <li><Link href="javascript:void(0);"><i className="icon-support"></i> <span>Support</span></Link></li> */}
                                                <li>
                                                    <span className="text-white cursor-pointer flex items-center gap-2" onClick={handleOpenAuthModal}>
                                                        {getme?.avatar_url ? (
                                                            <img
                                                                src={getme.avatar_url}
                                                                className="w-5 h-5 rounded-full border border-gray-300 object-cover"
                                                                alt={getme?.first_name || "Profile"}
                                                            />
                                                        ) : (
                                                            <i className="fa-solid fa-user text-gray-500 text-2xl w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full"></i>
                                                        )}

                                                        <span>
                                                            {getme?.role?.label === "guest"
                                                                ? "Login"
                                                                : getme?.first_name
                                                                    ? getme?.first_name.length > 7
                                                                        ? `${getme?.first_name.slice(0, 7)}...`
                                                                        : getme?.first_name
                                                                    : "Login"
                                                            }
                                                        </span>
                                                    </span>
                                                    {/* <span className='text-white cursor-pointer' onClick={handleOpenAuthModal} >
                                                        <i className="fa-solid fa-user"></i>
                                                        <span>{getme?.role?.label === "guest" ? "Login" : getme?.first_name ? getme?.first_name?.length > 7 ? `${getme?.first_name.slice(0, 7)}...` : getme?.first_name : "Login"}</span></span> */}

                                                </li>
                                                <li><Link href={(getme?.id && getme?.role?.label !== "guest") ? `/wishlist` : `#`} onClick={handleOpenAuthModalWishlist}><i className="fa-solid fa-heart"></i> <span>Wishlist</span></Link></li>
                                                <li><Link href={'#'} onClick={() => disableCart ? cartSideBarOpen(0) : cartSideBarOpen(1)} className="cta-cart"><span>Cart</span> <i className="fa-solid fa-cart-shopping"></i><span className="cart-count">{cartCount ? cartCount : 0}</span></Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="header-bottom">
                            <div className="container">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-xl-auto col-lg-12 col-auto">
                                        <div className="logo"><Link href="/">
                                            {getReadTheamOptions?.site_logo ?
                                                <img src={getReadTheamOptions?.site_logo} alt="logo" width={110} height={56} style={{ height: "56px" }} sizes="(min-width: 110px) 50vw, 100vw" />
                                                :
                                                <Skeleton
                                                    variant="rectangular"
                                                    animation='wave'
                                                    // width={"110px"}
                                                    // height={"56px"}
                                                    className='logo-skeliton'
                                                />}
                                        </Link></div>
                                    </div>
                                    <div className="col-auto d-lg-none pe-0">
                                        <div className="header-top-link">
                                            <ul>
                                                {/* <ClickAwayListener onClickAway={() => setShowSupportRes(false)}>
                                                    <li className={`${showSupportRes ? "mobile-support-open" : "mobile-support"}`}>
                                                        <Link href="javascript:void(0);">
                                                            {showSupportRes ?
                                                                <div className="flex w-full overflow-auto">
                                                                    <ul>
                                                                        <div className="support-wrap pt-3">
                                                                            <li>
                                                                                <span style={{ marginRight: "4px" }}>
                                                                                    <img src={supcal} alt="phone" width={20} height={20} />
                                                                                </span>
                                                                                <span className='support-wrap-txt'>{getReadTheamOptions?.support_days},&nbsp;{getReadTheamOptions?.support_time_start}&nbsp;-&nbsp;{getReadTheamOptions?.support_time_end}</span></li>
                                                                        </div>

                                                                        <div className="support-wrap1 mt-2">
                                                                            <div className="sup-rp">
                                                                                <li className=''><span className='phone-thum'><img src="/assets/images/phone.png" alt="phone" width={14} height={14} quality={100} /></span> <span className='sup-rp-txt'>{getReadTheamOptions?.support_phone}</span></li>
                                                                            </div>
                                                                            <div className="sup-rp">
                                                                                <li className='ms-3'><span className='phone-thum'><img src={supwhat} alt="phone" width={16} height={16} quality={100} /></span> <span className='sup-rp-txt'><WhatsAppLink phoneNumber={getReadTheamOptions?.support_phone}>{getReadTheamOptions?.support_phone}</WhatsAppLink></span></li>
                                                                            </div>
                                                                        </div>


                                                                        <div className="support-wrap2 mt-3">
                                                                            <li><span style={{ marginRight: "4px" }}><img src={supmail} alt="phone" width={18} height={18} quality={100} /></span> <span className='support-wrap2-txt'>{getReadTheamOptions?.support_email}</span> </li>
                                                                        </div>
                                                                        <div className="support-wrap3 pb-3">
                                                                            <li >Chat With Us  <span className='ms-3'>|</span>   </li>
                                                                            <li className='ms-3'> Terms Of Use   <span className='ms-3'>|</span></li>
                                                                            <li className='ms-3'> Track Order</li>
                                                                        </div>
                                                                    </ul>
                                                                </div>
                                                                :
                                                                <i onClick={() => setShowSupportRes(true)}  className="fa fa-comments icon-support" aria-hidden="true"></i>
                                                            }
                                                        </Link>
                                                    </li>
                                                </ClickAwayListener> */}
                                                <li>
                                                    <p onClick={() => {
                                                        setShowSupportRes(!showSupportRes)
                                                    }}>
                                                        <i className="fa fa-comments icon-support color-e4509d" aria-hidden="true"></i>
                                                        <span>Support</span>
                                                    </p>
                                                </li>
                                                {showSupportRes &&
                                                    <div className=''>
                                                        <div className="flex w-[50%] h-[200px] bg-[#fbf2f4] overflow-auto  mobile-support-open">
                                                            <ul>
                                                                {
                                                                    getReadTheamOptions?.support_days ?
                                                                        <div className="support-wrap pt-3 flex justify-center w-full items-center gap-2">
                                                                            <Image src={supcal} className="w-16px" alt="phone" width={20} height={20} />
                                                                            {/* <span style={{ marginRight: "4px" }}>
                                                                                </span> */}
                                                                            <span className='support-wrap-txt'>
                                                                                {getReadTheamOptions?.support_days},&nbsp;{getReadTheamOptions?.support_time_start}&nbsp;-&nbsp;{getReadTheamOptions?.support_time_end}
                                                                            </span>
                                                                        </div>
                                                                        : null
                                                                }

                                                                {getReadTheamOptions?.support_phone ?
                                                                    <div className="mobView support-wrap1 mt-2 mb-3 iw-full iflex ijustify-center">
                                                                        <div className="sup-rp">
                                                                            <li className='!flex items-center'>
                                                                                <span className='phone-thum'>
                                                                                    <Image src="/assets/images/phone.png" alt="phone" width={14} height={14} />
                                                                                </span>
                                                                                <span className='sup-rp-txt'>{getReadTheamOptions?.support_phone}</span>
                                                                            </li>
                                                                        </div>
                                                                        <div className="sup-rp">
                                                                            <li className='ms-3 !flex items-center'>
                                                                                <span className='phone-thum'>
                                                                                    <Image src={supwhat} alt="phone" className="w-16px" width={16} height={16} sizes="(min-width: 16px) 50vw, 100vw" /></span> <span className='sup-rp-txt'>
                                                                                    <WhatsAppLink phoneNumber={getReadTheamOptions?.support_phone}>{getReadTheamOptions?.support_phone}</WhatsAppLink>
                                                                                </span></li>
                                                                        </div>
                                                                    </div> : null}


                                                                <div className="bg-[#d9438e] w-full flex items-center justify-center gap-2 p-1 ">
                                                                    <Image src={supmail} alt="phone" className="w-16px" width={18} height={18} />
                                                                    {/* <span style={{ marginRight: "4px" }}>
                                                                        </span> */}
                                                                    <Link href={`mailto:${getReadTheamOptions?.support_email}`} className='text-white text-[15px] hover:text-white'>
                                                                        {getReadTheamOptions?.support_email}
                                                                    </Link>
                                                                </div>
                                                                <div className="flex justify-center w-full items-center mt-2">
                                                                    <div className='ms-1'>
                                                                        <Link href={`https://api.whatsapp.com/send?phone=${getReadTheamOptions?.support_phone}&text=Hi`} target="_blank" className='color-5a5a5a'>
                                                                            Chat With Us
                                                                        </Link>
                                                                        <span className='ms-1'>|</span>
                                                                    </div>
                                                                    <div className='ms-1'>
                                                                        <Link href={`/terms-of-use`} className='color-5a5a5a'>
                                                                            Terms Of Use
                                                                        </Link>
                                                                        <span className='ms-1'>|</span>
                                                                    </div>
                                                                    <div className='ms-1'>
                                                                        <Link href={`https://www.dtdc.in/tracking.asp`} target="_blank" className='color-5a5a5a'>
                                                                            Track Order
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                }
                                                <li className='ml-10px' style={{ marginLeft: "10px" }}>
                                                    <div onClick={handleOpenAuthModal} ><i className="fa-solid fa-user color-e4509d"></i> <span>{getme?.role?.label === "guest" ? "Login" : getme?.first_name ? getme?.first_name?.length > 7 ? `${getme?.first_name.slice(0, 7)}...` : getme?.first_name : "Login"}</span></div>
                                                </li>
                                                <li>
                                                    <Link href={(getme?.id && getme?.role?.label !== "guest") ? `/wishlist` : `#`} onClick={handleOpenAuthModalWishlist}><i className="fa-solid fa-heart color-e4509d"></i>
                                                        <span>Wishlist</span>
                                                    </Link></li>
                                                <li>
                                                    <Link href="javascript:void(0);" onClick={() => disableCart ? cartSideBarOpen(0) : cartSideBarOpen(1)} className="cta-cart"><span>Cart</span> <i className="fa-solid fa-cart-shopping color-e4509d"></i><span className="cart-count">{cartCount ? cartCount : 0}</span></Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg">
                                        <div id="MainMenu" className="top-menu">
                                            <div className="menu-logo d-lg-none"><Link href="/">
                                                {getReadTheamOptions?.site_logo ?
                                                    <img src={getReadTheamOptions?.site_logo} alt="logo" width={150} height={76} style={{ height: "56px" }} sizes="(min-width: 150px) 50vw, 100vw" />
                                                    :
                                                    <Skeleton
                                                        variant="rectangular"
                                                        animation='wave'
                                                        // width={"110px"}
                                                        // height={"56px"}
                                                        className='logo-skeliton'
                                                    />}
                                            </Link></div>
                                            {/* <div id="NavMenu">
                                                <nav>
                                                    <ul>
                                                        {menueArr?.["1"]?.menus?.length ? menueArr?.["1"]?.menus.map((v: any, i: number) =>
                                                            <li key={i}
                                                                onMouseEnter={() => { v?.menu_item_type === "pages" ? doOnMouseEnter(v?.menu_item_id?.title) : doOnMouseEnter(v?.menu_item_id?.name); (v?.menu_item_id?.id === "1" || v?.menu_item_id?.id === "3" || v?.menu_item_id?.id === "4" || v?.menu_item_id?.id === "5" || v?.menu_item_id?.id === "6" || v?.menu_item_id?.id === "7" || v?.menu_item_id?.id === "14") && doOpenMegaMenu("") }}
                                                                onMouseLeave={(event: any) => v?.menu_item_type === "pages" ? doOnMouseLeave(event, v?.menu_item_id?.title) : doOnMouseLeave(event, v?.menu_item_id?.name)}
                                                                onClick={() => {
                                                                    if (v?.menu_item_type === "pages") {
                                                                        doOnClick(v?.menu_item_id?.title)
                                                                    } else {
                                                                        doOnClick(v?.menu_item_id?.name); doOpenMegaMenu(""); setDropEnter(false)
                                                                    }
                                                                    if (v?.menu_item_type === "productCategory") {
                                                                        router.push(`/shop/${v?.menu_item_id.slug}`)
                                                                    }
                                                                    if (v?.menu_item_id?.title === "Brand") {
                                                                        setDropEnter(false)
                                                                    } else if (v?.menu_item_id?.name === "SHOP BY BREED") {
                                                                        null
                                                                    } else {
                                                                        dispatch(setLinkName(v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name))
                                                                    }
                                                                }}
                                                            >
                                                                {v?.menu_item_type === "pages" ?
                                                                    (v?.menu_item_id?.title === "Home" ?
                                                                        <Link href={'/'}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>
                                                                        : v?.menu_item_id?.title === "Offer" ?
                                                                            <Link href={`/${v?.menu_item_id?.slug}`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>
                                                                            :
                                                                            <Link href={`/${v?.menu_item_id?.slug}`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>)
                                                                    :
                                                                    (v?.menu_item_id?.name === "DOGS" ?
                                                                        <Link href={`/shop/${v?.menu_item_id?.slug}`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>
                                                                        :
                                                                        v?.menu_item_id?.name === "CATS" ? <Link href={`/shop/${v?.menu_item_id?.slug}`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>
                                                                            :
                                                                            v?.menu_item_id?.name === "SMALL ANIMALS" ?
                                                                                <Link href={`/shop/${v?.menu_item_id?.slug}`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>
                                                                                :
                                                                                v?.menu_item_id?.name === "Blog" ?
                                                                                    <Link href={`${v?.menu_item_id?.link}`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>
                                                                                    : <Link href={`#`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>)
                                                                }
                                                                
                                                            </li>
                                                        ) :
                                                            <Skeleton
                                                                variant="rectangular"
                                                                animation='wave'
                                                                // width={"100%"}
                                                                // height={"25px"}
                                                                className='skeliton-2nd'
                                                            />
                                                        }
                                                    </ul>
                                                </nav>
                                            </div> */}
                                            {/* <ul>
                                                        <li>
                                                            <Link href={'/'}>Home</Link>
                                                            <Link href={'/shop/dogs'}>Dogs</Link>
                                                        </li>
                                                        
                                                        
                                                    </ul> */}
                                            <div id="NavMenu">
                                                <nav>
                                                    <ul>
                                                        {menueArr?.["1"]?.menus?.length ? menueArr?.["1"]?.menus.map((v: any, i: number) =>
                                                            <li key={i}
                                                                onMouseEnter={() => { v?.menu_item_type === "pages" ? doOnMouseEnter(v?.menu_item_id?.title) : doOnMouseEnter(v?.menu_item_id?.name); (v?.menu_item_id?.id === "1" || v?.menu_item_id?.id === "3" || v?.menu_item_id?.id === "4" || v?.menu_item_id?.id === "5" || v?.menu_item_id?.id === "6" || v?.menu_item_id?.id === "7" || v?.menu_item_id?.id === "14") && doOpenMegaMenu("") }}
                                                                onMouseLeave={(event: any) => v?.menu_item_type === "pages" ? doOnMouseLeave(event, v?.menu_item_id?.title) : doOnMouseLeave(event, v?.menu_item_id?.name)}
                                                                onClick={() => {
                                                                    if (v?.menu_item_type === "pages") {
                                                                        doOnClick(v?.menu_item_id?.title)
                                                                    } else {
                                                                        doOnClick(v?.menu_item_id?.name); doOpenMegaMenu(""); setDropEnter(false)
                                                                    }
                                                                    if (v?.menu_item_type === "productCategory") {
                                                                        router.push(`/shop/${v?.menu_item_id.slug}`)
                                                                    }
                                                                    if (v?.menu_item_id?.title === "Brand") {
                                                                        setDropEnter(false)
                                                                    } else if (v?.menu_item_id?.name === "SHOP BY BREED") {
                                                                        null
                                                                    } else {
                                                                        dispatch(setLinkName(v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name))
                                                                    }
                                                                }}
                                                            >
                                                                {v?.menu_item_type === "pages" ?
                                                                    (v?.menu_item_id?.title === "Home" ?
                                                                        <Link href={'/'}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>
                                                                        : v?.menu_item_id?.title === "Offer" ?
                                                                            <Link href={`/${v?.menu_item_id?.slug}`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>
                                                                            :
                                                                            <Link href={`/${v?.menu_item_id?.slug}`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>)
                                                                    :
                                                                    (v?.menu_item_id?.name === "DOGS" ?
                                                                        <Link href={`/shop/${v?.menu_item_id?.slug}`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>
                                                                        :
                                                                        v?.menu_item_id?.name === "CATS" ? <Link href={`/shop/${v?.menu_item_id?.slug}`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>
                                                                            :
                                                                            v?.menu_item_id?.name === "SMALL ANIMALS" ?
                                                                                <Link href={`/shop/${v?.menu_item_id?.slug}`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>
                                                                                :
                                                                                v?.menu_item_id?.name === "Blog" ?
                                                                                    <Link href={`${v?.menu_item_id?.link}`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>
                                                                                    : <Link href={`#`}>{v?.menu_item_type === "pages" ? v?.menu_item_id?.title : v?.menu_item_id?.name}</Link>)
                                                                }

                                                            </li>
                                                        ) :
                                                            <Skeleton
                                                                variant="rectangular"
                                                                animation='wave'
                                                                // width={"100%"}
                                                                // height={"25px"}
                                                                className='skeliton-2nd'
                                                            />
                                                        }
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div onMouseEnter={() => setDropEnter(true)} onMouseLeave={() => setDropEnter(true)} className={`${dropEnter ? 'megaMeanu_root' : 'megaMeanu_root_close'}`}> */}
                        {/* <div onMouseEnter={() => setDropEnter(true)} onMouseLeave={() => setDropEnter(false)}> */}
                        {/* <div onMouseLeave={() => { setDropEnter(false); doOpenMegaMenu("") }}> */}
                        <div>
                            {dropEnter && dropType === "dog" ? <MegaMenu2 menueCloseMouseLeave={() => { setDropEnter(false); doOpenMegaMenu("") }} megaMenuClose={() => { setDropEnter(false); setDropType("") }} menueArr={menueArr?.["1"]?.menus?.length ? menueArr?.["1"]?.menus : []} /> : null}
                            {dropEnter && dropType === "cat" ? <MegaMenu2 menueCloseMouseLeave={() => { setDropEnter(false); doOpenMegaMenu("") }} megaMenuClose={() => { setDropEnter(false); setDropType("") }} menueArr={menueArr?.["1"]?.menus?.length ? menueArr?.["1"]?.menus : []} /> : null}
                            {dropEnter && dropType === "smAnimal" ?
                                <div className="container">
                                    <div className="mega-menu-card" onMouseLeave={() => { setDropEnter(false); doOpenMegaMenu("") }}>
                                        <div className="mega-menu-section-txt">
                                            <ul className='ps-2'>
                                                {menuLoopType[0]?.length ? menuLoopType[0]?.map((v: any, i: number) =>
                                                    <li key={i} onClick={() => { setDropEnter(false); setDropType(""); dispatch(setLinkName(v?.name)) }}>
                                                        <Link href={`/product_category/${v?.slug_url}`}><h5 className='uppercase'>{v?.name}</h5></Link>
                                                    </li>) : null}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                : null}
                            {dropEnter && dropType === "brand" ? <MegaMenuTest menueCloseMouseLeave={() => { setDropEnter(false); doOpenMegaMenu("") }} megaMenuClose={() => { setDropEnter(false); setDropType("") }} menueArr={menueArr?.["1"]?.menus?.length ? menueArr?.["1"]?.menus : []} /> : null}
                            {dropEnter && dropType === "sbb" ? <MegaMenu1 menueCloseMouseLeave={() => { setDropEnter(false); doOpenMegaMenu("") }} megaMenuClose={() => { setDropEnter(false); setDropType("") }} menueArr={menueArr?.["1"]?.menus?.length ? menueArr?.["1"]?.menus : []} /> : null}

                        </div>
                    </header>
                </div >}
            {/* header end */}
            {children}
            {/* footer start */}
            {
                router.pathname === "/thankyou" || router.pathname === "/store-locator-mobile" ? null :
                    <>
                        <div className="service-sec mt-5">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-3 col-sm-6 col-6 item">
                                        <div className="media">
                                            <div className="thumb"><img src="/assets/images/Free-Shipping.png" alt="Shipping" width={40} height={40} sizes="(min-width: 40px) 50vw, 100vw" /></div>
                                            <div className="media-body">
                                                <h5>Free Shipping</h5>
                                                <p className="m-0">Min Order value Rs. 500</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-sm-6 col-6 item">
                                        <div className="media">
                                            <div className="thumb"><img src="/assets/images/Free-Returns.png" alt="Returns" width={40} height={40} sizes="(min-width: 40px) 50vw, 100vw" /></div>
                                            <div className="media-body">
                                                <h5>Free Returns</h5>
                                                <p className="m-0">Within 7 days (T&Cs Apply)</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6 col-6 item">
                                        <div className="media">
                                            <div className="thumb"><img src="/assets/images/Best-Deals.png" alt="Deals" width={40} height={40} sizes="(min-width: 40px) 50vw, 100vw" /></div>
                                            <div className="media-body">
                                                <h5>Best Deals</h5>
                                                <p className="m-0">On Pet Products</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6 col-6 item">
                                        <div className="media">
                                            <div className="thumb"><img src="/assets/images/We-Support.png" alt="Support" width={40} height={40} sizes="(min-width: 40px) 50vw, 100vw" /></div>
                                            <div className="media-body">
                                                <h5>We Support</h5>
                                                <p className="m-0">7days, 9am to 9pm</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="online-shopping-sec">
                            <div className="container">
                                <h5>{menueArr?.["2"]?.name}</h5>
                                <nav className="online-shopping-link">
                                    {menueArr?.["2"]?.menus?.length ? <ul>
                                        {menueArr?.["2"]?.menus?.map((v: any, i: number) =>
                                            <li key={i}>
                                                <Link href={v?.menu_item_type === "pages" ? v?.menu_item_id?.attributes_type ? `/shop/${v?.menu_item_id?.slug}?type=attribute` : `/${v?.menu_item_id?.slug}` : v?.menu_item_type === "customMenu" ? `${v?.menu_item_id?.link}` : `/shop/${v?.menu_item_id?.slug}`}>
                                                    {capitalize(v?.menu_item_id?.title || v?.menu_item_id?.name)}
                                                    {/* {capitalize()} */}
                                                </Link>
                                            </li>)}
                                    </ul> : <Skeleton
                                        variant="rectangular"
                                        animation='wave'
                                        // width={"100%"}
                                        // height={"2rem"}
                                        className='skeliton-3rd'
                                    />}
                                </nav>
                            </div>
                        </div>
                        <footer className="footer" >
                            <div className="footer-widget-area container mb-3">
                                <div className="row justify-content-between">
                                    <div className="col-xxl-3 col-lg-auto col-6 widget">
                                        <h2 className="widget-title">{menueArr?.["3"]?.name}</h2>
                                        {menueArr?.["3"]?.menus?.length ?
                                            <ul>
                                                {menueArr?.["3"]?.menus?.map((v: any, i: number) =>
                                                    <li key={i}>
                                                        <Link
                                                            href={v?.menu_item_id?.link ? v?.menu_item_id?.link : `/${v?.menu_item_id?.slug}`}
                                                        >
                                                            {capitalize(v?.menu_item_id?.title || v?.menu_item_id?.name)}
                                                        </Link>
                                                    </li>
                                                )}
                                            </ul>
                                            :
                                            <Skeleton
                                                variant="rectangular"
                                                // animation='wave'
                                                // width={"10rem"}
                                                // height={"90%"}
                                                className='w-10rem height-90'
                                            />}
                                    </div>
                                    <div className="col-xxl-2 col-lg-auto col-6 widget">
                                        <h2 className="widget-title">{menueArr?.["4"]?.name}</h2>
                                        {menueArr?.["4"]?.menus?.length ? <ul>
                                            {menueArr?.["4"]?.menus?.map((v: any, i: number) =>
                                                <li key={i}><Link

                                                    // onClick={() => {

                                                    //     v?.menu_item_id?.link === "#go_cart" ? dispatch(setOpenCart(true)) : null
                                                    // }}

                                                    onClick={() => {
                                                        if (v?.menu_item_id?.link === "/myaccount") {
                                                            handleOpenAuthModalMyAccount();
                                                        } else if (v?.menu_item_id?.link === "#go_cart") {
                                                            dispatch(setOpenCart(true));
                                                        }
                                                    }}
                                                    href={
                                                        v?.menu_item_id?.link === "/myaccount"
                                                            ? getme?.id && getme?.role?.label !== "guest"
                                                                ? "/myaccount"
                                                                : "#"
                                                            : v?.menu_item_id?.link === "#go_cart"
                                                                ? "#"
                                                                : v?.menu_item_id?.link
                                                                    ? v?.menu_item_id?.link
                                                                    : v?.menu_item_id?.slug === "home"
                                                                        ? "/"
                                                                        : `/${v?.menu_item_id?.slug}`
                                                    }

                                                // href={v?.menu_item_id?.link === "#go_cart" ? "#"
                                                //     : v?.menu_item_id?.link ?
                                                //         v?.menu_item_id?.link : v?.menu_item_id?.slug === "home" ? "/" : `/${v?.menu_item_id?.slug}`}

                                                >{capitalize(v?.menu_item_id?.title || v?.menu_item_id?.name)}</Link>
                                                </li>
                                            )}
                                        </ul> :
                                            <Skeleton
                                                variant="rectangular"
                                                // animation='wave'
                                                // width={"10rem"}
                                                // height={"90%"}
                                                className='w-10rem height-90'
                                            />}
                                    </div>

                                    <div className="col-xxl-3 col-lg-4 widget">
                                        <h2 className="widget-title mt-2 mt-lg-0">Head Office Address</h2>
                                        <div className="media address-box">
                                            <div className="thumb">
                                                <img
                                                    src="/assets/images/location.png"
                                                    alt="location"
                                                    // style={mobView ? { width: "10px" } : { width: "16px" }}
                                                    className={`${mobView ? `w-10px` : `w-16px`}`}
                                                    width={mobView ? 12 : 16}
                                                    height={mobView ? 12 : 20}
                                                    sizes={`(min-width: ${mobView ? "12px" : "16px"}) 50vw, 100vw`}
                                                />
                                            </div>
                                            <div className="media-body">
                                                {/* <p>Main Office Address:<br />{getReadTheamOptions?.office_address}</p> */}
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getReadTheamOptions?.office_address || '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {getReadTheamOptions?.office_address}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="media address-box items-center">
                                            <div className="thumb">
                                                <img
                                                    src="/assets/images/phone.png"
                                                    alt="phone"
                                                    style={mobView ? { width: "12px" } : { width: "20px" }}
                                                    width={mobView ? 12 : 20}
                                                    height={mobView ? 12 : 20}
                                                    sizes={`(min-width: ${mobView ? "12px" : "20px"}) 50vw, 100vw`}
                                                />
                                            </div>
                                            <div className="media-body">
                                                <p className='mb-0'><Link href={`tel:${getReadTheamOptions?.office_phone}`} className='font-size-105pe'>{getReadTheamOptions?.office_phone}</Link></p>
                                            </div>
                                        </div>
                                        <div className="media address-box items-center">
                                            <div className="thumb">
                                                <img
                                                    src="/assets/images/envlop.png"
                                                    alt="envlop"
                                                    style={mobView ? { width: "14px" } : { width: "20px" }}
                                                    width={mobView ? 13 : 20}
                                                    height={mobView ? 13 : 20}
                                                    sizes={`(min-width: ${mobView ? "13px" : "20px"}) 50vw, 100vw`}
                                                />
                                            </div>
                                            <div className="media-body">
                                                <p className='mb-0'><Link href={`mailto:${getReadTheamOptions?.office_emial}`} className='font-size-105pe'>{getReadTheamOptions?.office_emial}</Link></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 widget">
                                        <h2 className="widget-title">Leave Your E-Mail And Get Offers</h2>
                                        <div className="sign-form-wrap">
                                            <div>
                                                <input className="input-text form-control" type="email" placeholder="Your Email" value={leaveEmail?.email || ""} onChange={(e) => { setLeaveEmail({ email: e.target.value }); setHomeLeaveError("") }} />
                                                {homeLeveError && <span className='error'>{homeLeveError}</span>}
                                                <button className={`btn ${changeSendIcon ? `bg-ffffff` : `bg-e4509d`} padding-0-10`} type="submit" onMouseEnter={() => stChangeSendIcon(true)} onMouseLeave={() => stChangeSendIcon(false)} onClick={() => doSendEmail()}>
                                                    <Image src={changeSendIcon ? send_icon_pink : send_icon} alt='send-icon' width={30} height={30} sizes="(min-width: 30px) 50vw, 100vw" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className='pets'>Pets are at the heart of everything we do here, they make our lives whole. With each collection, we do our best to honour them. Subscribe to our Newsletter and receive special promotions and insider information about upcoming collections.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="footer-bottom">
                                <div className="container">
                                    <nav className="searches-menu">
                                        <ul>
                                            <li><label> Popular Searches:</label></li>
                                            {/* <li><label> Popular Searches:</label></li>  */}
                                            {
                                                (getPopulerSeratch && getPopulerSeratch?.length) ? getPopulerSeratch.map((v: any, i: any) => {
                                                    return (
                                                        <li key={i}><Link key={i + 11} href={`/shop/${lowerCase(v?.searchterm)}?type=search`}>{v?.searchterm}</Link></li>
                                                    )
                                                }) : null
                                            }
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </footer>

                        <div className="footer-copyright">
                            <div className="container">
                                <div className="row fle">
                                    <div className="col-auto order-md-1">
                                        <ul className="footer-social">
                                            <li><Link target="_blank" href="https://www.facebook.com/pinkpawskolkata?mibextid=ZbWKwL"><i className="fa-brands fa-facebook-f"></i></Link></li>
                                            <li><Link target="_blank" href="https://instagram.com/pinkpaws_petshop?igshid=MzRlODBiNWFlZA=="><i className="fa-brands fa-instagram"></i></Link></li>
                                            <li><Link target="_blank" href="https://www.linkedin.com/company/pink-paws-petshop/"><i className="fa-brands fa-linkedin-in"></i></Link></li>
                                            <li><Link target="_blank" href="javascript:void(0);"><i className="fa-brands fa-x-twitter"></i></Link></li>
                                            <li><Link target="_blank" href="https://www.pinterest.com/pink_paws_/"><i className="fa-brands fa-pinterest-p"></i></Link></li>
                                        </ul>
                                    </div>
                                    <div className="col-auto ft">
                                        <p className="m-0">© {getReadTheamOptions?.site_name} ®. All Rights Reserved {moment().format("YYYY")}.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
            {/* footer end */}

            <Cart sideBarOpen={sideBarOpen} sideBarOpenForDiscount={sideBarOpenForDiscount} onSideBarClose={(value: boolean) => setSideBarOpen(value)} />
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

            {router.pathname === "/thankyou" || router.pathname === "/store-locator-mobile" ? null : (
                <div className="block lg:hidden md:block">
                    <div className={`top-menu ${menueResOpen ? "top-menu open" : ""} overflowY-auto`}>
                        {menueResOpen ? <div className="menu-logo">
                            <Link href="/">
                                <img src={getReadTheamOptions?.site_logo} alt="logo" width={110} height={56} style={{ height: "56px" }} sizes="(min-width: 110px) 50vw, 100vw" />
                            </Link>
                        </div> : null}
                        <div id="NavMenu">
                            <nav>
                                <ul>
                                    <Navs />
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

        </>

    )
}

// export const Testlayout = ({data}: any) => {
//     console.log(data, "__data__")
// }

// export const getServerSideProps = async (context: any) => {
//     const {get_menu_types} = getUrlWithKey("client_apis");

//     let menuArr = null;
//     let compo = null;
//     let notFound = false;

//     // const data = {
//     //     title: 'My Page Title',
//     //     description: 'Description of my page',
//     //     imageUrl: 'https://example.com/image.jpg'
//     // };

//     try {
//         const {data}: any = await axios.put(get_menu_types, {code: [1, 2, 3, 4] });

//         if (data?.success && !isEmptyObject(data?.data)) {
//             if (data?.data?._not_page) {
//                 notFound = true;
//             } else {
//                 menuArr = data?.data;
//                 if (data?.data?._redirect) {
//                     context.res.writeHead(302, {Location: data?.data?._redirect });
//                     context.res.end();
//                     return {props: { } };
//                 } else if (!data?.data?._redirect && data?.data?.component && data?.data?.template_system) {
//                     compo = data?.data?.component;
//                 }
//             }
//         } else {
//             notFound = true;
//         }

//         // if (data?.success) {
//         //     menuArr = data?.data || [];
//         // } else {
//         //     notFound = true;
//         // }
//         console.log(data, "__data");
//     } catch (error) {
//         console.error('Error Fetching Data:', error);
//         notFound = true;
//     }

//     return {
//         props: {
//             // data
//             menuArrData: notFound ? [] : menuArr,
//             notFound,
//         },
//     };
// };

export default Layout