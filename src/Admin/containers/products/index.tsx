import React, { Children, useCallback, useEffect, useRef, useState } from 'react'
import SelectField from '../../components/SelectField';
import { Autocomplete, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField as MuiTextField, Tooltip, RadioGroup, Radio, Dialog, DialogContent, styled, tableCellClasses, Alert } from '@mui/material';
import productImage from "../../../../public/assets/images/product.png"
import moment from 'moment';
import getUrlWithKey from '../../util/_apiUrl';
import { useCreate, useDelete, useRead } from '../../../hooks';
import Image from 'next/image';
import ButtonField from '../../components/ButtonField';
import SearchField from '../../components/SearchField';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';
import FullpageModal from '../../components/FullPageModal';
import DynamicForm from '../../components/Form';
import Link from 'next/link';
import PinkPawsbutton from '../../components/PinkPawsbutton';
import TextAreaField from '../../components/TextAreaField';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import FormLayot from '../../components/FormLayout';
import ActionDrop from '../../components/ActionDrop';
import Pageination from '../../components/Pageination';
import useTabView from '../../../hooks/useTabView';
import SimpleCard from '../../components/SimpleCard';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ClearIcon from '@mui/icons-material/Clear';
import CkEditor from '../../components/CkEditor';
import TextField from '../../components/TextField';
import ImageUploader from '../../components/ImageUploader';
import CreateIcon from '@mui/icons-material/Create';
import { error } from 'console';
import { _get, _post, _put } from '../../../services';
import { capitalize, urlToFile } from '../../util/_common';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { _ERROR, _SUCCESS, _WARNING } from '../../util/_reactToast';
import SearchAndAddNewComponent from '../../components/searchAddNewComponent';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';

