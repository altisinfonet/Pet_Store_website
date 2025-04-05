import React, { Children, useEffect, useRef, useState } from 'react'
import SelectField from '../../components/SelectField';
import { Autocomplete, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField as MuiTextField, Tooltip, RadioGroup, Radio, Dialog, DialogContent, styled, tableCellClasses } from '@mui/material';
import blogImage from "../../../../public/assets/images/product.png"
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
import SearchAndAddNewComponent from '../../components/searchAddNewComponent';
import { _ERROR, _SUCCESS } from '../../util/_reactToast';
import { getAdminSetting, isEmptyObject, urlToBase64 } from '../../util/_common';
import ImageUploader from '../../components/ImageUploader';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { _post, _put } from '../../services';

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


const Blogs = () => {
    const defaultFieldSet = {
        title: "",
        slug: "",
        description: "",
        status_id: 1,
        blog_id: null,
    }
    const defaultMeta = {
        mata_title: "",
        meta_description: "",
        meta_key: ""
    }

    const field_text_Cls = `border border-gray-500 outline-none px-2 py-1 rounded`

    const [actionValue, setActionValue] = useState("delete")
    const [acordian, setAcordian]: any = useState()
    const [checked1, setChecked1]: any = useState(false)
    const [checked2, setChecked2]: any = useState(false)
    const [dataSet, setDataSet]: any = useState()
    const [dataSet2, setDataSet2]: any = useState()
    const [dataSetCategory, setDataSetCategory]: any = useState()
    const [doTrashProd, setDoTrashProd]: any = useState()
    const [seoValue, setSeoValue] = useState("AllSeoScores")
    const [readabilityValue, setReadabilityValue] = useState("allReadabilityScores")
    const [blogTypeValue, setBlogTypeValue] = useState("filterByBlogType")
    const [stockStatusValue, setStockStatusValue] = useState("filterByStockStatus")
    const [blogDetails, setBlogDetails]: any = useState({})
    const [openFullModal, setOpenFullModal] = useState(false)
    const [formdata, setFormdata] = useState({})
    const [shoCmntInptArea, setShoCmntInptArea] = useState(false)
    const [pageNo, setPageNo] = useState(1)
    const [prodCheck, setProdCheck]: any = useState({})
    const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
    const [getCategory, setGetCategory]: any = useState({ dropdown: true })
    const [totalGetData, setTotalGetData] = useState("totalItem")
    const [totalpageNo, setTotalPageNo]: any = useState()
    const [getBlogCategory, setGetBlogCategory]: any = useState()
    const [showBlogDataTab, setShowBlogDataTab]: any = useState<string>("general")
    const initialSelectAttributesValue = { attribute: "", existing: false }
    const [selectAttributesValue, setSelectAttributesValue] = useState(initialSelectAttributesValue)
    const [addNewAttributes, setAddNewAttributes] = useState(false)
    const [attributesArray, aetAttributesArray]: any = useState([])
    const [totalBlogGetUrl, setTotalBlogGetUrl] = useState("");
    const [checked, setChecked] = useState<any[]>([]);
    const [fields, setFields] = useState(defaultFieldSet);
    const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [images, setImages] = useState<any>([]);
    const [imageError, setImageError] = useState("");
    const [restoreImage, setRestoreImage] = useState<any>([]);
    const [categoryChecked, setCategoryChecked] = useState<any[]>([]);
    const [categoryCheckedRes, setCategoryCheckedRes] = useState<any[]>([]);
    const [restoreButton, setRestoreButton] = useState(false);
    const [oldImageName, setOldImageName] = useState("");
    const [allTags, setAllTags] = useState<any>([]);
    const [selectedTags, setSelectedTags] = useState<any>([]);
    const [allSelectedTags, setAllSelectedTags] = useState<any>([]);
    const [confirmStatus, setConfirmStatus]: any = useState("");
    const [confirmMultipleStatus, setConfirmMultipleStatus]: any = useState("");
    const [pageMetaInfo, setPageMetaInfo] = useState(defaultMeta);
    const [MetaIdforUpdate, setMetaIdforUpdate] = useState('')
    const { create_meta, update_meta, get_slug_by_meta } = getUrlWithKey("pages")
    const [metaInfoMetaId, setMetaInfoMetaId] = useState("");
    console.log(pageMetaInfo, "pageMetaInfo")
    console.log(fields, "fields")
    console.log(MetaIdforUpdate, "MetaIdforUpdate")

    console.log(attributesArray, "attributesArray")

    const flexColItemStart = `flex flex-col items-start w-full`
    const fomtMPb2 = `font-medium pb-2`
    const flexColGap2 = `flex flex-col gap-2 w-full`
    const fieldRoot = `w-full border border-solid border-gray-400`

    const { create_blog, get_blog, get_blog_details, update_blog, delete_blog, total_items_blog, delete_multiple_blog, update_blog_image } = getUrlWithKey("blogs")

    useEffect(() => {
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo])

    useEffect(() => {
        getMeta()
    }, [fields?.slug, fields?.blog_id, MetaIdforUpdate])



    const { sendData: totalBlogsView }: any = useRead({ selectMethod: "get", url: totalBlogGetUrl });

    const { sendData: getBlog }: any = useRead({ selectMethod: "put", url: get_blog, callData: getProd });
    const { sendData: delBlog }: any = useDelete({
        selectMethod: "post",
        url: doTrashProd,
        callData: {
            blog_id: prodCheck?.blog_id as number,
            is_soft_delete: actionValue === "moveToTrash" ? true : actionValue === "restore" && false,
            is_hard_delete: actionValue === "deletePermanently" && true
        }
    });


    const getMeta = async () => {
        // let metaData = null;
        try {
            const { data }: any = await _put(`${get_slug_by_meta}`, {
                "table_name": "blog",
                "table_slug": fields?.slug
            })
            if (data?.success) {
                // metaData = meta?.data;
                // setGetMeta(meta?.data);
                console.log(data?.data?.value, "asldwlllg00jg")
                setPageMetaInfo((prev) => ({ ...prev, mata_title: data?.data?.value?.mata_title, meta_key: data?.data?.value?.meta_key, meta_description: data?.data?.value?.meta_description }))
                setMetaIdforUpdate(data?.data?.id)
            }
        } catch (error) {
            console.log(error, "_error");
        }

    }

    const getTotalPage = (): number => {
        console.log("list?.totalPage", totalBlogsView?.totalPage)
        if (totalBlogsView?.totalPage && totalBlogsView?.totalPage !== 0) {
            return totalBlogsView?.totalPage;
        } else if (totalBlogsView?.totalPage === 0) {
            return 1;
        } else {
            return 0;
        }
    }

    const { tabView } = useTabView()

    useEffect(() => {
        setTotalBlogGetUrl(total_items_blog);
    }, []);

    useEffect(() => {
        if (totalGetData === "totalPublished") {
            let page = totalBlogsView?.totalPublished < 10 ? 1 : Math.ceil((totalBlogsView?.totalPublished / 10))
            setTotalPageNo(page)
        } else if (totalGetData === "totalDraft") {
            let page = totalBlogsView?.totalDraft < 10 ? 1 : Math.ceil((totalBlogsView?.totalDraft / 10))
            setTotalPageNo(page)
        } else if (totalGetData === "totalTrash") {
            let page = totalBlogsView?.totalDraft < 10 ? 1 : Math.ceil((totalBlogsView?.totalDraft / 10))
            setTotalPageNo(page)
        } else {
            setTotalPageNo()
        }
    }, [totalGetData])

    useEffect(() => {
        setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
        setProdCheck({})
        setDoTrashProd()
    }, [delBlog?.id])

    const getBlogDetails = async (id: any) => {
        try {
            setImages([]);
            const { data } = await axios.get(`${get_blog_details}/${id}`);
            if (data?.success) {
                setBlogDetails(data?.data);
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

    const header = [
        { field: 'Image' },
        { field: 'Title' },
        { field: 'Slug' },
        { field: 'Categories' },
        { field: 'Tags' },
        { field: 'Action' },
    ];

    // const actionArray = [
    //     { value: "bulkAction", name: "Bulk action" },
    //     { value: !getProd?.deleted_at ? "edit" : "restore", name: !getProd?.deleted_at ? "Edit" : "Restore" },
    //     { value: !getProd?.deleted_at ? "moveToTrash" : "deletePermanently", name: !getProd?.deleted_at ? "Move to trash" : "Delete permanently" },
    // ]
    const actionArray = [
        // { value: "bulkAction", name: "Bulk action" },
        { value: "delete", name: "Delete" },
    ]

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

    const blogTypeArray = [
        { value: "filterByBlogType", name: "Filter by blog type" },
        { value: "simpleBlog", name: "Simple Blog" },
        { value: "downloadable", name: "Downloadable" },
        { value: "virtual", name: "Virtual" },
        { value: "groupedBlog", name: "Grouped blog" },
        { value: "externalAffiliateBlog", name: "External/Affiliate blog" },
        { value: "variableBlog", name: "Variable blog" },
    ]

    const stockStatusArray = [
        { value: "filterByStockStatus", name: "Filter by stock status" },
        { value: "inStock", name: "In Stock" },
        { value: "outOfStock", name: "Out of stock" },
        { value: "onBackOrder", name: "On backOrder" },
    ]

    const existingAttributes = [
        { value: "Brand", name: "Brand" },
        { value: "Breed", name: "Breed" },
        { value: "Packsize", name: "Packsize" },
    ]

    const handleChangeAction = (e: any) => {
        setActionValue(e.target.value);
    }

    const handleChangeSeo = (e: any) => {
        setSeoValue(e.target.value);
    }

    const handleChangeReadability = (e: any) => {
        setReadabilityValue(e.target.value);
    }

    const handleChangeBlogType = (e: any) => {
        setBlogTypeValue(e.target.value);
    }

    const handleChangeStockStatus = (e: any) => {
        setStockStatusValue(e.target.value);
    }

    const handleChangeSelectAttributes = (e: any, existing: boolean) => {
        const { name, value } = e.target
        setSelectAttributesValue((pre: any) => ({ ...pre, [name]: value, existing: existing }));
        setAddNewAttributes(true)
    }

    useEffect(() => {
        if (selectAttributesValue?.attribute) {
            aetAttributesArray((pre: any) => ([...pre, {
                id: pre?.length ? pre?.length + 1 : 1,
                name: selectAttributesValue?.attribute,
                existing: selectAttributesValue?.existing,
                visible_on_the_blog_page: true,
                used_for_variations: true
            }]))
        }
    }, [selectAttributesValue]);

    const handleParentCategoryCheckBox = (e: any, v: any) => {
        // console.log('e: ', e, "v: ", v);
        const arr: any[] = [];
        if (e?.target?.checked) {
            arr.push({
                id: v
            });
            setCategoryChecked([...categoryChecked, v]);
            setCategoryCheckedRes([...categoryCheckedRes, ...arr])

        } else {
            setCategoryChecked(categoryChecked.filter((item: any) => item !== v))
            setCategoryCheckedRes(categoryCheckedRes.filter((item: any) => item?.id !== v))
        }
    }

    const handleTagsCheckBox = (values: any) => {


        let arr = [];

        for (let tag of values) {
            arr.push({
                id: tag?.id
            });
        }
        setAllSelectedTags([...arr]);


        // console.log('e: ', e, "v: ", v);
        // const arr: any[] = [];
        // if (e?.target?.checked) {
        //     arr.push({
        //         id: v
        //     });
        //     setCategoryChecked([...categoryChecked, v]);
        //     setCategoryCheckedRes([...categoryCheckedRes, ...arr])

        // } else {
        //     setCategoryChecked(categoryChecked.filter((item: any) => item !== v))
        //     setCategoryCheckedRes(categoryCheckedRes.filter((item: any) => item?.id !== v))
        // }
    }

    console.log("tagsss: ", allSelectedTags);

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
        if (e?.target?.checked && getBlog && getBlog?.length) {
            const arr = [];
            for (let g = 0; g < getBlog.length; g++) {
                if (getBlog[g] && getBlog[g]?.id) {
                    arr.push(getBlog[g]?.id);
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
            const { data } = await axios.post(`${delete_multiple_blog}`, { blog_ids: checked }, { withCredentials: true });
            if (data?.success) {
                console.log("handelApply-data", data);
                _SUCCESS(data?.massage);
                // setFields(defaultFieldSet);
                setConfirmMultipleStatus("");
                setPageNo(1)
                setGetProd({ page: pageNo, rowsPerPage: 10 })
                setActionValue("delete");
                setChecked([]);
                setTotalBlogGetUrl(total_items_blog);
            }
        }
    }

    const onAddNewAttributes = () => {
        setAddNewAttributes(true);
        setSelectAttributesValue(initialSelectAttributesValue)
        aetAttributesArray((pre: any) => ([...pre, {
            id: pre?.length ? pre?.length + 1 : 1,
            visible_on_the_product_page: true,
            used_for_variations: true
        }]))
        // {
        //     id: 0,
        //     name: "",
        //     Values: selectAttributesValue?.existing ? [] : "",
        //     visible_on_the_product_page: true,
        //     used_for_variations: true
        // }
    }

    const updateNewAttributes = (id: number, e: any, existing: any) => {
        if (existing) {
            aetAttributesArray(attributesArray.map((item: any) =>
                item.id === id ? { ...item, values: e?.length ? e : [] } : item
            ));
        } else {
            const { name, value } = e.target;
            aetAttributesArray(attributesArray.map((item: any) =>
                item.id === id ? { ...item, [name]: value } : item
            ));
        }
    };

    const deleteNewAttributes = (id: number) => {
        aetAttributesArray(attributesArray.filter((item: any) => item.id !== id));
    };

    console.log(selectAttributesValue, "SelectAttributesValue")
    const onHandleAcordian = (id: number | string) => {
        if (id === acordian) {
            setAcordian(null)
        } else {
            setAcordian(id as number)
        }
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
            MenuItem: getBlogCategory,
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
        setDoTrashProd(delete_blog);
    }

    console.log(dataSetCategory, "dataSetCategory")
    console.log(totalBlogsView?.totalPage, "totalBlogsView")
    console.log(delBlog?.id, "delProduct")
    console.log(actionValue, prodCheck, doTrashProd, "doTrashProddoTrashProd")
    console.log(getProd, "getProd")
    console.log(getBlog, "getProduct")
    console.log(blogDetails, "blogDetails")
    console.log(dynamicFormObjectVideoSchema, "dynamicFormObjectVideoSchema")
    console.log(formdata, "formdata__");
    console.log(dataSet, "dataSet")
    console.log(shoCmntInptArea, "shoCmntInptArea")
    console.log(dataSet, checked2, "pr__c")
    console.log(formdata, "<_|formdata");
    console.log("images", images)

    const { get_blog_category } = getUrlWithKey("blog_categories")
    const { sendData: category }: any = useRead({ selectMethod: "put", url: get_blog_category, callData: getCategory });

    const { get_blog_tag } = getUrlWithKey("blog_tags")
    const { sendData: tag }: any = useRead({ selectMethod: "put", url: get_blog_tag });
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
    const autocompleteSelect: any[] = []

    useEffect(() => {
        console.log('getBlgo: ', tag)
        if (tag && tag?.length) {
            setAllTags([...tag])
        }
    }, [tag])

    // useEffect(() => {
    //     if (!category?.length) {
    //         setGetCategory({ page: 1, rowsPerPage: 10, dropdown: true })
    //     }
    //     setGetBlogCategory(category)
    // }, [category])

    useEffect(() => {
        if (!category?.length && !getCategory?.page) {
            setGetCategory({ page: 1, rowsPerPage: 10, dropdown: true });
        }
        if (category?.length) {
            setGetBlogCategory(category);
        }
    }, [category, getCategory]);

    const searchRes = (value: any) => {
        console.log("searchRes", value);
        if (value) {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10, search: value });
            setTotalBlogGetUrl(`${total_items_blog}/${value}`);
        } else {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10 });
            setTotalBlogGetUrl(`${total_items_blog}`);
        }
    }

    console.log(getBlogCategory, "getBlogCategory")
    const [reviews, setReviews]: any = useState();
    const [blogDescription, setBlogDescription]: any = useState();
    const [blogShortDescription, setBlogShortDescription]: any = useState();

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
                                    <input type='checkbox' className="z-10 mt-1.5" onChange={(e) => handleParentCategoryCheckBox(e, category?.id)} checked={categoryChecked.includes(category?.id)} />
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

    // const [multitagSelect, setMultitagSelect]: any = useState([])
    // console.log(multitagSelect, "multitagSelect")

    // const checkItem = () => {
    // let arr1 =  category.map((i:any,)=> )
    // console.log(productDetails?.categories, category, "productDetails_categories")
    // }

    // useEffect(()=> {
    //     checkItem()
    // },[productDetails?.categories])
    const addNewBlog = () => {
        setImages([]);
        // setAllTags([]);
        setFieldsErrors({});
        setButtonDisabled(false);
        setFields(defaultFieldSet);
        setPageMetaInfo(defaultMeta)
        setBlogDetails(undefined);
        setOpenFullModal(true);
    }

    const handleImage = (e: any) => {
        setImages(e);
        setImageError("");
    }

    const handleDecriptionChange = (e: any) => {
        setFields(pre => ({
            ...pre,
            ['description']: e
        }))

        clearValidation("description");
    }

    const handelOnChange = (e: any) => {
        // console.log('llg: ', e);
        const stateName = e.target.name;
        const stateValue = e.target.value;

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
            setButtonDisabled(true);
            valid = validation(fields, ["title", "slug", "description"]);

            if (valid) {
                if (blogDetails !== null || images && images?.length && images[0] && images[0]['file']) {

                    if (fields && fields?.blog_id) {
                        if (images?.length) {

                            const { data } = await axios.post(`${update_blog}`, { ...fields, slug: stringToSlug(fields['slug']), category_ids: categoryCheckedRes, tag_ids: allSelectedTags }, { withCredentials: true });

                            if (data?.success) {
                                handleMetaUpdate(data?.data?.id)

                                setCategoryChecked([]);
                                setCategoryCheckedRes([])

                                if (images[0]['file'] != null && images[0]['file'] != undefined && images[0]['file'] != '') {

                                    let formData = new FormData();
                                    formData.append('blog_image', images[0]['file']);
                                    formData.append("blog_image_id", blogDetails?.blogImage[0]?.id)
                                    formData.append('blog_id', fields?.blog_id);
                                    formData.append('old_blog_gallery_images[0][id]', fields?.blog_id);
                                    formData.append('old_blog_gallery_images[0][name]', oldImageName);

                                    const { data: imgRes } = await axios.post(`${update_blog_image}`, formData, { withCredentials: true });
                                    if (imgRes?.success) {
                                        // console.log('imageRes: ', imgRes);
                                        _SUCCESS(imgRes?.massage);
                                        setFields(defaultFieldSet);
                                        setPageMetaInfo(defaultMeta)
                                        setButtonDisabled(false);
                                        setOpenFullModal(false);
                                        setGetProd({ page: pageNo, rowsPerPage: 10 });
                                        setTotalBlogGetUrl(`${total_items_blog}`);

                                    }
                                    // _SUCCESS(data?.massage);
                                    // setFields(defaultFieldSet);
                                    // setButtonDisabled(false);
                                    // setOpenFullModal(false);
                                } else {
                                    _SUCCESS(data?.massage);
                                    setFields(defaultFieldSet);
                                    setButtonDisabled(false);
                                    setOpenFullModal(false);
                                }
                            }
                        } else {
                            // console.log('lennndddd: ', images?.length);
                            setImageError(`Image fields is required!`);
                            setButtonDisabled(false);
                            setRestoreButton(true);
                        }
                    } else {
                        if (images?.length) {
                            const { data } = await axios.post(`${create_blog}`, { ...fields, category_ids: categoryCheckedRes, tag_ids: allSelectedTags }, { withCredentials: true });

                            if (data?.success) {
                                console.log(data, "asdwdasdwadsdawdasdwd")
                                let formData = new FormData();
                                formData.append('blog_image', images[0]['file']);
                                formData.append('blog_id', data?.data?.blog_id);
                                // formData.append('old_blog_gallery_images', oldImageName);

                                const { data: imgRes } = await axios.post(`${update_blog_image}`, formData);
                                if (imgRes?.success) {
                                    handleMeta(data?.data?.blog_id)
                                    _SUCCESS(data?.massage);
                                    setFields(defaultFieldSet);
                                    setPageMetaInfo(defaultMeta)
                                    setButtonDisabled(false);
                                    setOpenFullModal(false);
                                    setGetProd({ page: pageNo, rowsPerPage: 10 });
                                    setTotalBlogGetUrl(`${total_items_blog}`);

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
            console.log('error: ', error);
        }
    }

    // const handleMeta = async () => {
    //     const data =
    //     {
    //         "table_id": fields?.blog_id,
    //         "table_name": "Blog",
    //         "key": "_meta_info",
    //         "value": {
    //             "mata_title": "First Blog",
    //             "meta_key": "First blog key",
    //             "meta_descriptions": "First blog description"
    //         }
    //     }



    // }

    const handleMeta = async (id: any) => {
        const data =
        {
            "table_id": +id,
            "table_name": "blog",
            "key": "_meta_info",
            "value": pageMetaInfo,

        }
        console.log(data, "paper")
        try {

            const { meta }: any = await _post(create_meta, data)
            if (meta?.success) {
                // metaData = meta?.data;
                // setCreateMeta(meta?.data);
            }

        } catch (error) {
            console.log(error, "_error")
        }

    }
    const handleMetaUpdate = async (id: any) => {
        const data =
        {
            "table_id": +id,
            "table_name": "blog",
            "key": "_meta_info",
            "value": pageMetaInfo,
            "meta_id": MetaIdforUpdate
        }
        console.log(data, "paper")
        try {

            const { meta }: any = await _post(update_meta, data)
            if (meta?.success) {
                // metaData = meta?.data;
                // setCreateMeta(meta?.data);
            }

        } catch (error) {
            console.log(error, "_error")
        }

    }

    const delteBanner = async (id: any) => {
        const { data } = await axios.post(`${delete_multiple_blog}`, { blog_ids: [id] }, { withCredentials: true });
        if (data?.success) {
            console.log("handelApply-data", data);
            _SUCCESS(data?.massage);
            // setFields(defaultFieldSet);
            setConfirmStatus("");
            setPageNo(1)
            setGetProd({ page: pageNo, rowsPerPage: 10 })
            setActionValue("delete");
            setChecked([]);
            setTotalBlogGetUrl(total_items_blog);
        }
    }


    useEffect(() => {
        console.log("dataSet editDataSet", blogDetails)
        if (blogDetails !== null && blogDetails?.id) {

            const data = {
                title: blogDetails?.title,
                slug: blogDetails?.slug,
                description: blogDetails?.description,
                blog_id: blogDetails?.id,
            }

            setFields({ ...fields, ...data });

            if (blogDetails?.categories && blogDetails?.categories?.length) {
                // console.log('ddff: ', blogDetails?.categories)
                let arr = [];
                let arr2 = [];
                for (let cat of blogDetails?.categories) {
                    arr.push({
                        id: cat?.id
                    });
                    arr2.push(cat?.id)
                }
                setCategoryChecked(arr2);
                setCategoryCheckedRes([...categoryCheckedRes, ...arr])
            }

            if (blogDetails?.blogImage?.length && blogDetails?.blogImage[0]?.src) {
                let imageBase64 = urlToBase64(blogDetails?.blogImage[0]?.src);
                imageBase64.then((res) => {
                    // console.log('reeImg: ', res);
                    let data_url = [
                        {
                            data_url: res
                        }
                    ];
                    console.log(data_url, "data_url")
                    if (data_url?.length && data_url[0]?.data_url !== undefined) {
                        setImages(data_url)
                        setRestoreImage(data_url)
                    } else {
                        setImages([])
                        setRestoreImage([])
                    }
                })

                let src = `${blogDetails?.blogImage[0]?.src}`.split("/");
                let path = src[src.length - 1];
                setOldImageName(path);
            } else {
                setImages([]);
            }
        }
    }, [blogDetails]);

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
                mata_title: "",
                meta_description: "",
                meta_key: ""
            });
            setMetaInfoMetaId("");
        }
    }

    return (
        <div>
            {/* table */}
            <div className='flex flex-col gap-2 pb-4'>
                {/* <div className='flex flex-wrap gap-2 items-center justify-between'> */}

                <div className='flex items-center gap-2'>
                    <SearchAndAddNewComponent buttonTxt={'Search Blogs'} addNewProduct={addNewBlog} name={'Add Blog'} res={searchRes} />
                    {/* <SearchField />
                        <ButtonField buttonTxt='Search products' handleClick={() => { }} /> */}
                </div>
                {/* </div> */}
                <div className='flex flex-wrap gap-2 items-center justify-between'>
                    <div className='flex flex-wrap gap-4'>
                        {/* <ActionDrop
                            handleChange={handleChangeAction}
                            menuItemArray={actionArray}
                            value={actionValue}
                            handleClick={() => actionValue === "moveToTrash" ? handleToggle() : actionValue === "deletePermanently" ? handleToggle() : actionValue === "restore" && handleToggle()}
                        /> */}
                        <ActionDrop
                            btnValue="Apply"
                            handleChange={handleChangeAction}
                            menuItemArray={actionArray}
                            value={actionValue}
                            handleClick={() => setConfirmMultipleStatus("mulDelete")}
                            disabled={checked.length ? false : true}
                        // handleClick={() => actionValue === "delete" && handleToggle()}
                        />

                    </div>
                    <Pageination
                        items={totalBlogsView?.totalItem}
                        value={pageNo}
                        totalpageNo={getTotalPage()}
                        handleClickFirst={() => setPageNo(1)}
                        handleClickNext={() => setPageNo(pageNo === 1 ? 1 : (pageNo - 1))}
                        handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                        handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
                        handleClickLast={() => setPageNo(getTotalPage())}
                    />
                </div>
            </div>

            {!tabView ?
                (getBlog?.length ?
                    <Table className='lg:table hidden table-auto w-full productTableCls !border !border-solid'>
                        <TableHead>
                            <TableRow
                                hover
                                role="checkbox"
                                className='bg-slate-200 hover:!bg-slate-200'
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} size="small" checked={checked?.length === getBlog?.length ? true : false} />
                                </TableCell>
                                {header.map((col, index) =>
                                    <TableCell key={index}>{col.field}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getBlog?.map((row: any, index: number) => {
                                return (
                                    <StyledTableRow
                                        hover
                                        key={index}
                                        className='hover:!bg-[#6d8ad70f]'
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <StyledTableCell padding="checkbox" className='!border-0 !w-[2.5%]'>
                                            <Checkbox
                                                // checked={prodCheck?.blog_id === row?.id ? true : false}
                                                // onClick={() => prodCheck?.blog_id !== row?.id ? setProdCheck({ blog_id: row?.id }) : setProdCheck({})}
                                                checked={checked.includes(row?.id)}

                                                onClick={(e) => handelTableCheckBox(e, row?.id)}
                                                size="small"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Image src={row?.blogImage?.length ? row?.blogImage[0].src ? row?.blogImage[0].src : blogImage : blogImage} alt='blogImage' className='w-10 h-10' width={192} height={108} priority />
                                        </StyledTableCell>
                                        <StyledTableCell onClick={() => { getBlogDetails(row?.id) }}>{row?.title ? row?.title : "--"}
                                        </StyledTableCell>
                                        <StyledTableCell onClick={() => { getBlogDetails(row?.id) }}>{row?.slug ? row?.slug : "--"}
                                        </StyledTableCell>
                                        <StyledTableCell>{row?.categories?.length ? `${row?.categories.map((i: any, e: number) => i?.name)},` : "--"}</StyledTableCell>
                                        <StyledTableCell>{row?.tags?.length ? row?.tags.map((i: any, e: number) => `${i?.name},`) : "--"}</StyledTableCell>
                                        <StyledTableCell className='w-[10%]'>
                                            <div className='flex items-center gap-2'>
                                                <EditIcon className='text-linkBlue-01' onClick={() => { getBlogDetails(row?.id) }} />
                                                <DeleteIcon className='text-red-500' onClick={() => {

                                                    // delteBanner(row?.id) 
                                                    setConfirmStatus(row?.id);

                                                }} />
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
                                {getBlog.length ? getBlog.map((row: any, index: number) => {
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
                                                            <Image src={row?.Image ? row?.Image : blogImage} alt='blogImage' height={40} priority />
                                                            : <div className='flex justify-between w-full'>{row?.name ? row?.name : "--"}</div>}
                                                    </div>
                                                    <ArrowDropDownIcon className={acordian === row?.id ? 'rotate-180' : ''} />
                                                </div>
                                                <div className={`flex flex-wrap text-sm items-start gap-1  ${acordian === row?.id ? "px-10 py-2" : "pl-3"}`}>
                                                    <span className="text-gray-500">ID: {row?.pink_id}</span> |
                                                    <span className="text-cyan-700">Edit</span> |
                                                    <span className="text-cyan-700">Quick&nbsp;Edit</span> |
                                                    <span className="text-red-600">Trash</span> |
                                                    <span className="text-cyan-700">View</span> |
                                                    <span className="text-cyan-700">Duplicate</span> |
                                                    <span className="text-cyan-700">Promote with Blaze</span>
                                                </div>
                                                {acordian === row?.id ?
                                                    <div className='pl-10'>
                                                        <div className='flex justify-between w-full'>{row?.title ? row?.title : "--"}</div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>sku</div><div className='text-left w-[80%] flex items-start'>{row?.sku ? row?.sku : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>stock</div><div className='text-left w-[80%] flex items-start'><span className={`font-medium ${row?.manage_stock ? "text-lime-500" : "text-red-500"}`}>{row?.manage_stock ? "In stock" : "Out of stock"}</span>&nbsp;({row?.stock_quantity ? row?.stock_quantity : 0})</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>price</div><div className='text-left w-[80%] flex items-start'>&#8377;{row?.price ? row?.price : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>categories</div><div className='text-left w-[80%] flex items-start'>{row?.categories?.length ? `${row?.categories.map((i: any, e: number) => i?.name)},` : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>tags</div><div className='text-left w-[80%] flex items-start'>{row?.tags ? row?.tags : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>featured</div><div className='text-left w-[80%] flex items-start'>{row?.featured ? "00" : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>status</div><div className='text-left w-[80%] flex items-start'>{row?.status ? row?.status?.title + "ed" : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>date</div><div className='text-left w-[80%] flex items-start'>{row?.date_modified_gmt ? moment(row?.date_modified_gmt).format("DD/MM/YYYY") + " " + `at` + " " + moment(row?.date_modified_gmt).format("h:mm a") : "--"}</div></div>
                                                    </div> : null}
                                            </div>
                                        </>
                                    );
                                }) : <div className='w-full flex items-center justify-center p-4'>No data found</div>}
                            </div>
                        </div>
                    </div>
                )}

            <div className='flex items-center justify-between pt-4'>
                {/* <ActionDrop
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    handleClick={() => actionValue === "moveToTrash" ? handleToggle() : actionValue === "deletePermanently" ? handleToggle() : actionValue === "restore" && handleToggle()}
                /> */}
                <ActionDrop
                    btnValue="Apply"
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    handleClick={() => setConfirmMultipleStatus("mulDelete")}
                    disabled={checked.length ? false : true}
                // handleClick={() => actionValue === "delete" && handleToggle()}
                />

                <Pageination
                    items={totalBlogsView?.totalItem}
                    value={pageNo}
                    totalpageNo={getTotalPage()}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo === 1 ? 1 : (pageNo - 1))}
                    handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
                    handleClickLast={() => setPageNo(getTotalPage())}
                />
            </div>

            <FullpageModal modalStat={openFullModal} handleClose={() => { setOpenFullModal(false) }} heading={(blogDetails != undefined && blogDetails != '') ? 'Update Blog' : 'Add Blog'}>
                <div className='p-4 flex items-start gap-2.5'>
                    {/* rightSide */}
                    <div className='lg:w-[75%] w-[50%] flex flex-col gap-2'>
                        <SimpleCard className='w-full' heading={<span className='font-medium'>Blog Details</span>}>

                            <div className='flex flex-col gap-2'>
                                {/* blog title */}
                                <div className={`${flexColItemStart}`}>
                                    <p className={`${fomtMPb2}`}>Blog Title</p>
                                    <div className={`${flexColGap2}`}>
                                        <div className={`${fieldRoot}`}>
                                            <TextField className='!w-full p-1' placeholder='Enter blog title' name='title' handelState={handelOnChange} blur={handleSlug} value={fields?.title} /></div>
                                        <span style={{ color: "red" }}>{fieldsErrors?.title}</span>
                                    </div>
                                </div>

                                {/* blog slug */}
                                <div className={`${flexColItemStart}`}>
                                    <p className={`${fomtMPb2}`}>Blog Slug</p>
                                    <div className={`${flexColGap2}`}>
                                        <div className={`${fieldRoot}`}>
                                            <TextField className='!w-full p-1' placeholder='Enter blog slug' name='slug' handelState={handelOnChange} blur={handleSlug} value={fields?.slug} /></div>
                                        <span style={{ color: "red" }}>{fieldsErrors?.slug}</span>
                                    </div>
                                </div>

                                {/* blog description */}
                                <div className={`${flexColItemStart}`}>
                                    <p className={`${fomtMPb2}`}>Blog Description</p>
                                    <div className={`${flexColGap2}`}>
                                        <CkEditor
                                            value={fields?.description}
                                            handleChange={handleDecriptionChange}
                                        />
                                        <span style={{ color: "red" }}>{fieldsErrors?.description}</span>
                                    </div>
                                </div>

                                {/* <div className='flex items-center justify-end'>
                                    <PinkPawsbutton
                                        variant={"solid"}
                                        name={(blogDetails != undefined && blogDetails != '') ? "Update Blog" : "Add Blog"}
                                        icon={""}
                                        handleClick={handleSubmit}
                                        pinkPawsButtonExtraCls={""}
                                        style={{}}
                                        disabled={buttonDisabled}
                                        title={""}
                                    />
                                </div> */}
                            </div>
                        </SimpleCard>

                        <SimpleCard
                            childrenClassName={`flex flex-col items-center justify-center gap-2 !p-4`}
                            headingClassName='!bg-white w-full'
                        // heading={
                        //     <div className='flex items-center w-full gap-4'>
                        //         <span className='font-medium'>Meta Information</span>
                        //         <hr className='border-l border-solid h-6' />
                        //         <div className='flex items-center'>
                        //             <Checkbox className='!pr-2 !py-1 !p-0' onChange={handelDefaultMeta} />
                        //             <p className=''> Use Default Meta Information?</p>
                        //         </div>
                        //     </div>
                        // }
                        >
                            <div className='grid lg:grid-cols-2 grid-cols-1 gap-4 w-full'>

                                <div className='flex flex-col w-full'>
                                    <p className=''>Meta Title</p>
                                    <TextField
                                        className={`w-full ${field_text_Cls}`}
                                        textFieldRoot='w-full'
                                        value={pageMetaInfo?.mata_title}
                                        name='Meta Title'
                                        handelState={(e: any) => setPageMetaInfo((pre: any) => ({
                                            ...pre,
                                            mata_title: e.target.value
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
                            {/* <div className='flex items-center justify-end'>
                                <PinkPawsbutton
                                    variant={"solid"}
                                    name={(blogDetails != undefined && blogDetails != '') ? "Update Meta" : "Add Meta"}
                                    icon={""}
                                    handleClick={handleMeta}
                                    pinkPawsButtonExtraCls={""}
                                    style={{}}
                                    disabled={buttonDisabled}
                                    title={""}
                                />
                            </div> */}
                        </SimpleCard>
                    </div>

                    {/* leftSide */}
                    <div className='flex flex-col gap-2 lg:w-[25%] w-[50%]'>
                        <SimpleCard heading={<span className='font-medium'>Blog Images</span>}>
                            {/* <div className='p-4 flex flex-col gap-2 bg-offWhite-03'> */}
                            <div className='w-full border border-solid border-offWhite-02'>

                                <ImageUploader onImageChange={handleImage} preImages={images} className={`imageDeopZone`} />
                                {/* <input type='file' name='image' onChange={(e) => handleImage(e)} /> */}
                            </div>
                            <span style={{ color: "red" }}>{imageError}</span>
                            {
                                restoreButton &&
                                <span style={{ color: 'blue' }} className='cursor-pointer' onClick={() => { setImages(restoreImage); setImageError(""); setRestoreButton(false); }}>click here for restore image</span>
                            }
                            {/* </div> */}
                        </SimpleCard>

                        <SimpleCard heading={<span className='font-medium'>Blog categories</span>}>
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
                                    <Productcategories dynArr={getBlogCategory} />
                                </div>
                            </div>
                        </SimpleCard>

                        <SimpleCard heading={<span className='font-medium'>Blog tags</span>}>
                            <div className='flex items-start flex-col gap-2'>
                                {/* <Autocomplete
                                    disablePortal
                                    className='atocompleteCls w-full'
                                    options={autocompleteSelect}
                                    renderInput={(params) => <MuiTextField {...params} onChange={(e)=> console.log(e.target.value, "_params")}/>}
                                /> */}
                                <Autocomplete
                                    multiple
                                    id="tags"
                                    options={allTags}
                                    getOptionLabel={(option: any) => option.name}
                                    filterSelectedOptions={true}
                                    className='atocompleteCls w-full'
                                    onChange={(e: any, v: any) => handleTagsCheckBox(v)}
                                    renderInput={(params) => (<MuiTextField {...params} placeholder='add tag' onChange={(e: any) => console.log(e, "vals")} />)}
                                // value={v?.preFilter}
                                // onChange={(e: any) => setMultitagSelect([...multitagSelect, { label: e.target.innerText ? e.target.innerText : null }])}
                                />
                                {/* <div>
                                    {multitagSelect.length ? multitagSelect.map((i: any, e: number) => <div key={e}><span className='bg-slate-300 rounded-xl p-2'>{i?.label}</span></div>) : null}
                                    <PinkPawsbutton icon={<ClearIcon className='w-5 h-5'/>} name='Clear' pinkPawsButtonExtraCls='gap-1' handleClick={()=> setMultitagSelect([])}/>
                                </div> */}
                            </div>
                        </SimpleCard>

                        <div className='flex items-center justify-end'>
                            <PinkPawsbutton
                                variant={"solid"}
                                name={(blogDetails != undefined && blogDetails != '') ? "Update Blog" : "Add Blog"}
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
            </FullpageModal >
            {/* <FullpageModal modalStat={openFullModal} handleClose={() => setOpenFullModal(false)} heading={'Edit Blog'}>
                {ProductDetailsEdit()}
            </FullpageModal> */}

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
                            <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { delteBanner(confirmStatus); }} />
                            <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => { setConfirmStatus("") }} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog
                open={confirmMultipleStatus !== ""}
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
                            <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => { handelApply(); }} />
                            <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => { setConfirmMultipleStatus("") }} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Blogs