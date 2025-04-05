import { Button, Dialog, DialogActions, DialogContent, DialogContentText, MenuItem, Select, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from 'styled-components';
import PinkPawsbutton from '../../components/PinkPawsbutton';
import RightSideModal from '../../components/RightSideModal';
import getUrlWithKey from '../../util/_apiUrl';
import { _get, _post, _put } from '../../services';
import { _ERROR, _SUCCESS } from '../../util/_reactToast';


const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#000000",
        color: "#ffffff",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));
const StyledTableRow = styled(TableRow)(({ theme }: any) => ({
    '&:nth-of-type(even)': {
        backgroundColor: "#ffffff",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const FaqCategories = () => {


    const headerTerms = [
        { field: 'Name', classE: "!w-[60%]" },
        { field: 'status', classE: "!w-[15%] !text-center" },
        { field: 'rank', classE: "!w-[15%] !text-center" },
        // { field: 'change Rank', classE: "!w-[10%]" },
        { field: 'Action', classE: "!w-[10%] !text-right" },
    ]

    const flexColItemStart = `flex flex-col items-start w-full`
    const fomtMPb2 = `font-medium pb-2`
    const flexColGap2 = `flex flex-col gap-2 w-full`
    const fieldRoot = `w-full border border-solid border-gray-400 rounded`
    let errorCls = "text-sm text-red-500"

    const { create_faq_module, update_faq_module, update_faq_module_rank, delete_faq_module, get_faq_module } = getUrlWithKey("faqs")

    const [openModal, setOpenModal] = useState("")
    const [categories, setCategories]: any = useState([])
    const [categoryMetadata, setCategoryMetadata]: any = useState<object>({ status_id: 3 })
    const [categoryDelete, setCategoryDelete]: any = useState([])
    const [categoryId, setCategoryId]: any = useState("")

    const GetCategory = async () => {
        try {
            const { data } = await _put(get_faq_module)
            if (data?.success) {
                console.log("get:", data?.data, "___data")
                setCategories(data?.data)
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.log(error, "error_")
        }
    }

    const CreateOrUpdateCategory = async () => {
        let valid = true
        if (categoryMetadata?.name) {
            valid = true
        } else {
            valid = false
            _ERROR("Name is required")
        }
        if (categoryMetadata?.id) {
            if (categoryMetadata?.rank) {
                valid = true
            } else {
                valid = false
                _ERROR("Rank is required")
            }
        }
        if (valid) {
            try {
                if (categoryMetadata?.id) {
                    const { data: updateData } = await _post(update_faq_module, { id: categoryMetadata?.id, name: categoryMetadata?.name, status_id: categoryMetadata?.status_id, rank: +categoryMetadata?.rank })
                    if (updateData?.success) {
                        _SUCCESS("FAQ category is updated successfully")
                        GetCategory()
                        setOpenModal("")
                        setCategoryId("")
                        setCategoryMetadata({ status_id: 3 })
                        // UpdateCategoryRank({ id: categoryMetadata?.id, newRank: categoryMetadata?.rank })
                    }
                } else {
                    const { data: createData } = await _post(create_faq_module, { name: categoryMetadata?.name, status_id: categoryMetadata?.status_id })
                    if (createData?.success) {
                        _SUCCESS("FAQ category is created successfully")
                        GetCategory()
                        setOpenModal("")
                        setCategoryId("")
                        setCategoryMetadata({ status_id: 3 })
                    }
                }
            } catch (error) {
                _ERROR(error?.response?.data?.massage)
                console.log(error, "error_")
            }
        }
    }

    const UpdateCategoryRank = async ({ id, newRank }) => {
        try {
            const { data } = await _post(update_faq_module_rank, { id: id, newRank: newRank })
            if (data?.success) {
                _SUCCESS(data?.massage)
                console.log("update:", data?.data, "___data")
                GetCategory()
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.log(error, "error_")
        }
    }

    const DeleteCategory = async (ids: []) => {
        try {
            const { data } = await _post(delete_faq_module, { module_id: ids })
            if (data?.success) {
                _SUCCESS(data?.massage)
                console.log("delete:", data?.data, "___data")
                GetCategory()
                setCategoryDelete([])
            }
        } catch (error) {
            _ERROR("you must delete the faqs")
            setCategoryDelete([])
            console.log(error, "error_")
        }
    }


    const GetCategoryById = async (id: string | number) => {
        try {
            const { data } = await _get(`${get_faq_module}/${id}`)
            if (data?.success) {
                console.log("getId:", data?.data, "___data")
                setCategoryMetadata({ id: data?.data?.id, name: data?.data?.name, status_id: +data?.data?.status?.id, rank: data?.data?.rank })
                GetCategory()
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.log(error, "error_")
        }
    }

    useEffect(() => {
        GetCategory()
    }, [])

    useEffect(() => {
        if (categoryId !== "") {
            GetCategoryById(categoryId)
        }
    }, [categoryId])

    return (
        <>
            <PinkPawsbutton name='Add Faq Category' pinkPawsButtonExtraCls={`mb-8`} handleClick={() => setOpenModal("Add Faq Category")} />

            <Table className='lg:inline-table hidden table-auto productTableCls !border !border-solid'>
                <TableHead className='bg-offWhite-01'>
                    <TableRow
                        hover
                        role="checkbox"
                        sx={{ cursor: 'pointer' }}
                        className='bg-slate-200 hover:!bg-slate-200'
                    >
                        {headerTerms.map((col: any, index: number) =>
                            <TableCell key={index} className={`!font-semibold ${col?.classE}`}>{col.field}</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categories?.length ? categories.map((row: any, index: number) => {
                        return (
                            <StyledTableRow
                                hover
                                key={index}
                                // sx={{ cursor: 'pointer' }}
                                className='hover:!bg-[#6d8ad70f] !border-b !border-solid !border-[#dfdfdf]'
                            >
                                <StyledTableCell className='!border-0'>{row?.name ? row?.name : "--"}</StyledTableCell>
                                <StyledTableCell className='!border-0'>
                                    <div className='flex items-center justify-center'>
                                        <div className={`${row?.status?.id === "3" ? `bg-red-50 border-red-600 text-red-600` : `bg-green-50 border-green-800 text-green-800`} border border-solid w-40 text-center px-4 py-1 rounded-md`}>
                                            {row?.status?.title ? row?.status?.title : "--"}
                                        </div>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell className='!border-0 !text-center'>{row?.rank ? row?.rank : "--"}</StyledTableCell>
                                {/* <StyledTableCell className='!border-0'> */}
                                {/* <Select
                                        value={row?.rank}
                                        className='faq-modal-select w-full h-8'
                                        onChange={(e: any) => UpdateCategoryRank({ id: row?.id, newRank: e.target.value })}
                                    >
                                        {categories.map((v: any, i: number) => <MenuItem key={i} value={v?.rank}>{v?.rank}</MenuItem>)}
                                    </Select> */}
                                {/* </StyledTableCell> */}
                                <StyledTableCell className='!border-0'>
                                    <div className='flex flex-row justify-end gap-2'>
                                        <EditIcon
                                            className='w-6 h-6 text-linkBlue-01 cursor-pointer'
                                            onClick={() => { setOpenModal("Edit Faq Category"); setCategoryId(row?.id) }}
                                        />
                                        <DeleteIcon
                                            className={`w-6 h-6 ${row?._count?.products ? "text-gray-400 cursor-not-allowed" : "text-red-500 cursor-pointer"} `}
                                            onClick={() => { setCategoryDelete((pre: any) => ([...pre, row?.id])) }}
                                        />
                                    </div>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })
                        :
                        <StyledTableRow
                            hover={false}
                            className='hover:!bg-[#6d8ad70f]'
                        >
                            <StyledTableCell colSpan={5} className='!border-0 h-40 !text-center !text-xl select-none'>{`No Category Found`}</StyledTableCell>
                        </StyledTableRow>
                    }
                </TableBody>
            </Table>

            <RightSideModal
                modalStat={openModal !== "" ? true : false}
                handleClose={() => {
                    setOpenModal("");
                    setCategoryMetadata({ status_id: 3 });
                    setCategoryId("")
                }}
                heading={openModal}
            >
                <div className='faqs-modal-input'>
                    <div className='flex items-center gap-4'>
                        {/* Category name */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Category Name</p>
                            <div className={`${flexColGap2}`}>
                                <TextField
                                    className='!w-full'
                                    placeholder='Enter Category name'
                                    name='name'
                                    value={categoryMetadata?.name}
                                    onChange={(e: any) => setCategoryMetadata((pre: any) => ({ ...pre, name: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Status</p>
                            <div className={`${flexColGap2}`}>
                                <Select
                                    value={categoryMetadata?.status_id}
                                    className='faq-modal-select'
                                    onChange={(e: any) => setCategoryMetadata((pre: any) => ({ ...pre, status_id: e.target.value }))}
                                >
                                    <MenuItem value={1}>Published</MenuItem>
                                    <MenuItem value={3}>Draft</MenuItem>
                                </Select>
                            </div>
                        </div>

                        {/* Rank */}
                        {openModal === "Edit Faq Category" &&
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Rank</p>
                                <div className={`${flexColGap2}`}>
                                    <TextField
                                        className='!w-full'
                                        placeholder='Enter rank'
                                        name='rank'
                                        value={categoryMetadata?.rank}
                                        onChange={(e: any) => setCategoryMetadata((pre: any) => ({ ...pre, rank: e.target.value }))}
                                    />
                                </div>
                            </div>}
                    </div>


                </div>
                <div className='flex items-center justify-end pt-4'>
                    <PinkPawsbutton
                        name='Save'
                        pinkPawsButtonExtraCls={`uppercase bg-green-700 hover:bg-green-800 border-green-700 hover:border-green-800`}
                        handleClick={() => CreateOrUpdateCategory()}
                    />
                </div>
            </RightSideModal>

            <Dialog
                open={categoryDelete?.length ? true : false}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div style={{ width: "30vw" }}>
                    <DialogContent>
                        <DialogContentText
                            id="alert-dialog-description"
                            className="product-name"
                            style={{ fontSize: "16px" }}
                        >
                            Are you sure you want to delete this category?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            style={{ fontSize: "14px", fontWeight: "500", color: "red" }}
                            onClick={() => setCategoryDelete([])}
                        >
                            cancel
                        </Button>
                        <Button
                            style={{ fontSize: "14px", fontWeight: "500", color: "green" }}
                            onClick={() => { DeleteCategory(categoryDelete) }}
                        >
                            yes
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>

        </>
    )
}

export default FaqCategories