const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#000000",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const Products = () => {

    const field_text_Cls = `border border-gray-500 outline-none px-2 py-1 rounded`

    const [actionValue, setActionValue] = useState("delete")
    const [acordian, setAcordian]: any = useState("")
    const [checked1, setChecked1]: any = useState(false)
    const [checked2, setChecked2]: any = useState(false)
    const [dataSet, setDataSet]: any = useState()
    const [dataSet2, setDataSet2]: any = useState()
    const [dataSetCategory, setDataSetCategory]: any = useState()
    const [doTrashProd, setDoTrashProd]: any = useState()
    const [seoValue, setSeoValue] = useState("AllSeoScores")
    const [readabilityValue, setReadabilityValue] = useState("allReadabilityScores")
    const [productTypeValue, setProductTypeValue] = useState(null)
    const [stockStatusValue, setStockStatusValue] = useState(null)
    const [productDetails, setProductDetails]: any = useState({})
    const [openFullModal, setOpenFullModal] = useState(false)
    const [formdata, setFormdata] = useState({})
    const [shoCmntInptArea, setShoCmntInptArea] = useState(false)
    const [pageNo, setPageNo] = useState(1)
    const [prodCheck, setProdCheck]: any = useState({})
    const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
    const [searchDataValue, setSearchDataValue] = useState("")
    const [getCategory, setGetCategory]: any = useState({ dropdown: true })
    const [totalGetData, setTotalGetData] = useState("totalItem")
    const [totalpageNo, setTotalPageNo]: any = useState()
    const [getProductCategory, setGetProductCategory]: any = useState()
    const [showProductDataTab, setShowProductDataTab]: any = useState<string>("general")
    const initialSelectAttributesValue = { attribute: "", existing: false }
    const [selectAttributesValue, setSelectAttributesValue]: any = useState(initialSelectAttributesValue)
    const [addNewAttributes, setAddNewAttributes] = useState(false)
    const [attributesArray, setAttributesArray]: any = useState([])
    const [productTypeSelected, setProductTypeSelected]: any = useState("1")
    const [getproductAttributeCallData, setGetproductAttributeCallData]: any = useState()
    const [checkcategory, setCheckcategory]: any = useState<any[]>([])
    const [productName, setProductName]: any = useState("")
    const [editProductName, setEditProductName]: any = useState(false)
    const [checked, setChecked] = useState<any[]>([]);
    const [totalProductGetUrl, setTotalProductGetUrl] = useState("");
    const [productTypeList, setProductTypeList] = useState([]);
    const [productStockTypeList, setProductStockTypeList] = useState([]);
    const [statusId, setStatusId]: any = useState()
    const [openDilog, setOpenDilog]: any = useState(false)
    const [slugMeta, setSlugMeta]: any = useState("")
    const [downloadable, setDownloadable]: any = useState(false)
    const [virtual, setVirtual]: any = useState(false)
    const [fileRepeater, setFileRepeater]: any = useState([])
    const [file, setFile]: any = useState()
    const [confirmStatus, setConfirmStatus]: any = useState("")
    const [generalMetaregular_price, setGeneralMetaregular_price]: any = useState("")
    const [variationMetaregular_price, setVariationMetaregular_price]: any = useState("")
    const [variationMetaregular_priceErr, setVariationMetaregular_priceErr]: any = useState("");
    const [pageMetaInfoMeta_description, setPageMetaInfoMeta_description]: any = useState("")
    const [metaData, setMetaData]: any = useState({
        "meta_title": "",
        "meta_description": "",
        "meta_key": ""
    })
    const [editHsn, setEditHsn] = useState<boolean>(false)
    // const fetchVariationMetaregular_price = (regular_price:any) =>{
    //     if()
    //     if(regular_price){
    //         setVariationMetaregular_price(regular_price)
    //     } else {
    //         setVariationMetaregular_price("")
    //     }
    // }



    console.log(attributesArray, "attributesArray")
    console.log(slugMeta, "slugMeta")
    console.log(metaData, "metaData")
    console.log(stockStatusValue, productTypeValue, "wddwdwddw")
    console.log(productTypeSelected, "productTypeSelected")

    // ==================================APIS=============================================

    const { get_product, get_product_details, delete_product, total_items_product, update_product_image, update_product, delete_multiple_product, get_product_type, get_product_stock_type, create_product, get_status, update_product_status, admin_get_product_slug, upload_downloadable_file, hsn_search } = getUrlWithKey("products")
    const { get_product_attribute } = getUrlWithKey("product_attributes")
    const { get_product_tag } = getUrlWithKey("product_tags")

    // ==================================APIS=============================================

    useEffect(() => {
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo])

    const { sendData: totalProductsView }: any = useRead({ selectMethod: "get", url: totalProductGetUrl });
    const { sendData: getStatus }: any = useRead({ selectMethod: "put", url: get_status });

    const { sendData: productTypes }: any = useRead({ selectMethod: "get", url: get_product_type });

    const { sendData: productStockType }: any = useRead({ selectMethod: "get", url: get_product_stock_type });

    const { sendData: getProduct }: any = useRead({ selectMethod: "put", url: get_product, callData: getProd });
    const { sendData: getProduct_attribute }: any = useRead({ selectMethod: "put", url: get_product_attribute, callData: getproductAttributeCallData });

    useEffect(() => {

        if (productDetails) {
            setMetaData({
                "meta_title": productDetails?.meta_data?.meta_title,
                "meta_description": productDetails?.meta_data?.meta_description,
                "meta_key": productDetails?.meta_data?.meta_key
            })
        }
        else {
            ({
                "meta_title": '',
                "meta_description": '',
                "meta_key": ''
            })
            setPageMetaInfoMeta_description('')
        }

    }, [productDetails]);

    useEffect(() => {
        if (productTypes && productTypes?.length) {
            setProductTypeList(productTypes)
        }
    }, [productTypes]);

    useEffect(() => {
        if (productStockType && productStockType?.length) {
            setProductStockTypeList(productStockType);
        }
    }, [productStockType]);

    useEffect(() => {
        if (getProduct_attribute?.length) {
            setExistingAttributes(getProduct_attribute.map((v: any) => { return { ...v, checked: false } }))
        }
    }, [getProduct_attribute])

    useEffect(() => {
        setGetproductAttributeCallData({})
    }, [])


    useEffect(() => {
        setTotalProductGetUrl(total_items_product);
    }, []);

    useEffect(() => {
        console.log("totalProductView", totalProductsView)
        if (totalProductsView?.totalItem) {
            setTotalProductGetUrl("");
        }
    }, [totalProductsView])

    // data fetch or manipulate for metadata
    useEffect(() => {
        if (pageMetaInfoMeta_description) {
            setMetaData((pre: any) => ({
                ...pre,
                meta_description: pageMetaInfoMeta_description
            }))
        }

    }, [pageMetaInfoMeta_description])

    const { sendData: delProduct }: any = useDelete({
        selectMethod: "post",
        url: doTrashProd,
        callData: {
            product_id: prodCheck?.product_id as number,
            is_soft_delete: actionValue === "moveToTrash" ? true : actionValue === "restore" && false,
            is_hard_delete: actionValue === "deletePermanently" && true
        }
    });
    console.log(getProduct_attribute, "getProduct_attribute")

    const { tabView } = useTabView()

    useEffect(() => {
        if (totalGetData === "totalPublished") {
            let page = totalProductsView?.totalPublished < 10 ? 1 : Math.ceil((totalProductsView?.totalPublished / 10))
            setTotalPageNo(page)
        } else if (totalGetData === "totalDraft") {
            let page = totalProductsView?.totalDraft < 10 ? 1 : Math.ceil((totalProductsView?.totalDraft / 10))
            setTotalPageNo(page)
        } else if (totalGetData === "totalTrash") {
            let page = totalProductsView?.totalDraft < 10 ? 1 : Math.ceil((totalProductsView?.totalDraft / 10))
            setTotalPageNo(page)
        } else {
            setTotalPageNo()
        }
    }, [totalGetData])

    useEffect(() => {
        setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
        setProdCheck({})
        setDoTrashProd()
    }, [delProduct?.id])

    const getProductDetails = async (id: any) => {
        try {
            const { data } = await axios.get(`${get_product_details}/${id}`);
            console.log(data?.data, "wdwdwdwdwd")
            if (data?.success) {
                setProductDetails(data?.data);

                if (data?.data?.id) {
                    if (!openFullModal) {
                        setOpenFullModal(true)
                    }
                } else {
                    setOpenFullModal(false)
                }
            }
        } catch (error: any) {
            console.log("error", error);
        }
    }

    console.log(productDetails)

    const handleChangeStatus = async (prd_id: any, value: any) => {
        try {
            const { data } = await _post(update_product_status, { product_id: +prd_id, status_id: +value })
            if (data?.success) {
                _SUCCESS()
                setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    const header = [
        { field: "Image", icon: <ImageIcon /> },
        { field: 'Name' },
        { field: 'SKU' },
        { field: 'Stock' },
        { field: 'Price' },
        { field: 'Categories' },
        // { field: 'Tags' },
        // { field: 'Featured' },
        { field: 'Stats' },
        { field: 'Date' },
        { field: 'Action' },
    ];

    const actionArray = [
        // { value: "bulkAction", name: "Bulk action" },
        { value: "delete", name: "Delete" },
    ]
    // const actionArray = [
    //     { value: "bulkAction", name: "Bulk action" },
    //     { value: !getProd?.deleted_at ? "edit" : "restore", name: !getProd?.deleted_at ? "Edit" : "Restore" },
    //     { value: !getProd?.deleted_at ? "moveToTrash" : "deletePermanently", name: !getProd?.deleted_at ? "Move to trash" : "Delete permanently" },
    // ]

    const seoScoresArray = [
        { value: "AllSeoScores", name: "All SEO Scores" },
        { value: "SeoNeedsImprovement", name: "SEO: Needs improvement" },
        { value: "SeoOk", name: "SEO: Ok" },
        { value: "SeoGood", name: "SEO: Good" },
        { value: "SeoNoFocusKeyphrase", name: "SEO: No focus keyphrase" },
        { value: "SeoPostNoindexed", name: "SEO: Post noindexed" },
    ]

    const readabilityScorcesArray = [
        { value: "allReadabilityScores", name: "All readability scores" },
        { value: "readabilityNeedsImprovement", name: "Readability: Needs improvement" },
        { value: "readabilityOk", name: "Readability: Ok" },
        { value: "readabilityGood", name: "Readability: Good" },
    ]

    const productTypeArray = [
        { value: "filterByProductType", name: "Filter by product type" },
        { value: "simpleProduct", name: "Simple Product" },
        { value: "downloadable", name: "Downloadable" },
        { value: "virtual", name: "Virtual" },
        { value: "groupedProduct", name: "Grouped product" },
        { value: "externalAffiliateProduct", name: "External/Affiliate product" },
        { value: "variableProduct", name: "Variable product" },
    ]

    const stockStatusArray = [
        { value: "filterByStockStatus", name: "Filter by stock status" },
        { value: "inStock", name: "In Stock" },
        { value: "outOfStock", name: "Out of stock" },
        { value: "onBackOrder", name: "On backOrder" },
    ]

    const videoTypes = [
        { value: 0, name: "Select video type", checked: true },
        { value: 1, name: "Youtube video" },
        { value: 2, name: "Vimeo video" },
        { value: 3, name: "Self hosted video (MP4, WebM, and Ogg)" },
        { value: 4, name: "Other (embedUrl)" },
    ]

    const statusArr = [
        { id: "1", title: "Published" },
        { id: "1", title: "Draft" },
    ]

    const [existingAttributes, setExistingAttributes]: any = useState()
    console.log(existingAttributes, "existingAttributes")


    // const [productType, setProductType]: any = useState([
    //     { value: "simpleproduct", name: "Simple product", },
    //     { value: "variableproduct", name: "Variable product", },
    // ])

    const handleChangeAction = (e: any) => {
        setActionValue(e.target.value);
    }

    const handleChangeSeo = (e: any) => {
        setSeoValue(e.target.value);
    }

    const handleChangeReadability = (e: any) => {
        setReadabilityValue(e.target.value);
    }

    const getTotalPage = (): number => {
        console.log("list?.totalPage", totalProductsView?.totalPage)
        if (totalProductsView?.totalPage && totalProductsView?.totalPage !== 0) {
            return totalProductsView?.totalPage;
        } else if (totalProductsView?.totalPage === 0) {
            return 1;
        } else {
            return 0;
        }
    }

    const handleChangeProductType = (e: any) => {
        setProductTypeValue(e.target.value);
    }

    const handleChangeStockStatus = (e: any) => {
        setStockStatusValue(e.target.value);
    }

    const handleFilter = () => {
        console.log('--> ', stockStatusValue, productTypeValue)

        //     console.log("searchRes", value);
        // if (value) {
        setPageNo(1);
        setGetProd({
            page: 1, rowsPerPage: 10,
            stock_id: stockStatusValue ? +(stockStatusValue) : null,
            type_id: productTypeValue ? +(productTypeValue) : null
        });
        setTotalProductGetUrl(`${total_items_product}/${null}/${productTypeValue}/${stockStatusValue}`);
        // setStockStatusValue(null);
        // setProductTypeValue(null);
        // setTotalProductGetUrl(`${total_items_product}/${value}`);
        // } else {
        //     setPageNo(1);
        //     setGetProd({ page: 1, rowsPerPage: 10 });
        //     setTotalProductGetUrl(`${total_items_product}`);
        // }
    }


    const handleClearFilter = () => {
        console.log('--> ', stockStatusValue, productTypeValue)
        setPageNo(1);
        setGetProd({ page: 1, rowsPerPage: 10 });
        setTotalProductGetUrl(`${total_items_product}`);
        setStockStatusValue(null);
        setProductTypeValue(null);
    }

    const [generalMeta, setGeneralMeta]: any = useState({
        regular_price: "",
        sale_price: "",
        returnable: false,
        batch_available: false,
        importer_name: "",
        country_of_origin: "",
        download_limit: "",
        download_expiry: ""
    })

    useEffect(() => {
        setGeneralMeta((pre: any) => ({
            ...pre,
            regular_price: productDetails?.price ? productDetails?.price : "",
            sale_price: productDetails?.sale_price ? productDetails?.sale_price : "",
            returnable: productDetails?.returnable ? productDetails?.returnable : false,
            batch_available: productDetails?.batch_available ? productDetails?.batch_available : false,
            importer_name: productDetails?.importer_name ? productDetails?.importer_name : "",
            country_of_origin: productDetails?.country_of_origin ? productDetails?.country_of_origin : "",
            download_limit: productDetails?.download_limit ? productDetails?.download_limit : "",
            download_expiry: productDetails?.download_expiry ? productDetails?.download_expiry : "",
        }))
    }, [productDetails])

    const handleChangeGeneral = (e: any, ifCheckBox?: any) => {
        const { name, value, checked } = e.target;

        if (ifCheckBox) {
            setGeneralMeta((pre: any) => ({ ...pre, [name]: checked }))
        } else {
            setGeneralMeta((pre: any) => ({ ...pre, [name]: value }))
        }
    }

    console.log(generalMeta, "__generalMeta__")

    const [inventoryMeta, setInventoryMeta]: any = useState({
        backorders: "NO",
        backordered: false,
        backorders_allowed: false,
        store_wide_threshold: "",
        availability_date: "",
        sku: "",
        manage_stock: true,
        sold_individually: false,
    })

    useEffect(() => {
        setInventoryMeta((pre: any) => ({
            ...pre,
            stock_quantity: productDetails?.stock_quantity,
            sku: productDetails?.sku,
            store_wide_threshold: productDetails?.store_wide_threshold,
            backorders: productDetails?.backorders,
            backordered: productDetails?.backordered,
            backorders_allowed: productDetails?.backorders_allowed,
            manage_stock: productDetails?.manage_stock,
            // manage_stock: true,
            sold_individually: productDetails?.sold_individually,
        }))
    }, [productDetails])

    const handleChangeInventory = (e: any, ifCheckBox?: any) => {
        const { name, value, checked } = e.target;
        if (ifCheckBox) {
            setInventoryMeta((pre: any) => ({ ...pre, [name]: checked }))
        } else {
            // backorders
            // backorders_allowed
            // backordered
            if (name === "backorders") {
                setInventoryMeta((pre: any) => ({ ...pre, backorders_allowed: false, backordered: false }))
            } else if (name === "backorders_allowed") {
                setInventoryMeta((pre: any) => ({ ...pre, backorders_allowed: true, backordered: false }))
            } else if (name === "backordered") {
                setInventoryMeta((pre: any) => ({ ...pre, backorders_allowed: false, backordered: true }))
            } else {
                setInventoryMeta((pre: any) => ({ ...pre, [name]: value }))
            }

        }
    }
    console.log(inventoryMeta, "__inventoryMeta__")

    const [images, setImages] = useState<any>([]);
    const [imageError, setImageError] = useState("");
    // const initealvariationsMeta = {
    //     attribute_ids: [],
    //     enabled: false,
    //     sku: "",
    //     regular_price: "",
    //     sale_price: "",
    //     description: "",
    // }
    // const [variationsMeta, setVariationsMeta]: any = useState(initealvariationsMeta)

    // useEffect(() => {
    //     setVariationsMeta((pre: any) => ({
    //         ...pre,
    //         sku: productDetails?.sku ? productDetails?.sku : "",
    //         regular_price: productDetails?.price ? productDetails?.price : "",
    //         sale_price: productDetails?.sale_price ? productDetails?.sale_price : "",
    //     }))
    // }, [productDetails])

    const [variationsMeta, setVariationsMeta]: any = useState([])

    // const onAddmanuallyvariations = () => {
    //     setVariationsMeta((pre: any) => ([...pre, {
    //         temp_id: variationsMeta?.length ? variationsMeta?.length + 1 : 1,
    //         attribute_ids: [],
    //         enable: false,
    //         sku: productDetails?.sku,
    //         stock_quantity: "",
    //         regular_price: "",
    //         sale_price: "",
    //         description: "",
    //         remove: false,
    //         dimensions: {
    //             length: "",
    //             width: "",
    //             height: "",
    //             dimension_unit: ""
    //         },
    //         weight: "",
    //         weight_unit: "",

    //     }]))
    // }



    const onAddmanuallyvariations = () => {
        setVariationsMeta((pre: any) => {
            const newVariation = {
                temp_id: pre?.length ? pre?.length + 1 : 1,
                attribute_ids: [],
                enable: false,
                sku: productDetails?.sku,
                stock_quantity: "",
                regular_price: "",
                sale_price: "",
                description: "",
                remove: false,
                dimensions: {
                    length: "",
                    width: "",
                    height: "",
                    dimension_unit: ""
                },
                weight: "",
                weight_unit: "",
            };

            return [...pre, newVariation];
        });
    };




    const onRemovemanuallyvariations = (id: any, temp_id: any) => {
        if (temp_id) {
            setVariationsMeta(variationsMeta.filter((item: any) => item?.temp_id !== temp_id));
        } else {
            setVariationsMeta(variationsMeta.map((item: any) => item?.id === id ? { ...item, remove: true } : item));
        }

    }

    useEffect(() => {
        if (productDetails?.variations?.length) {
            // if (variationsMeta?.length) {
            //     // setVariationsMeta(variations.filter((v:any)=> v?.id === ))
            // }
            // setVariationsMeta(productDetails?.variations?.map((v: any) => ({ ...v, variation_id: v?.id })))
            setVariationsMeta(
                productDetails?.variations?.map((v: any) => ({
                    ...v,
                    variation_id: v?.id,
                    attribute_ids: v.productVariationTerms
                        ? v.productVariationTerms.map((term: any) => ({
                            id: term.attribute.id,
                            value_ids: [term.term.id],
                        }))
                        : [],
                }))
            );
            console.log(productDetails?.variations, "productDetails?.variations")
        }
    }, [productDetails])


    const handleChangeVariations = (val: any, e: any, ifCheckBox?: any, ifAttributes?: any, ifAttributesId?: any) => {
        const { name, value, checked } = e.target;

        // Track updates to variations
        let updatedVariations = [...variationsMeta];  // Copy the variations array to avoid direct mutation

        if (ifCheckBox) {
            // Checkbox change: Update only the relevant variation
            updatedVariations = updatedVariations.map((item: any) =>
                item?.id === val?.id ? { ...item, [name]: checked } : item
            );
        } else if (ifAttributes) {
            // Attribute change: Update attribute_ids array for the relevant variation
            updatedVariations = updatedVariations.map((item: any) => {
                if (item?.id === val?.id) {
                    const existingAttributeIndex = item.attribute_ids.findIndex(
                        (v: any) => v?.id === ifAttributesId?.id
                    );

                    // If attribute exists, update it; otherwise, add a new one
                    if (existingAttributeIndex !== -1) {
                        const updatedAttribute = {
                            ...item.attribute_ids[existingAttributeIndex],
                            value_ids: value ? [value] : [], // Update value_ids
                        };
                        return {
                            ...item,
                            attribute_ids: [
                                ...item.attribute_ids.slice(0, existingAttributeIndex),
                                updatedAttribute,
                                ...item.attribute_ids.slice(existingAttributeIndex + 1),
                            ],
                        };
                    } else {
                        return {
                            ...item,
                            attribute_ids: [
                                ...item.attribute_ids,
                                { id: ifAttributesId?.id, value_ids: value ? [value] : [] },
                            ],
                        };
                    }
                }
                return item;
            });
        } else if (name === "stock_quantity") {
            // Stock quantity change: Update the specific variation
            updatedVariations = updatedVariations.map((item: any) =>
                item?.id === val?.id ? { ...item, stock_quantity: value } : item
            );
        } else if (name === "height" || name === "width" || name === "length" || name === "dimension_unit") {
            // Dimension change: Ensure that we are only updating the correct field
            updatedVariations = updatedVariations.map((item: any) =>
                item?.id === val?.id
                    ? {
                        ...item,
                        dimensions: {
                            ...item.dimensions,
                            [name]: value,  // Update only the specific field
                        },
                    }
                    : item
            );
        } else {
            // Handle other fields generically
            updatedVariations = updatedVariations.map((item: any) =>
                item?.id === val?.id ? { ...item, [name]: value } : item
            );
        }

        // Apply the accumulated changes in one setState call
        setVariationsMeta(updatedVariations);
    };


    // variationsMeta, attributesArray
    const variationTearmValue = () => {
        // console.log(var_v,att_v, "_val__")
        // let arr = att_v.map((v:any)=> v?.id)
        // console.log(arr, "___arr___")

        let matches: any = [];

        // Iterate over arr1
        if (variationsMeta?.length && attributesArray?.length) {
            variationsMeta.forEach((attr: any) => {
                attr.options?.length && attr.options.forEach((option: any) => {
                    // Check each option's id against the term ids in arr2
                    attributesArray.forEach((item: any) => {
                        if (option.id === item.term.id) {
                            matches.push({
                                attribute: attr.name,
                                option: option.name,
                                term: item.term.name
                            });
                        }
                    });
                });
            });
        }
        console.log(matches, "_val__")
        // return matches;
    }

    useEffect(() => { variationTearmValue() }, [variationsMeta, attributesArray])

    const handleImage = (e: any) => {
        setImages(e);
        setImageError("");
    }
    console.log(variationsMeta, "variationsMeta")

    const handleChangeSelectAttributes = (e: any, existing: boolean) => {
        const { name, value, id } = e.target
        setSelectAttributesValue((pre: any) => ({
            ...pre,
            [name]: value,
            existing: existing,
            att_id: existingAttributes?.length ? existingAttributes?.filter((val: any) => val?.name === value).map((v: any) => v?.id) : ""
        }));
        setExistingAttributes((pre: any) => ([...pre, { checked: true }]))
        setExistingAttributes(existingAttributes.map((item: any) =>
            item.name === value ? { ...item, checked: true } : item
        ));
        setAddNewAttributes(true)
    }

    useEffect(() => {
        if (selectAttributesValue?.attribute) {
            setAttributesArray((pre: any) => ([...pre, {
                id: pre?.length ? pre?.length + 1 : 1,
                att_id: +selectAttributesValue?.att_id[0],
                name: selectAttributesValue?.attribute,
                existing: selectAttributesValue?.existing,
                options: [],
                visible: true,
                variation: true,
                remove: false
            }]))
        }
    }, [selectAttributesValue])

    useEffect(() => {
        if (productDetails?.attributes) {
            const attributes = productDetails?.attributes?.length ? productDetails?.attributes.map((v: any) => ({ ...v, att_id: `${v?.id}`, existing: true })) : []
            console.log(attributes, "_attributes_")
            // setAttributesArray((pre: any) => ([...pre, ...attributes]))
            setAttributesArray(attributes)
        }
    }, [productDetails])

    // const attributesVisible = (id: any) => {
    //     let check:any = false;
    //     if (productDetails?.product_attribute_items?.length) {
    //         check = productDetails?.product_attribute_items.filter((itm: any) => itm?.attribute_id === id).map((v: any) => v?.visible)
    //     }
    //     console.log(check[0], "__check")
    //     return check[0]
    // }
    // const attributesVariation = (id: any) => {
    //     let check:any = false;
    //     if (productDetails?.product_attribute_items?.length) {
    //         check = productDetails?.product_attribute_items.filter((itm: any) => itm?.attribute_id === id).map((v: any) => v?.variation)
    //     }
    //     console.log(check[0], "__check")
    //     return check[0]
    // }

    const onAddNewAttributes = () => {
        setAddNewAttributes(true);
        setSelectAttributesValue(initialSelectAttributesValue)
        setAttributesArray((pre: any) => ([...pre, {
            id: pre?.length ? pre?.length + 1 : 1,
            visible: true,
            variation: true
        }]))
    }

    const [attDummyArr, setAttDummyArr] = useState([])
    // [
    //     {
    //         id: "461",
    //         name: "Beagle1",
    //         slug: "beagles1"
    //     }
    // ]

    const getAttById = async (id: any) => {
        try {
            const { data } = await _get(`${get_product_attribute}/${id}`)
            if (data.success) {
                console.log(data?.data?.options, "aTTdata")
                setAttDummyArr(data?.data?.options)
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const updateNewAttributes = (id: number, e: any, existing: boolean, ifCheckBox?: boolean) => {
        try {
            if (existing) {
                // let datArr = attributesArray.map((item: any) => item?.options)
                // console.log(...datArr, "_datArr_")
                // setAttributesArray(attributesArray.map((item: any) =>
                //     item?.id === id ? { ...item, options: e?.length ? e.concat(item?.options) : item?.options } : item
                // ));

                setAttributesArray(attributesArray.map((item: any) => {
                    if (item?.id === id) {
                        const combinedOptions = e?.length ? e.concat(item?.options) : item?.options;
                        const uniqueOptions = combinedOptions.filter((option: any, index: any) => combinedOptions.indexOf(option) === index);
                        console.log(combinedOptions, uniqueOptions, "uniqueOptions")
                        return { ...item, options: uniqueOptions };
                    }
                    return item;
                }));
            } else if (ifCheckBox) {
                const { name, checked } = e.target;
                setAttributesArray(attributesArray.map((item: any) =>
                    item?.id === id ? { ...item, [name]: checked } : item
                ));
            } else {
                const { name, value } = e.target;
                if (name === "values") {
                    setAttributesArray(attributesArray.map((item: any) =>
                        item?.id === id ? { ...item, [name]: value.split('|').map((option: any) => ({ name: option.trim(), slug: option.trim() })) } : item
                    ))
                } else {
                    setAttributesArray(attributesArray.map((item: any) =>
                        item?.id === id ? { ...item, [name]: value, slug: value } : item
                    ));
                }
            }
        } catch (error) {
            console.log(error, "__error")
        }
    };

    const handleDeleteTerms = (att_id: any, id: any) => {
        setAttributesArray(
            attributesArray.map((item: any) => item?.id === att_id ? ({ ...item, options: item?.options.filter((item: any) => item?.id !== id) }) : item)
        )
    }

    const [openPermalink, setOpenPermalink] = useState(false)
    const [permalink, setPermalink]: any = useState("")
    const onEditPermalink = (pl: any) => {
        setOpenPermalink(true)
        setPermalink(pl)
    }

    const deleteNewAttributes = (id: number, name?: any) => {
        // setAttributesArray(attributesArray.filter((item: any) => item?.id !== id));
        setAttributesArray(attributesArray.map((item: any) =>
            item?.id === id ? { ...item, remove: true, visible: false, variation: false } : item
        ));
        console.log(name, "___name")
        setExistingAttributes(existingAttributes.map((item: any) =>
            item.name === name ? { ...item, checked: false } : item
        ));
    };

    const [openEditVariations, setOpenEditVariations]: any = useState()

    console.log(selectAttributesValue, "SelectAttributesValue")
    const onHandleAcordian = (id: any) => {
        if (id === acordian) {
            setAcordian("")
        } else {
            setAcordian(id)
        }
    }

    const [videoMeta, setVideoMeta]: any = useState([])

    useEffect(() => {
        if (productDetails?.product_videos?.length) {
            setVideoMeta(productDetails?.product_videos.map((v: any, e: any) => ({ ...v, meta_id: (e + 1), video_id: v?.id, video_url: v?.url })))
        }
    }, [productDetails])

    const addNewVideo = () => {
        setVideoMeta((pre: any) => ([...pre, { meta_id: pre.meta_id ? pre.meta_id + 1 : 1 }]))
    }

    const removeVideo = (id: any) => {
        // setVideoMeta(videoMeta.filter((item: any) => item?.id !== id));
        setVideoMeta(videoMeta.map((item: any) =>
            item?.meta_id === id ? { ...item, remove: true } : item
        ));
    }

    const selectvideoTypes = (value: any, index: number) => {
        console.log(value, "name, value")
        setVideoMeta((pre: any) => {
            return pre.map((meta: any, i: number) =>
                i === index ? { ...meta, video_type_id: value } : meta
            );
        });

    }

    const addVideoUrl = (e: any, index: number) => {
        const { name, value } = e.target
        setVideoMeta((pre: any) => {
            return pre.map((meta: any, i: number) =>
                i === index ? { ...meta, [name]: value } : meta
            );
        });
    }

    console.log(videoMeta, "videoMeta")

    // update product image
    // update_product_image
    const [editEmage, setEditEmage]: any = useState(false)
    const [productImages, setProductImages] = useState<any>([]);
    const [editGalleryEmage, setEditGalleryEmage]: any = useState(false)
    const [productGalleryImages, setProductGalleryImages] = useState<any>([]);

    console.log(productImages, "productImages")
    const handleProductImage = (e: any) => {
        setProductImages(e);
    }

    const handleProductGalleryImage = (e: any) => {
        setProductGalleryImages(e);
    }

    const updateProductImage = async (productId: any, currentMainImageId: any, currentMainImageName: any) => {
        if (productImages?.length) {
            let formData = new FormData();
            formData.append('product_image', productImages[0]['file']);
            formData.append('product_id', productId);

            if (currentMainImageId != '' && currentMainImageName != '') {
                formData.append('old_product_image[0][id]', currentMainImageId);
                formData.append('old_product_image[0][name]', currentMainImageName);
            }

            try {
                const { data } = await _post(update_product_image, formData)
                if (data?.success) {
                    getProductDetails(productId);
                    setEditEmage(false)
                    _SUCCESS(data?.massage)
                    setEditEmage(false);
                    setProductImages([]);
                }
            } catch (error) {
                console.log(error, "_error")
                _ERROR(error?.response?.data?.massage || "Something went wrong!")
            }
        }
    }

    const updateProductGalleryImage = async (productId: any) => {
        let fromDataImages = productGalleryImages?.length && productGalleryImages.map((v: any) => v?.file)
        if (fromDataImages?.length) {
            let formData = new FormData();
            fromDataImages.map((value: any) =>
                formData.append('product_gallery_image', value)
            )
            formData.append('product_id', productId);
            try {
                const { data } = await _post(update_product_image, formData)
                if (data?.success) {
                    getProductDetails(productId);
                    setEditGalleryEmage(false)
                    _SUCCESS(data?.massage)
                }
            } catch (error) {
                console.log(error, "_error")
            }
        }
    }


    const deleteProductImage = async (productId: any, imageId: any, imageName: any) => {
        let formData = new FormData();
        formData.append('old_product_image[0][id]', imageId);
        formData.append('old_product_image[0][name]', imageName);
        formData.append('product_id', productId);
        try {
            const { data } = await _post(update_product_image, formData)
            if (data?.success) {
                getProductDetails(productId);
            }
        } catch (error) {
            console.log(error, "_error")
        }
    }

    const [tagsArray, setTagsArray]: any = useState([])
    const [tagsMeta, setTagsMeta]: any = useState([])

    const [hsnArray, setHsnArray]: any = useState([])
    const [hsnMeta, setHsnMeta]: any = useState(productDetails?.hsn_id ? productDetails?.hsn_id : "")

    console.log(tagsMeta, "tagsArray_tagsMeta")

    const addTagMeta = (v: any) => {
        let tagNewArray = [];

        if (v?.length) {
            tagNewArray = v?.map((val: any) => ({ id: val?.id }));
        }

        // Combine the existing tagsMeta with the new array
        const combinedArray = [...tagsMeta, ...tagNewArray];

        // Use a Set to track unique IDs and filter out duplicates
        const uniqueTagsMeta = combinedArray.filter((tag: any, index: any, self: any) =>
            index === self.findIndex((t: any) => t.id === tag.id)
        );

        setTagsMeta(uniqueTagsMeta);
    }

    const handleDeleteTags = (id: any) => {
        setTagsMeta(tagsMeta.map((item: any) =>
            item?.id === id ? { ...item, remove: true } : item
        ));
        // setTagsMeta((pre: any) => pre.map((v: any) => v?.id === id ? ([...pre, { id: v?.id, remove: true }]) : pre))
    }

    useEffect(() => {
        let arr = []
        if (productDetails?.tags?.length) {
            arr = productDetails?.tags.map((v: any) => ({ id: v?.id }))
        }
        setTagsMeta(arr)
    }, [productDetails])

    const getTags = async () => {
        try {
            const { data } = await _put(get_product_tag)
            if (data?.success) {
                setTagsArray(data?.data)
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    useEffect(() => {
        const getHsn = async () => {
            try {
                const { data } = await _get(hsn_search)
                if (data?.success) {
                    setHsnArray(data?.data)
                }
            } catch (error) {
                console.log(error, "__error")
            }
        }

        getHsn();
    }, [])

    const checkTags = (id: any) => {
        let checkTags: any = false
        if (productDetails?.tags?.length) {
            checkTags = productDetails?.tags.filter((v: any) => v?.id === id).map((val: any) => val?.id === id && val?.id)
        }
        return checkTags[0]
    }

    const checkAttribiutesValue = (id: any, values: any) => {
        let checkAttribiutesValue: any = false
        if (values?.length) {
            checkAttribiutesValue = values.filter((v: any) => v?.id === id).map((val: any) => val?.id === id && val?.id)
        }
        return checkAttribiutesValue[0]
    }

    const dynamicFormObject = {
        "Video_Ttype": {
            type: "dropField",
            id: "videoType",
            name: "videoType",
            label: "Video type",
            MenuItem: [
                { value: "Select video type", name: "Select video type", disabled: true },
                { value: "Youtubevideo", name: "Youtube video" },
                { value: "Vimeovideo", name: "Vimeo video" },
                { value: "Selfhostedvideo (MP4, WebM, and Ogg)", name: "Self hosted video (MP4, WebM, and Ogg)" },
                { value: "Other(embedUrl)", name: "Other (embedUrl)" },
            ],
            defaultVal: "Youtube video",
        },
        "Video_Url": {
            type: "textField",
            id: "Video url",
            name: "Video url",
            label: "Video url",
            variant: "outlined",
            helperText: "https://www.youtube.com/embed/....."
        },
    }

    const dynamicCategoiFormObject = {
        "categori_name": {
            type: "textField",
            id: "categori_name",
            name: "Categori name",
            label: "Categori name",
            variant: "outlined",
        },
        "Parent_category": {
            type: "dropField",
            id: "Parent_category",
            name: "Parent_category",
            label: "Parent category",
            MenuItem: getProductCategory,
            dynmicList: true,
            // MenuItem: [
            //     { value: "ParentCategory", name: "Parent category" },
            //     { value: "vimeoVideo", name: "Vimeo video" },
            //     { value: "selfHostedVideo", name: "Self hosted video (MP4, WebM, and Ogg)" },
            //     { value: "other", name: "Other (embedUrl)" },
            // ],
            defaultVal: "Youtube video",
        }
    }

    const dynamicFormObjectVideoSchema = {
        "Video_Url": {
            type: "textField",
            fieldType: "date",
            id: "upload_Date",
            name: "upload_Date",
            label: "Upload date",
            variant: "outlined",
            helperText: "The date the video was first published."
        },
        "Video_Uri2":
        {
            type: "textField",
            fieldType: "text",
            id: "Video_Name",
            name: "Video_Name",
            label: "Video name",
            variant: "outlined",
            helperText: "The title of the video."
        },
        "Video_Uri3": {
            type: "textAreaField",
            id: "Video_Description",
            name: "Video_Description",
            label: "Video description",
            variant: "outlined",
            dynFormTextAreaFieldCls: "w-60 p-1",
            helperText: "The description of the video."
        },

    }

    const handleToggle = () => {
        setDoTrashProd(delete_product);
    }

    console.log(dataSetCategory, "dataSetCategory")
    console.log(totalProductsView?.totalPage, "totalProductsView")
    console.log(delProduct?.id, "delProduct")
    console.log(actionValue, prodCheck, doTrashProd, "doTrashProddoTrashProd")
    console.log(getProd, "getProd")
    console.log(getProduct, "getProduct")
    console.log(productDetails, "productDetails")
    console.log(dynamicFormObjectVideoSchema, "dynamicFormObjectVideoSchema")
    console.log(formdata, "formdata__");
    console.log(dataSet, "dataSet")
    console.log(shoCmntInptArea, "shoCmntInptArea")
    console.log(dataSet, checked2, "pr__c")
    console.log(formdata, "<_|formdata")
    console.log(getStatus, "getStatus")


    const { get_product_category } = getUrlWithKey("products_categories")
    const { sendData: category }: any = useRead({ selectMethod: "put", url: get_product_category, callData: getCategory });

    // const listInnerRef: any = useRef();
    // console.log(listInnerRef.current.scrollTop, "listInnerRef")

    // const onScroll = () => {
    //     if (listInnerRef.current) {
    //         const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
    //         if (scrollTop + clientHeight === scrollHeight) {
    //             setGetCategory({ ...getCategory, page: getCategory.page + 1 })
    //         }
    //     }
    // };

    useEffect(() => {
        // if (!category?.length) {
        //     setGetCategory({ page: 1, rowsPerPage: 10, dropdown: true })
        // }
        setGetProductCategory(category)
    }, [category])

    console.log(getProductCategory, "getProductCategory")
    // const [reviews, setReviews]: any = useState();
    const [productDescription, setProductDescription]: any = useState();
    const [productShortDescription, setProductShortDescription]: any = useState();

    useEffect(() => {
        if (productDetails?.description) {
            setProductDescription(productDetails?.description)
        }

        if (productDetails?.short_description) {
            setProductShortDescription(productDetails?.short_description)
        }
        // if (productDetails?.review) {
        //     setProductShortDescription(productDetails?.review)
        // } else {
        //     setProductShortDescription()
        // }
        if (productDetails?.name) {
            setProductName(productDetails?.name)
        }
        if (productDetails?.type_id) {
            setProductTypeSelected(productDetails?.type_id)
        }
    }, [productDetails])

    const handelCategoryCheckBox = (e: any, v: any) => {
        const arr = [...checkcategory];
        if (e?.target?.checked) {
            arr.push(v);
            setCheckcategory(arr);
        } else {
            setCheckcategory(arr.filter((item: any) => item !== v))
        }
    }

    const checkCategory = (id: any) => {
        let checkCate: any = false
        if (productDetails?.categories?.length) {
            checkCate = productDetails?.categories.filter((v: any) => v?.id === id).map((val: any) => val?.id === id)
        }
        return checkCate[0]
    }
    useEffect(() => {
        let arr = []
        if (productDetails?.categories?.length) {
            arr = productDetails?.categories?.length ? productDetails?.categories.map((v: any) => v?.id) : []
            setCheckcategory(arr)
        }
        setPermalink(productDetails?.slug)
    }, [productDetails])

    console.log(checkCategory("26"), "__checkCategory")

    console.log(checkcategory, "checkcategory")

    const handelTableCheckBox = (e: any, v: any) => {
        const arr = [...checked];
        if (e?.target?.checked) {
            arr.push(v);
            setChecked(arr);
        } else {
            setChecked(arr.filter((item: any) => item !== v))
        }
    }

    const handelAllChecked = (e: any) => {
        if (e?.target?.checked && getProduct && getProduct?.length) {
            const arr = [];
            for (let g = 0; g < getProduct.length; g++) {
                if (getProduct[g] && getProduct[g]?.id) {
                    arr.push(getProduct[g]?.id);
                }
            }
            setChecked(arr);
        } else {
            setChecked([]);
        }
    }

    const handleApply = async () => {
        try {
            if (actionValue === 'delete' && checked?.length) {
                const { data } = await axios.post(`${delete_multiple_product}`, { product_ids: checked });
                if (data?.success) {
                    _SUCCESS(data?.massage);
                    // setFields(defaultFieldSet);
                    // setPageNo(1)
                    setGetProd({ page: pageNo, rowsPerPage: 10 })
                    setActionValue("delete");
                    setChecked([]);
                    setTotalProductGetUrl(total_items_product);
                }
            }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const handleApplyDelete = async (delId: any) => {
        // console.log("handelApply", actionValue, checked);

        const { data } = await axios.post(`${delete_multiple_product}`, { product_ids: [delId] });
        if (data?.success) {
            console.log("handelApply-data", data);
            _SUCCESS(data?.massage);
            // setFields(defaultFieldSet);
            // setPageNo(1)
            setGetProd({ page: pageNo, rowsPerPage: 10 })
            setActionValue("delete");
            setChecked([]);
            setTotalProductGetUrl(total_items_product);
            setConfirmStatus("");
        }
    }

    const Productcategories = ({ dynArr }: any) => {
        return (
            <>
                {dynArr?.map((category: any, index: number) => {
                    // console.log((getProductCategory.length - 1) === index, "getProductCategory.length")
                    return (
                        <div key={index} className='flex flex-col justify-start '>
                            <div className='flex relative justify-start gap-2 items-start'>
                                <div className='flex items-center'>
                                    {category?.parent === null ? <div className='p-0.5 rounded-full bg-black'></div> : null}
                                    {category?.parent === null ? null : <div className='border-r borderb-1px border-black h-full -top-[0.7rem] absolute'></div>}
                                    {category?.parent === null ? <div className='w-2'></div> : <div className='border-b borderb-1px border-black w-3 mt-1.5'></div>}
                                    <input type='checkbox' className="z-10 mt-1.5" checked={checkcategory.includes(category?.id)} onChange={(e: any) => handelCategoryCheckBox(e, category?.id)} />
                                </div>
                                <span>{category.name}</span>
                            </div>
                            <div className='pl-[18px]'>
                                {/* Render subcategories */}
                                <Productcategories dynArr={category?.sub_categories} />
                            </div>
                        </div>
                    )
                })}

            </>
        )
    }
    const autocompleteSelect = [
        { label: 'dog0 1994', id: "0_id" },
        { label: 'cat0 1972', id: "1_id" },
        { label: 'dog1 1974', id: "2_id" },
        { label: 'cat1 2008', id: "3_id" },
        { label: 'dog2 1957', id: "4_id" },
        { label: 'cat2 1993', id: "5_id" },
        { label: 'dog3 1994', id: "6_id" },
        { label: 'cat3 1996', id: "7_id" },
    ]

    // const [multitagSelect, setMultitagSelect]: any = useState([])
    // console.log(multitagSelect, "multitagSelect")

    // const checkItem = () => {
    // let arr1 =  category.map((i:any,)=> )
    // console.log(productDetails?.categories, category, "productDetails_categories")
    // }

    // useEffect(()=> {
    //     checkItem()
    // },[productDetails?.categories])

    const deleteDraft = async () => {
        try {
            if (productDetails?.id) {
                const { data } = await axios.post(`${delete_multiple_product}`, { product_ids: [productDetails?.id] });
                if (data?.success) {
                    console.log("handelApply-data", data);
                    _SUCCESS(data?.massage);
                    // setFields(defaultFieldSet);
                    setPageNo(1)
                    setActionValue("delete");
                    setChecked([]);
                    setTotalProductGetUrl(total_items_product);
                    setProductDetails({});
                    setOpenFullModal(false);
                    setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10 });
                    setEditEmage(false);
                    setProductImages([]);
                    setOpenDilog(false)
                    setSlugMeta("")
                    productName("")
                    setPermalink("")
                }
            }
        } catch (error) {
            console.log(error, "_error_")
        }
    }

    const saveDraft = async () => {
        try {
            if (productDetails?.id) {
                setOpenDilog(false);
                setProductDetails({});
                setOpenFullModal(false);
                setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10 });
                setEditEmage(false);
                setProductImages([]);
                setSlugMeta("")
            } else {
                const { data }: any = await _post(create_product, { name: productName, slug: slugMeta, })
                console.log(data, "_success_")
                if (data?.success) {
                    setOpenDilog(false);
                    setProductDetails({});
                    setOpenFullModal(false);
                    setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10 });
                    setEditEmage(false);
                    setProductImages([]);
                    setSlugMeta("")
                }
            }
        } catch (error) {
            console.log(error, "_error_")
        }

    }

    const closeFullPageModal = () => {
        if (slugMeta === "") {
            setProductDetails({});
            // handleClearFilter();
            // handleFilter();
            setOpenFullModal(false);
            // setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10 });
            setEditEmage(false);
            setProductImages([]);
            setSlugMeta("")
        } else {
            setOpenDilog(true)
            // handleFilter();
        }
    }

    useEffect(() => {
        if (productDetails?.id && productDetails?.status?.title !== "Draft" && slugMeta !== "") {
            setSlugMeta("")
        }
    }, [productDetails, slugMeta])

    const ProductDetailsEdit = () => {

        const [productDataDetailsArray, setProductDataDetailsArray]: any = useState()

        const productDataDetails = [
            { name: "general" },
            { name: "inventory" },
            { name: "attributes" },
        ]

        const productDataDetails2 = [
            { name: "general" },
            { name: "inventory" },
            { name: "attributes" },
            { name: "variations" },
        ]

        useEffect(() => {
            if (productTypeSelected === "2") {
                setProductDataDetailsArray(productDataDetails2)
                // setGeneralMeta((pre: any) => ({ ...pre, regular_price: "", sale_price: "", }))
            } else {
                setProductDataDetailsArray(productDataDetails)
            }
            setShowProductDataTab("general")
        }, [productTypeSelected])

        const [updateProductFromData, setUpdateProductFromData]: any = useState({
            "product_details": {
                "stock_status_id": 2,
                "status_id": 1,
            },
        })

        // useEffect(() => {
        //     let valid = 3;
        //     if (productTypeSelected !== "2") {
        //         if (generalMeta?.regular_price && productName !== "") {
        //             valid = 1;
        //         }
        //     } else {
        //         if (variationsMeta?.length) {
        //             variationsMeta.map((v: any) => {
        //                 if (v?.regular_price && productName !== "") {
        //                     valid = 1;
        //                 }
        //             })
        //         }
        //     }
        //     if (valid === 1) {
        //         setStatusId(valid)
        //     }
        //     console.log(valid, productTypeSelected, '__valid')
        // }, [productName, generalMeta, productTypeSelected, variationsMeta])


        const [dimension_unit, setdimension_unit] = useState("");
        const [length, setlength] = useState("");
        const [width, setwidth] = useState("");
        const [height, setheight] = useState("");
        const [weight, setweight] = useState("");
        const [weight_unit, setweight_unit] = useState("");

        useEffect(() => {
            if (productDetails) {
                setdimension_unit(productDetails ? productDetails?.dimensions?.dimension_unit : "")
                setlength(productDetails ? productDetails?.dimensions?.length : "")
                setwidth(productDetails ? productDetails?.dimensions?.width : "")
                setheight(productDetails ? productDetails?.dimensions?.height : "")
                setweight(productDetails ? productDetails?.weight : "")
                setweight_unit(productDetails ? productDetails?.weight_unit : "")
            }
        }, [productDetails])
        // const [dimension_unit, setdimension_unit] = useState(productDetails && productDetails?.dimension_unit?.dimention_unit || "cm");
        // const [length, setlength] = useState(productDetails && productDetails?.dimension_unit?.length || "");
        // const [width, setwidth] = useState(productDetails && productDetails?.dimension_unit?.width || "");
        // const [height, setheight] = useState(productDetails && productDetails?.dimension_unit?.height || "");
        // const [weight, setweight] = useState(productDetails && productDetails?.weight || "");
        // const [weight_unit, setweight_unit] = useState(productDetails && productDetails?.weight_unit || "kg");


        // "dimension_unit": "cm", 
        // "length": 10, 
        // "width": 10, 
        // "height": 10,
        // "weight": "10",
        // "weight_unit": "kg",



        const [dimension_unit_2, setdimension_unit_2] = useState("");
        const [length_2, setlength_2] = useState("");
        const [width_2, setwidth_2] = useState("");
        const [height_2, setheight_2] = useState("");
        const [weight_2, setweight_2] = useState("");
        const [weight_unit_2, setweight_unit_2] = useState("");



        const publishStatusId = () => {
            let statusId = getStatus?.length ? getStatus.filter((v: any) => v?.title === "Published")[0]?.id : "3";

            return statusId;
        }

        console.log(publishStatusId(), "publishStatusId")

        useEffect(() => {
            if (variationsMeta?.length) {
                variationsMeta?.map((v: any) => setVariationMetaregular_price(v?.regular_price))
            }
        }, [variationsMeta, variationsMeta?.length])

        console.log(variationMetaregular_price, "variationMetaregular_price")

        useEffect(() => {
            const removeFields = (data: any) => {
                return data.map((item: any) => {
                    const { id, ...rest } = item;
                    return rest;
                });
            };
            const cleanedData = removeFields(attributesArray);

            const transformDataAtt = (data: any) => {
                return data.map((item: any) => {
                    const { att_id, options, remove, visible, variation } = item;
                    const value_ids = options?.map((value: any) => (+value?.id));

                    return {
                        visible: visible,
                        variation: variation,
                        remove: remove,
                        id: +att_id,
                        value_ids: value_ids
                    };
                });
            }

            const outputDataAtt = transformDataAtt(cleanedData?.filter((v: any) => v?.existing).map((val: any) => val));
            let videoMetaNewArr = videoMeta.map(({ id, ...rest }: any) => rest);

            console.log(outputDataAtt, statusId, "cleanedData");
            if (generalMeta?.regular_price !== "") {
                setGeneralMetaregular_price("")
            }

            if (showProductDataTab === "variations") {
                const variationData = variationsMeta.map((v: any) => {
                    return {
                        ...v,
                        "dimensions": {
                            "length": v?.length !== null ? v?.length : length,
                            "dimension_unit": v?.dimension_unit !== undefined ? v?.dimension_unit : dimension_unit,
                            "width": v?.width !== null ? v?.width : width,
                            "height": v?.height !== null ? v?.height : height,
                        },
                        "weight": v?.weight !== null ? v?.weight : weight,
                        "weight_unit": v?.weight_unit !== null ? v?.weight_unit : weight_unit,
                    }
                })
                setUpdateProductFromData((pre: any) => ({
                    ...pre,
                    "product_id": productDetails?.id ? productDetails?.id : "",
                    "product_details": {
                        "name": productName,
                        "slug": permalink ? permalink : productDetails?.slug,
                        "sku": inventoryMeta?.sku,
                        "description": productDescription ? productDescription : "",
                        "short_description": productShortDescription ? productShortDescription : "",
                        "regular_price": generalMeta?.regular_price,
                        "sale_price": generalMeta?.sale_price,
                        "manage_stock": inventoryMeta?.manage_stock,
                        "stock_quantity": +inventoryMeta?.stock_quantity,
                        "low_stock_threshold": inventoryMeta?.store_wide_threshold,
                        "backordered": inventoryMeta?.backordered,
                        "backorders_allowed": inventoryMeta?.backorders_allowed,
                        "sold_individually": inventoryMeta?.sold_individually,
                        "returnable": generalMeta?.returnable,
                        "batch_available": generalMeta?.batch_available,
                        "importer_name": generalMeta?.importer_name,
                        "country_of_origin": generalMeta?.country_of_origin,
                        "download_limit": +generalMeta?.download_limit,
                        "download_expiry": +generalMeta?.download_expiry,
                        "stock_status_id": +inventoryMeta?.stock_quantity > 0 ? 1 : 2,
                        "status_id": publishStatusId(),
                        "type_id": productTypeSelected,
                        "downloadable": downloadable,
                        "virtual": virtual,
                        "hsn_id": hsnMeta ? hsnMeta : productDetails?.hsn_id,
                        "permalink": `${process.env.NEXT_PUBLIC_BASE_URL}/product/${productDetails?.slug}`
                    },



                    "category_ids": checkcategory?.length ? checkcategory.map((v: any) => ({ id: +v })) : [],
                    "new_attributes": cleanedData?.filter((v: any) => !v?.existing).map((val: any) => val),
                    "attribute_ids": outputDataAtt,
                    "product_variations": variationsMeta,
                    // "product_variations": [
                    //     ...variationsMeta,
                    //     {
                    //         "length": length,
                    //         "dimension_unit": dimension_unit,
                    //         "width": width,
                    //         "height": height,
                    //         "weight": weight,
                    //         "weight_unit": weight_unit,
                    //     }
                    // ],
                    "product_videos": videoMetaNewArr,
                    "tag_ids": tagsMeta,
                    // "product_meta_data": { ...metaData },
                    "meta_title": metaData?.meta_title,
                    "meta_description": metaData?.meta_description,
                    "meta_key": metaData?.meta_key,
                    "product_meta_data": {
                        "meta_title": metaData?.meta_title,
                        "meta_description": metaData?.meta_description,
                        "meta_key": metaData?.meta_key
                    },



                }))
            } else {
                setUpdateProductFromData((pre: any) => ({
                    ...pre,
                    "product_id": productDetails?.id ? productDetails?.id : "",
                    "product_details": {
                        "name": productName,
                        "slug": permalink ? permalink : productDetails?.slug,
                        "sku": inventoryMeta?.sku,
                        "description": productDescription ? productDescription : "",
                        "short_description": productShortDescription ? productShortDescription : "",
                        "regular_price": generalMeta?.regular_price,
                        "sale_price": generalMeta?.sale_price,
                        "manage_stock": inventoryMeta?.manage_stock,
                        "stock_quantity": +inventoryMeta?.stock_quantity,
                        "low_stock_threshold": inventoryMeta?.store_wide_threshold,
                        "backordered": inventoryMeta?.backordered,
                        "backorders_allowed": inventoryMeta?.backorders_allowed,
                        "sold_individually": inventoryMeta?.sold_individually,
                        "returnable": generalMeta?.returnable,
                        "batch_available": generalMeta?.batch_available,
                        "importer_name": generalMeta?.importer_name,
                        "country_of_origin": generalMeta?.country_of_origin,
                        "download_limit": +generalMeta?.download_limit,
                        "download_expiry": +generalMeta?.download_expiry,
                        "stock_status_id": +inventoryMeta?.stock_quantity > 0 ? 1 : 2,
                        "status_id": publishStatusId(),
                        "type_id": productTypeSelected,
                        "downloadable": downloadable,
                        "virtual": virtual,
                        "hsn_id": hsnMeta ? hsnMeta : productDetails?.hsn_id,
                        "permalink": `${process.env.NEXT_PUBLIC_BASE_URL}/product/${productDetails?.slug}`,
                        "dimensions": {
                            "length": length,
                            "dimension_unit": dimension_unit,
                            "width": width,
                            "height": height,
                        },
                        "weight": weight,
                        "weight_unit": weight_unit,
                    },

                    "category_ids": checkcategory?.length ? checkcategory.map((v: any) => ({ id: +v })) : [],
                    "new_attributes": cleanedData?.filter((v: any) => !v?.existing).map((val: any) => val),
                    "attribute_ids": outputDataAtt,
                    "product_videos": videoMetaNewArr,
                    "tag_ids": tagsMeta,
                    "product_meta_data": {
                        "meta_title": metaData?.meta_title,
                        "meta_description": metaData?.meta_description,
                        "meta_key": metaData?.meta_key
                    },
                    "meta_title": metaData?.meta_title,
                    "meta_description": metaData?.meta_description,
                    "meta_key": metaData?.meta_key,

                }))
            }

        }, [
            productName,
            permalink,
            productDetails,
            productDescription,
            productShortDescription,
            showProductDataTab,
            variationsMeta,
            inventoryMeta,
            generalMeta,
            attributesArray,
            checkcategory,
            permalink,
            videoMeta,
            tagsMeta,
            statusId,
            productTypeSelected,
            downloadable,
            virtual,
            metaData,
            hsnMeta,
            length,
            dimension_unit,
            width,
            height,
            weight,
            weight_unit,
        ])

        console.log(updateProductFromData, "updateProductFromData")


        // const updateProduct = async () => {
        //     console.log(updateProductFromData, "updateProductFromData")
        //     try {
        //         if (productDetails?.id) {
        //             if (productTypeSelected === "2") {
        //                 if (variationMetaregular_price === "") {
        //                     _WARNING("You need to add atlast one  up the general details.")
        //                     setVariationMetaregular_priceErr("This field is mandatory")
        //                 } else {
        //                     const { data } = await _post(update_product, updateProductFromData)
        //                     if (data?.success) {
        //                         console.log(data, "_updated_data")
        //                         getProductDetails(updateProductFromData?.product_id);
        //                         setGetproductAttributeCallData({})
        //                         setGetProd({ page: pageNo, rowsPerPage: 10, search: searchDataValue })
        //                         _SUCCESS("Product Update is Successful")
        //                         setEditHsn(false)
        //                         setOpenFullModal(false)
        //                     }
        //                 }
        //             } else if (productTypeSelected !== "2" && generalMeta?.regular_price === "") {
        //                 _WARNING("You need to fill up the general details.")
        //                 setGeneralMetaregular_price("This field is mandatory")
        //             } else {
        //                 const { data } = await _post(update_product, updateProductFromData)
        //                 if (data?.success) {
        //                     console.log(data, "_updated_data")
        //                     getProductDetails(updateProductFromData?.product_id);
        //                     setGetProd({ page: pageNo, rowsPerPage: 10, search: searchDataValue })
        //                     setGetproductAttributeCallData({})
        //                     _SUCCESS("Product Update is Successful")
        //                     setEditHsn(false)
        //                     setOpenFullModal(false)
        //                 }
        //             }
        //         } else {
        //             // const { data }: any = await _post(create_product, { name: productName, slug: slugMeta, })
        //             // console.log(data, "_success_")
        //             // if (data?.success) {
        //             //     getProductDetails(data?.data?.product_id)
        //             //     _SUCCESS("Product Publish is Successful")
        //             // }
        //         }

        //     } catch (error) {

        //     }
        // }

        const isSubmittingRef = useRef(false);
        const updateProduct = useCallback(async () => {
            console.log(updateProductFromData, "df54g6fdgfd")
            if (isSubmittingRef.current) return;
            isSubmittingRef.current = true;
            try {
                if (!productDetails?.id) return;

                if (productTypeSelected === "2") {
                    if (variationMetaregular_price === "") {
                        _WARNING("You need to add at least one general detail.");
                        setVariationMetaregular_priceErr("This field is mandatory");
                        isSubmittingRef.current = false;
                        return;
                    }
                } else if (generalMeta?.regular_price === "") {
                    _WARNING("You need to fill up the general details.");
                    setGeneralMetaregular_price("This field is mandatory");
                    isSubmittingRef.current = false;
                    return;
                }

                // return
                const { data } = await _post(update_product, updateProductFromData);
                if (data?.success) {
                    console.log(data, "_updated_data");
                    getProductDetails(updateProductFromData?.product_id);
                    setGetProd({ page: pageNo, rowsPerPage: 10, search: searchDataValue });
                    setGetproductAttributeCallData({});
                    _SUCCESS("Product Update is Successful");
                    setEditHsn(false);
                    setOpenFullModal(false);
                }
            } catch (error) {
                console.error("Update Product Error:", error);
            } finally {
                isSubmittingRef.current = false;
            }
        }, [productDetails, productTypeSelected, generalMeta, updateProductFromData]);

        useEffect(() => {
            if (!openFullModal) {
                setProductDescription()
                setProductShortDescription()
                setProductTypeSelected("1")
                setProductDetails({})
                setInventoryMeta({
                    backorders: "NO",
                    backordered: false,
                    backorders_allowed: false,
                    store_wide_threshold: "",
                    availability_date: "",
                    sku: "",
                    manage_stock: false,
                    sold_individually: false,
                    stock_quantity: ""
                })
                setGeneralMeta({
                    regular_price: "",
                    sale_price: "",
                    returnable: false,
                    batch_available: false,
                    importer_name: "",
                    country_of_origin: "",
                })
                setAttributesArray([])
                setVariationsMeta([])
                setVideoMeta([])
                setTagsMeta([])
                setCheckcategory([])
                setProductName("")
                setSlugMeta("")
                setGeneralMetaregular_price("")
                setVariationMetaregular_priceErr("")
                setHsnMeta("")

                setheight("");
                setwidth("");
                setlength("");
                setweight("");
                setdimension_unit("cm");
                setweight_unit("kg");
            }
        }, [openFullModal])



        console.log(productTypeSelected, 'productTypeSelected')

        function handleChangeFile(event: any) {
            setFileRepeater((pre: any) => ([...pre, { file: event.target.files[0], file_name: event.target.files[0]?.name }]))

        }

        const deleteFile = async (index: any, productId: any, fileId: any, fileName: any) => {
            setFileRepeater((prev: any) => prev.filter((_: any, i: number) => i !== index));
            let formData = new FormData();
            formData.append('old_downloadable_files[0][id]', fileId);
            formData.append('old_downloadable_files[0][name]', fileName);
            formData.append('product_id', productId);
            try {
                const { data } = await _post(upload_downloadable_file, formData)
                if (data?.success) {
                    getProductDetails(productId);
                }
            } catch (error) {
                console.log(error, "_error")
            }
        };

        const uploadFile = async (productId: any) => {
            let formData = new FormData();
            fileRepeater.map((value: any) =>
                value?.file && value?.file_name ?
                    formData.append('downloadable_files', value?.file)
                    : null
            )
            formData.append('product_id', productId);
            try {
                const { data }: any = await _post(upload_downloadable_file, formData)
                if (data?.success) {
                    getProductDetails(productId)
                }
            } catch (error) {
                console.log(error, "_error_")
            }
        }

        useEffect(() => {
            uploadFile(productDetails?.id)
        }, [fileRepeater?.length])

        useEffect(() => {
            if (productDetails?.id) {
                setDownloadable(productDetails?.downloadable)
                setVirtual(productDetails?.virtual)
                if (productDetails?.downloads?.length) {
                    let downloadableFile = productDetails?.downloads.map((v: any) => ({ file_name: v?.name, id: v?.id }))
                    setFileRepeater(downloadableFile)
                }
            }
        }, [productDetails])

        console.log(fileRepeater, productImages, "__file")

        console.log(permalink, "permalink")

        return (
            <div className='p-4 grid grid-col-2 lg:grid-flow-col grid-flow-row gap-4'>
                {/* rightSide */}
                <div className='flex  w-[100%] flex-col gap-4'>
                    <div className='w-full border border-solid border-gray-300 shadow-md rounded px-4 py-3'>
                        <div className='flex flex-row items-center justify-between'>
                            {!productDetails?.name ?
                                <TextField
                                    className={`w-full ${field_text_Cls}`}
                                    textFieldRoot='w-[100%]'
                                    autoFocus={true}
                                    value={productName}
                                    name='permalink'
                                    blur={() => addNewProductONDetails()}
                                    handelState={(e: any) => setProductName(e.target.value)}
                                    placeholder='Enter product name'
                                />
                                :
                                editProductName ?
                                    <TextField
                                        className={`w-full ${field_text_Cls}`}
                                        textFieldRoot='w-[100%]'
                                        autoFocus={true}
                                        value={productName}
                                        name='permalink'
                                        blur={() => setEditProductName(false)}
                                        handelState={(e: any) => setProductName(e.target.value)}
                                        placeholder='Enter product name'
                                    /> : productName}
                            {editProductName ? null : (productDetails?.name && productDetails?.id) ? < CreateIcon className='!h-5 !w-auto cursor-pointer' onClick={() => { setEditProductName(true) }} /> : null}
                        </div>
                    </div>
                    {productDetails?.id ?
                        <div className='flex items-center gap-1'>
                            <span>Permalink:</span>
                            {!productDetails?.slug ?
                                <div className='flex flex-row items-center flex-wrap gap-1'>
                                    {process.env.NEXT_PUBLIC_BASE_URL}/
                                    <TextField
                                        className={`w-full ${field_text_Cls}`}
                                        autoFocus={true}
                                        value={permalink}
                                        name='permalink'
                                        handelState={(e: any) => setPermalink(e.target.value)}
                                    />
                                </div>
                                :
                                openPermalink ?
                                    <div className='flex flex-row items-center flex-wrap gap-1'>
                                        {process.env.NEXT_PUBLIC_BASE_URL}/
                                        <TextField
                                            className={`w-full ${field_text_Cls}`}
                                            autoFocus={true}
                                            value={permalink}
                                            name='permalink'
                                            blur={() => setOpenPermalink(false)}
                                            handelState={(e: any) => setPermalink(e.target.value)}
                                        />
                                    </div>
                                    :
                                    <Link target='_blank' href={`${process.env.NEXT_PUBLIC_BASE_URL}/product/${productDetails?.slug}`}>{process.env.NEXT_PUBLIC_BASE_URL}/product/{permalink ? permalink : productDetails?.slug}</Link>
                            }
                            {!productDetails?.slug ? null : <CreateIcon className='!h-5 !w-auto cursor-pointer' onClick={() => onEditPermalink(permalink ? permalink : productDetails?.slug)} />}
                        </div> :
                        null}
                    {/* {slugMeta !== "" && !productDetails?.id ? <div className='flex items-center gap-1'><span>Slug:</span>&nbsp;{slugMeta}</div> : null} */}

                    {/* product description */}
                    <div className='border border-solid border-gray-400'>
                        <p className='px-4 py-2'>Product description</p>
                        <hr />
                        <div className='p-4 flex flex-col gap-2 bg-offWhite-03'>
                            <CkEditor
                                value={productDescription}
                                handleChange={setProductDescription}
                            />
                        </div>
                    </div>

                    {/* Product data */}
                    <div className='border border-solid border-gray-400'>

                        <div className='flex items-center justify-between gap-2 py-2'>
                            <div className='flex items-center'>
                                <p className='px-4 py-2'>Product data</p>
                                <SelectField
                                    name={"product-type"}
                                    lableCls={"text-sm"}
                                    selectFieldRootCls={"w-[10rem]"}
                                    handleChange={(e: any) => setProductTypeSelected(e.target.value)}
                                    menuItemArray={productTypes}
                                    value={productTypeSelected}
                                />
                            </div>
                            {/* <div className='border-0 border-l h-full border-gray-300 ml-4 pl-3 flex items-center gap-4'>
                                <div className='flex items-center'>
                                    <Checkbox className='px-[9px] py-0' checked={virtual} onClick={(e: any) => setVirtual(e.target.checked)} />
                                    <p>Virtual</p>
                                </div>
                                <div className='flex items-center'>
                                    <Checkbox className='px-[9px] py-0' checked={downloadable} onClick={(e: any) => setDownloadable(e.target.checked)} />
                                    <p>Downloadable</p>
                                </div>
                            </div> */}

                            <div className='flex items-center'>
                                <p>Batch Applicable ?</p>
                                <Checkbox className='p-0' checked={generalMeta?.batch_available} name='batch_available' onChange={(e: any) => handleChangeGeneral(e, true)} />
                            </div>
                        </div>

                        <hr />

                        <div className='flex bg-white min-h-96 h-fit'>

                            <div className='bg-offWhite-03 w-1/5 border-r border-solid border-gray-300'>
                                {productDataDetailsArray?.length ? productDataDetailsArray.map((v: any, i: number) => {
                                    return (
                                        <p className='flex flex-col' key={i}>
                                            <span
                                                onClick={() => setShowProductDataTab(v?.name)}
                                                className={`px-4 h-10 flex items-center border-b border-solid border-gray-300 ${showProductDataTab === v?.name ? "bg-offWhite-04" : "hover:bg-offWhite-04"} overflow-hidden cursor-pointer capitalize`}
                                            >
                                                {v?.name}
                                            </span>
                                        </p>
                                    )
                                })
                                    :
                                    null
                                }
                            </div>

                            <div className='w-4/5 p-4'>

                                {/* general */}
                                <div className={`${showProductDataTab === "general" ? 'flex flex-col gap-4' : 'hidden'}`}>
                                    {productTypeSelected !== "2" ?
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex items-center'>
                                                <p className='w-1/4'>Regular price (₹)</p>
                                                <div className='flex flex-col items-start w-3/4'>
                                                    <TextField
                                                        className={`w-full ${field_text_Cls}`}
                                                        textFieldRoot='w-full'
                                                        type='number'
                                                        name='regular_price'
                                                        value={generalMeta?.regular_price}
                                                        placeholder='price (required)'
                                                        handelState={(e: any) => handleChangeGeneral(e)}
                                                    />
                                                    {generalMetaregular_price ? <p className='text-red-500 text-sm font-medium'>{generalMetaregular_price}</p> : null}
                                                </div>
                                            </div>
                                            <div className='flex items-center'>
                                                <p className='w-1/4'>Sale price (₹)</p>
                                                <TextField
                                                    className={`w-full ${field_text_Cls}`}
                                                    textFieldRoot='w-3/4'
                                                    type='number'
                                                    name='sale_price'
                                                    value={generalMeta?.sale_price}
                                                    handelState={(e: any) => handleChangeGeneral(e)}
                                                />
                                            </div>
                                            <hr />
                                        </div> : null}

                                    {downloadable ?
                                        productTypeSelected !== "2" ?
                                            <div className='flex flex-col gap-4'>
                                                <div className='flex items-start'>
                                                    <p className='w-1/4'>Downloadable files</p>
                                                    <div className='border border-solid border-gray-400 w-3/4 p-4'>
                                                        {fileRepeater?.length ? fileRepeater.map((v: any, i: number) =>
                                                            v?.file_name ?
                                                                <div key={i} className='flex items-center justify-between pb-1 mb-2 border-b border-solid border-gray-500'>
                                                                    <div className='flex items-center w-full'>
                                                                        {v?.file_name ?
                                                                            v?.file_name
                                                                            :
                                                                            <div>
                                                                                <input type="file" id="file" className='hidden' onChange={handleChangeFile} />
                                                                                <label htmlFor="file" className="border border-dashed border-pink-600 px-2 py-1 rounded cursor-pointer">
                                                                                    Choose a file
                                                                                </label>
                                                                            </div>}
                                                                    </div>
                                                                    <DeleteIcon className='w-5 h-5 text-red-500 cursor-pointer' onClick={() => deleteFile(i, productDetails?.id, v?.id, v?.file_name)} />
                                                                </div> : null) : null}
                                                        <div className='flex items-center justify-between'>
                                                            <div className=''>
                                                                <input type="file" id="file" className='hidden' onChange={handleChangeFile} />
                                                                <label htmlFor="file" className="border border-dashed border-pink-600 px-2 py-1 rounded cursor-pointer">
                                                                    Choose a file
                                                                </label>
                                                            </div>
                                                            {/* <PinkPawsbutton name={"Upload File"} pinkPawsButtonExtraCls='text-base font-normal' handleClick={() => uploadFile(productDetails?.id)} /> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex items-center'>
                                                    <p className='w-1/4'>Download limit</p>
                                                    <TextField
                                                        className={`w-full ${field_text_Cls}`}
                                                        type="number"
                                                        textFieldRoot='w-3/4'
                                                        name='download_limit'
                                                        placeholder='Leave blank for unlimited re-downloads.'
                                                        value={generalMeta?.download_limit}
                                                        handelState={(e: any) => handleChangeGeneral(e)}
                                                    />
                                                </div>
                                                <div className='flex items-center'>
                                                    <p className='w-1/4'>Download expiry</p>
                                                    <TextField
                                                        className={`w-full ${field_text_Cls}`}
                                                        type="number"
                                                        textFieldRoot='w-3/4'
                                                        name='download_expiry'
                                                        placeholder='Enter the number of days before a download link expires'
                                                        value={generalMeta?.download_expiry}
                                                        handelState={(e: any) => handleChangeGeneral(e)}
                                                    />
                                                </div>
                                                <hr />
                                            </div> : null : null}


                                    {/* <div className='flex items-center'>
                                        <p className='w-1/4'>Returnable ?</p>
                                        <Checkbox className='p-0' checked={generalMeta?.returnable} name='returnable' onChange={(e: any) => handleChangeGeneral(e, true)} />
                                    </div> */}
                                    <div className='flex space-x-4'>
                                        <div className='flex items-center'>
                                            <p>Returnable ?</p>
                                            <Checkbox className='p-0' checked={generalMeta?.returnable} name='returnable' onChange={(e: any) => handleChangeGeneral(e, true)} />
                                        </div>
                                    </div>


                                    <div className='flex items-center'>
                                        <p className='w-1/4'>Importer name</p>
                                        <TextField
                                            className={`w-full ${field_text_Cls}`}
                                            textFieldRoot='w-3/4'
                                            placeholder='Importer name'
                                            name='importer_name'
                                            value={generalMeta?.importer_name}
                                            handelState={(e: any) => handleChangeGeneral(e)}
                                        />
                                    </div>

                                    <div className='flex items-center'>
                                        <p className='w-1/4'>Country of origin</p>
                                        <TextField
                                            className={`w-full ${field_text_Cls}`}
                                            textFieldRoot='w-3/4'
                                            placeholder='Country of origin'
                                            name='country_of_origin'
                                            value={generalMeta?.country_of_origin}
                                            handelState={(e: any) => handleChangeGeneral(e)}
                                        />
                                    </div>
                                </div>

                                {showProductDataTab === "general" && productTypeSelected === "1" &&
                                    <>
                                        <hr className='mt-4' />

                                        <div className='mt-4' >
                                            <div className='flex flex-col gap-2'>
                                                <label htmlFor="">Dimention unit</label>
                                                <select name="dimension_unit" id="dimension_unit" value={dimension_unit} onChange={(e: any) => setdimension_unit(e.target.value)} className='border border-black outline-none p-2 rounded'>
                                                    <option value="">select value</option>
                                                    <option value="cm">Centimeter</option>
                                                    <option value="m">Meter</option>
                                                </select>
                                            </div>
                                            <div className='flex flex-col gap-2 mt-2'>
                                                <label htmlFor="">Length</label>
                                                <input type="text" name="length" id="length" value={length} onChange={(e: any) => setlength(e.target.value)} className='border p-2 outline-none border-black rounded' placeholder='Enter product length' />
                                            </div>
                                            <div className='flex flex-col gap-2 mt-2'>
                                                <label htmlFor="">Width</label>
                                                <input type="text" name="width" id="width" value={width} onChange={(e: any) => setwidth(e.target.value)} className='border p-2 outline-none border-black rounded' placeholder='Enter product width' />
                                            </div>
                                            <div className='flex flex-col gap-2 mt-2'>
                                                <label htmlFor="">Height</label>
                                                <input type="text" name="height" id="height" onChange={(e: any) => setheight(e.target.value)} value={height} className='border p-2 outline-none border-black rounded' placeholder='Enter product height' />
                                            </div>
                                            <div className='flex flex-col gap-2 mt-2'>
                                                <label htmlFor="">Weight</label>
                                                <input type="text" name="weight" id="weight" onChange={(e: any) => setweight(e.target.value)} value={weight} className='border p-2 outline-none border-black rounded' placeholder='Enter product weight' />
                                            </div>
                                            <div className='flex flex-col gap-2 mt-2'>
                                                <label htmlFor="">Weight unit</label>
                                                <select name="weight_unit" id="weight_unit" value={weight_unit} onChange={(e: any) => setweight_unit(e.target.value)} className='border border-black outline-none p-2 rounded'>
                                                    <option value="">select value</option>
                                                    <option value="kg">{"Kilogram (kg)"}</option>
                                                    <option value="gm">{"Gram (gm)"}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                }


                                {/* inventory */}
                                <div className={`${showProductDataTab === "inventory" ? 'flex flex-col gap-4' : 'hidden'}`}>

                                    <div className='flex items-center'>
                                        <p className='w-1/4'>SKU</p>
                                        <TextField className={`w-full ${field_text_Cls}`} textFieldRoot='w-3/4' value={inventoryMeta?.sku} name='sku' handelState={(e: any) => handleChangeInventory(e)} />
                                    </div>

                                    <div className='flex items-center'>
                                        <p className='w-1/4'>Stock management</p>
                                        <div className='flex items-center gap-2'>
                                            <Checkbox className='p-0' name='manage_stock' checked={inventoryMeta?.manage_stock ?? true} onChange={(e: any) => handleChangeInventory(e, true)} />
                                            <p className='text-sm'>Track stock quantity for this product</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center'>
                                        <p className='w-1/4'>Quantity</p>
                                        <TextField className={`w-full ${field_text_Cls}`} textFieldRoot='w-3/4' value={inventoryMeta?.stock_quantity} name='stock_quantity' handelState={(e: any) => handleChangeInventory(e)} />
                                    </div>

                                    <div className='flex items-start gap-2.5'>
                                        <p className='w-1/4'>Allow backorders?</p>
                                        <RadioGroup
                                            value={inventoryMeta?.backorders}
                                            onChange={(e: any) => handleChangeInventory(e)}
                                        >
                                            <FormControlLabel value="no" className='flex items-center gap-2' control={
                                                <Radio className='p-0' name='backorders' checked={(!inventoryMeta?.backordered && !inventoryMeta?.backorders_allowed) ? true : false} />
                                            } label="Do not allow" />
                                            <FormControlLabel value="Notify customer" className='flex items-center gap-2 pt-2' control={
                                                <Radio className='p-0' checked={inventoryMeta?.backorders_allowed ? true : false} name='backorders_allowed' />
                                            } label="Allow, but notify customer" />
                                            <FormControlLabel value="Allow" className='flex items-center gap-2 pt-2' control={
                                                <Radio className='p-0' checked={inventoryMeta?.backordered ? true : false} name='backordered' />
                                            } label="Allow" />
                                        </RadioGroup>
                                    </div>

                                    <div className='flex items-center'>
                                        <p className='w-1/4'>Low stock threshold</p>
                                        <TextField className={`w-full ${field_text_Cls}`} textFieldRoot='w-3/4' placeholder='Store-wide threshold (2)' name='store_wide_threshold' value={inventoryMeta?.store_wide_threshold} handelState={(e: any) => handleChangeInventory(e)} />
                                    </div>

                                    {productTypeSelected === "1" && <hr />}

                                    {productTypeSelected === "1" &&
                                        <div className='flex items-center'>
                                            <p className='w-1/4'>Sold individually</p>
                                            <div className='flex items-center gap-2'>
                                                <Checkbox className='p-0' name='sold_individually' checked={inventoryMeta?.sold_individually} onChange={(e: any) => handleChangeInventory(e, true)} />
                                                <p className='text-sm'>Limit purchases to 1 item per order</p>
                                            </div>
                                        </div>}

                                    {/* <hr />
                                        <p className='font-semibold text-base'>CUSTOM FIELDS by CTX Feed</p>
                                        <hr />

                                        <div className='flex items-center'>
                                            <p className='w-1/4 mb-5'>Availability Date</p>
                                            <div className='flex flex-col gap-1 w-3/4'>
                                                <TextField className={`w-full ${field_text_Cls}`} textFieldRoot='w-full' type='date' name='availability_date' value={inventoryMeta?.availability_date} handelState={(e: any) => handleChangeInventory(e)} />
                                                <p className='text-sm'>Set availability date for backorder products.</p>
                                            </div>
                                        </div> */}

                                </div>

                                {/* attributes */}
                                <div className={`${showProductDataTab === "attributes" ? 'flex flex-col gap-4' : 'hidden'}`}>
                                    <div className='flex items-end gap-4'>
                                        <PinkPawsbutton name='Add new' variant='outlined' pinkPawsButtonExtraCls={``} handleClick={() => onAddNewAttributes()} />
                                        <SelectField
                                            lable={"Add existing"}
                                            name={"attribute"}
                                            lableCls={"text-sm"}
                                            selectFieldRootCls={"w-[10rem]"}
                                            handleChange={(e: any) => handleChangeSelectAttributes(e, true)}
                                            menuItemArray={existingAttributes}
                                            checkedIds={attributesArray}
                                            value={selectAttributesValue?.attribute}
                                        />
                                    </div>
                                    {attributesArray?.length ? attributesArray.map((value: any, idx: number) =>
                                        value?.remove ? null : <div key={idx} className='border border-solid border-gray-300'>
                                            <div className='px-4 py-2 bg-offWhite-04 flex justify-between'>
                                                {<div className='font-bold text-base'>{value?.name ? value?.name : "New attribute"}</div>}
                                                <div className='text-red-500 cursor-pointer' onClick={() => deleteNewAttributes(value?.id, value?.name)}>Remove</div>
                                            </div>
                                            <div className='flex p-4 gap-4 w-full'>
                                                <div className='flex flex-col gap-3 w-[30%]'>
                                                    {value?.existing ?
                                                        // <p>Name: {value?.name}</p>
                                                        null
                                                        :
                                                        <TextField
                                                            label="Name"
                                                            className={`${field_text_Cls} w-full h-fit`}
                                                            textFieldRoot={`w-full`}
                                                            placeholder='f.e. size or color'
                                                            name='name'
                                                            value={value?.name}
                                                            handelState={(e: any) => updateNewAttributes(value?.id, e, false)}
                                                        />}
                                                    <div className='flex items-start gap-2'>
                                                        <Checkbox name='visible' onChange={(e: any) => updateNewAttributes(value?.id, e, false, true)} checked={value?.visible} className='p-0' />
                                                        Visible on the product page
                                                    </div>
                                                    <div className='flex items-start gap-2'>
                                                        <Checkbox name='variation' onChange={(e: any) => updateNewAttributes(value?.id, e, false, true)} checked={value?.variation} className='p-0' />
                                                        Used for variations
                                                    </div>
                                                </div>

                                                <div className='lg:border-l border-b border-solid border-gray-400' />

                                                <div className='flex flex-col gap-3 w-[70%]'>
                                                    {value?.options?.length ?
                                                        <div className='flex gap-1 flex-wrap'>
                                                            {value?.options.map((v: any, i: number) =>
                                                                <div key={i} className='p-0.5 px-1.5 text-sm bg-slate-200 rounded-full flex items-center gap-1'>
                                                                    {capitalize(v?.name)}
                                                                    <HighlightOffIcon className='text-lg cursor-pointer' onClick={() => handleDeleteTerms(value?.id, v?.id)} />
                                                                </div>)
                                                            }
                                                        </div>
                                                        : null}
                                                    {value?.existing ?
                                                        <Autocomplete
                                                            multiple
                                                            id="values"
                                                            value={value?.values}
                                                            onFocus={() => getAttById(value?.att_id ? value?.att_id : value?.id)}
                                                            options={attDummyArr}
                                                            getOptionLabel={(option) => option.name}
                                                            getOptionDisabled={(option) => option.id === checkAttribiutesValue(option.id, value?.options)}
                                                            filterSelectedOptions
                                                            className='atocompleteCls w-full'
                                                            renderInput={(params) => (<MuiTextField {...params} placeholder='Select terms' />)}
                                                            onChange={(e: any, v: any) => { updateNewAttributes(value?.id, v, true); console.log(value, "__test") }}
                                                        // clearIcon={<ClearIcon fontSize="small" className='bg-black' />}
                                                        />
                                                        :
                                                        <TextAreaField
                                                            label="Value(s)"
                                                            className={`h-40 w-full ${field_text_Cls}`}
                                                            textareaRoot={`w-full`}
                                                            placeholder='Enter options for customers to choose from, f.e. “Blue” or “Large”. Use “|” to separate different options.'
                                                            name='values'
                                                            handelState={(e: any) => updateNewAttributes(value?.id, e, false)}
                                                        />
                                                    }
                                                    {/* {value?.existing ? <div className='flex items-center justify-between'>
                                                        <div className='flex items-center gap-2'>
                                                            <PinkPawsbutton name='Select all' variant='outlined' pinkPawsButtonExtraCls={``} />
                                                            <PinkPawsbutton name='Select none' variant='outlined' pinkPawsButtonExtraCls={``} />
                                                        </div>
                                                        <PinkPawsbutton name='Create value' variant='outlined' pinkPawsButtonExtraCls={``} />
                                                    </div> : null} */}
                                                </div>
                                            </div>
                                        </div>) : null}
                                </div>

                                {/* variations */}
                                <div className={`${showProductDataTab === "variations" ? 'flex flex-col gap-4 product_variations' : 'hidden'}`}>

                                    <PinkPawsbutton name='Add manually' variant='outlined' pinkPawsButtonExtraCls={``} handleClick={() => onAddmanuallyvariations()} />

                                    {variationsMeta?.length ? variationsMeta?.map((v: any, i: number) => {

                                        // fetchVariationMetaregular_price(v?.regular_price)
                                        return (
                                            <>
                                                {v?.remove ? null :
                                                    <div className='w-full border border-solid border-gray-400 p-1.5 rounded' key={i}>
                                                        <div className='w-full flex items-start justify-between'>
                                                            <div className='w-full flex flex-wrap items-center gap-2'>
                                                                <h1 className='font-semibold text-base'>#{v?.id}</h1>
                                                                {attributesArray?.length ? attributesArray.map((val: any, idx: number) =>
                                                                    val?.variation ?
                                                                        <SelectField
                                                                            key={idx}
                                                                            value={v?.attribute_ids.filter((i: any) => i?.id === val?.id).map((itm: any) => itm?.value_ids[0])}
                                                                            name={"attribute_ids"}
                                                                            lableCls={"text-sm"}
                                                                            selectFieldRootCls={"w-[10rem]"}
                                                                            needId={true}
                                                                            handleChange={(e: any) => handleChangeVariations(v, e, false, true, val)}
                                                                            menuItemArray={val?.values || val?.options}
                                                                        /> : null) : null}
                                                            </div>
                                                            <div className='flex items-center gap-1'>
                                                                <DeleteIcon className='cursor-pointer text-red-500 text-xl' onClick={() => onRemovemanuallyvariations(v?.id, v?.temp_id)} />
                                                                <ArrowDropDownIcon className='cursor-pointer' onClick={() => {
                                                                    if (openEditVariations === v?.id) {
                                                                        setOpenEditVariations()
                                                                    } else {
                                                                        setOpenEditVariations(v?.id)
                                                                    }
                                                                }
                                                                } />
                                                            </div>
                                                        </div>

                                                        {openEditVariations === v?.id ? <hr className='my-1.5 border-gray-400' /> : null}

                                                        {openEditVariations === v?.id ?
                                                            <div className='flex flex-col gap-4 product_variations'>
                                                                <div className='flex items-start gap-8'>
                                                                    {/* <div className='w-2/5 flex items-center justify-start'>
                                                                <ImageUploader onImageChange={handleImage} preImages={images} className={`imageDeopZone`} />
                                                            </div> */}
                                                                    <div className='w-full flex flex-col gap-4 product_variations'>
                                                                        <div className='flex items-center'>
                                                                            <p className='w-1/4'>Enabled</p>
                                                                            <div className='flex items-center gap-2'>
                                                                                <Checkbox
                                                                                    className='p-0'
                                                                                    name='enable'
                                                                                    checked={v?.enable}
                                                                                    onChange={(e: any) => handleChangeVariations(v, e, true, false)}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className='flex items-center'>
                                                                            <p className='w-1/4'>SKU</p>
                                                                            <TextField
                                                                                className={`w-full ${field_text_Cls}`}
                                                                                textFieldRoot='w-4/5'
                                                                                value={v?.sku}
                                                                                name='sku'
                                                                                handelState={(e: any) => handleChangeVariations(v, e, false, false)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className='flex items-center'>
                                                                    <p className='w-1/4'>Regular price (₹)</p>
                                                                    <div className='flex flex-col items-start w-4/5'>
                                                                        <TextField
                                                                            className={`w-full ${field_text_Cls}`}
                                                                            textFieldRoot='w-full'
                                                                            name='regular_price'
                                                                            type='number'
                                                                            placeholder='Variation price (required)'
                                                                            value={v?.regular_price}
                                                                            handelState={(e: any) => handleChangeVariations(v, e, false, false)}
                                                                        />
                                                                        {variationMetaregular_priceErr && v?.regular_price === "" ? <p className='text-red-500 text-sm font-medium'>{variationMetaregular_priceErr}</p> : null}
                                                                    </div>
                                                                </div>

                                                                <div className='flex items-center'>
                                                                    <p className='w-1/4'>Sale price (₹)</p>
                                                                    <TextField
                                                                        className={`w-full ${field_text_Cls}`}
                                                                        textFieldRoot='w-4/5'
                                                                        type='number'
                                                                        name='sale_price'
                                                                        value={v?.sale_price}
                                                                        handelState={(e: any) => handleChangeVariations(v, e, false, false)}
                                                                    />
                                                                </div>

                                                                <div className='flex items-center'>
                                                                    <p className='w-1/4'>Stock quantity</p>
                                                                    <TextField
                                                                        className={`w-full ${field_text_Cls}`}
                                                                        textFieldRoot='w-4/5'
                                                                        name='stock_quantity'
                                                                        value={v?.stock_quantity}
                                                                        handelState={(e: any) => handleChangeVariations(v, e, false, false)}
                                                                    />
                                                                </div>

                                                                <div className='flex items-start'>
                                                                    <p className='w-1/4'>Description</p>
                                                                    <TextAreaField
                                                                        className={`w-full h-24 ${field_text_Cls}`}
                                                                        textareaRoot='w-4/5'
                                                                        name='description'
                                                                        value={v?.description}
                                                                        handelState={(e: any) => handleChangeVariations(v, e, false, false)}
                                                                    />
                                                                </div>

                                                                <div className='mt-4' >
                                                                    <div className='flex flex-col gap-2'>
                                                                        <label htmlFor="">Dimention unit</label>
                                                                        <select name="dimension_unit" id="dimension_unit" value={v?.dimensions?.dimension_unit} onChange={(e: any) => handleChangeVariations(v, e, false, false)} className='border border-black outline-none p-2 rounded'>
                                                                            <option value="">select value</option>
                                                                            <option value="cm">Centimeter</option>
                                                                            <option value="m">Meter</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className='flex flex-col gap-2 mt-2'>
                                                                        <label htmlFor="">Length</label>
                                                                        <input type="text" name="length" id="length" value={v?.dimensions?.length} onChange={(e: any) => handleChangeVariations(v, e, false, false)} className='border p-2 outline-none border-black rounded' placeholder='Enter product length' />
                                                                    </div>
                                                                    <div className='flex flex-col gap-2 mt-2'>
                                                                        <label htmlFor="">Width</label>
                                                                        <input type="text" name="width" id="width" value={v?.dimensions?.width} onChange={(e: any) => handleChangeVariations(v, e, false, false)} className='border p-2 outline-none border-black rounded' placeholder='Enter product width' />
                                                                    </div>
                                                                    <div className='flex flex-col gap-2 mt-2'>
                                                                        <label htmlFor="">Height</label>
                                                                        <input type="text" name="height" id="height" onChange={(e: any) => handleChangeVariations(v, e, false, false)} value={v?.dimensions?.height} className='border p-2 outline-none border-black rounded' placeholder='Enter product height' />
                                                                    </div>
                                                                    <div className='flex flex-col gap-2 mt-2'>
                                                                        <label htmlFor="">Weight</label>
                                                                        <input type="text" name="weight" id="weight" onChange={(e: any) => handleChangeVariations(v, e, false, false)} value={v?.weight} className='border p-2 outline-none border-black rounded' placeholder='Enter product weight' />
                                                                    </div>
                                                                    <div className='flex flex-col gap-2 mt-2'>
                                                                        <label htmlFor="">Weight unit</label>
                                                                        <select name="weight_unit" id="weight_unit" value={v?.weight_unit} onChange={(e: any) => handleChangeVariations(v, e, false, false)} className='border border-black outline-none p-2 rounded'>
                                                                            <option value="">select value</option>
                                                                            <option value="kg">{"Kilogram (kg)"}</option>
                                                                            <option value="gm">{"Gram (gm)"}</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            : null
                                                        }
                                                    </div>}
                                            </>
                                        )
                                    }
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* product short description */}
                    <div className='border border-solid border-gray-400'>
                        <p className='px-4 py-2'>Product short description</p>
                        <hr />
                        <div className='p-4 flex flex-col gap-2 bg-offWhite-03'>
                            <CkEditor
                                value={productShortDescription}
                                handleChange={setProductShortDescription}
                            />
                        </div>
                    </div>


                    {/* Product video url */}
                    {/* <div className='border border-solid border-gray-400'>
                        <p className='px-4 py-2'>Product Video Url</p>
                        <hr />
                        <div className='px-4 py-2 flex items-center justify-between'>
                            <p>Select video source</p>
                            <PinkPawsbutton icon={<AddCircleOutlineIcon />} name='Add video' handleClick={() => addNewVideo()} />
                        </div>
                        {videoMeta?.length ? videoMeta?.map((v: any, i: number) =>
                            v?.remove ? null :
                                <div key={i} className='mx-4 mb-4 p-4 bg-offWhite-02 border border-solid border-gray-500'>
                                    <div className='flex justify-between'>
                                        <div className='flex items-end gap-4 w-2/4'>
                                            <div className='flex flex-col gap-2  w-full'>
                                                <div className='flex w-full flex-col items-start'>
                                                    <p>Video Name</p>
                                                    <SelectField
                                                        name={"product-type"}
                                                        lableCls={"w-full"}
                                                        selectFieldRootCls={"w-full bg-white rounded"}
                                                        handleChange={(e: any) => selectvideoTypes(e.target.value, i)}
                                                        menuItemArray={videoTypes}
                                                        value={v?.video_type_id}
                                                    />
                                                </div>

                                                <div className='flex w-full flex-col items-start'>
                                                    <p>Video Url</p>
                                                    <TextField
                                                        className={`w-full ${field_text_Cls}`}
                                                        textFieldRoot='w-full'
                                                        name='video_url'
                                                        handelState={(e: any) => addVideoUrl(e, i)}
                                                        value={v?.video_url}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Tooltip title="Remove video">
                                            <PinkPawsbutton icon={<RemoveCircleOutlineIcon />} variant='outlined' handleClick={() => removeVideo(v?.meta_id)} pinkPawsButtonExtraCls='h-fit' />
                                        </Tooltip>
                                    </div>
                                </div>) : null}
                    </div> */}

                    {/* reviews */}
                    {/* <div className='border border-solid border-gray-400'>
                        <p className='px-4 py-2'>Reviews</p>
                        <hr />
                        <div className='p-4 flex flex-col gap-2 bg-offWhite-03'>
                            {shoCmntInptArea ?
                                <CkEditor
                                    value={reviews}
                                    handleChange={setReviews}
                                />
                                : null}
                            <div className='flex items-center gap-2'>
                                {shoCmntInptArea ? <PinkPawsbutton name={'Add comment'} pinkPawsButtonExtraCls={"h-fit"} /> : null}
                                <PinkPawsbutton name={shoCmntInptArea ? 'Cancel' : 'Add comment'} variant='outlined' pinkPawsButtonExtraCls={"h-fit"} handleClick={() => setShoCmntInptArea(!shoCmntInptArea)} />
                            </div>
                        </div>
                    </div> */}
                    <SimpleCard
                        childrenClassName={`flex flex-col items-center justify-center gap-2 !p-4`}
                        headingClassName='!bg-white'
                        heading={
                            <div className='flex items-center w-full gap-4'>
                                <span className='font-medium'>Meta Information</span>
                                <hr className='border-l border-solid h-6' />
                                {/* <div className='flex items-center'>
                                <Checkbox className='!pr-2 !py-1 !p-0' />
                                <p className=''> Use Default Meta Information?</p>
                            </div> */}
                            </div>
                        }>
                        <div className='grid lg:grid-cols-2 grid-cols-1 gap-4 w-full'>

                            <div className='flex flex-col w-full'>
                                <p className=''>Meta Title</p>
                                <TextField
                                    className={`w-full ${field_text_Cls}`}
                                    textFieldRoot='w-full'
                                    value={metaData?.meta_title}
                                    name='meta_title'
                                    handelState={(e: any) => setMetaData((pre: any) => ({
                                        ...pre,
                                        meta_title: e.target.value
                                    }))}
                                />
                            </div>

                            <div className='flex flex-col w-full'>
                                <p className=''> Meta Keywords</p>
                                <TextField
                                    className={`w-full ${field_text_Cls}`}
                                    textFieldRoot='w-full'
                                    value={metaData?.meta_key}
                                    name='Meta Keywords'
                                    handelState={(e: any) => setMetaData((pre: any) => ({
                                        ...pre,
                                        meta_key: e.target.value
                                    }))}
                                />
                            </div>
                        </div>
                        <div className='w-full'>
                            <div className='flex flex-col w-full'>
                                <p className=''>Meta Description</p>
                                <TextAreaField
                                    className={`w-full ${field_text_Cls}`}
                                    textareaRoot='w-full'
                                    value={metaData?.meta_description}
                                    name='Meta Description'
                                    handelState={(e: any) => setMetaData((pre: any) => ({
                                        ...pre,
                                        meta_description: e.target.value
                                    }))}
                                />
                            </div>
                        </div>
                    </SimpleCard>

                </div>

                {/* leftSide */}
                <div className='flex flex-col gap-4 w-[100%]'>
                    {!productDetails?.id ?
                        <PinkPawsbutton name={productDetails?.status?.title === "Draft" ? 'Publish Product' : !productDetails?.id ? 'Publish Product' : 'Update Product'} disabled={slugMeta === "" ? true : false} pinkPawsButtonExtraCls='w-full mb-0 mt-1.5 text-lg font-mediam' handleClick={() => updateProduct()} />
                        :
                        <PinkPawsbutton name={productDetails?.status?.title === "Draft" ? 'Publish Product' : !productDetails?.id ? 'Publish Product' : 'Update Product'} pinkPawsButtonExtraCls='w-full mb-0 mt-1.5 text-lg font-mediam' handleClick={() => updateProduct()} />
                    }

                    <SimpleCard childrenClassName={`flex flex-col items-center justify-center gap-2`} headingClassName={`!bg-white`} heading={<span className='font-medium'>Product images</span>}>
                        {editEmage ?
                            <ImageUploader multiple={false} onImageChange={handleProductImage} preImages={productImages} className={`imageDeopZone`} />
                            :
                            productDetails?.images?.length ?
                                productDetails?.images.filter((val: any) => val?.main_image === true).map((v: any, i: number) =>
                                    <div key={i} className='relative border border-solid border-gray-400 group'>
                                        <Image key={i} src={v?.src} alt='product_image_break' width={160} height={200} />
                                        <DeleteForeverIcon className='group-hover:!block !hidden text-red-500 bg-white text-xl cursor-pointer absolute top-0 right-0' onClick={() => deleteProductImage(productDetails?.id, v?.id, v?.name)} />

                                    </div>
                                ) : <div className=''></div>
                        }
                        {productDetails?.images?.length ? <hr className='border-gray-400 w-full' /> : null}
                        {editEmage ?
                            <div className='mt-2 flex flex-row items-center gap-2 w-full'>
                                <PinkPawsbutton variant='outlined' name='cancel' pinkPawsButtonExtraCls={'w-full'} handleClick={() => { setEditEmage(false); setProductImages([]) }} />
                                <PinkPawsbutton variant='solid' name='update' pinkPawsButtonExtraCls={'w-full'} handleClick={() => {
                                    let mainProductImageDetails = productDetails?.images.filter((val: any) => val?.main_image === true);
                                    if (mainProductImageDetails && mainProductImageDetails?.length) {
                                        updateProductImage(
                                            productDetails?.id,
                                            mainProductImageDetails?.[0]?.id ? mainProductImageDetails?.[0].id : '',
                                            mainProductImageDetails?.[0]?.name ? mainProductImageDetails?.[0]?.name : ''
                                        )
                                    } else {
                                        updateProductImage(productDetails?.id, '', '');
                                    }
                                }
                                } />
                            </div>
                            :
                            <PinkPawsbutton variant='solid' name={"Set product image"} pinkPawsButtonExtraCls={'w-full'} handleClick={() => setEditEmage(true)} />
                        }
                    </SimpleCard>

                    <SimpleCard childrenClassName='' headingClassName={`!bg-white`} heading={<span className='font-medium'>Product gallery</span>}>
                        {editGalleryEmage ?
                            <ImageUploader multiple={true} onImageChange={handleProductGalleryImage} multiImagePreview={true} className={`imageDeopZone`} />
                            :
                            <div className='flex flex-wrap gap-1'>
                                {productDetails?.images?.length ? productDetails?.images.filter((val: any) => val?.main_image !== true).map((i: any, e: number) =>
                                    <div key={e} className='relative border border-solid border-gray-400 group'>
                                        <Image
                                            src={i?.src ? i?.src : productImage}
                                            className='border border-solid h-20 w-20'
                                            alt='product_image_break'
                                            width={1920}
                                            height={1080}
                                        />
                                        <DeleteForeverIcon className='group-hover:!block !hidden text-red-500 bg-white text-xl cursor-pointer absolute top-0 right-0' onClick={() => deleteProductImage(productDetails?.id, i?.id, i?.name)} />
                                    </div>
                                ) : <div className=''></div>}
                            </div>}
                        {productDetails?.images?.length ? <hr className='border-gray-400 my-2' /> : null}
                        {editGalleryEmage ?
                            <div className='mt-2 flex flex-row items-center gap-2 w-full'>
                                <PinkPawsbutton variant='outlined' name='cancel' pinkPawsButtonExtraCls={'w-full'} handleClick={() => { setEditGalleryEmage(false); setProductGalleryImages([]) }} />
                                <PinkPawsbutton variant='solid' name='Save' pinkPawsButtonExtraCls={'w-full'} handleClick={() => updateProductGalleryImage(productDetails?.id)} />
                            </div>
                            :
                            <PinkPawsbutton variant='solid' name='Add product gallery images' pinkPawsButtonExtraCls={'w-full !text-[15px]'} handleClick={() => setEditGalleryEmage(true)} />}
                    </SimpleCard>

                    <SimpleCard headingClassName={`!bg-white`} heading={<span className='font-medium'>Product categories</span>}>
                        <div className='flex items-end flex-col gap-2 '>
                            <div className='flex items-center justify-between w-full'>
                                <p className='text-sm font-semibold'>All categories</p>
                                {/* <div className='flex items-center gap-2'>
                                        <div className='rounded-md bg-slate-300 text-slate-600 p-0.5 -rotate-90 cursor-pointer'
                                            title='previous'
                                            onClick={() => getCategory.page > 1 ?
                                                setGetCategory({ ...getCategory, page: getCategory.page - 1 })
                                                : setGetCategory({ page: 1, rowsPerPage: 10, dropdown: true })}
                                        ><ExpandLessIcon /></div>
                                        <span className='text-sm'>list ({getCategory.page})</span>
                                        <div className='rounded-md bg-slate-300 text-slate-600 p-0.5 rotate-90 cursor-pointer'
                                            title='next'
                                            onClick={() => setGetCategory({ ...getCategory, page: getCategory.page + 1 })}><ExpandLessIcon /></div>
                                    </div> */}
                            </div>
                            <div className="flex flex-col h-60 overflow-y-auto border border-solid border-slate-400 p-2 w-full"
                            // onScroll={onScroll}
                            // ref={listInnerRef}
                            >
                                <Productcategories dynArr={getProductCategory} />
                            </div>
                        </div>
                    </SimpleCard>

                    {/* Product tags */}
                    <SimpleCard headingClassName={`!bg-white`} heading={<span className='font-medium'>Product tags</span>}>
                        <div className='flex items-start flex-col gap-2'>
                            {/* <Autocomplete
                                    disablePortal
                                    className='atocompleteCls w-full'
                                    options={autocompleteSelect}
                                    renderInput={(params) => <MuiTextField {...params} onChange={(e)=> console.log(e.target.value, "_params")}/>}
                                /> */}
                            <div className='flex flex-row flex-wrap gap-2' >
                                {tagsMeta?.length ? tagsMeta.map((val: any, idx: number) =>
                                    <div key={idx}>
                                        {productDetails?.tags?.length ? productDetails?.tags.map((v: any, i: number) =>
                                            val?.id === v?.id ?
                                                val?.remove ? null :
                                                    <div key={i} className='p-0.5 px-1.5 text-base bg-slate-200 rounded-full flex items-center gap-1'>
                                                        {v?.name}
                                                        <HighlightOffIcon className='text-lg cursor-pointer' onClick={() => handleDeleteTags(v?.id)} />
                                                    </div> : null
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                            <Autocomplete
                                multiple
                                id="tags"
                                options={tagsArray}
                                onFocus={() => { tagsArray?.length ? null : getTags() }}
                                getOptionLabel={(option: any) => option.name}
                                getOptionDisabled={(option) => option.id === checkTags(option.id)}
                                filterSelectedOptions
                                className='atocompleteCls w-full'
                                onChange={(e: any, v: any) => addTagMeta(v)
                                    //     {

                                    //     setTagsMetaView(v?.length ? v?.map((val: any) => val) : null);
                                    // }
                                }
                                renderInput={(params) => (<MuiTextField {...params} placeholder='Add tag' />)}
                            />
                            {/* <div>
                                    {multitagSelect.length ? multitagSelect.map((i: any, e: number) => <div key={e}><span className='bg-slate-300 rounded-xl p-2'>{i?.label}</span></div>) : null}
                                    <PinkPawsbutton icon={<ClearIcon className='w-5 h-5'/>} name='Clear' pinkPawsButtonExtraCls='gap-1' handleClick={()=> setMultitagSelect([])}/>
                                </div> */}
                        </div>
                    </SimpleCard>

                    {/* HSN */}
                    <SimpleCard headingClassName={`!bg-white`} heading={<span className='font-medium'>HSN</span>}>
                        <div className='flex items-start flex-col gap-2'>

                            {editHsn ?
                                <Autocomplete
                                    id="tags"
                                    options={hsnArray}
                                    getOptionLabel={(option: any) => option.label}
                                    getOptionDisabled={(option) => option.id === productDetails?.hsn_id || hsnMeta}
                                    filterSelectedOptions
                                    className='atocompleteCls w-full'
                                    onChange={(e: any, v: any) => setHsnMeta(v?.id)}
                                    renderInput={(params) => (<MuiTextField {...params} placeholder='Add HSN' />)}
                                />
                                : productDetails?.hsn_id === null ?
                                    <Autocomplete
                                        id="tags"
                                        options={hsnArray}
                                        getOptionLabel={(option: any) => option.label}
                                        getOptionDisabled={(option) => option.id === productDetails?.hsn_id || hsnMeta}
                                        filterSelectedOptions
                                        className='atocompleteCls w-full'
                                        onChange={(e: any, v: any) => setHsnMeta(v?.id)}
                                        renderInput={(params) => (<MuiTextField {...params} placeholder='add HSN' />)}
                                    />
                                    :
                                    <div className='w-full flex items-center justify-between'>
                                        <span className='bg-slate-700 text-white pr-2.5 pl-2 pt-0.5 leading-1 rounded flex items-center gap-2'><div className='bg-white w-fit h-fit p-1 rounded-full'></div>{hsnArray?.length ? hsnArray.filter((va: any) => va?.id === productDetails?.hsn_id).map((value: any) => value?.label) : null}</span>
                                        <div className='border border-solid border-black rounded px-1 cursor-pointer' onClick={() => setEditHsn(true)}><EditIcon className='!text-base' /></div>
                                    </div>
                            }
                        </div>
                    </SimpleCard>

                    {!productDetails?.id ?
                        <PinkPawsbutton name={productDetails?.status?.title === "Draft" ? 'Publish Product' : !productDetails?.id ? 'Publish Product' : 'Update Product'} disabled={slugMeta === "" ? true : false} pinkPawsButtonExtraCls='w-full mb-2 mt-1.5 text-lg font-medium' handleClick={() => updateProduct()} />
                        :
                        <PinkPawsbutton name={productDetails?.status?.title === "Draft" ? 'Publish Product' : !productDetails?.id ? 'Publish Product' : 'Update Product'} pinkPawsButtonExtraCls='w-full mb-2 mt-1.5 text-lg font-medium' handleClick={() => updateProduct()} />
                    }
                </div>
            </div >

        )
    }


    const addNewProduct = async () => {
        // setButtonDisabled(false);
        // setFields(defaultFieldSet);
        // setProductCategoryDetails(undefined);
        // setImages([]);
        // setFieldsErrors(new Object());
        // setOpenFullModal(true);
        // try {
        //     const { data } = await _post(create_product, {})
        //     console.log(data?.success, "____data___")
        //     if (data?.success) (
        //         // getProductDetails(data?.data?.product_id)
        //         setOpenFullModal(true)
        //     )
        // } catch (error) {

        // }
        setOpenFullModal(true)

    }

    const createDraft = async () => {
        try {
            const { data }: any = await _post(create_product, { name: productName, slug: permalink, })
            console.log(data, "_success_")
            if (data?.success) {
                getProductDetails(data?.data?.product_id)
            }
        } catch (error) {
            console.log(error, "_error_")
        }
        // if (draftData?.success) {
        // }
    }

    useEffect(() => {
        if (!productDetails?.id && productTypeSelected === "2" && openFullModal) {
            createDraft()
        }
        if (!productDetails?.id && productName !== "" && permalink !== "" && openFullModal) {
            createDraft()
        }
    }, [productTypeSelected, slugMeta, productDetails?.id, permalink, openFullModal])

    const addNewProductONDetails = async () => {
        try {
            const { data }: any = await _get(`${admin_get_product_slug}/${productName}`)
            if (data?.success) {
                console.log(data?.data, "_success_")
                setSlugMeta(data?.data?.data)
                setPermalink(data?.data?.data)
                setGetProd({ page: pageNo, rowsPerPage: 10 })
                // createDraft()
            }
        } catch (error) {
            console.log(error, "_error_")
        }
    }

    const searchRes = (value: any) => {
        console.log("searchRes", value);
        if (value) {
            setSearchDataValue(value)
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10, search: value });
            setTotalProductGetUrl(`${total_items_product}/${value}`);
        } else {
            setSearchDataValue("")
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10, });
            setTotalProductGetUrl(`${total_items_product}`);
        }
    }

    return (
        <div>
            {/* table */}
            <div className='flex flex-col gap-2 pb-4'>
                <div className='flex flex-wrap gap-2 items-center justify-between'>
                    {/* <div className='flex items-center gap-2'>
                        <SearchField />
                        <ButtonField buttonTxt='Search products' handleClick={() => { }} />
                    </div> */}
                    <SearchAndAddNewComponent
                        buttonTxt={'Search Products'}
                        placeholder={""}
                        addNewProduct={addNewProduct}
                        name={'Add Product'}
                        res={searchRes}
                        listDataChield={
                            <div className='flex items-center gap-2 my-2'>
                                <span className='text-sm' onClick={() => { setPageNo(1), setGetProd({ page: 1, rowsPerPage: 10, deleted_at: false }); setActionValue("bulkAction"), setTotalGetData("totalItem") }}><span className='text-cyan-700 cursor-pointer' >All</span> ({totalProductsView?.totalItem})</span><span>|</span>
                                <span className='text-sm' onClick={() => {
                                    setPageNo(1),
                                        setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10, status_id: 1 }),
                                        setTotalGetData("totalPublished")
                                    setTotalProductGetUrl(`${total_items_product}/${null}/${productTypeValue}/${stockStatusValue}/${1}`);
                                }}><span className='text-cyan-700 cursor-pointer'>Published</span> ({totalProductsView?.totalPublished})</span><span>|</span>
                                <span className='text-sm' onClick={() => {
                                    setPageNo(1),
                                        setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10, status_id: 3 }),
                                        setTotalGetData("totalDraft")
                                    setTotalProductGetUrl(`${total_items_product}/${null}/${productTypeValue}/${stockStatusValue}/${3}`);
                                }}><span className='text-cyan-700 cursor-pointer'>Drafts</span> ({totalProductsView?.totalDraft})</span><span></span>
                                {/* <span className='text-sm' onClick={() => { setPageNo(1), setGetProd({ ...getProd, status_id: null, deleted_at: true }); setActionValue("bulkAction"), setTotalGetData("totalTrash") }}><span className='text-cyan-700'>Trash</span> ({totalProductsView?.totalTrash})</span><span>|</span>
                        <span className='text-sm'><span className='text-cyan-700'>Sorting</span></span> */}
                                {/* <PinkPawsbutton variant='solid' name='Add product' /> */}
                            </div>
                        }
                    />
                </div>

                <div className='flex flex-wrap gap-2 items-center justify-between'>
                    <div className='flex flex-wrap gap-4'>
                        <ActionDrop
                            btnValue="Apply"
                            handleChange={handleChangeAction}
                            menuItemArray={actionArray}
                            value={actionValue}
                            handleClick={() => handleApply()}
                            disabled={checked.length ? false : true}
                        // handleClick={() => actionValue === "moveToTrash" ? handleToggle() : actionValue === "deletePermanently" ? handleToggle() : actionValue === "restore" && handleToggle()}
                        />
                        <div className='flex flex-wrap items-center gap-2'>
                            {/* <SelectField selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeSeo} menuItemArray={seoScoresArray} value={seoValue} /> */}
                            {/* <SelectField selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeReadability} menuItemArray={readabilityScorcesArray} value={readabilityValue} /> */}
                            {/* <SelectField selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeAction} menuItemArray={[]} value={""} /> */}
                            <SelectField placeholder={"Filter by product type"} selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeProductType} menuItemArray={productTypeList} value={productTypeValue} />
                            <SelectField placeholder={"Filter by stock status"} selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeStockStatus} menuItemArray={productStockTypeList} value={stockStatusValue} />
                            <ButtonField buttonTxt={<span className='flex items-center'><FilterAltIcon className='text-lg' />&nbsp;Filter</span>} disabled={(stockStatusValue != null || productTypeValue != null) ? false : true} handleClick={() => handleFilter()} />
                            {(stockStatusValue != null || productTypeValue != null) ? <ButtonField buttonTxt={<span className='flex items-center'><HighlightOffIcon className='text-lg' />&nbsp;Clear</span>} buttonCls={`border !border-solid !border-red-500 hover:!border-red-500 !text-red-500`} disabled={(stockStatusValue != null || productTypeValue != null) ? false : true} handleClick={() => handleClearFilter()} /> : null}
                        </div>
                    </div>
                    <Pageination
                        items={totalGetData === "totalItem" ? totalProductsView?.totalItem : 0 || totalGetData === "totalPublished" ? totalProductsView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalProductsView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalProductsView?.totalTrash : 0}
                        value={pageNo}
                        totalpageNo={getTotalPage()}
                        handleClickFirst={() => setPageNo(1)}
                        handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : (pageNo - 1))}
                        handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                        // disabledMid={true}
                        handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
                        handleClickLast={() => setPageNo(getTotalPage())}
                    />
                </div>
            </div>

            {!tabView ?
                (getProduct?.length ?
                    <Table className='lg:table hidden table-auto w-full productTableCls !border !border-solid'>
                        <TableHead>
                            <TableRow
                                hover
                                role="checkbox"
                                className='bg-slate-200 hover:!bg-slate-200'
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} size="small" />
                                </TableCell>
                                {header.map((col, index) =>
                                    <TableCell className={`${col.field === "Image" ? "!text-center" : "!font-semibold"} !border-0`} key={index}>{col.field !== "Image" ? col.field : col.icon}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getProduct?.map((row: any, index: number) => {
                                return (
                                    <StyledTableRow
                                        hover
                                        key={index}
                                        className='hover:!bg-[#6d8ad70f]'
                                    // sx={{ cursor: 'pointer' }}
                                    >
                                        <StyledTableCell padding="checkbox" className='!border-0 !w-[2.5%]'>
                                            <Checkbox
                                                // checked={prodCheck?.product_id === row?.id ? true : false}
                                                checked={checked.includes(row?.id)}
                                                // onClick={() => prodCheck?.product_id !== row?.id ? setProdCheck({ product_id: row?.id }) : setProdCheck({})}
                                                onClick={(e) => handelTableCheckBox(e, row?.id)}
                                                size="small"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell onClick={() => { getProductDetails(row?.id) }} className='cursor-pointer !border-0 !w-[5%]'>
                                            <div className='flex items-center justify-center w-full'>
                                                <Image src={row?.images.length ? row?.images[0].src : productImage} alt='productImage' className='w-10 h-10' width={192} height={108} priority />
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell onClick={() => { getProductDetails(row?.id) }} className='cursor-pointer !border-0 !w-[25%] !font-medium !text-[#2271b1]'>
                                            {row?.name ? row?.name : "--"}
                                        </StyledTableCell>
                                        <StyledTableCell onClick={() => { getProductDetails(row?.id) }} className='cursor-pointer !border-0 !w-[10%]'>
                                            {row?.sku ? row?.sku : "--"}
                                        </StyledTableCell>
                                        <StyledTableCell className='!w-[10%] cursor-pointer !border-0' onClick={() => { getProductDetails(row?.id) }}>
                                            {row?.variation_stock_status ?
                                                <span className={`font-bold ${row?.variation_stock_status ? "text-lime-500" : "text-red-500"}`}>{row?.variation_stock_status ? "In stock" : "Out of stock"}</span>
                                                :
                                                <>
                                                    <span className={`font-bold ${row?.stock_quantity > 0 ? "text-lime-500" : "text-red-500"}`}>{row?.stock_quantity > 0 ? "In stock" : "Out of stock"}</span>&nbsp;{row?.stock_quantity ? row?.stock_quantity >= 1000 ? `(${(row?.stock_quantity / 1000).toFixed(1)}K)` : `(${row?.stock_quantity})` : ""}
                                                </>
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell onClick={() => { getProductDetails(row?.id) }} className='cursor-pointer !border-0 !w-[5%]'>
                                            &#8377;{row?.price ? row?.price : "--"}
                                        </StyledTableCell>
                                        <StyledTableCell className='!w-[15%] !border-0 !font-medium !text-[#2271b1]' >
                                            {row?.categories?.length ?
                                                row?.categories.map((v: any, i: number) =>
                                                    <Link key={i} href={`/admin/categories?s=${v?.slug}`} className='cursor-pointer'>{capitalize(v?.name)}, </Link>)
                                                : "--"}
                                        </StyledTableCell>
                                        {/* <StyledTableCell onClick={() => { getProductDetails(row?.id) }} className='cursor-pointer'>{row?.tags?.length ? row?.tags.map((i: any) => `${i?.name},`) : "--"}</StyledTableCell> */}
                                        {/* <StyledTableCell onClick={() => { getProductDetails(row?.id) }}>{row?.featured ? "00" : "--"}</StyledTableCell> */}
                                        <StyledTableCell className='!border-0 !w-[10%]'>
                                            <ActionDrop
                                                btnValue="Apply"
                                                selectFieldCls={`!bg-[#ffffff] !text-[14px]`}
                                                handleChange={(e: any) => handleChangeStatus(row?.id, e.target.value)}
                                                menuItemArray={getStatus}
                                                value={getStatus.filter((v: any) => v?.id === row?.status?.id)[0]?.id}
                                                btn={true}
                                                needId={true}
                                                needtitle={true}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell onClick={() => { getProductDetails(row?.id) }} className='cursor-pointer !border-0 !w-[12%]'>
                                            {row?.date_created ? moment(row?.date_created).format("DD/MM/YYYY") + " " + `at` + " " + moment(row?.date_created).format("h:mm a") : "--"}
                                        </StyledTableCell>
                                        <StyledTableCell className='!border-0 !w-[5%]'>
                                            <div className='flex flex-row gap-2'>
                                                <EditIcon className='w-6 h-6 text-linkBlue-01 cursor-pointer' onClick={() => { getProductDetails(row?.id) }} />
                                                <DeleteIcon className='w-6 h-6 text-red-500 cursor-pointer' onClick={() => { setConfirmStatus(row?.id) }} />
                                            </div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })
                            }
                        </TableBody>
                    </Table>
                    :
                    <div className='w-full flex items-center justify-center'>No data found</div>
                ) : (
                    <div className='border border-solid rounded text-center'>
                        <div className='flex items-center justify-start bg-offWhite-01 px-4'>
                            <Checkbox />
                            <p>Name</p>
                        </div>

                        <div className='flex'>
                            <div className='flex flex-col w-full'>
                                {getProduct.length ? getProduct.map((row: any, index: number) => {
                                    return (
                                        <>
                                            <hr />
                                            <div
                                                key={index}
                                                className='p-4'
                                            >
                                                <div className='flex justify-between items-center gap-4'
                                                    onClick={() => {
                                                        onHandleAcordian(row?.id);
                                                        console.log(row?.id, "row?.id")
                                                    }}
                                                >
                                                    <div className='flex items-center'>
                                                        <Checkbox
                                                            checked={prodCheck?.product_id === row?.id ? true : false}
                                                            onClick={() => prodCheck?.product_id !== row?.id ? setProdCheck({ product_id: row?.id }) : setProdCheck({})}
                                                        />
                                                        {acordian === row?.id ?
                                                            <Image src={row?.Image ? row?.Image : productImage} alt='productImage' height={40} priority />
                                                            : <div className='flex justify-between w-full' onClick={() => { getProductDetails(row?.id) }}>{row?.name ? row?.name : "--"}</div>}
                                                    </div>
                                                    <ArrowDropDownIcon className={acordian === row?.id ? 'rotate-180' : ''} />
                                                </div>
                                                <div className={`flex flex-wrap text-sm items-start gap-1  ${acordian === row?.id ? "px-10 py-2" : "pl-3"}`}>
                                                    <span className="text-gray-500">ID: {row?.id}</span> |
                                                    <span className="text-cyan-700" onClick={() => { getProductDetails(row?.id) }}>Edit</span> |
                                                    {/* <span className="text-cyan-700">Quick&nbsp;Edit</span> |
                                                    <span className="text-red-600">Trash</span> |
                                                    <span className="text-cyan-700">View</span> |
                                                    <span className="text-cyan-700">Duplicate</span> |
                                                    <span className="text-cyan-700">Promote with Blaze</span> */}
                                                </div>
                                                {row?.id === acordian ?
                                                    <div className='pl-10'>
                                                        <div className='flex justify-between w-full'>{row?.name ? row?.name : "--"}</div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>sku</div><div className='text-left w-[80%] flex items-start'>{row?.sku ? row?.sku : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>stock</div><div className='text-left w-[80%] flex items-start'><span className={`font-medium ${row?.stock_quantity > 0 ? "text-lime-500" : "text-red-500"}`}>{row?.stock_quantity > 0 ? "In stock" : "Out of stock"}</span>&nbsp;({row?.stock_quantity ? row?.stock_quantity : 0})</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>price</div><div className='text-left w-[80%] flex items-start'>&#8377;{row?.price ? row?.price : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>categories</div><div className='text-left w-[80%] flex items-start'>{row?.categories?.length ? `${row?.categories.map((i: any) => i?.name)},` : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>tags</div><div className='text-left w-[80%] flex items-start'>{row?.tags?.length ? `${row?.tags.map((i: any) => i?.name)},` : "--"}</div></div>
                                                        {/* <div className='flex justify-between w-full'><div className='text-left w-[15%]'>featured</div><div className='text-left w-[80%] flex items-start'>{row?.featured ? "00" : "--"}</div></div> */}
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>status</div><div className='text-left w-[80%] flex items-start'>
                                                            <ActionDrop
                                                                btnValue="Apply"
                                                                handleChange={(e: any) => handleChangeStatus(row?.id, e.target.value)}
                                                                menuItemArray={getStatus}
                                                                value={getStatus.filter((v: any) => v?.id === row?.status?.id)[0]?.id}
                                                                btn={true}
                                                                needId={true}
                                                                needtitle={true}
                                                            />
                                                        </div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>date</div><div className='text-left w-[80%] flex items-start'>{row?.date_created ? moment(row?.date_created).format("DD/MM/YYYY") + " " + `at` + " " + moment(row?.date_created).format("h:mm a") : "--"}</div></div>
                                                    </div> : null}
                                            </div>
                                        </>
                                    );
                                }) : <div className='w-full flex items-center justify-center p-4'>No data found</div>}
                            </div>
                        </div>
                    </div>
                )}

            <div className='flex flex-wrap items-center justify-between pt-4'>
                <ActionDrop
                    btnValue="Apply"
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    handleClick={() => handleApply()}
                    disabled={checked.length ? false : true}
                // handleClick={() => actionValue === "moveToTrash" ? handleToggle() : actionValue === "deletePermanently" ? handleToggle() : actionValue === "restore" && handleToggle()}
                />

                <Pageination
                    items={totalGetData === "totalItem" ? totalProductsView?.totalItem : 0 || totalGetData === "totalPublished" ? totalProductsView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalProductsView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalProductsView?.totalTrash : 0}
                    value={pageNo}
                    totalpageNo={getTotalPage()}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : (pageNo - 1))}
                    handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                    // disabledMid={true}
                    handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
                    handleClickLast={() => setPageNo(getTotalPage())}
                />
            </div>

            <FullpageModal
                modalStat={openFullModal}
                handleClose={() => {
                    closeFullPageModal();
                    // handleFilter();
                }}
                heading={productDetails?.id && productDetails?.status?.title !== "Draft" ? 'Edit Product' : productDetails?.status?.title === "Draft" ? 'Publish Product' : 'Add Product'}
            >
                {ProductDetailsEdit()}
                <Dialog
                    open={openDilog}
                    onClose={() => setOpenDilog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <div className='bg-white flex flex-col justify-between h-full p-4'>
                        <div className='flex items-center justify-end pb-2'>
                            <CloseIcon className=" cursor-pointer" onClick={() => { setOpenDilog(false) }} />
                        </div>
                        <p className='flex flex-col items-center justify-center pb-4'>
                            <span>Would you like to save this product as a draft?</span>
                        </p>
                        <div className='flex items-center gap-4'>
                            <PinkPawsbutton name='Delete' variant='outlined' pinkPawsButtonExtraCls='w-full' handleClick={() => { deleteDraft(); }} />
                            <PinkPawsbutton name='Save' pinkPawsButtonExtraCls='w-full' handleClick={() => {
                                saveDraft();
                            }} />
                        </div>
                    </div>
                </Dialog>
            </FullpageModal>

            <Dialog
                open={confirmStatus !== ""}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent className='w-80 h-40 p-4'>
                    <div className='bg-white flex flex-col justify-between h-full'>
                        <p className='flex flex-col items-center justify-center'>
                            <span>Do you want to delete this record?</span>
                        </p>
                        <div className='flex items-center gap-4'>
                            <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { handleApplyDelete(confirmStatus); }} />
                            <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => { setConfirmStatus("") }} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Products