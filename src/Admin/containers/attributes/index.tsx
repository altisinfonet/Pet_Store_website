import React, { useEffect, useState } from 'react'
import ActionDrop from '../../components/ActionDrop'
import Pageination from '../../components/Pageination'
import useTabView from '../../../hooks/useTabView'
import { Checkbox, styled, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow } from '@mui/material'
import Image from 'next/image'
import productImage from "../../../../public/assets/images/product.png"
import moment from 'moment'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useRead, useUpdate } from '../../../hooks'
import getUrlWithKey from '../../util/_apiUrl'
import axios from 'axios';
import FullpageModal from '../../components/FullPageModal'
import PinkPawsbutton from '../../components/PinkPawsbutton'
import TextAreaField from '../../components/TextAreaField'
import TextField from '../../components/TextField'
import DynamicForm from '../../components/Form'
import { capitalize, getAdminSetting, isEmptyObject, urlToBase64 } from '../../util/_common'
import RightSideModal from '../../components/RightSideModal'
import { _SUCCESS } from '../../../util/_reactToast'
import ImageUploader from '../../components/ImageUploader'
import SearchAndAddNewComponent from '../../components/searchAddNewComponent'
import SimpleCard from '../../components/SimpleCard'
import CkEditor from '../../components/CkEditor'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { _post, _put } from '../../services'
import { Preview } from '@mui/icons-material'
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

