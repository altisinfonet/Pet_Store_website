import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import cart1 from "../../../../public/assets/icon/product-1.jpg"
import tri from "../../../../public/assets/icon/Triangle-grey.png"
import tri1 from "../../../../public/assets/icon/Triangle-wh.png"
import grid from "../../../../public/assets/icon/grid-view.png"
import list from "../../../../public/assets/icon/list-view.png"
import { Accordion, AccordionSummary, ClickAwayListener, Drawer, Rating, Skeleton, Slider as PriceSlider, Stack, Dialog } from '@mui/material';
import getUrlWithKey from '../../../util/_apiUrl';
import { useCreate, useRead } from '../../../hooks';
import brandDam from "../../../../public/assets/images/brandDam.png"
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { _ERROR, _SUCCESS, _WARNING } from '../../../util/_reactToast';
import { useDispatch } from 'react-redux';
import { setOpenCart } from '../../../reducer/openCartReducer';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Triangle_pink from "../../../../public/assets/icon/Triangle-pink.png"
import { capitalize } from '../../../util/_common';
import { setOpenAuth } from '../../../reducer/openAuthReducer';
import useTabView from '../../../hooks/useTabView';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import Slider from 'react-slick';
import emptyBox from '../../../../public/assets/images/emptyBox.png'
import useIsLogedin from '../../../hooks/useIsLogedin';
import Notifyimg from "../../../../public/assets/images/notifyimg.png"
// import Image from 'next/image'

import defaultImage from "../../../assets/images/brandDam.png"

