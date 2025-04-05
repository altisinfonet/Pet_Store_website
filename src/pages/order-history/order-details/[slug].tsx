import React, { useEffect, useState } from 'react'
import { capitalize, convertDateString } from '../../../util/_common';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Modal, Rating, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import useIsLogedin from '../../../hooks/useIsLogedin';
import useTabView from '../../../hooks/useTabView';
import brandDam from "../../../../public/assets/images/brandDam.png"
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import getUrlWithKey from '../../../util/_apiUrl';
import TrackOrderDetails from '../../../components/TrackOrderDetails';
import trackingCar from '../../../../public/assets/icon/trackingCar.svg';
import cancelOrder from "../../../../public/assets/icon/cancelOrder.svg"
import countDown from "../../../../public/assets/images/countDown.png"
import reOrder from "../../../../public/assets/icon/reorder.png"
import { _get, _post } from '../../../services';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // Warning icon
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrackingSteps from '../../../containers/client/OrderTrackingSteps';
import { useRead } from '../../../hooks';
import { useSelector } from 'react-redux';
import { _ERROR, _SUCCESS } from '../../../util/_reactToast';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import Cart from '../../../containers/client/cart';
import { Dataset } from '@mui/icons-material';
import Loader from '../../../components/CustomLoader';
import NewTrackOrder from '../../../components/NewTrackOrdersDetails';
const OrderDetailsShowComponent = () => {
  const { get_single_order, update_order, get_product_reviews, create_cart, create_user_review, get_cart_items } = getUrlWithKey("client_apis")
  const { get_awb_number, get_product_Track_details } = getUrlWithKey("dtdcTracking")

  const { logedData } = useIsLogedin()
  const { tabView, mobView } = useTabView()
  const router = useRouter();
  const { slug } = router.query;
  const isReturn = router.query.isReturn
  const [estimated_time, setEstimated_time] = useState("");
  const [dataSet, setDataSet]: any = useState()
  const [outOfStockErrors, setOutOfStockErrors] = useState<{ id: number; message: string }[]>([]);
  const [sideBarOpen, setSideBarOpen]: any = useState<boolean>(false)
  const [openModal, setOpenModal] = useState(false);
  const [orderTrackID, setOrderTrackID] = useState(null);
  const [orderTrackView, setOrderTrackView] = useState(false);
  const [awbNumber, setAwbNumber] = useState([])
  const [orderListPayload, setOrderListPayload] = useState({
    page: 1,
    rowsPerPage: 8,
  });
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [countdown, setCountdown] = useState<string>('00:00');
  const [traceOrderNumber, setTraceOrderNumber] = useState<number>()
  const [productReviewPagination, setProductReviewPagination]: any = useState({});
  const [rateProductOpen, setRateProductOpen]: any = useState(false)
  const [anonymousReview, setAnonymousReview]: any = useState(false)
  console.log(outOfStockErrors, "datafxdgvdxSet")
  const getme = useSelector((state: any) => state?.meReducer?.value);
  const initialReview = {
    item_rating: 0,
    description: "",
    product_id: 0,
    // anonymous: anonymousReview
  }
  const [isLoading, setIsLoading] = useState(false);
  const [newTrackOrderData, setNewTrackOrderData] = useState([])
  const [review, setPeview]: any = useState(initialReview)
  const [descriptionError, setDescriptionError]: any = useState("");
  const [ratingError, setRatingError]: any = useState("");
  const { sendData: getReviews }: any = useRead({ selectMethod: "put", url: get_product_reviews, callData: productReviewPagination });
  const isCancelable = awbNumber.every((item) => item.awb_number === null);

  console.log(countdown, "countdowndfg1d")

  // const getSingleOrder = async (id: any) => {
  //   setIsLoading(true)
  //   try {
  //     const { data } = await axios.get(`${get_single_order}/${id}`);
  //     if (data?.success) {
  //       setDataSet(data?.data);
  //       const orderStatus = data?.data?.order_status?.order_status?.title
  //       const trackMapData = data?.data?.order_items?.map((ele: any) => ele?.dtdc_tracking?.data)
  //       const trackdata = data?.data?.dtdc_traking?.data;
  //       const orderStatusNumber = trackdata?.statusCode === 0 || orderStatus === "processing" || orderStatus === "pending" ? 0 : -1
  //       // const orderStatusNumber = orderStatus === "processing" ? 0 : -1

  //       // const trackdata = data?.data?.dtdc_traking?.data;
  //       // const trackOrder = trackdata?.trackDetails?.map((ele: any) => ele?.strAction)
  //       const trackOrder = trackdata?.trackDetails?.map((ele: any) => ele?.strAction) || [];
  //       const uniqueActions = [...new Set(trackOrder)];
  //       const actionToNumberMap: { [key: string]: number } = {
  //         "Softdata Upload": 1,
  //         "Pickup Awaited": 1,
  //         // "Pickup Scheduled": 1,
  //         "Picked Up": 1,
  //         "Booked": 1,
  //         "In Transit": 2,
  //         "Reached At Destination": 3,
  //         "Out For Delivery": 4,
  //         "Not Delivered": 4,
  //         "Delivered": 5,
  //       };
  //       const mappedActions = uniqueActions.map((action: any) => actionToNumberMap[action] || null);
  //       const lastMappedAction = mappedActions[mappedActions.length - 1];
  //       setTraceOrderNumber(lastMappedAction || orderStatusNumber)
  //       console.log(trackMapData, orderStatusNumber, "df41gdf615")
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false)
  //   }
  // };
  const getSingleOrder = async (id: any) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${get_single_order}/${id}`);
      if (data?.success) {
        setDataSet(data?.data);
        const orderStatus = data?.data?.order_status?.order_status?.title;

        // Extract tracking data from order items
        const trackMapData = data?.data?.order_items?.map((ele: any) => ele?.dtdc_tracking?.data).flat();

        // Determine the order status number
        const orderStatusNumber =
          trackMapData?.some((track: any) => track?.statusCode === 0) ||
            orderStatus === "processing" ||
            orderStatus === "pending"
            ? 0
            : -1;

        // Extract and process tracking details
        const trackOrder = trackMapData?.flatMap((track: any) => track?.trackDetails?.map((ele: any) => ele?.strAction)) || [];
        const uniqueActions = [...new Set(trackOrder)];

        const actionToNumberMap: { [key: string]: number } = {
          "Softdata Upload": 1,
          "Pickup Awaited": 1,
          "Picked Up": 1,
          "Booked": 1,
          "In Transit": 2,
          "Reached At Destination": 3,
          "Out For Delivery": 4,
          "Not Delivered": 4,
          "Delivered": 5,
        };

        const mappedActions = uniqueActions.map((action: any) => actionToNumberMap[action] || null);
        const lastMappedAction = mappedActions[mappedActions.length - 1];

        setTraceOrderNumber(lastMappedAction || orderStatusNumber);
        console.log(trackMapData, orderStatusNumber, "df41gdf615");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  const getAwnNumber = async (id: any) => {
    try {
      const { data } = await axios.get(`${get_awb_number}/${id}`);
      if (data?.success) {
        setAwbNumber(data?.data)
        console.log(data?.data, "df41gdfss615")
      }
    } catch (error) {
      setAwbNumber([])
      console.error(error);
    }
  };

  const handleEachProductTracking = async (awb: any) => {
    setOrderTrackView(true);
    setOpenModal(true);
    if (awb) {
      setIsLoading(true)
      try {
        const res = await _post(get_product_Track_details, { awb: awb })
        console.log(awb, res?.data?.data?.trackDetails, "5df4g561sd")
        setNewTrackOrderData(res?.data?.data?.trackDetails)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    getSingleOrder(slug);
    getAwnNumber(slug)
  }, [slug]);

  const getSubTotal = () => {
    let total = 0;
    if (dataSet?.order_items?.length) {
      dataSet?.order_items.map((v: any, i: number) => {
        if (v?.order_product_lookup?.p_net_revenue) {
          total = total + (+v?.order_product_lookup?.p_net_revenue * +v?.order_product_lookup?.p_qty);
        }
      });
    }
    return total;
  }

  const getShipping = () => {
    let s = "50";
    // const total = getSubTotal();
    if (dataSet?.order_status?.total_sales > 500) {
      s = 'FREE Delivery';
    }
    return s;
  }

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  useEffect(() => {
    if (dataSet?.order_items?.length) {
      // let dateArr = dataSet?.order_items?.map((v:any)=> v)
      console.log(dataSet?.order_status?.date_created, "dateArr")
      const initialDate = new Date(dataSet?.order_status?.date_created);
      const newDate = addDays(initialDate, 2);
      setEstimated_time(moment(newDate).format('MMM DD YYYY'));
    }
  }, [dataSet?.order_items?.length])

  const orderDetailsHtml = () => {
    return (
      <>
        {
          dataSet?.order_items?.length ? dataSet?.order_items.map((v: any, i: number) => {
            const isOutOfStock = outOfStockErrors.some((error) => error.id === v?.id);
            return (
              <div key={i} className="pb-2"
                style={{ borderBottom: "1px solid #d4d4d4" }}
              >
                <div className='w-100 flex items-start gap-2'>

                  <div style={{ cursor: "pointer", border: "1px solid #e4509d50", maxWidth: "80px", maxHeight: "100px" }} className='p-2 rounded' onClick={() => router.push('/product/' + v?.slug)}>
                    <Image src={v?.image?.src || brandDam} alt={v?.image?.name || "product-image"} width={100} height={100} className='truncate' />
                  </div>

                  <div className='w-full'>
                    <div className='flex justify-between flex-wrap'>
                      <div className={`flex items-start  ${mobView ? "flex-col" : "flex-row gap-2"}`}>
                        <div className={`${mobView ? 'items-start' : 'items-center'} m-0 flex gap-2 product-name`}>
                          <Link href={`/product/${v?.slug}`} style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "600" }}>{capitalize(v?.name)}</Link>
                        </div>
                      </div>

                      {dataSet?.order_status?.order_status?.title !== "cancelled" &&
                        <div>
                          <div className='flex items-end justify-end' title='Rate Product'>
                            {/* {getReviews?.sendReview ? */}
                            <div className='rateProduct' onClick={() => {
                              setRateProductOpen(true)
                              setPeview({
                                ...review,
                                product_id: v?.id
                              })
                            }}>
                              {Array(5).fill(null).map((_, index: number) => (
                                <StarOutlineIcon key={index} sx={{ color: index < 5 && "#faaf00" }} />
                              ))}
                              {/* Rate the Product */}
                            </div>
                          </div>
                        </div>}

                    </div>
                    <div className='flex items-center justify-between flex-wrap gap-1'>
                      <div>
                        <div className="-m-5 flex items-center justify-between gap-2 product-des">
                          {/* {showSize(v?.variation) ? <span>Size: {showSize(v?.variation)}</span> : null} */}
                          <span style={{ color: "#9c9a9a", fontSize: "16px", fontWeight: "500" }}>Quantity:</span>
                          <span style={{ fontSize: "16px", fontWeight: "500" }}>{v?.quantity || "0"}</span>
                        </div>

                        <div className="m-0 flex items-center justify-between gap-2 product-price">
                          <span style={{ color: "#9c9a9a", fontSize: "15px", fontWeight: "500" }}>Price:</span>
                          <span style={{ fontSize: "16px", fontWeight: "500" }}>₹{(+v?.price * +v?.quantity).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Track Order Button */}
                      {(dataSet?.order_status?.order_status?.title !== "cancelled" && dataSet?.order_status?.order_status?.title !== "failed") && <div className="flex justify-end items-center mt-2">
                        <Tooltip title="Track Your Order" placement="bottom" arrow>
                          <div
                            className={`cursor-pointer ${dataSet?.order_status?.order_status?.title === "cancelled" ? "cursor-normal" : ""}`}
                            style={{
                              borderColor: dataSet?.order_status?.order_status?.title === "cancelled" ? "#B0B0B0" : "#008000",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "135px",
                              height: "30px",
                              border: `2px solid ${dataSet?.order_status?.order_status?.title === "cancelled" ? "#B0B0B0" : "#008000"}`,
                              borderRadius: "8px",
                              backgroundColor: dataSet?.order_status?.order_status?.title === "cancelled" ? "#F2F2F2" : "#F0FFF0",
                              transition: "transform 0.2s ease, box-shadow 0.2s ease",
                              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                              cursor: dataSet?.order_status?.order_status?.title === "cancelled" ? "default" : "pointer",
                              padding: "0 10px",
                              fontSize: "14px",
                              fontWeight: "bold",
                              textAlign: "center",
                              color: dataSet?.order_status?.order_status?.title === "cancelled" ? "#B0B0B0" : "#008000",
                            }}
                            onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                          >
                            <Image
                              src={trackingCar}
                              alt="Tracking Car"
                              style={{
                                width: "20px",
                                height: "auto",
                                marginRight: "8px",
                                opacity: dataSet?.order_status?.order_status?.title === "cancelled" ? 0.5 : 1,
                                transform: "scaleX(-1)",
                              }}
                            />
                            Track Order
                          </div>
                        </Tooltip>
                      </div>}
                    </div>

                    {isOutOfStock && (
                      <div className="flex items-center justify-center">
                        <span className="out-of-stock-badge">
                          {outOfStockErrors.find(error => error.id === v?.id)?.message || "Out Of Stock"}
                        </span>
                      </div>
                    )}

                  </div>
                </div>
                {/* Accordion - Show TrackingSteps if Open */}
                <div className=" mt-2 w-full relative">
                  <div className={`accordion-content ${openAccordion === i ? "open" : ""} w-full py-2 rounded-md`}>
                    <TrackingSteps activeStep={traceOrderNumber} />

                    {/* View More - Aligned Bottom Right */}
                    <span
                      className="view-more mb-1"
                      onClick={() => {
                        if (!["cancelled", "completed", "failed"].includes(dataSet?.order_status?.order_status?.title)) {
                          handleEachProductTracking(v?.awb);
                        }
                      }}
                      style={{
                        pointerEvents: ["cancelled", "completed", "failed"].includes(dataSet?.order_status?.order_status?.title) ? "none" : "auto",
                        opacity: ["cancelled", "completed", "failed"].includes(dataSet?.order_status?.order_status?.title) ? 0.8 : 1,
                        cursor: ["cancelled", "completed", "failed"].includes(dataSet?.order_status?.order_status?.title) ? "default" : "pointer",
                      }}
                    >
                      View More
                    </span>
                  </div>
                </div>

              </div>
            )
          }) : null
        }

        <Dialog
          open={openModal}
          onClose={() => {
            setOpenModal(false),
              setOrderTrackView(false),
              setOrderTrackID(null)
          }
          }
          fullWidth
          maxWidth="lg" // Set size to Large (lg)
        >
          <DialogTitle>
            <h3 className='w-fit sp-title a1ccountHeader'>
              Track Order Details
            </h3>

            <IconButton
              aria-label="close"
              onClick={() => {
                setOpenModal(false);
                setOrderTrackView(false);
                setOrderTrackID(null);
              }}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "gray",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <div>{orderTrackView &&
            // <TrackOrderDetails tid={orderTrackID} />
              
              <NewTrackOrder trackDetailsData={newTrackOrderData} />
            }</div>
          </DialogContent>
        </Dialog>
      </>
    )
  }


  {/* <hr className='mt-1'/> */ }
  const getTotalPrice = () => {
    const sh = getShipping();
    // const total = getSubTotal();

    if (sh === 'Free Shipping') {
      return dataSet?.order_status?.total_sales;
    } else {
      return +dataSet?.order_status?.total_sales + +sh;
    }
  }

  const orderStatusDataBilling = () => {
    return dataSet?.order_status?.billing ? JSON.parse(dataSet?.order_status?.billing) : null
  }

  const orderShippingDataAddress = () => {
    return dataSet?.order_status?.shipping ? JSON.parse(dataSet?.order_status?.shipping) : null
  }

  console.log(orderShippingDataAddress(), "6fds5g65fg6")

  const trackYourOrder = (id: any) => {
    if (id) {
      setOrderTrackID(id);
      setOrderTrackView(true);
    }
  };

  const getCartItemOp = async () => {
    setIsLoading(true)
    try {
      const res = await _get(get_cart_items)
      if (res && res?.status) {
        setSideBarOpen(true)
      }
      if (res?.status === 502) {
        _ERROR("Bad getway!")
      }
    } catch (error) {
      _ERROR(error?.response?.data?.massage || "Something went wrong")
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReorder = async (product: any) => {

    if (!product?.order_items || product.order_items.length === 0) {
      _ERROR("No items found in the order.");
      return;
    }

    const inStockProducts = product.order_items.filter((item: any) => item?.stock_quantity > 0);
    const outStockProducts = product.order_items.filter((item: any) => item?.stock_quantity === 0);

    // if (inStockProducts.length === 0) {
    //   _ERROR("All items are out of stock. Unable to reorder.");
    //   return;
    // }
    setIsLoading(true);
    let successCount = 0;
    try {
      await Promise.all(
        inStockProducts.map(async (item: any) => {
          const data = {
            product_id: item.id,
            variation_id: item.variation_id || null,
            quantity: 1,
          };

          try {
            await _post(create_cart, data);
            successCount++;
          } catch (error) {
            console.error(error.response?.data?.massage, "Product445");
            const errorMessage = error.response?.data?.massage

            if (errorMessage.includes("No more stock")) {
              setOutOfStockErrors((prevErrors) => [
                ...prevErrors,
                {
                  id: item.id,
                  message: "This product is out of stock.",
                },
              ]);

              setTimeout(() => (setOutOfStockErrors([])), 3000)
            }
          }
        })
      );
    } catch (error) {
      console.error(" ", error);
    } finally {
      setIsLoading(false);
    }

    if (outStockProducts && outStockProducts?.length > 0) {
      const outStockerrorData = outStockProducts?.map((ele: any) => ({ id: ele.id, message: "This product is out of stock." }))
      setOutOfStockErrors(outStockerrorData)
      setTimeout(() => (setOutOfStockErrors([])), 3000)
      console.log(outStockProducts, outStockerrorData, "sdgd65f4g6fds");
    }

    if (successCount > 0) {
      _SUCCESS(`${successCount} item(s) added to cart successfully.`);
    } else {
      setSideBarOpen(false);
    }

  };

  const handleOpenDialog = (id: any) => {
    setSelectedOrderId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedOrderId(null);
  };

  const handleClose = () => {
    setSuccessModalOpen(false)
    setOpen(false);
    setSelectedOrderId(null);
    router.push("/my-orders")
  };

  const canselOrder = async () => {
    let url = `${update_order}/${selectedOrderId}`;
    setIsLoading(true)
    try {
      const data = await _post(url, { status: "cancelled" });
      if (data?.data?.success) {
        setSuccessModalOpen(true)
        setOpen(false)
        setOrderListPayload({
          page: 1,
          rowsPerPage: 8,
        });
      }
    } catch (error) {
      console.log(error, "__error");
    } finally {
      setIsLoading(false)
      handleCloseDialog();
    }
    // handleCloseDialog();
  };

  const onReview = (e: any) => {
    let { name, value } = e.target;
    setPeview((pre: any) => ({ ...pre, [name]: value }))
  }


  // const doReview = async () => {
  //   console.log(review, "df6g5f62")
  //   if (!review?.description || review?.description.trim() === "") {
  //     setPeviewError("Please enter a review description.");
  //     return;
  //   }

  //   if (!review?.item_rating) {
  //     setPeviewError("Please provide a rating for the product.");
  //     return;
  //   }

  //   try {
  //     const data = await axios.post(create_user_review,
  //       {
  //         ...review,
  //         product_id: parseFloat(review?.product_id),
  //         anonymous: anonymousReview,
  //         item_rating: +parseFloat(review?.item_rating)
  //       },
  //       { withCredentials: true }
  //     );

  //     if (data?.data?.success) {

  //       setPeview(initialReview)

  //       setAnonymousReview(false)
  //       _SUCCESS("Review submitted successfully!")
  //       setProductReviewPagination((pre: any) => ({ ...pre, product_id: +dataSet?.id }));
  //       setRateProductOpen(false);
  //     }
  //   } catch (error) {
  //     console.log(error, "__error");
  //   }
  //   // if (review?.description !== "" && review?.item_rating) {
  //   //   try {
  //   //     const data = await axios.post(create_user_review,
  //   //       {
  //   //         ...review,
  //   //         product_id: parseFloat(review?.product_id),
  //   //         anonymous: anonymousReview,
  //   //         item_rating: +parseFloat(review?.item_rating)
  //   //       },
  //   //       { withCredentials: true }
  //   //     );
  //   //     if (data?.data?.success) {
  //   //       setPeview(initialReview)
  //   //       setAnonymousReview(false)
  //   //       _SUCCESS("Review submitted")
  //   //       setProductReviewPagination((pre: any) => ({ ...pre, product_id: +dataSet?.id }));
  //   //       setRateProductOpen(false);
  //   //       // }
  //   //       // }
  //   //     }
  //   //   } catch (error) {
  //   //     console.log(error, "__error");
  //   //   }
  //   // } else {
  //   //   // Display error if description or item rating is not filled
  //   //   if (!review?.item_rating) {
  //   //     setPeviewError("Please provide a rating for the product");
  //   //   } else {
  //   //     setPeviewError("Please enter a review");
  //   //   }
  //   // }
  // }

  const doReview = async () => {
    console.log(review, "df6g5f62");
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
      const data = await axios.post(create_user_review, {
        ...review,
        product_id: parseFloat(review?.product_id),
        anonymous: anonymousReview,
        item_rating: +parseFloat(review?.item_rating),
      }, { withCredentials: true });

      if (data?.data?.success) {
        setPeview(initialReview);
        setAnonymousReview(false);
        _SUCCESS("Review submitted successfully!");
        setProductReviewPagination((pre: any) => ({ ...pre, product_id: +dataSet?.id }));
        setRateProductOpen(false);
      }
    } catch (error) {
      console.log(error, "__error");
    }
  };

  useEffect(() => {
    const dateCreated = moment(dataSet?.order_status?.date_created);
    const date72HoursLater = dateCreated.add(72, 'hours');

    const updateCountdown = () => {
      const timeDifference = moment.duration(date72HoursLater.diff(moment()));
      let hoursLeft = Math.floor(timeDifference.asHours());
      let minutesLeft = timeDifference.minutes();
      let secondsLeft = timeDifference.seconds();
      if (hoursLeft <= 0 && minutesLeft <= 0 && secondsLeft <= 0) {
        setCountdown('00:00:00');
        return;
      }

      const formattedCountdown = `${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
      setCountdown(formattedCountdown);
    };

    // Update the countdown every minute
    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(interval);
  }, [dataSet]);

  const detailsHtml = () => {
    return (
      <div className="container">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <Loader />
          </div>
        ) : (
          <div className="my-account mt-3">
            <div className="tm-w-full w-100 d-flex justify-content-between">
              <h3
                style={{ paddingRight: "9px" }}
                className="w-fit sp-title accountHeader"
              >
                Orders Detail
              </h3>
              {orderTrackView ? (
                <button
                  className="show-btn1 mb-3 h-fit"
                  onClick={() => setOrderTrackView(false)}
                >
                  <i
                    className="fa-solid fa-arrow-left-long"
                    style={{ paddingLeft: "8px", padding: "4px" }}
                  ></i>
                  <span style={{ paddingRight: "9px" }}>back</span>
                </button>
              )
                : (
                  <button
                    className="show-btn1 mb-3 h-fit"
                    onClick={() => router.push("/my-orders")}
                  >
                    <i
                      className="fa-solid fa-arrow-left-long"
                      style={{ paddingLeft: "8px", padding: "4px" }}
                    ></i>
                    <span style={{ paddingRight: "9px" }}>back</span>
                  </button>
                )}
            </div>

            {/* {!orderTrackView && */}
            <div className='mt-2 account_orderDetails'>
              <div className={`flex flex-col gap-1 glowCardDisable child-1`}>

                <div className='flex items-center justify-between'>
                  <span className='border-0' style={{ fontSize: "14px", color: "#d8428c", fontWeight: "500" }}>#{dataSet?.id}</span>
                  <span className='border-0' style={{ fontSize: "14px", textAlign: "end", color: "#989898", fontWeight: "500" }}>{moment(dataSet?.order_status?.date_created).format("DD/MM/YYYY")}</span>
                </div>

                <hr className='my-1' />

                {orderDetailsHtml()}

                <div className=''>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Estimated Date:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end" }}>{estimated_time}</span>
                    </div>

                    <div className='flex items-center justify-between'>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Subtotal</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end" }}>₹{(+dataSet?.order_status?.net_total).toFixed(2)}</span>
                    </div>
                    {dataSet?.order_status?.coupon?.discountAmount ?
                      <div className={'flex items-center justify-between'}>
                        <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Discount</span>
                        <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end", color: "green", fontWeight: "500" }}>-₹{dataSet?.order_status?.coupon?.discountAmount.toFixed(2)}</span>
                      </div> : null}
                    <div className='flex items-center justify-between'>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Shipping</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end", color: "green", fontWeight: "500" }}>{getShipping() === "FREE Delivery" ? <span><del style={{ color: "#989898" }}>₹50</del> {getShipping()}</span> : `₹` + getShipping()}</span>
                    </div>
                    {dataSet?.order_wallet?.deductFromWallet ?
                      <div className='flex items-center justify-between'>
                        <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>From wallet</span>
                        <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end", color: "green", fontWeight: "500" }}>-₹{dataSet?.order_wallet?.deductFromWallet}</span>
                      </div> : null}
                    {dataSet?.order_status?.coupon?.code ? <div className='flex items-center justify-between'>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Coupon</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end", color: "green", fontWeight: "500" }}>{dataSet?.order_status?.coupon?.code}&nbsp;{dataSet?.order_status?.coupon?.type === "parsentage" ? <>({dataSet?.order_status?.coupon?.amount}%)</> : <>(₹{dataSet?.order_status?.coupon?.amount})</>}</span>
                    </div> : null}
                    <div className='flex items-center justify-between'>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Payment method</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%", textAlign: "end", color: "#989898", fontWeight: "500", textTransform: "uppercase" }}>{dataSet?.order_status?.payment_method}</span>
                    </div>

                    <hr className='my-1' />
                    {/* <div className='py-3 px-2'>
                    <TrackingSteps activeStep={traceOrderNumber} />
                  </div> */}
                    <div className='flex items-center justify-between'>
                      <span className='py-1 px-0 border-0' style={{ color: "#2d2d2d", fontSize: "17px", fontWeight: "500" }}>Total</span>
                      <span className='py-1 px-0 border-0' style={{ fontSize: "16px", textAlign: "end", color: "#d8428c", fontWeight: "500" }}>₹{(+dataSet?.order_status?.total_sales).toFixed(2)}</span>
                    </div>

                    {isReturn !== undefined && (
                      <div className="mt-2 border-t pt-2">
                        <p className="text-xs font-semibold text-gray-400">
                          Return not available on this order.{" "}
                          <Link
                            href="/cancellations-and-refunds"
                            className="text-pink-600 font-semibold underline hover:text-pink-800"
                          >
                            Know More
                          </Link>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className='child-2'>
                {/* Billing address */}
                <div className='glowCardDisable mb-4' style={{ height: "fit-content" }}>
                  <p className='p-0 acc-title1 flex items-center gap-2 m-0'>Billing Address</p>

                  <div className={`${mobView ? 'flex-col' : 'flex-row gap-3'} flex items-center justify-between`}>
                    <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Name:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%", }}>{orderStatusDataBilling()?.first_name + " " + orderStatusDataBilling()?.last_name}</span>
                    </div>

                    <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>City:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%", }}>{orderStatusDataBilling()?.city}</span>
                    </div>

                  </div>

                  <div className={`${mobView ? 'flex-col' : 'flex-row gap-3'} flex items-center justify-between`}>
                    <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Pincode:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%", }}>{orderStatusDataBilling()?.postcode}</span>
                    </div>

                    <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>State:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%", }}>{orderStatusDataBilling()?.state}</span>
                    </div>
                  </div>

                  <div className={`${mobView ? 'flex-col' : 'flex-row gap-3'} flex items-center justify-between`}>
                    <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Phone:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%", }}>+91 {orderStatusDataBilling()?.phone}</span>
                    </div>

                    <div className={`flex  gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500", }}>Email:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%", wordBreak: "break-all" }}>{logedData?.email}</span>
                    </div>
                  </div>

                </div>

                {/* Shipping address */}
                <div className='glowCardDisable mb-4' style={{ height: "fit-content" }}>
                  <p className='p-0 acc-title1 flex items-center gap-2 m-0'>Shipping Address</p>

                  <div className={`${mobView ? 'flex-col' : 'flex-row gap-3'} flex items-center justify-between`}>
                    <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Name:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%" }}>
                        {orderShippingDataAddress()?.first_name + " " + orderShippingDataAddress()?.last_name}
                      </span>
                    </div>

                    <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>City:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%" }}>
                        {orderShippingDataAddress()?.city}
                      </span>
                    </div>
                  </div>

                  <div className={`${mobView ? 'flex-col' : 'flex-row gap-3'} flex items-center justify-between`}>
                    <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Pincode:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%" }}>
                        {orderShippingDataAddress()?.postcode}
                      </span>
                    </div>

                    <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>State:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%" }}>
                        {orderShippingDataAddress()?.state}
                      </span>
                    </div>
                  </div>

                  <div className={`${mobView ? 'flex-col' : 'flex-row gap-3'} flex items-center justify-between`}>
                    <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Phone:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%" }}>
                        +91 {orderShippingDataAddress()?.phone}
                      </span>
                    </div>

                    <div className={`flex gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Email:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%", wordBreak: "break-all" }}>
                        {logedData?.email}
                      </span>
                    </div>
                  </div>


                  <div className={`${mobView ? 'flex-col' : 'flex-row gap-3'} flex items-center justify-between`}>
                    {orderShippingDataAddress()?.locality && <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Locality:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%" }}>
                        {orderShippingDataAddress()?.locality}
                      </span>
                    </div>}

                    {orderShippingDataAddress()?.landmark && <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Landmark:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%" }}>
                        {orderShippingDataAddress()?.landmark}
                      </span>
                    </div>}
                  </div>
                  <div className={`${mobView ? 'flex-col' : 'flex-row gap-3'} flex items-center justify-between`}>
                    <div className={`flex items-center gap-2 ${mobView ? `width-100` : `width-50`}`}>
                      <span className='py-1 px-0' style={{ color: "#2d2d2d", fontSize: "16px", fontWeight: "500" }}>Address:</span>
                      <span className='py-1 px-0' style={{ fontSize: "80%" }}>
                        {orderShippingDataAddress()?.address_1}
                      </span>
                    </div>
                  </div>
                </div>



                {/* Actions */}
                {
                  // dataSet?.order_status?.order_status?.title === "cancelled" &&
                  dataSet?.order_status?.order_status?.title !== "pending" &&
                  // dataSet?.order_status?.order_status?.title !== "failed" &&
                  dataSet?.order_status?.order_status?.title !== "" &&
                  (
                    <div className='glowCardDisable' style={{ height: "fit-content" }}>

                      <div className="text-sm text-gray-600">
                        {(countdown === "00:00:00" || dataSet?.order_status?.order_status?.title === "cancelled" || dataSet?.order_status?.order_status?.title === "completed" || dataSet?.genesys_invoice_generated === true || awbNumber.every((item: any) => item.awb_number !== null)) ? (
                          <>
                            Want to place the same order again?
                            <span className="font-semibold cursor-pointer text-pink-500 underline mx-1 text-xs" onClick={() => handleReorder(dataSet)}>
                              Reorder now with just one click!
                            </span>
                          </>
                        ) : (
                          <>
                            Orders can only be canceled within{" "}
                            <span className="font-semibold text-pink-500">72 hours of purchase. </span>
                            Once the order is dispatched or shipped, cancellation is not permitted.
                          </>
                        )}
                        {(countdown === "00:00:00" ||
                          dataSet?.order_status?.order_status?.title === "cancelled" ||
                          dataSet?.order_status?.order_status?.title === "completed" ||
                          // dataSet?.order_status?.order_status?.title === "failed" ||
                          dataSet?.genesys_invoice_generated === true ||
                          awbNumber.every((item: any) => item.awb_number !== null)
                        ) ? (
                          <div className='flex items-center justify-center'>
                            <Tooltip title="Re-order" placement="right" arrow>
                              <div
                                className="cursor-pointer pinkBorder mt-2"
                                style={{
                                  borderColor: "#075985",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "250px",
                                  height: "50px",
                                  border: "2px solid #075985",
                                  borderRadius: "8px",
                                  backgroundColor: "#e0f2fe",
                                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                  cursor: "pointer",
                                  padding: "0 10px",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  textAlign: "center",
                                  color: "#075985",
                                }}
                                onClick={() => handleReorder(dataSet)}
                              >
                                <Image
                                  src={reOrder}
                                  alt="Re-order"
                                  style={{ width: "20px", height: "auto", marginRight: "8px" }}
                                />
                                Re-order
                              </div>
                            </Tooltip>
                          </div>
                        ) :
                          (
                            <div className='flex flex-flex-wrap gap-4 mt-2 items-center justify-center sm:flex-col'>
                              <Tooltip title={`Time left : ${countdown}`} placement="top" arrow>
                                <div
                                  className="cursor-pointer pinkBorder"
                                  style={{
                                    borderColor: dataSet?.order_status?.order_status?.title === "cancelled" || dataSet?.order_status?.order_status?.title === "completed" ? "#B0B0B0" : "#EE0000",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "250px",
                                    height: "50px",
                                    border: `2px solid ${dataSet?.order_status?.order_status?.title === "cancelled" || dataSet?.order_status?.order_status?.title === "completed" ? "#B0B0B0" : "#EE0000"}`,
                                    borderRadius: "8px",
                                    backgroundColor: dataSet?.order_status?.order_status?.title === "cancelled" || dataSet?.order_status?.order_status?.title === "completed" ? "#F2F2F2" : "#FFF0F0",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                    cursor: dataSet?.order_status?.order_status?.title === "cancelled" || dataSet?.order_status?.order_status?.title === "completed" ? "default" : "pointer",
                                    padding: "0 10px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    color: dataSet?.order_status?.order_status?.title === "cancelled" || dataSet?.order_status?.order_status?.title === "completed" ? "#B0B0B0" : "#EE0000",
                                  }}
                                  onClick={() => {
                                    if (dataSet?.order_status?.order_status?.title !== "cancelled" && dataSet?.order_status?.order_status?.title !== "completed") {
                                      handleOpenDialog(dataSet?.id);
                                    }
                                  }}
                                >
                                  <Image
                                    src={cancelOrder}
                                    alt="Cancel Order"
                                    style={{
                                      width: "20px",
                                      height: "auto",
                                      marginRight: "8px",
                                      opacity: dataSet?.order_status?.order_status?.title === "cancelled" || dataSet?.order_status?.order_status?.title === "completed" ? 0.5 : 1,
                                    }}
                                  />
                                  Cancel Order
                                </div>
                              </Tooltip>
                              {/* <Tooltip title="Cancel Order Countdown" placement="right" arrow>
                              <div
                                className="pinkBorder"
                                style={{
                                  borderColor: dataSet?.order_status?.order_status?.title === "cancelled" || dataSet?.order_status?.order_status?.title === "completed" ? "#B0B0B0" : "#EE0000",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "250px",
                                  height: "50px",
                                  border: `2px solid ${dataSet?.order_status?.order_status?.title === "cancelled" || dataSet?.order_status?.order_status?.title === "completed" ? "#B0B0B0" : "#EE0000"}`,
                                  borderRadius: "8px",
                                  backgroundColor: dataSet?.order_status?.order_status?.title === "cancelled" || dataSet?.order_status?.order_status?.title === "completed" ? "#F2F2F2" : "#FFF0F0",
                                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                  padding: "0 10px",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  textAlign: "center",
                                  color: dataSet?.order_status?.order_status?.title === "cancelled" || dataSet?.order_status?.order_status?.title === "completed" ? "#B0B0B0" : "#EE0000",
                                }}
                              >
                                <Image
                                  src={countDown}
                                  alt="Cancel Order Countdown"
                                  style={{
                                    width: "20px",
                                    height: "auto",
                                    marginRight: "8px",
                                    opacity: dataSet?.order_status?.order_status?.title === "cancelled" || dataSet?.order_status?.order_status?.title === "completed" ? 0.5 : 1,
                                  }}
                                />
                                {countdown}
                              </div>
                            </Tooltip> */}

                            </div>
                          )
                        }
                      </div>


                    </div>
                  )}
                <Cart sideBarOpen={sideBarOpen} onSideBarClose={() => setSideBarOpen(false)} />

                {/* Cancel warning modal */}
                <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                  {/* Dialog Header */}
                  <DialogTitle>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1}>
                        <WarningAmberIcon color="warning" fontSize="large" />
                        <Typography variant="h6" fontWeight="bold">
                          Cancel Order
                        </Typography>
                      </Box>
                      <IconButton onClick={handleCloseDialog} size="small">
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </DialogTitle>

                  {/* Dialog Content */}
                  <DialogContent>
                    <Typography variant="body1" color="textSecondary">
                      Are you sure you want to cancel this order?.
                    </Typography>
                  </DialogContent>

                  {/* Dialog Actions */}
                  <DialogActions>
                    <Button
                      onClick={handleCloseDialog}
                      variant="outlined"
                      color="success"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      No, Keep Order
                    </Button>
                    <Button
                      onClick={canselOrder}
                      variant="outlined"
                      color="error"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Yes, Cancel Order
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Success cancel */}
                <Dialog open={isSuccessModalOpen} onClose={handleClose} maxWidth="xs" fullWidth>
                  {/* Dialog Header */}
                  <DialogTitle>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <CheckCircleIcon fontSize="large" color="success" />
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        Success
                      </Typography>
                    </Box>
                  </DialogTitle>

                  {/* Dialog Content */}
                  <DialogContent>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      textAlign="center"
                      marginBottom={2}
                    >
                      Your order has been canceled successfully.
                    </Typography>
                  </DialogContent>

                  {/* Dialog Actions */}
                  <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                      onClick={handleClose}
                      variant="contained"
                      color="success"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Rating modal */}
                <Modal
                  open={rateProductOpen}
                  onClose={() => { setRateProductOpen(false); }}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  className=''
                  style={(tabView || mobView) ? { width: "90%", height: "fit-content", margin: "auto" } : { width: "60%", height: "fit-content", margin: "auto" }}
                >
                  <>
                    {/* {getReviews?.sendReview ? */}
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
                    </div>
                    {/* // : null} */}
                  </>
                </Modal>
              </div>

            </div>
            {/* // } */}
          </div >
        )}
        {/* {orderTrackView && <TrackOrderDetails tid={orderTrackID} />} */}
      </div >
    )
  }
  return (

    <div>
      {
        dataSet && detailsHtml()
      }
    </div>
  )
}

export default OrderDetailsShowComponent
