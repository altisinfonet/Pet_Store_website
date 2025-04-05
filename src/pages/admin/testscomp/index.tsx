import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import productImage from "../../../../public/assets/admin/images/product.png"
import getUrlWithKey from '../../../Admin/util/_apiUrl';
import { useRead } from '../../../Admin/hooks';
import moment from 'moment';
import withProtectedRoute from '../../../Admin/services/withProtectedRoute';

const TestComp = () => {

    const [tabView, setTabView] = useState(false)

    const { get_product, get_product_details } = getUrlWithKey("products")
    const { sendData: getProductTag } = useRead({ selectMethod: "put", url: get_product, callData: { page: 1, rowsPerPage: 10 } });

    const header = [
        { field: 'Image', flag: "image" },
        { field: 'Name', flag: "name" },
        { field: 'SKU', flag: "sku" },
        { field: 'Stock', flag: "manage_stock" },
        { field: 'Price', flag: "price" },
        { field: 'Categories', flag: "categories" },
        { field: 'Tags', flag: "tags" },
        { field: 'Featured', flag: "featured" },
        { field: 'Stats', flag: "status" },
        { field: 'Date', flag: "date_modified_gmt" },
        { field: 'id', flag: "id" },
    ];

    const mappedBody = getProductTag.map((item: any) => {
        const newObj: any = {};
        header.forEach(headerItem => {
            const field: any = headerItem.field;
            const flag = headerItem.flag;
            newObj[flag] = { items: item[flag], field: headerItem.field };
        });
        return newObj;
    });

    useEffect(() => {
        console.log(mappedBody, "mappedBody__");
    }, [mappedBody])


    useEffect(() => {
        window.addEventListener("resize", function () {
            var updatedViewportWidth = window.innerWidth;
            var updatedViewportHeight = window.innerHeight;
            console.log("width:", updatedViewportWidth, "height:", updatedViewportHeight, "pixelView")
            if (updatedViewportWidth <= 1024) {
                setTabView(true)
            } else {
                setTabView(false)
            }
        })
    }, [])

    const [dynObject, setDynObject]: any = useState()

    useEffect(() => {
        header.forEach((obj: any) => delete obj.field);
        setDynObject(header)
    }, [])

    console.log(dynObject, "dynObject")

    return (
        <div>
            <Table className='table-auto w-full productTableCls '>
                <TableHead>
                    <TableRow
                        hover
                        role="checkbox"
                        sx={{ cursor: 'pointer' }}
                    >
                        <TableCell padding="checkbox">
                            <Checkbox />
                        </TableCell>
                        {!tabView ? header.map((col, index) => <TableCell key={index}>{col.field}</TableCell>) : null}
                        {/* {tabView ? header.map((col, index) => <TableCell key={index} className={`flex flex-col border-none`}>{col.field}</TableCell>) : null} */}
                    </TableRow>
                    {/* {tabView ? <>
                        {header.map((col, index) => <TableRow key={index}>{col.field}</TableRow>)}
                    </> : null} */}
                </TableHead>
                <TableBody>


                    {getProductTag.map((row: any, index: number) => {
                        return (
                            <React.Fragment key={index}>
                                {tabView ? (
                                    mappedBody.map((itm: any, idx: number) => {
                                        return (
                                            row?.id === itm?.id?.items ? (
                                                <TableRow key={idx}>
                                                    {dynObject.map((i: any, e: number) =>
                                                        <TableCell
                                                            key={e} className={`flex gap-8`}>
                                                            <span>{itm["name"]?.field}</span>
                                                            <span>{itm["name"]?.items || "--"}</span>
                                                        </TableCell>)}
                                                    <TableCell className={`flex gap-8`}>
                                                        <span>{itm?.sku?.field}</span>
                                                        <span>{itm?.sku?.items || "--"}</span>
                                                    </TableCell>
                                                    <TableCell className={`flex gap-8`}>
                                                        <span>{itm?.sku?.field}</span>
                                                        <span>{itm?.sku?.items || "--"}</span>
                                                    </TableCell>
                                                </TableRow>
                                            ) : null
                                        );
                                    })
                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default withProtectedRoute(TestComp)


const aaa = () => {
    const getProductTag: any = []
    const mappedBody: any = []
    const tabView = false
    return (
        <>
            {getProductTag.map((row: any, index: number) => {
                return (
                    tabView ?
                        <TableRow>
                            <TableCell>

                                {mappedBody.map((itm: any, idx: number) => {
                                    // row?.id === itm?.items?.id 
                                    console.log(row?.id, itm?.id?.items, "itm?.items?.id ")
                                    return (
                                        row?.id === itm?.id?.items ? <TableRow key={idx} >
                                            <TableCell className={`flex gap-8`}>
                                                <span>{itm[row?.name]?.field}</span>
                                                <span>{itm[row?.name]?.items || "--"}</span>
                                            </TableCell>
                                            <TableCell className={`flex gap-8`}>
                                                <span>{itm?.sku?.field}</span>
                                                <span>{itm?.sku?.items || "--"}</span>
                                            </TableCell>
                                            <TableCell className={`flex gap-8`}>
                                                <span>{itm?.sku?.field}</span>
                                                <span>{itm?.sku?.items || "--"}</span>
                                            </TableCell>
                                        </TableRow> : null)
                                }
                                )}
                                {/* <TableRow
                    hover
                    key={index}
                    sx={{ cursor: 'pointer' }}
                    className='flex flex-col'
                > */}
                                {/* <TableRow className='border-none'>
                        <Checkbox />
                    </TableRow> */}
                                <TableRow className='border-none'>
                                    <Image src={row?.Image ? row?.Image : productImage} alt='productImage' height={40} priority />
                                </TableRow>
                                <TableRow className='border-none'>{row?.name ? row?.name : "--"}
                                </TableRow>
                                <TableRow className='border-none'>{row?.sku ? row?.sku : "--"}</TableRow>
                                <TableRow className='w-[10%] border-none'><span className={`font-medium ${row?.manage_stock ? "text-lime-500" : "text-red-500"}`}>{row?.manage_stock ? "In stock" : "Out of stock"}</span>&nbsp;({row?.stock_quantity ? row?.stock_quantity : 0})</TableRow>
                                <TableRow className='border-none'>&#8377;{row?.price ? row?.price : "--"}</TableRow>
                                <TableRow className='border-none'>{row?.categories?.length ? `${row?.categories.map((i: any, e: number) => i?.name)},` : "--"}</TableRow>
                                <TableRow className='border-none'>{row?.tags ? row?.tags : "--"}</TableRow>
                                <TableRow className='border-none'>{row?.featured ? "00" : "--"}</TableRow>
                                <TableRow className='border-none'>{row?.status ? row?.status?.title + "ed" : "--"}</TableRow>
                                <TableRow className='border-none'>{row?.date_modified_gmt ? moment(row?.date_modified_gmt).format("DD/MM/YYYY") + " " + `at` + " " + moment(row?.date_modified_gmt).format("h:mm a") : "--"}</TableRow>
                                {/* </TableRow> */}
                            </TableCell>
                        </TableRow> : null
                );
            })
            }
        </>)
}