const AttributePage = () => {

    let errorCls = "text-sm text-red-500"

    const defaultFieldSet = {
        product_attribute_id: "",
        name: "",
        slug: "",
        has_archives: false,
        termName: "",
        values: []
    }

    const defaultFieldSetErr = {
        name: "",
        slug: "",
        termName: ""
    }

    const defaultFieldSetTerms = {
        product_attribute_id: "",
        product_attribute_term_id: "",
        name: "",
        slug: "",
        description: "",
        show_home_page: false
    }

    const [actionValue, setActionValue] = useState("delete")
    const [pageNo, setPageNo] = useState(1)
    const [prodCheck, setProdCheck]: any = useState({})
    const [acordian, setAcordian]: any = useState()
    const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
    const [openFullModal, setOpenFullModal] = useState(false)
    // const [handleModalTerms, setHandleModalTerms] = useState(false)
    const [attributeDetails, setAttributeDetails]: any = useState()
    console.log(attributeDetails, "dfg5d41df5g41fd")

    const [attributeDetailsOptions, setAttributeDetailsOptions]: any = useState([])
    const [dataSetCategory, setDataSetCategory] = useState()
    const [fields, setFields] = useState(defaultFieldSet);
    const [fieldsErr, setFieldsErr] = useState(defaultFieldSetErr)
    const [fieldSetTerms, setFieldSetTerms] = useState(defaultFieldSetTerms);
    const [image, setImage] = useState([]);
    const [formdata, setFormdata] = useState({})
    const [configureterms, setConfigureterms]: any = useState({});
    const [checked, setChecked] = useState<any[]>([]);
    const [checkedTerms, setCheckedTerms] = useState<any[]>([]);
    const [totalPageUrl, setTotalPageUrl] = useState<any>();
    const [images, setImages] = useState<any>([]);
    const [imageError, setImageError] = useState("");
    const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());
    const [checkMode, setCheckMode] = useState("attribute")
    const [pageMetaInfo, setPageMetaInfo]: any = useState({
        meta_title: "",
        meta_description: "",
        meta_key: ""
    });
    const [metaInfoMetaId, setMetaInfoMetaId] = useState("");
    const [attId, setAttId] = useState("")


    console.log(checkMode, "checkMode")


    const flexColItemStart = `flex flex-col items-start w-full`
    const fomtMPb2 = `font-medium pb-2`
    const flexColGap2 = `flex flex-col gap-2 w-full`
    const fieldRoot = `w-full border border-solid border-gray-400`

    useEffect(() => {
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo])



    useEffect(() => {
        if (configureterms?.id) {
            setAttributeDetailsOptions(attributeDetails?.options)
        }
    }, [attributeDetails, configureterms])

    function searchArray(searchTerm: any) {

        const keywords = searchTerm.toLowerCase().split(' ').map((keyword: any) => keyword.trim());
        const searchResult = configureterms?.id && attributeDetails?.options.filter((item: any) =>
            keywords.some((keyword: any) =>
                item.name.toLowerCase().includes(keyword) ||
                item.slug.toLowerCase().includes(keyword) ||
                item.description.toLowerCase().includes(keyword)
            )
        );
        setAttributeDetailsOptions(searchResult)
    }

    // const searchTerm = "aeolus";  // Example search term
    // const resultArray = searchArray(searchTerm);

    // useEffect(() => {
    //     setGetProd({ ...getProd, page: pageNo })
    // }, [pageNo])


    const { create_product_attribute, get_product_attribute, get_product_attribute_details, update_product_attribute, update_product_attribute_term, delete_product_attribute, total_items_product, create_product_attribute_term, delete_product_arributes_term, update_product_attribute_term_image } = getUrlWithKey("product_attributes")
    const { create_meta, update_meta, get_slug_by_meta } = getUrlWithKey("pages");

    const { tabView } = useTabView()
    const { sendData: getProductAttribute }: any = useRead({ selectMethod: "put", url: get_product_attribute, callData: getProd });
    const { sendData: list }: any = useRead({ selectMethod: "get", url: totalPageUrl });


    const addNewProduct = () => {
        setAttributeDetails();
        setFields(defaultFieldSet);
        setOpenFullModal(true);
    }

    const addNewTerm = () => {
        setImages([]);
        setFieldsErrors(new Object());
        setFieldSetTerms(defaultFieldSetTerms);
        setOpenFullModal(true);
    }

    const handelOnChange = (e: any) => {
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
        setFieldsErr(pre => ({ ...pre, [stateName]: "" }));
    }

    const handelOnChangeterms = (e: any, isChecked: boolean) => {
        const stateName = e.target.name;
        // const stateValue = e.target.value;
        const stateValue = isChecked ? e.target.checked : e.target.value;


        setFieldSetTerms(pre => ({
            ...pre,
            [stateName]: stateValue
        }));

        clearValidation(stateName);
    }

    const handelOnChangetermsDescription = (e: any) => {
        const stateName = e.target.name;
        const stateValue = e.target.value;

        setFieldSetTerms(pre => ({
            ...pre,
            [stateName]: stateValue
        }));
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

        setFieldsErr(pre => ({ ...pre, slug: "" }));
    }

    const handleSlugAuto = () => {
        let slug = stringToSlug(fields?.name);

        setFields(pre => ({
            ...pre,
            ["slug"]: `${slug}`
        }))

        setFieldsErr(pre => ({ ...pre, slug: "" }));
    }

    const handleSlugterms = (e: any) => {
        // let slug = stringToSlug(e.target.value);
        setFieldSetTerms(pre => ({
            ...pre,
            ["slug"]: `${e.target.value}`
        }))

        clearValidation("slug");
    }

    const handleSlugTerm = (e: any) => {
        // let slug = stringToSlug(fieldSetTerms?.name);
        let slug = stringToSlug(e.target.value);
        setFieldSetTerms(pre => ({
            ...pre,
            ["slug"]: `${slug}`
        }))

        clearValidation("slug");
    }

    const handleCheckbox = (e: any) => {
        const stateName = e.target.name;
        const stateValue = e.target.checked;
        setFields(pre => ({
            ...pre,
            [stateName]: stateValue
        }))
    }
    const handleSubmit = async () => {

        try {
            if (attributeDetails) {
                const { data } = await axios.post(`${update_product_attribute}`, fields);
                if (data?.success) {
                    setFields(defaultFieldSet);
                    setPageNo(1)
                    setGetProd({ page: 1, rowsPerPage: 10 })
                    setOpenFullModal(false);
                    setTotalPageUrl(total_items_product);
                    setFieldsErr({
                        name: "",
                        slug: "",
                        termName: ""
                    });
                    _SUCCESS(data?.massage);
                }
            } else {
                let valid = true;
                if (fields?.name === "") {
                    valid = false;
                    setFieldsErr(pre => ({ ...pre, name: "Please enter name" }));
                }

                if (fields?.slug === "") {
                    valid = false;
                    setFieldsErr(pre => ({ ...pre, slug: "Please enter slug" }));
                }

                // if (fields?.termName === "") {
                //     valid = false;
                //     setFieldsErr(pre => ({ ...pre, termName: "Please enter term name" }));
                // }
                let attributeData = {
                    ...fields,
                    // values: [{
                    //     name: fields?.termName,
                    //     slug: stringToSlug(fields?.termName)
                    // }]
                };

                if (valid) {
                    const { data } = await axios.post(`${create_product_attribute}`, attributeData);
                    if (data?.success) {
                        setFields(defaultFieldSet);
                        setPageNo(1)
                        setGetProd({ page: 1, rowsPerPage: 10 })
                        setOpenFullModal(false);
                        setTotalPageUrl(total_items_product);
                        setFieldsErr({
                            name: "",
                            slug: "",
                            termName: ""
                        });
                        _SUCCESS(data?.massage);
                    }
                }
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const getAttributeDetails = async (id: any) => {
        try {
            const { data } = await axios.get(`${get_product_attribute_details}/${id}`);
            if (configureterms?.id) {
                if (data?.success) {
                    console.log(data?.data, "dfg541df5g41fd")
                    setAttributeDetails(data?.data);
                }
            } else {
                if (data?.success) {
                    setAttributeDetails(data?.data);
                    if (data?.data?.id) {
                        setOpenFullModal(true)
                    } else {
                        setOpenFullModal(false)
                    }
                }
            }
        } catch (error: any) {
            console.log("error", error);
        }
    }

    useEffect(() => {
        getAttributeDetails(configureterms?.id)
    }, [configureterms])

    useEffect(() => {
        console.log(attributeDetails, "5f4gh6gf")
        setFields({
            name: attributeDetails?.name,
            slug: attributeDetails?.slug,
            has_archives: attributeDetails?.has_archives,
            termName: attributeDetails?.termName,
            product_attribute_id: attributeDetails?.id,
            values: attributeDetails?.options
        });
    }, [attributeDetails])


    const actionArray = [
        // { value: "bulkAction", name: "Bulk action" },
        { value: "delete", name: "Delete" },
    ]

    const header = [
        { field: 'Name' },
        { field: 'Slug' },
        { field: 'Terms' },
        { field: 'Action' },
    ];

    const headerTerms = [
        { field: 'Name' },
        { field: 'Description' },
        { field: 'Slug' },
        { field: 'Count' },
        { field: 'Action' },
    ]

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
        // setDoTrashProd(delete_product);
    }

    const onHandleAcordian = (id: number | string) => {
        if (id === acordian) {
            setAcordian(null)
        } else {
            setAcordian(id as number)
        }
    }


    const updateTermsOpen = (attID: any, term: any) => {
        setImages([]);
        setFieldsErrors(new Object());
        setFieldSetTerms({
            name: term?.name ? term?.name : "",
            slug: term?.slug ? term?.slug : "",
            description: term?.description ? term?.description : "",
            product_attribute_id: attID ? attID : "",
            product_attribute_term_id: term?.id ? term?.id : "",
            show_home_page: false
        })

        if (term?.productTermImage && term?.productTermImage?.image) {
            let imageBase64 = urlToBase64(term?.productTermImage?.image);
            imageBase64.then((res) => {
                let data_url = [
                    {
                        data_url: res
                    }
                ];
                setImages(data_url)
                // setRestoreImage(data_url)
            })

            // let src = `${productCategoryDetails?.image}`.split("/");
            // let path = src[src.length - 1];
            // setOldImageName(path);
        }
        setOpenFullModal(true)
    }

    const [submitTerm, setSubmitTerm] = useState("")
    const [addTerm, setAddTerms] = useState(false);


    //     useEffect(() => {
    //         if (fieldSetTerms) {
    //         }
    //     }, [fieldSetTerms])
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


    const handleAddTerms = async () => {
        console.log(fieldSetTerms, "5df51g5df1")

        // 
        // return
        try {
            let valid = false;
            setImageError("");
            valid = validation(fieldSetTerms, ["name", "slug"]);
            if (valid) {
                const removeHtmlTags = (htmlString) => {
                    return htmlString.replace(/<p.*?>(.*?)<\/p>/g, '$1');
                };
                fieldSetTerms.description = removeHtmlTags(fieldSetTerms.description);
                const { data } = await axios.post(`${create_product_attribute_term}`, { ...fieldSetTerms, product_attribute_id: configureterms?.id });
                if (data?.success) {
                    handleSubmitMeta({ product_attribute_term_id: data?.data?.productAttributeTermId })
                    if (images?.length) {
                        let formData = new FormData();
                        formData.append('term_image', images[0]['file']);
                        formData.append('product_attribute_term_id', data?.data?.productAttributeTermId);

                        const { data: imgRes } = await axios.post(`${update_product_attribute_term_image}`, formData);
                        if (imgRes?.success) {
                            _SUCCESS(imgRes?.massage);
                            setFieldSetTerms(defaultFieldSetTerms)
                            getAttributeDetails(configureterms?.id)
                            setOpenFullModal(false);
                        }
                    } else {
                        _SUCCESS(data?.massage)
                        setFieldSetTerms(defaultFieldSetTerms)
                        getAttributeDetails(configureterms?.id)
                        setOpenFullModal(false);

                    }

                    // setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
                }
            }
        } catch (error) {
            console.log(error, "error")
        }

        // setSubmitTerm(`${update_product_attribute_term}`)
    }

    const handleUpdateTerms = async () => {
        console.log(fieldSetTerms, "5df51g5df1")
        // 
        // return
        try {
            let valid = false;
            setImageError("");
            valid = validation(fieldSetTerms, ["name", "slug"]);

            if (valid) {
                const removeHtmlTags = (htmlString) => {
                    return htmlString.replace(/<p.*?>(.*?)<\/p>/g, '$1');
                };
                fieldSetTerms.description = removeHtmlTags(fieldSetTerms.description);
                const { data } = await axios.post(`${update_product_attribute_term}`, fieldSetTerms);
                if (data?.success) {

                    if (images?.length && images[0]['file'] != null && images[0]['file'] != undefined && images[0]['file'] != '') {
                        let formData = new FormData();
                        formData.append('term_image', images[0]['file']);
                        formData.append('product_attribute_term_id',
                            fieldSetTerms?.product_attribute_term_id
                        );

                        const { data: imgRes } = await axios.post(`${update_product_attribute_term_image}`, formData);
                        if (imgRes?.success) {
                            _SUCCESS(imgRes?.massage);
                            setFieldSetTerms(defaultFieldSetTerms)
                            setOpenFullModal(false);
                            getAttributeDetails(configureterms?.id)
                        }
                    } else {
                        setOpenFullModal(false);
                        setFieldSetTerms(defaultFieldSetTerms)
                        getAttributeDetails(configureterms?.id)
                        _SUCCESS(data?.massage)
                    }
                }
            }
        } catch (error) {
            console.log(error, "error")
        }

        // setSubmitTerm(`${update_product_attribute_term}`)
    }

    const handelApply = async () => {
        if (actionValue === 'delete') {
            if (checked?.length) {
                const { data } = await axios.post(`${delete_product_attribute}`, { product_attribute_id: checked });
                if (data?.success) {
                    console.log("Data deleted")
                    // setFields(defaultFieldSet);
                    setPageNo(pageNo);
                    setGetProd({ page: pageNo, rowsPerPage: 10 });
                    // setActionValue("delete");
                    // setChecked([]);
                    setTotalPageUrl(total_items_product);
                    // getAttributeDetails(configureterms?.id)
                    _SUCCESS(data?.data);
                }
            } else if (checkedTerms?.length) {
                const { data } = await axios.post(`${delete_product_arributes_term}`, { product_attribute_id: checkedTerms });
                if (data?.success) {
                    // console.log("delete success");
                    // setFieldSetTerms(defaultFieldSetTerms);
                    // setActionValue("delete");
                    // setCheckedTerms([]);
                    // getAttributeDetails(configureterms?.id)
                    _SUCCESS(data?.data);
                }
            }

        }
    }
    console.log(attId, "attId")

    const delAttributeTerm = async ({ delId }: any) => {
        try {
            const { data } = await axios.post(`${delete_product_arributes_term}`, { product_attribute_id: delId });
            if (data?.success) {
                // console.log("delete success");
                // setFieldSetTerms(defaultFieldSetTerms);
                // setActionValue("delete");
                // setCheckedTerms([]);
                // getAttributeDetails(configureterms?.id)
                _SUCCESS(data?.data);
                console.log(attId, "attId")
                getAttributeDetails(attId)
            }
        } catch (error) {
            console.log(error, "_error")
        }
    }

    const delAttribute = async ({ delId }: any) => {
        try {
            const { data } = await axios.post(`${delete_product_attribute}`, { product_attribute_id: delId });
            if (data?.success) {
                console.log("Data deleted")
                // setFields(defaultFieldSet);
                setPageNo(pageNo);
                setGetProd({ page: pageNo, rowsPerPage: 10 });
                // setActionValue("delete");
                // setChecked([]);
                setTotalPageUrl(total_items_product);
                // getAttributeDetails(configureterms?.id)
                _SUCCESS(data?.data);
            }
        } catch (error) {
            console.log(error, "_error")
        }
    }

    const handleImage = (e: any) => {
        // setImages(e.target.files);
        // setImageError("");
        setImages(e);
        // if (fields?.product_category_id != null) {
        //     setRestoreImage(e);
        // }
        setImageError("");
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

    const handelTableCheckBoxForTerm = (e: any, v: any) => {
        const arr = [...checkedTerms];
        if (e?.target?.checked) {
            arr.push(v);
            setCheckedTerms(arr);
        } else {
            setCheckedTerms(arr.filter((item: any) => item !== v))
        }
    }

    const handelAllChecked = (e: any) => {
        if (e?.target?.checked && getProductAttribute && getProductAttribute?.length) {
            const arr = [];
            for (let g = 0; g < getProductAttribute.length; g++) {
                if (getProductAttribute[g] && getProductAttribute[g]?.id) {
                    arr.push(getProductAttribute[g]?.id);
                }
            }
            setChecked(arr);
        } else {
            setChecked([]);
        }
    }

    const handelTermAllChecked = (e: any) => {

        if (e?.target?.checked && attributeDetails && attributeDetails?.options && attributeDetails?.options?.length) {
            const arr = [];
            for (let g = 0; g < attributeDetails.options.length; g++) {
                if (attributeDetails.options[g] && attributeDetails.options[g]?.id) {
                    arr.push(attributeDetails.options[g]?.id);
                }
            }
            setCheckedTerms(arr);
        } else {
            setCheckedTerms([]);
        }
    }

    const { sendData: termUpdatedData } = useUpdate({ selectMethod: "post", url: submitTerm, callData: fieldSetTerms })
    useEffect(() => {
        if (termUpdatedData) {
            getAttributeDetails(fieldSetTerms?.product_attribute_id)
            setSubmitTerm("")
            setOpenFullModal(false)
            setFieldSetTerms(defaultFieldSetTerms)
        }
    }, [termUpdatedData])

    useEffect(() => {
        setTotalPageUrl(total_items_product);
    }, []);

    useEffect(() => {
        if (list?.totalItem && totalPageUrl) {
            setTotalPageUrl("");
        }
    }, [list]);

    const getTotalPage = (): number => {
        if (list?.totalPage && list?.totalPage !== 0) {
            return list?.totalPage;
        } else if (list?.totalPage === 0) {
            return 1;
        } else {
            return 0;
        }
    }

    const searchRes = (value: any) => {
        if (!configureterms?.id) {
            if (value) {
                setPageNo(1);
                setGetProd({ page: 1, rowsPerPage: 10, search: value });
                setTotalPageUrl(`${total_items_product}/${value}`);
            } else {
                setPageNo(1);
                setGetProd({ page: 1, rowsPerPage: 10 });
                setTotalPageUrl(`${total_items_product}`);
            }
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
            const { data }: any = await _put(get_slug_by_meta, { table_name: "productAttributeTerm", table_slug: fieldSetTerms?.slug });
            if (data?.success) {
                setFieldSetTerms({
                    ...fieldSetTerms,
                    show_home_page: data?.data?.value?.show_home_page
                })
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
    }, [fieldSetTerms?.product_attribute_term_id])

    const handleSubmitMeta = async ({ meta_id, product_attribute_term_id }: any) => {
        try {
            if (product_attribute_term_id) {
                if (meta_id) {
                    const { data }: any = await _post(update_meta, {
                        table_id: product_attribute_term_id,
                        table_name: "productAttributeTerm",
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
                        table_id: product_attribute_term_id,
                        table_name: "productAttributeTerm",
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
            setFieldSetTerms(defaultFieldSetTerms);
            setPageMetaInfo({
                meta_title: "",
                meta_description: "",
                meta_key: ""
            });
        }
    }, [openFullModal])

    return (
        <div className='w-full flex flex-col items-start justify-center gap-4'>
            <SearchAndAddNewComponent buttonTxt={'Search Product Attributes'} addNewProduct={configureterms?.id ? addNewTerm : addNewProduct} name={configureterms?.id ? capitalize("Add New Terms For " + configureterms?.name) : "Add Product Attribute"} res={(e: any) => configureterms?.id ? searchArray(e) : searchRes(e)} />
            <div className='flex w-full flex-wrap gap-2 items-center justify-between'>
                {checkMode !== "attribute" ? <ActionDrop
                    btnValue="Apply"
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    handleClick={handelApply}
                    disabled={checkedTerms.length ? false : true}
                /> :
                    <ActionDrop
                        btnValue="Apply"
                        handleChange={handleChangeAction}
                        menuItemArray={actionArray}
                        value={actionValue}
                        handleClick={handelApply}
                        disabled={checked.length ? false : true}
                    />}
                {/* actionValue === "restore" && handleToggle() */}
                {configureterms?.id ?
                    <>
                        <PinkPawsbutton variant='outlined' name='back' handleClick={() => { setConfigureterms([]); setGetProd({ page: 1, rowsPerPage: 10 }); setCheckMode("attribute") }} />

                    </>
                    :
                    <>
                        <Pageination
                            items={list?.totalItem}
                            value={pageNo}
                            totalpageNo={getTotalPage()}
                            handleClickFirst={() => setPageNo(1)}
                            handleClickNext={() => setPageNo(pageNo == 1 ? 1 : (pageNo - 1))}
                            handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                            handleClickPrevious={() => setPageNo(getTotalPage() == 1 ? 1 : pageNo + 1)}
                            handleClickLast={() => setPageNo(getTotalPage())}
                        />
                    </>}
            </div>

            {configureterms?.id ?
                (!tabView ?
                    <Table className='lg:inline-table hidden table-auto productTableCls !border !border-solid'>
                        <TableHead className='bg-offWhite-01'>
                            <TableRow
                                hover
                                role="checkbox"
                                sx={{ cursor: 'pointer' }}
                                className='bg-slate-200 hover:!bg-slate-200'
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox onClick={handelTermAllChecked} size="small" checked={checkedTerms?.length === attributeDetailsOptions?.length ? true : false} />
                                </TableCell>
                                {headerTerms.map((col: any, index: number) =>
                                    <TableCell key={index} className='!font-semibold'>{col.field}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attributeDetailsOptions?.length ? attributeDetailsOptions.map((row: any, index: number) => {
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
                                                // onClick={() => prodCheck?.product_id !== row?.id ? setProdCheck({ product_id: row?.id }) : setProdCheck({})}
                                                checked={checkedTerms.includes(row?.id)}
                                                onClick={(e) => handelTableCheckBoxForTerm(e, row?.id)}

                                                size="small"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell className='!border-0 !w-[25%]' onClick={() => updateTermsOpen(attributeDetails?.id, row)} >{row?.name ? row?.name : "--"}</StyledTableCell>
                                        <StyledTableCell className='!border-0 !w-[35%]' onClick={() => updateTermsOpen(attributeDetails?.id, row)} >{row?.description ? row?.description : "--"}</StyledTableCell>
                                        {/* <StyledTableCell className='!w-[35%]' onClick={() => updateTermsOpen(attributeDetails?.id, row)} >
                                            {row?.productTermImage?.image ?
                                                <Image src={row?.productTermImage?.image} alt={row?.productTermImage?.image} className='w-10 h-10' width={192} height={108} />
                                                : row?.description ?
                                                    row?.description
                                                    : "--"}
                                        </StyledTableCell> */}
                                        <StyledTableCell className='!border-0 !w-[10%]' onClick={() => updateTermsOpen(attributeDetails?.id, row)} >{row?.slug ? row?.slug : "--"}</StyledTableCell>
                                        <StyledTableCell className='!border-0 !w-[5%]' onClick={() => updateTermsOpen(attributeDetails?.id, row)} >{(row?._count && row?._count?.productTerms) ? row?._count?.productTerms : "--"}</StyledTableCell>
                                        <StyledTableCell className='!border-0 !w-[5%]'>
                                            <div className='flex flex-row gap-2'>
                                                <EditIcon className='w-6 h-6 text-linkBlue-01 cursor-pointer' onClick={() => { updateTermsOpen(attributeDetails?.id, row) }} />
                                                <DeleteIcon className={`w-6 h-6 ${row?._count?.products ? "text-gray-400 cursor-not-allowed" : "text-red-500 cursor-pointer"} `} onClick={() => { delAttributeTerm({ delId: [row?.id] }) }} />
                                            </div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            }) : null}
                        </TableBody>
                    </Table>
                    :
                    <div className='border border-solid rounded text-center w-full'>
                        <div className='flex items-center justify-start bg-offWhite-01 px-4'>
                            <Checkbox />
                            <p>Name</p>
                        </div>

                        <div className='flex'>
                            <div className='flex flex-col w-full'>
                                {getProductAttribute.length ? getProductAttribute.map((row: any, index: number) => {
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
                                                            null
                                                            : <div className='flex justify-between w-full'>{row?.name ? row?.name : "--"}</div>}
                                                    </div>
                                                    <ArrowDropDownIcon className={acordian === row?.id ? 'rotate-180' : ''} />
                                                </div>
                                                <div className={`flex flex-wrap text-sm items-start gap-1  ${acordian === row?.id ? "px-10 py-2" : "pl-3"}`}>
                                                    <span className="text-cyan-700" onClick={() => { getAttributeDetails(row?.id) }}>Edit</span> |
                                                    <span className="text-cyan-700" onClick={() => setConfigureterms(row?.options)}>Configure&nbsp;terms</span> |
                                                    <span className="text-red-600">Delete</span> |
                                                    <span className="text-cyan-700">View</span> |
                                                    <span className="text-cyan-700">Make default</span>
                                                </div>
                                                {acordian === row?.id ?
                                                    <div className='pl-10'>
                                                        <div className='flex justify-between w-full'>{row?.name ? row?.name : "--"}</div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>Slug</div><div className='text-left w-[80%] flex items-start'>{row?.slug ? row?.slug : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>Terms</div>
                                                            <div className='text-left w-[80%] flex items-end'>
                                                                {row?.options ? row?.options?.map((option: any) => {
                                                                    {
                                                                        return `| ${option?.name} |`
                                                                    }
                                                                }) : "--"}
                                                            </div>
                                                        </div>
                                                    </div> : null}
                                            </div>
                                        </>
                                    );
                                }) : <div className='w-full flex items-center justify-center p-4'>No data found</div>}
                            </div>
                        </div>
                    </div>)
                :
                (!tabView ?
                    (getProductAttribute?.length ?
                        <Table className='lg:inline-table hidden table-auto w-full productTableCls !border !border-solid'>
                            <TableHead>
                                <TableRow
                                    hover
                                    role="checkbox"
                                    className='bg-slate-200 hover:!bg-slate-200'
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} size="small" checked={checked?.length === getProductAttribute?.length ? true : false} />
                                    </TableCell>
                                    {header.map((col, index) =>
                                        <TableCell className='!font-semibold' key={index}>{col.field}</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getProductAttribute?.map((row: any, index: number) => {
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
                                            <StyledTableCell className='!border-0 !w-[10%]' onClick={() => { getAttributeDetails(row?.id); setAttId(row?.id); }}>{row?.name ? row?.name : "--"}</StyledTableCell>
                                            <StyledTableCell className='!border-0 !w-[10%]' onClick={() => { getAttributeDetails(row?.id); setAttId(row?.id); }}>{row?.slug ? row?.slug : "--"}</StyledTableCell>
                                            <StyledTableCell className='!border-0 !w-[77%] cursor-default'>
                                                <div className='flex flex-wrap items-center gap-1.5 w-fit'>
                                                    {row?.options ? row?.options?.map((option: any, idx: number) => {
                                                        {
                                                            return (

                                                                <span key={idx} className=' text-terms-02 border border-solid border-terms-01 !text-xs px-2 py-0.5 rounded w-fit font-medium !uppercase' dangerouslySetInnerHTML={{ __html: option?.name }} />

                                                            )
                                                        }
                                                    }) : "--"}
                                                    &nbsp;<span className='bg-linkBlue-01 text-xs text-white px-2 py-0.5 rounded w-fit flex items-center cursor-pointer' onClick={() => { setConfigureterms({ id: row?.id, name: row?.name }); setCheckMode("terms"); setAttId(row?.id); }}>Configure terms&nbsp;→</span>
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell className='!border-0 !w-[5%]'>
                                                <div className='flex flex-row gap-2'>
                                                    <EditIcon className='w-6 h-6 text-linkBlue-01 cursor-pointer' onClick={() => { getAttributeDetails(row?.id); setAttId(row?.id); }} />
                                                    <DeleteIcon className={`w-6 h-6 ${row?._count?.products ? "text-gray-400 cursor-not-allowed" : "text-red-500 cursor-pointer"} `} onClick={() => { delAttribute({ delId: [row?.id] }) }} />
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
                                    {getProductAttribute.length ? getProductAttribute.map((row: any, index: number) => {
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
                                                                null
                                                                : <div className='flex justify-between w-full'>{row?.name ? row?.name : "--"}</div>}
                                                        </div>
                                                        <ArrowDropDownIcon className={acordian === row?.id ? 'rotate-180' : ''} />
                                                    </div>
                                                    <div className={`flex flex-wrap text-sm items-start gap-1  ${acordian === row?.id ? "px-10 py-2" : "pl-3"}`}>
                                                        <span className="text-cyan-700" onClick={() => { getAttributeDetails(row?.id) }}>Edit</span> |
                                                        <span className="text-cyan-700" onClick={() => setConfigureterms(row?.options)}>Configure&nbsp;terms</span> |
                                                        <span className="text-red-600">Delete</span> |
                                                        <span className="text-cyan-700">View</span> |
                                                        <span className="text-cyan-700">Make default</span>
                                                    </div>
                                                    {acordian === row?.id ?
                                                        <div className='pl-10'>
                                                            <div className='flex justify-between w-full'>{row?.name ? row?.name : "--"}</div>
                                                            <div className='flex justify-between w-full'><div className='text-left w-[15%]'>Slug</div><div className='text-left w-[80%] flex items-start'>{row?.slug ? row?.slug : "--"}</div></div>
                                                            <div className='flex justify-between w-full'><div className='text-left w-[15%]'>Terms</div>
                                                                <div className='text-left w-[80%] flex items-end'>
                                                                    {row?.options ? row?.options?.map((option: any) => {
                                                                        {
                                                                            return `| ${option?.name} |`
                                                                        }
                                                                    }) : "--"}
                                                                </div>
                                                            </div>
                                                        </div> : null}
                                                </div>
                                            </>
                                        );
                                    }) : <div className='w-full flex items-center justify-center p-4'>No data found</div>}
                                </div>
                            </div>
                        </div>
                    ))
            }

            <div className='flex w-full flex-wrap gap-2 items-center justify-between'>
                {checkMode !== "attribute" ? <ActionDrop
                    btnValue="Apply"
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    handleClick={handelApply}
                    disabled={checkedTerms.length ? false : true}
                /> :
                    <ActionDrop
                        btnValue="Apply"
                        handleChange={handleChangeAction}
                        menuItemArray={actionArray}
                        value={actionValue}
                        handleClick={handelApply}
                        disabled={checked.length ? false : true}
                    />}
                {/* actionValue === "restore" && handleToggle() */}
                {configureterms?.id ?
                    <>
                        <PinkPawsbutton variant='outlined' name='back' handleClick={() => { setConfigureterms([]); setGetProd({ page: 1, rowsPerPage: 10 }); setCheckMode("attribute") }} />

                    </>
                    :
                    <>
                        <Pageination
                            items={list?.totalItem}
                            value={pageNo}
                            totalpageNo={getTotalPage()}
                            handleClickFirst={() => setPageNo(1)}
                            handleClickNext={() => setPageNo(pageNo == 1 ? 1 : (pageNo - 1))}
                            handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                            handleClickPrevious={() => setPageNo(getTotalPage() == 1 ? 1 : pageNo + 1)}
                            handleClickLast={() => setPageNo(getTotalPage())}
                        />
                    </>}
            </div>


            <RightSideModal modalStat={openFullModal} handleClose={() => {
                setOpenFullModal(false);
                setFieldSetTerms(defaultFieldSetTerms)
                setFieldsErr({
                    name: "",
                    slug: "",
                    termName: ""
                });
            }} heading={!configureterms?.id ? 'Add Product Attribute' : 'Add Product Terms'}>
                <div className='flex items-start gap-2.5'>
                    {!configureterms?.id ?
                        <div className='flex w-[100%] flex-col gap-2'>
                            <div className='flex items-center gap-4'>
                                {/* product Attribute name */}
                                <div className={`${flexColItemStart}`}>
                                    <p className={`${fomtMPb2}`}>Product Attribute name</p>
                                    <div className={`${flexColGap2}`}>
                                        <div className={`${fieldRoot}`}>
                                            <TextField className='!w-full p-1' placeholder='Enter Attribute name' name='name' handelState={handelOnChange} value={fields?.name} blur={handleSlugAuto} />
                                        </div>
                                        {fieldsErr.name ? <p className={`${errorCls}`}>{fieldsErr.name}</p> : null}
                                    </div>
                                </div>

                                {/* product Attribute slug */}
                                <div className={`${flexColItemStart}`}>
                                    <p className={`${fomtMPb2}`}>Product Attribute slug</p>
                                    <div className={`${flexColGap2}`}>
                                        <div className={`${fieldRoot}`}>
                                            <TextField className='!w-full p-1' placeholder='Enter Attribute slug' name='slug' handelState={handleSlug} value={fields?.slug} />
                                        </div>
                                        {fieldsErr.slug ? <p className={`${errorCls}`}>{fieldsErr.slug}</p> : null}
                                    </div>
                                </div>
                            </div>

                            {/* <div className='w-full'>
                            <DynamicForm handelSubmit={setFormdata} dynOb={dynamicCategoiFormObject} sendDataState={setDataSetCategory} />
                        </div> */}

                            {/* Enable Archives */}
                            {/* <div className='border border-solid border-gray-400'>
                                <div className='px-4 py-2'>Enable Archives?
                                    <Checkbox
                                        sx={{
                                            color: "#d8428c",
                                            '&.Mui-checked': {
                                                color: "#d8428c",
                                            },
                                        }}
                                        name='has_archives'
                                        onChange={handleCheckbox}
                                        checked={fields?.has_archives} />
                                </div>
                                
                            </div> */}

                            {/* product Attribute Term name */}
                            {/* {attributeDetails ? null : <div className='border border-solid border-gray-400'>
                                <p className='px-4 py-2'>Product Attribute Term name</p>
                                <hr />
                                <div className='p-4 flex flex-col gap-1 bg-offWhite-03'>
                                    <div className='w-full border border-solid border-offWhite-02'>
                                        <TextField className='!w-full p-1' placeholder='Enter Attribute Term name' name='termName' handelState={handelOnChange} value={fields?.termName} />
                                    </div>
                                    {fieldsErr.termName ? <p className={`${errorCls}`}>{fieldsErr.termName}</p> : null}
                                </div>
                            </div>} */}
                            <div className='flex items-center justify-end my-4'>
                                <PinkPawsbutton
                                    variant={"solid"}
                                    name={attributeDetails ? "Update Product Attribute" : "Add Product Attribute"}
                                    icon={""}
                                    handleClick={handleSubmit}
                                    pinkPawsButtonExtraCls={""}
                                    style={{}}
                                    disabled={false}
                                    title={""}
                                />
                            </div>
                        </div>
                        :
                        <div className='flex w-[100%] flex-col gap-2'>
                            <div className='flex items-center gap-4'>
                                {/*product terms name */}
                                <div className={`${flexColItemStart}`}>
                                    <p className={`${fomtMPb2}`}>Product terms name</p>
                                    <div className={`${flexColGap2}`}>
                                        <div className={`${fieldRoot}`}>
                                            <TextField className='!w-full p-1' placeholder='Enter terms name' name='name' handelState={handelOnChangeterms} blur={handleSlugTerm} value={fieldSetTerms?.name} />
                                        </div>
                                        <span style={{ color: "red" }}>{fieldsErrors?.name}</span>
                                    </div>
                                </div>

                                {/* product terms slug */}
                                <div className={`${flexColItemStart}`}>
                                    <p className={`${fomtMPb2}`}>Product terms slug</p>
                                    <div className={`${flexColGap2}`}>
                                        <div className={`${fieldRoot}`}>
                                            <TextField className='!w-full p-1' placeholder='Enter terms slug' name='slug' handelState={handleSlugterms} value={fieldSetTerms?.slug} blur={handleSlugTerm} />
                                        </div>
                                        <span style={{ color: "red" }}>{fieldsErrors?.slug}</span>
                                    </div>
                                </div>
                            </div>

                            {/*product terms description */}
                            <div className={`${flexColItemStart}`}>
                                <div className="flex items-center justify-between w-full">
                                    <div>
                                        <p className={`${fomtMPb2}`}>Product Attribute Terms Description</p>
                                    </div>
                                    {attributeDetails && attributeDetails?.name === "BRAND" &&
                                        <div className="flex items-center gap-1">
                                            <Checkbox className="p-0"
                                                name="show_home_page"
                                                checked={fieldSetTerms?.show_home_page === true}
                                                onChange={(e: any) => handelOnChangeterms(e, true)}
                                            />
                                            <p className="mr-2">Show On Homescreen ?</p>
                                        </div>}
                                </div>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        {/* <TextAreaField className='!w-full h-40 p-1' name='description' handelState={handelOnChangetermsDescription} value={fieldSetTerms?.description} placeholder='Enter terms description' /> */}
                                        <CkEditor
                                            value={fieldSetTerms?.description}
                                            handleChange={(e: any) => {
                                                setFieldSetTerms(pre => ({
                                                    ...pre,
                                                    description: e
                                                }));

                                                clearValidation('description');
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* product term image */}
                            <SimpleCard className='my-2' heading={<span className='font-medium'>Product Attribute terms Image</span>}>
                                <div className={`${flexColGap2}`}>
                                    <div className='w-full border border-solid border-offWhite-02'>

                                        <ImageUploader onImageChange={handleImage} imageWidth={`w-[40%]`} preImages={images} className={`imageDeopZone`} />
                                        {/* <input type='file' name='image' onChange={(e) => handleImage(e)} /> */}
                                    </div>
                                    <span style={{ color: "red" }}>{imageError}</span>
                                </div>
                            </SimpleCard>

                            <div className='flex items-center justify-end mb-2'>
                                <PinkPawsbutton
                                    variant={"solid"}
                                    name={fieldSetTerms?.product_attribute_id ? "Update Product Attribute Term" : "Add Product Attribute Term"}
                                    icon={""}
                                    handleClick={() => { fieldSetTerms?.product_attribute_id ? handleUpdateTerms() : handleAddTerms() }}
                                    pinkPawsButtonExtraCls={""}
                                    style={{}}
                                    disabled={false}
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
                                            handelState={(e: any) => setPageMetaInfo((pre) => ({
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
                                            handelState={(e: any) => setPageMetaInfo((pre) => ({
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
                                        handleClick={() => handleSubmitMeta({ meta_id: pageMetaInfo?.meta_id, product_attribute_term_id: fieldSetTerms?.product_attribute_term_id })}
                                    />
                                </div>
                            </SimpleCard>
                        </div>}
                </div>

            </RightSideModal>
        </div>
    )
}

export default AttributePage


