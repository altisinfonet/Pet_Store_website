import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { capitalize, createSlugModifier } from '../../util/_common'
import { useDispatch } from 'react-redux'
import { setLinkName } from '../../reducer/linkNameReducer'
import Link from 'next/link'

const MegaMenu2 = ({ menueArr, megaMenuClose, menueCloseMouseLeave, parent_slug }: any) => {

    const router = useRouter()
    const dispatch = useDispatch()

    const listingType = useSelector((state: any) => state?.listingTypeReducer?.value)
    const [menuLoopType, setMenuLoopType]: any = useState([])
    useEffect(() => {
        if (listingType?.type === "dog") {
            let _DOGS = menueArr?.length ? menueArr?.filter((val: any) => val?.menu_item_id?.name === "DOGS").map((v: any, i: number) => ({ data: v?.menu_item_id?.sub_categories, p_slug: v?.menu_item_id?.slug })) : null
            _DOGS[0]['data'] = _DOGS[0]['data'].map(createSlugModifier(_DOGS[0]['p_slug']));
            setMenuLoopType([_DOGS[0]['data']])
        }
        if (listingType?.type === "cat") {
            let _CATS = menueArr?.length ? menueArr?.filter((val: any) => val?.menu_item_id?.name === "CATS").map((v: any, i: number) => ({ data: v?.menu_item_id?.sub_categories, p_slug: v?.menu_item_id?.slug })) : null
            _CATS[0]['data'] = _CATS[0]['data'].map(createSlugModifier(_CATS[0]['p_slug']));
            setMenuLoopType([_CATS[0]['data']])
        }
        if (listingType?.type === "smAnimal") {
            let _SMANIMAL = menueArr?.length ? menueArr?.filter((val: any) => val?.menu_item_id?.name === "SMALL ANIMALS").map((v: any, i: number) => ({ data: v?.menu_item_id?.sub_categories, p_slug: v?.menu_item_id?.slug })) : null
            setMenuLoopType(_SMANIMAL);
            _SMANIMAL[0]['data'] = _SMANIMAL[0]['data'].map(createSlugModifier(_SMANIMAL[0]['p_slug']));
            setMenuLoopType([_SMANIMAL[0]['data']])
        }
    }, [listingType]);


    return (
        <div className="container-mgm z-index-999 position-relative">
            <div className="mega-menu1" onMouseLeave={menueCloseMouseLeave}>
                <div className="row gx-5">
                    {menuLoopType[0]?.length && menuLoopType[0]?.slice(0, 3)?.length ?
                        <div className='flex flex-col w-fit py-3'>
                            {menuLoopType[0]?.slice(0, 3)?.map((v: any, i: number) =>
                                <div key={i} className="col-lg-2 w-full">
                                    <Link href={`/product_category/${v?.slug_url}`}>
                                        <h4 className='menu-txt cursor-pointer uppercase' onClick={() => { megaMenuClose(); dispatch(setLinkName(v?.name)) }}>
                                            {v?.name}
                                        </h4>
                                    </Link>
                                    {v?.sub_categories?.length ? v?.sub_categories.map((val: any, idx: number) =>
                                        <Link key={idx} href={`/product_category/${val?.slug_url}`}>
                                            <p className='menu-para cursor-pointer uppercase menueSubText' onClick={() => { megaMenuClose(); dispatch(setLinkName(val?.name)) }}>{val?.name}</p>
                                        </Link>
                                    ) : null}
                                    {(i !== (menuLoopType[0]?.slice(0, 3)?.length - 1)) && <div className="bor my-2"></div>}
                                </div>
                            )}
                        </div> : null}

                    {menuLoopType[0]?.length && menuLoopType[0]?.slice(3, 5)?.length ?
                        <div className='flex flex-col w-fit py-3' style={{ backgroundColor: "#f9f9f9" }}>
                            {menuLoopType[0]?.slice(3, 5)?.map((v: any, i: number) =>
                                <div key={i} className="col-lg-2 w-full">
                                    <Link href={`/product_category/${v?.slug_url}`}>
                                        <h4 className='menu-txt cursor-pointer uppercase' onClick={() => { megaMenuClose(); dispatch(setLinkName(v?.name)) }}>{v?.name}</h4>
                                    </Link>
                                    {v?.sub_categories?.length ? v?.sub_categories.map((val: any, idx: number) =>
                                        <Link key={idx} href={`/product_category/${val?.slug_url}`}>
                                            <p className='menu-para cursor-pointer uppercase menueSubText' onClick={() => { megaMenuClose(); dispatch(setLinkName(val?.name)) }}>{val?.name}</p>
                                        </Link>
                                    ) : null}
                                    {(i !== (menuLoopType[0]?.slice(3, 5)?.length - 1)) && <div className="bor my-2"></div>}
                                </div>)}
                        </div> : null}

                    {menuLoopType[0]?.length && menuLoopType[0]?.slice(5, 8)?.length ?
                        <div className='flex flex-col w-fit py-3'>
                            {menuLoopType[0]?.slice(5, 8)?.map((v: any, i: number) =>
                                <div key={i} className="col-lg-2 w-full">
                                    <Link href={`/product_category/${v?.slug_url}`}>
                                        <h4 className='menu-txt cursor-pointer uppercase' onClick={() => { megaMenuClose(); dispatch(setLinkName(v?.name)) }}>{v?.name}</h4>
                                    </Link>
                                    {v?.sub_categories?.length ? v?.sub_categories.map((val: any, idx: number) =>
                                        <Link key={idx} href={`/product_category/${val?.slug_url}`}>
                                            <p className='menu-para cursor-pointer uppercase menueSubText' onClick={() => { megaMenuClose(); dispatch(setLinkName(val?.name)) }}>{val?.name}</p>
                                        </Link>
                                    ) : null}
                                    {(i !== (menuLoopType[0]?.slice(5, 8)?.length - 1)) && <div className="bor my-2"></div>}
                                </div>)}
                        </div> : null}

                    {menuLoopType[0]?.length && menuLoopType[0]?.slice(8, 10)?.length ?
                        <div className='flex flex-col w-fit py-3' style={{ backgroundColor: "#f9f9f9" }}>
                            {menuLoopType[0]?.slice(8, 10)?.map((v: any, i: number) =>
                                <div key={i} className="col-lg-2 w-full">
                                    <Link href={`/product_category/${v?.slug_url}`}>
                                        <h4 className='menu-txt cursor-pointer uppercase' onClick={() => { megaMenuClose(); dispatch(setLinkName(v?.name)) }}>{v?.name}</h4>
                                    </Link>
                                    {v?.sub_categories?.length ? v?.sub_categories.map((val: any, idx: number) =>
                                        <Link key={idx} href={`/product_category/${val?.slug_url}`}>
                                            <p className='menu-para cursor-pointer uppercase menueSubText' onClick={() => { megaMenuClose(); dispatch(setLinkName(val?.name)) }}>{val?.name}</p>
                                        </Link>
                                    ) : null}
                                    {(i !== (menuLoopType[0]?.slice(8, 10)?.length - 1)) && <div className="bor my-2"></div>}
                                </div>)}
                        </div> : null}

                    {menuLoopType[0]?.length && menuLoopType[0]?.slice(10, 12)?.length ?
                        <div className='flex flex-col w-fit py-3'>
                            {menuLoopType[0]?.slice(10, 12)?.map((v: any, i: number) =>
                                <div key={i} className="col-lg-2 w-full">
                                    <Link href={`/product_category/${v?.slug_url}`}>
                                        <h4 className='menu-txt cursor-pointer uppercase' onClick={() => { megaMenuClose(); dispatch(setLinkName(v?.name)) }}>{capitalize(v?.name)}</h4>
                                    </Link>
                                    {v?.sub_categories?.length ? v?.sub_categories.map((val: any, idx: number) =>
                                        <Link key={idx} href={`/product_category/${val?.slug_url}`}>
                                            <p className='menu-para cursor-pointer uppercase menueSubText' onClick={() => { megaMenuClose(); dispatch(setLinkName(val?.name)) }}>{capitalize(val?.name)}</p>
                                        </Link>
                                    ) : null}
                                    {(i !== (menuLoopType[0]?.slice(10, 12)?.length - 1)) && <div className="bor my-2"></div>}
                                </div>)}
                        </div> : null}

                    {menuLoopType[0]?.length && menuLoopType[0]?.slice(12, menuLoopType[0]?.length)?.length ?
                        <div className='flex flex-col w-fit py-3' style={{ backgroundColor: "#f9f9f9" }}>
                            {menuLoopType[0]?.slice(12, menuLoopType[0]?.length)?.map((v: any, i: number) =>
                                <div key={i} className="col-lg-2 w-full">
                                    <Link href={`/product_category/${v?.slug_url}`}>
                                        <h4 className='menu-txt cursor-pointer uppercase' onClick={() => { megaMenuClose(); dispatch(setLinkName(v?.name)) }}>{capitalize(v?.name)}</h4>
                                    </Link>
                                    {v?.sub_categories?.length ? v?.sub_categories.map((val: any, idx: number) =>
                                        <Link key={idx} href={`/product_category/${val?.slug_url}`}>
                                            <p className='menu-para cursor-pointer uppercase menueSubText' onClick={() => { megaMenuClose(); dispatch(setLinkName(val?.name)) }}>{capitalize(val?.name)}</p>
                                        </Link>
                                    ) : null}
                                    {(i !== (menuLoopType[0]?.slice(12, menuLoopType[0]?.length)?.length - 1)) && <div className="bor my-2"></div>}
                                </div>)}
                        </div> : null}
                </div>

            </div>
        </div>
    )
}

export default MegaMenu2