import { Autocomplete, Checkbox, styled, Table, TableBody, TableCell, TableHead, TableRow, TextField as MuiTextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SimpleCard from '../SimpleCard'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { _get, _post, _put } from '../../services';
import getUrlWithKey from '../../util/_apiUrl';
import { _SUCCESS } from '../../util/_reactToast';

interface formState2I {
    discountFiltertypeId: number;
    condition: string;
    discountId: number;
    metadata: string;
    preFilter?: any[];
    id?: any;
}

const RepeaterTable = ({ repeaterType, repeaterHeader, name, listedProductGetUrl, listedProductCreateUrl, listedProductUpdateUrl, addProductToListUrl, listedProductDeleteUrl }: any) => {

    const { product_search } = getUrlWithKey("products");

    const [productItemsListing, setProductItemsListing] = useState<any[]>([{}]);
    const [filteredSearchList, setFilteredSearchList] = useState<any[]>([])
    // const [listedProductData, setListedProductData] = useState<any[]>([])
    const [checkid, setCheckid] = useState(false);
    const [loading, setLoading] = useState(true);

    console.log(productItemsListing, "productItemsListing")

    const nothveId = () => {
        if (productItemsListing?.length) {
            let idCheck: any = productItemsListing.filter((item: any) => !item?.id).map((v: any) => (v?.ranking ? { isEmty: true } : { isEmty: false }));
            setCheckid(idCheck?.length ? idCheck[0]?.isEmty : false)
        }
    }

    const getListedProduct = async () => {
        try {
            const { data }: any = await _put(listedProductGetUrl, { "all": true })
            if (data?.success) {
                console.log(data?.data, "__data__")
                // setListedProductData()
                if (data?.data?.length) {
                    setProductItemsListing(data?.data.map((v: any) => (v?.product?.product_details?.id ?
                        { rank_id: v?.id, ranking: v?.ranking, id: v?.product?.product_details?.id, label: v?.product?.product_details?.name }
                        :
                        { rank_id: v?.id, ranking: v?.ranking, label: "" })))
                }
            }
        } catch (error) {
            console.log(error, "__error")
        } finally {
            setLoading(false);
        }
    }

    const createListedProduct = async () => {
        try {
            const { data }: any = await _post(listedProductCreateUrl, {})
            if (data?.success) {
                console.log(data?.data, "__data__")
                getListedProduct()
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const addProductInRank = async (rankId: any, productId: any) => {
        try {
            const { data }: any = await _post(addProductToListUrl,
                repeaterType === "featuredProducts" ?
                    { feature_product_id: rankId, product_id: productId }
                    :
                    repeaterType === "newArrivals" ?
                        { new_arrival_rank_id: rankId, product_id: productId }
                        :
                        repeaterType === "Offer" ?
                            { offer_rank_id: rankId, product_id: productId }
                            :
                            { best_selling_rank_id: rankId, product_id: productId })
            if (data?.success) {
                console.log(data?.data, "__data__")
                getListedProduct()
                // _SUCCESS(data?.massage)  
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const updateProductInList = async (productRankId: any, newProductId: any) => {
        try {
            if (newProductId) {
                const { data }: any = await _post(listedProductUpdateUrl,
                    repeaterType === "featuredProducts" ?
                        { feature_product_id: productRankId, new_product_id: newProductId }
                        :
                        repeaterType === "newArrivals" ?
                            { new_arrival_product_id: productRankId, new_product_id: newProductId }
                            :
                            repeaterType === "Offer" ?
                                { offer_id: productRankId, new_product_id: newProductId }
                                :
                                { best_selling_product_id: productRankId, new_product_id: newProductId })
                if (data?.success) {
                    console.log(data?.data, "__data__")
                    getListedProduct()
                    _SUCCESS(data?.massage)
                }
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const deleteProductFromList = async (productRankId: any) => {
        console.log(repeaterType, productRankId);
        try {
            if (productRankId) {
                const { data }: any = await _post(listedProductDeleteUrl,
                    repeaterType === "featuredProducts" ?
                        { feature_product_id: productRankId }
                        :
                        repeaterType === "newArrivals" ?
                            { arrival_id: productRankId }
                            :
                            repeaterType === "Offer" ?
                                { offer_id: productRankId }
                                :
                                { best_selling_id: productRankId })
                if (data?.success) {
                    console.log(data?.data, "__data__")
                    getListedProduct()
                    _SUCCESS(data?.massage)
                }
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const addNewList = () => {
        setProductItemsListing((prev) => [...prev, {}]);
        createListedProduct()
    };

    const handleGetSearch = async (value: any) => {
        try {
            const { data } = await _get(`${product_search}?search=${value}`);
            console.log('vi: ', data);
            if (data?.success && data?.data && data?.data?.length) {
                setFilteredSearchList(data.data);
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }

    const removeNewList = (idx: any, rankId?: any) => {
        if (rankId) {
            deleteProductFromList(rankId)
        } else {
            if (idx !== 1) {
                setProductItemsListing(productItemsListing.filter((item: any, index: any) => index !== idx))
            }
        }
    };

    const checkProductValue = (id: any, values: any) => {
        console.log(id, values, "idvalues")
        let checkProductValue: any = false
        if (values?.length) {
            checkProductValue = values.filter((v: any) => v?.id === id).map((val: any) => val?.id === id && val?.id)
        }
        return checkProductValue[0]
    }

    useEffect(() => {
        getListedProduct()
    }, [])

    useEffect(() => {
        nothveId()
    }, [productItemsListing]);

    if (loading) {
        return (
            <div className='flex w-full h-[70vh] items-center justify-center admin'>
                <div className="spinner"></div>
            </div>
        )
    }


    return (
        <div>
            <SimpleCard heading={repeaterHeader}>
                <Table stickyHeader aria-label="sticky table" className='table-auto w-full productTableCls border-x border-t border-boderclr'>
                    <TableHead className='bg-offWhite-01'>
                        <TableRow
                            hover
                            className=''
                        >
                            <TableCell className='w-[4%] bg-gray-200'></TableCell>
                            <TableCell className='w-[90%] bg-gray-200'>{name}</TableCell>
                            <TableCell className='w-[6%] bg-gray-200'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className=''>
                        {productItemsListing?.length ? productItemsListing?.map((val: any, i: number) => {
                            console.log(val?.id, "___val")
                            return (<TableRow
                                hover
                                className={`${!val?.id ? `bg-red-100` : `h-12`}`}
                                key={i}
                            >
                                <TableCell className='w-[4%] text-center border-r'>{val?.ranking}</TableCell>
                                <TableCell className='w-[90%] border-r'>
                                    <Autocomplete
                                        options={filteredSearchList}
                                        value={val}
                                        getOptionLabel={(option) => option.label}
                                        getOptionDisabled={(option) => option.id === checkProductValue(option.id, productItemsListing)}
                                        filterSelectedOptions={true}
                                        className='atocompleteCls w-full bg-white'
                                        renderInput={(params) => (<MuiTextField {...params} placeholder='Search Products' onChange={(e: any) => handleGetSearch(e.target.value)} />)}
                                        onChange={(e: any, v: any) => { val?.id ? updateProductInList(val?.rank_id, v?.id) : addProductInRank(val?.rank_id, v?.id); console.log(val?.id, v?.id, "validvid") }}
                                    />

                                </TableCell>
                                <TableCell align='center' className='w-[6%]'>
                                    <div className='flex items-center justify-center gap-1'>
                                        {checkid ?
                                            <HighlightOffIcon className='text-gray-500 w-7 h-7 cursor-not-allowed rotate-45' />
                                            :
                                            <HighlightOffIcon className='text-blue-500 w-7 h-7 cursor-pointer rotate-45' onClick={() => addNewList()} />
                                        }
                                        {val?.id ?
                                            <RemoveCircleOutlineIcon className='text-red-500 w-7 h-7 cursor-pointer' onClick={() => removeNewList(i, val?.rank_id)} />
                                            :
                                            <RemoveCircleOutlineIcon className='text-gray-500 w-7 h-7 cursor-not-allowed' />
                                        }
                                    </div>
                                </TableCell>
                            </TableRow>)
                        }
                        ) : null}
                    </TableBody>
                </Table>
            </SimpleCard>
        </div>
    )
}

export default RepeaterTable