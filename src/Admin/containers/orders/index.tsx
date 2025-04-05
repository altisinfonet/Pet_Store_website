import { Autocomplete, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField as MuiTextField, Tooltip, RadioGroup, Radio, Dialog, DialogContent, styled, tableCellClasses, Button, IconButton, DialogTitle } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import getUrlWithKey from '../../util/_apiUrl';
import { useRead, useUpdate } from '../../hooks';
import Pageination from '../../components/Pageination';
import FullpageModal from '../../components/FullPageModal';
import OrdersNote from './orderNote';
import moment from 'moment';
import OrdersEdit from './orderEdit';
import { _ERROR, _SUCCESS } from '../../util/_reactToast';
import SearchAndAddNewComponent from '../../components/searchAddNewComponent';
import ActionDrop from '../../components/ActionDrop';
import axios from 'axios';
import PinkPawsbutton from '../../components/PinkPawsbutton';
import SelectField from '../../components/SelectField';
import ButtonField from '../../components/ButtonField';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EditIcon from '@mui/icons-material/Edit';
import { _post } from '../../services';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { _WARNING } from '../../../util/_reactToast';
import CloseIcon from '@mui/icons-material/Close';
import NewTrackOrder from '../../../components/NewTrackOrdersDetails';
import AdminTrackOrder from '../../components/AdminNewTrackOrder';
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


