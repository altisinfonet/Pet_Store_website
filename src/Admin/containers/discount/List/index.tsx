import React, { useEffect, useState } from 'react'
import ActionDrop from '../../../../Admin/components/ActionDrop'
import Pageination from '../../../../Admin/components/Pageination'
import useTabView from '../../../../Admin/hooks/useTabView'
import { Autocomplete, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField as MuiTextField, Tooltip, RadioGroup, Radio, Dialog, DialogContent, styled, tableCellClasses } from '@mui/material';
import Image from 'next/image'
import productImage from "../../../../../public/assets/admin/images/product.png"
import moment from 'moment'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useRead } from '../../../../Admin/hooks'
import getUrlWithKey from '../../../../Admin/util/_apiUrl'
import axios from 'axios';
import FullpageModal from '../../../../Admin/components/FullPageModal'
import PinkPawsbutton from '../../../../Admin/components/PinkPawsbutton'
import TextAreaField from '../../../../Admin/components/TextAreaField'
import TextField from '../../../../Admin/components/TextField'
import DynamicForm from '../../../../Admin/components/Form'
import { formatDate, generateCouponCode, isEmptyObject, urlToBase64 } from '../../../../Admin/util/_common'
import { toast } from 'react-toastify';
import { _ERROR, _SUCCESS } from '../../../../Admin/util/_reactToast'
import ImageUploader from '../../../../Admin/components/ImageUploader'
import RightSideModal from '../../../../Admin/components/RightSideModal'
import SearchAndAddNewComponent from '../../../../Admin/components/searchAddNewComponent'
import IOSSwitch from '../../../../Admin/components/SwitchButtonMui'
import { useRouter } from 'next/router'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { _post } from '../../../services'

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



