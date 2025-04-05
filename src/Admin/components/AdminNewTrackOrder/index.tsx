import React, { useEffect, useState } from 'react'
import { _post } from '../../services'
import getUrlWithKey from '../../util/_apiUrl';
import { formatDateForDtdcTrcaking, formatTimeForDtdcTracking } from '../../util/_common';
import checkTodtdc from "../../../../public/assets/admin/images/checkTodtdc.svg"
import Image from 'next/image';
import SimpleCard from '../SimpleCard';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// const AdminDTDCTracking = ({dtdcData, handleSection }: any) => {
const AdminDTDCTracking = ({ dtdcData, handleSection }: any) => {
    console.log(dtdcData, "dsf4rg5sd31")
    const { get_tracking, get_product_Track_details } = getUrlWithKey("dtdc");
    const [handleNewSection, setHandleNewSection]: any = useState(true)

    const [detailsArr, setDetailsArr] = useState<any[]>([]);
    const [percent, setUploadPercentage] = useState<any>(null);

    const [trackData, setTrackData] = useState<any[]>([]);


    // useEffect(() => {
    //     if (dtdcData?.data?.trackDetails?.length) {
    //         setTrackData({ statusCode: 200, trackDetails: updateTrackDetails(dtdcStaticData?.trackDetails, dtdcData?.data?.trackDetails) })
    //     } else {
    //         // setTrackData({ statusCode: 200, trackDetails: updateTrackDetails(dtdcStaticData?.trackDetails, []) })
    //     }
    // }, [dtdcData])

    useEffect(() => {
        if (dtdcData && dtdcData.length) {
            const updatedTrackData = dtdcData.map((item: any) => {
                if (item.dtdc_tracking?.data?.statusCode === 0) {
                    return { statusCode: 0, trackDetails: [] };
                } else if (item.dtdc_tracking?.data?.trackDetails?.length) {
                    return {
                        statusCode: 200,
                        trackDetails: updateTrackDetails(dtdcStaticData?.trackDetails, item.dtdc_tracking?.data?.trackDetails)
                    };
                }
                return null;
            }).filter(Boolean); // Remove null values

            setTrackData(updatedTrackData);
        }
    }, [dtdcData]);

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


    // useEffect(() => {
    //     if (trackData) {
    //         console.log('dtdcDatadtdcData', trackData);
    //         if (trackData && trackData?.trackDetails && trackData.trackDetails?.length) {
    //             const arr: any[] = [];
    //             trackData.trackDetails.map((v: any, i: number) => {
    //                 arr.push(
    //                     <div className={`tracking-item ${v?.static ? 'tracking-item-gray' : ''}`}>
    //                         <div className="tracking-icon status-intransit lg:top-[30%] top-[40%]">
    //                             <svg className="svg-inline--fa fa-circle fa-w-16" aria-hidden="true" data-prefix="fas" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
    //                                 <path fill={v?.static ? '#b3b3b3' : '#00ba0d'} d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
    //                             </svg>
    //                         </div>
    //                         <div className={`absolute lg:-left-24 -left-10 lg:top-[28%] top-[35%] w-[7.5rem] text-right`}><Image src={checkTodtdc} className="img-responsive" alt="Softdata Upload" /></div>
    //                         <div className='flex flex-col gap-2'>
    //                             <div className="tracking-content">{v?.strAction}{v?.static ? null : <span>{formatDateForDtdcTrcaking(v?.strActionDate)} {formatTimeForDtdcTracking(v?.strActionTime)}</span>}</div>
    //                             {v?.static ? <div className="tracking-content"><span></span></div> : <div className="tracking-content"><span>{v?.strOrigin}</span></div>}
    //                         </div>

    //                     </div>
    //                 )
    //             })
    //             setDetailsArr(arr);
    //             console.log('dtdcDatadtdcData', trackData, 'arr: ', arr);
    //         }
    //         else {
    //             setDetailsArr([]);
    //         }
    //     } else if (trackData?.statusCode === 0) {
    //         setDetailsArr([]);
    //     }
    // }, [trackData])

    useEffect(() => {
        if (trackData.length) {
            const arr: any[] = [];
            trackData.forEach((trackItem: any, index: number) => {
                if (trackItem.statusCode === 0) {
                    arr.push(
                        <div key={index} className="p-2 flex items-center justify-center h-full">
                            <p className="text-lg font-semibold text-gray-400">Shipment has not been dispatched yet.</p>
                        </div>
                    );
                } else if (trackItem.trackDetails && trackItem.trackDetails.length) {
                    trackItem.trackDetails.map((v: any, i: number) => {
                        arr.push(
                            <div key={`${index}-${i}`} className={`tracking-item ${v?.static ? 'tracking-item-gray' : ''}`}>
                                <div className="tracking-icon status-intransit lg:top-[30%] top-[40%]">
                                    <svg className="svg-inline--fa fa-circle fa-w-16" aria-hidden="true" data-prefix="fas" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill={v?.static ? '#b3b3b3' : '#00ba0d'} d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                    </svg>
                                </div>
                                <div className="absolute lg:-left-24 -left-10 lg:top-[28%] top-[35%] w-[7.5rem] text-right">
                                    <Image src={checkTodtdc} className="img-responsive" alt="Tracking Step" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="tracking-content">
                                        {v?.strAction}
                                        {v?.static ? null : <span>{formatDateForDtdcTrcaking(v?.strActionDate)} {formatTimeForDtdcTracking(v?.strActionTime)}</span>}
                                    </div>
                                    {v?.static ? null : <div className="tracking-content"><span>{v?.strOrigin}</span></div>}
                                </div>
                            </div>
                        );
                    });
                }
            });

            setDetailsArr(arr);
        } else {
            setDetailsArr([]);
        }
    }, [trackData]);

    console.log(detailsArr, "fdxgf53d14gfd")
    return (
        <>
            <SimpleCard heading={
                <div className="flex items-center justify-between">
                    <h1>DTDC Tracking</h1>
                    <ArrowDropDownIcon className="w-auto h-8 cursor-pointer" onClick={() => { setHandleNewSection(!handleNewSection) }} />
                </div>
            }>
                <div id="tracking">
                    <div className="tracking-list">
                        {detailsArr?.length ? detailsArr :
                            <div className="p-2 flex items-center justify-center h-full">
                                <p className="text-lg font-semibold text-gray-400">Shipment has not been dispatched yet.</p>
                            </div>
                        }
                    </div>
                </div>
            </SimpleCard>
        </>
    )
}

export default AdminDTDCTracking

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