import React, { useEffect, useState } from 'react'
import { _post } from '../../services'
import getUrlWithKey from '../../util/_apiUrl';
import { formatDateForDtdcTrcaking, formatTimeForDtdcTracking } from '../../util/_common';
import checkTodtdc from "../../../../public/assets/admin/images/checkTodtdc.svg"
import Image from 'next/image';

// const DTDCTracking = ({dtdcData, handleSection }: any) => {
const DTDCTracking = ({ dtdcData, handleSection }: any) => {
    console.log(dtdcData, handleSection, "dsf4rg5sd31")
    const { get_tracking, get_product_Track_details } = getUrlWithKey("dtdc");

    const [detailsArr, setDetailsArr] = useState<any[]>([]);
    const [percent, setUploadPercentage] = useState<any>(null);

    const [trackData, setTrackData] = useState<any>();

    // useEffect(() => {
    //     // console.log('handleSection: ', handleSection)
    //     // if(handleSection === false) {
    //     setDetailsArr([]);
    //     // }

    //     // return () => {
    //     // setDetailsArr([]);
    //     // }
    // }, [])

    // useEffect(() => {
    // console.log('handleSection: ', orderId)

    // const fetchTrack = () => {

    //     _post(get_tracking, { id: orderId }).then((res: any) => {
    //         const data = res?.data;
    //         if (data?.success) {
    //             console.log("data?.success", data?.data);
    //             if (data?.data && data.data?.trackDetails && data.data.trackDetails?.length && data.data?.id === orderId) {
    //                 const arr: any[] = [];
    //                 data.data.trackDetails.map((v: any, i: number) => {
    //                     if (v?.strCode && v?.strAction && v?.strActionDate && v?.strActionTime && v?.strOrigin) {
    //                         arr.push(
    //                             <div className="tracking-item">
    //                                 <div className="tracking-icon status-intransit lg:top-[30%] top-[40%]">
    //                                     <svg className="svg-inline--fa fa-circle fa-w-16" aria-hidden="true" data-prefix="fas" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
    //                                         <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
    //                                     </svg>
    //                                 </div>
    //                                 <div className={`absolute lg:-left-24 -left-10 lg:top-[28%] top-[35%] w-[7.5rem] text-right`}><img src="https://pinktest.altisinfonet.in/wp-content/themes/pinkpaws/assets/admin/images/delivery.svg" className="img-responsive" alt="Softdata Upload" /></div>
    //                                 <div className='flex flex-col gap-2'>
    //                                     <div className="tracking-content">{v?.strAction}<span>{formatDateForDtdcTrcaking(v?.strActionDate)} {formatTimeForDtdcTracking(v?.strActionTime)}</span></div>
    //                                     <div className="tracking-content"><span>{v?.strOrigin}</span></div>
    //                                 </div>

    //                             </div>
    //                         )
    //                     }
    //                 })
    //                 setDetailsArr(arr);
    //             } else {
    //                 setDetailsArr([]);
    //             }
    //         }
    //     }).catch((error: any) => {
    //         console.error("Error", error);
    //     })


    // }

    // const fetchTrack = async () => {
    //     try {
    //         //clear data
    //         // setDetailsArr([]);

    //         const { data } = await _post(get_tracking, { id: orderId }, {
    //             onUploadProgress: (progressEvent: any) => {
    //                 const { loaded, total }: any = progressEvent;
    //                 console.log("loaded, total", loaded, total)
    //                 let percent = Math.floor((loaded * 100) / total);
    //                 setUploadPercentage(percent);
    //             },
    //         });
    //         if (data?.success ) {
    //             console.log("data?.success", data?.data);
    //             if (data?.data && data.data?.trackDetails && data.data.trackDetails?.length) {
    //                 const arr: any[] = [];
    //                 data.data.trackDetails.map((v: any, i: number) => {
    //                     if (v?.strCode && v?.strAction && v?.strActionDate && v?.strActionTime && v?.strOrigin) {
    //                         arr.push(
    //                             <div className="tracking-item">
    //                                 <div className="tracking-icon status-intransit lg:top-[30%] top-[40%]">
    //                                     <svg className="svg-inline--fa fa-circle fa-w-16" aria-hidden="true" data-prefix="fas" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
    //                                         <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
    //                                     </svg>
    //                                 </div>
    //                                 <div className={`absolute lg:-left-24 -left-10 lg:top-[28%] top-[35%] w-[7.5rem] text-right`}><img src="https://pinktest.altisinfonet.in/wp-content/themes/pinkpaws/assets/admin/images/delivery.svg" className="img-responsive" alt="Softdata Upload" /></div>
    //                                 <div className='flex flex-col gap-2'>
    //                                     <div className="tracking-content">{v?.strAction}<span>{formatDateForDtdcTrcaking(v?.strActionDate)} {formatTimeForDtdcTracking(v?.strActionTime)}</span></div>
    //                                     <div className="tracking-content"><span>{v?.strOrigin}</span></div>
    //                                 </div>

    //                             </div>
    //                         )
    //                     }
    //                 })
    //                 setDetailsArr(arr);
    //             } else {
    //                 setDetailsArr([]);
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error", error);
    //     }
    // }
    // if (orderId) {
    //     setTimeout(() => {
    //         fetchTrack();
    //     }, 600)
    // }

    // }, [orderId])

    useEffect(() => {
        if (dtdcData?.data?.trackDetails?.length) {
            setTrackData({ statusCode: 200, trackDetails: updateTrackDetails(dtdcStaticData?.trackDetails, dtdcData?.data?.trackDetails) })
        } else {
            // setTrackData({ statusCode: 200, trackDetails: updateTrackDetails(dtdcStaticData?.trackDetails, []) })
        }
    }, [dtdcData])

    function updateTrackDetails(staticArray: any, dynamicArray: any) {
        // Filter out staticArray and dynamicArray items without strCode
        const filteredStaticArray = staticArray.filter((item: any) => item?.strCode);
        const filteredDynamicArray = dynamicArray.filter((item: any) => item?.strCode);
        console.log(filteredStaticArray, "static", filteredDynamicArray, "dynamic", "__filter-1")

        // Map the static array to update matching items
        const updatedDetails = filteredStaticArray.map((staticItem: any) => {
            const matchingDynamicItem = filteredDynamicArray.find((dynamicItem: any) => dynamicItem?.strCode === staticItem?.strCode);
            return matchingDynamicItem
                ? { ...matchingDynamicItem } // Replace with dynamic item
                : { ...staticItem, static: true }; // Remove static if no match
        });

        console.log(updatedDetails, "__filter-2")

        // Filter dynamic items not already in the updated static array
        const dynamicOnlyItems = filteredDynamicArray.filter((dynamicItem: any) =>
            !filteredStaticArray.some((staticItem: any) => staticItem?.strCode === dynamicItem?.strCode)
        );

        console.log(dynamicOnlyItems, "__filter-3")

        // Add new dynamic items after the 2nd index
        const insertionIndex = 1; // After the 2nd element
        const result = [...updatedDetails];
        result.splice(insertionIndex + 1, 0, ...dynamicOnlyItems); // Insert at the specified position

        console.log(result, "__filter-result")

        return result;
    }


    console.log('dtdcData', dtdcData)


    useEffect(() => {
        if (trackData) {
            console.log('dtdcDatadtdcData', trackData);

            if (trackData && trackData?.trackDetails && trackData.trackDetails?.length) {
                const arr: any[] = [];
                // let deliveryIndex = -1;
                trackData.trackDetails.map((v: any, i: number) => {
                    // if (v?.strCode && v?.strAction && v?.strActionDate && v?.strActionTime && v?.strOrigin) {
                    // if (v.strCode === 'DLVD' || v.strAction === 'Delivered') {
                    //     deliveryIndex = i + 1; // Store the index
                    // }
                    arr.push(
                        <div className={`tracking-item ${v?.static ? 'tracking-item-gray' : ''}`}>
                            <div className="tracking-icon status-intransit lg:top-[30%] top-[40%]">
                                <svg className="svg-inline--fa fa-circle fa-w-16" aria-hidden="true" data-prefix="fas" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                                    <path fill={v?.static ? '#b3b3b3' : '#00ba0d'} d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                </svg>
                            </div>
                            <div className={`absolute lg:-left-24 -left-10 lg:top-[28%] top-[35%] w-[7.5rem] text-right`}><Image src={checkTodtdc} className="img-responsive" alt="Softdata Upload" /></div>
                            <div className='flex flex-col gap-2'>
                                <div className="tracking-content">{v?.strAction}{v?.static ? null : <span>{formatDateForDtdcTrcaking(v?.strActionDate)} {formatTimeForDtdcTracking(v?.strActionTime)}</span>}</div>
                                {v?.static ? <div className="tracking-content"><span></span></div> : <div className="tracking-content"><span>{v?.strOrigin}</span></div>}
                            </div>

                        </div>
                    )
                    // }
                })
                setDetailsArr(arr);
                console.log('dtdcDatadtdcData', trackData, 'arr: ', arr);
            }
            else {
                setDetailsArr([]);
            }
        } else if (trackData?.statusCode === 0) {
            setDetailsArr([]);
        }
    }, [trackData])


    return (
        <div id="tracking">
            <div className="tracking-list">
                {/* {dtdcData?.length ? dtdcData : null} */}
                {
                    detailsArr?.length ? detailsArr :
                        <div className='p-2 flex items-center justify-center h-full'>
                            <p className='text-lg font-semibold text-gray-400'>Shipment has not been dispatched yet.</p>
                        </div>
                }
            </div>
        </div>
    )
}