const DiscountList = ({ children }: any) => {
    const router = useRouter();
    const defaultFieldSet = {
        code: "",
        descriptions: "",
        general: {
            type: "",
            amount: "",
            ex_date: "",
            ex_date_gmt: "2024-05-01"
        },
        coupon_id: null
    }

    const [actionValue, setActionValue] = useState("delete")
    const [pageNo, setPageNo] = useState(1)
    const [prodCheck, setProdCheck]: any = useState({})
    const [acordian, setAcordian]: any = useState()
    const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10, search: '' })
    const [openFullModal, setOpenFullModal] = useState(false)
    const [dataSetCategory, setDataSetCategory] = useState()
    const [productCouponDetails, setProductCouponDetails]: any = useState()
    const [fields, setFields] = useState(defaultFieldSet);
    // const [fields, setFields] = useState(new Object());
    const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());
    const [images, setImages] = useState<any>([]);
    const [imageError, setImageError] = useState("");
    const [formdata, setFormdata] = useState({})
    const [getProductDetailsUrl, setGetProductDetailsUrl] = useState("");
    const [oldImageName, setOldImageName] = useState("");
    const [restoreImage, setRestoreImage] = useState<any>([]);
    const [restoreButton, setRestoreButton] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [totalGetData, setTotalGetData] = useState("totalItem");
    const [totalpageNo, setTotalPageNo]: any = useState();
    const [totalCategoryGetUrl, setTotalCategoryGetUrl] = useState("");
    const [totalCouponGetUrl, setTotalCouponGetUrl] = useState("");
    const [checked, setChecked] = useState<any[]>([]);
    const [switchStatus, setSwitchStatus] = useState<{ [index: string]: any }>({});
    const [confirmStatus, setConfirmStatus]: any = useState("")

    useEffect(() => {
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo]);



    const { sendData: totalCategoriesView }: any = useRead({ selectMethod: "get", url: totalCategoryGetUrl });
    const { sendData: totalCouponView }: any = useRead({ selectMethod: "get", url: totalCouponGetUrl });

    const { create_product_category, get_product_category, get_product_category_details, update_product_category_image, update_product_category, total_items_category, delete_multiple_product_category } = getUrlWithKey("products_categories");

    const { get, __delete, total_items_coupon, create, update } = getUrlWithKey("coupon");
    const { getDiscount, total_items_discount, deleteDiscount, enbleStatusUpdate } = getUrlWithKey("discount");


    useEffect(() => {
        setTotalCouponGetUrl(total_items_discount);
    }, []);

    useEffect(() => {
        if (totalCouponView?.totalItem) {
            setTotalCouponGetUrl("");
        }
    }, [totalCouponView])

    const { tabView } = useTabView()

    useEffect(() => {
        if (totalGetData === "totalPublished") {
            let page = totalCouponView?.totalPublished < 10 ? 1 : Math.ceil((totalCouponView?.totalPublished / 10))
            setTotalPageNo(page)
        } else if (totalGetData === "totalDraft") {
            let page = totalCouponView?.totalDraft < 10 ? 1 : Math.ceil((totalCouponView?.totalDraft / 10))
            setTotalPageNo(page)
        } else if (totalGetData === "totalTrash") {
            let page = totalCouponView?.totalDraft < 10 ? 1 : Math.ceil((totalCouponView?.totalDraft / 10))
            setTotalPageNo(page)
        } else {
            setTotalPageNo()
        }
    }, [totalGetData])

    const { sendData: getProductCategory }: any = useRead({ selectMethod: "put", url: get_product_category, callData: getProd });
    let { sendData: getCoupon }: any = useRead({ selectMethod: "put", url: getDiscount, callData: getProd });

    console.log("getCoupon", getCoupon);

    useEffect(() => {
        if (getCoupon && getCoupon?.length) {
            getCoupon.map((v: any, i: number) => {
                setSwitchStatus(pre => ({
                    ...pre,
                    [v.id]: v?.enable
                }))
            })
        }
    }, [getCoupon])

    const addNewProduct = () => {
        setButtonDisabled(false);
        setFields(defaultFieldSet);
        setProductCouponDetails(undefined);
        setImages([]);
        setFieldsErrors(new Object());
        setOpenFullModal(true);
    }

    // const { sendData: getProductDetailsData }: any = useRead({ selectMethod: "get", url: getProductDetailsUrl });

    // useEffect(() => {
    //     console.log('data:: ', getProductDetailsData);
    //     if (getProductDetailsData?.id) {
    //         setProductCategoryDetails(getProductDetailsData);
    //         if (getProductDetailsData?.id) {
    //             setOpenFullModal(true)
    //         } else {
    //             setOpenFullModal(false)
    //         }
    //     }
    //     // setGetProductDetailsUrl("");
    // }, [getProductDetailsUrl])


    const getProductDetails = async (id: any) => {
        router.push(`/admin/discount/${id}`);
    }

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
        if (e?.target?.checked && getCoupon && getCoupon?.length) {
            const arr = [];
            for (let g = 0; g < getCoupon.length; g++) {
                if (getCoupon[g] && getCoupon[g]?.id) {
                    arr.push(getCoupon[g]?.id);
                }
            }
            setChecked(arr);
        } else {
            setChecked([]);
        }
    }

    const handelApply = async () => {
        console.log("handelApply", actionValue, checked);
        if (actionValue === 'delete' && checked?.length) {
            try {
                const { data } = await axios.post(`${deleteDiscount}`, { id: checked });
                if (data?.success) {
                    console.log("handelApply-data", data);
                    _SUCCESS(data?.massage);
                    setFields(defaultFieldSet);
                    setPageNo(1)
                    setGetProd({ page: pageNo, rowsPerPage: 10 })
                    setActionValue("delete");
                    setChecked([]);
                    setTotalCouponGetUrl(total_items_discount);
                }
            } catch (error) {
                console.error(error);
            }

        }
    }

    const handleApplyDelete = async (delId: any) => {
        try {
            const { data } = await axios.post(`${deleteDiscount}`, { id: [delId] });
            if (data?.success) {
                console.log("handelApply-data", data);
                _SUCCESS(data?.massage);
                setPageNo(pageNo);
                setGetProd({ page: pageNo, rowsPerPage: 10 })
                setActionValue("bulkAction");
                setChecked([]);
                setTotalCouponGetUrl(total_items_discount);
                setConfirmStatus("");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleImage = (e: any) => {
        // setImages(e.target.files);
        // setImageError("");
        // console.log('e: ', e);
        setImages(e);
        // if (fields?.product_category_id != null) {
        //     setRestoreImage(e);
        // }
        setImageError("");
    }

    const handelOnChange = (e: any, extend?: string) => {
        // console.log('llg: ', e.target.checked);
        const stateName = e.target.name;
        const stateValue = e.target.value;
        console.log('d', e.target, extend)

        // let stateValue: null = null;
        // if (e.target.checked != undefined) {
        //     stateValue = e.target.checked
        // } else {
        //     stateValue = e.target.value;
        // }

        if (!extend) {
            setFields(pre => ({
                ...pre,
                [stateName]: stateValue
            }));
        } else {
            setFields((pre: any) => ({
                ...pre,
                [extend]: {
                    ...pre[extend],
                    [stateName]: stateValue
                }
            }));

            setFieldsErrors(pre => ({
                ...pre,
                [extend]: {
                    ...pre[extend],
                    [stateName]: ""
                }
            }));
        }

        clearValidation(stateName);
    }

    const handleCheckbox = (e: any) => {
        const stateName = e.target.name;
        const stateValue = e.target.checked;

        setFields(pre => ({
            ...pre,
            [stateName]: stateValue
        }))

        clearValidation(stateName);
    }

    const stringToSlug = (str: string) => {
        return str
            .trim()
            .toLowerCase()
            .replace(/[\W_]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleSlug = (e: any) => {
        let slug = stringToSlug(e.target.value);
        setFields(pre => ({
            ...pre,
            ["slug"]: `${slug}`
        }))

        clearValidation("slug");
    }

    const validation = (stateHandler: { [x: string]: any }, required_fields: string[] = [], extend?: string) => {
        let valid = true;
        if (!isEmptyObject(stateHandler) && required_fields.length) {
            for (let i = 0; i < required_fields.length; i++) {

                if (!extend) {
                    if (!stateHandler[required_fields[i]]) {
                        setFieldsErrors(pre => ({
                            ...pre,
                            [required_fields[i]]: "This fields is required!"
                        }));
                        valid = false;
                    }

                    for (let key in stateHandler) {
                        if (key == required_fields[i] && !stateHandler[key]) {
                            setFieldsErrors(pre => ({
                                ...pre,
                                [key]: "This fields is required!"
                            }));
                            valid = false;
                        }
                        if (fieldsErrors[key]) {
                            valid = false;
                        }
                    }
                }

                if (extend) {
                    if (!stateHandler[extend][required_fields[i]]) {
                        setFieldsErrors(pre => ({
                            ...pre,
                            [extend]: {
                                ...pre[extend],
                                [required_fields[i]]: "This fields is required!"
                            }

                        }));
                        valid = false;
                    }

                    for (let key in stateHandler[extend]) {
                        if (key == required_fields[i] && !stateHandler[extend][key]) {
                            setFieldsErrors(pre => ({
                                ...pre,
                                [extend]: {
                                    ...pre[extend],
                                    [key]: "This fields is required!"
                                }

                            }));
                            valid = false;
                        }
                        if (fieldsErrors[extend] && fieldsErrors[extend][key]) {
                            valid = false;
                        }
                    }
                }
            }
        } else {
            if (!extend) {
                required_fields.forEach(item => setFieldsErrors(pre => ({
                    ...pre,
                    [item]: "This fields is required!"
                })));
            }

            if (extend) {
                required_fields.forEach(item => setFieldsErrors((pre: any) => ({
                    ...pre,
                    [extend]: {
                        ...pre[extend],
                        [item]: "This fields is required!"
                    }
                })));
            }
        }

        return valid;
    }

    const clearValidation = (stateName: string) => {
        setFieldsErrors(pre => ({
            ...pre,
            [stateName]: ""
        }));
    }

    const handleSubmit = async () => {
        console.log("coupfields", fields)
        try {
            let valid = false;
            setButtonDisabled(true);
            setFieldsErrors(new Object());

            valid = validation(fields, ["code"]);
            valid = validation(fields, ["type", "amount", "ex_date"], "general");


            if (valid) {
                if (fields && fields?.coupon_id) {
                    // console.log('lennn: ', images?.length);
                    const { data } = await axios.post(`${update}`, fields);

                    // console.log('dddd::::: ', data);
                    if (data?.success) {
                        _SUCCESS(data?.massage);
                        setFields(defaultFieldSet);
                        setButtonDisabled(false);
                        setOpenFullModal(false);
                        setGetProd({ page: pageNo, rowsPerPage: 10 })
                    } else {
                        _ERROR(data?.message);
                        setButtonDisabled(false);
                    }

                } else {
                    let Mfields: any = { ...fields };
                    delete Mfields['coupon_id'];
                    const { data } = await axios.post(`${create}`, Mfields);

                    if (data?.success) {

                        // console.log('imageRes: ', imgRes);
                        _SUCCESS(data?.massage);
                        setFields(defaultFieldSet);
                        setButtonDisabled(false);
                        setOpenFullModal(false);
                        setTotalCouponGetUrl(total_items_discount);
                        setGetProd({ page: pageNo, rowsPerPage: 10 })
                    } else {
                        _ERROR(data?.massage);
                        setButtonDisabled(false);
                    }
                }
            } else {
                setButtonDisabled(false);
            }
        } catch (error: any) {
            _ERROR("Something Went To Wrong");
            setButtonDisabled(false);
            // console.log('error: ', error?.response?.data);
            console.log('error: ', error);
        }
    }

    const actionArray = [
        // { value: "bulkAction", name: "Bulk action" },
        { value: "delete", name: "Delete" },
    ]

    const header = [
        { field: 'Title' },
        { field: 'Discount Type' },
        { field: 'Start Date' },
        { field: 'Expiry On' },
        { field: 'Status' },
        { field: 'Action' }
    ];

    // const dynamicCategoiFormObject = {
    //     "Parent_category": {
    //         type: "dropField",
    //         id: "Parent_category",
    //         name: "Parent category",
    //         label: "Parent category",
    //         MenuItem: getProductCategory,
    //         dynmicList: true,
    //         // MenuItem: [
    //         //     { value: "ParentCategory", name: "Parent category" },
    //         //     { value: "vimeoVideo", name: "Vimeo video" },
    //         //     { value: "selfHostedVideo", name: "Self hosted video (MP4, WebM, and Ogg)" },
    //         //     { value: "other", name: "Other (embedUrl)" },
    //         // ],
    //         defaultVal: "Youtube video",
    //     }
    // }


    const handleChangeAction = (e: any) => {
        setActionValue(e.target.value);
    }

    const handleToggle = () => {
        console.log('ddd::::: ', actionValue);
        // setDoTrashProd(delete_product);
        if (actionValue === "delete") {

        }
    }

    const onHandleAcordian = (id: number | string) => {
        if (id === acordian) {
            setAcordian(null)
        } else {
            setAcordian(id as number)
        }
    }

    // Get Data For Update
    useEffect(() => {
        // console.log("dataSet editDataSet", productCategoryDetails)
        if (productCouponDetails !== null && productCouponDetails?.id) {
            const formattedDate = new Date(productCouponDetails?.couponMetaData?.general?.ex_date).toISOString().substring(0, 10);
            const data: any = {
                code: productCouponDetails?.code,
                descriptions: productCouponDetails?.descriptions,
                general: {
                    general_id: productCouponDetails?.couponMetaData?.general?.id,
                    type: productCouponDetails?.couponMetaData?.general?.type,
                    amount: productCouponDetails?.couponMetaData?.general?.amount,
                    ex_date: formattedDate,
                    ex_date_gmt: formattedDate
                },
                coupon_id: productCouponDetails?.id
            }
            console.log("dataCreate", data);
            setFields({ ...fields, ...data });

            // if (catForm) {
            //     setFields({ name: productCategoryDetails?.name, desc: editDataSet?.desc, _id: editDataSet?._id });
            //     setImages(editDataSet?.image);
            // } else if (blogForm) {
            //     const customDate = new Date(editDataSet?.date);

            //     const y = `${customDate.getFullYear()}`;
            //     const m = `${customDate.getMonth() + 1}`;
            //     const d = `${customDate.getDate()}`;

            //     const year = y;
            //     const month = m.length > 1 ? m : `0${m}`;
            //     const day = d.length > 1 ? d : `0${d}`;

            //     const formattedDate = `${year}-${month}-${day}`;

            //     const dataf = {
            //         title: editDataSet?.title, desc: editDataSet?.desc, _id: editDataSet?._id,
            //         selectedOption: editDataSet?.selected_cat_ids, slug: editDataSet?.slug,
            //         date: formattedDate
            //     }
            //     setFields(dataf);
            //     setImages(editDataSet?.image);

            // }
        }
    }, [productCouponDetails]);

    const getTotalPage = (): number => {
        console.log("list?.totalPage", totalCouponView?.totalPage)
        if (totalCouponView?.totalPage && totalCouponView?.totalPage !== 0) {
            return totalCouponView?.totalPage;
        } else if (totalCouponView?.totalPage === 0) {
            return 1;
        } else {
            return 0;
        }
    }

    const handelGenerateCode = (): void => {
        const code = generateCouponCode(8);
        setFields(pre => ({
            ...pre,
            code
        }));

        setFieldsErrors(pre => ({
            ...pre,
            ["code"]: ""
        }));
    }

    const searchRes = (value: any) => {
        if (value) {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10, search: value });
            setTotalCouponGetUrl(`${total_items_discount}/${value}`);
        } else {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10 });
            setTotalCouponGetUrl(total_items_discount);
        }
    }

    const handleChange = async (e: any, id: string) => {
        console.log("handleChange", e);
        if (e.target) {
            setSwitchStatus(pre => ({
                ...pre,
                [id]: e.target?.checked
            }));
            try {
                const { data } = await _post(enbleStatusUpdate, { id, enable: e.target?.checked });
                if (data?.success) {
                    _SUCCESS("Discount Status Updated Successfully!");
                }
            } catch (error) {
                console.error(error);
            }

        }
    }

    console.log(getProductCategory, "getProductCategory")

    return (
        <div className='w-full flex flex-col items-start justify-center gap-2'>
            <SearchAndAddNewComponent buttonTxt={'Search Discount'} addNewProduct={addNewProduct} name={'Add Discount'} res={searchRes} />

            <div className='flex w-full flex-wrap gap-2 items-center justify-between'>
                <ActionDrop
                    btnValue="Apply"
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    handleClick={() => handelApply()}
                    disabled={checked.length ? false : true}
                // handleClick={() => actionValue === "delete" && handleToggle()}
                />
                {/* <PinkPawsbutton
                    variant={"solid"}
                    name={"Add Coupon"}
                    icon={""}
                    handleClick={addNewProduct}
                    pinkPawsButtonExtraCls={""}
                    style={{}}
                    disabled={false}
                    title={""}
                /> */}
                <Pageination
                    items={totalGetData === "totalItem" ? totalCouponView?.totalItem : 0 || totalGetData === "totalPublished" ? totalCouponView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalCouponView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalCouponView?.totalTrash : 0}
                    value={pageNo}
                    totalpageNo={getTotalPage()}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo == 1 ? 1 : (pageNo - 1))}
                    handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(getTotalPage() == 1 ? 1 : pageNo + 1)}
                    handleClickLast={() => setPageNo(getTotalPage())}
                />
            </div>

            {!tabView ?
                (getCoupon?.length ?
                    <Table className='lg:table hidden table-auto w-full productTableCls !border !border-solid'>
                        <TableHead>
                            <TableRow
                                hover
                                role="checkbox"
                                className='bg-slate-200 hover:!bg-slate-200'
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} checked={checked?.length === getCoupon?.length ? true : false} size="small" />
                                </TableCell>
                                {header.map((col, index) =>
                                    <TableCell key={index}>{col.field}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getCoupon?.map((row: any, index: number) => {
                                return (
                                    <StyledTableRow
                                        hover
                                        key={index}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <StyledTableCell className='!w-[8%]' padding="checkbox">
                                            <Checkbox
                                                // checked={prodCheck?.product_id === row?.id ? true : false} 
                                                checked={checked.includes(row?.id)}
                                                // onClick={() => prodCheck?.product_id !== row?.id ? setProdCheck({ product_id: row?.id }) : setProdCheck({})}
                                                onClick={(e) => handelTableCheckBox(e, row?.id)}
                                                size="small"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell className='!w-[10%]' onClick={() => { getProductDetails(row?.id) }}>
                                            {row?.title ? row?.title : "--"}
                                        </StyledTableCell>
                                        <StyledTableCell className='!w-[10%]' onClick={() => { getProductDetails(row?.id) }}>{row?.discountType?.lable ? row?.discountType?.lable : "--"}</StyledTableCell>
                                        <StyledTableCell className='!w-[10%]' onClick={() => { getProductDetails(row?.id) }}>{row?.DiscountRuleLimit?.valid_from ? formatDate(row?.DiscountRuleLimit?.valid_from) : "--"}</StyledTableCell>
                                        <StyledTableCell className='!w-[10%]' onClick={() => { getProductDetails(row?.id) }}>{row?.DiscountRuleLimit?.valid_to ? formatDate(row?.DiscountRuleLimit?.valid_to) : "--"}</StyledTableCell>
                                        <StyledTableCell className='!w-[15%]'>
                                            <IOSSwitch value={switchStatus[row?.id]} checked={switchStatus[row?.id]} onChange={(e: any) => handleChange(e, row?.id)} />
                                            &nbsp;
                                            <span>{switchStatus[row?.id] ? '-(Running)' : null}</span>
                                        </StyledTableCell>
                                        <StyledTableCell className='!w-[10%]'>
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
                    <div className='border border-solid rounded text-center w-full'>
                        <div className='flex items-center justify-start bg-offWhite-01 px-4'>
                            <Checkbox />
                            <p>Name</p>
                        </div>

                        <div className='flex'>
                            <div className='flex flex-col w-full'>
                                {getProductCategory.length ? getProductCategory.map((row: any, index: number) => {
                                    return (
                                        <>
                                            <hr />
                                            <div
                                                key={index}
                                                className='p-4'
                                            >
                                                <div className='flex justify-between items-center gap-4' onClick={() => onHandleAcordian(row?.id)} >
                                                    <div className='flex items-center'>
                                                        <Checkbox />
                                                        {acordian === row?.id ?
                                                            <Image src={row?.image ? row?.image : productImage} alt='productImage' width={40} height={40} priority />
                                                            : <div className='flex justify-between w-full'>{row?.name ? row?.name : "--"}</div>}
                                                    </div>
                                                    <ArrowDropDownIcon className={acordian === row?.id ? 'rotate-180' : ''} />
                                                </div>
                                                <div className={`flex flex-wrap text-sm items-start gap-1  ${acordian === row?.id ? "px-10 py-2" : "pl-3"}`}>
                                                    <span className="text-cyan-700" style={{ cursor: 'pointer' }} onClick={() => { getProductDetails(row?.id) }}>Edit</span> |
                                                    <span className="text-cyan-700" style={{ cursor: 'pointer' }} onClick={() => { getProductDetails(row?.id) }}>Quick&nbsp;Edit</span> |
                                                    <span className="text-red-600" style={{ cursor: 'pointer' }} >Delete</span> |
                                                    <span className="text-cyan-700" style={{ cursor: 'pointer' }} onClick={() => { getProductDetails(row?.id) }}>View</span> |
                                                    {/* <span className="text-cyan-700">Make default</span> */}
                                                </div>
                                                {acordian === row?.id ?
                                                    <div className='pl-10'>
                                                        <div className='flex justify-between w-full'>{row?.name ? row?.name : "--"}</div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>Description</div><div className='text-left w-[80%] flex items-start'>{row?.description ? row?.description : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>Slug</div><div className='text-left w-[80%] flex items-start'>{row?.slug ? row?.slug : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>Count</div><div className='text-left w-[80%] flex items-start'>{row?.count ? row?.count : "--"}</div></div>
                                                    </div> : null}
                                            </div>
                                        </>
                                    );
                                }) : <div className='w-full flex items-center justify-center p-4'>No data found</div>}
                            </div>
                        </div>
                    </div>
                )}
            <div className='flex w-full flex-wrap gap-2 items-center justify-between'>
                <ActionDrop
                    btnValue="Apply"
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    handleClick={() => handelApply()}
                    disabled={checked.length ? false : true}
                // handleClick={() => actionValue === "delete" && handleToggle()}
                />
                {/* <PinkPawsbutton
                    variant={"solid"}
                    name={"Add Coupon"}
                    icon={""}
                    handleClick={addNewProduct}
                    pinkPawsButtonExtraCls={""}
                    style={{}}
                    disabled={false}
                    title={""}
                /> */}
                <Pageination
                    items={totalGetData === "totalItem" ? totalCouponView?.totalItem : 0 || totalGetData === "totalPublished" ? totalCouponView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalCouponView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalCouponView?.totalTrash : 0}
                    value={pageNo}
                    totalpageNo={getTotalPage()}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo == 1 ? 1 : (pageNo - 1))}
                    handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(getTotalPage() == 1 ? 1 : pageNo + 1)}
                    handleClickLast={() => setPageNo(getTotalPage())}
                />
            </div>

            <RightSideModal modalStat={openFullModal} handleClose={() => setOpenFullModal(false)} heading={(productCouponDetails != undefined && productCouponDetails != '') ? 'Update Discount' : 'Add Discount'} widthClss='lg:w-[30vw] w-[24vw]'>
                <div className='flex items-start gap-2.5'>
                    {children}
                </div>

            </RightSideModal>

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

export default DiscountList