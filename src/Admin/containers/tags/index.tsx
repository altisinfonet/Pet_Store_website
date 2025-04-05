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
import { getAdminSetting, isEmptyObject } from '../../util/_common'
import { _ERROR, _SUCCESS } from '../../util/_reactToast'
import RightSideModal from '../../components/RightSideModal'
import SearchAndAddNewComponent from '../../components/searchAddNewComponent'
import CkEditor from '../../components/CkEditor'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SimpleCard from '../../components/SimpleCard'
import useMeta from '../../hooks/useMeta'
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

const TagPage = () => {
    const defaultFieldSet = {
        name: "",
        slug: "",
        description: "",
        product_tag_id: null
    }

    const [actionValue, setActionValue] = useState("delete")
    const [pageNo, setPageNo] = useState(1)
    const [prodCheck, setProdCheck]: any = useState({})
    const [acordian, setAcordian]: any = useState()
    const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
    const [openFullModal, setOpenFullModal] = useState(false)
    const [dataSetCategory, setDataSetCategory] = useState()
    const [tagDetails, setTagDetails]: any = useState()
    const [fields, setFields] = useState(defaultFieldSet);
    const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());
    const [image, setImage] = useState([]);
    const [formdata, setFormdata] = useState({});
    const [checked, setChecked] = useState<any[]>([]);
    const [totalGetData, setTotalGetData] = useState("totalItem");
    const [totalTagGetUrl, setTotalTagGetUrl] = useState("");
    const [totalpageNo, setTotalPageNo]: any = useState();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [confirmStatus, setConfirmStatus]: any = useState("");
    const [pageMetaInfo, setPageMetaInfo]: any = useState({
        meta_title: "",
        meta_description: "",
        meta_key: ""
    });



    useEffect(() => {
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo]);


    const { sendData: totalTagsView }: any = useRead({ selectMethod: "get", url: totalTagGetUrl });

    const { create_product_tag, get_product_tag, get_product_tag_id, update_product_tag, delete_multiple_product_tag, total_items_tag } = getUrlWithKey("product_tags");
    const { create_meta, update_meta, get_slug_by_meta } = getUrlWithKey("pages");

    const { sendData: getProductTag }: any = useRead({ selectMethod: "put", url: get_product_tag, callData: getProd });

    const flexColItemStart = `flex flex-col items-start w-full`
    const fomtMPb2 = `font-medium pb-2`
    const flexColGap2 = `flex flex-col gap-2 w-full`
    const fieldRoot = `w-full border border-solid border-gray-400`


    useEffect(() => {
        setTotalTagGetUrl(total_items_tag);
    }, []);

    useEffect(() => {
        if (totalTagsView?.totalItem) {
            setTotalTagGetUrl("");
        }
    }, [totalTagsView])

    const getTotalPage = (): number => {
        if (totalTagsView?.totalPage && totalTagsView?.totalPage !== 0) {
            return totalTagsView?.totalPage;
        } else if (totalTagsView?.totalPage === 0) {
            return 1;
        } else {
            return 0;
        }
    }

    const { tabView } = useTabView()

    useEffect(() => {
        if (totalGetData === "totalPublished") {
            let page = totalTagsView?.totalPublished < 10 ? 1 : Math.ceil((totalTagsView?.totalPublished / 10))
            setTotalPageNo(page)
        } else if (totalGetData === "totalDraft") {
            let page = totalTagsView?.totalDraft < 10 ? 1 : Math.ceil((totalTagsView?.totalDraft / 10))
            setTotalPageNo(page)
        } else if (totalGetData === "totalTrash") {
            let page = totalTagsView?.totalDraft < 10 ? 1 : Math.ceil((totalTagsView?.totalDraft / 10))
            setTotalPageNo(page)
        } else {
            setTotalPageNo()
        }
    }, [totalGetData])

    const addNewProduct = () => {
        setFieldsErrors({});
        setButtonDisabled(false);
        setFields(defaultFieldSet);
        setTagDetails(undefined);
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
            valid = validation(fields, ["name", "slug", "description"]);

            if (valid) {
                if (fields && fields?.product_tag_id) {
                    const { data } = await axios.post(`${update_product_tag}`, { ...fields, slug: stringToSlug(fields['slug']) });

                    if (data?.success) {
                        _SUCCESS(data?.massage);
                        setFields(defaultFieldSet);
                        setButtonDisabled(false);
                        setOpenFullModal(false);
                        setGetProd({ page: pageNo, rowsPerPage: 10 })
                        // setPageNo(1)
                        setTotalTagGetUrl(total_items_tag);
                    }
                } else {
                    const { data } = await axios.post(`${create_product_tag}`, fields);

                    if (data?.success) {
                        _SUCCESS(data?.massage);
                        setFields(defaultFieldSet);
                        setButtonDisabled(false);
                        setOpenFullModal(false);
                        // setPageNo(1)
                        setGetProd({ page: pageNo, rowsPerPage: 10 })
                        setTotalTagGetUrl(total_items_tag);
                        handleSubmitMeta({ id: data?.data?.id })
                    }
                }
            } else {
                setButtonDisabled(false);
            }
        } catch (error: any) {
            _ERROR(error?.response?.data?.massage);
            setButtonDisabled(false);
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
        if (actionValue === 'delete' && checked?.length) {
            const { data } = await axios.post(`${delete_multiple_product_tag}`, { product_tag_ids: checked });
            if (data?.success) {
                _SUCCESS(data?.massage);
                setFields(defaultFieldSet);
                setPageNo(1);
                setGetProd({ page: pageNo, rowsPerPage: 10 })
                setActionValue("delete");
                setChecked([]);
                setTotalTagGetUrl(total_items_tag);
            }
        }
    }


    const handleApplyDelete = async (delId: any) => {

        const { data } = await axios.post(`${delete_multiple_product_tag}`, { product_tag_ids: [delId] });
        if (data?.success) {
            _SUCCESS(data?.massage);
            // setFields(defaultFieldSet);
            setPageNo(pageNo);
            setGetProd({ page: pageNo, rowsPerPage: 10 })
            setActionValue("delete");
            setChecked([]);
            setTotalTagGetUrl(total_items_tag);
            setConfirmStatus("");
        }
    }

    const getTagDetails = async (id: any) => {
        try {
            setButtonDisabled(false);
            setFieldsErrors({});
            const { data } = await axios.get(`${get_product_tag_id}/${id}`);
            if (data?.success) {
                setTagDetails(data?.data);
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

    const actionArray = [
        // { value: "bulkAction", name: "Bulk action" },
        { value: "delete", name: "Delete" },
    ]

    const header = [
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
        // setDoTrashProd(delete_product);
    }

    const onHandleAcordian = (id: number | string) => {
        if (id === acordian) {
            setAcordian(null)
        } else {
            setAcordian(id as number)
        }
    }

    const handelAllChecked = (e: any) => {
        if (e?.target?.checked && getProductTag && getProductTag?.length) {
            const arr = [];
            for (let g = 0; g < getProductTag.length; g++) {
                if (getProductTag[g] && getProductTag[g]?.id) {
                    arr.push(getProductTag[g]?.id);
                }
            }
            setChecked(arr);
        } else {
            setChecked([]);
        }
    }


    useEffect(() => {
        if (tagDetails !== null && tagDetails?.id) {

            const data = {
                name: tagDetails?.name,
                description: tagDetails?.description,
                slug: tagDetails?.slug,
                product_tag_id: tagDetails?.id
            }

            setFields({ ...fields, ...data });
        }
    }, [tagDetails]);


    const searchRes = (value: any) => {
        if (value) {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10, search: value });
            setTotalTagGetUrl(`${total_items_tag}/${value}`);
        } else {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10 });
            setTotalTagGetUrl(total_items_tag);
        }
    }

    const getMetaData = async () => {
        try {
            const { data }: any = await _put(get_slug_by_meta, { table_name: "productTags", table_slug: tagDetails?.slug });
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
    }, [tagDetails?.id])

    const handleSubmitMeta = async ({ meta_id, id }: any) => {
        try {
            if (id) {
                if (meta_id) {
                    const { data }: any = await _post(update_meta, {
                        table_id: id,
                        table_name: "productTags",
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
                        table_name: "productTags",
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
            setTagDetails();
            setPageMetaInfo({
                meta_title: "",
                meta_description: "",
                meta_key: ""
            });
        }
    }, [openFullModal])

    return (
        <div className='w-full flex flex-col items-start justify-center gap-4'>
            <SearchAndAddNewComponent buttonTxt={'Search Product Tags'} addNewProduct={addNewProduct} name={'Add Product Tags'} res={searchRes} />
            <div className='flex w-full flex-wrap gap-2 items-center justify-between'>
                <ActionDrop
                    btnValue="Apply"
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    handleClick={() => handelApply()}
                    disabled={checked.length ? false : true}
                // handleClick={() => actionValue === "restore" && handleToggle()}
                />
                {/* <PinkPawsbutton
                    variant={"solid"}
                    name={"Add Tags"}
                    icon={""}
                    handleClick={addNewProduct}
                    pinkPawsButtonExtraCls={""}
                    style={{}}
                    disabled={false}
                    title={""}
                /> */}
                {/* <Pageination
                    items={totalGetData === "totalItem" ? totalTagsView?.totalItem : 0 || totalGetData === "totalPublished" ? totalTagsView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalTagsView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalTagsView?.totalTrash : 0}
                    value={pageNo}
                    totalpageNo={totalpageNo ? totalpageNo : totalTagsView?.totalPage}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : pageNo - 1)}
                    handleChange={(e: any) => setPageNo(e.target.value > 999 ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo > 999 ? 1 : pageNo + 1)}
                    handleClickLast={() => setPageNo(totalpageNo ? totalpageNo : totalTagsView?.totalPage)}
                /> */}

                <Pageination
                    items={totalTagsView?.totalItem}
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
                (getProductTag?.length ?
                    <Table className='lg:table hidden table-auto w-full productTableCls !border !border-solid'>
                        <TableHead>
                            <TableRow
                                hover
                                role="checkbox"
                                className='bg-slate-200 hover:!bg-slate-200'
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} size="small" checked={checked?.length === getProductTag?.length ? true : false} />
                                </TableCell>
                                {header.map((col, index) =>
                                    <TableCell className='!font-semibold' key={index}>{col.field}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getProductTag?.map((row: any, index: number) => {
                                console.log("getProductTag", getProductTag);
                                return (
                                    <StyledTableRow
                                        hover
                                        key={index}
                                        sx={{ cursor: 'pointer' }}
                                        className='hover:!bg-[#6d8ad70f]'
                                    >
                                        <StyledTableCell className='!w-[3%]' padding="checkbox">
                                            <Checkbox
                                                // checked={prodCheck?.product_id === row?.id ? true : false} 
                                                checked={checked.includes(row?.id)}
                                                // onClick={() => prodCheck?.product_id !== row?.id ? setProdCheck({ product_id: row?.id }) : setProdCheck({})}
                                                onClick={(e) => handelTableCheckBox(e, row?.id)}
                                                size="small"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell className='!w-[30%]' onClick={() => { getTagDetails(row?.id) }}>{row?.name ? row?.name : "--"}</StyledTableCell>
                                        <StyledTableCell className='!w-[30%]' onClick={() => { getTagDetails(row?.id) }}>{row?.description ? row?.description : "--"}</StyledTableCell>
                                        <StyledTableCell className='!w-[8%]' onClick={() => { getTagDetails(row?.id) }}>{row?.slug ? row?.slug : "--"}</StyledTableCell>
                                        <StyledTableCell className='!w-[7%]' onClick={() => { getTagDetails(row?.id) }}>{row?._count?.products ? row?._count?.products : "--"}</StyledTableCell>
                                        <StyledTableCell className='!w-[5%]'>
                                            <div className='flex flex-row gap-2'>
                                                <EditIcon className='w-6 h-6 text-linkBlue-01 cursor-pointer' onClick={() => { getTagDetails(row?.id) }} />
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
                                {getProductTag.length ? getProductTag.map((row: any, index: number) => {
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
                                                    <span className="text-cyan-700" onClick={() => { getTagDetails(row?.id) }}>Edit</span> |
                                                    <span className="text-cyan-700" onClick={() => { getTagDetails(row?.id) }}>Quick&nbsp;Edit</span> |
                                                    <span className="text-red-600">Delete</span> |
                                                    <span className="text-cyan-700" onClick={() => { getTagDetails(row?.id) }}>View</span> |
                                                    <span className="text-cyan-700">Make default</span>
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
                // handleClick={() => actionValue === "restore" && handleToggle()}
                />
                {/* <PinkPawsbutton
                    variant={"solid"}
                    name={"Add Tags"}
                    icon={""}
                    handleClick={addNewProduct}
                    pinkPawsButtonExtraCls={""}
                    style={{}}
                    disabled={false}
                    title={""}
                /> */}
                {/* <Pageination
                    items={totalGetData === "totalItem" ? totalTagsView?.totalItem : 0 || totalGetData === "totalPublished" ? totalTagsView?.totalPublished : 0 || totalGetData === "totalDraft" ? totalTagsView?.totalDraft : 0 || totalGetData === "totalTrash" ? totalTagsView?.totalTrash : 0}
                    value={pageNo}
                    totalpageNo={totalpageNo ? totalpageNo : totalTagsView?.totalPage}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo <= 1 ? 1 : pageNo - 1)}
                    handleChange={(e: any) => setPageNo(e.target.value > 999 ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo > 999 ? 1 : pageNo + 1)}
                    handleClickLast={() => setPageNo(totalpageNo ? totalpageNo : totalTagsView?.totalPage)}
                /> */}

                <Pageination
                    items={totalTagsView?.totalItem}
                    value={pageNo}
                    totalpageNo={getTotalPage()}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo === 1 ? 1 : (pageNo - 1))}
                    handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
                    handleClickLast={() => setPageNo(getTotalPage())}
                />
            </div>

            <RightSideModal modalStat={openFullModal} handleClose={() => setOpenFullModal(false)} heading={(tagDetails != undefined && tagDetails != '') ? 'Update Product Tag' : 'Add Product Tag'}>
                <div className=' flex items-start gap-2.5'>
                    <div className='flex w-[100%] flex-col gap-2'>
                        <div className='flex items-start gap-4'>
                            {/* product category name */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Product tag name</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' placeholder='Enter category name' name='name' handelState={handelOnChange} blur={handleSlug} value={fields?.name} />
                                    </div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.name}</span>
                                </div>
                            </div>

                            {/* product category slug */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Product tag slug</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' placeholder='Enter category slug' name='slug' handelState={handelOnChange} blur={handleSlug} value={fields?.slug} />
                                    </div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.slug}</span>
                                </div>
                            </div>
                        </div>

                        {/* <div className='w-full'>
                            <DynamicForm handelSubmit={setFormdata} dynOb={dynamicCategoiFormObject} sendDataState={setDataSetCategory} />
                        </div> */}

                        {/* product description */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Product Tag Description</p>
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
                                <span style={{ color: "red" }}>{fieldsErrors?.description}</span>
                            </div>
                        </div>

                        <div className='flex items-center justify-end mb-4'>
                            <PinkPawsbutton
                                variant={"solid"}
                                name={(tagDetails != undefined && tagDetails != '') ? "Update Product Tag" : "Add Product Tag"}
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

                        <div className='flex items-center justify-end mt-4'>
                            <PinkPawsbutton
                                variant={"solid"}
                                name={"Update Meta Information"}
                                handleClick={() => handleSubmitMeta({ meta_id: pageMetaInfo?.meta_id, id: tagDetails?.id })}
                            />
                        </div>
                    </div>
                </SimpleCard>

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

export default TagPage