const Orders = () => {

    const { get_order_list, get_order_state, update_order, total_items, delete_multiple_order, update_multiple_order_status, get_order_date, get_order_status_list, order_get_pdf } = getUrlWithKey("orders");
    const router = useRouter()
    const { page } = router?.query
    const [pageNo, setPageNo] = useState(Number(page) || 1)
    const [actionValue, setActionValue] = useState("bulkAction");
    const [filterActionValue, setFilterActionValue] = useState("");
    const [checked, setChecked] = useState<any[]>([]);
    const [pagenation, setPagenation] = useState({ page: pageNo, rowsPerPage: 10, search: '', filter: "" })
    const [dataSet, setDataSet]: any = useState({ edit: false, isNote: false, isDetails: false, track: false, id: null })
    const [getOrderListById, setGetOrderListById]: any = useState()
    const [getOrderStateUrl, setGetOrderStateUrl]: any = useState()
    const [updateOrder, setUpdateOrder]: any = useState()
    const [getProd, setGetProd]: any = useState({ page: pageNo ? pageNo : 1, rowsPerPage: 10 });
    const [getItemUrl, setItemUrl] = useState("");
    const [orderDetails, setOrderDetails]: any = useState(null);
    const [newTrackOrderData, setNewTrackOrderData] = useState([])
    const [status, setStatus]: any = useState("");
    const [confirmStatus, setConfirmStatus]: any = useState(false);
    const [openModal, setOpenModal]: any = useState(false)
    const [orderDate, setOrderDate] = useState(null);
    const [registeredCustomerValue, setRegisteredCustomerValue] = useState(null);

    const [allDateList, setAllDateList] = useState<any>([]);
    const [registeredCustomerList, setRegisteredCustomerList] = useState<any>([]);
    const [allChecked, setAllChecked] = useState(false);

    console.log(pageNo, "updaxfgteOrder")
    const { sendData: getOrderList } = useRead({ selectMethod: "put", url: get_order_list, callData: pagenation })
    let { sendData: getOrderListDetails } = useRead({ selectMethod: "get", url: getOrderListById })
    const { sendData: getOrderState } = useRead({ selectMethod: "get", url: getOrderStateUrl })

    const { sendData: updateStatus, error: updateStatusErr }: any = useUpdate({ selectMethod: "post", url: `${update_order}/${updateOrder?.id}`, callData: updateOrder })

    const { sendData: allDates }: any = useRead({ selectMethod: "get", url: get_order_date });

    console.log(getOrderListDetails, "sdfsdfsdf")
    console.log(getOrderState, "getOrderStatedsf")
    const header = [
        { field: 'Order' },
        { field: 'Date' },
        { field: 'Status' },
        { field: 'Total' },
        // { field: 'Notes' },
        { field: 'Action' },
    ];

    useEffect(() => {
        if (page) {
            setPageNo(Number(page));
        }
    }, [page]);

    // Update the URL when pageNo changes
    useEffect(() => {
        if (pageNo !== Number(page)) {
            router.push(
                {
                    pathname: router.pathname,
                    query: { ...router.query, page: pageNo },
                },
                undefined,
                { shallow: true }
            );
        }
    }, [pageNo]);

    const tableList = [
        {
            Order: "#Test product cat food CF-885921",
            date: "Jun 14, 2021",
            status: "Completed",
            total: "₹545.00",
            notes: "ordernote",
        }
    ]

    const actionArray = [
        { value: "bulkAction", name: "Bulk action" },
        { value: "delete", name: "Delete" },
        { value: "changeStatusToProcession", name: "Change status to procession" },
        { value: "changeStatusToOnHold", name: "Change status to on-hold" },
        { value: "changeStatusToComplete", name: "Change status to complete" },
        { value: "changeStatusToCancelled", name: "Change status to cancelled" },
    ]

    const filterArray = getOrderState?.map((ele: any) => ({ value: ele?.title, name: ele?.title })).sort((a: any, b: any) => a.name.localeCompare(b.name));

    const { sendData: totalDataView } = useRead({ selectMethod: "get", url: getItemUrl });
    const { sendData: { totalCancelled, totalCompleted, totalFailed, totalItem, totalOnHoald, totalPending, totalProcessing, totalRefunded } } = useRead({ selectMethod: "get", url: get_order_status_list });

    useEffect(() => {
        setItemUrl(total_items);
    }, []);

    useEffect(() => {
        if (totalDataView && totalDataView?.totalItem)
            setItemUrl("");
    }, [totalDataView]);

    const handleChangeAction = (e: any) => {
        setActionValue(e.target.value);
    }

    const handleChangeFilterAction = (e: any) => {
        console.log(e.target.value, "4de65f4d51")
        setFilterActionValue(e.target.value)
    }

    const handleChangeOrderStatus = async () => {
        try {
            if (actionValue === 'delete' && checked?.length) {
                const { data } = await axios.post(`${delete_multiple_order}`, { order_ids: checked });
                if (data?.success) {
                    console.log("handelApply-data", data);
                    _SUCCESS(data?.massage);
                    // setFields(defaultFieldSet);
                    // setPageNo(1)
                    setGetProd({ page: pageNo, rowsPerPage: 10 })
                    setPagenation({ page: pageNo, rowsPerPage: 10, search: pagenation?.search, filter: filterActionValue })
                    setActionValue("bulkAction");
                    setChecked([]);
                    setAllChecked(false);
                    setItemUrl(total_items);
                }
            }

            if (actionValue === 'changeStatusToProcession' && checked?.length) {
                const { data } = await axios.post(`${update_multiple_order_status}`, { order_ids: checked, status: "processing" });
                if (data?.success) {
                    console.log("handelApply-data", data);
                    _SUCCESS(data?.massage);
                    // setFields(defaultFieldSet);
                    // setPageNo(1)
                    setGetProd({ page: pageNo, rowsPerPage: 10 })
                    setPagenation({ page: pageNo, rowsPerPage: 10, search: pagenation?.search, filter: filterActionValue })
                    setActionValue("bulkAction");
                    setChecked([]);
                    setAllChecked(false);
                    setItemUrl(total_items);
                }
            }

            if (actionValue === 'changeStatusToOnHold' && checked?.length) {
                const { data } = await axios.post(`${update_multiple_order_status}`, { order_ids: checked, status: "on hold" });
                if (data?.success) {
                    console.log("handelApply-data", data);
                    _SUCCESS(data?.massage);
                    // setFields(defaultFieldSet);
                    // setPageNo(1)
                    setGetProd({ page: pageNo, rowsPerPage: 10 })
                    setPagenation({ page: pageNo, rowsPerPage: 10, search: pagenation?.search, filter: filterActionValue })
                    setActionValue("bulkAction");
                    setChecked([]);
                    setAllChecked(false);
                    setItemUrl(total_items);
                }
            }

            if (actionValue === 'changeStatusToComplete' && checked?.length) {
                const { data } = await axios.post(`${update_multiple_order_status}`, { order_ids: checked, status: "completed" });
                if (data?.success) {
                    console.log("handelApply-data", data);
                    _SUCCESS(data?.massage);
                    // setFields(defaultFieldSet);
                    // setPageNo(1)
                    setGetProd({ page: pageNo, rowsPerPage: 10 })
                    setActionValue("bulkAction");
                    setChecked([]);
                    setAllChecked(false);
                    setItemUrl(total_items);
                }
            }

            if (actionValue === 'changeStatusToCancelled' && checked?.length) {
                const { data } = await axios.post(`${update_multiple_order_status}`, { order_ids: checked, status: "cancelled" });
                if (data?.success) {
                    console.log("handelApply-data", data);
                    _SUCCESS(data?.massage);
                    // setFields(defaultFieldSet);
                    // setPageNo(1)
                    setGetProd({ page: pageNo, rowsPerPage: 10 })
                    setActionValue("bulkAction");
                    setChecked([]);
                    setAllChecked(false);
                    setItemUrl(total_items);
                }
            }
            // console.log("orderData: ", orderData)
            // sendStatus({ status: status?.status, id: orderData?.id });
            setConfirmStatus(false);

            console.log('getOrder: ', getOrderState)
            // refetchUpdateDetails(+(orderData?.id))
        } catch (error) {
            console.log('error: ', error)
        }

    }


    const onCloseDilog = () => {
        console.log('handleSection: ', null)
        // setConfirmSendEmailStatus(false);
        setActionValue("bulkAction");
        setStatus("");
        setConfirmStatus(false)
        // setStatus()
        // setHandleSection(false)
    }

    const getTotalPage = (): number => {
        console.log("list?.totalPage", totalDataView?.totalPage)
        if (totalDataView?.totalPage && totalDataView?.totalPage !== 0) {
            return totalDataView?.totalPage;
        } else if (totalDataView?.totalPage === 0) {
            return 1;
        } else {
            return 0;
        }
    }

    const refetchUpdateDetails = (orderId: number) => {
        console.log("orderId: ", orderId)
        if (orderId) {
            // setOrderDetails(null);
            setGetOrderListById(`${get_order_list}/${orderId}`)
        }
    }

    // useEffect(() => {
    //     if (updateStatus?.id) {
    //         // setUpdateOrder()
    //         setGetOrderStateUrl(get_order_state)
    //         if (orderDetails?.id) {
    //             refetchUpdateDetails(orderDetails?.id)
    //         }
    //         _SUCCESS("order update sucessfully")
    //     }
    // }, [updateStatus])

    const addNewOrder = () => {
        // setFieldsErrors({});
        // setButtonDisabled(false);
        // setFields(defaultFieldSet);
        // setTagDetails(undefined);
        // setOpenFullModal(true);
    }

    useEffect(() => {
        setGetProd({ ...getProd, page: pageNo })
    }, [pageNo]);


    useEffect(() => {
        setGetOrderStateUrl(get_order_state)
    }, [])
    useEffect(() => {
        if (dataSet?.id) {
            console.log('dat: ', dataSet)
            setOrderDetails(null);
            setGetOrderListById(`${get_order_list}/${dataSet?.id}`)
        }

    }, [dataSet?.id])

    useEffect(() => {
        if (getOrderListDetails?.id) {
            setOrderDetails(getOrderListDetails);
            setGetOrderListById("")
        }
    }, [getOrderListDetails])

    useEffect(() => {
        setPagenation({ ...pagenation, page: pageNo })
    }, [pageNo])

    useEffect(() => {
        setPagenation({ ...pagenation, page: pageNo, search: '', filter: "" })
    }, [])

    const searchRes = (value: any) => {
        console.log("searchRes", value);
        if (value) {
            setPageNo(1);
            setPagenation({ page: 1, rowsPerPage: 10, search: value, filter: filterActionValue });
            setItemUrl(`${total_items}/${value}`);
        } else {
            setPageNo(1);
            setPagenation({ page: 1, rowsPerPage: 10, search: '', filter: filterActionValue });
            setItemUrl(`${total_items}`);
        }
    }
    console.log(orderDetails, "orderDetails");

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
        if (e?.target?.checked && getOrderList && getOrderList?.length) {
            const arr = [];
            for (let g = 0; g < getOrderList.length; g++) {
                if (getOrderList[g] && getOrderList[g]?.id) {
                    arr.push(getOrderList[g]?.id);
                }
            }
            setAllChecked(true);
            setChecked(arr);
        } else {
            setAllChecked(false);
            setChecked([]);
        }
    }

    const handleFilterByStatus = () => {
        if (!filterActionValue) {
            _WARNING("Please select a status to find order data!")
        } else {
            setPagenation({ page: 1, rowsPerPage: 10, search: '', filter: filterActionValue });
        }
    }

    const ClearFilterByStatus = () => {
        console.log(filterActionValue, "654fd6g54fd651")
        setFilterActionValue("")
        setPageNo(1);
        setPagenation({ page: 1, rowsPerPage: 10, search: '', filter: "" });
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, page: 1 },
            },
            undefined,
            { shallow: true }
        );
    }

    const handleApply = async () => {

        try {
            if (actionValue !== "bulkAction" && checked?.length) {
                const filteredAction: { name: string, value: string }[] = actionArray.filter(action => action.value === actionValue);
                setStatus(filteredAction[0]?.name);
                setConfirmStatus(true);
            }
            // if (actionValue === 'delete' && checked?.length) {
            //     const { data } = await axios.post(`${delete_multiple_order}`, { order_ids: checked });
            //     if (data?.success) {
            //         console.log("handelApply-data", data);
            //         _SUCCESS(data?.massage);
            //         // setFields(defaultFieldSet);
            //         setPageNo(1)
            //         setGetProd({ page: pageNo, rowsPerPage: 10 })
            //         setActionValue("bulkAction");
            //         setChecked([]);
            //         setItemUrl(total_items);
            //     }
            // }

            // if (actionValue === 'changeStatusToProcession' && checked?.length) {
            //     const { data } = await axios.post(`${update_multiple_order_status}`, { order_ids: checked, status: "processing" });
            //     if (data?.success) {
            //         console.log("handelApply-data", data);
            //         _SUCCESS(data?.massage);
            //         // setFields(defaultFieldSet);
            //         setPageNo(1)
            //         setGetProd({ page: pageNo, rowsPerPage: 10 })
            //         setActionValue("bulkAction");
            //         setChecked([]);
            //         setItemUrl(total_items);
            //     }
            // }

            // if (actionValue === 'changeStatusToOnHold' && checked?.length) {
            //     const { data } = await axios.post(`${update_multiple_order_status}`, { order_ids: checked, status: "on hold" });
            //     if (data?.success) {
            //         console.log("handelApply-data", data);
            //         _SUCCESS(data?.massage);
            //         // setFields(defaultFieldSet);
            //         setPageNo(1)
            //         setGetProd({ page: pageNo, rowsPerPage: 10 })
            //         setActionValue("bulkAction");
            //         setChecked([]);
            //         setItemUrl(total_items);
            //     }
            // }

            // if (actionValue === 'changeStatusToComplete' && checked?.length) {
            //     const { data } = await axios.post(`${update_multiple_order_status}`, { order_ids: checked, status: "completed" });
            //     if (data?.success) {
            //         console.log("handelApply-data", data);
            //         _SUCCESS(data?.massage);
            //         // setFields(defaultFieldSet);
            //         setPageNo(1)
            //         setGetProd({ page: pageNo, rowsPerPage: 10 })
            //         setActionValue("bulkAction");
            //         setChecked([]);
            //         setItemUrl(total_items);
            //     }
            // }

            // if (actionValue === 'changeStatusToCancelled' && checked?.length) {
            //     const { data } = await axios.post(`${update_multiple_order_status}`, { order_ids: checked, status: "cancelled" });
            //     if (data?.success) {
            //         console.log("handelApply-data", data);
            //         _SUCCESS(data?.massage);
            //         // setFields(defaultFieldSet);
            //         setPageNo(1)
            //         setGetProd({ page: pageNo, rowsPerPage: 10 })
            //         setActionValue("bulkAction");
            //         setChecked([]);
            //         setItemUrl(total_items);
            //     }
            // }
        } catch (error) {
            console.log(error, "__error")
        }
    }

    const handleChangeAllDate = (e: any) => {
        setOrderDate(e.target.value);
    }

    const handleChangeRegisteredCustomer = (e: any) => {
        setRegisteredCustomerValue(e.target.value);
    }
    useEffect(() => {
        if (allDates && allDates?.length) {
            setAllDateList(allDates)
        }
    }, [allDates]);

    useEffect(() => {
        if (allDates && allDates?.length) {
            setRegisteredCustomerList(allDates)
        }
    }, [allDates]);



    const handleFilter = () => {
        // console.log('--> ', stockStatusValue, productTypeValue)
        // setPageNo(1);
        // setGetProd({
        //     page: 1, rowsPerPage: 10, stock_id: stockStatusValue ? +(stockStatusValue) : null,
        //     type_id: productTypeValue ? +(productTypeValue) : null
        // });
        // setTotalProductGetUrl(`${total_items_product}/${null}/${productTypeValue}/${stockStatusValue}`);
    }


    // const handleClearFilter = () => {
    //     console.log('--> ', stockStatusValue, productTypeValue)
    //     setPageNo(1);
    //     setGetProd({ page: 1, rowsPerPage: 10 });
    //     setTotalProductGetUrl(`${total_items_product}`);
    //     setStockStatusValue(null);
    //     setProductTypeValue(null);
    // }

    const renderStatusBar = () => {
        return (
            <div className='flex items-center gap-2 my-2'>
                <span className='text-sm' onClick={() => {
                    // setPageNo(1),
                    // setGetProd({ page: 1, rowsPerPage: 10, deleted_at: false });
                    // setActionValue("bulkAction"), 
                    // setTotalGetData("totalItem")
                }}>
                    <span className='text-cyan-700 cursor-pointer' >All</span> ({totalItem?._c || 0})</span><span>|</span>
                <span className='text-sm' onClick={() => {
                    // setPageNo(1),
                    //     setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10, status_id: 1 }),
                    //     setTotalGetData("totalPublished")
                    // setTotalProductGetUrl(`${total_items_product}/${null}/${productTypeValue}/${stockStatusValue}/${1}`);
                }}>
                    <span className='text-cyan-700 cursor-pointer'>Processing</span> ({totalProcessing?._c || 0})</span><span>|</span>
                <span className='text-sm' onClick={() => {
                    // setPageNo(1),
                    //     setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10, status_id: 3 }),
                    //     setTotalGetData("totalDraft")
                    // setTotalProductGetUrl(`${total_items_product}/${null}/${productTypeValue}/${stockStatusValue}/${3}`);
                }}>
                    <span className='text-cyan-700 cursor-pointer'>On-holad</span> ({totalOnHoald?._c || 0})</span><span>|</span><span className='text-sm' onClick={() => {
                        // setPageNo(1),
                        //     setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10, status_id: 3 }),
                        //     setTotalGetData("totalDraft")
                        // setTotalProductGetUrl(`${total_items_product}/${null}/${productTypeValue}/${stockStatusValue}/${3}`);
                    }}>
                    <span className='text-cyan-700 cursor-pointer'>Completed</span> ({totalCompleted?._c || 0})</span>
                <span>|</span><span className='text-sm' onClick={() => {
                    // setPageNo(1),
                    //     setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10, status_id: 3 }),
                    //     setTotalGetData("totalDraft")
                    // setTotalProductGetUrl(`${total_items_product}/${null}/${productTypeValue}/${stockStatusValue}/${3}`);
                }}>
                    <span className='text-cyan-700 cursor-pointer'>Pending</span> ({totalPending?._c || 0})</span>
                <span>|</span><span className='text-sm' onClick={() => {
                    // setPageNo(1),
                    //     setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10, status_id: 3 }),
                    //     setTotalGetData("totalDraft")
                    // setTotalProductGetUrl(`${total_items_product}/${null}/${productTypeValue}/${stockStatusValue}/${3}`);
                }}>
                    <span className='text-cyan-700 cursor-pointer'>Cancelled</span> ({totalCancelled?._c || 0})</span>
                <span>|</span><span className='text-sm' onClick={() => {
                    // setPageNo(1),
                    //     setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10, status_id: 3 }),
                    //     setTotalGetData("totalDraft")
                    // setTotalProductGetUrl(`${total_items_product}/${null}/${productTypeValue}/${stockStatusValue}/${3}`);
                }}>
                    <span className='text-cyan-700 cursor-pointer'>Refunded</span> ({totalRefunded?._c || 0})</span>
                <span>|</span><span className='text-sm' onClick={() => {
                    // setPageNo(1),
                    //     setGetProd({ page: pageNo ? pageNo : 1, rowsPerPage: 10, status_id: 3 }),
                    //     setTotalGetData("totalDraft")
                    // setTotalProductGetUrl(`${total_items_product}/${null}/${productTypeValue}/${stockStatusValue}/${3}`);
                }}>
                    <span className='text-cyan-700 cursor-pointer'>Failed</span> ({totalFailed?._c || 0})</span>

            </div>
        )
    }

    const handlePdf = async (pdfType: string, id: number | string) => {
        try {
            const data = {
                order_id: +(id),
                pdf_type: pdfType,
            };

            const res = await _post(`${order_get_pdf}`, data, { responseType: 'blob' });

            // if (res?.data && res?.data?.success) {
            console.log("pdfData: ", res?.data);

            // Create a Blob from the response data
            const blob = new Blob([res?.data], { type: 'application/pdf' });

            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);

            // Open the PDF in a new tab
            window.open(url);

            // setSendEmailType("");
            // _SUCCESS("Order email is sent successfully")
            // }
            // axios.get('http://localhost:8080/api/v1/order/get-pdf', {
            //     responseType: 'blob' // specify response type as blob
            // })
            //     .then(response => {
            //         console.log('pdf:: ', response)
            //         // Create a Blob from the response data
            //         const blob = new Blob([response.data], { type: 'application/pdf' });

            //         // Create a URL for the Blob
            //         const url = window.URL.createObjectURL(blob);

            //         // Open the PDF in a new tab
            //         window.open(url);
            //     })
            //     .catch(error => {
            //         console.error('Error fetching PDF:', error);
            //     });
        } catch (error: any) {
            console.log('error: ', error)
        }
    }


    const ModalHandleClose = () => {
        setDataSet({ edit: false, isNote: false, isDetails: false, id: null, })
    }

    return (
        // { totalCancelled, totalCompleted, totalFailed, totalItem, totalOnHoald, totalPending, totalProcessing, totalRefunded }
        <div>
            <div className='flex w-full flex-wrap gap-2 items-center justify-between pb-4'>
                {/* listDataChield={
                    renderStatusBar()
                } */}
                <SearchAndAddNewComponent buttonTxt={'Search Order'} addButtonOff addNewProduct={addNewOrder} name={'Add Order'} res={searchRes} />
                <ActionDrop
                    btnValue="Apply"
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    handleClick={() => handleApply()}
                />
                <div className='flex items-center gap-2'>
                    <ActionDrop
                        handleChange={handleChangeFilterAction}
                        menuItemArray={filterArray}
                        value={filterActionValue}
                        handleClick={() => handleFilterByStatus()}
                        btnValue="Filter"
                    />
                    <Button
                        variant="outlined"
                        disabled={!filterActionValue}
                        sx={{
                            borderColor: "#D1D5DB",
                            color: "#6B7280",
                            "&:hover": {
                                borderColor: "#9CA3AF",
                                color: "#4B5563"
                            }
                        }}
                        onClick={ClearFilterByStatus}
                    >
                        Clear
                    </Button>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    {/* <SelectField selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeSeo} menuItemArray={seoScoresArray} value={seoValue} /> */}
                    {/* <SelectField selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeReadability} menuItemArray={readabilityScorcesArray} value={readabilityValue} /> */}
                    {/* <SelectField selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeAction} menuItemArray={[]} value={""} /> */}
                    {/* <SelectField placeholder={"All Dates"} selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeAllDate} menuItemArray={allDateList} value={orderDate} />
                    <SelectField placeholder={"Filter by stock status"} selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeRegisteredCustomer} menuItemArray={registeredCustomerList} value={registeredCustomerValue} />
                    <ButtonField buttonTxt={<span className='flex items-center'><FilterAltIcon className='text-lg' />&nbsp;Filter</span>} disabled={(orderDate != null || registeredCustomerValue != null) ? false : true} handleClick={() => handleFilter()} /> */}
                    {/* {(stockStatusValue != null || productTypeValue != null) ? <ButtonField buttonTxt={<span className='flex items-center'><HighlightOffIcon className='text-lg' />&nbsp;Clear</span>} buttonCls={`border !border-solid !border-red-500 hover:!border-red-500 !text-red-500`} disabled={(stockStatusValue != null || productTypeValue != null) ? false : true} handleClick={() => handleClearFilter()} /> : null} */}
                </div>
                <Pageination
                    items={totalDataView?.totalItem}
                    value={pageNo}
                    totalpageNo={getTotalPage()}
                    handleClickFirst={() => setPageNo(1)}
                    handleClickNext={() => setPageNo(pageNo === 1 ? 1 : (pageNo - 1))}
                    handleChange={(e: any) => setPageNo(e.target.value > getTotalPage() ? 1 : e.target.value)}
                    handleClickPrevious={() => setPageNo(pageNo == getTotalPage() ? getTotalPage() : pageNo + 1)}
                    handleClickLast={() => setPageNo(getTotalPage())}
                />
            </div>
            {/* <Table className='lg:table hidden table-auto w-full productTableCls '> */}
            {getOrderList?.length ?
                <Table className='lg:table hidden table-auto w-full productTableCls !border !border-solid '>
                    <TableHead className='!cursor-default'>
                        <TableRow
                            hover
                            role="checkbox"
                            className='bg-slate-200 hover:!bg-slate-200'
                        // sx={{ cursor: 'pointer' }}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox className='px-[9px] py-0' checked={checked?.length === getOrderList?.length ? true : false} onClick={handelAllChecked} size="small" />
                            </TableCell>
                            {header.map((col, index) =>
                                <TableCell className='' key={index}>{col.field}</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getOrderList?.map((v: any, i: number) => {
                            // const link = v?.notes.toLowerCase()
                            const statusId = v?.order_status?.order_status?.id
                            console.log(v, "statfdgvfdusId")
                            return (
                                <StyledTableRow
                                    hover
                                    // sx={{ cursor: 'pointer' }}
                                    className='hover:!bg-[#6d8ad70f]'
                                    key={i}
                                >
                                    <StyledTableCell className='!w-[8%]' padding="checkbox">
                                        {/* <Checkbox /> */}
                                        <Checkbox
                                            checked={checked.includes(v?.id)}
                                            onClick={(e) => handelTableCheckBox(e, v?.id)}
                                            size='small'
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell className='relative w-[35%]'
                                    // onClick={() => setDataSet({
                                    //     // edit: true,
                                    //     isNote: false, isDetails: true, track: false, id: v?.id
                                    // })}
                                    >
                                        #{v?.id}&nbsp;{v?.user?.first_name}&nbsp;{v?.user?.last_name}
                                    </StyledTableCell>
                                    <StyledTableCell className=''>
                                        {moment(v?.order_status?.date_created).format("MMM DD, YYYY") || "--"}
                                    </StyledTableCell>
                                    <StyledTableCell className=''>
                                        <p className={`${statusId === "1" ? "bg-pending" : statusId === "2" ? "bg-blue-400" : statusId === "3" ? "bg-onHold" : statusId === "4" ? "bg-green-600" : statusId === "5" ? "bg-failed" : statusId === "6" ? "bg-failed" : statusId === "7" ? "bg-failed" : statusId === "8" ? "bg-slate-500" : statusId === "9" ? "bg-pending" : ""} ${statusId ? "text-white" : ""} py-1 px-3 rounded-full w-fit capitalize`}>{v?.order_status?.order_status?.title || "--"}</p>
                                    </StyledTableCell>
                                    <StyledTableCell className=''>
                                        ₹{(+v?.order_status?.total_sales).toFixed(2) || "00.00"}
                                    </StyledTableCell>
                                    {/* <StyledTableCell className=''>
                                        <SpeakerNotesIcon className="h-5 w-5 cursor-pointer text-indigo-600" onClick={() => setDataSet({ edit: true, isNote: true, isDetails: false, track: false, id: v?.id })} />
                                    </StyledTableCell> */}
                                    <StyledTableCell className=''>
                                        <div className='flex gap-2'>
                                            <Tooltip title={"Edit Order"} arrow>
                                                <EditIcon className="h-5 w-5 cursor-pointer text-[#2271b1]"
                                                    onClick={() => router.push(`/admin/order-update/${v?.id}?page=${pageNo}`)}
                                                // onClick={() => setDataSet({ edit: true, isNote: false, isDetails: true, track: false, id: v?.id })}
                                                />
                                            </Tooltip>
                                            <Tooltip title={!v?.genesys_invoice_generated || v?.order_status?.order_status?.title === "cancelled" ? "" : "Generate Slip"} arrow>
                                                <ReceiptLongIcon className={`h-5 w-5 ${!v?.genesys_invoice_generated || v?.order_status?.order_status?.title === "cancelled" ? "cursor-default text-gray-400" : "cursor-pointer text-green-700"}`}
                                                    onClick={() => {
                                                        if (v?.genesys_invoice_generated && v?.order_status?.order_status?.title !== "cancelled") {
                                                            handlePdf("packing_slip", v?.id)
                                                        }
                                                    }} />
                                            </Tooltip>
                                            <Tooltip title={"View Order"} arrow>
                                                <VisibilityIcon className="h-5 w-5 cursor-pointer text-pink-500"
                                                    // onClick={() => {
                                                    //     setDataSet({
                                                    //         edit: true,
                                                    //         isNote: false,
                                                    //         isDetails: true,
                                                    //         track: true,
                                                    //         id: v?.id
                                                    //     })
                                                    //     setOpenModal(true)
                                                    // }
                                                    // }
                                                    onClick={() => router.push(`/admin/view-order/${v?.id}?page=${pageNo}`)}
                                                />
                                            </Tooltip>
                                        </div>
                                    </StyledTableCell>
                                </StyledTableRow>)
                        })}
                    </TableBody>
                </Table>
                : <span className='flex items-center justify-center w-full py-4 text-xl'>No data found</span>}


            {/* <FullpageModal className={`${dataSet?.isNote ? '!h-fit' : ''}`} modalStat={dataSet?.edit} heading={dataSet?.isNote ? 'Order Note' : 'Edit Order'} handleClose={() => setDataSet({ edit: false, isNote: false, isDetails: false, id: null, })} >
                <div className='p-6'>
                    {(orderDetails && dataSet?.isNote) ?
                        <OrdersNote orderNoteData={orderDetails} />
                        :
                        dataSet?.isDetails ? null :
                            <div className='flex w-full h-[40vh] items-center justify-center admin'>
                                <div className="spinner"></div>
                            </div>
                    }
                    {dataSet?.isDetails ?
                        <OrdersEdit
                            orderData={getOrderListDetails}
                            getOrderState={getOrderState}
                            sendStatus={setUpdateOrder}
                            ordersNote={orderDetails}
                            refetchUpdateDetails={refetchUpdateDetails}
                            track={dataSet?.track}
                            ModalHandleClose={ModalHandleClose}
                        />
                        :
                        null
                    }
                </div>
            </FullpageModal> */}



            <Dialog
                open={confirmStatus}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent className='w-80 h-40 p-4'>
                    <div className='bg-white flex flex-col justify-between h-full'>
                        <p className='flex flex-col items-center justify-center'>
                            <span>Do you want to </span>
                            <span>to&nbsp;<span className='font-semibold'>`{status}`</span></span>
                        </p>
                        <div className='flex items-center gap-4'>
                            <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => handleChangeOrderStatus()} />
                            <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => onCloseDilog()} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog
                open={openModal}
                onClose={() => {
                    setOpenModal(false)
                }
                }
                fullWidth
                maxWidth="lg" // Set size to Large (lg)
            >
                <DialogTitle>
                    <h3 className='w-fit sp-title a1ccountHeader'>
                        Track Order Details
                    </h3>

                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            setOpenModal(false)
                        }}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: "gray",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <div>
                        <AdminTrackOrder trackDetailsData={newTrackOrderData} />
                    </div>
                </DialogContent>
            </Dialog>
            <br />
            <div className='flex w-full flex-wrap gap-2 items-center justify-between'>
                <ActionDrop
                    btnValue="Apply"
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    handleClick={() => handleApply()}
                />
                <div className='flex flex-wrap items-center gap-2'>
                    {/* <SelectField selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeSeo} menuItemArray={seoScoresArray} value={seoValue} /> */}
                    {/* <SelectField selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeReadability} menuItemArray={readabilityScorcesArray} value={readabilityValue} /> */}
                    {/* <SelectField selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeAction} menuItemArray={[]} value={""} /> */}
                    {/* <SelectField placeholder={"All Dates"} selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeAllDate} menuItemArray={allDateList} value={orderDate} />
                    <SelectField placeholder={"Filter by stock status"} selectFieldRootCls={"w-[10rem]"} handleChange={handleChangeRegisteredCustomer} menuItemArray={registeredCustomerList} value={registeredCustomerValue} />
                    <ButtonField buttonTxt={<span className='flex items-center'><FilterAltIcon className='text-lg' />&nbsp;Filter</span>} disabled={(orderDate != null || registeredCustomerValue != null) ? false : true} handleClick={() => handleFilter()} /> */}
                    {/* {(stockStatusValue != null || productTypeValue != null) ? <ButtonField buttonTxt={<span className='flex items-center'><HighlightOffIcon className='text-lg' />&nbsp;Clear</span>} buttonCls={`border !border-solid !border-red-500 hover:!border-red-500 !text-red-500`} disabled={(stockStatusValue != null || productTypeValue != null) ? false : true} handleClick={() => handleClearFilter()} /> : null} */}
                </div>
                <Pageination
                    items={totalDataView?.totalItem}
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
    )
}

export default Orders