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
import CkEditor from '../../components/CkEditor';


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
const Faqs = () => {

    const flexColItemStart = `flex flex-col items-start w-full`
    const fomtMPb2 = `font-medium pb-2`
    const flexColGap2 = `flex flex-col gap-2 w-full`
    const fieldRoot = `w-full border border-solid border-gray-400 rounded`
    let errorCls = "text-sm text-red-500"


    const headerTerms = [
        { field: 'Category', classE: "!w-[15%]" },
        { field: 'Question', classE: "!w-[25%]" },
        { field: 'Answer', classE: "!w-[30%]" },
        { field: 'rank', classE: "!w-[10%] !text-center" },
        // { field: 'change Rank', classE: "!w-[10%]" },
        { field: 'status', classE: "!w-[10%] !text-center" },
        { field: 'Action', classE: "!w-[10%] !text-right" },
    ]

    const { create_faq, update_faq, update_faq_rank, delete_faq, get_faq_by_module, get_faq_by_id, get_faq_module } = getUrlWithKey("faqs")

    const [openModal, setOpenModal] = useState("")
    const [faqs, setFaqs]: any = useState([])
    const [categories, setCategories]: any = useState([])
    const [getFaqsBycategories, setGetFaqsBycategories]: any = useState<number>(undefined)
    const [faqsMetadata, setFaqsMetadata]: any = useState<object>({ status_id: 3 })
    const [faqsDelete, setFaqsDelete]: any = useState([])
    const [faqsId, setFaqsId]: any = useState("")

    console.log(faqsMetadata, "faqsMetadata")
    console.log(getFaqsBycategories, categories[0]?.id, "getFaqsBycategories")

    const GetCategory = async () => {
        try {
            const { data } = await _put(get_faq_module)
            if (data?.success) {
                console.log("getC:", data?.data, "___data")
                setCategories(data?.data)
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.log(error, "error_")
        }
    }

    const GetFaq = async () => {
        try {
            const { data } = await _put(get_faq_by_module, { page: 1, rowsPerPage: 100, module_id: getFaqsBycategories })
            if (data?.success) {
                console.log("get:", data?.data, "___data")
                setFaqs(data?.data)
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.log(error, "error_")
        }
    }

    const CreateOrUpdateFaq = async () => {
        let valid = true
        if (faqsMetadata?.id) {
            if (faqsMetadata?.rank) {
                valid = true
            } else {
                valid = false
                _ERROR("Rank is required")
            }
        }
        if (valid) {
            try {
                if (faqsMetadata?.id) {
                    const { data: updateData } = await _post(update_faq, { ...faqsMetadata })
                    if (updateData?.success) {
                        _SUCCESS(updateData?.massage)
                        GetFaq()
                        setOpenModal("")
                        setFaqsId("")
                        // UpdateFaqRank({ id: faqsMetadata?.id, newRank: faqsMetadata?.rank })
                        setFaqsMetadata({ status_id: 3 })
                    }
                } else {
                    const { data: createData } = await _post(create_faq, { module_id: faqsMetadata?.module_id ? faqsMetadata?.module_id : +categories[0]?.id, ...faqsMetadata })
                    if (createData?.success) {
                        _SUCCESS(createData?.massage)
                        GetFaq()
                        setOpenModal("")
                        setFaqsId("")
                        setFaqsMetadata({ status_id: 3 })
                    }
                }
            } catch (error) {
                _ERROR(error?.response?.data?.massage)
                console.log(error, "error_")
            }
        }
    }

    const UpdateFaqRank = async ({ id, newRank }) => {
        try {
            const { data } = await _post(update_faq_rank, { id: id, newRank: newRank })
            if (data?.success) {
                _SUCCESS(data?.massage)
                console.log("update:", data?.data, "___data")
                GetFaq()
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.log(error, "error_")
        }
    }

    const DeleteFaqs = async (ids: []) => {
        try {
            const { data } = await _post(delete_faq, { faq_id: ids })
            if (data?.success) {
                _SUCCESS(data?.massage)
                console.log("delete:", data?.data, "___data")
                GetFaq()
                setFaqsDelete([])
            }
        } catch (error) {
            _ERROR(error?.response?.data?.massage)
            console.log(error, "error_")
        }
    }


    const GetFaqById = async (id: string | number) => {
        try {
            const { data } = await _get(`${get_faq_by_id}/${id}`)
            if (data?.success) {
                console.log("getId:", data?.data, "___data")
                setFaqsMetadata({ id: data?.data?.id, question: data?.data?.question, anwser: data?.data?.anwser, module_id: data?.data?.module?.id, status_id: data?.data?.status?.id, rank: data?.data?.rank })
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
        if (categories?.length) {
            setGetFaqsBycategories(categories[0]?.id)
        }
    }, [categories])

    useEffect(() => {
        if (getFaqsBycategories) {
            GetFaq()
        }
    }, [getFaqsBycategories])

    useEffect(() => {
        if (faqsId !== "") {
            GetFaqById(faqsId)
        }
    }, [faqsId])

    return (
        <>
            <div className='flex items-center gap-4 mb-8'>
                <PinkPawsbutton name='Add F&Q' pinkPawsButtonExtraCls={``} handleClick={() => setOpenModal("Add Faq")} />
                <Select
                    value={+getFaqsBycategories}
                    className='faq-modal-select w-40 h-9'
                    onChange={(e: any) => setGetFaqsBycategories(+e.target.value)}
                >
                    {categories?.length ? categories.map((v: any, i: number) => <MenuItem key={i} value={v?.id}>{v?.name}</MenuItem>) : null}
                </Select>
            </div>

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
                    {faqs?.length ? faqs.map((row: any, index: number) => {
                        return (
                            <StyledTableRow
                                hover
                                key={index}
                                // sx={{ cursor: 'pointer' }}
                                className='hover:!bg-[#6d8ad70f] !border-b !border-solid !border-[#dfdfdf]'
                            >
                                <StyledTableCell className='!border-0'>{row?.module?.name ? row?.module?.name : "--"}</StyledTableCell>
                                <StyledTableCell className='!border-0'>{row?.question ? row?.question : "--"}</StyledTableCell>
                                <StyledTableCell className='!border-0'>{row?.anwser ? <div style={{ width: "fit-content" }} dangerouslySetInnerHTML={{ __html: row?.anwser.slice(0, 65) + (row?.anwser.length > 64 ? `...` : ``) }} /> : "--"}
                                </StyledTableCell>
                                <StyledTableCell className='!border-0 !text-center'>{row?.rank ? row?.rank : "--"}</StyledTableCell>
                                {/* <StyledTableCell className='!border-0'>
                                    <Select
                                        value={row?.rank}
                                        className='faq-modal-select w-full h-8'
                                        onChange={(e: any) => UpdateFaqRank({ id: row?.id, newRank: e.target.value })}
                                    >
                                        {faqs.map((v: any, i: number) => <MenuItem key={i} value={v?.rank}>{v?.rank}</MenuItem>)}
                                    </Select>
                                </StyledTableCell> */}
                                <StyledTableCell className='!border-0'>
                                    <div className='flex items-center justify-center'>
                                        <div className={`${row?.status?.id === "3" ? `bg-red-50 border-red-600 text-red-600` : `bg-green-50 border-green-800 text-green-800`} border border-solid w-40 text-center px-4 py-1 rounded-md`}>
                                            {row?.status?.title ? row?.status?.title : "--"}
                                        </div>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell className='!border-0'>
                                    <div className='flex flex-row justify-end gap-2'>
                                        <EditIcon
                                            className='w-6 h-6 text-linkBlue-01 cursor-pointer'
                                            onClick={() => { setOpenModal("Edit Faq"); setFaqsId(row?.id) }}
                                        />
                                        <DeleteIcon
                                            className={`w-6 h-6 ${row?._count?.products ? "text-gray-400 cursor-not-allowed" : "text-red-500 cursor-pointer"} `}
                                            onClick={() => { setFaqsDelete((pre: any) => ([...pre, row?.id])) }}
                                        />
                                    </div>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })
                        :
                        <StyledTableRow
                            hover={false}
                        >
                            <StyledTableCell colSpan={7} className='!border-0 h-40 !text-center !text-xl select-none'>{`No F&Q Found`}</StyledTableCell>
                        </StyledTableRow>
                    }
                </TableBody>
            </Table>

            <RightSideModal
                modalStat={openModal !== "" ? true : false}
                handleClose={() => {
                    setOpenModal("");
                    setFaqsMetadata({ status_id: 3 });
                    setFaqsId("")
                }}
                heading={openModal}
            >
                <div className='faqs-modal-input'>
                    <div className='w-full flex flex-col items-center gap-4'>
                        <div className='w-full flex items-center gap-4'>
                            {/* Category */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Chose Category</p>
                                <div className={`${flexColGap2}`}>
                                    <Select
                                        value={faqsMetadata?.module_id ? faqsMetadata?.module_id : categories[0]?.id}
                                        className='faq-modal-select'
                                        onChange={(e: any) => setFaqsMetadata((pre: any) => ({ ...pre, module_id: +e.target.value }))}
                                    >
                                        {categories?.length ? categories?.map((v: any, i: number) => <MenuItem key={i} value={v?.id}>{v?.name}</MenuItem>) : null}
                                    </Select>
                                </div>
                            </div>

                            {/* Status */}
                            <div className={`${flexColItemStart}`}>
                                <p className={`${fomtMPb2}`}>Status</p>
                                <div className={`${flexColGap2}`}>
                                    <Select
                                        value={faqsMetadata?.status_id}
                                        className='faq-modal-select'
                                        onChange={(e: any) => setFaqsMetadata((pre: any) => ({ ...pre, status_id: e.target.value }))}
                                    >
                                        <MenuItem value={1}>Published</MenuItem>
                                        <MenuItem value={3}>Draft</MenuItem>
                                    </Select>
                                </div>
                            </div>

                            {/* Rank */}
                            {openModal === "Edit Faq" &&
                                <div className={`${flexColItemStart}`}>
                                    <p className={`${fomtMPb2}`}>Rank</p>
                                    <div className={`${flexColGap2}`}>
                                        <TextField
                                            className='!w-full'
                                            placeholder='Enter rank'
                                            name='rank'
                                            value={faqsMetadata?.rank}
                                            onChange={(e: any) => setFaqsMetadata((pre: any) => ({ ...pre, rank: e.target.value }))}
                                        />
                                    </div>
                                </div>}
                        </div>

                        {/* question */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Question</p>
                            <div className={`${flexColGap2}`}>
                                <TextField
                                    className='!w-full'
                                    placeholder='Enter Question'
                                    name='question'
                                    value={faqsMetadata?.question}
                                    onChange={(e: any) => setFaqsMetadata((pre: any) => ({ ...pre, question: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* question */}
                        <div className={`${flexColItemStart}`}>
                            <p className={`${fomtMPb2}`}>Answer</p>
                            <div className={`${flexColGap2}`}>
                                <CkEditor
                                    value={faqsMetadata?.anwser}
                                    handleChange={(e: any) => { setFaqsMetadata((pre: any) => ({ ...pre, anwser: e })) }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-end pt-4'>
                    <PinkPawsbutton
                        name='Save'
                        pinkPawsButtonExtraCls={`uppercase bg-green-700 hover:bg-green-800 border-green-700 hover:border-green-800`}
                        handleClick={() => CreateOrUpdateFaq()}
                    />
                </div>
            </RightSideModal >

            <Dialog
                open={faqsDelete?.length ? true : false}
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
                            {`Are you sure you want to delete this F&Q?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            style={{ fontSize: "14px", fontWeight: "500", color: "red" }}
                            onClick={() => setFaqsDelete([])}
                        >
                            cancel
                        </Button>
                        <Button
                            style={{ fontSize: "14px", fontWeight: "500", color: "green" }}
                            onClick={() => { DeleteFaqs(faqsDelete) }}
                        >
                            yes
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    )
}

export default Faqs