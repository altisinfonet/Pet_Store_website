import React, { useEffect, useState } from 'react'
import ActionDrop from '../../components/ActionDrop'
import Pageination from '../../components/Pageination'
import useTabView from '../../../hooks/useTabView'
import { Checkbox, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import Image from 'next/image'
import productImage from "../../../../public/assets/images/product.png"
import moment from 'moment'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useRead } from '../../../hooks'
import getUrlWithKey from '../../util/_apiUrl'
import axios from 'axios';
import FullpageModal from '../../components/FullPageModal'
import PinkPawsbutton from '../../components/PinkPawsbutton'
import TextAreaField from '../../components/TextAreaField'
import TextField from '../../components/TextField'
import DynamicForm from '../../components/Form'
import { generateCouponCode, isEmptyObject, urlToBase64 } from '../../util/_common'
import { toast } from 'react-toastify';
import { _ERROR, _SUCCESS } from '../../util/_reactToast'
import ImageUploader from '../../components/ImageUploader'
import RightSideModal from '../../components/RightSideModal'
import SearchAndAddNewComponent from '../../components/searchAddNewComponent'
import CkEditor from '../../components/CkEditor'

const CouponPage = () => {
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

    const flexColItemStart = `flex flex-col items-start w-full`
    const fomtMPb2 = `font-medium pb-2`
    const flexColGap2 = `flex flex-col gap-2 w-full`
    const fieldRoot = `w-full border border-solid border-gray-400`

    useEffect(() => {
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo]);



    const { sendData: totalCategoriesView }: any = useRead({ selectMethod: "get", url: totalCategoryGetUrl });
    const { sendData: totalCouponView }: any = useRead({ selectMethod: "get", url: totalCouponGetUrl });

    const { create_product_category, get_product_category, get_product_category_details, update_product_category_image, update_product_category, total_items_category, delete_multiple_product_category } = getUrlWithKey("products_categories");

    const { get, __delete, total_items_coupon, create, update } = getUrlWithKey("coupon");

    useEffect(() => {
        setTotalCouponGetUrl(total_items_coupon);
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
    const { sendData: getCoupon }: any = useRead({ selectMethod: "put", url: get, callData: getProd });

    console.log("getCoupon", getCoupon);

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
        // setGetProductDetailsUrl(`${get_product_category_details}/${id}`)
        try {

            // console.log('id: ', id);
            const { data } = await axios.put(`${get}`, { id: +id });
            // const { data }: any = useRead({ selectMethod: "get", url: `${get_product_category_details}/${id}` });

            console.log('data:: ', data);
            if (data?.success) {
                setButtonDisabled(false);
                setFieldsErrors(new Object());
                setProductCouponDetails(data?.data);
                if (data?.data?.id) {
                    setOpenFullModal(true)
                } else {
                    setOpenFullModal(false)
                }
            }
        } catch (error: any) {
            console.log("error", error);
        }
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
            const { data } = await axios.post(`${__delete}`, { coupon_id: checked });
            if (data?.success) {
                console.log("handelApply-data", data);
                _SUCCESS(data?.massage);
                setFields(defaultFieldSet);
                setPageNo(1)
                setGetProd({ page: pageNo, rowsPerPage: 10 })
                setActionValue("delete");
                setChecked([]);
                setTotalCouponGetUrl(total_items_coupon);
            }
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
                        setTotalCouponGetUrl(total_items_coupon);
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
        { field: 'Code' },
        { field: 'Coupon type' },
        { field: 'Description' },
        { field: 'Coupon amount' },
        { field: 'Expiry date' },
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
            setTotalCouponGetUrl(`${total_items_coupon}/${value}`);
        } else {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10 });
            setTotalCouponGetUrl(total_items_coupon);
        }
    }

    console.log(getProductCategory, "getProductCategory")

    return (
        <div className='w-full flex flex-col items-start justify-center gap-2'>
            <SearchAndAddNewComponent buttonTxt={'Search Coupon'} addNewProduct={addNewProduct} name={'Add Coupon'} res={searchRes} />

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
                    <Table className='lg:table hidden table-auto w-full productTableCls '>
                        <TableHead>
                            <TableRow
                                hover
                                role="checkbox"
                                className='bg-offWhite-01'
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} />
                                </TableCell>
                                {header.map((col, index) =>
                                    <TableCell key={index}>{col.field}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getCoupon?.map((row: any, index: number) => {
                                return (
                                    <TableRow
                                        hover
                                        key={index}
                                        sx={{ cursor: 'pointer' }}

                                    >
                                        <TableCell className='!w-[8%]' padding="checkbox">
                                            <Checkbox
                                                // checked={prodCheck?.product_id === row?.id ? true : false} 
                                                checked={checked.includes(row?.id)}
                                                // onClick={() => prodCheck?.product_id !== row?.id ? setProdCheck({ product_id: row?.id }) : setProdCheck({})}
                                                onClick={(e) => handelTableCheckBox(e, row?.id)}
                                            />
                                        </TableCell>
                                        <TableCell className='w-[10%]' onClick={() => { getProductDetails(row?.id) }}>
                                            {row?.code ? row?.code : "--"}
                                        </TableCell>
                                        <TableCell className='w-[10%]' onClick={() => { getProductDetails(row?.id) }}>{row?.couponMetaData?.general?.type ? row?.couponMetaData?.general?.type : "--"}</TableCell>
                                        <TableCell className='w-[10%]' onClick={() => { getProductDetails(row?.id) }}>{row?.descriptions ? row?.descriptions : "--"}</TableCell>
                                        <TableCell className='w-[10%]' onClick={() => { getProductDetails(row?.id) }}>{row?.couponMetaData?.general?.amount ? row?.couponMetaData?.general?.amount : "--"}</TableCell>
                                        <TableCell className='w-[15%]' onClick={() => { getProductDetails(row?.id) }}>{row?.couponMetaData?.general?.ex_date ? new Date(row?.couponMetaData?.general?.ex_date).toString() : "--"}</TableCell>
                                    </TableRow>
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

            <RightSideModal modalStat={openFullModal} handleClose={() => setOpenFullModal(false)} heading={(productCouponDetails != undefined && productCouponDetails != '') ? 'Update Coupon' : 'Add Coupon'}>
                <div className='flex items-start gap-2.5'>
                    <div className='flex w-[100%] flex-col gap-4'>
                        {/* Coupon Code */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Coupon Code</p>
                            <div className={`${flexColGap2}`}>
                                <div className={`${fieldRoot}`}>
                                    <TextField className='!w-full p-1' placeholder='Enter category name' name='code' handelState={handelOnChange} blur={handleSlug} value={fields?.code} disabled={productCouponDetails ? true : false} /></div>
                                <span style={{ color: "red" }}>{fieldsErrors?.code}</span>

                                {(productCouponDetails != undefined && productCouponDetails != '') ? null :
                                    <div className='flex items-center justify-end'>
                                        <PinkPawsbutton
                                            variant={"solid"}
                                            name="Generate coupon code"
                                            icon={""}
                                            handleClick={handelGenerateCode}
                                            pinkPawsButtonExtraCls={""}
                                            style={{}}
                                            disabled={buttonDisabled}
                                            title={""}
                                        />
                                    </div>
                                }
                            </div>
                        </div>

                        {(productCouponDetails != undefined && productCouponDetails != '') ? null : <hr className='w-full border-gray-300' />}

                        {/* Descriptions */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Descriptions</p>
                            <div className={`${flexColGap2}`}>
                                <div className={`${fieldRoot}`}>
                                    {/* <TextAreaField className='!w-full h-40 p-1' name='descriptions' handelState={handelOnChange} value={fields?.descriptions} /> */}
                                    <CkEditor
                                        value={fields?.descriptions}
                                        handleChange={(e: any) => {
                                            setFields(pre => ({
                                                ...pre,
                                                descriptions: e
                                            }));

                                            clearValidation('descriptions');
                                        }}
                                    />
                                </div>
                                <span style={{ color: "red" }}>{fieldsErrors?.descriptions}</span>
                            </div>
                        </div>

                        {/* <div className='w-full'>
                            <DynamicForm handelSubmit={setFormdata} dynOb={dynamicCategoiFormObject} sendDataState={setDataSetCategory} />
                        </div> */}

                        {/* Discount type */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Discount type</p>
                            <div className={`${flexColGap2}`}>
                                <div className={`${fieldRoot}`}>
                                    <Select
                                        value={fields?.general.type}
                                        onChange={(e: any) => handelOnChange(e, 'general')}
                                        fullWidth
                                        className='!px-4 !py-1 selectFieldCls !rounded-none'
                                        name='type'
                                        placeholder='select coupon type'
                                    >
                                        <MenuItem key={"parsentage"} value={"parsentage"}>Parsentage</MenuItem>
                                        <MenuItem key={"fixed"} value={"fixed"}>Fixed</MenuItem>
                                    </Select>
                                    {/* <TextField className='!w-full p-1' placeholder='fixed or parsentage' name='type' handelState={(e: any) => handelOnChange(e, 'general')} value={fields?.general.type} /> */}
                                </div>
                                <span style={{ color: "red" }}>{fieldsErrors?.general?.type}</span>
                            </div>
                        </div>

                        {/* Coupon amount */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Coupon amount</p>
                            <div className={`${flexColGap2}`}>
                                <div className={`${fieldRoot}`}>
                                    <TextField className='!w-full p-1' placeholder='Enter amount' name='amount' handelState={(e: any) => handelOnChange(e, 'general')} value={fields?.general.amount} /></div>
                                <span style={{ color: "red" }}>{fieldsErrors?.general?.amount}</span>
                            </div>
                        </div>

                        {/* Coupon expiry date */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Coupon expiry date</p>
                            <div className={`${flexColGap2}`}>
                                <div className={`${fieldRoot}`}>
                                    <TextField type='date' className='!w-full p-1' placeholder='Enter expire date' name='ex_date' handelState={(e: any) => handelOnChange(e, 'general')} value={fields?.general.ex_date} /></div>
                                <span style={{ color: "red" }}>{fieldsErrors?.general?.ex_date}</span>
                            </div>
                        </div>

                        <div className='flex items-center justify-end'>
                            <PinkPawsbutton
                                variant={"solid"}
                                name={(productCouponDetails != undefined && productCouponDetails != '') ? "Update Coupon" : "Save Coupon"}
                                icon={""}
                                handleClick={handleSubmit}
                                pinkPawsButtonExtraCls={""}
                                style={{}}
                                disabled={buttonDisabled}
                                title={""}
                            />
                        </div>
                    </div>
                </div>

            </RightSideModal>
        </div>
    )
}

export default CouponPage