const ProductListing = ({
    products,
    productsLoading,
    newProductListHide,
    productsAll,
    perPageList,
    dataPerPage,
    setDataPerPage,
    setSortby,
    sortby,
    pageCount,
    linkname,
    linkId,
    handleFilter,
    handleChangePrice,
    price,
    setPriceStack,
    doFilter,
    category,
    attributes,
    showSide,
    showTop,
    sortItemList,
    productsRaw,
    more,
    productsByFilters,
    search
}: any) => {

    const { isLoged, logedData } = useIsLogedin();
    const router = useRouter()
    const dispatch = useDispatch()
    const { tabView, mobView } = useTabView()
    const listingType = useSelector((state: any) => state?.listingTypeReducer?.value)
    const { create_cart, cart_item_count, get_arrival, product_list, get_product_brand_list, create_wish_list, create_notify_me } = getUrlWithKey("client_apis")
    var currencyFormatter = require('currency-formatter');

    const getme = useSelector((state: any) => state?.meReducer?.value);
    const openAuth = useSelector((state: any) => state?.openAuthReducer?.value);

    const [createCartUrl, setCreateCartUrl]: any = useState()
    const [createCartBody, setCreateCartBody]: any = useState({})
    const [openPerPage, setOpenPerPage]: any = useState<boolean>(false)
    const [openSortItem, setOpenSortItem]: any = useState<boolean>(false)
    const [brandMeta, setBrandMeta] = useState({ attribute_id: 1 })
    const [wishListMeta, setWishListMetaMeta]: any = useState()
    const [create_wish_list_url, setCreate_wish_list_url]: any = useState()
    const [productDataid, SetProductDataid] = useState<any>("")
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

    const { sendData: brand, loading: loading }: any = useCreate({ url: get_product_brand_list, callData: brandMeta });
    const { sendData: createWishList, loading: createWishListLoading, error: createWishListError }: any = useCreate({ url: create_wish_list_url, callData: wishListMeta });

    console.log(sortItemList, "sortItemList")
    var settings1 = {
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToScroll: 1,
        margin: 30,
        adaptiveHeight: true,
    };

    console.log(products, sortItemList, "productsawdawd")

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
        if (getme?.id && openAuth === false && getme?.role?.label !== "guest") {
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

    var responsivefor6 = [
        {
            breakpoint: 2000,
            settings: {
                slidesToShow: 8,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 4,
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



    //**create cart start */
    const { sendData: createCart, error: cartError }: any = useCreate({ url: createCartUrl, callData: createCartBody });
    // const { sendData: getArrival }: any = useRead({ selectMethod: "get", url: get_arrival });


    const onCreateCart = ({ id, v_id }: any) => {
        if (createCartUrl !== create_cart) {
            setCreateCartUrl(create_cart)
            setCreateCartBody({
                product_id: id,
                variation_id: v_id || null,
                quantity: 1
            })
        }
    }

    const [filter, setFilter] = useState(null);
    const [filterLoader, setFilterLoader] = useState(true);

    const fetchFilterData = async ({ url, callData, selectMethod }: any) => {
        // if (showSide) {
        try {
            if (showSide && url) {
                const { data } = await axios({
                    method: selectMethod,
                    url: url,
                    data: {
                        ...callData,
                        giveFilter: true
                    }
                });
                if (data && data?.success) {
                    setFilter(data?.data);
                    setFilterLoader(false);
                }
            } else {
                setFilter(null)
                setFilterLoader(false);
            }
        } catch (error) {
            console.log(error);
            setFilterLoader(false);
        } finally {
            setFilterLoader(false);
        }
        // }
    }


    useEffect(() => {
        // let fetchFilterData;
        // if (productsByFilters?.url && productsByFilters?.callData && productsByFilters?.callData?.min_price && productsByFilters?.callData?.max_price && productsByFilters?.selectMethod) {
        // const { url, callData, selectMethod } = productsByFilters;
        fetchFilterData(productsByFilters);
        // }
        // if (fetchFilterData) {
        //     fetchFilterData();
        // }


    }, [productsByFilters?.url, productsByFilters?.callData, productsByFilters?.callData?.min_price, productsByFilters?.callData?.max_price, productsByFilters?.selectMethod])

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





    const [changeView, setChangeView] = useState("grid")

    const handleImageLoad = (v: any) => {
    };
    const handleImageError = (v: any) => {
    };
    const [openFilter, setOpenFilter] = useState(false)

    // useEffect(() => {
    //     if(!tabView || !mobView) {   
    //         setOpenFilter(false)
    //     }
    // }, [tabView, mobView])
    useEffect(() => {
        if (filter !== null) {
            if (filter && filter?.selected_filtered_price && filter?.selected_filtered_price?.max_price !== 0) {
                setPriceStack({ minPrice: filter?.selected_filtered_price?.min_price, maxPrice: filter?.selected_filtered_price?.max_price })
            } else {
                setPriceStack({ minPrice: filter?.filter_price?.min_price, maxPrice: filter?.filter_price?.max_price })
            }
        }
    }, [filter])

    const Filters = () => {

        return (
            <>
                {!filterLoader && filter ?
                    <div className='flex flex-col gap-4'>
                        {filter && filter?.categories?.length ?
                            <Accordion className='list-card py-0 m-0' defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<Image src={Triangle_pink} alt='Triangle-pink' />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                    className='acordian_drop_mui p-0'
                                >
                                    <p className='menu-txt font-semibold m-0 uppercase' style={{ fontSize: "85%" }}>Category</p>
                                </AccordionSummary>
                                <div className="accordion-collapse collapse show p-0 pb-4" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div className="accordion-body uppercase">
                                        <FormGroup className='checkList'>
                                            {/* linkId */}
                                            {filter && filter?.categories.map((v: any, i: number) =>
                                                <FormControlLabel
                                                    key={i}
                                                    control={
                                                        <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 16, borderColor: "#acacac", } }} style={{ padding: "6px 9px" }} />
                                                    }
                                                    checked={v?.id === linkId || category?.includes(+v?.id)}
                                                    name="category"
                                                    value={v?.id}
                                                    label={<div dangerouslySetInnerHTML={{ __html: v?.name }} />}
                                                    onChange={(e: any) => handleFilter(e)} />
                                            )}
                                        </FormGroup>
                                    </div>
                                </div>
                            </Accordion> : null}

                        {filter && filter?.attributes?.length ? filter?.attributes.map((v: any, i: number) => {
                            return (
                                v[v?.key]?.length ?
                                    <Accordion key={i} className='list-card py-0 m-0' defaultExpanded>
                                        <AccordionSummary
                                            expandIcon={<Image src={Triangle_pink} alt='Triangle-pink' />}
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                            className='acordian_drop_mui p-0'
                                        >
                                            <p className='menu-txt font-semibold m-0 uppercase' style={{ fontSize: "85%" }}>{v?.key}</p>
                                        </AccordionSummary>
                                        <div className="accordion-collapse collapse show p-0 pb-4" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                            <div className="accordion-body uppercase">
                                                <FormGroup>
                                                    {v[v?.key]?.map((val: any, idx: number) =>
                                                        <FormControlLabel
                                                            key={idx}
                                                            className='align-items-start dddd'
                                                            control={
                                                                <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 16, borderColor: "#acacac" } }} style={{ padding: "6px 9px" }} />
                                                            }
                                                            checked={search === "attribute" ? val?.id === linkId || attributes?.includes(+val?.id) : attributes?.includes(+val?.id)}
                                                            name="attributes"
                                                            value={val?.id}
                                                            label={<div dangerouslySetInnerHTML={{ __html: val?.name }} />}
                                                            onChange={(e: any) => handleFilter(e)}
                                                        />
                                                    )}
                                                </FormGroup>
                                            </div>
                                        </div>
                                    </Accordion> : null)
                        }) : null}


                        {(filter && filter?.filter_price && filter?.filter_price?.max_price !== 0) ?
                            <Accordion className='list-card py-0 m-0' defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<Image src={Triangle_pink} alt='Triangle-pink' />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                    className='acordian_drop_mui p-0'
                                >
                                    <p className='menu-txt font-semibold m-0 uppercase' style={{ fontSize: "85%" }}>Price</p>
                                </AccordionSummary>
                                <div className="accordion-collapse collapse show p-0 pb-4" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <PriceSlider
                                        className='pps-price-slider'
                                        value={price}
                                        onChange={handleChangePrice}
                                        max={filter?.filter_price?.max_price}
                                        min={filter?.filter_price?.min_price}
                                    />
                                    <div className="list-card1-txt">
                                        <p className='list-card1-txt1'>₹{price?.length ? price[0] : null}</p>
                                        <p className='list-card1-txt2'>₹{price?.length ? price[1] : null}</p>
                                    </div>
                                </div>
                                <div className='flex justify-end w-full'>
                                    <button className="btn1 mb-3 px-3 w-fit" style={{ fontSize: "80%" }} onClick={() => doFilter()}>Filter</button>
                                </div>
                            </Accordion> : null}
                    </div>
                    :
                    <Skeleton
                        variant="rounded"
                        // width={"100%"}
                        // height={"80vh"}
                        className='skeliton-5th'
                    />
                }

            </>
        )
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
            if (logedData?.email || logedData?.email) {
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
                    setPhone_no("");
                    SetProductDataid("");
                }
            } catch (error) {
                _ERROR(error?.response?.data?.massage)
                // console.error("Errordddddfg", error?.response?.data?.massage ||"Please check your notifications or try again later.");
            }
        }
    }

    useEffect(() => {
        if (products?.length === 1) {
            router.push(`/product/${products[0]?.slug}`)
        }
    }, [products?.length])

    const BrandSlider = () => {
        return (
            <div className="foodbrands-slider">
                {
                    !loading ?
                        brand?.length ?
                            <Slider
                                autoplaySpeed={3000}
                                className='pps pps-lsting'
                                arrows={mobView ? false : tabView ? false : true}
                                {...settings1}
                                responsive={responsivefor6}
                            >
                                {brand?.map((v: any, i: number) => {
                                    return (
                                        <div className="item" key={i}>
                                            <Link href={`/shop/brand/${v?.slug}`} onClick={() => router.push(`/shop/brand/${v?.slug}`)}>
                                                <div className="thumb flex justify-center items-center">
                                                    <img
                                                        src={v?.productTermImage?.image ? v?.productTermImage?.image : "/assets/images/brandDam.png"}
                                                        alt={v?.name}
                                                        style={{
                                                            width: mobView ? "120px" : "120px",
                                                            height: mobView ? "120px" : "120px",
                                                            objectFit: "contain",
                                                            // margin: "0 auto",
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
                                                </div>
                                                <h5 className='m-0 w-full' style={{ fontSize: "80%" }} dangerouslySetInnerHTML={{ __html: capitalize(v?.name) }} />
                                            </Link>
                                        </div>
                                    )
                                })}
                            </Slider>
                            :
                            null
                        :
                        <div className='flex items-center container mt-5 gap-4 w-full'>
                            <Skeleton
                                variant="rounded"
                                // width={"100%"}
                                // height={"20vh"}
                                className='skeliton-4th'
                            />
                        </div>
                }
            </div>
        )
    }

    return (
        <>
            {products?.length !== 1 ? <>
                {search === "attribute" ? null :
                    showSide ? <div className='container'>
                        {BrandSlider()}
                    </div> : null}

                <div className="container ppl" style={{ minHeight: "80vh" }}>

                    <div className={`${newProductListHide ? `w-full` : `mt-4 ${showSide ? `row gx-lg-5` : `w-full`}`}`}>
                        {products?.length ?
                            newProductListHide ?
                                null
                                :
                                showSide ?
                                    <div className="col-lg-3">
                                        {(tabView || mobView) ?
                                            <div className={`filter_btn_mobile`} onClick={() => setOpenFilter(!openFilter)}>
                                                <FilterAltIcon />
                                            </div>
                                            : null}
                                        {(tabView || mobView) ?
                                            <Drawer
                                                anchor={"bottom"}
                                                open={openFilter}
                                                onClose={() => setOpenFilter(false)}
                                            >
                                                <div style={{ height: "85vh", padding: "0 1rem" }}>
                                                    <div className='w-full flex items-center justify-between' style={{ padding: "1.25rem 0 0 0" }}>
                                                        <p className='show-list px-2 rounded' style={{ background: "#179d01", color: "#ffffff" }}>{productsAll?.page_string}</p>
                                                        <CloseIcon onClick={() => setOpenFilter(false)} style={{ position: "static" }} className={`btn-close cursor-pointer`} />
                                                    </div>
                                                    <div style={{ padding: "1.25rem 0" }}>
                                                        {Filters()}
                                                    </div>
                                                </div>
                                            </Drawer>

                                            :
                                            <div className={`sticky-filter`}>
                                                {Filters()}
                                            </div>
                                        }
                                    </div>
                                    : null : null
                        }

                        <div className={`${newProductListHide ? `w-full ` : !products?.length ? `w-full ` : `mt-4 mt-lg-0 ${showSide ? `col-lg-9` : `col-lg-12`}`}`}>

                            {products?.length ? <div className='row'>

                                <div className={`${showSide ? "col-md-5" : "flex justify-center"}`} style={showSide ? { paddingLeft: "20px" } : {}}>
                                    <div className={`uppercase font-medium ppsL`}>
                                        <h1 className='w-fit sp-title' style={{ fontSize: "150%" }}>
                                            <div dangerouslySetInnerHTML={{ __html: linkname }}></div>
                                        </h1>
                                    </div>
                                </div>

                                {showTop ?
                                    <div className="list-new col-md-7 h-fit">
                                        <div className="row" style={{ flexWrap: "nowrap" }}>

                                            {/* heading */}
                                            <div className="col-md-6 col-6 new1">
                                                <p className='show-list'>{productsAll?.page_string}</p>
                                            </div>

                                            {/* filter or sorting */}
                                            <ClickAwayListener onClickAway={() => setOpenSortItem(false)}>
                                                <div className="sort-container col-md-4 col-6">
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "2px" }}>
                                                        <button className="sort-button" onClick={() => setOpenSortItem(!openSortItem)}>
                                                            Sorting Items ▼
                                                        </button>
                                                    </div>
                                                    {openSortItem && (
                                                        <ul className="sort-list">
                                                            {sortItemList?.length ? (
                                                                sortItemList.map((v, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className={`sort-list-item ${sortby === v?.value ? "selected" : ""}`}
                                                                        onClick={() => {
                                                                            setSortby(v?.value);
                                                                            setOpenSortItem(false);
                                                                        }}
                                                                    >
                                                                        <Link href="javascript:void(0);" style={{ textDecoration: "none", color: "inherit", display: "block", padding: "8px" }}>
                                                                            {v?.name}
                                                                        </Link>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li className="sort-list-item" style={{ padding: "8px" }}>
                                                                    No items
                                                                </li>
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>
                                            </ClickAwayListener>

                                            {/* grid or table view */}
                                            {(tabView || mobView) ? null :
                                                <div className="col-md-2 d-none d-md-block py-0 pe-0 gap-2 mt-2" style={{ paddingLeft: "2%" }}>
                                                    <button className='grid-view mr-2' onClick={() => setChangeView("grid")} style={{ width: "15px", height: "15px", }}>
                                                        <Image src={grid} alt="grid" className={`grid-img`} style={{ width: "100%", height: "100%", }} />
                                                    </button>
                                                    <button className='list-view ' onClick={() => setChangeView("list")} style={{ width: "15px", height: "15px", }}>
                                                        <Image src={list} alt="list" className={`grid-img`} style={{ width: "100%", height: "100%", }} />
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    </div> : null}
                            </div> : null}

                            <div className={`tab-content ${products?.length ? "mt-3" : ""}`} id="pills-tabContent">
                                <div
                                    className="tab-pane fade show active PListing" id="tab-new"
                                    tabIndex={0}
                                >
                                    <div className={`${products?.length ? `${`${showSide ? "list" : ""} ${changeView === "list" ? "list-view-filter" : "grid-view-filter"}`}` : "w-full flex justify-center items-center"}`}>
                                        <div className={`product-grid ${products?.length === 1 ? "view1" : products?.length === 2 && "view2"}`}>

                                            {products?.length ?
                                                products.map((v: any, i: number) =>
                                                    <div className={mobView ? `item newone pb-4 ps-1` : `item newone pb-4`} key={i} data-aos={mobView ? "" : "zoom-in-up"}>
                                                        <div className="product-box">
                                                            <div className="thumb-wrap">
                                                                {!v?.variations?.length ?
                                                                    (v?.stock_quantity !== 0 ?
                                                                        changeView === "list" ? null : <>{v?.sale_price ? <h5 className="offer" style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }}>{Math.round((v?.price - v?.sale_price) * 100 / v?.price)}% Off</h5> : null}</>
                                                                        : v?.variations?.length ? "" :
                                                                            changeView === "list" ? null : <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5>)
                                                                    :
                                                                    variationStockQ(v?.variations) === 0 ? changeView === "list" ? null : <h5 className='offer' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5>
                                                                        :
                                                                        <>{v?.sale_price ? <h5 className="offer" style={{ fontSize: "14px", padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }}>{Math.round((v?.price - v?.sale_price) * 100 / v?.price)}% Off</h5> : null}</>
                                                                }
                                                                <Link href={`/product/${v?.slug}`}>
                                                                    <div className="thumb">
                                                                        {v?.images ?
                                                                            // <img
                                                                            //     src={v?.images?.length && v?.images[0]?.src !== null && v?.images[0]?.src}
                                                                            //     alt={v?.images[0]?.name}
                                                                            //     width={157}
                                                                            //     height={175}
                                                                            //     onLoad={() => handleImageLoad(v?.images[0]?.src)}
                                                                            //     onError={() => handleImageError(v?.images[0]?.src)}
                                                                            //     className={`product-img`}
                                                                            //     style={{ height: 190 }}
                                                                            //     sizes="(min-width: 157px) 50vw, 100vw"
                                                                            // /> 
                                                                            <Image
                                                                                src={v?.images?.length && v?.images[0]?.src !== null && v?.images[0]?.src !== "" ? v?.images[0]?.src : defaultImage}
                                                                                width={500}
                                                                                height={500}
                                                                                alt={v?.images[0]?.name}
                                                                                className='object-contain'
                                                                            />
                                                                            : "defaultImage"
                                                                        }

                                                                    </div>
                                                                </Link>
                                                                <ul className="thumb-list flex flex-col items-center">
                                                                    {v?.images?.length ? v?.images?.slice(1, 3).map((itm: any, idx: number) =>
                                                                        <li key={idx}>
                                                                            <img
                                                                                src={itm?.src ? itm?.src : `/assets/images/brandDam.png`}
                                                                                alt={itm?.name}
                                                                                className={'product_smallImg'}
                                                                                style={{ height: "45px", width: "auto" }}
                                                                                width={45}
                                                                                height={45}
                                                                                sizes="(min-width: 45px) 50vw, 100vw"
                                                                            />
                                                                        </li>)
                                                                        :
                                                                        <li>
                                                                            <img
                                                                                src={`/assets/images/brandDam.png`}
                                                                                alt={"productimage"}
                                                                                className={'product_smallImg'}
                                                                                style={{ height: "45px", width: "auto" }}
                                                                                width={45}
                                                                                height={45}
                                                                                sizes="(min-width: 45px) 50vw, 100vw"
                                                                            />
                                                                        </li>
                                                                    }
                                                                </ul>

                                                                {changeView === "list" ?
                                                                    <div className={`card-data`}>
                                                                        {!v?.variations?.length ? (v?.stock_quantity !== 0 ?
                                                                            <>{v?.sale_price ? <h5 className="" style={{ fontSize: "14px", fontWeight: 700, padding: "4px 8px", margin: "0 20px", width: "fit-content", background: "#1f6623", color: "#ffffff", borderRadius: "20px" }}>{Math.round((v?.price - v?.sale_price) * 100 / v?.price)}% Off</h5> : null}</>
                                                                            : v?.variations?.length ? "" :
                                                                                <h5 className='' style={{ color: "red", fontSize: "14px", fontWeight: 700, }}>Out Of Stock</h5>)
                                                                            :
                                                                            variationStockQ(v?.variations) === 0 ? <h5 className='' style={{ color: "red", fontSize: "14px" }}>Out Of Stock</h5> : null
                                                                        }
                                                                        <div className="rating">
                                                                            <Stack spacing={1}>
                                                                                <Rating size='small' name="half-rating" defaultValue={+(v?.rating_count)} precision={0.1} readOnly />
                                                                            </Stack>
                                                                        </div>
                                                                        <h3 className="ptitle truncate w-95 mb-0" style={{ fontSize: "70%" }}><Link href="javascript:void(0);">{v?.name}</Link></h3>
                                                                        <div className="price" style={{ fontSize: "90%" }}>
                                                                            {v?.sale_price ? <del className='m-0'><span>₹</span>{v?.price ? currencyFormatter.format(v?.price, { code: '' }) : "00.00"}&nbsp;</del> : null}
                                                                            <span>₹</span>{v?.sale_price ? currencyFormatter.format(v?.sale_price, { code: '' }) : v?.price ? currencyFormatter.format(v?.price, { code: '' }) : "00.00"}
                                                                        </div>
                                                                    </div> : null}

                                                                <ul className="plinks">
                                                                    <li><Link href="javascript:void(0);" style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} onClick={() => { createWishListDetails(create_wish_list, { product_id: v?.id, list_type: "WISHLIST" }) }}><i className="fa-solid fa-heart" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>
                                                                    {/* {(v?.stock_quantity !== null ?? v?.stock_quantity !== 0) ? */}
                                                                    {/* <li><Link href="javascript:void(0);" onClick={() => { getme?.id ? v?.variations?.length ? router.push(`/product/${v?.slug}`) : onCreateCart({ id: v?.id }) : onCreateCart({ id: v?.id }) }}><i className="fa-solid fa-cart-shopping"></i></Link></li> */}
                                                                    {!v?.variations?.length ?
                                                                        (v?.stock_quantity !== 0 ?
                                                                            changeView === "list" ? null
                                                                                : <li><Link href="javascript:void(0);" style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} onClick={() => { getme?.id ? v?.variations?.length ? router.push(`/product/${v?.slug}`) : onCreateCart({ id: v?.id }) : onCreateCart({ id: v?.id }) }}><i className="fa-solid fa-cart-shopping" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>
                                                                            : v?.variations?.length ? "" :
                                                                                changeView === "list" ? null : <li><Link href="javascript:void(0);" style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} onClick={() => notifyMe(v?.id)} ><i className="fa fa-bell" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>)
                                                                        :
                                                                        variationStockQ(v?.variations) === 0 ? changeView === "list" ? null : <li><Link href="javascript:void(0);" style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} onClick={() => notifyMe(v?.id)} ><i className="fa fa-bell" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>
                                                                            :
                                                                            <li><Link href="javascript:void(0);" style={mobView ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}} onClick={() => { getme?.id ? v?.variations?.length ? router.push(`/product/${v?.slug}`) : onCreateCart({ id: v?.id }) : onCreateCart({ id: v?.id }) }}><i className="fa-solid fa-cart-shopping" style={mobView ? { fontSize: "12px", margin: "2px 0 0 0" } : {}}></i></Link></li>
                                                                    }
                                                                    {/* :
                                                                     v?.variations?.length ? <li><Link href="javascript:void(0);" onClick={() => { getme?.id ? v?.variations?.length ? router.push(`/product/${v?.slug}`) : onCreateCart({ id: v?.id }) : dispatch(setOpenAuth(true)) }}><i className="fa-solid fa-cart-shopping"></i></Link></li>
                                                                    :
                                                                    <li><Link href="javascript:void(0);" ><i className="fa fa-bell"></i></Link></li>
                                                                } */}
                                                                    {/* <li><Link href={`/product/${v?.slug}`}><i className="fa-solid fa-magnifying-glass"></i></Link></li> */}
                                                                </ul>
                                                            </div>
                                                            <div className='card-data-bottom'>
                                                                <div className="rating">
                                                                    <Stack spacing={1}>
                                                                        <Rating size='small' name="half-rating" defaultValue={+(v?.rating_count)} precision={0.1} readOnly />
                                                                    </Stack>
                                                                </div>
                                                                <h3 className="ptitle truncate w-95 mb-0" style={{ fontSize: "70%" }}><Link href="javascript:void(0);">{v?.name}</Link></h3>
                                                                <div className="price" style={{ fontSize: "90%" }}>
                                                                    <span>₹</span>{v?.sale_price ? currencyFormatter.format(v?.sale_price, { code: '' }) : v?.price ? currencyFormatter.format(v?.price, { code: '' }) : "00.00"}
                                                                    {v?.sale_price ? <del><span>₹</span>{v?.price ? currencyFormatter.format(v?.price, { code: '' }) : "00.00"}</del> : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) :
                                                (productsLoading && !productsRaw) ?
                                                    <div className='flex flex-col items-center justify-center w-full h-full'>
                                                        <Image src={emptyBox} alt='no_data_ill' width={100} height={100} />
                                                        <h4>Loading</h4>
                                                    </div> :
                                                    null
                                            }

                                            {!productsLoading ?
                                                (!productsLoading && !productsRaw) ? null :
                                                    products?.length ? null :
                                                        <div className='flex flex-col items-center justify-center w-full h-full'>
                                                            <Image src={emptyBox} alt='no_data_ill' width={192} height={108} />
                                                            <h4 className='flex flex-col items-center justify-center w-full h-full gap-1'>
                                                                <span style={{ fontSize: "18px" }}>Opps! no product found</span>
                                                                <span style={{ fontSize: "14px" }}>
                                                                    check out our <Link href="/new-arrivals" className='color-e4509d'>New arrivals</Link> or <Link href="/best-selling" className='color-e4509d'>Best selling </Link>products.
                                                                </span>
                                                            </h4>
                                                        </div>
                                                :
                                                <div className='flex items-center container mt-5 gap-4 w-full'>
                                                    <Skeleton
                                                        variant="rounded"
                                                        // width={"100%"}
                                                        // height={"20vh"}
                                                        className='skeliton-4th'
                                                    />
                                                    <Skeleton
                                                        variant="rounded"
                                                        // width={"100%"}
                                                        // height={"20vh"}
                                                        className='skeliton-4th'
                                                    />
                                                    <Skeleton
                                                        variant="rounded"
                                                        // width={"100%"}
                                                        // height={"20vh"}
                                                        className='skeliton-4th'
                                                    />
                                                </div>
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div >



                        </div>
                    </div>
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
                                <label style={{ fontSize: "80%", fontWeight: "500" }}>Mobile no</label>
                                <input
                                    type="number"
                                    name="p"
                                    placeholder="Enter your mobile no"
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
                :
                <div className='flex w-full items-center justify-center cli' style={{ height: "70vh" }}>
                    <div className="spinner"></div>
                </div>}
        </>
    )
}

export default ProductListing