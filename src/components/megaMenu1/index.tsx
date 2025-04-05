import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { capitalize } from '../../util/_common'
import { setLinkName } from '../../reducer/linkNameReducer'
import { useDispatch } from 'react-redux'

const MegaMenuTest = ({ menueArr, megaMenuClose, menueCloseMouseLeave }: any) => {


    const router = useRouter()
    const dispatch = useDispatch()

    const listingType = useSelector((state: any) => state?.listingTypeReducer?.value)
    const [menuLoopType, setMenuLoopType]: any = useState([])
    useEffect(() => {
        if (listingType?.type === "brand") {
            const _BRAND = menueArr?.length ? menueArr?.filter((val: any) => val?.menu_item_id?.attributes?.name === "BRAND").map((v: any, i: number) => v?.menu_item_id?.attributes?.options) : null
            if (_BRAND?.length) {
                setMenuLoopType(..._BRAND)
            }
        }
    }, [listingType])


    const groupSize = 6; // Define the size of each group

    const newMenuLoop = [];
    for (let i = 0; i < menuLoopType?.length; i += groupSize) {
        newMenuLoop.push(menuLoopType?.slice(i, i + groupSize));
    }


    const [sideData, setSideData]: any = useState([]);

    let originalData: any = menuLoopType?.length ? menuLoopType?.map((v: any, i: number) => v?.name + "#" + v?.slug) : []

    useEffect(() => {
        // Sort the array alphabetically
        const sortedData = [...originalData].sort((a, b) => a.localeCompare(b));

        // Group the sorted array into separate arrays based on the starting letter
        const groupedData: any = {};
        sortedData.forEach(item => {
            const firstLetter = item.charAt(0).toUpperCase();
            if (!groupedData[firstLetter]) {
                groupedData[firstLetter] = [];
            }
            groupedData[firstLetter].push(item);
        });


        // Create separate arrays for each group dynamically
        const groupedArrays = [];
        for (let letter = 'A'; letter <= 'Z'; letter = String.fromCharCode(letter.charCodeAt(0) + 1)) {
            const groupName = letter;
            const groupArray = groupedData[groupName] || [];
            groupedArrays.push({ alphabate_array: groupArray, name: groupName });
        }

        // Set the state with the grouped arrays
        if (groupedArrays?.length) {
            setSideData(groupedArrays);
        }
    }, [originalData?.length])

    const splitData = (item: any) => {
        const parts = item.split('#');
        return { name: parts[0], slug: parts[1] };
    }


    return (

        <>
            <div className="container-mgm z-index-999 position-relative">
                <div className="mega-menu" onMouseLeave={menueCloseMouseLeave}>
                    <div className="row">
                        <div className="col-md-3">
                            <h3 className='acc-title1 shop'>Shop By Brand</h3>
                            <div className="mega-menu-section mt-3 overflowY-auto h-27rem">
                                <div className="mega-menu-section-txt">
                                    {sideData?.length ? sideData?.map((v: any, i: number) =>
                                        <ul key={i} className='p-0'>
                                            <li>
                                                {v?.alphabate_array?.length ? <Link href="javascript:void(0);"><h4 className='uppercase'>{v?.name}</h4></Link> : null}
                                            </li>
                                            {v?.alphabate_array?.length ? v?.alphabate_array.map((val: any, idx: number) =>
                                                <li key={idx} onClick={() => { router.push(`/shop/brand/${splitData(val)?.slug}`); megaMenuClose(); dispatch(setLinkName(splitData(val)?.name)) }}>
                                                    <Link href={`/shop/brand/${splitData(val)?.slug}`}><h5 className='uppercase'>{splitData(val)?.name}</h5></Link>
                                                </li>) : null}
                                        </ul>) : null}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-9 overflowY-auto h-27rem">
                            <div className="mega-menu-section1 overflowY-auto">

                                {newMenuLoop?.length ? newMenuLoop?.map((v: any, i: number) =>
                                    <div key={i} className={`${i >= 1 ? `mt-4 pt-2` : ``} row`} style={{ alignItems: "end" }}>
                                        {v?.length ? v.map((val: any, idx: number) =>
                                            <div key={idx} className="col-md-2" onClick={() => { router.push(`/shop/brand/${val?.slug}`); megaMenuClose(); dispatch(setLinkName(val?.name)) }}>
                                                <Link href={`/shop/brand/${val?.slug}`}>
                                                    <div><img src={val?.productTermImage?.image || "/assets/icon/breed-1.png"} alt="Megamenu-img" className={`breed-mg`} style={{ width: "auto", height: "98px" }} width={100} height={98} sizes="(min-width: 100px) 50vw, 100vw" /></div>
                                                    <h5 className='breed-title uppercase' dangerouslySetInnerHTML={{ __html: val?.name }} />
                                                </Link>
                                            </div>) : null}
                                    </div>) : null}

                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>

    )
}

export default MegaMenuTest