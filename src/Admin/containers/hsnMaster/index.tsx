import { Autocomplete, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField as MuiTextField, Tooltip, RadioGroup, Radio, Dialog, DialogContent, styled, tableCellClasses } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import getUrlWithKey from '../../util/_apiUrl';
import { useCreate, useRead, useUpdate } from '../../../hooks';
import Pageination from '../../components/Pageination';
import SelectField from '../../components/SelectField';
import SearchField from '../../components/SearchField';
import ButtonField from '../../components/ButtonField';
import ActionDrop from '../../components/ActionDrop';
import PinkPawsbutton from '../../components/PinkPawsbutton';
import FullpageModal from '../../components/FullPageModal';
import TextField from '../../components/TextField';
import TextAreaField from '../../components/TextAreaField';
import { _ERROR, _SUCCESS } from '../../util/_reactToast';
import { isEmptyObject } from '../../util/_common';
import SelectFieldWithScroll from '../../components/SelectFieldWithScroll';
import { MenuItem, Select } from '@mui/material'
import DynamicForm from '../../../Admin/components/Form'
import axios from 'axios';
import SearchAndAddNewComponent from '../../components/searchAddNewComponent';
import RightSideModal from '../../components/RightSideModal';
import CkEditor from '../../components/CkEditor';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import parse from 'html-react-parser';
import { log } from 'node:console';

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