export default DTDCTracking

const dtdcStaticData = {
    statusCode: 200,
    trackDetails: [
        {
            "static": true,
            "strCode": "PCAW",
            "strAction": "Pickup Awaited",
            "strManifestNo": "",
            "strOrigin": "SALT LAKE BRANCH",
            "strDestination": "",
            "strOriginCode": "K68",
            "strDestinationCode": "",
            "strActionDate": "08102024",
            "strActionTime": "1513",
            "sTrRemarks": "",
            "strLatitude": "",
            "strLongitude": ""
        },
        {
            "static": true,
            "strCode": "PCUP",
            "strAction": "Picked Up",
            "strManifestNo": "7283705459370",
            "strOrigin": "SALT LAKE BRANCH",
            "strDestination": "",
            "strOriginCode": "K68",
            "strDestinationCode": "",
            "strActionDate": "08102024",
            "strActionTime": "1736",
            "sTrRemarks": "",
            "strLatitude": "",
            "strLongitude": ""
        },
        {
            "static": true,
            "strCode": "OUTDLV",
            "strAction": "Out For Delivery",
            "strManifestNo": "002764371562VA",
            "strOrigin": "KARNAL BRANCH",
            "strDestination": "",
            "strOriginCode": "J15",
            "strDestinationCode": "",
            "strActionDate": "11102024",
            "strActionTime": "1133",
            "sTrRemarks": "",
            "strLatitude": "29.6710548",
            "strLongitude": "76.9910563"
        },
        {
            "static": true,
            "strCode": "INSCAN",
            "strAction": "Reached At Destination",
            "strManifestNo": "1004846105",
            "strOrigin": "AMBALA APEX",
            "strDestination": "KARNAL BRANCH",
            "strOriginCode": "J10",
            "strDestinationCode": "",
            "strActionDate": "11102024",
            "strActionTime": "0829",
            "sTrRemarks": "0.00",
            "strLatitude": "",
            "strLongitude": ""
        },
        {
            "static": true,
            "strCode": "DLV",
            "strAction": "Delivered",
            "strManifestNo": "5060188665",
            "strOrigin": "KARNAL BRANCH",
            "strDestination": "",
            "strOriginCode": "J15",
            "strDestinationCode": "",
            "strActionDate": "11102024",
            "strActionTime": "1341",
            "sTrRemarks": "VISHAL SHARMA",
            "strSCDOTP": "N",
            "strLatitude": "29.69353270",
            "strLongitude": "76.97619570"
        }
    ]
}

