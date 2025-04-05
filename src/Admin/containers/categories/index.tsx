import React, { useEffect, useState } from 'react'
import ActionDrop from '../../components/ActionDrop'
import Pageination from '../../components/Pageination'
import useTabView from '../../../hooks/useTabView'
import { Checkbox, Dialog, DialogContent, styled, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow } from '@mui/material'
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
import { getAdminSetting, isEmptyObject, urlToBase64 } from '../../util/_common'
import { toast } from 'react-toastify';
import { _ERROR, _SUCCESS } from '../../util/_reactToast'
import ImageUploader from '../../components/ImageUploader'
import RightSideModal from '../../components/RightSideModal'
import SimpleCard from '../../components/SimpleCard'
import SearchField from '../../components/SearchField'
import ButtonField from '../../components/ButtonField'
import SearchAndAddNewComponent from '../../components/searchAddNewComponent'
import CkEditor from '../../components/CkEditor'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router'
import ImageIcon from '@mui/icons-material/Image';
import { _post, _put } from '../../services'
const field_text_Cls = `border border-gray-500 outline-none px-2 py-1 rounded`;

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

const CategoriesPage = () => {
    const defaultFieldSet = {
        parent_id: null,
        display: "default",
        name: "",
        slug: "",
        description: "",
        show_home_page: false,
        status_id: 1,
        product_category_id: null
    }

    const [actionValue, setActionValue] = useState("delete")
    const [pageNo, setPageNo] = useState(1)
    const [prodCheck, setProdCheck]: any = useState({})
    const [acordian, setAcordian]: any = useState()
    const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
    const [openFullModal, setOpenFullModal] = useState(false)
    const [dataSetCategory, setDataSetCategory] = useState()
    const [productCategoryDetails, setProductCategoryDetails]: any = useState()
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
    const [checked, setChecked] = useState<any[]>([]);
    const [categoryChecked, setCategoryChecked] = useState<any[]>([]);
    const [getCategory, setGetCategory]: any = useState({ dropdown: true });
    const [getProCategory, setGetProCategory]: any = useState();
    const [confirmStatus, setConfirmStatus]: any = useState("")
    const [pageMetaInfo, setPageMetaInfo]: any = useState({
        meta_title: "",
        meta_description: "",
        meta_key: ""
    });
    const [metaInfoMetaId, setMetaInfoMetaId] = useState("");


    useEffect(() => {
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo]);

    const router = useRouter();
    const { s }: any = router.query; // Extract the `s` query parameter
    // const [searchValue, setSearchValue]: any = useState('');

    useEffect(() => {
        if (s) {
            setGetProd({ page: 1, rowsPerPage: 10, search: s });
            setTotalCategoryGetUrl(`${total_items_category}/${s}`);
        }
    }, [s]);

    const { sendData: totalCategoriesView }: any = useRead({ selectMethod: "get", url: totalCategoryGetUrl });

    const { create_product_category, get_product_category, get_product_category_details, update_product_category_image, update_product_category, total_items_category, delete_multiple_product_category } = getUrlWithKey("products_categories");
    const { create_meta, update_meta, get_slug_by_meta } = getUrlWithKey("pages");

    const { sendData: category }: any = useRead({ selectMethod: "put", url: get_product_category, callData: getCategory });

    const { sendData: getProductCategory }: any = useRead({ selectMethod: "put", url: get_product_category, callData: getProd });

    const flexColItemStart = `flex flex-col items-start w-full`
    const fomtMPb2 = `font-medium pb-2`
    const flexColGap2 = `flex flex-col gap-2 w-full`
    const fieldRoot = `w-full border border-solid border-gray-400`

    useEffect(() => {
        if (!category?.length) {
            setGetCategory({ page: 1, rowsPerPage: 10, dropdown: true })
        }
        setGetProCategory(category)
    }, [category])

    useEffect(() => {
        setTotalCategoryGetUrl(total_items_category);
    }, []);

    useEffect(() => {
        console.log("totalCategoriesView", totalCategoriesView)
        if (totalCategoriesView?.totalItem) {
            setTotalCategoryGetUrl("");
        }
    }, [totalCategoriesView])

    const getTotalPage = (): number => {
        console.log("list?.totalPage", totalCategoriesView?.totalPage)
        if (totalCategoriesView?.totalPage && totalCategoriesView?.totalPage !== 0) {
            return totalCategoriesView?.totalPage;
        } else if (totalCategoriesView?.totalPage === 0) {
            return 1;
        } else {
            return 0;
        }
    }

    const { tabView } = useTabView()

    useEffect(() => {
        if (totalGetData === "totalPublished") {
            let page = totalCategoriesView?.totalPublished < 10 ? 1 : Math.ceil((totalCategoriesView?.totalPublished / 10))
            setTotalPageNo(page)
        } else if (totalGetData === "totalDraft") {
            let page = totalCategoriesView?.totalDraft < 10 ? 1 : Math.ceil((totalCategoriesView?.totalDraft / 10))
            setTotalPageNo(page)
        } else if (totalGetData === "totalTrash") {
            let page = totalCategoriesView?.totalDraft < 10 ? 1 : Math.ceil((totalCategoriesView?.totalDraft / 10))
            setTotalPageNo(page)
        } else {
            setTotalPageNo()
        }
    }, [totalGetData])


    const handleParentCategoryCheckBox = (e: any, v: any) => {
        const arr: any[] = [];
        if (e?.target?.checked) {
            arr.push(v);
            setCategoryChecked(arr);
            setFields(pre => ({
                ...pre,
                ['parent_id']: v
            }));
        } else {
            setFields(pre => ({
                ...pre,
                ['parent_id']: null
            }));
            setCategoryChecked(arr.filter((item: any) => item !== v))
        }
    }

    const handelAllChecked = (e: any) => {
        if (e?.target?.checked && getProductCategory && getProductCategory?.length) {
            const arr = [];
            for (let g = 0; g < getProductCategory.length; g++) {
                if (getProductCategory[g] && getProductCategory[g]?.id) {
                    arr.push(getProductCategory[g]?.id);
                }
            }
            setChecked(arr);
        } else {
            setChecked([]);
        }
    }

    const addNewProduct = () => {
        setButtonDisabled(false);
        setFields(defaultFieldSet);
        setProductCategoryDetails(undefined);
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
                                    <input type='checkbox' onChange={(e) => handleParentCategoryCheckBox(e, category?.id)}
                                        checked={categoryChecked.includes(category?.id)}
                                        className="z-10 mt-1.5" />
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


    const getProductDetails = async (id: any) => {
        // setGetProductDetailsUrl(`${get_product_category_details}/${id}`)
        try {

            // console.log('id: ', id);
            const { data } = await axios.get(`${get_product_category_details}/${id}`);
            // const { data }: any = useRead({ selectMethod: "get", url: `${get_product_category_details}/${id}` });

            // console.log('data:: ', data);
            if (data?.success) {
                setButtonDisabled(false);
                setFieldsErrors(new Object());
                setProductCategoryDetails(data?.data);
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

    const handelApply = async () => {
        console.log("handelApply", actionValue, checked);
        if (actionValue === 'delete' && checked?.length) {
            const { data } = await axios.post(`${delete_multiple_product_category}`, { product_category_ids: checked });
            if (data?.success) {
                console.log("handelApply-data", data);
                _SUCCESS(data?.massage);
                setFields(defaultFieldSet);
                setPageNo(1)
                setGetProd({ page: pageNo, rowsPerPage: 10 })
                setActionValue("delete");
                setChecked([]);
                setTotalCategoryGetUrl(total_items_category);
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

    const handelOnChange = (e: any, isChecked: boolean) => {
        const stateName = e.target.name;
        // const stateValue = e.target.value;
        const stateValue = isChecked ? e.target.checked : e.target.value;


        // let stateValue: null = null;
        // if (e.target.checked != undefined) {
        //     stateValue = e.target.checked
        // } else {
        //     stateValue = e.target.value;
        // }

        setFields(pre => ({
            ...pre,
            [stateName]: stateValue
        }));

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

    const validation = (stateHandler: { [x: string]: any }, required_fields: string[] = []) => {
        let valid = true;
        if (!isEmptyObject(stateHandler) && required_fields.length) {
            for (let i = 0; i < required_fields.length; i++) {
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
        } else {
            required_fields.forEach(item => setFieldsErrors(pre => ({
                ...pre,
                [item]: "This fields is required!"
            })));
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
        try {
            let valid = false;
            setImageError("");
            setButtonDisabled(true);
            valid = validation(fields, ["name", "slug", "description", "display"]);

            if (valid) {
                if (productCategoryDetails !== null || images && images?.length && images[0] && images[0]['file']) {

                    if (fields && fields?.product_category_id) {
                        if (images?.length) {
                            // console.log('lennn: ', images?.length);
                            const { data } = await axios.post(`${update_product_category}`, { ...fields, slug: stringToSlug(fields['slug']) });

                            // console.log('dddd::::: ', data);
                            if (data?.success) {
                                if (images[0]['file'] != null && images[0]['file'] != undefined && images[0]['file'] != '') {
                                    let formData = new FormData();
                                    formData.append('category_image', images[0]['file']);
                                    formData.append('product_category_id', fields?.product_category_id);
                                    formData.append('old_category_image', oldImageName);

                                    const { data: imgRes } = await axios.post(`${update_product_category_image}`, formData);
                                    if (imgRes?.success) {
                                        // console.log('imageRes: ', imgRes);
                                        _SUCCESS(imgRes?.massage);
                                        setFields(defaultFieldSet);
                                        setButtonDisabled(false);
                                        setOpenFullModal(false);

                                    }
                                } else {
                                    _SUCCESS(data?.massage);
                                    setFields(defaultFieldSet);
                                    setButtonDisabled(false);
                                    setOpenFullModal(false);
                                    setGetProd({ page: pageNo, rowsPerPage: 10 })
                                }
                            } else {
                                _ERROR(data?.message);
                                setButtonDisabled(false);
                                setGetProd({ page: pageNo, rowsPerPage: 10 })

                            }
                        } else {
                            // console.log('lennndddd: ', images?.length);
                            setImageError(`Image fields is required!`);
                            setButtonDisabled(false);
                            setRestoreButton(true);
                        }
                    } else {
                        if (images?.length) {
                            const { data } = await axios.post(`${create_product_category}`, { ...fields, slug: stringToSlug(fields['slug']) });

                            if (data?.success) {
                                let formData = new FormData();
                                formData.append('category_image', images[0]['file']);
                                formData.append('product_category_id', data?.data?.productCategoryId);
                                handleSubmitMeta({ id: data?.data?.productCategoryId })

                                const { data: imgRes } = await axios.post(`${update_product_category_image}`, formData);
                                if (imgRes?.success) {
                                    // console.log('imageRes: ', imgRes);
                                    _SUCCESS(imgRes?.massage);
                                    setFields(defaultFieldSet);
                                    setButtonDisabled(false);
                                    setOpenFullModal(false);
                                    setTotalCategoryGetUrl(total_items_category);
                                    setGetProd({ page: pageNo, rowsPerPage: 10 })
                                }
                            } else {
                                _ERROR(data?.massage);
                                setButtonDisabled(false);
                            }
                        } else {
                            setImageError(`Image fields is required!`);
                            setButtonDisabled(false);
                        }
                    }
                } else {
                    setImageError("Image fields is required!");
                    setButtonDisabled(false);
                }
            } else {
                setButtonDisabled(false);
            }
        } catch (error: any) {
            _ERROR(error?.response?.data?.massage);
            setButtonDisabled(false);
            console.log('error: ', error?.response?.data);
        }
    }

    const actionArray = [
        // { value: "bulkAction", name: "Bulk action" },
        { value: "delete", name: "Delete" },
    ]

    const header = [
        { field: "Image", icon: <ImageIcon /> },
        { field: 'Name' },
        { field: 'Description' },
        { field: 'Slug' },
        { field: 'Count' },
        { field: 'Action' },
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

    useEffect(() => {
        // console.log("dataSet editDataSet", productCategoryDetails)
        if (productCategoryDetails !== null && productCategoryDetails?.id) {
            console.log(productCategoryDetails, "5f4gh6gf")
            const data = {
                name: productCategoryDetails?.name,
                description: productCategoryDetails?.description,
                show_home_page: productCategoryDetails?.show_home_page,
                display: productCategoryDetails?.display,
                slug: productCategoryDetails?.slug,
                product_category_id: productCategoryDetails?.id,
                parent_id: productCategoryDetails?.parent
            }

            if (productCategoryDetails?.parent) {
                setCategoryChecked([productCategoryDetails?.parent]);
            }
            setFields({ ...fields, ...data });
            if (productCategoryDetails?.image) {
                let imageBase64 = urlToBase64(productCategoryDetails?.image);
                imageBase64.then((res) => {
                    // console.log('reeImg: ', res);
                    let data_url = [
                        {
                            data_url: res
                        }
                    ];
                    setImages(data_url)
                    setRestoreImage(data_url)
                })

                let src = `${productCategoryDetails?.image}`.split("/");
                let path = src[src.length - 1];
                setOldImageName(path);
            }
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
    }, [productCategoryDetails]);

    console.log(getProductCategory, "getProductCategory");

    const searchRes = (value: any) => {
        console.log("searchRes", value);
        if (value) {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10, search: value });
            setTotalCategoryGetUrl(`${total_items_category}/${value}`);
        } else {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10 });
            setTotalCategoryGetUrl(`${total_items_category}`);
        }
    }

    const handleApplyDelete = async (delId: any) => {
        // console.log("handelApply", actionValue, checked);

        const { data } = await axios.post(`${delete_multiple_product_category}`, { product_category_ids: [delId] });
        if (data?.success) {
            console.log("handelApply-data", data);
            _SUCCESS(data?.massage);
            // setFields(defaultFieldSet);
            // setPageNo(1)
            setGetProd({ page: pageNo, rowsPerPage: 10 })
            setActionValue("delete");
            setChecked([]);
            setTotalCategoryGetUrl(total_items_category);
            setConfirmStatus("");
        }
    }

    const handelDefaultMeta = async (e: any) => {
        if (e?.target?.checked) {
            const dataSet = await getAdminSetting("_DEFAULT_META_INFO");
            if (dataSet?.id) {
                dataSet?.meta_description && setPageMetaInfo((pre: any) => ({
                    ...pre,
                    meta_description: dataSet?.meta_description
                }));

                dataSet?.meta_keyword && setPageMetaInfo((pre: any) => ({
                    ...pre,
                    meta_key: dataSet?.meta_keyword
                }));

                dataSet?.meta_title && setPageMetaInfo((pre: any) => ({
                    ...pre,
                    meta_title: dataSet?.meta_title
                }));
            }
            console.log("dataset", dataSet);
        } else {
            setPageMetaInfo({
                meta_title: "",
                meta_description: "",
                meta_key: ""
            });
            setMetaInfoMetaId("");
        }
    }

    const getMetaData = async () => {
        try {
            const { data }: any = await _put(get_slug_by_meta, { table_name: "productCategory", table_slug: productCategoryDetails?.slug });
            if (data?.success) {
                setPageMetaInfo({
                    meta_title: data?.data?.value?.mata_title,
                    meta_description: data?.data?.value?.meta_descriptions,
                    meta_key: data?.data?.value?.meta_key,
                    meta_id: data?.data?.id
                })
            }
        } catch (error) {
            console.log(error, "_error");
        }
    }

    useEffect(() => {
        getMetaData();
    }, [productCategoryDetails?.id])

    const handleSubmitMeta = async ({ meta_id, id }: any) => {
        try {
            if (id) {
                if (meta_id) {
                    const { data }: any = await _post(update_meta, {
                        table_id: id,
                        table_name: "productCategory",
                        key: "_meta_info",
                        value: {
                            mata_title: pageMetaInfo?.meta_title,
                            meta_key: pageMetaInfo?.meta_key,
                            meta_descriptions: pageMetaInfo?.meta_description
                        },
                        meta_id: meta_id
                    });
                    if (data?.success) {
                        getMetaData()
                        _SUCCESS("Meta updated successfully")
                    }
                } else {
                    const { data }: any = await _post(create_meta, {
                        table_id: id,
                        table_name: "productCategory",
                        key: "_meta_info",
                        value: {
                            mata_title: pageMetaInfo?.meta_title,
                            meta_key: pageMetaInfo?.meta_key,
                            meta_descriptions: pageMetaInfo?.meta_description
                        }
                    });
                    if (data?.success) {
                        getMetaData()
                        _SUCCESS("Meta created successfully")
                    }
                }
            }
        } catch (error) {
            console.log(error, "_error");
        };
    }

    useEffect(() => {
        if (!openFullModal) {
            setProductCategoryDetails();
            setPageMetaInfo({
                meta_title: "",
                meta_description: "",
                meta_key: ""
            });
        }
    }, [openFullModal])

    return (
        <div className='w-full flex flex-col items-start justify-center gap-4'>
            {/* <div className='flex gap-2 items-center justify-between w-full'>
                <PinkPawsbutton
                    variant={"solid"}
                    name={"Add Category"}
                    icon={""}
                    handleClick={addNewProduct}
                    pinkPawsButtonExtraCls={""}
                    style={{}}
                    disabled={false}
                    title={""}
                />
                <div className='flex items-center gap-2'>
                    <SearchField />
                    <ButtonField buttonTxt='Search products' handleClick={() => { }} />
                </div>
            </div> */}
            <SearchAndAddNewComponent buttonTxt={'Search Categories'} addNewProduct={addNewProduct} name={'Add Product Category'} res={searchRes} customValue={s} />
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
                {/* <Pageination
                    items={totalGetData === "totalItem" ? totalCategoriesView?.totalItem : 0 || totalGetData === "totalPublished" ? totalCategoriesView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalCategoriesView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalCategoriesView?.totalTrash : 0}
                    value={pageNo}
                    totalpageNo={totalpageNo ? totalpageNo : totalCategoriesView?.totalPage}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : pageNo - 1)}
                    handleChange={(e: any) => setPageNo(e.target.value > 999 ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo > 999 ? 1 : pageNo + 1)}
                    handleClickLast={() => setPageNo(totalpageNo ? totalpageNo : totalCategoriesView?.totalPage)}
                /> */}

                <Pageination
                    items={totalCategoriesView?.totalItem}
                    value={pageNo}
                    totalpageNo={getTotalPage()}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo === 1 ? 1 : (pageNo - 1))}
                    handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
                    handleClickLast={() => setPageNo(getTotalPage())}
                />
            </div>

            {!tabView ?
                (getProductCategory?.length ?
                    <Table className='lg:table hidden table-auto w-full productTableCls !border !border-solid'>
                        <TableHead>
                            <TableRow
                                hover
                                role="checkbox"
                                className='bg-slate-200 hover:!bg-slate-200'
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} size="small" checked={checked?.length === getProductCategory?.length ? true : false} />
                                </TableCell>
                                {header.map((col, index) =>
                                    <TableCell className={`${col.field === "Image" ? "!text-center" : "!font-semibold"} !border-0`} key={index}>{col.field !== "Image" ? col.field : col.icon}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getProductCategory?.map((row: any, index: number) => {
                                return (
                                    <StyledTableRow
                                        hover
                                        key={index}
                                        sx={{ cursor: 'pointer' }}
                                        className='hover:!bg-[#6d8ad70f]'
                                    >
                                        <StyledTableCell className='!border-0 !w-[3%]' padding="checkbox">
                                            <Checkbox
                                                // checked={prodCheck?.product_id === row?.id ? true : false} 
                                                checked={checked.includes(row?.id)}
                                                // onClick={() => prodCheck?.product_id !== row?.id ? setProdCheck({ product_id: row?.id }) : setProdCheck({})}
                                                onClick={(e) => handelTableCheckBox(e, row?.id)}
                                                size="small"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell className='!border-0 !w-[5%]' onClick={() => { getProductDetails(row?.id) }}>
                                            <div className='flex items-center justify-center w-full'>
                                                <Image src={row?.image ? row?.image : productImage} alt='productImage' className='w-10 h-10' width={192} height={108} priority />
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell className='!border-0 !w-[30%]' onClick={() => { getProductDetails(row?.id) }}>{row?.name ? row?.name : "--"}</StyledTableCell>
                                        <StyledTableCell className='!border-0 !w-[30%]' onClick={() => { getProductDetails(row?.id) }}>
                                            <div dangerouslySetInnerHTML={{ __html: row?.description ? row?.description : "--" }} />
                                        </StyledTableCell>
                                        <StyledTableCell className='!border-0 !w-[15%]' onClick={() => { getProductDetails(row?.id) }}>{row?.slug ? row?.slug : "--"}</StyledTableCell>
                                        <StyledTableCell className='!border-0 !w-[5%]' onClick={() => { getProductDetails(row?.id) }}>{row?._count?.products ? row?._count?.products : "--"}</StyledTableCell>
                                        <StyledTableCell className='!border-0 !w-[5%]'>
                                            <div className='flex flex-row gap-2'>
                                                <EditIcon className='w-6 h-6 text-linkBlue-01 cursor-pointer' onClick={() => { getProductDetails(row?.id) }} />
                                                <DeleteIcon className={`w-6 h-6 ${row?._count?.products ? "text-gray-400 cursor-not-allowed" : "text-red-500 cursor-pointer"} `} onClick={() => { if (!row?._count?.products) setConfirmStatus(row?.id) }} />
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
                {/* <Pageination
                    items={totalGetData === "totalItem" ? totalCategoriesView?.totalItem : 0 || totalGetData === "totalPublished" ? totalCategoriesView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalCategoriesView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalCategoriesView?.totalTrash : 0}
                    value={pageNo}
                    totalpageNo={totalpageNo ? totalpageNo : totalCategoriesView?.totalPage}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : pageNo - 1)}
                    handleChange={(e: any) => setPageNo(e.target.value > 999 ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo > 999 ? 1 : pageNo + 1)}
                    handleClickLast={() => setPageNo(totalpageNo ? totalpageNo : totalCategoriesView?.totalPage)}
                /> */}

                <Pageination
                    items={totalCategoriesView?.totalItem}
                    value={pageNo}
                    totalpageNo={getTotalPage()}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo === 1 ? 1 : (pageNo - 1))}
                    handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
                    handleClickLast={() => setPageNo(getTotalPage())}
                />
            </div>

            <RightSideModal modalStat={openFullModal} handleClose={() => setOpenFullModal(false)} heading={(productCategoryDetails != undefined && productCategoryDetails != '') ? 'Update Product Category' : 'Add Product Category'}>
                <div className='flex items-start gap-2.5'>
                    <div className='flex w-[100%] flex-col gap-2'>
                        <div className='flex items-center gap-4'>
                            {/* product category name */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Product category name</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' placeholder='Enter category name' name='name' handelState={handelOnChange} blur={handleSlug} value={fields?.name} />
                                    </div>
                                    <span style={{ color: "red" }} className='text-sm'>{fieldsErrors?.name}</span>
                                </div>
                            </div>

                            {/* product category slug */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Product category slug</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' placeholder='Enter category slug' name='slug' handelState={handelOnChange} blur={handleSlug} value={fields?.slug} />
                                    </div>
                                    <span style={{ color: "red" }} className='text-sm'>{fieldsErrors?.slug}</span>
                                </div>
                            </div>
                        </div>

                        {/* <div className='w-full'>
                            <DynamicForm handelSubmit={setFormdata} dynOb={dynamicCategoiFormObject} sendDataState={setDataSetCategory} />
                        </div> */}

                        {/* product description */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Product Category Description</p>
                            <div className={`${flexColGap2}`}>
                                <div className={`${fieldRoot}`}>
                                    {/* <TextAreaField className='!w-full h-40 p-1' name='description' handelState={handelOnChange} value={fields?.description} /> */}

                                    <CkEditor
                                        value={fields?.description}
                                        handleChange={(e: any) => {
                                            setFields(pre => ({
                                                ...pre,
                                                description: e
                                            }));

                                            clearValidation('description');
                                        }}
                                    />
                                </div>
                                <span style={{ color: "red" }} className='text-sm'>{fieldsErrors?.description}</span>
                            </div>
                        </div>


                        <SimpleCard className='my-2' heading={<span className='font-medium'>Parent categories</span>}>
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
                                    <Productcategories dynArr={getProCategory} />
                                </div>
                            </div>
                        </SimpleCard>

                        {/* product image */}

                        <SimpleCard className='my-2' heading={<span className='font-medium'>Product Category Image</span>}>
                            <div className={`${flexColGap2}`}>
                                <div className='w-full border border-solid border-offWhite-02'>

                                    <ImageUploader onImageChange={handleImage} imageWidth={`w-[20%]`} preImages={images} className={`imageDeopZone`} />
                                    {/* <input type='file' name='image' onChange={(e) => handleImage(e)} /> */}
                                </div>
                                <span style={{ color: "red" }}>{imageError}</span>
                                {
                                    restoreButton &&
                                    <span style={{ color: 'blue' }} onClick={() => { setImages(restoreImage); setImageError(""); setRestoreButton(false); }}>Click here for restore image</span>
                                }
                            </div>

                            {/* product show page */}
                            <div className={`${flexColItemStart}`}>
                                <div className={`${fomtMPb2} !py-1`}>Show in home page?
                                    <Checkbox
                                        sx={{
                                            color: "#d8428c",
                                            '&.Mui-checked': {
                                                color: "#d8428c",
                                            },
                                        }}
                                        className='px-2 py-0'
                                        name='show_home_page'
                                        onChange={handleCheckbox}
                                        checked={fields?.show_home_page == true} />
                                </div>
                                {/* <hr />
                            <div className={`${flexColGap2}`}>
                            <div className='w-full border border-solid border-offWhite-02'>


                            </div>
                            <span style={{ color: "red" }}>{fieldsErrors?.show_home_page}</span>
                            </div> */}
                            </div>
                        </SimpleCard>

                        <div className='flex items-center justify-end mb-3'>
                            <PinkPawsbutton
                                variant={"solid"}
                                name={(productCategoryDetails != undefined && productCategoryDetails != '') ? "Update Product Category" : "Add Product Category"}
                                icon={""}
                                handleClick={handleSubmit}
                                pinkPawsButtonExtraCls={""}
                                style={{}}
                                disabled={buttonDisabled}
                                title={""}
                            />
                        </div>

                        <SimpleCard
                            childrenClassName={`flex flex-col items-center justify-center gap-2 !p-4`}
                            headingClassName='!bg-white'
                            heading={
                                <div className='flex items-center w-full gap-4'>
                                    <span className='font-medium'>Meta Information</span>
                                    {/* <hr className='border-l border-solid h-6' />
                                    <div className='flex items-center'>
                                        <Checkbox className='!pr-2 !py-1 !p-0' onChange={handelDefaultMeta} />
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
                                        value={pageMetaInfo?.meta_title}
                                        name='Meta Title'
                                        handelState={(e: any) => setPageMetaInfo((pre: any) => ({
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
                                        value={pageMetaInfo?.meta_key}
                                        name='Meta Keywords'
                                        handelState={(e: any) => setPageMetaInfo((pre: any) => ({
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
                                        value={pageMetaInfo?.meta_description}
                                        name='Meta Description'
                                        handelState={(e: any) => setPageMetaInfo((pre: any) => ({
                                            ...pre,
                                            meta_description: e.target.value
                                        }))}
                                    />
                                </div>
                            </div>

                            <div className='flex items-center justify-end mt-4 w-full'>
                                <PinkPawsbutton
                                    variant={"solid"}
                                    name={"Update Meta Information"}
                                    handleClick={() => handleSubmitMeta({ meta_id: pageMetaInfo?.meta_id, id: productCategoryDetails?.id })}
                                />
                            </div>
                        </SimpleCard>

                    </div>
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

export default CategoriesPage