const HsnMaster = () => {

    const fields_dataSet = {
        hsn_no: "",
        gst_percentage: "",
    }
    const router = useRouter();
    const [actionValue, setActionValue] = useState("delete");
    const [doTrashProd, setDoTrashProd]: any = useState();
    const [productTypeValue, setProductTypeValue] = useState("filterByProductType")
    const [stockStatusValue, setStockStatusValue] = useState("filterByStockStatus");
    const [openFullModal, setOpenFullModal] = useState(false)
    const [fields, setFields] = useState<{ [x: string]: any }>(fields_dataSet);
    const [fieldsErrors, setFieldsErrors] = useState<{ [x: string]: any }>(new Object());
    const [customers, setCustomers] = useState([]);
    const [ratingList, setRatingList] = useState();
    const [preState, setPreState] = useState<any>(new Object);
    const [confirmStatus, setConfirmStatus]: any = useState("")

    const header = [
        { field: 'HSN Code' },
        { field: 'GST Percentage' },
        { field: 'Products count' },
        { field: 'Action' },
    ];
    console.log(fields, "__fields")
    const { get_testimonial, create_testimonial, get_by_id_testimonial, update_testimonial, get_user_dropdown, total_items, __delete } = getUrlWithKey("testimonial");
    const { get_gst, delete_gst, total_items_hsn, create_gst, update_gst, get_by_id } = getUrlWithKey("hsn");


    const tableList: any[] = [];
    const [pageNo, setPageNo] = useState(1);
    const [custPageNo, setCustPageNo] = useState(1);
    const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10 })
    const [totalpageNo, setTotalPageNo]: any = useState(1);
    const [get, setGet] = useState<any>("");
    const [pagination, setPagination] = useState({ page: custPageNo ? custPageNo : 1, rowsPerPage: 40 });
    const [totalGetUrl, setTotalGetUrl] = useState("");
    const [checked, setChecked] = useState<any[]>([]);


    const flexColItemStart = `flex flex-col items-start w-full`
    const fomtMPb2 = `font-medium pb-2`
    const flexColGap2 = `flex flex-col gap-2 w-full`
    const fieldRoot = `w-full border border-solid border-gray-400`

    const { sendData: totalView }: any = useRead({ selectMethod: "get", url: totalGetUrl });

    console.log(confirmStatus, 'confirmStatus');


    useEffect(() => {
        setTotalGetUrl(total_items_hsn);
    }, []);

    useEffect(() => {
        if (totalView?.totalItem) {
            setTotalGetUrl("");
        }
    }, [totalView]);

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



    // get testimonial
    const { sendData: testimonial }: any = useRead({ selectMethod: "put", url: get, callData: getProd });

    useEffect(() => {
        if (testimonial && Array.isArray(testimonial) && testimonial.length) {
            setGet("");
        }
    }, [testimonial, testimonial.length]);

    const [get_id, setGetByIdUrl] = useState("");
    const [edit_id, setEditId] = useState<any>("");
    const { sendData: gst_by_id }: any = useRead({ selectMethod: "get", url: get_id });

    // add testimonial
    const [add_t_url, setAddTUrl] = useState<any>("");
    const { sendData: added_testimonial, error: add_error }: any = useCreate({ url: add_t_url, callData: { id: +edit_id, ...fields } });
    useEffect(() => {
        if (added_testimonial) {
            clear();
            setGet(get_gst);
            _SUCCESS("HSN Code Added Successfully!");
        } else {
            setAddTUrl("");
        }

        if (add_error) {
            _ERROR("Somthing went to wrong!");
        }
    }, [added_testimonial, add_error]);


    // get customers
    const [get_customer_list, setGetCustomerList] = useState("");
    const { sendData: customer_list }: any = useRead({ selectMethod: "put", callData: pagination, url: get_customer_list });

    useEffect(() => {
        console.log('cus:: ', customer_list);
        if (customer_list?.length) {
            setCustomers(customer_list);
            setGetCustomerList("");
        }
    }, [customer_list]);

    const handelEdit = (id: any) => {
        setCustomers([]);
        setFieldsErrors({});
        setEditId(id);
        // setGetCustomerList(`${get_user_dropdown}`)
        setGetByIdUrl(`${get_by_id}/${+id}`);
    }

    useEffect(() => {
        console.log("gst_by_id", gst_by_id);
        if (gst_by_id && gst_by_id?.id) {
            setFields({
                hsn_no: gst_by_id?.hsn_no,
                gst_percentage: gst_by_id?.gst_percentage,
            });
            setOpenFullModal(true);
        }
    }, [gst_by_id]);

    // update testimonial
    const [updatet_url, setUpdateTUrl] = useState<any>("");
    const { sendData: updated_testimonial, error: update_error }: any = useUpdate({ selectMethod: "post", url: updatet_url, callData: { id: +edit_id, hsn_no: +fields.hsn_no, gst_percentage: +fields.gst_percentage } });
    useEffect(() => {
        if (updated_testimonial && updated_testimonial?.id) {
            clear();
            setGet(get_gst);
            setTotalGetUrl(total_items_hsn);
            _SUCCESS("Fields Updated Successfully!")
        }

        if (update_error) {
            _ERROR("Somthing went to wrong!")
        }
    }, [updated_testimonial, update_error]);

    const clear = () => {
        setAddTUrl("");
        setUpdateTUrl("");
        setGetByIdUrl("");
        setFields(fields_dataSet);
        setOpenFullModal(false);
    }

    const handleChangeAction = (e: any) => {
        setActionValue(e.target.value);
    }

    // const actionArray = [
    //     { value: "bulkAction", name: "Bulk action" },
    //     { value: !getProd?.deleted_at ? "edit" : "restore", name: !getProd?.deleted_at ? "Edit" : "Restore" },
    //     { value: !getProd?.deleted_at ? "moveToTrash" : "deletePermanently", name: !getProd?.deleted_at ? "Move to trash" : "Delete permanently" },
    // ]

    const actionArray = [
        // { value: "bulkAction", name: "Bulk action" },
        { value: "delete", name: "Delete" },
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

    const handleToggle = () => {
        setDoTrashProd("");
    }

    const handleChangeProductType = (e: any) => {
        setProductTypeValue(e.target.value);
    }

    const handleChangeStockStatus = (e: any) => {
        setStockStatusValue(e.target.value);
    }

    const addNewProduct = () => {
        setCustomers([]);
        setFieldsErrors({});
        setFields(fields_dataSet);
        setEditId("");
        // setGetCustomerList(`${get_user_dropdown}`)
        setOpenFullModal(true);

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

    const handelSubmit = () => {
        try {
            let valid = false;
            valid = validation(fields);
            if (valid) {
                if (!edit_id) {
                    console.log("fields", fields)
                    setAddTUrl(create_gst);
                    // setGet(get_gst);
                } else {
                    console.log("fields update", fields);
                    setUpdateTUrl(update_gst);
                    // setTotalGetUrl(total_items_hsn);
                    // setGet(get_gst);
                }
                setTotalGetUrl(total_items_hsn);

            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const handelAllChecked = (e: any) => {
        if (e?.target?.checked && testimonial && testimonial?.length) {
            const arr = [];
            for (let g = 0; g < testimonial.length; g++) {
                if (testimonial[g] && testimonial[g]?.id) {
                    arr.push(testimonial[g]?.id);
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
                const { data } = await axios.post(`${delete_gst}`, { id: checked });
                if (data?.success) {
                    console.log("handelApply-data", data);
                    _SUCCESS(data?.massage);
                    setPageNo(1)
                    setGetProd({ page: pageNo, rowsPerPage: 10 })
                    setActionValue("delete");
                    setChecked([]);
                    setTotalGetUrl(total_items_hsn);
                    setGet(get_gst);
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
            const { data } = await axios.post(`${delete_gst}`, { id: [delId] });
            if (data?.success) {
                console.log("handelApply-data", data);
                _SUCCESS(data?.massage);
                setPageNo(1)
                setGetProd({ page: pageNo, rowsPerPage: 10 })
                setActionValue("delete");
                setChecked([]);
                setTotalGetUrl(total_items_hsn);
                setGet(get_gst);
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
        setGet(get_gst);
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo]);

    const searchRes = (value: any) => {
        console.log("searchRes", value)
        if (value) {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10, search: value });
            setGet(get_gst);
            setTotalGetUrl(`${total_items_hsn}/${value}`);
        } else {
            setPageNo(1);
            setGetProd({ page: 1, rowsPerPage: 10 });
            setGet(get_gst);
            setTotalGetUrl(total_items_hsn);
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
                <SearchAndAddNewComponent buttonTxt={'Search HSN Code'} addNewProduct={addNewProduct} name={'Add HSN Code'} res={searchRes} />
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
                        name={"Add Testimonial"}
                        icon={""}
                        handleClick={addNewProduct}
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
                            <Checkbox className='px-[9px] py-0' onClick={handelAllChecked} size="small" checked={checked?.length === testimonial?.length ? true : false} />
                        </TableCell>
                        {header.map((col, index) =>
                            <TableCell className='' key={index}>{col.field}</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(testimonial && testimonial?.length) ? testimonial?.map((item: any, i: number) => {

                        return (
                            <StyledTableRow
                                key={i}
                                hover
                                sx={{ cursor: 'pointer' }}
                                className='group'
                            >
                                <StyledTableCell className='w-[5%]' padding="checkbox">
                                    <Checkbox checked={checked.includes(item?.id)} onClick={(e) => handelTableCheckBox(e, item?.id)} size="small" />
                                </StyledTableCell>
                                {/* <StyledTableCell onClick={() => handelEdit(item?.id)} className='w-[10%]'>
                                    {item?.customer?.first_name} {item?.customer?.last_name}
                                </StyledTableCell> */}
                                <StyledTableCell onClick={() => handelEdit(item?.id)} className=''>
                                    {item?.hsn_no}
                                </StyledTableCell>
                                {/* <StyledTableCell onClick={() => handelEdit(item?.id)} className=''>
                                    {item?.GST && parse(item?.GST)}
                                </StyledTableCell> */}
                                <StyledTableCell onClick={() => handelEdit(item?.id)} className=''>
                                    <div className='bg-slate-200 py-1 px-3 rounded-full w-fit'>{+item?.gst_percentage}%</div>
                                </StyledTableCell>
                                <StyledTableCell onClick={() => handelEdit(item?.id)} className=''>
                                    <div className='bg-slate-200 py-1 px-3 rounded-full w-fit'>{item?._count?.Product || "0"}</div>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div className='flex flex-row gap-2'>
                                        <EditIcon className='w-6 h-6 text-linkBlue-01 cursor-pointer' onClick={() => { handelEdit(item?.id) }} />
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
            {openFullModal &&
                <RightSideModal modalStat={openFullModal} handleClose={clear} heading={edit_id ? 'Update HSN Master' : 'Add HSN Master'}>
                    <div className='flex items-start gap-2.5'>
                        <div className='flex w-[100%] flex-col gap-2'>
                            {/* Title */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>HSN Code</p>
                                <div className={`${flexColGap2}`}>
                                    <div className={`${fieldRoot}`}>
                                        <TextField className='!w-full p-1' placeholder='Enter Code' name='hsn_no' handelState={handelOnChange} value={fields?.hsn_no} />
                                    </div>
                                    <span style={{ color: "red" }}>{fieldsErrors?.code}</span>
                                </div>
                            </div>
                            <div className='flex items-start gap-4'>
                                {/* Select customer */}
                                {/* Select rating */}
                                <div className={`${flexColItemStart}`}>
                                    <p className={`${fomtMPb2}`}>GST Percentage</p>
                                    <div className={`${flexColGap2}`}>
                                        <div className={`${fieldRoot}`}>
                                            <TextField className='!w-full p-1' placeholder='Enter GST Percentage' name='gst_percentage' handelState={handelOnChange} value={fields?.gst_percentage} />
                                        </div>
                                        <span style={{ color: "red" }}>{fieldsErrors?.GST}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-center justify-end'>
                                <PinkPawsbutton
                                    variant={"solid"}
                                    name={edit_id ? 'Update HSN Master' : 'Add HSN'}
                                    icon={""}
                                    handleClick={handelSubmit}
                                    pinkPawsButtonExtraCls={""}
                                    style={{}}
                                    disabled={false}
                                    title={""}
                                />
                            </div>
                        </div>

                    </div>
                </RightSideModal>}
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

export default HsnMaster;