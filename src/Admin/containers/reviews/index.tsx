import React, { useEffect, useState } from 'react'
import ActionDrop from '../../components/ActionDrop'
import Pageination from '../../components/Pageination'
import useTabView from '../../../hooks/useTabView'
import { Autocomplete, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField as MuiTextField, Tooltip, RadioGroup, Radio, Dialog, DialogContent, styled, tableCellClasses, Button, Select, MenuItem } from '@mui/material';
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
import { isEmptyObject, searchIdPatternRegex } from '../../util/_common'
import { _ERROR, _SUCCESS } from '../../util/_reactToast'
import RightSideModal from '../../components/RightSideModal'
import SearchAndAddNewComponent from '../../components/searchAddNewComponent'
import { useSearchParams } from 'next/navigation'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SelectField from '../../components/SelectField';
import { _put } from '../../services';

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

const ReviewPage = () => {
    const searchParams = useSearchParams()
    const search = searchParams.get('search');



    const defaultFieldSet = {
        name: "",
        slug: "",
        description: "",
        product_tag_id: null
    }

    const [actionValue, setActionValue] = useState("bulkAction")
    const [productReviewValue, setProductReviewValue] = useState("ALL")
    const [actionValue2, setActionValue2] = useState<any>();
    const [pageNo, setPageNo] = useState(1)
    const [prodCheck, setProdCheck]: any = useState({})
    const [acordian, setAcordian]: any = useState()
    const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10, filter: "ALL", search: "" })
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
    const [initial, setInitial] = useState(true);
    const [confirmStatus, setConfirmStatus]: any = useState("")

    console.log("pageNo", pageNo);

    useEffect(() => {
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo]);

    const { sendData: totalTagsView }: any = useRead({ selectMethod: "get", url: totalTagGetUrl });

    const { create_product_tag, get_product_tag_id, update_product_tag, multi_delete_review, total_items_review, getAllUserReview, updateReviewUrl, multi_status_update } = getUrlWithKey("users");
    const { sendData: getUserReview }: any = useRead({ selectMethod: "put", url: getAllUserReview, callData: getProd });
    const [getStatusReview, setGetStatusReview]: any = useState()

    const getReview = getStatusReview || getUserReview

    console.log(getReview, "6d5hfg41hfg5")
    useEffect(() => {
        setTotalTagGetUrl(total_items_review);
    }, []);

    useEffect(() => {
        if (totalTagsView?.totalItem) {
            setTotalTagGetUrl("");
        }
    }, [totalTagsView])

    const getTotalPage = (): number => {
        console.log("list?.totalPage", totalTagsView?.totalPage)
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
        if (initial) {
            console.log("initial", initial)
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
            setInitial(false);
        }
    }, [totalGetData, initial])

    const addNewProduct = () => {
        setFieldsErrors({});
        setButtonDisabled(false);
        setFields(defaultFieldSet);
        setTagDetails(undefined);
        setOpenFullModal(true);
    }

    const handelOnChange = (e: any) => {
        // console.log('llg: ', e.target.checked);
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
                        setTotalTagGetUrl(total_items_review);
                    }
                } else {
                    const { data } = await axios.post(`${create_product_tag}`, fields);

                    if (data?.success) {
                        _SUCCESS(data?.massage);
                        setFields(defaultFieldSet);
                        setButtonDisabled(false);
                        setOpenFullModal(false);
                        setTotalTagGetUrl(total_items_review);
                    }
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

    const handelTableCheckBox = (e: any, v: any) => {
        const arr = [...checked];
        if (e?.target?.checked) {
            arr.push(+v);
            setChecked(arr);
        } else {
            setChecked(arr.filter((item: any) => item !== +v))
        }
    }

    const handelApply = async () => {
        console.log("handelApply", actionValue, checked);
        if (actionValue === 'delete' && checked?.length) {
            try {
                const { data } = await axios.post(`${multi_delete_review}`, { product_review_ids: checked });
                if (data?.success) {
                    console.log("handelApply-data", data);
                    _SUCCESS(data?.massage);
                    setPageNo(pageNo);
                    setGetProd({ page: pageNo, rowsPerPage: 10, search: "", filter: "ALL" })
                    setActionValue("bulkAction");
                    setChecked([]);
                    setTotalTagGetUrl(total_items_review);
                }
            } catch (error) {
                console.error(error);
            }

        }

        if ((actionValue === 'PENDING' || actionValue === 'ACTIVATED' || actionValue === 'DEACTIVATED') && checked?.length) {
            try {
                const { data } = await axios.post(`${multi_status_update}`, { product_review_ids: checked, review_status: actionValue }, {
                    withCredentials: true
                });
                if (data?.success) {
                    console.log("handelApply-data", data);
                    _SUCCESS(data?.massage);
                    setPageNo(pageNo);
                    setGetProd({ page: pageNo, rowsPerPage: 10, search: "", filter: "ALL" })
                    setActionValue("bulkAction");
                    setChecked([]);
                    setTotalTagGetUrl(total_items_review);
                    setConfirmStatus("");
                }
            } catch (error) {
                console.error(error);
            }

        }
        setAllCheck(false);
    }

    const handleApplyDelete = async (delId: any) => {
        try {
            const { data } = await axios.post(`${multi_delete_review}`, { product_review_ids: [delId] });
            if (data?.success) {
                console.table("handelApply-data", data);
                _SUCCESS(data?.massage);
                setPageNo(pageNo);
                setGetProd({ page: pageNo, rowsPerPage: 10, search: "", filter: "ALL" })
                setActionValue("bulkAction");
                setChecked([]);
                setTotalTagGetUrl(total_items_review);
                setConfirmStatus("")
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getTagDetails = async (id: any) => {
        // try {
        //     setButtonDisabled(false);
        //     setFieldsErrors({});
        //     console.log('id: ', id);
        //     const { data } = await axios.get(`${get_product_tag_id}/${id}`);
        //     console.log('data:: ', data);
        //     if (data?.success) {
        //         setTagDetails(data?.data);
        //         if (data?.data?.id) {
        //             setOpenFullModal(true)
        //         } else {
        //             setOpenFullModal(false)
        //         }
        //     }
        // } catch (error: any) {
        //     console.log("error", error);
        // }
    }

    const actionArray = [
        { value: "bulkAction", name: "Bulk action" },
        { value: "delete", name: "Delete" },
        { value: "PENDING", name: "Pending" },
        { value: "ACTIVATED", name: "Activated" },
        { value: "DEACTIVATED", name: "Deactivated" },
    ]

    const actionArray2 = [
        { value: "PENDING", name: "PENDING" },
        { value: "ACTIVATED", name: "ACTIVATED" },
        { value: "DEACTIVATED", name: "DEACTIVATED" },
    ]

    const header = [
        { field: 'Name' },
        { field: 'Description' },
        { field: 'Rating' },
        { field: 'Status' },
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

    const handleChangeAction2 = async (id: any, e: any) => {
        // setActionValue(e.target.value);
        if (id && e) {
            setActionValue2((pre: any) => ({
                ...pre,
                [id]: e
            }));
            try {
                const { data }: any = await axios.post(updateReviewUrl, { review_id: id, review_status: e }, { withCredentials: true });
                if (data && data?.success && data?.data) {
                    _SUCCESS(data?.massage);
                }
            } catch (error) {
                console.error(error);
            }
        }
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

    const [allCheck, setAllCheck] = useState(false);
    const handelAllChecked = (e: any) => {
        if (e?.target?.checked && getReview && getReview?.length) {
            const arr = [];
            for (let g = 0; g < getReview.length; g++) {
                if (getReview[g] && getReview[g]?.id) {
                    arr.push(+getReview[g]?.id);
                }
            }
            setChecked(arr);
        } else {
            setChecked([]);
        }
        setAllCheck(e?.target?.checked);
    }

    const searchRes = async (value: any) => {
        console.log("searchRes", value);
        if (value) {
            setPageNo(1);
            // setGetProd({ page: 1, rowsPerPage: 10, filter: "ALL", search: value });
            const serachData = {
                page: 1,
                rowsPerPage: 10,
                filter: productReviewValue,
                search: value
            }
            const { data } = await _put(getAllUserReview, serachData)
            setGetStatusReview(data?.data)
            setTotalTagGetUrl(`${total_items_review}/${value}`);
        } else {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10, filter: productReviewValue, search: "" })
            setTotalTagGetUrl(total_items_review);
            setGetStatusReview(getUserReview)
        }
    }

    const [searchValueCustom, setCustomValue] = useState("");

    useEffect(() => {
        if (search && searchIdPatternRegex(search)) {
            setCustomValue(search);
            searchRes(search);
        }
    }, [search])


    useEffect(() => {
        console.log("dataSet editDataSet", tagDetails)
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

    console.log(getUserReview, "getUser");

    useEffect(() => {
        if (getReview?.length) {
            getReview?.map((row: any, index: number) => {
                if (row?.id && row?.review_status) {
                    setActionValue2((pre: any) => ({
                        ...pre,
                        [row?.id]: row?.review_status
                    }))
                }
            });
        }
    }, [getReview, getReview?.length])

    const productReviewList = [
        { name: "ALL" },
        { name: "PENDING" },
        { name: "ACTIVATED" },
        { name: "DEACTIVATED" },
    ];
    // const handleChangeProductType = (e: any) => {
    //     setProductReviewValue(e.target.value);
    // };
    const isValidValue = (value: string) =>
        productReviewList.some((item) => item.name === value);

    const handleChangeProductType = (e: React.ChangeEvent<{ value: unknown }>) => {
        const value = e.target.value as string;
        if (isValidValue(value)) {
            setProductReviewValue(value);
        } else {
            setProductReviewValue("ALL"); // Default fallback
        }
    };


    const getReviewByStatus = async () => {
        const filterData = {
            page: pageNo,
            rowsPerPage: 10,
            filter: productReviewValue,
            search: ""
        }

        const { data } = await _put(getAllUserReview, filterData)
        setGetStatusReview(data?.data)
        // const { sendData: getUserReview }: any = useRead({
        //     selectMethod: "put",
        //     url: getAllUserReview,
        //     callData: data,
        // });
        console.log(filterData, productReviewValue, "d5f641gd666f")
    }

    const clearReviewFilter = async () => {
        const Cleardata = {
            page: 1,
            rowsPerPage: 10,
            filter: "ALL",
            search: ""
        }
        const { data } = await _put(getAllUserReview, Cleardata)
        setGetStatusReview(data?.data)
        setCustomValue("")
    }

    return (
        <div className='w-full flex flex-col items-start justify-between gap-2'>
            <SearchAndAddNewComponent buttonTxt={'Search Rating'} addNewProduct={addNewProduct} name={'Add Tags'} res={searchRes} addButtonOff={true} customValue={searchValueCustom} />
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
                <div className='flex gap-2'>
                    <Select
                        value={productReviewValue}
                        sx={{ width: "15rem", height: "2rem" }}
                        onChange={(e: any) => handleChangeProductType(e)}
                        displayEmpty
                        size="small"
                    >
                        {productReviewList.map((item, index) => (
                            <MenuItem key={index} value={item.name}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button variant='outlined'
                        // disabled={!productReviewValue || productReviewValue === "ALL"}
                        color="success" size="small" onClick={getReviewByStatus}>Apply</Button>

                    {/* <Button variant='outlined'
                        color="primary" size="small" onClick={() => {
                            clearReviewFilter()
                            setProductReviewValue("ALL")
                        }}>Clear</Button> */}
                </div>

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
                    handleClickNext={() => { setPageNo(pageNo === 1 ? 1 : (pageNo - 1)); setAllCheck(false); setChecked([]) }}
                    handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                    handleClickPrevious={() => { setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1); setAllCheck(false); setChecked([]) }}
                    handleClickLast={() => setPageNo(getTotalPage())}
                />
            </div>

            {!tabView ?
                (getReview?.length ?
                    <Table className='lg:table hidden table-auto w-full productTableCls !border !border-solid'>
                        <TableHead>
                            <TableRow
                                hover
                                role="checkbox"
                                className='bg-slate-200 hover:!bg-slate-200'
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={checked?.length === getReview?.length ? true : false} className='px-[9px] py-0' onClick={handelAllChecked} size="small" />
                                </TableCell>
                                {header.map((col, index) =>
                                    <TableCell key={index}>{col.field}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getReview?.map((row: any, index: number) => {
                                return (
                                    <StyledTableRow
                                        hover
                                        key={index}
                                        className='hover:!bg-[#6d8ad70f]'
                                        sx={{ cursor: 'pointer' }}

                                    >
                                        <StyledTableCell className='!border-0 !w-[2.5%]' padding="checkbox">
                                            <Checkbox
                                                // checked={prodCheck?.product_id === row?.id ? true : false} 
                                                checked={checked.includes(+row?.id)}
                                                // onClick={() => prodCheck?.product_id !== row?.id ? setProdCheck({ product_id: row?.id }) : setProdCheck({})}
                                                onClick={(e) => handelTableCheckBox(e, row?.id)}
                                                size="small"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell className='!w-[10%]'>{row?.user && row?.user?.first_name ? `${row?.user?.first_name} ${row?.user?.last_name}` : "--"}</StyledTableCell>
                                        <StyledTableCell className='!w-[50%]'>{row?.description ? row?.description : "--"}</StyledTableCell>
                                        <StyledTableCell className='!w-[10%]'>{row?.item_rating ? row?.item_rating : "--"}</StyledTableCell>
                                        <StyledTableCell className='!w-[10%]'>
                                            <ActionDrop
                                                btnValue="Apply"
                                                handleChange={(e: any) => handleChangeAction2(row?.id, e.target.value)}
                                                menuItemArray={actionArray2}
                                                value={(actionValue2 && actionValue2[row?.id]) ? actionValue2[row?.id] : null}
                                                btn={true}
                                            // handleClick={() => actionValue === "restore" && handleToggle()}
                                            />
                                            {/* {row?.review_status ? row?.review_status : "--"} */}
                                        </StyledTableCell>
                                        <StyledTableCell className='!w-[10%]'>
                                            <div className='flex flex-row gap-2'>
                                                {/* <EditIcon className='w-6 h-6 text-linkBlue-01 cursor-pointer' onClick={() => { getProductDetails(row?.id) }} /> */}
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
                                {getReview.length ? getReview.map((row: any, index: number) => {
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
                                                            : <div className='flex justify-between w-full'>{row?.user && row?.user?.first_name ? `${row?.user?.first_name} ${row?.user?.last_name}` : "--"}</div>}
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
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>Rating</div><div className='text-left w-[80%] flex items-start'>{row?.item_rating ? row?.item_rating : "--"}</div></div>
                                                        <div className='flex justify-between w-full'><div className='text-left w-[15%]'>Status</div><div className='text-left w-[80%] flex items-start'>{row?.review_status ? row?.review_status : "--"}</div></div>
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
                    handleClickNext={() => { setPageNo(pageNo === 1 ? 1 : (pageNo - 1)); setAllCheck(false); setChecked([]) }}
                    handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                    handleClickPrevious={() => { setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1); setAllCheck(false); setChecked([]) }}
                    handleClickLast={() => setPageNo(getTotalPage())}
                />
            </div>

            <RightSideModal modalStat={openFullModal} handleClose={() => setOpenFullModal(false)} heading={(tagDetails != undefined && tagDetails != '') ? 'Update Product Tag' : 'Add Product Tag'}>
                <div className=' flex items-start gap-2.5'>
                    <div className='flex w-[100%] flex-col gap-4'>
                        {/* product category name */}
                        <div className='border border-solid border-gray-400'>
                            <p className='px-4 py-2'>Product tag name</p>
                            <hr />
                            <div className='p-4 flex flex-col gap-2 bg-offWhite-03'>
                                <div className='w-full border border-solid border-offWhite-02'><TextField className='!w-full p-1' placeholder='Enter category name' name='name' handelState={handelOnChange} blur={handleSlug} value={fields?.name} /></div>
                                <span style={{ color: "red" }}>{fieldsErrors?.name}</span>
                            </div>
                        </div>

                        {/* product category slug */}
                        <div className='border border-solid border-gray-400'>
                            <p className='px-4 py-2'>Product tag slug</p>
                            <hr />
                            <div className='p-4 flex flex-col gap-2 bg-offWhite-03'>
                                <div className='w-full border border-solid border-offWhite-02'><TextField className='!w-full p-1' placeholder='Enter category slug' name='slug' handelState={handelOnChange} blur={handleSlug} value={fields?.slug} /></div>
                                <span style={{ color: "red" }}>{fieldsErrors?.slug}</span>
                            </div>
                        </div>

                        {/* <div className='w-full'>
                            <DynamicForm handelSubmit={setFormdata} dynOb={dynamicCategoiFormObject} sendDataState={setDataSetCategory} />
                        </div> */}

                        {/* product description */}
                        <div className='border border-solid border-gray-400'>
                            <p className='px-4 py-2'>Product tag description</p>
                            <hr />
                            <div className='p-4 flex flex-col gap-2 bg-offWhite-03'>
                                <div className='w-full border border-solid border-offWhite-02'><TextAreaField className='!w-full h-40 p-1' name='description' handelState={handelOnChange} value={fields?.description} /></div>
                                <span style={{ color: "red" }}>{fieldsErrors?.description}</span>
                            </div>
                        </div>

                        <PinkPawsbutton
                            variant={"solid"}
                            name={(tagDetails != undefined && tagDetails != '') ? "Update Tag" : "Add Tag"}
                            icon={""}
                            handleClick={handleSubmit}
                            pinkPawsButtonExtraCls={""}
                            style={{}}
                            disabled={buttonDisabled}
                            title={""}
                        />
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

export default ReviewPage