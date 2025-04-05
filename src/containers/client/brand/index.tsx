import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { capitalize } from '../../../util/_common'
import getUrlWithKey from '../../../util/_apiUrl'
import { useCreate } from '../../../hooks'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setLinkName } from '../../../reducer/linkNameReducer'
import { Skeleton } from '@mui/material'

const Brand = () => {

    const router = useRouter();
    const dispatch = useDispatch()

    const [brandMeta, setBrandMeta] = useState({ attribute_id: 1 })

    const { get_product_brand_list } = getUrlWithKey("client_apis")
    const { sendData: brand, loading: loading }: any = useCreate({ url: get_product_brand_list, callData: brandMeta });

    return (
        <div className='container '>
            <div className=" flex items-center justify-center w-full uppercase font-medium ppsL mt-4">
                <h1 className="sp-title" style={{ fontSize: "150%" }}>Brand</h1>
            </div>
            <div className='flex items-center wrap justify-center gap-4 mt-3'>
                {!loading ?
                    brand?.length ?
                        brand?.map((v: any, i: number) => {
                            return (
                                <div className="item" key={i} data-aos="zoom-in-down">
                                    <Link href={`/shop/brand/${v?.slug}`} className='flex flex-col items-center gap-1' onClick={() => { dispatch(setLinkName(v?.name)) }}>
                                        <div className="thumb flex justify-center items-center imagethumbwrap_">
                                            <img
                                                src={v?.productTermImage?.image ? v?.productTermImage?.image : "/assets/images/brandDam.png"}
                                                alt={v?.name}
                                                style={{
                                                    width: "170px",
                                                    height: "170px",
                                                    objectFit: "contain",
                                                    margin: "0 auto",
                                                    // borderRadius: "50%",
                                                    border: "1px solid #e4e4e4",
                                                    background: "#fafafa",
                                                    padding: "10px",
                                                }}
                                                height={170}
                                                width={170}

                                                loading="lazy"
                                                sizes="(min-width: 170px) 50vw, 100vw"
                                            />
                                        </div>
                                        <h5 className='m-0 imagethumbwrap_h5 color-e4509d' style={{ fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: capitalize(v?.name) }} />
                                    </Link>
                                </div>)

                        }) :
                        <div className='flex items-center justify-center w-full h-full'>
                            <h4>No data available</h4>
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
                    </div>}
            </div>
        </div>
    )
}

export default Brand