const dtdcStaticData2 = {
    statusCode: 200,
    trackDetails: [
        {
            "strCode": "PCAW",
            "strAction": "Pickup Awaited",
            "strManifestNo": "",
            "strOrigin": "SALT LAKE BRANCH",
            "strDestination": "",
            "strOriginCode": "K68",
            "strDestinationCode": "",
            "strActionDate": "08102024",
            "strActionTime": "1513",
            "sTrRemarks": "",
            "strLatitude": "",
            "strLongitude": ""
        },
        {
            "strCode": "PCUP",
            "strAction": "Picked Up",
            "strManifestNo": "7283705459370",
            "strOrigin": "SALT LAKE BRANCH",
            "strDestination": "",
            "strOriginCode": "K68",
            "strDestinationCode": "",
            "strActionDate": "08102024",
            "strActionTime": "1736",
            "sTrRemarks": "",
            "strLatitude": "",
            "strLongitude": ""
        },
        {
            "strCode": "INSCAN",
            "strAction": "Reached At Destination",
            "strManifestNo": "1004846105",
            "strOrigin": "AMBALA APEX",
            "strDestination": "KARNAL BRANCH",
            "strOriginCode": "J10",
            "strDestinationCode": "",
            "strActionDate": "11102024",
            "strActionTime": "0829",
            "sTrRemarks": "0.00",
            "strLatitude": "",
            "strLongitude": ""
        },
        {
            "strCode": "OUTDLV",
            "strAction": "Out For Delivery",
            "strManifestNo": "002764371562VA",
            "strOrigin": "KARNAL BRANCH",
            "strDestination": "",
            "strOriginCode": "J15",
            "strDestinationCode": "",
            "strActionDate": "11102024",
            "strActionTime": "1133",
            "sTrRemarks": "",
            "strLatitude": "29.6710548",
            "strLongitude": "76.9910563"
        },
        {
            "strCode": "",
            "strAction": "Delivered",
            "strManifestNo": "5060188665",
            "strOrigin": "KARNAL BRANCH",
            "strDestination": "",
            "strOriginCode": "J15",
            "strDestinationCode": "",
            "strActionDate": "11102024",
            "strActionTime": "1341",
            "sTrRemarks": "VISHAL SHARMA",
            "strSCDOTP": "N",
            "strLatitude": "29.69353270",
            "strLongitude": "76.97619570"
        }
    ]
}