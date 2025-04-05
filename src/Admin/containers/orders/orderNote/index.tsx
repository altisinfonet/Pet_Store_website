import React, { useEffect, useState } from 'react'
import TextField from '../../../components/TextField';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCreate } from '../../../../hooks';
import { _post } from '../../../../services';
import getUrlWithKey from '../../../util/_apiUrl';
import { Dialog, DialogContent, MenuItem, Select } from '@mui/material';
import moment from 'moment';
import PinkPawsbutton from '../../../components/PinkPawsbutton';
import { _SUCCESS } from '../../../../util/_reactToast';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const OrdersNote = ({ orderNoteData, isValue }: any) => {
    // console.log('i: ', orderNoteData)
    const [chat, setChat]: any = useState([])
    const [sendedChat, setSendedChat]: any = useState()
    const [currentTime, setCurrentTime]: any = useState();
    const [customerNote, setCustomerNote]: any = useState(false);
    const [confirmStatus, setConfirmStatus]: any = useState(false);
    const [deleteNoteId, setDeleteNoteId]: any = useState();
    const [handleSection, setHandleSection]: any = useState(true)
    // const [orderNoteDetails, setOrderNoteDetails]: any = useState(orderNoteData);
    // const { sendData: added_testimonial, error: add_error }: any = useCreate({ url: `/orders/${orderNoteData?.id}/notes`, callData: { ...fields, customer_id: +fields?.customer_id, rating: +fields?.rating } });
    console.log(chat, "5dfs4g65df5")

    const { get_order_notes, create_order_notes, delete_order_note } = getUrlWithKey("orders");

    const handleChange = (name: any, value: any) => {
        let id = 1
        if (chat.length) {
            id = chat.length + 1
        } else {
            id = 1
        }
        console.log(id)
        setSendedChat({ name: name, value: value, id: id })
        const hours: any = new Date().getHours().toString().padStart(2, '0');
        const minutes: any = new Date().getMinutes().toString().padStart(2, '0');
        const amOrPm: any = hours >= 12 ? 'PM' : 'AM';
        setCurrentTime({ h: hours, m: minutes, gmt: amOrPm });
    }

    const onSendChat = async () => {
        try {
            if (sendedChat?.value) {
                const data = {
                    note: `${sendedChat?.value}`,
                    customer_note: customerNote,
                    created_at: new Date()
                };

                const res = await _post(`${create_order_notes}/${orderNoteData?.id}/notes`, data)

                if (res?.data && res?.data?.success) {
                    let newChat = res?.data?.data;
                    // console.log('newChat: ', newChat)
                    setSendedChat({})
                    setChat([...chat, newChat])
                }
            }
        } catch (error: any) {
            console.log('error: ', error);
        }

        // if (sendedChat?.value) {
        //     setChat([...chat, { id: sendedChat?.id, chatTxt: sendedChat?.value, time: (currentTime?.h + `:` + currentTime?.m + " " + currentTime?.gmt) }]);
        // }
        // setSendedChat()
    }

    const handleDeleteChat = async (id: any) => {
        setDeleteNoteId(id);
        setConfirmStatus(true)

    }

    const deleteChat = async () => {
        try {
            if (deleteNoteId) {
                const chatRemoveData = chat.filter((item: any) => +(item.id) !== +deleteNoteId);
                setChat(chatRemoveData)

                const res = await _post(`${delete_order_note}/${orderNoteData?.id}/notes/${+deleteNoteId}`, {});

                if (res?.data && res?.data?.success) {
                    setConfirmStatus(false)
                    _SUCCESS("Note is successfully deleted!");
                }
            }
        } catch (error: any) {
            console.log('error: ', error);
        }

    }

    // console.log('chat:: ', chat, deleteNoteId)

    useEffect(() => {
        if (orderNoteData?.order_notes && orderNoteData?.order_notes?.length) {
            setChat([...orderNoteData?.order_notes])
        }
    }, [orderNoteData?.order_notes?.length]);

    const onNoteSelect = (e: any) => {
        if (e.target.value === 'true') {
            setCustomerNote(true);
        } else {
            setCustomerNote(false);
        }
    }

    const onCloseDilog = () => {
        setConfirmStatus(false)
    }

    // useEffect(() => {
    //     if (orderNoteData?.order_notes && orderNoteData?.order_notes?.length) {
    //         setChat([...chat, ...orderNoteData?.order_notes])
    //     }
    // }, [chat]);

    console.log(chat, "chatchatchatchat")
    console.log(currentTime, "currentTime")
    console.log(orderNoteData, "orderNoteData")

    return (
        <div className='flex flex-col w-full h-full border border-solid border-slate-200 rounded-lg'>

            {/* chat heading */}
            <div className='w-full h-12 bg-slate-200 px-4 flex items-center justify-between font-medium'>
                <div className='flex items-center gap-4'>
                    <p className="italic">#{orderNoteData?.id}&nbsp;{orderNoteData?.user?.first_name}&nbsp;{orderNoteData?.user?.last_name}</p>
                    {isValue === "edit" && <Select
                        value={`${customerNote}`}
                        // disabled={false}
                        onChange={(e: any) => onNoteSelect(e)}
                        fullWidth
                        className='!px-4 !py-1 selectFieldCls !w-72 bg-white'
                    >
                        <MenuItem key={"1"} value={'false'}>Private Note</MenuItem>
                        <MenuItem key={"2"} value={'true'}>Note to Customer</MenuItem>
                    </Select>
                    }
                </div>
                <ArrowDropDownIcon className='w-auto h-8 cursor-pointer' onClick={() => setHandleSection(!handleSection)} />

                {/* <p className=""><span className='font-normal'>No:</span>&nbsp;<span className='text-sm'>--</span></p> */}
            </div>

            {/* chat box */}
            {/* ${chat.length ? `h-[10vh]` : `h-[20vh]`} */}
            {handleSection &&
                <div className={`
                 overflow-y-auto ml-4 my-4`}
                    style={{ minHeight: "15vh", maxHeight: "40vh", overflowY: "auto" }}
                >
                    <div className='flex flex-col gap-2 items-start'>
                        {/* {chat.length ? chat.map((v: any, i: number) =>
                            <div key={i} className='relative w-fit flex items-start gap-1'>
                                <p className={`${v?.user_id !== null ? `bg-offWhite-02` : `bg-[#d7cad2]`} p-1 px-2 w-fit flex flex-col gap-1.5 rounded-t-lg rounded-tl-none rounded-b-lg`}>
                                    <span className='text-base leading-[1]'>{v?.note}</span>
                                    <span className='text-xs text-end'>{moment(v?.created_at).format('MMMM Do YYYY, h:mm a')}</span>
                                </p>
                                {isValue === "edit" && <DeleteIcon className='text-red-700 w-auto h-4 cursor-pointer' onClick={() => handleDeleteChat(v?.id)} />}
                            </div>)
                            : null} */}

                        {chat.length ? chat.map((v: any, i: number) => {
                            const hasHTML = /<\/?[a-z][\s\S]*>/i.test(v?.note);
                            return (
                                <div key={i} className='relative w-fit flex items-start gap-1'>
                                    <p className={`${v?.user_id !== null ? `bg-offWhite-02` : `bg-[#d7cad2]`} p-1 px-2 w-fit flex flex-col gap-1.5 rounded-t-lg rounded-tl-none rounded-b-lg`}>
                                        {hasHTML ? (
                                            <span className='text-base leading-[1]' dangerouslySetInnerHTML={{ __html: v?.note }} />
                                        ) : (
                                            <span className='text-base leading-[1]'>{v?.note}</span>
                                        )}
                                        <span className='text-xs text-end'>{moment(v?.created_at).format('MMMM Do YYYY, h:mm a')}</span>
                                    </p>
                                    {isValue === "edit" && (
                                        <DeleteIcon className='text-red-700 w-auto h-4 cursor-pointer' onClick={() => handleDeleteChat(v?.id)} />
                                    )}
                                </div>
                            );
                        }) : null}
                    </div>
                </div>}

            {/* chat send */}
            {handleSection && isValue === "edit" &&
                <div className='w-full h-full min-h-16 max-h-full bg-slate-200 flex items-center'>
                    <div className='p-4 w-full flex items-center gap-4'>
                        <div className='bg-white rounded-full w-full'>
                            <TextField
                                name='chat'
                                placeholder='Type a message...'
                                className='w-full rounded-full py-2 px-4 border border-solid border-slate-600'
                                value={sendedChat?.value ? sendedChat?.value : ""}
                                handelState={(e: any) => { handleChange(e.target.name, e.target.value); setHandleSection(true) }}
                                onKeyDown={(event: any) => {
                                    if (event.key == "Enter") {
                                        onSendChat();
                                    }
                                }}
                            />
                        </div>
                        <SendIcon className='cursor-pointer' onClick={() => onSendChat()} />
                    </div>
                </div>
            }

            <Dialog
                open={confirmStatus}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent className='w-80 h-40 p-4'>
                    <div className='bg-white flex flex-col justify-between h-full'>
                        <p className='flex flex-col items-center justify-center'>
                            <span>Do you want to delete this note?</span>
                        </p>
                        <div className='flex items-center gap-4'>
                            <PinkPawsbutton name='Confirm' pinkPawsButtonExtraCls='w-full' handleClick={() => deleteChat()} />
                            <PinkPawsbutton variant='outlined' name='Cancel' pinkPawsButtonExtraCls='w-full' handleClick={() => onCloseDilog()} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default OrdersNote