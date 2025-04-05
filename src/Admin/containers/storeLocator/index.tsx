import { Autocomplete, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField as MuiTextField, Tooltip, RadioGroup, Radio, Dialog, DialogContent, styled, tableCellClasses } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import getUrlWithKey from '../../../Admin/util/_apiUrl';
import { useRead } from '../../../Admin/hooks';
import Pageination from '../../../Admin/components/Pageination';
import SearchField from '../../../Admin/components/SearchField';
import ButtonField from '../../../Admin/components/ButtonField';
import ActionDrop from '../../../Admin/components/ActionDrop';
import PinkPawsbutton from '../../../Admin/components/PinkPawsbutton';
import FullpageModal from '../../../Admin/components/FullPageModal';
import TextField from '../../../Admin/components/TextField';
import TextAreaField from '../../../Admin/components/TextAreaField';
import axios from 'axios';
import { _SUCCESS } from '../../../Admin/util/_reactToast';
import { emailRegax, indianPincodeRegex, isEmptyObject, numberRegax, phoneRegax } from '../../../Admin/util/_common';
import RightSideModal from '../../../Admin/components/RightSideModal';
import SearchAndAddNewComponent from '../../../Admin/components/searchAddNewComponent';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

const StoreLocator = () => {
    const defaultFieldSet = {
        title: "",
        slug: "",
        address_1: "",
        address_2: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        latitude: "",
        longitude: "",
        phone_no: "",
        email: "",
        id: null,
        site_code: "",
        GSTIN: ""
    }
    const router = useRouter();
    const [pageNo, setPageNo] = useState(1);
    const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
    // const [fields, setFields] = useState<{ [x: string]: any }>({});
    const [fields, setFields] = useState(defaultFieldSet);
    const [totalpageNo, setTotalPageNo]: any = useState(1);
    const [actionValue, setActionValue] = useState("delete");
    const [doTrashProd, setDoTrashProd]: any = useState();
    const [openFullModal, setOpenFullModal] = useState(false)
    const { get, get_store_location_by_id, create_store_location, update_store_location, total_items, __delete } = getUrlWithKey("store_locator");
    const [storeLocatorDetails, setStoreLocatorDetails]: any = useState()
    const { sendData: store_locators }: any = useRead({ selectMethod: "put", url: get, callData: getProd });
    const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());
    const [totalGetUrl, setTotalGetUrl] = useState("");
    const [checked, setChecked] = useState<any[]>([]);
    const [confirmStatus, setConfirmStatus]: any = useState("")

    const flexColItemStart = `flex flex-col items-start w-full`
    const fomtMPb2 = `font-medium pb-2`
    const flexColGap2 = `flex flex-col gap-2 w-full`
    const fieldRoot = `w-full border border-solid border-gray-400`

    const { sendData: totalView }: any = useRead({ selectMethod: "get", url: totalGetUrl });

    console.log(checked, "checkedcheckedcheckedwd")

    useEffect(() => {
        setTotalGetUrl(total_items);
    }, []);

    useEffect(() => {
        if (totalView?.totalItem) {
            setTotalGetUrl("");
        }
    }, [totalView])


    const header = [
        { field: 'Title' },
        { field: 'Slug' },
        { field: 'Address' },
        { field: "Latitude" },
        { field: "longitude" },
        { field: "Site Code" },
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

    const handleChangeAction = (e: any) => {
        setActionValue(e.target.value);
    }

    const addNewStoreLocation = () => {
        setFieldsErrors({});
        setFields(defaultFieldSet);
        setStoreLocatorDetails(undefined);
        setOpenFullModal(true);
    }

    const handelOnChange = async (e: any) => {
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

        if (stateName === "zip_code") {
            const res = await axios.get(`https://api.postalpincode.in/pincode/${stateValue}`);
            if (res?.status === 200) {
                const result = res?.data?.[0]?.PostOffice?.[0];

                setFields(pre => ({
                    ...pre,
                    state: result?.State,
                    country: result?.Country
                }));
            }

        }

        let runTimeValidationObject: any = {};

        if ("phone_no" === stateName) {
            runTimeValidationObject[stateName] = {
                v: stateValue,
                regax: phoneRegax,
                m: "Invalid phone number"
            }
        }

        if ("email" === stateName) {
            runTimeValidationObject[stateName] = {
                v: stateValue,
                regax: emailRegax,
                m: "Invalid Email ID"
            }
        }

        if ("latitude" === stateName) {
            runTimeValidationObject[stateName] = {
                v: stateValue,
                regax: numberRegax,
                m: "Invalid number"
            }
        }

        if ("longitude" === stateName) {
            runTimeValidationObject[stateName] = {
                v: stateValue,
                regax: numberRegax,
                m: "Invalid number"
            }
        }

        if ("longitude" === stateName) {
            runTimeValidationObject[stateName] = {
                v: stateValue,
                regax: numberRegax,
                m: "Invalid number"
            }
        }

        if ("zip_code" === stateName) {
            runTimeValidationObject[stateName] = {
                v: stateValue,
                regax: indianPincodeRegex,
                m: "Invalid pincode"
            }

            // setFields(pre => ({
            //     ...pre,
            //     state: "",
            //     country: ""
            // }));
        }

        if (isEmptyObject(runTimeValidationObject)) {
            clearValidation(stateName);
        } else {
            runTimeValidationField(runTimeValidationObject);
        }

        // clearValidation(stateName);
    }

    const runTimeValidationField = (dataSet: { [x: string]: any }) => {
        console.log("args", dataSet)
        if (!isEmptyObject(dataSet)) {
            for (const key in dataSet) {
                const value = dataSet[key]?.v;
                const regax = dataSet[key]?.regax;
                const message = dataSet[key]?.m;
                console.log("args regax(value)", regax(value))
                if (!regax(value)) {
                    setFieldsErrors(pre => ({
                        ...pre,
                        [key]: message
                    }));

                } else {
                    setFieldsErrors(pre => ({
                        ...pre,
                        [key]: ""
                    }));
                }
            }
        }
    }

    const clearValidation = (stateName: string) => {
        setFieldsErrors(pre => ({
            ...pre,
            [stateName]: ""
        }));
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

    const getTotalPage = (): number => {
        console.log("list?.totalPage", totalView?.totalPage)
        if (totalView?.totalPage && totalView?.totalPage !== 0) {
            return totalView?.totalPage;
        } else if (totalView?.totalPage === 0) {
            return 1;
        } else {
            return 0;
        }
    }


    const handleSubmit = async () => {
        try {
            let valid = false;
            valid = validation(fields, ["title", "slug", "address_1", "city", "zip_code", "latitude", "longitude", "phone_no", "email", "site_code", "GSTIN"]);

            if (valid) {
                if (fields && fields?.id) {
                    console.log(fields)
                    const { data } = await axios.post(`${update_store_location}`, { ...fields, slug: stringToSlug(fields['slug']), latitude: +fields?.latitude, longitude: +fields?.longitude });
                    if (data?.success) {
                        _SUCCESS(data?.massage);
                        setFields(defaultFieldSet);
                        setOpenFullModal(false);
                        setTotalGetUrl(total_items);
                    }
                } else {
                    console.log(fields)
                    const { data } = await axios.post(`${create_store_location}`, { ...fields, latitude: +fields?.latitude, longitude: +fields?.longitude });

                    if (data?.success) {
                        _SUCCESS(data?.massage);
                        setFields(defaultFieldSet);
                        setOpenFullModal(false);
                        setTotalGetUrl(total_items);
                    }
                }
                setPageNo(1)
                setGetProd({ page: pageNo, rowsPerPage: 10 })
            }
        } catch (error) {
            console.log('error: ', error);
        }
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

    const handleToggle = () => {
        setDoTrashProd("");
    }

    const getStoreLocatorDetails = async (id: any) => {
        try {
            setFieldsErrors({});
            console.log('id: ', id);
            const { data } = await axios.get(`${get_store_location_by_id}/${id}`);
            console.log('data:: ', data);
            if (data?.success) {
                setStoreLocatorDetails(data?.data);
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

    const handelAllChecked = (e: any) => {
        if (e?.target?.checked && store_locators && store_locators?.length) {
            const arr = [];
            for (let g = 0; g < store_locators.length; g++) {
                if (store_locators[g] && store_locators[g]?.id) {
                    arr.push(store_locators[g]?.id);
                }
            }
            setChecked(arr);
        } else {
            setChecked([]);
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
        try {
            console.log("handelApply", actionValue, checked);
            if (actionValue === 'delete' && checked?.length) {
                const { data } = await axios.post(`${__delete}`, { store_location_id: checked });
                if (data?.success) {
                    console.log("handelApply-data", data);
                    _SUCCESS(data?.massage);
                    setPageNo(1)
                    setGetProd({ page: pageNo, rowsPerPage: 10 })
                    setActionValue("delete");
                    setChecked([]);
                    setTotalGetUrl(total_items);
                } else {
                    setActionValue("delete");
                }
            }
        } catch (error) {
            console.log("Error", error);
            setActionValue("delete");
        }
    }

    const handleApplyDelete = async (delId: any) => {
        try {
            const { data } = await axios.post(`${__delete}`, { store_location_id: [delId] });
            if (data?.success) {
                console.log("handelApply-data", data);
                _SUCCESS(data?.massage);
                setPageNo(1)
                setGetProd({ page: pageNo, rowsPerPage: 10 })
                setActionValue("delete");
                setChecked([]);
                setTotalGetUrl(total_items);
                setConfirmStatus("")
            } else {
                setActionValue("delete");
            }
        } catch (error) {
            console.log("Error", error);
            setActionValue("delete");
        }
    }

    useEffect(() => {
        console.log("dataSet editDataSet", storeLocatorDetails)
        if (storeLocatorDetails !== null && storeLocatorDetails?.id) {

            const data = {
                title: storeLocatorDetails?.title,
                slug: storeLocatorDetails?.slug,
                address_1: storeLocatorDetails?.address_1,
                address_2: storeLocatorDetails?.address_2,
                city: storeLocatorDetails?.city,
                state: storeLocatorDetails?.state,
                zip_code: storeLocatorDetails?.zip_code,
                country: storeLocatorDetails?.country,
                latitude: storeLocatorDetails?.latitude,
                longitude: storeLocatorDetails?.longitude,
                phone_no: storeLocatorDetails?.phone_no,
                email: storeLocatorDetails?.email,
                id: storeLocatorDetails?.id,
                site_code: storeLocatorDetails?.site_code,
                GSTIN: storeLocatorDetails?.GSTIN,
            }

            setFields({ ...fields, ...data });
        }
    }, [storeLocatorDetails]);

    useEffect(() => {
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo]);

    const searchRes = (value: any) => {
        if (value) {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10, search: value });
            setTotalGetUrl(`${total_items}/${value}`);
        } else {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10 });
            setTotalGetUrl(total_items);
        }
    }

    return (
        <div>
            {/* Header */}
            <div className='flex flex-col gap-2 pb-4'>
                {/* <div className='flex flex-wrap gap-2 items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <span className='text-sm'><span className='text-cyan-700' >All</span> (0)</span><span>|</span>
                        <span className='text-sm'><span className='text-cyan-700'>Published</span> (0)</span><span>|</span>
                        <span className='text-sm'><span className='text-cyan-700'>Drafts</span> (0)</span><span>|</span>
                        <span className='text-sm'><span className='text-cyan-700'>Trash</span> (0)</span><span>|</span>
                        <span className='text-sm'><span className='text-cyan-700'>Sorting</span></span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <SearchField />
                        <ButtonField buttonTxt='Search products' handleClick={() => { }} />
                    </div>
                </div> */}
                <SearchAndAddNewComponent buttonTxt={'Search Store Locator'} addNewProduct={addNewStoreLocation} name={'Add Store Locator'} res={searchRes} />
                <div className='flex flex-wrap gap-2 items-center justify-between'>
                    <div className='flex flex-wrap gap-4'>
                        <ActionDrop
                            btnValue="Apply"
                            handleChange={handleChangeAction}
                            menuItemArray={actionArray}
                            value={actionValue}
                            handleClick={handelApply}
                            disabled={checked.length ? false : true}
                        />
                    </div>
                    {/* <PinkPawsbutton
                        variant={"solid"}
                        name={"Add Store Locator"}
                        icon={""}
                        handleClick={addNewStoreLocation}
                        pinkPawsButtonExtraCls={""}
                        style={{}}
                        disabled={false}
                        title={""}
                    /> */}
                    <Pageination
                        items={totalView?.totalItem}
                        value={pageNo}
                        totalpageNo={getTotalPage()}
                        handleClickFirst={() => setPageNo(1)}
                        handleClickNext={() => setPageNo(pageNo == 1 ? 1 : (pageNo - 1))}
                        handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                        handleClickPrevious={() => setPageNo(getTotalPage() == 1 ? 1 : pageNo + 1)}
                        handleClickLast={() => setPageNo(getTotalPage())}
                    />
                </div>
            </div>

            {/* <Table className='lg:table hidden table-auto w-full productTableCls '> */}
            <Table className='lg:table hidden table-auto w-full productTableCls !border !border-solid'>
                <TableHead>
                    <TableRow
                        hover
                        role="checkbox"
                        className='bg-slate-200 hover:!bg-slate-200'
                        sx={{ cursor: 'pointer' }}
                    >
                        <TableCell padding="checkbox">
                            <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} size="small" checked={checked?.length === store_locators?.length ? true : false} />
                        </TableCell>
                        {header.map((col, index) =>
                            <TableCell className='' key={index}>{col.field}</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(store_locators && store_locators?.length) ? store_locators?.map((item: any, i: number) => {

                        return (
                            <StyledTableRow
                                key={i}
                                hover
                                sx={{ cursor: 'pointer' }}
                                className='hover:!bg-[#6d8ad70f]'
                            >
                                <StyledTableCell className='!w-[8%]' padding="checkbox">
                                    <Checkbox checked={checked.includes(item?.id)} onClick={(e) => handelTableCheckBox(e, item?.id)} size="small" />
                                </StyledTableCell>
                                <StyledTableCell onClick={() => { getStoreLocatorDetails(item?.id) }} className=''>
                                    {item?.title}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => { getStoreLocatorDetails(item?.id) }} className=''>
                                    {item?.slug}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => { getStoreLocatorDetails(item?.id) }} className=''>
                                    {item?.address_1}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => { getStoreLocatorDetails(item?.id) }} className=''>
                                    <div className='bg-slate-200 py-1 px-3 rounded-full w-fit'>{item?.latitude}</div>
                                </StyledTableCell>
                                <StyledTableCell onClick={() => { getStoreLocatorDetails(item?.id) }} className=''>
                                    <div className='bg-slate-200 py-1 px-3 rounded-full w-fit'>{item?.longitude}</div>
                                </StyledTableCell>
                                <StyledTableCell onClick={() => { getStoreLocatorDetails(item?.id) }} className=''>
                                    <div className='bg-slate-200 py-1 px-3 rounded-full w-fit'>{item?.site_code}</div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div className='flex flex-row gap-2'>
                                        <EditIcon className='w-6 h-6 text-linkBlue-01 cursor-pointer' onClick={() => { getStoreLocatorDetails(item?.id) }} />
                                        <DeleteIcon className='w-6 h-6 text-red-500 cursor-pointer' onClick={() => { setConfirmStatus(item?.id) }} />
                                    </div>
                                </StyledTableCell>
                            </StyledTableRow>)
                    }) : null}
                </TableBody>
            </Table>

            {/* Footer */}
            <div className='flex flex-col gap-2 py-4'>
                <div className='flex flex-wrap gap-2 items-center justify-between'>
                    <div className='flex flex-wrap gap-4'>
                        <ActionDrop
                            btnValue="Apply"
                            handleChange={handleChangeAction}
                            menuItemArray={actionArray}
                            value={actionValue}
                            handleClick={handelApply}
                            disabled={checked.length ? false : true}
                        />
                    </div>
                    <Pageination
                        items={totalView?.totalItem}
                        value={pageNo}
                        totalpageNo={getTotalPage()}
                        handleClickFirst={() => setPageNo(1)}
                        handleClickNext={() => setPageNo(getTotalPage() <= 1 ? 1 : getTotalPage() - 1)}
                        handleChange={(e: any) => setPageNo(e.target.value > 999 ? 1 : e.target.value)}
                        handleClickPrevious={() => setPageNo(getTotalPage() == 1 ? 1 : pageNo + 1)}
                        handleClickLast={() => setPageNo(getTotalPage())}
                    />
                </div>
            </div>

            {/* Full page modal */}
            <RightSideModal modalStat={openFullModal} handleClose={() => setOpenFullModal(false)} heading={(storeLocatorDetails != undefined && storeLocatorDetails != '') ? 'Update Store Locator' : 'Add Store Locator'}>
                <div className=' flex items-start gap-2.5'>
                    <div className='flex w-[100%] flex-col gap-2'>
                        <div className='flex items-start gap-4'>
                            {/* Title */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Title</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' placeholder='Enter Title' name='title' handelState={handelOnChange} blur={handleSlug} value={fields?.title} /></div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.title}</span>
                                </div>
                            </div>

                            {/* slug */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Slug</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' placeholder='Enter slug' name='slug' handelState={handelOnChange} blur={handleSlug} value={fields?.slug} /></div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.slug}</span>
                                </div>
                            </div>
                        </div>

                        {/* Address 1 */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Address 1</p>
                            <div className={`${flexColGap2}`}>
                                <div className={`${fieldRoot}`}>
                                    <TextAreaField className='!w-full p-1 h-[12vh]' placeholder='Enter Address One' name='address_1' handelState={handelOnChange} value={fields?.address_1} /></div>
                                <span style={{ color: "red" }}>{fieldsErrors?.address_1}</span>
                            </div>
                        </div>

                        {/* Address 2 */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Address 2</p>
                            <div className={`${flexColGap2}`}>
                                <div className={`${fieldRoot}`}>
                                    <TextAreaField className='!w-full p-1 h-[12vh]' placeholder='Enter Address Two' name='address_2' handelState={handelOnChange} value={fields?.address_2} /></div>
                                <span style={{ color: "red" }}>{fieldsErrors?.address_2}</span>
                            </div>
                        </div>

                        <div className='grid grid-rows-4 grid-flow-col gap-4'>
                            {/* City */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>City</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' placeholder='Enter City' name='city' handelState={handelOnChange} value={fields?.city} /></div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.city}</span>
                                </div>
                            </div>

                            {/* State */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>State</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' placeholder='Enter State' name='state' handelState={handelOnChange} value={fields?.state} disabled /></div>
                                    {/* <span style={{ color: "red" }}>{fieldsErrors?.state}</span> */}
                                </div>
                            </div>

                            {/* Zip_code */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Pin Code</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField type='number' className='!w-full p-1' placeholder='Enter Pin Code' name='zip_code' handelState={handelOnChange} value={fields?.zip_code} /></div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.zip_code}</span>
                                </div>
                            </div>

                            {/* Country */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Country</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' placeholder='Enter Country' name='country' handelState={handelOnChange} value={fields?.country} disabled /></div>
                                    {/* <span style={{ color: "red" }}>{fieldsErrors?.country}</span> */}
                                </div>
                            </div>

                            {/* Latitude */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Latitude</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField type='number' className='!w-full p-1' placeholder='Enter Latitude' name='latitude' handelState={handelOnChange} value={fields?.latitude} /></div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.latitude}</span>
                                </div>
                            </div>

                            {/* Longitude */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Longitude</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField type='number' className='!w-full p-1' placeholder='Enter Longitude' name='longitude' handelState={handelOnChange} value={fields?.longitude} /></div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.longitude}</span>
                                </div>
                            </div>

                            {/* Phone no */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Phone no</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField type='number' className='!w-full p-1' placeholder='Enter Phone no' name='phone_no' handelState={handelOnChange} value={fields?.phone_no} /></div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.phone_no}</span>
                                </div>
                            </div>

                            {/* email */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Email</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' placeholder='Enter Email' name='email' handelState={handelOnChange} value={fields?.email} /></div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.email}</span>
                                </div>
                            </div>


                        </div>

                        <div>
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Transaction site code</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' type='number' placeholder='Enter transaction site code' name='site_code' handelState={handelOnChange} value={fields?.site_code} /></div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.site_code}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Store GST Number</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' type='text' placeholder='Enter store gst number' name='GSTIN' handelState={handelOnChange} value={fields?.GSTIN} /></div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.GSTIN}</span>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center justify-end'>
                            <PinkPawsbutton
                                variant={"solid"}
                                name={(storeLocatorDetails != undefined && storeLocatorDetails != '') ? "Update" : "Save"}
                                icon={""}
                                handleClick={handleSubmit}
                                pinkPawsButtonExtraCls={""}
                                style={{}}
                                // disabled={false}
                                title={""}
                            />
                        </div>
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

export default StoreLocator