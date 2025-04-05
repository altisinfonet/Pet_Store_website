import React, { useEffect, useState } from 'react'
import SimpleCard from '../../../components/SimpleCard'
import { Autocomplete, Button, styled, TextField as MuiTextField, InputLabel, Checkbox } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageUploader from '../../../components/ImageUploader';
import PinkPawsbutton from '../../../components/PinkPawsbutton';
import axios from 'axios';
import getUrlWithKey from '../../../util/_apiUrl';
import { getAdminSetting, urlToBase64 } from '../../../util/_common';
import Image from 'next/image';
import TextField from '../../../components/TextField';
import TextAreaField from '../../../components/TextAreaField';
import { useRead, useUpdate } from '../../../../hooks';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { _get, _post } from '../../../services';
import { _SUCCESS } from '../../../util/_reactToast';
const field_text_Cls = `border border-gray-500 outline-none px-2 py-1 rounded`;

const HomePage = () => {

    const { update_home_banner, get_home_page, update_home_page, home_page_meta_update, get_page_meta } = getUrlWithKey("pages")
    const { get_product_attribute } = getUrlWithKey("product_attributes")
    const { get_product_category } = getUrlWithKey("products_categories")

    const popularBrandDataSet = {
        id: "",
        title: "",
        sub_title: "",
        description: "",
    }

    const popularBrandDataSetErr = {
        title: "",
        sub_title: "",
        description: "",
    }

    let dropZoneCls = "h-fit w-full border border-dashed border-color-pink-3 rounded"

    const imagesDataSet = { large_image_device: "", medium_image_device: "", small_image_device: "", }
    const metaUpdateData = {
        page_id: 6,
        title: "Home",
        // slug: "home",
        description: "home description",
        meta: []
    }

    const [getHomePage, setGetHomePage]: any = useState();
    const [getProd, setGetProd]: any = useState({ page: 1, rowsPerPage: 10 })
    const [popularBrandData, setPopularBrandData]: any = useState(popularBrandDataSet)
    const [moreCategoriesData, setMoreCategoriesData]: any = useState(popularBrandDataSet)
    const [recommendsData, setRecommendsData]: any = useState(popularBrandDataSet)
    const [features_sectionData, setFeatures_sectionData]: any = useState(popularBrandDataSet)
    const [diff_leases, setDiff_leases]: any = useState(popularBrandDataSet)
    const [product_ids, setProduct_ids]: any = useState([])
    const [category_ids, setCategory_ids]: any = useState([])
    const [popularBrandDataErr, setPopularBrandDataErr]: any = useState(popularBrandDataSetErr)
    const [moreCategoriesDataErr, setMoreCategoriesDataErr]: any = useState(popularBrandDataSetErr)
    const [recommendsDataErr, setRecommendsDataErr]: any = useState(popularBrandDataSetErr)
    const [features_sectionDataErr, setFeatures_sectionDataErr]: any = useState(popularBrandDataSetErr)
    const [diff_leasesErr, setDiff_leasesErr]: any = useState(popularBrandDataSetErr)
    const [meta, setMeta]: any = useState(metaUpdateData)
    const [metaUpdate, setMetaUpdate]: any = useState()
    const [getProductCategory, setGetProductCategory]: any = useState()
    const [getCategory, setGetCategory]: any = useState({ dropdown: true })
    const [checkcategory, setCheckcategory]: any = useState<any[]>([])
    const [category_idsExtend, setCategory_idsExtend]: any = useState([])
    const [pageMetaInfo, setPageMetaInfo] = useState({
        meta_title: "",
        meta_description: "",
        meta_key: ""
    });
    const [metaInfoMetaId, setMetaInfoMetaId] = useState("");




    const { sendData: getBrand }: any = useRead({ selectMethod: "put", url: get_product_attribute, callData: getProd });
    const { sendData: updatePage }: any = useUpdate({ selectMethod: "post", url: metaUpdate, callData: meta });
    const { sendData: category }: any = useRead({ selectMethod: "put", url: get_product_category, callData: getCategory });

    console.log(meta, "metametameta")
    console.log(updatePage, "updatePage")

    console.log(getBrand[0]?.options, "getBrandgetBrand")

    console.log(popularBrandData, moreCategoriesData, recommendsData, features_sectionData, "popularBrandDatamoreCategoriesDatarecommendsDatafeatures_sectionData")


    const getProductDetails = async () => {
        // setGetProductDetailsUrl(`${get_product_category_details}/${id}`)
        try {

            const { data } = await axios.get(get_home_page);
            // const { data }: any = useRead({ selectMethod: "get", url: `${get_product_category_details}/${id}` });

            console.log('data:: ', data);
            if (data?.success) {
                setGetHomePage(data?.data)

                const popular_brand = data?.data?.page_metas.filter((i: any) => i?.key === "popular_brand").map((v: any) => JSON.parse(v.value))
                const explore_categories = data?.data?.page_metas.filter((i: any) => i?.key === "explore_categories").map((v: any) => JSON.parse(v.value))
                const recommends = data?.data?.page_metas.filter((i: any) => i?.key === "recommends").map((v: any) => JSON.parse(v.value))
                const featureProductIds = data?.data?.features_section[0]?.products?.length && data?.data?.features_section[0]?.products?.map((v: any) => ({ id: v?.id }))
                const ProductCategoryIds = data?.data?.diff_leases[0]?.categories?.length && data?.data?.diff_leases[0]?.categories?.map((v: any) => ({ id: v?.id }))

                setPopularBrandData({ title: popular_brand[0]?.title, sub_title: popular_brand[0]?.sub_title, description: popular_brand[0]?.description })
                setMoreCategoriesData({ title: explore_categories[0]?.title, sub_title: explore_categories[0]?.sub_title, description: explore_categories[0]?.description })
                setRecommendsData({ title: recommends[0]?.title, sub_title: recommends[0]?.sub_title, description: recommends[0]?.description })
                setFeatures_sectionData({ id: data?.data?.features_section[0]?.id, title: data?.data?.features_section[0]?.title, sub_title: data?.data?.features_section[0]?.sub_title, description: data?.data?.features_section[0]?.description })
                setProduct_ids(featureProductIds)
                setDiff_leases({ id: data?.data?.diff_leases[0]?.id, title: data?.data?.diff_leases[0]?.title, sub_title: data?.data?.diff_leases[0]?.sub_title, description: data?.data?.diff_leases[0]?.description })
                setCategory_ids(ProductCategoryIds)
            }
        } catch (error: any) {
            console.log("error", error);
        }
    }

    // console.log(JSON.parse(getHomePage?.page_metas[0]?.value), "getHomePage")

    useEffect(() => {
        getProductDetails()
    }, [])

    const handleAutocompleteChange = (event: any, value: any) => {
        // 'value' is an array containing the selected option(s)
        // setSelectedValues(value);
        console.log(value, "valuevalue")
    };

    const handleChange = (key: string, value: any) => {
        setPopularBrandData((pre: any) => ({ ...pre, [key]: value }))
    }

    const handleChangeCategories = (key: string, value: any) => {
        setMoreCategoriesData((pre: any) => ({ ...pre, [key]: value }))
    }

    const handleChangeRecommends = (key: string, value: any) => {
        setRecommendsData((pre: any) => ({ ...pre, [key]: value }))
    }

    const handleChangefeatureSection = (key: string, value: any) => {
        setFeatures_sectionData((pre: any) => ({ ...pre, [key]: value }))
    }

    const handleChangediffLeasesSection = (key: string, value: any) => {
        setDiff_leases((pre: any) => ({ ...pre, [key]: value }))
    }

    const [metaData, setMetaData]: any = useState([]);
    const submitPopularBrand = async (key: any, dataId: number | string, id: number | string) => {
        let valid = true;

        if (dataId === 1) {
            if (popularBrandData?.title === "") {
                valid = false;
                setPopularBrandDataErr((pre: any) => ({ ...pre, title: "Title is requered" }))
            }

            if (popularBrandData?.sub_title === "") {
                valid = false;
                setPopularBrandDataErr((pre: any) => ({ ...pre, sub_title: "Sub title is requered" }))
            }
        }

        if (dataId === 2) {
            if (moreCategoriesData?.title === "") {
                valid = false;
                setMoreCategoriesDataErr((pre: any) => ({ ...pre, title: "Title is requered" }))
            }

            if (moreCategoriesData?.sub_title === "") {
                valid = false;
                setMoreCategoriesDataErr((pre: any) => ({ ...pre, sub_title: "Sub title is requered" }))
            }
        }

        if (dataId === 4) {
            if (recommendsData?.title === "") {
                valid = false;
                setRecommendsDataErr((pre: any) => ({ ...pre, title: "Title is requered" }))
            }

            if (recommendsData?.sub_title === "") {
                valid = false;
                setRecommendsDataErr((pre: any) => ({ ...pre, sub_title: "Sub title is requered" }))
            }
        }

        if (dataId === 5) {
            // if (features_sectionData?.title === "") {
            //     valid = false;
            //     setFeatures_sectionDataErr((pre: any) => ({ ...pre, title: "Title is requered" }))
            // }

            if (features_sectionData?.sub_title === "") {
                valid = false;
                setFeatures_sectionDataErr((pre: any) => ({ ...pre, sub_title: "Sub title is requered" }))
            }
        }

        if (dataId === 6) {

            if (diff_leases?.sub_title === "") {
                valid = false;
                setDiff_leasesErr((pre: any) => ({ ...pre, sub_title: "Sub title is requered" }))
            }
        }

        if (valid) {

            if (dataId === 1) {
                console.log(key, popularBrandData, "___<>")
                setMeta((pre: any) => ({
                    ...pre,
                    meta: [{
                        page_meta_id: id,
                        key: key,
                        value: {
                            title: popularBrandData?.title,
                            sub_title: popularBrandData?.sub_title,
                            description: popularBrandData?.description
                        }
                    }]
                }))
            }
            if (dataId === 2) {
                console.log(key, moreCategoriesData, "___<>")
                setMeta((pre: any) => ({
                    ...pre,
                    meta: [{
                        page_meta_id: id,
                        key: key,
                        value: {
                            title: moreCategoriesData?.title,
                            sub_title: moreCategoriesData?.sub_title,
                            description: moreCategoriesData?.description
                        }
                    }]
                }))
            }
            if (dataId === 4) {
                console.log(key, recommendsData, "___<>")
                setMeta((pre: any) => ({
                    ...pre,
                    meta: [{
                        page_meta_id: id,
                        key: key,
                        value: {
                            title: recommendsData?.title,
                            sub_title: recommendsData?.sub_title,
                            description: recommendsData?.description
                        }
                    }]
                }))
            }
            if (dataId === 5) {
                console.log(key, features_sectionData, "___<>")
                setMeta((pre: any) => ({
                    ...pre,
                    feature_section: {
                        feature_section_id: id,
                        title: features_sectionData?.title,
                        sub_title: features_sectionData?.sub_title,
                        description: features_sectionData?.description,
                        product_ids: product_ids
                    }
                }))
            }
            if (dataId === 6) {
                console.log(key, diff_leases, "___<>")
                setMeta((pre: any) => ({
                    ...pre,
                    diff_lease: {
                        diff_lease_id: id,
                        title: diff_leases?.title,
                        sub_title: diff_leases?.sub_title,
                        description: diff_leases?.description,
                        category_ids: category_idsExtend
                    }
                }))
            }
            setMetaUpdate(update_home_page)
        }
    }

    useEffect(() => {
        if (metaUpdate) {
            setMetaUpdate()
        }
        if (updatePage?.id) {
            getProductDetails()
        }
    }, [updatePage, metaUpdate])

    // useEffect(() => {
    //     if (metaUpdate) {
    //         getProductDetails()
    //         setMetaUpdate()
    //     }
    // }, [updatePage, metaUpdate])

    console.log(metaData, "metaData")

    console.log(popularBrandData, "popularBrandData")

    // const aaa = getHomePage?.page_metas.filter((i: any) => i?.key === "explore_categories").map((v: any) => JSON.parse(v.value))

    console.log(getHomePage, "getHomePage")

    useEffect(() => {
        if (!category?.length) {
            setGetCategory({ page: 1, rowsPerPage: 10, dropdown: true })
        }
        setGetProductCategory(category)
    }, [category])

    const handelCategoryCheckBox = (e: any, v: any) => {
        const arr = [...checkcategory];
        if (e?.target?.checked) {
            arr.push(v);
            setCheckcategory(arr);
        } else {
            setCheckcategory(arr.filter((item: any) => item !== v))
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

    const [homeMetaId, setHomeMetaId]: any = useState<string>("")

    const getHomeMeta = async () => {
        const { data } = await _get(`${get_page_meta}/home`)
        if (data?.success) {
            if (data?.data?.meta_data) {
                setPageMetaInfo(JSON.parse(data?.data?.meta_data))
            }
            setHomeMetaId(data?.data?.meta_id)
        }
        console.log(data, "data")
    }
    useEffect(() => {
        getHomeMeta();
    }, [])


    const createUpdateHomeMeta = async (id?: any) => {
        try {
            if (id) {
                const { data } = await _post(home_page_meta_update, { value: pageMetaInfo, page_id: getHomePage?.id, key: "_meta_info", page_meta_id: id })
                console.log(data, "___data")
                if (data?.success) {
                    _SUCCESS("Home Page Meta Updated Successfully")
                }
                getHomeMeta();
            } else {
                const { data } = await _post(home_page_meta_update, { value: pageMetaInfo, page_id: getHomePage?.id, key: "_meta_info" })
                console.log(data, "___data")
                if (data?.success) {
                    _SUCCESS("Home Page Meta Add Successfully")
                }
                getHomeMeta();
            }

        } catch (error) {
            console.log(error, "__error")
        }
    }

    useEffect(() => {
        let arr = []
        if (category_ids?.length) {
            arr = category_ids.map((v: any) => v?.id)
            setCheckcategory(arr)
        }
    }, [category_ids])

    useEffect(() => {
        let extendCategory: any = checkcategory?.length ? checkcategory.map((v: any) => ({ id: v })) : [];
        setCategory_idsExtend(extendCategory)
    }, [checkcategory?.length])
    console.log(category_idsExtend, "checkcategory")

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

    return (
        <div className='flex flex-col gap-4'>
            {getHomePage?.page_metas.length && getHomePage?.page_metas.map((i: any, e: number) => {
                return (
                    <div key={e}>
                        {i?.key === "popular_brand" ?
                            <SimpleCard heading={<div className={`w-full flex items-center justify-between`}><p>Popular brand</p><ArrowDropDownIcon /></div>} childrenClassName='flex flex-col gap-3' >
                                <div className='flex gap-4 w-full'>
                                    <div className='flex w-full flex-col gap-1'>
                                        <TextField
                                            name='title'
                                            label='Title*'
                                            placeholder='Enter title'
                                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                                            value={popularBrandData?.title && popularBrandData?.title}
                                            handelState={(e: any) => handleChange(e.target.name, e.target.value)}
                                            helperText={popularBrandData?.title ? "" : popularBrandDataErr.title}
                                        // isError={popularBrandData?.title ? false : popularBrandDataErr.title ? true : false}
                                        />
                                    </div>
                                    <div className='flex w-full flex-col gap-1'>
                                        <TextField
                                            name='sub_title'
                                            label='Subtitle*'
                                            placeholder='Enter subtitle'
                                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                                            value={popularBrandData?.sub_title && popularBrandData?.sub_title}
                                            handelState={(e: any) => handleChange(e.target.name, e.target.value)}
                                            helperText={popularBrandData?.sub_title ? "" : popularBrandDataErr.sub_title}
                                        // isError={popularBrandData?.sub_title ? false : popularBrandDataErr.sub_t ? true : false}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4 w-full'>
                                    <div className='flex w-full flex-col gap-1'>
                                        <TextAreaField
                                            name='description'
                                            label='Description'
                                            placeholder='Enter description'
                                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                                            value={popularBrandData?.description && popularBrandData?.description}
                                            handelState={(e: any) => handleChange(e.target.name, e.target.value)}
                                        />
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <PinkPawsbutton name='Save' handleClick={() => submitPopularBrand("popular_brand", 1, i?.id)} />
                                    </div>
                                    {/* <div className='flex w-full flex-col gap-1'>
                        <InputLabel className={"text-sm font-medium text-black"}>Brands</InputLabel>
                        <Autocomplete
                            multiple
                            id="tags"
                            options={getBrand?.length && getBrand[0]?.options}
                            getOptionLabel={(option) => option.name}
                            filterSelectedOptions
                            className='atocompleteCls w-full'
                            onChange={handleAutocompleteChange}
                            renderInput={(params) => (<MuiTextField {...params} placeholder='add Brands' className='border border-solid border-color-pink-3 rounded' />)}
                        />
                    </div> */}
                                </div>
                            </SimpleCard>
                            : null}

                        {i?.key === "explore_categories" ?
                            <SimpleCard heading={<div className={`w-full flex items-center justify-between`}><p>Explore More Categories</p><ArrowDropDownIcon /></div>} childrenClassName='flex flex-col gap-3' >
                                <div className='flex gap-4 w-full'>
                                    <div className='flex w-full flex-col gap-1'>
                                        <TextField
                                            name='title'
                                            label='Title*'
                                            placeholder='Enter title'
                                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                                            value={moreCategoriesData?.title && moreCategoriesData?.title}
                                            handelState={(e: any) => handleChangeCategories(e.target.name, e.target.value)}
                                            helperText={moreCategoriesData?.title ? "" : moreCategoriesDataErr.title}
                                        // isError={moreCategoriesData?.title ? false : moreCategoriesDataErr.title ? true : false}
                                        />
                                    </div>
                                    <div className='flex w-full flex-col gap-1'>
                                        <TextField
                                            name='sub_title'
                                            label='Subtitle*'
                                            placeholder='Enter subtitle'
                                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                                            value={moreCategoriesData?.sub_title && moreCategoriesData?.sub_title}
                                            handelState={(e: any) => handleChangeCategories(e.target.name, e.target.value)}
                                            helperText={moreCategoriesData?.sub_title ? "" : moreCategoriesDataErr.sub_title}
                                        // isError={moreCategoriesData?.sub_title ? false : moreCategoriesDataErr.sub_t ? true : false}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4 w-full'>
                                    <div className='flex w-full flex-col gap-1'>
                                        <TextAreaField
                                            name='description'
                                            label='Description'
                                            placeholder='Enter description'
                                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                                            value={moreCategoriesData?.description && moreCategoriesData?.description}
                                            handelState={(e: any) => handleChangeCategories(e.target.name, e.target.value)}
                                        />
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <PinkPawsbutton name='Save' handleClick={() => submitPopularBrand("explore_categories", 2, i?.id)} />
                                    </div>
                                </div>
                            </SimpleCard>
                            : null}

                        {/* <SimpleCard heading={<div className={`w-full flex items-center justify-between`}><p>Feature Section</p><ArrowDropDownIcon /></div>} childrenClassName='flex flex-col gap-3' >
                <div className='flex gap-4 w-full'>
                    <div className='flex w-full flex-col gap-1'>
                        <TextField
                            name='title'
                            label='Title*'
                            placeholder='Enter title'
                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                            handelState={(e: any) => handleChange(e.target.name, e.target.value)}
                            helperText={popularBrandData?.title ? "" : popularBrandDataErr.title}
                        // isError={popularBrandData?.title ? false : popularBrandDataErr.title ? true : false}
                        />
                    </div>
                    <div className='flex w-full flex-col gap-1'>
                        <TextField
                            name='sub_title'
                            label='Subtitle*'
                            placeholder='Enter subtitle'
                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                            handelState={(e: any) => handleChange(e.target.name, e.target.value)}
                            helperText={popularBrandData?.sub_title ? "" : popularBrandDataErr.sub_title}
                        // isError={popularBrandData?.sub_title ? false : popularBrandDataErr.sub_t ? true : false}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-4 w-full'>
                    <div className='flex w-full flex-col gap-1'>
                        <TextAreaField
                            name='description'
                            label='Description'
                            placeholder='Enter description'
                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                            handelState={(e: any) => handleChange(e.target.name, e.target.value)}
                        />
                    </div>
                    <div className='w-full flex justify-end'>
                        <PinkPawsbutton name='Save' handleClick={() => submitPopularBrand("")} />
                    </div>
                </div>
            </SimpleCard> */}

                        {i?.key === "recommends" ?
                            <SimpleCard heading={<div className={`w-full flex items-center justify-between`}><p>Recommends</p><ArrowDropDownIcon /></div>} childrenClassName='flex flex-col gap-3' >
                                <div className='flex gap-4 w-full'>
                                    <div className='flex w-full flex-col gap-1'>
                                        <TextField
                                            name='title'
                                            label='Title*'
                                            placeholder='Enter title'
                                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                                            value={recommendsData?.title && recommendsData?.title}
                                            handelState={(e: any) => handleChangeRecommends(e.target.name, e.target.value)}
                                            helperText={recommendsData?.title ? "" : recommendsDataErr.title}
                                        // isError={recommendsData?.title ? false : recommendsDataErr.title ? true : false}
                                        />
                                    </div>
                                    <div className='flex w-full flex-col gap-1'>
                                        <TextField
                                            name='sub_title'
                                            label='Subtitle*'
                                            placeholder='Enter subtitle'
                                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                                            value={recommendsData?.sub_title && recommendsData?.sub_title}
                                            handelState={(e: any) => handleChangeRecommends(e.target.name, e.target.value)}
                                            helperText={recommendsData?.sub_title ? "" : recommendsDataErr.sub_title}
                                        // isError={recommendsData?.sub_title ? false : recommendsDataErr.sub_t ? true : false}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4 w-full'>
                                    <div className='flex w-full flex-col gap-1'>
                                        <TextAreaField
                                            name='description'
                                            label='Description'
                                            placeholder='Enter description'
                                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                                            value={recommendsData?.description && recommendsData?.description}
                                            handelState={(e: any) => handleChangeRecommends(e.target.name, e.target.value)}
                                        />
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <PinkPawsbutton name='Save' handleClick={() => submitPopularBrand("recommends", 4, i?.id)} />
                                    </div>
                                </div>
                            </SimpleCard>
                            : null}

                    </div>)
            })}

            {features_sectionData?.id ? <SimpleCard heading={<div className={`w-full flex items-center justify-between`}><p>Feature section</p><ArrowDropDownIcon /></div>} childrenClassName='flex flex-col gap-3' >
                <div className='flex gap-4 w-full'>
                    <div className='flex w-full flex-col gap-1'>
                        <TextField
                            name='title'
                            label='Title'
                            placeholder='Enter title'
                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                            value={features_sectionData?.title && features_sectionData?.title}
                            handelState={(e: any) => handleChangefeatureSection(e.target.name, e.target.value)}
                            helperText={features_sectionData?.title ? "" : features_sectionDataErr.title}
                        // isError={recommendsData?.title ? false : features_sectionDataErr.title ? true : false}
                        />
                    </div>
                    <div className='flex w-full flex-col gap-1'>
                        <TextField
                            name='sub_title'
                            label='Subtitle*'
                            placeholder='Enter subtitle'
                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                            value={features_sectionData?.sub_title && features_sectionData?.sub_title}
                            handelState={(e: any) => handleChangefeatureSection(e.target.name, e.target.value)}
                            helperText={features_sectionData?.sub_title ? "" : features_sectionDataErr.sub_title}
                        // isError={features_sectionData?.sub_title ? false : features_sectionDataErr.sub_t ? true : false}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-4 w-full'>
                    <div className='flex w-full flex-col gap-1'>
                        <TextAreaField
                            name='description'
                            label='Description'
                            placeholder='Enter description'
                            className='w-full border border-solid border-color-pink-3 rounded p-2'
                            value={features_sectionData?.description && features_sectionData?.description}
                            handelState={(e: any) => handleChangefeatureSection(e.target.name, e.target.value)}
                        />
                    </div>
                    <div className='w-full flex justify-end'>
                        <PinkPawsbutton name='Save' handleClick={() => submitPopularBrand("feature_section", 5, features_sectionData?.id)} />
                    </div>
                </div>
            </SimpleCard> : null}

            {diff_leases?.id ?
                <SimpleCard heading={<div className={`w-full flex items-center justify-between`}><p>Diff leases</p><ArrowDropDownIcon /></div>} childrenClassName='flex flex-col gap-3' >
                    <div className='flex gap-4 w-full'>
                        <div className='flex w-full flex-col gap-1'>
                            <TextField
                                name='title'
                                label='Title'
                                placeholder='Enter title'
                                className='w-full border border-solid border-color-pink-3 rounded p-2'
                                value={diff_leases?.title && diff_leases?.title}
                                handelState={(e: any) => handleChangediffLeasesSection(e.target.name, e.target.value)}
                                helperText={diff_leases?.title ? "" : diff_leasesErr.title}
                            // isError={recommendsData?.title ? false : diff_leasesErr.title ? true : false}
                            />
                        </div>
                        <div className='flex w-full flex-col gap-1'>
                            <TextField
                                name='sub_title'
                                label='Subtitle*'
                                placeholder='Enter subtitle'
                                className='w-full border border-solid border-color-pink-3 rounded p-2'
                                value={diff_leases?.sub_title && diff_leases?.sub_title}
                                handelState={(e: any) => handleChangediffLeasesSection(e.target.name, e.target.value)}
                                helperText={diff_leases?.sub_title ? "" : diff_leasesErr.sub_title}
                            // isError={diff_leases?.sub_title ? false : diff_leasesErr.sub_t ? true : false}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 w-full'>
                        <div className='flex w-full flex-col gap-1'>
                            <TextAreaField
                                name='description'
                                label='Description'
                                placeholder='Enter description'
                                className='w-full border border-solid border-color-pink-3 rounded p-2'
                                value={diff_leases?.description && diff_leases?.description}
                                handelState={(e: any) => handleChangediffLeasesSection(e.target.name, e.target.value)}
                            />
                        </div>
                        <SimpleCard heading={<span className='font-medium'>Product categories</span>}>
                            <div className='flex items-end flex-col gap-2 '>
                                <div className="flex flex-col h-60 overflow-y-auto border border-solid border-slate-400 p-2 w-full">
                                    <Productcategories dynArr={getProductCategory} />
                                </div>
                            </div>
                        </SimpleCard>
                        <div className='w-full flex justify-end'>
                            <PinkPawsbutton name='Save' handleClick={() => submitPopularBrand("diff_leases", 6, diff_leases?.id)} />
                        </div>
                    </div>
                </SimpleCard> : null}

            <SimpleCard
                childrenClassName={`flex flex-col items-center justify-center gap-2 !p-4`}
                headingClassName='!bg-white'
                heading={
                    <div className='flex items-center w-full gap-4'>
                        <span className='font-medium'>Meta Information</span>
                        <hr className='border-l border-solid h-6' />
                        <div className='flex items-center'>
                            <Checkbox className='!pr-2 !py-1 !p-0' onChange={handelDefaultMeta} />
                            <p className=''> Use Default Meta Information?</p>
                        </div>
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
                <div className='w-full flex justify-end'>
                    <PinkPawsbutton name='Save' handleClick={() => createUpdateHomeMeta(homeMetaId)} />
                </div>
            </SimpleCard>

        </div>
    )
}

export default HomePage