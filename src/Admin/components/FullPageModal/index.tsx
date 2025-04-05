import { Box, Modal, Typography } from '@mui/material'
import React, { Children, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';

const FullpageModal = ({ modalStat, handleClose, children, heading, className }: Props) => {

    // const [open, setOpen] = useState(false)

    // const handleClose = () => {
    //     setOpen(false)
    // }

    // useEffect(() => {
    //     setOpen(modalStat)
    // }, [modalStat])
    // console.log("ekat hr exel er shortcut keycode janena take ekta content writer exel sekhache")
    return (
        <div className='!bg-black'>
            <Modal
                keepMounted
                open={modalStat}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"

                className={`lg:w-[85%] lg:h-[90%] w-full h-full m-auto overflow-y-auto  rounded ${className}`}
            >
                <div className='w-full min-h-full bg-white flex flex-col relative'>
                    <div className='sticky top-0 z-50'>
                        <div className='flex items-center justify-between px-4 py-2 text-black bg-white shadow-md'>
                            <p className='text-xl font-medium'>{heading}</p>
                            <div className='cursor-pointer' onClick={() => handleClose && handleClose()}><CloseIcon /></div>
                        </div>
                        <hr />
                    </div>
                    <div>{children}</div>
                </div>
            </Modal>
        </div>
    )
}

interface Props {
    modalStat: boolean;
    className?: string;
    handleClose?: CallableFunction;
    children?: any;
    heading?: string;
}

export default FullpageModal